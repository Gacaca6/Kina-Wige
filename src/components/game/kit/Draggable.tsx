// Something a child picks up and puts somewhere — the soap, a puzzle piece, a
// shape. Lives inside a <Stage>.
//
// Built for small, imprecise fingers on cheap phones:
//   • one finger only; a second touch is ignored, never a tug-of-war
//   • the item is grabbed where the finger lands — it does not jump to centre
//   • it follows the finger through motion values: no React render per move
//   • on release the GAME decides: snap here (a point) or go home (null).
//     Going home is a soft spring, never a buzz — "failure teaches" (standard §3)
//   • pointer capture, so a finger that slides off the item keeps dragging it

import { animate, useMotionValue } from 'motion/react';
import { useEffect, useRef } from 'react';
import type { ReactNode, PointerEvent as ReactPointerEvent } from 'react';
import { useStage } from './Stage';
import type { Pt } from './Stage';

const HOME_SPRING = { type: 'spring' as const, stiffness: 260, damping: 22, mass: 0.8 };
const SNAP_SPRING = { type: 'spring' as const, stiffness: 520, damping: 30, mass: 0.6 };

export interface DraggableProps {
  /** Where the item rests, in stage units (its centre). */
  home: Pt;
  /** Draw the item centred on 0,0. */
  children: ReactNode;
  /** Called as the item moves, with its current centre. */
  onMove?: (at: Pt) => void;
  onPickUp?: () => void;
  /**
   * Called on release with the item's centre. Return a point to snap to, or
   * null to send it home.
   */
  onDrop: (at: Pt) => Pt | null;
  /** Fires after a snap has settled. */
  onSnapped?: (at: Pt) => void;
  disabled?: boolean;
  /** Scale while resting (tray) and while held. */
  restScale?: number;
  liftScale?: number;
  /** Extra invisible grab margin in stage units, for small items. */
  grabRadius?: number;
  /** For tools (soap, towel): ms after snapping before it returns home. */
  returnAfterSnap?: number;
  label?: string;
}

export default function Draggable({
  home,
  children,
  onMove,
  onPickUp,
  onDrop,
  onSnapped,
  disabled = false,
  restScale = 1,
  liftScale = 1.08,
  grabRadius = 0,
  returnAfterSnap,
  label,
}: DraggableProps) {
  const stage = useStage();
  const x = useMotionValue(home.x);
  const y = useMotionValue(home.y);
  const scale = useMotionValue(restScale);
  const grab = useRef<{ id: number; dx: number; dy: number } | null>(null);
  const placed = useRef(false);

  // A new home (a reshuffled tray, a new round) moves the item there.
  useEffect(() => {
    if (grab.current || placed.current) return;
    animate(x, home.x, HOME_SPRING);
    animate(y, home.y, HOME_SPRING);
    animate(scale, restScale, HOME_SPRING);
  }, [home.x, home.y, restScale, x, y, scale]);

  const down = (e: ReactPointerEvent<SVGGElement>) => {
    if (disabled || grab.current || placed.current) return;
    e.stopPropagation();
    const p = stage.toLocal(e.clientX, e.clientY);
    grab.current = { id: e.pointerId, dx: x.get() - p.x, dy: y.get() - p.y };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* old WebViews may refuse; dragging still works while over the item */
    }
    animate(scale, liftScale, SNAP_SPRING);
    onPickUp?.();
  };

  const move = (e: ReactPointerEvent<SVGGElement>) => {
    const g = grab.current;
    if (!g || g.id !== e.pointerId) return;
    const p = stage.toLocal(e.clientX, e.clientY);
    const at = { x: p.x + g.dx, y: p.y + g.dy };
    x.set(at.x);
    y.set(at.y);
    onMove?.(at);
  };

  const up = (e: ReactPointerEvent<SVGGElement>) => {
    const g = grab.current;
    if (!g || g.id !== e.pointerId) return;
    grab.current = null;
    const target = onDrop({ x: x.get(), y: y.get() });
    if (target) {
      placed.current = true;
      animate(scale, 1, SNAP_SPRING);
      animate(x, target.x, SNAP_SPRING);
      animate(y, target.y, {
        ...SNAP_SPRING,
        onComplete: () => {
          onSnapped?.(target);
          if (returnAfterSnap) {
            // A tool, not a piece: it did its job and goes back on its hook.
            window.setTimeout(() => {
              animate(x, home.x, HOME_SPRING);
              animate(y, home.y, HOME_SPRING);
              animate(scale, restScale, { ...HOME_SPRING, onComplete: () => { placed.current = false; } });
            }, returnAfterSnap);
          }
        },
      });
    } else {
      animate(x, home.x, HOME_SPRING);
      animate(y, home.y, HOME_SPRING);
      animate(scale, restScale, HOME_SPRING);
    }
  };

  // Position and size go on the transform ATTRIBUTE, scaled about 0,0 — the
  // item's centre. Motion's own SVG scale pivots on the bounding box, and a
  // jigsaw piece's box is the whole picture behind its clip, so tray pieces
  // drew far from where the game thought they were (seen on Android 12).
  const ref = useRef<SVGGElement>(null);
  useEffect(() => {
    const set = () => ref.current?.setAttribute('transform', `translate(${x.get()} ${y.get()}) scale(${scale.get()})`);
    set();
    const off = [x.on('change', set), y.on('change', set), scale.on('change', set)];
    return () => off.forEach((f) => f());
  }, [x, y, scale]);

  return (
    <g
      ref={ref}
      style={{ cursor: disabled ? 'default' : 'grab' }}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      role={label ? 'button' : undefined}
      aria-label={label}
    >
      {grabRadius > 0 && <circle r={grabRadius} fill="transparent" />}
      {children}
    </g>
  );
}

/** Snap check shared by every game: is `at` within `radius` of `target`? */
export function within(at: Pt, target: Pt, radius: number): boolean {
  return Math.hypot(at.x - target.x, at.y - target.y) <= radius;
}

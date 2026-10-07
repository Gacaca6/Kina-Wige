// The stage every game is drawn on.
//
// One fixed coordinate system per game (its viewBox), scaled to fit whatever
// phone it lands on. A game is written once in stage units — "the soap sits at
// 300, 410" — and looks the same on a small Android and a tablet. The stage is
// letterboxed, never stretched, so a circle stays a circle.
//
// Touch arrives in screen pixels; `toLocal` turns it into stage units, and
// `pxPerUnit` lets a game express finger-sized distances (snap radius, path
// tolerance) in real pixels, which is what the research measures.

import { createContext, useCallback, useContext, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';

export interface Pt {
  x: number;
  y: number;
}

interface StageApi {
  /** Screen pixels → stage units. */
  toLocal: (clientX: number, clientY: number) => Pt;
  /** How many screen pixels one stage unit is right now. */
  pxPerUnit: () => number;
}

const StageContext = createContext<StageApi | null>(null);

export function useStage(): StageApi {
  const api = useContext(StageContext);
  if (!api) throw new Error('useStage() outside <Stage>');
  return api;
}

export interface StageProps {
  width: number;
  height: number;
  children: ReactNode;
  /** Drawn behind everything, edge to edge of the stage. */
  background?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Labels the whole play area for screen readers. */
  label?: string;
}

export default function Stage({ width, height, children, background, className, style, label }: StageProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const toLocal = useCallback((clientX: number, clientY: number): Pt => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return { x: 0, y: 0 };
    const p = svg.createSVGPoint();
    p.x = clientX;
    p.y = clientY;
    const q = p.matrixTransform(ctm.inverse());
    return { x: q.x, y: q.y };
  }, []);

  const pxPerUnit = useCallback(() => svgRef.current?.getScreenCTM()?.a ?? 1, []);

  return (
    <StageContext.Provider value={{ toLocal, pxPerUnit }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className={className}
        role="img"
        aria-label={label}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
          overflow: 'visible',
          ...style,
        }}
      >
        {background}
        {children}
      </svg>
    </StageContext.Provider>
  );
}

/** Distance between two points, in whatever units they share. */
export function dist(a: Pt, b: Pt): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

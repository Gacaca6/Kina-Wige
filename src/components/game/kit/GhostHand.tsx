// The ghost hand — how a game "talks" to a child who cannot read.
//
// Standard rule 1: shows, never tells. When a child has made no progress for a
// few seconds, a soft white hand appears and performs the exact gesture the
// game wants: a tap, a drag from here to there, a rub, a press-and-hold, or a
// trace along a line. It loops until the child acts, then fades away.
//
// Only transform and opacity animate (standard rule 8).

import { motion } from 'motion/react';
import type { Pt } from './Stage';

export type GhostGesture =
  | { kind: 'tap'; at: Pt }
  | { kind: 'hold'; at: Pt }
  | { kind: 'drag'; from: Pt; to: Pt }
  | { kind: 'rub'; at: Pt; size?: number }
  | { kind: 'path'; points: Pt[] };

/** A child's pointing hand, fingertip at 0,0. Sized for a ~600-unit stage. */
export function HandShape({ scale = 1 }: { scale?: number }) {
  return (
    <g transform={`scale(${scale}) rotate(-14)`}>
      {/* a soft halo so the hand reads on any background */}
      <circle cx={0} cy={0} r={16} fill="#FFFFFF" opacity={0.45} />
      <path
        d="M -10 12 A 10 10 0 0 1 10 12 V 44 c 0 -8 20 -8 20 0 c 0 -7 18 -7 18 1 c 0 -6 14 -5 14 3 V 78 c 0 18 -14 30 -32 30 H 8 c -14 0 -22 -8 -28 -18 L -36 64 c -4 -8 4 -16 12 -10 L -10 62 Z"
        fill="#FFFFFF"
        stroke="#10241B"
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <path d="M -5 9 q 5 -4 10 0 M 12 58 h 14 M 32 58 h 12 M 52 60 h 8" fill="none" stroke="#10241B" strokeWidth={3} strokeLinecap="round" opacity={0.5} />
    </g>
  );
}

const LOOP = { repeat: Infinity, repeatDelay: 0.5, ease: 'easeInOut' as const };

export default function GhostHand({ gesture, scale = 1 }: { gesture: GhostGesture | null; scale?: number }) {
  if (!gesture) return null;

  let animateTo: Record<string, number[]>;
  let duration: number;

  switch (gesture.kind) {
    case 'tap': {
      const { x, y } = gesture.at;
      animateTo = { x: [x + 30, x, x, x + 30], y: [y + 40, y, y, y + 40], scale: [1, 1, 0.85, 1] };
      duration = 1.4;
      break;
    }
    case 'hold': {
      const { x, y } = gesture.at;
      animateTo = { x: [x + 30, x, x, x, x + 30], y: [y + 40, y, y, y, y + 40], scale: [1, 0.85, 0.85, 0.85, 1] };
      duration = 2.4;
      break;
    }
    case 'drag': {
      const { from, to } = gesture;
      animateTo = {
        x: [from.x, from.x, to.x, to.x],
        y: [from.y, from.y, to.y, to.y],
        scale: [1, 0.88, 0.88, 1],
      };
      duration = 2.2;
      break;
    }
    case 'rub': {
      const { x, y } = gesture.at;
      const s = gesture.size ?? 40;
      animateTo = {
        x: [x, x + s, x - s, x + s, x - s, x],
        y: [y, y - s / 3, y + s / 3, y - s / 3, y + s / 3, y],
        scale: [0.9, 0.9, 0.9, 0.9, 0.9, 0.9],
      };
      duration = 2.2;
      break;
    }
    case 'path': {
      const pts = gesture.points;
      animateTo = {
        x: pts.map((p) => p.x),
        y: pts.map((p) => p.y),
        scale: pts.map(() => 0.9),
      };
      duration = Math.max(1.6, pts.length * 0.12);
      break;
    }
  }

  return (
    <motion.g
      key={JSON.stringify(gesture)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.92 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ pointerEvents: 'none' }}
      aria-hidden
    >
      <motion.g
        initial={{ x: animateTo.x[0], y: animateTo.y[0] }}
        animate={animateTo}
        transition={{ duration, ...LOOP }}
      >
        <HandShape scale={scale} />
      </motion.g>
    </motion.g>
  );
}

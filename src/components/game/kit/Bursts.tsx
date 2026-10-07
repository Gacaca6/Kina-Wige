// Feedback tier 1 (standard rule 4): a small burst of sparkles exactly where
// the child did the right thing. Earned only — nothing bursts for idle tapping.

import { motion } from 'motion/react';
import { useCallback, useRef, useState } from 'react';
import type { Pt } from './Stage';

interface Burst extends Pt {
  id: number;
  colors: string[];
  size: number;
}

const DEFAULT_COLORS = ['#FFC02E', '#2FBF6B', '#35A7E8', '#FF6B4A', '#9B6BFF'];

export function useBursts() {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const next = useRef(1);

  const burst = useCallback((at: Pt, opts: { colors?: string[]; size?: number } = {}) => {
    const id = next.current++;
    setBursts((b) => [...b, { ...at, id, colors: opts.colors ?? DEFAULT_COLORS, size: opts.size ?? 1 }]);
    window.setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 900);
  }, []);

  return { bursts, burst };
}

const RAYS = 9;

function Star({ r }: { r: number }) {
  const p: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.45;
    p.push(`${(Math.cos(a) * rr).toFixed(1)},${(Math.sin(a) * rr).toFixed(1)}`);
  }
  return <polygon points={p.join(' ')} />;
}

export function Bursts({ bursts }: { bursts: Burst[] }) {
  return (
    <g style={{ pointerEvents: 'none' }} aria-hidden>
      {bursts.map((b) => (
        <g key={b.id} transform={`translate(${b.x} ${b.y})`}>
          <motion.circle
            r={30 * b.size}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={5}
            initial={{ scale: 0.2, opacity: 0.9 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          />
          {Array.from({ length: RAYS }, (_, i) => {
            const a = (Math.PI * 2 * i) / RAYS + (b.id % 7) * 0.2;
            const d = (46 + (i % 3) * 14) * b.size;
            return (
              <motion.g
                key={i}
                fill={b.colors[i % b.colors.length]}
                stroke="#10241B"
                strokeWidth={2}
                initial={{ x: 0, y: 0, scale: 0.4, opacity: 1, rotate: 0 }}
                animate={{ x: Math.cos(a) * d, y: Math.sin(a) * d, scale: 1, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.75, ease: 'easeOut' }}
              >
                {i % 2 === 0 ? <Star r={9 * b.size} /> : <circle r={5 * b.size} />}
              </motion.g>
            );
          })}
        </g>
      ))}
    </g>
  );
}

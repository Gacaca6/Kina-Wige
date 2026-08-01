// Kina — the mascot. A book with a pencil friend, straight from the logo.
//
// Flat shapes so she holds 60fps on low-end Androids, but every pose is driven
// by a SPRING (see src/motion/springs.ts), never a CSS tween:
//   • squash & stretch is derived from the body spring's VELOCITY, so she
//     deforms because she is moving
//   • the pencil is a floaty spring, so it lags and settles after she does
//   • idle breathing chases a drifting random target — no two cycles match

import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import {
  useSpring,
  useTransform,
  useVelocity,
  useReducedMotion,
  motion,
} from 'motion/react';
import { tune, amp } from '../../motion/springs';

export type KinaMood = 'idle' | 'cheer' | 'oops' | 'sleep' | 'point';

export interface KinaProps {
  mood?: KinaMood;
  /** Normalised -1..1; pupils spring toward it so the gaze arrives. */
  lookAt?: { x: number; y: number } | null;
  calm?: boolean;
  className?: string;
  style?: CSSProperties;
}

interface Pose {
  y: number;
  rot: number;
  pencil: number;
  eyeOpen: number;
  mouth: 'smile' | 'open' | 'flat';
}

const POSES: Record<KinaMood, Pose> = {
  idle: { y: 0, rot: 0, pencil: -8, eyeOpen: 1, mouth: 'smile' },
  cheer: { y: -22, rot: 0, pencil: 16, eyeOpen: 1, mouth: 'open' },
  oops: { y: 2, rot: -9, pencil: -18, eyeOpen: 1, mouth: 'flat' },
  sleep: { y: 4, rot: 6, pencil: -3, eyeOpen: 0, mouth: 'flat' },
  point: { y: -4, rot: 4, pencil: 10, eyeOpen: 1, mouth: 'smile' },
};

const origin = (x: number, y: number): CSSProperties => ({
  transformOrigin: `${x}px ${y}px`,
  transformBox: 'view-box',
});

export default function Kina({
  mood = 'idle',
  lookAt = null,
  calm = false,
  className,
  style,
}: KinaProps) {
  const reduced = useReducedMotion() ?? false;
  const a = amp({ calm, reduced });
  const pose = POSES[mood];

  const y = useSpring(0, tune('bouncy', { calm, reduced }));
  const rot = useSpring(0, tune('snappy', { calm, reduced }));
  const pencil = useSpring(-8, tune('floaty', { calm, reduced }));
  const lid = useSpring(0, tune('snappy', { calm, reduced }));
  const pupilX = useSpring(0, tune('soft', { calm, reduced }));
  const pupilY = useSpring(0, tune('soft', { calm, reduced }));

  // Velocity-derived squash & stretch — the whole trick.
  const vel = useVelocity(y);
  const scaleY = useTransform(vel, [-1300, 0, 1300], [0.88, 1, 1.14], { clamp: true });
  const scaleX = useTransform(scaleY, (v: number) => 2 - v); // conserve volume

  const rotDeg = useTransform(rot, (v: number) => `${v}deg`);
  const pencilDeg = useTransform(pencil, (v: number) => `${v}deg`);

  useEffect(() => {
    y.set(pose.y * a);
    rot.set(pose.rot * a);
    pencil.set(pose.pencil * a);
    lid.set(pose.eyeOpen === 0 ? 1 : 0);
  }, [pose, a, y, rot, pencil, lid]);

  useEffect(() => {
    pupilX.set((lookAt ? Math.max(-1, Math.min(1, lookAt.x)) : 0) * 3 * a);
    pupilY.set((lookAt ? Math.max(-1, Math.min(1, lookAt.y)) : 0) * 2.2 * a);
  }, [lookAt, pupilX, pupilY, a]);

  // Idle that never repeats exactly.
  const timers = useRef<number[]>([]);
  useEffect(() => {
    if (reduced || mood !== 'idle') return;
    let alive = true;
    const drift = () => {
      if (!alive) return;
      y.set(POSES.idle.y * a + (Math.random() > 0.5 ? -1 : 1) * (2 + Math.random() * 2) * a);
      rot.set((Math.random() - 0.5) * 3 * a);
      timers.current.push(window.setTimeout(drift, 1300 + Math.random() * 1400));
    };
    timers.current.push(window.setTimeout(drift, 700));
    return () => {
      alive = false;
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
    };
  }, [mood, reduced, a, y, rot]);

  // Blink at irregular intervals.
  useEffect(() => {
    if (reduced || mood === 'sleep') return;
    let alive = true;
    const ids: number[] = [];
    const blink = () => {
      if (!alive) return;
      lid.set(1);
      ids.push(window.setTimeout(() => alive && lid.set(0), 110));
      ids.push(window.setTimeout(blink, 2400 + Math.random() * 4000));
    };
    ids.push(window.setTimeout(blink, 1500 + Math.random() * 2200));
    return () => {
      alive = false;
      ids.forEach(window.clearTimeout);
    };
  }, [mood, reduced, lid]);

  const mouthPath =
    pose.mouth === 'open'
      ? 'M42 74 q18 22 36 0 q-18 8 -36 0'
      : pose.mouth === 'flat'
        ? 'M46 76 h28'
        : 'M44 74 q16 14 32 0';

  return (
    <svg
      viewBox="0 0 120 116"
      className={className}
      style={{ display: 'block', overflow: 'visible', ...style }}
      role="img"
      aria-label="Kina"
    >
      <motion.g style={{ y, rotate: rotDeg, scaleX, scaleY, ...origin(60, 104) }}>
        {/* pencil friend — floaty, arrives after she does */}
        <motion.g style={{ rotate: pencilDeg, ...origin(60, 26) }}>
          <rect x={32} y={6} width={56} height={15} rx={4} fill="#2C3A5C" stroke="#10241B" strokeWidth={4} />
          <path d="M88 6 l12 7.5 -12 7.5 z" fill="#FFC02E" stroke="#10241B" strokeWidth={4} strokeLinejoin="round" />
        </motion.g>

        {/* the book */}
        <g>
          <rect x={12} y={24} width={96} height={80} rx={20} fill="#35A7E8" stroke="#10241B" strokeWidth={6} />
          <rect x={54} y={24} width={12} height={80} fill="#2FBF6B" />
          <path d="M66 27 h33 a17 17 0 0 1 6 3 v71 a17 17 0 0 1 -6 3 h-33 z" fill="#FFC02E" />
          <rect x={12} y={24} width={96} height={80} rx={20} fill="none" stroke="#10241B" strokeWidth={6} />
        </g>

        {/* eyes */}
        <g>
          <circle cx={40} cy={56} r={12} fill="#FFFFFF" stroke="#10241B" strokeWidth={5} />
          <circle cx={80} cy={56} r={12} fill="#FFFFFF" stroke="#10241B" strokeWidth={5} />
          <motion.g style={{ x: pupilX, y: pupilY }}>
            <circle cx={40} cy={57} r={5} fill="#10241B" />
            <circle cx={80} cy={57} r={5} fill="#10241B" />
          </motion.g>
          <motion.rect x={28} y={44} width={24} height={24} fill="#35A7E8" style={{ scaleY: lid, ...origin(40, 44) }} />
          <motion.rect x={68} y={44} width={24} height={24} fill="#FFC02E" style={{ scaleY: lid, ...origin(80, 44) }} />
          {/* redraw rims so the lid reads as a closing eye, not a block */}
          <circle cx={40} cy={56} r={12} fill="none" stroke="#10241B" strokeWidth={5} />
          <circle cx={80} cy={56} r={12} fill="none" stroke="#10241B" strokeWidth={5} />
        </g>

        <path
          d={mouthPath}
          fill={pose.mouth === 'open' ? '#E8607A' : 'none'}
          stroke="#10241B"
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.g>
    </svg>
  );
}

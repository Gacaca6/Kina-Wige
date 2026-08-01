// Ngabo — the golden monkey who guides the app.
//
// Every part of this rig is driven by a SPRING, never a CSS transition and
// never a looping keyframe. Three things make him read as alive:
//
//   1. Velocity-driven squash & stretch — he deforms BECAUSE he is moving.
//      scaleY comes from the body spring's own velocity, not from a keyframe.
//   2. Follow-through via a spring chain — head is snappy, body is soft, crest
//      and tail are floaty, so they arrive late on their own. No hand-authored
//      delays anywhere.
//   3. An idle that never repeats — breathing chases a drifting random target,
//      so no two cycles are identical. Identical cycles are what make a
//      character read as a GIF.

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

export type NgaboMood =
  | 'idle'
  | 'wave'
  | 'point'
  | 'think'
  | 'encourage'
  | 'celebrate'
  | 'amazed'
  | 'doze';

export interface NgaboProps {
  mood?: NgaboMood;
  /** Where he should look, normalised -1..1. Null = straight ahead. */
  lookAt?: { x: number; y: number } | null;
  /** Parent "calm mode" — damped and halved, never switched off. */
  calm?: boolean;
  className?: string;
  style?: CSSProperties;
}

interface Pose {
  headRot: number;
  bodyY: number;
  armL: number;
  armR: number;
  crest: number;
  brow: number;
  eye: number;
  lid: number;
  mouth: string;
  mouthFill: string;
}

const MOUTH_SMILE = 'M84 100 Q100 112 116 100';
const MOUTH_SOFT = 'M84 102 Q100 110 116 102';
const MOUTH_OPEN = 'M80 98 Q100 124 120 98 Q100 106 80 98';
const MOUTH_O = 'M92 100 a8 9 0 1 0 16 0 a8 9 0 1 0 -16 0';
const MOUTH_DOZE = 'M90 102 Q100 106 110 102';

const POSES: Record<NgaboMood, Pose> = {
  idle: { headRot: 0, bodyY: 0, armL: 0, armR: 0, crest: 0, brow: 0, eye: 1, lid: 0, mouth: MOUTH_SMILE, mouthFill: 'none' },
  wave: { headRot: -7, bodyY: -2, armL: 0, armR: -38, crest: -8, brow: -2, eye: 1, lid: 0, mouth: MOUTH_SMILE, mouthFill: 'none' },
  point: { headRot: 6, bodyY: 0, armL: 0, armR: -56, crest: 4, brow: -4, eye: 1.05, lid: 0, mouth: MOUTH_SMILE, mouthFill: 'none' },
  think: { headRot: -11, bodyY: 1, armL: 0, armR: -72, crest: -6, brow: -5, eye: 0.95, lid: 0, mouth: MOUTH_SOFT, mouthFill: 'none' },
  encourage: { headRot: 4, bodyY: -1, armL: 24, armR: -24, crest: 2, brow: -1, eye: 1, lid: 0, mouth: MOUTH_SOFT, mouthFill: 'none' },
  celebrate: { headRot: 0, bodyY: -26, armL: 52, armR: -52, crest: 12, brow: -5, eye: 1.1, lid: 0, mouth: MOUTH_OPEN, mouthFill: '#8C3B1E' },
  amazed: { headRot: 0, bodyY: 4, armL: -8, armR: 8, crest: 6, brow: -7, eye: 1.35, lid: 0, mouth: MOUTH_O, mouthFill: '#8C3B1E' },
  doze: { headRot: 9, bodyY: 3, armL: 0, armR: 0, crest: -4, brow: 1, eye: 1, lid: 1, mouth: MOUTH_DOZE, mouthFill: 'none' },
};

/** SVG transform-origin in user units. view-box keeps these in viewBox space. */
const origin = (x: number, y: number): CSSProperties => ({
  transformOrigin: `${x}px ${y}px`,
  transformBox: 'view-box',
});

export default function Ngabo({
  mood = 'idle',
  lookAt = null,
  calm = false,
  className,
  style,
}: NgaboProps) {
  const reduced = useReducedMotion() ?? false;
  const a = amp({ calm, reduced });
  const pose = POSES[mood];

  // ── The spring chain. Stiffness falls as we move away from the root, so
  //    follow-through emerges from the simulation instead of from delays.
  const headRot = useSpring(0, tune('snappy', { calm, reduced }));
  const bodyY = useSpring(0, tune('bouncy', { calm, reduced }));
  const armL = useSpring(0, tune('soft', { calm, reduced }));
  const armR = useSpring(0, tune('soft', { calm, reduced }));
  const crest = useSpring(0, tune('floaty', { calm, reduced }));
  const tail = useSpring(0, tune('floaty', { calm, reduced }));
  const brow = useSpring(0, tune('snappy', { calm, reduced }));
  const eye = useSpring(1, tune('snappy', { calm, reduced }));
  const lid = useSpring(0, tune('snappy', { calm, reduced }));
  const pupilX = useSpring(0, tune('soft', { calm, reduced }));
  const pupilY = useSpring(0, tune('soft', { calm, reduced }));

  // ── Velocity-driven squash & stretch. This is the whole trick: scale is a
  //    CONSEQUENCE of movement, so fast moves deform and slow moves do not.
  const bodyVel = useVelocity(bodyY);
  const scaleY = useTransform(bodyVel, [-1400, 0, 1400], [0.86, 1, 1.16], { clamp: true });
  // Conserve volume — what squashes vertically must widen horizontally.
  const scaleX = useTransform(scaleY, (v: number) => 2 - v);

  // Head leads, body follows: counter-lean read from the head's own velocity.
  const headVel = useVelocity(headRot);
  const bodyLean = useTransform(headVel, [-600, 0, 600], [2.5, 0, -2.5], { clamp: true });

  // Hoisted transforms (hooks must never be called inside JSX).
  const headDeg = useTransform<number, string>(
    [headRot, bodyLean],
    ([h, l]: number[]) => `${h + l}deg`
  );
  const armLDeg = useTransform(armL, (v: number) => `${v}deg`);
  const armRDeg = useTransform(armR, (v: number) => `${v}deg`);
  const crestDeg = useTransform(crest, (v: number) => `${v}deg`);
  const tailDeg = useTransform(tail, (v: number) => `${v}deg`);

  // ── Pupils track the pointer through a spring, so the gaze ARRIVES.
  useEffect(() => {
    const x = lookAt ? Math.max(-1, Math.min(1, lookAt.x)) : 0;
    const y = lookAt ? Math.max(-1, Math.min(1, lookAt.y)) : 0;
    pupilX.set(x * 3.4 * a);
    pupilY.set(y * 2.6 * a);
  }, [lookAt, pupilX, pupilY, a]);

  // ── Apply the pose. Springs retarget from their current velocity, so this is
  //    interruptible at any moment — tap mid-celebration and he responds now.
  useEffect(() => {
    headRot.set(pose.headRot * a);
    bodyY.set(pose.bodyY * a);
    armL.set(pose.armL * a);
    armR.set(pose.armR * a);
    crest.set(pose.crest * a);
    tail.set(pose.crest * 0.6 * a);
    brow.set(pose.brow * a);
    eye.set(1 + (pose.eye - 1) * a);
    lid.set(pose.lid);
  }, [pose, a, headRot, bodyY, armL, armR, crest, tail, brow, eye, lid]);

  // ── Idle that never repeats exactly: a slow drifting target, not a loop.
  const timers = useRef<number[]>([]);
  useEffect(() => {
    if (reduced) return;
    let alive = true;
    const drift = () => {
      if (!alive) return;
      if (mood === 'idle' || mood === 'doze') {
        const breath = (Math.random() > 0.5 ? -1 : 1) * (1.4 + Math.random() * 1.2);
        bodyY.set(POSES[mood].bodyY * a + breath * a);
        headRot.set(POSES[mood].headRot * a + (Math.random() - 0.5) * 2.4 * a);
      }
      timers.current.push(window.setTimeout(drift, 1400 + Math.random() * 1500));
    };
    timers.current.push(window.setTimeout(drift, 800));
    return () => {
      alive = false;
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
    };
  }, [mood, reduced, a, bodyY, headRot]);

  // ── Blink: a real spring snap at irregular intervals.
  useEffect(() => {
    if (reduced || mood === 'doze') return;
    let alive = true;
    const ids: number[] = [];
    const blink = () => {
      if (!alive) return;
      lid.set(1);
      ids.push(window.setTimeout(() => alive && lid.set(0), 110));
      ids.push(window.setTimeout(blink, 2600 + Math.random() * 4200));
    };
    ids.push(window.setTimeout(blink, 1600 + Math.random() * 2200));
    return () => {
      alive = false;
      ids.forEach(window.clearTimeout);
    };
  }, [mood, reduced, lid]);

  return (
    <svg
      viewBox="0 0 200 210"
      className={className}
      style={{ display: 'block', overflow: 'visible', ...style }}
      role="img"
      aria-label="Ngabo"
    >
      {/* tail — floaty, arrives last */}
      <motion.path
        d="M62 158 Q26 156 24 128 Q23 110 40 108"
        stroke="#1B4D1F"
        strokeWidth={9}
        fill="none"
        strokeLinecap="round"
        style={{ rotate: tailDeg, ...origin(62, 158) }}
      />

      {/* body — carries the velocity-derived squash & stretch */}
      <motion.g style={{ y: bodyY, scaleX, scaleY, ...origin(100, 190) }}>
        <ellipse cx={100} cy={148} rx={44} ry={42} fill="#E08A2B" />
        <ellipse cx={100} cy={152} rx={27} ry={26} fill="#F6C67A" />
        <ellipse cx={70} cy={186} rx={15} ry={10} fill="#C9741F" />
        <ellipse cx={130} cy={186} rx={15} ry={10} fill="#C9741F" />
      </motion.g>

      {/* arms */}
      <motion.g style={{ y: bodyY, rotate: armLDeg, ...origin(62, 136) }}>
        <path d="M62 136 Q40 150 34 168" stroke="#E08A2B" strokeWidth={17} fill="none" strokeLinecap="round" />
        <circle cx={32} cy={172} r={11} fill="#F6C67A" />
      </motion.g>
      <motion.g style={{ y: bodyY, rotate: armRDeg, ...origin(138, 136) }}>
        <path d="M138 136 Q160 150 166 168" stroke="#E08A2B" strokeWidth={17} fill="none" strokeLinecap="round" />
        <circle cx={168} cy={172} r={11} fill="#F6C67A" />
      </motion.g>

      {/* head — leads the chain, leans from its own velocity */}
      <motion.g style={{ y: bodyY, rotate: headDeg, ...origin(100, 112) }}>
        <ellipse cx={52} cy={76} rx={15} ry={17} fill="#E08A2B" />
        <ellipse cx={52} cy={76} rx={8} ry={9} fill="#F6C67A" />
        <ellipse cx={148} cy={76} rx={15} ry={17} fill="#E08A2B" />
        <ellipse cx={148} cy={76} rx={8} ry={9} fill="#F6C67A" />

        {/* crest — the silhouette hook, and the last thing to settle */}
        <motion.path
          d="M84 30 Q92 4 100 26 Q110 2 116 30 Z"
          fill="#FFD54F"
          style={{ rotate: crestDeg, ...origin(100, 30) }}
        />

        <ellipse cx={100} cy={76} rx={52} ry={48} fill="#E08A2B" />
        <ellipse cx={100} cy={86} rx={36} ry={33} fill="#F6C67A" />

        <motion.path d="M64 54 Q76 46 88 52" stroke="#1B4D1F" strokeWidth={5} fill="none" strokeLinecap="round" style={{ y: brow }} />
        <motion.path d="M112 52 Q124 46 136 54" stroke="#1B4D1F" strokeWidth={5} fill="none" strokeLinecap="round" style={{ y: brow }} />

        <motion.g style={{ scale: eye, ...origin(100, 72) }}>
          <ellipse cx={80} cy={72} rx={13} ry={14} fill="#FFFFFF" />
          <ellipse cx={120} cy={72} rx={13} ry={14} fill="#FFFFFF" />
          <motion.g style={{ x: pupilX, y: pupilY }}>
            <circle cx={80} cy={73} r={6.4} fill="#1B4D1F" />
            <circle cx={120} cy={73} r={6.4} fill="#1B4D1F" />
            <circle cx={82.4} cy={70.6} r={2.2} fill="#FFFFFF" />
            <circle cx={122.4} cy={70.6} r={2.2} fill="#FFFFFF" />
          </motion.g>
          <motion.ellipse cx={80} cy={72} rx={13.6} ry={14.6} fill="#E08A2B" style={{ scaleY: lid, ...origin(80, 58) }} />
          <motion.ellipse cx={120} cy={72} rx={13.6} ry={14.6} fill="#E08A2B" style={{ scaleY: lid, ...origin(120, 58) }} />
        </motion.g>

        <path
          d={pose.mouth}
          stroke="#1B4D1F"
          strokeWidth={4.5}
          fill={pose.mouthFill}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.g>
    </svg>
  );
}

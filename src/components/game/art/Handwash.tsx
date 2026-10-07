// Art for Karaba Amaboko — a kandagira ukarabe, the foot-pedal handwashing
// station found outside homes, schools and health centres across Rwanda.
// Stage: 400 × 600. The child sees their own hands from above (first person),
// sleeves running off the bottom of the screen.

import { motion, useTransform } from 'motion/react';
import type { MotionValue } from 'motion/react';
import { INK } from './Friends';
import { useSvgTransform } from '../kit/hooks';

const line = { stroke: INK, strokeWidth: 4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

// ── Geometry shared with the game ───────────────────────────────────────────

export const WASH = {
  width: 400,
  height: 600,
  pivot: { x: 200, y: 104 },
  /** Where the spout ends up at full tilt — the top of the water stream. */
  spoutAtTilt: { x: 214, y: 218 },
  hands: { x: 215, y: 400 },
  /** The area a child rubs (scrub) and dries. */
  rub: { x: 215, y: 395, rx: 112, ry: 92 },
  pedal: { x: 205, y: 548 },
  soapHome: { x: 334, y: 340 },
  towelHome: { x: 70, y: 318 },
  maxTilt: 22,
};

// ── Backdrop ────────────────────────────────────────────────────────────────

export function WashBackdrop() {
  return (
    <g aria-hidden>
      <rect x={0} y={0} width={400} height={600} rx={28} fill="#BFE6F7" />
      <circle cx={344} cy={56} r={26} fill="#FFE07A" />
      <path d="M0 330 q60 -50 130 -24 q60 -50 140 -10 q70 -34 130 6 v130 h-400 z" fill="#8FD6AE" />
      <path d="M0 370 q90 -40 200 -6 q110 -36 200 0 v100 h-400 z" fill="#5CC489" />
      <rect x={0} y={460} width={400} height={140} rx={0} fill="#D9B98A" />
      <path d="M0 460 h400" stroke="#C49B63" strokeWidth={4} />
      {[[40, 500], [120, 540], [330, 510], [370, 570], [70, 580]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={8} ry={4} fill="#C49B63" />
      ))}
      {/* banana plants behind the station — home */}
      <g transform="translate(372 330)">
        <path d="M0 0 v130" stroke="#3E7A3A" strokeWidth={10} />
        <path d="M0 0 q-40 -10 -54 20 q30 -6 54 -20 z M0 0 q34 -24 54 -4 q-30 6 -54 4 z M0 -4 q-6 -36 14 -54 q2 30 -14 54 z" fill="#3E9B43" {...line} strokeWidth={3} />
      </g>
      <g transform="translate(24 350)">
        <path d="M0 0 v110" stroke="#3E7A3A" strokeWidth={9} />
        <path d="M0 0 q40 -14 52 14 q-28 -2 -52 -14 z M0 0 q-30 -20 -46 0 q26 4 46 0 z M0 -4 q4 -30 -12 -46 q-2 26 12 46 z" fill="#3E9B43" {...line} strokeWidth={3} />
      </g>
    </g>
  );
}

// ── The station ─────────────────────────────────────────────────────────────

/** Frame, rope and pedal. `tilt` is 0..1 (pedal up → fully pressed). */
export function StationFrame({ tilt }: { tilt: MotionValue<number> }) {
  const pedalRef = useSvgTransform(tilt, (v) => `rotate(${v * 9} 140 560)`);
  // The cord runs from the pedal's free end up to the can's tipping corner.
  const canCorner = useTransform(tilt, (v) => {
    const a = (v * WASH.maxTilt * Math.PI) / 180;
    const dx = 50;
    const dy = 122;
    return {
      x: WASH.pivot.x + dx * Math.cos(a) - dy * Math.sin(a),
      y: WASH.pivot.y + dx * Math.sin(a) + dy * Math.cos(a),
    };
  });
  const pedalEnd = useTransform(tilt, (v) => {
    const a = (v * 9 * Math.PI) / 180;
    return { x: 140 + 108 * Math.cos(-0.12 + a), y: 560 + 108 * Math.sin(-0.12 + a) };
  });
  const cordX1 = useTransform(canCorner, (p) => p.x);
  const cordY1 = useTransform(canCorner, (p) => p.y);
  const cordX2 = useTransform(pedalEnd, (p) => p.x);
  const cordY2 = useTransform(pedalEnd, (p) => p.y);

  return (
    <g>
      {/* ground shadow */}
      <ellipse cx={200} cy={566} rx={150} ry={12} fill="#C49B63" opacity={0.6} />
      {/* poles and top bar: rough eucalyptus wood */}
      <rect x={76} y={66} width={20} height={500} rx={6} fill="#B07A45" {...line} />
      <rect x={304} y={66} width={20} height={500} rx={6} fill="#B07A45" {...line} />
      <rect x={56} y={64} width={288} height={20} rx={8} fill="#C08A52" {...line} />
      <path d="M84 120 v30 M312 200 v26 M84 420 v20" stroke="#8A5A2E" strokeWidth={3} strokeLinecap="round" />
      {/* hanging rope */}
      <path d="M196 84 v20 M204 84 v20" stroke="#8A6A3A" strokeWidth={4} />
      {/* soap shelf */}
      <rect x={300} y={360} width={74} height={12} rx={4} fill="#C08A52" {...line} />
      {/* towel nail */}
      <circle cx={86} cy={262} r={5} fill="#5A5A5A" {...line} strokeWidth={3} />
      {/* pedal cord */}
      <motion.line x1={cordX1} y1={cordY1} x2={cordX2} y2={cordY2} stroke="#6B5434" strokeWidth={4} strokeLinecap="round" />
      {/* pedal: a stick on a peg — the child presses it with their foot */}
      <g ref={pedalRef}>
        <rect x={132} y={548} width={124} height={18} rx={9} fill="#C08A52" {...line} transform="rotate(-7 140 560)" />
      </g>
      <circle cx={140} cy={562} r={9} fill="#8A5A2E" {...line} strokeWidth={3} />
    </g>
  );
}

/** The yellow jerrycan, tipping on its rope. */
export function Jerrycan({ tilt }: { tilt: MotionValue<number> }) {
  const ref = useSvgTransform(tilt, (v) => `rotate(${v * WASH.maxTilt} ${WASH.pivot.x} ${WASH.pivot.y})`);
  return (
    <g ref={ref}>
      <path d="M180 104 q20 -14 40 0" fill="none" {...line} strokeWidth={6} />
      <rect x={150} y={110} width={100} height={124} rx={18} fill="#F7C51E" {...line} />
      <rect x={162} y={124} width={30} height={96} rx={10} fill="#FFDD5C" />
      <path d="M150 150 h100 M150 196 h100" stroke="#D9A400" strokeWidth={4} />
      {/* the little spout the water comes from */}
      <rect x={246} y={196} width={16} height={14} rx={4} fill="#2E6FD0" {...line} strokeWidth={3} />
      <rect x={150} y={110} width={100} height={124} rx={18} fill="none" {...line} />
    </g>
  );
}

/** The stream from spout to hands. `flow` 0..1. */
export function WaterStream({ flow }: { flow: MotionValue<number> }) {
  const { x, y } = WASH.spoutAtTilt;
  const streamRef = useSvgTransform(flow, (v) => `translate(0 ${y * (1 - v)}) scale(1 ${Math.max(0.001, v)})`);
  const opacity = useTransform(flow, (v) => (v > 0.02 ? 1 : 0));
  return (
    <motion.g style={{ opacity }} aria-hidden>
      <g ref={streamRef}>
        <path d={`M${x - 6} ${y} q-4 60 -2 130 h16 q2 -70 -2 -130 z`} fill="#7CCBF2" stroke="#2E8FD0" strokeWidth={3} />
        <path d={`M${x - 1} ${y + 8} q-2 50 0 110`} stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" opacity={0.8} />
      </g>
      {[0, 1, 2, 3].map((i) => (
        <motion.circle
          key={i}
          cx={x + (i - 1.5) * 4}
          cy={y + 10}
          r={4}
          fill="#7CCBF2"
          animate={{ y: [0, 130] }}
          transition={{ duration: 0.45, repeat: Infinity, delay: i * 0.11, ease: 'easeIn' }}
        />
      ))}
    </motion.g>
  );
}

// ── Soap and towel ──────────────────────────────────────────────────────────

export function SoapBar() {
  return (
    <g>
      <rect x={-30} y={-17} width={60} height={34} rx={14} fill="#FF9EC0" {...line} />
      <rect x={-22} y={-11} width={30} height={10} rx={5} fill="#FFD0E2" />
      <circle cx={18} cy={-20} r={6} fill="#FFFFFF" {...line} strokeWidth={2.5} />
      <circle cx={28} cy={-28} r={4} fill="#FFFFFF" {...line} strokeWidth={2} />
    </g>
  );
}

export function Towel() {
  // A kitenge-print cloth.
  return (
    <g>
      <path d="M-34 -56 h68 v104 q-10 8 -18 0 q-8 8 -16 0 q-8 8 -16 0 q-8 8 -18 0 z" fill="#FF6B4A" {...line} />
      <path d="M-34 -30 h68 M-34 0 h68 M-34 30 h68" stroke="#FFC02E" strokeWidth={6} />
      {[-20, 0, 20].map((x) => [-44, -15, 15].map((y) => <circle key={`${x}${y}`} cx={x} cy={y} r={4} fill="#17543C" />))}
      <path d="M-34 -56 h68 v104 q-10 8 -18 0 q-8 8 -16 0 q-8 8 -16 0 q-8 8 -18 0 z" fill="none" {...line} />
    </g>
  );
}

// ── The hands ───────────────────────────────────────────────────────────────

const SKIN = '#9A5B34';
const PALM = '#C98B5E';

const FINGERS = [
  { x: -28, y: -100, w: 13, h: 52 },
  { x: -13, y: -110, w: 13, h: 60 },
  { x: 2, y: -106, w: 13, h: 56 },
  { x: 17, y: -94, w: 12, h: 44 },
];

/** One hand, palm towards us, wrist at 0,0. Mirror with scale(-1 1). */
function Hand({ sleeve }: { sleeve: string }) {
  const parts = (
    <>
      {FINGERS.map((f, i) => (
        <rect key={i} x={f.x} y={f.y} width={f.w} height={f.h} rx={f.w / 2} />
      ))}
      <rect x={-30} y={-70} width={60} height={66} rx={22} />
      <rect x={-30} y={-64} width={14} height={44} rx={7} transform="rotate(-38 -24 -24)" />
      <rect x={-22} y={-16} width={44} height={40} rx={10} />
    </>
  );
  return (
    <g>
      <rect x={-34} y={20} width={68} height={190} rx={18} fill={sleeve} {...line} />
      <path d="M-34 34 h68" stroke={INK} strokeWidth={4} />
      <g stroke={INK} strokeWidth={9} fill={INK} strokeLinejoin="round">{parts}</g>
      <g fill={SKIN}>{parts}</g>
      <ellipse cx={2} cy={-38} rx={21} ry={22} fill={PALM} />
      <path d="M-12 -52 q14 8 26 -2 M-14 -36 q12 6 22 0" fill="none" stroke="#7A4526" strokeWidth={2.5} strokeLinecap="round" opacity={0.6} />
      {FINGERS.map((f, i) => (
        <rect key={i} x={f.x + 3} y={f.y + 3} width={f.w - 6} height={9} rx={4} fill="#E0B08A" opacity={0.9} />
      ))}
    </g>
  );
}

export function Hands() {
  return (
    // Arms come in from the bottom corners, so the pedal between them stays
    // in view.
    <g>
      <g transform={`translate(${WASH.hands.x - 58} ${WASH.hands.y + 50}) rotate(24) scale(1.12)`}>
        <g transform="scale(-1 1)">
          <Hand sleeve="#35A7E8" />
        </g>
      </g>
      <g transform={`translate(${WASH.hands.x + 58} ${WASH.hands.y + 50}) rotate(-24) scale(1.12)`}>
        <Hand sleeve="#35A7E8" />
      </g>
    </g>
  );
}

/** Mud from playing outside. Fades as the child scrubs. */
export function Mud({ amount }: { amount: MotionValue<number> }) {
  const { x, y } = WASH.hands;
  return (
    // Grey-brown clay with a dark edge: reads as mud on any skin tone.
    <motion.g style={{ opacity: amount }} fill="#8C7B62" stroke="#4A3B28" strokeWidth={2.5} aria-hidden>
      <path d={`M${x - 66} ${y - 34} q12 -14 26 -4 q12 12 -2 22 q-16 6 -24 -18 z`} />
      <path d={`M${x + 34} ${y - 46} q16 -6 20 10 q2 14 -14 14 q-14 -4 -6 -24 z`} />
      <path d={`M${x - 40} ${y + 6} q14 -8 22 2 q4 14 -12 14 q-14 -2 -10 -16 z`} />
      <path d={`M${x + 46} ${y + 2} q12 -4 16 8 q0 12 -12 10 q-10 -2 -4 -18 z`} />
      <circle cx={x - 62} cy={y - 86} r={7} />
      <circle cx={x + 40} cy={y - 96} r={6} />
      <circle cx={x - 20} cy={y - 40} r={5} />
    </motion.g>
  );
}

// ── Germs: friendly, never scary ────────────────────────────────────────────

export const GERM_COLORS = ['#7BC74D', '#B07CE8', '#4FC1D9', '#F49A3C', '#E86A9A', '#7BC74D'];

export function Germ({ color, mood = 'cheeky' }: { color: string; mood?: 'cheeky' | 'popped' }) {
  const bumps = [];
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI * 2 * i) / 8;
    bumps.push(<circle key={i} cx={Math.cos(a) * 15} cy={Math.sin(a) * 15} r={6} />);
  }
  return (
    <g>
      <g fill={color} stroke={INK} strokeWidth={3}>{bumps}</g>
      <circle r={16} fill={color} />
      <circle cx={-6} cy={-3} r={4.5} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
      <circle cx={6} cy={-3} r={4.5} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
      <circle cx={-5} cy={-2} r={2} fill={INK} />
      <circle cx={7} cy={-2} r={2} fill={INK} />
      {mood === 'cheeky' ? (
        <path d="M-6 6 q6 5 12 0" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
      ) : (
        <circle cx={0} cy={7} r={3} fill={INK} />
      )}
    </g>
  );
}

export function Bubble({ r }: { r: number }) {
  return (
    <g>
      <circle r={r} fill="#FFFFFF" stroke="#BFD8EA" strokeWidth={2.5} />
      <circle cx={-r * 0.35} cy={-r * 0.35} r={r * 0.25} fill="#E3F2FD" />
    </g>
  );
}

// ── Pictures for the step strip and the moments ─────────────────────────────

export function StepIcon({ step }: { step: 'water' | 'soap' | 'scrub' | 'rinse' | 'dry' }) {
  switch (step) {
    case 'water':
      return (
        <g>
          <path d="M0 -18 q14 18 14 28 a14 14 0 0 1 -28 0 q0 -10 14 -28 z" fill="#7CCBF2" {...line} strokeWidth={3} />
          <path d="M-6 8 q0 6 6 8" fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" />
        </g>
      );
    case 'soap':
      return (
        <g transform="scale(0.62)">
          <SoapBar />
        </g>
      );
    case 'scrub':
      return (
        <g>
          <circle cx={-6} cy={4} r={10} fill="#FFFFFF" {...line} strokeWidth={3} />
          <circle cx={8} cy={-4} r={8} fill="#FFFFFF" {...line} strokeWidth={3} />
          <circle cx={6} cy={12} r={6} fill="#FFFFFF" {...line} strokeWidth={3} />
          <path d="M-18 -14 a22 22 0 0 1 30 -6" fill="none" {...line} strokeWidth={3} />
          <path d="M12 -24 l2 6 l-6 0" fill="none" {...line} strokeWidth={3} />
        </g>
      );
    case 'rinse':
      return (
        <g>
          <path d="M-4 -20 v18 M4 -20 v18 M-12 -16 v10 M12 -16 v10" stroke="#2E8FD0" strokeWidth={4} strokeLinecap="round" />
          <circle cx={-6} cy={10} r={7} fill="#FFFFFF" {...line} strokeWidth={3} />
          <circle cx={8} cy={12} r={5} fill="#FFFFFF" {...line} strokeWidth={3} />
        </g>
      );
    case 'dry':
      return (
        <g transform="scale(0.36)">
          <Towel />
        </g>
      );
  }
}

export type MomentId = 'eat' | 'toilet' | 'play' | 'animals';

export function MomentPicture({ moment }: { moment: MomentId }) {
  switch (moment) {
    case 'eat':
      // A plate of ibishyimbo (beans) with a banana.
      return (
        <g>
          <ellipse cx={0} cy={14} rx={44} ry={16} fill="#FFFFFF" {...line} />
          <ellipse cx={0} cy={8} rx={34} ry={11} fill="#8A3B2A" />
          {[[-14, 6], [-4, 10], [8, 5], [16, 10], [-20, 11], [2, 4]].map(([x, y], i) => (
            <ellipse key={i} cx={x} cy={y} rx={4} ry={2.6} fill="#5A1F14" />
          ))}
          <path d="M-6 -2 q18 -24 40 -14 q2 4 -2 6 q-20 -6 -34 12 z" fill="#FFC02E" {...line} strokeWidth={3} />
          <path d="M-30 -20 q4 -12 0 -22 M-20 -22 q4 -12 0 -22" fill="none" stroke="#BFD8EA" strokeWidth={3} strokeLinecap="round" />
        </g>
      );
    case 'toilet':
      return (
        <g>
          <rect x={-22} y={-40} width={44} height={24} rx={6} fill="#FFFFFF" {...line} />
          <path d="M-34 -14 h68 q0 30 -34 34 q-34 -4 -34 -34 z" fill="#FFFFFF" {...line} />
          <path d="M-14 20 h28 l4 20 h-36 z" fill="#FFFFFF" {...line} />
          <ellipse cx={0} cy={-12} rx={26} ry={6} fill="#BFE6F7" {...line} strokeWidth={3} />
        </g>
      );
    case 'play':
      return (
        <g>
          <circle r={36} fill="#FFFFFF" {...line} />
          <path d="M0 -14 l13 9 l-5 15 h-16 l-5 -15 z" fill={INK} />
          <path d="M0 -14 v-21 M13 -5 l20 -8 M8 10 l12 17 M-8 10 l-12 17 M-13 -5 l-20 -8" stroke={INK} strokeWidth={3} />
          <path d="M-30 8 q8 -6 14 4 q-4 10 -14 -4 z M10 22 q8 -4 12 4 q-6 6 -12 -4 z" fill="#6B4423" />
        </g>
      );
    case 'animals':
      return null; // drawn with Goat from the picture library
  }
}

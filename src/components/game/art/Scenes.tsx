// Six Rwandan pictures for Teranya Ishusho (jigsaw). Each is drawn in a
// 360 × 270 box. With `alive`, small parts move — the reward for finishing a
// puzzle is the picture waking up ("comes alive", GAMES-DESIGN §4.4).
//
// All our own art (the Friends library + scenery), so there is nothing to
// license or credit.

import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import type { Language } from '../../../i18n/translations';
import {
  Avocado, Banana, Basket, Chicken, Cow, Crane, Elephant, Fish, Flower, Goat, Gorilla, House, INK, Lion, Mango,
  Pineapple, SunFace, Zebra,
} from './Friends';

export const SCENE_W = 360;
export const SCENE_H = 270;

const line = { stroke: INK, strokeWidth: 4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

function Place({ x, y, s = 1, children, flip = false }: { x: number; y: number; s?: number; children: ReactNode; flip?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>{children}</g>;
}

/** A gentle bob, only when the picture is alive. */
function Bob({ alive, children, dy = -6, delay = 0 }: { alive: boolean; children: ReactNode; dy?: number; delay?: number }) {
  if (!alive) return <g>{children}</g>;
  return (
    <motion.g animate={{ y: [0, dy, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay }}>
      {children}
    </motion.g>
  );
}

function BananaTree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 v-70" stroke="#5E8A3A" strokeWidth={12} strokeLinecap="round" />
      <path d="M0 -70 q-46 -14 -60 18 q32 -8 60 -18 z M0 -70 q40 -26 62 -4 q-34 6 -62 4 z M0 -72 q-8 -40 14 -58 q4 34 -14 58 z M0 -70 q-26 -36 -50 -30 q20 18 50 30 z" fill="#3E9B43" {...line} strokeWidth={3} />
      <path d="M6 -56 q8 10 4 22" stroke="#7A9A2E" strokeWidth={8} strokeLinecap="round" />
    </g>
  );
}

function Acacia({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0 q-4 -40 -18 -60 M0 -30 q10 -20 26 -30" fill="none" stroke="#7A4A1E" strokeWidth={8} strokeLinecap="round" />
      <ellipse cx={4} cy={-66} rx={58} ry={16} fill="#5E9B3A" {...line} />
    </g>
  );
}

function Cloud({ x, y, alive }: { x: number; y: number; alive: boolean }) {
  const shape = (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-30 8 a14 14 0 0 1 4 -24 a18 18 0 0 1 32 -6 a14 14 0 0 1 24 12 a12 12 0 0 1 -4 18 z" fill="#FFFFFF" {...line} strokeWidth={3} />
    </g>
  );
  if (!alive) return shape;
  return (
    <motion.g animate={{ x: [0, 18, 0] }} transition={{ duration: 3, repeat: Infinity }}>
      {shape}
    </motion.g>
  );
}

function Sun({ x, y, alive }: { x: number; y: number; alive: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(0.55)`}>
      {alive ? (
        <motion.g animate={{ rotate: [0, 12, -12, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <SunFace />
        </motion.g>
      ) : (
        <SunFace />
      )}
    </g>
  );
}

// ── The six pictures ─────────────────────────────────────────────────────────

function Hills({ alive }: { alive: boolean }) {
  return (
    <g>
      <rect width={SCENE_W} height={SCENE_H} fill="#BFE6F7" />
      <Sun x={300} y={50} alive={alive} />
      <Cloud x={80} y={44} alive={alive} />
      <path d="M0 140 q90 -70 190 -10 q90 -60 170 -10 v150 h-360 z" fill="#8FD6AE" {...line} strokeWidth={3} />
      {/* terraces — Rwanda's hillsides */}
      <path d="M40 120 q60 -30 120 0 M70 104 q40 -18 80 0 M220 112 q50 -24 100 0" fill="none" stroke="#5CC489" strokeWidth={4} strokeLinecap="round" />
      <path d="M0 190 q120 -40 240 -6 q70 18 120 -4 v90 h-360 z" fill="#5CC489" {...line} strokeWidth={3} />
      <BananaTree x={42} y={210} s={0.9} />
      <Bob alive={alive}><Place x={150} y={200} s={1.05}><Cow /></Place></Bob>
      <Bob alive={alive} delay={0.3}><Place x={270} y={214} s={0.85} flip><Cow /></Place></Bob>
      <Place x={330} y={250} s={0.35}><Flower /></Place>
      <Place x={96} y={252} s={0.3}><Flower /></Place>
    </g>
  );
}

function Home({ alive }: { alive: boolean }) {
  return (
    <g>
      <rect width={SCENE_W} height={SCENE_H} fill="#FFE8B8" />
      <Sun x={56} y={48} alive={alive} />
      <path d="M0 180 h360 v90 h-360 z" fill="#D9B98A" {...line} strokeWidth={3} />
      <BananaTree x={300} y={190} s={1.1} />
      <Place x={170} y={130} s={1.7}><House /></Place>
      <Bob alive={alive}><Place x={66} y={208} s={0.7}><Chicken /></Place></Bob>
      <Bob alive={alive} delay={0.4}><Place x={300} y={232} s={0.6} flip><Goat /></Place></Bob>
      <Place x={30} y={250} s={0.35}><Flower /></Place>
      <Place x={232} y={250} s={0.3}><Flower /></Place>
    </g>
  );
}

function Forest({ alive }: { alive: boolean }) {
  return (
    <g>
      <rect width={SCENE_W} height={SCENE_H} fill="#CFEFD7" />
      {/* the Virunga volcanoes */}
      <path d="M-10 120 L70 40 L120 80 L170 30 L250 110 L300 60 L380 130 v40 h-390 z" fill="#7B8FA0" {...line} strokeWidth={3} />
      <path d="M150 50 L170 30 L190 50 q-20 6 -40 0 z" fill="#FFFFFF" />
      {[20, 70, 300, 340].map((x, i) => (
        <g key={x}>
          <path d={`M${x} 270 V120`} stroke="#6FAF4A" strokeWidth={10} />
          <path d={`M${x} 150 h10 M${x} 190 h-10 M${x} 230 h10`} stroke="#4E8A33" strokeWidth={4} />
          <path d={`M${x} 124 q-16 -10 -24 4 M${x} 140 q16 -12 24 2`} fill="#3E9B43" stroke={INK} strokeWidth={2} />
          {i % 2 === 0 && <path d={`M${x} 160 q20 -8 26 4`} fill="none" stroke="#3E9B43" strokeWidth={5} />}
        </g>
      ))}
      <path d="M0 200 q90 -30 180 0 q90 -30 180 0 v70 h-360 z" fill="#3E9B43" {...line} strokeWidth={3} />
      <Bob alive={alive} dy={-4}><Place x={180} y={186} s={1.5}><Gorilla /></Place></Bob>
      <Bob alive={alive} delay={0.5}><Place x={286} y={210} s={0.62}><Crane /></Place></Bob>
    </g>
  );
}

function Lake({ alive }: { alive: boolean }) {
  return (
    <g>
      <rect width={SCENE_W} height={SCENE_H} fill="#FFD9A8" />
      <Sun x={180} y={88} alive={alive} />
      <path d="M0 110 q60 -40 120 -6 q60 -30 120 0 q60 -36 120 6 v30 h-360 z" fill="#6E9E6A" {...line} strokeWidth={3} />
      <rect y={128} width={SCENE_W} height={142} fill="#3D9BD6" />
      <path d="M0 128 h360" stroke={INK} strokeWidth={3} />
      {[150, 180, 210, 240].map((y, i) => (
        <path key={y} d={`M${20 + i * 30} ${y} q12 -6 24 0 M${200 - i * 20} ${y + 8} q12 -6 24 0`} fill="none" stroke="#9ED8F5" strokeWidth={3} strokeLinecap="round" />
      ))}
      {/* a fishing boat on Lake Kivu */}
      <Bob alive={alive} dy={-5}>
        <g transform="translate(110 160)">
          <path d="M-60 0 h120 l-18 24 h-84 z" fill="#C8552E" {...line} />
          <path d="M0 0 v-70 M0 -70 l40 60 h-40" fill="#FFFFFF" {...line} strokeWidth={3} />
          <path d="M-40 0 v-28 M40 0 v-20" stroke="#7A4A1E" strokeWidth={4} />
        </g>
      </Bob>
      {alive ? (
        <motion.g animate={{ y: [0, -50, 0], rotate: [0, -20, 0] }} transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.4 }}>
          <Place x={270} y={210} s={0.62}><Fish /></Place>
        </motion.g>
      ) : (
        <Place x={270} y={210} s={0.62}><Fish /></Place>
      )}
      <Place x={300} y={250} s={0.4}><Fish /></Place>
    </g>
  );
}

function Market({ alive }: { alive: boolean }) {
  return (
    <g>
      <rect width={SCENE_W} height={SCENE_H} fill="#FFF1D6" />
      {/* stall roof */}
      <path d="M10 70 L180 20 L350 70 z" fill="#FF6B4A" {...line} />
      <path d="M40 70 v110 M320 70 v110" stroke="#8A5A2E" strokeWidth={10} />
      <rect x={20} y={170} width={320} height={30} rx={8} fill="#C08A52" {...line} />
      <rect x={30} y={200} width={300} height={70} fill="#A06A3A" {...line} />
      <path d="M30 70 h300" stroke={INK} strokeWidth={3} />
      {[60, 100, 140, 180, 220, 260, 300].map((x, i) => (
        <path key={x} d={`M${x - 20} 70 q20 ${i % 2 ? 22 : 18} 40 0`} fill={i % 2 ? '#FFC02E' : '#FFFFFF'} stroke={INK} strokeWidth={2.5} />
      ))}
      <Bob alive={alive}><Place x={70} y={140} s={0.72}><Pineapple /></Place></Bob>
      <Bob alive={alive} delay={0.2}><Place x={150} y={150} s={0.62}><Banana /></Place></Bob>
      <Bob alive={alive} delay={0.4}><Place x={220} y={150} s={0.5}><Avocado /></Place></Bob>
      <Bob alive={alive} delay={0.6}><Place x={290} y={150} s={0.5}><Mango /></Place></Bob>
      <Place x={180} y={234} s={0.55}><Basket /></Place>
    </g>
  );
}

function Savanna({ alive }: { alive: boolean }) {
  return (
    <g>
      <rect width={SCENE_W} height={SCENE_H} fill="#FFE7A3" />
      <Sun x={64} y={52} alive={alive} />
      <path d="M0 150 q180 -40 360 0 v120 h-360 z" fill="#E3C25E" {...line} strokeWidth={3} />
      <Acacia x={280} y={150} />
      <Bob alive={alive}><Place x={250} y={176} s={0.95}><Elephant /></Place></Bob>
      <Bob alive={alive} delay={0.3}><Place x={112} y={196} s={0.95} flip><Zebra /></Place></Bob>
      <Bob alive={alive} delay={0.6}><Place x={300} y={234} s={0.5}><Lion /></Place></Bob>
      {[[30, 250], [190, 256], [150, 236]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y} l4 -14 l4 14 l4 -10 l2 10`} fill="none" stroke="#B49231" strokeWidth={3} strokeLinecap="round" />
      ))}
    </g>
  );
}

export interface SceneInfo {
  id: string;
  name: Record<Language, string>;
  Draw: (props: { alive: boolean }) => ReactNode;
}

export const SCENES: SceneInfo[] = [
  { id: 'hills', name: { KN: 'Inka ku musozi', EN: 'Cows on the hill', FR: 'Les vaches sur la colline' }, Draw: Hills },
  { id: 'home', name: { KN: 'Urugo rwacu', EN: 'Our home', FR: 'Notre maison' }, Draw: Home },
  { id: 'forest', name: { KN: "Ingagi mu ishyamba", EN: 'Gorilla in the forest', FR: 'Le gorille dans la forêt' }, Draw: Forest },
  { id: 'lake', name: { KN: 'Ikiyaga cya Kivu', EN: 'Lake Kivu', FR: 'Le lac Kivu' }, Draw: Lake },
  { id: 'market', name: { KN: 'Ku isoko', EN: 'At the market', FR: 'Au marché' }, Draw: Market },
  { id: 'savanna', name: { KN: 'Pariki ya Akagera', EN: 'Akagera park', FR: "Le parc de l'Akagera" }, Draw: Savanna },
];

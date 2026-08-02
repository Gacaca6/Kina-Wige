// 05 · Home — the learning path.
//
// The centrepiece. A dotted trail fills in green behind the child; completed
// nodes carry a tick, the current node pulses and wears Kina's face with a
// bobbing START bubble, later nodes stay visible but locked.
//
// A card grid is a layout. A path is a place — that is the whole difference.
//
// Designed for 3–6:
//   • NO streak, no timer, no currency. Stars only ever accumulate.
//   • Every destination is a PICTURE first — a pre-reader must never depend on
//     the word underneath it.
//   • Touch targets are 84–108px, well over the 72px floor, with 20px+ gaps.

import { useState } from 'react';
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Kina from '../components/characters/Kina';
import { useStars } from '../hooks/useStars';
import BottomNav from '../components/ui/BottomNav';

interface PathNode {
  id: string;
  x: number;
  y: number;
  state: 'done' | 'current' | 'locked';
  to?: string;
}

const NODES: PathNode[] = [
  // Wired to content that already ships: lessons from data/lessons.ts and
  // episodes from data/episodes.ts.
  { id: 'n1', x: 62, y: 0, state: 'done', to: '/lesson/u1l1' },
  { id: 'n2', x: 178, y: 96, state: 'done', to: '/episode/alphabet' },
  { id: 'n3', x: 108, y: 188, state: 'current', to: '/lesson/u2l1' },
  { id: 'n4', x: 194, y: 300, state: 'locked' },
];

const TRAIL =
  'M120 20 C 250 60, 60 120, 190 170 C 320 220, 100 250, 200 320 C 260 360, 200 380, 160 396';
const TRAIL_DONE = 'M120 20 C 250 60, 60 120, 190 170';

/* ── Pictorial nav icons. A 4-year-old reads the picture, not the label. ── */

function IconStars() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full" aria-hidden>
      <path
        d="M24 6l5.5 11.6 12.5 1.6-9.2 8.7 2.4 12.5L24 34.2 12.8 40.4l2.4-12.5L6 19.2l12.5-1.6z"
        fill="#FFC02E"
        stroke="#10241B"
        strokeWidth={3.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}


export default function HomePathScreen() {
  const navigate = useNavigate();
  const { stars } = useStars();
  const [look, setLook] = useState<{ x: number; y: number } | null>(null);

  function track(e: ReactPointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    setLook({
      x: ((e.clientX - r.left) / r.width) * 2 - 1,
      y: ((e.clientY - r.top) / r.height) * 2 - 1,
    });
  }

  return (
    <div
      className="min-h-screen bg-cream flex flex-col"
      onPointerMove={track}
      onPointerLeave={() => setLook(null)}
    >
      {/* ── Header. Stars only — no streak, no gems, nothing that can go down. ── */}
      <header className="bg-forest text-white px-5 pt-4 pb-5">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2.5 bg-forest-deep rounded-[16px] px-4"
            style={{ minHeight: 72 }}
          >
            <span style={{ width: 28, height: 28, display: 'block' }}>
              <IconStars />
            </span>
            <span className="font-body font-black text-2xl tabular-nums">{stars}</span>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="ml-auto flex items-center gap-2 bg-forest-deep rounded-[16px] px-4"
            style={{ minHeight: 72, minWidth: 84 }}
            aria-label="Language and settings"
          >
            <span className="w-6 h-6 rounded-md overflow-hidden flex flex-col">
              <span className="flex-1 bg-sky" />
              <span className="flex-1 bg-sun" />
              <span className="flex-1 bg-grass" />
            </span>
            <span className="font-body font-black text-base">RW</span>
          </button>

          {/* The only way into the grown-up lane from the child's world.
              Blue on purpose — blue always means "an adult should hold this". */}
          <button
            onClick={() => navigate('/parents')}
            className="flex items-center justify-center bg-forest-deep rounded-[16px]"
            style={{ minHeight: 72, minWidth: 72 }}
            aria-label="Grown-ups area"
          >
            <span className="relative block" style={{ width: 22, height: 24 }} aria-hidden>
              <span className="absolute bottom-0 left-0 right-0 rounded-[5px] bg-sky" style={{ height: 15 }} />
              <span
                className="absolute top-0 left-[4px] right-[4px] rounded-t-[8px] border-[3px] border-b-0 border-sky box-border"
                style={{ height: 11 }}
              />
            </span>
          </button>
        </div>
      </header>

      {/* ── Unit banner ── */}
      <div className="px-5 pt-5">
        <div
          className="flex items-center gap-4 bg-sun rounded-[22px]"
          style={{ boxShadow: '0 7px 0 #D89A00', padding: '18px 20px' }}
        >
          <div className="w-14 h-14 rounded-[16px] bg-ink grid place-items-center flex-none">
            <span className="font-display font-extrabold text-[26px] leading-none text-sun">1</span>
          </div>
          <div>
            <div className="font-body font-extrabold text-[12px] tracking-[.14em] text-[#8A6A00]">
              IGICE 1 · UNIT 1
            </div>
            <div className="font-body font-black text-[22px] text-ink leading-tight">
              Amagambo yambere
            </div>
          </div>
        </div>
      </div>

      {/* ── The trail ── */}
      <div className="relative flex-1 min-h-[400px] overflow-hidden pt-6">
        <svg viewBox="0 0 390 400" className="absolute inset-0 w-full h-full" aria-hidden>
          <path d={TRAIL} fill="none" stroke="#E4DDCE" strokeWidth={16} strokeLinecap="round" strokeDasharray="2 28" />
          <path d={TRAIL_DONE} fill="none" stroke="#2FBF6B" strokeWidth={16} strokeLinecap="round" strokeDasharray="2 28" />
        </svg>

        {NODES.map((n) => {
          if (n.state === 'done') {
            return (
              <button
                key={n.id}
                onClick={() => n.to && navigate(n.to)}
                className="absolute rounded-full bg-grass grid place-items-center chunk"
                style={{ left: n.x, top: n.y, width: 88, height: 88, boxShadow: '0 8px 0 #1E8C4C' }}
                aria-label="Lesson complete — play again"
              >
                <span
                  className="block border-l-[9px] border-b-[9px] border-white rounded-[2px]"
                  style={{ width: 38, height: 22, transform: 'rotate(-45deg) translateY(-4px)' }}
                />
              </button>
            );
          }
          if (n.state === 'locked') {
            return (
              <div
                key={n.id}
                className="absolute rounded-full bg-locked grid place-items-center"
                style={{ left: n.x, top: n.y, width: 84, height: 84, boxShadow: '0 7px 0 #C9C0AE' }}
                aria-label="Locked — finish the lesson before this one"
              >
                <span className="relative block w-[30px] h-[26px] rounded-md bg-[#A8A090]">
                  <span className="absolute -top-3 left-1.5 right-1.5 h-3.5 rounded-t-[10px] border-4 border-b-0 border-[#A8A090] box-border" />
                </span>
              </div>
            );
          }
          return (
            <div key={n.id} className="absolute grid place-items-center" style={{ left: n.x, top: n.y }}>
              <motion.span
                className="absolute rounded-full border-[6px] border-sun"
                style={{ width: 124, height: 124 }}
                initial={{ scale: 0.7, opacity: 0.75 }}
                animate={{ scale: 2.1, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                aria-hidden
              />
              <motion.div
                className="absolute -top-[56px] bg-ink text-white font-body font-black text-[17px] px-5 py-3 rounded-[16px] whitespace-nowrap"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                TANGIRA
              </motion.div>
              <button
                onClick={() => n.to && navigate(n.to)}
                className="rounded-full bg-sun grid place-items-center chunk"
                style={{ width: 108, height: 108, boxShadow: '0 9px 0 #D89A00' }}
                aria-label="Start this lesson"
              >
                <Kina mood="idle" lookAt={look} style={{ width: 70, height: 68 }} />
              </button>
            </div>
          );
        })}
      </div>

      {/* The ONE bottom nav, shared by every child screen. */}
      <BottomNav />
    </div>
  );
}

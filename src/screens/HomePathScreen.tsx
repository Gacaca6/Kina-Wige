// 05 · Home — the learning path.
//
// The centrepiece. A dotted trail fills in green behind the child; completed
// nodes carry a tick, the current node pulses and wears Kina's face with a
// bobbing START bubble, later nodes stay visible but locked.
//
// A card grid is a layout. A path is a place — that is the whole difference.

import { useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Kina from '../components/characters/Kina';

interface PathNode {
  id: string;
  x: number;
  y: number;
  state: 'done' | 'current' | 'locked';
  to?: string;
}

// Positions follow the dotted trail below.
const NODES: PathNode[] = [
  { id: 'n1', x: 74, y: 4, state: 'done', to: '/episodes' },
  { id: 'n2', x: 180, y: 100, state: 'done', to: '/episodes' },
  { id: 'n3', x: 120, y: 190, state: 'current', to: '/games' },
  { id: 'n4', x: 196, y: 294, state: 'locked' },
];

const TRAIL = 'M120 20 C 250 60, 60 120, 190 170 C 320 220, 100 250, 200 320 C 260 360, 200 380, 160 396';
const TRAIL_DONE = 'M120 20 C 250 60, 60 120, 190 170';

export default function HomePathScreen() {
  const navigate = useNavigate();
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
      {/* ── Header: streak, gems, language ── */}
      <header className="bg-forest text-white px-6 pt-4 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 bg-forest-deep rounded-[14px] px-3.5 py-2.5">
            <span className="w-5 h-6 rounded-full bg-coral inline-block" style={{ borderRadius: '50% 50% 50% 50%/60% 60% 40% 40%' }} />
            <span className="font-body font-black text-lg">12</span>
          </div>
          <div className="flex items-center gap-2 bg-forest-deep rounded-[14px] px-3.5 py-2.5">
            <span className="w-5 h-5 bg-sky rounded-[4px] inline-block rotate-45" />
            <span className="font-body font-black text-lg">240</span>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="ml-auto flex items-center gap-2 bg-forest-deep rounded-[14px] px-3.5 py-2.5"
          >
            <span className="w-5 h-5 rounded-md overflow-hidden flex flex-col">
              <span className="flex-1 bg-sky" />
              <span className="flex-1 bg-sun" />
              <span className="flex-1 bg-grass" />
            </span>
            <span className="font-body font-black text-sm">RW</span>
          </button>
        </div>
      </header>

      {/* ── Unit banner ── */}
      <div className="px-6 pt-5">
        <div
          className="flex items-center gap-3.5 bg-sun rounded-[22px] px-4.5 py-4"
          style={{ boxShadow: '0 7px 0 #D89A00', padding: '16px 18px' }}
        >
          <div className="w-11 h-11 rounded-[14px] bg-ink grid place-items-center flex-none">
            <span className="font-display font-extrabold text-[22px] leading-none text-sun">1</span>
          </div>
          <div>
            <div className="font-body font-extrabold text-[12px] tracking-[.14em] text-[#8A6A00]">
              IGICE 1 · UNIT 1
            </div>
            <div className="font-body font-black text-[21px] text-ink">Amagambo yambere</div>
          </div>
        </div>
      </div>

      {/* ── The trail ── */}
      <div className="relative flex-1 min-h-[400px] overflow-hidden pt-6">
        <svg viewBox="0 0 390 400" className="absolute inset-0 w-full h-full" aria-hidden>
          <path d={TRAIL} fill="none" stroke="#E4DDCE" strokeWidth={14} strokeLinecap="round" strokeDasharray="2 26" />
          <path d={TRAIL_DONE} fill="none" stroke="#2FBF6B" strokeWidth={14} strokeLinecap="round" strokeDasharray="2 26" />
        </svg>

        {NODES.map((n) => {
          if (n.state === 'done') {
            return (
              <button
                key={n.id}
                onClick={() => n.to && navigate(n.to)}
                className="absolute w-[78px] h-[78px] rounded-full bg-grass grid place-items-center chunk"
                style={{ left: n.x, top: n.y, boxShadow: '0 8px 0 #1E8C4C' }}
                aria-label="Completed lesson"
              >
                <span
                  className="block w-[34px] h-[20px] border-l-[8px] border-b-[8px] border-white rounded-[2px]"
                  style={{ transform: 'rotate(-45deg) translateY(-4px)' }}
                />
              </button>
            );
          }
          if (n.state === 'locked') {
            return (
              <div
                key={n.id}
                className="absolute w-[74px] h-[74px] rounded-full bg-locked grid place-items-center"
                style={{ left: n.x, top: n.y, boxShadow: '0 7px 0 #C9C0AE' }}
                aria-label="Locked"
              >
                <span className="relative block w-[26px] h-[22px] rounded-md bg-[#A8A090]">
                  <span className="absolute -top-2.5 left-[5px] right-[5px] h-3 rounded-t-[9px] border-4 border-b-0 border-[#A8A090] box-border" />
                </span>
              </div>
            );
          }
          return (
            <div key={n.id} className="absolute grid place-items-center" style={{ left: n.x, top: n.y }}>
              <motion.span
                className="absolute w-[112px] h-[112px] rounded-full border-[5px] border-sun"
                initial={{ scale: 0.7, opacity: 0.75 }}
                animate={{ scale: 2.1, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                aria-hidden
              />
              <motion.div
                className="absolute -top-[52px] bg-ink text-white font-body font-black text-[15px] px-4 py-2.5 rounded-[14px] whitespace-nowrap"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                TANGIRA
              </motion.div>
              <button
                onClick={() => n.to && navigate(n.to)}
                className="w-[98px] h-[98px] rounded-full bg-sun grid place-items-center chunk"
                style={{ boxShadow: '0 9px 0 #D89A00' }}
                aria-label="Start this lesson"
              >
                <Kina mood="idle" lookAt={look} style={{ width: 62, height: 60 }} />
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Bottom nav ── */}
      <nav className="bg-white border-t-[3px] border-edge flex items-center justify-around pb-3 pt-2 h-[98px]">
        {[
          { label: 'WIGA', active: true, shape: 'rounded-xl bg-grass', to: '/home-path' },
          { label: 'KINA', active: false, shape: 'rounded-full bg-locked', to: '/games' },
          { label: 'INKURU', active: false, shape: 'rounded-lg bg-locked', to: '/comics' },
          { label: 'IBIHEMBO', active: false, shape: 'rounded-xl bg-locked', to: '/parents' },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.to)}
            className="flex flex-col items-center gap-1.5 w-[76px] relative"
          >
            <span className={`w-[38px] h-[38px] ${item.shape}`} />
            <span className={`font-body font-black text-[11px] ${item.active ? 'text-forest' : 'text-ink-faint'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}

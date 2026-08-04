// 01 · Splash — and the fork between the two lanes.
//
// The two audiences separate HERE, before anything else happens:
//   • the child gets a huge green door straight into playing and learning
//   • the grown-up gets a quiet blue door that leads through the parent gate
//
// The child's door is visually dominant on purpose. The grown-up's door is easy
// for an adult to find and uninteresting to a four-year-old — that asymmetry is
// the point, and it is why the parent lane stays blue everywhere after this.

import { useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Kina from '../components/characters/Kina';

const SPRING = { type: 'spring' as const, stiffness: 900, damping: 34, mass: 0.5 };

export default function SplashScreen() {
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
      className="relative min-h-[100dvh] bg-forest flex flex-col overflow-hidden"
      onPointerMove={track}
      onPointerLeave={() => setLook(null)}
    >
      {/* Hills, so even the splash sits somewhere rather than nowhere */}
      <svg
        viewBox="0 0 390 260"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        style={{ height: 240 }}
        aria-hidden
      >
        <path d="M-10 120 Q80 50 190 120 T400 108 L400 260 L-10 260 Z" fill="#14563C" />
        <path d="M-10 168 Q100 100 210 168 T400 156 L400 260 L-10 260 Z" fill="#0E3626" />
      </svg>

      {/* ── Kina + wordmark ── */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 pt-safe min-h-0">
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15, mass: 0.9 }}
        >
          <Kina mood="idle" lookAt={look} style={{ width: 'clamp(120px, 38vw, 168px)', height: 'auto' }} />
        </motion.div>

        <motion.h1
          className="font-display font-extrabold text-white mt-6 text-center"
          style={{ fontSize: 'clamp(36px, 12vw, 54px)', lineHeight: 1.02, letterSpacing: '-0.5px' }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, type: 'spring', stiffness: 260, damping: 24 }}
        >
          Kina Wige
        </motion.h1>
        <motion.p
          className="font-body font-bold text-center mt-2"
          style={{ fontSize: 'clamp(13px, 4vw, 16px)', color: '#CFEBDC' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.22 }}
        >
          Kina. Wige. Ukure.
        </motion.p>
      </div>

      {/* ── The fork ── */}
      <div className="relative px-5 pb-safe pt-2 flex flex-col gap-3.5 flex-none">
        {/* Child door — dominant, usable without reading a word */}
        <motion.button
          onClick={() => navigate('/home-path')}
          aria-label="Play and learn"
          whileTap={{ y: 6, boxShadow: '0 3px 0 #1E8C4C' }}
          transition={SPRING}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.3, ...SPRING } }}
          className="w-full rounded-[26px] bg-grass flex items-center gap-4 px-5"
          style={{ minHeight: 104, boxShadow: '0 9px 0 #1E8C4C' }}
        >
          <span
            className="rounded-[20px] bg-white grid place-items-center flex-none"
            style={{ width: 68, height: 68 }}
          >
            <span
              style={{
                width: 0,
                height: 0,
                borderLeft: '24px solid #2FBF6B',
                borderTop: '16px solid transparent',
                borderBottom: '16px solid transparent',
                marginLeft: 6,
              }}
            />
          </span>
          <span className="text-left min-w-0">
            <span
              className="block font-display font-extrabold text-white"
              style={{ fontSize: 'clamp(24px, 7vw, 30px)', lineHeight: 1.05 }}
            >
              Kina
            </span>
            <span className="block font-body font-extrabold text-white/85 text-[13px] mt-0.5">
              Play &amp; learn · for children
            </span>
          </span>
        </motion.button>

        {/* Grown-up door — findable, deliberately dull, blue from here on */}
        <motion.button
          onClick={() => navigate('/parents')}
          aria-label="Grown-ups area"
          whileTap={{ y: 5, boxShadow: '0 2px 0 #0B2A1D' }}
          transition={SPRING}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.38, ...SPRING } }}
          className="w-full rounded-[22px] bg-forest-deep flex items-center justify-center gap-3"
          style={{ minHeight: 76, boxShadow: '0 6px 0 #0B2A1D' }}
        >
          <span className="relative block flex-none" style={{ width: 22, height: 24 }} aria-hidden>
            <span className="absolute bottom-0 left-0 right-0 rounded-[5px] bg-sky" style={{ height: 15 }} />
            <span
              className="absolute top-0 left-[4px] right-[4px] rounded-t-[8px] border-[3px] border-b-0 border-sky box-border"
              style={{ height: 11 }}
            />
          </span>
          <span className="font-body font-black text-sky text-[17px]">Ababyeyi · Grown-ups</span>
        </motion.button>

        <p className="text-center font-body font-bold text-[12px]" style={{ color: 'rgba(207,235,220,.7)' }}>
          No account. No internet needed.
        </p>
      </div>
    </div>
  );
}

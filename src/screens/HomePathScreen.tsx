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
import BottomNav from '../components/ui/BottomNav';
import LanguageToggle from '../components/ui/LanguageToggle';
import { LESSONS } from '../data/lessons';
import { useI18n } from '../i18n/context';
import { useProgress } from '../hooks/useProgress';

interface PathNode {
  id: string;
  x: number;
  y: number;
  to: string;
  /** What has to be finished for this node to show a tick. */
  kind: 'lesson' | 'episode';
  contentId: string;
}

type NodeState = 'done' | 'current' | 'locked';

// Wired to content that already ships. State is NOT stored here — a freshly
// installed app used to show three finished nodes a child had never touched,
// which is a lie told to a four-year-old the first time they open it. Ticks are
// now earned: they appear only once that lesson or episode is actually done.
const NODES: PathNode[] = [
  { id: 'n1', x: 62, y: 0, to: '/lesson/u1l1', kind: 'lesson', contentId: 'u1l1' },
  { id: 'n2', x: 178, y: 96, to: '/episode/alphabet', kind: 'episode', contentId: 'alphabet' },
  { id: 'n3', x: 108, y: 188, to: '/lesson/u2l1', kind: 'lesson', contentId: 'u2l1' },
  { id: 'n4', x: 194, y: 292, to: '/lesson/u3l1', kind: 'lesson', contentId: 'u3l1' },
];

const TRAIL =
  'M120 20 C 250 60, 60 120, 190 170 C 320 220, 100 250, 200 320 C 260 360, 200 380, 160 396';

// How much green is painted behind the child, per number of finished nodes.
const TRAIL_DONE = [
  '',
  'M120 20 C 250 60, 60 120, 190 170',
  'M120 20 C 250 60, 60 120, 190 170 C 320 220, 100 250, 200 320',
  'M120 20 C 250 60, 60 120, 190 170 C 320 220, 100 250, 200 320 C 260 360, 200 380, 160 396',
];

/* ── Pictorial nav icons. A 4-year-old reads the picture, not the label. ── */



export default function HomePathScreen() {
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const { isLessonDone, isEpisodeWatched } = useProgress();
  const [look, setLook] = useState<{ x: number; y: number } | null>(null);

  // Ticks are earned, never assumed. A node is done when its content is done;
  // the first unfinished node is where the child is now; everything after it
  // waits. Play a game or finish a lesson and the path fills in behind you.
  const doneFlags = NODES.map((n) =>
    n.kind === 'lesson' ? isLessonDone(n.contentId) : isEpisodeWatched(n.contentId),
  );
  const firstUnfinished = doneFlags.indexOf(false);
  const stateOf = (i: number): NodeState =>
    doneFlags[i] ? 'done' : i === firstUnfinished ? 'current' : 'locked';

  const doneCount = doneFlags.filter(Boolean).length;
  const trailDone = TRAIL_DONE[Math.min(doneCount, TRAIL_DONE.length - 1)];

  // The banner follows wherever the child actually is.
  const currentNode = firstUnfinished === -1 ? NODES[NODES.length - 1] : NODES[firstUnfinished];
  const unit = currentNode.kind === 'lesson' ? LESSONS[currentNode.contentId] : undefined;

  function track(e: ReactPointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    setLook({
      x: ((e.clientX - r.left) / r.width) * 2 - 1,
      y: ((e.clientY - r.top) / r.height) * 2 - 1,
    });
  }

  return (
    <div
      className="bg-cream flex flex-col" style={{ minHeight: '100dvh' }}
      onPointerMove={track}
      onPointerLeave={() => setLook(null)}
    >
      {/* ── Header. Stars only — no streak, no gems, nothing that can go down. ── */}
      <header className="bg-forest text-white px-5 pt-safe pb-5">
        {/* No grown-up door here. A padlock is not a child's idea, and the
            child's world should contain nothing addressed to an adult. Parents
            reach their area from the splash screen, before the child lane
            begins. */}
        <div className="flex items-center justify-end gap-3">
          <LanguageToggle />
        </div>
      </header>

      {/* ── Unit banner ── */}
      <div className="px-5 pt-5">
        <div
          className="flex items-center gap-4 bg-sun rounded-[22px]"
          style={{ boxShadow: '0 7px 0 #D89A00', padding: '18px 20px' }}
        >
          <div className="w-14 h-14 rounded-[16px] bg-ink grid place-items-center flex-none">
            <span className="font-display font-extrabold text-[26px] leading-none text-sun">
              {unit?.unit ?? 1}
            </span>
          </div>
          <div>
            <div className="font-body font-extrabold text-[12px] tracking-[.14em] text-[#8A6A00]">
              {t('home.unit')} {unit?.unit ?? 1}
            </div>
            <div className="font-body font-black text-[22px] text-ink leading-tight">
              {unit ? unit.title[language] : ''}
            </div>
          </div>
        </div>
      </div>

      {/* ── The trail ── */}
      <div className="relative flex-1 min-h-[400px] overflow-hidden pt-6">
        <svg viewBox="0 0 390 400" className="absolute inset-0 w-full h-full" aria-hidden>
          <path d={TRAIL} fill="none" stroke="#E4DDCE" strokeWidth={16} strokeLinecap="round" strokeDasharray="2 28" />
          <path d={trailDone} fill="none" stroke="#2FBF6B" strokeWidth={16} strokeLinecap="round" strokeDasharray="2 28" />
        </svg>

        {NODES.map((n, i) => {
          const state = stateOf(i);
          if (state === 'done') {
            return (
              <button
                key={n.id}
                onClick={() => navigate(n.to)}
                className="absolute rounded-full bg-grass grid place-items-center chunk"
                style={{ left: n.x, top: n.y, width: 88, height: 88, boxShadow: '0 8px 0 #1E8C4C' }}
                aria-label={t('home.nodeDone')}
              >
                <span
                  className="block border-l-[9px] border-b-[9px] border-white rounded-[2px]"
                  style={{ width: 38, height: 22, transform: 'rotate(-45deg) translateY(-4px)' }}
                />
              </button>
            );
          }
          if (state === 'locked') {
            return (
              <div
                key={n.id}
                className="absolute rounded-full bg-locked grid place-items-center"
                style={{ left: n.x, top: n.y, width: 84, height: 84, boxShadow: '0 7px 0 #C9C0AE' }}
                aria-label={t('home.nodeLocked')}
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
                {t('home.start')}
              </motion.div>
              <button
                onClick={() => navigate(n.to)}
                className="rounded-full bg-sun grid place-items-center chunk"
                style={{ width: 108, height: 108, boxShadow: '0 9px 0 #D89A00' }}
                aria-label={t('home.nodeStart')}
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

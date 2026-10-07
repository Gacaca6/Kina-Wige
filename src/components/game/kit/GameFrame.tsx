// The frame every kit game sits in: a slim top bar (way back, where am I) and
// the rest of the screen for play. The forest header of the other screens is
// too tall for a game — on a small phone every centimetre goes to the stage.

import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../../i18n/context';
import Kina from '../../characters/Kina';
import { useBackHandler } from '../../../native/BackButton';
import type { KinaMood } from '../../characters/Kina';

export interface GameFrameProps {
  title: string;
  /** Rounds in this sitting, and how many are done. */
  progress?: { done: number; total: number };
  /** Screen colour behind the stage. */
  background: string;
  /** Darker partner of the background, for the bar's buttons. */
  deep: string;
  onBack?: () => void;
  right?: ReactNode;
  /** Kina's mood; she reacts to the child from the top bar. */
  kina?: KinaMood;
  children: ReactNode;
}

export default function GameFrame({ title, progress, background, deep, onBack, right, kina, children }: GameFrameProps) {
  const navigate = useNavigate();
  const { t } = useI18n();
  // The phone's back button does what the on-screen one does: inside a game's
  // own sub-screen (a chosen picture, a letter set) it goes back to the
  // choice, not straight out of the game.
  useBackHandler(!!onBack, () => onBack?.());
  return (
    <div className="flex flex-col overflow-hidden" style={{ height: 'var(--app-height)', background }}>
      <header className="pt-safe px-3 pb-2 flex items-center gap-3 flex-none">
        <button
          onClick={onBack ?? (() => navigate('/games'))}
          aria-label={t('common.back')}
          className="rounded-[18px] grid place-items-center flex-none"
          style={{ width: 56, height: 56, background: '#FFFFFF', boxShadow: `0 5px 0 ${deep}` }}
        >
          <svg viewBox="0 0 24 24" style={{ width: 26, height: 26 }} fill="none" stroke="#17543C" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="font-display font-extrabold text-white truncate min-w-0 flex-1" style={{ fontSize: 22, lineHeight: 1.1, textShadow: `0 2px 0 ${deep}` }}>
          {title}
        </h1>
        {progress && (
          <div className="flex gap-1.5 flex-none" aria-hidden>
            {Array.from({ length: progress.total }, (_, i) => (
              <motion.span
                key={i}
                className="rounded-full block"
                animate={{ width: i === progress.done ? 22 : 11, background: i < progress.done ? '#FFFFFF' : i === progress.done ? '#FFE08A' : 'rgba(255,255,255,0.38)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 26 }}
                style={{ height: 11 }}
              />
            ))}
          </div>
        )}
        {right}
        {kina && (
          // Kina rides along in the bar: always in view, never over the play.
          <div className="flex-none -my-1" aria-hidden>
            <Kina mood={kina} style={{ width: 54, height: 52 }} />
          </div>
        )}
      </header>
      <div className="flex-1 min-h-0 relative pb-safe">{children}</div>
    </div>
  );
}

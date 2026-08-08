// The win screen every game ends on. Built from the same forest-overlay +
// Kina-cheer pattern as ComicReader's finished screen, so a child recognises
// "I did it" the same way whether they just read a story or won a game.

import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/context';
import Kina from '../characters/Kina';

const SPRING = { type: 'spring' as const, stiffness: 900, damping: 34, mass: 0.5 };

interface GameCelebrationProps {
  onPlayAgain: () => void;
  scoreLabel?: string;
  /**
   * Optional slot between the score and the buttons. Used for a Connect step —
   * something to do with a grown-up before playing again (Architecture §11).
   */
  extra?: ReactNode;
}

export default function GameCelebration({ onPlayAgain, scoreLabel, extra }: GameCelebrationProps) {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center"
      style={{ background: '#17543C' }}
    >
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 14, mass: 0.9 }}
      >
        <Kina mood="cheer" style={{ width: 150, height: 136 }} />
      </motion.div>

      <h2 className="font-display font-extrabold text-white mt-5" style={{ fontSize: 40, lineHeight: 1.05 }}>
        {t('quiz.success')}
      </h2>

      <div
        className="mt-5 flex items-center gap-3 rounded-[20px] px-6"
        style={{ minHeight: 72, background: '#0E3626' }}
      >
        <span style={{ fontSize: 28 }} aria-hidden>⭐</span>
        <span className="font-body font-black text-white" style={{ fontSize: 26 }}>+1</span>
        {scoreLabel && (
          <span className="font-body font-black text-mint pl-2 ml-1" style={{ fontSize: 18, borderLeft: '2px solid #1E8C4C' }}>
            {scoreLabel}
          </span>
        )}
      </div>

      {extra}

      <div className="flex flex-col gap-3 w-full max-w-xs mt-8">
        <motion.button
          onClick={onPlayAgain}
          whileTap={{ y: 6, boxShadow: '0 2px 0 #1E8C4C' }}
          transition={SPRING}
          className="rounded-[22px]"
          style={{ minHeight: 76, background: '#2FBF6B', boxShadow: '0 8px 0 #1E8C4C' }}
        >
          <span className="font-display font-extrabold text-white" style={{ fontSize: 21 }}>
            {t('game.playAgain')}
          </span>
        </motion.button>
        <motion.button
          onClick={() => navigate('/games')}
          whileTap={{ y: 5, boxShadow: '0 2px 0 #0B2A1D' }}
          transition={SPRING}
          className="rounded-[22px]"
          style={{ minHeight: 68, background: '#0E3626', boxShadow: '0 6px 0 #0B2A1D' }}
        >
          <span className="font-body font-black text-mint" style={{ fontSize: 18 }}>
            {t('nav.games')}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}

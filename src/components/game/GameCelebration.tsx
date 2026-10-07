// The win screen every game ends on. Built from the same forest-overlay +
// Kina-cheer pattern as ComicReader's finished screen, so a child recognises
// "I did it" the same way whether they just read a story or won a game.

import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/context';
import Kina from '../characters/Kina';
import type { StickerInfo } from '../../data/stickers';
import { FRIEND_ART } from './art/Friends';

const SPRING = { type: 'spring' as const, stiffness: 900, damping: 34, mass: 0.5 };

interface GameCelebrationProps {
  onPlayAgain: () => void;
  scoreLabel?: string;
  /**
   * Optional slot between the score and the buttons. Used for a Connect step —
   * something to do with a grown-up before playing again (Architecture §11).
   */
  extra?: ReactNode;
  /** The sticker this game just earned, if it gives one. */
  sticker?: { sticker: StickerInfo; isNew: boolean } | null;
}

/** The earned sticker, flipping in. Tapping it opens the sticker book. */
function EarnedSticker({ sticker, isNew }: { sticker: StickerInfo; isNew: boolean }) {
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const Art = FRIEND_ART[sticker.id];
  return (
    <motion.button
      onClick={() => navigate('/stickers')}
      aria-label={t('stickers.open')}
      initial={{ scale: 0, rotate: -30 }}
      animate={{ scale: 1, rotate: -4 }}
      transition={{ type: 'spring', stiffness: 260, damping: 12, delay: 0.5 }}
      className="mt-5 flex items-center gap-3 rounded-[22px] pl-2 pr-5 py-2"
      style={{ background: '#FFFFFF', boxShadow: '0 6px 0 #0B2A1D' }}
    >
      <span className="rounded-[16px] grid place-items-center" style={{ width: 72, height: 72, background: sticker.tone }}>
        <svg viewBox="-50 -50 100 100" style={{ width: 62, height: 62 }} aria-hidden>
          {Art && <Art />}
        </svg>
      </span>
      <span className="text-left">
        <span className="block font-body font-black text-[12px] tracking-[.08em] uppercase" style={{ color: '#2FBF6B' }}>
          {isNew ? t('stickers.new') : t('stickers.another')}
        </span>
        <span className="block font-display font-extrabold" style={{ fontSize: 22, color: '#17543C' }}>
          {sticker.name[language]}
        </span>
      </span>
    </motion.button>
  );
}

export default function GameCelebration({ onPlayAgain, scoreLabel, extra, sticker }: GameCelebrationProps) {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain"
      style={{ background: '#17543C' }}
    >
      {/* min-h-full + centring: centred on a tall phone, scrollable on a short
          one (a sticker and a Kina Challenge can make it taller than a screen). */}
      <div className="min-h-full flex flex-col items-center justify-center p-6 pt-safe pb-safe text-center">
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 14, mass: 0.9 }}
        className="mt-6"
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

      {sticker && <EarnedSticker sticker={sticker.sticker} isNew={sticker.isNew} />}

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
      </div>
    </motion.div>
  );
}

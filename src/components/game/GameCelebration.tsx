import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/context';

interface GameCelebrationProps {
  onPlayAgain: () => void;
  scoreLabel?: string;
}

const CONFETTI_COLORS = ['#FFD700', '#E91E63', '#00BCD4', '#4CAF50'];

export default function GameCelebration({ onPlayAgain, scoreLabel }: GameCelebrationProps) {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-gradient-to-b from-secondary to-accent-warm flex flex-col items-center justify-center p-6 text-center overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-6 rounded-sm animate-bounce"
            style={{
              left: `${(i * 5.3) % 100}%`,
              top: `${(i * 13.7) % 100}%`,
              animationDelay: `${(i % 5) * 0.2}s`,
              backgroundColor: CONFETTI_COLORS[i % 4],
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="text-8xl mb-6 z-10"
      >
        ⭐
      </motion.div>

      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="z-10">
        <h1 className="font-headline text-4xl text-white font-bold mb-2 drop-shadow-lg">
          {t('quiz.success')}
        </h1>
        <p className="font-body text-xl text-white/90 font-bold mb-2">{t('game.earned_star')}</p>
        {scoreLabel && (
          <p className="font-body text-lg text-white/80 font-bold mb-8">{t('game.score')}: {scoreLabel}</p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex flex-col gap-4 w-full max-w-xs z-10 mt-8"
      >
        <button
          onClick={onPlayAgain}
          className="bg-primary text-white font-headline font-bold text-xl px-8 py-4 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform"
        >
          {t('game.playAgain')}
        </button>
        <button
          onClick={() => navigate('/games')}
          className="bg-transparent border-2 border-white text-white font-headline font-bold text-xl px-8 py-4 rounded-full hover:bg-white/10 active:scale-95 transition-all"
        >
          {t('nav.games')}
        </button>
      </motion.div>
    </motion.div>
  );
}

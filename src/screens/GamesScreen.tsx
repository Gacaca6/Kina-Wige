import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/context';
import { useProgress } from '../hooks/useProgress';
import BottomNav from '../components/ui/BottomNav';
import { games } from '../data/games';

export default function GamesScreen() {
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const { gamePlayCount } = useProgress();

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="min-h-screen pb-24">
      <header className="bg-surface flex justify-between items-center w-full px-6 py-4 sticky top-0 z-40">
        <h1 className="text-2xl font-black text-primary font-headline tracking-tight">{t('home.games')}</h1>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">{games.length}</div>
      </header>

      <div className="bg-accent-warm text-white px-6 py-3 text-center font-headline font-bold shadow-md">
        {t('games.subtitle')}
      </div>

      <main className="px-6 py-6 max-w-lg mx-auto space-y-5">
        {games.map(game => (
          <button
            key={game.id}
            onClick={() => navigate(`/game/${game.id}`)}
            className="group bg-white rounded-2xl p-4 shadow-lg hover:scale-[1.02] transition-transform duration-300 text-left w-full border-2 border-transparent hover:border-primary/20 flex items-center gap-4"
          >
            <div className={`w-24 h-24 rounded-xl overflow-hidden relative ${game.color} flex-shrink-0 flex items-center justify-center`}>
              <span className="text-5xl">{game.emoji}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-headline font-bold text-xl text-primary">{game.title[language]}</h4>
                {gamePlayCount(game.id) > 0 && (
                  <span className="bg-accent/20 text-accent-warm px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap">
                    ⭐ ×{gamePlayCount(game.id)}
                  </span>
                )}
              </div>
              <span className="text-sm font-bold text-dark/60 block mb-3">{game.skill[language]}</span>
              <div className="bg-primary text-white text-center py-2 rounded-full font-bold text-sm group-hover:bg-primary-light transition-colors">
                {t('games.play')}
              </div>
            </div>
          </button>
        ))}
      </main>
      <BottomNav />
    </motion.div>
  );
}

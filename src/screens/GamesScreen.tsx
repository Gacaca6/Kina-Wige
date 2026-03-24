import React from 'react';
import { motion } from 'motion/react';
import { Star, Bug } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/context';
import { useStars } from '../hooks/useStars';
import BottomNav from '../components/ui/BottomNav';

export default function GamesScreen() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { stars } = useStars();

  const lockedGames = [
    { title: "Hitamo Ibiryo", category: "\u{1F957} Imirire" },
    { title: "Saranganya", category: "\u{1F91D} Imyitwarire" },
    { title: "Koza Amenyo", category: "\u{1FAE7} Isuku" },
    { title: "Bara 1-10", category: "\u{1F522} Kubara" },
    { title: "Shakisha Amabara", category: "\u{1F3A8} Kwiga" },
  ];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="min-h-screen pb-24">
      <header className="bg-surface flex justify-between items-center w-full px-6 py-4 sticky top-0 z-40">
        <h1 className="text-2xl font-black text-primary font-headline tracking-tight">{t('home.games')}</h1>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">1/6</div>
      </header>

      <div className="bg-accent-warm text-white px-6 py-3 text-center font-headline font-bold shadow-md">
        Imikino igufasha kwiga!
      </div>

      <main className="px-6 py-6 max-w-lg mx-auto space-y-6">
        {/* Active Game */}
        <button
          onClick={() => navigate('/game/1')}
          className="group bg-white rounded-2xl p-4 shadow-lg hover:scale-[1.02] transition-transform duration-300 text-left w-full border-2 border-transparent hover:border-primary/20 flex items-center gap-4"
        >
          <div className="w-24 h-24 rounded-xl overflow-hidden relative bg-primary-light flex-shrink-0 flex items-center justify-center">
            <Bug className="w-12 h-12 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-headline font-bold text-xl text-primary mb-1">Karaba Amaboko!</h4>
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-accent fill-current" />
              <span className="text-sm font-bold text-dark/70">High Score: {stars}</span>
            </div>
            <div className="bg-primary text-white text-center py-2 rounded-full font-bold text-sm group-hover:bg-primary-light transition-colors">
              Play Now
            </div>
          </div>
        </button>

        {/* Locked Games */}
        {lockedGames.map((game, i) => (
          <div key={i} className="bg-white/50 rounded-2xl p-4 border-2 border-dashed border-primary/20 grayscale opacity-70 relative overflow-hidden flex items-center gap-4">
            <div className="absolute inset-0 bg-white/40 z-10 flex items-center justify-center backdrop-blur-[1px]">
              <span className="font-headline font-bold text-dark bg-white/80 px-4 py-1 rounded-full flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                {t('coming_soon')}
              </span>
            </div>
            <div className="w-24 h-24 rounded-xl overflow-hidden relative bg-surface-warm flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-headline font-bold text-lg text-dark mb-1">{game.title}</h4>
              <span className="text-sm font-bold text-dark/60 block">{game.category}</span>
            </div>
          </div>
        ))}
      </main>
      <BottomNav />
    </motion.div>
  );
}

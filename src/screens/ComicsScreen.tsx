import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/context';
import { useProgress } from '../hooks/useProgress';
import { comics, upcomingComics } from '../data/comics';
import BottomNav from '../components/ui/BottomNav';

export default function ComicsScreen() {
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const { isComicRead } = useProgress();

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="min-h-screen pb-24">
      <header className="bg-surface flex justify-between items-center w-full px-6 py-4 sticky top-0 z-40">
        <h1 className="text-2xl font-black text-primary font-headline tracking-tight">{t('comics.title')}</h1>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">{comics.length}</div>
      </header>

      <div className="bg-secondary text-white px-6 py-3 text-center font-headline font-bold shadow-md">
        {t('comics.subtitle')}
      </div>

      <main className="px-6 py-6 max-w-lg mx-auto space-y-6">
        {comics.map(comic => (
          <button
            key={comic.id}
            onClick={() => navigate(`/comic/${comic.id}`)}
            className="group bg-white rounded-2xl p-2 shadow-lg hover:scale-[1.02] transition-transform duration-300 text-left w-full border-2 border-transparent hover:border-primary/20"
          >
            <div className="aspect-video rounded-xl overflow-hidden relative mb-3 bg-surface-warm flex items-center justify-center">
              <img src={comic.cover} alt={comic.title[language]} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <BookOpen className="w-14 h-14 text-white" />
              </div>
            </div>
            <div className="px-2 pb-2">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-headline font-bold text-xl text-primary">{comic.title[language]}</h4>
                {isComicRead(comic.id) && (
                  <span className="bg-secondary/20 text-secondary px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 whitespace-nowrap">
                    <Check className="w-3 h-3" strokeWidth={3} /> ✓
                  </span>
                )}
              </div>
              <span className="text-sm font-bold text-secondary block mb-1">{comic.category[language]}</span>
              {comic.attribution && (
                <span className="text-[10px] text-dark/40 block mb-2 leading-tight">{comic.attribution}</span>
              )}
              <div className="bg-primary text-white text-center py-2 rounded-full font-bold text-sm group-hover:bg-primary-light transition-colors flex items-center justify-center gap-2">
                <BookOpen className="w-4 h-4" /> {t('comics.read')}
              </div>
            </div>
          </button>
        ))}

        {upcomingComics.map((c, i) => (
          <div key={i} className="bg-white/50 rounded-2xl p-2 border-2 border-dashed border-primary/20 grayscale opacity-70 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/40 z-10 flex flex-col items-center justify-center backdrop-blur-[1px]">
              <span className="font-headline font-bold text-dark bg-white/80 px-4 py-1 rounded-full">{t('coming_soon')}</span>
            </div>
            <div className="aspect-video rounded-xl overflow-hidden relative bg-surface-warm mb-3 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-primary/30" />
            </div>
            <div className="px-2 pb-2">
              <h4 className="font-headline font-bold text-xl text-dark mb-1">{c.title}</h4>
              <span className="text-sm font-bold text-dark/60 block">{c.category[language]}</span>
            </div>
          </div>
        ))}
      </main>
      <BottomNav />
    </motion.div>
  );
}

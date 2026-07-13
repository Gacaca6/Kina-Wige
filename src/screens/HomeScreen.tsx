import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, PlayCircle, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/context';
import { useStars } from '../hooks/useStars';
import { useProgress } from '../hooks/useProgress';
import { images } from '../assets/images';
import { episodes, upcomingEpisodes } from '../data/episodes';
import BottomNav from '../components/ui/BottomNav';
import Logo from '../components/ui/Logo';

export default function HomeScreen() {
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const { stars } = useStars();
  const { isEpisodeWatched } = useProgress();
  const [activeAvatar, setActiveAvatar] = useState<'keza' | 'hirwa'>('keza');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex flex-col pb-24">
      <header className="bg-surface flex justify-between items-center w-full px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveAvatar(prev => prev === 'keza' ? 'hirwa' : 'keza')}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary shadow-sm active:scale-95 transition-transform"
          >
            <img
              src={activeAvatar === 'keza' ? images.kezaAvatar : images.hirwaAvatar}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </button>
          <div className="flex items-center gap-1 bg-surface-container-lowest px-3 py-1.5 rounded-full shadow-sm">
            <Star className="w-4 h-4 text-tertiary-fixed-dim fill-current" />
            <span className="font-headline font-bold text-primary text-sm">{stars}</span>
          </div>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2">
          <Logo variant="header" />
        </div>
        <button onClick={() => navigate('/settings')} aria-label={t('settings.title')} className="w-10 h-10 flex items-center justify-center text-primary hover:scale-105 transition-transform active:scale-95 bg-secondary-container rounded-full">
          <Settings className="w-5 h-5" />
        </button>
      </header>

      <section className="relative h-[397px] hillside-gradient overflow-hidden flex flex-col items-center justify-center px-6 text-center">
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-primary-fixed-dim/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-5%] w-80 h-80 bg-tertiary-fixed/10 rounded-full blur-3xl" />

        <div className="flex items-end justify-center gap-4 mb-6 z-10">
          <div className="relative w-32 h-32 md:w-48 md:h-48">
            <img src={images.kezaFull} alt="Keza" className="w-full h-full object-contain drop-shadow-2xl" />
          </div>
          <div className="relative w-32 h-32 md:w-48 md:h-48">
            <img src={images.hirwaFull} alt="Hirwa" className="w-full h-full object-contain drop-shadow-2xl" />
          </div>
        </div>
        <h2 className="font-display text-3xl md:text-5xl text-white font-bold tracking-tight drop-shadow-md z-10">
          {t('home.greeting')}
        </h2>
        <p className="text-on-primary-container/80 mt-2 font-medium z-10">{t('home.welcome_subtitle')}</p>
      </section>

      <section className="px-6 -mt-8 relative z-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-2xl text-primary font-bold">{t('home.episodes')}</h3>
            <div className="h-1 flex-grow mx-4 bg-outline-variant/15 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {episodes.map(ep => (
              <button
                key={ep.id}
                onClick={() => navigate(`/episode/${ep.id}`)}
                className="group bg-surface-container-lowest rounded-lg p-1 shadow-[0_24px_48px_-12px_rgba(0,33,19,0.06)] hover:scale-[1.02] transition-transform duration-300 text-left w-full"
              >
                <div className="aspect-video rounded-lg overflow-hidden relative">
                  <img src={ep.thumb} alt={ep.title[language]} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="w-16 h-16 text-white" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-headline font-bold text-lg text-primary">{ep.title[language]}</h4>
                    <div className="bg-tertiary-fixed px-3 py-1 rounded-full text-xs font-bold text-on-tertiary-fixed flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" /> {isEpisodeWatched(ep.id) ? '1/1' : '0/1'}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-secondary">{ep.category[language]}</span>
                </div>
              </button>
            ))}

            {upcomingEpisodes.slice(0, 2).map((ep, i) => (
              <div key={i} className="bg-surface-container-low/50 rounded-lg p-1 border-2 border-dashed border-outline-variant/30 grayscale opacity-80">
                <div className="aspect-video rounded-lg overflow-hidden relative bg-surface-dim flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-outline rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-outline rounded-full" />
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-headline font-bold text-lg text-outline">{ep.title}</h4>
                  <span className="text-xs font-bold text-outline uppercase tracking-wider">{t('coming_soon')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BottomNav />
    </motion.div>
  );
}

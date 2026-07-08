import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, ArrowLeft, Users } from 'lucide-react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { useI18n } from '../i18n/context';
import { useStars } from '../hooks/useStars';
import { useProgress } from '../hooks/useProgress';
import { images } from '../assets/images';
import { getEpisode } from '../data/episodes';
import { cacheEpisodeClips } from '../pwa/prefetchVideos';
import BottomNav from '../components/ui/BottomNav';
import VisualQuiz from '../components/game/VisualQuiz';
import VideoPlayer from '../components/game/VideoPlayer';

export default function EpisodeScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t, language } = useI18n();
  const { stars } = useStars();
  const { markEpisodeWatched } = useProgress();

  const episode = getEpisode(id);

  // Save this episode's videos for offline use the first time it's opened.
  // Harmless for already-prefetched episodes (cache.add is skipped if present).
  useEffect(() => {
    if (episode) void cacheEpisodeClips(episode.clips);
  }, [episode]);

  if (!episode) {
    return <Navigate to="/episodes" replace />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen pb-24">
      <header className="bg-surface text-primary sticky top-0 z-50 flex justify-between items-center w-full px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/episodes')} aria-label="Back to episodes" className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low hover:scale-105 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-headline font-bold tracking-tight text-xl">{episode.title[language]}</h1>
        </div>
        <div className="flex items-center gap-2 bg-tertiary-fixed px-4 py-2 rounded-full">
          <Star className="w-5 h-5 text-on-tertiary-fixed-variant fill-current" />
          <span className="font-bold text-on-tertiary-fixed-variant">{stars}</span>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-6 py-6 space-y-8">
        <section className="relative group">
          <VideoPlayer
            clips={episode.clips}
            poster={episode.poster}
            onAllClipsEnded={() => markEpisodeWatched(episode.id)}
          />
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary-container rounded-full -z-10 opacity-50 blur-xl" />
        </section>

        <section className="flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2 bg-[#d1e8ff] text-[#004a77] px-6 py-3 rounded-full font-bold shadow-sm">
            <span className="text-xl">{'\u{1FAE7}'}</span>
            <span>{t('episode.what_you_learn')}</span>
          </div>
          <div className="flex items-center gap-2 bg-[#e8ffd1] text-[#4a7700] px-6 py-3 rounded-full font-bold shadow-sm">
            <span className="text-xl">{'\u{1F91D}'}</span>
            <span>{episode.category[language]}</span>
          </div>
        </section>

        {episode.gameId && (
          <section className="bg-surface-container-low p-8 rounded-lg relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="space-y-2 text-center md:text-left">
                <h2 className="text-3xl font-headline font-extrabold text-primary tracking-tight">{t('episode.playIntro')}</h2>
                <p className="text-primary-container font-medium">{t('episode.playSub')}</p>
              </div>
              <button
                onClick={() => navigate(`/game/${episode.gameId}`)}
                className="bg-primary text-on-primary px-10 py-5 rounded-full font-headline font-bold text-xl hover:scale-105 transition-transform active:scale-95 shadow-[0_12px_24px_-8px_rgba(15,82,56,0.4)] border-b-4 border-primary-fixed-variant"
              >
                {t('episode1.play')}
              </button>
            </div>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-surface-container-highest rounded-full opacity-30" />
            <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-tertiary-fixed rounded-full opacity-40" />
          </section>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-lg text-sm font-bold uppercase tracking-widest">{t('episode.story')}</div>
            <p className="text-lg leading-relaxed text-on-surface font-medium">
              {episode.story[language]}
            </p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_24px_48px_-12px_rgba(0,33,19,0.06)]">
            <h3 className="text-primary font-bold mb-6 flex items-center gap-2">
              <Users className="w-5 h-5" />
              {t('episode.characters')}
            </h3>
            <div className="flex -space-x-4">
              <div className="w-16 h-16 rounded-full border-4 border-surface-container-lowest overflow-hidden bg-secondary-container">
                <img src={images.kezaAvatar} alt="Keza" className="w-full h-full object-cover" />
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-surface-container-lowest overflow-hidden bg-primary-container">
                <img src={images.hirwaAvatar} alt="Hirwa" className="w-full h-full object-cover" />
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-surface-container-lowest overflow-hidden bg-tertiary-container">
                <img src={images.mama} alt="Mama" className="w-full h-full object-cover" />
              </div>
            </div>
            <p className="mt-4 text-sm text-outline font-medium">Keza, Hirwa, na Mama baragutegereje!</p>
          </div>
        </section>

        {episode.hasQuiz && <VisualQuiz onComplete={() => {}} />}
      </main>

      <BottomNav />
    </motion.div>
  );
}

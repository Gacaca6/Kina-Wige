// 08 · Lesson player — the videos.
//
// Rebuilt on the design system. The video is the hero and everything else is
// quiet beneath it. Controls are oversized and forgiving; a pre-reader operates
// this with pictures alone.
//
// The offline behaviour is unchanged and load-bearing: opening an episode
// caches its clips (cacheEpisodeClips) so it plays with no connectivity next
// time, and finishing marks it watched.

import { useEffect } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useI18n } from '../i18n/context';
import { useProgress } from '../hooks/useProgress';
import { getEpisode } from '../data/episodes';
import { cacheEpisodeClips } from '../pwa/prefetchVideos';
import { KidShell } from '../components/ui/Shell';
import VideoPlayer from '../components/game/VideoPlayer';
import VisualQuiz from '../components/game/VisualQuiz';
import Kina from '../components/characters/Kina';

const SPRING = { type: 'spring' as const, stiffness: 900, damping: 34, mass: 0.5 };

export default function EpisodeScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t, language } = useI18n();
  const { markEpisodeWatched, isEpisodeWatched } = useProgress();

  const episode = getEpisode(id);

  // Save this episode's videos for offline use the first time it's opened.
  // Harmless for already-prefetched episodes (cache.add is skipped if present).
  useEffect(() => {
    if (episode) void cacheEpisodeClips(episode.clips);
  }, [episode]);

  if (!episode) return <Navigate to="/episodes" replace />;

  const watched = isEpisodeWatched(episode.id);

  return (
    <KidShell title={episode.title[language]} onBack={() => navigate('/episodes')}>
      <div className="px-4 py-4 flex flex-col gap-4">
        {/* ── The video. Framed in ink so it reads as a screen, not a card. ── */}
        <div
          className="overflow-hidden bg-ink"
          style={{ borderRadius: 26, boxShadow: '0 8px 0 #0B1A12' }}
        >
          <VideoPlayer
            clips={episode.clips}
            poster={episode.poster}
            onAllClipsEnded={() => markEpisodeWatched(episode.id)}
          />
        </div>

        {/* ── Category + offline badge ── */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="font-body font-black px-4 py-2 rounded-[14px]"
            style={{ fontSize: 13, background: '#E7F7EE', color: '#246428' }}
          >
            {episode.category[language]}
          </span>
          <span
            className="font-body font-black px-4 py-2 rounded-[14px] flex items-center gap-2"
            style={{ fontSize: 13, background: '#EFEBE1', color: '#6B7F73' }}
          >
            ⭳ {language === 'KN' ? 'Iri kuri telefone' : language === 'FR' ? 'Sur ce téléphone' : 'Saved on this phone'}
          </span>
          {watched && (
            <span
              className="font-body font-black px-4 py-2 rounded-[14px]"
              style={{ fontSize: 13, background: '#2FBF6B', color: '#fff' }}
            >
              ✓ {language === 'KN' ? 'Byarangiye' : language === 'FR' ? 'Terminé' : 'Watched'}
            </span>
          )}
        </div>

        {/* ── The story, told by Kina ── */}
        <div className="flex items-start gap-3">
          <div className="flex-none pt-1">
            <Kina mood="idle" style={{ width: 64, height: 58 }} />
          </div>
          <div
            className="flex-1 bg-white px-4 py-4"
            style={{ borderRadius: '22px 22px 22px 6px', boxShadow: '0 5px 0 #DDD6C8' }}
          >
            <p className="font-body font-bold text-ink" style={{ fontSize: 15, lineHeight: 1.55 }}>
              {episode.story[language]}
            </p>
          </div>
        </div>

        {/* ── Play the matching game ── */}
        {episode.gameId && (
          <motion.button
            onClick={() => navigate(`/game/${episode.gameId}`)}
            aria-label={t('a11y.playGame')}
            whileTap={{ y: 6, boxShadow: '0 2px 0 #D89A00' }}
            transition={SPRING}
            className="w-full rounded-[24px] flex items-center gap-4 px-5"
            style={{ background: '#FFC02E', boxShadow: '0 8px 0 #D89A00', minHeight: 88 }}
          >
            <span
              className="rounded-[18px] bg-ink grid place-items-center flex-none"
              style={{ width: 56, height: 56, fontSize: 26 }}
            >
              🎮
            </span>
            <span className="text-left">
              <span className="block font-display font-extrabold text-ink" style={{ fontSize: 21, lineHeight: 1.1 }}>
                {language === 'KN' ? 'Kina umukino' : language === 'FR' ? 'Jouer au jeu' : 'Play the game'}
              </span>
              <span className="block font-body font-extrabold" style={{ fontSize: 12, color: '#8A6A00' }}>
                {language === 'KN' ? 'Ibyo wize, ubikinishe' : language === 'FR' ? 'Mets-le en pratique' : 'Practise what you watched'}
              </span>
            </span>
          </motion.button>
        )}

        {episode.hasQuiz && <VisualQuiz onComplete={() => {}} />}

        {/* Licence note — required for CC content, and never hidden. */}
        {episode.attribution && (
          <p className="font-body font-bold px-1" style={{ fontSize: 12, color: '#8A9A90' }}>
            {episode.attribution}
          </p>
        )}
      </div>
    </KidShell>
  );
}

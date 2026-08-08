// Amasomo — the lessons/videos shelf.
//
// Same card language as Stories so the app reads as one product, with the
// play badge and category chip carrying the difference.

import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { KidShell } from '../components/ui/Shell';
import { episodes } from '../data/episodes';
import { useI18n } from '../i18n/context';
import { useProgress } from '../hooks/useProgress';

export default function EpisodeListScreen() {
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const { isEpisodeWatched } = useProgress();

  return (
    <KidShell title={t('nav.episodes')} hint={t('screen.videos.hint')} onBack={() => navigate('/home-path')}>
      <div className="px-4 py-5 flex flex-col gap-4">
        {episodes.map((e) => {
          const watched = isEpisodeWatched(e.id);
          return (
            <motion.button
              key={e.id}
              onClick={() => navigate(`/episode/${e.id}`)}
              aria-label={e.title[language]}
              whileTap={{ y: 6, boxShadow: '0 2px 0 #D9D2C4' }}
              transition={{ type: 'spring', stiffness: 900, damping: 34, mass: 0.5 }}
              className="bg-white rounded-[26px] flex items-center gap-4 p-3 text-left"
              style={{ boxShadow: '0 8px 0 #D9D2C4', minHeight: 116 }}
            >
              <span
                className="relative rounded-[20px] overflow-hidden flex-none grid place-items-center"
                style={{ width: 112, height: 92, background: '#E7F7EE' }}
              >
                {e.thumb && <img src={e.thumb} alt="" className="absolute inset-0 w-full h-full object-cover" />}
                <span
                  className="relative rounded-full grid place-items-center"
                  style={{ width: 46, height: 46, background: '#2FBF6B', boxShadow: '0 4px 0 #1E8C4C' }}
                >
                  <span
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: '16px solid #fff',
                      borderTop: '10px solid transparent',
                      borderBottom: '10px solid transparent',
                      marginLeft: 4,
                    }}
                  />
                </span>
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-display font-extrabold text-ink leading-tight" style={{ fontSize: 19 }}>
                  {e.title[language]}
                </span>
                <span
                  className="inline-block font-body font-black text-[12px] mt-2 px-3 py-1 rounded-[12px]"
                  style={{ background: '#E7F7EE', color: '#246428' }}
                >
                  {e.category[language]}
                </span>
              </span>
              {watched && (
                <span
                  className="rounded-full grid place-items-center flex-none"
                  style={{ width: 44, height: 44, background: '#2FBF6B' }}
                  aria-label={t('a11y.watched')}
                >
                  <span
                    className="block border-l-[5px] border-b-[5px] border-white rounded-[2px]"
                    style={{ width: 20, height: 11, transform: 'rotate(-45deg) translateY(-2px)' }}
                  />
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </KidShell>
  );
}

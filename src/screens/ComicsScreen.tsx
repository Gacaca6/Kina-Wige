// Inkuru — the story shelf.
//
// Grape is the Stories colour in the system, so it leads here and nowhere else.
// Big cover, big title, a clear tick when a story has been read.

import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { KidShell } from '../components/ui/Shell';
import { comics } from '../data/comics';
import { useI18n } from '../i18n/context';
import { useProgress } from '../hooks/useProgress';

export default function ComicsScreen() {
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const { isComicRead } = useProgress();

  return (
    <KidShell title={t('nav.comics')} hint={t('screen.stories.hint')} onBack={() => navigate('/home-path')}>
      <div className="px-4 py-5 flex flex-col gap-4">
        {comics.map((c) => {
          const read = isComicRead(c.id);
          return (
            <motion.button
              key={c.id}
              onClick={() => navigate(`/comic/${c.id}`)}
              aria-label={c.title[language]}
              whileTap={{ y: 6, boxShadow: '0 2px 0 #D9D2C4' }}
              transition={{ type: 'spring', stiffness: 900, damping: 34, mass: 0.5 }}
              className="bg-white rounded-[26px] flex items-center gap-4 p-3 text-left"
              style={{ boxShadow: '0 8px 0 #D9D2C4', minHeight: 116 }}
            >
              <span
                className="rounded-[20px] overflow-hidden flex-none grid place-items-center"
                style={{ width: 96, height: 96, background: '#EDE7F6' }}
              >
                {c.cover ? (
                  <img src={c.cover} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span style={{ fontSize: 40 }}>📖</span>
                )}
              </span>
              <span className="flex-1 min-w-0">
                <span
                  className="block font-display font-extrabold text-ink leading-tight"
                  style={{ fontSize: 20 }}
                >
                  {c.title[language]}
                </span>
                <span className="block font-body font-extrabold text-[13px] mt-1" style={{ color: '#6B7F73' }}>
                  {c.category[language]} · {c.panels.length}
                </span>
                {c.attribution && (
                  <span className="block font-body font-bold text-[11px] mt-1" style={{ color: '#8A9A90' }}>
                    {c.attribution}
                  </span>
                )}
              </span>
              {read && (
                <span
                  className="rounded-full grid place-items-center flex-none"
                  style={{ width: 44, height: 44, background: '#2FBF6B' }}
                  aria-label="Read"
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

// Imikino — the play hub.
//
// Built entirely from the design system: sand canvas, forest header, chunky
// cards on solid bottom shadows, the one shared bottom nav. Picture first,
// word second — a pre-reader picks a game by its colour and shape.

import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { KidShell } from '../components/ui/Shell';
import { games } from '../data/games';
import { useI18n } from '../i18n/context';
import { useProgress } from '../hooks/useProgress';
import { useStickers } from '../hooks/useStickers';
import { STICKERS } from '../data/stickers';
import { FRIEND_ART } from '../components/game/art/Friends';

/* Subject colours from the system — one per game, stable so children learn them. */
const TONES = [
  { bg: '#2FBF6B', shadow: '#1E8C4C' },
  { bg: '#9B6BFF', shadow: '#6F43C9' },
  { bg: '#35A7E8', shadow: '#1D7BB3' },
  { bg: '#FF6B4A', shadow: '#CC4A2E' },
  { bg: '#FFC02E', shadow: '#D89A00' },
];

export default function GamesScreen() {
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const { gamePlayCount } = useProgress();
  const { count, total } = useStickers();

  return (
    <KidShell title={t('nav.games')} hint={t('screen.games.hint')} onBack={() => navigate('/home-path')}>
      {/* The sticker book: what finishing games adds up to. */}
      <div className="px-4 pt-5">
        <motion.button
          onClick={() => navigate('/stickers')}
          aria-label={t('stickers.open')}
          whileTap={{ y: 5, boxShadow: '0 2px 0 #D9D2C4' }}
          transition={{ type: 'spring', stiffness: 900, damping: 34, mass: 0.5 }}
          className="w-full rounded-[26px] bg-white flex items-center gap-3 px-4"
          style={{ minHeight: 84, boxShadow: '0 7px 0 #D9D2C4' }}
        >
          <span className="flex -space-x-3 flex-none" aria-hidden>
            {STICKERS.slice(0, 3).map((s, i) => {
              const Art = FRIEND_ART[s.id];
              const have = count(s.id) > 0;
              return (
                <span key={s.id} className="rounded-[14px] grid place-items-center border-[3px] border-white"
                  style={{ width: 52, height: 52, background: have ? s.tone : '#EFEBE1', transform: `rotate(${(i - 1) * 8}deg)` }}>
                  <svg viewBox="-50 -50 100 100" style={{ width: 42, height: 42, filter: have ? undefined : 'brightness(0) opacity(0.15)' }}>
                    {Art && <Art />}
                  </svg>
                </span>
              );
            })}
          </span>
          <span className="flex-1 text-left">
            <span className="block font-display font-extrabold" style={{ fontSize: 19, color: '#17543C' }}>{t('stickers.title')}</span>
            <span className="block font-body font-black text-[13px]" style={{ color: '#6B7F73' }}>
              {total} {t('stickers.count')} {STICKERS.length}
            </span>
          </span>
          <svg viewBox="0 0 24 24" style={{ width: 26, height: 26 }} fill="none" stroke="#17543C" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M9 6l6 6-6 6" />
          </svg>
        </motion.button>
      </div>
      <div className="px-4 py-5 grid grid-cols-2 gap-4">
        {games.map((g, i) => {
          const tone = TONES[i % TONES.length];
          const played = gamePlayCount(g.id);
          return (
            <motion.button
              key={g.id}
              onClick={() => navigate(`/game/${g.id}`)}
              aria-label={g.title[language]}
              whileTap={{ y: 6, boxShadow: `0 2px 0 ${tone.shadow}` }}
              transition={{ type: 'spring', stiffness: 900, damping: 34, mass: 0.5 }}
              className="rounded-[26px] flex flex-col items-center justify-center gap-2 p-4 text-white"
              style={{ background: tone.bg, boxShadow: `0 8px 0 ${tone.shadow}`, minHeight: 168 }}
            >
              <span
                className="rounded-[20px] bg-white grid place-items-center flex-none"
                style={{ width: 72, height: 72, fontSize: 38, lineHeight: 1 }}
              >
                {g.emoji}
              </span>
              <span className="font-display font-extrabold text-center leading-tight" style={{ fontSize: 17 }}>
                {g.title[language]}
              </span>
              {played > 0 && <span className="font-body font-black text-[11px] text-white/85">★ {played}</span>}
            </motion.button>
          );
        })}
      </div>
    </KidShell>
  );
}

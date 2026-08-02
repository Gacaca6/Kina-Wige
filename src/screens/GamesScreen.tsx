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
  const { language } = useI18n();
  const { gamePlayCount } = useProgress();

  return (
    <KidShell title="Imikino" hint="Games · pick one to play" onBack={() => navigate('/home-path')}>
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

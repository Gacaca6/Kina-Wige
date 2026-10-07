// Igitabo cy'udushushanyo — the sticker book.
//
// Every finished game adds a sticker. A sticker never goes away; there is
// nothing to spend them on and nothing to lose (docs/GAMES-DESIGN.md §4.6).
// Stickers not yet earned show as a soft shadow, so a child can see there is
// more to find without being told they are missing something.

import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { KidShell } from '../components/ui/Shell';
import { STICKERS } from '../data/stickers';
import { FRIEND_ART } from '../components/game/art/Friends';
import { useStickers } from '../hooks/useStickers';
import { useI18n } from '../i18n/context';

export default function StickerBookScreen() {
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const { count, total } = useStickers();

  return (
    <KidShell
      title={t('stickers.title')}
      hint={`${total} ${t('stickers.count')} ${STICKERS.length} · ${t('stickers.hint')}`}
      onBack={() => navigate('/games')}
      nav={false}
    >
      <div className="px-4 py-5 grid grid-cols-3 gap-3">
        {STICKERS.map((s, i) => {
          const n = count(s.id);
          const Art = FRIEND_ART[s.id];
          return (
            <motion.div
              key={s.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: Math.min(i, 12) * 0.03, type: 'spring', stiffness: 400, damping: 22 }}
              className="relative rounded-[22px] flex flex-col items-center pt-2 pb-2 px-1"
              style={{
                background: n ? s.tone : '#E4DDCE',
                boxShadow: n ? '0 5px 0 #D9D2C4' : 'none',
                transform: n ? `rotate(${(i % 3) - 1}deg)` : undefined,
              }}
            >
              <svg
                viewBox="-50 -50 100 100"
                style={{ width: '82%', aspectRatio: '1 / 1', height: 'auto', filter: n ? undefined : 'brightness(0) opacity(0.13)' }}
                aria-hidden
              >
                {Art && <Art />}
              </svg>
              <span
                className="font-display font-extrabold text-center leading-tight mt-1"
                style={{ fontSize: 13, color: n ? '#17543C' : 'transparent', minHeight: 32 }}
              >
                {n ? s.name[language] : ''}
              </span>
              {n > 1 && (
                <span
                  className="absolute -top-1 -right-1 rounded-full font-body font-black text-white grid place-items-center"
                  style={{ minWidth: 28, height: 28, padding: '0 6px', background: '#FF6B4A', border: '3px solid #fff', fontSize: 13 }}
                >
                  ×{n}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </KidShell>
  );
}

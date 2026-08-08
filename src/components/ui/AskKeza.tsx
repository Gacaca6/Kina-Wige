// Baza Keza — the on-screen ask button.
//
// It lives ON the screen rather than in the bottom nav, so asking a question is
// always one tap away without spending a nav slot on it.
//
// Lane-aware by design: it belongs to the CHILD's world only. It must never
// appear in the grown-up area (blue = an adult is holding this phone) and never
// on top of a lesson, a game or a reader, where it would cover the activity.

import { useNavigate, useLocation } from 'react-router-dom';
import { useI18n } from '../../i18n/context';
import { motion } from 'motion/react';

/** Screens that own the whole viewport, or belong to grown-ups. */
const HIDDEN_ON = [
  '/', // splash
  '/baza-keza', // already here
  '/parents',
  '/plan',
  '/settings',
  '/lesson',
  '/game/',
  '/comic/',
];

export default function AskKeza() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (HIDDEN_ON.some((p) => (p === '/' ? pathname === '/' : pathname.startsWith(p)))) {
    return null;
  }

  return (
    <motion.button
      onClick={() => navigate('/baza-keza')}
      aria-label={t('a11y.askKeza')}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15, mass: 0.9, delay: 0.4 }}
      whileTap={{ y: 5, boxShadow: '0 2px 0 #D89A00' }}
      className="fixed z-40 rounded-full grid place-items-center"
      style={{
        right: 16,
        // Clear of the bottom nav (84px) and the home indicator.
        bottom: 'calc(104px + env(safe-area-inset-bottom))',
        width: 72,
        height: 72,
        background: '#FFC02E',
        boxShadow: '0 7px 0 #D89A00',
      }}
    >
      <svg viewBox="0 0 48 48" style={{ width: 38, height: 38 }} aria-hidden>
        <path
          d="M18 18a6 6 0 1 1 8 5.7V27"
          stroke="#10241B"
          strokeWidth={5}
          strokeLinecap="round"
          fill="none"
        />
        <circle cx={26} cy={35} r={3.2} fill="#10241B" />
      </svg>
    </motion.button>
  );
}

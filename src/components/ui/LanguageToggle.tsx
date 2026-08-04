// Language switch, right where the child is.
//
// Changing language must NOT mean a trip into settings — settings belong to
// grown-ups. A child (or the adult beside them) taps once and the whole app
// switches: KN → EN → FR → KN.
//
// The flag stripe carries the meaning for a pre-reader; the two letters are the
// hint for the adult.

import { motion } from 'motion/react';
import { useI18n } from '../../i18n/context';
import type { Language } from '../../i18n/translations';

const ORDER: Language[] = ['KN', 'EN', 'FR'];
const SHORT: Record<Language, string> = { KN: 'RW', EN: 'EN', FR: 'FR' };

export default function LanguageToggle({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const { language, setLanguage } = useI18n();
  const next = ORDER[(ORDER.indexOf(language) + 1) % ORDER.length];

  return (
    <motion.button
      onClick={() => setLanguage(next)}
      aria-label={`Language: ${language}. Tap for ${next}.`}
      whileTap={{ y: 4 }}
      transition={{ type: 'spring', stiffness: 900, damping: 34, mass: 0.5 }}
      className="flex items-center gap-2 rounded-[16px] px-3 flex-none"
      style={{
        minHeight: 60,
        minWidth: 76,
        background: tone === 'dark' ? '#0E3626' : '#FFFFFF',
        boxShadow: tone === 'light' ? '0 5px 0 #D9D2C4' : undefined,
      }}
    >
      {/* Rwandan flag stripe — recognisable long before the letters are. */}
      <span className="rounded-md overflow-hidden flex flex-col flex-none" style={{ width: 24, height: 24 }}>
        <span className="flex-1" style={{ background: '#35A7E8' }} />
        <span className="flex-1" style={{ background: '#FFC02E' }} />
        <span className="flex-1" style={{ background: '#2FBF6B' }} />
      </span>
      <span
        className="font-body font-black"
        style={{ fontSize: 16, color: tone === 'dark' ? '#FFFFFF' : '#17543C' }}
      >
        {SHORT[language]}
      </span>
    </motion.button>
  );
}

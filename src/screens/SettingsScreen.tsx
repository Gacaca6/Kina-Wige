// Settings — grown-up lane.
//
// Blue, plain, and deliberately unexciting. Nothing here is for a child, so
// nothing here uses the child's chunky green language.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ParentShell, Card } from '../components/ui/Shell';
import { useI18n } from '../i18n/context';
import type { Language, TranslationKey } from '../i18n/translations';
import { episodes } from '../data/episodes';
import { comics } from '../data/comics';

const APP_VERSION = '0.1.0';
const CONTACT_EMAIL = 'mikelgodwin1234@gmail.com';

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'KN', label: 'Ikinyarwanda' },
  { code: 'EN', label: 'English' },
  { code: 'FR', label: 'Français' },
];

// Everything this app stores. Listed openly, and wiped by the button below.
//
// KEEP THIS IN SYNC. A key missing here is a promise broken: a parent taps
// "Delete all progress" and something about their child quietly survives.
const PROGRESS_KEYS = [
  'kina-wige-stars',
  'kina-wige-progress',
  'kina-wige-activities',
  'kina-wige-weekly',
  // The per-skill assessment record (useSkillEvidence). This is the most
  // personal thing the app holds — it must be the first thing a delete removes.
  'kina-wige-evidence',
];

/**
 * Credits, derived from the content registries rather than typed out here.
 *
 * A hand-maintained credits list goes stale the first time someone adds an
 * episode in a hurry — and a stale credits list is a licence problem, not a
 * cosmetic one. Add content with an `attribution` and it appears here by itself.
 */
const CONTENT_CREDITS: string[] = [
  ...new Set(
    [...episodes.map((e) => e.attribution), ...comics.map((c) => c.attribution)].filter(
      (a): a is string => Boolean(a),
    ),
  ),
];

/** Things not held in a content registry. */
const OTHER_CREDITS = [
  'Typefaces: Fredoka, Baloo 2, Nunito · SIL Open Font License',
  'One background clip: Pixabay Content Licence',
];

function Label({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-body font-black text-[13px] tracking-[.1em] uppercase mb-3" style={{ color: '#1565C0' }}>
      {children}
    </h2>
  );
}

export default function SettingsScreen() {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useI18n();
  const [cleared, setCleared] = useState(false);

  function resetProgress() {
    PROGRESS_KEYS.forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch {
        /* storage unavailable */
      }
    });
    setCleared(true);
  }

  return (
    <ParentShell title={t('settings.title')} hint={t('settings.language')} onBack={() => navigate('/parents')}>
      <div className="flex flex-col gap-4">
        <Card tone="parent">
          <Label>{t('settings.language')}</Label>
          <div className="flex gap-2">
            {LANGUAGES.map((l) => {
              const on = language === l.code;
              return (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  aria-pressed={on}
                  className="flex-1 rounded-[14px] font-body font-black text-[14px]"
                  style={{
                    minHeight: 48,
                    background: on ? '#1565C0' : '#FFFFFF',
                    color: on ? '#FFFFFF' : '#1565C0',
                    border: '2px solid #90CAF9',
                  }}
                >
                  {l.code}
                </button>
              );
            })}
          </div>
          <p className="font-body font-bold text-[13px] mt-3" style={{ color: '#5B7A94' }}>
            {LANGUAGES.find((l) => l.code === language)?.label}
          </p>
        </Card>

        <Card tone="parent">
          <Label>{t('settings.data')}</Label>
          <ul className="flex flex-col gap-2">
            {[
              'settings.stored.stars',
              'settings.stored.opened',
              'settings.stored.report',
              'settings.stored.language',
            ].map((key) => (
              <li key={key} className="flex items-start gap-2 font-body font-bold text-[14px]" style={{ color: '#213B4A' }}>
                <span className="mt-1.5 rounded-full flex-none" style={{ width: 7, height: 7, background: '#42A5F5' }} />
                {t(key as TranslationKey)}
              </li>
            ))}
          </ul>
          <p className="font-body font-bold text-[13px] mt-3 leading-relaxed" style={{ color: '#5B7A94' }}>
{t('report.private')}
          </p>
          <button
            onClick={resetProgress}
            className="w-full rounded-[14px] font-body font-black text-[15px] mt-4"
            style={{ minHeight: 48, background: cleared ? '#E3F2FD' : '#C62828', color: cleared ? '#1565C0' : '#fff' }}
          >
            {cleared ? t('settings.resetDone') : t('settings.reset')}
          </button>
        </Card>

        {/* Thanks. Placed before About on purpose — the people who made the
            work we build on come before the version number. */}
        <Card tone="parent">
          <Label>{t('settings.thanks')}</Label>
          <p className="font-body font-bold text-[14px] leading-relaxed" style={{ color: '#213B4A' }}>
            {t('settings.thanksBody')}
          </p>
          <p className="font-body font-bold text-[13px] mt-3 leading-relaxed" style={{ color: '#5B7A94' }}>
            {t('settings.thanksBody2')}
          </p>

          <ul className="flex flex-col gap-1.5 mt-4">
            {[...CONTENT_CREDITS, ...OTHER_CREDITS].map((credit) => (
              <li
                key={credit}
                className="flex items-start gap-2 font-body font-bold text-[12px] leading-snug"
                style={{ color: '#5B7A94' }}
              >
                <span className="mt-1.5 rounded-full flex-none" style={{ width: 5, height: 5, background: '#90CAF9' }} />
                {credit}
              </li>
            ))}
          </ul>
        </Card>

        <Card tone="parent">
          <Label>{t('settings.about')}</Label>
          <p className="font-body font-bold text-[14px] leading-relaxed" style={{ color: '#213B4A' }}>
{t('settings.aboutBody')}
          </p>
          <p className="font-body font-bold text-[13px] mt-3" style={{ color: '#5B7A94' }}>
            {t('settings.version')} {APP_VERSION}
            <br />
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#1565C0' }}>
              {CONTACT_EMAIL}
            </a>
          </p>
        </Card>
      </div>
    </ParentShell>
  );
}

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Globe, Info, Heart, Database, Mail, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/context';
import type { Language } from '../i18n/translations';
import BottomNav from '../components/ui/BottomNav';

const APP_VERSION = '0.1.0';
const CONTACT_EMAIL = 'mikelgodwin1234@gmail.com';

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'KN', label: 'Ikinyarwanda' },
  { code: 'EN', label: 'English' },
  { code: 'FR', label: 'Français' },
];

// localStorage keys used across the app — cleared by "Reset progress".
const PROGRESS_KEYS = [
  'kina-wige-stars',
  'kina-wige-progress',
  'kina-wige-activities',
  'kina-wige-weekly',
];

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm p-5">
      <h2 className="flex items-center gap-2 font-headline font-bold text-primary mb-3">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function SettingsScreen() {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useI18n();
  const [resetArmed, setResetArmed] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleReset = () => {
    if (!resetArmed) {
      setResetArmed(true);
      return;
    }
    try {
      PROGRESS_KEYS.forEach(k => localStorage.removeItem(k));
    } catch {
      // localStorage unavailable
    }
    setResetArmed(false);
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2500);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-surface pb-24">
      <header className="bg-surface flex items-center gap-4 w-full px-6 py-4 sticky top-0 z-40">
        <button
          onClick={() => navigate('/home')}
          aria-label="Back to home"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low text-primary hover:scale-105 transition-transform active:scale-95"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-black text-primary font-headline tracking-tight">{t('settings.title')}</h1>
      </header>

      <main className="px-6 py-4 max-w-lg mx-auto space-y-5">
        {/* Language */}
        <Section icon={<Globe className="w-5 h-5" />} title={t('settings.language')}>
          <div className="grid grid-cols-3 gap-3">
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`py-3 rounded-xl font-headline font-bold text-sm transition-all active:scale-95 ${
                  language === l.code
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-surface-container-low text-primary hover:bg-secondary-container'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </Section>

        {/* About */}
        <Section icon={<Info className="w-5 h-5" />} title={t('settings.about')}>
          <p className="text-dark/70 font-medium leading-relaxed">{t('settings.aboutBody')}</p>
          <p className="text-dark/40 text-sm font-bold mt-3">{t('settings.version')} {APP_VERSION}</p>
        </Section>

        {/* Credits */}
        <Section icon={<Heart className="w-5 h-5" />} title={t('settings.credits')}>
          <p className="text-dark/70 font-medium leading-relaxed">{t('settings.creditsBody')}</p>
        </Section>

        {/* Contact */}
        <Section icon={<Mail className="w-5 h-5" />} title={t('settings.contact')}>
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary font-bold break-all">{CONTACT_EMAIL}</a>
        </Section>

        {/* Data */}
        <Section icon={<Database className="w-5 h-5" />} title={t('settings.data')}>
          <button
            onClick={handleReset}
            className={`w-full py-3 rounded-xl font-headline font-bold transition-colors active:scale-95 ${
              resetArmed ? 'bg-danger text-white' : 'bg-danger/10 text-danger hover:bg-danger/20'
            }`}
          >
            {resetDone ? (
              <span className="flex items-center justify-center gap-2"><Check className="w-5 h-5" /> {t('settings.resetDone')}</span>
            ) : resetArmed ? (
              t('settings.resetConfirm')
            ) : (
              t('settings.reset')
            )}
          </button>
        </Section>

        <p className="text-center text-dark/40 font-bold text-sm pt-2">{t('settings.madeIn')}</p>
      </main>

      <BottomNav />
    </motion.div>
  );
}

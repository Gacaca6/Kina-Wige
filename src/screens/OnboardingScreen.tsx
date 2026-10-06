// Setup — the first thing a family sees, once.
//
// The grown-up sets the phone up; the child never sees this. Five short steps,
// each one a promise the app actually keeps:
//
//   0  Language                 forest, Kina — the only shared step
//   1  What Kina Wige promises  offline, nothing leaves the phone, no adverts
//   2  Your child               optional nickname, age
//   3  Play time                the session length that ends a session
//   4  Keeping it the child's   how the grown-up gets back in; app pinning
//
// Then the phone is handed over and the app opens straight into the child's
// world on every launch after this. Steps 1–4 are blue because an adult is
// holding the phone; the last button is green because a child is about to.
//
// Nothing here is sent anywhere. The profile lives under 'kina-wige-family'.

import { useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSystemBars } from '../native/systemBars';
import { motion, AnimatePresence } from 'motion/react';
import Kina from '../components/characters/Kina';
import { useI18n } from '../i18n/context';
import type { Language, TranslationKey } from '../i18n/translations';
import { AGES, NAME_MAX, SESSION_CHOICES, loadFamily, saveFamily } from '../hooks/useFamily';
import type { Age } from '../hooks/useFamily';
import { SAFE_BOTTOM, SAFE_TOP } from '../native/safeArea';

const LANGS: { code: Language; label: string }[] = [
  { code: 'KN', label: 'Ikinyarwanda' },
  { code: 'EN', label: 'English' },
  { code: 'FR', label: 'Français' },
];

const STEPS = 5;
const BLUE = '#1565C0';
const BLUE_SOFT = '#5B7A94';
const BLUE_INK = '#0F2E45';

export default function OnboardingScreen() {
  const { t, setLanguage, language } = useI18n();
  const navigate = useNavigate();
  const initial = loadFamily();
  // The step lives in the URL (?step=2), so the Android back button and the
  // browser's back button both step backwards through setup instead of
  // leaving it.
  const [params, setParams] = useSearchParams();
  const step = Math.min(STEPS - 1, Math.max(0, Math.floor(Number(params.get('step'))) || 0));
  const go = (n: number) => setParams(n > 0 ? { step: String(n) } : {});
  const back = () => {
    // Back through history when there is some, so the header arrow and the
    // hardware button agree; otherwise just show the previous step.
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else go(step - 1);
  };
  useSystemBars(step === 0 ? 'dark' : 'light');
  const [name, setName] = useState(initial.childName);
  const [age, setAge] = useState<Age | null>(initial.age);
  const [minutes, setMinutes] = useState(initial.sessionMinutes);

  function finish() {
    saveFamily({ onboarded: true, childName: name.trim().slice(0, NAME_MAX), age, sessionMinutes: minutes });
    navigate('/home-path', { replace: true });
  }

  if (step === 0) {
    return (
      <div className="relative min-h-[100dvh] bg-forest flex flex-col overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-safe">
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 16 }}>
            <Kina mood="cheer" style={{ width: 'clamp(120px, 36vw, 160px)', height: 'auto' }} />
          </motion.div>
          <h1 className="font-display font-extrabold text-white mt-5 text-center"
            style={{ fontSize: 'clamp(36px, 12vw, 52px)', lineHeight: 1.02 }}>
            Kina Wige
          </h1>
          <p className="font-body font-bold text-center mt-3" style={{ color: '#CFEBDC', fontSize: 16 }}>
            {t('welcome.chooseLanguage')}
          </p>
        </div>
        <div className="px-5 flex flex-col gap-3 flex-none" style={{ paddingBottom: `max(1.5rem, ${SAFE_BOTTOM})` }}>
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLanguage(l.code);
                go(1);
              }}
              className="w-full rounded-[20px] font-display font-extrabold text-[22px] active:translate-y-1 transition-transform"
              style={{
                minHeight: 66,
                background: language === l.code ? '#2FBF6B' : '#FFFFFF',
                color: language === l.code ? '#FFFFFF' : '#17543C',
                boxShadow: language === l.code ? '0 6px 0 #1E8C4C' : '0 6px 0 #0E3626',
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden" style={{ height: 'var(--app-height)', background: '#F5FAFE' }}>
      <header className="px-5 pb-3 flex items-center gap-3 flex-none" style={{ paddingTop: `max(1rem, ${SAFE_TOP})` }}>
        <button
          onClick={back}
          aria-label={t('common.back')}
          className="w-11 h-11 rounded-[14px] grid place-items-center flex-none bg-white"
          style={{ boxShadow: '0 3px 0 #CFE3F5', color: BLUE }}
        >
          <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={3}
            strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <div className="flex gap-1.5 flex-1 justify-center" aria-hidden>
          {Array.from({ length: STEPS - 1 }, (_, i) => (
            <span key={i} className="h-2 rounded-full transition-all"
              style={{ width: i + 1 === step ? 28 : 8, background: i + 1 <= step ? BLUE : '#CFE3F5' }} />
          ))}
        </div>
        <span className="w-11 flex-none" />
      </header>

      <AnimatePresence mode="wait">
        <motion.main
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.22 }}
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 pb-4"
        >
          {step === 1 && (
            <Section title={t('welcome.grownupTitle')} body={t('welcome.grownupBody')}>
              {(['welcome.promise1', 'welcome.promise2', 'welcome.promise3'] as TranslationKey[]).map((k) => (
                <div key={k} className="flex gap-3 items-start bg-white rounded-[16px] p-4" style={{ border: '2px solid #E3F2FD' }}>
                  <span className="w-6 h-6 rounded-lg grid place-items-center flex-none mt-0.5" style={{ background: '#2FBF6B' }}>
                    <span className="block w-[10px] h-[5px] border-l-[3px] border-b-[3px] border-white"
                      style={{ transform: 'rotate(-45deg) translateY(-1px)' }} />
                  </span>
                  <span className="font-body font-bold text-[15px] leading-snug" style={{ color: BLUE_INK }}>{t(k)}</span>
                </div>
              ))}
            </Section>
          )}

          {step === 2 && (
            <Section title={t('welcome.childTitle')}>
              <label className="block">
                <span className="font-body font-black text-[13px] tracking-[.06em] uppercase" style={{ color: BLUE }}>
                  {t('welcome.childName')}
                </span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, NAME_MAX))}
                  maxLength={NAME_MAX}
                  autoComplete="off"
                  autoCapitalize="words"
                  className="mt-2 w-full rounded-[14px] px-4 font-body font-black text-[20px] outline-none"
                  style={{ minHeight: 56, background: '#fff', border: '2px solid #90CAF9', color: BLUE_INK }}
                />
              </label>
              <div>
                <span className="font-body font-black text-[13px] tracking-[.06em] uppercase" style={{ color: BLUE }}>
                  {t('welcome.childAge')}
                </span>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {AGES.map((a) => (
                    <Choice key={a} on={age === a} onClick={() => setAge(age === a ? null : a)}>
                      <span className="block font-display font-extrabold text-[26px] leading-none">{a}</span>
                      <span className="block font-body font-bold text-[12px] mt-1">{t('welcome.years')}</span>
                    </Choice>
                  ))}
                </div>
              </div>
              <Note>{t('welcome.childPrivacy')}</Note>
            </Section>
          )}

          {step === 3 && (
            <Section title={t('welcome.timeTitle')} body={t('welcome.timeBody')}>
              <div className="grid grid-cols-4 gap-2">
                {SESSION_CHOICES.map((m) => (
                  <Choice key={m} on={minutes === m} onClick={() => setMinutes(m)}>
                    <span className="block font-display font-extrabold text-[26px] leading-none tabular-nums">{m}</span>
                    <span className="block font-body font-bold text-[12px] mt-1">{t('welcome.minutes')}</span>
                  </Choice>
                ))}
              </div>
              <Note>{t('welcome.timeNote')}</Note>
            </Section>
          )}

          {step === 4 && (
            <Section title={t('welcome.lockTitle')}>
              <div className="bg-white rounded-[16px] p-4 flex gap-4 items-center" style={{ border: '2px solid #E3F2FD' }}>
                <span className="rounded-[14px] grid place-items-center flex-none font-display font-extrabold text-white text-[15px] px-3"
                  style={{ minWidth: 64, height: 48, background: '#17543C' }}>
                  {name.trim() || 'Kina'}
                </span>
                <p className="font-body font-bold text-[15px] leading-snug" style={{ color: BLUE_INK }}>{t('welcome.lockHold')}</p>
              </div>
              <p className="font-body font-bold text-[14px] leading-relaxed" style={{ color: BLUE_SOFT }}>{t('welcome.lockGate')}</p>
              <div className="rounded-[16px] p-4" style={{ background: '#E3F2FD' }}>
                <p className="font-body font-black text-[14px]" style={{ color: BLUE }}>{t('welcome.pinTitle')}</p>
                <p className="font-body font-bold text-[14px] leading-relaxed mt-1" style={{ color: BLUE_INK }}>{t('welcome.pinBody')}</p>
                <p className="font-body font-bold text-[13px] leading-relaxed mt-2" style={{ color: BLUE_SOFT }}>{t('welcome.pinIphone')}</p>
              </div>
            </Section>
          )}
        </motion.main>
      </AnimatePresence>

      <div className="px-6 flex-none" style={{ paddingBottom: `max(1.5rem, ${SAFE_BOTTOM})` }}>
        {step < STEPS - 1 ? (
          <button
            onClick={() => go(step + 1)}
            className="w-full rounded-[16px] font-body font-black text-[17px]"
            style={{ minHeight: 58, background: BLUE, color: '#fff' }}
          >
            {t('welcome.next')}
          </button>
        ) : (
          <>
            <p className="font-body font-black text-center text-[14px] mb-2" style={{ color: BLUE_SOFT }}>
              {t('welcome.handover')}
            </p>
            <button
              onClick={finish}
              className="w-full rounded-[20px] font-display font-extrabold text-[22px] text-white active:translate-y-1 transition-transform"
              style={{ minHeight: 66, background: '#2FBF6B', boxShadow: '0 7px 0 #1E8C4C' }}
            >
              {t('welcome.start')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Section({ title, body, children }: { title: string; body?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 pt-2">
      <h1 className="font-display font-extrabold text-[28px] leading-tight" style={{ color: BLUE_INK }}>{title}</h1>
      {body && <p className="font-body font-bold text-[16px] leading-relaxed -mt-1" style={{ color: BLUE_SOFT }}>{body}</p>}
      {children}
    </div>
  );
}

function Choice({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className="rounded-[16px] text-center py-3 transition-colors"
      style={{
        minHeight: 72,
        background: on ? BLUE : '#fff',
        color: on ? '#fff' : BLUE,
        border: `2px solid ${on ? BLUE : '#90CAF9'}`,
      }}
    >
      {children}
    </button>
  );
}

function Note({ children }: { children: ReactNode }) {
  return <p className="font-body font-bold text-[13px] leading-relaxed" style={{ color: BLUE_SOFT }}>{children}</p>;
}

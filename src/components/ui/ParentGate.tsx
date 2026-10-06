// The parent gate — the lock on the grown-up area.
//
// WHY IT CHANGED. The old gate asked "3 + 9 = ?" with three answers to pick
// from. That is a one-in-three guess for any child who taps at random, and an
// easy sum for exactly the children this app teaches to count. A gate a
// five-year-old can pass is not a gate.
//
// NOW: a number written out in WORDS, typed on a two-digit keypad. Reading is
// the thing a three-to-six-year-old cannot yet do, so it is the right test.
// The number is shown in all three languages, so any literate adult can read
// one of them whatever language the child has switched the app to. Three wrong
// tries lock the keypad for thirty seconds, and the lock survives the child
// backing out and coming in again.
//
// Unlocked once per visit to the grown-up area. Leaving that area locks it
// again (see relockParentArea and App.tsx) — a parent who unlocks it and hands
// the phone back has not handed over the key.

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/context';
import type { Language } from '../../i18n/translations';
import { numberInWords, randomGateNumber } from '../../i18n/numberWords';

const UNLOCK_KEY = 'kina-wige-parent-unlocked';
const LOCKOUT_KEY = 'kina-wige-gate-lockout';
const MAX_TRIES = 3;
const LOCKOUT_MS = 30_000;

function isUnlocked(): boolean {
  try {
    return sessionStorage.getItem(UNLOCK_KEY) === '1';
  } catch {
    return false;
  }
}

/** Called whenever the child's world is shown again. */
export function relockParentArea() {
  try {
    sessionStorage.removeItem(UNLOCK_KEY);
  } catch {
    /* storage unavailable */
  }
}

function lockedUntil(): number {
  try {
    return Number(sessionStorage.getItem(LOCKOUT_KEY)) || 0;
  } catch {
    return 0;
  }
}

const ORDER: Language[] = ['KN', 'EN', 'FR'];

interface ParentGateProps {
  children: React.ReactNode;
  /** Where "back" goes. Defaults to the child's home. */
  onCancel?: () => void;
}

export default function ParentGate({ children, onCancel }: ParentGateProps) {
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const [unlocked, setUnlocked] = useState(isUnlocked);
  const [target, setTarget] = useState(randomGateNumber);
  const [entry, setEntry] = useState('');
  const [tries, setTries] = useState(0);
  const [shake, setShake] = useState(0);
  const [until, setUntil] = useState(lockedUntil);
  const [now, setNow] = useState(() => Date.now());

  const waiting = until > now;

  // Tick only while locked out, so the countdown is live.
  useEffect(() => {
    if (!waiting) return;
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, [waiting]);

  if (unlocked) return <>{children}</>;

  function press(d: string) {
    if (waiting) return;
    const next = (entry + d).slice(0, 2);
    setEntry(next);
    if (next.length < 2) return;

    if (Number(next) === target) {
      try {
        sessionStorage.setItem(UNLOCK_KEY, '1');
        sessionStorage.removeItem(LOCKOUT_KEY);
      } catch {
        /* still unlock for this view */
      }
      setUnlocked(true);
      return;
    }

    const used = tries + 1;
    setShake((s) => s + 1);
    window.setTimeout(() => {
      setEntry('');
      setTarget(randomGateNumber());
    }, 450);
    if (used >= MAX_TRIES) {
      const u = Date.now() + LOCKOUT_MS;
      try {
        sessionStorage.setItem(LOCKOUT_KEY, String(u));
      } catch {
        /* lockout lasts for this view only */
      }
      setUntil(u);
      setNow(Date.now());
      setTries(0);
    } else {
      setTries(used);
    }
  }

  const back = onCancel ?? (() => navigate('/home-path'));
  const showWrong = tries !== 0 && !waiting;
  const secondsLeft = Math.max(0, Math.ceil((until - now) / 1000));
  const others = ORDER.filter((l) => l !== language);
  const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'clear'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[100dvh] bg-sky-ink flex flex-col items-center justify-center px-6 py-10 text-white text-center relative"
    >
      <button
        onClick={back}
        aria-label={t('common.back')}
        className="absolute top-4 left-4 w-11 h-11 flex items-center justify-center rounded-full bg-white/15 text-white active:scale-95 transition-transform"
        style={{ marginTop: 'env(safe-area-inset-top)' }}
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center mb-4">
        <Lock className="w-7 h-7" />
      </div>

      <h1 className="font-display text-2xl font-bold mb-1">{t('gate.title')}</h1>
      <p className="text-white/80 font-medium mb-5">{t('gate.typeNumber')}</p>

      <div className="bg-white/10 rounded-2xl px-5 py-4 mb-4 w-full max-w-xs">
        <p className="font-display text-[22px] font-bold leading-tight">{numberInWords(target, language)}</p>
        {others.map((l) => (
          <p key={l} className="font-body font-bold text-[13px] text-white/60 mt-1">
            {numberInWords(target, l)}
          </p>
        ))}
      </div>

      <motion.div
        key={shake}
        animate={shake ? { x: [0, -10, 10, -8, 8, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="flex gap-3 mb-5"
        aria-live="polite"
      >
        {[0, 1].map((i) => (
          <span
            key={i}
            className="w-14 h-16 rounded-2xl bg-white text-sky-ink grid place-items-center font-display text-3xl font-bold tabular-nums"
          >
            {entry[i] ?? ''}
          </span>
        ))}
      </motion.div>

      {waiting ? (
        <p className="font-bold text-white/90 h-[244px] flex items-center">
          {t('gate.locked').replace('{s}', String(secondsLeft))}
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-2.5 w-full max-w-[252px]">
          {KEYS.map((k, i) =>
            k === '' ? (
              <span key={i} />
            ) : (
              <button
                key={i}
                onClick={() => (k === 'clear' ? setEntry('') : press(k))}
                className={`h-[56px] rounded-2xl font-display font-bold shadow-md active:scale-95 transition-transform ${
                  k === 'clear' ? 'bg-white/15 text-white text-[15px]' : 'bg-white text-sky-ink text-2xl tabular-nums'
                }`}
              >
                {k === 'clear' ? t('gate.clear') : k}
              </button>
            ),
          )}
        </div>
      )}

      {showWrong && <p className="mt-4 font-bold text-white/90">{t('gate.wrong')}</p>}
    </motion.div>
  );
}

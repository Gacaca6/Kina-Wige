// Play time, and the end of it.
//
// Kina Wige is designed to END. The grown-up chooses a play time during setup
// (10, 12, 15 or 20 minutes; 12 by default, in line with WHO guidance that
// less screen time is better for under-fives). When it is used up, Kina goes
// to sleep and sends the child off to play. Only a grown-up, through the
// parent gate, can allow another session.
//
// Rules, so this behaves the same for every family:
//   • Only time in the CHILD's lane counts, and only while the app is on
//     screen. Time a grown-up spends in their own area is never charged to
//     the child.
//   • The child is not cut off mid-sentence. Once time is up, rest begins at
//     the next change of screen, or two minutes later at the latest.
//   • Rest lasts an hour. Closing and reopening the app does not skip it.
//   • A natural break of half an hour or more starts a fresh session.
//
// All of this lives on the device, under 'kina-wige-session'. It is listed in
// Settings and cleared by "Delete all progress".

import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import Kina from '../characters/Kina';
import ParentGate, { relockParentArea } from './ParentGate';
import { useI18n } from '../../i18n/context';
import { useFamily } from '../../hooks/useFamily';
import { isGrownUpPath } from './lanes';

export const SESSION_KEY = 'kina-wige-session';

const TICK_MS = 5_000;
const MAX_STEP_MS = 15_000; // a frozen tab must not be charged as play
const BREAK_RESET_MS = 30 * 60_000;
const GRACE_MS = 2 * 60_000;
const REST_MS = 60 * 60_000;

interface SessionState {
  playedMs: number;
  lastTick: number;
  restUntil: number | null;
}

function load(): SessionState {
  try {
    const s = JSON.parse(localStorage.getItem(SESSION_KEY) ?? '') as SessionState;
    if (typeof s.playedMs === 'number' && typeof s.lastTick === 'number') return s;
  } catch {
    /* fall through */
  }
  return { playedMs: 0, lastTick: Date.now(), restUntil: null };
}

function save(s: SessionState) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  } catch {
    /* the limit still holds for this visit */
  }
}

function isResting(s: SessionState, now: number) {
  return s.restUntil !== null && now < s.restUntil;
}

export default function SessionGuard() {
  const { pathname } = useLocation();
  const family = useFamily();
  const [resting, setResting] = useState(() => isResting(load(), Date.now()));
  const limitMs = family.sessionMinutes * 60_000;
  const pathRef = useRef(pathname);
  pathRef.current = pathname;

  function beginRest() {
    const now = Date.now();
    save({ playedMs: 0, lastTick: now, restUntil: now + REST_MS });
    setResting(true);
  }

  // The clock.
  useEffect(() => {
    if (!family.onboarded) return;
    const tick = () => {
      const now = Date.now();
      const s = load();
      const gap = now - s.lastTick;

      if (s.restUntil !== null) {
        if (now < s.restUntil) {
          save({ ...s, lastTick: now });
          setResting(true);
          return;
        }
        // Rest is over: a fresh session.
        save({ playedMs: 0, lastTick: now, restUntil: null });
        setResting(false);
        return;
      }

      const counting = !document.hidden && !isGrownUpPath(pathRef.current);
      let played = gap > BREAK_RESET_MS ? 0 : s.playedMs;
      if (counting && gap <= BREAK_RESET_MS) played += Math.min(gap, MAX_STEP_MS);

      if (counting && played >= limitMs + GRACE_MS) {
        beginRest();
        return;
      }
      save({ playedMs: played, lastTick: now, restUntil: null });
    };
    tick();
    const id = window.setInterval(tick, TICK_MS);
    const onVis = () => tick();
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [family.onboarded, limitMs]);

  // Time is up: rest at the next change of screen rather than mid-activity.
  useEffect(() => {
    if (!family.onboarded || isGrownUpPath(pathname)) return;
    const s = load();
    if (s.restUntil === null && s.playedMs >= limitMs) beginRest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!resting || !family.onboarded || isGrownUpPath(pathname)) return null;
  return <RestScreen onAllow={() => {
    save({ playedMs: 0, lastTick: Date.now(), restUntil: null });
    relockParentArea();
    setResting(false);
  }} name={family.childName} />;
}

function RestScreen({ onAllow, name }: { onAllow: () => void; name: string }) {
  const { t } = useI18n();
  const [gate, setGate] = useState(false);

  if (gate) {
    return (
      <div className="fixed inset-0 z-[100] overflow-y-auto">
        <ParentGate onCancel={() => setGate(false)}>
          <div className="min-h-[100dvh] flex flex-col items-center justify-center gap-4 px-6 text-center" style={{ background: '#F5FAFE' }}>
            <p className="font-body font-bold text-[15px]" style={{ color: '#5B7A94' }}>{t('rest.explain')}</p>
            <button
              onClick={onAllow}
              className="w-full max-w-xs rounded-[16px] font-body font-black text-[16px]"
              style={{ minHeight: 56, background: '#1565C0', color: '#fff' }}
            >
              {t('rest.allowMore')}
            </button>
            <button
              onClick={() => {
                relockParentArea();
                setGate(false);
              }}
              className="w-full max-w-xs rounded-[16px] font-body font-black text-[16px]"
              style={{ minHeight: 56, background: '#fff', color: '#1565C0', border: '2px solid #90CAF9' }}
            >
              {t('rest.notNow')}
            </button>
          </div>
        </ParentGate>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-forest flex flex-col items-center justify-center px-8 text-center"
      role="dialog"
      aria-modal="true"
    >
      <Kina mood="sleep" style={{ width: 'clamp(130px, 40vw, 180px)', height: 'auto' }} />
      <h1 className="font-display font-extrabold text-white mt-6" style={{ fontSize: 'clamp(28px, 8vw, 38px)', lineHeight: 1.1 }}>
        {t('rest.title')}
      </h1>
      <p className="font-body font-bold mt-3 max-w-xs" style={{ fontSize: 17, color: '#CFEBDC' }}>
        {name ? `${name}! ` : ''}
        {t('rest.body')}
      </p>
      <button
        onClick={() => setGate(true)}
        className="absolute bottom-0 mb-8 rounded-[14px] font-body font-black text-[14px] px-5"
        style={{ minHeight: 48, background: '#0E3626', color: '#90CAF9', marginBottom: 'calc(2rem + env(safe-area-inset-bottom))' }}
      >
        {t('rest.grownup')}
      </button>
    </motion.div>
  );
}

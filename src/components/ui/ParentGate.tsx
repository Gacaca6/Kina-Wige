import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/context';

const SESSION_KEY = 'kina-wige-parent-unlocked';

function isUnlocked(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

function randInt(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function makeChallenge() {
  const a = randInt(3, 9);
  const b = randInt(3, 9);
  const answer = a + b;
  const options = new Set<number>([answer]);
  while (options.size < 3) {
    options.add(answer + randInt(-3, 3));
  }
  return { a, b, answer, options: [...options].sort(() => Math.random() - 0.5) };
}

// Gates the Parent zone behind a simple sum — trivial for an adult, a barrier
// for a small child. Unlocked once per session (sessionStorage).
export default function ParentGate({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [unlocked, setUnlocked] = useState(isUnlocked);
  const [challenge, setChallenge] = useState(makeChallenge);
  const [wrong, setWrong] = useState<number | null>(null);

  if (unlocked) {
    return <>{children}</>;
  }

  const choose = (n: number) => {
    if (n === challenge.answer) {
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        // sessionStorage unavailable — still unlock for this view
      }
      setUnlocked(true);
    } else {
      setWrong(n);
      setTimeout(() => {
        setWrong(null);
        setChallenge(makeChallenge());
      }, 800);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-primary flex flex-col items-center justify-center p-6 text-white text-center"
    >
      <button
        onClick={() => navigate('/home')}
        aria-label="Back to home"
        className="absolute top-4 left-4 w-11 h-11 flex items-center justify-center rounded-full bg-white/15 text-white active:scale-95 transition-transform"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center mb-6">
        <Lock className="w-8 h-8" />
      </div>

      <h1 className="font-headline text-2xl font-bold mb-2">{t('gate.title')}</h1>
      <p className="text-white/80 font-medium mb-8 max-w-xs">{t('gate.instruction')}</p>

      <div className="bg-white/10 rounded-2xl px-8 py-5 mb-8">
        <span className="font-display text-4xl font-bold tabular-nums">
          {challenge.a} + {challenge.b} = ?
        </span>
      </div>

      <div className="flex gap-4">
        {challenge.options.map(n => (
          <motion.button
            key={n}
            onClick={() => choose(n)}
            animate={wrong === n ? { x: [0, -8, 8, -8, 0] } : {}}
            className={`w-20 h-20 rounded-2xl font-display font-bold text-3xl shadow-lg tabular-nums transition-colors active:scale-90 ${
              wrong === n ? 'bg-danger text-white' : 'bg-white text-primary hover:bg-surface'
            }`}
          >
            {n}
          </motion.button>
        ))}
      </div>

      {wrong !== null && (
        <p className="mt-6 font-bold text-white/90">{t('gate.wrong')}</p>
      )}
    </motion.div>
  );
}

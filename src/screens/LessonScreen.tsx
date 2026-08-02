// 09–15 · The lesson loop.
//
// Where a child actually spends their time. One screen carries the whole loop
// so state never gets lost between steps: ask → answer → correct / try again →
// complete.
//
// Rules from docs/CURRICULUM.md §6, enforced here:
//   • Max 3 choices on screen (4 only for numerals)
//   • NO timer, NO lives, NO losing. Wrong just means try again, with the
//     wrong choice gently dimmed so the field narrows.
//   • Nothing red, no buzzer — "oops" is a warm sun-yellow, never a punishment
//   • Audio-first: the prompt is spoken, the letter is huge, text is for adults
//   • Every item declares the curriculum skill it teaches

import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Kina from '../components/characters/Kina';
import { LESSONS, LESSON_U1_L1 } from '../data/lessons';
import type { LessonItem } from '../data/lessons';
import { ListenPick, CountActivity, MatchActivity, TraceActivity } from '../components/lesson/Activities';
import { useStars } from '../hooks/useStars';
import { useSound } from '../hooks/useSound';

type Phase = 'ask' | 'correct' | 'retry' | 'done';

/* ── Chunky button: press = 4px drop onto its own solid shadow ── */
function Chunky({
  children,
  onClick,
  bg,
  shadow,
  color,
  disabled,
  className = '',
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  bg: string;
  shadow: string;
  color: string;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      whileTap={disabled ? undefined : { y: 6, boxShadow: `0 2px 0 ${shadow}` }}
      transition={{ type: 'spring', stiffness: 900, damping: 34, mass: 0.5 }}
      className={`w-full rounded-[22px] font-body font-black ${className}`}
      style={{
        background: bg,
        color,
        boxShadow: `0 8px 0 ${shadow}`,
        minHeight: 76,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.55 : 1,
      }}
    >
      {children}
    </motion.button>
  );
}

export default function LessonScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const lesson = (id && LESSONS[id]) || LESSON_U1_L1;

  const { addStar } = useStars();
  const { play } = useSound();

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('ask');
  /** null = nothing chosen yet; true/false = a complete answer. */
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [lastPickId, setLastPickId] = useState<string | null>(null);
  const [ruledOut, setRuledOut] = useState<string[]>([]);
  const [earned, setEarned] = useState(0);
  const spoke = useRef<string | null>(null);

  const item: LessonItem = lesson.items[Math.min(index, lesson.items.length - 1)];
  const total = lesson.items.length;

  /** Speak the prompt. Audio is synthesised — no files, so this stays offline. */
  const speak = useCallback(() => {
    play('tap');
  }, [play]);

  // Audio auto-plays once on entering each item — the child listens first.
  useEffect(() => {
    if (phase !== 'ask') return;
    if (spoke.current === item.id) return;
    spoke.current = item.id;
    const t = window.setTimeout(speak, 380);
    return () => window.clearTimeout(t);
  }, [item.id, phase, speak]);

  /** Activities report a complete answer here; the shell owns the verdict. */
  const onSelect = useCallback(
    (correct: boolean | null, pickId?: string) => {
      setAnswer(correct);
      if (pickId !== undefined) setLastPickId(pickId);
    },
    []
  );

  function check() {
    if (answer === null) return;
    if (answer) {
      play('success');
      addStar(1);
      setEarned((e) => e + 1);
      setPhase('correct');
    } else {
      // Gentle: dim only that choice, keep everything else open. Never a loss.
      play('error');
      if (lastPickId) setRuledOut((r) => [...r, lastPickId]);
      setAnswer(null);
      setPhase('retry');
    }
  }

  function next() {
    if (index + 1 >= total) {
      play('victory_fanfare');
      setPhase('done');
      return;
    }
    setIndex((i) => i + 1);
    setAnswer(null);
    setLastPickId(null);
    setRuledOut([]);
    setPhase('ask');
  }

  /** Dispatch on activity kind. Each reports through the same callback. */
  function renderActivity() {
    const common = { ruledOut, onSelect };
    switch (item.kind) {
      case 'listen-pick':
        return <ListenPick key={item.id} item={item} {...common} />;
      case 'count':
        return <CountActivity key={item.id} item={item} {...common} />;
      case 'match':
        return <MatchActivity key={item.id} item={item} {...common} />;
      case 'trace':
        return <TraceActivity key={item.id} item={item} {...common} />;
    }
  }

  /* ── Lesson complete ── */
  if (phase === 'done') {
    return (
      <div className="min-h-screen bg-forest flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 14, mass: 0.9 }}
        >
          <Kina mood="cheer" style={{ width: 150, height: 136 }} />
        </motion.div>
        <div className="font-display font-extrabold text-white mt-6" style={{ fontSize: 44, lineHeight: 1.05 }}>
          Wabikoze!
        </div>
        <div className="font-body font-extrabold text-mint mt-2 text-base">
          Lesson complete · {lesson.titleEn}
        </div>

        <div
          className="mt-8 flex items-center gap-3 bg-forest-deep rounded-[20px] px-6"
          style={{ minHeight: 76 }}
        >
          <svg viewBox="0 0 48 48" style={{ width: 34, height: 34 }} aria-hidden>
            <path
              d="M24 6l5.5 11.6 12.5 1.6-9.2 8.7 2.4 12.5L24 34.2 12.8 40.4l2.4-12.5L6 19.2l12.5-1.6z"
              fill="#FFC02E"
              stroke="#10241B"
              strokeWidth={3.5}
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-body font-black text-white text-3xl tabular-nums">+{earned}</span>
        </div>

        <div className="w-full max-w-sm mt-10">
          <Chunky bg="#2FBF6B" shadow="#1E8C4C" color="#fff" onClick={() => navigate('/home-path')}>
            <span className="text-2xl">Komeza</span>
          </Chunky>
        </div>
      </div>
    );
  }

  const showRetry = phase === 'retry';
  const showCorrect = phase === 'correct';

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* ── Progress. Segments, not a timer — nothing counts down. ── */}
      <div className="px-6 pt-5 flex items-center gap-3">
        <button
          onClick={() => navigate('/home-path')}
          aria-label="Leave the lesson"
          className="rounded-[16px] bg-sand grid place-items-center flex-none"
          style={{ width: 56, height: 56 }}
        >
          <span className="relative block" style={{ width: 22, height: 22 }}>
            <span className="absolute left-0 right-0 top-[9px] h-[4px] rounded bg-ink-muted rotate-45" />
            <span className="absolute left-0 right-0 top-[9px] h-[4px] rounded bg-ink-muted -rotate-45" />
          </span>
        </button>
        <div className="flex-1 flex gap-1.5" role="progressbar" aria-valuenow={index} aria-valuemax={total}>
          {lesson.items.map((it, i) => (
            <div key={it.id} className="flex-1 h-3.5 rounded-full bg-edge overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-grass"
                initial={false}
                animate={{ width: i < index ? '100%' : i === index ? '45%' : '0%' }}
                transition={{ type: 'spring', stiffness: 220, damping: 26 }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Kina asks ── */}
      <div className="px-6 pt-6 flex items-end gap-3">
        <div className="flex-none">
          <Kina mood={showCorrect ? 'cheer' : showRetry ? 'oops' : 'idle'} style={{ width: 74, height: 68 }} />
        </div>
        <div
          className="flex-1 bg-mint px-5 py-4"
          style={{ borderRadius: '22px 22px 22px 6px', boxShadow: '0 5px 0 #C6EDD7' }}
        >
          <div className="font-display font-extrabold text-ink" style={{ fontSize: 22, lineHeight: 1.2 }}>
            {item.promptKn}
          </div>
          <div className="font-body font-bold text-[13px] text-ink-soft mt-0.5">{item.promptEn}</div>
        </div>
      </div>

      {/* ── The audio button. Big, yellow, unmissable — this is the question. ── */}
      <div className="px-6 pt-5">
        <Chunky bg="#FFC02E" shadow="#D89A00" color="#10241B" onClick={speak} ariaLabel="Play the sound again">
          <span className="flex items-center gap-4 px-5">
            <span className="rounded-[18px] bg-ink grid place-items-center flex-none" style={{ width: 56, height: 56 }}>
              <span
                className="block"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '19px solid #FFC02E',
                  borderTop: '12px solid transparent',
                  borderBottom: '12px solid transparent',
                }}
              />
            </span>
            <span className="flex-1 text-left">
              <span className="block font-body font-black text-[19px]">Umva</span>
              <span className="block font-body font-extrabold text-[12px] text-sun-deep">Listen again</span>
            </span>
            {item.kind === 'listen-pick' && (
              <span className="font-display font-extrabold text-[40px] leading-none pr-2">{item.token}</span>
            )}
          </span>
        </Chunky>
      </div>

      {/* ── The activity itself ── */}
      <div className="px-6 pt-6">{renderActivity()}</div>

      <div className="flex-1" />

      {/* ── Footer: check, or the correct / try-again sheet ── */}
      <AnimatePresence mode="wait">
        {showCorrect ? (
          <motion.div
            key="correct"
            initial={{ y: 260 }}
            animate={{ y: 0 }}
            exit={{ y: 260 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="bg-mint px-6 pt-6 pb-8"
            style={{ borderTop: '5px solid #2FBF6B', borderRadius: '34px 34px 0 0' }}
          >
            <div className="font-display font-extrabold text-forest" style={{ fontSize: 36, lineHeight: 1 }}>
              Yego! Ni yo!
            </div>
            <div className="font-body font-extrabold text-[15px] text-mint-ink mt-1.5 mb-5">
              That&rsquo;s right · C&rsquo;est ça
            </div>
            <Chunky bg="#2FBF6B" shadow="#1E8C4C" color="#fff" onClick={next}>
              <span className="text-2xl">Komeza</span>
            </Chunky>
          </motion.div>
        ) : showRetry ? (
          <motion.div
            key="retry"
            initial={{ y: 260 }}
            animate={{ y: 0 }}
            exit={{ y: 260 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="px-6 pt-6 pb-8"
            style={{ background: '#FFF6DF', borderTop: '5px solid #FFC02E', borderRadius: '34px 34px 0 0' }}
          >
            <div className="font-display font-extrabold text-ink" style={{ fontSize: 32, lineHeight: 1.05 }}>
              Ongera ugerageze
            </div>
            <div className="font-body font-extrabold text-[15px] text-sun-deep mt-1.5 mb-5">
              Try again · Kina is still here
            </div>
            <Chunky bg="#FFC02E" shadow="#D89A00" color="#10241B" onClick={() => setPhase('ask')}>
              <span className="text-2xl">Ongera</span>
            </Chunky>
          </motion.div>
        ) : (
          <motion.div key="check" className="px-6 pb-8 pt-2">
            <Chunky
              bg={answer !== null ? '#2FBF6B' : '#E4DDCE'}
              shadow={answer !== null ? '#1E8C4C' : '#D9D2C4'}
              color={answer !== null ? '#fff' : '#A8A090'}
              disabled={answer === null}
              onClick={check}
            >
              <span className="text-2xl">Reba</span>
            </Chunky>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

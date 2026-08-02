// The four activity types. Each reports readiness through one callback so the
// lesson shell owns the check button and the phase machine.
//
// onSelect(null)  → nothing chosen yet, check stays disabled
// onSelect(true)  → a complete, correct answer
// onSelect(false) → a complete, wrong answer
//
// Shared rules (docs/CURRICULUM.md §6): max 3 choices (4 only for numerals),
// no timers, nothing red, wrong never costs anything.

import { useCallback, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { motion } from 'motion/react';
import type { CountItem, ListenPickItem, MatchItem, TraceItem } from '../../data/lessons';

const SPRING = { type: 'spring' as const, stiffness: 700, damping: 30, mass: 0.6 };

const cardShadow = (selected: boolean) =>
  selected ? '0 8px 0 #1E8C4C, inset 0 0 0 5px #2FBF6B' : '0 8px 0 #D9D2C4, inset 0 0 0 3px #E4DDCE';

export interface ActivityProps {
  /** pickId identifies the chosen option so a wrong one can be dimmed. */
  onSelect: (correct: boolean | null, pickId?: string) => void;
  ruledOut: string[];
}

/* ── 09 · Listen & pick ─────────────────────────────────────────────── */
export function ListenPick({
  item,
  onSelect,
  ruledOut,
}: ActivityProps & { item: ListenPickItem }) {
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div className="grid grid-cols-3 gap-4">
      {item.choices.map((c) => {
        const isPicked = picked === c.id;
        const isOut = ruledOut.includes(c.id);
        return (
          <motion.button
            key={c.id}
            onClick={() => {
              if (isOut) return;
              setPicked(c.id);
              onSelect(!!c.correct, c.id);
            }}
            disabled={isOut}
            aria-label={c.glyph}
            aria-pressed={isPicked}
            whileTap={isOut ? undefined : { y: 6 }}
            animate={{ opacity: isOut ? 0.35 : 1, scale: isPicked ? 1.04 : 1 }}
            transition={SPRING}
            className="rounded-[26px] bg-white grid place-items-center"
            style={{ minHeight: 116, boxShadow: cardShadow(isPicked) }}
          >
            <span className="font-display font-extrabold text-ink" style={{ fontSize: 54, lineHeight: 1 }}>
              {c.glyph}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

/* ── 14 · Count ─────────────────────────────────────────────────────── */
export function CountActivity({
  item,
  onSelect,
  ruledOut,
}: ActivityProps & { item: CountItem }) {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div className="flex flex-col gap-5">
      {/* The things to count. Generous spacing so small fingers can point at
          each one — one-to-one correspondence is a skill, not a formality. */}
      <div
        className="rounded-[30px] bg-white flex flex-wrap items-center justify-center gap-4 p-6"
        style={{ minHeight: 190, boxShadow: '0 8px 0 #D9D2C4, inset 0 0 0 3px #E4DDCE' }}
      >
        {Array.from({ length: item.count }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ ...SPRING, delay: 0.06 * i }}
            style={{ fontSize: 52, lineHeight: 1 }}
          >
            {item.glyph}
          </motion.span>
        ))}
      </div>

      {/* Numerals: the one case where 4 choices are allowed. */}
      <div className={`grid gap-4 ${item.choices.length > 3 ? 'grid-cols-4' : 'grid-cols-3'}`}>
        {item.choices.map((n) => {
          const isPicked = picked === n;
          const isOut = ruledOut.includes(String(n));
          return (
            <motion.button
              key={n}
              onClick={() => {
                if (isOut) return;
                setPicked(n);
                onSelect(n === item.count, String(n));
              }}
              disabled={isOut}
              aria-label={String(n)}
              aria-pressed={isPicked}
              whileTap={isOut ? undefined : { y: 6 }}
              animate={{ opacity: isOut ? 0.35 : 1, scale: isPicked ? 1.04 : 1 }}
              transition={SPRING}
              className="rounded-[24px] bg-white grid place-items-center"
              style={{ minHeight: 96, boxShadow: cardShadow(isPicked) }}
            >
              <span className="font-display font-extrabold text-ink tabular-nums" style={{ fontSize: 46, lineHeight: 1 }}>
                {n}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ── 12 · Match pairs ───────────────────────────────────────────────── */
export function MatchActivity({ item, onSelect }: ActivityProps & { item: MatchItem }) {
  const [active, setActive] = useState<string | null>(null);
  const [solved, setSolved] = useState<string[]>([]);
  const [wrongPair, setWrongPair] = useState<string | null>(null);

  // Right column is shuffled once, deterministically per item id.
  const rights = useRef(
    [...item.pairs].sort((a, b) => (a.id + item.id).localeCompare(b.id + item.id))
  ).current;

  function tapRight(pairId: string) {
    if (!active || solved.includes(pairId)) return;
    if (active === pairId) {
      const next = [...solved, pairId];
      setSolved(next);
      setActive(null);
      // Complete only when every pair is found.
      if (next.length === item.pairs.length) onSelect(true);
    } else {
      // Gentle: flash the mismatch, keep both available. Nothing is lost.
      setWrongPair(pairId);
      window.setTimeout(() => setWrongPair(null), 600);
      setActive(null);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-3">
        {item.pairs.map((p) => {
          const done = solved.includes(p.id);
          const isActive = active === p.id;
          return (
            <motion.button
              key={p.id}
              onClick={() => !done && setActive(p.id)}
              aria-label={p.left}
              aria-pressed={isActive}
              disabled={done}
              whileTap={done ? undefined : { y: 5 }}
              animate={{ opacity: done ? 0.45 : 1, scale: isActive ? 1.04 : 1 }}
              transition={SPRING}
              className="rounded-[22px] bg-white grid place-items-center"
              style={{ minHeight: 84, boxShadow: cardShadow(isActive || done) }}
            >
              <span className="font-display font-extrabold text-ink" style={{ fontSize: 36, lineHeight: 1 }}>
                {p.left}
              </span>
            </motion.button>
          );
        })}
      </div>
      <div className="flex flex-col gap-3">
        {rights.map((p) => {
          const done = solved.includes(p.id);
          const isWrong = wrongPair === p.id;
          return (
            <motion.button
              key={p.id}
              onClick={() => tapRight(p.id)}
              aria-label={p.right}
              disabled={done}
              whileTap={done ? undefined : { y: 5 }}
              animate={{ opacity: done ? 0.45 : 1, x: isWrong ? [0, -6, 6, 0] : 0 }}
              transition={isWrong ? { duration: 0.4 } : SPRING}
              className="rounded-[22px] bg-white grid place-items-center"
              style={{
                minHeight: 84,
                boxShadow: done
                  ? '0 8px 0 #1E8C4C, inset 0 0 0 5px #2FBF6B'
                  : isWrong
                    ? '0 8px 0 #D89A00, inset 0 0 0 4px #FFC02E'
                    : '0 8px 0 #D9D2C4, inset 0 0 0 3px #E4DDCE',
              }}
            >
              <span style={{ fontSize: 32, lineHeight: 1 }}>{p.right}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ── 13 · Trace ─────────────────────────────────────────────────────── */
export function TraceActivity({ item, onSelect }: ActivityProps & { item: TraceItem }) {
  const [hit, setHit] = useState(0);
  const box = useRef<HTMLDivElement | null>(null);
  const done = hit >= item.waypoints.length;

  const move = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (done || e.buttons === 0) return;
      const el = box.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      const target = item.waypoints[hit];
      if (Math.hypot(x - target.x, y - target.y) < 16) {
        const next = hit + 1;
        setHit(next);
        if (next >= item.waypoints.length) onSelect(true);
      }
    },
    [done, hit, item.waypoints, onSelect]
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={box}
        onPointerMove={move}
        onPointerDown={move}
        className="relative rounded-[30px] bg-white touch-none"
        style={{ width: '100%', maxWidth: 320, aspectRatio: '1', boxShadow: '0 8px 0 #D9D2C4, inset 0 0 0 3px #E4DDCE' }}
      >
        <span
          className="absolute inset-0 grid place-items-center font-display font-extrabold select-none"
          style={{ fontSize: 210, lineHeight: 1, color: '#EFEBE1' }}
          aria-hidden
        >
          {item.glyph}
        </span>
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" aria-hidden>
          {item.waypoints.map((w, i) => (
            <circle
              key={i}
              cx={w.x}
              cy={w.y}
              r={i === hit ? 5.5 : 4}
              fill={i < hit ? '#2FBF6B' : i === hit ? '#FFC02E' : '#E4DDCE'}
              stroke="#10241B"
              strokeWidth={i === hit ? 2 : 1.2}
            />
          ))}
        </svg>
      </div>
      <div className="font-body font-extrabold text-[14px] text-ink-soft">
        {done ? 'Byakunze!' : `${hit} / ${item.waypoints.length}`}
      </div>
    </div>
  );
}

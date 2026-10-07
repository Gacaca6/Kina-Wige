// The rules every Kina Wige game shares, written once (docs/GAMES-DESIGN.md §3).

import { useCallback, useEffect, useRef, useState } from 'react';
import type { MotionValue } from 'motion/react';
import { useFamily } from '../../../hooks/useFamily';
import type { Age } from '../../../hooks/useFamily';
import { REST_EVENT } from '../../ui/restEvent';

// ── Age ─────────────────────────────────────────────────────────────────────

/** The age the grown-up gave in setup. A child with no age plays as a 4-year-old. */
export function useGameAge(): Age {
  return useFamily().age ?? 4;
}

/**
 * How close is close enough, in SCREEN PIXELS (standard rule 2).
 * Three-year-olds land 4.5 mm off target on average; the radius shrinks as
 * fine motor control grows. Convert with Stage's pxPerUnit().
 */
export function snapRadiusPx(age: Age): number {
  return age <= 3 ? 90 : age === 4 ? 70 : 50;
}

/** Seconds of no progress before the ghost hand shows the way. */
export function hintDelayMs(age: Age): number {
  return age <= 3 ? 3500 : 5000;
}

// ── Idle → hint ─────────────────────────────────────────────────────────────

/**
 * True once the child has made no progress for `delay` ms. Call `poke()` on
 * every bit of real progress; changing `resetKey` (a new step) restarts it.
 * While `active` is false the hint never shows.
 */
export function useIdleHint(delay: number, resetKey: unknown, active = true) {
  const [idle, setIdle] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const poke = useCallback(() => {
    setIdle(false);
    window.clearTimeout(timer.current);
    if (active) timer.current = window.setTimeout(() => setIdle(true), delay);
  }, [delay, active]);

  useEffect(() => {
    poke();
    return () => window.clearTimeout(timer.current);
  }, [resetKey, poke]);

  return { idle: idle && active, poke };
}

// ── Difficulty that follows the child ───────────────────────────────────────
//
// Standard rule 5: start where the age says, then two clean rounds in a row
// step up and two struggling rounds in a row step down. Never a wall, never a
// grade — the child is not told their level, they just meet the next thing.

const LEVELS_KEY = 'kina-wige-game-levels';

interface LevelState {
  level: number;
  up: number;
  down: number;
}

function readLevels(): Record<string, LevelState> {
  try {
    const raw = JSON.parse(localStorage.getItem(LEVELS_KEY) ?? '{}');
    return raw && typeof raw === 'object' ? raw : {};
  } catch {
    return {};
  }
}

function writeLevels(all: Record<string, LevelState>) {
  try {
    localStorage.setItem(LEVELS_KEY, JSON.stringify(all));
  } catch {
    /* storage unavailable — the game still adapts within this visit */
  }
}

export { LEVELS_KEY };

/**
 * @param gameId  stable id, e.g. "karaba"
 * @param maxLevel highest level (levels are 1..maxLevel)
 * @param startFor the level a child of this age starts on
 */
export function useAdaptiveLevel(
  gameId: string,
  maxLevel: number,
  startFor: (age: Age) => number,
  /** Clean rounds needed to step up. Games with many small levels use 1. */
  upAfter = 2,
) {
  const age = useGameAge();
  const [state, setState] = useState<LevelState>(() => {
    const saved = readLevels()[gameId];
    if (saved && saved.level >= 1 && saved.level <= maxLevel) return saved;
    return { level: Math.min(maxLevel, Math.max(1, startFor(age))), up: 0, down: 0 };
  });

  /** Report how a round went. `clean` = done without struggling. */
  const report = useCallback(
    (clean: boolean) => {
      setState((prev) => {
        let { level, up, down } = prev;
        if (clean) {
          up += 1;
          down = 0;
          if (up >= upAfter && level < maxLevel) {
            level += 1;
            up = 0;
          }
        } else {
          down += 1;
          up = 0;
          if (down >= 2 && level > 1) {
            level -= 1;
            down = 0;
          }
        }
        const next = { level, up, down };
        writeLevels({ ...readLevels(), [gameId]: next });
        return next;
      });
    },
    [gameId, maxLevel, upAfter],
  );

  return { level: state.level, report };
}

// ── Rest ────────────────────────────────────────────────────────────────────

/** Runs `onRest` when play time ends and Kina goes to sleep. */
export function useOnRest(onRest: () => void) {
  const latest = useRef(onRest);
  latest.current = onRest;
  useEffect(() => {
    const h = () => latest.current();
    window.addEventListener(REST_EVENT, h);
    return () => window.removeEventListener(REST_EVENT, h);
  }, []);
}

// ── Pivots ──────────────────────────────────────────────────────────────────

/**
 * Drive an SVG group's `transform` attribute from a motion value.
 *
 * Why not motion's own style rotate? For SVG, motion places the origin on the
 * element's bounding box, so "tip the can on its rope" turned into "spin the
 * can about its middle". An attribute transform pivots exactly where we say,
 * and it is updated without a React render.
 */
export function useSvgTransform<T>(value: MotionValue<T>, toTransform: (v: T) => string) {
  const ref = useRef<SVGGElement>(null);
  const fn = useRef(toTransform);
  fn.current = toTransform;
  useEffect(() => {
    const set = (v: T) => ref.current?.setAttribute('transform', fn.current(v));
    set(value.get());
    return value.on('change', set);
  }, [value]);
  return ref;
}

// ── Small utilities ─────────────────────────────────────────────────────────

export function shuffle<T>(list: readonly T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pick<T>(list: readonly T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

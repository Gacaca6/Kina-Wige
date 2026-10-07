// Inzira — help an animal find its way home (docs/GAMES-DESIGN.md §4.5).
//
// The child moves the animal with one finger along a dirt road between
// hedges. Movement is cell by cell and only along the road, so a shaky finger
// can never put the animal through a hedge — the road is the guide
// ("traces within a guide", phy.fine.control). Thinkrolls' lesson: short drags,
// and the character keeps going for you.
//
//   level 1  one winding road, no dead ends (age 3)
//   level 2  a small maze with a few dead ends
//   level 3  a bigger maze, more turns
//   level 4  bigger again, with bananas to collect and count on the way
//   level 5  a large maze; home is the far end of the longest road
//   level 6  the largest: more bananas, home at the far end
// The level starts from the child's age and climbs after two clean mazes in
// a row (useAdaptiveLevel), so the maze grows with the child.
//
// A sitting is three mazes, each a different animal and home.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as RPointerEvent, ReactNode } from 'react';
import { AnimatePresence, animate, motion, useMotionValue } from 'motion/react';
import { useI18n } from '../../i18n/context';
import { useSound, useHaptic } from '../../hooks/useSound';
import { useStars } from '../../hooks/useStars';
import { useProgress } from '../../hooks/useProgress';
import { useSkillEvidence } from '../../hooks/useSkillEvidence';
import { useStickers } from '../../hooks/useStickers';
import type { Age } from '../../hooks/useFamily';
import { games } from '../../data/games';
import type { KinaMood } from '../../components/characters/Kina';
import GameCelebration from '../../components/game/GameCelebration';
import GameFrame from '../../components/game/kit/GameFrame';
import Stage, { useStage } from '../../components/game/kit/Stage';
import type { Pt } from '../../components/game/kit/Stage';
import GhostHand from '../../components/game/kit/GhostHand';
import { Bursts, useBursts } from '../../components/game/kit/Bursts';
import { hintDelayMs, shuffle, useAdaptiveLevel, useGameAge, useIdleHint } from '../../components/game/kit/hooks';
import { Banana, Chicken, Cow, Elephant, Goat, INK } from '../../components/game/art/Friends';

const W = 400;
const H = 600;
const MAZES_PER_SITTING = 3;

const MAX_LEVEL = 6;

/** Size (cols, rows), bananas (fewest, most), and whether home is at the far end of the longest road. */
const LEVELS: Record<number, { size: [number, number]; bananas: [number, number]; far: boolean }> = {
  1: { size: [3, 4], bananas: [0, 0], far: false },
  2: { size: [4, 5], bananas: [0, 0], far: false },
  3: { size: [5, 6], bananas: [0, 0], far: false },
  4: { size: [5, 7], bananas: [3, 4], far: false },
  5: { size: [6, 8], bananas: [4, 5], far: true },
  6: { size: [7, 9], bananas: [5, 6], far: true },
};

function startLevel(age: Age): number {
  if (age === 3) return 1;
  if (age === 4) return 2;
  if (age === 5) return 3;
  return 4;
}

// ── Maze generation ──────────────────────────────────────────────────────────

const N = 1, E = 2, S = 4, Wd = 8;
const DIRS = [
  { bit: N, dc: 0, dr: -1, back: S },
  { bit: E, dc: 1, dr: 0, back: Wd },
  { bit: S, dc: 0, dr: 1, back: N },
  { bit: Wd, dc: -1, dr: 0, back: E },
];

interface Maze {
  cols: number;
  rows: number;
  /** Open sides per cell (bitmask), [row][col]. */
  open: number[][];
  /** Cells that are road at all (level 1 hides the rest). */
  road: boolean[][];
  start: [number, number];
  goal: [number, number];
  solution: [number, number][];
  bananas: [number, number][];
}

function makeMaze(cols: number, rows: number, level: number): Maze {
  const open = Array.from({ length: rows }, () => Array(cols).fill(0) as number[]);
  const seen = Array.from({ length: rows }, () => Array(cols).fill(false) as boolean[]);
  const stack: [number, number][] = [[rows - 1, 0]];
  seen[rows - 1][0] = true;
  while (stack.length) {
    const [r, c] = stack[stack.length - 1];
    const options = shuffle(DIRS).filter((d) => {
      const nr = r + d.dr;
      const nc = c + d.dc;
      return nr < rows && nc < cols && nr >= 0 && nc >= 0 && !seen[nr][nc];
    });
    if (!options.length) {
      stack.pop();
      continue;
    }
    const d = options[0];
    open[r][c] |= d.bit;
    open[r + d.dr][c + d.dc] |= d.back;
    seen[r + d.dr][c + d.dc] = true;
    stack.push([r + d.dr, c + d.dc]);
  }
  const start: [number, number] = [rows - 1, 0];
  // Bigger levels put home at the cell furthest from the start along the
  // road — the longest walk the maze has, with the most turns to choose.
  const goal: [number, number] = LEVELS[level].far ? furthest(open, rows, cols, start) : [0, cols - 1];
  const solution = solve(open, rows, cols, start, goal);

  let road = Array.from({ length: rows }, () => Array(cols).fill(true) as boolean[]);
  if (level === 1) {
    // One winding road: keep only the way home, so there are no dead ends.
    road = Array.from({ length: rows }, () => Array(cols).fill(false) as boolean[]);
    const onPath = new Set(solution.map(([r, c]) => `${r},${c}`));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!onPath.has(`${r},${c}`)) {
          open[r][c] = 0;
          continue;
        }
        road[r][c] = true;
        for (const d of DIRS) {
          if ((open[r][c] & d.bit) && !onPath.has(`${r + d.dr},${c + d.dc}`)) open[r][c] &= ~d.bit;
        }
      }
    }
  }

  let bananas: [number, number][] = [];
  const [fewest, most] = LEVELS[level].bananas;
  if (most > 0) {
    const cells: [number, number][] = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) cells.push([r, c]);
    const free = cells.filter(([r, c]) => !(r === start[0] && c === start[1]) && !(r === goal[0] && c === goal[1]));
    bananas = shuffle(free).slice(0, fewest + Math.floor(Math.random() * (most - fewest + 1)));
  }
  return { cols, rows, open, road, start, goal, solution, bananas };
}

/** The cell with the longest road from start. */
function furthest(open: number[][], rows: number, cols: number, start: [number, number]): [number, number] {
  const dist = new Map<string, number>([[`${start[0]},${start[1]}`, 0]]);
  const queue: [number, number][] = [start];
  let best = start;
  let bestD = 0;
  while (queue.length) {
    const [r, c] = queue.shift()!;
    const d = dist.get(`${r},${c}`)!;
    if (d > bestD) {
      best = [r, c];
      bestD = d;
    }
    for (const dir of DIRS) {
      if (!(open[r][c] & dir.bit)) continue;
      const k = `${r + dir.dr},${c + dir.dc}`;
      if (dist.has(k)) continue;
      dist.set(k, d + 1);
      queue.push([r + dir.dr, c + dir.dc]);
    }
  }
  return best;
}

function solve(open: number[][], rows: number, cols: number, start: [number, number], goal: [number, number]) {
  const prev = new Map<string, string>();
  const key = (r: number, c: number) => `${r},${c}`;
  const queue: [number, number][] = [start];
  prev.set(key(...start), '');
  while (queue.length) {
    const [r, c] = queue.shift()!;
    if (r === goal[0] && c === goal[1]) break;
    for (const d of DIRS) {
      if (!(open[r][c] & d.bit)) continue;
      const k = key(r + d.dr, c + d.dc);
      if (prev.has(k)) continue;
      prev.set(k, key(r, c));
      queue.push([r + d.dr, c + d.dc]);
    }
  }
  const path: [number, number][] = [];
  let k = key(...goal);
  while (k) {
    const [r, c] = k.split(',').map(Number);
    path.unshift([r, c]);
    k = prev.get(k) ?? '';
  }
  return path;
}

// ── Themes: who is going where ───────────────────────────────────────────────

function Shed() {
  return (
    <g>
      <path d="M-44 -6 L0 -44 L44 -6 z" fill="#B87333" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <rect x={-36} y={-8} width={72} height={46} rx={4} fill="#E2B86E" stroke={INK} strokeWidth={4} />
      <path d="M-14 38 v-30 h28 v30" fill="#7A4A1E" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d="M-30 -14 l30 -24 l30 24" fill="none" stroke="#E8C77F" strokeWidth={3} />
    </g>
  );
}

function GrassPatch() {
  return (
    <g>
      <ellipse cx={0} cy={18} rx={44} ry={16} fill="#3E9B43" stroke={INK} strokeWidth={4} />
      {[-30, -16, -2, 12, 26].map((x, i) => (
        <path key={x} d={`M${x} 20 q${i % 2 ? 4 : -4} -26 ${i % 2 ? 10 : -6} -40 q4 20 6 40 z`} fill="#5CC489" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      ))}
      <circle cx={-22} cy={-6} r={6} fill="#FFC02E" stroke={INK} strokeWidth={2.5} />
      <circle cx={20} cy={-12} r={6} fill="#FF8FB8" stroke={INK} strokeWidth={2.5} />
    </g>
  );
}

function Nest() {
  return (
    <g>
      <ellipse cx={0} cy={10} rx={42} ry={20} fill="#B98A4E" stroke={INK} strokeWidth={4} />
      <ellipse cx={-12} cy={-2} rx={11} ry={14} fill="#FFF6E6" stroke={INK} strokeWidth={3} />
      <ellipse cx={10} cy={-4} rx={11} ry={14} fill="#FFF6E6" stroke={INK} strokeWidth={3} />
      <path d="M-40 6 q20 12 40 0 q20 12 40 0" fill="none" stroke="#7A5A2E" strokeWidth={3} />
    </g>
  );
}

function Pond() {
  return (
    <g>
      <ellipse cx={0} cy={6} rx={46} ry={28} fill="#56C1EA" stroke={INK} strokeWidth={4} />
      <path d="M-24 0 q8 -6 16 0 M6 12 q8 -6 16 0" fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" />
      <path d="M30 -16 q4 -16 12 -22 M36 -12 q8 -12 16 -12" fill="none" stroke="#3E9B43" strokeWidth={4} strokeLinecap="round" />
    </g>
  );
}

interface Theme {
  id: string;
  Who: () => ReactNode;
  Home: () => ReactNode;
  flip?: boolean;
}

const THEMES: Theme[] = [
  { id: 'cow', Who: Cow, Home: Shed },
  { id: 'goat', Who: Goat, Home: GrassPatch },
  { id: 'chicken', Who: Chicken, Home: Nest },
  { id: 'elephant', Who: Elephant, Home: Pond },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function MazeGame() {
  const { language } = useI18n();
  const info = games.find((g) => g.id === 'inzira');
  const { level, report } = useAdaptiveLevel('inzira', MAX_LEVEL, startLevel);
  const { play } = useSound();
  const haptic = useHaptic();
  const { addStar } = useStars();
  const { markGameCompleted } = useProgress();
  const { award } = useStickers();

  const [count, setCount] = useState(0);
  const [kina, setKina] = useState<KinaMood>('idle');
  const [earned, setEarned] = useState<ReturnType<typeof award> | null>(null);
  const [won, setWon] = useState(false);
  const [round, setRound] = useState(0);
  const themes = useMemo(() => shuffle(THEMES), [round]);

  const onDone = useCallback(
    (clean: boolean) => {
      report(clean);
      setKina('cheer');
      window.setTimeout(() => setKina('idle'), 1200);
      const next = count + 1;
      window.setTimeout(() => {
        setCount(next);
        if (next >= MAZES_PER_SITTING) {
          addStar(1);
          markGameCompleted('inzira');
          setEarned(award());
          play('victory_fanfare');
          haptic.success();
          setWon(true);
        }
      }, 1800);
    },
    [count, report, addStar, markGameCompleted, award, play, haptic],
  );

  const again = () => {
    setCount(0);
    setWon(false);
    setEarned(null);
    setRound((r) => r + 1);
  };

  return (
    <GameFrame
      title={info ? info.title[language] : 'Inzira'}
      background="#5CC489"
      deep="#2E8B57"
      kina={kina}
      progress={{ done: Math.min(count, MAZES_PER_SITTING), total: MAZES_PER_SITTING }}
    >
      {!won && (
        <div className="h-full px-2">
          <Stage width={W} height={H}>
            <MazeRound key={`${round}-${count}`} level={level} theme={themes[count % themes.length]} onDone={onDone} onMood={setKina} />
          </Stage>
        </div>
      )}
      {won && <GameCelebration onPlayAgain={again} sticker={earned} />}
    </GameFrame>
  );
}

// ── One maze ─────────────────────────────────────────────────────────────────

function MazeRound({ level, theme, onDone, onMood }: { level: number; theme: Theme; onDone: (clean: boolean) => void; onMood: (m: KinaMood) => void }) {
  const stage = useStage();
  const age = useGameAge();
  const { play } = useSound();
  const haptic = useHaptic();
  const { record } = useSkillEvidence();
  const { bursts, burst } = useBursts();

  const [cols, rows] = LEVELS[level].size;
  const maze = useMemo(() => makeMaze(cols, rows, level), [cols, rows, level]);

  const top = LEVELS[level].bananas[1] > 0 ? 76 : 24;
  const cell = Math.min((W - 30) / cols, (H - top - 16) / rows);
  const x0 = (W - cell * cols) / 2;
  const y0 = top + (H - top - 16 - cell * rows) / 2;
  const center = useCallback((r: number, c: number): Pt => ({ x: x0 + (c + 0.5) * cell, y: y0 + (r + 0.5) * cell }), [x0, y0, cell]);

  const [pos, setPos] = useState<[number, number]>(maze.start);
  const posRef = useRef(pos);
  posRef.current = pos;
  const [trail, setTrail] = useState<[number, number][]>([maze.start]);
  const [eaten, setEaten] = useState<Set<string>>(new Set());
  const [arrived, setArrived] = useState(false);
  const bumps = useRef(0);
  const bumping = useRef(false);
  const dragging = useRef<number | null>(null);
  const hints = useRef(0);

  const cx = useMotionValue(center(...maze.start).x);
  const cy = useMotionValue(center(...maze.start).y);
  const [facing, setFacing] = useState(1);

  const { idle, poke } = useIdleHint(hintDelayMs(age), trail.length, !arrived);
  useEffect(() => {
    if (idle) hints.current += 1;
  }, [idle]);

  const moveTo = (r: number, c: number) => {
    const [pr, pc] = posRef.current;
    if (c !== pc) setFacing(c > pc ? 1 : -1);
    posRef.current = [r, c];
    setPos([r, c]);
    setTrail((t) => [...t, [r, c]]);
    const p = center(r, c);
    animate(cx, p.x, { type: 'spring', stiffness: 500, damping: 34 });
    animate(cy, p.y, { type: 'spring', stiffness: 500, damping: 34 });
    play('tick', 0.8 + Math.random() * 0.3);
    poke();
    const key = `${r},${c}`;
    if (maze.bananas.some(([br, bc]) => br === r && bc === c) && !eaten.has(key)) {
      setEaten((s) => new Set(s).add(key));
      play('pop', 1.3);
      haptic.tick();
      burst(p, { colors: ['#FFC02E', '#FFFFFF'], size: 0.6 });
    }
    if (r === maze.goal[0] && c === maze.goal[1]) {
      dragging.current = null;
      setArrived(true);
      const clean = bumps.current <= 2 && hints.current <= 1;
      record('phy.fine.control', clean, 'game:inzira');
      play('step');
      haptic.success();
      burst(p, { size: 1.4 });
      window.setTimeout(() => {
        play('sparkle');
        onDone(clean);
      }, 500);
    }
  };

  const cellAt = (p: Pt): [number, number] | null => {
    const c = Math.floor((p.x - x0) / cell);
    const r = Math.floor((p.y - y0) / cell);
    if (r < 0 || c < 0 || r >= rows || c >= cols) return null;
    return [r, c];
  };

  /** Walk toward the finger, one open step at a time, along straight runs. */
  const follow = (p: Pt) => {
    const target = cellAt(p);
    if (!target) return;
    for (let guard = 0; guard < 8; guard++) {
      const [r, c] = posRef.current;
      if (target[0] === r && target[1] === c) {
        bumping.current = false;
        return;
      }
      const dr = Math.sign(target[0] - r);
      const dc = Math.sign(target[1] - c);
      // Prefer the axis the finger is further along; try the other if blocked.
      const tries = Math.abs(target[0] - r) >= Math.abs(target[1] - c) ? [[dr, 0], [0, dc]] : [[0, dc], [dr, 0]];
      let moved = false;
      for (const [tr, tc] of tries) {
        if (!tr && !tc) continue;
        const d = DIRS.find((x) => x.dr === tr && x.dc === tc)!;
        if (maze.open[r][c] & d.bit) {
          moveTo(r + tr, c + tc);
          moved = true;
          break;
        }
      }
      if (!moved) {
        // The finger is pushing into a hedge. Counted once; nothing happens on screen.
        if (!bumping.current && Math.abs(target[0] - r) + Math.abs(target[1] - c) === 1) {
          bumping.current = true;
          bumps.current += 1;
          onMood('oops');
          window.setTimeout(() => onMood('idle'), 500);
        }
        return;
      }
      if (posRef.current[0] === maze.goal[0] && posRef.current[1] === maze.goal[1]) return;
    }
  };

  const down = (e: RPointerEvent<SVGRectElement>) => {
    if (arrived) return;
    const p = stage.toLocal(e.clientX, e.clientY);
    const here = center(...posRef.current);
    // Start from the animal (generously) — a child who taps elsewhere is shown how.
    if (Math.hypot(p.x - here.x, p.y - here.y) > cell * 0.9) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* fine without */
    }
    dragging.current = e.pointerId;
    play('pop', 0.9);
  };

  const moveFinger = (e: RPointerEvent<SVGRectElement>) => {
    if (dragging.current !== e.pointerId || arrived) return;
    follow(stage.toLocal(e.clientX, e.clientY));
  };

  const up = (e: RPointerEvent<SVGRectElement>) => {
    if (dragging.current === e.pointerId) dragging.current = null;
    bumping.current = false;
  };

  // Hint: the next few steps of the way home from where the animal is now.
  const gesture = useMemo(() => {
    if (!idle || arrived) return null;
    const path = solve(maze.open, rows, cols, posRef.current, maze.goal).slice(0, 5);
    if (path.length < 2) return null;
    return { kind: 'path' as const, points: path.map(([r, c]) => center(r, c)) };
  }, [idle, arrived, maze, rows, cols, center]);

  // The road network, as thick strokes between connected cells.
  const roads = useMemo(() => {
    const segs: string[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!maze.road[r][c]) continue;
        const a = center(r, c);
        segs.push(`M${a.x} ${a.y} l0.01 0`);
        if (maze.open[r][c] & E) {
          const b = center(r, c + 1);
          segs.push(`M${a.x} ${a.y} L${b.x} ${b.y}`);
        }
        if (maze.open[r][c] & S) {
          const b = center(r + 1, c);
          segs.push(`M${a.x} ${a.y} L${b.x} ${b.y}`);
        }
      }
    }
    return segs.join(' ');
  }, [maze, rows, cols, center]);

  const trailPath = trail.map(([r, c], i) => {
    const p = center(r, c);
    return `${i ? 'L' : 'M'}${p.x} ${p.y}`;
  }).join(' ');

  const goal = center(...maze.goal);
  const s = (cell / 100) * 0.95;

  // A bush on every wall between two cells, so the hedges read as hedges.
  const hedges = useMemo(() => {
    const out: Pt[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (c + 1 < cols && !(maze.open[r][c] & E)) out.push({ x: x0 + (c + 1) * cell, y: y0 + (r + 0.5) * cell });
        if (r + 1 < rows && !(maze.open[r][c] & S)) out.push({ x: x0 + (c + 0.5) * cell, y: y0 + (r + 1) * cell });
      }
    }
    return out;
  }, [maze, rows, cols, x0, y0, cell]);

  return (
    <g>
      {/* grass and hedges */}
      <rect x={4} y={top - 14} width={W - 8} height={H - top + 6} rx={26} fill="#2E8B57" stroke={INK} strokeWidth={4} />
      {hedges.map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y})`}>
          <circle r={cell * 0.17} fill="#3E9B43" stroke="#24683F" strokeWidth={2} />
          <circle cx={-cell * 0.05} cy={-cell * 0.05} r={cell * 0.06} fill="#5CC489" />
        </g>
      ))}

      {/* the road: an ink edge, then the dirt */}
      <path d={roads} fill="none" stroke={INK} strokeWidth={cell * 0.62 + 8} strokeLinecap="round" strokeLinejoin="round" />
      <path d={roads} fill="none" stroke="#E8C98E" strokeWidth={cell * 0.62} strokeLinecap="round" strokeLinejoin="round" />
      {/* where the animal has walked */}
      <path d={trailPath} fill="none" stroke="#C9A061" strokeWidth={cell * 0.14} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`1 ${cell * 0.28}`} />

      {/* bananas to collect (level 4 up) and the counter */}
      {maze.bananas.map(([r, c]) => {
        const k = `${r},${c}`;
        const p = center(r, c);
        return (
          <AnimatePresence key={k}>
            {!eaten.has(k) && (
              <motion.g initial={{ scale: 0, x: p.x, y: p.y }} animate={{ scale: s * 0.55, x: p.x, y: p.y }} exit={{ scale: 0, y: p.y - 30 }}>
                <Banana />
              </motion.g>
            )}
          </AnimatePresence>
        );
      })}
      {maze.bananas.length > 0 && (
        <g aria-hidden>
          {maze.bananas.map((_, i) => (
            <g key={i} transform={`translate(${200 + (i - (maze.bananas.length - 1) / 2) * 50} 30) scale(0.34)`} opacity={i < eaten.size ? 1 : 0.25}>
              <Banana />
            </g>
          ))}
        </g>
      )}

      {/* home */}
      <g transform={`translate(${goal.x} ${goal.y}) scale(${s})`}>
        <theme.Home />
      </g>
      {!arrived && (
        <motion.circle
          cx={goal.x}
          cy={goal.y}
          r={cell * 0.48}
          fill="none"
          stroke="#FFC02E"
          strokeWidth={5}
          strokeDasharray="10 8"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
      )}

      {/* the traveller */}
      <motion.g style={{ x: cx, y: cy }}>
        <circle r={cell * 0.42} fill="#FFFFFF" opacity={0.35} />
        <motion.g animate={{ scaleX: facing * s, scaleY: s, y: arrived ? [0, -14, 0] : 0 }} transition={{ y: { duration: 0.5, repeat: arrived ? 3 : 0 } }}>
          <theme.Who />
        </motion.g>
      </motion.g>

      {/* touch surface over the whole maze */}
      <rect x={0} y={0} width={W} height={H} fill="transparent" onPointerDown={down} onPointerMove={moveFinger} onPointerUp={up} onPointerCancel={up} />

      <Bursts bursts={bursts} />
      <AnimatePresence>{gesture && <GhostHand gesture={gesture} scale={0.8} />}</AnimatePresence>
    </g>
  );
}

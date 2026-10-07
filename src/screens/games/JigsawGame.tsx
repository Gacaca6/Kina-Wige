// Teranya Ishusho — put the picture together (docs/GAMES-DESIGN.md §4.4).
//
// The toddler-jigsaw pattern that works (Sago Mini and the best puzzle apps):
// the finished picture shows faintly on the board, big real jigsaw pieces wait
// in the tray, and each snaps in by itself once it is near its place. The same
// picture comes in 4, 6, 9 or 12 pieces, so it grows with the child — the size
// starts from their age and follows them (useAdaptiveLevel).
// When the last piece goes in, the picture comes alive.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
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
import Draggable, { within } from '../../components/game/kit/Draggable';
import GhostHand from '../../components/game/kit/GhostHand';
import { Bursts, useBursts } from '../../components/game/kit/Bursts';
import { hintDelayMs, shuffle, snapRadiusPx, useAdaptiveLevel, useGameAge, useIdleHint } from '../../components/game/kit/hooks';
import { SCENES, SCENE_H, SCENE_W } from '../../components/game/art/Scenes';
import type { SceneInfo } from '../../components/game/art/Scenes';
import { INK } from '../../components/game/art/Friends';

const GRIDS: Record<number, [number, number]> = { 1: [2, 2], 2: [3, 2], 3: [3, 3], 4: [4, 3] };

function startLevel(age: Age): number {
  if (age === 3) return 1;
  if (age === 4) return 2;
  return 3;
}

const W = 400;
const H = 600;
const BOARD = { x: 20, y: 16 };

// ── Piece outlines ───────────────────────────────────────────────────────────

/** One edge from A to B; `s` = +1 knob out, -1 knob in, 0 flat. */
function edge(ax: number, ay: number, bx: number, by: number, s: number, k: number): string {
  if (s === 0) return `L${bx} ${by}`;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy);
  // Left-hand normal of the direction of travel = outward for a clockwise piece.
  const nx = (dy / len) * k * s;
  const ny = (-dx / len) * k * s;
  const P = (u: number, v: number) => `${(ax + u * dx + v * nx).toFixed(1)} ${(ay + u * dy + v * ny).toFixed(1)}`;
  return [
    `L${P(0.36, 0)}`,
    `C${P(0.4, 0)} ${P(0.42, 0.05)} ${P(0.39, 0.1)}`,
    `C${P(0.34, 0.18)} ${P(0.42, 0.28)} ${P(0.5, 0.28)}`,
    `C${P(0.58, 0.28)} ${P(0.66, 0.18)} ${P(0.61, 0.1)}`,
    `C${P(0.58, 0.05)} ${P(0.6, 0)} ${P(0.64, 0)}`,
    `L${bx} ${by}`,
  ].join(' ');
}

interface PieceDef {
  id: number;
  path: string;
  cx: number;
  cy: number;
}

function cutPieces(cols: number, rows: number): PieceDef[] {
  const pw = SCENE_W / cols;
  const ph = SCENE_H / rows;
  const k = Math.min(pw, ph);
  const coin = () => (Math.random() >= 0.5 ? -1 : 1);
  // H[r][c]: edge above row r; +1 = knob from the upper piece pointing down.
  const Hs = Array.from({ length: rows + 1 }, () => Array.from({ length: cols }, coin));
  const Vs = Array.from({ length: rows }, () => Array.from({ length: cols + 1 }, coin));
  const out: PieceDef[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x0 = c * pw;
      const y0 = r * ph;
      const x1 = x0 + pw;
      const y1 = y0 + ph;
      const top = r === 0 ? 0 : -Hs[r][c];
      const right = c === cols - 1 ? 0 : Vs[r][c + 1];
      const bottom = r === rows - 1 ? 0 : Hs[r + 1][c];
      const left = c === 0 ? 0 : -Vs[r][c];
      const path = [
        `M${x0} ${y0}`,
        edge(x0, y0, x1, y0, top, k),
        edge(x1, y0, x1, y1, right, k),
        edge(x1, y1, x0, y1, bottom, k),
        edge(x0, y1, x0, y0, left, k),
        'Z',
      ].join(' ');
      out.push({ id: r * cols + c, path, cx: x0 + pw / 2, cy: y0 + ph / 2 });
    }
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function JigsawGame() {
  const { language } = useI18n();
  const info = games.find((g) => g.id === 'teranya');
  const { level, report } = useAdaptiveLevel('teranya', 4, startLevel);
  const { play } = useSound();
  const haptic = useHaptic();
  const { addStar } = useStars();
  const { markGameCompleted } = useProgress();
  const { award } = useStickers();

  const [scene, setScene] = useState<SceneInfo | null>(null);
  const [grid, setGrid] = useState<[number, number]>(GRIDS[level]);
  const [placed, setPlaced] = useState(0);
  const [kina, setKina] = useState<KinaMood>('idle');
  const [earned, setEarned] = useState<ReturnType<typeof award> | null>(null);
  const [won, setWon] = useState(false);
  const [round, setRound] = useState(0);

  const choose = (s: SceneInfo) => {
    play('tap');
    haptic.lightTap();
    setGrid(GRIDS[level]);
    setPlaced(0);
    setScene(s);
    setRound((r) => r + 1);
  };

  const onPlaced = useCallback(() => {
    setPlaced((n) => n + 1);
    setKina('cheer');
    window.setTimeout(() => setKina('idle'), 600);
  }, []);

  const onComplete = useCallback(
    (clean: boolean) => {
      report(clean);
      addStar(1);
      markGameCompleted('teranya');
      window.setTimeout(() => {
        setEarned(award());
        play('victory_fanfare');
        haptic.success();
        setWon(true);
      }, 2800);
    },
    [report, addStar, markGameCompleted, award, play, haptic],
  );

  const again = () => {
    setWon(false);
    setEarned(null);
    setScene(null);
  };

  const total = grid[0] * grid[1];

  return (
    <GameFrame
      title={info ? info.title[language] : 'Jigsaw'}
      background="#FF6B4A"
      deep="#CC4A2E"
      kina={scene ? kina : undefined}
      progress={scene ? { done: placed, total } : undefined}
      onBack={scene && !won ? () => setScene(null) : undefined}
    >
      {!scene && <ScenePicker onChoose={choose} />}
      {scene && !won && (
        <div className="h-full px-2">
          <Stage width={W} height={H}>
            <Puzzle key={round} scene={scene} cols={grid[0]} rows={grid[1]} onPlaced={onPlaced} onComplete={onComplete} />
          </Stage>
        </div>
      )}
      {won && <GameCelebration onPlayAgain={again} sticker={earned} />}
    </GameFrame>
  );
}

function ScenePicker({ onChoose }: { onChoose: (s: SceneInfo) => void }) {
  const { language } = useI18n();
  return (
    <div className="h-full overflow-y-auto overscroll-contain px-4 pt-2 pb-6 grid grid-cols-2 gap-4 content-start">
      {SCENES.map((s) => (
        <motion.button
          key={s.id}
          onClick={() => onChoose(s)}
          aria-label={s.name[language]}
          whileTap={{ y: 5, boxShadow: '0 2px 0 #CC4A2E' }}
          transition={{ type: 'spring', stiffness: 900, damping: 34, mass: 0.5 }}
          className="rounded-[22px] bg-white p-2 flex flex-col gap-1.5"
          style={{ boxShadow: '0 7px 0 #CC4A2E' }}
        >
          <svg viewBox={`0 0 ${SCENE_W} ${SCENE_H}`} className="w-full rounded-[14px]" style={{ display: 'block', height: 'auto' }} aria-hidden>
            <s.Draw alive={false} />
          </svg>
          <span className="font-display font-extrabold text-center leading-tight" style={{ fontSize: 15, color: '#17543C' }}>
            {s.name[language]}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

// ── The puzzle ───────────────────────────────────────────────────────────────

interface PuzzleProps {
  scene: SceneInfo;
  cols: number;
  rows: number;
  onPlaced: () => void;
  onComplete: (clean: boolean) => void;
}

function Puzzle({ scene, cols, rows, onPlaced, onComplete }: PuzzleProps) {
  const stage = useStage();
  const age = useGameAge();
  const { language } = useI18n();
  const { play } = useSound();
  const haptic = useHaptic();
  const { record } = useSkillEvidence();
  const { bursts, burst } = useBursts();

  const pieces = useMemo(() => cutPieces(cols, rows), [cols, rows]);
  const n = pieces.length;
  const pw = SCENE_W / cols;
  const ph = SCENE_H / rows;

  // The tray: a grid under the board, pieces shuffled into it.
  const { homes, restScale } = useMemo(() => {
    const tCols = n <= 4 ? 2 : n <= 9 ? 3 : 4;
    const tRows = Math.ceil(n / tCols);
    const top = BOARD.y + SCENE_H + 30;
    const cellW = (W - 20) / tCols;
    const cellH = (H - top - 6) / tRows;
    const k = Math.min(pw, ph) * 0.28;
    const scale = Math.min(0.95, (cellW * 0.86) / (pw + 2 * k), (cellH * 0.86) / (ph + 2 * k));
    const spots: Pt[] = [];
    for (let i = 0; i < n; i++) {
      const c = i % tCols;
      const r = Math.floor(i / tCols);
      spots.push({ x: 10 + cellW * (c + 0.5), y: top + cellH * (r + 0.5) });
    }
    return { homes: shuffle(spots), restScale: scale };
  }, [n, pw, ph]);

  const [done, setDone] = useState<Set<number>>(new Set());
  const [alive, setAlive] = useState(false);
  const misdrops = useRef(0);
  const hints = useRef(0);

  const { idle, poke } = useIdleHint(hintDelayMs(age), done.size, !alive);
  useEffect(() => {
    if (idle) hints.current += 1;
  }, [idle]);

  const target = (p: { cx: number; cy: number }): Pt => ({ x: BOARD.x + p.cx, y: BOARD.y + p.cy });
  const radius = () => Math.max(snapRadiusPx(age) / stage.pxPerUnit(), Math.min(pw, ph) * 0.45);

  const drop = (id: number, at: Pt): Pt | null => {
    const own = pieces[id];
    if (within(at, target(own), radius())) return target(own);
    // Close to a different empty place? A real attempt, gently not quite.
    const other = pieces.find((p) => p.id !== id && !done.has(p.id) && within(at, target(p), radius() * 0.8));
    if (other) {
      misdrops.current += 1;
      play('boop');
      haptic.lightTap();
    }
    return null;
  };

  const snapped = (id: number) => {
    play('snap', 0.85 + (done.size / n) * 0.5);
    haptic.mediumTap();
    burst(target(pieces[id]), { size: 0.7 });
    poke();
    onPlaced();
    setDone((s) => {
      const next = new Set(s);
      next.add(id);
      if (next.size === n) {
        const clean = misdrops.current <= Math.floor(n / 4) && hints.current <= 1;
        record('num.shape.build', clean, 'game:teranya');
        window.setTimeout(() => {
          setAlive(true);
          play('sparkle');
          burst({ x: BOARD.x + SCENE_W / 2, y: BOARD.y + SCENE_H / 2 }, { size: 1.8 });
          window.setTimeout(() => burst({ x: BOARD.x + 60, y: BOARD.y + 60 }), 250);
          window.setTimeout(() => burst({ x: BOARD.x + SCENE_W - 60, y: BOARD.y + SCENE_H - 60 }), 450);
          onComplete(clean);
        }, 350);
      }
      return next;
    });
  };

  const nextPiece = pieces.find((p) => !done.has(p.id));
  const gesture = idle && nextPiece && !alive ? { kind: 'drag' as const, from: homes[nextPiece.id], to: target(nextPiece) } : null;

  return (
    <g>
      <defs>
        <g id="kw-scene">
          <scene.Draw alive={false} />
        </g>
        {pieces.map((p) => (
          <clipPath key={p.id} id={`kw-piece-${p.id}`}>
            <path d={p.path} />
          </clipPath>
        ))}
      </defs>

      {/* the board: the picture, faint, with the cut lines */}
      <g transform={`translate(${BOARD.x} ${BOARD.y})`}>
        <rect x={-8} y={-8} width={SCENE_W + 16} height={SCENE_H + 16} rx={18} fill="#FFFDF7" stroke={INK} strokeWidth={4} />
        <g opacity={0.22}>
          <use href="#kw-scene" />
        </g>
        {pieces.map((p) => (
          <path key={p.id} d={p.path} fill="none" stroke="#FFFFFF" strokeWidth={2.5} strokeDasharray="6 6" opacity={0.9} />
        ))}
      </g>

      {/* Placed pieces first, so a piece being moved always passes OVER the
          finished part of the picture, never under it. */}
      {[...pieces].sort((a, b) => Number(done.has(b.id)) - Number(done.has(a.id))).map((p) => (
        <Draggable
          key={p.id}
          home={homes[p.id]}
          restScale={restScale}
          liftScale={1.04}
          disabled={done.has(p.id) || alive}
          onPickUp={() => {
            poke();
            play('pop', 0.8);
          }}
          onDrop={(at) => drop(p.id, at)}
          onSnapped={() => snapped(p.id)}
        >
          <g transform={`translate(${-p.cx} ${-p.cy})`}>
            <path d={p.path} transform="translate(0 5)" fill="#00000033" />
            <g clipPath={`url(#kw-piece-${p.id})`}>
              <use href="#kw-scene" />
            </g>
            <path d={p.path} fill="none" stroke={done.has(p.id) ? 'transparent' : INK} strokeWidth={3} strokeLinejoin="round" />
          </g>
        </Draggable>
      ))}

      {/* finished: the picture wakes up */}
      <AnimatePresence>
        {alive && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <g transform={`translate(${BOARD.x} ${BOARD.y})`}>
              <clipPath id="kw-scene-frame">
                <rect width={SCENE_W} height={SCENE_H} rx={6} />
              </clipPath>
              <g clipPath="url(#kw-scene-frame)">
                <scene.Draw alive />
              </g>
            </g>
            <motion.g initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 18 }}>
              <rect x={40} y={BOARD.y + SCENE_H + 40} width={320} height={64} rx={22} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
              <text x={200} y={BOARD.y + SCENE_H + 82} textAnchor="middle" fontFamily="'Baloo 2', 'Fredoka', sans-serif" fontWeight={800} fontSize={26} fill="#17543C">
                {scene.name[language]}
              </text>
            </motion.g>
          </motion.g>
        )}
      </AnimatePresence>

      <Bursts bursts={bursts} />
      <AnimatePresence>{gesture && <GhostHand gesture={gesture} />}</AnimatePresence>
    </g>
  );
}

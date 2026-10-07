// Imiterere n'Amabara — shapes and colours (docs/GAMES-DESIGN.md §4.3).
//
// Busy Shapes' progression, on an imigongo-framed board:
//   levels  1–10  shapes only: one shape and one hole, then more
//   levels 11–14  colours: same shape, the coloured rim says which
//   levels 15–18  shape AND colour together (two attributes at once)
//   levels 19–22  a banana leaf has blown over a hole — move it first
//   levels 23–30  more of everything
// A sitting is five levels. Each clean level moves the child on; two
// struggling levels in a row step back (useAdaptiveLevel, upAfter = 1).
//
// A wrong hole gently pushes the piece back to the tray. A drop on empty board
// is not a mistake — the child was only moving it.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useI18n } from '../../i18n/context';
import { useSound, useHaptic } from '../../hooks/useSound';
import { useStars } from '../../hooks/useStars';
import { useProgress } from '../../hooks/useProgress';
import { useSkillEvidence } from '../../hooks/useSkillEvidence';
import { useStickers } from '../../hooks/useStickers';
import type { Age } from '../../hooks/useFamily';
import type { SkillId } from '../../data/curriculum';
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
import { Board, Hole, Leaf, ShapePiece } from '../../components/game/art/Shapes';
import type { ShapeKind } from '../../components/game/art/Shapes';

// ── Levels ───────────────────────────────────────────────────────────────────

interface Slot {
  kind: ShapeKind;
  /** Hole colour. Absent = any colour fits (shape-only level). */
  color?: string;
  /** Piece colour when the hole has none. */
  pieceColor?: string;
}

interface LevelDef {
  slots: Slot[];
  /** Indexes of holes covered by a leaf. */
  leaves?: number[];
}

const S = (kind: ShapeKind, pieceColor: string): Slot => ({ kind, pieceColor });
const C = (kind: ShapeKind, color: string): Slot => ({ kind, color });

const LEVELS: LevelDef[] = [
  { slots: [S('circle', 'red')] },
  { slots: [S('square', 'blue')] },
  { slots: [S('triangle', 'yellow')] },
  { slots: [S('circle', 'green'), S('square', 'red')] },
  { slots: [S('triangle', 'blue'), S('circle', 'yellow')] },
  { slots: [S('square', 'purple'), S('triangle', 'green')] },
  { slots: [S('circle', 'red'), S('square', 'yellow'), S('triangle', 'blue')] },
  { slots: [S('rectangle', 'green'), S('circle', 'purple'), S('triangle', 'red')] },
  { slots: [S('star', 'yellow'), S('square', 'blue'), S('circle', 'pink')] },
  { slots: [S('heart', 'red'), S('triangle', 'green'), S('rectangle', 'blue')] },
  // colour
  { slots: [C('circle', 'red'), C('circle', 'blue')] },
  { slots: [C('square', 'yellow'), C('square', 'green')] },
  { slots: [C('triangle', 'red'), C('triangle', 'blue'), C('triangle', 'yellow')] },
  { slots: [C('circle', 'red'), C('circle', 'blue'), C('circle', 'green')] },
  // shape and colour together
  { slots: [C('circle', 'red'), C('circle', 'blue'), C('square', 'red')] },
  { slots: [C('triangle', 'blue'), C('triangle', 'yellow'), C('square', 'blue')] },
  { slots: [C('circle', 'green'), C('star', 'green'), C('star', 'red')] },
  { slots: [C('heart', 'red'), C('heart', 'yellow'), C('circle', 'red'), C('circle', 'yellow')] },
  // obstacles
  { slots: [S('circle', 'blue'), S('square', 'yellow')], leaves: [0] },
  { slots: [S('triangle', 'red'), S('star', 'yellow'), S('circle', 'green')], leaves: [1, 2] },
  { slots: [C('square', 'red'), C('square', 'blue'), C('circle', 'red')], leaves: [0] },
  { slots: [S('heart', 'pink'), S('rectangle', 'green'), S('triangle', 'blue'), S('circle', 'yellow')], leaves: [1, 3] },
  // more of everything
  { slots: [S('circle', 'red'), S('square', 'blue'), S('triangle', 'yellow'), S('star', 'green')] },
  { slots: [C('circle', 'red'), C('circle', 'blue'), C('circle', 'yellow'), C('circle', 'green')] },
  { slots: [C('square', 'red'), C('triangle', 'red'), C('square', 'green'), C('triangle', 'green')] },
  { slots: [S('heart', 'red'), S('star', 'yellow'), S('rectangle', 'blue'), S('circle', 'purple'), S('triangle', 'green')] },
  { slots: [C('star', 'yellow'), C('star', 'blue'), C('heart', 'yellow'), C('heart', 'blue')], leaves: [2] },
  { slots: [C('circle', 'red'), C('square', 'blue'), C('triangle', 'yellow'), C('circle', 'blue'), C('square', 'red')] },
  { slots: [C('heart', 'pink'), C('star', 'purple'), C('heart', 'purple'), C('star', 'pink'), C('circle', 'green')], leaves: [0, 3] },
  { slots: [C('rectangle', 'red'), C('rectangle', 'blue'), C('triangle', 'red'), C('triangle', 'blue'), C('circle', 'yellow')], leaves: [1, 4] },
];

const ROUND_LEVELS = 5;

function startLevel(age: Age): number {
  if (age === 3) return 1;
  if (age === 4) return 4;
  if (age === 5) return 7;
  return 11;
}

/** Which skill a level's drops are evidence for. */
function skillOf(def: LevelDef): SkillId {
  const coloured = def.slots.some((s) => s.color);
  if (!coloured) return 'num.sort.one';
  const kinds = new Set(def.slots.map((s) => s.kind));
  const colours = new Set(def.slots.map((s) => s.color));
  // Both attributes vary → the child must use both to choose.
  return kinds.size > 1 && colours.size > 1 ? 'num.sort.two' : 'num.sort.one';
}

// ── Layout ───────────────────────────────────────────────────────────────────

const W = 400;
const H = 600;
const BOARD = { x: 16, y: 20, w: 368, h: 320 };

function holePositions(n: number): Pt[] {
  const cx = BOARD.x + BOARD.w / 2;
  const cy = BOARD.y + BOARD.h / 2;
  switch (n) {
    case 1: return [{ x: cx, y: cy }];
    case 2: return [{ x: cx - 80, y: cy }, { x: cx + 80, y: cy }];
    case 3: return [{ x: cx - 100, y: cy - 50 }, { x: cx + 100, y: cy - 50 }, { x: cx, y: cy + 62 }];
    case 4: return [{ x: cx - 80, y: cy - 66 }, { x: cx + 80, y: cy - 66 }, { x: cx - 80, y: cy + 66 }, { x: cx + 80, y: cy + 66 }];
    default: return [
      { x: cx - 112, y: cy - 66 }, { x: cx, y: cy - 66 }, { x: cx + 112, y: cy - 66 },
      { x: cx - 58, y: cy + 66 }, { x: cx + 58, y: cy + 66 },
    ];
  }
}

function trayPositions(n: number): Pt[] {
  if (n <= 3) {
    const xs = n === 1 ? [200] : n === 2 ? [130, 270] : [90, 200, 310];
    return xs.map((x) => ({ x, y: 470 }));
  }
  const top = n === 4 ? [110, 290] : [80, 200, 320];
  const bottom = n === 4 ? [110, 290] : [140, 260];
  return [...top.map((x) => ({ x, y: 420 })), ...bottom.map((x) => ({ x, y: 530 }))];
}

// ─────────────────────────────────────────────────────────────────────────────

export default function ShapesGame() {
  const { language, t } = useI18n();
  const info = games.find((g) => g.id === 'imiterere');
  const { level, report } = useAdaptiveLevel('imiterere', LEVELS.length, startLevel, 1);
  const { play } = useSound();
  const haptic = useHaptic();
  const { addStar } = useStars();
  const { markGameCompleted } = useProgress();
  const { award } = useStickers();
  const { recordOffline } = useSkillEvidence();

  const [played, setPlayed] = useState(0);
  const [kina, setKina] = useState<KinaMood>('idle');
  const [earned, setEarned] = useState<ReturnType<typeof award> | null>(null);
  const [won, setWon] = useState(false);
  const [named, setNamed] = useState(false);
  const [round, setRound] = useState(0);

  const def = LEVELS[level - 1];

  const onLevelDone = useCallback(
    (clean: boolean) => {
      setKina('cheer');
      window.setTimeout(() => setKina('idle'), 1000);
      report(clean);
      const next = played + 1;
      setPlayed(next);
      if (next >= ROUND_LEVELS) {
        addStar(1);
        markGameCompleted('imiterere');
        window.setTimeout(() => {
          setEarned(award());
          play('victory_fanfare');
          haptic.success();
          setWon(true);
        }, 900);
      }
    },
    [played, report, addStar, markGameCompleted, award, play, haptic],
  );

  const again = () => {
    setPlayed(0);
    setWon(false);
    setEarned(null);
    setNamed(false);
    setRound((r) => r + 1);
  };

  return (
    <GameFrame
      title={info ? info.title[language] : 'Shapes'}
      background="#2FBF6B"
      deep="#1E8C4C"
      kina={kina}
      progress={{ done: Math.min(played, ROUND_LEVELS), total: ROUND_LEVELS }}
    >
      <div className="h-full relative px-2">
        {!won && (
          <Stage width={W} height={H}>
            <AnimatePresence mode="wait">
              <motion.g
                key={`${round}-${played}`}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.35 }}
              >
                <ShapeLevel def={def} onDone={onLevelDone} onMood={setKina} />
              </motion.g>
            </AnimatePresence>
          </Stage>
        )}
      </div>

      {won && (
        <GameCelebration
          onPlayAgain={again}
          sticker={earned}
          extra={
            <div className="mt-6 w-full max-w-xs rounded-[22px] p-4 text-left" style={{ background: '#0E3626' }}>
              <p className="font-body font-black text-[12px] tracking-[.12em]" style={{ color: '#FFC02E' }}>KINA CHALLENGE</p>
              <p className="font-body font-bold text-white mt-1" style={{ fontSize: 15 }}>{t('imiterere.challenge')}</p>
              <button
                onClick={() => {
                  if (named) return;
                  // The adult is the instrument: a screen cannot hear a child
                  // name a shape (same mechanism as the Memory game, §13).
                  recordOffline(['num.shape.name'], 'imiterere');
                  setNamed(true);
                  play('success');
                }}
                className="mt-3 w-full rounded-[16px] font-body font-black"
                style={{ minHeight: 52, background: named ? '#1E8C4C' : '#FFFFFF', color: named ? '#FFFFFF' : '#17543C', fontSize: 15 }}
              >
                {named ? `✓ ${t('karaba.challengeThanks')}` : t('imiterere.challengeDone')}
              </button>
            </div>
          }
        />
      )}
    </GameFrame>
  );
}

// ── One level ────────────────────────────────────────────────────────────────

interface PieceState {
  id: number;
  slot: number; // which hole is its home
  kind: ShapeKind;
  color: string;
  home: Pt;
  placed: boolean;
}

function ShapeLevel({ def, onDone, onMood }: { def: LevelDef; onDone: (clean: boolean) => void; onMood: (m: KinaMood) => void }) {
  const stage = useStage();
  const age = useGameAge();
  const { play } = useSound();
  const haptic = useHaptic();
  const { record } = useSkillEvidence();
  const { bursts, burst } = useBursts();

  const holes = useMemo(() => holePositions(def.slots.length), [def]);
  const [pieces, setPieces] = useState<PieceState[]>(() => {
    const tray = shuffle(trayPositions(def.slots.length));
    return def.slots.map((s, i) => ({
      id: i,
      slot: i,
      kind: s.kind,
      color: s.color ?? s.pieceColor ?? 'blue',
      home: tray[i],
      placed: false,
    }));
  });
  const [leafAt, setLeafAt] = useState<Record<number, Pt>>(() =>
    Object.fromEntries((def.leaves ?? []).map((h) => [h, { x: holes[h].x + 8, y: holes[h].y - 4 }])),
  );
  const mistakes = useRef(0);
  const hints = useRef(0);
  const done = useRef(false);
  const skill = skillOf(def);

  const placedCount = pieces.filter((p) => p.placed).length;
  const { idle, poke } = useIdleHint(hintDelayMs(age), placedCount);
  useEffect(() => {
    if (idle) hints.current += 1;
  }, [idle]);

  const covered = (h: number) => {
    const leaf = leafAt[h];
    return !!leaf && Math.hypot(leaf.x - holes[h].x, leaf.y - holes[h].y) < 70;
  };

  /** A piece fits a hole if the shape matches, and the colour too when the hole asks. */
  const fits = (p: PieceState, h: number) => {
    const s = def.slots[h];
    return s.kind === p.kind && (!s.color || s.color === p.color);
  };

  const radius = () => snapRadiusPx(age) / stage.pxPerUnit();

  const takenHoles = new Set(pieces.filter((p) => p.placed).map((p) => p.slot));

  const drop = (piece: PieceState, at: Pt): Pt | null => {
    // Nearest open hole within reach.
    let best = -1;
    let bestD = Infinity;
    holes.forEach((h, i) => {
      const d = Math.hypot(at.x - h.x, at.y - h.y);
      if (d < bestD && !takenHoles.has(i) && !covered(i)) {
        best = i;
        bestD = d;
      }
    });
    if (best < 0 || bestD > Math.max(radius(), 56)) return null; // just moving it — fine
    // Any hole the piece fits counts (two red circles are interchangeable).
    const reach = Math.max(radius(), 56);
    const free = (i: number) => !takenHoles.has(i) && !covered(i);
    const fitting = holes.findIndex((h, i) => free(i) && fits(piece, i) && within(at, h, reach));
    const target = fitting >= 0 ? fitting : best;
    const correct = fits(piece, target);
    record(skill, correct, 'game:imiterere');
    if (!correct) {
      mistakes.current += 1;
      play('boop');
      haptic.lightTap();
      onMood('oops');
      window.setTimeout(() => onMood('idle'), 700);
      return null;
    }
    // Claim the hole now, so a second piece cannot aim for it mid-snap.
    setPieces((list) => list.map((p) => (p.id === piece.id ? { ...p, slot: target, placed: true } : p)));
    return holes[target];
  };

  const snapped = (piece: PieceState, at: Pt) => {
    play('snap', 0.9 + piece.id * 0.08);
    haptic.mediumTap();
    burst(at, { size: 0.8 });
    poke();
    const allIn = pieces.filter((p) => p.placed || p.id === piece.id).length === pieces.length;
    if (allIn && !done.current) {
      done.current = true;
      window.setTimeout(() => {
        play('step');
        burst({ x: 200, y: 180 }, { size: 1.5 });
        const clean = hints.current <= 1 && mistakes.current === 0;
        window.setTimeout(() => onDone(clean), 900);
      }, 250);
    }
  };

  // Hint: move a leaf if one is in the way, else show the next piece's home.
  const gesture = useMemo(() => {
    if (!idle) return null;
    const next = pieces.find((p) => !p.placed);
    if (!next) return null;
    const home = holes.findIndex((_, i) => !takenHoles.has(i) && fits(next, i));
    if (home < 0) return null;
    if (covered(home)) return { kind: 'drag' as const, from: leafAt[home], to: { x: holes[home].x, y: 380 } };
    return { kind: 'drag' as const, from: next.home, to: holes[home] };
  }, [idle, pieces, leafAt]);

  return (
    <g>
      <Board {...BOARD} />
      {holes.map((h, i) => (
        <g key={i} transform={`translate(${h.x} ${h.y})`}>
          <Hole kind={def.slots[i].kind} color={def.slots[i].color} />
        </g>
      ))}

      {(def.leaves ?? []).map((h) => (
        <Draggable
          key={`leaf-${h}`}
          home={leafAt[h]}
          grabRadius={50}
          onPickUp={() => {
            poke();
            play('whoosh');
          }}
          onDrop={(at) => {
            // The wind takes it: wherever the child lets go, the leaf blows away.
            const away = { x: at.x < 200 ? -420 : 820, y: at.y - 120 };
            setLeafAt((m) => ({ ...m, [h]: away }));
            return away;
          }}
        >
          <g transform="scale(1.3)">
            <Leaf />
          </g>
        </Draggable>
      ))}

      {pieces.map((p) => (
        <Draggable
          key={p.id}
          home={p.home}
          restScale={pieces.length > 3 ? 0.82 : 0.95}
          grabRadius={46}
          disabled={p.placed}
          onPickUp={() => {
            poke();
            play('pop', 0.8);
          }}
          onDrop={(at) => drop(p, at)}
          onSnapped={(at) => snapped(p, at)}
        >
          <ShapePiece kind={p.kind} color={p.color} happy={p.placed} />
        </Draggable>
      ))}

      <Bursts bursts={bursts} />
      <AnimatePresence>{gesture && <GhostHand gesture={gesture} />}</AnimatePresence>
    </g>
  );
}

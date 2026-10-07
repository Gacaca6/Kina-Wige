// Andika — trace letters and numbers (docs/GAMES-DESIGN.md §4.2).
//
// Modelled on how the best tracing apps teach (LetterSchool's watch → trace →
// write), on our own art and our own alphabet order:
//
//   watch   Kina's pencil writes the character, stroke by stroke
//   trace   the child follows a thick guide from the numbered green dot;
//           "magic ink" grows ONLY along the correct path, in the correct
//           direction — a wobble never paints outside the line
//   faint   (level 2) the same with a thinner, paler guide
//   write   (level 3) almost no guide — from memory, start dot only
//
// Levels start by age and follow the child. A character counts as correct
// when the child stays on the path (at most one slip off it) in the hardest
// stage they did — "follows the guide without lifting off-path"
// (snd.write.trace). Numbers end by counting that many bananas.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as RPointerEvent } from 'react';
import { AnimatePresence, animate, motion } from 'motion/react';
import { useI18n } from '../../i18n/context';
import { useSound, useHaptic } from '../../hooks/useSound';
import { useStars } from '../../hooks/useStars';
import { useProgress } from '../../hooks/useProgress';
import { useSkillEvidence } from '../../hooks/useSkillEvidence';
import { useStickers } from '../../hooks/useStickers';
import type { Age } from '../../hooks/useFamily';
import { games } from '../../data/games';
import { TRACE_SETS, TRACE_SET_ORDER } from '../../data/tracing';
import type { TraceChar, TraceSetId } from '../../data/tracing';
import Kina from '../../components/characters/Kina';
import type { KinaMood } from '../../components/characters/Kina';
import GameCelebration from '../../components/game/GameCelebration';
import GameFrame from '../../components/game/kit/GameFrame';
import Stage, { useStage } from '../../components/game/kit/Stage';
import type { Pt } from '../../components/game/kit/Stage';
import GhostHand from '../../components/game/kit/GhostHand';
import { Bursts, useBursts } from '../../components/game/kit/Bursts';
import { hintDelayMs, useAdaptiveLevel, useGameAge, useIdleHint } from '../../components/game/kit/hooks';
import { Banana, INK } from '../../components/game/art/Friends';

type Mode = 'watch' | 'trace' | 'faint' | 'write';

const MODES_BY_LEVEL: Record<number, Mode[]> = {
  1: ['watch', 'trace'],
  2: ['watch', 'trace', 'faint'],
  3: ['watch', 'trace', 'write'],
};

function startLevel(age: Age): number {
  if (age === 3) return 1;
  if (age === 6) return 3;
  return 2;
}

/** How far off the line still counts as on it, in screen pixels. */
function tolerancePx(age: Age): number {
  if (age === 3) return 46;
  if (age === 4) return 40;
  return 34;
}

// The pad: a 100-unit glyph box drawn three times bigger on the stage.
const PAD = { x: 50, y: 24, scale: 3 };
const STAGE_W = 400;
const STAGE_H = 590;

const toStage = (p: Pt): Pt => ({ x: PAD.x + p.x * PAD.scale, y: PAD.y + p.y * PAD.scale });

// ── Path sampling ────────────────────────────────────────────────────────────

interface Sampled {
  d: string;
  pts: Pt[];
  len: number;
  dot: boolean;
}

const sampleCache = new Map<string, Sampled>();

/** Points every ~3 glyph units along a stroke, in drawing order. */
function sample(d: string): Sampled {
  const hit = sampleCache.get(d);
  if (hit) return hit;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.position = 'absolute';
  svg.style.visibility = 'hidden';
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', d);
  svg.appendChild(path);
  document.body.appendChild(svg);
  const len = path.getTotalLength();
  const n = Math.max(1, Math.round(len / 3));
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const p = path.getPointAtLength((len * i) / n);
    pts.push({ x: p.x, y: p.y });
  }
  document.body.removeChild(svg);
  const s = { d, pts, len, dot: len < 4 };
  sampleCache.set(d, s);
  return s;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function TracingGame() {
  const { language } = useI18n();
  const info = games.find((g) => g.id === 'andika');
  const { level, report } = useAdaptiveLevel('andika', 3, startLevel);
  const { play } = useSound();
  const haptic = useHaptic();
  const { addStar } = useStars();
  const { markGameCompleted } = useProgress();
  const { award } = useStickers();
  const { record } = useSkillEvidence();

  const [setId, setSetId] = useState<TraceSetId | null>(null);
  const [charIndex, setCharIndex] = useState(0);
  const [modeIndex, setModeIndex] = useState(0);
  const [kina, setKina] = useState<KinaMood>('idle');
  const [celebrate, setCelebrate] = useState<TraceChar | null>(null);
  const [earned, setEarned] = useState<ReturnType<typeof award> | null>(null);
  const [won, setWon] = useState(false);
  const clean = useRef(0);

  // Level is read when a set starts and held for the whole set.
  const [modes, setModes] = useState<Mode[]>(MODES_BY_LEVEL[level]);
  const chars = setId ? TRACE_SETS[setId] : [];
  const char = chars[charIndex];
  const mode = modes[modeIndex];

  const choose = (id: TraceSetId) => {
    play('tap');
    haptic.lightTap();
    setModes(MODES_BY_LEVEL[level]);
    setSetId(id);
    setCharIndex(0);
    setModeIndex(0);
    clean.current = 0;
  };

  const onModeDone = useCallback(
    (offPath: number) => {
      if (!char || !setId) return;
      if (modeIndex + 1 < modes.length) {
        if (mode !== 'watch') {
          play('step');
          setKina('cheer');
          window.setTimeout(() => setKina('idle'), 700);
        }
        setModeIndex(modeIndex + 1);
        return;
      }
      // The last stage is the evidence: did the child stay on the path?
      const correct = offPath <= 1;
      if (correct) clean.current += 1;
      const isNumber = setId.startsWith('numbers');
      if (!isNumber) record('snd.write.trace', correct, 'game:andika');
      record('phy.fine.control', correct, 'game:andika');
      setKina('cheer');
      setCelebrate(char);
      play('sparkle');
      haptic.mediumTap();
      const wait = 1500 + (char.count ?? 0) * 330;
      window.setTimeout(() => {
        setCelebrate(null);
        setKina('idle');
        if (charIndex + 1 < chars.length) {
          setCharIndex(charIndex + 1);
          setModeIndex(0);
        } else {
          report(clean.current >= chars.length - 1);
          addStar(1);
          markGameCompleted('andika');
          setEarned(award());
          play('victory_fanfare');
          haptic.success();
          setWon(true);
        }
      }, wait);
    },
    [char, setId, modeIndex, modes.length, mode, play, haptic, record, charIndex, chars.length, report, addStar, markGameCompleted, award],
  );

  const again = () => {
    setWon(false);
    setEarned(null);
    setSetId(null);
  };

  const title = info ? info.title[language] : 'Andika';

  return (
    <GameFrame
      title={title}
      background="#9B6BFF"
      deep="#6F43C9"
      kina={setId ? kina : undefined}
      progress={setId ? { done: charIndex, total: chars.length } : undefined}
      onBack={setId && !won ? () => setSetId(null) : undefined}
    >
      {!setId && <SetMenu onChoose={choose} />}

      {setId && char && (
        <div className="h-full relative px-2">
          <Stage width={STAGE_W} height={STAGE_H}>
            <Paper />
            {!celebrate && <TracePad key={`${char.id}-${modeIndex}`} char={char} mode={mode} onDone={onModeDone} />}
            {celebrate && <CharCelebration char={celebrate} />}
            <Tiles chars={chars} current={charIndex} />
          </Stage>
        </div>
      )}

      {won && <GameCelebration onPlayAgain={again} sticker={earned} />}
    </GameFrame>
  );
}

// ── Menu ─────────────────────────────────────────────────────────────────────

const SET_TONES: Record<TraceSetId, { bg: string; shadow: string }> = {
  vowels: { bg: '#FFC02E', shadow: '#D89A00' },
  capitals: { bg: '#35A7E8', shadow: '#1D7BB3' },
  numbers1: { bg: '#2FBF6B', shadow: '#1E8C4C' },
  numbers2: { bg: '#FF6B4A', shadow: '#CC4A2E' },
};

function SetMenu({ onChoose }: { onChoose: (id: TraceSetId) => void }) {
  const { t } = useI18n();
  return (
    <div className="h-full overflow-y-auto overscroll-contain px-4 pt-2 pb-6">
      <div className="flex items-center gap-3 mb-4">
        <Kina mood="point" style={{ width: 70, height: 67 }} />
        <p className="font-display font-extrabold text-white" style={{ fontSize: 20, lineHeight: 1.2 }}>{t('andika.pick')}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {TRACE_SET_ORDER.map((id) => {
          const tone = SET_TONES[id];
          const labels = TRACE_SETS[id].map((c) => c.label).join(' ');
          return (
            <motion.button
              key={id}
              onClick={() => onChoose(id)}
              aria-label={labels}
              whileTap={{ y: 6, boxShadow: `0 2px 0 ${tone.shadow}` }}
              transition={{ type: 'spring', stiffness: 900, damping: 34, mass: 0.5 }}
              className="rounded-[26px] grid place-items-center px-2"
              style={{ minHeight: 132, background: tone.bg, boxShadow: `0 8px 0 ${tone.shadow}` }}
            >
              <span className="font-display font-extrabold text-white text-center" style={{ fontSize: 30, lineHeight: 1.15, textShadow: `0 3px 0 ${tone.shadow}`, wordSpacing: 4 }}>
                {labels}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ── Stage pieces ─────────────────────────────────────────────────────────────

function Paper() {
  const y = (v: number) => PAD.y + v * PAD.scale;
  return (
    <g aria-hidden>
      <rect x={PAD.x - 26} y={PAD.y - 12} width={300 + 52} height={300 + 30} rx={30} fill="#FFFDF7" stroke={INK} strokeWidth={4} />
      <line x1={PAD.x - 10} x2={PAD.x + 310} y1={y(15)} y2={y(15)} stroke="#D8CCF5" strokeWidth={3} strokeDasharray="10 10" />
      <line x1={PAD.x - 10} x2={PAD.x + 310} y1={y(41)} y2={y(41)} stroke="#D8CCF5" strokeWidth={3} strokeDasharray="10 10" />
      <line x1={PAD.x - 10} x2={PAD.x + 310} y1={y(85)} y2={y(85)} stroke="#B9A6EE" strokeWidth={4} />
    </g>
  );
}

function Tiles({ chars, current }: { chars: TraceChar[]; current: number }) {
  const w = 60;
  const gap = 10;
  const total = chars.length * w + (chars.length - 1) * gap;
  const x0 = (STAGE_W - total) / 2;
  return (
    <g aria-hidden>
      {chars.map((c, i) => {
        const x = x0 + i * (w + gap);
        const done = i < current;
        const now = i === current;
        return (
          <g key={c.id} transform={`translate(${x} 372)`}>
            <rect width={w} height={w} rx={16} fill={done ? '#E7F7EE' : now ? '#FFFFFF' : '#C9B4FF'} stroke={now ? '#FFC02E' : 'none'} strokeWidth={5} />
            <text x={w / 2} y={w / 2 + 11} textAnchor="middle" fontFamily="'Baloo 2', 'Fredoka', sans-serif" fontWeight={800} fontSize={c.label.length > 1 ? 26 : 32} fill={done ? '#1E8C4C' : now ? '#6F43C9' : '#FFFFFF'}>
              {c.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function CharCelebration({ char }: { char: TraceChar }) {
  const { play } = useSound();
  const { bursts, burst } = useBursts();
  useEffect(() => {
    burst({ x: 200, y: 180 }, { size: 1.6 });
    const ids: number[] = [];
    ids.push(window.setTimeout(() => burst({ x: 110, y: 110 }), 200));
    ids.push(window.setTimeout(() => burst({ x: 290, y: 230 }), 380));
    for (let i = 0; i < (char.count ?? 0); i++) {
      ids.push(window.setTimeout(() => play('tick', 1 + i * 0.12), 600 + i * 300));
    }
    return () => ids.forEach(window.clearTimeout);
  }, [char, burst, play]);

  const count = char.count ?? 0;
  const perRow = 5;
  return (
    <g>
      <g transform={`translate(${PAD.x} ${PAD.y}) scale(${PAD.scale})`}>
        <motion.g
          initial={{ scale: 0.7 }}
          animate={{ scale: [0.7, 1.12, 1] }}
          transition={{ duration: 0.6 }}
          style={{ transformOrigin: '50px 50px', transformBox: 'view-box' }}
        >
          {char.strokes.map((d, i) => (
            <g key={i}>
              <path d={d} fill="none" stroke={INK} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
              <path d={d} fill="none" stroke="#FFC02E" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ))}
        </motion.g>
      </g>
      {count > 0 && (
        <g>
          {Array.from({ length: count }, (_, i) => {
            const row = Math.floor(i / perRow);
            const col = i % perRow;
            const inRow = Math.min(perRow, count - row * perRow);
            const x = 200 + (col - (inRow - 1) / 2) * 64;
            const y = 480 + row * 56;
            return (
              <motion.g
                key={i}
                initial={{ scale: 0, x, y }}
                animate={{ scale: 0.52, x, y }}
                transition={{ delay: 0.6 + i * 0.3, type: 'spring', stiffness: 500, damping: 14 }}
              >
                <Banana />
              </motion.g>
            );
          })}
        </g>
      )}
      <Bursts bursts={bursts} />
    </g>
  );
}

// ── The pad ──────────────────────────────────────────────────────────────────

interface PadProps {
  char: TraceChar;
  mode: Mode;
  onDone: (offPath: number) => void;
}

function TracePad({ char, mode, onDone }: PadProps) {
  const stage = useStage();
  const age = useGameAge();
  const { play } = useSound();
  const haptic = useHaptic();
  const { bursts, burst } = useBursts();

  const strokes = useMemo(() => char.strokes.map(sample), [char]);
  const [strokeIndex, setStrokeIndex] = useState(0);
  const [sprouts, setSprouts] = useState<{ id: number; x: number; y: number; r: number }[]>([]);
  const inkRefs = useRef<(SVGPathElement | null)[]>([]);
  const penRef = useRef<SVGGElement>(null);
  const progress = useRef(0); // index of the next point to reach on the current stroke
  const tracing = useRef<number | null>(null);
  const offPath = useRef(0);
  const isOff = useRef(false);
  const lastSprout = useRef(0);
  const finished = useRef(false);

  const { idle, poke } = useIdleHint(hintDelayMs(age), strokeIndex, mode !== 'watch');

  const setInk = (i: number, fraction: number) => {
    const el = inkRefs.current[i];
    if (!el) return;
    const len = strokes[i].len;
    el.style.strokeDasharray = `${len + 1} ${len + 1}`;
    el.style.strokeDashoffset = `${(len + 1) * (1 - fraction)}`;
  };

  // Watch: Kina's pencil writes it.
  useEffect(() => {
    if (mode !== 'watch') return;
    let cancelled = false;
    const run = async () => {
      await new Promise((r) => window.setTimeout(r, 350));
      for (let i = 0; i < strokes.length && !cancelled; i++) {
        const s = strokes[i];
        await new Promise<void>((resolve) => {
          animate(0, 1, {
            duration: s.dot ? 0.25 : Math.min(1.6, 0.5 + s.len / 120),
            ease: 'easeInOut',
            onUpdate: (v) => {
              if (cancelled) return;
              setInk(i, v);
              const p = s.pts[Math.min(s.pts.length - 1, Math.round(v * (s.pts.length - 1)))];
              const at = toStage(p);
              penRef.current?.setAttribute('transform', `translate(${at.x} ${at.y})`);
            },
            onComplete: () => resolve(),
          });
        });
        await new Promise((r) => window.setTimeout(r, 180));
      }
      await new Promise((r) => window.setTimeout(r, 450));
      if (!cancelled) onDone(0);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [mode, strokes]);

  const tol = () => tolerancePx(age) / (stage.pxPerUnit() * PAD.scale);

  const toGlyph = (e: RPointerEvent<SVGRectElement>): Pt => {
    const p = stage.toLocal(e.clientX, e.clientY);
    return { x: (p.x - PAD.x) / PAD.scale, y: (p.y - PAD.y) / PAD.scale };
  };

  const strokeDone = (i: number) => {
    setInk(i, 1);
    play('pop', 1.2);
    haptic.lightTap();
    const end = strokes[i].pts[strokes[i].pts.length - 1];
    burst(toStage(end), { size: 0.7 });
    tracing.current = null;
    progress.current = 0;
    if (i + 1 < strokes.length) {
      setStrokeIndex(i + 1);
    } else if (!finished.current) {
      finished.current = true;
      window.setTimeout(() => onDone(offPath.current), 450);
    }
  };

  const advance = (p: Pt) => {
    const s = strokes[strokeIndex];
    if (!s) return;
    const t = tol();
    if (s.dot) {
      if (Math.hypot(p.x - s.pts[0].x, p.y - s.pts[0].y) <= t * 1.3) strokeDone(strokeIndex);
      return;
    }
    // Look a short way ahead: a quick finger can skip a sample or two, but
    // cannot jump across the letter.
    let reached = -1;
    let nearest = Infinity;
    const end = Math.min(s.pts.length - 1, progress.current + 7);
    for (let j = progress.current; j <= end; j++) {
      const d = Math.hypot(p.x - s.pts[j].x, p.y - s.pts[j].y);
      nearest = Math.min(nearest, d);
      if (d <= t) reached = j;
    }
    if (reached >= 0) {
      isOff.current = false;
      const before = progress.current;
      progress.current = reached + 1;
      const fraction = Math.min(1, progress.current / (s.pts.length - 1));
      setInk(strokeIndex, fraction);
      poke();
      if (progress.current < lastSprout.current || progress.current - lastSprout.current >= 6) {
        lastSprout.current = progress.current;
        const at = toStage(s.pts[Math.min(reached, s.pts.length - 1)]);
        const id = Date.now() + Math.random();
        setSprouts((list) => [...list.slice(-30), { id, x: at.x, y: at.y, r: (Math.random() - 0.5) * 80 }]);
      }
      if (Math.floor(before / 4) !== Math.floor(progress.current / 4)) play('tick', 0.9 + fraction * 0.8);
      if (progress.current >= s.pts.length - 1) strokeDone(strokeIndex);
    } else if (nearest > t * 2.2 && !isOff.current) {
      // Off the path. Counted once per excursion, never punished on screen.
      isOff.current = true;
      offPath.current += 1;
    }
  };

  const down = (e: RPointerEvent<SVGRectElement>) => {
    if (mode === 'watch' || finished.current) return;
    const s = strokes[strokeIndex];
    if (!s) return;
    const p = toGlyph(e);
    const startAt = s.pts[Math.min(progress.current, s.pts.length - 1)];
    // Must begin at the start dot (or where the child left off) — direction
    // and starting point are the whole lesson.
    if (Math.hypot(p.x - startAt.x, p.y - startAt.y) > tol() * 1.5) {
      play('boop');
      return;
    }
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* fine without */
    }
    tracing.current = e.pointerId;
    advance(p);
  };

  const move = (e: RPointerEvent<SVGRectElement>) => {
    if (tracing.current !== e.pointerId) return;
    advance(toGlyph(e));
  };

  const up = (e: RPointerEvent<SVGRectElement>) => {
    if (tracing.current === e.pointerId) tracing.current = null;
  };

  const guideOpacity = mode === 'write' ? 0.12 : mode === 'faint' ? 0.45 : 1;
  const guideWidth = mode === 'trace' ? 18 : 12;

  const current = strokes[strokeIndex];
  const gesture = idle && current && mode !== 'watch'
    ? current.dot
      ? { kind: 'tap' as const, at: toStage(current.pts[0]) }
      : {
          kind: 'path' as const,
          points: current.pts
            .slice(progress.current)
            .filter((_, i, a) => i % Math.max(1, Math.floor(a.length / 12)) === 0 || i === a.length - 1)
            .map(toStage),
        }
    : null;

  return (
    <g>
      <g transform={`translate(${PAD.x} ${PAD.y}) scale(${PAD.scale})`}>
        {/* the guide */}
        <g opacity={guideOpacity}>
          {strokes.map((s, i) => (
            <g key={i}>
              <path d={s.d} fill="none" stroke="#E6DEFA" strokeWidth={guideWidth / PAD.scale + 6} strokeLinecap="round" strokeLinejoin="round" />
              <path d={s.d} fill="none" stroke="#B9A6EE" strokeWidth={0.9} strokeDasharray="2.4 2.4" strokeLinecap="round" />
            </g>
          ))}
        </g>
        {/* the magic ink */}
        {strokes.map((s, i) => (
          <path
            key={i}
            ref={(el) => {
              inkRefs.current[i] = el;
              if (el && i >= strokeIndex && !el.style.strokeDashoffset) {
                el.style.strokeDasharray = `${s.len + 1} ${s.len + 1}`;
                el.style.strokeDashoffset = `${s.len + 1}`;
              }
            }}
            d={s.dot ? `${s.d} h0.1` : s.d}
            fill="none"
            stroke={mode === 'watch' ? '#9B6BFF' : '#2FBF6B'}
            strokeWidth={8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {/* start dot for the current stroke, numbered, with a direction nudge */}
        {mode !== 'watch' && current && (
          <StartDot stroke={current} number={strokeIndex + 1} />
        )}
      </g>

      {/* sprouts along the ink: leaves and little flowers */}
      <g style={{ pointerEvents: 'none' }} aria-hidden>
        {sprouts.map((s, i) => (
          <motion.g
            key={s.id}
            initial={{ scale: 0, x: s.x, y: s.y, rotate: s.r }}
            animate={{ scale: 1, x: s.x, y: s.y, rotate: s.r }}
            transition={{ type: 'spring', stiffness: 500, damping: 12 }}
          >
            {i % 3 === 2 ? (
              <g>
                {[0, 72, 144, 216, 288].map((a) => (
                  <ellipse key={a} cx={0} cy={-7} rx={4} ry={6} fill="#FF9EC0" stroke={INK} strokeWidth={1.5} transform={`rotate(${a})`} />
                ))}
                <circle r={3.5} fill="#FFC02E" stroke={INK} strokeWidth={1.5} />
              </g>
            ) : (
              <path d="M0 0 q-10 -14 0 -24 q10 10 0 24 z" fill="#5CC489" stroke={INK} strokeWidth={2} />
            )}
          </motion.g>
        ))}
      </g>

      {mode === 'watch' && (
        <g ref={penRef} style={{ pointerEvents: 'none' }} aria-hidden>
          <g transform="rotate(-35) translate(0 -6)">
            <rect x={-7} y={-66} width={14} height={54} rx={3} fill="#2C3A5C" stroke={INK} strokeWidth={3} />
            <path d="M-7 -12 L0 4 L7 -12 z" fill="#FFC02E" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
          </g>
        </g>
      )}

      {/* the touch surface */}
      <rect
        x={PAD.x - 26}
        y={PAD.y - 12}
        width={352}
        height={330}
        fill="transparent"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      />

      <Bursts bursts={bursts} />
      <AnimatePresence>{gesture && <GhostHand gesture={gesture} scale={0.8} />}</AnimatePresence>
    </g>
  );
}

function StartDot({ stroke, number }: { stroke: Sampled; number: number }) {
  const p = stroke.pts[0];
  const q = stroke.pts[Math.min(stroke.pts.length - 1, 4)];
  const angle = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
  return (
    <g style={{ pointerEvents: 'none' }}>
      {!stroke.dot && (
        <motion.g
          transform={`translate(${p.x} ${p.y}) rotate(${angle})`}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <path d="M9 -3.5 L14 0 L9 3.5" fill="none" stroke="#2FBF6B" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        </motion.g>
      )}
      <motion.circle
        cx={p.x}
        cy={p.y}
        r={6}
        fill="#2FBF6B"
        stroke={INK}
        strokeWidth={1.4}
        animate={{ scale: [0.9, 1.15, 0.9] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
      <text x={p.x} y={p.y + 2.6} textAnchor="middle" fontFamily="'Baloo 2', 'Fredoka', sans-serif" fontWeight={800} fontSize={7.5} fill="#FFFFFF">
        {number}
      </text>
    </g>
  );
}

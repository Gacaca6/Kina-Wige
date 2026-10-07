// Karaba Amaboko — wash your hands at a kandagira ukarabe.
//
// Rebuilt to the Kina Wige game standard (docs/GAMES-DESIGN.md §4.1). Each of
// the five steps is its own gesture, so the hands learn the order and not just
// the screen:
//
//   water  tap the foot pedal — the can tips and water pours
//   soap   drag the soap onto the hands
//   scrub  rub the hands; bubbles grow, germs pop, the handwashing song plays
//   rinse  press and HOLD the pedal; the foam washes away while water flows
//   dry    rub the towel over the hands until the drops are gone
//
// Levels (start by age, then follow the child — kit/hooks useAdaptiveLevel):
//   1  the next thing glows and only it responds; the hand shows the way early
//   2  everything responds; a picture strip shows the order
//   3  everything responds; the strip shows only the steps already done
// From level 2 the child chooses what comes next, so from level 2 the FIRST
// action in each step is sequencing evidence (phy.hand.sequence).
//
// Each play is a different moment: before eating, after the toilet, after
// playing outside (muddy hands), after touching animals.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as RPointerEvent } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'motion/react';
import type { MotionValue } from 'motion/react';
import { useI18n } from '../../i18n/context';
import type { TranslationKey } from '../../i18n/translations';
import { useSound, useHaptic } from '../../hooks/useSound';
import type { TuneNote } from '../../hooks/useSound';
import { useStars } from '../../hooks/useStars';
import { useProgress } from '../../hooks/useProgress';
import { useSkillEvidence } from '../../hooks/useSkillEvidence';
import { useStickers } from '../../hooks/useStickers';
import { games } from '../../data/games';
import Kina from '../../components/characters/Kina';
import type { KinaMood } from '../../components/characters/Kina';
import GameCelebration from '../../components/game/GameCelebration';
import GameFrame from '../../components/game/kit/GameFrame';
import Stage, { useStage } from '../../components/game/kit/Stage';
import type { Pt } from '../../components/game/kit/Stage';
import Draggable, { within } from '../../components/game/kit/Draggable';
import GhostHand from '../../components/game/kit/GhostHand';
import type { GhostGesture } from '../../components/game/kit/GhostHand';
import { Bursts, useBursts } from '../../components/game/kit/Bursts';
import {
  hintDelayMs, pick, snapRadiusPx, useAdaptiveLevel, useGameAge, useIdleHint, useOnRest,
} from '../../components/game/kit/hooks';
import {
  Bubble, GERM_COLORS, Germ, Hands, Jerrycan, MomentPicture, Mud, SoapBar, StationFrame, StepIcon,
  Towel, WASH, WashBackdrop, WaterStream,
} from '../../components/game/art/Handwash';
import type { MomentId } from '../../components/game/art/Handwash';
import { Goat } from '../../components/game/art/Friends';
import type { Age } from '../../hooks/useFamily';

const STEPS = ['water', 'soap', 'scrub', 'rinse', 'dry'] as const;
type Step = (typeof STEPS)[number];

const MOMENTS: MomentId[] = ['eat', 'toilet', 'play', 'animals'];
const MOMENT_KEY: Record<MomentId, TranslationKey> = {
  eat: 'karaba.moment.eat',
  toilet: 'karaba.moment.toilet',
  play: 'karaba.moment.play',
  animals: 'karaba.moment.animals',
};

const STEP_KEY: Record<Step, TranslationKey> = {
  water: 'game.water',
  soap: 'game.soap',
  scrub: 'game.scrub',
  rinse: 'game.rinse',
  dry: 'game.dry',
};

/** The handwashing song — an original tune, about 20 seconds round twice. */
const C = 523, D = 587, E = 659, F = 698, G = 784, A = 880;
const SONG: TuneNote[] = [
  [C, 1], [E, 1], [G, 1], [E, 1], [F, 1], [A, 1], [G, 2],
  [E, 1], [G, 1], [F, 1], [D, 1], [E, 1], [D, 1], [C, 2],
];

const SCRUB_NEEDED = [0, 2200, 3000, 4000]; // stage units of rubbing, by level
const RINSE_NEEDED_MS = 1600;
const DRY_NEEDED = [0, 900, 1200, 1500];

/** Age 3 is guided; 4–5 choose with the strip; 6 choose from memory. */
function startLevel(age: Age): number {
  if (age === 3) return 1;
  if (age === 6) return 3;
  return 2;
}

let lastMoment: MomentId | null = null;

function nextMoment(): MomentId {
  const m = pick(MOMENTS.filter((x) => x !== lastMoment));
  lastMoment = m;
  return m;
}

interface RoundResult {
  mistakes: number;
  hints: number;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function HandwashGame() {
  const { t, language } = useI18n();
  const info = games.find((g) => g.id === 'karaba');
  const { level, report } = useAdaptiveLevel('karaba', 3, startLevel);
  const { play } = useSound();
  const haptic = useHaptic();
  const { addStar } = useStars();
  const { markGameCompleted } = useProgress();
  const { award } = useStickers();
  const { recordOffline } = useSkillEvidence();

  const [round, setRound] = useState(0);
  const [moment, setMoment] = useState<MomentId>(nextMoment);
  const [phase, setPhase] = useState<'intro' | 'play' | 'won'>('intro');
  const [step, setStep] = useState(0);
  const [kina, setKina] = useState<KinaMood>('idle');
  const [earned, setEarned] = useState<ReturnType<typeof award> | null>(null);
  const [challengeDone, setChallengeDone] = useState(false);

  const start = () => {
    play('tap');
    haptic.lightTap();
    setStep(0);
    setPhase('play');
  };

  const onStepDone = useCallback((i: number) => {
    setStep(i + 1);
    setKina('cheer');
    window.setTimeout(() => setKina('idle'), 900);
  }, []);

  const onFinished = useCallback(
    ({ mistakes, hints }: RoundResult) => {
      report(mistakes === 0 && hints <= 1);
      addStar(1);
      markGameCompleted('karaba');
      setKina('cheer');
      window.setTimeout(() => {
        setEarned(award());
        play('victory_fanfare');
        haptic.success();
        setPhase('won');
      }, 1400);
    },
    [report, addStar, markGameCompleted, award, play, haptic],
  );

  const again = () => {
    setMoment(nextMoment());
    setRound((r) => r + 1);
    setEarned(null);
    setChallengeDone(false);
    setStep(0);
    setKina('idle');
    setPhase('intro');
  };

  const title = info ? info.title[language] : 'Karaba!';

  return (
    <GameFrame
      title={title}
      background="#2B9BD0"
      deep="#1D7BB3"
      kina={phase === 'play' ? kina : undefined}
      progress={phase === 'play' ? { done: step, total: STEPS.length } : undefined}
    >
      {phase === 'intro' && <Intro moment={moment} onStart={start} />}

      {phase !== 'intro' && (
        <div className="h-full flex flex-col">
          <StepStrip step={step} level={level} />
          <div className="flex-1 min-h-0 relative px-2 pb-1">
            <Stage width={WASH.width} height={WASH.height} label={t(STEP_KEY[STEPS[Math.min(step, 4)]])}>
              <WashScene
                key={round}
                level={level}
                moment={moment}
                onStepDone={onStepDone}
                onFinished={onFinished}
                onMood={setKina}
              />
            </Stage>
          </div>
        </div>
      )}

      {phase === 'won' && (
        <GameCelebration
          onPlayAgain={again}
          sticker={earned}
          extra={
            <div className="mt-6 w-full max-w-xs rounded-[22px] p-4 text-left" style={{ background: '#0E3626' }}>
              <p className="font-body font-black text-[12px] tracking-[.12em]" style={{ color: '#FFC02E' }}>KINA CHALLENGE</p>
              <p className="font-body font-bold text-white mt-1" style={{ fontSize: 15 }}>{t('karaba.challenge')}</p>
              <button
                onClick={() => {
                  if (challengeDone) return;
                  recordOffline(['phy.hand.sequence'], 'karaba');
                  setChallengeDone(true);
                  play('success');
                }}
                className="mt-3 w-full rounded-[16px] font-body font-black"
                style={{ minHeight: 52, background: challengeDone ? '#1E8C4C' : '#FFFFFF', color: challengeDone ? '#FFFFFF' : '#17543C', fontSize: 15 }}
              >
                {challengeDone ? `✓ ${t('karaba.challengeThanks')}` : t('karaba.challengeDone')}
              </button>
            </div>
          }
        />
      )}
    </GameFrame>
  );
}

// ── Intro: which moment is this? ─────────────────────────────────────────────

function Intro({ moment, onStart }: { moment: MomentId; onStart: () => void }) {
  const { t } = useI18n();
  return (
    <div className="h-full flex flex-col items-center justify-center gap-6 px-6 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        className="rounded-[32px] bg-white grid place-items-center"
        style={{ width: 200, height: 200, boxShadow: '0 8px 0 #1D7BB3' }}
      >
        <svg viewBox="-60 -60 120 120" style={{ width: 160, height: 160 }} aria-hidden>
          {moment === 'animals' ? <Goat /> : <MomentPicture moment={moment} />}
        </svg>
      </motion.div>
      <p className="font-display font-extrabold text-white" style={{ fontSize: 26, lineHeight: 1.15 }}>
        {t(MOMENT_KEY[moment])}
      </p>
      <div className="flex items-center gap-4">
        <Kina mood="point" style={{ width: 96, height: 92 }} />
        <motion.button
          onClick={onStart}
          aria-label={t('game.go')}
          whileTap={{ y: 6, boxShadow: '0 2px 0 #D89A00' }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ scale: { duration: 1.6, repeat: Infinity } }}
          className="rounded-full grid place-items-center"
          style={{ width: 112, height: 112, background: '#FFC02E', boxShadow: '0 8px 0 #D89A00' }}
        >
          <svg viewBox="0 0 24 24" style={{ width: 52, height: 52, marginLeft: 6 }} aria-hidden>
            <path d="M7 4.5v15l12.5-7.5z" fill="#FFFFFF" stroke="#10241B" strokeWidth={1.6} strokeLinejoin="round" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}

// ── The picture strip ────────────────────────────────────────────────────────

function StepStrip({ step, level }: { step: number; level: number }) {
  const { t } = useI18n();
  return (
    <div className="flex justify-center gap-2 px-3 pb-2 flex-none">
      {STEPS.map((s, i) => {
        const done = i < step;
        const now = i === step;
        // Level 3 hides what comes next — choosing it is the child's job.
        const hidden = level >= 3 && !done;
        return (
          <motion.div
            key={s}
            animate={{ scale: now && level < 3 ? 1.12 : 1, y: now && level < 3 ? -2 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 24 }}
            className="rounded-[16px] grid place-items-center relative"
            aria-label={hidden ? undefined : t(STEP_KEY[s])}
            style={{
              width: 52,
              height: 52,
              background: done ? '#E7F7EE' : now && level < 3 ? '#FFFFFF' : '#5DB8E2',
              boxShadow: now && level < 3 ? '0 0 0 4px #FFC02E' : '0 4px 0 #1D7BB3',
            }}
          >
            {hidden ? (
              <span className="font-display font-extrabold text-white" style={{ fontSize: 24 }} aria-hidden>?</span>
            ) : (
              <svg viewBox="-26 -26 52 52" style={{ width: 40, height: 40, opacity: done || now ? 1 : 0.55 }} aria-hidden>
                <StepIcon step={s} />
              </svg>
            )}
            {done && (
              <span className="absolute -right-1 -top-1 rounded-full grid place-items-center" style={{ width: 20, height: 20, background: '#2FBF6B', border: '2px solid #fff' }} aria-hidden>
                <svg viewBox="0 0 24 24" style={{ width: 12, height: 12 }}><path d="M5 12l5 5 9-10" fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// ── The scene ────────────────────────────────────────────────────────────────

interface GermState {
  id: number;
  x: number;
  y: number;
  color: string;
  alive: boolean;
}

const GERM_SPOTS: Pt[] = [
  { x: -78, y: -44 }, { x: -36, y: 26 }, { x: 4, y: -78 }, { x: 58, y: 12 }, { x: 88, y: -52 }, { x: -6, y: -14 },
];

const FOAM_SPOTS = Array.from({ length: 18 }, (_, i) => {
  const a = i * 2.4;
  const r = 30 + (i % 6) * 14;
  return { x: Math.cos(a) * r * 1.15, y: Math.sin(a) * r * 0.8 - 20, r: 9 + (i % 4) * 4, at: (i / 18) * 0.85 };
});

const DROPS = [
  { x: -70, y: -60 }, { x: -20, y: -90 }, { x: 40, y: -70 }, { x: 80, y: -20 }, { x: -50, y: 10 }, { x: 20, y: 20 }, { x: 60, y: 40 },
];

function FoamBubble({ foam, x, y, r, at }: { foam: MotionValue<number>; x: number; y: number; r: number; at: number }) {
  const scale = useTransform(foam, (v) => Math.max(0, Math.min(1, (v - at) * 5)));
  return (
    <motion.g style={{ x: WASH.hands.x + x, y: WASH.hands.y + y, scale }}>
      <Bubble r={r} />
    </motion.g>
  );
}

function Halo({ at, r = 62, ring = false }: { at: Pt; r?: number; ring?: boolean }) {
  return (
    <motion.circle
      cx={at.x}
      cy={at.y}
      r={r}
      fill={ring ? 'none' : '#FFF3B0'}
      stroke={ring ? '#FFE07A' : 'none'}
      strokeWidth={ring ? 9 : 0}
      strokeDasharray={ring ? '14 10' : undefined}
      opacity={0.6}
      style={{ pointerEvents: 'none', transformOrigin: `${at.x}px ${at.y}px`, transformBox: 'view-box' }}
      animate={{ scale: [0.85, 1.08, 0.85], opacity: [0.35, 0.75, 0.35] }}
      transition={{ duration: 1.3, repeat: Infinity }}
    />
  );
}

interface SceneProps {
  level: number;
  moment: MomentId;
  onStepDone: (i: number) => void;
  onFinished: (r: RoundResult) => void;
  onMood: (m: KinaMood) => void;
}

function WashScene({ level, moment, onStepDone, onFinished, onMood }: SceneProps) {
  const stage = useStage();
  const age = useGameAge();
  const { play, playTune } = useSound();
  const haptic = useHaptic();
  const { record } = useSkillEvidence();
  const { bursts, burst } = useBursts();

  const [stepIndex, setStepIndex] = useState(0);
  const step: Step | 'done' = stepIndex < STEPS.length ? STEPS[stepIndex] : 'done';
  const stepRef = useRef(step);
  stepRef.current = step;
  const busy = useRef(false); // a step is finishing; ignore input for a moment

  const tilt = useMotionValue(0);
  const flow = useMotionValue(0);
  const wet = useMotionValue(0);
  const foam = useMotionValue(0);
  const mud = useMotionValue(moment === 'play' ? 1 : 0);
  const scrub = useMotionValue(0);
  const shine = useMotionValue(0);

  const [germs, setGerms] = useState<GermState[]>(() =>
    GERM_SPOTS.slice(0, moment === 'animals' ? 6 : 5).map((p, i) => ({
      id: i,
      x: WASH.hands.x + p.x,
      y: WASH.hands.y + p.y,
      color: GERM_COLORS[i % GERM_COLORS.length],
      alive: true,
    })),
  );
  const germsRef = useRef(germs);
  germsRef.current = germs;

  const mistakes = useRef(0);
  const hints = useRef(0);
  const acted = useRef(false); // has the child acted yet in this step?

  // ── Hints ──
  const { idle, poke } = useIdleHint(hintDelayMs(age) - (level === 1 ? 1000 : 0), stepIndex, step !== 'done');
  useEffect(() => {
    if (idle) hints.current += 1;
  }, [idle]);

  // ── Song ──
  const stopSong = useRef<(() => void) | null>(null);
  const endSong = () => {
    stopSong.current?.();
    stopSong.current = null;
  };
  useEffect(() => endSong, []);
  useOnRest(endSong);

  // ── Step bookkeeping ──
  const firstAction = (correct: boolean) => {
    if (acted.current) {
      if (!correct) mistakes.current += 1;
      return;
    }
    acted.current = true;
    if (!correct) mistakes.current += 1;
    // Level 1 shows the next thing, so it is not the child's choice: no evidence.
    if (level >= 2) record('phy.hand.sequence', correct, 'game:karaba');
  };

  const wrong = (at: Pt) => {
    firstAction(false);
    play('boop');
    haptic.lightTap();
    onMood('oops');
    window.setTimeout(() => onMood('idle'), 700);
    burst(at, { colors: ['#FFFFFF'], size: 0.5 });
    poke();
  };

  const complete = (at: Pt = WASH.hands) => {
    if (busy.current) return;
    busy.current = true;
    const i = STEPS.indexOf(stepRef.current as Step);
    play('step');
    haptic.mediumTap();
    burst(at);
    onStepDone(i);
    window.setTimeout(() => {
      acted.current = false;
      busy.current = false;
      setStepIndex(i + 1);
      if (i + 1 >= STEPS.length) {
        animate(shine, 1, { duration: 0.6 });
        play('sparkle');
        burst({ x: WASH.hands.x - 70, y: WASH.hands.y - 60 });
        window.setTimeout(() => burst({ x: WASH.hands.x + 70, y: WASH.hands.y - 30 }), 250);
        onFinished({ mistakes: mistakes.current, hints: hints.current });
      }
    }, 650);
  };

  // ── Water from the pedal (water and rinse) ──
  const pouring = useRef(false);
  const holdStart = useRef(0);
  const rinsed = useRef(0);
  const raf = useRef(0);

  const startPour = () => {
    pouring.current = true;
    animate(tilt, 1, { type: 'spring', stiffness: 300, damping: 18 });
    animate(flow, 1, { duration: 0.25 });
    play('pedal');
    play('pour');
  };
  const stopPour = () => {
    pouring.current = false;
    animate(tilt, 0, { type: 'spring', stiffness: 220, damping: 16 });
    animate(flow, 0, { duration: 0.2 });
    cancelAnimationFrame(raf.current);
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const pedalDown = () => {
    if (busy.current) return;
    const s = stepRef.current;
    if (s === 'water') {
      firstAction(true);
      poke();
      startPour();
      window.setTimeout(() => {
        animate(wet, 1, { duration: 0.4 });
        stopPour();
        complete();
      }, 1300);
      return;
    }
    if (s === 'rinse') {
      firstAction(true);
      poke();
      holdStart.current = performance.now();
      startPour();
      let last = performance.now();
      const tick = () => {
        const now = performance.now();
        rinsed.current += now - last;
        last = now;
        const p = Math.min(1, rinsed.current / RINSE_NEEDED_MS);
        foam.set(1 - p);
        mud.set(0);
        if (p >= 1) {
          stopPour();
          animate(wet, 1, { duration: 0.2 });
          complete();
          return;
        }
        if (pouring.current) raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
      return;
    }
    if (level === 1) return; // only the glowing thing responds at level 1
    if (s === 'done') return;
    wrong(WASH.pedal);
    animate(tilt, [0, 0.15, 0], { duration: 0.4 });
  };

  const pedalUp = () => {
    if (stepRef.current !== 'rinse' || !pouring.current) return;
    // A quick tap still pours for a moment — a three-year-old's "press" is
    // short, and water that stops instantly feels broken.
    const held = performance.now() - holdStart.current;
    window.setTimeout(() => {
      if (stepRef.current === 'rinse' && pouring.current) stopPour();
    }, Math.max(0, 700 - held));
  };

  // ── Scrub ──
  const rubbing = useRef<{ id: number; last: Pt } | null>(null);
  const scrubbed = useRef(0);
  const lastRubSound = useRef(0);

  const insideRub = (p: Pt) => {
    const { x, y, rx, ry } = WASH.rub;
    return ((p.x - x) / rx) ** 2 + ((p.y - y) / ry) ** 2 <= 1;
  };

  const popGerm = (g: GermState) => {
    setGerms((list) => list.map((x) => (x.id === g.id ? { ...x, alive: false } : x)));
    play('pop', 0.9 + g.id * 0.12);
    haptic.tick();
    burst({ x: g.x, y: g.y }, { colors: [g.color, '#FFFFFF'], size: 0.6 });
  };

  const rubDown = (e: RPointerEvent<SVGEllipseElement>) => {
    if (stepRef.current !== 'scrub' || busy.current) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* fine without */
    }
    rubbing.current = { id: e.pointerId, last: stage.toLocal(e.clientX, e.clientY) };
    if (!acted.current) firstAction(true);
    if (!stopSong.current) stopSong.current = playTune(SONG, 150);
    poke();
  };

  const rubMove = (e: RPointerEvent<SVGEllipseElement>) => {
    const r = rubbing.current;
    if (!r || r.id !== e.pointerId || stepRef.current !== 'scrub' || busy.current) return;
    const p = stage.toLocal(e.clientX, e.clientY);
    const d = Math.min(60, Math.hypot(p.x - r.last.x, p.y - r.last.y));
    r.last = p;
    if (!insideRub(p)) return;
    scrubbed.current += d;
    const progress = Math.min(1, scrubbed.current / SCRUB_NEEDED[level]);
    scrub.set(progress);
    foam.set(0.15 + progress * 0.85);
    if (moment === 'play') mud.set(1 - progress);
    poke();
    const now = performance.now();
    if (now - lastRubSound.current > 140) {
      lastRubSound.current = now;
      play('rub', 0.8 + Math.random() * 0.5);
    }
    for (const g of germsRef.current) {
      if (g.alive && Math.hypot(g.x - p.x, g.y - p.y) < 44) popGerm(g);
    }
    if (progress >= 1) {
      rubbing.current = null;
      // Any germ the child missed is washed off by the bubbles anyway.
      germsRef.current.filter((g) => g.alive).forEach((g, i) => window.setTimeout(() => popGerm(g), i * 120));
      endSong();
      complete();
    }
  };

  const rubUp = (e: RPointerEvent<SVGEllipseElement>) => {
    if (rubbing.current?.id === e.pointerId) rubbing.current = null;
  };

  // ── Soap ──
  const radius = () => snapRadiusPx(age) / stage.pxPerUnit();

  // ── Towel ──
  const dried = useRef(0);
  const towelLast = useRef<Pt | null>(null);
  const dryness = useMotionValue(0);
  const dropOpacity = useTransform(() => wet.get() * (1 - dryness.get()));

  // ── Ghost hand ──
  const gesture: GhostGesture | null = useMemo(() => {
    if (!idle || step === 'done') return null;
    switch (step) {
      case 'water':
        return { kind: 'tap', at: { x: WASH.pedal.x + 20, y: WASH.pedal.y - 4 } };
      case 'soap':
        return { kind: 'drag', from: WASH.soapHome, to: WASH.hands };
      case 'scrub':
        return { kind: 'rub', at: { x: WASH.hands.x, y: WASH.hands.y - 20 }, size: 50 };
      case 'rinse':
        return { kind: 'hold', at: { x: WASH.pedal.x + 20, y: WASH.pedal.y - 4 } };
      case 'dry':
        return { kind: 'drag', from: WASH.towelHome, to: WASH.hands };
    }
  }, [idle, step]);

  const ringR = 150;
  const ringLen = 2 * Math.PI * ringR;
  const ringOffset = useTransform(scrub, (v) => ringLen * (1 - v));

  return (
    <>
      <WashBackdrop />
      <StationFrame tilt={tilt} />
      <Jerrycan tilt={tilt} />

      {level === 1 && step === 'soap' && <Halo at={WASH.soapHome} r={50} />}
      {level === 1 && step === 'dry' && <Halo at={WASH.towelHome} r={66} />}
      {level === 1 && step === 'scrub' && <Halo at={{ x: WASH.hands.x, y: WASH.hands.y - 20 }} r={110} />}

      {/* the bubble timer: fills as the child scrubs — washing takes time */}
      {step === 'scrub' && (
      <g aria-hidden>
        <circle cx={WASH.hands.x} cy={WASH.hands.y - 20} r={ringR} fill="none" stroke="#FFFFFF" strokeWidth={12} opacity={0.5} />
        <motion.circle
          cx={WASH.hands.x}
          cy={WASH.hands.y - 20}
          r={ringR}
          fill="none"
          stroke="#FFC02E"
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={ringLen}
          style={{ strokeDashoffset: ringOffset }}
          transform={`rotate(-90 ${WASH.hands.x} ${WASH.hands.y - 20})`}
        />
      </g>
      )}

      <Hands />
      <Mud amount={mud} />

      {/* water drops sit on wet hands until the towel takes them */}
      <motion.g style={{ opacity: dropOpacity }} aria-hidden>
        {DROPS.map((d, i) => (
          <path
            key={i}
            d={`M${WASH.hands.x + d.x} ${WASH.hands.y + d.y - 8} q7 9 7 13 a7 7 0 0 1 -14 0 q0 -4 7 -13 z`}
            fill="#BFE9FF"
            stroke="#2E8FD0"
            strokeWidth={2}
          />
        ))}
      </motion.g>

      {germs.map((g) => (
        <AnimatePresence key={g.id}>
          {g.alive && (
            <motion.g
              initial={{ scale: 0, x: g.x, y: g.y }}
              animate={{ scale: 1, x: g.x, y: [g.y, g.y - 5, g.y] }}
              exit={{ scale: 1.6, opacity: 0 }}
              transition={{ y: { duration: 1.2 + g.id * 0.17, repeat: Infinity }, scale: { type: 'spring', stiffness: 400, damping: 14, delay: 0.2 + g.id * 0.1 } }}
              style={{ pointerEvents: 'none' }}
            >
              <Germ color={g.color} />
            </motion.g>
          )}
        </AnimatePresence>
      ))}

      {FOAM_SPOTS.map((f, i) => (
        <FoamBubble key={i} foam={foam} {...f} />
      ))}

      <WaterStream flow={flow} />

      {/* the pedal sits low between the arms: its glow is a ring drawn on top */}
      {level === 1 && (step === 'water' || step === 'rinse') && (
        <Halo at={{ x: WASH.pedal.x - 5, y: WASH.pedal.y + 2 }} r={60} ring />
      )}

      {/* the rub area: invisible, generous */}
      <ellipse
        cx={WASH.rub.x}
        cy={WASH.rub.y}
        rx={WASH.rub.rx}
        ry={WASH.rub.ry}
        fill="transparent"
        onPointerDown={rubDown}
        onPointerMove={rubMove}
        onPointerUp={rubUp}
        onPointerCancel={rubUp}
      />

      {/* pedal + can: big targets (both work — a child may reach for the can) */}
      <g
        onPointerDown={pedalDown}
        onPointerUp={pedalUp}
        onPointerCancel={pedalUp}
        onPointerLeave={pedalUp}
        style={{ cursor: 'pointer' }}
      >
        <rect x={110} y={506} width={190} height={90} rx={20} fill="transparent" />
        <rect x={140} y={100} width={124} height={146} rx={20} fill="transparent" />
      </g>

      <Draggable
        home={WASH.soapHome}
        grabRadius={44}
        disabled={step === 'done' || (level === 1 && step !== 'soap')}
        returnAfterSnap={250}
        onPickUp={() => {
          poke();
          if (stepRef.current === 'soap') firstAction(true);
          else wrong(WASH.soapHome);
        }}
        onDrop={(at) => (stepRef.current === 'soap' && within(at, WASH.hands, Math.max(radius(), 70)) ? { x: WASH.hands.x, y: WASH.hands.y - 30 } : null)}
        onSnapped={() => {
          play('soap_squish');
          animate(foam, 0.2, { duration: 0.4 });
          complete({ x: WASH.hands.x, y: WASH.hands.y - 30 });
        }}
      >
        <SoapBar />
      </Draggable>

      <Draggable
        home={WASH.towelHome}
        grabRadius={56}
        disabled={step === 'done' || (level === 1 && step !== 'dry')}
        onPickUp={() => {
          poke();
          towelLast.current = null;
          if (stepRef.current === 'dry') firstAction(true);
          else wrong(WASH.towelHome);
        }}
        onMove={(at) => {
          if (stepRef.current !== 'dry' || busy.current) return;
          const prev = towelLast.current;
          towelLast.current = at;
          if (!prev || !insideRub(at)) return;
          dried.current += Math.min(60, Math.hypot(at.x - prev.x, at.y - prev.y));
          const p = Math.min(1, dried.current / DRY_NEEDED[level]);
          dryness.set(p);
          poke();
          if (Math.random() < 0.15) play('dry_cloth');
          if (p >= 1) complete();
        }}
        onDrop={() => null}
      >
        <Towel />
      </Draggable>

      {/* clean hands shine */}
      <motion.g style={{ opacity: shine, pointerEvents: 'none' }} aria-hidden>
        {[[-80, -70], [70, -90], [0, -120], [96, -10], [-96, 0]].map(([x, y], i) => (
          <motion.path
            key={i}
            d="M0 -14 L4 -4 L14 0 L4 4 L0 14 L-4 4 L-14 0 L-4 -4 Z"
            fill="#FFFFFF"
            stroke="#FFC02E"
            strokeWidth={2}
            style={{ x: WASH.hands.x + x, y: WASH.hands.y + y }}
            animate={{ scale: [0.6, 1.2, 0.6], rotate: [0, 45, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </motion.g>

      <Bursts bursts={bursts} />
      <AnimatePresence>{gesture && <GhostHand gesture={gesture} />}</AnimatePresence>
    </>
  );
}

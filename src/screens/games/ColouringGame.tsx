// Siga Amabara — colouring (docs/GAMES-DESIGN.md §4.6, approved by the owner).
//
// The one game with no right answer. The research is clear that children need
// open-ended play as well as right/wrong tasks, so here nothing is checked:
// the child picks a colour, taps a part of the picture, and paint pours in from
// where they touched. The colour's name shows as it is chosen, so a grown-up
// nearby can say it with them. Finished pictures are kept in "my pictures".

import { useMemo, useState } from 'react';
import type { PointerEvent as RPointerEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useI18n } from '../../i18n/context';
import { useSound, useHaptic } from '../../hooks/useSound';
import { useStars } from '../../hooks/useStars';
import { useProgress } from '../../hooks/useProgress';
import { useSkillEvidence } from '../../hooks/useSkillEvidence';
import { useStickers } from '../../hooks/useStickers';
import { usePictures } from '../../hooks/usePictures';
import type { SavedPicture } from '../../hooks/usePictures';
import { games } from '../../data/games';
import GameCelebration from '../../components/game/GameCelebration';
import GameFrame from '../../components/game/kit/GameFrame';
import Stage, { useStage } from '../../components/game/kit/Stage';
import { Bursts, useBursts } from '../../components/game/kit/Bursts';
import { COLOUR_BOX, PAINTS, PICTURES } from '../../components/game/art/Colouring';
import type { ColouringPicture } from '../../components/game/art/Colouring';
import { INK } from '../../components/game/art/Friends';

/** A finished or in-progress picture, drawn from its fills. */
function PictureArt({ pic, fills }: { pic: ColouringPicture; fills: Record<string, string> }) {
  return (
    <g>
      {pic.regions.map((r) => (
        <path key={r.id} d={r.d} fill={fills[r.id] ?? '#FFFFFF'} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      ))}
      {pic.details && <path d={pic.details} fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />}
      {pic.dots && <path d={pic.dots} fill={INK} />}
    </g>
  );
}

export default function ColouringGame() {
  const { t, language } = useI18n();
  const info = games.find((g) => g.id === 'siga');
  const { play } = useSound();
  const haptic = useHaptic();
  const { addStar } = useStars();
  const { markGameCompleted } = useProgress();
  const { award } = useStickers();
  const { recordOffline } = useSkillEvidence();
  const { saved, save } = usePictures();

  const [pic, setPic] = useState<ColouringPicture | null>(null);
  const [fills, setFills] = useState<Record<string, string>>({});
  const [paint, setPaint] = useState(PAINTS[0]);
  const [earned, setEarned] = useState<ReturnType<typeof award> | null>(null);
  const [won, setWon] = useState(false);
  const [named, setNamed] = useState(false);
  const [gallery, setGallery] = useState(false);

  const coloured = Object.keys(fills).length;

  const open = (p: ColouringPicture) => {
    play('tap');
    haptic.lightTap();
    setFills({});
    setPic(p);
  };

  const finish = () => {
    if (!pic || coloured === 0) return;
    save(pic.id, fills);
    addStar(1);
    markGameCompleted('siga');
    setEarned(award());
    play('victory_fanfare');
    haptic.success();
    setWon(true);
  };

  const again = () => {
    setWon(false);
    setEarned(null);
    setNamed(false);
    setPic(null);
  };

  const doneButton = pic && !won && (
    <motion.button
      onClick={finish}
      aria-label={t('siga.done')}
      animate={{ scale: coloured >= 3 ? [1, 1.08, 1] : 1, opacity: coloured ? 1 : 0.45 }}
      transition={{ scale: { duration: 1.4, repeat: coloured >= 3 ? Infinity : 0 } }}
      className="rounded-[18px] grid place-items-center flex-none"
      style={{ width: 56, height: 56, background: '#2FBF6B', boxShadow: '0 5px 0 #1E8C4C' }}
    >
      <svg viewBox="0 0 24 24" style={{ width: 30, height: 30 }} aria-hidden>
        <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#FFFFFF" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.button>
  );

  return (
    <GameFrame
      title={info ? info.title[language] : 'Siga'}
      background="#FF8FB8"
      deep="#E0608F"
      onBack={pic && !won ? () => setPic(null) : gallery ? () => setGallery(false) : undefined}
      right={doneButton}
    >
      {!pic && !gallery && <PicturePicker onOpen={open} savedCount={saved.length} onGallery={() => setGallery(true)} />}
      {!pic && gallery && <Gallery saved={saved} />}

      {pic && !won && (
        <div className="h-full flex flex-col">
          <div className="flex-1 min-h-0 px-3 pt-1">
            <Stage width={COLOUR_BOX} height={COLOUR_BOX} label={pic.name[language]}>
              <PaintCanvas pic={pic} fills={fills} colour={paint.hex} onFill={(id, hex) => setFills((f) => ({ ...f, [id]: hex }))} />
            </Stage>
          </div>
          <Palette selected={paint.id} onPick={(p) => { setPaint(p); play('pop', 0.9 + PAINTS.indexOf(p) * 0.05); haptic.tick(); }} />
        </div>
      )}

      {won && (
        <GameCelebration
          onPlayAgain={again}
          sticker={earned}
          extra={
            <div className="mt-6 w-full max-w-xs rounded-[22px] p-4 text-left" style={{ background: '#0E3626' }}>
              <p className="font-body font-black text-[12px] tracking-[.12em]" style={{ color: '#FFC02E' }}>KINA CHALLENGE</p>
              <p className="font-body font-bold text-white mt-1" style={{ fontSize: 15 }}>{t('siga.challenge')}</p>
              <button
                onClick={() => {
                  if (named) return;
                  recordOffline(['art.colour.name'], 'siga');
                  setNamed(true);
                  play('success');
                }}
                className="mt-3 w-full rounded-[16px] font-body font-black"
                style={{ minHeight: 52, background: named ? '#1E8C4C' : '#FFFFFF', color: named ? '#FFFFFF' : '#17543C', fontSize: 15 }}
              >
                {named ? `✓ ${t('karaba.challengeThanks')}` : t('siga.challengeDone')}
              </button>
            </div>
          }
        />
      )}
    </GameFrame>
  );
}

// ── Choosing a picture ───────────────────────────────────────────────────────

function PicturePicker({ onOpen, savedCount, onGallery }: { onOpen: (p: ColouringPicture) => void; savedCount: number; onGallery: () => void }) {
  const { t, language } = useI18n();
  return (
    <div className="h-full overflow-y-auto overscroll-contain px-4 pt-2 pb-6">
      {savedCount > 0 && (
        <motion.button
          onClick={onGallery}
          whileTap={{ y: 4 }}
          className="w-full rounded-[22px] bg-white flex items-center justify-between px-5 mb-4"
          style={{ minHeight: 64, boxShadow: '0 6px 0 #E0608F' }}
        >
          <span className="font-display font-extrabold" style={{ fontSize: 18, color: '#17543C' }}>{t('siga.mine')}</span>
          <span className="font-body font-black rounded-full px-3 py-1 text-white" style={{ background: '#FF6B4A', fontSize: 14 }}>{savedCount}</span>
        </motion.button>
      )}
      <div className="grid grid-cols-2 gap-4">
        {PICTURES.map((p) => (
          <motion.button
            key={p.id}
            onClick={() => onOpen(p)}
            aria-label={p.name[language]}
            whileTap={{ y: 5, boxShadow: '0 2px 0 #E0608F' }}
            transition={{ type: 'spring', stiffness: 900, damping: 34, mass: 0.5 }}
            className="rounded-[22px] bg-white p-2"
            style={{ boxShadow: '0 7px 0 #E0608F' }}
          >
            <svg viewBox={`0 0 ${COLOUR_BOX} ${COLOUR_BOX}`} className="w-full rounded-[14px]" style={{ display: 'block', height: 'auto' }} aria-hidden>
              <PictureArt pic={p} fills={{}} />
            </svg>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function Gallery({ saved }: { saved: SavedPicture[] }) {
  const byId = useMemo(() => Object.fromEntries(PICTURES.map((p) => [p.id, p])), []);
  return (
    <div className="h-full overflow-y-auto overscroll-contain px-4 pt-2 pb-6 grid grid-cols-2 gap-4 content-start">
      {saved.map((s, i) => {
        const p = byId[s.picture];
        if (!p) return null;
        return (
          <motion.div
            key={s.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: Math.min(i, 10) * 0.04 }}
            className="rounded-[18px] bg-white p-2"
            style={{ boxShadow: '0 6px 0 #E0608F', transform: `rotate(${(i % 3) - 1}deg)` }}
          >
            <svg viewBox={`0 0 ${COLOUR_BOX} ${COLOUR_BOX}`} className="w-full rounded-[12px]" style={{ display: 'block', height: 'auto' }} aria-hidden>
              <PictureArt pic={p} fills={s.fills} />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Painting ─────────────────────────────────────────────────────────────────

interface Splash {
  key: number;
  region: string;
  hex: string;
  x: number;
  y: number;
}

function PaintCanvas({ pic, fills, colour, onFill }: { pic: ColouringPicture; fills: Record<string, string>; colour: string; onFill: (id: string, hex: string) => void }) {
  const stage = useStage();
  const { play } = useSound();
  const haptic = useHaptic();
  const { bursts, burst } = useBursts();
  const [splashes, setSplashes] = useState<Splash[]>([]);

  const tap = (regionId: string, e: RPointerEvent<SVGPathElement>) => {
    if (fills[regionId] === colour) return;
    const p = stage.toLocal(e.clientX, e.clientY);
    const key = Date.now() + Math.random();
    setSplashes((s) => [...s, { key, region: regionId, hex: colour, x: p.x, y: p.y }]);
    play('paint', 0.85 + Math.random() * 0.3);
    haptic.tick();
    window.setTimeout(() => {
      onFill(regionId, colour);
      setSplashes((s) => s.filter((x) => x.key !== key));
    }, 420);
    if (Math.random() < 0.35) burst(p, { colors: [colour, '#FFFFFF'], size: 0.5 });
  };

  return (
    <g>
      <defs>
        {pic.regions.map((r) => (
          <clipPath key={r.id} id={`kw-region-${r.id}`}>
            <path d={r.d} />
          </clipPath>
        ))}
      </defs>
      <rect x={0} y={0} width={COLOUR_BOX} height={COLOUR_BOX} rx={22} fill="#FFFFFF" />
      {pic.regions.map((r) => (
        <g key={r.id}>
          <path
            d={r.d}
            fill={fills[r.id] ?? '#FFFFFF'}
            stroke={INK}
            strokeWidth={4}
            strokeLinejoin="round"
            onPointerDown={(e) => tap(r.id, e)}
            style={{ cursor: 'pointer' }}
          />
          {splashes
            .filter((s) => s.region === r.id)
            .map((s) => (
              <g key={s.key} clipPath={`url(#kw-region-${r.id})`} style={{ pointerEvents: 'none' }}>
                <motion.circle cx={s.x} cy={s.y} r={420} fill={s.hex} initial={{ scale: 0.01 }} animate={{ scale: 1 }} transition={{ duration: 0.45, ease: 'easeOut' }} />
              </g>
            ))}
          {splashes.some((s) => s.region === r.id) && (
            <path d={r.d} fill="none" stroke={INK} strokeWidth={4} strokeLinejoin="round" style={{ pointerEvents: 'none' }} />
          )}
        </g>
      ))}
      {pic.details && <path d={pic.details} fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }} />}
      {pic.dots && <path d={pic.dots} fill={INK} style={{ pointerEvents: 'none' }} />}
      <Bursts bursts={bursts} />
    </g>
  );
}

function Palette({ selected, onPick }: { selected: string; onPick: (p: (typeof PAINTS)[number]) => void }) {
  const { language } = useI18n();
  const current = PAINTS.find((p) => p.id === selected) ?? PAINTS[0];
  return (
    <div className="flex-none px-3 pt-2 pb-1">
      <AnimatePresence mode="wait">
        <motion.p
          key={current.id}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          className="text-center font-display font-extrabold text-white mb-2"
          style={{ fontSize: 22, textShadow: '0 2px 0 #E0608F' }}
        >
          {current.name[language]}
        </motion.p>
      </AnimatePresence>
      <div className="flex flex-wrap justify-center gap-2.5">
        {PAINTS.map((p) => {
          const on = p.id === selected;
          return (
            <motion.button
              key={p.id}
              onClick={() => onPick(p)}
              aria-label={p.name[language]}
              aria-pressed={on}
              animate={{ y: on ? -6 : 0, scale: on ? 1.08 : 1 }}
              transition={{ type: 'spring', stiffness: 600, damping: 22 }}
              className="rounded-full flex-none"
              style={{
                width: 52,
                height: 52,
                background: p.hex,
                border: `4px solid ${on ? '#FFFFFF' : INK}`,
                boxShadow: on ? `0 0 0 4px ${INK}, 0 6px 0 #E0608F` : '0 4px 0 #E0608F',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

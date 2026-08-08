import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/context';
import { useSound, useHaptic } from '../../hooks/useSound';
import { useStars } from '../../hooks/useStars';
import { useProgress } from '../../hooks/useProgress';
import { games } from '../../data/games';
import { useSkillEvidence } from '../../hooks/useSkillEvidence';
import { KidShell, Card } from '../../components/ui/Shell';
import GameCelebration from '../../components/game/GameCelebration';

const TOTAL_ROUNDS = 5;
const ROUND_EMOJIS = ['🍊', '🐔', '🌽', '🐄', '🥭'];

interface Round {
  count: number;
  emoji: string;
  options: number[];
}

function randInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

/**
 * How high this child counts today.
 *
 * The game used to run a fixed ramp to 10 for everyone, so a three-year-old met
 * L3 numbers by round 4 with no way to stop. Levels are not gates (§7) — but a
 * ramp that ignores the child entirely is not a level-free design, it is just a
 * design that has not met them.
 *
 * The ceiling only ever RISES with evidence. A child who has not yet shown
 * cardinality to 5 stays inside 5, where the work actually is.
 */
function ceilingFor(cardinal5: string | null, cardinal10: string | null): number {
  const strong = (b: string | null) => b === 'demonstrated' || b === 'applying';
  if (strong(cardinal10)) return 10;
  if (strong(cardinal5)) return 7;
  return 5;
}

/** Five rounds that climb toward the ceiling without ever exceeding it. */
function rangesFor(ceiling: number): [number, number][] {
  if (ceiling <= 5) return [[1, 2], [1, 3], [2, 4], [2, 5], [3, 5]];
  if (ceiling <= 7) return [[1, 3], [2, 5], [3, 6], [3, 7], [4, 7]];
  return [[1, 3], [2, 5], [3, 7], [4, 9], [5, 10]];
}

function makeRound(roundIndex: number, ranges: [number, number][], ceiling: number): Round {
  const [min, max] = ranges[Math.min(roundIndex, ranges.length - 1)];
  const count = randInt(min, max);
  const options = new Set<number>([count]);
  // Distractors stay inside the child's ceiling too — offering "9" to a child
  // working within 5 teaches nothing and only widens the guess.
  while (options.size < 3) {
    options.add(randInt(Math.max(1, count - 3), Math.min(ceiling, count + 3)));
  }
  return {
    count,
    emoji: ROUND_EMOJIS[roundIndex % ROUND_EMOJIS.length],
    options: [...options].sort((a, b) => a - b),
  };
}

export default function CountingGame() {
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const { play } = useSound();
  const haptic = useHaptic();
  const { stars, addStar } = useStars();
  const { markGameCompleted } = useProgress();
  const { record, band } = useSkillEvidence();

  // Read the child's level ONCE, at mount. Difficulty must not shift under a
  // child mid-game just because they got one right.
  const [{ ceiling, ranges }] = useState(() => {
    const c = ceilingFor(band('num.cardinal5'), band('num.cardinal10'));
    return { ceiling: c, ranges: rangesFor(c) };
  });

  const [roundIndex, setRoundIndex] = useState(0);
  const [round, setRound] = useState<Round>(() => makeRound(0, ranges, ceiling));
  const [wrongPick, setWrongPick] = useState<number | null>(null);
  const [correctPicked, setCorrectPicked] = useState(false);
  const [won, setWon] = useState(false);
  const [mistakes, setMistakes] = useState(0);

  const info = games.find(g => g.id === 'counting');

  const handlePick = (n: number) => {
    if (correctPicked || won) return;

    // Games record evidence too, not just lessons. Before this, ONLY lessons
    // wrote, so `sources.size >= 2` could almost never happen and ⭐ Applying —
    // "uses it in a new situation" — was effectively unreachable. A skill met
    // in a lesson and then used in a game is exactly the situation that band
    // was written to describe.
    record(round.count <= 5 ? 'num.cardinal5' : 'num.cardinal10', n === round.count, 'game:counting');

    if (n === round.count) {
      setCorrectPicked(true);
      play('clean_chime');
      haptic.mediumTap();
      setTimeout(() => {
        if (roundIndex + 1 >= TOTAL_ROUNDS) {
          setWon(true);
          addStar(1);
          markGameCompleted('counting');
          play('victory_fanfare');
          haptic.success();
        } else {
          const next = roundIndex + 1;
          setRoundIndex(next);
          setRound(makeRound(next, ranges, ceiling));
          setCorrectPicked(false);
          setWrongPick(null);
        }
      }, 900);
    } else {
      play('error');
      haptic.lightTap();
      setMistakes(m => m + 1);
      setWrongPick(n);
      setTimeout(() => setWrongPick(null), 700);
    }
  };

  const restart = () => {
    setRoundIndex(0);
    setRound(makeRound(0, ranges, ceiling));
    setWrongPick(null);
    setCorrectPicked(false);
    setMistakes(0);
    setWon(false);
  };

  return (
    <KidShell
      title={info ? info.title[language] : 'Count!'}
      onBack={() => navigate('/games')}
      nav={false}
      lang={false}
    >
      <div className="flex flex-col items-center px-6 pt-2 pb-10">
        {/* Round progress dots */}
        <div className="flex gap-2 mb-6">
          {[...Array(TOTAL_ROUNDS)].map((_, i) => (
            <motion.span
              key={i}
              className="rounded-full"
              animate={{ width: i === roundIndex ? 26 : 12, height: 12 }}
              transition={{ type: 'spring', stiffness: 400, damping: 26 }}
              style={{ background: i <= roundIndex ? '#35A7E8' : '#E4DDCE' }}
            />
          ))}
        </div>

        <h2 className="font-display text-2xl font-extrabold mb-6 text-center" style={{ color: '#17543C' }}>
          {t('counting.question')}
        </h2>

        <Card className="w-full max-w-sm min-h-[180px] flex flex-wrap items-center justify-center gap-3 mb-8">
          {[...Array(round.count)].map((_, i) => (
            <motion.span
              key={`${roundIndex}-${i}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.08, type: 'spring' }}
              className="text-5xl"
            >
              {round.emoji}
            </motion.span>
          ))}
        </Card>

        <div className="flex gap-4">
          {round.options.map(n => (
            <motion.button
              key={n}
              onClick={() => handlePick(n)}
              animate={wrongPick === n ? { x: [0, -8, 8, -8, 0] } : {}}
              whileTap={{ y: 5 }}
              className="chunk w-20 h-20 rounded-[20px] font-display font-extrabold text-3xl grid place-items-center"
              style={
                correctPicked && n === round.count
                  ? { background: '#2FBF6B', color: '#FFFFFF', boxShadow: '0 6px 0 #1E8C4C' }
                  : { background: '#FFFFFF', color: '#17543C', boxShadow: '0 6px 0 #DDD6C8' }
              }
            >
              {n}
            </motion.button>
          ))}
        </div>
      </div>

      {won && <GameCelebration onPlayAgain={restart} scoreLabel={`${TOTAL_ROUNDS - Math.min(mistakes, TOTAL_ROUNDS)}/${TOTAL_ROUNDS}`} />}
    </KidShell>
  );
}

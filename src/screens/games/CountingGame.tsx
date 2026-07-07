import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useI18n } from '../../i18n/context';
import { useSound, useHaptic } from '../../hooks/useSound';
import { useStars } from '../../hooks/useStars';
import { games } from '../../data/games';
import GameHeader from '../../components/game/GameHeader';
import GameCelebration from '../../components/game/GameCelebration';

const TOTAL_ROUNDS = 5;
// Difficulty rises with each round: [min, max] target count
const ROUND_RANGES: [number, number][] = [[1, 3], [2, 5], [3, 7], [4, 9], [5, 10]];
const ROUND_EMOJIS = ['🍊', '🐔', '🌽', '🐄', '🥭'];

interface Round {
  count: number;
  emoji: string;
  options: number[];
}

function randInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function makeRound(roundIndex: number): Round {
  const [min, max] = ROUND_RANGES[Math.min(roundIndex, ROUND_RANGES.length - 1)];
  const count = randInt(min, max);
  const options = new Set<number>([count]);
  while (options.size < 3) {
    const distractor = randInt(Math.max(1, count - 3), Math.min(10, count + 3));
    options.add(distractor);
  }
  return {
    count,
    emoji: ROUND_EMOJIS[roundIndex % ROUND_EMOJIS.length],
    options: [...options].sort((a, b) => a - b),
  };
}

export default function CountingGame() {
  const { t, language } = useI18n();
  const { play } = useSound();
  const haptic = useHaptic();
  const { addStar } = useStars();

  const [roundIndex, setRoundIndex] = useState(0);
  const [round, setRound] = useState<Round>(() => makeRound(0));
  const [wrongPick, setWrongPick] = useState<number | null>(null);
  const [correctPicked, setCorrectPicked] = useState(false);
  const [won, setWon] = useState(false);
  const [mistakes, setMistakes] = useState(0);

  const info = games.find(g => g.id === 'counting');

  const handlePick = (n: number) => {
    if (correctPicked || won) return;
    if (n === round.count) {
      setCorrectPicked(true);
      play('clean_chime');
      haptic.mediumTap();
      setTimeout(() => {
        if (roundIndex + 1 >= TOTAL_ROUNDS) {
          setWon(true);
          addStar(1);
          play('victory_fanfare');
          haptic.success();
        } else {
          const next = roundIndex + 1;
          setRoundIndex(next);
          setRound(makeRound(next));
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
    setRound(makeRound(0));
    setWrongPick(null);
    setCorrectPicked(false);
    setMistakes(0);
    setWon(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="min-h-screen flex flex-col bg-surface"
    >
      <GameHeader title={info ? info.title[language] : 'Count!'} />

      <main className="flex-1 flex flex-col items-center px-6 pt-2 pb-10">
        {/* Round progress dots */}
        <div className="flex gap-2 mb-6">
          {[...Array(TOTAL_ROUNDS)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                i < roundIndex ? 'bg-secondary' : i === roundIndex ? 'bg-primary scale-125' : 'bg-surface-container-highest'
              }`}
            />
          ))}
        </div>

        <h2 className="font-headline text-2xl text-primary font-bold mb-6 text-center">
          {t('counting.question')}
        </h2>

        <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-sm min-h-[180px] flex flex-wrap items-center justify-center gap-3 mb-8">
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
        </div>

        <div className="flex gap-4">
          {round.options.map(n => (
            <motion.button
              key={n}
              onClick={() => handlePick(n)}
              animate={wrongPick === n ? { x: [0, -8, 8, -8, 0] } : {}}
              className={`w-20 h-20 rounded-2xl font-display font-bold text-3xl shadow-md transition-colors active:scale-90 ${
                correctPicked && n === round.count
                  ? 'bg-secondary text-white'
                  : wrongPick === n
                    ? 'bg-danger/20 text-danger border-4 border-danger'
                    : 'bg-white text-primary border-4 border-primary/20 hover:border-primary/50'
              }`}
            >
              {n}
            </motion.button>
          ))}
        </div>
      </main>

      {won && <GameCelebration onPlayAgain={restart} scoreLabel={`${TOTAL_ROUNDS - Math.min(mistakes, TOTAL_ROUNDS)}/${TOTAL_ROUNDS}`} />}
    </motion.div>
  );
}

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/context';
import { useSound, useHaptic } from '../../hooks/useSound';
import { useStars } from '../../hooks/useStars';
import { useProgress } from '../../hooks/useProgress';
import { games } from '../../data/games';
import { KidShell, Card } from '../../components/ui/Shell';
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
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const { play } = useSound();
  const haptic = useHaptic();
  const { stars, addStar } = useStars();
  const { markGameCompleted } = useProgress();

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
          markGameCompleted('counting');
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

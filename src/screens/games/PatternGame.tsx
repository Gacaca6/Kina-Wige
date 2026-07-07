import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useI18n } from '../../i18n/context';
import { useSound, useHaptic } from '../../hooks/useSound';
import { useStars } from '../../hooks/useStars';
import { games } from '../../data/games';
import GameHeader from '../../components/game/GameHeader';
import GameCelebration from '../../components/game/GameCelebration';

interface PatternRound {
  sequence: string[];
  answer: string;
  options: string[];
}

// Fixed rounds with rising difficulty: ABAB → AABB → ABC → ABB
const ROUNDS: PatternRound[] = [
  { sequence: ['🔴', '🔵', '🔴', '🔵'], answer: '🔴', options: ['🔴', '🔵', '🟡'] },
  { sequence: ['🟡', '🟢', '🟡', '🟢'], answer: '🟡', options: ['🟢', '🟡', '🔵'] },
  { sequence: ['🔵', '🔵', '🟡', '🟡', '🔵', '🔵'], answer: '🟡', options: ['🔵', '🟡', '🔴'] },
  { sequence: ['🔴', '🟡', '🔵', '🔴', '🟡'], answer: '🔵', options: ['🟡', '🔵', '🔴'] },
  { sequence: ['⭐', '🌙', '🌙', '⭐', '🌙'], answer: '🌙', options: ['⭐', '🌙', '🔴'] },
];

export default function PatternGame() {
  const { t, language } = useI18n();
  const { play } = useSound();
  const haptic = useHaptic();
  const { addStar } = useStars();

  const [roundIndex, setRoundIndex] = useState(0);
  const [wrongPick, setWrongPick] = useState<string | null>(null);
  const [correctPicked, setCorrectPicked] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [won, setWon] = useState(false);

  const info = games.find(g => g.id === 'pattern');
  const round = ROUNDS[roundIndex];

  const handlePick = (choice: string) => {
    if (correctPicked || won) return;
    if (choice === round.answer) {
      setCorrectPicked(true);
      play('clean_chime');
      haptic.mediumTap();
      setTimeout(() => {
        if (roundIndex + 1 >= ROUNDS.length) {
          setWon(true);
          addStar(1);
          play('victory_fanfare');
          haptic.success();
        } else {
          setRoundIndex(roundIndex + 1);
          setCorrectPicked(false);
          setWrongPick(null);
        }
      }, 900);
    } else {
      play('error');
      haptic.lightTap();
      setMistakes(m => m + 1);
      setWrongPick(choice);
      setTimeout(() => setWrongPick(null), 700);
    }
  };

  const restart = () => {
    setRoundIndex(0);
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
      <GameHeader title={info ? info.title[language] : 'Patterns'} />

      <main className="flex-1 flex flex-col items-center px-6 pt-2 pb-10">
        <div className="flex gap-2 mb-6">
          {ROUNDS.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                i < roundIndex ? 'bg-secondary' : i === roundIndex ? 'bg-primary scale-125' : 'bg-surface-container-highest'
              }`}
            />
          ))}
        </div>

        <h2 className="font-headline text-2xl text-primary font-bold mb-6 text-center max-w-xs">
          {t('pattern.instructions')}
        </h2>

        <div className="bg-white rounded-3xl shadow-lg px-6 py-8 w-full max-w-md flex flex-wrap items-center justify-center gap-2 mb-8">
          {round.sequence.map((item, i) => (
            <motion.span
              key={`${roundIndex}-${i}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.12, type: 'spring' }}
              className="text-5xl"
            >
              {item}
            </motion.span>
          ))}
          <motion.span
            key={`${roundIndex}-q`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: round.sequence.length * 0.12, type: 'spring' }}
            className={`text-5xl w-16 h-16 flex items-center justify-center rounded-2xl border-4 border-dashed ${
              correctPicked ? 'border-secondary' : 'border-primary/40'
            }`}
          >
            {correctPicked ? round.answer : '❓'}
          </motion.span>
        </div>

        <div className="flex gap-4">
          {round.options.map(opt => (
            <motion.button
              key={opt}
              onClick={() => handlePick(opt)}
              animate={wrongPick === opt ? { x: [0, -8, 8, -8, 0] } : {}}
              className={`w-20 h-20 rounded-2xl text-4xl shadow-md flex items-center justify-center transition-colors active:scale-90 ${
                correctPicked && opt === round.answer
                  ? 'bg-secondary/30 border-4 border-secondary'
                  : wrongPick === opt
                    ? 'bg-danger/20 border-4 border-danger'
                    : 'bg-white border-4 border-primary/20 hover:border-primary/50'
              }`}
            >
              {opt}
            </motion.button>
          ))}
        </div>
      </main>

      {won && <GameCelebration onPlayAgain={restart} scoreLabel={`${ROUNDS.length - Math.min(mistakes, ROUNDS.length)}/${ROUNDS.length}`} />}
    </motion.div>
  );
}

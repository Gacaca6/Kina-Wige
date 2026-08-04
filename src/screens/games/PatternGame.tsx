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
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const { play } = useSound();
  const haptic = useHaptic();
  const { stars, addStar } = useStars();
  const { markGameCompleted } = useProgress();

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
          markGameCompleted('pattern');
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
    <KidShell
      title={info ? info.title[language] : 'Patterns'}
      onBack={() => navigate('/games')}
      nav={false}
      lang={false}
    >
      <div className="flex flex-col items-center px-6 pt-2 pb-10">
        <div className="flex gap-2 mb-6">
          {ROUNDS.map((_, i) => (
            <motion.span
              key={i}
              className="rounded-full"
              animate={{ width: i === roundIndex ? 26 : 12, height: 12 }}
              transition={{ type: 'spring', stiffness: 400, damping: 26 }}
              style={{ background: i <= roundIndex ? '#FF6B4A' : '#E4DDCE' }}
            />
          ))}
        </div>

        <h2 className="font-display text-2xl font-extrabold mb-6 text-center max-w-xs" style={{ color: '#17543C' }}>
          {t('pattern.instructions')}
        </h2>

        <Card className="w-full max-w-md flex flex-wrap items-center justify-center gap-2 mb-8 !py-8">
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
            className="text-5xl w-16 h-16 grid place-items-center rounded-[18px]"
            style={{ border: `4px dashed ${correctPicked ? '#2FBF6B' : '#C3DFC7'}` }}
          >
            {correctPicked ? round.answer : '❓'}
          </motion.span>
        </Card>

        <div className="flex gap-4">
          {round.options.map(opt => (
            <motion.button
              key={opt}
              onClick={() => handlePick(opt)}
              animate={wrongPick === opt ? { x: [0, -8, 8, -8, 0] } : {}}
              whileTap={{ y: 5 }}
              className="chunk w-20 h-20 rounded-[20px] text-4xl grid place-items-center"
              style={
                correctPicked && opt === round.answer
                  ? { background: '#2FBF6B', boxShadow: '0 6px 0 #1E8C4C' }
                  : { background: '#FFFFFF', boxShadow: '0 6px 0 #DDD6C8' }
              }
            >
              {opt}
            </motion.button>
          ))}
        </div>
      </div>

      {won && <GameCelebration onPlayAgain={restart} scoreLabel={`${ROUNDS.length - Math.min(mistakes, ROUNDS.length)}/${ROUNDS.length}`} />}
    </KidShell>
  );
}

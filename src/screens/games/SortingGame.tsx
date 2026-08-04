import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/context';
import { useSound, useHaptic } from '../../hooks/useSound';
import { useStars } from '../../hooks/useStars';
import { useProgress } from '../../hooks/useProgress';
import { games } from '../../data/games';
import type { Language } from '../../i18n/translations';
import { KidShell } from '../../components/ui/Shell';
import GameCelebration from '../../components/game/GameCelebration';

interface FoodItem {
  emoji: string;
  healthy: boolean;
  name: Record<Language, string>;
}

const FOOD_ITEMS: FoodItem[] = [
  { emoji: '🍎', healthy: true, name: { KN: 'Pome', EN: 'Apple', FR: 'Pomme' } },
  { emoji: '🍭', healthy: false, name: { KN: 'Bombo', EN: 'Lollipop', FR: 'Sucette' } },
  { emoji: '🥕', healthy: true, name: { KN: 'Karoti', EN: 'Carrot', FR: 'Carotte' } },
  { emoji: '🍟', healthy: false, name: { KN: 'Ifiriti', EN: 'Fries', FR: 'Frites' } },
  { emoji: '🍌', healthy: true, name: { KN: 'Umuneke', EN: 'Banana', FR: 'Banane' } },
  { emoji: '🥤', healthy: false, name: { KN: 'Ifanta', EN: 'Soda', FR: 'Soda' } },
  { emoji: '🥛', healthy: true, name: { KN: 'Amata', EN: 'Milk', FR: 'Lait' } },
  { emoji: '🍩', healthy: false, name: { KN: 'Donati', EN: 'Doughnut', FR: 'Beignet' } },
];

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function SortingGame() {
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const { play } = useSound();
  const haptic = useHaptic();
  const { stars, addStar } = useStars();
  const { markGameCompleted } = useProgress();

  const [items, setItems] = useState<FoodItem[]>(() => shuffle(FOOD_ITEMS));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [won, setWon] = useState(false);

  const info = games.find(g => g.id === 'sorting');
  const current = items[index];

  const handleSort = (choseHealthy: boolean) => {
    if (feedback || won || !current) return;

    const correct = choseHealthy === current.healthy;
    if (correct) {
      setScore(s => s + 1);
      play('clean_chime');
      haptic.mediumTap();
      setFeedback('correct');
    } else {
      play('error');
      haptic.lightTap();
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      if (index + 1 >= items.length) {
        setWon(true);
        addStar(1);
        markGameCompleted('sorting');
        play('victory_fanfare');
        haptic.success();
      } else {
        setIndex(index + 1);
      }
    }, correct ? 700 : 1400);
  };

  const restart = () => {
    setItems(shuffle(FOOD_ITEMS));
    setIndex(0);
    setScore(0);
    setFeedback(null);
    setWon(false);
  };

  return (
    <KidShell
      title={info ? info.title[language] : 'Sorting'}
      onBack={() => navigate('/games')}
      nav={false}
      lang={false}
    >
      <div className="flex flex-col items-center px-6 pt-2 pb-10">
        <div className="flex gap-1.5 mb-6">
          {items.map((_, i) => (
            <span
              key={i}
              className="rounded-full flex-none"
              style={{
                width: i === index ? 20 : 10,
                height: 10,
                background: i <= index ? '#FFC02E' : '#E4DDCE',
                transition: 'width .2s',
              }}
            />
          ))}
        </div>

        <h2 className="font-display text-2xl font-extrabold mb-8 text-center max-w-xs" style={{ color: '#17543C' }}>
          {t('sorting.question')}
        </h2>

        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              key={index}
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="relative bg-white w-48 h-48 flex flex-col items-center justify-center mb-10"
              style={{
                borderRadius: 26,
                boxShadow: feedback === 'correct' ? '0 0 0 6px #2FBF6B, 0 6px 0 #DDD6C8' : '0 6px 0 #DDD6C8',
              }}
            >
              <span className="text-7xl mb-2">{current.emoji}</span>
              <span className="font-display font-extrabold" style={{ color: '#10241B' }}>{current.name[language]}</span>

              {/* On a wrong answer, show which bin was right so the child learns — no red, just the correct answer surfacing. */}
              {feedback === 'wrong' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-5 px-4 py-1.5 rounded-full font-body font-black text-white"
                  style={{ fontSize: 13, background: '#17543C' }}
                >
                  {current.healthy ? `✅ ${t('sorting.healthy')}` : `🍬 ${t('sorting.unhealthy')}`}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-4 w-full max-w-sm">
          <motion.button
            onClick={() => handleSort(true)}
            whileTap={{ y: 6, boxShadow: '0 2px 0 #1E8C4C' }}
            transition={{ type: 'spring', stiffness: 900, damping: 34, mass: 0.5 }}
            className="chunk flex-1 flex flex-col items-center gap-2 rounded-[22px] py-5"
            style={{ background: '#2FBF6B', boxShadow: '0 8px 0 #1E8C4C' }}
          >
            <span className="w-12 h-12 rounded-full bg-white grid place-items-center" style={{ color: '#17543C' }}>
              <Check className="w-7 h-7" strokeWidth={3} />
            </span>
            <span className="font-display font-extrabold text-white">{t('sorting.healthy')}</span>
          </motion.button>
          <motion.button
            onClick={() => handleSort(false)}
            whileTap={{ y: 6, boxShadow: '0 2px 0 #6F43C9' }}
            transition={{ type: 'spring', stiffness: 900, damping: 34, mass: 0.5 }}
            className="chunk flex-1 flex flex-col items-center gap-2 rounded-[22px] py-5"
            style={{ background: '#9B6BFF', boxShadow: '0 8px 0 #6F43C9' }}
          >
            <span className="w-12 h-12 rounded-full bg-white grid place-items-center" style={{ color: '#6F43C9' }}>
              <X className="w-7 h-7" strokeWidth={3} />
            </span>
            <span className="font-display font-extrabold text-white">{t('sorting.unhealthy')}</span>
          </motion.button>
        </div>
      </div>

      {won && <GameCelebration onPlayAgain={restart} scoreLabel={`${score}/${items.length}`} />}
    </KidShell>
  );
}

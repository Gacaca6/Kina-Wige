import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X } from 'lucide-react';
import { useI18n } from '../../i18n/context';
import { useSound, useHaptic } from '../../hooks/useSound';
import { useStars } from '../../hooks/useStars';
import { games } from '../../data/games';
import type { Language } from '../../i18n/translations';
import GameHeader from '../../components/game/GameHeader';
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
  const { t, language } = useI18n();
  const { play } = useSound();
  const haptic = useHaptic();
  const { addStar } = useStars();

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
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="min-h-screen flex flex-col bg-surface"
    >
      <GameHeader title={info ? info.title[language] : 'Sorting'} />

      <main className="flex-1 flex flex-col items-center px-6 pt-2 pb-10">
        <div className="flex gap-1.5 mb-6">
          {items.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i < index ? 'bg-secondary' : i === index ? 'bg-primary scale-125' : 'bg-surface-container-highest'
              }`}
            />
          ))}
        </div>

        <h2 className="font-headline text-2xl text-primary font-bold mb-8 text-center max-w-xs">
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
              className={`relative bg-white rounded-3xl shadow-lg w-48 h-48 flex flex-col items-center justify-center mb-10 border-8 transition-colors ${
                feedback === 'correct' ? 'border-secondary' : feedback === 'wrong' ? 'border-danger' : 'border-surface-warm'
              }`}
            >
              <span className="text-7xl mb-2">{current.emoji}</span>
              <span className="font-headline font-bold text-dark">{current.name[language]}</span>

              {/* On a wrong answer, show which bin was right so the child learns */}
              {feedback === 'wrong' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`absolute -bottom-5 px-4 py-1 rounded-full text-sm font-bold text-white shadow ${
                    current.healthy ? 'bg-secondary' : 'bg-danger'
                  }`}
                >
                  {current.healthy ? `✅ ${t('sorting.healthy')}` : `❌ ${t('sorting.unhealthy')}`}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-6 w-full max-w-sm">
          <button
            onClick={() => handleSort(true)}
            className="flex-1 flex flex-col items-center gap-2 bg-secondary/15 border-4 border-secondary rounded-3xl py-6 hover:bg-secondary/25 active:scale-95 transition-all"
          >
            <span className="w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center">
              <Check className="w-7 h-7" strokeWidth={3} />
            </span>
            <span className="font-headline font-bold text-primary">{t('sorting.healthy')}</span>
          </button>
          <button
            onClick={() => handleSort(false)}
            className="flex-1 flex flex-col items-center gap-2 bg-danger/10 border-4 border-danger rounded-3xl py-6 hover:bg-danger/20 active:scale-95 transition-all"
          >
            <span className="w-12 h-12 rounded-full bg-danger text-white flex items-center justify-center">
              <X className="w-7 h-7" strokeWidth={3} />
            </span>
            <span className="font-headline font-bold text-danger">{t('sorting.unhealthy')}</span>
          </button>
        </div>
      </main>

      {won && <GameCelebration onPlayAgain={restart} scoreLabel={`${score}/${items.length}`} />}
    </motion.div>
  );
}

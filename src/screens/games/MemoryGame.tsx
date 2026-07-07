import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { useI18n } from '../../i18n/context';
import { useSound, useHaptic } from '../../hooks/useSound';
import { useStars } from '../../hooks/useStars';
import { games } from '../../data/games';
import GameHeader from '../../components/game/GameHeader';
import GameCelebration from '../../components/game/GameCelebration';

const PAIR_EMOJIS = ['🍌', '🥑', '🐐', '🌻'];

interface Card {
  key: number;
  emoji: string;
  state: 'down' | 'up' | 'matched';
}

function buildDeck(): Card[] {
  const emojis = [...PAIR_EMOJIS, ...PAIR_EMOJIS];
  // Fisher–Yates shuffle
  for (let i = emojis.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [emojis[i], emojis[j]] = [emojis[j], emojis[i]];
  }
  return emojis.map((emoji, key) => ({ key, emoji, state: 'down' as const }));
}

export default function MemoryGame() {
  const { t, language } = useI18n();
  const { play } = useSound();
  const haptic = useHaptic();
  const { addStar } = useStars();

  const [cards, setCards] = useState<Card[]>(buildDeck);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [won, setWon] = useState(false);

  const info = games.find(g => g.id === 'memory');

  const handleTap = useCallback((key: number) => {
    if (locked || won) return;
    const card = cards.find(c => c.key === key);
    if (!card || card.state !== 'down') return;

    play('tap');
    haptic.lightTap();

    const nextFlipped = [...flipped, key];
    setCards(prev => prev.map(c => (c.key === key ? { ...c, state: 'up' } : c)));

    if (nextFlipped.length < 2) {
      setFlipped(nextFlipped);
      return;
    }

    // Second card of the pair
    setMoves(m => m + 1);
    setFlipped([]);
    const first = cards.find(c => c.key === nextFlipped[0]);

    if (first && first.emoji === card.emoji) {
      play('clean_chime');
      haptic.mediumTap();
      setCards(prev => {
        const next = prev.map(c =>
          c.key === nextFlipped[0] || c.key === key ? { ...c, state: 'matched' as const } : c,
        );
        if (next.every(c => c.state === 'matched')) {
          setTimeout(() => {
            setWon(true);
            addStar(1);
            play('victory_fanfare');
            haptic.success();
          }, 600);
        }
        return next;
      });
    } else {
      setLocked(true);
      setTimeout(() => {
        setCards(prev =>
          prev.map(c =>
            c.key === nextFlipped[0] || c.key === key ? { ...c, state: 'down' as const } : c,
          ),
        );
        setLocked(false);
      }, 900);
    }
  }, [cards, flipped, locked, won, play, haptic, addStar]);

  const restart = () => {
    setCards(buildDeck());
    setFlipped([]);
    setMoves(0);
    setLocked(false);
    setWon(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="min-h-screen flex flex-col bg-surface"
    >
      <GameHeader title={info ? info.title[language] : 'Memory'} />

      <main className="flex-1 flex flex-col items-center px-6 pt-4 pb-10">
        <p className="text-center text-primary/70 font-bold mb-6 max-w-xs">
          {t('memory.instructions')}
        </p>

        <div className="grid grid-cols-4 gap-3 w-full max-w-sm">
          {cards.map(card => (
            <button
              key={card.key}
              onClick={() => handleTap(card.key)}
              aria-label={card.state === 'down' ? 'Hidden card' : card.emoji}
              className={`aspect-square rounded-2xl flex items-center justify-center text-4xl shadow-md transition-all duration-300 active:scale-90 ${
                card.state === 'down'
                  ? 'bg-primary text-white hover:bg-primary-light'
                  : card.state === 'matched'
                    ? 'bg-secondary/30 border-4 border-secondary scale-95'
                    : 'bg-white border-4 border-primary/20'
              }`}
            >
              {card.state === 'down' ? <span className="text-3xl">❓</span> : card.emoji}
            </button>
          ))}
        </div>

        <div className="mt-8 bg-white px-6 py-3 rounded-full shadow-sm">
          <span className="font-headline font-bold text-primary">{t('game.score')}: {moves}</span>
        </div>
      </main>

      {won && <GameCelebration onPlayAgain={restart} scoreLabel={String(moves)} />}
    </motion.div>
  );
}

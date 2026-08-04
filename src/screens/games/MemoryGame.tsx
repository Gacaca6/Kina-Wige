import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/context';
import { useSound, useHaptic } from '../../hooks/useSound';
import { useStars } from '../../hooks/useStars';
import { useProgress } from '../../hooks/useProgress';
import { games } from '../../data/games';
import { KidShell, Card } from '../../components/ui/Shell';
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
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const { play } = useSound();
  const haptic = useHaptic();
  const { stars, addStar } = useStars();
  const { markGameCompleted } = useProgress();

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
            markGameCompleted('memory');
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
  }, [cards, flipped, locked, won, play, haptic, addStar, markGameCompleted]);

  const restart = () => {
    setCards(buildDeck());
    setFlipped([]);
    setMoves(0);
    setLocked(false);
    setWon(false);
  };

  return (
    <KidShell
      title={info ? info.title[language] : 'Memory'}
      onBack={() => navigate('/games')}
      nav={false}
      lang={false}
    >
      <div className="flex flex-col items-center px-6 pt-4 pb-10">
        <p className="text-center font-body font-bold mb-6 max-w-xs" style={{ color: '#3D5449' }}>
          {t('memory.instructions')}
        </p>

        <div className="grid grid-cols-4 gap-3 w-full max-w-sm">
          {cards.map(card => (
            <button
              key={card.key}
              onClick={() => handleTap(card.key)}
              aria-label={card.state === 'down' ? 'Hidden card' : card.emoji}
              className="aspect-square rounded-[18px] grid place-items-center text-4xl chunk active:translate-y-1"
              style={
                card.state === 'down'
                  ? { background: '#9B6BFF', boxShadow: '0 6px 0 #6F43C9' }
                  : card.state === 'matched'
                    ? { background: '#E7F7EE', boxShadow: 'inset 0 0 0 4px #2FBF6B' }
                    : { background: '#FFFFFF', boxShadow: '0 6px 0 #DDD6C8' }
              }
            >
              {card.state === 'down' ? <span className="text-3xl">❓</span> : card.emoji}
            </button>
          ))}
        </div>

        <Card className="mt-8 !py-3 !px-6">
          <span className="font-display font-bold" style={{ color: '#17543C' }}>{t('game.score')}: {moves}</span>
        </Card>
      </div>

      {won && <GameCelebration onPlayAgain={restart} scoreLabel={String(moves)} />}
    </KidShell>
  );
}

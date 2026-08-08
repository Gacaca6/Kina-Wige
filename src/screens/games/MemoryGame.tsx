import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/context';
import { useSound, useHaptic } from '../../hooks/useSound';
import { useStars } from '../../hooks/useStars';
import { useProgress } from '../../hooks/useProgress';
import { games } from '../../data/games';
import type { Language } from '../../i18n/translations';
import { useSkillEvidence } from '../../hooks/useSkillEvidence';
import { KidShell, Card } from '../../components/ui/Shell';
import GameCelebration from '../../components/game/GameCelebration';

// Every pair is something a Rwandan child sees in their own week — banana,
// goat, cow, chicken are all on §18's required-presence list. The previous set
// included a sunflower, which is nobody's daily object here.
//
// The names are the point. This game declares `wrd.name.object`, and a game
// that never puts a name anywhere cannot claim to teach one.
const PAIRS: { emoji: string; name: Record<Language, string> }[] = [
  { emoji: '🍌', name: { KN: 'Umuneke', EN: 'Banana', FR: 'Banane' } },
  { emoji: '🐐', name: { KN: 'Ihene', EN: 'Goat', FR: 'Chèvre' } },
  { emoji: '🐄', name: { KN: 'Inka', EN: 'Cow', FR: 'Vache' } },
  { emoji: '🐔', name: { KN: 'Inkoko', EN: 'Chicken', FR: 'Poule' } },
];

interface Card {
  key: number;
  emoji: string;
  state: 'down' | 'up' | 'matched';
}

function nameOf(emoji: string, language: Language): string {
  return PAIRS.find((p) => p.emoji === emoji)?.name[language] ?? '';
}

function buildDeck(): Card[] {
  const emojis = [...PAIRS, ...PAIRS].map((p) => p.emoji);
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
  const { recordOffline } = useSkillEvidence();

  const [cards, setCards] = useState<Card[]>(buildDeck);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [won, setWon] = useState(false);
  const [named, setNamed] = useState(false);

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
    setNamed(false);
  };

  /**
   * The Connect step for this game.
   *
   * `wrd.name.object` is PRODUCTIVE — "names 10 household/farm objects". A
   * touchscreen cannot hear a child speak, and we do not record audio (offline,
   * no APIs). So the instrument is the grown-up in the room, exactly as it is
   * for the Kina Challenge and `phy.gross.move` (Architecture §13, off-screen
   * evidence). Without this tap the game teaches vocabulary but evidences
   * nothing, which is what the curriculum check caught it doing.
   */
  const namingPrompt = (
    <div
      className="w-full max-w-xs mt-6 rounded-[22px] p-4 text-left"
      style={{ background: '#E3F2FD', boxShadow: '0 6px 0 #9CC9E8' }}
    >
      <p className="font-body font-black text-[14px]" style={{ color: '#123B57' }}>
        🗣️ {t('memory.nameThem')}
      </p>
      <p className="font-body font-bold text-[15px] mt-1.5" style={{ color: '#1A5C86' }}>
        {PAIRS.map((p) => `${p.emoji} ${p.name[language]}`).join(' · ')}
      </p>
      {named ? (
        <div
          className="w-full rounded-[16px] grid place-items-center font-body font-black text-[15px] mt-3"
          style={{ minHeight: 56, background: '#C9E7FB', color: '#123B57' }}
          role="status"
        >
          ✓ {t('memory.named')}
        </div>
      ) : (
        <button
          onClick={() => {
            recordOffline(['wrd.name.object'], 'memory');
            setNamed(true);
            play('clean_chime');
          }}
          className="w-full rounded-[16px] font-body font-black text-[15px] mt-3"
          style={{ minHeight: 56, background: '#1565C0', color: '#fff' }}
        >
          {t('memory.theySaid')}
        </button>
      )}
    </div>
  );

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
              {card.state === 'down' ? (
                <span className="text-3xl">❓</span>
              ) : (
                <span className="flex flex-col items-center leading-none">
                  <span>{card.emoji}</span>
                  {/* The name appears the moment a pair is found. Exposure is
                      not evidence, but a child cannot learn a word we never
                      show them. */}
                  {card.state === 'matched' && (
                    <span className="font-body font-black text-[10px] mt-1" style={{ color: '#17543C' }}>
                      {nameOf(card.emoji, language)}
                    </span>
                  )}
                </span>
              )}
            </button>
          ))}
        </div>

        <Card className="mt-8 !py-3 !px-6">
          <span className="font-display font-bold" style={{ color: '#17543C' }}>{t('game.score')}: {moves}</span>
        </Card>
      </div>

      {won && <GameCelebration onPlayAgain={restart} scoreLabel={String(moves)} extra={namingPrompt} />}
    </KidShell>
  );
}

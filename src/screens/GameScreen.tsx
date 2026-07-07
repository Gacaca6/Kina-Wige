// Dispatches /game/:id to the right game component.
// Add new games here and in src/data/games.ts.

import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import HandwashGame from './games/HandwashGame';
import MemoryGame from './games/MemoryGame';
import CountingGame from './games/CountingGame';
import PatternGame from './games/PatternGame';
import SortingGame from './games/SortingGame';

const GAME_COMPONENTS: Record<string, React.ComponentType> = {
  // '1' kept for old links/bookmarks that pointed at /game/1
  '1': HandwashGame,
  karaba: HandwashGame,
  memory: MemoryGame,
  counting: CountingGame,
  pattern: PatternGame,
  sorting: SortingGame,
};

export default function GameScreen() {
  const { id } = useParams();
  const Game = id ? GAME_COMPONENTS[id] : undefined;

  if (!Game) {
    return <Navigate to="/games" replace />;
  }

  return <Game />;
}

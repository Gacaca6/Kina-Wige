// Game registry — every game the app offers, with the thinking skill it trains.
// Each id maps to a component in src/screens/games/ (wired up in GameScreen.tsx).

import type { Language } from '../i18n/translations';

export interface GameInfo {
  id: string;
  title: Record<Language, string>;
  skill: Record<Language, string>;
  emoji: string;
  color: string;
}

export const games: GameInfo[] = [
  {
    id: 'karaba',
    title: { KN: 'Karaba Amaboko!', EN: 'Wash Your Hands!', FR: 'Lave-toi les Mains!' },
    skill: { KN: '🫧 Isuku — intambwe zikurikirana', EN: '🫧 Hygiene — following steps', FR: '🫧 Hygiène — suivre les étapes' },
    emoji: '🫧',
    color: 'bg-primary-light',
  },
  {
    id: 'memory',
    title: { KN: 'Shakisha Bimwe', EN: 'Memory Match', FR: 'Jeu de Mémoire' },
    skill: { KN: '🧠 Kwibuka', EN: '🧠 Memory', FR: '🧠 Mémoire' },
    emoji: '🧠',
    color: 'bg-secondary',
  },
  {
    id: 'counting',
    title: { KN: 'Bara!', EN: 'Count!', FR: 'Compte!' },
    skill: { KN: '🔢 Kubara', EN: '🔢 Counting', FR: '🔢 Compter' },
    emoji: '🔢',
    color: 'bg-accent-warm',
  },
  {
    id: 'pattern',
    title: { KN: 'Ikurikira ni Iki?', EN: 'What Comes Next?', FR: 'Que Vient Ensuite?' },
    skill: { KN: '🧩 Gutekereza', EN: '🧩 Logic & patterns', FR: '🧩 Logique' },
    emoji: '🧩',
    color: 'bg-danger',
  },
  {
    id: 'sorting',
    title: { KN: 'Hitamo Ibiryo Byiza', EN: 'Pick Healthy Food', FR: 'Choisis les Bons Aliments' },
    skill: { KN: '🥗 Imirire — gutandukanya', EN: '🥗 Nutrition — sorting', FR: '🥗 Nutrition — trier' },
    emoji: '🥗',
    color: 'bg-primary',
  },
];

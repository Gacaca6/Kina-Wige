// The sticker book — what a child collects by finishing games.
//
// Accumulate-only, like everything that rewards a child in Kina Wige: a sticker
// once earned is never lost, there is no currency, nothing to buy, no streak to
// break (docs/GAMES-DESIGN.md §4.6). Stickers come in a fixed order so a child
// always gets a NEW one until the book is full; after that, finishing a game
// adds a copy to one they have ("×2"), which is still something.
//
// Kinyarwanda names are machine-written — ROADMAP §Human-review queue.
//
// The pictures are Microsoft's Fluent Emoji (3D), MIT licence — see
// public/stickers/LICENSE-fluentui-emoji.txt, which ships with them. Bundled
// in the app as small WebP files, so the book works offline.

import type { Language } from '../i18n/translations';

/** The sticker's picture, served from public/stickers/. */
export const stickerImage = (id: string) => `/stickers/${id}.webp`;

export interface StickerInfo {
  id: string;
  name: Record<Language, string>;
  /** Card colour behind the drawing. */
  tone: string;
}

export const STICKERS: StickerInfo[] = [
  { id: 'cow', name: { KN: 'Inka', EN: 'Cow', FR: 'Vache' }, tone: '#E7F7EE' },
  { id: 'banana', name: { KN: 'Umuneke', EN: 'Banana', FR: 'Banane' }, tone: '#FFF4D6' },
  { id: 'drum', name: { KN: 'Ingoma', EN: 'Drum', FR: 'Tambour' }, tone: '#FDE8DF' },
  { id: 'gorilla', name: { KN: 'Ingagi', EN: 'Gorilla', FR: 'Gorille' }, tone: '#E3F2FD' },
  { id: 'hippo', name: { KN: 'Imvubu', EN: 'Hippo', FR: 'Hippopotame' }, tone: '#F3E9FF' },
  { id: 'giraffe', name: { KN: 'Umusumbashyamba', EN: 'Giraffe', FR: 'Girafe' }, tone: '#E7F7EE' },
  { id: 'goat', name: { KN: 'Ihene', EN: 'Goat', FR: 'Chèvre' }, tone: '#FFF4D6' },
  { id: 'avocado', name: { KN: 'Avoka', EN: 'Avocado', FR: 'Avocat' }, tone: '#FDE8DF' },
  { id: 'elephant', name: { KN: 'Inzovu', EN: 'Elephant', FR: 'Éléphant' }, tone: '#E3F2FD' },
  { id: 'house', name: { KN: 'Inzu', EN: 'House', FR: 'Maison' }, tone: '#F3E9FF' },
  { id: 'chicken', name: { KN: 'Inkoko', EN: 'Chicken', FR: 'Poule' }, tone: '#E7F7EE' },
  { id: 'pineapple', name: { KN: 'Inanasi', EN: 'Pineapple', FR: 'Ananas' }, tone: '#FFF4D6' },
  { id: 'lion', name: { KN: 'Intare', EN: 'Lion', FR: 'Lion' }, tone: '#FDE8DF' },
  { id: 'fish', name: { KN: 'Ifi', EN: 'Fish', FR: 'Poisson' }, tone: '#E3F2FD' },
  { id: 'milk', name: { KN: 'Amata', EN: 'Milk', FR: 'Lait' }, tone: '#F3E9FF' },
  { id: 'zebra', name: { KN: 'Imparage', EN: 'Zebra', FR: 'Zèbre' }, tone: '#E7F7EE' },
  { id: 'mango', name: { KN: 'Umwembe', EN: 'Mango', FR: 'Mangue' }, tone: '#FFF4D6' },
  { id: 'bicycle', name: { KN: 'Igare', EN: 'Bicycle', FR: 'Vélo' }, tone: '#FDE8DF' },
  { id: 'sun', name: { KN: 'Izuba', EN: 'Sun', FR: 'Soleil' }, tone: '#E3F2FD' },
  { id: 'flower', name: { KN: 'Ururabo', EN: 'Flower', FR: 'Fleur' }, tone: '#F3E9FF' },
];

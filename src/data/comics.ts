// Comic registry — the single place to add illustrated tap-through stories.
//
// Comics are the app's lightest content type: a few images + trilingual
// captions (no video). Great offline (kilobytes), license-clean when the art
// is your own, and strong for pre-literacy (pair each panel with tap-to-hear
// narration for children who cannot read yet).
//
// To add a comic:
//   1. Add panel images to src/assets/ and export them in src/assets/images.ts
//      (this first sample reuses existing character art as placeholder panels —
//      swap in real comic illustrations when you have them).
//   2. Add an entry below — it appears on the Books screen and gets its own
//      /comic/<id> route automatically.

import type { Language } from '../i18n/translations';
import { images } from '../assets/images';

export interface ComicPanel {
  image: string;
  text: Record<Language, string>;
}

export interface Comic {
  id: string;
  title: Record<Language, string>;
  category: Record<Language, string>;
  cover: string;
  panels: ComicPanel[];
}

export interface UpcomingComic {
  title: string;
  category: Record<Language, string>;
}

export const comics: Comic[] = [
  {
    id: 'clean-hands',
    title: {
      KN: "Amaboko Meza ya Hirwa",
      EN: "Hirwa's Clean Hands",
      FR: 'Les Mains Propres de Hirwa',
    },
    category: { KN: '🫧 Isuku', EN: '🫧 Hygiene', FR: '🫧 Hygiène' },
    cover: images.hirwaFull,
    panels: [
      {
        image: images.hirwaFull,
        text: {
          KN: 'Hirwa yakinnye hanze umunsi wose. Yishimye cyane!',
          EN: 'Hirwa played outside all day. He was so happy!',
          FR: 'Hirwa a joué dehors toute la journée. Il était très content!',
        },
      },
      {
        image: images.hands,
        text: {
          KN: "Ariko amaboko ye yari afite udupfunyi twinshi tutaboneka n'amaso.",
          EN: 'But his hands were covered in tiny germs you cannot see.',
          FR: 'Mais ses mains étaient couvertes de microbes invisibles.',
        },
      },
      {
        image: images.mama,
        text: {
          KN: 'Mama aramubwira ati: "Karaba amaboko mbere yo kurya!"',
          EN: 'Mama said: "Wash your hands before you eat!"',
          FR: 'Maman dit: «Lave-toi les mains avant de manger!»',
        },
      },
      {
        image: images.hands,
        text: {
          KN: "Hirwa akoresha amazi n'isabune, agosora neza intoki zose.",
          EN: 'Hirwa used water and soap, scrubbing every finger well.',
          FR: "Hirwa a utilisé de l'eau et du savon, frottant bien chaque doigt.",
        },
      },
      {
        image: images.kezaFull,
        text: {
          KN: 'Keza aramushimira ati: "Wakoze neza! Udupfunyi twagiye!"',
          EN: 'Keza cheered: "Well done! The germs are all gone!"',
          FR: "Keza l'a félicité: «Bravo! Les microbes sont partis!»",
        },
      },
      {
        image: images.parentChild,
        text: {
          KN: 'Noneho Hirwa arya afite amaboko meza. Mwiza cyane!',
          EN: 'Now Hirwa eats with clean hands. Wonderful!',
          FR: 'Maintenant Hirwa mange avec des mains propres. Magnifique!',
        },
      },
    ],
  },
];

export const upcomingComics: UpcomingComic[] = [
  { title: 'Amenyo Yera ya Keza', category: { KN: '🪥 Isuku', EN: '🪥 Hygiene', FR: '🪥 Hygiène' } },
  { title: 'Ibiryo Byiza', category: { KN: '🥗 Imirire', EN: '🥗 Nutrition', FR: '🥗 Nutrition' } },
];

export function getComic(id: string | undefined): Comic | undefined {
  return comics.find(c => c.id === id);
}

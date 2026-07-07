// Episode registry — the single place to add, remove, or re-order episodes.
//
// To add a new episode:
//   1. Put the video file(s) in public/videos/ (MP4, H.264, keep them small)
//   2. Add a thumbnail image and import it in src/assets/images.ts
//   3. Add an entry below — it appears on Home and in the episode list,
//      plays offline automatically, and gets its own /episode/<id> route.
//
// Only use videos you have the right to distribute. Good sources of openly
// licensed teaching videos for this age group:
//   - Ubongo Toolkits (Akili and Me, has Kinyarwanda, CC BY-NC-ND): https://toolkits.ubongo.org
//   - Sesame Workshop "Watch, Play, Learn": https://sesameworkshop.org

import type { Language } from '../i18n/translations';
import { images } from '../assets/images';

export interface Episode {
  id: string;
  title: Record<Language, string>;
  category: Record<Language, string>;
  clips: string[];
  thumb: string;
  poster?: string;
  story: Record<Language, string>;
  hasQuiz: boolean;
}

export interface UpcomingEpisode {
  title: string;
  category: Record<Language, string>;
  teaser: Record<Language, string>;
}

export const episodes: Episode[] = [
  {
    id: '1',
    title: {
      KN: 'Karaba Amaboko!',
      EN: 'Wash Your Hands!',
      FR: 'Lave-toi les Mains!',
    },
    category: { KN: '🫧 Isuku', EN: '🫧 Hygiene', FR: '🫧 Hygiène' },
    clips: ['/videos/clip1.mp4'],
    thumb: images.episode1Thumb,
    poster: images.episode1VideoPoster,
    story: {
      KN: "Hirwa yari asohotse mu gikari, ariko yibagiwe gukaraba amaboko mbere yo kurya! Keza na Mama baramufasha kwibuka intambwe zo gukaraba neza hakoreshejwe amazi meza n'isabune.",
      EN: 'Hirwa was playing outside, but he forgot to wash his hands before eating! Keza and Mama help him remember the steps of proper handwashing with clean water and soap.',
      FR: "Hirwa jouait dehors, mais il a oublié de se laver les mains avant de manger! Keza et Maman l'aident à se rappeler les étapes du lavage des mains avec de l'eau propre et du savon.",
    },
    hasQuiz: true,
  },
  {
    id: '2',
    title: {
      KN: 'Gukaraba no Kurya',
      EN: 'Washing and Eating',
      FR: 'Se Laver et Manger',
    },
    category: { KN: '🥗 Imirire & 🫧 Isuku', EN: '🥗 Nutrition & 🫧 Hygiene', FR: '🥗 Nutrition & 🫧 Hygiène' },
    clips: ['/videos/clip2.mp4', '/videos/clip3.mp4'],
    thumb: images.episode2Thumb,
    story: {
      KN: "Keza na Hirwa biga impamvu tugomba gukaraba amaboko mbere yo kurya. Kurya n'amaboko meza bituma tugira ubuzima bwiza!",
      EN: 'Keza and Hirwa learn why we must wash our hands before eating. Eating with clean hands keeps us healthy!',
      FR: 'Keza et Hirwa apprennent pourquoi il faut se laver les mains avant de manger. Manger avec des mains propres nous garde en bonne santé!',
    },
    hasQuiz: true,
  },
];

export const upcomingEpisodes: UpcomingEpisode[] = [
  {
    title: 'Menya Ibiryo Byiza',
    category: { KN: '🥗 Imirire', EN: '🥗 Nutrition', FR: '🥗 Nutrition' },
    teaser: {
      KN: 'Kwiga guhitamo ibiryo byiza',
      EN: 'Learning about healthy food choices',
      FR: 'Apprendre à choisir de bons aliments',
    },
  },
  {
    title: 'Tubyigane!',
    category: { KN: '🤝 Imyitwarire', EN: '🤝 Behaviour', FR: '🤝 Comportement' },
    teaser: {
      KN: 'Gusaranganya no kugira neza',
      EN: 'Sharing, kindness, and taking turns',
      FR: 'Partager, être gentil, chacun son tour',
    },
  },
  {
    title: 'Barira Amenyo!',
    category: { KN: '🪥 Isuku', EN: '🪥 Hygiene', FR: '🪥 Hygiène' },
    teaser: {
      KN: 'Kubarira amenyo buri munsi',
      EN: 'Daily tooth brushing habits',
      FR: 'Se brosser les dents chaque jour',
    },
  },
];

export function getEpisode(id: string | undefined): Episode | undefined {
  return episodes.find(e => e.id === id);
}

// Every clip in the app — used to prefetch videos into the offline cache.
export const ALL_VIDEO_CLIPS = episodes.flatMap(e => e.clips);

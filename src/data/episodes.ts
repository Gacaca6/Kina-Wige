// Episode registry — the single place to add, remove, or re-order episodes.
//
// To add a new episode:
//   1. Put the video file(s) in public/videos/ (MP4, H.264, keep them small —
//      compress with scripts/_compress recipe: 480p, CRF 26, AAC 128k)
//   2. Add a thumbnail image and import it in src/assets/images.ts
//   3. Add an entry below — it appears on Home and in the episode list,
//      gets its own /episode/<id> route, and (if prefetch !== false) is
//      downloaded into the offline cache on first launch.
//
// prefetch: false  → the clips are NOT eagerly downloaded on launch; they are
//   cached lazily the first time a child plays them (SW CacheFirst route).
//   Use this for large/long videos so first launch stays light on mobile data.
// gameId: 'karaba' → shows a "play the related game" button on the episode.
//
// Only use videos you have the right to distribute. See `attribution`.
// Good sources: Ubongo Toolkits (CC BY-NC-ND, Kinyarwanda), Sesame Watch-Play-Learn.

import type { Language } from '../i18n/translations';
import type { ContentMeta } from './curriculum';
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
  prefetch?: boolean;   // default true; set false for large/long videos (lazy cache)
  gameId?: string;      // if set, episode shows a button to the matching game
  attribution?: string; // source/licence note for third-party videos
  /**
   * REQUIRED — what this episode teaches (docs/CURRICULUM-ARCHITECTURE.md §17).
   * An episode with no declared skill cannot be added: it will not compile, and
   * `npm run curriculum:check` will fail the build.
   */
  curriculum: ContentMeta;
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
    gameId: 'karaba',
    curriculum: {
      skills: ['phy.hand.sequence', 'phy.hand.when'],
      level: 'L2',
      theme: 'T6',
      domains: ['D4'],
      minutes: 3,
    },
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
    gameId: 'karaba',
    curriculum: {
      skills: ['phy.hand.when', 'wrd.story.recall'],
      level: 'L2',
      theme: 'T6',
      domains: ['D1', 'D4'],
      minutes: 4,
      // Deliberately NOT phy.hand.why. That skill's evidence is "refers to germs
      // we cannot see"; this episode says "clean hands keep us healthy", which is
      // not the same claim. The germ explanation lives in the 'clean-hands' book.
      note: 'Stops short of the germ explanation — see comic clean-hands for phy.hand.why.',
    },
  },
  {
    id: 'alphabet',
    title: {
      KN: "Indirimbo y'Inyuguti",
      EN: 'Alphabet Songs',
      FR: "Chansons de l'Alphabet",
    },
    category: { KN: '🔤 Kwiga', EN: '🔤 Learning', FR: '🔤 Apprendre' },
    clips: [
      '/videos/indirimbo-yinyuguti-a.mp4',
      '/videos/indirimbo-yinyuguti-b.mp4',
      '/videos/indirimbo-yinyuguti-c.mp4',
      '/videos/indirimbo-yinyuguti-d.mp4',
      '/videos/indirimbo-yinyuguti-e.mp4',
    ],
    thumb: images.alphabetThumb,
    story: {
      KN: "Indirimbo nziza zigufasha kwiga inyuguti! Ririmba hamwe wige inyuguti z'Ikinyarwanda uhereye ku A ukageza ku E.",
      EN: 'Fun songs to help you learn your letters! Sing along and learn the alphabet from A to E.',
      FR: "Des chansons amusantes pour apprendre tes lettres! Chante et apprends l'alphabet de A à E.",
    },
    hasQuiz: false,
    prefetch: false,
    attribution: 'Ubongo Toolkit (ubongo.org) · CC BY-NC-ND 4.0',
    curriculum: {
      skills: ['snd.vowel.recognise', 'snd.vowel.name'],
      level: 'L2',
      theme: 'T8',
      domains: ['D1'],
      minutes: 8,
      // A–E covers the vowels a and e plus three consonants. Our sequence is
      // syllabic, not alphabetic (Architecture §6.3) — this is exposure, not
      // the literacy path. Do not let it become the path.
      note: 'Alphabet framing, not our syllabic sequence. Exposure only. Licence unconfirmed.',
    },
  },
  {
    id: 'twinkle',
    title: {
      KN: 'Inyenyeri Nto',
      EN: 'Twinkle Twinkle Little Star',
      FR: 'Brille Brille Petite Étoile',
    },
    category: { KN: '🎵 Indirimbo', EN: '🎵 Songs', FR: '🎵 Chansons' },
    clips: ['/videos/twinkle-twinkle-little-star.mp4'],
    thumb: images.twinkleThumb,
    story: {
      KN: 'Indirimbo izwi ku isi yose! Ririmba ku nyenyeri nto zaka mu kirere nijoro.',
      EN: 'A song loved all around the world! Sing about the little stars that shine in the night sky.',
      FR: 'Une chanson aimée partout dans le monde! Chante les petites étoiles qui brillent la nuit.',
    },
    hasQuiz: false,
    prefetch: false,
    // `attribution` is PARENT-FACING — it renders in Settings › Thanks. Keep
    // engineering caveats in ROADMAP.md, not here. This credits the melody,
    // which is verifiably public domain, and asserts nothing about the specific
    // video, whose source is still open (ROADMAP F).
    attribution: 'Twinkle Twinkle Little Star — traditional melody, public domain',
    curriculum: {
      skills: ['snd.listen.attend'],
      level: 'L1',
      theme: 'T8',
      domains: ['D1'],
      minutes: 3,
      // The weakest-justified item in the app. It teaches one listening skill
      // and it is culturally imported — an English nursery rhyme, not a Rwandan
      // song, so it cannot claim art.sing.rwanda. Architecture §18 wants a
      // child's own world on screen. Candidate for replacement by a Rwandan
      // song, which would earn art.sing.rwanda honestly.
      note: 'Culturally imported; single skill. Replace with a Rwandan song (Architecture §18).',
    },
  },
  {
    id: 'letter-a',
    title: {
      KN: 'Inyuguti A mu Mudugudu',
      EN: 'Letter A in the Neighbourhood',
      FR: 'La Lettre A dans le Quartier',
    },
    category: { KN: '🔤 Kwiga', EN: '🔤 Learning', FR: '🔤 Apprendre' },
    clips: ['/videos/letter-a-in-the-neighbourhood.mp4'],
    thumb: images.letterAThumb,
    story: {
      KN: "Menya inyuguti A n'amagambo atangira na A! Isomo rirerire ryuzuye kwiga.",
      EN: 'Discover the letter A and words that start with A around the neighbourhood! A longer lesson full of learning.',
      FR: "Découvre la lettre A et les mots qui commencent par A dans le quartier! Une leçon plus longue pleine d'apprentissage.",
    },
    hasQuiz: false,
    prefetch: false,
    attribution: 'Ubongo Toolkit (ubongo.org) · CC BY-NC-ND 4.0',
    curriculum: {
      skills: ['snd.vowel.recognise', 'wrd.name.object'],
      level: 'L1',
      theme: 'T3',
      domains: ['D1'],
      minutes: 11,
      // 11 minutes of a 12-minute session cap (Architecture §16) on one item.
      // This is the single biggest wellbeing risk in the catalogue.
      note: 'Nearly a whole session. Split or shorten before it becomes the default watch.',
    },
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
];

export function getEpisode(id: string | undefined): Episode | undefined {
  return episodes.find(e => e.id === id);
}

// Every clip in the app.
export const ALL_VIDEO_CLIPS = episodes.flatMap(e => e.clips);

// Clips eagerly downloaded into the offline cache on first launch.
// Large/long videos (prefetch: false) are cached lazily on first play instead,
// so first launch stays light on mobile data.
export const PREFETCH_VIDEO_CLIPS = episodes
  .filter(e => e.prefetch !== false)
  .flatMap(e => e.clips);

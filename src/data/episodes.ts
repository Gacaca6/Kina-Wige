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
    id: 'bayi-bayi-ingona',
    title: {
      KN: 'Bayi Bayi Ingona',
      EN: 'Bayi Bayi Ingona',
      FR: 'Bayi Bayi Ingona',
    },
    category: { KN: '🎵 Indirimbo', EN: '🎵 Songs', FR: '🎵 Chansons' },
    clips: ['/videos/bayi-bayi-ingona.mp4'],
    thumb: images.bayiThumb,
    poster: images.bayiPoster,
    story: {
      KN: 'Indirimbo y’umuco nyarwanda abana baririmba kuva kera! Ririmba kuri ingona iri ku nkombe y’umugezi, hamwe n’inyoni n’ibyana byayo.',
      EN: 'A traditional Rwandan children’s song, sung here for generations! Sing along about the crocodile by the riverbank, with the bird and her chicks.',
      FR: 'Une chanson traditionnelle rwandaise, chantée ici depuis des générations! Chante le crocodile au bord de la rivière, avec l’oiseau et ses petits.',
    },
    hasQuiz: false,
    // 11 MB. Lazy-cached on first open like the other long videos.
    prefetch: false,
    // The song is traditional and unowned; the recording and the animation are
    // ours. Both halves stated, because a public-domain melody does not make
    // someone else's performance free — see ROADMAP 7a.
    attribution: 'Traditional Rwandan children’s song · Kina Wige recording and animation, 2026',
    curriculum: {
      skills: ['art.sing.rwanda'],
      level: 'L1',
      theme: 'T9',
      domains: ['D6'],
      minutes: 2,
      // First content in D6 — the domain sat at 0/10 until this shipped.
      //
      // Claims art.sing.rwanda and nothing else, deliberately:
      //  - art.rhythm.make would need a clap-along the child has to KEEP.
      //    Watching is not making a rhythm. Add the claim with the interaction.
      //  - wld.animals.local wants "cow, goat, chicken, dog + 4 more". One
      //    crocodile and one bird is not eight animals. It can be the first
      //    item in a D3 set later, not the whole of it.
      //
      // LYRICS are not in the app yet. They must come from Queen's own
      // transcription, checked by Eric, then through native-speaker review
      // (ROADMAP C) — not from a web transcription and not model-written.
      // Regional variants exist; whichever we settle on gets recorded here.
      note: 'Opens D6. Lyrics still pending native-speaker review (ROADMAP C).',
    },
  },
  {
    id: 'isuku',
    title: {
      KN: "Isuku n'Ubuzima",
      EN: 'Clean and Healthy',
      FR: 'Propre et en Bonne Santé',
    },
    category: { KN: '🫧 Isuku', EN: '🫧 Hygiene', FR: '🫧 Hygiène' },
    clips: ['/videos/isuku.mp4'],
    thumb: images.isukuThumb,
    poster: images.isukuPoster,
    story: {
      KN: "Umukobwa n'inshuti ye Isabune baguha amasomo umunani ku isuku: icyo isuku ari cyo, gukaraba amaboko, udupfunyi tutaboneka n'amaso, koza amenyo, kwisukura umubiri, no kwita ku mudugudu wacu — hanyuma indirimbo yo kubyibuka byose.",
      EN: 'A girl and her friend Soap take you through eight lessons about staying clean: what hygiene means, washing hands, the germs we cannot see, brushing teeth, keeping our bodies clean, caring for our village — and a song to remember it all.',
      FR: "Une fille et son ami Savon t'emmènent à travers huit leçons sur la propreté: ce qu'est l'hygiène, se laver les mains, les microbes invisibles, se brosser les dents, garder son corps propre, prendre soin de son village — et une chanson pour tout retenir.",
    },
    hasQuiz: true,
    // 9.5 MB. Lazy-cached on first open like the other long videos, so a first
    // launch on mobile data stays light (see prefetchVideos.ts).
    prefetch: false,
    gameId: 'karaba',
    // Credit lines stay short and name-like: they sit in a trilingual screen,
    // so prose here would read as untranslated English. Ours, no licence owed.
    attribution: 'Kina Wige original animation · 2026',
    curriculum: {
      skills: ['phy.hand.sequence', 'phy.hand.why', 'phy.teeth'],
      level: 'L3',
      theme: 'T6',
      domains: ['D4'],
      minutes: 2,
      // Replaces the two original hygiene episodes, which between them taught
      // sequence and when-to-wash across 3 short clips. This one adds the germ
      // explanation (previously carried ONLY by one panel of the clean-hands
      // book) and teeth, in one continuous 80-second piece.
      //
      // It also teaches bathing and keeping the village clean — neither of
      // which the taxonomy names. Same finding as the Memory game: content is
      // ahead of the skill list. Candidate skills for review: a `phy.bath.*`
      // under D4, and an environment/community-care skill under D3.
      note: 'Teaches bathing and environmental care too — no skills exist for those yet.',
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
      // Teaches one listening skill, and it is in English, so it cannot claim
      // art.sing.rwanda — Bayi Bayi Ingona now carries that.
      //
      // It was previously marked for replacement on the grounds of being
      // culturally imported. That was wrong, and the owner corrected it:
      // Rwandan nurseries teach this song, so a child meeting it here is
      // meeting something from their own classroom, not an import. Architecture
      // §18 asks for a child's own world — for this song, that includes it.
      // KEEP. Do not propose retiring it again.
      note: 'English, so no art.sing.rwanda — but taught in Rwandan nurseries. Keep.',
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

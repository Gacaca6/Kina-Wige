// Game registry — every game the app offers, with the thinking skill it trains.
// Each id maps to a component in src/screens/games/ (wired up in GameScreen.tsx).

import type { Language } from '../i18n/translations';
import type { ContentMeta } from './curriculum';

export interface GameInfo {
  id: string;
  title: Record<Language, string>;
  /** The child-facing skill label. Prose, for the screen — not the contract. */
  skill: Record<Language, string>;
  emoji: string;
  color: string;
  /**
   * REQUIRED — the actual curriculum skills, machine-checked.
   * "Every game names its skill or it does not ship" (Architecture §10).
   * Map what the game's CODE does, not what its title implies.
   */
  curriculum: ContentMeta;
}

export const games: GameInfo[] = [
  {
    id: 'karaba',
    title: { KN: 'Karaba Amaboko!', EN: 'Wash Your Hands!', FR: 'Lave-toi les Mains!' },
    skill: { KN: '🫧 Isuku — intambwe zikurikirana', EN: '🫧 Hygiene — following steps', FR: '🫧 Hygiène — suivre les étapes' },
    emoji: '🫧',
    color: 'bg-primary-light',
    curriculum: {
      skills: ['phy.hand.sequence'],
      level: 'L1',
      theme: 'T6',
      domains: ['D4'],
      minutes: 3,
      // The game walks water → soap → scrub → rinse → dry, which is exactly the
      // evidence statement for phy.hand.sequence. It does NOT count anything,
      // so it cannot claim num.count5 — see docs/CURRICULUM-SKILLS.md slice table.
      note: 'Sequence only. The slice table also lists num.count5 — the code does not do it.',
    },
  },
  {
    id: 'memory',
    title: { KN: 'Shakisha Bimwe', EN: 'Memory Match', FR: 'Jeu de Mémoire' },
    skill: { KN: '🧠 Kwibuka', EN: '🧠 Memory', FR: '🧠 Mémoire' },
    emoji: '🧠',
    color: 'bg-secondary',
    curriculum: {
      skills: ['wrd.name.object'],
      level: 'L1',
      theme: 'T4',
      domains: ['D1'],
      minutes: 3,
      // Was the weakest mapping in the app — the contract's first real catch.
      // The game trained visual working memory (not in our taxonomy) while
      // claiming wrd.name.object, and never asked the child to name anything.
      //
      // Now: pairs are all §18 required-presence objects (banana, goat, cow,
      // chicken), the name appears the moment a pair is matched, and the win
      // screen asks a grown-up to confirm the child named them. A touchscreen
      // cannot hear a child speak and we record no audio, so the adult is the
      // instrument — the same mechanism as the Kina Challenge (§13).
      note: 'Naming is parent-marked: a screen cannot evidence productive vocabulary on its own.',
    },
  },
  {
    id: 'counting',
    title: { KN: 'Bara!', EN: 'Count!', FR: 'Compte!' },
    skill: { KN: '🔢 Kubara', EN: '🔢 Counting', FR: '🔢 Compter' },
    emoji: '🔢',
    color: 'bg-accent-warm',
    curriculum: {
      skills: ['num.cardinal5', 'num.cardinal10', 'num.numeral10'],
      level: 'L3',
      theme: 'T4',
      domains: ['D2'],
      minutes: 3,
      // The ramp used to run to 10 for every child, so a three-year-old met L3
      // numbers by round 4 with no way to stop. The ceiling now rises only with
      // evidence: no cardinality to 5 yet means the whole game stays inside 5,
      // distractors included. This game also RECORDS evidence — before that,
      // only lessons did, which left ⭐ Applying practically unreachable.
      note: 'Ceiling follows the child (5 / 7 / 10). Records cardinality evidence under source game:counting.',
    },
  },
  {
    id: 'pattern',
    title: { KN: 'Ikurikira ni Iki?', EN: 'What Comes Next?', FR: 'Que Vient Ensuite?' },
    skill: { KN: '🧩 Gutekereza', EN: '🧩 Logic & patterns', FR: '🧩 Logique' },
    emoji: '🧩',
    color: 'bg-danger',
    curriculum: {
      skills: ['num.pattern.ab', 'num.pattern.abc'],
      level: 'L3',
      theme: 'T7',
      domains: ['D2'],
      minutes: 3,
      // Rounds 1–2 are AB, round 3 is AABB, round 4 is ABC, round 5 is ABB.
      note: 'Rounds 3 and 5 are AABB and ABB — neither AB nor ABC. Closest honest claim is both.',
    },
  },
  {
    id: 'sorting',
    title: { KN: 'Hitamo Ibiryo Byiza', EN: 'Pick Healthy Food', FR: 'Choisis les Bons Aliments' },
    skill: { KN: '🥗 Imirire — gutandukanya', EN: '🥗 Nutrition — sorting', FR: '🥗 Nutrition — trier' },
    emoji: '🥗',
    color: 'bg-primary',
    curriculum: {
      skills: ['phy.food.healthy', 'num.sort.one'],
      level: 'L2',
      theme: 'T4',
      domains: ['D2', 'D4'],
      minutes: 3,
      // Eight foods sorted into healthy / sometimes — one attribute, and the
      // exact evidence statement for phy.food.healthy ("sorts 6 foods").
      // The strongest-earned mapping in the games section.
      note: 'Two domains from one activity — the integrated thematic model working as intended.',
    },
  },
];

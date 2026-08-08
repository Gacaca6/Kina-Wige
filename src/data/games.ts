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
      // ⚠️ THE WEAKEST MAPPING IN THE APP — the contract's first real catch.
      // What this game actually trains is visual working memory, which is NOT a
      // skill in our taxonomy. The pairs (banana, avocado, goat, sunflower) are
      // nameable, but the game never asks the child to name them, so the claim
      // is not yet earned. Two honest ways out, both for Phase 3:
      //   (a) speak/label the pair on match — makes wrd.name.object true, or
      //   (b) add an attention/working-memory skill to D5 with evidence, sourced.
      // Do not leave this note in place once one of them is done.
      note: 'UNEARNED: trains working memory (not in taxonomy); add naming on match, or add the skill.',
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
      // Round ranges are [1,3] [2,5] [3,7] [4,9] [5,10] — so the game starts at
      // L1 and finishes at L3 inside a single sitting. It shows a group and asks
      // for the numeral, which is cardinality + numeral matching, our headline
      // probe. But an L1 child meets L3 content by round 4 with no way to stop.
      note: 'Difficulty spans L1→L3 in one sitting. Should respect the child\'s level, not a fixed ramp.',
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

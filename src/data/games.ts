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
      // Rebuilt to the game standard (docs/GAMES-DESIGN.md §4.1). From level 2
      // the child chooses the next step in the scene, and that first choice in
      // each step is recorded. Level 1 highlights the next thing, so it records
      // nothing — guided play is not evidence. The four "moments" (before
      // eating, after the toilet…) are shown, not asked, so no phy.hand.when.
      note: 'Sequence only. Evidence from level 2 up; the Kina Challenge adds parent-marked evidence.',
    },
  },
  {
    id: 'andika',
    title: { KN: 'Andika!', EN: 'Trace & Write', FR: 'Trace et écris' },
    skill: { KN: '✏️ Kwandika inyuguti n’imibare', EN: '✏️ Writing letters and numbers', FR: '✏️ Écrire lettres et chiffres' },
    emoji: '✏️',
    color: 'bg-grape',
    curriculum: {
      skills: ['snd.write.trace', 'phy.fine.control'],
      level: 'L2',
      theme: 'T8',
      domains: ['D1', 'D4'],
      minutes: 4,
      // The code checks stroke order and direction (checkpoints along each
      // stroke, start dot first) — exactly snd.write.trace's evidence. Numbers
      // record phy.fine.control only: tracing a numeral is hand control, not
      // the literacy skill.
      note: 'Correct = at most one slip off the path in the hardest stage done. Letters a e i o u and A E I O U, numbers 1–10.',
    },
  },
  {
    id: 'imiterere',
    title: { KN: "Imiterere n'Amabara", EN: 'Shapes & Colours', FR: 'Formes et couleurs' },
    skill: { KN: '🔺 Imiterere n’amabara', EN: '🔺 Shapes and colours', FR: '🔺 Formes et couleurs' },
    emoji: '🔺',
    color: 'bg-grass',
    curriculum: {
      skills: ['num.sort.one', 'num.sort.two', 'num.shape.name'],
      level: 'L3',
      theme: 'T7',
      domains: ['D2'],
      minutes: 4,
      // Matching a piece to its hole by shape OR colour is sorting by one
      // attribute; levels where both vary record num.sort.two (shape AND
      // colour — the taxonomy's example is colour and size). The board cannot
      // hear a child NAME a shape, so num.shape.name is parent-marked only, via
      // the Kina Challenge on the win screen.
      note: 'num.sort.one / num.sort.two from drops; num.shape.name parent-marked only.',
    },
  },
  {
    id: 'teranya',
    title: { KN: 'Teranya Ishusho', EN: 'Jigsaw Puzzles', FR: 'Puzzles' },
    skill: { KN: '🧩 Guteranya ibice', EN: '🧩 Building a picture', FR: '🧩 Assembler une image' },
    emoji: '🖼️',
    color: 'bg-coral',
    curriculum: {
      skills: ['num.shape.build'],
      level: 'L2',
      theme: 'T9',
      domains: ['D2'],
      minutes: 4,
      // Building a whole picture from shaped parts. One record per finished
      // puzzle: correct when few pieces were tried in the wrong place.
      note: 'Closest honest skill: builds a picture from shapes. 4 / 6 / 9 / 12 pieces by level.',
    },
  },
  {
    id: 'inzira',
    title: { KN: 'Shaka Inzira', EN: 'Find the Way', FR: 'Trouve le chemin' },
    skill: { KN: '🐄 Gukurikira inzira', EN: '🐄 Following a path', FR: '🐄 Suivre un chemin' },
    emoji: '🐄',
    color: 'bg-grass',
    curriculum: {
      skills: ['phy.fine.control'],
      level: 'L2',
      theme: 'T5',
      domains: ['D4'],
      minutes: 3,
      // The road is the guide; the finger has to stay on it. Bananas at level 3
      // are counted on screen but not claimed as a counting skill.
      note: 'Traces within a guide. Correct = at most two pushes into a hedge and at most one hint.',
    },
  },
  {
    id: 'siga',
    title: { KN: 'Siga Amabara', EN: 'Colouring', FR: 'Coloriage' },
    skill: { KN: '🎨 Amabara n’ubuhanzi', EN: '🎨 Colours and creativity', FR: '🎨 Couleurs et créativité' },
    emoji: '🎨',
    color: 'bg-coral',
    curriculum: {
      skills: ['art.colour.name'],
      level: 'L1',
      theme: 'T7',
      domains: ['D6'],
      minutes: 4,
      // Open-ended by design: nothing on screen is right or wrong, so the game
      // itself records no evidence. Each colour's name shows as it is chosen;
      // naming is parent-marked through the Kina Challenge.
      note: 'Exposure on screen; evidence is parent-marked only.',
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

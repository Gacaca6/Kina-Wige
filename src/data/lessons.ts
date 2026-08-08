// Lesson content — every item declares the curriculum skill it teaches.
// See docs/CURRICULUM.md §4 for skill ids and prerequisites.
//
// Unit 1 is the vowels (inyajwi). That is not arbitrary: Kinyarwanda has a
// transparent orthography and a mostly CV syllable structure, so the
// evidence-aligned path is syllabic — vowels first, then CV, then words.
//
// Four activity kinds, each mapped to what it can actually assess:
//   listen-pick  hearing a sound and matching it to a glyph
//   count        cardinality — "how many?" AFTER counting, the key probe
//   match        pairing, categorisation
//   trace        letter formation (a top-5 predictor of later literacy)

// Skill ids come from the curriculum itself — this file used to keep its own
// short list, which meant a lesson could reference a skill the curriculum had
// never heard of. Now every id here is checked against the taxonomy.
import type { ContentMeta, SkillId } from './curriculum';
import type { Language } from '../i18n/translations';

export type { SkillId };

export type ItemKind = 'listen-pick' | 'count' | 'match' | 'trace' | 'sequence';

interface ItemBase {
  id: string;
  skill: SkillId;
  /** Trilingual, like every other content file. No screen may show a word
   *  the language toggle cannot change. */
  prompt: Record<Language, string>;
}

/** Hear a sound, tap the matching glyph. Max 3 choices. */
export interface ListenPickItem extends ItemBase {
  kind: 'listen-pick';
  token: string;
  choices: { id: string; glyph: string; correct?: boolean }[];
}

/**
 * Count objects, then answer "how many?".
 * This is the cardinality probe — a child who recites 1-2-3-4-5 but cannot
 * answer "so how many?" has a song, not number sense (CURRICULUM.md §1).
 * Numerals are the one case where 4 choices are allowed (§6).
 */
export interface CountItem extends ItemBase {
  kind: 'count';
  count: number;
  glyph: string;
  choices: number[];
}

/** Match each glyph to its picture. Three pairs. */
export interface MatchItem extends ItemBase {
  kind: 'match';
  pairs: { id: string; left: Record<Language, string>; right: string }[];
}

/** Trace a letter along a guide. Letter formation, not handwriting quality. */
export interface TraceItem extends ItemBase {
  kind: 'trace';
  glyph: string;
  /** Waypoints in a 0–100 box; the child must pass near each in order. */
  waypoints: { x: number; y: number }[];
}

/**
 * Put steps in the right order.
 *
 * Added for the handwashing slice, because none of the four original activities
 * could honestly evidence an ordering skill. `phy.hand.sequence` reads "orders
 * wet→soap→scrub→rinse→dry, 5 of 5" — matching and picking cannot show that.
 * The contract asked for an activity the app did not have, which is exactly
 * what a curriculum is supposed to do to a product.
 */
export interface SequenceItem extends ItemBase {
  kind: 'sequence';
  /** Listed in the CORRECT order. The activity shuffles them for display. */
  steps: { id: string; glyph: string; label: Record<Language, string> }[];
}

export type LessonItem = ListenPickItem | CountItem | MatchItem | TraceItem | SequenceItem;

export interface Lesson {
  id: string;
  unit: number;
  title: Record<Language, string>;
  items: LessonItem[];
  /**
   * REQUIRED — and for Iga lessons, `offline` and `parent` are required too.
   * Steps 6 (Create) and 7 (Connect) of the lesson loop "are not optional …
   * and they are the two most commonly skipped under deadline pressure"
   * (Architecture §11). The build check enforces that here.
   */
  curriculum: ContentMeta;
}

/** Unit 1 · Amagambo yambere — the five vowels. */
export const LESSON_U1_L1: Lesson = {
  id: 'u1l1',
  unit: 1,
  title: { KN: 'Inyajwi', EN: 'The vowels', FR: 'Les voyelles' },
  curriculum: {
    skills: ['snd.vowel.recognise', 'snd.write.trace', 'wrd.category'],
    level: 'L2',
    theme: 'T8',
    domains: ['D1'],
    minutes: 5,
    offline: {
      // Concrete may be off-screen, and is often the better step (Architecture §12).
      text: {
        KN: 'Shakisha ikintu mu rugo gitangira na «a». Kibwire umuntu mukuru.',
        EN: 'Find something at home that starts with "a". Say its name to a grown-up.',
        FR: 'Trouve une chose à la maison qui commence par «a». Dis son nom à un adulte.',
      },
      skills: ['snd.vowel.recognise'],
    },
    parent: {
      text: {
        KN: 'Saba umwana wawe kuvuga inyajwi eshanu muri kumwe: a, e, i, o, u.',
        EN: 'Ask your child to say the five vowels with you: a, e, i, o, u.',
        FR: 'Demandez à votre enfant de dire les cinq voyelles avec vous: a, e, i, o, u.',
      },
      skills: ['snd.vowel.recognise'],
    },
  },
  items: [
    {
      kind: 'listen-pick',
      id: 'i1',
      skill: 'snd.vowel.recognise',
      prompt: { KN: 'Kanda kuri «a»', EN: 'Tap the a', FR: 'Touche le a' },
      token: 'a',
      choices: [
        { id: 'a', glyph: 'a', correct: true },
        { id: 'i', glyph: 'i' },
        { id: 'o', glyph: 'o' },
      ],
    },
    {
      kind: 'listen-pick',
      id: 'i2',
      skill: 'snd.vowel.recognise',
      prompt: { KN: 'Kanda kuri «e»', EN: 'Tap the e', FR: 'Touche le e' },
      token: 'e',
      choices: [
        { id: 'u', glyph: 'u' },
        { id: 'e', glyph: 'e', correct: true },
        { id: 'a', glyph: 'a' },
      ],
    },
    {
      kind: 'trace',
      id: 'i3',
      skill: 'snd.write.trace',
      prompt: { KN: 'Kurikira «o»', EN: 'Trace the o', FR: 'Trace le o' },
      glyph: 'o',
      waypoints: [
        { x: 50, y: 18 },
        { x: 76, y: 34 },
        { x: 82, y: 62 },
        { x: 60, y: 82 },
        { x: 34, y: 76 },
        { x: 20, y: 50 },
        { x: 32, y: 24 },
        { x: 50, y: 18 },
      ],
    },
    {
      kind: 'match',
      id: 'i4',
      skill: 'wrd.category',
      prompt: { KN: 'Huza inyajwi n’ishusho', EN: 'Match the vowel to its picture', FR: 'Associe la voyelle à son image' },
      pairs: [
        { id: 'a', left: { KN: 'a', EN: 'a', FR: 'a' }, right: '🍎' },
        { id: 'i', left: { KN: 'i', EN: 'i', FR: 'i' }, right: '🐟' },
        { id: 'u', left: { KN: 'u', EN: 'u', FR: 'u' }, right: '🌂' },
      ],
    },
    {
      kind: 'listen-pick',
      id: 'i5',
      skill: 'snd.vowel.recognise',
      prompt: { KN: 'Kanda kuri «u»', EN: 'Tap the u', FR: 'Touche le u' },
      token: 'u',
      choices: [
        { id: 'i', glyph: 'i' },
        { id: 'u', glyph: 'u', correct: true },
        { id: 'e', glyph: 'e' },
      ],
    },
  ],
};

/** Unit 2 · Turabara — counting and cardinality to 5. */
export const LESSON_U2_L1: Lesson = {
  id: 'u2l1',
  unit: 2,
  title: { KN: 'Turabara', EN: 'How many?', FR: 'Combien?' },
  curriculum: {
    skills: ['num.subitise3', 'num.count5', 'num.cardinal5'],
    level: 'L2',
    theme: 'T4',
    domains: ['D2'],
    minutes: 5,
    offline: {
      // Real stones, real touching — this is the Concrete step done properly,
      // and it is the only content that produces evidence for num.oneToOne.
      text: {
        KN: 'Shakisha amabuye atanu hanze. Muyabare muri kumwe. Hanyuma umubaze uti: ni angahe?',
        EN: 'Find five stones outside. Count them together. Then ask: how many?',
        FR: 'Trouve cinq cailloux dehors. Comptez-les ensemble. Puis demande: combien?',
      },
      skills: ['num.oneToOne', 'num.cardinal5'],
    },
    parent: {
      text: {
        KN: 'Nyuma yo kubara, buri gihe umubaze uti «ni angahe?» — icyo kibazo ni cyo gitandukanya indirimbo no kubara nyakuri.',
        EN: 'After your child counts, always ask "so how many?" — that one question is the difference between a song and real counting.',
        FR: "Après que votre enfant compte, demandez toujours «alors, combien?» — cette question distingue une chanson d'un vrai comptage.",
      },
      skills: ['num.cardinal5'],
    },
    note: 'The cardinality probe, our headline metric, reaches the parent here in plain words.',
  },
  items: [
    {
      kind: 'count',
      id: 'c1',
      skill: 'num.subitise3',
      prompt: { KN: 'Ni imyembe ingahe?', EN: 'How many mangoes?', FR: 'Combien de mangues?' },
      count: 3,
      glyph: '🥭',
      choices: [2, 3, 4],
    },
    {
      kind: 'count',
      id: 'c2',
      skill: 'num.cardinal5',
      prompt: { KN: 'Ni inka zingahe?', EN: 'How many cows?', FR: 'Combien de vaches?' },
      count: 5,
      glyph: '🐄',
      choices: [3, 4, 5, 6],
    },
    {
      kind: 'count',
      id: 'c3',
      skill: 'num.cardinal5',
      prompt: { KN: 'Ni amababi angahe?', EN: 'How many leaves?', FR: 'Combien de feuilles?' },
      count: 4,
      glyph: '🍃',
      choices: [2, 4, 5, 6],
    },
    {
      kind: 'match',
      id: 'c4',
      skill: 'num.count5',
      prompt: { KN: 'Huza umubare n’ibintu', EN: 'Match the number to the group', FR: 'Associe le chiffre au groupe' },
      pairs: [
        { id: 'one', left: { KN: '1', EN: '1', FR: '1' }, right: '⭐' },
        { id: 'two', left: { KN: '2', EN: '2', FR: '2' }, right: '⭐⭐' },
        { id: 'three', left: { KN: '3', EN: '3', FR: '3' }, right: '⭐⭐⭐' },
      ],
    },
  ],
};

/**
 * Unit 3 · Karaba amaboko — the handwashing lesson.
 *
 * The Iga half of the vertical slice (Architecture §21). It completes a theme
 * that already had an episode, a game and a book but no structured pathway and,
 * more importantly, no way off the screen.
 *
 * This is also the first lesson to carry its Connect step, so it is the first
 * time the app asks a child to do something in the real world and a parent to
 * say something back.
 */
export const LESSON_U3_L1: Lesson = {
  id: 'u3l1',
  unit: 3,
  title: { KN: 'Karaba amaboko', EN: 'Washing hands', FR: 'Se laver les mains' },
  curriculum: {
    skills: ['phy.hand.sequence', 'phy.hand.when'],
    level: 'L2',
    theme: 'T6',
    domains: ['D4'],
    minutes: 5,
    offline: {
      // The Kina Challenge for a health skill has to happen at a real basin.
      // Nothing on a screen can evidence "washes hands in the right order" —
      // only a grown-up standing next to a child can (Architecture §15.1).
      text: {
        KN: "Uyu munsi, karaba amaboko n'umuntu mukuru mbere yo kurya. Vuga buri ntambwe mu ijwi riranguruye: amazi, isabune, gukanda, koza, kumutsa.",
        EN: 'Wash your hands with a grown-up before you eat today. Say each step out loud: water, soap, scrub, rinse, dry.',
        FR: "Lave-toi les mains avec un adulte avant de manger aujourd'hui. Dis chaque étape à voix haute: eau, savon, frotter, rincer, sécher.",
      },
      skills: ['phy.hand.sequence'],
    },
    parent: {
      // Serve-and-return: the parent's job is to ASK, then wait. "Let them
      // finish" is the whole instruction — the pause is the intervention
      // (Architecture §15.2).
      text: {
        KN: "Saba umwana wawe kukubwira intambwe zo gukaraba amaboko mu magambo ye bwite. Mureke arangize interuro yose mbere yo kumufasha.",
        EN: 'Ask your child to tell you the handwashing steps in their own words. Let them finish the whole sentence before you help.',
        FR: "Demandez à votre enfant de vous raconter les étapes du lavage des mains avec ses propres mots. Laissez-le terminer toute la phrase avant de l'aider.",
      },
      skills: ['wrd.sentence.speak'],
    },
    note: 'The slice lesson. Its Connect step is the only place the app reaches a real basin.',
  },
  items: [
    {
      kind: 'sequence',
      id: 'h1',
      skill: 'phy.hand.sequence',
      prompt: { KN: 'Shyira mu murongo: gukaraba amaboko', EN: 'Put the handwashing steps in order', FR: 'Mets les étapes du lavage des mains dans l\'ordre' },
      steps: [
        { id: 'water', glyph: '💧', label: { KN: 'Amazi', EN: 'Water', FR: 'Eau' } },
        { id: 'soap', glyph: '🧼', label: { KN: 'Isabune', EN: 'Soap', FR: 'Savon' } },
        { id: 'scrub', glyph: '🫧', label: { KN: 'Gukanda', EN: 'Scrub', FR: 'Frotter' } },
        { id: 'rinse', glyph: '🚿', label: { KN: 'Koza', EN: 'Rinse', FR: 'Rincer' } },
        { id: 'dry', glyph: '🤲', label: { KN: 'Kumutsa', EN: 'Dry', FR: 'Sécher' } },
      ],
    },
    {
      kind: 'listen-pick',
      id: 'h2',
      skill: 'phy.hand.when',
      prompt: { KN: 'Ni ryari dukaraba amaboko?', EN: 'When do we wash our hands?', FR: 'Quand se lave-t-on les mains?' },
      token: '🍽️',
      choices: [
        { id: 'eat', glyph: '🍽️', correct: true },
        { id: 'play', glyph: '⚽' },
        { id: 'sleep', glyph: '😴' },
      ],
    },
    {
      kind: 'listen-pick',
      id: 'h3',
      skill: 'phy.hand.when',
      prompt: { KN: 'Na nyuma yo gukoresha ubwiherero?', EN: 'And after using the toilet?', FR: 'Et après les toilettes?' },
      token: '🚽',
      choices: [
        { id: 'book', glyph: '📖' },
        { id: 'toilet', glyph: '🚽', correct: true },
        { id: 'sing', glyph: '🎵' },
      ],
    },
    {
      kind: 'match',
      id: 'h4',
      skill: 'phy.hand.sequence',
      prompt: {
        KN: "Huza intambwe n'ishusho",
        EN: 'Match each step to its picture',
        FR: 'Associe chaque étape à son image',
      },
      pairs: [
        { id: 'water', left: { KN: 'Amazi', EN: 'Water', FR: 'Eau' }, right: '💧' },
        { id: 'soap', left: { KN: 'Isabune', EN: 'Soap', FR: 'Savon' }, right: '🧼' },
        { id: 'dry', left: { KN: 'Kumutsa', EN: 'Dry', FR: 'Sécher' }, right: '🤲' },
      ],
    },
  ],
};

export const LESSONS: Record<string, Lesson> = {
  [LESSON_U1_L1.id]: LESSON_U1_L1,
  [LESSON_U2_L1.id]: LESSON_U2_L1,
  [LESSON_U3_L1.id]: LESSON_U3_L1,
};

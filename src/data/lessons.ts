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

export type { SkillId };

export type ItemKind = 'listen-pick' | 'count' | 'match' | 'trace';

interface ItemBase {
  id: string;
  skill: SkillId;
  promptKn: string;
  promptEn: string;
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
  pairs: { id: string; left: string; right: string }[];
}

/** Trace a letter along a guide. Letter formation, not handwriting quality. */
export interface TraceItem extends ItemBase {
  kind: 'trace';
  glyph: string;
  /** Waypoints in a 0–100 box; the child must pass near each in order. */
  waypoints: { x: number; y: number }[];
}

export type LessonItem = ListenPickItem | CountItem | MatchItem | TraceItem;

export interface Lesson {
  id: string;
  unit: number;
  titleKn: string;
  titleEn: string;
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
  titleKn: 'Inyajwi',
  titleEn: 'The vowels',
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
      promptKn: 'Kanda kuri «a»',
      promptEn: 'Tap the a',
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
      promptKn: 'Kanda kuri «e»',
      promptEn: 'Tap the e',
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
      promptKn: 'Kurikira «o»',
      promptEn: 'Trace the o',
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
      promptKn: 'Huza inyajwi n’ishusho',
      promptEn: 'Match the vowel to its picture',
      pairs: [
        { id: 'a', left: 'a', right: '🍎' },
        { id: 'i', left: 'i', right: '🐟' },
        { id: 'u', left: 'u', right: '🌂' },
      ],
    },
    {
      kind: 'listen-pick',
      id: 'i5',
      skill: 'snd.vowel.recognise',
      promptKn: 'Kanda kuri «u»',
      promptEn: 'Tap the u',
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
  titleKn: 'Turabara',
  titleEn: 'How many?',
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
      promptKn: 'Ni imyembe ingahe?',
      promptEn: 'How many mangoes?',
      count: 3,
      glyph: '🥭',
      choices: [2, 3, 4],
    },
    {
      kind: 'count',
      id: 'c2',
      skill: 'num.cardinal5',
      promptKn: 'Ni inka zingahe?',
      promptEn: 'How many cows?',
      count: 5,
      glyph: '🐄',
      choices: [3, 4, 5, 6],
    },
    {
      kind: 'count',
      id: 'c3',
      skill: 'num.cardinal5',
      promptKn: 'Ni amababi angahe?',
      promptEn: 'How many leaves?',
      count: 4,
      glyph: '🍃',
      choices: [2, 4, 5, 6],
    },
    {
      kind: 'match',
      id: 'c4',
      skill: 'num.count5',
      promptKn: 'Huza umubare n’ibintu',
      promptEn: 'Match the number to the group',
      pairs: [
        { id: 'one', left: '1', right: '⭐' },
        { id: 'two', left: '2', right: '⭐⭐' },
        { id: 'three', left: '3', right: '⭐⭐⭐' },
      ],
    },
  ],
};

export const LESSONS: Record<string, Lesson> = {
  [LESSON_U1_L1.id]: LESSON_U1_L1,
  [LESSON_U2_L1.id]: LESSON_U2_L1,
};

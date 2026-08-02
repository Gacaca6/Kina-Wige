// Lesson content — every item declares the curriculum skill it teaches.
// See docs/CURRICULUM.md §4 for skill ids and prerequisites.
//
// Unit 1 is the vowels (inyajwi). That is not arbitrary: Kinyarwanda has a
// transparent orthography and a mostly CV syllable structure, so the
// evidence-aligned path is syllabic — vowels first, then CV, then words.
// A child who owns a, e, i, o, u can decode a large share of Kinyarwanda
// syllables almost immediately.

export type SkillId =
  | 'snd.vowel.recognise'
  | 'snd.vowel.name'
  | 'snd.syllable.hear'
  | 'num.subitise3'
  | 'num.count5';

/** One question. Max 3 choices (4 only for numerals) — CURRICULUM.md §6. */
export interface LessonItem {
  id: string;
  skill: SkillId;
  /** Spoken prompt — the child hears this; the text is for the adult nearby. */
  say: string;
  promptKn: string;
  promptEn: string;
  /** The thing the child is listening for, shown big on the audio button. */
  token: string;
  choices: { id: string; glyph: string; label: string; correct?: boolean }[];
}

export interface Lesson {
  id: string;
  unit: number;
  titleKn: string;
  titleEn: string;
  skill: SkillId;
  items: LessonItem[];
}

/** Unit 1 · Amagambo yambere — the five vowels. */
export const LESSON_U1_L1: Lesson = {
  id: 'u1l1',
  unit: 1,
  titleKn: 'Inyajwi',
  titleEn: 'The vowels',
  skill: 'snd.vowel.recognise',
  items: [
    {
      id: 'i1',
      skill: 'snd.vowel.recognise',
      say: 'a',
      promptKn: 'Kanda kuri «a»',
      promptEn: 'Tap the a',
      token: 'a',
      choices: [
        { id: 'a', glyph: 'a', label: 'a', correct: true },
        { id: 'i', glyph: 'i', label: 'i' },
        { id: 'o', glyph: 'o', label: 'o' },
      ],
    },
    {
      id: 'i2',
      skill: 'snd.vowel.recognise',
      say: 'e',
      promptKn: 'Kanda kuri «e»',
      promptEn: 'Tap the e',
      token: 'e',
      choices: [
        { id: 'u', glyph: 'u', label: 'u' },
        { id: 'e', glyph: 'e', label: 'e', correct: true },
        { id: 'a', glyph: 'a', label: 'a' },
      ],
    },
    {
      id: 'i3',
      skill: 'snd.vowel.recognise',
      say: 'i',
      promptKn: 'Kanda kuri «i»',
      promptEn: 'Tap the i',
      token: 'i',
      choices: [
        { id: 'o', glyph: 'o', label: 'o' },
        { id: 'a', glyph: 'a', label: 'a' },
        { id: 'i', glyph: 'i', label: 'i', correct: true },
      ],
    },
    {
      id: 'i4',
      skill: 'snd.vowel.recognise',
      say: 'o',
      promptKn: 'Kanda kuri «o»',
      promptEn: 'Tap the o',
      token: 'o',
      choices: [
        { id: 'o', glyph: 'o', label: 'o', correct: true },
        { id: 'e', glyph: 'e', label: 'e' },
        { id: 'u', glyph: 'u', label: 'u' },
      ],
    },
    {
      id: 'i5',
      skill: 'snd.vowel.recognise',
      say: 'u',
      promptKn: 'Kanda kuri «u»',
      promptEn: 'Tap the u',
      token: 'u',
      choices: [
        { id: 'i', glyph: 'i', label: 'i' },
        { id: 'u', glyph: 'u', label: 'u', correct: true },
        { id: 'e', glyph: 'e', label: 'e' },
      ],
    },
  ],
};

export const LESSONS: Record<string, Lesson> = {
  [LESSON_U1_L1.id]: LESSON_U1_L1,
};

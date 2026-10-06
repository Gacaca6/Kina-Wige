// Numbers written out in words, for the parent gate.
//
// The gate asks a grown-up to type a number they can only know by READING it.
// A child of three to six cannot read "mirongo ine na karindwi", but every one
// of them who uses this app is learning to add small numbers — which is why the
// old "3 + 9 = ?" gate was the one question our own users were being trained
// to answer.
//
// The range is deliberately narrow: tens 20–60, units 1–7. That keeps every
// language regular — no Kinyarwanda vowel elision before umunani/icyenda, no
// French soixante-dix — so there is less to get wrong in three languages.
// Thirty-five possible numbers, typed on a two-digit keypad: a child guessing
// gets about one in a hundred per try, and three misses lock the pad.
//
// Kinyarwanda forms are in ROADMAP.md §Human-review queue.

import type { Language } from './translations';

const KN_TENS: Record<number, string> = {
  2: 'makumyabiri',
  3: 'mirongo itatu',
  4: 'mirongo ine',
  5: 'mirongo itanu',
  6: 'mirongo itandatu',
};
const KN_UNITS: Record<number, string> = {
  1: 'rimwe',
  2: 'kabiri',
  3: 'gatatu',
  4: 'kane',
  5: 'gatanu',
  6: 'gatandatu',
  7: 'karindwi',
};

const EN_TENS: Record<number, string> = { 2: 'twenty', 3: 'thirty', 4: 'forty', 5: 'fifty', 6: 'sixty' };
const EN_UNITS: Record<number, string> = { 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven' };

const FR_TENS: Record<number, string> = { 2: 'vingt', 3: 'trente', 4: 'quarante', 5: 'cinquante', 6: 'soixante' };
const FR_UNITS: Record<number, string> = { 1: 'un', 2: 'deux', 3: 'trois', 4: 'quatre', 5: 'cinq', 6: 'six', 7: 'sept' };

/** A random gate number: tens 2–6, units 1–7. */
export function randomGateNumber(): number {
  const tens = 2 + Math.floor(Math.random() * 5);
  const units = 1 + Math.floor(Math.random() * 7);
  return tens * 10 + units;
}

/** Only valid for numbers produced by randomGateNumber(). */
export function numberInWords(n: number, language: Language): string {
  const tens = Math.floor(n / 10);
  const units = n % 10;
  switch (language) {
    case 'KN':
      return `${KN_TENS[tens]} na ${KN_UNITS[units]}`;
    case 'EN':
      return `${EN_TENS[tens]}-${EN_UNITS[units]}`;
    case 'FR':
      return units === 1 ? `${FR_TENS[tens]} et un` : `${FR_TENS[tens]}-${FR_UNITS[units]}`;
  }
}

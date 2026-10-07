// Line art for Siga Amabara (colouring). Each picture is a list of fillable
// regions (drawn in order — later regions sit on top) plus detail lines that
// are never filled. Box: 360 × 360. Regions start white; the child decides
// everything else. Open-ended on purpose (GAMES-DESIGN §4.6).

import type { Language } from '../../../i18n/translations';

export interface Region {
  id: string;
  d: string;
}

export interface ColouringPicture {
  id: string;
  name: Record<Language, string>;
  regions: Region[];
  /** Eyes, smiles, patterns: drawn on top, not fillable. */
  details: string;
  /** Solid ink details (pupils, nostrils). */
  dots?: string;
}

export const COLOUR_BOX = 360;

const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0 Z`;
const ellipse = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx - rx} ${cy} a${rx} ${ry} 0 1 0 ${rx * 2} 0 a${rx} ${ry} 0 1 0 ${-rx * 2} 0 Z`;
const rrect = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r} ${y} h${w - 2 * r} a${r} ${r} 0 0 1 ${r} ${r} v${h - 2 * r} a${r} ${r} 0 0 1 ${-r} ${r} h${-(w - 2 * r)} a${r} ${r} 0 0 1 ${-r} ${-r} v${-(h - 2 * r)} a${r} ${r} 0 0 1 ${r} ${-r} Z`;

export const PICTURES: ColouringPicture[] = [
  {
    id: 'cow',
    name: { KN: 'Inka', EN: 'Cow', FR: 'Vache' },
    regions: [
      { id: 'sky', d: 'M0 0 H360 V230 H0 Z' },
      { id: 'sun', d: circle(58, 58, 32) },
      { id: 'hill', d: 'M0 250 Q90 170 200 220 Q290 180 360 230 V360 H0 Z' },
      { id: 'tail', d: 'M58 196 q-26 22 -20 70 l10 0 q-4 -40 18 -60 z' },
      { id: 'tuft', d: circle(44, 276, 14) },
      { id: 'legBL', d: rrect(80, 236, 28, 80, 10) },
      { id: 'legBR', d: rrect(122, 240, 28, 76, 10) },
      { id: 'legFL', d: rrect(196, 240, 28, 76, 10) },
      { id: 'legFR', d: rrect(236, 236, 28, 80, 10) },
      { id: 'body', d: rrect(60, 168, 220, 100, 48) },
      { id: 'patch', d: 'M110 190 q30 -16 52 4 q12 26 -14 38 q-34 10 -44 -14 q-4 -18 6 -28 z' },
      { id: 'hornL', d: 'M258 112 C238 84 222 58 236 32 l12 4 C240 60 254 82 272 104 z' },
      { id: 'hornR', d: 'M306 112 C326 84 342 58 328 32 l-12 4 C324 60 310 82 292 104 z' },
      { id: 'earL', d: ellipse(240, 128, 20, 10) },
      { id: 'earR', d: ellipse(324, 128, 20, 10) },
      { id: 'head', d: ellipse(282, 142, 40, 46) },
      { id: 'muzzle', d: ellipse(282, 174, 32, 22) },
    ],
    details: 'M84 310 h24 M126 310 h24 M200 310 h24 M240 310 h24 M262 188 q20 14 40 0',
    dots: `${circle(268, 134, 6)} ${circle(296, 134, 6)} ${circle(272, 174, 4)} ${circle(292, 174, 4)}`,
  },
  {
    id: 'house',
    name: { KN: 'Inzu', EN: 'House', FR: 'Maison' },
    regions: [
      { id: 'sky', d: 'M0 0 H360 V260 H0 Z' },
      { id: 'cloud', d: 'M40 70 a22 22 0 0 1 20 -30 a26 26 0 0 1 46 -4 a20 20 0 0 1 32 24 z' },
      { id: 'sun', d: circle(300, 58, 30) },
      { id: 'ground', d: 'M0 260 H360 V360 H0 Z' },
      { id: 'tree', d: 'M300 150 q-40 -10 -50 30 q-10 40 30 46 q40 6 52 -26 q10 -40 -32 -50 z' },
      { id: 'trunk', d: rrect(290, 220, 18, 60, 6) },
      { id: 'walls', d: rrect(60, 160, 190, 120, 8) },
      { id: 'roof', d: 'M40 166 L155 80 L270 166 Z' },
      { id: 'door', d: rrect(132, 206, 46, 74, 8) },
      { id: 'winL', d: rrect(78, 190, 40, 40, 6) },
      { id: 'winR', d: rrect(192, 190, 40, 40, 6) },
      { id: 'path', d: 'M132 280 h46 l40 80 h-126 z' },
    ],
    details: 'M98 190 v40 M78 210 h40 M212 190 v40 M192 210 h40 M70 150 h170',
    dots: circle(168, 246, 4),
  },
  {
    id: 'fish',
    name: { KN: 'Ifi', EN: 'Fish', FR: 'Poisson' },
    regions: [
      { id: 'water', d: 'M0 0 H360 V360 H0 Z' },
      { id: 'sand', d: 'M0 300 Q90 280 180 300 T360 300 V360 H0 Z' },
      { id: 'weedL', d: 'M40 310 q-20 -50 6 -100 q14 50 -6 100 z' },
      { id: 'weedR', d: 'M320 310 q20 -60 -8 -120 q-12 60 8 120 z' },
      { id: 'tail', d: 'M100 170 L40 110 Q56 170 40 230 Z' },
      { id: 'finTop', d: 'M150 110 Q190 50 240 104 Z' },
      { id: 'finBottom', d: 'M160 226 Q196 270 226 230 Z' },
      { id: 'body', d: ellipse(190, 170, 100, 66) },
      { id: 'gill', d: 'M236 120 q-24 50 0 100 q30 -10 30 -50 q0 -40 -30 -50 z' },
      { id: 'bubble1', d: circle(306, 70, 16) },
      { id: 'bubble2', d: circle(330, 30, 10) },
      { id: 'bubble3', d: circle(288, 30, 8) },
    ],
    details: 'M150 140 q10 30 0 60 M180 132 q12 38 0 76 M210 136 q10 34 0 68 M266 190 q-10 8 -20 4',
    dots: circle(254, 156, 8),
  },
  {
    id: 'butterfly',
    name: { KN: 'Ikinyugunyugu', EN: 'Butterfly', FR: 'Papillon' },
    regions: [
      { id: 'sky', d: 'M0 0 H360 V360 H0 Z' },
      { id: 'grass', d: 'M0 300 Q180 270 360 300 V360 H0 Z' },
      { id: 'stem', d: 'M66 300 q-6 -60 4 -110 l8 0 q-10 50 -4 110 z' },
      { id: 'leaf', d: 'M72 260 q30 -30 50 -8 q-24 22 -50 8 z' },
      { id: 'petals', d: [0, 60, 120, 180, 240, 300].map((a) => circle(74 + 21 * Math.cos((a * Math.PI) / 180), 146 + 21 * Math.sin((a * Math.PI) / 180), 16)).join(' ') },
      { id: 'centre', d: circle(74, 146, 14) },
      { id: 'wingTL', d: 'M190 160 C150 60 70 70 96 140 C110 176 160 180 190 170 Z' },
      { id: 'wingTR', d: 'M210 160 C250 60 330 70 304 140 C290 176 240 180 210 170 Z' },
      { id: 'wingBL', d: 'M190 178 C140 180 110 250 150 262 C176 270 196 220 196 186 Z' },
      { id: 'wingBR', d: 'M210 178 C260 180 290 250 250 262 C224 270 204 220 204 186 Z' },
      { id: 'spotL', d: circle(140, 130, 14) },
      { id: 'spotR', d: circle(260, 130, 14) },
      { id: 'body', d: rrect(188, 120, 24, 130, 12) },
      { id: 'head', d: circle(200, 112, 18) },
    ],
    details: 'M192 96 q-14 -30 -30 -34 M208 96 q14 -30 30 -34 M194 118 q6 6 12 0',
    dots: `${circle(193, 108, 3.5)} ${circle(207, 108, 3.5)} ${circle(162, 62, 5)} ${circle(238, 62, 5)}`,
  },
  {
    id: 'kina',
    name: { KN: 'Kina', EN: 'Kina', FR: 'Kina' },
    regions: [
      { id: 'bg', d: 'M0 0 H360 V360 H0 Z' },
      { id: 'pencilBody', d: rrect(96, 40, 168, 44, 12) },
      { id: 'pencilTip', d: 'M264 40 L310 62 L264 84 Z' },
      { id: 'coverL', d: 'M126 100 h54 v220 h-54 a40 40 0 0 1 -40 -40 v-140 a40 40 0 0 1 40 -40 z' },
      { id: 'spine', d: 'M164 100 h32 v220 h-32 z' },
      { id: 'coverR', d: 'M196 100 h40 a40 40 0 0 1 40 40 v140 a40 40 0 0 1 -40 40 h-40 z' },
      { id: 'eyeL', d: circle(130, 190, 30) },
      { id: 'eyeR', d: circle(236, 190, 30) },
      { id: 'mouth', d: 'M134 250 q48 52 96 0 q-48 18 -96 0 z' },
    ],
    details: '',
    dots: `${circle(134, 194, 11)} ${circle(240, 194, 11)}`,
  },
  {
    id: 'basket',
    name: { KN: "Agaseke n'ingoma", EN: 'Basket and drum', FR: 'Panier et tambour' },
    regions: [
      { id: 'bg', d: 'M0 0 H360 V360 H0 Z' },
      { id: 'floor', d: 'M0 290 H360 V360 H0 Z' },
      { id: 'lid', d: 'M60 170 L120 40 L180 170 Z' },
      { id: 'lidBand', d: 'M76 136 L164 136 L172 154 L68 154 Z' },
      { id: 'base', d: 'M54 170 h132 q0 120 -66 120 q-66 0 -66 -120 z' },
      { id: 'baseBand', d: 'M60 200 h120 q-2 20 -6 30 h-108 q-4 -10 -6 -30 z' },
      { id: 'knob', d: circle(120, 38, 10) },
      { id: 'drum', d: 'M210 150 L224 300 h100 L338 150 Z' },
      { id: 'drumBand', d: 'M214 196 h120 l-2 22 h-116 z' },
      { id: 'drumTop', d: ellipse(274, 150, 64, 20) },
    ],
    details: 'M90 110 l10 -10 l10 10 l10 -10 l10 10 l10 -10 l10 10 M70 250 l12 -12 l12 12 l12 -12 l12 12 l12 -12 l12 12 l12 -12 l12 12 M220 160 l14 20 l14 -20 l14 20 l14 -20 l14 20 l14 -20 l14 20 l14 -20 M230 236 l12 50 M318 236 l-12 50',
  },
];

export interface PaintColour {
  id: string;
  hex: string;
  name: Record<Language, string>;
}

// Kinyarwanda colour names are machine-written — ROADMAP §Human-review queue.
export const PAINTS: PaintColour[] = [
  { id: 'red', hex: '#F2453D', name: { KN: 'Umutuku', EN: 'Red', FR: 'Rouge' } },
  { id: 'orange', hex: '#FF8A2A', name: { KN: 'Icunga', EN: 'Orange', FR: 'Orange' } },
  { id: 'yellow', hex: '#FFD43B', name: { KN: 'Umuhondo', EN: 'Yellow', FR: 'Jaune' } },
  { id: 'green', hex: '#2FBF6B', name: { KN: 'Icyatsi kibisi', EN: 'Green', FR: 'Vert' } },
  { id: 'sky', hex: '#7CCBF2', name: { KN: 'Ubururu bwerurutse', EN: 'Light blue', FR: 'Bleu clair' } },
  { id: 'blue', hex: '#2E6FD0', name: { KN: 'Ubururu', EN: 'Blue', FR: 'Bleu' } },
  { id: 'purple', hex: '#9B6BFF', name: { KN: 'Isine', EN: 'Purple', FR: 'Violet' } },
  { id: 'pink', hex: '#FF8FB8', name: { KN: 'Iroza', EN: 'Pink', FR: 'Rose' } },
  { id: 'brown', hex: '#9A5B34', name: { KN: 'Ikigina', EN: 'Brown', FR: 'Marron' } },
  { id: 'black', hex: '#2B2B2B', name: { KN: 'Umukara', EN: 'Black', FR: 'Noir' } },
  { id: 'white', hex: '#FFFFFF', name: { KN: 'Umweru', EN: 'White', FR: 'Blanc' } },
];

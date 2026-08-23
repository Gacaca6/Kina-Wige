// The curriculum, in the type system.
//
// A curriculum in a document can be ignored. A curriculum in the type system
// cannot. This file is the machine-readable form of docs/CURRICULUM-SKILLS.md,
// and it is the reason `npm run build` can refuse to ship content that does not
// say what it teaches (Architecture §17).
//
// ─────────────────────────────────────────────────────────────────────────────
// RULES FOR EDITING THIS FILE
//
//   1. Skill ids are PERMANENT. Content references them forever. To retire a
//      skill set `deprecated: true` — never rename, never delete.
//   2. A skill must be OBSERVABLE. If you cannot see it, it is not a skill.
//   3. A skill must carry an `evidence` string before any content is authored.
//   4. A skill belongs to exactly ONE domain. Content may span many; skills
//      may not.
//   5. `needs` are hard prerequisites. Nothing unlocks before they are met.
//
// Sources of truth: docs/CURRICULUM-ARCHITECTURE.md (why) and
// docs/CURRICULUM-SKILLS.md (what). This file is the executable copy.
// ─────────────────────────────────────────────────────────────────────────────

import type { Language } from '../i18n/translations';

// ─── Domains ────────────────────────────────────────────────────────────────
// Rwanda's six pre-primary learning areas. Permanent (Architecture §5).

export type DomainId = 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6';

export interface Domain {
  id: DomainId;
  /** Internal/English name, used by docs and the build checks. */
  name: string;
  /** Machine-written Kinyarwanda — in the ROADMAP review queue. */
  nameKn: string;
  /** What a PARENT sees. Trilingual, because the report is a real screen. */
  label: Record<Language, string>;
  /** Share of content commissioning, not of screen time. */
  weight: number;
}

export const DOMAINS: readonly Domain[] = [
  { id: 'D1', name: 'Language & Literacy', nameKn: "Ururimi n'ubumenyi bwo gusoma", label: { KN: "Ururimi n'ubumenyi bwo gusoma", EN: 'Language & Literacy', FR: 'Langue et lecture' }, weight: 0.25 },
  { id: 'D2', name: 'Numeracy', nameKn: 'Imibare', label: { KN: "Imibare", EN: 'Numeracy', FR: 'Les nombres' }, weight: 0.2 },
  { id: 'D3', name: 'Discovery of the World', nameKn: 'Gushakashaka isi', label: { KN: "Gushakashaka isi", EN: 'Discovery of the World', FR: 'Découverte du monde' }, weight: 0.15 },
  { id: 'D4', name: 'Physical & Health', nameKn: "Ubuzima n'umubiri", label: { KN: "Ubuzima n'umubiri", EN: 'Physical & Health', FR: 'Corps et santé' }, weight: 0.15 },
  { id: 'D5', name: 'Social & Emotional', nameKn: "Imyifatire n'amarangamutima", label: { KN: "Imyifatire n'amarangamutima", EN: 'Social & Emotional', FR: 'Social et émotionnel' }, weight: 0.15 },
  { id: 'D6', name: 'Creative Arts & Culture', nameKn: "Ubuhanzi n'umuco", label: { KN: "Ubuhanzi n'umuco", EN: 'Creative Arts & Culture', FR: 'Arts et culture' }, weight: 0.1 },
];

// ─── Levels ─────────────────────────────────────────────────────────────────
// Levels are NOT gates. A child may sit at L3 in numeracy and L1 in writing —
// the app tracks per-skill, never per-child-overall (Architecture §7).

export type LevelId = 'L1' | 'L2' | 'L3';

export const LEVELS: readonly { id: LevelId; age: string; name: string; nameKn: string }[] = [
  { id: 'L1', age: '3–4', name: 'Discover', nameKn: 'Menya' },
  { id: 'L2', age: '4–5', name: 'Explore', nameKn: 'Shakashaka' },
  { id: 'L3', age: '5–6', name: 'Create & Apply', nameKn: 'Rema' },
];

/** Ordinal for comparing levels. A prerequisite may never outrank its skill. */
export const LEVEL_ORDER: Readonly<Record<LevelId, number>> = { L1: 1, L2: 2, L3: 3 };

// ─── Assessment bands ───────────────────────────────────────────────────────
// Never a percentage. Never a grade. Never a comparison between children
// (Architecture §13).

export type BandId = 'emerging' | 'developing' | 'demonstrated' | 'applying';

export const BANDS: readonly { id: BandId; icon: string; name: string; nameKn: string; meaning: string }[] = [
  { id: 'emerging', icon: '🌱', name: 'Emerging', nameKn: 'Aratangira', meaning: 'Beginning to show the skill' },
  { id: 'developing', icon: '🌿', name: 'Developing', nameKn: 'Aragenda', meaning: 'Can do it with support' },
  { id: 'demonstrated', icon: '🌳', name: 'Demonstrated', nameKn: 'Arabishoboye', meaning: 'Can do it independently' },
  { id: 'applying', icon: '⭐', name: 'Applying', nameKn: 'Arabikoresha', meaning: 'Uses it in a new situation' },
];

/** Mastery = 4 of 5 correct across two DIFFERENT sessions (Architecture §14). */
export const MASTERY = { correctOf: 4, outOf: 5, distinctSessions: 2 } as const;

/** Spaced repetition schedule, in days (Architecture §14). */
export const REVIEW_DAYS: readonly number[] = [1, 3, 7];

// ─── Themes ─────────────────────────────────────────────────────────────────
// Themes are learning worlds, not lesson lists (Architecture §9).

export type ThemeId = 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6' | 'T7' | 'T8' | 'T9' | 'T10';

export const THEMES: readonly { id: ThemeId; name: string; nameKn: string; domains: readonly DomainId[] }[] = [
  { id: 'T1', name: 'Me', nameKn: 'Njye', domains: ['D5', 'D4', 'D1'] },
  { id: 'T2', name: 'My Home', nameKn: 'Urugo rwanjye', domains: ['D5', 'D3', 'D1'] },
  { id: 'T3', name: 'My Community', nameKn: 'Umudugudu', domains: ['D3', 'D5', 'D6'] },
  { id: 'T4', name: 'Food & Farming', nameKn: "Ibiryo n'ubuhinzi", domains: ['D4', 'D2', 'D3'] },
  { id: 'T5', name: 'Nature', nameKn: 'Ibidukikije', domains: ['D3', 'D2', 'D6'] },
  { id: 'T6', name: 'My Body & Health', nameKn: "Umubiri n'ubuzima", domains: ['D4', 'D5'] },
  { id: 'T7', name: 'Colours & Shapes', nameKn: "Amabara n'ibishushanyo", domains: ['D2', 'D6'] },
  { id: 'T8', name: 'Stories & Imagination', nameKn: "Inkuru n'ubwenge", domains: ['D1', 'D6'] },
  { id: 'T9', name: 'Rwanda', nameKn: 'U Rwanda', domains: ['D6', 'D3', 'D1'] },
  { id: 'T10', name: 'My World', nameKn: 'Isi yanjye', domains: ['D3', 'D6', 'D5'] },
];

// ─── CPA ────────────────────────────────────────────────────────────────────
// Concrete → Pictorial → Abstract. Never open at Abstract (Architecture §12).

export type CpaStage = 'C' | 'P' | 'A' | 'C→P' | 'P→A' | 'C→P→A';

// ─── The skill table ────────────────────────────────────────────────────────
//
// This array is the single source of truth. `SkillId` is DERIVED from it below,
// so the id union can never drift from the data — adding a row here makes the
// id valid everywhere, and removing one turns every reference into a type error.

const SKILL_TABLE = [
  // ═══ D1 · Language & Literacy — 25% ═══════════════════════════════════════
  // Listen → Understand → Speak → Play with language → Recognise → Read → Write.

  // ── strand: listening & sound awareness ──
  {
    id: 'snd.listen.everyday', domain: 'D1', level: 'L1',
    statement: 'Distinguishes common sounds',
    evidence: 'Picks the animal/object that made a played sound',
    needs: [],
  },
  {
    id: 'snd.listen.attend', domain: 'D1', level: 'L1',
    statement: 'Listens to a short story to the end',
    evidence: 'Completes a 60–90s story without leaving',
    needs: [],
  },
  {
    id: 'snd.rhyme.hear', domain: 'D1', level: 'L1',
    statement: 'Hears that two words end alike',
    evidence: 'Picks the word that rhymes, 4 of 5',
    needs: ['snd.listen.everyday'],
  },
  {
    id: 'snd.vowel.recognise', domain: 'D1', level: 'L1',
    statement: 'Recognises the five inyajwi by sound',
    evidence: 'Taps the vowel heard, 4 of 5',
    needs: ['snd.listen.everyday'],
  },
  {
    id: 'snd.vowel.name', domain: 'D1', level: 'L2',
    statement: 'Names each vowel letter on sight',
    evidence: 'Says the vowel shown, 5 of 5',
    needs: ['snd.vowel.recognise'],
  },
  {
    id: 'snd.syllable.hear', domain: 'D1', level: 'L2',
    statement: 'Claps syllables in a word',
    evidence: 'Claps ma-ma, i-nka correctly, 4 of 5',
    needs: ['snd.vowel.recognise'],
  },
  {
    id: 'snd.syllable.count', domain: 'D1', level: 'L2',
    statement: 'Says how many syllables a word has',
    evidence: 'Answers "how many claps?"',
    needs: ['snd.syllable.hear'],
  },
  {
    id: 'snd.cv.blend', domain: 'D1', level: 'L2',
    statement: 'Blends consonant + vowel',
    evidence: 'Hears m…a and says ma',
    needs: ['snd.vowel.name'],
  },
  // NOTE: snd.cv.read onward is BLOCKED on the Kinyarwanda literacy specialist
  // review (Architecture §23-C). Digraphs (cy, jy, ny, sh, shy) and prenasalised
  // consonants (mb, nd, ng) are NOT simple CV. Do not author content for these
  // three skills until the consonant introduction order is signed off.
  {
    id: 'snd.cv.read', domain: 'D1', level: 'L3',
    statement: 'Reads a CV syllable on sight',
    evidence: 'Reads 8 CV syllables unprompted',
    needs: ['snd.cv.blend'],
  },
  {
    id: 'snd.word.read', domain: 'D1', level: 'L3',
    statement: 'Reads a familiar 2-syllable word',
    evidence: 'Reads mama, ameza without picture cue',
    needs: ['snd.cv.read'],
  },
  {
    id: 'snd.sentence.read', domain: 'D1', level: 'L3',
    statement: 'Reads a 3-word sentence',
    evidence: 'Reads "Mama arasoma."',
    needs: ['snd.word.read'],
  },

  // ── strand: writing ──
  {
    id: 'snd.write.grip', domain: 'D1', level: 'L1',
    statement: 'Holds a crayon with control',
    evidence: 'Draws a deliberate closed shape',
    needs: [],
  },
  {
    id: 'snd.write.trace', domain: 'D1', level: 'L2',
    statement: 'Traces a letter with correct stroke order',
    evidence: 'Follows the guide without lifting off-path',
    needs: ['snd.vowel.name', 'snd.write.grip'],
  },
  {
    id: 'snd.write.name', domain: 'D1', level: 'L3',
    statement: 'Writes their own name',
    evidence: 'Writes it recognisably, unaided',
    needs: ['snd.write.trace'],
  },

  // ── strand: words & meaning ──
  {
    id: 'wrd.name.object', domain: 'D1', level: 'L1',
    statement: 'Names common objects',
    evidence: 'Names 10 household/farm objects',
    needs: [],
  },
  {
    id: 'wrd.name.body', domain: 'D1', level: 'L1',
    statement: 'Names body parts',
    evidence: 'Points to and names 8 parts',
    needs: [],
  },
  {
    id: 'wrd.category', domain: 'D1', level: 'L2',
    statement: 'Groups words by category',
    evidence: 'Sorts food / animals / clothes',
    needs: ['wrd.name.object'],
  },
  {
    id: 'wrd.action', domain: 'D1', level: 'L2',
    statement: 'Uses action words',
    evidence: 'Describes what a character is doing',
    needs: ['wrd.name.object'],
  },
  {
    id: 'wrd.describe', domain: 'D1', level: 'L2',
    statement: 'Describes by size and colour',
    evidence: 'Says "the big red ball"',
    needs: ['wrd.name.object'],
  },
  {
    id: 'wrd.sentence.speak', domain: 'D1', level: 'L2',
    statement: 'Speaks in full sentences',
    evidence: 'Answers a question in 4+ words',
    needs: ['wrd.action'],
  },
  {
    id: 'wrd.story.recall', domain: 'D1', level: 'L2',
    statement: 'Retells what happened',
    evidence: 'Names 3 events in order',
    needs: ['snd.listen.attend'],
  },
  {
    id: 'wrd.story.predict', domain: 'D1', level: 'L3',
    statement: 'Predicts what happens next',
    evidence: 'Gives a plausible next event BEFORE it is shown',
    needs: ['wrd.story.recall'],
  },
  {
    id: 'wrd.story.why', domain: 'D1', level: 'L3',
    statement: 'Explains why a character acted',
    evidence: 'Gives a causal reason, not a restatement',
    needs: ['wrd.story.predict'],
  },

  // ═══ D2 · Numeracy — 20% ══════════════════════════════════════════════════
  // Concrete → Pictorial → Abstract throughout. The goal is never "can the
  // child recite 1–20?" It is "does the child know what a number means?"
  {
    id: 'num.subitise3', domain: 'D2', level: 'L1', cpa: 'C',
    statement: 'Sees 1–3 instantly, without counting',
    evidence: 'Answers within ~2s, no pointing',
    needs: [],
  },
  {
    id: 'num.count5', domain: 'D2', level: 'L1', cpa: 'C',
    statement: 'Counts to 5 in order',
    evidence: 'Recites 1–5 unaided',
    needs: [],
  },
  {
    id: 'num.oneToOne', domain: 'D2', level: 'L1', cpa: 'C',
    statement: 'Touches each object once while counting',
    evidence: 'No double-count or skip, 4 of 5',
    needs: ['num.count5'],
  },
  // THE headline metric of this company. A child who recites "1-2-3-4-5" but
  // cannot answer "so how many?" has learned a song, not number sense. This is
  // assessed separately from counting, always (Architecture §12).
  {
    id: 'num.cardinal5', domain: 'D2', level: 'L2', cpa: 'C→P',
    statement: 'Answers "how many?" after counting to 5',
    evidence: 'Gives the last number as the total, unprompted',
    needs: ['num.oneToOne'],
  },
  {
    id: 'num.numeral5', domain: 'D2', level: 'L2', cpa: 'P→A',
    statement: 'Matches numeral 1–5 to a quantity',
    evidence: 'Picks the numeral for a shown group',
    needs: ['num.cardinal5'],
  },
  {
    id: 'num.compare', domain: 'D2', level: 'L2', cpa: 'P',
    statement: 'Judges more / fewer / same',
    evidence: 'Picks the larger group, 4 of 5',
    needs: ['num.cardinal5'],
  },
  {
    id: 'num.count10', domain: 'D2', level: 'L2', cpa: 'C',
    statement: 'Counts to 10 with one-to-one',
    evidence: 'Counts 10 objects accurately',
    needs: ['num.cardinal5'],
  },
  {
    id: 'num.cardinal10', domain: 'D2', level: 'L3', cpa: 'C→P',
    statement: 'Answers "how many?" to 10',
    evidence: 'Gives the last number as the total, to 10',
    needs: ['num.count10'],
  },
  {
    id: 'num.numeral10', domain: 'D2', level: 'L3', cpa: 'A',
    statement: 'Matches numeral 1–10 to a quantity',
    evidence: 'Picks the numeral for a shown group, to 10',
    needs: ['num.cardinal10'],
  },
  {
    id: 'num.addSmall', domain: 'D2', level: 'L3', cpa: 'C→P→A',
    statement: 'Joins two small groups',
    evidence: 'Solves 2+1, 2+2 with objects then pictures',
    needs: ['num.cardinal10'],
  },
  {
    id: 'num.takeAway', domain: 'D2', level: 'L3', cpa: 'C→P',
    statement: 'Removes from a group',
    evidence: 'Solves 3−1 with objects',
    needs: ['num.addSmall'],
  },
  {
    id: 'num.shape.name', domain: 'D2', level: 'L1', cpa: 'C',
    statement: 'Names circle, square, triangle',
    evidence: 'Names all three',
    needs: [],
  },
  {
    id: 'num.shape.build', domain: 'D2', level: 'L2', cpa: 'C',
    statement: 'Builds a picture from shapes',
    evidence: 'Makes a house from shapes',
    needs: ['num.shape.name'],
  },
  {
    id: 'num.sort.one', domain: 'D2', level: 'L2', cpa: 'C',
    statement: 'Sorts by one attribute',
    evidence: 'Sorts by colour OR size',
    needs: [],
  },
  {
    id: 'num.sort.two', domain: 'D2', level: 'L3', cpa: 'C',
    statement: 'Sorts by two attributes',
    evidence: 'Sorts by colour AND size',
    needs: ['num.sort.one'],
  },
  {
    id: 'num.pattern.ab', domain: 'D2', level: 'L2', cpa: 'C→P',
    statement: 'Copies and extends an AB pattern',
    evidence: 'Continues red-blue-red-blue',
    needs: ['num.sort.one'],
  },
  {
    id: 'num.pattern.abc', domain: 'D2', level: 'L3', cpa: 'P',
    statement: 'Extends an ABC pattern',
    evidence: 'Continues red-blue-yellow-red-blue-yellow',
    needs: ['num.pattern.ab'],
  },
  {
    id: 'num.measure.words', domain: 'D2', level: 'L3', cpa: 'C',
    statement: 'Uses measurement words',
    evidence: 'Uses long/short, heavy/light correctly',
    needs: ['num.compare'],
  },

  // ═══ D3 · Discovery of the World — 15% ════════════════════════════════════
  // Question → Predict → Explore → Discover → Explain.
  {
    id: 'wld.animals.local', domain: 'D3', level: 'L1',
    statement: 'Names animals of Rwanda',
    evidence: 'Names cow, goat, chicken, dog + 4 more',
    needs: [],
  },
  {
    id: 'wld.animals.needs', domain: 'D3', level: 'L2',
    statement: 'Says what animals need to live',
    evidence: 'Names food, water, shelter',
    needs: ['wld.animals.local'],
  },
  {
    id: 'wld.plants.grow', domain: 'D3', level: 'L2',
    statement: 'Says what plants need',
    evidence: 'Names water, sun, soil',
    needs: [],
  },
  {
    id: 'wld.plants.lifecycle', domain: 'D3', level: 'L3',
    statement: 'Describes seed → plant',
    evidence: 'Orders 4 stages correctly',
    needs: ['wld.plants.grow'],
  },
  {
    id: 'wld.weather.name', domain: 'D3', level: 'L1',
    statement: 'Names weather',
    evidence: 'Names rain, sun, cloud, wind',
    needs: [],
  },
  {
    id: 'wld.weather.effect', domain: 'D3', level: 'L2',
    statement: 'Says what weather changes',
    evidence: 'Completes "When it rains we…"',
    needs: ['wld.weather.name'],
  },
  {
    id: 'wld.water.source', domain: 'D3', level: 'L2',
    statement: 'Says where water comes from',
    evidence: 'Names rain, tap, well, river',
    needs: [],
  },
  {
    id: 'wld.predict', domain: 'D3', level: 'L2',
    statement: 'Predicts before being told',
    evidence: 'States what will happen first',
    needs: [],
  },
  {
    id: 'wld.explain', domain: 'D3', level: 'L3',
    statement: 'Explains a simple cause',
    evidence: 'Says "it grew because we watered it"',
    needs: ['wld.predict'],
  },
  {
    id: 'wld.investigate', domain: 'D3', level: 'L3',
    statement: 'Asks a question and tests it',
    evidence: 'Poses a question and reports what happened',
    needs: ['wld.explain'],
  },
  {
    id: 'wld.rwanda.features', domain: 'D3', level: 'L3',
    statement: 'Names features of Rwanda',
    evidence: 'Names hills, Kigali, a lake, a local crop',
    needs: ['wld.animals.local'],
  },

  // ═══ D4 · Physical & Health — 15% ═════════════════════════════════════════
  // Where we produce a measurable public-health outcome.
  {
    id: 'phy.hand.sequence', domain: 'D4', level: 'L1',
    statement: 'Washes hands in the right order',
    evidence: 'Orders wet→soap→scrub→rinse→dry, 5 of 5',
    needs: [],
  },
  {
    id: 'phy.hand.when', domain: 'D4', level: 'L2',
    statement: 'Says when to wash hands',
    evidence: 'Names before eating, after toilet',
    needs: ['phy.hand.sequence'],
  },
  {
    id: 'phy.hand.why', domain: 'D4', level: 'L3',
    statement: 'Explains why we wash hands',
    evidence: 'Refers to germs we cannot see',
    needs: ['phy.hand.when'],
  },
  {
    id: 'phy.teeth', domain: 'D4', level: 'L2',
    statement: 'Brushes teeth correctly',
    evidence: 'Demonstrates the routine',
    needs: [],
  },
  {
    id: 'phy.food.healthy', domain: 'D4', level: 'L1',
    statement: 'Names healthy foods',
    evidence: 'Sorts 6 foods into healthy / sometimes',
    needs: [],
  },
  {
    id: 'phy.food.plate', domain: 'D4', level: 'L3',
    statement: 'Chooses a balanced plate',
    evidence: 'Builds a plate with 3 food groups',
    needs: ['phy.food.healthy'],
  },
  {
    id: 'phy.water.drink', domain: 'D4', level: 'L1',
    statement: 'Knows to drink clean water',
    evidence: 'Picks the safe water source',
    needs: [],
  },
  {
    id: 'phy.gross.move', domain: 'D4', level: 'L1',
    statement: 'Runs, jumps, balances',
    evidence: 'Demonstrated off-screen, parent-marked',
    needs: [],
  },
  {
    id: 'phy.fine.control', domain: 'D4', level: 'L2',
    statement: 'Controls hand for cutting/tracing',
    evidence: 'Traces within a guide',
    needs: ['snd.write.grip'],
  },
  {
    id: 'phy.safe.road', domain: 'D4', level: 'L2',
    statement: 'Crosses a road safely with an adult',
    evidence: 'Describes stop-look-listen',
    needs: [],
  },
  {
    id: 'phy.safe.danger', domain: 'D4', level: 'L2',
    statement: 'Identifies dangerous things',
    evidence: 'Picks fire, sharp, deep water',
    needs: [],
  },
  {
    id: 'phy.safe.trusted', domain: 'D4', level: 'L2',
    statement: 'Knows who to tell',
    evidence: 'Names a trusted adult',
    needs: [],
  },

  // ═══ D5 · Social & Emotional — 15% ════════════════════════════════════════
  // School readiness is as much regulation as knowledge.
  {
    id: 'self.feel.name', domain: 'D5', level: 'L1',
    statement: 'Names happy, sad, angry, afraid',
    evidence: 'Picks the face for a situation',
    needs: [],
  },
  {
    id: 'self.feel.own', domain: 'D5', level: 'L2',
    statement: 'Says how they feel',
    evidence: 'Answers "how do you feel today?"',
    needs: ['self.feel.name'],
  },
  {
    id: 'self.feel.other', domain: 'D5', level: 'L2',
    statement: 'Says how someone else feels',
    evidence: "Reads a character's feeling from a story",
    needs: ['self.feel.name'],
  },
  {
    id: 'self.calm', domain: 'D5', level: 'L2',
    statement: 'Uses a calming routine',
    evidence: 'Completes a breathing routine when prompted',
    needs: ['self.feel.own'],
  },
  {
    id: 'self.regulate', domain: 'D5', level: 'L3',
    statement: 'Manages frustration in a task',
    evidence: 'Retries after difficulty without distress',
    needs: ['self.calm'],
  },
  {
    id: 'self.confidence', domain: 'D5', level: 'L2',
    statement: 'Tries something new',
    evidence: 'Attempts an unfamiliar activity unprompted',
    needs: [],
  },
  {
    id: 'soc.turns', domain: 'D5', level: 'L1',
    statement: 'Takes turns',
    evidence: 'Waits for a turn in a paired activity',
    needs: [],
  },
  {
    id: 'soc.share', domain: 'D5', level: 'L2',
    statement: 'Shares materials',
    evidence: 'Gives a share without being told',
    needs: ['soc.turns'],
  },
  {
    id: 'soc.help', domain: 'D5', level: 'L2',
    statement: 'Asks for and offers help',
    evidence: 'Asks an adult; offers to a peer',
    needs: [],
  },
  {
    id: 'soc.kind.words', domain: 'D5', level: 'L2',
    statement: 'Uses kind words',
    evidence: 'Says please, thank you, sorry appropriately',
    needs: [],
  },
  {
    id: 'soc.resolve', domain: 'D5', level: 'L3',
    statement: 'Resolves a disagreement with words',
    evidence: 'Proposes a fair solution',
    needs: ['soc.share', 'self.feel.other'],
  },
  {
    id: 'soc.collaborate', domain: 'D5', level: 'L3',
    statement: 'Works with a partner toward a goal',
    evidence: 'Completes a shared task',
    needs: ['soc.resolve'],
  },

  // ═══ D6 · Creative Arts & Culture — 10% ═══════════════════════════════════
  // Where Kina Wige becomes unmistakably Rwandan. KNOWN GAP: this domain has
  // the least content (Architecture §10). First commissioning priority after
  // the vertical slice.
  {
    id: 'art.colour.name', domain: 'D6', level: 'L1',
    statement: 'Names primary colours',
    evidence: 'Names red, blue, yellow, green',
    needs: [],
  },
  {
    id: 'art.draw.person', domain: 'D6', level: 'L1',
    statement: 'Draws a person',
    evidence: 'Draws head + body + limbs',
    needs: ['snd.write.grip'],
  },
  {
    id: 'art.draw.own', domain: 'D6', level: 'L2',
    statement: 'Draws from their own life',
    evidence: 'Draws their family or home',
    needs: ['art.draw.person'],
  },
  {
    id: 'art.sing.rwanda', domain: 'D6', level: 'L1',
    statement: 'Sings a Rwandan song',
    evidence: 'Joins a known song',
    needs: [],
  },
  {
    id: 'art.rhythm.make', domain: 'D6', level: 'L2',
    statement: 'Makes a rhythm',
    evidence: 'Claps or drums a repeated pattern',
    needs: ['num.pattern.ab'],
  },
  {
    id: 'art.story.tell', domain: 'D6', level: 'L2',
    statement: 'Tells an original short story',
    evidence: 'Tells 3 connected events of their own',
    needs: ['wrd.story.recall'],
  },
  {
    id: 'art.build.shapes', domain: 'D6', level: 'L2',
    statement: 'Builds an image from shapes',
    evidence: 'Composes a scene',
    needs: ['num.shape.build'],
  },
  {
    id: 'art.culture.know', domain: 'D6', level: 'L3',
    statement: 'Describes a Rwandan tradition',
    evidence: 'Describes Umuganda, a food, or a celebration',
    needs: ['wld.rwanda.features'],
  },
  {
    id: 'art.project.plan', domain: 'D6', level: 'L3',
    statement: 'Plans and completes a creative project',
    evidence: 'Says what they will make, then makes it',
    needs: ['art.draw.own'],
  },
  {
    id: 'art.perform', domain: 'D6', level: 'L3',
    statement: 'Performs for others',
    evidence: 'Shares a song, story or drawing with an adult',
    needs: ['art.story.tell'],
  },
] as const;

/**
 * Every skill id in the app. DERIVED from SKILL_TABLE — never written by hand,
 * so it cannot drift from the data.
 */
export type SkillId = (typeof SKILL_TABLE)[number]['id'];

/**
 * Compile-time proof that every `needs` entry is a real skill id.
 *
 * If you write a prerequisite that does not exist, or misspell one, this line
 * is where TypeScript stops you — before the build check, before review, before
 * a child ever sees it.
 */
const _prerequisitesResolve: readonly SkillId[] = SKILL_TABLE.flatMap((s) => s.needs);
void _prerequisitesResolve;

export interface Skill {
  id: SkillId;
  domain: DomainId;
  level: LevelId;
  statement: string;
  evidence: string;
  needs: readonly SkillId[];
  cpa?: CpaStage;
  /** Retired. Kept forever so old content still resolves. Never delete a row. */
  deprecated?: boolean;
}

export const SKILLS: Readonly<Record<SkillId, Skill>> = Object.fromEntries(
  SKILL_TABLE.map((s) => [s.id, s as unknown as Skill]),
) as Record<SkillId, Skill>;

export const SKILL_IDS: readonly SkillId[] = SKILL_TABLE.map((s) => s.id);

// ─── Parent wording ─────────────────────────────────────────────────────────
//
// A `statement` is written for us: precise, observable, assessable. It is the
// wrong voice entirely for the person who actually raised this child.
//
//   statement:  "Answers 'how many?' after counting a group of up to 5 objects"
//   parent:     "counts five things and says how many"
//
// Same fact, no jargon, and it completes the sentence "This week Keza …".
// Architecture §13.3: descriptive, never numeric, never a grade.
//
// Only skills that CONTENT CAN REACH need an entry — a parent can never be
// shown a skill their child has no way to attempt. `npm run curriculum:check`
// enforces exactly that boundary, so this list grows with the catalogue and
// cannot silently fall behind it.
//
// All Kinyarwanda here is machine-written and is in the ROADMAP review queue.
// It is parent-facing, so it carries more weight than most strings in the app.
export const PARENT_WORDING: Partial<Record<SkillId, Record<Language, string>>> = {
  // D1 · Language & Literacy
  'snd.listen.attend': {
    KN: 'yumva inkuru yose', EN: 'listens to a whole story', FR: 'écoute une histoire en entier',
  },
  'snd.vowel.recognise': {
    KN: 'yumva inyajwi eshanu', EN: 'hears the five vowels', FR: 'entend les cinq voyelles',
  },
  'snd.vowel.name': {
    KN: 'avuga inyajwi iyo ayibonye', EN: 'names a vowel when they see it', FR: 'nomme une voyelle quand il la voit',
  },
  'snd.write.trace': {
    KN: 'akurikira inyuguti mu buryo bwiza', EN: 'traces a letter the right way', FR: 'trace une lettre correctement',
  },
  'wrd.name.object': {
    KN: "avuga amazina y'ibintu bya buri munsi", EN: 'names everyday things', FR: 'nomme les objets de tous les jours',
  },
  'wrd.category': {
    KN: 'ashyira hamwe ibintu bihuje', EN: 'groups things that belong together', FR: 'regroupe les choses qui vont ensemble',
  },
  'wrd.sentence.speak': {
    KN: 'agusubiza mu nteruro yuzuye', EN: 'answers you in a full sentence', FR: 'répond par une phrase complète',
  },
  'wrd.story.recall': {
    KN: 'akubwira ibyabaye mu nkuru', EN: 'tells you what happened in a story', FR: "raconte ce qui s'est passé dans une histoire",
  },

  // D2 · Numeracy
  'num.subitise3': {
    KN: 'abona rimwe, kabiri cyangwa gatatu atabaze', EN: 'sees one, two or three without counting', FR: 'voit un, deux ou trois sans compter',
  },
  'num.count5': {
    KN: 'abara kugeza kuri gatanu ku murongo', EN: 'counts to five in order', FR: "compte jusqu'à cinq dans l'ordre",
  },
  'num.oneToOne': {
    KN: 'akora ku kintu kimwe rimwe igihe abara', EN: 'touches each thing once while counting', FR: 'touche chaque chose une fois en comptant',
  },
  'num.cardinal5': {
    KN: 'abara ibintu bitanu akakubwira uko bingana', EN: 'counts five things and says how many', FR: 'compte cinq choses et dit combien',
  },
  'num.cardinal10': {
    KN: 'abara ibintu icumi akakubwira uko bingana', EN: 'counts ten things and says how many', FR: 'compte dix choses et dit combien',
  },
  'num.numeral10': {
    KN: "ahuza umubare n'itsinda kugeza ku icumi", EN: 'matches a number to a group, up to ten', FR: 'associe un chiffre à un groupe, jusqu’à dix',
  },
  'num.sort.one': {
    KN: 'atandukanya ibintu hakurikijwe ibara cyangwa ingano', EN: 'sorts things by colour or size', FR: 'trie les choses par couleur ou par taille',
  },
  'num.pattern.ab': {
    KN: 'akomeza uburyo bworoshye', EN: 'carries on a simple pattern', FR: 'continue un motif simple',
  },
  'num.pattern.abc': {
    KN: "akomeza uburyo bw'ibice bitatu", EN: 'carries on a three-part pattern', FR: 'continue un motif à trois parties',
  },

  // D4 · Physical & Health
  'phy.hand.sequence': {
    KN: 'akaraba amaboko ku murongo uwo ari wo', EN: 'washes hands in the right order', FR: 'se lave les mains dans le bon ordre',
  },
  'phy.hand.when': {
    KN: 'azi igihe cyo gukaraba amaboko', EN: 'knows when to wash hands', FR: 'sait quand se laver les mains',
  },
  'phy.hand.why': {
    KN: 'asobanura impamvu dukaraba amaboko', EN: 'explains why we wash hands', FR: 'explique pourquoi on se lave les mains',
  },
  'phy.teeth': {
    KN: 'yoza amenyo ye neza', EN: 'brushes their teeth properly', FR: 'se brosse bien les dents',
  },
  'phy.food.healthy': {
    KN: 'ahitamo ibiryo byiza', EN: 'picks out healthy food', FR: 'choisit les aliments sains',
  },

  // D5 · Social & Emotional
  'self.confidence': {
    KN: 'agerageza ikintu gishya ku bwe', EN: 'tries something new on their own', FR: 'essaie quelque chose de nouveau tout seul',
  },

  // D6 · Creative Arts & Culture
  'art.sing.rwanda': {
    KN: 'aririmba indirimbo y’Ikinyarwanda', EN: 'sings along to a Rwandan song', FR: 'chante une chanson rwandaise',
  },
};

// ─── The content contract ───────────────────────────────────────────────────
//
// Architecture §17: "If we cannot say what a piece of content teaches, it does
// not enter Kina Wige." That rule is enforced here and by scripts/check-curriculum.mjs.

/**
 * A non-empty list of skills. The tuple form is deliberate: `skills: []` is a
 * TYPE ERROR, not a lint warning. This is the whole point of the contract.
 */
export type SkillRefs = readonly [SkillId, ...SkillId[]];

/** Something to do in the real world, with a grown-up (Architecture §15.1). */
export interface KinaChallenge {
  text: Record<Language, string>;
  /** Skills the challenge produces evidence for. Parent-marked, off-screen. */
  skills: SkillRefs;
}

/** One two-minute serve-and-return prompt for the parent (Architecture §15.2). */
export interface ParentActivity {
  text: Record<Language, string>;
  skills: SkillRefs;
}

export interface ContentMeta {
  /** REQUIRED, non-empty. What this content teaches. */
  skills: SkillRefs;
  level: LevelId;
  theme: ThemeId;
  /** Derived from `skills`; asserted here so a mismatch is caught in review. */
  domains: readonly DomainId[];
  /** Counts against the 12-minute session cap (Architecture §16). */
  minutes: number;
  /** Required for Iga lessons. */
  offline?: KinaChallenge;
  /** Required for Iga lessons. */
  parent?: ParentActivity;
  /**
   * Why this mapping is honest, when it is not self-evident. Read during
   * content review — this is where overclaiming gets caught.
   */
  note?: string;
}

/** Session cap. Kina goes to sleep after this (Architecture §16). */
export const SESSION_CAP_MINUTES = 12;

// ─── Helpers ────────────────────────────────────────────────────────────────

export function getSkill(id: SkillId): Skill {
  return SKILLS[id];
}

/** The domains a set of skills actually touches, in D1–D6 order. */
export function domainsOf(skills: readonly SkillId[]): DomainId[] {
  const seen = new Set<DomainId>();
  for (const id of skills) {
    const skill = SKILLS[id];
    if (skill) seen.add(skill.domain);
  }
  return DOMAINS.map((d) => d.id).filter((d) => seen.has(d));
}

/** The highest level among a set of skills — a content item's true difficulty. */
export function maxLevelOf(skills: readonly SkillId[]): LevelId {
  let best: LevelId = 'L1';
  for (const id of skills) {
    const skill = SKILLS[id];
    if (skill && LEVEL_ORDER[skill.level] > LEVEL_ORDER[best]) best = skill.level;
  }
  return best;
}

/** Every prerequisite of a skill, transitively. Order is not significant. */
export function prerequisitesOf(id: SkillId): SkillId[] {
  const out = new Set<SkillId>();
  const walk = (current: SkillId) => {
    for (const need of SKILLS[current]?.needs ?? []) {
      if (!out.has(need)) {
        out.add(need);
        walk(need);
      }
    }
  };
  walk(id);
  return [...out];
}

/**
 * Is this skill available to a child yet?
 * Nothing unlocks before its prerequisites reach 🌳 Demonstrated.
 */
export function isUnlocked(id: SkillId, demonstrated: ReadonlySet<SkillId>): boolean {
  return (SKILLS[id]?.needs ?? []).every((need) => demonstrated.has(need));
}

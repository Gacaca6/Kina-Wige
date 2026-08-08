// Assessment evidence — on-device, and it never leaves the device.
//
// Architecture §13.2 is the constraint that shapes this whole file: we have no
// analytics BY DESIGN. So there is no event pipeline, no id, no upload, and no
// "sync when online". Evidence is written to localStorage, the parent is the
// only audience for it, and if the child clears their browser it is simply gone.
// That is an acceptable trade for a promise we actually keep.
//
// What we record is deliberately small: for each skill, a list of attempts, each
// carrying whether it was correct, WHICH SESSION it happened in, and WHICH
// CONTENT it came from. Those last two are not incidental — they are what make
// the four bands mean anything:
//
//   🌱 Emerging      the skill has been attempted
//   🌿 Developing    getting it right some of the time
//   🌳 Demonstrated  4 of 5 correct across TWO DIFFERENT SESSIONS (§14)
//   ⭐ Applying      demonstrated, AND correct in content it did not learn it in
//
// The two-session rule is the reason `session` is stored: "a single lucky tap is
// not evidence" (§13.2). The `source` field is the reason ⭐ Applying can exist
// offline at all — "uses it in a new situation" is observable if you know which
// situations a child has met.
//
// Never a percentage, never a grade, never a comparison between children (§13.1).

import { useCallback, useState } from 'react';
import type { BandId, SkillId } from '../data/curriculum';
import { MASTERY } from '../data/curriculum';

const KEY = 'kina-wige-evidence';
const SESSION_KEY = 'kina-wige-session';

/** Keep storage bounded — only the recent window is ever consulted. */
const MAX_ATTEMPTS_PER_SKILL = 20;

export interface Attempt {
  correct: boolean;
  /** Which sitting this happened in. Mastery requires two distinct ones. */
  session: string;
  /** Content id, e.g. "lesson:u3l1". Distinguishes ⭐ Applying from 🌳. */
  source: string;
  at: number;
}

export type EvidenceStore = Partial<Record<SkillId, Attempt[]>>;

/**
 * One id per sitting. Held in sessionStorage, so closing the app and coming
 * back later genuinely counts as a second session — which is the point.
 */
function currentSession(): string {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id = `s${Date.now().toString(36)}`;
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return 's0';
  }
}

function read(): EvidenceStore {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? (parsed as EvidenceStore) : {};
  } catch {
    return {};
  }
}

function write(store: EvidenceStore) {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    // localStorage unavailable — assessment degrades, the lesson does not.
  }
}

/**
 * The band a skill currently sits in, or null if it has never been attempted.
 *
 * Read this as a ladder: each rung adds a requirement rather than replacing one.
 */
export function bandFor(attempts: readonly Attempt[] | undefined): BandId | null {
  if (!attempts?.length) return null;

  const recent = attempts.slice(-MASTERY.outOf);
  const correct = recent.filter((a) => a.correct);
  const sessions = new Set(correct.map((a) => a.session));

  const demonstrated =
    correct.length >= MASTERY.correctOf && sessions.size >= MASTERY.distinctSessions;

  if (demonstrated) {
    // ⭐ Applying: right in more than one place. A child who can only do it in
    // the lesson that taught it has not yet transferred it.
    const sources = new Set(attempts.filter((a) => a.correct).map((a) => a.source));
    return sources.size >= 2 ? 'applying' : 'demonstrated';
  }

  // 🌿 Developing: can do it with support — visible as intermittent success.
  return correct.length > 0 ? 'developing' : 'emerging';
}

export function useSkillEvidence() {
  const [store, setStore] = useState<EvidenceStore>(read);

  /** Record one attempt. Called by the lesson shell as each item is answered. */
  const record = useCallback((skill: SkillId, correct: boolean, source: string) => {
    setStore((prev) => {
      const attempts = [
        ...(prev[skill] ?? []),
        { correct, session: currentSession(), source, at: Date.now() },
      ].slice(-MAX_ATTEMPTS_PER_SKILL);
      const next = { ...prev, [skill]: attempts };
      write(next);
      return next;
    });
  }, []);

  /**
   * Mark an off-screen Kina Challenge as done. The parent is the instrument
   * here — `phy.gross.move` and a real basin cannot be observed by a browser,
   * so a grown-up's single tap IS the measurement (§13, open items).
   */
  const recordOffline = useCallback((skills: readonly SkillId[], source: string) => {
    setStore((prev) => {
      const next = { ...prev };
      for (const skill of skills) {
        next[skill] = [
          ...(next[skill] ?? []),
          { correct: true, session: currentSession(), source: `offline:${source}`, at: Date.now() },
        ].slice(-MAX_ATTEMPTS_PER_SKILL);
      }
      write(next);
      return next;
    });
  }, []);

  const band = useCallback((skill: SkillId) => bandFor(store[skill]), [store]);

  return { store, record, recordOffline, band };
}

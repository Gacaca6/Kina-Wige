// The family profile — what a grown-up tells us during setup.
//
// Kept on this device only, like everything else. It holds the most personal
// thing the app has ever asked for (a child's name), so it is listed in
// Settings and wiped by "Delete all progress" — see PROGRESS_KEYS there.
//
// The name is optional. Kina Wige works exactly the same without it; the name
// only changes the greeting, and it is where the grown-up presses to get out.

import { useEffect, useState } from 'react';

export type Age = 3 | 4 | 5 | 6;

export interface Family {
  onboarded: boolean;
  childName: string;
  age: Age | null;
  /** Play time before Kina rests. Chosen by the grown-up during setup. */
  sessionMinutes: number;
}

export const FAMILY_KEY = 'kina-wige-family';
const CHANGED = 'kina-wige-family-changed';

export const AGES: Age[] = [3, 4, 5, 6];
export const SESSION_CHOICES = [10, 12, 15, 20] as const;
export const NAME_MAX = 20;

const DEFAULT: Family = { onboarded: false, childName: '', age: null, sessionMinutes: 12 };

export function loadFamily(): Family {
  try {
    const raw = localStorage.getItem(FAMILY_KEY);
    if (!raw) return DEFAULT;
    const f = JSON.parse(raw) as Partial<Family>;
    return {
      onboarded: f.onboarded === true,
      childName: typeof f.childName === 'string' ? f.childName.slice(0, NAME_MAX) : '',
      age: AGES.includes(f.age as Age) ? (f.age as Age) : null,
      sessionMinutes: (SESSION_CHOICES as readonly number[]).includes(f.sessionMinutes as number)
        ? (f.sessionMinutes as number)
        : DEFAULT.sessionMinutes,
    };
  } catch {
    return DEFAULT;
  }
}

export function saveFamily(patch: Partial<Family>) {
  const next = { ...loadFamily(), ...patch };
  try {
    localStorage.setItem(FAMILY_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable (private mode). Setup still completes for this visit.
  }
  window.dispatchEvent(new Event(CHANGED));
}

/** Live view of the profile; updates when any screen saves it. */
export function useFamily(): Family {
  const [family, setFamily] = useState<Family>(loadFamily);
  useEffect(() => {
    const sync = () => setFamily(loadFamily());
    window.addEventListener(CHANGED, sync);
    // "Delete all progress" removes the key without going through saveFamily.
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CHANGED, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);
  return family;
}

/** For screens that delete storage directly and need the app to notice. */
export function announceFamilyChanged() {
  window.dispatchEvent(new Event(CHANGED));
}

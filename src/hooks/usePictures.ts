// "My pictures" — finished colouring pages, kept on this device so a grown-up
// can see them. Listed in Settings and cleared by "Delete all progress".
// Stored as region → colour maps (a few hundred bytes each), never as images.

import { useCallback, useState } from 'react';

export const PICTURES_KEY = 'kina-wige-pictures';
const MAX_SAVED = 40;

export interface SavedPicture {
  id: string;
  picture: string;
  fills: Record<string, string>;
  at: number;
}

function read(): SavedPicture[] {
  try {
    const raw = JSON.parse(localStorage.getItem(PICTURES_KEY) ?? '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function usePictures() {
  const [saved, setSaved] = useState<SavedPicture[]>(read);

  const save = useCallback((picture: string, fills: Record<string, string>) => {
    const entry: SavedPicture = { id: `p${Date.now().toString(36)}`, picture, fills, at: Date.now() };
    const next = [entry, ...read()].slice(0, MAX_SAVED);
    try {
      localStorage.setItem(PICTURES_KEY, JSON.stringify(next));
    } catch {
      /* storage full or unavailable — the child still saw their picture */
    }
    setSaved(next);
    return entry;
  }, []);

  return { saved, save };
}

// The sticker book's storage. On this device only; listed in Settings and
// cleared by "Delete all progress".

import { useCallback, useState } from 'react';
import { STICKERS } from '../data/stickers';
import type { StickerInfo } from '../data/stickers';

export const STICKERS_KEY = 'kina-wige-stickers';

/** sticker id → how many the child has. */
type Book = Record<string, number>;

function read(): Book {
  try {
    const raw = JSON.parse(localStorage.getItem(STICKERS_KEY) ?? '{}');
    return raw && typeof raw === 'object' ? raw : {};
  } catch {
    return {};
  }
}

export function useStickers() {
  const [book, setBook] = useState<Book>(read);

  /**
   * Give the child their next sticker and return it. The first sticker they do
   * not have yet; once the book is full, a copy of the one they have fewest of.
   */
  const award = useCallback((): { sticker: StickerInfo; isNew: boolean } => {
    const current = read();
    let sticker = STICKERS.find((s) => !current[s.id]);
    const isNew = !!sticker;
    if (!sticker) {
      sticker = [...STICKERS].sort((a, b) => (current[a.id] ?? 0) - (current[b.id] ?? 0))[0];
    }
    const next = { ...current, [sticker.id]: (current[sticker.id] ?? 0) + 1 };
    try {
      localStorage.setItem(STICKERS_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — the celebration still shows it */
    }
    setBook(next);
    return { sticker, isNew };
  }, []);

  const count = useCallback((id: string) => book[id] ?? 0, [book]);
  const total = STICKERS.filter((s) => (book[s.id] ?? 0) > 0).length;

  return { award, count, total };
}

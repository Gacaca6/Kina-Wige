import { useState, useCallback } from 'react';

// Per-episode watched flags and per-game completion counts.
// Stars (useStars) stay the reward currency; this tracks real progress.

const PROGRESS_KEY = 'kina-wige-progress';

interface Progress {
  episodesWatched: Record<string, true>;
  gamesCompleted: Record<string, number>;
  comicsRead: Record<string, true>;
}

const emptyProgress: Progress = { episodesWatched: {}, gamesCompleted: {}, comicsRead: {} };

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return emptyProgress;
    const parsed = JSON.parse(raw);
    return {
      episodesWatched: parsed.episodesWatched ?? {},
      gamesCompleted: parsed.gamesCompleted ?? {},
      comicsRead: parsed.comicsRead ?? {},
    };
  } catch {
    return emptyProgress;
  }
}

function saveProgress(progress: Progress) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // localStorage unavailable
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(loadProgress);

  const markEpisodeWatched = useCallback((id: string) => {
    setProgress(prev => {
      if (prev.episodesWatched[id]) return prev;
      const next = {
        ...prev,
        episodesWatched: { ...prev.episodesWatched, [id]: true as const },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const markGameCompleted = useCallback((id: string) => {
    setProgress(prev => {
      const next = {
        ...prev,
        gamesCompleted: { ...prev.gamesCompleted, [id]: (prev.gamesCompleted[id] ?? 0) + 1 },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const markComicRead = useCallback((id: string) => {
    setProgress(prev => {
      if (prev.comicsRead[id]) return prev;
      const next = {
        ...prev,
        comicsRead: { ...prev.comicsRead, [id]: true as const },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const isEpisodeWatched = useCallback(
    (id: string) => !!progress.episodesWatched[id],
    [progress],
  );

  const gamePlayCount = useCallback(
    (id: string) => progress.gamesCompleted[id] ?? 0,
    [progress],
  );

  const isComicRead = useCallback(
    (id: string) => !!progress.comicsRead[id],
    [progress],
  );

  return { markEpisodeWatched, markGameCompleted, markComicRead, isEpisodeWatched, gamePlayCount, isComicRead };
}

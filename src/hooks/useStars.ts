import { useState, useCallback, useEffect } from 'react';

const STARS_KEY = 'kina-wige-stars';

export function useStars() {
  const [stars, setStars] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STARS_KEY);
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STARS_KEY, String(stars));
    } catch {
      // localStorage unavailable
    }
  }, [stars]);

  const addStar = useCallback((count: number = 1) => {
    setStars(prev => prev + count);
  }, []);

  const resetStars = useCallback(() => {
    setStars(0);
  }, []);

  return { stars, addStar, resetStars };
}

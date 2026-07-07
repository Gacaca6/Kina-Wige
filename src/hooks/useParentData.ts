import { useState, useCallback, useEffect } from 'react';
import type { TranslationKey } from '../i18n/translations';

const ACTIVITIES_KEY = 'kina-wige-activities';
const WEEKLY_KEY = 'kina-wige-weekly';

interface ParentData {
  activities: Record<string, boolean>;
  weeklyDays: boolean[];
}

const defaultData: ParentData = {
  activities: {},
  weeklyDays: [false, false, false, false, false, false, false],
};

function loadData(): ParentData {
  try {
    const activities = JSON.parse(localStorage.getItem(ACTIVITIES_KEY) || '{}');
    const weeklyDays = JSON.parse(localStorage.getItem(WEEKLY_KEY) || 'null') || defaultData.weeklyDays;
    return { activities, weeklyDays };
  } catch {
    return defaultData;
  }
}

export function useParentData() {
  const [data, setData] = useState<ParentData>(loadData);

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(data.activities));
      localStorage.setItem(WEEKLY_KEY, JSON.stringify(data.weeklyDays));
    } catch {
      // localStorage unavailable
    }
  }, [data]);

  const toggleActivity = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      activities: { ...prev.activities, [id]: !prev.activities[id] },
    }));
  }, []);

  const toggleDay = useCallback((index: number) => {
    setData(prev => {
      const newDays = [...prev.weeklyDays];
      newDays[index] = !newDays[index];
      return { ...prev, weeklyDays: newDays };
    });
  }, []);

  const completedDays = data.weeklyDays.filter(Boolean).length;

  const progressKey: TranslationKey = (() => {
    if (completedDays === 0) return 'parents.progress.start';
    if (completedDays <= 3) return 'parents.progress.good';
    if (completedDays <= 6) return 'parents.progress.strong';
    return 'parents.progress.win';
  })();

  const progressPercent = Math.round((completedDays / 7) * 100);

  return {
    activities: data.activities,
    weeklyDays: data.weeklyDays,
    toggleActivity,
    toggleDay,
    completedDays,
    progressKey,
    progressPercent,
  };
}

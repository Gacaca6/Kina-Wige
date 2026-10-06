// Status-bar and navigation-bar icon colours in the Android app.
//
// The app paints under both bars, so the clock, battery and navigation icons
// sit on top of whatever the screen draws there. White icons on the light-blue
// grown-up header, or dark icons on the forest-green child header, look broken.
//
// The default suits the child's world: light icons on the forest header, dark
// icons on the cream bottom nav. Screens with a different top or bottom call
// useSystemBars(...) and the default comes back when they leave.
//
// No effect on the website.

import { useEffect } from 'react';
import { SystemBars, SystemBarsStyle, SystemBarType } from '@capacitor/core';
import { isNative } from './platform';

export type Tone = 'dark' | 'light';

/** 'dark' = a dark background behind the bar, so its icons are light. */
const toStyle = (t: Tone) => (t === 'dark' ? SystemBarsStyle.Dark : SystemBarsStyle.Light);

const DEFAULT_TOP: Tone = 'dark';
const DEFAULT_BOTTOM: Tone = 'light';

function apply(top: Tone, bottom: Tone) {
  if (!isNative) return;
  // Cosmetic: a failure here must never take a screen down with it.
  SystemBars.setStyle({ style: toStyle(top), bar: SystemBarType.StatusBar }).catch(() => {});
  SystemBars.setStyle({ style: toStyle(bottom), bar: SystemBarType.NavigationBar }).catch(() => {});
}

export function applyDefaultSystemBars() {
  apply(DEFAULT_TOP, DEFAULT_BOTTOM);
}

/** Pass null to leave the bars alone (e.g. a gate that has already opened). */
export function useSystemBars(top: Tone | null, bottom: Tone | null = top) {
  useEffect(() => {
    if (!isNative || top === null || bottom === null) return;
    apply(top, bottom);
    return () => apply(DEFAULT_TOP, DEFAULT_BOTTOM);
  }, [top, bottom]);
}

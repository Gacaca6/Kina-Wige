// Where is this code running?
//
// One codebase ships twice: as the website (and installable PWA) that iPhone
// and web users get, and packed inside the Android app built with Capacitor.
// Almost everything is identical. The handful of differences all branch on
// this one flag, so they can be found by searching for `isNative`.
//
// In the Android app:
//   • there is NO service worker — every file is already inside the app, and a
//     worker caching files that live on the phone could only ever serve a
//     stale copy after an update (see vite.config.ts, mode 'native');
//   • videos are inside the app, so the video prefetch is skipped;
//   • the hardware back button and the system bar colours are handled.

import { Capacitor } from '@capacitor/core';

export const isNative = Capacitor.isNativePlatform();

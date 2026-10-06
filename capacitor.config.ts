// The Android app. Same code as the website, packed inside the app.
//
// Build:  npm run android:sync   (checks + native build + copy into android/)
// CI:     .github/workflows/android.yml builds, tests in an emulator, and
//         produces the signed bundle for Google Play.

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // Permanent once uploaded to Google Play. Never change it.
  appId: 'rw.kinawige.app',
  appName: 'Kina Wige',
  webDir: 'dist',
  // Forest behind the WebView while the first screen paints — never a white flash.
  backgroundColor: '#17543C',
  android: {
    // The app loads nothing over plain http, ever.
    allowMixedContent: false,
  },
  plugins: {
    SystemBars: {
      // Inject --safe-area-inset-* so headers clear the status bar even on
      // WebViews older than 140, where env(safe-area-inset-*) reports zero.
      // See src/native/safeArea.ts.
      insetsHandling: 'css',
      style: 'DARK',
      hidden: false,
    },
  },
};

export default config;

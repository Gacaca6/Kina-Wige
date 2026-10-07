// Fullscreen video inside the Android app.
//
// WHY THE APP DOES THIS ITSELF. The web Fullscreen API cannot do the job here:
// Capacitor's WebView declines Android's native fullscreen view, so
// requestFullscreen() only stretches the player over the WebView — still
// portrait, status bar still showing — and a 16:9 cartoon set to "cover" a tall
// screen came out zoomed about three times and cut off at both sides.
//
// So in the app, fullscreen is: turn the screen to landscape, hide the system
// bars, and let the player fill the screen with the WHOLE picture showing
// (object-fit: contain — never cropped). Leaving turns it back to portrait and
// brings the bars back.
//
// Note on "back to portrait": the orientation plugin's unlock() would free the
// app to rotate everywhere, overriding the manifest's portrait lock. Locking to
// 'portrait' explicitly keeps the rest of the app upright.
//
// No effect on the website.

import { SystemBars } from '@capacitor/core';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { isNative } from './platform';

export async function enterAppFullscreen() {
  if (!isNative) return;
  await ScreenOrientation.lock({ orientation: 'landscape' }).catch(() => {});
  await SystemBars.hide().catch(() => {});
}

export async function exitAppFullscreen() {
  if (!isNative) return;
  await ScreenOrientation.lock({ orientation: 'portrait' }).catch(() => {});
  await SystemBars.show().catch(() => {});
}

// ── Website ──
// Chrome on Android lets a page lock landscape once it is fullscreen; other
// browsers refuse, which is fine — the picture is contained either way.
type WebOrientation = ScreenOrientation & {
  lock?: (o: string) => Promise<void>;
  unlock?: () => void;
};

export async function lockLandscapeOnWeb() {
  const o = screen.orientation as WebOrientation | undefined;
  await o?.lock?.('landscape').catch(() => {});
}

export function unlockOrientationOnWeb() {
  const o = screen.orientation as WebOrientation | undefined;
  o?.unlock?.();
}

// Safe-area insets that work on every phone.
//
// The app paints edge to edge, under the status bar and the navigation bar,
// so every header and footer pads itself by the height of those bars.
//
// The standard way to read that height is CSS env(safe-area-inset-*). On the
// web it works. Inside the Android app it only works on Android System WebView
// 140 or newer; on older WebViews it reports ZERO, and a header would slide
// under the status bar with its back button out of reach. Low-cost phones that
// rarely update are exactly where that happens.
//
// Capacitor 8 measures the bars itself and injects --safe-area-inset-* CSS
// variables. So every inset reads Capacitor's variable first and falls back to
// env() — which is what the website uses, unchanged.
//
// Use these constants (or the .pt-safe / .pb-safe classes in index.css, built
// the same way). Never write env(safe-area-inset-…) directly.

export const SAFE_TOP = 'var(--safe-area-inset-top, env(safe-area-inset-top, 0px))';
export const SAFE_BOTTOM = 'var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0px))';

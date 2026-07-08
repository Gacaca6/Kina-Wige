// Downloads all episode videos into the offline cache in the background.
// The service worker's /videos/ route (CacheFirst + rangeRequests) then serves
// them even with no network. Failures are silent — we retry on next launch.

import { PREFETCH_VIDEO_CLIPS } from '../data/episodes';

const VIDEO_CACHE = 'kina-wige-videos';

export function prefetchVideos() {
  if (typeof caches === 'undefined') return;

  const run = async () => {
    try {
      const cache = await caches.open(VIDEO_CACHE);
      for (const url of PREFETCH_VIDEO_CLIPS) {
        const cached = await cache.match(url);
        if (!cached) {
          await cache.add(url);
        }
      }
    } catch {
      // Offline or storage full — videos still stream when online,
      // and we try again next launch.
    }
  };

  // timeout guarantees the callback fires even if animations keep the page busy
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(() => { void run(); }, { timeout: 5000 });
  } else {
    setTimeout(() => { void run(); }, 3000);
  }
}

// Caches a specific episode's clips on demand (full 200 responses via cache.add).
// Call this when a child OPENS a lazy episode (prefetch: false) so its videos
// become available offline after the first visit. Needed because playback uses
// Range (206) requests, which the service worker cache rejects on purpose —
// so relying on playback alone would never persist these videos offline.
export async function cacheEpisodeClips(clips: string[]) {
  if (typeof caches === 'undefined') return;
  try {
    const cache = await caches.open(VIDEO_CACHE);
    for (const url of clips) {
      const cached = await cache.match(url);
      if (!cached) {
        await cache.add(url);
      }
    }
  } catch {
    // Offline or storage full — the video still streams when online,
    // and we try again the next time the episode is opened.
  }
}

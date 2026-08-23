// Downloads all episode videos into the offline cache in the background.
// The service worker's /videos/ route (CacheFirst + rangeRequests) then serves
// them even with no network. Failures are silent — we retry on next launch.

import { PREFETCH_VIDEO_CLIPS } from '../data/episodes';

const VIDEO_CACHE = 'kina-wige-videos';

// Video URLs are fixed paths (`/videos/isuku.mp4`), not fingerprinted like the
// JS and CSS Vite emits. Combined with a CacheFirst route and a plain
// "skip if already cached" check, that meant a device which had cached an
// episode kept those exact bytes FOREVER — re-cutting a video and deploying it
// could never reach anyone who had already watched it. That is how the
// corrected hygiene episode failed to reach devices that had the old cut.
//
// So before trusting a cached video we ask the server how big the file is now.
// A HEAD is headers-only, costs nothing next to a 9 MB video, and is skipped
// entirely when offline — where the cached copy is the right answer anyway.
// Cache API only stores GET, so the HEAD passes through the CacheFirst route
// to the network rather than being answered from the cache it is checking.
// cache.add() fetches through the browser's HTTP cache. Videos were served
// with `max-age=31536000, immutable` on a URL that never changes, so Safari —
// which honours `immutable` strictly, where Chrome will still revalidate —
// answered that fetch from its own year-long disk cache and handed us the SAME
// stale bytes we were trying to replace. The header is fixed in vercel.json,
// but a device that already stored the old response under the old header would
// stay stuck for a year. `cache: 'reload'` bypasses the HTTP cache outright,
// so the repair works regardless of what a device stored previously.
async function putFromNetwork(cache: Cache, url: string) {
  const res = await fetch(url, { cache: 'reload' });
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  await cache.put(url, res);
}

async function cacheFresh(cache: Cache, url: string) {
  const cached = await cache.match(url);

  if (!cached) {
    await putFromNetwork(cache, url);
    return;
  }

  // Offline: keep what we have. That is the whole point of caching it.
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return;

  let head: Response;
  try {
    head = await fetch(url, { method: 'HEAD', cache: 'no-store' });
  } catch {
    return; // unreachable server — the cached copy still plays
  }
  if (!head.ok) return;

  // ETag when the host sets one, otherwise size. Either changes when we
  // re-cut a video; neither changes on an unrelated deploy, so a child on
  // mobile data does not re-download videos that did not change.
  const remote = head.headers.get('etag') ?? head.headers.get('content-length');
  const local = cached.headers.get('etag') ?? cached.headers.get('content-length');

  // If the server tells us neither, we cannot compare — leave it alone rather
  // than re-downloading megabytes on every episode open.
  if (!remote || !local || remote === local) return;

  await cache.delete(url);
  await putFromNetwork(cache, url);
}

// Entries stored while /videos/ was served as `immutable` are unreliable: the
// device was told never to revalidate them, and on Safari that is taken
// literally. Drop exactly those, once, so the next open re-fetches them. We do
// NOT rename the cache to force this — that would throw away every video on
// every device, and a child on a hillside with no signal would lose content
// that was perfectly fine. This targets only what the bad header touched, and
// needs no network to decide.
async function dropImmutableEntries(cache: Cache) {
  for (const request of await cache.keys()) {
    const res = await cache.match(request);
    if (res?.headers.get('cache-control')?.includes('immutable')) {
      await cache.delete(request);
    }
  }
}

export function prefetchVideos() {
  if (typeof caches === 'undefined') return;

  const run = async () => {
    try {
      const cache = await caches.open(VIDEO_CACHE);
      await dropImmutableEntries(cache);
      for (const url of PREFETCH_VIDEO_CLIPS) {
        await cacheFresh(cache, url);
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
      await cacheFresh(cache, url);
    }
  } catch {
    // Offline or storage full — the video still streams when online,
    // and we try again the next time the episode is opened.
  }
}

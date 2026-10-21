// Kina Wige web app on Cloudflare Pages (https://kinawige-app.pages.dev).
//
// Runs only for /videos/*. Cloudflare Pages ignores the Range header and
// always sends the whole file with 200, and Safari on iPhone will not play an
// MP4 unless Range is answered with 206 Partial Content (Vercel did this for
// us). We stream only the requested bytes, so CPU time stays tiny even for
// the 20 MB videos. Every other path is served by Pages directly.
// The Android app never uses this: it carries its own copy of every video.

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
  }
  // Ask Pages for the whole file; we cut the range out ourselves.
  const whole = await env.ASSETS.fetch(new Request(request.url, { method: 'GET' }));
  return withRanges(request, whole);
}

async function withRanges(request, whole) {
  if (!whole.ok || !whole.body) return whole;
  let size = Number(whole.headers.get('Content-Length'));
  let body = whole.body;
  if (!Number.isFinite(size) || size <= 0) {
    // No length from assets (seen when the response is re-encoded): measure it.
    const bytes = new Uint8Array(await whole.arrayBuffer());
    size = bytes.byteLength;
    body = new Blob([bytes]).stream();
  }

  const headers = new Headers(whole.headers);
  headers.set('Accept-Ranges', 'bytes');
  headers.delete('Content-Encoding');

  const range = parseRange(request.headers.get('Range'), size);
  if (range === 'invalid') {
    body.cancel();
    headers.set('Content-Range', `bytes */${size}`);
    headers.delete('Content-Length');
    return new Response(null, { status: 416, headers });
  }
  if (!range) {
    headers.set('Content-Length', String(size));
    if (request.method === 'HEAD') { body.cancel(); return new Response(null, { status: 200, headers }); }
    return new Response(body, { status: 200, headers });
  }

  const [start, end] = range;
  const length = end - start + 1;
  headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
  headers.set('Content-Length', String(length));
  if (request.method === 'HEAD') { body.cancel(); return new Response(null, { status: 206, headers }); }

  const fixed = new FixedLengthStream(length);
  body.pipeThrough(slice(start, end)).pipeTo(fixed.writable).catch(() => {});
  return new Response(fixed.readable, { status: 206, headers });
}

// "bytes=0-1", "bytes=500-", "bytes=-500". Only the first range of a
// multi-range request is honoured, which is all a video player asks for.
function parseRange(value, size) {
  if (!value) return null;
  const m = /^bytes=(\d*)-(\d*)/.exec(value.trim());
  if (!m || (m[1] === '' && m[2] === '')) return 'invalid';
  let start, end;
  if (m[1] === '') {
    const suffix = Number(m[2]);
    if (suffix === 0) return 'invalid';
    start = Math.max(0, size - suffix);
    end = size - 1;
  } else {
    start = Number(m[1]);
    end = m[2] === '' ? size - 1 : Math.min(Number(m[2]), size - 1);
  }
  if (start >= size || start > end) return 'invalid';
  return [start, end];
}

// Passes through only bytes start..end (inclusive) of the stream.
function slice(start, end) {
  let pos = 0;
  return new TransformStream({
    transform(chunk, controller) {
      const from = pos;
      pos += chunk.byteLength;
      if (pos <= start || from > end) return;
      controller.enqueue(chunk.subarray(Math.max(0, start - from), Math.min(chunk.byteLength, end + 1 - from)));
      if (pos > end) controller.terminate();
    },
  });
}

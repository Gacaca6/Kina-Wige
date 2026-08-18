# Kina Wige — marketing site

Separate from the app on purpose. The app is a PWA with a tight offline
precache budget; a marketing page has no business inside it.

## Run

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
```

## What it is

Astro, static, **zero JavaScript shipped**. The whole page is ~12.6 KB gzipped
including fonts. That is the argument as much as the artwork: a site claiming
"works on a cheap phone with little data" should not arrive as a 2 MB bundle.

- Three real pages per language (`/`, `/rw/`, `/fr/`) rather than a JS toggle,
  so each is indexable and a visitor downloads only their own language.
- Every "screenshot" is drawn in CSS from the app's own tokens — nothing to
  download, nothing to go stale when a colour changes.
- Reveal-on-scroll uses CSS `animation-timeline: view()`. Where that is
  unsupported (Safari, Firefox today) the content is simply visible; nothing is
  hidden behind a script.
- The signature motif is **imigongo**, Rwanda's own geometric relief art, drawn
  as inline SVG. `CLAUDE.md` §18 forbids "generic Africa"; this is the opposite.

## Before it goes live

1. **`APP_URL` in `src/config.ts` is a placeholder.** It is the most important
   link on the site and it is currently a guess. Point it at the real app.
   Better still, host the app at `/app` on this same domain so "Install" does
   not have to hop origins — a browser only offers to install a PWA from the
   app's own origin.
2. **Store badges are dormant by construction.** Kina Wige is on neither store.
   Fill in `STORE_LINKS` in `src/config.ts` and they become real links; until
   then they render as non-clickable spans.
3. **The Kinyarwanda is machine-written** and belongs in the same review queue
   as the app's strings — including the video captions in
   `public/media/captions/`.
4. **The legal pages are not lawyer-reviewed.** Both stores require a reachable
   privacy policy, so `/privacy/` is a prerequisite for any store listing.
5. Set the real domain in `astro.config.mjs`, `src/config.ts` and
   `public/sitemap.xml` (currently `kinawige.rw`).

## Deploy

Its own Vercel project, root directory `site/`. `vercel.json` is already here.

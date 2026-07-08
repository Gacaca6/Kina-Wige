# Kina Wige — Roadmap to v1.0

Ordered backlog. Take the topmost unchecked task. Every task ends with:
`npm run lint` + `npm run build` + browser walk-through of the changed flow,
then check the box here and commit. Rules live in CLAUDE.md — read it first.

**State as of 2026-07-08:** app is fully offline, Gemini removed, 2 episodes
(local clips), 5 games (handwash, memory, counting, pattern, sorting), offline
Baza Keza, trilingual UI, videos cached offline via prefetch + SW range route.
All verified working in production build.

---

## P0 — Ship blockers

- [x] **1. Compress images to WebP** *(done 2026-07-08: 3.4 MB → 208 KB via
  `scripts/optimize-images.mjs`; precache now 1.29 MB)*
  Every PNG in `src/assets/` is 280–430 KB; precache is ~4.5 MB.
  Steps: `npm i -D sharp` (dev-only, remove after if preferred); write a
  one-off script `scripts/optimize-images.mjs` that converts each PNG in
  `src/assets/**` to `.webp` (quality 80, max width 800 for full art / 256
  for avatars); update imports in `src/assets/images.ts`; also generate a
  smaller `public/logo.webp` if referenced. Keep originals out of git
  (delete after conversion — git history preserves them).
  Accept: total `src/assets` < 600 KB; build precache < 2 MB (excluding
  videos); all screens still show images in browser check.

- [x] **2. Re-encode videos smaller** *(done 2026-07-08: ffmpeg installed via
  winget; 9.7 MB → 2.3 MB total, 480p CRF 28, audio verified intact)*
  `ffmpeg -i clip1.mp4 -c:v libx264 -profile:v baseline -level 3.0 -vf "scale=-2:480" -crf 28 -c:a aac -b:a 64k clip1-sm.mp4`
  for each clip; replace files in `public/videos/` keeping the same names.
  Accept: each clip < 1.5 MB, audio intact, plays in the built app with sound.

- [x] **3. Per-episode & per-game progress** *(done 2026-07-08:
  `src/hooks/useProgress.ts`, VideoPlayer `onAllClipsEnded`, all 5 games mark
  completion, cards + games list show real progress — browser-verified)*
  Home/episode-list cards currently show "1/1" if the child has ANY star.
  Steps: new hook `src/hooks/useProgress.ts` storing
  `{ episodesWatched: Record<string, true>, gamesCompleted: Record<string, number> }`
  under localStorage key `kina-wige-progress`. VideoPlayer gets an
  `onAllClipsEnded` callback (fires in the existing `onEnded` else-branch);
  EpisodeScreen marks the episode watched. Each game's win path calls
  `markGameCompleted(id)` (put it inside GameCelebration mount via a prop,
  or in each game next to `addStar`). Cards derive their fraction from real
  progress. Keep `useStars` for the star currency.
  Accept: watching an episode to the end flips its card to 1/1 and survives
  reload; finishing memory twice shows a play count ≥ 1 for it; other cards
  remain 0/1.

- [x] **4. Deploy** *(done 2026-07-08: owner deployed to VERCEL, running on
  iPhone. `vercel.json` added for SPA rewrites + SW/video headers —
  `public/_redirects` kept only in case of a move to Netlify. After every
  push to main, Vercel redeploys automatically.)*
  Accept: public URL loads, installs as PWA on Android, second visit works
  in airplane mode including video playback.

## P1 — Content pipeline

- [ ] **5. Per-episode quizzes (data-driven)**
  Quiz questions are hardcoded in `VisualQuiz.tsx` via i18n keys and shown
  identically on both episodes.
  Steps: add `quiz?: { question: Record<Language,string>; options: { emoji: string; label: Record<Language,string>; correct: boolean }[] }[]`
  to `Episode` in `src/data/episodes.ts`; move the two existing questions
  into episode 1; write 2 new questions for episode 2 (washing-before-eating
  theme, KN/EN/FR — add KN strings to the Human-review queue below);
  `VisualQuiz` takes `questions` as a prop; award a star on quiz completion
  (`onComplete` currently does nothing — wire it to `addStar(1)` +
  `markGameCompleted('quiz-'+episodeId)`).
  Accept: each episode shows its own quiz; finishing a quiz grants a star.

- [ ] **6. Wire in Ubongo episodes** *(blocked on Human-required #A)*
  When MP4s appear in `public/videos/`, add registry entries with the
  provided titles, an attribution line, and thumbnails. Add an
  **attribution section**: new collapsible in ParentScreen listing each
  third-party video: "© Ubongo — CC BY-NC-ND — ubongo.org". CC BY-NC-ND
  forbids editing the videos — never re-encode Ubongo files beyond container
  copy (`-c copy`), never trim them.
  Accept: new episodes play offline; attribution visible in Parent zone.

- [x] **7. Expand kezaQA to ~50 entries** *(done 2026-07-08: 13 → 45 entries.
  Added hygiene steps/bathing/cough-sneeze/toilet, health (sleep, sport,
  malaria/mosquito nets), safety (roads, fire, strangers), nutrition
  (vegetables/milk/sweets), body, nature (animals/rain/sun/trees), feelings
  (happy/sad/angry/scared), family/school/manners/helping, and fun. Spot-checked
  in 3 languages; gibberish falls back correctly. All new KN strings added to
  Human-review queue below.)*
  DECISION (owner, 2026-07-08): Baza Keza stays a pure offline database — NO
  cloud/free-tier AI. "Totally free + offline + parent-reviewable + good
  Kinyarwanda" all point here. Do not add an AI fallback; keep growing this file.

## P2 — Learning depth

- [ ] **8. Pattern game: generated rounds + difficulty ramp**
  Replace the 5 static rounds with a generator: pool of 6 emojis; round 1–2
  ABAB, 3 AABB, 4 ABC, 5 ABB/AAB (random template + random symbols, options =
  answer + 2 pool distractors, shuffled). Keep rounds deterministic per game
  start (generate once into state).
  Accept: two consecutive plays show different sequences; all rounds solvable;
  5/5 score reachable.

- [ ] **9. Counting in Kinyarwanda words**
  After a correct pick in CountingGame, show the number word under the digits:
  rimwe(1) kabiri(2) gatatu(3) kane(4) gatanu(5) gatandatu(6) karindwi(7)
  umunani(8) icyenda(9) icumi(10) — with EN/FR equivalents when those
  languages are active. (KN numerals above are standard; still list in
  Human-review queue.)
  Accept: correct answer flashes the word in the active language.

- [ ] **10. Pre-recorded audio hooks** *(blocked on Human-required #B)*
  Speech synthesis cannot speak Kinyarwanda. Prepare the code path now:
  `speakMessage`/`speakQuestion` first check for a local file
  `public/audio/<key>.mp3` (add an `audioKey` field to kezaQA entries and
  quiz questions); fall back to speechSynthesis only for EN/FR. Add
  `**/*.mp3` to the SW glob or a runtime cache route.
  Accept: dropping a correctly named mp3 into `public/audio/` makes the 🔊
  button play it (test with any placeholder mp3); missing files fail silent.

## P3 — Polish & hardening

- [ ] **11. Self-host fonts** — download Fredoka + Nunito woff2 (Google Fonts
  helper or fontsource `@fontsource/fredoka`, `@fontsource/nunito`), replace
  the CSS `@import` in `src/index.css`, drop the two Google-fonts runtime
  cache routes from `vite.config.ts`. Accept: build has zero references to
  fonts.googleapis.com; text renders with correct fonts offline on FIRST load.
- [ ] **12. Proper maskable icon** — generate a padded 512px maskable variant
  (safe zone: content within inner 80%), add as separate manifest entry with
  `purpose: 'maskable'`, change the existing 512 entry to `purpose: 'any'`.
  Accept: icon not cropped in Chrome DevTools → Application → Manifest preview.
- [ ] **13. Parent-zone gate** — simple "hold 3 seconds" or year-of-birth
  question before ParentScreen (standard kids-app pattern, no password).
  Accept: bottom-nav Parents tap shows gate; passing it once per session
  (sessionStorage) opens the zone.
- [ ] **14. TypeScript strict mode** — add `"strict": true` to tsconfig,
  fix all errors (expect: implicit anys in speech-recognition code, ref
  inits). Accept: `npm run lint` clean with strict on.
- [ ] **15. Smoke tests** — `npm i -D vitest`; test: `findOfflineAnswer`
  matches soap/germs/food keywords in 3 languages and returns null for
  gibberish; every `games.ts` id has a component mapping in GameScreen's
  `GAME_COMPONENTS`; every episode's clips exist in `public/videos/`
  (fs check); translations: KN/EN/FR key sets are identical. Add
  `"test": "vitest run"` script. Accept: `npm test` green.
- [ ] **16. `npm audit` review** — 13 vulns reported (mostly transitive dev).
  Run `npm audit`, apply safe non-major fixes, document any accepted risks here.

## Human-required (Godwin — the model must ask, not fake these)

- [ ] **A. Download Ubongo videos** — YOU must do this, not the assistant.
  NOTE (2026-07-08): owner registered at toolkits.ubongo.org and asked whether
  he could hand over credentials so the assistant pulls the content. Answer:
  NO — do not share login credentials. Reasons: (1) the assistant can't hold or
  reuse a password securely across sessions; (2) Ubongo's CC BY-NC-ND terms bind
  YOU as the registered downloader who agreed to them and must vet each video for
  child-appropriateness; (3) it's simply unsafe practice. Correct flow: YOU log
  in, pick 3–5 Kinyarwanda episodes (hygiene/nutrition/counting), watch each one
  fully, download the MP4s, drop them in `public/videos/`, and tell the assistant
  the filenames + titles. The assistant then wires them into episodes.ts with
  attribution (task 6). License: CC BY-NC-ND — non-commercial, attribute, NO edits
  (container-copy re-encode only, never trim).
- [ ] **B. Record Kinyarwanda audio**: Keza answers + quiz questions,
  phone-recorded is fine (one mp3 per entry, filenames from task 10).
- [ ] **C. Native-speaker review of machine-written Kinyarwanda** — review
  queue (added by assistant sessions, newest last):
  - translations.ts: `splash.tagline` (“Kina, wige, ukure!”), `games.subtitle`
    (“Imikino igufasha gutekereza!”), `memory.instructions`,
    `counting.question` (“Hano hari bingahe?”), `pattern.instructions`,
    `sorting.question/healthy/unhealthy`, `parents.learnedBody`,
    `parents.changesBody`, `parents.activity*`, `parents.progress.*`
  - episodes.ts: episode 2 `story.KN`; upcoming episode teasers
  - games.ts: all `title.KN` / `skill.KN`
  - SortingGame food names (Pome, Karoti, Umuneke, Ifanta, Donati, Bombo, Ifiriti)
  - kezaQA.ts (task 7, 32 new `answer.KN` strings): topics hygiene-steps,
    bathing, cough/sneeze, toilet, sleep, sport, mosquito/malaria, road safety,
    fire safety, strangers, vegetables, milk, sweets, body, animals, rain, sun,
    trees, happy, sad, angry, scared, family, school, manners, helping, singing,
    app, goodbye. Spot-checked for sense but need a native speaker for phrasing.
- [ ] **D. Revoke the old Gemini API key** at https://aistudio.google.com/apikey
  (exposed in pre-2026-07-07 builds).
- [x] **E. Hosting** — done, deployed on Vercel by owner (2026-07-08).

## Definition of done (v1.0)

Installable PWA on a public URL that, after one online visit, works fully in
airplane mode: ≥4 episodes with sound (≥2 from Ubongo, attributed), 5+ games
with real per-game progress, per-episode quizzes, ~50-entry Baza Keza,
Kinyarwanda reviewed by a native speaker, precache < 2 MB + videos < 8 MB,
Lighthouse PWA installable-check passing, smoke tests green, strict TS.

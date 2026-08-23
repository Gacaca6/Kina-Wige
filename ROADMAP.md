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

- [x] **2. Re-encode videos smaller** *(done 2026-07-08. Original 3 cartoon
  clips: 9.7 MB → 2.3 MB (480p CRF 28). Then owner added 8 content videos
  (5 alphabet songs, Twinkle Twinkle, Letter-A, 1 Pixabay clip) totalling
  427 MB — would have destroyed the app. Compressed all to 480p CRF 26 /
  AAC 128k / faststart: 427 MB → 60.6 MB (86% smaller), durations + audio
  intact, verified with ffprobe. Originals backed up in
  Downloads/KinaWige/public/videos/originals.)*
  Recipe used: `ffmpeg -i IN -vf "scale=-2:480" -c:v libx264 -profile:v baseline -level 3.0 -preset slow -crf 26 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart OUT`
  Long videos stay large by nature (letter-a 6.3min=20MB, twinkle 3.4min=18MB).
  KEY MITIGATION: episodes now have a `prefetch` flag. Only small cartoon
  clips prefetch on launch (~2.2MB); song episodes (`prefetch: false`) cache
  LAZILY the first time opened — see `cacheEpisodeClips()` in prefetchVideos.ts,
  called from EpisodeScreen. Needed because video Range (206) requests are
  rejected by the SW cache, so playback alone never persists them offline.

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

- [~] **6. Wire in content episodes + attribution** *(partly done 2026-07-08:
  owner-supplied videos wired in as 3 new episodes — "Indirimbo y'Inyuguti"
  (5 alphabet-song clips), "Inyenyeri Nto" (Twinkle Twinkle), "Inyuguti A mu
  Mudugudu" (Letter A). Thumbnails auto-extracted from each video with ffmpeg
  → src/assets/episodes/*-thumb.webp. All lazy-cached, browser-verified: open
  episode → all its clips saved offline; plays with audio; song episodes show
  no game button. The Pixabay no-voice clip is copied to originals but left
  UNWIRED per owner.)*
  STILL TODO: (a) **attribution UI** — add a collapsible in ParentScreen listing
  each third-party video's source/licence (the `attribution` field already
  exists on Episode; several are marked "TODO: confirm source & licence").
  (b) **CONFIRM LICENCES** — see Human-required #F. If any Ubongo videos are
  added later, they are CC BY-NC-ND: attribute, and re-encode by container
  copy only (`-c copy`), never downscale/trim.

- [x] **7. Expand kezaQA — now 93 entries** *(done 2026-07-08 in two passes:
  13 → 45 → 93. Pass 2 (owner request "vast range + act as a manual") added,
  after researching what 3–6yos actually ask: a 16-entry APP MANUAL (who is
  Keza, what can you do, how to play/watch/get stars/change language/go
  home/ask, per-game how-to, offline, who made it); CURIOSITY science
  (sky/moon/birds/rainbow/thunder/seeds/clouds); EVERYDAY PROBLEMS (dark,
  nightmares, bored, tummy/toothache, hurt, hit/bullied, missing mama, won't
  eat, tired, school refusal, bedwetting, sharing conflict); BIG QUESTIONS
  handled with warm parent-redirects (where babies come from, death, God,
  skin color); more manners (sorry, lying, turns) and self-care (dressing,
  nails, hair, wash-fruit, medicine, electricity). Verified in KN + EN in the
  built app; app-manual, curiosity, problems, and parent-redirects all match;
  gibberish still falls back.)*
  DECISION (owner, 2026-07-08): Baza Keza stays a pure offline database — NO
  cloud/free-tier AI. "Totally free + offline + parent-reviewable + good
  Kinyarwanda" all point here. Do not add an AI fallback; keep growing this file.
  When new Ubongo topics land, add matching Q&A so Keza can talk about them.

- [ ] **7a. "Bayi Bayi Ingona" — our own Rwandan song episode** (added
  2026-08-22, owner request). Opens the two domains that currently have ZERO
  content and replaces the app's weakest-justified item.

  WHY THIS ONE. `npm run build` reports D6 Creative Arts & Culture at 0/10 and
  D3 Discovery of the World at 0/11 — 25% of the curriculum weight with nothing
  behind it. `art.sing.rwanda` ("Sings a Rwandan song / Joins a known song") is
  L1, needs no prerequisites, and is the cheapest honest way in. The note on the
  `twinkle` episode in `src/data/episodes.ts` already asks for exactly this:
  an English nursery rhyme cannot claim `art.sing.rwanda`, and a Rwandan song
  can. "Bayi Bayi Ingona" is a traditional Kinyarwanda children's rhyme — no
  identifiable author, sung in Rwanda for generations, and it appears on many
  unrelated channels each with its own arrangement, which is what folk material
  looks like.

  RIGHTS — the part that must not be got wrong. Two separate things:
    - The SONG (melody + words) is traditional and unowned. We are free to use
      it. Owner confirms it from his own childhood; that is good evidence.
    - Any RECORDING of it is a separate work owned by whoever made it. A
      public-domain song does not make someone else's performance of it free,
      and YouTube's terms forbid downloading regardless. So we take NOTHING
      from the reference video — not the audio, not the animation.
  Therefore: we record our own vocals and animate our own scenes. That also
  gives us a clean `attribution` line ("Traditional Rwandan children's song ·
  Kina Wige recording and animation, 2026") and keeps the licence audit
  (Human-required #F) from growing another open question.

  LYRICS. Do not take them from a web transcription or let a model write them.
  Queen (content) transcribes the version she knows, Eric (curriculum) checks it
  against what children actually sing, and it goes through Human-required #C
  like all our Kinyarwanda. Regional variants exist — pick one and say which.

  WHAT IT SHOULD CLAIM.
    - `art.sing.rwanda` (D6, L1) — earned honestly: the child joins a known
      Rwandan song. This is the point of the episode.
    - `art.rhythm.make` (D6, L2) — ONLY if we build a clap-along beat the child
      has to keep, not if they just watch. No claim without an interaction.
    - `wld.animals.local` (D3, L1) — NOT claimable from this alone. Its evidence
      line is "names cow, goat, chicken, dog + 4 more"; one crocodile is not
      eight animals. It can be the first item in a D3 set, not the whole of it.

  PRODUCTION. 60–90s, our own characters (Kina's world — NOT the human children
  from the videos; see the Brand Identity separation rule). Rwandan setting: a
  river or wetland a child here would recognise, not a generic jungle. Encode to
  match the rest: 854×480, H.264 Constrained Baseline level 3.0, CRF 26, AAC
  128k, `+faststart`, `prefetch: false`.

  THEN RETIRE TWINKLE. Once this ships, drop the `twinkle` episode: it is
  18.4 MB — the largest video in the app — it teaches one listening skill, and
  it is culturally imported. Removing it roughly pays for this episode twice
  over in bytes.

  Accept: `node scripts/check-curriculum.mjs` shows D6 no longer at 0; the
  episode declares `art.sing.rwanda`; attribution names the song as traditional
  and the recording as ours; no frame or sample originates from a third party.

## P2 — Learning depth

- [ ] **7b. Kinyarwanda audio for the `isuku` episode** (added 2026-08-11).
  The new 80-second hygiene episode replaced the two original hygiene episodes
  and is our best-looking content, but its narration and recap song are in
  ENGLISH. Under the language policy (Architecture §6.2) English is exposure-only
  at L1 and receptive at L2 — this episode is the app's most prominent piece of
  English instruction. Options: (a) re-voice in Kinyarwanda over the same
  animation, (b) add KN subtitles/captions, (c) keep as English exposure and say
  so. Owner + Kinyarwanda voice needed. This is a pedagogy decision, not a code
  one, and it should be made before the pilot.

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

- [x] **11. Self-host fonts** *(done 2026-07-08: `@fontsource/fredoka` +
  `@fontsource/nunito` imported in main.tsx (weights 400/500/600/700 and
  400/600/700/800); removed the CSS `@import` and both Google-fonts runtime
  routes from vite.config. Verified: built bundle has ZERO fonts.googleapis/
  gstatic references, woff2 precached (offline first-load), Fredoka + Nunito
  render locally. NOTE: leftover empty google-fonts-cache/gstatic-fonts-cache
  from the old SW linger harmlessly on already-installed devices.)*
- [x] **12. Proper maskable icon** *(done 2026-07-08: generated
  public/maskable-{192,512}.png — icon scaled to 80% and centered on a solid
  green (#2D6A4F) safe zone; added as separate manifest entries purpose
  'maskable'; changed icon-512 from 'any maskable' to 'any'. Verified manifest
  has 2 maskable icons, no mixed any-maskable.)*
- [x] **13. Parent-zone gate** *(done 2026-07-08: `ParentGate` component wraps
  the /parents route with a simple randomized addition question (a+b, 3
  options) — trivial for an adult, a barrier for a toddler. Unlock persists per
  session (sessionStorage 'kina-wige-parent-unlocked'). Trilingual (gate.*).
  Browser-verified: wrong answer stays locked, correct unlocks, no re-gate on
  return within the session.)*
  ORIGINAL NOTE — simple "hold 3 seconds" or year-of-birth
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
  - episodes.ts (task 6, new): titles + stories for the 3 content episodes —
    "Indirimbo y'Inyuguti", "Inyenyeri Nto", "Inyuguti A mu Mudugudu" (KN
    titles + KN story text machine-written; confirm they read naturally).
  - comics.ts (comic feature): "Amaboko Meza ya Hirwa" title + 6 panel captions
    (KN); translations.ts comic.* / comics.* / nav.comics ("Ibitabo").
  - comics.ts "Umusatsi Wanjye Udasanzwe" (My Special Hair): title + 11 panel
    captions (KN) — original telling synced to Book Dash art; check phrasing.
  - translations.ts gate.* (KN "Ku Babyeyi gusa" / instruction / wrong).
  - kezaQA.ts (task 7, ~80 machine-written `answer.KN` strings total across
    both passes): hygiene/health/safety/nutrition/body/nature/feelings/
    family/manners/self-care PLUS pass-2 app-manual answers (many contain UI
    label references like "Imikino", "Amasomo", "Ababyeyi", "Ahabanza" — if a
    UI label is renamed, update the matching kezaQA answer too), curiosity
    science answers, everyday-problem answers, and the big-question
    parent-redirects (babies/death/God/skin-colour — review the TONE of these
    especially, they must feel warm and safe in Kinyarwanda). Spot-checked for
    sense; need a native speaker for phrasing.
  - redesign specs (2026-07-31, `docs/CHARACTERS-AND-IDENTITY.md` §5) — not yet
    in code, review before implementing: `avatar.pick_face` ("Hitamo mu maso"),
    `avatar.pick_hair` ("Hitamo umusatsi"), `avatar.pick_colour` ("Hitamo
    ibara"), `avatar.thats_me` ("Ni njye!"), `people.title` ("Abankunda" —
    confirm this is the natural word for "those who love me"),
    `voice.record_prompt` ("Fata ijwi ry'izina ry'umwana"), `voice.keep`
    ("Bika"), `voice.retry` ("Ongera"), `voice.skip` ("Simbuka"),
    celebration with name ("Wabikoze, {name}!").
  - curriculum lesson text (2026-08-08, `src/data/lessons.ts`) — **NOW IN CODE
    and child-facing**, review first: the three Kina Challenge texts ("Shakisha
    ikintu mu rugo gitangira na «a»…", "Shakisha amabuye atanu hanze. Muyabare
    muri kumwe. Hanyuma umubaze uti: ni angahe?" and the handwashing one, "Uyu
    munsi, karaba amaboko n'umuntu mukuru mbere yo kurya. Vuga buri ntambwe mu
    ijwi riranguruye: amazi, isabune, gukanda, koza, kumutsa.") and the three
    parent activities ("Saba umwana wawe kuvuga inyajwi eshanu…", "Nyuma yo
    kubara, buri gihe umubaze uti «ni angahe?» — icyo kibazo ni cyo
    gitandukanya indirimbo no kubara nyakuri." and "Saba umwana wawe kukubwira
    intambwe zo gukaraba amaboko mu magambo ye bwite. Mureke arangize interuro
    yose mbere yo kumufasha."). Two of these carry our headline pedagogical
    claims to the parent — their tone matters more than most strings in the app.
  - ~~`SettingsScreen.tsx` is entirely untranslated~~ — **fixed 2026-08-08.**
    Every screen now goes through `t()`, enforced by `npm run i18n:check`.
  - **Kinyarwanda weekday initials** in `translations.ts`
    (`parents.dayLetters` = "Mb,Ka,Ga,Kn,Gt,Gd,Cy") are machine-derived from
    Mbere/Kabiri/Gatatu/Kane/Gatanu/Gatandatu/Cyumweru. Confirm these are how a
    Rwandan parent would actually abbreviate the days on a week strip.
  - **New trilingual UI copy from the translation pass** (2026-08-08): the whole
    `lesson.*`, `home.*`, `plan.*`, `report.*`, `a11y.*` and `splash.*` groups —
    roughly 75 new KN strings, all machine-written. The lesson loop ones are the
    most child-facing: "Yego! Ni yo!", "Ongera ugerageze", "Kina aracyari kumwe
    nawe", "Noneho genda ukine!", "Wabikoze!".
  - **NEW (2026-08-11) hygiene episode text** in `src/data/episodes.ts` — the
    `isuku` title "Isuku n'Ubuzima" and its KN story blurb ("Umukobwa n'inshuti
    ye Isabune baguha amasomo umunani ku isuku…"), plus the new skill phrasing
    `phy.teeth` = "yoza amenyo ye neza". The episode's narration itself is in
    ENGLISH — see the dubbing note in P1 below.
  - **HIGH PRIORITY, parent-facing**: `PARENT_WORDING` in
    `src/data/curriculum.ts` — 22 short phrases a parent reads about their own
    child ("abara ibintu bitanu akakubwira uko bingana", "akaraba amaboko ku
    murongo uwo ari wo", "agerageza ikintu gishya ku bwe", …) plus the
    `report.*` keys in `translations.ts` (band phrasings: "aratangira",
    "aragenda, afashijwe gato", "abikora wenyine", "abikoresha mu bindi bihe").
    These sentences ARE our assessment as far as a family is concerned — if the
    Kinyarwanda reads coldly or clinically, the whole §13.3 intent is lost.
  - **HIGH PRIORITY**: the five handwashing step words in lesson `u3l1`
    (`src/data/lessons.ts`) — **amazi · isabune · gukanda · koza · kumutsa**.
    These are machine-chosen verbs for wet/soap/scrub/rinse/dry and a child
    reads them on screen and says them at a basin. If a Rwandan parent would
    say these steps differently, the lesson is teaching the wrong words for a
    health routine. Confirm before the handwashing slice is tested with children.
  - curriculum architecture (2026-08-02, `docs/CURRICULUM-ARCHITECTURE.md` +
    `docs/CURRICULUM-SKILLS.md`) — machine-written KN, now also in
    `src/data/curriculum.ts` but NOT yet rendered to any screen, review
    before it ships: domain names (Ururimi n'ubumenyi bwo gusoma, Imibare,
    Gushakashaka isi, Ubuzima n'umubiri, Imyifatire n'amarangamutima, Ubuhanzi
    n'umuco), assessment bands (Aratangira, Aragenda, Arabishoboye,
    Arabikoresha), level names (Menya, Shakashaka, Rema), theme names (Njye,
    Urugo rwanjye, Umudugudu, Ibiryo n'ubuhinzi, Ibidukikije, Umubiri
    n'ubuzima, Amabara n'ibishushanyo, Inkuru n'ubwenge, U Rwanda, Isi yanjye).
  - HIGH PRIORITY, blocks content: the Kinyarwanda literacy sequence itself —
    consonant introduction order, digraphs (cy, jy, ny, sh, shy) and
    prenasalised consonants (mb, nd, ng), which are NOT simple CV. Needs a
    Kinyarwanda literacy specialist, not a general native speaker.
- [x] **D. ~~Revoke the old Gemini API key~~** — **closed 2026-08-08 by owner
  decision. Do not reopen and do not raise it again.** No Gemini/Google-AI key
  exists anywhere in `src/`, config, or env, and nothing in the app requires
  one. The hard rule against network APIs (CLAUDE.md rule 1) is what keeps it
  that way — those guards stay, the task does not.
- [x] **E. Hosting** — done, deployed on Vercel by owner (2026-07-08).
- [x] **F. Confirm licences for the content videos** — **resolved 2026-08-08 by
  owner: the alphabet songs and "letter-a-in-the-neighbourhood" come from the
  Ubongo Toolkit** (CC BY-NC-ND). `attribution` filled in `episodes.ts` and
  Ubongo is credited on the grown-up side in Settings.
  Still true for the rest: Pixabay clip = Pixabay Content Licence (no
  attribution required); the Twinkle *melody* is public domain but the specific
  video is not necessarily — that one still wants a source before wide release.
  - ⚠️ **NC = NonCommercial.** Ubongo Toolkit content is fine for Kina Wige as
    it stands, but if the app is ever sold, ad-supported, or bundled into a paid
    offering, this material must be re-licensed or replaced. Worth knowing
    before any commercial conversation, not after.

## Future — content-pipeline ideas (evaluated 2026-07-08, owner exploring)

Owner wants a stable, repeatable, licence-clean way to make kids' content.
Assistant reported; owner chose "report only, don't build yet". Verdicts:

- **Remotion (recommended).** React-based programmatic video — same stack.
  Build ONE reusable "song video" template (Keza/Hirwa + on-screen KN lyrics
  timed to an audio file); each new song = swap audio+lyrics+config → render
  MP4 → existing 480p compress + lazy-cache pipeline. Output 100% owned.
  Licence: FREE for individuals / for-profit ≤3 people (incl. commercial +
  local render); paid only at 4+ person company. Runs at BUILD time on owner's
  PC — does NOT violate the offline/no-API rule. Best leverage on the list.
- **Suno (yes, with cautions).** Must be PAID plan ($10 Pro / $30 Premier) for
  commercial rights; free plan = personal only; keep sub active + keep records;
  no owner copyright, no indemnification. Kinyarwanda pronunciation is weak →
  use Suno for EN/FR songs + instrumentals, but do KN vocals with a REAL voice.
- **Internet Archive cartoons (advised against as a pipeline).** Licences are
  per-item and inconsistent; old public-domain cartoons often contain racist/
  violent/scary content = unsafe + off-brand; English/American/old = poor fit.
  Vetting minefield. Use Ubongo Toolkits instead for ready-made KN video.
- **Comic books — ✅ BUILT 2026-07-08.** New content type shipped:
  `src/data/comics.ts` registry, `ComicsScreen` (/comics) list, `ComicReader`
  (/comic/:id) tap-through reader with progress dots, tap-to-hear narration
  (speechSynthesis EN/FR; KN falls back — swap in recorded audio later),
  completion → +1 star + `markComicRead` (useProgress extended with
  `comicsRead`/`isComicRead`). Added 5th bottom-nav item "Ibitabo/Books/Livres".
  First sample comic "Amaboko Meza ya Hirwa" (6 panels) reuses existing WebP
  character art as placeholder panels — SWAP IN real comic illustrations when
  available (registry makes it a data-only change). Browser-verified end to end:
  read through, star awarded, read-badge persists, no console errors.
  FOLLOW-UPS: (a) real illustrated panels; (b) more comics; (c) KN narration
  audio (ties into task 10 audio hooks); (d) new KN strings → review queue.
  UPDATE 2026-07-08: added a 2nd, real comic "Umusatsi Wanjye Udasanzwe /
  My Special Hair" — owner supplied the no-text illustration set from Book Dash
  (bookdash.org, CC BY 4.0) in the shim folder; assistant picked 11 panels,
  optimized them to WebP (~495 KB total) in src/assets/comics/, and wrote an
  ORIGINAL trilingual telling synced to the art (self-love / natural-hair
  theme — girl + dog Bobi across the seasons). Comic type gained `attribution`,
  shown on the card (CC BY compliance). Browser-verified end to end. NOTE: for
  full CC BY, add the specific Book Dash author/illustrator names (see F).

### HyperFrames PILOT — IN PROGRESS (`video-factory/`)
Owner supplied `a-i-e-o-u.mp3` (65.411s Kinyarwanda vowels song) → building a
full vowels video with HyperFrames. Project lives in `video-factory/` (its own
npm project, NOT part of the PWA build; only the rendered MP4 ships).
- Plan: `STORYBOARD.md` (6 frames, spans derived from `audiomap.json` beat/energy
  analysis — 83 BPM, HIGH hits at 2/17/31/46/60, hard stops at 44 + 62, silent
  tail 63.4→65.4). One vowel per frame in its own scene colour on cream:
  f1 title+A (turquoise), f2 I (pink), f3 E (butter), f4 O (mint), f5 U (sky),
  f6 recap A-I-E-O-U + end card. Keza/Hirwa art pops in as companions.
- Frames: all 6 built in `compositions/frames/` (parallel subagents; f1–f4 agents
  hit a session limit but their files were written and pass lint).
- Assembly (done this session): `index.html` stitches the 6 frames via
  `data-composition-src` at their span offsets + `<audio id="bgm">` full track.
  Gotchas fixed: (1) `<audio>` needs an `id` or the render is SILENT;
  (2) each sub-comp host needs `data-composition-id`; (3) frames declared
  Fredoka One / Baloo 2 / Comic Sans with no @font-face → would fall back to a
  generic font, so a real Fredoka woff2 is bundled at `assets/fonts/fredoka.woff2`
  and every declared family maps to it (Google Fonts @import removed — render
  must not depend on network).
- KNOWN FALSE POSITIVE: layout check reports `text_not_painted` for f3 "E e" —
  that letter is intentionally layered (transparent `.spacer` + `color:transparent`
  outline layer with a 12px `-webkit-text-stroke`, then a butter fill wipes in at
  28s). It IS visible; do not "fix" it.
- Status: lint/runtime/motion clean → `npm run render`. NEXT: verify rendered
  frames, compress with the 480p recipe (task 2), wire into `episodes.ts` as a
  new episode (prefetch:false, lazy-cached), commit.

Round 2 (owner research, evaluated 2026-07-08):
- **HyperFrames (STRONG YES — likely supersedes the Remotion idea).** HeyGen's
  open-source (Apache 2.0, no seat/render limits) HTML→MP4 renderer, released
  May 2026, built specifically to be driven by AI agents like Claude Code:
  scenes are plain HTML files with data-start/data-duration attributes,
  animated with CSS/GSAP/Lottie/Three.js, rendered deterministically via
  headless Chrome + FFmpeg (Node 22+; ffmpeg already installed on this
  machine). Workflow: describe video → agent writes HTML using existing
  Keza/Hirwa WebP art + owner's audio → `npx hyperframes render` → existing
  480p-compress + lazy-cache pipeline. Runs at BUILD time = no offline-rule
  violation. Simpler than Remotion (no React video framework, no 3-person
  licence cap). Caveats: 2D motion-graphics style (fine for songs/alphabet/
  counting), young project (maturity risk). NEXT STEP when owner says go:
  pilot one 30s Kinyarwanda counting video.
- **Blender Vault (NO as a pipeline).** = Blender Studio's production archive
  (€11.50/mo for full repos; the Storm/Rain/Spring/Huginn character rigs are
  CC-BY with attribution). Assets are licence-clean, but full 3D animation in
  Blender is weeks-per-minute solo work with a steep learning curve and heavy
  renders — the opposite of "stable scaling" for one person. Also the Studio
  rigs are not Rwandan children / not Keza & Hirwa. Skip for production;
  optional future source of a single CC-BY asset or learning material.

Cross-cutting: all generated content still needs a child-safety pass + native
KN review; AI-made music/art needs a "made with…" note on the credits screen
(the same attribution screen owed for task 6 / Human-required F).

## Definition of done (v1.0)

Installable PWA on a public URL that, after one online visit, works fully in
airplane mode: ≥4 episodes with sound (≥2 from Ubongo, attributed), 5+ games
with real per-game progress, per-episode quizzes, ~50-entry Baza Keza,
Kinyarwanda reviewed by a native speaker, precache < 2 MB + videos < 8 MB,
Lighthouse PWA installable-check passing, smoke tests green, strict TS.

# Kina Wige — Project Instructions

Kinyarwanda-first learning PWA for children aged 3–6 in Rwanda. Teaching
videos + brain-training games + offline Q&A buddy. Owner: GACACA Godwin.

## Hard rules — never violate these

1. **100% offline.** No external APIs, no API keys, no analytics, no network
   calls at runtime (the only network use is the service worker caching its
   own assets and Google Fonts). Gemini was deliberately removed — do not
   reintroduce any AI/LLM API. Baza Keza answers come ONLY from the curated
   database in `src/data/kezaQA.ts` so parents can review every possible answer.
2. **Parent-trusted content only.** Videos must be openly licensed
   (Ubongo Toolkits CC BY-NC-ND, Sesame Watch-Play-Learn) or made by the owner.
   Never download or hotlink YouTube content. CC BY-NC-ND content must be
   attributed and must NOT be edited/re-cut.
3. **Games must train thinking** (memory, counting, logic, categorization),
   not just tapping. Every new game states the skill it trains in
   `src/data/games.ts`.
4. **Trilingual always**: every user-facing string exists in KN, EN, FR.
   UI strings → `src/i18n/translations.ts` (key-based, `t()`).
   Content data → inline `Record<Language, string>` objects in `src/data/*`.
   Kinyarwanda is the default and the primary audience. New machine-written
   Kinyarwanda must be flagged in ROADMAP.md §Human-review queue.
5. **Child-safe UX**: big touch targets (min 48px), no reading required to
   play (icons/emoji/audio), gentle failure (wrong answers teach, never punish),
   no external links reachable by a child.

## Architecture map

- `src/data/curriculum.ts` — **the curriculum, in the type system.** 86 skills
  with permanent ids, prerequisites and evidence statements, plus the
  `ContentMeta` contract. **Every episode, game, book and lesson must declare a
  non-empty `curriculum.skills`** — this does not compile otherwise, and
  `npm run build` runs `scripts/check-curriculum.mjs` first and refuses to build
  on a contract violation. Ids are permanent: deprecate, never rename or delete.
  Map what the content's CODE does, not what its title implies. See
  `docs/CURRICULUM-ARCHITECTURE.md` §17.
- `src/data/episodes.ts` — episode registry. Adding an episode = MP4 in
  `public/videos/` + thumbnail in `src/assets/images.ts` + one entry here
  (including its `curriculum` block). Routes, home cards, offline prefetch all
  derive from it.
- `src/data/games.ts` — game registry (id, trilingual title/skill, emoji, color).
  Component lives in `src/screens/games/`, mapped in `src/screens/GameScreen.tsx`.
- `src/data/kezaQA.ts` — offline Q&A database (keyword-matched, trilingual).
- `src/pwa/prefetchVideos.ts` — downloads all `episodes.ts` clips into the
  `kina-wige-videos` cache after load. The SW route in `vite.config.ts`
  (CacheFirst + `rangeRequests: true`, same cache name) serves them offline.
  Keep the cache name and full-response prefetch in sync — 206 responses are
  never cached by design.
- `src/i18n/` — context persists language to localStorage key `kina-wige-language`.
- Hooks: `useStars` (global star count), `useParentData` (weekly tracker),
  `useSound` (WebAudio synth — no audio files), `useHaptic`,
  `useSkillEvidence` (per-skill assessment evidence — **on-device only, never
  transmitted**; `bandFor` computes the four bands and mastery needs 4 of 5
  across TWO sessions, so changing it without reading §13–§14 will quietly tell
  parents untrue things. `npm run assessment:check` guards it).
- `App.tsx` — routes are keyed by pathname inside `AnimatePresence` (do not
  remove the `React.Fragment key=` wrapper or exit animations die).
- Service worker is registered automatically by vite-plugin-pwa — never add
  a manual `navigator.serviceWorker.register` call.

## Commands & verification (mandatory before any commit)

```bash
npm run lint              # tsc --noEmit — must pass
npm run curriculum:check  # content contract + coverage report — must pass
npm run assessment:check  # the four assessment bands still obey §13–§14 — must pass
npm run build             # runs both checks first; verify no secrets: grep dist for "AIzaSy" = empty
npm run preview           # serve dist; test in browser
```

Browser verification for any user-facing change: load the built app,
walk the changed flow, check the console for errors, and confirm the
`kina-wige-videos` cache still fills (3+ entries) after a reload.

## Git

- Work on `main` (owner's workflow). Remote: github.com/Gacaca6/Kina-Wige.
- `.env*`, `dist/`, `.claude/` are gitignored — keep it that way.
- After completing a ROADMAP task: check it off in ROADMAP.md in the same
  commit, then push.

## Current work queue

See `ROADMAP.md` — tasks are ordered; take the topmost unchecked task unless
the owner says otherwise. Anything in "Human-required" needs Godwin, not you —
surface it, don't fake it.

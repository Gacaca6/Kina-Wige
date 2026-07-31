# Kina Wige — Product Requirements Document

**Version:** 2.0 (supersedes PRD v1.0)
**Date:** 2026-07-31
**Owner:** GACACA Godwin
**Status:** Active — this document governs the premium redesign
**Scope:** 12 months (2026-08 → 2027-07), team of 3, budget RWF 10,000,000

> **Why v2 exists.** PRD v1.0 specified AI personalisation, Firebase/Supabase
> analytics and a Flutter rewrite. All three violate the project's hard rules
> (`CLAUDE.md`), contradict our own privacy promise, and are unfundable at our
> budget. v2 keeps v1's ambition and replaces its plan with one we can ship.
> Section 3 lists exactly what was removed and why.

---

## 1. Summary

Kina Wige is a Kinyarwanda-first learning app for children aged 3–6 in Rwanda:
teaching videos, thinking games, illustrated stories and a parent companion —
all working with **zero internet after install**.

**The thesis for this redesign:** onboarding is *two journeys wearing one coat* —
a short, quiet, compliant lane for the parent, and a joyful, wordless, immediate
lane for the child. Neither may pay for the other's friction.

**What "premium" means here** — and does not:

| Premium is | Premium is not |
| --- | --- |
| Restraint: one dominant colour, semantic accents | More colours, more sparkle |
| Craft in motion: 250–350 ms, springy, never strobing | Constant animation |
| Perceived speed: feedback < 100 ms, no spinners | Loading screens with tips |
| Original illustrated characters | Emoji shipped as art |
| One type scale, one spacing scale, honoured everywhere | Ad-hoc sizes per screen |
| Silence and space | Filling every pixel |

Dark themes, glassmorphism and heavy 3D are explicitly **not** the route: they
fail our audience, our brand rules and our device reality.

---

## 2. Ground truth — what exists today (2026-07-31)

Any requirement below is written against this reality, not a greenfield.

| Area | Actual state |
| --- | --- |
| Platform | Installable PWA — React 19, Vite 6, TypeScript, Tailwind 4, `motion`, react-router 7 |
| Hosting | Vercel, auto-deploy on push to `main` |
| Content | 7 episode entries, 6 games (handwash, memory, counting, pattern, sorting, +1) |
| Offline | Full. Service worker precache ≈ 1.29 MB; videos cached via prefetch + lazy `cacheEpisodeClips()` |
| Video weight | `public/videos` ≈ 59 MB on disk (480p CRF 26); small clips prefetch, long songs cache on first open |
| Images | `src/assets` ≈ 832 KB (WebP, optimised from 3.4 MB) |
| Audio | **No audio files.** `useSound` synthesises 18 effects in WebAudio |
| Type | Fredoka (display) + Nunito (body), bundled locally via `@fontsource` |
| Languages | KN / EN / FR, key-based `t()`, KN is default |
| Q&A | "Baza Keza" answers from curated `src/data/kezaQA.ts` — no model, no API |
| Storage | `localStorage` only: language, progress, stars, parent weekly tracker |
| Analytics | **None.** No SDK, no telemetry, no network calls at runtime |

**Size budget is a feature, not an accident.** The app shell is what must stay
small; video is cached on demand. Budgets in §4 are written accordingly.

---

## 3. Non-goals — explicitly out of scope

Listing these is a requirement. Each was in v1.0 and is now removed.

| Removed | Why |
| --- | --- |
| **AI / LLM personalisation, adaptive difficulty, reading assistance** | Requires network + APIs. Violates hard rule 1. Gemini was deliberately removed once; it does not come back. Difficulty adapts via **local deterministic rules**, not a model. |
| **Firebase / Supabase / cloud sync** | Runtime network calls. Violates hard rule 1. Also introduces a data controller relationship for under-6s we do not want. |
| **Analytics / telemetry of any kind** | Contradicts our own promise ("no ads, no tracking") and is the highest-risk data category under COPPA 2026 + GDPR-K. See §10 for how we measure instead. |
| **Flutter rewrite** | Discards a working, shipped, offline PWA — our single strongest asset ("not a concept, live right now"). Unfundable and unnecessary. |
| **Ads, third-party SDKs, external links reachable by a child** | Brand rule and hard rule 5. |
| **Accounts, passwords, email for children** | Children get profiles on-device, never credentials. |
| **Leaderboards, streaks, coins, loss-aversion mechanics** | See §6 — wrong for 3–6 and contrary to "don't reward with fear". |
| **Community Learning pillar** | Cut for scope. Revisit post-pilot. |

---

## 4. Constraints (non-negotiable)

**C1 — 100% offline.** No external APIs, no analytics, no runtime network calls.
First run must reach the child's first win with the device in airplane mode.

**C2 — Size budget.**
- App shell precache (JS + CSS + fonts + UI art): **≤ 2.0 MB** (today ≈ 1.29 MB)
- `src/assets` total: **≤ 1.2 MB**
- Any single illustrated character: **≤ 40 KB** (SVG preferred, else WebP)
- Video: 480p CRF 26 AAC 128k `+faststart`; only short clips prefetch

**C3 — Trilingual, Kinyarwanda-first.** Every user-facing string in KN/EN/FR.
Machine-written Kinyarwanda goes to the ROADMAP human-review queue.

**C4 — No reading required for a child.** Every instruction is icon + animation
+ (where available) audio. Text is for adults.

**C5 — Touch targets.** Child lane ≥ **64 px**, spaced ≥ 16 px (raised from the
old 48 px floor). Adult lane ≥ 44 px.

**C6 — Gentle failure.** No scolding, no red error states, no punishing sound in
the child lane. A wrong tap redirects and teaches.

**C7 — Licensed content only.** Openly licensed (Ubongo CC BY-NC-ND, Sesame
Watch-Play-Learn) or owner-made. CC BY-NC-ND must be attributed and never re-cut.

**C8 — Data stays on the device.** All progress is `localStorage`. Nothing is
transmitted. The parent can view and erase everything.

---

## 5. Users and their jobs

| User | Job to be done | Success looks like |
| --- | --- | --- |
| **Child, 3–6** | "Let me play something fun, now, that I can't get wrong." | Reaches a win in < 60 s, wordlessly, and wants to come back |
| **Parent/guardian** | "Give my child something safe in our language, and show me it's working." | Sets up once in < 90 s; gets a warm weekly summary |
| **ECD teacher / centre** | "Run a group activity with no reliable internet." | Loads on a shared phone/tablet offline; switch child in one tap |
| **Funder / partner (NGO, gov)** | "Show me evidence of learning." | Pilot pre/post results, not vanity metrics |

Primary design target is the **child**; primary trust target is the **parent**.

---

## 6. Pedagogical position (resolved)

v1.0 listed Montessori, Reggio Emilia, inquiry-based learning *and* gamification
together. Montessori and Reggio are philosophically opposed to extrinsic reward
economies, so that list contradicted itself. **Resolved position:**

> **Onboard like the best consumer apps; reward like Montessori.**

Concretely:
- **Rewards are informational and occasional**, celebrating *effort and progress* —
  never a currency, never a streak, never a leaderboard.
- **Stars stay**, but are re-framed as a *memento of what you did* (a filled
  page/collection), not a balance to spend or lose. Nothing is ever taken away.
- **Control of error**: the material shows the child they're right; no buzzer.
- **The habit loop is belonging, not loss-aversion** — "Ngabo is glad you came
  back and your world grew a little", never "your streak will die".

Grounding: the overjustification effect (Deci, Koestner & Ryan, 2001) — rewarding
an activity a child already enjoys can reduce intrinsic motivation. This is also
the position our own brand rule "don't reward with fear" implies.

---

## 7. Canonical product ecosystem (resolved)

Three documents previously listed 4, 5 and 6 pillars. **Canonical list — five,
of which two are in scope this cycle:**

| # | Pillar | Kinyarwanda surface | Status this cycle |
| --- | --- | --- | --- |
| 1 | **Kina Wige Kids** — teaching videos | Amasomo | **In scope** |
| 2 | **Kina Play** — thinking games | Imikino | **In scope** |
| 3 | **Parent Companion** — guidance + weekly tracker | Ababyeyi | **In scope** |
| 4 | **Little Learners Library** — illustrated stories | Ibitabo | Scope-limited: 3 offline picture-stories only |
| 5 | **Teacher Hub** — ECD centre resources | — | **Deferred** to post-pilot |

Marketing may describe the full five; the product ships 1–3 plus a minimal 4.

---

## 8. Characters (resolved)

| Character | Role | Build status |
| --- | --- | --- |
| **Keza** | Peer avatar a child can choose as "me"; voice of Baza Keza Q&A | Exists |
| **Hirwa** | Peer avatar a child can choose as "me" | Exists |
| **Ngabo** | Onboarding guide + celebrator — the relationship anchor | **New — needs art** |
| **Inyoni** | Wise helper; gives hints, never scolds | **New — needs art, lower priority** |

**Decision needed from Godwin (§13-A):** Ngabo and Inyoni are new to the brand
sheet and do not exist as assets. Ngabo is required for the redesigned onboarding.
If art is not funded this cycle, Keza becomes the guide and Ngabo/Inyoni are cut —
that is an acceptable fallback and costs nothing.

---

## 9. Requirements

Priority: **P0** = redesign ships without it only over the owner's objection ·
**P1** = this cycle · **P2** = next cycle.

### P0-1 · Two-lane first run
Rebuild first run as an explicit child lane and parent lane.

- **P0-1.1** On a cold, offline install the child reaches a **guaranteed win**
  in ≤ 60 s with **zero typed input** and **no account**.
- **P0-1.2** Splash introduces the guide character with motion + a synthesised
  signature sound. No spinner as the first frame.
- **P0-1.3** A **"Just play" path** is the default: the child may play
  immediately in a **zero-data guest mode**. The parent lane is required only
  when progress is first saved to a named profile.
- **P0-1.4** The child never sees a form, keyboard, legal text or price.
- **P0-1.5** Parent lane is visually distinct (parent-blue chrome, calmer type)
  so a child knows instantly they've hit an adult screen.

*Accept:* airplane-mode install → first win, timed ≤ 60 s, no keyboard shown; a
child tester can complete it without an adult reading anything aloud.

### P0-2 · Parent gate
- **P0-2.1** A gate guards **every** exit from the child zone: settings, parent
  area, data controls, attribution links, any external URL.
- **P0-2.2** The gate is an **arithmetic or spelled-number challenge**, not a
  timed press-and-hold (a 5-year-old defeats a hold).
- **P0-2.3** The gate is never a child-visible dead end — cancelling returns to
  play, gently.

*Accept:* no reachable path from any child screen to settings, external links or
data controls without passing the gate.

### P0-3 · On-device profiles, no accounts
- **P0-3.1** Up to **4 child profiles** stored locally under one device.
- **P0-3.2** Switching child = **one tap on a face**. No logout, no password.
- **P0-3.3** Each profile keeps its own progress, language and theme.
- **P0-3.4** No credentials, email or birthday are ever collected for a child.
  Age band is stored as a band (3–4 / 5–6), not a date of birth.

*Accept:* two profiles on one device keep separate progress across reloads;
inspecting `localStorage` shows no PII beyond a display name chosen by the parent.

### P0-4 · Design-system adoption
- **P0-4.1** All screens consume tokens from `docs/DESIGN-SYSTEM.md` — no
  hard-coded hex, no ad-hoc font sizes or spacings.
- **P0-4.2** Semantic colour is enforced: green = child lane, blue = parent lane,
  gold = celebration, coral/purple = category tags only.
- **P0-4.3** Child-lane targets ≥ 64 px; adult ≥ 44 px.
- **P0-4.4** `prefers-reduced-motion` honoured everywhere.

*Accept:* `grep` for raw hex in `src/` returns only `index.css`; a reduced-motion
pass shows no transform animation.

### P0-5 · Privacy posture, provable
- **P0-5.1** Parent area lists **exactly** what is stored, on-device only.
- **P0-5.2** A **"Delete everything"** control wipes all app storage and returns
  to first run.
- **P0-5.3** No analytics SDK, no network request at runtime except the service
  worker fetching its own assets.

*Accept:* DevTools Network tab shows **zero** third-party requests during a full
session; delete control leaves `localStorage` empty.

### P1-6 · Voice-first instruction (Kinyarwanda)
- **P1-6.1** Every child instruction is spoken in Kinyarwanda, mirrored by an
  icon and a demonstrating animation.
- **P1-6.2** Audio ships as **Opus, mono, ~16 kbps**, in **lazily-cached packs** —
  never in the app-shell precache (protects C2).
- **P1-6.3** A visible **mute** and a parent "calm mode" exist; nothing depends
  on sound alone.

*Blocked on ROADMAP Human-required §B (Godwin records the Kinyarwanda VO).*
*Accept:* with audio off, every instruction is still solvable from icon + motion.

### P1-7 · Original character art replaces emoji
- **P1-7.1** Guide, avatars and celebration art are **illustrated assets**, not
  emoji. Emoji render differently on every Android build — the guide would
  literally change face between phones.
- **P1-7.2** SVG where possible; ≤ 40 KB per character.
- **P1-7.3** Category/skill emoji in `games.ts` may remain until icon art exists.

### P1-8 · Parent Companion upgrade
- **P1-8.1** Weekly summary in plain language: what was played, what it teaches,
  one suggested offline activity to do together.
- **P1-8.2** Progress is descriptive ("practised counting to 5"), never a score
  or a comparison against other children.

### P2-9 · Little Learners Library (minimal)
Three offline illustrated stories, KN-first, read-along highlighting, no network.

### P2-10 · Difficulty that adapts locally
Deterministic, on-device rules only (e.g. two consecutive successes → next band).
No model, no network. Explicitly *not* "AI".

---

## 10. Success metrics — and how we measure without tracking

We have **no analytics by design**, so metrics are gathered through the funded
pilot and on-device data the parent can see, never telemetry.

| Metric | Target (12 months) | How measured |
| --- | --- | --- |
| First-win completion | **≥ 90%** of children reach the first win unaided | Moderated sessions, 8–12 children |
| Time to first win | **≤ 60 s** median, offline cold start | Stopwatch in moderated sessions |
| Setup completion (parent) | **≥ 85%** finish the parent lane in ≤ 90 s | Moderated sessions |
| Letter/number recognition | **≥ 30%** improvement pre → post | Pilot pre/post assessment, 100+ households, 5 ECD centres |
| Repeat play | **≥ 40%** of pilot children play ≥ 3 days in a week | Parent diary + on-device weekly tracker read *with consent* |
| Parent trust | **≥ 80%** agree "safe and in our language" | Pilot exit survey |
| App-shell size | **≤ 2.0 MB** precache | CI check on `npm run build` |
| Offline integrity | **100%** of pilot sessions complete with no connectivity | Field observation |

Any metric we cannot obtain this way is not a metric we keep.

---

## 11. Release plan

| Phase | Window | Contents |
| --- | --- | --- |
| **R1 — Foundation** | Aug–Sep 2026 | Design system landed; tokens enforced; parent gate; on-device profiles (P0-2, P0-3, P0-4) |
| **R2 — First run** | Oct–Nov 2026 | Two-lane onboarding, guest mode, guide character, privacy posture (P0-1, P0-5) |
| **R3 — Voice & art** | Dec 2026–Feb 2027 | Kinyarwanda VO packs, illustrated characters, Parent Companion upgrade (P1-6, P1-7, P1-8) |
| **R4 — Pilot** | Mar–May 2027 | 100+ households, 5 ECD centres, pre/post assessment; fix what the field shows |
| **R5 — Consolidate** | Jun–Jul 2027 | Library minimal, local difficulty ramp, hardening (P2) |

Every phase ends with `npm run lint`, `npm run build`, and an offline
browser walk-through, per `CLAUDE.md`.

---

## 12. Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| **Voice-over blows the size budget** | High | Opus ~16 kbps mono, lazily-cached packs, never in precache (P1-6.2). KN ships first; EN/FR packs are optional downloads |
| **Character art unfunded** | Medium | Keza becomes the guide; Ngabo/Inyoni cut without redesign impact (§8) |
| **Scope creep back toward v1.0** | High | §3 is binding; Teacher Hub and Community Learning are deferred in writing |
| **Redesign regresses offline behaviour** | High | Airplane-mode walk-through is a release gate, not a test case |
| **"Under 5 MB" claim drifts** | Medium | CI asserts precache ≤ 2.0 MB; pitch materials cite *app shell*, video cached on demand |
| **Compliance claim outruns reality** | High | §13-C: counsel review before any COPPA/GDPR-K claim appears in public material |

---

## 13. Open decisions — owner only

- **A. Character art budget.** Fund Ngabo (+ optionally Inyoni), or promote Keza
  to guide and cut both? Blocks P1-7 and the onboarding art direction.
- **B. Kinyarwanda VO recording.** ROADMAP Human-required §B. Blocks P1-6; the
  redesign ships icon+motion-only until then.
- **C. Compliance review.** We claim "COPPA & GDPR compliant" on brand material.
  Because we collect nothing and transmit nothing, our position is strong — but
  the claim needs counsel sign-off before it appears publicly again.
- **D. Native-speaker Kinyarwanda review.** ROADMAP Human-required §C.
- **E. Licence confirmation** for the added content videos. ROADMAP §F.

---

## Appendix — corrections applied from PRD v1.0

| v1.0 said | v2.0 says | Reason |
| --- | --- | --- |
| "AI-powered personalization", "adaptive difficulty", "reading assistance", "learning analytics" | Removed; local deterministic difficulty only (P2-10) | Requires APIs — violates hard rule 1; Gemini was removed deliberately |
| "Flutter, Supabase/Firebase, cloud sync, analytics, AI services" | React 19 + Vite PWA, `localStorage`, no backend | Matches what is shipped; avoids discarding a working product |
| Six pillars incl. Teacher Hub + Community Learning | Five canonical, two deferred (§7) | Fundability at RWF 10M / 3 people |
| "Montessori… gamification… positive reinforcement" together | Single resolved position (§6) | The original list was self-contradictory |
| Metrics with no targets | Targets + measurement method (§10) | Unmeasurable metrics are not requirements |
| No non-goals section | §3, binding | Scope control |
| No acceptance criteria | Every P0/P1 has them | Testability |
| Target users "3–6" only | Child / parent / teacher / funder jobs (§5) | The parent is the trust decision-maker |

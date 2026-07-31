# Kina Wige — Design System

**Version:** 1.0
**Date:** 2026-07-31
**Status:** Canonical. Supersedes the brand-sheet image for all engineering use.
**Applies to:** the Kina Wige PWA (React 19 · Tailwind 4 · `motion`)

> **Why this document exists.** The brand sheet is art, not a specification: its
> type specimens are unreadable, it names a font that does not exist
> ("Nunito Rounded"), and its palette disagrees with the shipped app. This file
> is the single source of truth. Where they conflict, **this file wins.**

---

## 0. Conflicts resolved

| Conflict | Resolution |
| --- | --- |
| Three green primaries in play — app `#2D6A4F`, brand sheet `#2E7D32`, pitch deck `#2E7D32` | **`#2E7D32` is the brand anchor** (it matches the logo and all public material). The app migrates via §9. |
| "Nunito Rounded" (does not exist) | **Fredoka** (display) + **Nunito** (body) — already installed via `@fontsource`, bundled locally, offline-safe |
| Five competing chromatic colours | Kept, but made **strictly semantic** (§1.2). One dominant hue; the rest earn their place |
| Brand sheet duplicates a value ("Curious & Creative" appears twice, once truncated) | Canonical values: Child-Centred · Safe & Trustworthy · Culturally Proud · Curious & Creative · Inclusive · Growth Mindset |
| "GDPRK" | GDPR-K |
| Emoji used as characters in mockups | Emoji are **placeholders only**; production requires illustrated assets (PRD P1-7) |

---

## 1. Colour

### 1.1 The ramps

One dominant hue carries ~70% of every screen. Everything else is an accent with
a defined job.

**Ibyatsi green — brand, structure, the child lane**

| Token | Hex | Use |
| --- | --- | --- |
| `green-50` | `#F2F8F3` | Page wash |
| `green-100` | `#E1EFE3` | Selected/active tint |
| `green-200` | `#C3DFC7` | Hairlines on green |
| `green-300` | `#97C79D` | Disabled on green |
| `green-400` | `#5FA968` | Illustration mid-tone |
| `green-500` | `#3E8E44` | Hover / pressed |
| **`green-600`** | **`#2E7D32`** | **Brand anchor** — primary buttons, logo lockup |
| `green-700` | `#246428` | Pressed, headings on light |
| `green-800` | `#1B4D1F` | Deep type |
| `green-900` | `#133716` | Max contrast ink on green |

**Izuba gold — celebration only**

| Token | Hex | Use |
| --- | --- | --- |
| `gold-300` | `#FFE082` | Star fill light |
| `gold-400` | `#FFD54F` | Star fill |
| `gold-500` | `#FBC02D` | Celebration accent, reward burst |
| `gold-600` | `#E0A800` | Gentle "try again" nudge (never red) |

> Gold appears **only** at a moment of success or a gentle redirect. It is never
> chrome, never a background, never a button that isn't a celebration.

**Ikirere blue — the grown-up lane only**

| Token | Hex | Use |
| --- | --- | --- |
| `sky-100` | `#E3F2FD` | Parent-area wash |
| `sky-300` | `#90CAF9` | Parent hairline |
| `sky-500` | `#42A5F5` | Parent controls |
| `sky-700` | `#1565C0` | Parent headings, links |

> Blue is a **wayfinding signal**: if a screen is blue, an adult is meant to be
> holding the phone. Never use blue in the child lane.

**Category tags only — never chrome**

| Token | Hex | Category |
| --- | --- | --- |
| `coral-500` | `#FF6F61` | Stories / language |
| `purple-500` | `#7E57C2` | Creativity / music |

**Surface & ink**

| Token | Hex | Use |
| --- | --- | --- |
| `canvas` | `#FAFAF7` | App background (warm white) |
| `raised` | `#FFFFFF` | Cards, sheets |
| `sunken` | `#F1F4EC` | Wells, inactive tracks |
| `ink` | `#212121` | Primary text |
| `ink-muted` | `#5B665B` | Secondary text |
| `ink-faint` | `#98A198` | Captions, meta |
| `on-dark` | `#FFFFFF` | Text on green/blue fills |
| `destructive` | `#C62828` | **Parent lane only** (delete data) |

### 1.2 Semantic rule (enforced)

```
green  → brand, structure, the child's world
gold   → celebration and gentle redirect
blue   → the grown-up lane
coral  → category tag: stories / language
purple → category tag: creativity / music
red    → parent lane only, destructive actions only
```

**Forbidden:** red or any harsh error colour in the child lane (constraint C6);
blue chrome in the child lane; more than one accent hue on a single screen.

### 1.3 Contrast

All text meets **WCAG AA** (4.5:1 body, 3:1 for ≥ 24 px bold).
Verified pairs: `ink` on `canvas` 15.3:1 · `on-dark` on `green-600` 5.6:1 ·
`green-700` on `canvas` 7.4:1 · `sky-700` on `sky-100` 6.9:1.
Never place `gold-500` text on white — use `green-800` and let gold be the fill.

---

## 2. Type

**Display / headings — Fredoka** (rounded, warm, high personality)
**Body / UI — Nunito** (rounded terminals, excellent at small sizes)

Both are bundled locally through `@fontsource` — **no Google Fonts request at
runtime**, which keeps constraint C1 intact.

| Role | Font | Weight | Size (fluid) | Line height | Tracking |
| --- | --- | --- | --- | --- | --- |
| `display` | Fredoka | 600 | `clamp(32px, 7vw, 52px)` | 1.05 | −0.02em |
| `title` | Fredoka | 600 | `clamp(24px, 5vw, 34px)` | 1.15 | −0.01em |
| `heading` | Fredoka | 500 | `clamp(19px, 3.6vw, 24px)` | 1.25 | 0 |
| `body-lg` | Nunito | 600 | `clamp(16px, 3vw, 19px)` | 1.5 | 0 |
| `body` | Nunito | 400 | `16px` | 1.55 | 0 |
| `label` | Nunito | 700 | `14px` | 1.3 | +0.01em |
| `caption` | Nunito | 600 | `13px` | 1.4 | +0.02em |
| `child-cta` | Fredoka | 600 | `clamp(20px, 4.5vw, 26px)` | 1.2 | 0 |

**Rules**
- Never below **14 px** in the parent lane, never below **16 px** anywhere a
  child's guardian must read at arm's length.
- Child-facing screens carry **at most one line** of text; it exists for the
  adult nearby, never as the child's instruction (constraint C4).
- No italics in the child lane (harder for emerging readers, no benefit here).
- Kinyarwanda runs longer than English — design every label to survive
  **+35% length** without reflowing the layout.

---

## 3. Space, radius, elevation

**Spacing** — 4 px base: `1=4 · 2=8 · 3=12 · 4=16 · 5=20 · 6=24 · 8=32 · 10=40 · 12=48 · 16=64`
Section rhythm is `6` (24 px) inside cards, `8`–`12` between blocks.

**Radius** — generous and soft; nothing sharp in the child lane.

| Token | Value | Use |
| --- | --- | --- |
| `radius-sm` | 12 px | Chips, tags |
| `radius-md` | 18 px | Buttons, inputs |
| `radius-lg` | 26 px | Cards, tiles |
| `radius-xl` | 34 px | Sheets, hero panels |
| `radius-full` | 999 px | Avatars, pills, FABs |

**Elevation** — warm and green-tinted, never neutral grey/black.

| Token | Value |
| --- | --- |
| `shadow-sm` | `0 1px 2px rgba(27,77,31,.06), 0 2px 6px rgba(27,77,31,.05)` |
| `shadow-md` | `0 4px 10px rgba(27,77,31,.07), 0 10px 24px rgba(27,77,31,.06)` |
| `shadow-lg` | `0 10px 24px rgba(27,77,31,.09), 0 24px 56px rgba(27,77,31,.08)` |
| `shadow-glow` | `0 12px 32px rgba(46,125,50,.28)` (primary CTA only) |

Maximum **two** elevation levels visible on one screen. Depth is a hierarchy
signal, not decoration.

---

## 4. Touch and layout

| Context | Min target | Min gap |
| --- | --- | --- |
| Child lane — primary choice tiles | **80 px** | 20 px |
| Child lane — any tappable | **64 px** | 16 px |
| Parent lane | **44 px** | 8 px |

- **3–5 choices maximum** per child screen. Cognitive load is the enemy at 3–6.
- Thumb reach: primary child actions sit in the **lower 60%** of the viewport.
- Nothing critical within **16 px** of a screen edge (small hands, cases, notches).
- The child lane is **flat navigation** — a child is never more than one tap from
  home, and there is no nested menu anywhere in it.

---

## 5. Motion

Motion is where "premium" is actually felt. It must be warm, physical, and
never frantic.

| Token | Duration | Easing | Use |
| --- | --- | --- | --- |
| `motion-tap` | 100 ms | `ease-out` | Press feedback — must be < 100 ms perceived |
| `motion-ui` | 220 ms | `cubic-bezier(.32,.72,0,1)` | Buttons, chips, toggles |
| `motion-screen` | 300 ms | `cubic-bezier(.16,1,.3,1)` | Screen transitions (250–350 ms band) |
| `motion-celebrate` | 600 ms | spring `stiffness 260, damping 18` | Star, celebration |
| `motion-guide` | 900 ms | ease-in-out, loops | Character idle breathing |

**Signature behaviours**
- **Squash-and-stretch on select**: chosen tile scales `1 → 1.06 → 1`, saying
  "yes, that one."
- **Guide entrance**: soft bounce in, never a strobe or a flash.
- **Celebration**: one gentle hop plus a slow star; no confetti storm, no shake.
- **Screens slide warmly** — nothing snaps, nothing pops.

**Hard rules**
- No flashing above **3 Hz**, ever (photosensitivity).
- Every animation has a **reduced-motion fallback** — a 150 ms cross-fade:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .15s !important;
  }
}
```

- Never animate a layout property (`width`, `top`) — `transform`/`opacity` only.
  Budget Androids drop frames instantly otherwise.

---

## 6. Sound

Audio is synthesised in WebAudio (`useSound`) — **no audio files in the shell**,
which is why the app is small. Keep it that way.

| Cue | Character |
| --- | --- |
| `tap` | Soft, short, ~800 Hz sine — confirms every touch |
| `success` | Rising two-note, warm |
| `star_ding` | Bright but gentle — celebration only |
| `error` | **Never a buzzer.** A soft downward "hmm" that invites a retry |

**Rules**
- Prime the audio context on the splash so voice works from screen two.
- A visible **mute** control is always reachable; a parent **calm mode** reduces
  both motion and sound.
- **Nothing may depend on sound alone** — every audio cue has a visual twin.
- Recorded Kinyarwanda voice (PRD P1-6) ships as **Opus mono ~16 kbps in lazily
  cached packs**, never in the precache.

---

## 7. Components

**Primary CTA (child)** — `green-600` fill, `on-dark` text, `radius-full`,
min-height 72 px, `shadow-glow`, Fredoka 600, icon left of label, squash on press.

**Choice tile (child)** — `raised` fill, `radius-lg`, ≥ 80 px square, illustration
or icon at ~56 px, one short label beneath, `shadow-md`; selected state adds a
3 px `green-600` ring and `green-100` tint. Never rely on colour alone to show
selection — the ring plus a scale change carry it.

**Card** — `raised`, `radius-lg`, padding `6`, `shadow-sm`; the whole card is the
tap target in the child lane.

**Parent panel** — `sky-100` wash, `sky-700` headings, plainer Nunito type,
44 px controls. The visual register shift *is* the signal.

**Parent gate** — arithmetic or spelled-number challenge (never a timed hold);
`sky` chrome; cancel always returns gently to play.

**Star / reward** — `gold-400` fill with `gold-600` edge; appears with
`motion-celebrate`; **never a counter that can go down**. Stars accumulate as a
memento (PRD §6).

**Bottom dock** — max 4 destinations, ≥ 64 px each, icon + short label, active
item in `green-600` with a filled pill.

---

## 8. Illustration & iconography

- **Characters** — Keza, Hirwa, Ngabo, Inyoni. Consistent line weight, warm
  palette, friendly proportions (large head, simple hands). **SVG preferred**,
  ≤ 40 KB each. Never ship emoji as a character (they change per Android build —
  the guide would literally change face between phones).
- **Icons** — `lucide-react`, stroke 2–2.25 px, rounded caps. In the child lane,
  icons are **always** paired with an illustration or animation, never alone.
- **Photography** — real Rwandan children, warm natural light, authentic settings.
  No stock-corporate imagery.
- **Do not** use scary imagery, dark themes, dense text, or fear as a motivator.

---

## 9. Tokens — paste into `src/index.css`

Tailwind 4 CSS-first config. This block replaces the current `@theme`.

```css
@import "tailwindcss";

@theme {
  /* ── Ibyatsi green — brand, structure, child lane ── */
  --color-green-50:  #F2F8F3;
  --color-green-100: #E1EFE3;
  --color-green-200: #C3DFC7;
  --color-green-300: #97C79D;
  --color-green-400: #5FA968;
  --color-green-500: #3E8E44;
  --color-green-600: #2E7D32;   /* BRAND ANCHOR */
  --color-green-700: #246428;
  --color-green-800: #1B4D1F;
  --color-green-900: #133716;

  /* ── Izuba gold — celebration only ── */
  --color-gold-300: #FFE082;
  --color-gold-400: #FFD54F;
  --color-gold-500: #FBC02D;
  --color-gold-600: #E0A800;

  /* ── Ikirere blue — grown-up lane only ── */
  --color-sky-100: #E3F2FD;
  --color-sky-300: #90CAF9;
  --color-sky-500: #42A5F5;
  --color-sky-700: #1565C0;

  /* ── Category tags only ── */
  --color-coral-500:  #FF6F61;
  --color-purple-500: #7E57C2;

  /* ── Surface & ink ── */
  --color-canvas:      #FAFAF7;
  --color-raised:      #FFFFFF;
  --color-sunken:      #F1F4EC;
  --color-ink:         #212121;
  --color-ink-muted:   #5B665B;
  --color-ink-faint:   #98A198;
  --color-on-dark:     #FFFFFF;
  --color-destructive: #C62828;  /* parent lane only */

  /* ── Type ── */
  --font-display: "Fredoka", system-ui, sans-serif;
  --font-body:    "Nunito", system-ui, sans-serif;

  /* ── Radius ── */
  --radius-sm: 12px;
  --radius-md: 18px;
  --radius-lg: 26px;
  --radius-xl: 34px;

  /* ── Elevation (warm, green-tinted) ── */
  --shadow-sm:   0 1px 2px rgba(27,77,31,.06), 0 2px 6px rgba(27,77,31,.05);
  --shadow-md:   0 4px 10px rgba(27,77,31,.07), 0 10px 24px rgba(27,77,31,.06);
  --shadow-lg:   0 10px 24px rgba(27,77,31,.09), 0 24px 56px rgba(27,77,31,.08);
  --shadow-glow: 0 12px 32px rgba(46,125,50,.28);

  /* ── Motion ── */
  --ease-ui:     cubic-bezier(.32,.72,0,1);
  --ease-screen: cubic-bezier(.16,1,.3,1);
  --dur-tap:     100ms;
  --dur-ui:      220ms;
  --dur-screen:  300ms;
}

body {
  font-family: var(--font-body);
  background-color: var(--color-canvas);
  color: var(--color-ink);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .15s !important;
  }
}
```

### Migration map (old token → new)

| Old | New | Note |
| --- | --- | --- |
| `--color-primary` `#2D6A4F` | `green-600` `#2E7D32` | Aligns app to logo + all public material |
| `--color-primary-light` `#40916C` | `green-500` | |
| `--color-secondary` `#52B788` | `green-400` | |
| `--color-accent` `#FFD700` | `gold-400` | Celebration only from now on |
| `--color-accent-warm` `#FF9800` | `gold-600` | Becomes the gentle-redirect tone |
| `--color-surface` `#F0FFF4` | `canvas` `#FAFAF7` | Warm white, matches brand |
| `--color-surface-warm` `#FFF8E7` | `sunken` | |
| `--color-dark` `#1B4332` | `green-800` | |
| `--color-danger` `#E91E63` | `destructive` `#C62828` | **Parent lane only** — remove from all child screens |
| `--font-headline` / `--font-display` | `--font-display` | One display token |

Migrate ramp-by-ramp with `npm run lint && npm run build` and an offline
walk-through after each step. `games.ts` stores Tailwind class strings
(`bg-primary-light`) — update those in the same pass.

---

## 10. Signature — what makes this unmistakably Kina Wige

Anyone can buy a rounded font and a green palette. These four elements are drawn
from Rwandan visual culture, and they are why the app cannot be cloned by a
competitor who has not lived here. Used with restraint, they read as *premium and
rooted*; used heavily, they read as costume. **Restraint is the whole craft.**

### 10.1 Imigongo geometry — the pattern language

**Imigongo** is Rwanda's traditional geometric relief art: bold spirals,
zigzags, diamonds and chevrons. It is the single most distinctive visual asset
Rwanda has, and almost no digital product uses it well.

**How we use it**
- Take the **geometry only**, recoloured into our palette. Do not import the
  traditional black/white/red/ochre — it fights our green and reads as pastiche.
- Deploy as a **tiled SVG `<pattern>`** at **4–8% opacity** in `green-800`:
  behind the home hero, inside celebration bursts, as a section divider, as the
  frame around a portrait.
- Motifs: the nested diamond, the spiral, the zigzag band. Pick **one per
  screen** — never two.
- Weight: a single reusable `<pattern>` def, under 2 KB, reused everywhere.

**Never**: as a full-strength background, behind body text, on more than one
surface per screen, or stretched out of its square proportion.

### 10.2 Agaseke — the vessel for what you've learned

The **agaseke** (Rwandan peace basket, with its distinctive conical lid and woven
zigzag) replaces the generic star counter.

This solves a real product problem. `PRD.md` §6 requires rewards to be a
**memento, never a currency** — and a number that goes up is a currency no matter
what we call it. A basket that visibly fills is a *collection*: it can grow, it
can be admired, and **nothing can ever be taken out of it.**

- Stars accumulate *inside* the child's agaseke.
- Fill state is shown by how full the weave is, not by a digit.
- Tapping it shows what was collected — never a score, never a comparison.
- The child's basket appears on the home screen and in the profile.

### 10.3 The thousand hills — our recurring shape

Rwanda is *igihugu cy'imisozi igihumbi*, the land of a thousand hills, and rolling
hills already anchor the backgrounds of our own cartoon episodes.

Use a **soft two- or three-layer hill silhouette** as the app's structural shape:
the base of the home screen, the top of a sheet, the backdrop behind an avatar,
the divider between sections. Layer in `green-100` / `green-300` / `green-400`.

It gives every screen the same quiet horizon — a signature you can recognise from
across a room, at zero cost.

### 10.4 The parent's voice — the feature nobody else has

Documented in `CHARACTERS-AND-IDENTITY.md` §4.3, listed here because it is a
**brand** asset, not merely a feature: the mascot celebrates using the child's
real name, recorded in their own parent's voice, stored only on the device.

No competitor in this category does this. It is offline, it costs ~2 KB, and it
is the thing a parent will describe to another parent.

### 10.5 The uniqueness test

Before shipping any screen, ask: **would this screen be recognisably Kina Wige
with the logo removed?**

If the answer is no, it is missing its signature — usually a hill line, a
low-opacity imigongo motif, the agaseke, or Ngabo. If the answer is "yes, because
there are five of them on it", it is overdressed. **One signature element per
screen** is the target.

---

## 11. Definition of done

- [ ] No raw hex outside `src/index.css` (`grep -rE "#[0-9a-fA-F]{6}" src --include=*.tsx` is empty)
- [ ] Semantic colour honoured — no blue chrome or red in the child lane
- [ ] Child targets ≥ 64 px (primary tiles ≥ 80 px); parent ≥ 44 px
- [ ] Every child instruction works with **sound off** and **text unread**
- [ ] `prefers-reduced-motion` verified; no animation above 3 Hz
- [ ] All text meets WCAG AA; selection never signalled by colour alone
- [ ] Labels survive **+35%** length for Kinyarwanda without breaking layout
- [ ] Fonts still bundled locally — **no runtime font request**
- [ ] App-shell precache ≤ **2.0 MB**
- [ ] Airplane-mode walk-through passes: first win reachable, videos still cached
- [ ] **Signature:** every screen carries exactly **one** signature element
      (hill line, imigongo motif, agaseke, or Ngabo) — never zero, never five
- [ ] Imigongo used at 4–8% opacity only, one motif per screen, never behind body text
- [ ] Stars live in the agaseke as a filling collection — no digit that can decrease
- [ ] Passes the uniqueness test: recognisable as Kina Wige with the logo removed

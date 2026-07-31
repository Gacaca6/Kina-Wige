# Kina Wige — Characters & Identity

**Version:** 1.0 · 2026-07-31
**Status:** Canonical. Governs the mascot, the child's avatar, and personal identity.
**Pairs with:** `DESIGN-SYSTEM.md` (tokens) · `PRD.md` (scope) · `DESIGN-PROMPTS.md`

> **The problem this solves.** The original characters felt AI-generated and had
> no job. Prettier art would not have fixed that — a character without a role
> reads as decoration no matter how well it is drawn. This document gives every
> character exactly one job, and gives the child a place that is unmistakably
> theirs.

---

## 1. The three-tier cast

Three tiers, three jobs, **no overlap**. This separation is the rule.

| Tier | Who | Lives in | Visual language |
| --- | --- | --- | --- |
| **Mascot** | **Ngabo** — one golden monkey | The app UI | Flat, rigged, elastic vector |
| **Cast** | Keza, Hirwa, mama, community | Inside the videos | Cinematic, rendered |
| **Me** | The child's own built avatar | Profile, home, celebration | Constructed from designed parts |

**Hard rule — humans never become chrome.** Keza, Hirwa and the video cast may
appear in the app **only** inside a video thumbnail or a clearly framed portrait
("from the show"). They are never buttons, never navigation, never a floating UI
companion. Rendered humans in flat interface chrome is exactly what read as
"AI-generated" before, and it is why the split exists.

**Keza keeps her job.** `Baza Keza` (Ask Keza) already exists in the codebase —
she answers questions from the curated offline database. That is a real role, and
she keeps it. In the app she appears as a **framed portrait**, never as an
animated UI character. Ngabo does the animating.

**Cut:** Inyoni. A second helper with a vague role is exactly the mistake we are
correcting. Hirwa moves to the video cast.

---

## 2. Ngabo — the mascot

### 2.1 Why a golden monkey

The **golden monkey** (*Cercopithecus kandti*) is endemic to Rwanda's Volcanoes
National Park. Choosing a specific Rwandan animal over a generic cartoon one is
the cheapest uniqueness we will ever buy — no competitor can copy it without
copying Rwanda.

Three functional reasons, not just patriotic ones:

1. **Hands.** A guide for a pre-reader must *point*, clap and demonstrate.
   A bird cannot. This is the single biggest reason to prefer a monkey.
2. **Golden-orange coat** sits naturally beside our celebration gold (`#FBC02D`),
   so the mascot and the reward moment share a palette.
3. **Not human**, so it can squash, stretch and exaggerate past realism without
   ever entering the uncanny valley.

*Alternative considered:* the crowned crane (national bird, superb silhouette,
can fly in and out of frame) — rejected because it cannot point.

### 2.2 Design requirements

- **Readable as a silhouette at 20 px.** If the shape is not recognisable in
  solid black at thumbnail size, the design has failed.
- **Simple enough to ship as SVG ≤ 40 KB** including every rig part.
- Thick, consistent line weight; large head; simple four-finger hands;
  expressive brows. Warm and safe — never toothy, never realistic.
- A distinct **golden crest tuft** is the memorable detail — the silhouette hook.
- Palette: golden-orange body, `green-800` linework, `gold-400` crest.

### 2.3 Rig anatomy

Ngabo is **one rigged SVG**, not a set of drawings. Every part is a named group
so `motion` can drive it independently. This is what lets ~20 KB produce dozens
of expressions.

```
#ngabo
├── #ngabo-tail          rotate — trails body motion, ~80ms behind
├── #ngabo-body          scale/translate — the squash-and-stretch root
├── #ngabo-arm-l         rotate from shoulder
├── #ngabo-arm-r         rotate from shoulder — the pointing arm
└── #ngabo-head          rotate + translate; leads all motion
    ├── #ngabo-ear-l / -r
    ├── #ngabo-crest      the golden tuft — bounces last (secondary motion)
    ├── #ngabo-brow-l / -r    the emotional workhorse: y + rotate only
    ├── #ngabo-eye-l / -r
    │   ├── #ngabo-pupil-l / -r   translate ±3px — TRACKS THE LAST TAP
    │   └── #ngabo-lid-l / -r     scaleY 1→0 — blink
    └── #ngabo-mouth      swappable path: neutral · smile · open · o
```

**Secondary motion is the whole trick.** Head leads, body follows ~60 ms later,
crest and tail arrive ~100 ms after that. That lag is what separates "alive" from
"a moving picture", and it costs nothing but stagger values.

### 2.4 State vocabulary

Ten states. Small and used relentlessly beats large and inconsistent.

| # | State | Trigger | Duration | Motion |
| --- | --- | --- | --- | --- |
| 1 | **Idle** | Always, when nothing else runs | 3.5 s loop | Breathing scale 1↔1.015; blink every 4–7 s (randomised) |
| 2 | **Look-at** | Continuous | 180 ms | Pupils translate toward the child's last tap |
| 3 | **Wave** | Screen entry, greeting | 700 ms | Arm rotates, head tilts, one bounce in |
| 4 | **Point** | An activity target needs attention | 600 ms + hold | Arm extends toward the target, head follows, brows raise |
| 5 | **Think** | A question is on screen | 2 s loop | Head tilt, one brow up, hand near chin |
| 6 | **Encourage** | Wrong tap | 800 ms | Small warm nod, open hand gesture, brows soft — **never sad, never scolding** |
| 7 | **Celebrate** | Win | 1200 ms | Jump with squash-and-stretch, arms up, crest overshoots |
| 8 | **Amazed** | Rare surprise (§2.6) | 900 ms | Eyes scale 1.4, mouth "o", body recoils then springs |
| 9 | **Doze** | 45 s idle | 4 s loop | Slow blink → eyes close, head dips, tiny float |
| 10 | **Peek** | Entering from off-screen | 500 ms | Head + one hand appear at the screen edge, then climb in |

### 2.5 Contingency rules — what makes it feel conscious

- **Respond within 100 ms** of any child input. Late reactions read as video,
  immediate ones read as attention.
- **Every state is interruptible.** A child tapping mid-celebration must get an
  instant new reaction, never a queued animation.
- **Look-at is always on** (except while dozing). Eyes tracking the last tap is
  the cheapest, strongest aliveness signal we have — ±3 px of pupil translation.
- **Idle never fully stops.** A perfectly still character is a dead character.
- Respect `prefers-reduced-motion`: hold expressive poses, drop the travel.

### 2.6 Rationed magic

Predictable magic stops being magic. Surprise must be rare and unbuyable.

| Behaviour | Frequency |
| --- | --- |
| **Amazed** reaction on a win | ~1 in 8 wins |
| **Tickle** — reacts to being tapped repeatedly | 3+ taps on Ngabo |
| **Boredom escalation** — yawn, then a small attention-seeking wave | after 45 s / 90 s idle |
| **Big celebration** — longer, crest confetti | first win of the day only |

### 2.7 What Ngabo never does

This is a hard boundary, and it is the line we hold even when someone argues
retention:

- **Never guilt.** No sadness at absence, no "your streak is gone", no crying,
  no disappointment. Duolingo's loss-aversion is engineered for adults who can
  rationalise it; for a four-year-old it is simply anxiety, and it contradicts
  our own rule *don't reward with fear*.
- Never scolds, never shows a wrong answer as failure.
- Never blocks or nags the child toward a purchase — there is nothing to buy.
- Never appears on a grown-up screen. Blue lane = no mascot.

> **The stance:** take Duo's craft and contingency. Leave its guilt behind.
> Ngabo is glad you came back; he never punishes you for having left.

### 2.8 Implementation

**Rigged SVG animated with `motion`** — already a dependency, so **zero new
weight**, fully offline, interruptible, physics-based.

Rejected: Lottie (~250 KB runtime — unaffordable against a 2 MB shell) and Rive
(smaller, true state machines, but adds a wasm runtime and a new toolchain).
Rive is the upgrade path if we ever outgrow this; we will not soon.

Budget: **≤ 40 KB** for the rig, all states included.

---

## 3. The child's avatar — built, not chosen

### 3.1 Why building beats picking

A child who **assembled** their avatar owns it in a way that picking from a
line-up never achieves. Making creates the "this is mine" feeling; choosing only
creates a preference. It also, by construction, cannot look AI-generated —
everything is drawn from a designed parts kit in our palette.

And it is dramatically cheaper: ~20 small SVG parts produce **288+ combinations**,
versus 40 KB per fixed character.

### 3.2 Three taps — hard limit

A 3-year-old cannot use a character creator. The whole flow is three taps, each
skippable, each with a sensible default.

| Step | Choice | Options | Notes |
| --- | --- | --- | --- |
| **1** | **Face** | 6 | Skin tone + face shape bundled into one tap |
| **2** | **Hair** | 8 | The identity carrier — see §3.3 |
| **3** | **Colour** | 6 | Recolours top + backdrop together via CSS |

`6 × 8 × 6 = 288` combinations. An optional **accessory** (6 more) is available
later from the profile screen — never during first run.

### 3.3 The parts kit — where uniqueness actually lives

Generic avatar kits are exactly the problem we are fixing. **Every part must be
drawn from real Rwandan children**, using the same visual language as the Keza &
Hirwa cartoon stills.

**Faces (6)** — a genuine range of Rwandan skin tones, warm and accurate. Never
a "default" light face listed first.

**Hair (8)** — this carries more identity than anything else:
coils · short afro · twists · cornrows · braids with beads · bantu knots ·
low fade · locs. Textured and specific, never generic "long/short".

**Tops (6)** — patterned in **kitenge**-inspired prints echoing the fabrics in
our own cartoon episodes, plus plain options. The pattern is a small tiled SVG
`<pattern>`, recoloured by token — near-zero weight.

**Accessories (6, optional)** — headwrap · beaded necklace · glasses ·
football shirt · flower · cap.

**Backdrop (6)** — flat token colours with a subtle **thousand-hills** silhouette
(see `DESIGN-SYSTEM.md` §10.3).

### 3.4 Technical

- Parts are SVG groups swapped by id; colour driven by CSS custom properties, so
  one shape serves six colourways.
- **Whole kit budget: ≤ 60 KB.**
- Selection stored as an index tuple — `{face:2, hair:5, colour:1, acc:null}` —
  a few bytes in `localStorage`, per profile.
- The avatar renders anywhere a child is represented: profile, home greeting,
  celebration, "Abankunda" screen.

### 3.5 Guardrail

Avatar editing is **three taps at setup**, revisitable from the profile screen —
never a destination that competes with learning. Children will happily spend ten
minutes on hair; the design must not invite it.

---

## 4. Names, voice and belonging

### 4.1 The principle

Names are the strongest ownership lever available, and hearing your own name is
magic at four years old. But children of this age cannot type — so **every name
is entered by the parent, in the grown-up lane.**

### 4.2 What is stored

| Field | Who enters it | Constraint |
| --- | --- | --- |
| Child's display name | Parent | First name only |
| Child's name recording | Parent | ~1 s audio, optional |
| **Abankunda** ("those who love me") | Parent | **First names only, max 4** |

All of it is `localStorage` / IndexedDB on the device. **Nothing is ever
transmitted** — there is no network path for it to leave by.

### 4.3 The parent-voice recording — our signature feature

**Let the parent record the child's name once. Ngabo then says the child's real
name, in their parent's voice, at every celebration.**

Why this matters:

- It is **fully offline** — `MediaRecorder` + a local blob. No API, no TTS.
- It is **~2 KB** at Opus mono.
- It solves a problem we could not otherwise solve: we cannot pre-record voice-
  over for arbitrary names, and there is no Kinyarwanda TTS worth shipping.
- **Emotionally, nothing else in the category comes close.** A four-year-old
  hearing their mother's voice say their name when they succeed is a different
  product from one that plays a chime.

**Flow (grown-up lane, blue chrome):**
1. Explain plainly: *"Record your child's name. Ngabo will say it when they do
   well. It stays on this phone."*
2. Big record button → 2-second countdown → record → **play back** → keep or retry.
3. Fully **optional and skippable**; deletable at any time from the parent area.
4. Mic permission is requested **at this moment only**, never at launch, with the
   benefit stated first.

**Fallback when there is no recording:** the name appears in writing and Ngabo
celebrates without speaking it. Never a robotic voice — silence beats uncanny.

### 4.4 Abankunda — "those who love me"

A small, warm screen the child can visit: up to four people who love them, each
as a simple avatar with a first name — mama, papa, a sibling, a friend.

Uses:
- Occasionally after a win: *"Mama will be proud."* (rare, ~1 in 6, never a nag)
- A place a child can simply go and look at, which is its own quiet value

**Privacy discipline — non-negotiable.** Friends' names are data about *other
people's children*. Even though nothing leaves the device:

- Parent-entered only, **first names only**, no surnames, no photos, no contacts
  access, **max 4 entries**
- One-tap delete per person; wiped entirely by "Delete everything"
- The parent area states plainly what is stored and where

Treat it as writing a name in a notebook — never as building a database.

### 4.5 Where the child's name appears

Home greeting · celebration · avatar label · parent summary · Abankunda screen.

Layouts must survive a **16-character** first name without breaking, and
Kinyarwanda labels around it run ~35% longer than English.

---

## 5. Kinyarwanda strings introduced here

Per `CLAUDE.md` rule 4, machine-written Kinyarwanda must be human-reviewed before
shipping. These are **provisional** and are logged in the ROADMAP review queue:

| Key | Provisional KN | EN |
| --- | --- | --- |
| `avatar.pick_face` | Hitamo mu maso | Pick your face |
| `avatar.pick_hair` | Hitamo umusatsi | Pick your hair |
| `avatar.pick_colour` | Hitamo ibara | Pick your colour |
| `avatar.thats_me` | Ni njye! | That's me! |
| `people.title` | Abankunda | Those who love me |
| `voice.record_prompt` | Fata ijwi ry'izina ry'umwana | Record your child's name |
| `voice.keep` | Bika | Keep |
| `voice.retry` | Ongera | Try again |

---

## 6. Definition of done

- [ ] Ngabo readable as a solid silhouette at 20 px
- [ ] Rig ≤ 40 KB; avatar kit ≤ 60 KB; both SVG, both offline
- [ ] All ten states implemented and **interruptible**; reaction < 100 ms
- [ ] Look-at active on every child screen except dozing
- [ ] No guilt state exists in the codebase — no sad, no disappointed, no streak loss
- [ ] Avatar creation is exactly three taps, each skippable, defaults sensible
- [ ] Hair options are textured and specific — no generic long/short
- [ ] Names entered only in the grown-up lane; no keyboard reachable by a child
- [ ] Voice recording optional, playable back, deletable, mic asked just-in-time
- [ ] Abankunda capped at 4, first names only, one-tap delete
- [ ] "Delete everything" clears avatar, names, recordings and progress
- [ ] Human characters appear only in thumbnails or framed portraits
- [ ] All new Kinyarwanda flagged in the ROADMAP review queue

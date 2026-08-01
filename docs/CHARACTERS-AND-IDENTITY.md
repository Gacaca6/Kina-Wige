# Kina Wige — Characters, Motion & Screens

**Version:** 2.0 · 2026-07-31 · **supersedes v1.0 entirely**
**Status:** Canonical.
**Design language:** English first. Kinyarwanda arrives through i18n, not through
the design pass.

> **Why v2 exists.** v1 specified human avatars built from face/hair/colour parts,
> an agaseke reward vessel, and CSS-transition animation. Held next to Duolingo
> ABC, that reads as a toy. Three things caused it, and all three are fixed here:
> **1.** flat card grids instead of an illustrated world · **2.** built-from-parts
> humans instead of characters with personality · **3.** `scale()` transitions
> instead of real physics.
>
> **Removed in v2:** the human avatar builder, the agaseke, and all CSS-transition
> motion. Stars return as the reward, exactly as they worked before.

---

## 1. The bar we are clearing

Duolingo ABC is the benchmark. Studying it frame by frame, three things carry it —
and none of them is budget:

| What they do | What we were doing | The fix |
| --- | --- | --- |
| Home is an **illustrated world** — a path winding through a street, lesson nodes, the mascot standing in it | A grid of white cards on cream | Build a **world**, not a layout (§4) |
| Characters have **personality and craft** — chunky, saturated, instantly readable | Parts-kit humans with no personality | An **animal cast** with real character (§2) |
| Motion is **physical** — things overshoot, settle, follow through | `transform: scale()` with a CSS transition | **Spring physics** driven per-part (§3) |

Everything below serves those three.

---

## 2. The cast — animals, not humans

### 2.1 Why animals

Humans in a flat kids' UI are a trap: stylise them and they get uncanny;
render them and they stop matching the interface. Every leader in this category
uses animals or creatures — Duo, Toca Boca, Sago Mini, Khan Kids — because an
animal can be exaggerated without limit and still read as warm.

It also solves the complaint directly: the old human avatars felt AI-generated
*because* they were assembled from generic parts. A designed animal with a name
and a personality cannot feel generic.

### 2.2 Ngabo — the mascot (always present)

A **golden monkey**, endemic to Rwanda's Volcanoes National Park. He is the
guide: he greets, points, demonstrates, celebrates and reacts. He is never
selectable — he belongs to the app, not to the child.

Why a monkey: a guide for a pre-reader must **point**, clap and demonstrate.
Hands are non-negotiable.

### 2.3 The playable cast — the child picks one as "me"

Twelve characters, all animals of Rwanda and East Africa. This is the
Duolingo ABC pattern — a grid of characters, pick your buddy — and it is a far
better ownership moment than assembling a face.

| # | Character | Animal | Personality in one line |
| --- | --- | --- | --- |
| 1 | **Umusambi** | Crowned crane | Elegant, curious, Rwanda's national bird |
| 2 | **Intare** | Lion | Brave, a little loud, always first to try |
| 3 | **Inzovu** | Elephant | Gentle, remembers everything |
| 4 | **Ingagi** | Mountain gorilla | Calm, strong, protective |
| 5 | **Imvubu** | Hippo | Funny, splashy, never in a hurry |
| 6 | **Ingwe** | Leopard | Quick, clever, a bit shy |
| 7 | **Impala** | Impala | Bouncy, fast, joyful |
| 8 | **Inka** | Ankole cow | Proud, warm, deeply Rwandan |
| 9 | **Urukwavu** | Rabbit | Eager, quick to giggle |
| 10 | **Ikinyugunyugu** | Butterfly | Light, dreamy, loves colour |
| 11 | **Inyamaswa y'amazi** | Otter | Playful, endlessly busy |
| 12 | **Uruvunge** | Chameleon | Watchful, changes with the mood |

*Kinyarwanda names are provisional and go to the ROADMAP review queue. The
design pass ships English; names are proper nouns and survive translation.*

### 2.4 Character design rules

- **Head-and-shoulders portrait** in a circular badge, like the reference — the
  character fills the circle and slightly overflows it. Not a full body.
- **Chunky, saturated, high contrast.** Thick forms, no thin linework, no
  gradients beyond a single soft shade.
- **Readable at 64 px** and as a solid silhouette at 24 px.
- **Eyes are the personality.** Large, off-centre pupils, a single specular dot.
- **One saturated backdrop colour per character**, drawn from the palette, so the
  grid reads as a set.
- **SVG, ≤ 12 KB each** — the whole cast under 150 KB.

### 2.5 Humans stay in the videos

Keza, Hirwa and family remain **human and cinematic**, inside the episodes.
In the app they appear only as a video thumbnail or a framed portrait — never as
interface furniture. Keza keeps her real job answering questions in Baza Keza.

---

## 3. Motion — real physics, not transitions

This is the section that matters most, and the one v1 got wrong.

### 3.1 The principle

`transition: transform .28s` is a **tween**: it interpolates between two poses on
a fixed clock. It always reads as a slideshow, because nothing in it has mass.

**Springs are a simulation.** A spring has stiffness, damping and mass; it
overshoots, settles, and — critically — can be **interrupted mid-flight and
retarget from its current velocity**. That is what makes a character feel alive
and responsive rather than scripted.

We already ship `motion`, which has a real spring solver. **No new dependency.**

### 3.2 The spring set

```ts
// One vocabulary, used everywhere. Tuned, not guessed.
export const SPRING = {
  //                    stiffness  damping  mass
  snappy:   { type: 'spring', stiffness: 700, damping: 30, mass: 0.6 },  // taps
  bouncy:   { type: 'spring', stiffness: 400, damping: 14, mass: 0.9 },  // celebrate
  soft:     { type: 'spring', stiffness: 220, damping: 26, mass: 1.0 },  // screens
  heavy:    { type: 'spring', stiffness: 160, damping: 22, mass: 1.6 },  // big shapes
  floaty:   { type: 'spring', stiffness: 90,  damping: 12, mass: 1.2 },  // follow-through
} as const;
```

### 3.3 The five techniques that create "alive"

**1 · Velocity-driven squash and stretch.**
Do not animate scale directly. Derive it from the spring's own velocity, so the
character deforms *because* it is moving:

```ts
const y = useSpring(0, SPRING.bouncy);
const scaleY = useTransform(y.velocity, [-1400, 0, 1400], [0.86, 1, 1.16]);
const scaleX = useTransform(scaleY, v => 2 - v);   // conserve volume
```

**2 · Follow-through via a spring chain.**
Each part gets its own spring, softer as it gets further from the root. The head
leads; body, ears, tail and crest arrive late *on their own*, with no
hand-authored delays:

```
head   SPRING.snappy   →  body  SPRING.soft  →  tail/ears/crest  SPRING.floaty
```

**3 · Ballistic jumps.** A celebration is a real arc: impulse up, gravity down,
a bouncy spring on landing that overshoots and settles. Never a keyframed hop.

**4 · Damped pointer tracking.** Pupils follow the last tap through a spring, so
the gaze *arrives* rather than snapping.

**5 · Idle that never repeats exactly.** Breathing is a slow spring chasing a
drifting target, not a CSS loop. Two identical idle cycles are what make a
character read as a GIF.

### 3.4 Rules

- **Reaction within 100 ms**, every time. Springs retarget instantly — never
  queue an animation.
- **Never animate layout properties.** `transform` and `opacity` only.
- **`prefers-reduced-motion`** → springs collapse to instant, poses still change.
- **Calm mode** (parent setting) → damping raised, amplitude halved. Never off.
- **No looping CSS keyframe animations on characters.** If it loops identically,
  it is wrong.

### 3.5 Ngabo's states

Same ten as before — idle · look-at · wave · point · think · encourage ·
celebrate · amazed · doze · peek — but every one is now a **spring target set**,
not a keyframe. Rarity is unchanged: amazed ~1 in 8 wins, tickle after 3 taps,
boredom yawn at 45 s.

**Still forbidden:** sadness at absence, streak loss, guilt of any kind.
Duo's craft, none of Duo's anxiety.

---

## 4. The home must be a place, not a page

This is the second big correction.

**Home is an illustrated world with a path through it** — the single change that
moves us from "app" to "product". Concretely:

- A **winding path** climbing the screen, with lesson and story **nodes** on it.
- A **living environment** behind it — Rwandan hills, banana leaves, a village
  roofline, a sky that shifts with time of day.
- **Ngabo stands on the path**, at the child's current position, idling.
- **Completed nodes** are filled and starred; the **next node pulses gently**;
  later nodes are visible but quiet — the child can see where they are going.
- The child's **chosen character** appears beside their name in the header.
- **Vertical scroll** reveals more of the world. Progress is spatial, and
  therefore legible to a four-year-old who cannot read a percentage.

Welcoming means: their name, their character, one obvious next thing, and a
world that looks like somewhere they want to be.

---

## 5. Stars — the agaseke is removed

Reverting to what shipped before: **stars**, via the existing `useStars` hook.

The principle that produced the agaseke still holds and is cheap to keep:
**stars only ever accumulate.** Nothing is spent, lost, or taken away, and there
is no streak. A star is a memento of something you did, not a balance.

No basket, no vessel, no new metaphor.

---

## 6. Standard screen inventory

Eighteen screens — the standard set for this category, benchmarked against
Duolingo ABC, Khan Academy Kids and Lingokids.

### Onboarding — 6
| # | Screen | Notes |
| --- | --- | --- |
| 1 | **Splash / value** | Animated mascot, one line, one CTA |
| 2 | **Child's name** | Parent types it; big friendly field |
| 3 | **Age band** | Adult-facing, neutral, 3–4 / 5–6 |
| 4 | **Character select** | The 12-character grid — "Choose a character for {name}" |
| 5 | **Parent gate + local profile** | Arithmetic gate; no account, no email |
| 6 | **First lesson** | The guaranteed win, before anything is asked |

### Core — 7
| # | Screen | Notes |
| --- | --- | --- |
| 7 | **Home — the world path** | §4. The centrepiece |
| 8 | **Lesson player** | Video, oversized controls, offline badge |
| 9 | **Activity / game** | The existing six games, re-skinned |
| 10 | **Library** | Story grid |
| 11 | **Story reader** | Page turn, read-along |
| 12 | **Ask Keza** | Curated offline Q&A |
| 13 | **Celebration** | Star, character, the child's name |

### Grown-ups — 5
| # | Screen | Notes |
| --- | --- | --- |
| 14 | **Parent gate** | Guards every exit |
| 15 | **Parent dashboard** | Weekly summary in plain language |
| 16 | **Profiles** | Up to 4 children, one-tap switch |
| 17 | **Settings** | Language, calm mode, sound |
| 18 | **Privacy & data** | What is stored, delete everything |

---

## 7. Definition of done

- [ ] Twelve characters, animals, ≤ 12 KB each, readable at 24 px silhouette
- [ ] No human character anywhere in the UI — videos and portraits only
- [ ] **Zero CSS-transition motion on characters** — springs only
- [ ] Squash/stretch derived from **velocity**, not hand-authored
- [ ] Follow-through emerges from a spring chain, not from delays
- [ ] Every animation interruptible; reaction < 100 ms
- [ ] No looping keyframe animation on any character
- [ ] Home is a scrolling illustrated world with a path and nodes — not a card grid
- [ ] Stars accumulate only; no agaseke, no streak, no spend, no loss
- [ ] All 18 screens present
- [ ] English throughout; every string routed through `t()` ready for i18n
- [ ] `prefers-reduced-motion` and calm mode both verified

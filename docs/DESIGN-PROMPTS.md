# Kina Wige — Design Prompts

**Version:** 1.0 · 2026-07-31
**For:** generating the premium redesign in Claude (or any AI design surface)
**Pairs with:** `DESIGN-SYSTEM.md` (tokens) and `PRD.md` (scope)

---

## How to use this file

1. Paste **Block A — Master context** at the start of every new session. It is
   self-contained: the tool needs no other file.
2. Then paste **one** screen prompt. One screen per turn produces far better work
   than "design the whole app".
3. Iterate with the **critique prompts** in §4 before moving on.
4. Everything produced is a **design reference**, not shipped code — the app is
   React 19 + Tailwind 4 and the tokens must come from `DESIGN-SYSTEM.md`.

> **Never ask for:** dark mode, glassmorphism, 3D renders, stock photography,
> emoji-as-characters, or anything requiring a network. All four break our rules.

---

## Block A — Master context (paste first, every time)

```
You are designing screens for Kina Wige — a Kinyarwanda-first learning app for
children aged 3–6 in Rwanda. It is an offline-first installable PWA used mostly
on low-cost Android phones, often shared between siblings.

BRAND
Kina Wige means "Play and Learn". Warm, culturally proud, calm, trustworthy.
Tagline: "Growing curious minds through stories, play and culture."

THE CAST — three tiers, three jobs, NO OVERLAP
- MASCOT: Ngabo, a golden monkey (endemic to Rwanda's Volcanoes NP). He lives in
  the app UI. Flat, rigged, elastic, extremely expressive. He greets, points,
  demonstrates, celebrates. Duolingo's Duo in craft — but never guilt-inducing.
- CAST: Keza, Hirwa, family and community are HUMAN characters who live inside
  the videos. They may appear in the app ONLY as a video thumbnail or a clearly
  framed portrait — NEVER as UI chrome, buttons or a floating companion.
  (Rendered humans used as interface furniture is what read as "AI-generated".)
- ME: the child's own avatar, BUILT by them in three taps from a designed parts
  kit. This is the child's identity in the app.

SIGNATURE — what makes this unmistakably Kina Wige. Use exactly ONE per screen.
- Imigongo geometry (Rwandan traditional relief art: nested diamonds, spirals,
  zigzags) as a tiled pattern at 4-8% opacity in green-800. Geometry only,
  recoloured into our palette — never the traditional black/white/red/ochre.
- Agaseke (Rwandan peace basket, conical lid, woven zigzag) as the vessel that
  holds what the child has collected — it FILLS, it never counts down.
- The thousand hills: a soft layered rolling-hill silhouette as the recurring
  structural shape (screen base, sheet top, backdrop behind an avatar).
Test every screen: would it be recognisably Kina Wige with the logo removed?
If no, it lacks its signature. If five elements are fighting, it is overdressed.

WHAT "PREMIUM" MEANS HERE
Premium = restraint, craft and calm. NOT more colour, sparkle or animation.
- One dominant colour (green) carrying ~70% of the screen
- Generous whitespace; at most one idea per screen
- Soft, warm, green-tinted shadows — never neutral grey or black
- Rounded, friendly geometry; nothing sharp
- Feels like a beautifully made wooden toy, not a arcade game

COLOUR — strictly semantic, never decorative
green  #2E7D32 (anchor) → brand, structure, the CHILD lane
       ramp: 50 #F2F8F3 · 100 #E1EFE3 · 300 #97C79D · 500 #3E8E44
             600 #2E7D32 · 700 #246428 · 800 #1B4D1F
gold   #FBC02D (400 #FFD54F) → CELEBRATION ONLY and gentle "try again"
blue   #42A5F5 / #1565C0 / wash #E3F2FD → the GROWN-UP lane ONLY
coral  #FF6F61 · purple #7E57C2 → category tags only, never chrome
canvas #FAFAF7 · raised #FFFFFF · sunken #F1F4EC
ink    #212121 · muted #5B665B · faint #98A198
FORBIDDEN: red or harsh error colour anywhere a child can see; blue chrome in
the child lane; more than one accent hue per screen; dark backgrounds.

TYPE
Display/headings: Fredoka, weight 500–600.
Body/UI: Nunito, weight 400–800.
Child CTAs 20–26px Fredoka 600. Body 16px minimum. Nothing below 14px.
Kinyarwanda runs ~35% longer than English — layouts must absorb that.

SHAPE, SPACE, DEPTH
Radius: 12 chips · 18 buttons · 26 cards · 34 sheets · full for avatars.
Spacing on a 4px base; 24px inside cards, 32–48px between blocks.
Shadows: 0 4px 10px rgba(27,77,31,.07), 0 10px 24px rgba(27,77,31,.06).
Max two elevation levels visible at once.

TOUCH (children, small hands, cheap phones)
Child primary tiles ≥ 80px with ≥ 20px gaps. Any child tap target ≥ 64px.
Grown-up controls ≥ 44px. 3–5 choices maximum per child screen.
Primary child actions live in the lower 60% of the screen. Nothing within 16px
of an edge.

THE TWO-LANE RULE (most important)
CHILD LANE: wordless, joyful, green/gold, big soft shapes, character-led. The
child never sees a form, a keyboard, legal text or a price. Instructions are
carried by icon + illustration + animation — never by text a child must read.
GROWN-UP LANE: calm, plain, blue chrome, denser type, normal controls, clearly
marked "grown-ups". A child must know instantly they've hit an adult screen.

ACCESSIBILITY & SAFETY
WCAG AA contrast. Selection never signalled by colour alone (use a ring + scale).
Gentle failure only: a wrong tap redirects and teaches, never punishes — no red,
no buzzer, no sad face. No flashing above 3Hz. Everything must be understandable
with sound off.

CONSTRAINTS
Works with ZERO internet. No ads, no tracking, no accounts for children.
Illustrations should be simple enough to ship as small SVG (≤40KB each).
Emoji are placeholders only — never present emoji as final character art.

Deliver: a clean, high-fidelity mobile screen (390×844), light theme only,
using exactly the tokens above. Explain the layout decisions briefly after.
```

---

## 1. Foundation prompts

### 1.1 Component library sheet

```
Using the Kina Wige system above, design a single component-library sheet on a
#FAFAF7 canvas showing, with labelled states:

1. Primary child CTA — green-600 fill, white Fredoka 600, radius-full, 72px tall,
   soft glow shadow. States: rest, pressed (scale .97), disabled.
2. Choice tile (child) — 96×96 white card, radius 26, illustration ~56px, one
   short label under. States: rest, selected (3px green-600 ring + green-100
   tint + scale 1.06), disabled.
3. Content card — white, radius 26, 24px padding, thumbnail left, title +
   one-line description, progress dots.
4. Grown-up panel — sky-100 wash, sky-700 heading, 44px controls, plain Nunito.
5. Parent gate — arithmetic challenge card in blue chrome.
6. Star/reward chip — gold-400 fill, gold-600 edge (a memento, not a counter).
7. Bottom dock — 4 destinations, 64px each, active item a filled green pill.
8. Category tags — coral (stories), purple (creativity).

Arrange as a calm, well-spaced specimen sheet with section labels in
green-800 Fredoka. Show the ramps and the type scale along the bottom.
```

### 1.2 Ngabo — mascot design sheet

```
Design Ngabo, the Kina Wige mascot: a GOLDEN MONKEY (Cercopithecus kandti,
endemic to Rwanda's Volcanoes National Park). He is the app's guide — he greets,
points, demonstrates and celebrates. Think Duolingo's Duo in craft and
expressiveness, but warm and never guilt-inducing.

STYLE
Flat vector. Thick, consistent line weight in deep green (#1B4D1F). Large head,
big expressive eyes, strong brows, simple four-finger hands. Golden-orange coat
with a distinct GOLDEN CREST TUFT — the crest is the memorable silhouette hook.
Warm and safe: never toothy, never realistic, never scary.

HARD REQUIREMENTS
- Must be recognisable as a SOLID BLACK SILHOUETTE at 20px. Show that test.
- Must be buildable as ONE rigged SVG under 40KB — so: simple shapes, flat fills,
  no gradients, no texture, no fur detail, no fine linework.
- Body parts must be separable for rigging: tail, body, left arm, right arm,
  head, ears, crest, brows, eyes, pupils, eyelids, mouth.

SHOW ON ONE SHEET (#FAFAF7, generous spacing, small labels):
1. Neutral standing (the idle pose)
2. Waving hello
3. Pointing at something — arm extended, head following, brows raised
4. Celebrating — jump, arms up, crest overshooting
5. Amazed — eyes large, mouth in an "o", body recoiling
6. Encouraging after a mistake — warm, open-handed, gentle. NOT sad, NOT scolding
7. Dozing — eyes closed, head dipped
8. Head-only crop at 64px
9. The 20px silhouette test

No background scenery. No text in the artwork.
```

### 1.3 Ngabo — rig part breakdown

```
Take the approved Ngabo design and produce a RIG SHEET showing every part
separated and labelled, as it would be structured in an SVG for animation:

tail · body · arm-left · arm-right · head · ear-left · ear-right · crest ·
brow-left · brow-right · eye-left · eye-right · pupil-left · pupil-right ·
eyelid-left · eyelid-right · mouth (4 swappable shapes: neutral, smile, open, o)

Lay the parts out exploded, each labelled, with its pivot point marked as a small
cross. Show the four mouth shapes side by side.
Flat colours only, no shading. This sheet is a build document, not a poster.
```

### 1.4 Avatar parts kit

```
Design the Kina Wige AVATAR PARTS KIT — the pieces a child combines in three taps
to make "me". This must look like real Rwandan children, NOT a generic avatar
set. Generic parts are exactly the failure we are correcting.

Same flat vector style as Ngabo: thick #1B4D1F linework, flat fills, no gradients.
Every part must ship as small SVG — the whole kit under 60KB.

PRODUCE FOUR ROWS:
1. FACES (6) — a genuine, accurate range of Rwandan skin tones from light-brown
   to deep-brown, with slight face-shape variation. Warm and true. Do NOT put a
   light face first or make it the default.
2. HAIR (8) — textured and specific, this carries the most identity:
   coils · short afro · twists · cornrows · braids with beads · bantu knots ·
   low fade · locs. Never generic "long hair / short hair".
3. TOPS (6) — 3 with kitenge-inspired geometric prints (simple, tileable, in our
   palette) and 3 plain. Prints must read clearly at 96px.
4. ACCESSORIES (6, optional) — headwrap · beaded necklace · glasses ·
   football shirt · flower · cap.

Show one fully assembled example avatar at 96px in a circular frame at the end.
Lay out on #FAFAF7 with row labels in green-800 Fredoka.
```

### 1.5 Signature elements

```
Design Kina Wige's three signature visual elements. These make the app
recognisably Rwandan without being costume-y. RESTRAINT IS THE POINT.

1. IMIGONGO PATTERN TILES — three seamless tiles inspired by Rwandan imigongo
   geometric art: the nested diamond, the spiral, the zigzag band. Use the
   GEOMETRY ONLY, drawn in a single colour (green-800) intended to sit at 4-8%
   opacity behind content. Do NOT use the traditional black/white/red/ochre
   palette — it fights our green. Each tile must be seamless and under 2KB.
   Show each tile twice: at full strength, and tiled at 6% opacity behind a
   sample card.

2. AGASEKE — the Rwandan peace basket (conical lid, woven zigzag) used as the
   child's collection vessel, replacing a star counter. Draw it in four fill
   states: empty · a third full · two thirds · full and glowing with gold stars.
   Flat vector, our palette, readable at 64px.

3. THOUSAND HILLS — a soft, layered rolling-hill silhouette in three depths
   (green-100, green-300, green-400) usable as a screen base, a sheet top and a
   backdrop behind an avatar. Show all three uses.

Flat vector only. Nothing photographic. Nothing at full-strength opacity behind
text.
```

---

## 2. Screen prompts — the first run

Design these in order. Each is one screen.

### 2.1 Splash

```
Design the Kina Wige splash — the first 2 seconds while assets load.
Ngabo waves in the centre with the Kina Wige logo lockup beneath. Warm green
gradient (green-500 → green-600) or canvas with a large soft green shape.
NO spinner and NO progress bar — the character IS the loading state.
One line of Kinyarwanda: "Kina Wige — Kina wige!" in Fredoka.
Calm, confident, premium. Describe the entrance animation you intend
(soft bounce, 600ms, spring).
```

### 2.2 Warm welcome — with the "just play" default

```
Design the welcome screen. Ngabo is present and friendly, speaking one warm
Kinyarwanda line: "Muraho! Ndi Ngabo." (Hello! I'm Ngabo.)

Two actions, and the priority is deliberate:
- PRIMARY, large, green-600, lower-centre: "Reka nkine!" (Let me play!) — takes
  the child straight to play with no setup and no data collected.
- SECONDARY, smaller, understated, marked with a small lock icon in blue:
  "Umukuru arahari" (A grown-up is here) — enters the grown-up lane.

The child's path must be visually dominant. The adult path must be obviously
secondary but easy for an adult to find. No other text on screen.
```

### 2.3 Age band (grown-up lane)

```
Design the grown-up age screen. Blue lane chrome (sky-100 wash, sky-700 heading),
clearly badged "Grown-ups" with a small lock.

Heading: "Umwana wawe afite imyaka ingahe?" (How old is your child?)
Four large plain choices: 3 · 4 · 5 · 6 — neutral, not gamified, no illustration
pressure, nothing pre-selected.
Caption in ink-muted: this only tunes activity difficulty; no birthday is stored.
Plain 44px continue button. Calm and administrative — this is not a fun screen,
and it should not pretend to be.
```

### 2.4 Parent gate

```
Design the parent gate that guards every exit from the child zone.
Blue lane chrome. Heading "Ku bakuru gusa" (Grown-ups only).

The challenge is a simple ARITHMETIC problem — e.g. "7 × 3 = ?" with a compact
number pad — NOT a press-and-hold (a five-year-old defeats a hold).
Caption: "Iki kirinda abana gusohoka" (This keeps little ones from wandering out).
Include a gentle "Subira gukina" (Back to play) escape that always works.
Small, contained, respectful of the adult's time. No branding flourish.
```

### 2.5 Consent

```
Design the consent screen (grown-up lane, blue chrome).
Heading: "Uruhushya rwawe" (Your permission).

Plain-language body, no legalese: play stays on this phone, nothing is uploaded,
no ads ever, no tracking.
TWO SEPARATE, CLEARLY UNBUNDLED checkboxes:
  1. Required: "I'm the parent/guardian and I agree to the child-friendly terms."
  2. Optional, visually separated, clearly labelled optional: an anonymous
     product-improvement toggle — DEFAULT OFF.
Never let the optional item look like part of the required one.
Also show a quiet link to "What we store" (everything is local; can be deleted).
Trustworthy, calm, uncluttered. This screen earns the parent's trust.
```

### 2.6 Make me — the avatar builder (three screens)

```
Design the Kina Wige avatar builder as THREE sequential screens. This is where
the child makes "me" — the single most important ownership moment in the app.
Child lane: green/gold, warm, wordless. NO TYPING ANYWHERE.

Shared structure across all three:
- Ngabo present and encouraging, pointing at the choices
- The avatar being built shown LARGE and live at the top (~140px, circular,
  on a thousand-hills backdrop) so every tap visibly changes it
- Six to eight big choice tiles below, each >=80px with >=20px gaps
- Three small progress dots showing step 1/2/3
- Selection = 3px green-600 ring + green-100 tint + scale 1.06. Never colour alone
- A skip affordance that is available but visually quiet
- A speaker icon showing the prompt is spoken aloud

SCREEN 1 — FACE: 6 faces, an accurate range of Rwandan skin tones.
  Prompt: "Hitamo mu maso" (Pick your face)
SCREEN 2 — HAIR: 8 textured styles (coils, afro, twists, cornrows, braids with
  beads, bantu knots, low fade, locs).
  Prompt: "Hitamo umusatsi" (Pick your hair)
SCREEN 3 — COLOUR: 6 colour swatches that recolour the top and backdrop together.
  Prompt: "Hitamo ibara" (Pick your colour)
  Final CTA, large and green: "Ni njye!" (That's me!)

Show all three screens side by side. Make it obvious this takes seconds, not
minutes — it must never look like a character creator.
```

### 2.7 Light personalisation

```
Design "What do you love?" — one tap that visibly shapes what comes next.
Child lane. Four big illustrated tiles, 3–5 choices maximum:
animals · space · stories · songs. Category tags may use coral/purple accents.
Heading in Fredoka, short, spoken aloud (speaker icon).
CTA: "Tugende!" (Let's go!)
Make it obvious the choice will immediately matter — hint the next screen.
```

### 2.8 First activity — the guaranteed win

```
Design the first activity: the single most important screen in the product.
A voice-guided, unloseable, 30–90 second task for a 3–6 year old.

Example: "Tap the lion that says L." A large lion illustration, three big tap
targets (≥80px, ≥20px apart), the correct one gently pulsing to guide attention.
Ngabo is present, pointing, encouraging. A speaker icon shows it's spoken aloud.
NO score, NO timer, NO lives, NO text instruction the child must read.
A wrong tap must be designed as a gentle redirect — show that state: soft gold
nudge and Ngabo pointing again. Never red, never a sad face, never a buzzer.
The child cannot fail. Show both the resting state and the gentle-redirect state.
```

### 2.9 Celebration

```
Design the celebration after the first win. Warm, brief, informational.
Ngabo celebrating (jump, arms up, crest overshooting); ONE gold star arriving
with a soft spring and dropping into the child's AGASEKE basket.
Message: "Wabikoze, {name}!" (You did it, {name}!) in Fredoka — show the child's
real name, which Ngabo speaks aloud in the PARENT'S RECORDED VOICE. Add a small
speaker icon to indicate this. Plus a quiet line naming the effort — "You
practised letter sounds."
NO coins, NO streak, NO counter counting up, NO confetti storm, NO "level up".
Rewards here celebrate effort, not currency — a memento, never a balance.
One clear green CTA: "Kina byinshi!" (Play more!)
Restrained joy. This is where most kids' apps get loud; we stay warm.
```

### 2.10 Personalised home

```
Design the child's home screen — where they land after the win and return daily.
It must feel like THEIR world: their name, their chosen buddy, their theme.

Structure:
- Warm greeting with the child's name and their buddy, Fredoka.
- ONE dominant "Today's adventure" card — big, green, illustrated, obviously the
  next thing to tap.
- A row of 3 category tiles (Amasomo/videos · Imikino/games · Ibitabo/stories),
  ≥80px, illustrated.
- The child's AGASEKE (Rwandan peace basket) shown quietly, partly full — a
  collection that fills, never a score that counts down.
- The child's own built avatar beside the greeting.
- Bottom dock, 4 destinations max, 64px, active item a filled green pill.
- A small blue lock button for "Grown-ups" in a corner — reachable by an adult,
  unremarkable to a child.

Flat navigation: everything is one tap from here. Generous whitespace — resist
filling the screen. This is the screen that must feel most premium.
```

### 2.11 Parent summary + just-in-time permission

```
Design the parent summary (grown-up lane, blue chrome) shown after the child's
first session.

Content: a warm plain-language recap — "Keza played for 4 minutes. She practised
letter sounds and animal names. Tomorrow: counting to 5."
Include ONE suggested offline activity to do together away from the screen.
Then a just-in-time, benefit-first notification ask: "Want a gentle daily reminder
to play together?" with "Yes" and "Maybe later" — equally weighted, no dark
patterns, no guilt.
NO scores, NO percentages, NO comparison to other children.
Calm, reassuring, respectful of a busy parent's 20 seconds.
```

---

### 2.12 Parent voice recording — our signature feature

```
Design the parent voice-recording screen (GROWN-UP lane, blue chrome).
This is Kina Wige's signature feature: the parent records their child's name
once, and Ngabo then says the child's real name IN THEIR PARENT'S VOICE at every
celebration. It never leaves the phone.

Content:
- Heading: "Fata ijwi ry'izina ry'umwana" (Record your child's name)
- One plain-language line explaining the payoff and the privacy in the same
  breath: Ngabo will say their name when they do well; it stays on this phone.
- A large circular RECORD button (blue lane, ~96px) with a 2-second countdown
  state and a simple live waveform while recording.
- After recording: a PLAY BACK control, plus "Bika" (Keep) and "Ongera" (Try
  again), equally weighted.
- A quiet, always-available "Simbuka" (Skip) — this must be genuinely optional.
- A small note that the recording can be deleted at any time.

Show three states side by side: ready to record · recording · review.
Calm and trustworthy. No mascot on this screen — it is the grown-up lane.
```

### 2.13 Abankunda — "those who love me"

```
Design the "Abankunda" screen (Those who love me) — a small, warm place the
child can visit. Child lane.

Up to FOUR people, each shown as a simple avatar in a circular frame with a
first name beneath (mama, papa, a sibling, a friend). Warm, generous spacing,
a thousand-hills backdrop, one low-opacity imigongo motif behind.

This is not a management screen — there are no edit controls visible to the
child. Adding or removing people happens in the grown-up lane only.
It should feel like looking at a shelf of photos: quiet, safe, loved.

Also show the empty state, which must be gentle rather than a prompt to act.
```

---

## 3. Existing screens to re-skin

### 3.1 Episode / video screen

```
Redesign the Kina Wige episode player for a 3–6 year old.
Video fills the top; below it a large green replay control and a big "next"
card. Controls ≥ 64px, spaced, unmissable. No scrubber a child can wreck —
replay and next only. An offline badge shows the episode is downloaded.
Attribution for openly-licensed content sits small and legible at the bottom
(required by CC BY-NC-ND — it must never be hidden).
Child lane colours only. Nothing to read to operate it.
```

### 3.2 Game screen shell

```
Design the shared shell for Kina Wige's thinking games (memory, counting,
pattern, sorting). The shell frames every game consistently:
- A slim top bar with a large 64px back control and the game title in Fredoka.
- A generous play area on canvas with a subtle green wash.
- Star memento shown quietly in the corner — never a live score.
- A gentle-redirect state: soft gold, Inyoni offering a hint, no red anywhere.
Show the shell with a memory-match grid inside (4 large cards, ≥80px).
```

---

## 4. Critique & refinement prompts

Run these on every screen before accepting it.

```
Critique this screen against the Kina Wige system. Check specifically:
1. Is exactly ONE accent hue used, and is colour strictly semantic
   (green=child, gold=celebration only, blue=grown-up only)?
2. Are ALL child tap targets ≥64px (primary tiles ≥80px) with ≥16px gaps?
3. Could a 4-year-old who cannot read operate this screen with the sound OFF?
4. Is there any red, buzzer-like or punishing state a child can reach?
5. Are there more than 5 choices, or more than one idea, on this screen?
6. Would the layout survive Kinyarwanda labels 35% longer than the English?
7. Is anything critical within 16px of an edge?
8. Are there more than two elevation levels visible?
List concrete fixes, then produce the corrected screen.
```

```
This screen is close, but it doesn't feel premium yet. Without adding colour,
decoration or animation, improve it by: increasing whitespace, tightening the
type hierarchy to one clear focal point, softening and unifying the shadows,
aligning everything to the 4px spacing scale, and removing one element.
Restraint only. Show the result and say what you removed.
```

```
Show this screen in three states side by side: default, selected/active, and the
gentle-redirect state (a wrong tap). Prove the redirect is warm and instructive —
gold, character pointing, never red, never a sad face, never punishing.
```

---

## 5. Guardrails — reject any output that does this

- Dark background, dark mode, or glassmorphism
- Red or harsh error states anywhere in the child lane
- Blue used as chrome in the child lane (blue means "grown-up")
- Emoji presented as final character art
- Text a child must read in order to play
- Tap targets under 64px in the child lane
- Scores, streaks, coins, timers, leaderboards, or any counter that goes down
- Stock corporate photography, or children who don't look Rwandan
- More than 5 choices on a child screen
- Anything requiring a network connection, an account, or a login for a child
- Illustration too detailed to ship under 40KB as SVG
- A human character (Keza, Hirwa) used as UI chrome, a button, or a floating
  companion — they belong in videos, thumbnails and framed portraits only
- Ngabo showing sadness, disappointment, guilt or any "you left me" state
- Ngabo appearing on a grown-up (blue) screen
- Generic avatar parts — untextured "long/short" hair, a light default face, or
  anything that could belong to any app in any country
- Imigongo at full opacity, in its traditional black/white/red/ochre palette, or
  more than one motif on a screen
- A star counter that displays a number or can decrease
- More than one signature element competing on a single screen

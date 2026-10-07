# Kina Wige games — research and design

Approved by the owner 2026-10-07: rebuild handwashing first (owner reviews it
on a phone before the rest), then tracing, shapes & colours, jigsaw puzzles,
mazes. This document is the standard every game is built to.

---

## 1. What the research says makes a preschool game good

**The Four Pillars** (Hirsh-Pasek et al., 2015, *Psychological Science in the
Public Interest*). Children learn from an app when it is:

| Pillar | Means | So in Kina Wige |
|---|---|---|
| Active | "Minds-on": the child generates the answer | No tap-anything-and-something-happens screens. Every action is a decision. |
| Engaged | Effects serve the learning, they do not distract from it | Sparkle and sound only on the meaningful action, never on idle tapping. |
| Meaningful | Connected to the child's real life | Rwandan homes, food, animals, a kandagira ukarabe station — not a Western bathroom. |
| Socially interactive | Characters respond to what the child does | Kina reacts to the child's actions and shows how, instead of a voice from nowhere. |

**What most "educational" apps get wrong** (Meyer, Zosh et al., 2021, content
analysis of top-downloaded apps, *Journal of Children and Media*): most scored
low on all four pillars; free apps were worst because of "distracting visual and
sound effects, disruptive advertising, and irrelevant rewards"; and the field
generally lacks **scaffolded challenge**, while frequent reward feedback "may
undermine users' intrinsic motivation" (citing Callaghan & Reich, 2018). Open-
ended play matters as well as right/wrong tests.

**How 3–6 year olds actually touch a screen:**
- 3-year-olds tap and drag reliably; drag-and-drop is still hard at 2–3;
  everything gets steadily better to age 6.
- 3-year-olds land on average 4.5 mm off target, 5-year-olds 3.4 mm.
- Targets under ~64 px cause difficulty for 4–5-year-olds.
- Only 10–15 % of 3-year-olds even attempt multi-touch → **single finger only**.
- For children under about 30 months, tapping the *specific* thing helps
  learning; older preschoolers learn as well or better with less demanding
  interaction (Kirkorian et al., 2016, "All Tapped Out"). → Make the gesture the
  meaning (trace the letter, rub the hands), not busywork.

## 2. What the best games of each kind do

| Kind | Benchmark | What they get right |
|---|---|---|
| Tracing | **LetterSchool** | Four stages per letter: *intro* (shape, name, sound) → *tap* the start dots in order → *trace* with "magic ink" (grass growing, sparkling lights) → *write* from memory, with hints appearing only when the child struggles. |
| Shapes | **Busy Shapes** (Edoki Academy, built on Piaget) | Starts with ONE shape and ONE hole. Adds shapes, then colours, then obstacles the child must move out of the way — "cause and effect" growing into problem-solving across 150 small steps. Real-object textures, the next level glimpsed through the holes. |
| Jigsaw | Toddler jigsaw apps; **Sago Mini** | Ghost outline of the finished picture; big chunky pieces in a tray; each snaps in by itself; the same picture at 4, 6 or 9 pieces so it grows with the child. Parents praise Sago Mini for "lack of attention-retaining techniques". |
| Maze | **Thinkrolls** (Avokiddo) | The child drags only short distances and the character rolls on; easy mode 3–5, hard mode 5–8; mazes ask the child to think a few moves ahead. |
| Handwashing | **Sesame Workshop**, PBS KIDS | Five steps — water, soap, scrub, rinse, dry — a song to time the scrub, and asking the child to say each step. |
| Whole app | **Khan Academy Kids** | Free, no ads; an adaptive path that steps difficulty up or down by mastery; animal characters guide the child so they can play alone; prizes used to dress up the characters. |
| Competitor | **Apples & Bananas** | Wide variety (tracing, matching, sorting, puzzles, mazes, colouring, logic). Main criticism in an independent review: "a few games lacked prompts". |

**Lesson from the competitor's weakness:** a child who cannot read must never
be left not knowing what to do. Every game shows the gesture itself.

## 3. The Kina Wige game standard (every game, no exceptions)

1. **Shows, never tells.** After 5 s without progress, a ghost hand (and Kina)
   demonstrates the exact gesture. A voice slot exists for every instruction;
   until Kinyarwanda recordings exist (ROADMAP Human-required B), the ghost hand
   carries it.
2. **One finger, big targets.** Every touch target ≥ 64 px; drop zones larger
   still. Snap radius by age: 3 yrs 90 px · 4 yrs 70 px · 5–6 yrs 50 px.
3. **Failure teaches, never punishes.** A wrong drop glides back softly with a
   hint. No buzzer, no red cross, no lost stars, no timer pressure.
4. **Three levels of feedback, all earned.** A small sparkle, chime and haptic
   tick for each correct action; Kina reacts at each step; a celebration of 3 s
   at most at the end. Nothing happens for idle tapping.
5. **Grows with the child.** Starts from the age set in setup; two successes in
   a row step the level up, two struggles step it down. Many small steps, never
   a wall.
6. **Rwandan and meaningful.** Settings, objects, food, animals and names a
   Rwandan child recognises.
7. **Tells the parent what it taught.** Every attempt is recorded as skill
   evidence (useSkillEvidence) so the parent report can say what the child can
   do. Each game declares its curriculum skills or the build fails.
8. **Built for low-cost phones.** Illustrations as SVG in the Kina style (thick
   #10241B outlines, the app palette). Only transform and opacity animate; no
   React re-render per finger movement (refs and requestAnimationFrame);
   pointer capture with touch-action: none. Verified in CI on Android 12 /
   WebView 91 and Android 15.
9. **Respects the session.** Play time still ends the game; REST_EVENT stops
   any sound. Offline, KN/EN/FR, no reading required.

## 4. The games

### 4.1 Handwashing — *Karaba Amaboko* (rebuild, first)

Scene: a Rwandan **kandagira ukarabe** foot-pedal handwashing station
*(owner to confirm)*. Kina beside it. Steps (Sesame Workshop / WHO order):

| Step | The child does | The world does |
|---|---|---|
| Water | Taps the foot pedal | The can tips, water pours, hands glisten |
| Soap | Drags the soap onto the hands | Foam starts |
| Scrub | Rubs in circles over the hands | Bubbles grow; cartoon germs (friendly, not scary) pop; a bubble ring fills over 20 s with the hum of the handwashing song |
| Rinse | Taps the pedal again, drags the hands under | Foam washes away |
| Dry | Drags the towel across | Hands shine; Kina cheers |

Then the Kina Challenge: do it for real at a real basin.
Variety: rotating moments — before eating, after the toilet, after playing
outside, after touching animals. Levels: age 3 guided with ghost hand on every
step; age 4–5 a picture strip of the steps; age 6 the child chooses the next
step from two pictures (sequencing).

### 4.2 Tracing — *Andika*

Order: the vowels a e i o u (Unit 1), then numbers 1–10, later syllables
(ba be bi bo bu) to match syllabic Kinyarwanda reading.
Per character, LetterSchool's four stages: **watch** (Kina's pen draws it) →
**tap** the numbered start dots → **trace** with magic ink (growing grass,
banana leaves, sparkles) → **write** from memory with a faint guide, hints only
after a struggle. Correctness: ordered checkpoints sampled along each SVG
stroke; direction matters; ink only appears on the path. Celebration: the letter
becomes an object that starts with it *(words to be confirmed by a native
speaker)*. *Owner/teacher to confirm: lowercase or capitals first.*

### 4.3 Shapes & colours — *Imiterere n'Amabara*

Busy Shapes' progression: one shape, one hole → more shapes → colours → shape
and colour together → obstacles to move first. About 30 small levels. Shapes
are Rwandan objects: drum (circle), roof (triangle), window (square), agaseke
basket, banana leaf.

### 4.4 Jigsaw puzzles — *Teranya Ishusho* (put the picture together)

*All Kinyarwanda game names in this document are working titles for native
review.*

Pictures from our own art and Book Dash (CC BY, credited on screen and in
Settings). 4 / 6 / 9 pieces by age; ghost outline; big pieces in a tray; magnetic
snap; when complete, the picture comes alive briefly and its name is said.

### 4.5 Mazes — *Inzira*

Help Kina reach the water tap; take the cow to its shed; walk to school. Drag
Kina along the path; short drags. Age 3: wide paths, no dead ends. Age 5–6:
dead ends, and bananas to collect and count on the way.

### 4.6 Proposed additions (need owner approval)

- **Colouring — open-ended play.** The research is clear that not everything
  should be right/wrong. Tap-to-fill colouring of our scenes and Book Dash line
  art; finished pictures kept on the device in "my pictures" for the parent.
- **Sticker book.** Each finished game earns a sticker of a Rwandan animal or
  object (inyambo, ingagi, umusambi…). Stickers only accumulate — nothing is ever
  lost, no currency, nothing to buy — in line with the no-streak rule.

## 5. Build order and quality gates

1. **Game kit** shared by all games: drag-and-snap engine, ghost-hand hints,
   feedback levels, age-based difficulty, evidence recording, sound and haptics
   (add `android.permission.VIBRATE` — today navigator.vibrate silently does
   nothing in the Android app).
2. **Handwashing** on the kit → CI emulator tests → owner plays it on a phone.
   **Gate: the owner approves the quality before anything else is built.**
3. Tracing → 4. Shapes & colours → 5. Jigsaw → 6. Mazes, each with its own
   emulator checks, each shipped to testers as an update.

## 6. Owner decisions (2026-10-07)

1. **Art:** in-code SVG in the Kina style, drawn by the assistant.
2. **Voice:** none yet — game sounds and the ghost hand carry every
   instruction. The voice slot stays open for recordings later.
3. **Tracing:** both lowercase and capitals (separate sets the child picks),
   plus numbers 1–5 and 6–10. No vowel words until a native speaker picks them.
4. **Kandagira ukarabe:** yes, "do it professionally".
5. **Colouring and the sticker book:** yes — "as many stuffs as we can".
6. Other repos (Lyla Rose Games, bilnetoyun) are **visual reference only**: no
   licence, so nothing is copied; their jigsaw picker + piece-count pattern
   and car-wash scrubbing informed ours.

## 7. As built (games milestone)

| Game | id | Levels | Evidence recorded |
|---|---|---|---|
| Karaba Amaboko (rebuild) | `karaba` | 1 guided glow · 2 choose with strip · 3 choose from memory | `phy.hand.sequence`, first action per step, level ≥ 2; Kina Challenge (parent) |
| Andika | `andika` | 1 watch→trace · 2 +faint trace · 3 +write from memory | `snd.write.trace` (letters), `phy.fine.control` |
| Imiterere n'Amabara | `imiterere` | 30 levels: shapes → colours → both → leaves → more | `num.sort.one` / `num.sort.two` per drop; `num.shape.name` parent-marked |
| Teranya Ishusho | `teranya` | 4 / 6 / 9 / 12 pieces, 6 Rwandan pictures | `num.shape.build` per puzzle |
| Shaka Inzira | `inzira` | 6 levels: one road (3×4) → mazes up to 7×9, bananas from level 4, home at the far end of the longest road from level 5 | `phy.fine.control` per maze |
| Siga Amabara | `siga` | open-ended, 6 pictures, 11 colours, "my pictures" | none on screen; `art.colour.name` parent-marked |
| Sticker book | `/stickers` | 20 stickers (Microsoft Fluent Emoji 3D, MIT, bundled offline), accumulate-only | — |

The kit lives in `src/components/game/kit/` (Stage, Draggable, GhostHand,
Bursts, GameFrame, hooks) and the art in `src/components/game/art/`. The
Android smoke test plays handwashing through by touch and opens every new game
on Android 12 and 15.

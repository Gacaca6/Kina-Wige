# Kina Wige — Curriculum Architecture

**Version:** 1.0 · 2026-08-02
**Status:** Canonical. This document governs what Kina Wige teaches.
**Supersedes:** nothing. It *absorbs and extends* `docs/CURRICULUM.md`, which
remains valid for the Kinyarwanda literacy sequence (§6.3).

> **The governing rule of this company.**
> Kina Wige does not put school on a screen. It turns learning into play, play
> into discovery, discovery into practice, and knowledge into real life.
>
> Every episode, game, book and lesson we ever ship must be traceable to a named
> skill in this document. **If we cannot say what a piece of content teaches, it
> does not enter Kina Wige.** That rule is enforced by the build, not by
> goodwill (§17).

---

## 1. How to use this document

| If you are… | Read |
| --- | --- |
| Designing a screen | §10 (section×domain), §11 (lesson loop), §16 (wellbeing) |
| Writing a lesson | §8 (skills), §11, §12 (CPA), §14 (mastery) |
| Making an episode or book | §9 (themes), §17 (content contract), §18 (culture) |
| Building assessment | §13 (bands), §7 (levels) |
| Planning a release | §21 (vertical slice), §22 (scope & sequence) |
| Translating | §6 (language policy) |

---

## 2. Non-negotiables

These constrain every decision below. They are not up for redesign.

**N1 — The four product sections never change.**
`Iga` (Learn) · `Amasomo` (Episodes) · `Imikino` (Games) · `Ibitabo` (Books).
The curriculum runs *underneath* them (§10), never alongside them.

**N2 — Rwanda's six pre-primary learning areas are the spine** (§5). International
frameworks supply *technique*, never structure.

**N3 — 100% offline.** No APIs, no analytics, no runtime network calls.
This shapes assessment (§13) more than anything else in this document.

**N4 — Trilingual UI, Kinyarwanda-first instruction.** See §6 — this resolves a
real contradiction and must be read before any content is written.

**N5 — No scores, no grades, no ranking, no streaks.** Assessment is
criterion-based against developmental standards (§13).

**N6 — Learning value per minute, never minutes.** We optimise against WHO
guidance on sedentary screen time for under-fives (§16).

**N7 — Nothing ships without a declared skill** (§17).

---

## 3. Philosophy

```
PLAY  →  EXPLORE  →  DISCOVER  →  PRACTICE  →  CREATE  →  SHARE
```

A child should never feel *"I am doing schoolwork."* They should feel *"I am
going on an adventure."* Underneath that adventure, every activity has a
deliberate developmental purpose.

This is not a soft position — it is the one Rwanda's own ECD standards call for:
play-based, multisensory, contextualised, individualised, thematic and
integrated, with balance between indoor/outdoor, active/passive, noisy/quiet,
individual/group and free/structured activity.

---

## 4. The pedagogical stack

Each layer names what it contributes and — importantly — what we deliberately
do **not** take from it.

| Layer | Foundation | We take | We do not take |
| --- | --- | --- | --- |
| National curriculum | Rwanda six pre-primary learning areas | The entire domain structure | — |
| Child development | WHO / UNICEF Nurturing Care | Health, nutrition, responsive caregiving framing | Clinical assessment |
| Learning philosophy | Play-based, child-centred | Play as the primary vehicle | Unstructured free-for-all |
| Discovery | Reggio Emilia | Child as capable investigator; many languages of expression; documentation; family participation | Its full studio/atelierista model — we are an app, not a school |
| Play & outdoors | Finland ECEC | Play, exploration, wellbeing, delayed formal pressure | Their school system wholesale |
| Numeracy | Singapore NEL + CPA | Concrete → Pictorial → Abstract | Drill-and-worksheet culture |
| Practice | Deliberate-practice principles | Short mastery cycles, spaced repetition, progressive challenge | The Polgár specialisation narrative — **not** presented as a foundation (§4.1) |
| Milestones | EYFS structure | Broad developmental areas made visible and measurable | UK-specific goals as our targets |
| Assessment | Rwanda progressive, criterion-based | Four qualitative bands | Percentages, grades, ranking |
| Language | Mother-tongue-based multilingual education | Kinyarwanda-first | Equal simultaneous trilingual instruction |
| Culture | Rwandan stories, places, language | Everything | Generic "African" styling |
| Family | Serve-and-return interaction | Parent as co-educator | Parent as supervisor |

### 4.1 On the Polgár question

We keep the *principle* — skills improve through appropriate practice,
feedback, repetition and progressively greater challenge — and we discard the
framing. There is not enough evidence to treat it as an established ECD
curriculum framework, and "early intensive specialisation" is the wrong message
for a 3-year-old. It appears in this document only as the mastery loop (§14).

---

## 5. The six domains

Permanent. These never disappear, however the app grows.

| # | Domain | Kinyarwanda | Weight | Why this weight |
| --- | --- | --- | --- | --- |
| D1 | **Language & Literacy** | Ururimi n'ubumenyi bwo gusoma | 25% | Strongest predictor of later school success |
| D2 | **Numeracy** | Imibare | 20% | Number sense is the second-strongest predictor |
| D3 | **Discovery of the World** | Gushakashaka isi | 15% | Curiosity is the engine; cheapest domain to teach well |
| D4 | **Physical & Health** | Ubuzima n'umubiri | 15% | Where we produce measurable public-health outcomes |
| D5 | **Social & Emotional** | Imyifatire n'amarangamutima | 15% | School readiness is as much regulation as knowledge |
| D6 | **Creative Arts & Culture** | Ubuhanzi n'umuco | 10% | Where Kina Wige becomes unmistakably Rwandan |

**Weights govern content commissioning, not screen time.** They are the answer
to "what should we build next?" — and they are why §10's matrix flags Creative
Arts as currently under-served.

### D1 · Language & Literacy
Listen → Understand → Speak → Play with language → Recognise → Read → Write.
Never: memorise the alphabet → memorise words → worksheet.

### D2 · Numeracy
Concrete → Pictorial → Abstract (§12). The goal is never "can the child recite
1–20?" It is **"does the child know what a number means?"**

### D3 · Discovery of the World
Question → Prediction → Exploration → Discovery → Explanation.
We ask *"why does rain fall?"* and let the child predict before we answer.

### D4 · Physical & Health
Hygiene, nutrition, gross and fine motor, safety. Our handwashing content lives
here and carries a genuine health outcome.

### D5 · Social & Emotional
Naming feelings, empathy, sharing, turn-taking, self-control. An episode never
says *"don't take things."* It asks *"how does she feel? what could he do?"*

### D6 · Creative Arts & Culture
Rwandan songs, stories, dance, crafts, foods, landscapes, Umuganda, family life.
And the child must **create**, not only consume: *draw your family; make a drum
rhythm; tell us what you saw in the garden.*

---

## 6. Language policy

This section resolves a genuine contradiction. Read it before writing content.

### 6.1 The two different questions

| Question | Answer | Authority |
| --- | --- | --- |
| What language is the **interface** in? | Always all three: KN / EN / FR | `CLAUDE.md` rule 4 — a hard rule |
| What language do we **teach in**? | Kinyarwanda-first, staged | This document |

Confusing these two is how a contributor breaks either the hard rule or the
pedagogy. **Every UI string is trilingual. Instruction is sequenced.**

### 6.2 Instructional staging

| Level | Kinyarwanda | English | French |
| --- | --- | --- | --- |
| **L1 · 3–4** | Full instruction | Song/label exposure only | — |
| **L2 · 4–5** | Full instruction | **Receptive** — understands simple spoken instructions | Song/label exposure |
| **L3 · 5–6** | Full instruction | **Productive** — speaks simple phrases; early decoding | Receptive exposure |

*Recommended, pending owner sign-off (§23-A).* Teaching three phonologies
simultaneously to a four-year-old is not supported by evidence and would slow
all three.

### 6.3 The Kinyarwanda literacy sequence — the most important call we make

Most children's literacy apps are built for English. **English phonics teaches
phoneme blending (`/k/-/a/-/t/`) because English spelling is irregular.**
Kinyarwanda is not English:

- transparent orthography — letters map to sounds reliably
- strongly syllabic, mostly **CV** structure (*ma, ke, si*)
- five clean vowels — *inyajwi*: a, e, i, o, u

Therefore the evidence-aligned path is **syllabic, not phonemic**:

```
inyajwi (vowels)  →  CV syllables  →  whole words  →  short sentences
   a e i o u          ma me mi mo mu     mama, ameza      Mama arasoma.
```

This is why **Unit 1 is the vowels**, and why the *a-i-e-o-u* song already
produced is the correct first artefact. Copying Singapore's *maths* sequence is
right. Copying English's *literacy* sequence would be a real pedagogical error.

**Open linguistic item (§23-C):** the introduction order of consonants, and the
handling of digraphs (*cy, jy, ny, sh, shy*) and prenasalised consonants
(*mb, nd, ng*) — which are common and are **not** simple CV — require sign-off
from a Kinyarwanda literacy specialist before Unit 4 ships.

---

## 7. Three developmental levels

| Level | Age | Name | Character |
| --- | --- | --- | --- |
| **L1** | 3–4 | **Discover** (Menya) | Senses, vocabulary, counting to 5, colours, shapes, feelings, hygiene |
| **L2** | 4–5 | **Explore** (Shakashaka) | Sentences, counting to 10, patterns, sorting, storytelling, independence |
| **L3** | 5–6 | **Create & Apply** (Rema) | Early reading and writing, number reasoning, explanation, planning, collaboration, school readiness |

Levels are **not gates**. A child may sit at L3 in numeracy and L1 in writing.
The app tracks per-skill, never per-child-overall (§13).

---

## 8. Skill taxonomy

### 8.1 Identifier scheme

```
<domain>.<strand>.<skill>          e.g.  snd.vowel.recognise
                                          num.count.cardinal5
                                          wld.hygiene.handwash
```

Domain prefixes: `snd` `wrd` (D1) · `num` (D2) · `wld` (D3) · `phy` (D4) ·
`soc` `self` (D5) · `art` (D6).

### 8.2 Every skill declares

| Field | Meaning |
| --- | --- |
| `id` | Stable forever. Never renamed — content references it. |
| `domain` | One of D1–D6 |
| `level` | L1 / L2 / L3 — where it is *introduced* |
| `needs` | Prerequisite skill ids. Nothing unlocks before these are met. |
| `statement` | What the child can do, in observable terms |
| `evidence` | What we would *see* that proves it (§13) |

### 8.3 How a skill statement is written

Good: *"Answers 'how many?' after counting a group of up to 5 objects."*
Bad: *"Understands numbers."*

If you cannot observe it, you cannot assess it, and it is not a skill.

---

## 9. The ten themes

Themes are **learning worlds**, not lesson lists. Each activates several
domains, which is how Rwanda's integrated thematic approach is meant to work.

| # | Theme | Kinyarwanda | Primary domains |
| --- | --- | --- | --- |
| T1 | Me | Njye | D5 D4 D1 |
| T2 | My Home | Urugo rwanjye | D5 D3 D1 |
| T3 | My Community | Umudugudu | D3 D5 D6 |
| T4 | Food & Farming | Ibiryo n'ubuhinzi | D4 D2 D3 |
| T5 | Nature | Ibidukikije | D3 D2 D6 |
| T6 | My Body & Health | Umubiri n'ubuzima | D4 D5 |
| T7 | Colours & Shapes | Amabara n'ibishushanyo | D2 D6 |
| T8 | Stories & Imagination | Inkuru n'ubwenge | D1 D6 |
| T9 | Rwanda | U Rwanda | D6 D3 D1 |
| T10 | My World | Isi yanjye | D3 D6 D5 |

---

## 10. How the curriculum sits under the four sections

Sections are **delivery vehicles**. Domains are **what is taught**.

| Domain | Iga (Learn) | Amasomo (Episodes) | Imikino (Games) | Ibitabo (Books) |
| --- | --- | --- | --- | --- |
| D1 Language | ● primary | ○ support | ○ support | ● primary |
| D2 Numeracy | ● primary | ○ support | ● primary | ○ support |
| D3 Discovery | ○ support | ● primary | ○ support | ○ support |
| D4 Physical/Health | ○ support | ● primary | ● primary | ○ support |
| D5 Social/Emotional | ○ support | ● primary | ○ support | ● primary |
| D6 Creative/Culture | ○ support | ○ support | ○ support | ● primary |

**Read the columns to plan; read the rows to audit.**

> **Gap this matrix exposes today:** D6 Creative Arts & Culture has no strong
> home. Books carry it alone, and we currently ship two. Either Books expands
> substantially, or `Iga` gains a *create* step (it already does — §11 step 6),
> which must then actually be built. This is a real finding, not a theoretical
> one.

### What each section is *for*

- **Iga** — the structured pathway. Sequenced, prerequisite-aware, mastery-tracked.
- **Amasomo** — the *emotional engine*. Story → emotion → curiosity → lesson.
  Not a classroom. An episode ends with a question, not a summary.
- **Imikino** — learning disguised as play, never play disguised as education.
  Every game names its skill or it does not ship.
- **Ibitabo** — the bridge off the screen. A story met in an episode reappears
  as a book, and books extend into the physical world.

---

## 11. The seven-step lesson loop

Every `Iga` lesson follows this. It is where the philosophies become one method.

| # | Step | What happens | Origin |
| --- | --- | --- | --- |
| 1 | **Wonder** | Something catches attention. No task yet. | Reggio |
| 2 | **Discover** | The child explores and predicts. | Reggio / Finland |
| 3 | **Play** | The child interacts with the concept concretely. | Finland |
| 4 | **Learn** | The concept is named. | Rwanda / EYFS |
| 5 | **Practice** | Short, repeated, unloseable. | Mastery loop |
| 6 | **Create** | The child makes something of their own. | Reggio ("hundred languages") |
| 7 | **Connect** | Something to do off the screen, with an adult. | Finland / Nurturing Care |

**Steps 6 and 7 are not optional.** They are what separate this from a quiz app,
and they are the two most commonly skipped under deadline pressure.

---

## 12. Numeracy — CPA in practice

```
CONCRETE            PICTORIAL              ABSTRACT
3 real bananas  →   🍌🍌🍌 on screen   →   the numeral 3
```

Rules:
- **Never open at Abstract.** A numeral shown before quantity is understood
  teaches recitation, not number.
- Concrete may be **off-screen** — "find three stones" is a legitimate step, and
  is often the better one.
- **Cardinality is assessed separately from counting.** A child who recites
  "1-2-3-4-5" but cannot answer *"so how many?"* has learned a song, not number
  sense. This single probe is the cheapest way to tell real learning from rote,
  and it is our headline evidence metric.

Progression: counting → recognition → quantity → comparison → patterns →
shapes → sorting → measurement → addition/subtraction concepts → problem solving.

CPA is supported by Singapore's NEL framework and has been studied in Rwandan
classrooms specifically — which is part of why it is the right borrowing.

---

## 13. Assessment — and how it works with no analytics

### 13.1 The four bands

| Band | Kinyarwanda | Meaning |
| --- | --- | --- |
| 🌱 **Emerging** | Aratangira | Beginning to show the skill |
| 🌿 **Developing** | Aragenda | Can do it with support |
| 🌳 **Demonstrated** | Arabishoboye | Can do it independently |
| ⭐ **Applying** | Arabikoresha | Uses it in a new situation |

Never a percentage. Never a grade. Never a comparison between children. This
matches Rwanda's progressive, criterion-based approach — children are compared
against developmental standards, not against each other.

### 13.2 The constraint that shapes everything

**We have no analytics by design (N3).** Therefore:

- All assessment data is **on-device**, in `localStorage`, and never transmitted.
- The **parent** is the audience for it — not us.
- Evidence for the company comes from the **funded pilot**: moderated sessions,
  pre/post probes, parent diaries, and on-device records read **with consent**.
- A skill advances a band from **two separate sessions**, never one. A single
  lucky tap is not evidence.

### 13.3 What we report to a parent

Descriptive, never numeric:

> *"Keza is using counting in new situations. This week she counted five things
> without help, twice."*

Never: *"Keza scored 72%."*

---

## 14. The mastery loop

```
Learn → Try → Make mistakes → Encouraging feedback → Try again → Master → Apply anew
```

- **Spaced repetition:** every skill returns after **1 day, 3 days, 7 days**.
- **Mastery = 4 of 5 correct across two different sessions.**
- **Wrong costs nothing.** No lives, no timer, no losing. A wrong tap narrows
  the field and re-asks.
- **Nothing is red.** Gentle redirect in the system's audio-yellow.

---

## 15. Beyond the screen

### 15.1 Kina Challenge — the offline extension

Every lesson ends with something to do **in the real world**:

> 🌱 **Kina Challenge** — Find a plant near your home. Touch one leaf. What does
> it feel like? Ask a grown-up: *what does this plant need to grow?*

The parent marks *"We did it!"* on return. This is Reggio + Finland + Rwanda +
digital learning doing one job together, and it is the clearest expression of
our belief that the app should not be the child's whole learning environment.

### 15.2 Parent connection — serve and return

After a lesson, the parent gets **one two-minute activity**:

> *"Ask your child to find three red things."*
> *"Ask your child how they felt today."*
> *"Ask your child what happened in the story."*

Responsive back-and-forth interaction with an adult is foundational to early
language and brain development. Our job is to **create** those exchanges, not
replace them. UNICEF Rwanda has highlighted that home learning engagement is a
key gap — this is the feature that addresses it directly.

---

## 16. Digital wellbeing rules

WHO guidance for under-fives emphasises physical activity, sleep, and limiting
sedentary screen time. Kina Wige is therefore **never** designed to maximise
time in app.

| Rule | Value |
| --- | --- |
| Session cap | **12 minutes**, then Kina goes to sleep |
| Lesson length | 4–6 minutes |
| Choices per screen | 3 (4 only for numerals) |
| Ends with | *"Now go and play!"* — never *"keep watching"* |
| Autoplay of next video | **Never** |
| Notifications | At most one gentle daily prompt, to the **parent** |

**A five-minute meaningful activity beats a thirty-minute content binge.** This
is also our commercial position: we sell *learning per minute*, not minutes.

---

## 17. The content contract — the rule that makes this real

A curriculum in a document can be ignored. A curriculum in the type system
cannot. **Every content item declares what it teaches:**

```ts
interface ContentMeta {
  skills: SkillId[];        // REQUIRED, non-empty — what this teaches
  level: 'L1' | 'L2' | 'L3';
  theme: ThemeId;
  domains: DomainId[];      // derived from skills; asserted for auditing
  minutes: number;          // for the session cap (§16)
  offline?: KinaChallenge;  // required for Iga lessons
  parent?: ParentActivity;  // required for Iga lessons
}
```

Applied to **every** episode, game, book and lesson. Then:

- A build-time check **fails the build** if any content item has an empty
  `skills` array, or references a skill id that does not exist.
- A coverage report prints skills with **no** content (gaps) and skills with
  **excess** content (over-served).

**Status: implemented (2026-08-08).** `src/data/curriculum.ts` holds the
taxonomy; `scripts/check-curriculum.mjs` is the gate and runs as the first step
of `npm run build`. The division of labour:

| Caught by | What |
| --- | --- |
| **TypeScript** | Unknown or misspelled skill id (it suggests the right one); `skills: []`; missing `curriculum` block on any episode, game, book or lesson |
| **The check script** | Prerequisite cycles · a prerequisite that outranks its own skill · declared domains that do not match the skills taught · content marked below the level it teaches · unknown theme · over the session cap · an Iga lesson with no Kina Challenge or parent activity · a lesson item teaching a skill the lesson does not declare · deprecated-skill references |
| **The coverage report** | Skills with no content (gaps), skills with more than three items (over-served), per-domain and per-level counts |

`SkillId` is **derived** from the skill table rather than written by hand, so the
id union cannot drift from the data. Prerequisites are validated at compile time
by a single assertion line, before the script ever runs.

It was roughly two hours of work and it is the difference between a curriculum
and a wish.

---

## 18. Cultural content rules

A child must **recognise their own world**. Not a generic African cartoon — a
child's Rwanda.

**Required presence:** Rwandan hills, villages, Kigali streets, markets, farms,
buses and motos, cows, goats, chickens, bananas, beans, potatoes, rain,
Umuganda, family and community life, Rwandan music, Kinyarwanda expressions,
local stories.

**Prohibited:** snow-and-pine-tree scenery, foreign coins or currency, imported
holidays as defaults, food a Rwandan child would not recognise, and any
"generic Africa" that could be anywhere on the continent.

**Character rule:** human characters (Keza, Hirwa, family) live in the *videos*.
The mascot (Kina) lives in the *interface*. They never swap. See
`docs/CHARACTERS-AND-IDENTITY.md`.

---

## 19. Accessibility & inclusion

- **Nothing depends on reading.** Icon + colour + spoken audio carry all meaning.
- **Nothing depends on sound.** Every audio cue has a visual twin.
- **Nothing depends on colour alone.** Selection uses ring + scale as well.
- **Disability is represented in content**, not only accommodated in UI.
- **Girls and boys appear equally** in every role, including problem-solving and
  leadership.
- **Rural and urban childhoods both appear.** A child in Burera and a child in
  Kigali must both see themselves.
- Targets ≥ 72px for children; reduced-motion honoured; nothing above 3 Hz.

---

## 20. Content authoring workflow

Every new piece of content passes this gate before it ships:

1. **Declare** — which skills, level, theme, minutes.
2. **Check prerequisites** — does anything need to come first?
3. **Locate on the matrix** (§10) — is this section the right vehicle?
4. **Write the evidence statement** — what will we observe?
5. **Add the Connect step** (Iga only) — offline + parent activity.
6. **Cultural review** (§18).
7. **Kinyarwanda review** — machine-written KN goes to the ROADMAP queue.
8. **Build check** (§17) must pass.

**If step 1 cannot be answered, the work stops there.**

---

## 21. Delivery plan

| Phase | Deliverable | Touches code? | Status |
| --- | --- | --- | --- |
| **1** | This document | No | ✅ 2026-08-02 |
| **2** | `curriculum.ts` — machine-readable taxonomy + content contract + build check | Yes | ✅ 2026-08-08 |
| **3** | **One complete vertical slice** | Yes | next |
| **4** | On-device assessment + parent connection | Yes | — |
| **5** | Scale themes, one at a time, each fully realised | Yes | — |

### What Phase 2 measured

All 14 existing content items now declare what they teach. The first coverage
report says: **21 of 86 skills are taught (24%)**, and **D3 Discovery and D6
Creative Arts have no content at all** — 25% of the curriculum by weight,
entirely unserved. The D6 gap was predicted by §10. The D3 gap was not, and it
is the more surprising one, since §5 calls Discovery "the cheapest domain to
teach well".

Three mappings did not survive contact with the code, and are recorded in
`docs/CURRICULUM-SKILLS.md`: the handwashing game counts nothing, the episodes
never reach the germ explanation (one comic panel is its sole carrier), and the
Memory game trains something this taxonomy does not name.

### The vertical slice (Phase 3)

**Theme T6 · My Body & Health — handwashing.** Chosen because the content
already exists (episode, game, comic), so we test the *system*, not our ability
to make assets.

It must ship complete:

```
Iga lesson  →  Amasomo episode  →  Imikino game  →  Ibitabo book
      →  Kina Challenge (offline)  →  Parent activity  →  Assessment against the bands
```

**One theme fully realised and tested with real children is worth more than ten
sketched ones** — to a child, and to a judge. We do not start Phase 5 until a
child has completed Phase 3's loop in front of us.

---

## 22. Scope & sequence — the roadmap of what children learn

The answer to *"what should a child know, and when?"*

### Level 1 · 3–4 · Discover

| Domain | By the end of L1, the child can… |
| --- | --- |
| D1 | Listen to a short story; name common objects; hear that two words rhyme; recognise the five vowels by sound |
| D2 | See 1–3 without counting; count to 5 in order; touch each object once while counting |
| D3 | Name common animals and plants; say what living things need; predict a simple outcome |
| D4 | Wash hands in sequence; name healthy foods; run, jump and balance; hold a crayon |
| D5 | Name happy, sad, angry, afraid; take a turn; ask for help |
| D6 | Sing a Rwandan song; draw a person; name primary colours |

### Level 2 · 4–5 · Explore

| Domain | By the end of L2, the child can… |
| --- | --- |
| D1 | Speak in sentences; clap syllables; blend a CV syllable; recognise their own name in print |
| D2 | Answer *"how many?"* to 5 (**cardinality**); match numeral to quantity; compare more/fewer; copy an AB pattern |
| D3 | Ask why; group by one attribute; describe weather; explain where food comes from |
| D4 | Brush teeth; choose a healthy plate; cross a road safely with an adult; cut and trace |
| D5 | Name why someone feels something; share; wait; use a calming routine |
| D6 | Tell an original short story; make a rhythm; build with shapes |

### Level 3 · 5–6 · Create & Apply

| Domain | By the end of L3, the child is ready for P1 — they can… |
| --- | --- |
| D1 | Read familiar CV syllables and 2-syllable words; write their own name; retell a story in order; predict what happens next |
| D2 | Count and answer *"how many?"* to 10; join two small groups; sort by two attributes; extend an ABC pattern; use words for measurement |
| D3 | Ask a question, predict, test and explain; describe a life cycle; name features of Rwanda |
| D4 | Explain *why* we wash hands; plan a healthy meal; demonstrate fine motor control for writing |
| D5 | Resolve a small disagreement with words; work with a partner toward a goal; regulate frustration |
| D6 | Plan and complete a creative project; describe Rwandan traditions; perform for others |

**This is the roadmap.** Every theme, unit and content item traces to a row above.

---

## 23. Open decisions — owner and specialists only

- **A · Language staging (§6.2).** Recommended: English receptive at L2,
  productive at L3; French exposure at L2, receptive at L3. Needs sign-off.
- **B · Vertical slice (§21).** Recommended: handwashing (T6). Alternative: the
  vowels (T8/D1). Needs sign-off.
- **C · Kinyarwanda literacy sequence (§6.3).** Consonant order, digraphs and
  prenasalised consonants need a Kinyarwanda literacy specialist before Unit 4.
- **D · REB alignment.** This document is written to sit inside Rwanda's
  pre-primary curriculum. **The exact competence codes must be mapped from the
  official REB documents before any public alignment claim is made.** No codes
  are invented here, and none may be added without the source in hand.
- **E · Kinyarwanda review.** All machine-written KN in this document
  (domain names, band names, theme names) goes to the ROADMAP review queue.

---

## 24. Definition of done — Phase 1

- [x] Rwanda's six areas are the spine; international frameworks supply technique only
- [x] The four product sections are unchanged and the domains sit underneath them
- [x] Language contradiction resolved: trilingual UI, Kinyarwanda-first instruction
- [x] Kinyarwanda syllabic sequence preserved and justified
- [x] Three levels with observable outcomes (§22)
- [x] Skill id scheme with prerequisites and evidence statements
- [x] Ten themes mapped to domains
- [x] Section×domain matrix, with the D6 gap named honestly
- [x] Seven-step lesson loop including Create and Connect
- [x] CPA specified, with cardinality as the headline probe
- [x] Four assessment bands, workable with zero analytics
- [x] Mastery loop with spaced repetition
- [x] Offline Kina Challenge and parent serve-and-return
- [x] Digital wellbeing rules incl. 12-minute cap
- [x] Content contract specified for Phase 2 enforcement
- [x] Cultural, accessibility and authoring rules
- [x] Scope & sequence roadmap for all three levels
- [x] Open items recorded rather than papered over

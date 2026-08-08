# Kina Wige — Curriculum (superseded)

**Version:** 1.0 · 2026-08-01
**Status:** ⚠️ **SUPERSEDED — do not author content from this file.**

| Looking for | Go to |
| --- | --- |
| What we teach and why (the spine) | **`CURRICULUM-ARCHITECTURE.md`** |
| The authoritative skill list and ids | **`CURRICULUM-SKILLS.md`** |
| The evidence base and rationale below | this file, kept for reference |

This document was the first pass. Its **evidence base** (§1), its
**Kinyarwanda syllabic argument** (§2) and its **lesson-shape rules** (§6)
were carried forward intact and are now expressed in the two files above.
Its skill list (§4) and unit table (§5) are **replaced** by
`CURRICULUM-SKILLS.md`, which is larger, has evidence statements, and is the
one the build will enforce.

Kept — not deleted — because the reasoning here is why the architecture looks
the way it does.

---

**Original scope:** ages 3–6 · Kinyarwanda-first, mirrored in English and French

> **The rule:** nothing ships unless it teaches a named skill from this document,
> at a stated level, in a stated sequence. "Fun and educational" is not a
> curriculum — a sequence with a rationale is.

---

## 1. What the evidence says actually matters

Two large syntheses dominate this age band, and they agree on a short list.

**Early literacy — the strongest predictors of later reading** (National Early
Literacy Panel; National Reading Panel):

1. **Alphabet knowledge** — naming letters and their sounds
2. **Phonological awareness** — hearing and manipulating sound units,
   *independently of print*
3. **Rapid automatised naming** — fast retrieval of familiar items
4. **Writing letters / one's own name**
5. **Phonological memory** — holding sounds in mind briefly

Vocabulary and oral comprehension matter enormously too, but they act *later* and
more slowly. For 3–6, the five above are the highest-leverage targets.

**Early numeracy — the developmental spine:**

1. **Subitising** — seeing "3" instantly without counting (starts ~age 2–3)
2. **The counting principles** (Gelman & Gallistel): one-to-one correspondence,
   stable order, **cardinality** (the last word tells you *how many*),
   abstraction, order-irrelevance
3. **Comparison** — more / fewer / same
4. **Patterns and seriation** — the root of algebraic thinking
5. **Shape and space** — naming, matching, orienting

**Cardinality is the hinge.** A child who counts "1-2-3-4-5" but cannot answer
"so how many?" has a rote sequence, not number sense. We test for it explicitly.

**Learning conditions** (NAEYC developmentally appropriate practice; Head Start
ELOF): play-based, adult-supported, short, repeated, multi-sensory, and paced to
the child — never timed, never scored against other children.

---

## 2. The Kinyarwanda decision — and why it is the most important one here

Most children's literacy apps are built for English, and English phonics is an
awkward, opaque system: 26 letters, ~44 phonemes, and irregular spelling. Its
standard instructional path (phoneme blending: /k/-/a/-/t/ → "cat") exists
*because* English is irregular.

**Kinyarwanda is not English, and copying English phonics would be a pedagogical
error.** Kinyarwanda has:

- a **transparent orthography** — letters map to sounds far more reliably
- a **strongly syllabic, mostly CV structure** (consonant + vowel: *ma, ke, si*)
- **five clean vowels** — a, e, i, o, u (*inyajwi*)

So the research-aligned path for Kinyarwanda is **syllabic, not phonemic**:

```
inyajwi (vowels)  →  CV syllables  →  whole words  →  short sentences
   a e i o u          ma me mi mo mu     mama, ameza      Mama arasoma.
```

This is why **Unit 1 is the vowels**, and why the vowel song already produced
(*a-i-e-o-u*) is exactly the right first artefact. A child who owns the five
vowels can decode a large share of Kinyarwanda syllables almost immediately —
a much faster win than English-style blending would ever give them.

**English and French are mirrored, not taught in parallel.** A lesson is taught
in one language; the other two appear as a gentle echo (the same word, spoken).
Teaching three phonologies at once to a 4-year-old is not supported by evidence
and would slow all three.

---

## 3. Domains

Six domains, weighted by evidence and by what a Rwandan pre-primary child needs.

| # | Domain | Kinyarwanda | Weight | Why |
| --- | --- | --- | --- | --- |
| 1 | **Sounds & letters** | Amajwi n'inyuguti | 30% | The top predictors (§1) |
| 2 | **Numbers & quantity** | Imibare | 25% | Number sense, cardinality |
| 3 | **Words & meaning** | Amagambo | 15% | Vocabulary, oral comprehension |
| 4 | **My world** | Isi yanjye | 15% | Health, hygiene, safety, nature |
| 5 | **Me & others** | Njye n'abandi | 10% | Social-emotional learning |
| 6 | **Thinking** | Gutekereza | 5% | Patterns, sorting, problem solving |

Domains 4 and 5 carry the hygiene and values content that already exists — and
they are where a Rwandan curriculum should be *stronger* than an imported one.

---

## 4. Skill sequence

Each skill has an id used in code (`data/curriculum.ts`), a level, and a
prerequisite. **Nothing unlocks before its prerequisite is met.**

### Domain 1 · Sounds & letters

| id | Skill | Level | Needs |
| --- | --- | --- | --- |
| `snd.listen` | Distinguish everyday sounds | 1 | — |
| `snd.rhyme` | Hear that two words end alike | 1 | `snd.listen` |
| `snd.vowel.recognise` | Recognise a, e, i, o, u by sound | 1 | `snd.listen` |
| `snd.vowel.name` | Name each vowel letter on sight | 2 | `snd.vowel.recognise` |
| `snd.syllable.hear` | Clap syllables in a word (*ma-ma*) | 2 | `snd.vowel.recognise` |
| `snd.cv.blend` | Blend consonant + vowel (*m + a → ma*) | 3 | `snd.vowel.name` |
| `snd.cv.read` | Read a CV syllable on sight | 3 | `snd.cv.blend` |
| `snd.word.read` | Read a familiar 2-syllable word | 4 | `snd.cv.read` |
| `snd.write.trace` | Trace a letter with correct stroke order | 2 | `snd.vowel.name` |
| `snd.write.name` | Write own name | 4 | `snd.write.trace` |

### Domain 2 · Numbers & quantity

| id | Skill | Level | Needs |
| --- | --- | --- | --- |
| `num.subitise3` | See 1–3 instantly, without counting | 1 | — |
| `num.count5` | Count to 5 in order | 1 | — |
| `num.oneToOne` | Touch each item once while counting | 2 | `num.count5` |
| `num.cardinal5` | Answer "how many?" after counting | 2 | `num.oneToOne` |
| `num.numeral5` | Match numeral 1–5 to a quantity | 3 | `num.cardinal5` |
| `num.compare` | More / fewer / same | 3 | `num.cardinal5` |
| `num.count10` | Count to 10 with one-to-one | 3 | `num.cardinal5` |
| `num.cardinal10` | "How many?" up to 10 | 4 | `num.count10` |
| `num.addSmall` | Join two small groups (2+1, 2+2) | 4 | `num.cardinal10` |
| `num.shape` | Name circle, square, triangle | 2 | — |

### Domain 3 · Words & meaning
`wrd.name` (name common objects) → `wrd.category` (group: food, animals, body) →
`wrd.action` (verbs) → `wrd.describe` (size/colour) → `wrd.story.recall`
(retell what happened) → `wrd.story.predict` (what happens next?)

### Domain 4 · My world
`wld.handwash` · `wld.teeth` · `wld.food.healthy` · `wld.water.safe` ·
`wld.road.safe` · `wld.animals.local` · `wld.plants.grow` · `wld.weather`

### Domain 5 · Me & others
`self.feelings.name` · `self.calm` (a breathing routine) · `soc.share` ·
`soc.turns` · `soc.help` · `soc.kind.words`

### Domain 6 · Thinking
`thk.match` · `thk.sort` (by one attribute, then two) · `thk.pattern.ab` ·
`thk.pattern.abc` · `thk.sequence` (what happened first?)

---

## 5. The twelve units

Twelve units, ~6 lessons each. Literacy and numeracy **alternate** so no child
stalls on one strand, and world/SEL content is woven through. It is a **spiral**:
every unit revisits an earlier skill at a higher level.

| # | Unit | Kinyarwanda | Core skills | Band |
| --- | --- | --- | --- | --- |
| 1 | First sounds | Amagambo yambere | `snd.listen` `snd.vowel.recognise` `snd.vowel.name` | 3–4 |
| 2 | How many? | Turabara | `num.subitise3` `num.count5` `num.oneToOne` | 3–4 |
| 3 | Clean hands | Amaboko meza | `wld.handwash` `thk.sequence` | 3–4 |
| 4 | Syllables sing | Inyajwi n'ingombajwi | `snd.syllable.hear` `snd.cv.blend` | 4–5 |
| 5 | How many now? | Bingahe? | `num.cardinal5` `num.numeral5` `num.compare` | 4–5 |
| 6 | Animals near us | Inyamaswa | `wrd.category` `wld.animals.local` | 4–5 |
| 7 | Reading syllables | Gusoma | `snd.cv.read` `snd.write.trace` | 4–5 |
| 8 | Shapes & patterns | Ibishushanyo | `num.shape` `thk.pattern.ab` `thk.pattern.abc` | 4–5 |
| 9 | How I feel | Uko numva | `self.feelings.name` `self.calm` `soc.kind.words` | 4–5 |
| 10 | Good food | Ibiryo byiza | `wld.food.healthy` `thk.sort` | 5–6 |
| 11 | Ten and more | Icumi | `num.count10` `num.cardinal10` `num.addSmall` | 5–6 |
| 12 | My first words | Amagambo yanjye | `snd.word.read` `snd.write.name` `wrd.story.recall` | 5–6 |

**Free tier = Unit 1 + five stories + the whole play hub** (as the Plan screen
promises). Units 2–12 are the subscription.

---

## 6. Lesson shape

Every lesson is **4–6 minutes**, 5–8 activities, and follows the same rhythm so a
pre-reader always knows what is happening:

```
Hear it   → Kina says it; the child only listens          (no interaction)
See it    → the thing appears with its sound              (tap to hear again)
Try it    → 2–3 choice question, unloseable               (the practice)
Do it     → trace / count / match — hands on              (the transfer)
Say it    → the child repeats aloud                       (no scoring, ever)
```

**Rules, all evidence-backed:**
- **Max 3 choices** on screen; 4 only for numerals.
- **No timers, no lives, no losing.** Wrong means "try again" with a hint.
- **Spaced repetition:** every skill returns after 1 day, 3 days, 7 days.
- **Mastery = 4 of 5 correct across two different sessions**, never one.
- **Sessions cap at 12 minutes**, then Kina goes to sleep.

---

## 7. How we know it works (without tracking anyone)

We have no analytics by design, so evidence comes from the pilot and from
on-device records a parent can see.

| Question | Instrument | Target |
| --- | --- | --- |
| Do they know the vowels? | 5-item naming task, pre/post | +40% correct |
| Is counting real, or rote? | "How many?" after counting (cardinality probe) | 70% of 5-year-olds |
| Can they read a CV syllable? | 8-item syllable board | 60% of 5–6s after Unit 7 |
| Did the habit form? | parent diary + on-device weekly tracker | 3+ days/week |
| Is it enjoyable? | observed sessions — do they return unprompted? | qualitative |

The cardinality probe is the one that matters most: it is the cheapest way to
detect the difference between a child who has learned a song and a child who has
learned number.

---

## 8. Alignment and open items

- **Rwanda ECD framework.** This curriculum is written to sit inside Rwanda's
  pre-primary competence-based curriculum and Early Learning and Development
  Standards. **Open item:** the exact competence codes must be mapped against the
  official REB documents before we make any public alignment claim. I have not
  invented codes here, and none should be added without the source in hand.
- **Kinyarwanda linguistic review.** The syllabic sequence in §2 and the CV
  progression in §4 need sign-off from a Kinyarwanda literacy specialist —
  particularly which consonants to introduce first, and how to handle digraphs
  (*cy, jy, ny, sh, shy*) and prenasalised consonants (*mb, nd, ng*), which are
  common and are **not** simple CV.
- **Letter introduction order** is by *utility and distinctiveness*, not
  alphabetical. The specific order needs the same review.

---

## 9. Definition of done

- [ ] Every episode, game and story declares a `skillId` from §4
- [ ] `data/curriculum.ts` holds domains, skills, prerequisites and units
- [ ] No content unlocks before its prerequisite skill is met
- [ ] Cardinality is assessed separately from counting
- [ ] Spaced repetition at 1 / 3 / 7 days is implemented
- [ ] Mastery requires two separate sessions
- [ ] Max 3 choices per screen (4 for numerals); no timers anywhere
- [ ] Session cap of 12 minutes with a gentle sleep state
- [ ] Kinyarwanda sequence reviewed by a specialist (§8)
- [ ] No public claim of REB alignment until §8 is closed

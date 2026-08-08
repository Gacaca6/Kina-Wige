# Kina Wige — Skill Taxonomy

**Version:** 1.0 · 2026-08-02
**Status:** Canonical. The authoritative list of everything Kina Wige teaches.
**Parent document:** `docs/CURRICULUM-ARCHITECTURE.md`
**Implements:** Phase 2 design. This is the specification `src/data/curriculum.ts`
will transcribe — no code is written yet, by instruction.

> **Contract.** Every episode, game, book and lesson declares one or more `id`s
> from this file. A build check fails on an empty or unknown skill reference
> (Architecture §17). **Ids are permanent and are never renamed** — content
> references them forever. To retire a skill, mark it `deprecated`, never delete.

---

## How to read a row

| Column | Meaning |
| --- | --- |
| **id** | Permanent identifier. `<domain>.<strand>.<skill>` |
| **L** | Level where the skill is *introduced* (L1 3–4 · L2 4–5 · L3 5–6) |
| **Statement** | What the child can do, in observable terms |
| **Evidence** | What we would *see* that proves it — this is what assessment watches |
| **Needs** | Prerequisite ids. Nothing unlocks before these reach 🌳 Demonstrated |

Bands: 🌱 Emerging · 🌿 Developing · 🌳 Demonstrated · ⭐ Applying.
Mastery requires 4 of 5 correct **across two separate sessions**.

---

## D1 · Language & Literacy — `snd` `wrd`
**Weight 25%.** The strongest predictor of later school success.

### Strand: listening & sound awareness — `snd.*`

| id | L | Statement | Evidence | Needs |
| --- | --- | --- | --- | --- |
| `snd.listen.everyday` | L1 | Distinguishes common sounds | Picks the animal/object that made a played sound | — |
| `snd.listen.attend` | L1 | Listens to a short story to the end | Completes a 60–90s story without leaving | — |
| `snd.rhyme.hear` | L1 | Hears that two words end alike | Picks the word that rhymes, 4 of 5 | `snd.listen.everyday` |
| `snd.vowel.recognise` | L1 | Recognises the five *inyajwi* by sound | Taps the vowel heard, 4 of 5 | `snd.listen.everyday` |
| `snd.vowel.name` | L2 | Names each vowel letter on sight | Says the vowel shown, 5 of 5 | `snd.vowel.recognise` |
| `snd.syllable.hear` | L2 | Claps syllables in a word | Claps *ma-ma*, *i-nka* correctly, 4 of 5 | `snd.vowel.recognise` |
| `snd.syllable.count` | L2 | Says how many syllables a word has | Answers "how many claps?" | `snd.syllable.hear` |
| `snd.cv.blend` | L2 | Blends consonant + vowel | Hears *m…a* and says *ma* | `snd.vowel.name` |
| `snd.cv.read` | L3 | Reads a CV syllable on sight | Reads 8 CV syllables unprompted | `snd.cv.blend` |
| `snd.word.read` | L3 | Reads a familiar 2-syllable word | Reads *mama*, *ameza* without picture cue | `snd.cv.read` |
| `snd.sentence.read` | L3 | Reads a 3-word sentence | Reads *Mama arasoma.* | `snd.word.read` |

> **Why syllabic, not phonemic:** Architecture §6.3. Kinyarwanda has a transparent
> orthography and CV structure; English-style phoneme blending exists because
> English spelling is irregular. Copying it here would be a real error.

### Strand: writing — `snd.write.*`

| id | L | Statement | Evidence | Needs |
| --- | --- | --- | --- | --- |
| `snd.write.grip` | L1 | Holds a crayon with control | Draws a deliberate closed shape | — |
| `snd.write.trace` | L2 | Traces a letter with correct stroke order | Follows the guide without lifting off-path | `snd.vowel.name` `snd.write.grip` |
| `snd.write.name` | L3 | Writes their own name | Writes it recognisably, unaided | `snd.write.trace` |

### Strand: words & meaning — `wrd.*`

| id | L | Statement | Evidence | Needs |
| --- | --- | --- | --- | --- |
| `wrd.name.object` | L1 | Names common objects | Names 10 household/farm objects | — |
| `wrd.name.body` | L1 | Names body parts | Points to and names 8 parts | — |
| `wrd.category` | L2 | Groups words by category | Sorts food / animals / clothes | `wrd.name.object` |
| `wrd.action` | L2 | Uses action words | Describes what a character is doing | `wrd.name.object` |
| `wrd.describe` | L2 | Describes by size and colour | "the **big red** ball" | `wrd.name.object` |
| `wrd.sentence.speak` | L2 | Speaks in full sentences | Answers a question in 4+ words | `wrd.action` |
| `wrd.story.recall` | L2 | Retells what happened | Names 3 events in order | `snd.listen.attend` |
| `wrd.story.predict` | L3 | Predicts what happens next | Gives a plausible next event *before* it is shown | `wrd.story.recall` |
| `wrd.story.why` | L3 | Explains why a character acted | Gives a causal reason, not a restatement | `wrd.story.predict` |

---

## D2 · Numeracy — `num`
**Weight 20%.** Taught Concrete → Pictorial → Abstract throughout.

| id | L | Statement | Evidence | Needs | CPA |
| --- | --- | --- | --- | --- | --- |
| `num.subitise3` | L1 | Sees 1–3 instantly, without counting | Answers within ~2s, no pointing | — | C |
| `num.count5` | L1 | Counts to 5 in order | Recites 1–5 unaided | — | C |
| `num.oneToOne` | L1 | Touches each object once while counting | No double-count or skip, 4 of 5 | `num.count5` | C |
| **`num.cardinal5`** | **L2** | **Answers "how many?" after counting to 5** | **Gives the last number as the total, unprompted** | `num.oneToOne` | C→P |
| `num.numeral5` | L2 | Matches numeral 1–5 to a quantity | Picks the numeral for a shown group | `num.cardinal5` | P→A |
| `num.compare` | L2 | Judges more / fewer / same | Picks the larger group, 4 of 5 | `num.cardinal5` | P |
| `num.count10` | L2 | Counts to 10 with one-to-one | Counts 10 objects accurately | `num.cardinal5` | C |
| `num.cardinal10` | L3 | Answers "how many?" to 10 | As above, to 10 | `num.count10` | C→P |
| `num.numeral10` | L3 | Matches numeral 1–10 to a quantity | Picks the numeral | `num.cardinal10` | A |
| `num.addSmall` | L3 | Joins two small groups | Solves 2+1, 2+2 with objects then pictures | `num.cardinal10` | C→P→A |
| `num.takeAway` | L3 | Removes from a group | Solves 3−1 with objects | `num.addSmall` | C→P |
| `num.shape.name` | L1 | Names circle, square, triangle | Names all three | — | C |
| `num.shape.build` | L2 | Builds a picture from shapes | Makes a house from shapes | `num.shape.name` | C |
| `num.sort.one` | L2 | Sorts by one attribute | Sorts by colour **or** size | — | C |
| `num.sort.two` | L3 | Sorts by two attributes | Sorts by colour **and** size | `num.sort.one` | C |
| `num.pattern.ab` | L2 | Copies and extends an AB pattern | Continues 🔴🔵🔴🔵 | `num.sort.one` | C→P |
| `num.pattern.abc` | L3 | Extends an ABC pattern | Continues 🔴🔵🟡🔴🔵🟡 | `num.pattern.ab` | P |
| `num.measure.words` | L3 | Uses measurement words | Uses long/short, heavy/light correctly | `num.compare` | C |

> **`num.cardinal5` is the headline metric of this company.** A child who
> recites "1-2-3-4-5" but cannot answer *"so how many?"* has learned a song, not
> number sense. It is assessed separately from counting, always.

---

## D3 · Discovery of the World — `wld`
**Weight 15%.** Question → Predict → Explore → Discover → Explain.

| id | L | Statement | Evidence | Needs |
| --- | --- | --- | --- | --- |
| `wld.animals.local` | L1 | Names animals of Rwanda | Names cow, goat, chicken, dog + 4 more | — |
| `wld.animals.needs` | L2 | Says what animals need to live | Names food, water, shelter | `wld.animals.local` |
| `wld.plants.grow` | L2 | Says what plants need | Names water, sun, soil | — |
| `wld.plants.lifecycle` | L3 | Describes seed → plant | Orders 4 stages correctly | `wld.plants.grow` |
| `wld.weather.name` | L1 | Names weather | Names rain, sun, cloud, wind | — |
| `wld.weather.effect` | L2 | Says what weather changes | "When it rains we…" | `wld.weather.name` |
| `wld.water.source` | L2 | Says where water comes from | Names rain, tap, well, river | — |
| `wld.predict` | L2 | Predicts before being told | States what will happen *first* | — |
| `wld.explain` | L3 | Explains a simple cause | "It grew **because** we watered it" | `wld.predict` |
| `wld.investigate` | L3 | Asks a question and tests it | Poses a question and reports what happened | `wld.explain` |
| `wld.rwanda.features` | L3 | Names features of Rwanda | Names hills, Kigali, a lake, a local crop | `wld.animals.local` |

---

## D4 · Physical & Health — `phy`
**Weight 15%.** Where we produce a measurable public-health outcome.

| id | L | Statement | Evidence | Needs |
| --- | --- | --- | --- | --- |
| `phy.hand.sequence` | L1 | Washes hands in the right order | Orders wet→soap→scrub→rinse→dry, 5 of 5 | — |
| `phy.hand.when` | L2 | Says when to wash hands | Names before eating, after toilet | `phy.hand.sequence` |
| `phy.hand.why` | L3 | Explains why we wash hands | Refers to germs we cannot see | `phy.hand.when` |
| `phy.teeth` | L2 | Brushes teeth correctly | Demonstrates the routine | — |
| `phy.food.healthy` | L1 | Names healthy foods | Sorts 6 foods into healthy / sometimes | — |
| `phy.food.plate` | L3 | Chooses a balanced plate | Builds a plate with 3 food groups | `phy.food.healthy` |
| `phy.water.drink` | L1 | Knows to drink clean water | Picks the safe water source | — |
| `phy.gross.move` | L1 | Runs, jumps, balances | Demonstrated off-screen, parent-marked | — |
| `phy.fine.control` | L2 | Controls hand for cutting/tracing | Traces within a guide | `snd.write.grip` |
| `phy.safe.road` | L2 | Crosses a road safely with an adult | Describes stop-look-listen | — |
| `phy.safe.danger` | L2 | Identifies dangerous things | Picks fire, sharp, deep water | — |
| `phy.safe.trusted` | L2 | Knows who to tell | Names a trusted adult | — |

---

## D5 · Social & Emotional — `self` `soc`
**Weight 15%.** School readiness is as much regulation as knowledge.

| id | L | Statement | Evidence | Needs |
| --- | --- | --- | --- | --- |
| `self.feel.name` | L1 | Names happy, sad, angry, afraid | Picks the face for a situation | — |
| `self.feel.own` | L2 | Says how *they* feel | Answers "how do you feel today?" | `self.feel.name` |
| `self.feel.other` | L2 | Says how someone *else* feels | Reads a character's feeling from a story | `self.feel.name` |
| `self.calm` | L2 | Uses a calming routine | Completes a breathing routine when prompted | `self.feel.own` |
| `self.regulate` | L3 | Manages frustration in a task | Retries after difficulty without distress | `self.calm` |
| `self.confidence` | L2 | Tries something new | Attempts an unfamiliar activity unprompted | — |
| `soc.turns` | L1 | Takes turns | Waits for a turn in a paired activity | — |
| `soc.share` | L2 | Shares materials | Gives a share without being told | `soc.turns` |
| `soc.help` | L2 | Asks for and offers help | Asks an adult; offers to a peer | — |
| `soc.kind.words` | L2 | Uses kind words | Says please, thank you, sorry appropriately | — |
| `soc.resolve` | L3 | Resolves a disagreement with words | Proposes a fair solution | `soc.share` `self.feel.other` |
| `soc.collaborate` | L3 | Works with a partner toward a goal | Completes a shared task | `soc.resolve` |

---

## D6 · Creative Arts & Culture — `art`
**Weight 10%.** Where Kina Wige becomes unmistakably Rwandan.

> **Known gap (Architecture §10):** this domain currently has the least content.
> It is the first commissioning priority after the vertical slice.

| id | L | Statement | Evidence | Needs |
| --- | --- | --- | --- | --- |
| `art.colour.name` | L1 | Names primary colours | Names red, blue, yellow, green | — |
| `art.draw.person` | L1 | Draws a person | Draws head + body + limbs | `snd.write.grip` |
| `art.draw.own` | L2 | Draws from their own life | Draws their family or home | `art.draw.person` |
| `art.sing.rwanda` | L1 | Sings a Rwandan song | Joins a known song | — |
| `art.rhythm.make` | L2 | Makes a rhythm | Claps or drums a repeated pattern | `num.pattern.ab` |
| `art.story.tell` | L2 | Tells an original short story | Tells 3 connected events of their own | `wrd.story.recall` |
| `art.build.shapes` | L2 | Builds an image from shapes | Composes a scene | `num.shape.build` |
| `art.culture.know` | L3 | Describes a Rwandan tradition | Describes Umuganda, a food, or a celebration | `wld.rwanda.features` |
| `art.project.plan` | L3 | Plans and completes a creative project | Says what they will make, then makes it | `art.draw.own` |
| `art.perform` | L3 | Performs for others | Shares a song, story or drawing with an adult | `art.story.tell` |

---

## Coverage summary

| Domain | Skills | L1 | L2 | L3 | Weight |
| --- | --- | --- | --- | --- | --- |
| D1 Language & Literacy | 23 | 6 | 9 | 8 | 25% |
| D2 Numeracy | 18 | 5 | 8 | 5 | 20% |
| D3 Discovery | 11 | 3 | 5 | 3 | 15% |
| D4 Physical & Health | 12 | 5 | 6 | 1 | 15% |
| D5 Social & Emotional | 12 | 3 | 6 | 3 | 15% |
| D6 Creative & Culture | 10 | 3 | 4 | 3 | 10% |
| **Total** | **86** | **25** | **38** | **23** | |

**Observations to act on:**
- **L3 Physical & Health is thin (1 skill).** Either it genuinely completes early
  — defensible for hygiene — or we are under-specifying school-readiness motor
  skills. Review before Phase 5.
- **L2 carries 44% of all skills.** That is the year most content should target.
- **D6 has the fewest skills and the least content** — a compounding gap.

---

## Vertical slice coverage (Phase 3)

The handwashing slice must demonstrably teach:

| Section | Skills |
| --- | --- |
| Iga lesson | `phy.hand.sequence` · `phy.hand.when` |
| Amasomo episode | `phy.hand.why` · `self.feel.other` |
| Imikino game | `phy.hand.sequence` · `num.count5` |
| Ibitabo book | `wrd.story.recall` · `phy.hand.when` |
| Kina Challenge | `phy.hand.sequence` (real basin, parent-marked) |
| Parent activity | `wrd.sentence.speak` (serve-and-return) |

That is **8 distinct skills across 4 domains from one theme** — the proof that
the integrated thematic approach works in our structure.

---

## Rules for adding a skill

1. It must be **observable**. If you cannot see it, it is not a skill.
2. It must have **evidence** written before any content is made.
3. It must declare **prerequisites** — or explicitly none.
4. It must belong to exactly **one** domain (content may span several; skills may not).
5. Ids are **permanent**. Deprecate, never delete, never rename.
6. New Kinyarwanda goes to the **ROADMAP review queue**.

---

## Open items

- **Kinyarwanda literacy sequence** — consonant introduction order, digraphs
  (*cy, jy, ny, sh, shy*) and prenasalised consonants (*mb, nd, ng*) need a
  specialist before `snd.cv.read` content is authored. These are **not** simple CV.
- **REB competence mapping** — every skill here must be mapped to Rwanda's
  official pre-primary competences before any public alignment claim. No codes
  invented; none to be added without the source document in hand.
- **L3 Physical & Health depth** — see coverage observations.
- **Off-screen evidence** (`phy.gross.move`, `art.perform`, Kina Challenge) is
  parent-marked. Phase 4 must make that honest and effortless — a single tap,
  never a form.

---
compositionId: bgm
duration_s: 65.411 # == audiomap.audio.duration_sec, exactly
canvas: { w: 1920, h: 1080, fps: 30 }
style: # brand spine — from frame.md (Daisy Days preset)
  font: "Fredoka One / Quicksand"
  palette: ["#F5F0E6", "#7ECDC0", "#F7C8D4", "#FDE68A", "#A8E6CF", "#2D2D2D"]
assets: "assets/public has keza-full.webp, hirwa-full.webp, keza-avatar.webp, hirwa-avatar.webp (child character art, transparent-friendly full-body illustrations)"
build_notes:
  [
    "one paused timeline per frame",
    "no remote assets — bundle gsap locally or use CSS/WAAPI",
    "audience is 3-6 year old children: BIG friendly letters, soft bounces, nothing scary or strobing",
    "letters are the heroes: each vowel scene shows the giant uppercase + lowercase pair (e.g. 'A a') in Fredoka One with charcoal outline + hard offset shadow per the Daisy Days atoms",
    "character art (keza/hirwa) pops in as a friendly companion, never covering the letter",
  ]
avoid:
  [
    "strobe / flicker systems (young children)",
    "tiny unreadable text",
    "dark or aggressive palettes",
    "generic slideshow",
  ]
---

## Frame 1 — f1

- src: compositions/frames/01-f1.html
- duration: 11.91s
- span_sec: [0.0, 11.91]
- pacing: beat_cut
- mood: [joyful, welcoming]
- feel: bright intro hit at 2.0 (HIGH), then a steady sung phrase — the song introduces itself, then the first vowel A
- vowel: A — scene color turquoise #7ECDC0 on cream

### Groups

- **g1** — free_design # title card
  - span_sec: [0.0, 4.0]
  - free_design: { dominant_system: "stacked title poster, Daisy Days sticker style", primitives: ["kinetic-letter-in", "braam-punch"], density_topology: "single hero" }
  - anchors: [0.3, 2.0] # phrase start; HIGH energy hit at 2.0 → braam the subtitle
  - copy: ["Indirimbo y'Inyajwi", "A · I · E · O · U"]
- **g2** — free_design # vowel A hero
  - span_sec: [4.0, 11.91]
  - free_design: { dominant_system: "giant letter-pair hero 'A a' center stage", primitives: ["braam-punch", "overlay-pop", "bg-flow-field"], density_topology: "single hero + companion" }
  - anchors: [4.0, 5.0, 7.0, 9.0, 10.0] # phase edges; letter slams at 4.0, keza pops at 7.0, gentle pulses on the rest
  - copy: ["A a"]
  - notes: "keza-full.webp pops in bottom-right at 7.0 (overlay-pop), gently bobbing; soft turquoise blob field behind letter"

## Frame 2 — f2

- src: compositions/frames/02-f2.html
- duration: 11.59s
- span_sec: [11.91, 23.5]
- pacing: beat_cut
- mood: [playful]
- feel: second sung phrase, big HIGH spike at 17.0 (energy 0.86) mid-phrase, calming into 21-22 VOID dip — vowel I
- vowel: I — scene color soft-pink #F7C8D4 on cream

### Groups

- **g1** — free_design # vowel I slam
  - span_sec: [11.91, 17.0]
  - free_design: { dominant_system: "giant letter-pair hero 'I i'", primitives: ["braam-punch", "kinetic-letter-in", "bg-flow-field"], density_topology: "single hero" }
  - anchors: [12.0, 13.0, 15.0] # phase edges; letter slam at 12.0, pulses after
  - copy: ["I i"]
- **g2** — free_design # I + Hirwa celebrates
  - span_sec: [17.0, 23.5]
  - free_design: { dominant_system: "held letter + companion celebration", primitives: ["overlay-pop", "particle-burst"], density_topology: "hero + companion" }
  - anchors: [17.0, 19.0, 21.0] # 17.0 HIGH spike → hirwa pops + soft confetti burst; 21.0 VOID → everything settles still
  - copy: ["I i"]
  - notes: "hirwa-full.webp pops bottom-left at 17.0 with a soft round confetti burst (pastel dots, no harsh flashes); by 21.0 all motion settles to a gentle hold"

## Frame 3 — f3

- src: compositions/frames/03-f3.html
- duration: 11.4s
- span_sec: [23.5, 34.9]
- pacing: beat_cut
- mood: [warm, building]
- feel: warm dense phrase 23.5-28, dips low, then the track's biggest HIGH at 31-34 (energy 0.95) — vowel E rides the peak
- vowel: E — scene color butter #FDE68A on cream

### Groups

- **g1** — free_design # vowel E hero
  - span_sec: [23.5, 30.0]
  - free_design: { dominant_system: "giant letter-pair hero 'E e'", primitives: ["braam-punch", "outline-to-fill", "bg-flow-field"], density_topology: "single hero" }
  - anchors: [23.5, 28.0] # letter slams at 23.5; outline→fill resolve at 28.0 phase edge
  - copy: ["E e"]
- **g2** — free_design # E peak celebration
  - span_sec: [30.0, 34.9]
  - free_design: { dominant_system: "held letter + biggest celebration of the song", primitives: ["overlay-pop", "particle-burst", "screen-shake"], density_topology: "hero + companion" }
  - anchors: [30.0, 31.0, 34.0] # 31.0 = track's peak HIGH (0.95): keza pops + pastel confetti + one soft bounce-shake
  - copy: ["E e"]
  - notes: "keza-full.webp pops bottom-right at 31.0; screen-shake is a soft playful bounce (small amplitude), not aggressive"

## Frame 4 — f4

- src: compositions/frames/04-f4.html
- duration: 11.61s
- span_sec: [34.9, 46.51]
- pacing: beat_cut
- mood: [gentle, singalong]
- feel: long LOW dense stretch 35-42 (the calm verse), lifting at 42, hard_stop at 44 — vowel O, gentler scene
- vowel: O — scene color mint #A8E6CF on cream

### Groups

- **g1** — free_design # vowel O gentle hero
  - span_sec: [34.9, 42.0]
  - free_design: { dominant_system: "giant letter-pair hero 'O o' with round motif (the letter IS a circle — echo it with soft rings)", primitives: ["mask-reveal", "bg-flow-field"], density_topology: "single hero, calm" }
  - anchors: [35.0, 42.0] # iris-like circular mask reveal at 35.0 (fits the O); calm bed through the LOW stretch
  - copy: ["O o"]
- **g2** — free_design # O + Hirwa
  - span_sec: [42.0, 46.51]
  - free_design: { dominant_system: "held letter + companion", primitives: ["overlay-pop", "freeze-hold"], density_topology: "hero + companion" }
  - anchors: [42.0, 44.0, 46.0] # hirwa pops at 42.0 lift; hard_stop at 44 → freeze-hold beat; 46.0 HIGH release
  - copy: ["O o"]
  - notes: "hirwa-full.webp pops bottom-left at 42.0; at the 44.0 hard stop everything freezes for a playful beat, releasing at 46.0"

## Frame 5 — f5

- src: compositions/frames/05-f5.html
- duration: 11.15s
- span_sec: [46.51, 57.66]
- pacing: beat_cut
- mood: [bright, resolving]
- feel: HIGH burst 46-48 opening the final vowel phrase, stepping down through 50-53 LOW, small pulses to 57 — vowel U
- vowel: U — scene color sky #A8D8F0 on cream

### Groups

- **g1** — free_design # vowel U hero
  - span_sec: [46.51, 53.0]
  - free_design: { dominant_system: "giant letter-pair hero 'U u'", primitives: ["braam-punch", "kinetic-letter-in", "bg-flow-field"], density_topology: "single hero" }
  - anchors: [46.51, 48.0, 50.0] # letter slams on the 46.5 HIGH; pulses on phase edges
  - copy: ["U u"]
- **g2** — free_design # U + both characters
  - span_sec: [53.0, 57.66]
  - free_design: { dominant_system: "held letter + BOTH companions (finale approaching)", primitives: ["overlay-pop"], density_topology: "hero + two companions" }
  - anchors: [53.0, 55.0] # keza pops bottom-right at 53.0, hirwa bottom-left at 55.0
  - copy: ["U u"]
  - notes: "both keza-full.webp and hirwa-full.webp on screen together, bobbing gently — leads into the recap frame"

## Frame 6 — f6

- src: compositions/frames/06-f6.html
- duration: 7.751s
- span_sec: [57.66, 65.411]
- pacing: beat_cut
- mood: [celebratory, goodbye]
- feel: final 2-bar tail — last HIGH flourish 60-62, hard_stop at 62, then 62-65.4 is silence/fade — recap all five vowels then a quiet end card
- vowel: recap A I E O U

### Groups

- **g1** — free_design # all-vowels recap
  - span_sec: [57.66, 62.0]
  - free_design: { dominant_system: "all five letters in a row, each in its scene color, cascading in", primitives: ["staggered-reveal", "particle-burst"], density_topology: "five-item cascade" }
  - anchors: [58.0, 59.0, 60.0, 61.0, 62.0] # one letter per second landing A-I-E-O-U; confetti on the 60-62 HIGH
  - copy: ["A", "I", "E", "O", "U"]
- **g2** — free_design # quiet end card
  - span_sec: [62.0, 65.411]
  - free_design: { dominant_system: "calm end card over silence", primitives: ["negative-space-hold", "blur-resolve"], density_topology: "single mark, empty space" }
  - anchors: [62.0] # hard_stop at 62 → hard cut to the end card; audio is silent tail from 63.4
  - copy: ["Wabikoze neza! ⭐", "Kina Wige"]
  - notes: "both character avatars small + centered wordmark; gentle fade to cream by the end"

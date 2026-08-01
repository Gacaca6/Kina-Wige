// The motion vocabulary. One set of springs, used everywhere.
//
// These are SIMULATIONS, not tweens. A spring has stiffness, damping and mass:
// it overshoots, settles, and can be interrupted mid-flight and retarget from
// its current velocity. That is what separates a character that feels alive
// from one that reads as a slideshow.
//
// Rule: never use a CSS transition or a looping keyframe on a character.

export const SPRING = {
  /** Taps and immediate feedback — arrives fast, barely overshoots. */
  snappy: { stiffness: 700, damping: 30, mass: 0.6 },
  /** Celebration, jumps — deliberately loose so it overshoots and rings. */
  bouncy: { stiffness: 400, damping: 14, mass: 0.9 },
  /** Screen and layout moves — confident, settles clean. */
  soft: { stiffness: 220, damping: 26, mass: 1.0 },
  /** Large shapes that should feel weighty. */
  heavy: { stiffness: 160, damping: 22, mass: 1.6 },
  /** Follow-through: tails, ears, crests. Late and loose on purpose. */
  floaty: { stiffness: 90, damping: 12, mass: 1.2 },
} as const;

export type SpringName = keyof typeof SPRING;

/**
 * Calm mode (a parent setting) and reduced-motion must never disable motion
 * outright — poses still change, they just stop ringing. We raise damping and
 * stiffness rather than switching springs off, so behaviour stays continuous.
 */
export function tune(
  name: SpringName,
  opts: { calm?: boolean; reduced?: boolean } = {}
) {
  const base = SPRING[name];
  if (opts.reduced) return { stiffness: 1200, damping: 90, mass: 0.5 };
  if (opts.calm) {
    return {
      stiffness: base.stiffness * 1.1,
      damping: base.damping * 1.9,
      mass: base.mass,
    };
  }
  return base;
}

/** Amplitude multiplier — calm mode halves how far anything travels. */
export function amp(opts: { calm?: boolean; reduced?: boolean } = {}) {
  if (opts.reduced) return 0.35;
  if (opts.calm) return 0.5;
  return 1;
}

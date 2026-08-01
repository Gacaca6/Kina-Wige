// Motion lab — a proving ground for the spring rig, not a product screen.
// Route: /lab
//
// Use it to feel the difference between a spring simulation and a CSS tween:
// tap a mood mid-flight and Ngabo retargets from his current velocity instead
// of restarting. Move your finger and his gaze arrives rather than snapping.

import { useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import Ngabo from '../components/characters/Ngabo';
import type { NgaboMood } from '../components/characters/Ngabo';

const MOODS: NgaboMood[] = [
  'idle',
  'wave',
  'point',
  'think',
  'encourage',
  'celebrate',
  'amazed',
  'doze',
];

export default function MotionLab() {
  const [mood, setMood] = useState<NgaboMood>('idle');
  const [calm, setCalm] = useState(false);
  const [look, setLook] = useState<{ x: number; y: number } | null>(null);

  function track(e: ReactPointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    setLook({
      x: ((e.clientX - r.left) / r.width) * 2 - 1,
      y: ((e.clientY - r.top) / r.height) * 2 - 1,
    });
  }

  return (
    <div
      onPointerMove={track}
      onPointerLeave={() => setLook(null)}
      className="min-h-screen bg-surface flex flex-col items-center px-5 py-8 gap-6"
    >
      <div className="text-center">
        <h1 className="font-headline text-3xl text-dark">Motion lab</h1>
        <p className="text-sm text-dark/60 mt-1 max-w-xs">
          Springs, not tweens. Tap a mood mid-animation — he retargets from his
          current velocity instead of starting over.
        </p>
      </div>

      <div className="w-64 h-72 flex items-center justify-center">
        <Ngabo mood={mood} lookAt={look} calm={calm} style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
        {MOODS.map((m) => (
          <button
            key={m}
            onClick={() => setMood(m)}
            className={`min-h-14 rounded-2xl font-body font-bold text-sm capitalize transition-colors ${
              mood === m
                ? 'bg-primary text-white shadow-lg'
                : 'bg-white text-dark shadow'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <button
        onClick={() => setCalm((c) => !c)}
        className={`min-h-12 px-6 rounded-2xl font-body font-bold text-sm ${
          calm ? 'bg-accent-warm text-white' : 'bg-white text-dark shadow'
        }`}
      >
        Calm mode: {calm ? 'on' : 'off'}
      </button>

      <p className="text-xs text-dark/50 text-center max-w-xs">
        Calm mode raises damping and halves amplitude — it never switches motion
        off. Reduced-motion collapses the springs but still changes pose.
      </p>
    </div>
  );
}

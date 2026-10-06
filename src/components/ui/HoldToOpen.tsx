// The grown-up's hidden door.
//
// The child's world contains nothing addressed to an adult — no padlock, no
// "parents" button. But a grown-up still needs a way in that does not mean
// closing the app. So the door is a GESTURE: press and hold for three seconds.
//
// A child may find it by accident; that is fine, because it only leads to the
// parent gate, and the gate is the real lock. What the gesture does is keep
// the door out of sight, so it is not a button a child is invited to press.
// The grown-up learns it during setup ("press and hold your child's name").

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

const HOLD_MS = 3000;

export default function HoldToOpen({ children, label }: { children: ReactNode; label: string }) {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const start = useRef<number | null>(null);
  const raf = useRef<number | null>(null);

  function stop() {
    start.current = null;
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
    setProgress(0);
  }

  function frame(ts: number) {
    if (start.current === null) start.current = ts;
    const p = Math.min(1, (ts - start.current) / HOLD_MS);
    setProgress(p);
    if (p >= 1) {
      stop();
      navigate('/parents');
      return;
    }
    raf.current = requestAnimationFrame(frame);
  }

  useEffect(() => stop, []);

  // The ring only appears once a hold is clearly deliberate, so a quick tap on
  // the child's name shows nothing at all.
  const visible = progress > 0.12;
  const R = 22;
  const C = 2 * Math.PI * R;

  return (
    <div
      role="button"
      aria-label={label}
      tabIndex={-1}
      className="relative select-none"
      style={{ WebkitTouchCallout: 'none', touchAction: 'manipulation' }}
      onPointerDown={() => {
        stop();
        raf.current = requestAnimationFrame(frame);
      }}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
      {visible && (
        <svg
          viewBox="0 0 52 52"
          className="absolute pointer-events-none"
          style={{ width: 52, height: 52, right: -58, top: '50%', transform: 'translateY(-50%) rotate(-90deg)' }}
          aria-hidden
        >
          <circle cx={26} cy={26} r={R} fill="none" stroke="rgba(255,255,255,.25)" strokeWidth={5} />
          <circle
            cx={26}
            cy={26}
            r={R}
            fill="none"
            stroke="#90CAF9"
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
          />
        </svg>
      )}
    </div>
  );
}

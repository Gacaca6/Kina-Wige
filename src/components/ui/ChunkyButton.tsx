// The signature interaction from the design system: a solid bottom shadow that
// collapses on press, so the surface physically drops into the page.
// No blurs, no gradients. Minimum target 72x72.

import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Tone = 'grass' | 'sun' | 'sky' | 'coral' | 'grape' | 'white' | 'forest';

const TONES: Record<Tone, { bg: string; ink: string; shadow: string; inset?: string }> = {
  grass: { bg: 'bg-grass', ink: 'text-white', shadow: '#1E8C4C' },
  sun: { bg: 'bg-sun', ink: 'text-ink', shadow: '#D89A00' },
  sky: { bg: 'bg-sky', ink: 'text-white', shadow: '#1D7BB3' },
  coral: { bg: 'bg-coral', ink: 'text-white', shadow: '#CC4A2E' },
  grape: { bg: 'bg-grape', ink: 'text-white', shadow: '#6F43C9' },
  forest: { bg: 'bg-forest', ink: 'text-white', shadow: '#0E3626' },
  white: { bg: 'bg-white', ink: 'text-forest', shadow: '#D9D2C4', inset: 'inset 0 0 0 3px #E4DDCE' },
};

export interface ChunkyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: Tone;
  depth?: number;
  children: ReactNode;
}

export default function ChunkyButton({
  tone = 'grass',
  depth = 7,
  className = '',
  children,
  style,
  ...rest
}: ChunkyButtonProps) {
  const t = TONES[tone];
  const shadow = t.inset
    ? `0 ${depth}px 0 ${t.shadow}, ${t.inset}`
    : `0 ${depth}px 0 ${t.shadow}`;
  const pressed = t.inset
    ? `0 2px 0 ${t.shadow}, ${t.inset}`
    : `0 2px 0 ${t.shadow}`;

  return (
    <button
      {...rest}
      className={`chunk ${t.bg} ${t.ink} font-body font-black rounded-[20px] ${className}`}
      style={{
        boxShadow: shadow,
        minHeight: 72,
        ...style,
      }}
      onPointerDown={(e) => {
        e.currentTarget.style.boxShadow = pressed;
        rest.onPointerDown?.(e);
      }}
      onPointerUp={(e) => {
        e.currentTarget.style.boxShadow = shadow;
        rest.onPointerUp?.(e);
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.boxShadow = shadow;
        rest.onPointerLeave?.(e);
      }}
    >
      {children}
    </button>
  );
}

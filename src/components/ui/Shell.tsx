// The two lane shells. Every screen is built from one of these — that is what
// makes the app feel like one product instead of a pile of screens.
//
//   KidShell    cream canvas, chunky forest header, the ONE bottom nav
//   ParentShell blue canvas, plain header, no nav, no mascot
//
// The colour is the wayfinding: green/cream = the child's world, blue = an
// adult should be holding this phone.

import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

/* ── Back button, sized for a small hand ── */
function BackButton({ onClick, tone }: { onClick: () => void; tone: 'child' | 'parent' }) {
  const child = tone === 'child';
  return (
    <button
      onClick={onClick}
      aria-label="Go back"
      className="rounded-[18px] grid place-items-center flex-none"
      style={{
        width: child ? 60 : 48,
        height: child ? 60 : 48,
        background: child ? '#FFFFFF' : '#FFFFFF',
        boxShadow: child ? '0 5px 0 #D9D2C4' : '0 3px 0 #CFE3F5',
      }}
    >
      <svg viewBox="0 0 24 24" style={{ width: child ? 26 : 22, height: child ? 26 : 22 }} fill="none"
        stroke={child ? '#17543C' : '#1565C0'} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
}

/* ── The grown-up lock. The only door out of the child's world. ── */
export function GrownUpLock({ className = '' }: { className?: string }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/parents')}
      aria-label="Grown-ups area"
      className={`rounded-[16px] grid place-items-center flex-none ${className}`}
      style={{ width: 60, height: 60, background: '#0E3626' }}
    >
      <span className="relative block" style={{ width: 20, height: 22 }} aria-hidden>
        <span className="absolute bottom-0 left-0 right-0 rounded-[5px] bg-sky" style={{ height: 14 }} />
        <span
          className="absolute top-0 left-[4px] right-[4px] rounded-t-[7px] border-[3px] border-b-0 border-sky box-border"
          style={{ height: 10 }}
        />
      </span>
    </button>
  );
}

export interface KidShellProps {
  title?: string;
  /** Kinyarwanda sits first; the English hint is for the adult nearby. */
  hint?: string;
  onBack?: () => void;
  /** Hide the nav for full-screen experiences (a lesson, a story reader). */
  nav?: boolean;
  lock?: boolean;
  right?: ReactNode;
  children: ReactNode;
}

export function KidShell({
  title,
  hint,
  onBack,
  nav = true,
  lock = false,
  right,
  children,
}: KidShellProps) {
  return (
    <div className="flex flex-col bg-sand" style={{ minHeight: '100dvh' }}>
      {(title || onBack) && (
        <header className="bg-forest px-4 pt-4 pb-5 flex items-center gap-3 flex-none">
          {onBack && <BackButton onClick={onBack} tone="child" />}
          <div className="min-w-0 flex-1">
            {title && (
              <h1
                className="font-display font-extrabold text-white truncate"
                style={{ fontSize: 'clamp(24px, 7vw, 30px)', lineHeight: 1.1 }}
              >
                {title}
              </h1>
            )}
            {hint && <p className="font-body font-extrabold text-[13px] mt-0.5" style={{ color: '#7FD3A5' }}>{hint}</p>}
          </div>
          {right}
          {lock && <GrownUpLock />}
        </header>
      )}

      <main className="flex-1 overflow-y-auto">{children}</main>

      {nav && <BottomNav />}
    </div>
  );
}

export interface ParentShellProps {
  title: string;
  hint?: string;
  onBack?: () => void;
  children: ReactNode;
}

export function ParentShell({ title, hint, onBack, children }: ParentShellProps) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col" style={{ minHeight: '100dvh', background: '#F5FAFE' }}>
      <header
        className="px-4 pt-4 pb-4 flex items-center gap-3 flex-none"
        style={{ background: '#E3F2FD', borderBottom: '2px solid #CFE3F5' }}
      >
        <BackButton onClick={onBack ?? (() => navigate('/'))} tone="parent" />
        <div className="min-w-0 flex-1">
          <h1 className="font-display font-extrabold truncate" style={{ fontSize: 22, lineHeight: 1.15, color: '#1565C0' }}>
            {title}
          </h1>
          {hint && <p className="font-body font-bold text-[12px] mt-0.5" style={{ color: '#5B7A94' }}>{hint}</p>}
        </div>
        <span
          className="font-body font-black text-[11px] tracking-[.12em] px-3 py-2 rounded-[10px] flex-none"
          style={{ background: '#1565C0', color: '#fff' }}
        >
          GROWN-UPS
        </span>
      </header>

      {/* No bottom nav in the grown-up lane — the back arrow is the way out. */}
      <main className="flex-1 overflow-y-auto px-4 py-5">{children}</main>
    </div>
  );
}

/* ── A plain card, used across both lanes. ── */
export function Card({
  children,
  className = '',
  tone = 'child',
}: {
  children: ReactNode;
  className?: string;
  tone?: 'child' | 'parent';
}) {
  return (
    <div
      className={`bg-white ${className}`}
      style={{
        borderRadius: tone === 'child' ? 26 : 20,
        boxShadow: tone === 'child' ? '0 6px 0 #DDD6C8' : '0 3px 0 #DFEBF6',
        padding: 18,
      }}
    >
      {children}
    </div>
  );
}

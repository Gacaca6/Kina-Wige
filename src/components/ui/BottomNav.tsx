// THE bottom navigation. There is exactly one of these in the app.
//
// Child lane only — an adult reaches their area through the blue lock in a
// header, never through a tab in the child's world.
//
// Built for 3–6: the PICTURE carries the meaning and the word underneath is a
// hint for the adult nearby. Targets are 84px, well over the 72px floor.

import { useNavigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

function IconLearn({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full" aria-hidden>
      <rect x={7} y={10} width={34} height={28} rx={6} fill={on ? '#FFFDF7' : '#F3F1EA'} stroke="#10241B" strokeWidth={3.5} />
      <path d="M24 12v26" stroke="#10241B" strokeWidth={3.5} />
      <path d="M12 19h8M12 25h8M28 19h8M28 25h8" stroke={on ? '#2FBF6B' : '#A8B5AC'} strokeWidth={3.5} strokeLinecap="round" />
    </svg>
  );
}
function IconPlay({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full" aria-hidden>
      <rect x={6} y={14} width={36} height={22} rx={11} fill={on ? '#FFC02E' : '#EDE8DC'} stroke="#10241B" strokeWidth={3.5} />
      <path d="M15 21v8M11 25h8" stroke="#10241B" strokeWidth={3.5} strokeLinecap="round" />
      <circle cx={32} cy={23} r={3} fill="#10241B" />
      <circle cx={37} cy={29} r={3} fill="#10241B" />
    </svg>
  );
}
function IconStories({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full" aria-hidden>
      <path d="M8 12c6-3 12-3 16 1v24c-4-4-10-4-16-1z" fill={on ? '#9B6BFF' : '#E6E1F2'} stroke="#10241B" strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M40 12c-6-3-12-3-16 1v24c4-4 10-4 16-1z" fill="#FFFDF7" stroke="#10241B" strokeWidth={3.5} strokeLinejoin="round" />
    </svg>
  );
}

interface Tab {
  to: string;
  label: string;
  match: (p: string) => boolean;
  icon: (on: boolean) => ReactNode;
}

const TABS: Tab[] = [
  {
    to: '/home-path',
    label: 'IGA',
    match: (p) => p === '/home-path' || p.startsWith('/lesson'),
    icon: (on) => <IconLearn on={on} />,
  },
  {
    to: '/games',
    label: 'KINA',
    match: (p) => p.startsWith('/game'),
    icon: (on) => <IconPlay on={on} />,
  },
  {
    to: '/comics',
    label: 'INKURU',
    match: (p) => p.startsWith('/comic') || p.startsWith('/episode'),
    icon: (on) => <IconStories on={on} />,
  },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav
      className="flex items-stretch justify-around bg-white px-1 pt-1 flex-none"
      style={{
        borderTop: '3px solid #E4DDCE',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
      }}
    >
      {TABS.map((tab) => {
        const on = tab.match(pathname);
        return (
          <button
            key={tab.to}
            onClick={() => navigate(tab.to)}
            aria-label={tab.label}
            aria-current={on ? 'page' : undefined}
            className="flex flex-col items-center justify-center gap-1 flex-1"
            style={{ minHeight: 84, minWidth: 72 }}
          >
            <span
              className="grid place-items-center rounded-[18px]"
              style={{ width: 58, height: 50, background: on ? '#E7F7EE' : 'transparent' }}
            >
              <span style={{ width: 38, height: 38, display: 'block' }}>{tab.icon(on)}</span>
            </span>
            <span className="font-body font-black text-[12px]" style={{ color: on ? '#17543C' : '#8A9A90' }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

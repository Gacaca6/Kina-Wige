// THE bottom navigation. There is exactly one of these in the app.
//
// Child lane only — an adult reaches their area through the blue lock in a
// header, never through a tab in the child's world.
//
// Built for 3–6: the PICTURE carries the meaning and the word underneath is a
// hint for the adult nearby. Targets are 84px, well over the 72px floor.

import { useNavigate, useLocation } from 'react-router-dom';
import { useI18n } from '../../i18n/context';
import type { TranslationKey } from '../../i18n/translations';
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

function IconVideos({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full" aria-hidden>
      <rect x={5} y={11} width={30} height={26} rx={7} fill={on ? '#35A7E8' : '#E4EEF3'} stroke="#10241B" strokeWidth={3.5} />
      <path d="M37 20l6-4v16l-6-4z" fill={on ? '#35A7E8' : '#E4EEF3'} stroke="#10241B" strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M17 18l9 6-9 6z" fill={on ? '#FFFFFF' : '#A8B5AC'} />
    </svg>
  );
}

interface Tab {
  to: string;
  /** i18n key — the nav must switch language with the app, never hardcode. */
  labelKey: TranslationKey;
  match: (p: string) => boolean;
  icon: (on: boolean) => ReactNode;
}

const TABS: Tab[] = [
  {
    to: '/home-path',
    labelKey: 'nav.learn',
    match: (p) => p === '/home-path' || p.startsWith('/lesson'),
    icon: (on) => <IconLearn on={on} />,
  },
  {
    to: '/episodes',
    labelKey: 'nav.episodes',
    match: (p) => p.startsWith('/episode'),
    icon: (on) => <IconVideos on={on} />,
  },
  {
    to: '/games',
    labelKey: 'nav.games',
    match: (p) => p.startsWith('/game'),
    icon: (on) => <IconPlay on={on} />,
  },
  {
    to: '/comics',
    labelKey: 'nav.comics',
    match: (p) => p.startsWith('/comic'),
    icon: (on) => <IconStories on={on} />,
  },
];

export default function BottomNav() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav
      className="flex items-stretch justify-around bg-white px-1 pt-1 flex-none"
      style={{
        borderTop: '3px solid #E4DDCE',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 10px)',
      }}
    >
      {TABS.map((tab) => {
        const on = tab.match(pathname);
        return (
          <button
            key={tab.to}
            onClick={() => navigate(tab.to)}
            aria-label={t(tab.labelKey)}
            aria-current={on ? 'page' : undefined}
            className="flex flex-col items-center justify-center gap-1 flex-1"
            style={{ minHeight: 84, minWidth: 64 }}
          >
            <span
              className="grid place-items-center rounded-[18px]"
              style={{ width: 54, height: 48, background: on ? '#E7F7EE' : 'transparent' }}
            >
              <span style={{ width: 36, height: 36, display: 'block' }}>{tab.icon(on)}</span>
            </span>
            <span className="font-body font-black text-[11px] whitespace-nowrap" style={{ color: on ? '#17543C' : '#8A9A90' }}>
              {t(tab.labelKey).toUpperCase()}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

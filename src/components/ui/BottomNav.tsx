import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, PlayCircle, Gamepad2, BookOpen, Users } from 'lucide-react';
import { useI18n } from '../../i18n/context';

function NavButton({ icon, label, isActive, onClick }: { icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`flex flex-col items-center justify-center flex-1 min-w-0 px-0.5 py-1.5 transition-all duration-150 active:scale-90 ${
        isActive ? 'text-primary' : 'text-dark/40 hover:text-dark/60'
      }`}
    >
      {icon}
      <span className="font-headline text-[9px] leading-none font-bold mt-1 w-full text-center truncate">{label}</span>
      <div className={`w-1 h-1 rounded-full mt-0.5 ${isActive ? 'bg-primary' : 'bg-transparent'}`} />
    </button>
  );
}

export default function BottomNav() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-dark/10 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center h-14 max-w-lg mx-auto px-1">
        <NavButton
          icon={<Home className="w-5 h-5" />}
          label={t('nav.home')}
          isActive={path === '/home'}
          onClick={() => navigate('/home')}
        />
        <NavButton
          icon={<PlayCircle className="w-5 h-5" />}
          label={t('nav.episodes')}
          isActive={path === '/episodes' || path.startsWith('/episode')}
          onClick={() => navigate('/episodes')}
        />
        <NavButton
          icon={<Gamepad2 className="w-5 h-5" />}
          label={t('nav.games')}
          isActive={path === '/games' || path.startsWith('/game')}
          onClick={() => navigate('/games')}
        />
        <NavButton
          icon={<BookOpen className="w-5 h-5" />}
          label={t('nav.comics')}
          isActive={path === '/comics' || path.startsWith('/comic')}
          onClick={() => navigate('/comics')}
        />
        <NavButton
          icon={<Users className="w-5 h-5" />}
          label={t('nav.parents')}
          isActive={path === '/parents'}
          onClick={() => navigate('/parents')}
        />
      </div>
    </nav>
  );
}

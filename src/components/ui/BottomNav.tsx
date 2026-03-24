import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, PlayCircle, Gamepad2, Users } from 'lucide-react';
import { useI18n } from '../../i18n/context';

function NavButton({ icon, label, isActive, onClick }: { icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center flex-1 py-2 transition-all duration-150 active:scale-90 ${
        isActive ? 'text-primary' : 'text-dark/40 hover:text-dark/60'
      }`}
    >
      {icon}
      <span className="font-headline text-[10px] font-bold mt-1">{label}</span>
      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-0.5" />}
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
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        <NavButton
          icon={<Home className="w-6 h-6" />}
          label={t('nav.home')}
          isActive={path === '/home'}
          onClick={() => navigate('/home')}
        />
        <NavButton
          icon={<PlayCircle className="w-6 h-6" />}
          label={t('nav.episodes')}
          isActive={path === '/episodes' || path.startsWith('/episode')}
          onClick={() => navigate('/episodes')}
        />
        <NavButton
          icon={<Gamepad2 className="w-6 h-6" />}
          label={t('nav.games')}
          isActive={path === '/games' || path.startsWith('/game')}
          onClick={() => navigate('/games')}
        />
        <NavButton
          icon={<Users className="w-6 h-6" />}
          label={t('nav.parents')}
          isActive={path === '/parents'}
          onClick={() => navigate('/parents')}
        />
      </div>
    </nav>
  );
}

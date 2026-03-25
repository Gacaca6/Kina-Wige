import React from 'react';
import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

export default function FloatingKeza() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on splash, game, and baza-keza screens
  const hiddenPaths = ['/', '/game', '/baza-keza'];
  if (hiddenPaths.some(p => location.pathname === p || location.pathname.startsWith('/game/'))) {
    return null;
  }
  if (location.pathname === '/baza-keza') return null;

  return (
    <motion.button
      onClick={() => navigate('/baza-keza')}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', damping: 12, delay: 1 }}
      className="fixed bottom-24 right-4 z-40 flex flex-col items-center gap-1 active:scale-90 transition-transform"
      aria-label="Baza Keza — Ask a question"
    >
      {/* Pulse ring */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-accent/25 animate-ping" style={{ animationDuration: '3s' }} />

      {/* Button body */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="relative w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-accent to-accent-warm shadow-[0_4px_20px_rgba(255,215,0,0.4)] border-[3px] border-white"
      >
        <HelpCircle className="w-8 h-8 text-dark" strokeWidth={2.5} />
      </motion.div>

      {/* Label */}
      <span className="text-[10px] font-headline font-bold text-primary bg-white/90 px-2 py-0.5 rounded-full shadow-sm leading-tight">
        Baza Keza
      </span>
    </motion.button>
  );
}

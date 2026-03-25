import React from 'react';
import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { images } from '../../assets/images';

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
      className="fixed bottom-24 right-4 z-40 w-16 h-16 rounded-full shadow-lg active:scale-90 transition-transform"
      aria-label="Baza Keza — Ask a question"
    >
      {/* Pulse ring */}
      <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" style={{ animationDuration: '3s' }} />

      {/* Button body */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="relative w-full h-full rounded-full overflow-hidden border-3 border-white shadow-[0_4px_16px_rgba(15,82,56,0.3)] bg-primary"
      >
        <img
          src={images.kezaAvatar}
          alt="Ask Keza"
          className="w-full h-full object-cover"
        />
        {/* Question mark badge */}
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center border-2 border-white shadow-sm">
          <span className="text-dark font-black text-xs">?</span>
        </div>
      </motion.div>
    </motion.button>
  );
}

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/ui/Logo';

export default function SplashScreen() {
  const navigate = useNavigate();


  return (
    <motion.main
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="storybook-canvas min-h-screen flex flex-col items-center justify-center p-6 text-white relative overflow-hidden"
    >
      <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-md mx-auto w-full">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.1, 1], opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
        >
          <Logo variant="splash" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-white/80 font-body text-base"
        >
          The Modern Umudugudu for early learning.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="pt-8 w-full"
        >
          <button
            onClick={() => navigate('/home', { replace: true })}
            className="w-full bg-white text-primary font-body font-bold px-8 py-4 rounded-xl text-base hover:bg-surface transition-colors flex items-center justify-center gap-2 shadow-md active:scale-95"
          >
            Get Started
            <Play className="w-4 h-4 fill-current" />
          </button>
        </motion.div>
      </div>
    </motion.main>
  );
}

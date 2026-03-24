import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ArrowLeft, Bug, Droplets, Sparkles, Wind, Shirt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/context';
import { useSound, useHaptic } from '../hooks/useSound';
import { useStars } from '../hooks/useStars';
import { images } from '../assets/images';

const INITIAL_GERMS = [
  { id: 1, color: 'bg-[#4CAF50]', top: '10%', left: '25%', right: undefined, bottom: undefined, delay: '0.1s', size: 'w-16 h-16', sound: 'germ_pop_1' as const, transform: undefined },
  { id: 2, color: 'bg-[#9C27B0]', top: '20%', left: undefined, right: '10%', bottom: undefined, delay: '0.5s', size: 'w-14 h-14', sound: 'germ_pop_2' as const, transform: undefined },
  { id: 3, color: 'bg-[#E91E63]', top: undefined, left: undefined, right: '25%', bottom: '16%', delay: '0.8s', size: 'w-18 h-18', sound: 'germ_pop_3' as const, transform: undefined },
  { id: 4, color: 'bg-[#00BCD4]', top: undefined, left: '10%', right: undefined, bottom: '24%', delay: '0.3s', size: 'w-12 h-12', sound: 'germ_pop_4' as const, transform: undefined },
  { id: 5, color: 'bg-[#FF9800]', top: '50%', left: '50%', right: undefined, bottom: undefined, delay: '1.2s', size: 'w-14 h-14', sound: 'germ_pop_5' as const, transform: '-translate-x-1/2 -translate-y-1/2' },
];

export default function GameScreen() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [gameState, setGameState] = useState<'intro' | 'water' | 'soap' | 'scrub' | 'rinse' | 'dry' | 'celebration'>('intro');
  const [germs, setGerms] = useState([...INITIAL_GERMS]);
  const { play } = useSound();
  const haptic = useHaptic();
  const { stars, addStar } = useStars();

  const poppedCount = 5 - germs.length;

  const handleStart = () => {
    play('tap');
    haptic.lightTap();
    setGameState('water');
  };

  const handleWaterTap = () => {
    play('water_on');
    haptic.lightTap();
    setTimeout(() => setGameState('soap'), 1500);
  };

  const handleSoapTap = () => {
    play('soap_squish');
    haptic.lightTap();
    setTimeout(() => setGameState('scrub'), 1500);
  };

  const handleGermTap = (germId: number, sound: typeof INITIAL_GERMS[number]['sound']) => {
    play(sound);
    haptic.mediumTap();
    setGerms(prev => prev.filter(g => g.id !== germId));
    if (germs.length === 1) {
      setTimeout(() => setGameState('rinse'), 1000);
    }
  };

  const handleRinseTap = () => {
    play('rinse_splash');
    haptic.lightTap();
    setTimeout(() => setGameState('dry'), 1500);
  };

  const handleDryTap = () => {
    play('dry_cloth');
    haptic.lightTap();
    setTimeout(() => {
      setGameState('celebration');
      addStar(1);
      play('victory_fanfare');
      haptic.success();
      setTimeout(() => play('star_ding'), 1500);
    }, 1500);
  };

  const handlePlayAgain = () => {
    setGerms([...INITIAL_GERMS]);
    setGameState('intro');
  };

  if (gameState === 'intro') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-gradient-to-b from-primary to-secondary flex flex-col items-center justify-center p-6 text-center">
        <div className="relative w-64 h-64 mb-8">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl" />
          <img src={images.hirwaFull} alt="Hirwa" className="w-full h-full object-contain relative z-10" />
          <div className="absolute -top-8 -right-8 bg-white text-primary font-bold px-4 py-2 rounded-2xl rounded-bl-none shadow-lg z-20">
            Amaboko yanjye asa n'ayera!
          </div>
        </div>
        <h1 className="font-headline text-3xl text-white font-bold mb-8 drop-shadow-md">
          {t('game.start')}
        </h1>
        <button onClick={handleStart} className="bg-white text-primary font-headline font-bold text-2xl px-12 py-4 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-transform animate-pulse">
          Tangira!
        </button>
      </motion.div>
    );
  }

  if (gameState === 'celebration') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-gradient-to-b from-secondary to-accent-warm flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        {/* Confetti */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute w-3 h-6 bg-white rounded-sm animate-bounce" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random()}s`, backgroundColor: ['#FFD700', '#E91E63', '#00BCD4', '#4CAF50'][i % 4] }} />
          ))}
        </div>

        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }} className="relative w-64 h-64 mb-8 z-10">
          <div className="absolute inset-0 bg-white/40 rounded-full blur-3xl" />
          <img src={images.hirwaFull} alt="Hirwa Clean" className="w-full h-full object-contain relative z-10" />
        </motion.div>

        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="z-10">
          <h1 className="font-headline text-4xl text-white font-bold mb-2 drop-shadow-lg">{'\u2B50'} Wabikoze neza!</h1>
          <p className="font-body text-xl text-white/90 font-bold mb-12">{t('game.done')}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="flex flex-col gap-4 w-full max-w-xs z-10">
          <button onClick={handlePlayAgain} className="bg-primary text-white font-headline font-bold text-xl px-8 py-4 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform">
            {t('game.playAgain')}
          </button>
          <button onClick={() => navigate('/episode/1')} className="bg-transparent border-2 border-white text-white font-headline font-bold text-xl px-8 py-4 rounded-full hover:bg-white/10 active:scale-95 transition-all">
            Subira ku Isomo
          </button>
        </motion.div>
      </motion.div>
    );
  }

  const steps = ['water', 'soap', 'scrub', 'rinse', 'dry'];
  const currentStepIndex = steps.indexOf(gameState);

  return (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="min-h-screen flex flex-col items-center justify-between overflow-hidden pb-8 bg-surface">
      <header className="flex justify-between items-center px-6 py-4 w-full sticky top-0 z-50">
        <button onClick={() => navigate('/episode/1')} className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-container-low text-primary hover:scale-105 transition-transform active:scale-95 duration-150">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2 bg-accent/20 px-4 py-2 rounded-full border border-accent/20">
          <Star className="w-5 h-5 text-accent-warm fill-current" />
          <span className="font-display font-bold text-dark text-lg">{stars}</span>
        </div>
      </header>

      <main className="relative w-full flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-md px-6 mt-2">
          <div className="flex justify-between items-center relative z-10 px-2">
            {[
              { id: 'water', icon: <Droplets className="w-6 h-6 fill-current" /> },
              { id: 'soap', icon: <Sparkles className="w-6 h-6 fill-current" /> },
              { id: 'scrub', icon: <Bug className="w-6 h-6 fill-current" /> },
              { id: 'rinse', icon: <Wind className="w-6 h-6" /> },
              { id: 'dry', icon: <Shirt className="w-6 h-6" /> }
            ].map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div key={step.id} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isCurrent ? 'bg-primary text-white scale-125 shadow-xl ring-4 ring-primary-light' : isPast ? 'bg-secondary text-white' : 'bg-surface-container-highest text-primary/40'}`}>
                  {step.icon}
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative w-full max-w-lg aspect-square flex items-center justify-center mt-12">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={`w-80 h-80 rounded-full blur-3xl transition-colors duration-1000 ${gameState === 'water' ? 'bg-blue-400/30' : gameState === 'soap' ? 'bg-pink-400/20' : 'bg-primary-light/30'}`} />
          </div>

          <div className="relative w-72 h-72 lg:w-96 lg:h-96 bg-white rounded-full shadow-2xl flex items-center justify-center overflow-visible border-8 border-surface-warm">
            <img src={images.hands} alt="Hands" className={`w-4/5 h-4/5 object-contain z-10 transition-all duration-500 ${gameState === 'water' ? 'brightness-90 sepia-[0.2] hue-rotate-180' : gameState === 'dry' ? 'brightness-110 contrast-125' : ''}`} />

            {gameState === 'water' && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-start pt-4 cursor-pointer" onClick={handleWaterTap}>
                <Droplets className="w-16 h-16 text-blue-500 animate-bounce" />
              </div>
            )}

            {gameState === 'soap' && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center cursor-pointer" onClick={handleSoapTap}>
                <div className="w-24 h-16 bg-pink-200 rounded-3xl border-4 border-pink-300 shadow-lg animate-pulse flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-pink-400" />
                </div>
              </div>
            )}

            {gameState === 'scrub' && (
              <AnimatePresence>
                {germs.map(germ => (
                  <motion.div
                    key={germ.id}
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0, opacity: 0, rotate: 180 }}
                    className={`absolute z-20 cursor-pointer hover:scale-110 active:scale-90 transition-transform germ-bounce ${germ.size}`}
                    style={{ top: germ.top, left: germ.left, right: germ.right, bottom: germ.bottom, animationDelay: germ.delay, transform: germ.transform }}
                    onClick={() => handleGermTap(germ.id, germ.sound)}
                  >
                    <div className={`w-full h-full ${germ.color} rounded-full flex flex-col items-center justify-center shadow-lg border-4 border-white`}>
                      <div className="flex gap-1">
                        <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center"><div className="w-1 h-1 bg-black rounded-full" /></div>
                        <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center"><div className="w-1 h-1 bg-black rounded-full" /></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {gameState === 'rinse' && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-start pt-4 cursor-pointer" onClick={handleRinseTap}>
                <Wind className="w-16 h-16 text-blue-400 animate-bounce" />
              </div>
            )}

            {gameState === 'dry' && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center cursor-pointer" onClick={handleDryTap}>
                <Shirt className="w-24 h-24 text-gray-300 animate-pulse" />
              </div>
            )}
          </div>
        </div>

        <div className="w-full max-w-2xl px-6 flex flex-col items-center text-center mt-12">
          <div className="bg-white p-6 rounded-2xl w-full shadow-lg relative">
            {gameState === 'water' && (
              <>
                <h2 className="font-display text-3xl text-primary mb-2 font-bold leading-tight">{t('game.water')}</h2>
                <p className="font-body text-dark/60 font-semibold text-lg italic">Tap the water!</p>
              </>
            )}
            {gameState === 'soap' && (
              <>
                <h2 className="font-display text-3xl text-primary mb-2 font-bold leading-tight">{t('game.soap')}</h2>
                <p className="font-body text-dark/60 font-semibold text-lg italic">Tap the soap!</p>
              </>
            )}
            {gameState === 'scrub' && (
              <>
                <h2 className="font-display text-3xl text-primary mb-2 font-bold leading-tight">{t('game.scrub')}</h2>
                <p className="font-body text-dark/60 font-semibold text-lg italic">Scrub hands! Tap the germs!</p>
              </>
            )}
            {gameState === 'rinse' && (
              <>
                <h2 className="font-display text-3xl text-primary mb-2 font-bold leading-tight">{t('game.rinse')}</h2>
                <p className="font-body text-dark/60 font-semibold text-lg italic">Rinse in water!</p>
              </>
            )}
            {gameState === 'dry' && (
              <>
                <h2 className="font-display text-3xl text-primary mb-2 font-bold leading-tight">{t('game.dry')}</h2>
                <p className="font-body text-dark/60 font-semibold text-lg italic">Dry your hands!</p>
              </>
            )}
          </div>
        </div>
      </main>
    </motion.div>
  );
}

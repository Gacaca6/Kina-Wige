import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bug, Droplets, Sparkles, Wind, Shirt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/context';
import { useSound, useHaptic } from '../../hooks/useSound';
import { useStars } from '../../hooks/useStars';
import { useProgress } from '../../hooks/useProgress';
import { games } from '../../data/games';
import { images } from '../../assets/images';
import { KidShell, Card } from '../../components/ui/Shell';

const SPRING = { type: 'spring' as const, stiffness: 900, damping: 34, mass: 0.5 };

const INITIAL_GERMS = [
  { id: 1, color: 'bg-[#4CAF50]', top: '10%', left: '25%', right: undefined, bottom: undefined, delay: '0.1s', size: 'w-16 h-16', sound: 'germ_pop_1' as const, transform: undefined },
  { id: 2, color: 'bg-[#9C27B0]', top: '20%', left: undefined, right: '10%', bottom: undefined, delay: '0.5s', size: 'w-14 h-14', sound: 'germ_pop_2' as const, transform: undefined },
  { id: 3, color: 'bg-[#E91E63]', top: undefined, left: undefined, right: '25%', bottom: '16%', delay: '0.8s', size: 'w-18 h-18', sound: 'germ_pop_3' as const, transform: undefined },
  { id: 4, color: 'bg-[#00BCD4]', top: undefined, left: '10%', right: undefined, bottom: '24%', delay: '0.3s', size: 'w-12 h-12', sound: 'germ_pop_4' as const, transform: undefined },
  { id: 5, color: 'bg-[#FF9800]', top: '50%', left: '50%', right: undefined, bottom: undefined, delay: '1.2s', size: 'w-14 h-14', sound: 'germ_pop_5' as const, transform: '-translate-x-1/2 -translate-y-1/2' },
];

export default function HandwashGame() {
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const info = games.find(g => g.id === 'karaba');
  const [gameState, setGameState] = useState<'intro' | 'water' | 'soap' | 'scrub' | 'rinse' | 'dry' | 'celebration'>('intro');
  const [germs, setGerms] = useState([...INITIAL_GERMS]);
  const { play } = useSound();
  const haptic = useHaptic();
  const { stars, addStar } = useStars();
  const { markGameCompleted } = useProgress();

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
    setGerms(prev => {
      const next = prev.filter(g => g.id !== germId);
      if (next.length === 0 && prev.length > 0) {
        setTimeout(() => setGameState('rinse'), 1000);
      }
      return next;
    });
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
      markGameCompleted('karaba');
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center p-6 text-center"
        style={{ minHeight: '100dvh', background: '#17543C' }}
      >
        <div className="relative w-64 h-64 mb-8">
          <img src={images.hirwaFull} alt="Hirwa" className="w-full h-full object-contain relative z-10" />
          <div
            className="absolute -top-6 -right-4 bg-white font-body font-black px-4 py-2 rounded-[16px] rounded-bl-none z-20"
            style={{ color: '#17543C', fontSize: 14, boxShadow: '0 4px 0 #DDD6C8' }}
          >
            {t('game.cleanHands')}
          </div>
        </div>
        <h1 className="font-display font-extrabold text-white mb-8" style={{ fontSize: 30 }}>
          {t('game.start')}
        </h1>
        <motion.button
          onClick={handleStart}
          whileTap={{ y: 6, boxShadow: '0 2px 0 #D9D2C4' }}
          transition={SPRING}
          className="chunk rounded-[22px] px-14"
          style={{ minHeight: 76, background: '#FFFFFF', boxShadow: '0 8px 0 #D9D2C4' }}
        >
          <span className="font-display font-extrabold" style={{ color: '#17543C', fontSize: 24 }}>{t('splash.start')}</span>
        </motion.button>
      </motion.div>
    );
  }

  if (gameState === 'celebration') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center p-6 text-center"
        style={{ minHeight: '100dvh', background: '#17543C' }}
      >
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 14, mass: 0.9 }}
          className="w-56 h-56 mb-6"
        >
          <img src={images.hirwaFull} alt="" className="w-full h-full object-contain" />
        </motion.div>

        <h1 className="font-display font-extrabold text-white mb-2" style={{ fontSize: 34 }}>⭐ {t('quiz.success')}</h1>
        <p className="font-body font-bold text-white/85 mb-6" style={{ fontSize: 17 }}>{t('game.done')}</p>

        <div className="flex items-center gap-3 rounded-[20px] px-6 mb-8" style={{ minHeight: 60, background: '#0E3626' }}>
          <span style={{ fontSize: 24 }} aria-hidden>⭐</span>
          <span className="font-body font-black text-white" style={{ fontSize: 22 }}>+1</span>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <motion.button
            onClick={handlePlayAgain}
            whileTap={{ y: 6, boxShadow: '0 2px 0 #1E8C4C' }}
            transition={SPRING}
            className="chunk rounded-[22px]"
            style={{ minHeight: 76, background: '#2FBF6B', boxShadow: '0 8px 0 #1E8C4C' }}
          >
            <span className="font-display font-extrabold text-white" style={{ fontSize: 21 }}>{t('game.playAgain')}</span>
          </motion.button>
          <motion.button
            onClick={() => navigate('/games')}
            whileTap={{ y: 5, boxShadow: '0 2px 0 #0B2A1D' }}
            transition={SPRING}
            className="chunk rounded-[22px]"
            style={{ minHeight: 68, background: '#0E3626', boxShadow: '0 6px 0 #0B2A1D' }}
          >
            <span className="font-body font-black text-mint" style={{ fontSize: 18 }}>{t('nav.games')}</span>
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const steps = ['water', 'soap', 'scrub', 'rinse', 'dry'];
  const currentStepIndex = steps.indexOf(gameState);

  return (
    <KidShell
      title={info ? info.title[language] : 'Karaba!'}
      onBack={() => navigate('/games')}
      nav={false}
      lang={false}
    >
      <main className="relative w-full flex-grow flex flex-col items-center justify-center pb-8">
        <div className="w-full max-w-md px-6 mt-4">
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
                <div
                  key={step.id}
                  className="w-12 h-12 rounded-full grid place-items-center transition-transform duration-300"
                  style={
                    isCurrent
                      ? { background: '#2FBF6B', color: '#FFFFFF', transform: 'scale(1.2)', boxShadow: '0 0 0 4px #C3DFC7' }
                      : isPast
                        ? { background: '#17543C', color: '#FFFFFF' }
                        : { background: '#E7F7EE', color: '#97C79D' }
                  }
                >
                  {step.icon}
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative w-full max-w-lg aspect-square flex items-center justify-center mt-12">
          <div className="relative w-72 h-72 lg:w-96 lg:h-96 bg-white rounded-full flex items-center justify-center overflow-visible" style={{ boxShadow: '0 10px 0 #DDD6C8', border: '8px solid #E7F7EE' }}>
            <img src={images.hands} alt="" className={`w-4/5 h-4/5 object-contain z-10 transition-all duration-500 ${gameState === 'water' ? 'brightness-90 sepia-[0.2] hue-rotate-180' : gameState === 'dry' ? 'brightness-110 contrast-125' : ''}`} />

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
          <Card className="w-full">
            {gameState === 'water' && (
              <h2 className="font-display font-extrabold leading-tight" style={{ fontSize: 26, color: '#17543C' }}>{t('game.water')}</h2>
            )}
            {gameState === 'soap' && (
              <h2 className="font-display font-extrabold leading-tight" style={{ fontSize: 26, color: '#17543C' }}>{t('game.soap')}</h2>
            )}
            {gameState === 'scrub' && (
              <h2 className="font-display font-extrabold leading-tight" style={{ fontSize: 26, color: '#17543C' }}>{t('game.scrub')}</h2>
            )}
            {gameState === 'rinse' && (
              <h2 className="font-display font-extrabold leading-tight" style={{ fontSize: 26, color: '#17543C' }}>{t('game.rinse')}</h2>
            )}
            {gameState === 'dry' && (
              <h2 className="font-display font-extrabold leading-tight" style={{ fontSize: 26, color: '#17543C' }}>{t('game.dry')}</h2>
            )}
          </Card>
        </div>
      </main>
    </KidShell>
  );
}

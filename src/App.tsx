import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, Play, Gamepad2, Users, ArrowLeft, Bug, Droplets, 
  Sparkles, Wind, Shirt, User, Target, Home, Eye, Check, 
  Hourglass, BookOpen, LineChart, Settings, PlayCircle, Volume2
} from 'lucide-react';

import { useSound, useHaptic } from './hooks/useSound';
import { useI18n } from './i18n/context';

type Screen = 'splash' | 'home' | 'episode' | 'game' | 'parents' | 'episodesList' | 'gamesList';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash': return <SplashScreen onNext={() => setCurrentScreen('home')} />;
      case 'home': return <HomeScreen onNavigate={setCurrentScreen} />;
      case 'episode': return <EpisodeScreen onNavigate={setCurrentScreen} />;
      case 'game': return <GameScreen onNavigate={setCurrentScreen} />;
      case 'parents': return <ParentScreen onNavigate={setCurrentScreen} />;
      case 'episodesList': return <EpisodeListScreen onNavigate={setCurrentScreen} />;
      case 'gamesList': return <GamesScreen onNavigate={setCurrentScreen} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body font-medium selection:bg-primary/20">
      <AnimatePresence mode="wait">
        <motion.div key={currentScreen} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// --- Components ---

function BottomNav({ currentScreen, onNavigate }: { currentScreen: Screen, onNavigate: (s: Screen) => void }) {
  const { t } = useI18n();
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-[60%] z-50 flex justify-around items-center h-20 px-4 bg-white/90 backdrop-blur-xl rounded-[48px] shadow-[0_24px_48px_-12px_rgba(0,33,19,0.06)]">
      <NavButton 
        icon={<Home className="w-6 h-6" />} 
        label={t('nav.home')} 
        isActive={currentScreen === 'home'} 
        onClick={() => onNavigate('home')} 
      />
      <NavButton 
        icon={<PlayCircle className="w-6 h-6" />} 
        label={t('nav.episodes')} 
        isActive={currentScreen === 'episodesList' || currentScreen === 'episode'} 
        onClick={() => onNavigate('episodesList')} 
      />
      <NavButton 
        icon={<Gamepad2 className="w-6 h-6" />} 
        label={t('nav.games')} 
        isActive={currentScreen === 'gamesList' || currentScreen === 'game'} 
        onClick={() => onNavigate('gamesList')} 
      />
      <NavButton 
        icon={<Users className="w-6 h-6" />} 
        label={t('nav.parents')} 
        isActive={currentScreen === 'parents'} 
        onClick={() => onNavigate('parents')} 
      />
    </nav>
  );
}

function NavButton({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center transition-all duration-150 active:scale-90 ${
        isActive ? 'text-primary' : 'text-primary-container opacity-70 hover:opacity-100'
      }`}
    >
      {icon}
      <span className="font-headline text-xs font-bold mt-1">{label}</span>
      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1" />}
    </button>
  );
}

// --- Screens ---

function SplashScreen({ onNext }: { onNext: () => void }) {
  return (
    <motion.main 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="storybook-canvas min-h-screen flex flex-col items-center justify-center p-6 text-white relative overflow-hidden"
    >
      <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-md mx-auto w-full">
        <div className="w-64 h-64 bg-white rounded-3xl flex items-center justify-center mb-4 shadow-xl overflow-hidden p-2">
          <img src="/logo.jpeg" alt="Kina Wige Logo" className="w-full h-full object-contain" />
        </div>
        
        <div className="space-y-3">
          <p className="text-surface/90 font-sans text-base">
            The Modern Umudugudu for early learning.
          </p>
        </div>

        <div className="pt-12 w-full">
          <button 
            onClick={onNext}
            className="w-full bg-white text-primary font-sans font-medium px-8 py-4 rounded-xl text-base hover:bg-surface transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            Get Started
            <Play className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>
    </motion.main>
  );
}

function HomeScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const { t, language, setLanguage } = useI18n();
  const [activeAvatar, setActiveAvatar] = useState<'keza' | 'hirwa'>('keza');

  const toggleLanguage = () => {
    const langs: ('KN' | 'EN' | 'FR')[] = ['KN', 'EN', 'FR'];
    const nextLang = langs[(langs.indexOf(language) + 1) % langs.length];
    setLanguage(nextLang);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex flex-col pb-32">
      <header className="bg-surface flex justify-between items-center w-full px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveAvatar(prev => prev === 'keza' ? 'hirwa' : 'keza')}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary shadow-sm active:scale-95 transition-transform"
          >
            <img 
              src={activeAvatar === 'keza' 
                ? "https://lh3.googleusercontent.com/aida-public/AB6AXuDEdg8MyGkjyWReYZX9wqhZ0FjXXjfmk8tovnI2YYYcHH_APLB7tj0qLtWy3ay_2Lyuyd3b1LZ0uac43NflrZ99Pg6npKbf_PSU9dEvagpwFyfq-kS2JmydYZ37tVmgn29xan5T0fwJzBTIIwxxfc-Y-Tf81RNb3fQfjyO87MJkvFFiu7bkoHtMDs5m0WtPp5BZzoAWND2_4vJu68SP1sanNuKebqbtkRQV-KW94lPQORvYUY31g9VhqeYuXYhHsecOwKbA-_q3hvQ3" 
                : "https://lh3.googleusercontent.com/aida-public/AB6AXuAnO3EPLVqvHDpipcPKNl-dTm3_ibLSv2bsmAV2_Gi29bGz2Py-_IwPHSqSweUTTEJGhXVm630UzUqYyCF36PfP6mSM_a0mkCdKgdwAlD-UwIko7LuCHOqrjjXaA727kKLykZMV-dwGMpATPeFdcEYGDH5uGFYmEKRb1y1sfF7jeeV3gNItnVr5hZHR2Pq50nis_Lw6_oxJtZy9hUfEejzAhoKqzlcXJl40FSaInAVtqxyuIwWiih3AyqSXkDC1_81TFG6lN37aU55D"
              } 
              alt="Avatar" 
              className="w-full h-full object-cover" 
            />
          </button>
          <div className="flex items-center gap-1 bg-surface-container-lowest px-3 py-1.5 rounded-full shadow-sm">
            <Star className="w-4 h-4 text-tertiary-fixed-dim fill-current" />
            <span className="font-headline font-bold text-primary text-sm">12</span>
          </div>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 w-12 h-12">
          <img src="/logo.jpeg" alt="Kina Wige Logo" className="w-full h-full object-contain" />
        </div>
        <button onClick={toggleLanguage} className="text-primary font-headline font-bold hover:scale-105 transition-transform active:scale-95 px-4 py-2 bg-secondary-container rounded-full text-sm">
          {language}
        </button>
      </header>

      <section className="relative h-[397px] hillside-gradient overflow-hidden flex flex-col items-center justify-center px-6 text-center">
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-primary-fixed-dim/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-5%] w-80 h-80 bg-tertiary-fixed/10 rounded-full blur-3xl" />
        
        <div className="flex items-end justify-center gap-4 mb-6 z-10">
          <div className="relative w-32 h-32 md:w-48 md:h-48">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMGSU8vvdbf6Gh7hMUneuO_zoPfe05vx5OIaSHTUMzyyG6ZjJg-807M1N8cS1__SVH5-9xRlajoJKQNzRYDlHC3-uG5Y4IzM3an-sQ2Npy_Ck-JvMYwhoiTlO1TdXjc6MM_2QazNsY4avwlcwFERLPdrvaLF5-FPIoiWef3xZQGrRrUBY38tLiFoAuYv5oPfxfNX6hrN7VnLdUc79EWc7e7ynJ2ZJVGrlO3VZ9xKkN8Lt-3YuVqOZ2LHkZ_VageA1CGIA9_bLRvvvD" alt="Keza" className="w-full h-full object-contain drop-shadow-2xl" />
          </div>
          <div className="relative w-32 h-32 md:w-48 md:h-48">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXYOGoSa9PrA9TjlROECTxB6Lxg9mZZRB1-RKD3YRmgE5FFpaJ0UnmUUROpRsZG0dq2jT7ri4EQr0WMz1XZpu3iqQD14SeAEdCqknzifrMQvENRS2Ht5KdhJFbLXcmc-z0Y5Z2sOnRtLBp2y63mwP9vXOIfaJd0Q9uD7FwHD6m5RD9yi3Jq7kzWeHw88cfb7iWcvct-F_MT3Uvhv7ImtwMXG8eJMKBLHOOPjcUNZqH1qjYelksyCPyA_ryQ5M3QIfA0FAV0ZIh9suQ" alt="Hirwa" className="w-full h-full object-contain drop-shadow-2xl" />
          </div>
        </div>
        <h2 className="font-display text-3xl md:text-5xl text-white font-bold tracking-tight drop-shadow-md z-10">
          {t('home.greeting')}
        </h2>
        <p className="text-on-primary-container/80 mt-2 font-medium z-10">{t('home.welcome_subtitle')}</p>
      </section>

      <section className="px-6 -mt-8 relative z-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-2xl text-primary font-bold">{t('home.episodes')}</h3>
            <div className="h-1 flex-grow mx-4 bg-outline-variant/15 rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Active Episode 1 */}
            <button 
              onClick={() => onNavigate('episode')}
              className="group bg-surface-container-lowest rounded-lg p-1 shadow-[0_24px_48px_-12px_rgba(0,33,19,0.06)] hover:scale-[1.02] transition-transform duration-300 text-left w-full"
            >
              <div className="aspect-video rounded-lg overflow-hidden relative">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMLsyzolDHL_06MXaW0FCHilLQI8HO302-sa28V8x1Qfd-Vzk0pPGw7zG0MwJra21wrb7PjJEEYKpwW1PDStOKW2i0VIy-uONP4f_n5yuq-b-mudQI-9F9zbB32SYGiEb2YUioFs5uLW5XaR_DtELngOFUspLpBrRQqQx6jpUDrf1qpygwXzSlui1Nku38ws_V3zsosezSUq7MfW_iNOYTpEWCoZuwebli5SuySkzPoYvS0srHn_joNGaRQqBW3TOV2TnjHg-Y5nqC" alt="Karaba Amaboko" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle className="w-16 h-16 text-white" />
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-headline font-bold text-lg text-primary">Karaba Amaboko!</h4>
                  <div className="bg-tertiary-fixed px-3 py-1 rounded-full text-xs font-bold text-on-tertiary-fixed flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> 0/1
                  </div>
                </div>
                <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden relative">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#000_1px,_transparent_1px)] bg-[length:4px_4px]" />
                  <div className="h-full bg-tertiary-container w-[5%] rounded-full" />
                </div>
              </div>
            </button>

            {/* Active Episode 2 (Combined Clip) */}
            <button 
              onClick={() => onNavigate('episode')}
              className="group bg-surface-container-lowest rounded-lg p-1 shadow-[0_24px_48px_-12px_rgba(0,33,19,0.06)] hover:scale-[1.02] transition-transform duration-300 text-left w-full"
            >
              <div className="aspect-video rounded-lg overflow-hidden relative">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLZFqeDY2vdIaBbcZzfIeNU2DenOlX7DXRSqKYMIaAiWnvRDyk5FfG3099MeDAixAmLAY3eofDuyhHV0VlHYJamAyvwCq7OoZuVj-Sxk65ImV_f6qYKoxuOp-vivVXNU-ECGxMY1gjb516_AdPXzt626sLNzyO3TiYQiYzCPnMT_9U9zqP4nRVtWEljg77WAShS26aYAEpd0EmObPwzL_sDyPMmryprHUcigVEu2s446xcMSS2JMLix3jXGJPpXZUJR-aC0iiwhnC6" alt="Gukaraba no Kurya" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle className="w-16 h-16 text-white" />
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-headline font-bold text-lg text-primary">Gukaraba no Kurya</h4>
                  <div className="bg-tertiary-fixed px-3 py-1 rounded-full text-xs font-bold text-on-tertiary-fixed flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> 0/1
                  </div>
                </div>
                <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden relative">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#000_1px,_transparent_1px)] bg-[length:4px_4px]" />
                  <div className="h-full bg-tertiary-container w-[0%] rounded-full" />
                </div>
              </div>
            </button>

            {/* Locked Episodes */}
            <div className="bg-surface-container-low/50 rounded-lg p-1 border-2 border-dashed border-outline-variant/30 grayscale opacity-80">
              <div className="aspect-video rounded-lg overflow-hidden relative bg-surface-dim flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-outline rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-outline rounded-full" />
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-headline font-bold text-lg text-outline">Menya Ibiryo Byiza</h4>
                <span className="text-xs font-bold text-outline uppercase tracking-wider">{t('coming_soon')}</span>
              </div>
            </div>
            
            <div className="bg-surface-container-low/50 rounded-lg p-1 border-2 border-dashed border-outline-variant/30 grayscale opacity-80">
              <div className="aspect-video rounded-lg overflow-hidden relative bg-surface-dim flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-outline rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-outline rounded-full" />
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-headline font-bold text-lg text-outline">Tubyigane!</h4>
                <span className="text-xs font-bold text-outline uppercase tracking-wider">{t('coming_soon')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <BottomNav currentScreen="home" onNavigate={onNavigate} />
    </motion.div>
  );
}

function VisualQuiz({ onComplete }: { onComplete: () => void }) {
  const { t, language } = useI18n();
  const { play } = useSound();
  const [step, setStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const questions = [
    {
      text: t('quiz.question1'),
      options: [
        { id: 'soap', image: '🧼', isCorrect: true, label: t('quiz.soap') },
        { id: 'mud', image: '💩', isCorrect: false, label: t('quiz.mud') },
        { id: 'toy', image: '🧸', isCorrect: false, label: t('quiz.toy') },
      ]
    },
    {
      text: t('quiz.question2'),
      options: [
        { id: 'eat', image: '🍽️', isCorrect: true, label: t('quiz.eat') },
        { id: 'sleep', image: '🛌', isCorrect: false, label: t('quiz.sleep') },
      ]
    }
  ];

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      play('success');
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        if (step < questions.length - 1) {
          setStep(step + 1);
        } else {
          onComplete();
        }
      }, 2000);
    } else {
      play('error');
    }
  };

  const currentQ = questions[step];

  const speakQuestion = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(currentQ.text);
      // Try to set appropriate language voice
      if (language === 'KN') {
        utterance.lang = 'rw-RW'; // Kinyarwanda might not be fully supported, but we try
      } else if (language === 'FR') {
        utterance.lang = 'fr-FR';
      } else {
        utterance.lang = 'en-US';
      }
      utterance.rate = 0.9; // Slightly slower for kids
      window.speechSynthesis.speak(utterance);
    }
  };

  // Auto-speak when question changes
  useEffect(() => {
    speakQuestion();
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [step, language]);

  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-lg border-4 border-primary/20 text-center relative overflow-hidden mt-8">
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="text-2xl">🌟</span>
        <h3 className="text-2xl font-headline font-bold text-primary">
          {t('quiz.title')}
        </h3>
        <span className="text-2xl">🌟</span>
      </div>

      <div className="mb-8 flex flex-col items-center gap-4">
        <button 
          onClick={speakQuestion} 
          className="p-4 bg-primary/10 rounded-full hover:bg-primary/20 hover:scale-105 transition-all animate-pulse"
          aria-label="Play audio"
        >
          <Volume2 className="w-8 h-8 text-primary" />
        </button>
        <h4 className="text-xl font-bold text-on-surface max-w-md mx-auto">
          {currentQ.text}
        </h4>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4">
        {currentQ.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleAnswer(opt.isCorrect)}
            className="w-36 h-36 text-6xl bg-surface-container-low rounded-2xl flex flex-col items-center justify-center hover:scale-105 hover:bg-primary-container transition-all shadow-sm border-4 border-transparent hover:border-primary/30"
          >
            <span className="mb-2">{opt.image}</span>
            {opt.label && <span className="text-sm font-bold text-on-surface">{opt.label}</span>}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-10"
          >
            <motion.div 
              animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className="text-8xl mb-4"
            >
              🌟
            </motion.div>
            <p className="text-3xl font-headline font-bold text-primary">{t('quiz.success')}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EpisodeScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const { t } = useI18n();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen pb-32">
      <header className="bg-surface text-primary sticky top-0 z-50 flex justify-between items-center w-full px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('home')} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low hover:scale-105 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-headline font-bold tracking-tight text-xl">{t('episode1.title')}</h1>
        </div>
        <div className="flex items-center gap-2 bg-tertiary-fixed px-4 py-2 rounded-full">
          <Star className="w-5 h-5 text-on-tertiary-fixed-variant fill-current" />
          <span className="font-bold text-on-tertiary-fixed-variant">124</span>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-6 py-6 space-y-8">
        <section className="relative group">
          <div className="w-full aspect-video rounded-lg overflow-hidden relative shadow-lg bg-surface-container-high border-4 border-surface-container-lowest">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0Zodxv3Xz9vGeE9LEiJx88_Ej9yhCA7md8bfgKRVABZHgQgYtbrnpqHVaKqH4ydp7ElzYohhDCnSnEuDoqYxcW4vxBLuqXcYjUROFXyoYPPaz1ca0WszXwEKxRrgICLu2fdt-8zSIu_mpeWfOHFBP0Ubyaw4M0N_GnEXGT0-fbo2EFcoiGITIPc_EeHQcI7lbAPZ8BBT1hp_Pv292EQ4-tA912riQXgpAg_vguiexbyvRviwBB1oDd4rDgnQDiHjOkUXWKEShfADb" alt="Video placeholder" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/20 backdrop-blur-[2px]">
              <button className="w-24 h-24 bg-primary text-on-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-[0_8px_16px_rgba(15,82,56,0.3)] group-active:scale-95">
                <Play className="w-12 h-12 fill-current" />
              </button>
              <p className="mt-4 font-headline font-bold text-primary text-xl bg-surface-container-lowest/80 px-6 py-2 rounded-full">Video iraza vuba</p>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary-container rounded-full -z-10 opacity-50 blur-xl" />
        </section>

        <section className="flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2 bg-[#d1e8ff] text-[#004a77] px-6 py-3 rounded-full font-bold shadow-sm">
            <span className="text-xl">🫧</span>
            <span>{t('episode.what_you_learn')}</span>
          </div>
          <div className="flex items-center gap-2 bg-[#ffe8d1] text-[#774a00] px-6 py-3 rounded-full font-bold shadow-sm">
            <span className="text-xl">🧠</span>
            <span>Kwibuka</span>
          </div>
          <div className="flex items-center gap-2 bg-[#e8ffd1] text-[#4a7700] px-6 py-3 rounded-full font-bold shadow-sm">
            <span className="text-xl">🤝</span>
            <span>Intambwe</span>
          </div>
        </section>

        <section className="bg-surface-container-low p-8 rounded-lg relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-3xl font-headline font-extrabold text-primary tracking-tight">Ubu tugiye gukina!</h2>
              <p className="text-primary-container font-medium">Ereka Hirwa uburyo bwo gukaraba neza!</p>
            </div>
            <button 
              onClick={() => onNavigate('game')}
              className="bg-primary text-on-primary px-10 py-5 rounded-full font-headline font-bold text-xl hover:scale-105 transition-transform active:scale-95 shadow-[0_12px_24px_-8px_rgba(15,82,56,0.4)] border-b-4 border-primary-fixed-variant"
            >
              {t('episode1.play')}
            </button>
          </div>
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-surface-container-highest rounded-full opacity-30" />
          <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-tertiary-fixed rounded-full opacity-40" />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-lg text-sm font-bold uppercase tracking-widest">{t('episode.story')}</div>
            <p className="text-lg leading-relaxed text-on-surface font-medium">
              Hirwa yari ashotse mu gikari, ariko yibagiwe gukaraba amaboko mbere yo kurya! Keza na Mama baramufasha kwibuka intambwe 7 zo gukaraba neza hakoreshejwe amazi meza n'isabune.
            </p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_24px_48px_-12px_rgba(0,33,19,0.06)]">
            <h3 className="text-primary font-bold mb-6 flex items-center gap-2">
              <Users className="w-5 h-5" />
              {t('episode.characters')}
            </h3>
            <div className="flex -space-x-4">
              <div className="w-16 h-16 rounded-full border-4 border-surface-container-lowest overflow-hidden bg-secondary-container">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEdg8MyGkjyWReYZX9wqhZ0FjXXjfmk8tovnI2YYYcHH_APLB7tj0qLtWy3ay_2Lyuyd3b1LZ0uac43NflrZ99Pg6npKbf_PSU9dEvagpwFyfq-kS2JmydYZ37tVmgn29xan5T0fwJzBTIIwxxfc-Y-Tf81RNb3fQfjyO87MJkvFFiu7bkoHtMDs5m0WtPp5BZzoAWND2_4vJu68SP1sanNuKebqbtkRQV-KW94lPQORvYUY31g9VhqeYuXYhHsecOwKbA-_q3hvQ3" alt="Keza" className="w-full h-full object-cover" />
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-surface-container-lowest overflow-hidden bg-primary-container">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnO3EPLVqvHDpipcPKNl-dTm3_ibLSv2bsmAV2_Gi29bGz2Py-_IwPHSqSweUTTEJGhXVm630UzUqYyCF36PfP6mSM_a0mkCdKgdwAlD-UwIko7LuCHOqrjjXaA727kKLykZMV-dwGMpATPeFdcEYGDH5uGFYmEKRb1y1sfF7jeeV3gNItnVr5hZHR2Pq50nis_Lw6_oxJtZy9hUfEejzAhoKqzlcXJl40FSaInAVtqxyuIwWiih3AyqSXkDC1_81TFG6lN37aU55D" alt="Hirwa" className="w-full h-full object-cover" />
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-surface-container-lowest overflow-hidden bg-tertiary-container">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCArmEaU4fGRxwxf7p83hqL23BeehOImlnED7vViH9NB0NdtP7DsR-lUGSUkNpL0MgWNyeIvwlSf61ePeOxbBJVow451Kmvu5WBwCsN-J-Urks-hTFe8DxtQ4W52xCdMduTHyDZShKqjG1oApw1mxgqepxlg9ANRKn5d59Ye-_l4J7iMkf44ibwOaHDEdY-d5CSdV26xEFC28XEWRvq0HWDLnE8wddAtPMsHxEeOMoUXcc-qspP7l8bOhvsijJH6UsSk9zVWS48LaEB" alt="Mama" className="w-full h-full object-cover" />
              </div>
            </div>
            <p className="mt-4 text-sm text-outline font-medium">Keza, Hirwa, na Mama baragutegereje!</p>
          </div>
        </section>

        <VisualQuiz onComplete={() => {}} />
      </main>
      
      <BottomNav currentScreen="episode" onNavigate={onNavigate} />
    </motion.div>
  );
}

function GameScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const { t } = useI18n();
  const [gameState, setGameState] = useState<'intro' | 'water' | 'soap' | 'scrub' | 'rinse' | 'dry' | 'celebration'>('intro');
  const [germs, setGerms] = useState([
    { id: 1, color: 'bg-[#4CAF50]', top: '10%', left: '25%', delay: '0.1s', size: 'w-16 h-16', sound: 'germ_pop_1' },
    { id: 2, color: 'bg-[#9C27B0]', top: '20%', right: '10%', delay: '0.5s', size: 'w-14 h-14', sound: 'germ_pop_2' },
    { id: 3, color: 'bg-[#E91E63]', bottom: '16%', right: '25%', delay: '0.8s', size: 'w-18 h-18', sound: 'germ_pop_3' },
    { id: 4, color: 'bg-[#00BCD4]', bottom: '24%', left: '10%', delay: '0.3s', size: 'w-12 h-12', sound: 'germ_pop_4' },
    { id: 5, color: 'bg-[#FF9800]', top: '50%', left: '50%', delay: '1.2s', size: 'w-14 h-14', transform: '-translate-x-1/2 -translate-y-1/2', sound: 'germ_pop_5' },
  ]);

  const poppedCount = 5 - germs.length;
  const { play } = useSound();
  const haptic = useHaptic();

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

  const handleGermTap = (germId: number, sound: any) => {
    play(sound);
    haptic.mediumTap();
    setGerms(prev => prev.filter(g => g.id !== germId));
    if (germs.length === 1) {
      setTimeout(() => setGameState('rinse'), 1000);
    }
  };

  const handleRinseTap = () => {
    play('tap'); // Replace with rinse_splash
    haptic.lightTap();
    setTimeout(() => setGameState('dry'), 1500);
  };

  const handleDryTap = () => {
    play('tap'); // Replace with dry_cloth
    haptic.lightTap();
    setTimeout(() => {
      setGameState('celebration');
      play('victory_fanfare');
      haptic.success();
      setTimeout(() => play('star_ding'), 1500);
    }, 1500);
  };

  if (gameState === 'intro') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-gradient-to-b from-primary to-secondary flex flex-col items-center justify-center p-6 text-center">
        <div className="relative w-64 h-64 mb-8">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl" />
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXYOGoSa9PrA9TjlROECTxB6Lxg9mZZRB1-RKD3YRmgE5FFpaJ0UnmUUROpRsZG0dq2jT7ri4EQr0WMz1XZpu3iqQD14SeAEdCqknzifrMQvENRS2Ht5KdhJFbLXcmc-z0Y5Z2sOnRtLBp2y63mwP9vXOIfaJd0Q9uD7FwHD6m5RD9yi3Jq7kzWeHw88cfb7iWcvct-F_MT3Uvhv7ImtwMXG8eJMKBLHOOPjcUNZqH1qjYelksyCPyA_ryQ5M3QIfA0FAV0ZIh9suQ" alt="Hirwa" className="w-full h-full object-contain relative z-10" />
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
        {/* Confetti effect placeholder */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute w-3 h-6 bg-white rounded-sm animate-bounce" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random()}s`, backgroundColor: ['#FFD700', '#E91E63', '#00BCD4', '#4CAF50'][i % 4] }} />
          ))}
        </div>
        
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }} className="relative w-64 h-64 mb-8 z-10">
          <div className="absolute inset-0 bg-white/40 rounded-full blur-3xl" />
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXYOGoSa9PrA9TjlROECTxB6Lxg9mZZRB1-RKD3YRmgE5FFpaJ0UnmUUROpRsZG0dq2jT7ri4EQr0WMz1XZpu3iqQD14SeAEdCqknzifrMQvENRS2Ht5KdhJFbLXcmc-z0Y5Z2sOnRtLBp2y63mwP9vXOIfaJd0Q9uD7FwHD6m5RD9yi3Jq7kzWeHw88cfb7iWcvct-F_MT3Uvhv7ImtwMXG8eJMKBLHOOPjcUNZqH1qjYelksyCPyA_ryQ5M3QIfA0FAV0ZIh9suQ" alt="Hirwa Clean" className="w-full h-full object-contain relative z-10" />
        </motion.div>

        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="z-10">
          <h1 className="font-headline text-4xl text-white font-bold mb-2 drop-shadow-lg">⭐ Wabikoze neza!</h1>
          <p className="font-body text-xl text-white/90 font-bold mb-12">{t('game.done')}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="flex flex-col gap-4 w-full max-w-xs z-10">
          <button onClick={() => { setGameState('intro'); setGerms([...germs]); }} className="bg-primary text-white font-headline font-bold text-xl px-8 py-4 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform">
            {t('game.playAgain')}
          </button>
          <button onClick={() => onNavigate('episode')} className="bg-transparent border-2 border-white text-white font-headline font-bold text-xl px-8 py-4 rounded-full hover:bg-white/10 active:scale-95 transition-all">
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
        <button onClick={() => onNavigate('episode')} className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-container-low text-primary hover:scale-105 transition-transform active:scale-95 duration-150">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2 bg-accent/20 px-4 py-2 rounded-full border border-accent/20">
          <Star className="w-5 h-5 text-accent-warm fill-current" />
          <span className="font-display font-bold text-dark text-lg">1,240</span>
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
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3dx1CkDG5UHcXHRx14r9c7Gjk7Q2HG9TWB0ov0PmY95WXV5txnp0ClJQ51ufcoC25GSrj67xiyCdLBUBbgIMNcKOb-ZAqZnNASR9whH7BYlEORF3ncKJaULwDeGy9uvTDcoSJnOns6gEi7_Jp6PXLFbJcF-lTk6xCe1vR8TJ5GbItbNe3JrcNS-lNI0EPeS5_ffxy0vYjax6m5w7Lc4PiOSOJhbRRB00geAsNjDn9KW9dBQ4TWMEf-CU5QqsMQt_kxzSPMphnOeGb" alt="Hands" className={`w-4/5 h-4/5 object-contain z-10 transition-all duration-500 ${gameState === 'water' ? 'brightness-90 sepia-[0.2] hue-rotate-180' : gameState === 'dry' ? 'brightness-110 contrast-125' : ''}`} />
            
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

function ParentScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const { t, language, setLanguage } = useI18n();

  const toggleLanguage = () => {
    const langs: ('KN' | 'EN' | 'FR')[] = ['KN', 'EN', 'FR'];
    const nextLang = langs[(langs.indexOf(language) + 1) % langs.length];
    setLanguage(nextLang);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-[#FFF8E7] text-on-background pb-32">
      <header className="w-full top-0 sticky z-40 bg-[#FFF8E7]">
        <div className="flex justify-between items-center px-6 py-4 w-full">
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('home')} className="hover:bg-surface-container-highest/20 transition-colors active:scale-95 p-2 rounded-full">
              <ArrowLeft className="w-6 h-6 text-primary" />
            </button>
            <h1 className="font-headline font-bold text-xl tracking-tight text-primary">
              {t('parents.title')}
            </h1>
          </div>
          <button onClick={toggleLanguage} className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full">
            <span className="text-xs font-bold text-primary">{language}</span>
          </button>
        </div>
        <div className="bg-[#cdffe2] h-[1px] opacity-15" />
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-8 space-y-10">
        <section className="flex flex-col md:flex-row items-center gap-8 bg-surface-container-lowest p-8 rounded-lg shadow-sm border border-outline-variant/10">
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 bg-tertiary-fixed/30 px-4 py-1 rounded-full text-tertiary font-bold text-sm">
              <Sparkles className="w-4 h-4 fill-current" />
              {t('parents.welcome')}
            </div>
            <h2 className="font-nunito text-3xl font-extrabold text-on-surface leading-tight">
              {t('parents.subtitle')}
            </h2>
            <p className="font-nunito text-lg text-on-surface-variant leading-relaxed">
              {t('parents.description')}
            </p>
          </div>
          <div className="w-32 h-32 md:w-48 md:h-48 relative shrink-0">
            <div className="absolute inset-0 bg-primary-fixed rounded-full opacity-20 scale-110" />
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA32B8Cq4N3HQrDVSuoxc0Ko7XPfo3VE-w2p6xT1Woc9duUorJyfYRVB0_Vb1ombiMQtrUzNDaj52SKOdCyltT3I3iZjXJUMOQXjSGhp4h8PyqOs74sqzk2abO23LTvH2Mgs_sTaAutJ6lwEHF1WROwOpAtcKPBsRpaXtahmdqxCtzDWYebP_bAT9TDBh_eK1AIZ7UBVZZQ_fGxf0GAXVxksDsInSAgj9-3I0JP479CGhM7qSON5I1Nzi-79uJQ-BIuRzJc45dc4UAJ" alt="Parent and child" className="w-full h-full object-cover rounded-full border-4 border-surface-container-lowest" />
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-nunito text-2xl font-bold text-primary">{t('parents.episode1')}</h3>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Active Lesson</span>
          </div>
          <div className="bg-surface-container-low rounded-lg overflow-hidden space-y-1">
            <details className="group bg-surface-container-lowest" open>
              <summary className="flex items-center gap-4 p-6 cursor-pointer list-none">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                  <Target className="w-5 h-5" />
                </div>
                <span className="font-nunito text-lg font-bold flex-1">{t('parents.whatWelearned')}</span>
              </summary>
              <div className="px-20 pb-8 font-nunito text-on-surface-variant leading-relaxed">
                Today's session focused on the essential steps of hygiene. Your child learned how germs spread and why soap is our best friend in keeping our family healthy.
              </div>
            </details>

            <details className="group bg-surface-container-lowest">
              <summary className="flex items-center gap-4 p-6 cursor-pointer list-none">
                <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
                  <Home className="w-5 h-5 fill-current" />
                </div>
                <span className="font-nunito text-lg font-bold flex-1">{t('parents.activities')}</span>
              </summary>
              <div className="px-20 pb-8 space-y-4 font-nunito">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-surface-container-low border border-transparent hover:border-primary/20 transition-all">
                  <input type="checkbox" className="w-6 h-6 rounded border-outline text-primary focus:ring-primary" />
                  <div className="flex-1">
                    <h4 className="font-bold text-on-surface">Indirimbo y'amaboko</h4>
                    <p className="text-sm text-on-surface-variant italic">5 min • Sing together during handwashing</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-surface-container-low border border-transparent hover:border-primary/20 transition-all">
                  <input type="checkbox" className="w-6 h-6 rounded border-outline text-primary focus:ring-primary" />
                  <div className="flex-1">
                    <h4 className="font-bold text-on-surface">Ibibazo ku dupfunyi</h4>
                    <p className="text-sm text-on-surface-variant italic">5 min • Ask: "Where do germs hide?"</p>
                  </div>
                </div>
              </div>
            </details>

            <details className="group bg-surface-container-lowest">
              <summary className="flex items-center gap-4 p-6 cursor-pointer list-none">
                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
                  <Eye className="w-5 h-5 fill-current" />
                </div>
                <span className="font-nunito text-lg font-bold flex-1">{t('parents.changes')}</span>
              </summary>
              <div className="px-20 pb-8 font-nunito text-on-surface-variant leading-relaxed">
                Look for your child initiating handwashing without being asked, or reminding others to use soap. This shows they are internalizing the value of hygiene!
              </div>
            </details>
          </div>
        </section>

        <section className="bg-[#1B4332] text-white p-8 rounded-lg space-y-6">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <h3 className="font-nunito text-xl font-bold">Incamake y'icyumweru</h3>
              <p className="text-primary-fixed opacity-90">Murakora neza! Mukomeze!</p>
            </div>
            <div className="font-nunito text-3xl font-black text-tertiary-fixed">85%</div>
          </div>
          <div className="flex justify-between items-center gap-2">
            {['Mon', 'Tue', 'Wed'].map(day => (
              <div key={day} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center border-2 border-primary-fixed">
                  <Check className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase font-bold opacity-60">{day}</span>
              </div>
            ))}
            {['Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20" />
                <span className="text-[10px] uppercase font-bold opacity-60">{day}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center py-10 opacity-60 space-y-4">
          <Hourglass className="w-10 h-10 text-primary mx-auto" />
          <p className="font-nunito font-bold text-primary">More episodes coming soon</p>
        </section>
      </main>

      <BottomNav currentScreen="parents" onNavigate={onNavigate} />
    </motion.div>
  );
}

function EpisodeListScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const { t } = useI18n();
  const lockedEpisodes = [
    { title: "Menya Ibiryo Byiza", category: "🥗 Imirire", teaser: "Learning about healthy food choices" },
    { title: "Tubyigane!", category: "🤝 Imyitwarire", teaser: "Sharing, kindness, and taking turns" },
    { title: "Barira Amenyo!", category: "🫧 Isuku", teaser: "Daily tooth brushing habits" },
    { title: "Tubareho!", category: "🔢 Kubara", teaser: "Counting 1–10 with Keza and Hirwa" },
    { title: "Amazina y'Amabara", category: "🎨 Kwiga", teaser: "Learning colors in Kinyarwanda" },
  ];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="min-h-screen pb-32">
      <header className="bg-surface flex justify-between items-center w-full px-6 py-4 sticky top-0 z-40">
        <h1 className="text-2xl font-black text-primary font-headline tracking-tight">{t('home.episodes')}</h1>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">1/6</div>
      </header>

      <main className="px-6 py-6 max-w-lg mx-auto space-y-6">
        {/* Active Episode 1 */}
        <button 
          onClick={() => onNavigate('episode')}
          className="group bg-white rounded-2xl p-2 shadow-lg hover:scale-[1.02] transition-transform duration-300 text-left w-full border-2 border-transparent hover:border-primary/20"
        >
          <div className="aspect-video rounded-xl overflow-hidden relative mb-3">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMLsyzolDHL_06MXaW0FCHilLQI8HO302-sa28V8x1Qfd-Vzk0pPGw7zG0MwJra21wrb7PjJEEYKpwW1PDStOKW2i0VIy-uONP4f_n5yuq-b-mudQI-9F9zbB32SYGiEb2YUioFs5uLW5XaR_DtELngOFUspLpBrRQqQx6jpUDrf1qpygwXzSlui1Nku38ws_V3zsosezSUq7MfW_iNOYTpEWCoZuwebli5SuySkzPoYvS0srHn_joNGaRQqBW3TOV2TnjHg-Y5nqC" alt="Karaba Amaboko" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <PlayCircle className="w-16 h-16 text-white" />
            </div>
          </div>
          <div className="px-2 pb-2">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-headline font-bold text-xl text-primary">Karaba Amaboko!</h4>
              <div className="bg-accent/20 px-2 py-1 rounded-full text-xs font-bold text-accent-warm flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" /> 0/1
              </div>
            </div>
            <span className="text-sm font-bold text-secondary mb-3 block">🫧 Isuku</span>
            <div className="w-full h-2 bg-surface-warm rounded-full overflow-hidden">
              <div className="h-full bg-accent w-[5%] rounded-full" />
            </div>
          </div>
        </button>

        {/* Active Episode 2 (Combined Clip) */}
        <button 
          onClick={() => onNavigate('episode')}
          className="group bg-white rounded-2xl p-2 shadow-lg hover:scale-[1.02] transition-transform duration-300 text-left w-full border-2 border-transparent hover:border-primary/20"
        >
          <div className="aspect-video rounded-xl overflow-hidden relative mb-3">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLZFqeDY2vdIaBbcZzfIeNU2DenOlX7DXRSqKYMIaAiWnvRDyk5FfG3099MeDAixAmLAY3eofDuyhHV0VlHYJamAyvwCq7OoZuVj-Sxk65ImV_f6qYKoxuOp-vivVXNU-ECGxMY1gjb516_AdPXzt626sLNzyO3TiYQiYzCPnMT_9U9zqP4nRVtWEljg77WAShS26aYAEpd0EmObPwzL_sDyPMmryprHUcigVEu2s446xcMSS2JMLix3jXGJPpXZUJR-aC0iiwhnC6" alt="Gukaraba no Kurya" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <PlayCircle className="w-16 h-16 text-white" />
            </div>
          </div>
          <div className="px-2 pb-2">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-headline font-bold text-xl text-primary">Gukaraba no Kurya</h4>
              <div className="bg-accent/20 px-2 py-1 rounded-full text-xs font-bold text-accent-warm flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" /> 0/1
              </div>
            </div>
            <span className="text-sm font-bold text-secondary mb-3 block">🥗 Imirire & 🫧 Isuku</span>
            <div className="w-full h-2 bg-surface-warm rounded-full overflow-hidden">
              <div className="h-full bg-accent w-[0%] rounded-full" />
            </div>
          </div>
        </button>

        {/* Locked Episodes */}
        {lockedEpisodes.map((ep, i) => (
          <div key={i} className="bg-white/50 rounded-2xl p-2 border-2 border-dashed border-primary/20 grayscale opacity-70 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/40 z-10 flex flex-col items-center justify-center backdrop-blur-[1px]">
              <div className="bg-dark/80 text-white p-3 rounded-full mb-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <span className="font-headline font-bold text-dark bg-white/80 px-4 py-1 rounded-full">{t('coming_soon')}</span>
            </div>
            <div className="aspect-video rounded-xl overflow-hidden relative bg-surface-warm mb-3" />
            <div className="px-2 pb-2">
              <h4 className="font-headline font-bold text-xl text-dark mb-1">{ep.title}</h4>
              <span className="text-sm font-bold text-dark/60 block mb-1">{ep.category}</span>
              <p className="text-sm text-dark/50">{ep.teaser}</p>
            </div>
          </div>
        ))}
      </main>
      <BottomNav currentScreen="episodesList" onNavigate={onNavigate} />
    </motion.div>
  );
}

function GamesScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const { t } = useI18n();
  const lockedGames = [
    { title: "Hitamo Ibiryo", category: "🥗 Imirire" },
    { title: "Saranganya", category: "🤝 Imyitwarire" },
    { title: "Koza Amenyo", category: "🫧 Isuku" },
    { title: "Bara 1-10", category: "🔢 Kubara" },
    { title: "Shakisha Amabara", category: "🎨 Kwiga" },
  ];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="min-h-screen pb-32">
      <header className="bg-surface flex justify-between items-center w-full px-6 py-4 sticky top-0 z-40">
        <h1 className="text-2xl font-black text-primary font-headline tracking-tight">{t('home.games')}</h1>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">1/6</div>
      </header>

      <div className="bg-accent-warm text-white px-6 py-3 text-center font-headline font-bold shadow-md">
        Imikino igufasha kwiga!
      </div>

      <main className="px-6 py-6 max-w-lg mx-auto space-y-6">
        {/* Active Game */}
        <button 
          onClick={() => onNavigate('game')}
          className="group bg-white rounded-2xl p-4 shadow-lg hover:scale-[1.02] transition-transform duration-300 text-left w-full border-2 border-transparent hover:border-primary/20 flex items-center gap-4"
        >
          <div className="w-24 h-24 rounded-xl overflow-hidden relative bg-primary-light flex-shrink-0 flex items-center justify-center">
            <Bug className="w-12 h-12 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-headline font-bold text-xl text-primary mb-1">Karaba Amaboko!</h4>
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-accent fill-current" />
              <span className="text-sm font-bold text-dark/70">High Score: 1,240</span>
            </div>
            <div className="bg-primary text-white text-center py-2 rounded-full font-bold text-sm group-hover:bg-primary-light transition-colors">
              Play Now
            </div>
          </div>
        </button>

        {/* Locked Games */}
        {lockedGames.map((game, i) => (
          <div key={i} className="bg-white/50 rounded-2xl p-4 border-2 border-dashed border-primary/20 grayscale opacity-70 relative overflow-hidden flex items-center gap-4">
            <div className="absolute inset-0 bg-white/40 z-10 flex items-center justify-center backdrop-blur-[1px]">
              <span className="font-headline font-bold text-dark bg-white/80 px-4 py-1 rounded-full flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                {t('coming_soon')}
              </span>
            </div>
            <div className="w-24 h-24 rounded-xl overflow-hidden relative bg-surface-warm flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-headline font-bold text-lg text-dark mb-1">{game.title}</h4>
              <span className="text-sm font-bold text-dark/60 block">{game.category}</span>
            </div>
          </div>
        ))}
      </main>
      <BottomNav currentScreen="gamesList" onNavigate={onNavigate} />
    </motion.div>
  );
}


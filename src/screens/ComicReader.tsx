import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { useI18n } from '../i18n/context';
import { useSound, useHaptic } from '../hooks/useSound';
import { useStars } from '../hooks/useStars';
import { useProgress } from '../hooks/useProgress';
import { getComic } from '../data/comics';

export default function ComicReader() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t, language } = useI18n();
  const { play } = useSound();
  const haptic = useHaptic();
  const { addStar } = useStars();
  const { markComicRead } = useProgress();

  const comic = getComic(id);
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  // Read the current panel's caption aloud (EN/FR via speech synthesis;
  // Kinyarwanda has no synthesis voice so it falls back to a default voice —
  // recorded audio can be added later via the same button).
  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = language === 'KN' ? 'rw-RW' : language === 'FR' ? 'fr-FR' : 'en-US';
    u.rate = 0.9;
    u.pitch = 1.15;
    window.speechSynthesis.speak(u);
  };

  // Stop any narration when leaving the reader.
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  if (!comic) {
    return <Navigate to="/comics" replace />;
  }

  const panel = comic.panels[index];
  const isLast = index === comic.panels.length - 1;

  const goNext = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (isLast) {
      play('victory_fanfare');
      haptic.success();
      addStar(1);
      markComicRead(comic.id);
      setFinished(true);
      return;
    }
    play('tap');
    haptic.lightTap();
    setIndex(i => i + 1);
  };

  const goPrev = () => {
    if (index === 0) return;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    play('tap');
    haptic.lightTap();
    setIndex(i => i - 1);
  };

  const restart = () => {
    setFinished(false);
    setIndex(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col bg-gradient-to-b from-[#E8F5E9] to-[#F0FFF4]"
    >
      {/* Header */}
      <header className="flex items-center gap-4 px-4 py-3 sticky top-0 z-40">
        <button
          onClick={() => navigate('/comics')}
          aria-label="Back to books"
          className="w-11 h-11 flex items-center justify-center rounded-full bg-white/80 text-forest shadow-sm hover:scale-105 transition-transform active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display font-bold text-forest text-lg leading-tight flex-1 truncate">
          {comic.title[language]}
        </h1>
      </header>

      {/* Progress dots */}
      <div className="flex justify-center gap-1.5 pb-3">
        {comic.panels.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === index ? 'w-6 bg-forest' : i < index ? 'w-2 bg-grass' : 'w-2 bg-mint'
            }`}
          />
        ))}
      </div>

      {/* Panel */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 pb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: 'spring', damping: 22 }}
            className="w-full max-w-md flex flex-col items-center"
          >
            <div className="w-full aspect-square bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-white flex items-center justify-center">
              <img src={panel.image} alt="" className="w-full h-full object-contain p-4" />
            </div>

            <div className="mt-5 w-full bg-white rounded-2xl shadow-md px-5 py-4 relative">
              <p className="text-lg font-bold text-ink leading-relaxed text-center">{panel.text[language]}</p>
              <button
                onClick={() => speak(panel.text[language])}
                className="mt-3 mx-auto text-sm text-forest/60 hover:text-forest flex items-center gap-1.5 transition-colors"
              >
                <Volume2 className="w-4 h-4" /> {t('comic.listen')}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Nav controls */}
      <div className="sticky bottom-0 px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] flex items-center justify-between gap-4">
        <button
          onClick={goPrev}
          disabled={index === 0}
          aria-label={t('comic.prev')}
          className="w-14 h-14 rounded-full bg-white text-forest shadow-md flex items-center justify-center disabled:opacity-30 active:scale-90 transition-transform"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>

        <button
          onClick={goNext}
          className="flex-1 h-14 rounded-full bg-forest text-white font-display font-bold text-lg shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          {isLast ? t('comic.finish') : t('comic.next')}
          {!isLast && <ChevronRight className="w-6 h-6" />}
        </button>
      </div>

      {/* Completion overlay */}
      <AnimatePresence>
        {finished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-gradient-to-b from-secondary to-accent-warm flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="text-8xl mb-6"
            >
              ⭐
            </motion.div>
            <h2 className="font-display text-4xl text-white font-bold mb-2 drop-shadow-lg">{t('comic.done')}</h2>
            <p className="font-body text-xl text-white/90 font-bold mb-10">+1 ⭐</p>
            <div className="flex flex-col gap-4 w-full max-w-xs">
              <button
                onClick={restart}
                className="bg-forest text-white font-display font-bold text-xl px-8 py-4 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform"
              >
                {t('comic.readAgain')}
              </button>
              <button
                onClick={() => navigate('/comics')}
                className="bg-transparent border-2 border-white text-white font-display font-bold text-xl px-8 py-4 rounded-full hover:bg-white/10 active:scale-95 transition-all"
              >
                {t('comics.title')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { useI18n } from '../i18n/context';
import { useSound, useHaptic } from '../hooks/useSound';
import { useStars } from '../hooks/useStars';
import { useProgress } from '../hooks/useProgress';
import { getComic } from '../data/comics';
import { KidShell } from '../components/ui/Shell';
import Kina from '../components/characters/Kina';

const SPRING = { type: 'spring' as const, stiffness: 900, damping: 34, mass: 0.5 };

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
    <KidShell title={comic.title[language]} onBack={() => navigate('/comics')} nav={false} lang={false}>
      <div className="flex flex-col px-4 pt-4" style={{ minHeight: 'calc(100dvh - 120px)' }}>
        {/* Progress — a page count a pre-reader can see at a glance. */}
        <div className="flex justify-center gap-1.5 pb-4 flex-none" role="progressbar">
          {comic.panels.map((_, i) => (
            <motion.span
              key={i}
              className="rounded-full"
              animate={{ width: i === index ? 26 : 10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 26 }}
              style={{ height: 10, background: i <= index ? '#2FBF6B' : '#E4DDCE' }}
            />
          ))}
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className="flex flex-col"
            >
              <div
                className="w-full bg-white overflow-hidden grid place-items-center"
                style={{ aspectRatio: '1', borderRadius: 26, boxShadow: '0 8px 0 #DDD6C8' }}
              >
                <img src={panel.image} alt="" className="w-full h-full object-contain p-3" />
              </div>

              <div
                className="mt-4 bg-white px-5 py-4"
                style={{ borderRadius: 26, boxShadow: '0 6px 0 #DDD6C8' }}
              >
                <p
                  className="font-display font-extrabold text-ink text-center"
                  style={{ fontSize: 20, lineHeight: 1.35 }}
                >
                  {panel.text[language]}
                </p>
                <button
                  onClick={() => speak(panel.text[language])}
                  aria-label={t('comic.listen')}
                  className="mt-3 mx-auto flex items-center justify-center gap-2 rounded-[16px] px-4"
                  style={{ minHeight: 48, background: '#FFC02E', boxShadow: '0 4px 0 #D89A00' }}
                >
                  <Volume2 className="w-5 h-5" style={{ color: '#10241B' }} />
                  <span className="font-body font-black text-ink" style={{ fontSize: 14 }}>
                    {t('comic.listen')}
                  </span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Turn the page */}
        <div className="flex items-center gap-3 py-4 pb-safe flex-none">
          <motion.button
            onClick={goPrev}
            disabled={index === 0}
            aria-label={t('comic.prev')}
            whileTap={index === 0 ? undefined : { y: 5, boxShadow: '0 2px 0 #D9D2C4' }}
            transition={SPRING}
            className="rounded-[22px] bg-white grid place-items-center flex-none"
            style={{ width: 76, height: 76, boxShadow: '0 6px 0 #D9D2C4', opacity: index === 0 ? 0.35 : 1 }}
          >
            <ChevronLeft className="w-8 h-8" style={{ color: '#17543C' }} />
          </motion.button>

          <motion.button
            onClick={goNext}
            whileTap={{ y: 6, boxShadow: '0 2px 0 #1E8C4C' }}
            transition={SPRING}
            className="flex-1 rounded-[22px] flex items-center justify-center gap-2"
            style={{ minHeight: 76, background: '#2FBF6B', boxShadow: '0 8px 0 #1E8C4C' }}
          >
            <span className="font-display font-extrabold text-white" style={{ fontSize: 22 }}>
              {isLast ? t('comic.finish') : t('comic.next')}
            </span>
            {!isLast && <ChevronRight className="w-7 h-7 text-white" />}
          </motion.button>
        </div>
      </div>

      {/* Finished */}
      <AnimatePresence>
        {finished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center"
            style={{ background: '#17543C' }}
          >
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 14, mass: 0.9 }}
            >
              <Kina mood="cheer" style={{ width: 150, height: 136 }} />
            </motion.div>
            <h2
              className="font-display font-extrabold text-white mt-5"
              style={{ fontSize: 40, lineHeight: 1.05 }}
            >
              {t('comic.done')}
            </h2>
            <div
              className="mt-5 flex items-center gap-3 rounded-[20px] px-6"
              style={{ minHeight: 72, background: '#0E3626' }}
            >
              <span style={{ fontSize: 28 }}>⭐</span>
              <span className="font-body font-black text-white" style={{ fontSize: 26 }}>+1</span>
            </div>
            <div className="flex flex-col gap-3 w-full max-w-xs mt-8">
              <motion.button
                onClick={restart}
                whileTap={{ y: 6, boxShadow: '0 2px 0 #1E8C4C' }}
                transition={SPRING}
                className="rounded-[22px]"
                style={{ minHeight: 76, background: '#2FBF6B', boxShadow: '0 8px 0 #1E8C4C' }}
              >
                <span className="font-display font-extrabold text-white" style={{ fontSize: 21 }}>
                  {t('comic.readAgain')}
                </span>
              </motion.button>
              <motion.button
                onClick={() => navigate('/comics')}
                whileTap={{ y: 5, boxShadow: '0 2px 0 #0B2A1D' }}
                transition={SPRING}
                className="rounded-[22px]"
                style={{ minHeight: 68, background: '#0E3626', boxShadow: '0 6px 0 #0B2A1D' }}
              >
                <span className="font-body font-black text-mint" style={{ fontSize: 18 }}>
                  {t('comics.title')}
                </span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </KidShell>
  );
}

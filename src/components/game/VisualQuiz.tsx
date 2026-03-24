import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { useSound } from '../../hooks/useSound';
import { useI18n } from '../../i18n/context';

export default function VisualQuiz({ onComplete }: { onComplete: () => void }) {
  const { t, language } = useI18n();
  const { play } = useSound();
  const [step, setStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userStartedQuiz, setUserStartedQuiz] = useState(false);

  const questions = [
    {
      text: t('quiz.question1'),
      options: [
        { id: 'soap', image: '\u{1F9FC}', isCorrect: true, label: t('quiz.soap') },
        { id: 'mud', image: '\u{1F4A9}', isCorrect: false, label: t('quiz.mud') },
        { id: 'toy', image: '\u{1F9F8}', isCorrect: false, label: t('quiz.toy') },
      ]
    },
    {
      text: t('quiz.question2'),
      options: [
        { id: 'eat', image: '\u{1F37D}\uFE0F', isCorrect: true, label: t('quiz.eat') },
        { id: 'sleep', image: '\u{1F6CC}', isCorrect: false, label: t('quiz.sleep') },
      ]
    }
  ];

  const handleAnswer = (isCorrect: boolean) => {
    if (!userStartedQuiz) setUserStartedQuiz(true);
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
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentQ.text);
      if (language === 'KN') {
        utterance.lang = 'rw-RW';
      } else if (language === 'FR') {
        utterance.lang = 'fr-FR';
      } else {
        utterance.lang = 'en-US';
      }
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Only speak when user has explicitly interacted with the quiz
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Speak on step change ONLY if user already started the quiz
  useEffect(() => {
    if (userStartedQuiz) {
      speakQuestion();
    }
  }, [step, language, userStartedQuiz]);

  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-lg border-4 border-primary/20 text-center relative overflow-hidden mt-8">
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="text-2xl">{'\u{1F31F}'}</span>
        <h3 className="text-2xl font-headline font-bold text-primary">
          {t('quiz.title')}
        </h3>
        <span className="text-2xl">{'\u{1F31F}'}</span>
      </div>

      <div className="mb-8 flex flex-col items-center gap-4">
        <button
          onClick={() => { setUserStartedQuiz(true); speakQuestion(); }}
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
              {'\u{1F31F}'}
            </motion.div>
            <p className="text-3xl font-headline font-bold text-primary">{t('quiz.success')}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

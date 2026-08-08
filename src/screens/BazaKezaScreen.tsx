import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Keyboard, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/context';
import { useSound, useHaptic } from '../hooks/useSound';
import { findOfflineAnswer, offTopicResponses } from '../data/kezaQA';
import Kina from '../components/characters/Kina';
import type { KinaMood } from '../components/characters/Kina';
import { KidShell } from '../components/ui/Shell';

interface Message {
  id: number;
  type: 'user' | 'keza';
  text: string;
  emoji?: string;
  isThinking?: boolean;
}

export default function BazaKezaScreen() {
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const { play } = useSound();
  const haptic = useHaptic();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [textInput, setTextInput] = useState('');
  /** Transient — Kina cheers for a beat after answering, then settles. */
  const [cheer, setCheer] = useState(false);
  const [look, setLook] = useState<{ x: number; y: number } | null>(null);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const msgIdRef = useRef(0);
  const greetedRef = useRef(false);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Keza's greeting on first visit (ref guard so StrictMode doesn't greet twice)
  useEffect(() => {
    if (greetedRef.current) return;
    greetedRef.current = true;
    const greetings = {
      KN: 'Muraho! Ndi Keza. Ubaza iki uyu munsi?',
      EN: 'Hello! I\'m Keza. What would you like to ask today?',
      FR: 'Bonjour! Je suis Keza. Qu\'est-ce que tu veux demander aujourd\'hui?',
    };
    setTimeout(() => {
      addKezaMessage(greetings[language], '👋');
    }, 500);
  }, []);

  const addKezaMessage = (text: string, emoji: string = '✨') => {
    msgIdRef.current += 1;
    setMessages(prev => [...prev, {
      id: msgIdRef.current,
      type: 'keza',
      text,
      emoji,
    }]);
  };

  const addUserMessage = (text: string) => {
    msgIdRef.current += 1;
    setMessages(prev => [...prev, {
      id: msgIdRef.current,
      type: 'user',
      text,
    }]);
  };

  // Process a question — fully offline, answered from the built-in Q&A database
  const processQuestion = useCallback(async (question: string) => {
    if (!question.trim()) return;

    addUserMessage(question);
    play('tap');
    haptic.lightTap();

    setIsThinking(true);

    // Add thinking indicator
    msgIdRef.current += 1;
    const thinkingId = msgIdRef.current;
    setMessages(prev => [...prev, {
      id: thinkingId,
      type: 'keza',
      text: '',
      isThinking: true,
    }]);

    const offlineMatch = findOfflineAnswer(question);

    // Small delay so it feels like Keza is "thinking"
    await new Promise(r => setTimeout(r, 1000));

    setMessages(prev => prev.filter(m => m.id !== thinkingId));

    if (offlineMatch) {
      addKezaMessage(offlineMatch.answer[language], offlineMatch.emoji);
      play('clean_chime');
    } else {
      // No match — gently redirect ("ask your parent!")
      addKezaMessage(offTopicResponses[language], '🤔');
      play('tap');
    }

    setIsThinking(false);
    // Kina celebrates the answer, then settles back to idle on her own.
    setCheer(true);
    window.setTimeout(() => setCheer(false), 1800);
  }, [language, play, haptic]);

  // Speech recognition — tap to start, tap again to stop, or auto-stops after speech
  const toggleListening = useCallback(() => {
    // If already listening, stop
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setShowKeyboard(true);
      return;
    }

    // Stop any previous instance
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
    }

    const recognition = new SpeechRecognition();
    // Kinyarwanda may not be supported — fall back to English for better results
    recognition.lang = language === 'FR' ? 'fr-FR' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    recognition.continuous = true; // Keep listening until user stops or silence detected

    recognition.onresult = (event: any) => {
      // Get the latest final result
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
        }
      }
      if (transcript.trim()) {
        recognition.stop();
        setIsListening(false);
        processQuestion(transcript.trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.log('Speech error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed' || event.error === 'service-not-available') {
        setShowKeyboard(true);
      }
      // For 'no-speech' or 'aborted', just stop silently
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      setIsListening(true);
      play('tap');
      haptic.mediumTap();
    } catch (e) {
      console.log('Speech start failed:', e);
      setShowKeyboard(true);
    }
  }, [isListening, language, processQuestion, play, haptic]);

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      processQuestion(textInput.trim());
      setTextInput('');
    }
  };

  // Speak Keza's response aloud
  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'KN' ? 'rw-RW' : language === 'FR' ? 'fr-FR' : 'en-US';
      utterance.rate = 0.85;
      utterance.pitch = 1.3; // Slightly higher pitch for child-friendly voice
      window.speechSynthesis.speak(utterance);
    }
  };

  /* Kina carries the whole conversation — she listens, thinks, then cheers.
     No static portraits anywhere; the state IS the illustration. */
  const mood: KinaMood = isThinking ? 'point' : isListening ? 'point' : cheer ? 'cheer' : 'idle';

  const hint =
    language === 'KN'
      ? 'Kanda kuri mikoro uvuge ikibazo cyawe!'
      : language === 'FR'
        ? 'Appuie sur le micro et pose ta question!'
        : 'Tap the mic and ask your question!';

  const listeningLabel =
    language === 'KN' ? 'Ndumva… Vuga!' : language === 'FR' ? "J'écoute… Parle!" : 'Listening… Speak!';

  return (
    <KidShell
      title="Baza Keza"
      hint={language === 'KN' ? 'Ndahari kukwibaza!' : language === 'FR' ? 'Je suis là pour toi!' : "I'm here to help!"}
      onBack={() => navigate(-1)}
      nav={false}
    >
      <div
        className="flex flex-col"
        style={{ minHeight: 'calc(100dvh - 120px)' }}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setLook({ x: ((e.clientX - r.left) / r.width) * 2 - 1, y: ((e.clientY - r.top) / r.height) * 2 - 1 });
        }}
        onPointerLeave={() => setLook(null)}
      >
        {/* ── Kina, always present and always reacting ── */}
        <div className="flex flex-col items-center pt-5 pb-3 flex-none">
          <motion.div
            animate={{ scale: isListening ? 1.06 : 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15, mass: 0.9 }}
            className="relative grid place-items-center"
          >
            {isListening && (
              <motion.span
                className="absolute rounded-full"
                style={{ width: 180, height: 180, border: '6px solid #FFC02E' }}
                initial={{ scale: 0.7, opacity: 0.7 }}
                animate={{ scale: 1.9, opacity: 0 }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                aria-hidden
              />
            )}
            <Kina mood={mood} lookAt={look} style={{ width: 148, height: 134 }} />
          </motion.div>

          {messages.length <= 1 && (
            <p
              className="text-center font-body font-bold mt-3 px-8"
              style={{ fontSize: 14, color: '#6B7F73', maxWidth: 260 }}
            >
              {hint}
            </p>
          )}
        </div>

        {/* ── Conversation ── */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-3">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="px-4 py-3"
                  style={{
                    maxWidth: '84%',
                    background: msg.type === 'user' ? '#17543C' : '#FFFFFF',
                    color: msg.type === 'user' ? '#FFFFFF' : '#10241B',
                    borderRadius: msg.type === 'user' ? '22px 22px 6px 22px' : '22px 22px 22px 6px',
                    boxShadow: msg.type === 'user' ? '0 5px 0 #0E3626' : '0 5px 0 #DDD6C8',
                  }}
                >
                  {msg.isThinking ? (
                    <div className="flex items-center gap-1.5 py-1" aria-label={t('a11y.thinking')}>
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="rounded-full"
                          style={{ width: 10, height: 10, background: '#2FBF6B' }}
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.14 }}
                        />
                      ))}
                    </div>
                  ) : (
                    <>
                      {msg.emoji && msg.type === 'keza' && (
                        <span className="block mb-1" style={{ fontSize: 26 }}>
                          {msg.emoji}
                        </span>
                      )}
                      <p className="font-body font-bold" style={{ fontSize: 15, lineHeight: 1.5 }}>
                        {msg.text}
                      </p>
                      {msg.type === 'keza' && (
                        <button
                          onClick={() => speakMessage(msg.text)}
                          className="mt-2 font-body font-black flex items-center gap-1.5"
                          style={{ fontSize: 12, color: '#2FBF6B', minHeight: 44, paddingTop: 6, paddingBottom: 6 }}
                          aria-label={t('a11y.listen')}
                        >
                          🔊 {language === 'KN' ? 'Umva' : language === 'FR' ? 'Écouter' : 'Listen'}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* ── Ask ── */}
        <div
          className="px-4 pt-3 pb-safe flex-none bg-white"
          style={{ borderTop: '3px solid #E4DDCE' }}
        >
          {showKeyboard ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowKeyboard(false)}
                aria-label={t('a11y.mic')}
                className="rounded-[18px] grid place-items-center flex-none"
                style={{ width: 56, height: 56, background: '#EFEBE1' }}
              >
                <Mic className="w-6 h-6" style={{ color: '#17543C' }} />
              </button>
              <div
                className="flex-1 flex items-center px-4 rounded-[18px]"
                style={{ background: '#EFEBE1', minHeight: 56 }}
              >
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
                  placeholder={
                    language === 'KN'
                      ? 'Andika ikibazo cyawe…'
                      : language === 'FR'
                        ? 'Écris ta question…'
                        : 'Type your question…'
                  }
                  className="flex-1 bg-transparent outline-none font-body font-bold"
                  style={{ fontSize: 15, color: '#10241B' }}
                  autoFocus
                />
                <button
                  onClick={handleTextSubmit}
                  disabled={!textInput.trim() || isThinking}
                  aria-label={t('a11y.send')}
                  className="rounded-[14px] grid place-items-center flex-none"
                  style={{
                    width: 44,
                    height: 44,
                    background: '#2FBF6B',
                    opacity: !textInput.trim() || isThinking ? 0.4 : 1,
                  }}
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setShowKeyboard(true)}
                aria-label={t('a11y.typeInstead')}
                className="rounded-[18px] grid place-items-center flex-none"
                style={{ width: 60, height: 60, background: '#EFEBE1', boxShadow: '0 5px 0 #D9D2C4' }}
              >
                <Keyboard className="w-6 h-6" style={{ color: '#17543C' }} />
              </button>

              {/* The one big thing on this screen. Sun-yellow while listening —
                  the system's audio colour, never red. Nothing here is a failure. */}
              <motion.button
                onClick={toggleListening}
                disabled={isThinking}
                aria-label={isListening ? 'Stop listening' : 'Ask a question'}
                whileTap={{ y: 6, boxShadow: `0 2px 0 ${isListening ? '#D89A00' : '#1E8C4C'}` }}
                transition={{ type: 'spring', stiffness: 900, damping: 34, mass: 0.5 }}
                className="rounded-full grid place-items-center flex-none"
                style={{
                  width: 96,
                  height: 96,
                  background: isListening ? '#FFC02E' : '#2FBF6B',
                  boxShadow: `0 8px 0 ${isListening ? '#D89A00' : '#1E8C4C'}`,
                  opacity: isThinking ? 0.5 : 1,
                }}
              >
                {isListening ? (
                  <MicOff className="w-10 h-10" style={{ color: '#10241B' }} />
                ) : (
                  <Mic className="w-10 h-10 text-white" />
                )}
              </motion.button>

              <span className="flex-none" style={{ width: 60 }} />
            </div>
          )}

          {isListening && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center font-body font-black mt-3"
              style={{ fontSize: 14, color: '#B8860B' }}
            >
              🎙️ {listeningLabel}
            </motion.p>
          )}
        </div>
      </div>
    </KidShell>
  );
}

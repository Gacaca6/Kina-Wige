import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Mic, MicOff, Keyboard, Send, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/context';
import { useSound, useHaptic } from '../hooks/useSound';
import { images } from '../assets/images';
import { findOfflineAnswer, fallbackResponses, offTopicResponses } from '../data/kezaQA';
import { askGemini } from '../services/gemini';
import type { Language } from '../i18n/translations';

interface Message {
  id: number;
  type: 'user' | 'keza';
  text: string;
  emoji?: string;
  isThinking?: boolean;
}

export default function BazaKezaScreen() {
  const navigate = useNavigate();
  const { language } = useI18n();
  const { play } = useSound();
  const haptic = useHaptic();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [hasGreeted, setHasGreeted] = useState(false);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const msgIdRef = useRef(0);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Keza's greeting on first visit
  useEffect(() => {
    if (!hasGreeted) {
      setHasGreeted(true);
      const greetings = {
        KN: 'Muraho! Ndi Keza. Ubaza iki uyu munsi?',
        EN: 'Hello! I\'m Keza. What would you like to ask today?',
        FR: 'Bonjour! Je suis Keza. Qu\'est-ce que tu veux demander aujourd\'hui?',
      };
      setTimeout(() => {
        addKezaMessage(greetings[language], '👋');
      }, 500);
    }
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

  // Process a question (offline first, then Gemini)
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

    // Step 1: Try offline database
    const offlineMatch = findOfflineAnswer(question);

    // Simulate a small delay so it feels like Keza is "thinking"
    await new Promise(r => setTimeout(r, 1000));

    if (offlineMatch) {
      // Remove thinking message, add real answer
      setMessages(prev => prev.filter(m => m.id !== thinkingId));
      addKezaMessage(offlineMatch.answer[language], offlineMatch.emoji);
      play('clean_chime');
      setIsThinking(false);
      return;
    }

    // Step 2: Try Gemini API
    const geminiResponse = await askGemini(question, language);

    setMessages(prev => prev.filter(m => m.id !== thinkingId));

    if (geminiResponse) {
      addKezaMessage(geminiResponse.text, geminiResponse.emoji);
      play('clean_chime');
    } else {
      // Step 3: Fallback — no match and no API
      addKezaMessage(offTopicResponses[language], '🤔');
      play('tap');
    }

    setIsThinking(false);
  }, [language, play, haptic]);

  // Speech recognition
  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Fallback: show keyboard input
      setShowKeyboard(true);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'KN' ? 'rw-RW' : language === 'FR' ? 'fr-FR' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      processQuestion(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
      // On error, fall back to keyboard
      setShowKeyboard(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    play('tap');
    haptic.mediumTap();
  }, [language, processQuestion, play, haptic]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="min-h-screen flex flex-col bg-gradient-to-b from-[#E8F5E9] to-[#F0FFF4]"
    >
      {/* Header */}
      <header className="flex items-center gap-4 px-4 py-3 bg-white/80 backdrop-blur-sm border-b border-primary/10 sticky top-0 z-50">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low hover:scale-105 transition-transform active:scale-95"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary shadow-sm">
            <img src={images.kezaAvatar} alt="Keza" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-headline font-bold text-primary text-lg leading-tight">Baza Keza</h1>
            <p className="text-xs text-primary/60 font-medium">
              {language === 'KN' ? 'Ndahari kukwibaza!' : language === 'FR' ? 'Je suis là pour toi!' : 'I\'m here to help!'}
            </p>
          </div>
        </div>
        <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" title="Online" />
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {/* Keza intro illustration */}
        {messages.length <= 1 && (
          <div className="flex flex-col items-center pt-8 pb-4">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-40 h-40 relative"
            >
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl scale-125" />
              <img src={images.kezaFull} alt="Keza" className="w-full h-full object-contain relative z-10" />
            </motion.div>
            <p className="text-center text-primary/50 font-medium text-sm mt-4 max-w-[200px]">
              {language === 'KN' ? 'Kanda kuri micro uvuge ikibazo cyawe!' :
               language === 'FR' ? 'Appuie sur le micro et pose ta question!' :
               'Tap the mic and ask your question!'}
            </p>
          </div>
        )}

        {/* Chat messages */}
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', damping: 20 }}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.type === 'keza' && (
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/30 mr-2 flex-shrink-0 mt-1">
                  <img src={images.kezaAvatar} alt="Keza" className="w-full h-full object-cover" />
                </div>
              )}
              <div className={`max-w-[80%] ${
                msg.type === 'user'
                  ? 'bg-primary text-white rounded-2xl rounded-tr-md'
                  : 'bg-white text-dark rounded-2xl rounded-tl-md shadow-sm border border-primary/10'
              } px-4 py-3`}>
                {msg.isThinking ? (
                  <div className="flex items-center gap-1.5 py-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2.5 h-2.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2.5 h-2.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                ) : (
                  <>
                    {msg.emoji && msg.type === 'keza' && (
                      <span className="text-2xl block mb-1">{msg.emoji}</span>
                    )}
                    <p className="text-[15px] leading-relaxed font-medium">{msg.text}</p>
                    {msg.type === 'keza' && !msg.isThinking && (
                      <button
                        onClick={() => speakMessage(msg.text)}
                        className="mt-2 text-xs text-primary/50 hover:text-primary flex items-center gap-1 transition-colors"
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

      {/* Input area */}
      <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm border-t border-primary/10 px-4 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        {showKeyboard ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKeyboard(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low text-primary"
            >
              <Mic className="w-5 h-5" />
            </button>
            <div className="flex-1 flex items-center bg-surface-container-low rounded-full px-4">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
                placeholder={language === 'KN' ? 'Andika ikibazo cyawe...' : language === 'FR' ? 'Écris ta question...' : 'Type your question...'}
                className="flex-1 bg-transparent py-3 text-dark placeholder-dark/40 outline-none text-sm font-medium"
                autoFocus
              />
              <button
                onClick={handleTextSubmit}
                disabled={!textInput.trim() || isThinking}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-primary text-white disabled:opacity-40 active:scale-90 transition-transform"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setShowKeyboard(true)}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-container-low text-primary hover:scale-105 transition-transform active:scale-95"
            >
              <Keyboard className="w-5 h-5" />
            </button>

            {/* Main mic button */}
            <motion.button
              onTouchStart={startListening}
              onTouchEnd={stopListening}
              onMouseDown={startListening}
              onMouseUp={stopListening}
              disabled={isThinking}
              whileTap={{ scale: 0.9 }}
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${
                isListening
                  ? 'bg-red-500 shadow-red-500/30 scale-110'
                  : isThinking
                    ? 'bg-primary/50 cursor-not-allowed'
                    : 'bg-primary shadow-primary/30 hover:shadow-primary/50'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-8 h-8 text-white" />
                  {/* Pulse ring */}
                  <div className="absolute w-20 h-20 rounded-full border-4 border-red-400 animate-ping opacity-30" />
                </>
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </motion.button>

            <div className="w-12" /> {/* Spacer for visual balance */}
          </div>
        )}

        {isListening && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-red-500 font-bold text-sm mt-3 animate-pulse"
          >
            {language === 'KN' ? '🎙️ Ndategera... Vuga!' : language === 'FR' ? '🎙️ J\'écoute... Parle!' : '🎙️ Listening... Speak!'}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

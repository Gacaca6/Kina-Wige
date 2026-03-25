import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import FloatingKeza from './components/ui/FloatingKeza';

const SplashScreen = lazy(() => import('./screens/SplashScreen'));
const HomeScreen = lazy(() => import('./screens/HomeScreen'));
const EpisodeScreen = lazy(() => import('./screens/EpisodeScreen'));
const GameScreen = lazy(() => import('./screens/GameScreen'));
const ParentScreen = lazy(() => import('./screens/ParentScreen'));
const EpisodeListScreen = lazy(() => import('./screens/EpisodeListScreen'));
const GamesScreen = lazy(() => import('./screens/GamesScreen'));
const BazaKezaScreen = lazy(() => import('./screens/BazaKezaScreen'));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-on-surface font-body font-medium selection:bg-primary/20">
        <Suspense fallback={<LoadingFallback />}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<SplashScreen />} />
              <Route path="/home" element={<HomeScreen />} />
              <Route path="/episode/:id" element={<EpisodeScreen />} />
              <Route path="/game/:id" element={<GameScreen />} />
              <Route path="/parents" element={<ParentScreen />} />
              <Route path="/episodes" element={<EpisodeListScreen />} />
              <Route path="/games" element={<GamesScreen />} />
              <Route path="/baza-keza" element={<BazaKezaScreen />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
          <FloatingKeza />
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

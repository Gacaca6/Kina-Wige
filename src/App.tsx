import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import FloatingKeza from './components/ui/FloatingKeza';
import ParentGate from './components/ui/ParentGate';

const SplashScreen = lazy(() => import('./screens/SplashScreen'));
const HomeScreen = lazy(() => import('./screens/HomeScreen'));
const EpisodeScreen = lazy(() => import('./screens/EpisodeScreen'));
const GameScreen = lazy(() => import('./screens/GameScreen'));
const ParentScreen = lazy(() => import('./screens/ParentScreen'));
const EpisodeListScreen = lazy(() => import('./screens/EpisodeListScreen'));
const GamesScreen = lazy(() => import('./screens/GamesScreen'));
const BazaKezaScreen = lazy(() => import('./screens/BazaKezaScreen'));
const ComicsScreen = lazy(() => import('./screens/ComicsScreen'));
const ComicReader = lazy(() => import('./screens/ComicReader'));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// Routes must be keyed by location for AnimatePresence exit animations to run.
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <React.Fragment key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/episode/:id" element={<EpisodeScreen />} />
          <Route path="/game/:id" element={<GameScreen />} />
          <Route path="/parents" element={<ParentGate><ParentScreen /></ParentGate>} />
          <Route path="/episodes" element={<EpisodeListScreen />} />
          <Route path="/games" element={<GamesScreen />} />
          <Route path="/comics" element={<ComicsScreen />} />
          <Route path="/comic/:id" element={<ComicReader />} />
          <Route path="/baza-keza" element={<BazaKezaScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </React.Fragment>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-on-surface font-body font-medium selection:bg-primary/20">
        <Suspense fallback={<LoadingFallback />}>
          <AnimatedRoutes />
          <FloatingKeza />
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

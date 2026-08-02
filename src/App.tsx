import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import ParentGate from './components/ui/ParentGate';

const SplashScreen = lazy(() => import('./screens/SplashScreen'));
const EpisodeScreen = lazy(() => import('./screens/EpisodeScreen'));
const GameScreen = lazy(() => import('./screens/GameScreen'));
const ParentScreen = lazy(() => import('./screens/ParentScreen'));
const EpisodeListScreen = lazy(() => import('./screens/EpisodeListScreen'));
const GamesScreen = lazy(() => import('./screens/GamesScreen'));
const BazaKezaScreen = lazy(() => import('./screens/BazaKezaScreen'));
const ComicsScreen = lazy(() => import('./screens/ComicsScreen'));
const ComicReader = lazy(() => import('./screens/ComicReader'));
const SettingsScreen = lazy(() => import('./screens/SettingsScreen'));
const HomePathScreen = lazy(() => import('./screens/HomePathScreen'));
const PlanScreen = lazy(() => import('./screens/PlanScreen'));
const LessonScreen = lazy(() => import('./screens/LessonScreen'));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-sand flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-grass border-t-transparent rounded-full animate-spin" />
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
          {/* Legacy home is gone — the path IS the home. */}
          <Route path="/home" element={<Navigate to="/home-path" replace />} />
          <Route path="/episode/:id" element={<EpisodeScreen />} />
          <Route path="/game/:id" element={<GameScreen />} />
          <Route path="/parents" element={<ParentGate><ParentScreen /></ParentGate>} />
          <Route path="/episodes" element={<EpisodeListScreen />} />
          <Route path="/games" element={<GamesScreen />} />
          <Route path="/comics" element={<ComicsScreen />} />
          <Route path="/comic/:id" element={<ComicReader />} />
          <Route path="/baza-keza" element={<BazaKezaScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/home-path" element={<HomePathScreen />} />
          <Route path="/lesson/:id" element={<LessonScreen />} />
          <Route path="/lesson" element={<LessonScreen />} />
          {/* Costs money -> must sit behind the parent gate. */}
          <Route path="/plan" element={<ParentGate><PlanScreen /></ParentGate>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </React.Fragment>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-sand text-ink font-body">
        <Suspense fallback={<LoadingFallback />}>
          <AnimatedRoutes />
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

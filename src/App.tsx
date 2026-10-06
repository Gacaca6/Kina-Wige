import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import ParentGate, { relockParentArea } from './components/ui/ParentGate';
import AskKeza from './components/ui/AskKeza';
import SessionGuard from './components/ui/SessionGuard';
import { isGrownUpPath } from './components/ui/lanes';
import { useFamily } from './hooks/useFamily';
import NativeBackButton from './native/BackButton';
import { applyDefaultSystemBars } from './native/systemBars';

const OnboardingScreen = lazy(() => import('./screens/OnboardingScreen'));
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
const LessonScreen = lazy(() => import('./screens/LessonScreen'));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-sand flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-grass border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// The front door. A family that has been set up goes straight into the
// child's world on every launch — the child never sees a fork with a grown-up
// door in it. Anyone else is set up first.
function Root() {
  const { onboarded } = useFamily();
  return <Navigate to={onboarded ? '/home-path' : '/welcome'} replace />;
}

// Routes must be keyed by location for AnimatePresence exit animations to run.
function AnimatedRoutes() {
  const location = useLocation();
  const { onboarded } = useFamily();

  // Leaving the grown-up area locks it again. A parent who unlocks it and
  // hands the phone back has not handed over the key.
  useEffect(() => {
    if (!isGrownUpPath(location.pathname)) relockParentArea();
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <React.Fragment key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Root />} />
          {/* Setup is open to anyone only until it has been done once. After
              that it changes the play time and the child's details, so it is a
              grown-up screen like any other. */}
          <Route
            path="/welcome"
            element={onboarded ? <ParentGate><OnboardingScreen /></ParentGate> : <OnboardingScreen />}
          />
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
          {/* Settings belong to grown-ups; the child changes language in the header. */}
          <Route path="/settings" element={<ParentGate><SettingsScreen /></ParentGate>} />
          <Route path="/home-path" element={<HomePathScreen />} />
          <Route path="/lesson/:id" element={<LessonScreen />} />
          <Route path="/lesson" element={<LessonScreen />} />
          {/* /plan is withdrawn until a real payment route exists. It advertised
              content and features the app does not have, and sold a
              subscription outside Play billing — both grounds for rejection.
              PlanScreen.tsx is kept for when Mobile Money is live. */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </React.Fragment>
    </AnimatePresence>
  );
}

applyDefaultSystemBars();

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-sand text-ink font-body">
        <Suspense fallback={<LoadingFallback />}>
          <AnimatedRoutes />
          {/* Child-lane only; hides itself in the grown-up area. */}
          <AskKeza />
          {/* Ends a session when the grown-up's chosen play time is used. */}
          <SessionGuard />
          {/* Android app only: hardware back never kills the app. */}
          <NativeBackButton />
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

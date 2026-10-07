// The Android hardware / gesture back button.
//
// Without this, Capacitor's default walks back through the web history and,
// when there is none left, closes the app. For a child that means a stray back
// swipe on the home screen kills the app and the next launch starts cold.
//
// Rules:
//   • Something open on top of the screen (fullscreen video) closes first.
//     Components claim back with useBackHandler() while they are open.
//   • On the child's home, or anywhere with no history to go back to, the app
//     is sent to the background — never killed. Coming back finds it as left.
//   • Everywhere else, back goes back one screen, exactly like the on-screen
//     back buttons do.
//
// Renders nothing. Does nothing on the website.

import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { App as CapApp } from '@capacitor/app';
import { isNative } from './platform';

const HOME = '/home-path';

/** Newest last. A handler returns true when it dealt with the press. */
const handlers: (() => boolean)[] = [];

/** While `active`, a back press calls `onBack` instead of navigating. */
export function useBackHandler(active: boolean, onBack: () => void) {
  const latest = useRef(onBack);
  latest.current = onBack;
  useEffect(() => {
    if (!active) return;
    const h = () => {
      latest.current();
      return true;
    };
    handlers.push(h);
    return () => {
      const i = handlers.lastIndexOf(h);
      if (i >= 0) handlers.splice(i, 1);
    };
  }, [active]);
}

export default function NativeBackButton() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const path = useRef(pathname);
  path.current = pathname;

  useEffect(() => {
    if (!isNative) return;
    const handle = CapApp.addListener('backButton', ({ canGoBack }) => {
      for (let i = handlers.length - 1; i >= 0; i--) {
        if (handlers[i]()) return;
      }
      if (path.current === HOME || !canGoBack) {
        CapApp.minimizeApp().catch(() => {});
        return;
      }
      navigate(-1);
    });
    return () => {
      handle.then((h) => h.remove()).catch(() => {});
    };
  }, [navigate]);

  return null;
}

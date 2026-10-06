// The Android hardware / gesture back button.
//
// Without this, Capacitor's default walks back through the web history and,
// when there is none left, closes the app. For a child that means a stray back
// swipe on the home screen kills the app and the next launch starts cold.
//
// Rules:
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

export default function NativeBackButton() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const path = useRef(pathname);
  path.current = pathname;

  useEffect(() => {
    if (!isNative) return;
    const handle = CapApp.addListener('backButton', ({ canGoBack }) => {
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

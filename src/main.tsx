import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Self-hosted fonts — bundled locally so text renders correctly offline on the
// very first launch (no dependency on fonts.googleapis.com).
import '@fontsource/baloo-2/500.css';
import '@fontsource/baloo-2/600.css';
import '@fontsource/baloo-2/700.css';
import '@fontsource/baloo-2/800.css';
import '@fontsource/nunito/900.css';
import '@fontsource/fredoka/400.css';
import '@fontsource/fredoka/500.css';
import '@fontsource/fredoka/600.css';
import '@fontsource/fredoka/700.css';
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/800.css';
import App from './App.tsx';
import './index.css';
import { I18nProvider } from './i18n/context';
import { prefetchVideos } from './pwa/prefetchVideos';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>,
);

// The service worker itself is registered automatically by vite-plugin-pwa.
// Here we only warm the video cache so episodes play offline.
if (document.readyState === 'complete') {
  prefetchVideos();
} else {
  window.addEventListener('load', () => prefetchVideos(), { once: true });
}

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon-32x32.png', 'favicon-16x16.png', 'apple-touch-icon.png', 'splash-logo.jpeg'],
      manifest: {
        id: '/',
        name: 'Kina Wige',
        short_name: 'Kina Wige',
        description: "Play and Learn — Rwanda's early childhood platform",
        lang: 'rw',
        dir: 'ltr',
        theme_color: '#17543C',
        background_color: '#17543C',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icon-72x72.png', sizes: '72x72', type: 'image/png' },
          { src: '/icon-96x96.png', sizes: '96x96', type: 'image/png' },
          { src: '/icon-128x128.png', sizes: '128x128', type: 'image/png' },
          { src: '/icon-144x144.png', sizes: '144x144', type: 'image/png' },
          { src: '/icon-152x152.png', sizes: '152x152', type: 'image/png' },
          { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icon-384x384.png', sizes: '384x384', type: 'image/png' },
          { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/maskable-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // An installed PWA must pick up a new deploy on next launch:
        // skipWaiting activates the new SW immediately and clientsClaim
        // hands over open pages, so users are never stuck on an old build.
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,webp,svg,woff2}'],
        runtimeCaching: [
          {
            // Episode videos: served from cache with range-request support so
            // seeking works. The cache itself is filled by prefetchVideos()
            // (full 200 responses) — partial 206 responses are never cached.
            urlPattern: /\/videos\/.*\.mp4$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'kina-wige-videos',
              rangeRequests: true,
              cacheableResponse: {
                statuses: [0, 200],
              },
              expiration: {
                maxEntries: 40,
              },
            },
          },
          // Fonts are self-hosted (@fontsource) and precached — no external
          // font requests, so no runtime font caching is needed.
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
  },
});

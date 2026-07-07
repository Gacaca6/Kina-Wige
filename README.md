<div align="center">

# 🎮 Kina-Wige

**A playful game that teaches young children in Kinyarwanda.**

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)

</div>

## About

*Kina-Wige* means *"play and learn"* — and that's exactly what it does. It's an interactive learning game for young children, taught entirely in **Kinyarwanda**, so kids can learn in their mother tongue from their very first lessons.

Learning is joyful, local, and accessible — no English required. And it's **fully offline**: no accounts, no API keys, no tracking — parents always know exactly what their child is watching and playing.

## ✨ Features

- 🗣️ **Mother-tongue first** — everything in Kinyarwanda (English and French included)
- 📺 **Episodes** — locally stored teaching videos, playable offline
- 🧠 **Brain games** — handwashing steps, memory match, counting, patterns, healthy-food sorting
- 💬 **Baza Keza** — an offline question-and-answer buddy powered by a curated, parent-reviewable database (`src/data/kezaQA.ts`)
- 👨‍👩‍👧 **Parent zone** — what the child learned, home activities, weekly tracker
- 🧒 **Built for children** — simple, colorful, age-appropriate design
- 🌍 **Locally rooted** — culturally relevant content for Rwandan kids
- 📱 **Works on any device** — installable PWA, mobile-first and lightweight

## 🛠️ Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Routing:** React Router
- **Styling:** Tailwind CSS
- **Offline:** vite-plugin-pwa (Workbox service worker + video cache)

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/Gacaca6/Kina-Wige.git
cd Kina-Wige

# Install dependencies
npm install

# Start the dev server
npm run dev
```

```bash
npm run build     # Production build
npm run preview   # Preview the production build
npm run lint      # Typecheck the codebase
```

## 📺 Adding a new episode video

1. Copy the MP4 into `public/videos/` (H.264, keep files small — target < 5 MB)
2. Add a thumbnail image under `src/assets/` and export it in `src/assets/images.ts`
3. Add an entry in `src/data/episodes.ts`

The episode appears on Home and in the episode list, gets its own route, and is prefetched into the offline cache automatically.

**Only use videos you have the right to distribute.** Good sources of openly licensed teaching videos for ages 3–6:

- [Ubongo Toolkits](https://toolkits.ubongo.org) — Akili and Me and Ubongo Kids material, available in Kinyarwanda, free for non-commercial use under CC BY-NC-ND (register, download, attribute Ubongo)
- [Sesame Workshop — Watch, Play, Learn](https://sesameworkshop.org/our-work/what-we-do/support-for-families-affected-by-crisis/watch-play-learn/) — 140 early-learning videos offered to organizations serving children

## 🎲 Adding a new game

1. Create the component in `src/screens/games/`
2. Register it in `src/data/games.ts` (title/skill in all three languages)
3. Map its id in `src/screens/GameScreen.tsx`

## 📴 Offline behaviour

- The app shell, images, and fonts are precached by the service worker on install
- Episode videos are downloaded in the background on first online launch (`src/pwa/prefetchVideos.ts`) and then served from the cache with range-request support, so playback and seeking work with no network
- All game logic, quiz content, and Baza Keza answers are bundled — nothing requires a connection

## 🌐 Deployment note

This is a single-page app using BrowserRouter: configure your host to rewrite all paths to `index.html` (e.g. Netlify `_redirects`: `/* /index.html 200`).

## 🗺️ Status

In active development. Contributions and ideas are welcome.

## 👤 Author

**GACACA Godwin** — building AI-powered products for African impact.
📫 mikelgodwin1234@gmail.com

---

<div align="center"><i>Kina, wige — play and learn. 🌟</i></div>

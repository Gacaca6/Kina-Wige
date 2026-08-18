// Single place for the handful of real-world values the site points at.
//
// ⚠️ APP_URL is a PLACEHOLDER. The app is deployed on Vercel but its production
// URL was never recorded in this repo, and inventing one would ship a broken
// button. Replace it with the real address before launch — it is the single
// most important link on the site.
//
// Note the consequence of the site and the app being different origins: this
// page CANNOT install the PWA itself. A browser only offers to install an app
// from the app's own origin. So "Install" links to the app, which then shows
// its own install prompt. Putting the site at kinawige.rw and the app at
// kinawige.rw/app would remove that hop entirely — worth doing.
export const APP_URL = 'https://kina-wige.vercel.app';

export const CONTACT_EMAIL = 'mikelgodwin1234@gmail.com';

// Store listings do not exist yet. Keep these null and the badges stay dormant;
// set them and the badges become real links automatically.
export const STORE_LINKS: { apple: string | null; google: string | null } = {
  apple: null,
  google: null,
};

export const SITE_ORIGIN = 'https://kinawige.rw';

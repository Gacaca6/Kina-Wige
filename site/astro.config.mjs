import { defineConfig } from 'astro/config';

// Astro ships ZERO JavaScript by default. For a page whose whole argument is
// "this works on a cheap phone with almost no data", that is not a technical
// preference — it is the argument, made in the artefact.
export default defineConfig({
  site: 'https://kinawige.rw',
  build: { inlineStylesheets: 'always' },
  compressHTML: true,
});

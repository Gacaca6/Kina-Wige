// One-off: convert src/assets PNGs to resized WebP (ROADMAP task 1).
// Usage: node scripts/optimize-images.mjs
import sharp from 'sharp';
import { readdirSync, statSync, unlinkSync } from 'fs';
import { join, extname, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const assetsDir = join(root, 'src', 'assets');

// Small in-UI images get 256px, large artwork 800px
const SMALL = ['keza-avatar', 'hirwa-avatar', 'mama'];

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (extname(p).toLowerCase() === '.png') yield p;
  }
}

let before = 0, after = 0;
for (const file of walk(assetsDir)) {
  const name = basename(file, '.png');
  const width = SMALL.includes(name) ? 256 : 800;
  const out = file.replace(/\.png$/i, '.webp');
  const origSize = statSync(file).size;
  await sharp(file)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(out);
  const newSize = statSync(out).size;
  before += origSize; after += newSize;
  unlinkSync(file);
  console.log(`${name}: ${(origSize / 1024).toFixed(0)}KB -> ${(newSize / 1024).toFixed(0)}KB`);
}
console.log(`TOTAL: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`);

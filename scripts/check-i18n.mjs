// The translation gate.
//
// The rule, from the owner: "all screens, without leaving a word, must change
// into another language." That is easy to satisfy once and impossible to keep
// by hand — every new screen is one hurried `<h2>Settings</h2>` away from a
// half-translated app, and nobody notices until someone switches to Français.
//
// So it is checked. Two things:
//
//   1. KEY PARITY — KN, EN and FR must define exactly the same keys. A key that
//      exists in one language is a blank space in the other two.
//   2. NO HARDCODED USER-FACING TEXT — JSX text nodes and aria-label /
//      placeholder / title attributes must come from t(), not from a literal.
//
// Run:  npm run i18n:check   (also runs as part of npm run build)
//
// If a literal is genuinely language-neutral — a brand name, a number, an
// emoji — add it to ALLOWED below with a reason. That list is meant to stay
// short; if it is growing, the app is drifting.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, 'src');

const tty = process.stdout.isTTY && !process.env.NO_COLOR;
const red = (s) => (tty ? `\x1b[31m${s}\x1b[0m` : s);
const green = (s) => (tty ? `\x1b[32m${s}\x1b[0m` : s);
const dim = (s) => (tty ? `\x1b[2m${s}\x1b[0m` : s);

/** Literals that carry no language. Keep this short and justified. */
const ALLOWED = new Set([
  // Product and feature names. "Baza Keza" is the assistant's name, not a
  // phrase to translate — the same way "Kina Wige" is not "Play and Learn".
  'Kina Wige', 'Wige', 'Kina Challenge', 'KINA CHALLENGE', 'Baza Keza',
  // Characters. A person's name does not change with the interface language.
  'Kina', 'Keza', 'Hirwa', 'Ngabo',
  // Organisations we credit, verbatim as they write themselves.
  'Ubongo', 'Book Dash',
  // Language names are always written in their OWN language, by convention.
  'Ikinyarwanda', 'English', 'Français',
  // Currency, networks, initialisms.
  'RWF', 'MTN', 'Airtel', 'Mobile Money', 'PWA', 'KN', 'EN', 'FR',
]);

const errors = [];

// ── 1 · key parity ──────────────────────────────────────────────────────────
const tsrc = fs.readFileSync(path.join(SRC, 'i18n/translations.ts'), 'utf8');
const blocks = tsrc.split(/\n {2}(KN|EN|FR): \{/).slice(1);
const keys = {};
for (let i = 0; i < blocks.length; i += 2) {
  keys[blocks[i]] = new Set([...blocks[i + 1].matchAll(/^\s*'([^']+)':/gm)].map((m) => m[1]));
}
for (const lang of ['EN', 'FR']) {
  for (const k of keys.KN) {
    if (!keys[lang].has(k)) errors.push({ where: `translations.ts`, msg: `${lang} is missing key '${k}'` });
  }
  for (const k of keys[lang]) {
    if (!keys.KN.has(k)) errors.push({ where: `translations.ts`, msg: `KN is missing key '${k}' (defined in ${lang})` });
  }
}

// ── 2 · hardcoded user-facing text ──────────────────────────────────────────

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : p.endsWith('.tsx') ? [p] : [];
  });
}

/** Strip comments and string-ish noise that is never rendered. */
function stripComments(src) {
  return src
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '')   // {/* jsx comment */}
    .replace(/\/\*[\s\S]*?\*\//g, '')             // /* block */
    .replace(/^\s*\/\/.*$/gm, '');                // // line
}

const looksLikeProse = (s) => /[A-Za-zÀ-ÿ]{2,}/.test(s) && !/^[A-Z_]+$/.test(s);

for (const file of walk(SRC)) {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  const src = stripComments(fs.readFileSync(file, 'utf8'));
  const lines = src.split('\n');

  lines.forEach((line, i) => {
    const at = `${rel}:${i + 1}`;

    // user-facing attributes with a literal value
    // Both the DOM attribute (aria-label=) and the React prop spelling
    // (ariaLabel=), plus prop names our own components use for visible text.
    // The prop form slipped through once and shipped an English aria-label
    // into an otherwise fully French lesson screen.
    for (const m of line.matchAll(/\b(aria-label|ariaLabel|placeholder|title|alt|hint|label)="([^"]+)"/g)) {
      const val = m[2].trim();
      if (looksLikeProse(val) && !ALLOWED.has(val)) {
        errors.push({ where: at, msg: `hardcoded ${m[1]}="${val}" — use t()` });
      }
    }

    // JSX text nodes: >Some words<
    for (const m of line.matchAll(/>([^<>{}\n]{2,})</g)) {
      const val = m[1].trim();
      if (!val || !looksLikeProse(val) || ALLOWED.has(val)) continue;
      // ignore things that are obviously code or punctuation-only
      if (/^[\d\s.,:;·—–\-+×/%()]+$/.test(val)) continue;
      errors.push({ where: at, msg: `hardcoded text "${val}" — use t()` });
    }
  });

  // JSX text nodes that sit on their OWN line:
  //     >
  //       GROWN-UPS
  //     </span>
  // The single-line pattern above cannot see these, and one shipped an English
  // word into an otherwise fully translated screen.
  for (const m of src.matchAll(/>\s*\n\s*([^<>{}\n]{2,}?)\s*\n\s*<\//g)) {
    const val = m[1].trim();
    if (!val || !looksLikeProse(val) || ALLOWED.has(val)) continue;
    if (/^[\d\s.,:;·—–\-+×/%()]+$/.test(val)) continue;
    const lineNo = src.slice(0, m.index).split('\n').length + 1;
    errors.push({ where: `${rel}:${lineNo}`, msg: `hardcoded text "${val}" — use t()` });
  }
}

// ── verdict ─────────────────────────────────────────────────────────────────
console.log(`\nKina Wige · translations\n`);
console.log(`  ${keys.KN.size} keys × 3 languages`);

if (errors.length) {
  console.log(`\n  ${red(`✗ ${errors.length} untranslated string${errors.length === 1 ? '' : 's'}`)}\n`);
  for (const e of errors) console.log(`    ${red('✗')} ${e.where}  ${e.msg}`);
  console.log(`\n  ${dim('Every screen must change language completely — no word left behind.')}\n`);
  process.exit(1);
}

console.log(`\n  ${green('✓ no hardcoded user-facing text; all three languages in sync')}\n`);

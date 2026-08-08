// Regression test for the four assessment bands.
//
// This is the one piece of logic in the app that makes a claim ABOUT A CHILD to
// their parent. If it drifts, nothing crashes and no screen looks wrong — a
// parent is simply told something untrue about their own child. That failure is
// silent, which is exactly why it gets a test.
//
// The rules under test (docs/CURRICULUM-ARCHITECTURE.md §13–§14):
//   • mastery = 4 of 5 correct ACROSS TWO DIFFERENT SESSIONS
//   • "a single lucky tap is not evidence" — and neither is a single lucky run
//   • ⭐ Applying means the skill showed up somewhere it was not taught
//
// Run:  npm run assessment:check   (also runs as part of npm run build)

import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const server = await createServer({
  configFile: false,
  root,
  logLevel: 'silent',
  server: { middlewareMode: true },
  appType: 'custom',
});

const { bandFor } = await server.ssrLoadModule('/src/hooks/useSkillEvidence.ts');

const tty = process.stdout.isTTY && !process.env.NO_COLOR;
const green = (s) => (tty ? `\x1b[32m${s}\x1b[0m` : s);
const red = (s) => (tty ? `\x1b[31m${s}\x1b[0m` : s);
const dim = (s) => (tty ? `\x1b[2m${s}\x1b[0m` : s);

/** one attempt */
const at = (correct, session, source = 'lesson:u3l1') => ({ correct, session, source, at: Date.now() });

const cases = [
  ['never attempted stays unreported', undefined, null],
  ['an attempt, not yet right', [at(false, 's1')], 'emerging'],
  ['right sometimes, with support', [at(true, 's1'), at(false, 's1')], 'developing'],
  [
    'PERFECT run in ONE sitting is NOT mastery',
    [at(true, 's1'), at(true, 's1'), at(true, 's1'), at(true, 's1'), at(true, 's1')],
    'developing',
  ],
  [
    '4 of 5 spread over two sittings IS mastery',
    [at(true, 's1'), at(true, 's1'), at(false, 's2'), at(true, 's2'), at(true, 's2')],
    'demonstrated',
  ],
  [
    'mastered, and used somewhere it was not taught',
    [at(true, 's1', 'lesson:u3l1'), at(true, 's1', 'lesson:u3l1'), at(true, 's2', 'game:karaba'), at(true, 's2', 'game:karaba'), at(true, 's2', 'game:karaba')],
    'applying',
  ],
  [
    'early struggles fall out of the 5-attempt window',
    [at(false, 's0'), at(false, 's0'), at(true, 's1'), at(true, 's1'), at(true, 's2'), at(true, 's2'), at(true, 's2')],
    'demonstrated',
  ],
  [
    'a child who regresses is reported honestly, not held at their best',
    [at(true, 's1'), at(true, 's1'), at(false, 's3'), at(false, 's3'), at(false, 's3')],
    'developing',
  ],
];

let failed = 0;
console.log('\nKina Wige · assessment bands\n');
for (const [name, attempts, expected] of cases) {
  const got = bandFor(attempts);
  const ok = got === expected;
  if (!ok) failed++;
  console.log(`  ${ok ? green('✓') : red('✗')} ${name}`);
  if (!ok) console.log(`      ${red(`expected ${expected}, got ${got}`)}`);
}

await server.close();

if (failed) {
  console.log(`\n  ${red(`✗ ${failed} band rule${failed === 1 ? '' : 's'} broken`)}\n`);
  process.exit(1);
}
console.log(`\n  ${green('✓ the bands report only what the evidence supports')}\n  ${dim('docs/CURRICULUM-ARCHITECTURE.md §13–§14')}\n`);

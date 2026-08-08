// The build gate for the curriculum contract.
//
//   "If we cannot say what a piece of content teaches, it does not enter
//    Kina Wige. That rule is enforced by the build, not by goodwill."
//                                    — docs/CURRICULUM-ARCHITECTURE.md §17
//
// The type system already stops the obvious mistakes: an unknown skill id or an
// empty `skills: []` will not compile. This script catches what types cannot —
// prerequisite cycles, a level that outranks its own prerequisites, declared
// domains that do not match the skills actually taught, a lesson missing its
// Connect step, and the coverage question: which skills does nothing teach?
//
// Run:  npm run curriculum:check          (also runs as part of npm run build)
//
// It loads the REAL registries through Vite, so it checks what ships — not a
// duplicated copy of the data that could quietly drift out of sync.

import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const errors = [];
const warnings = [];
const fail = (where, msg) => errors.push({ where, msg });
const warn = (where, msg) => warnings.push({ where, msg });

// Terminal colour, disabled when piped or when NO_COLOR is set.
const tty = process.stdout.isTTY && !process.env.NO_COLOR;
const c = {
  red: (s) => (tty ? `\x1b[31m${s}\x1b[0m` : s),
  green: (s) => (tty ? `\x1b[32m${s}\x1b[0m` : s),
  yellow: (s) => (tty ? `\x1b[33m${s}\x1b[0m` : s),
  dim: (s) => (tty ? `\x1b[2m${s}\x1b[0m` : s),
  bold: (s) => (tty ? `\x1b[1m${s}\x1b[0m` : s),
};

// Which id prefixes are allowed in which domain (Architecture §8.1).
const PREFIX_DOMAIN = {
  snd: 'D1', wrd: 'D1',
  num: 'D2',
  wld: 'D3',
  phy: 'D4',
  self: 'D5', soc: 'D5',
  art: 'D6',
};

const server = await createServer({
  configFile: false,
  root,
  logLevel: 'silent',
  server: { middlewareMode: true },
  appType: 'custom',
});

let curriculum, episodesMod, gamesMod, comicsMod, lessonsMod;
try {
  [curriculum, episodesMod, gamesMod, comicsMod, lessonsMod] = await Promise.all([
    server.ssrLoadModule('/src/data/curriculum.ts'),
    server.ssrLoadModule('/src/data/episodes.ts'),
    server.ssrLoadModule('/src/data/games.ts'),
    server.ssrLoadModule('/src/data/comics.ts'),
    server.ssrLoadModule('/src/data/lessons.ts'),
  ]);
} catch (err) {
  await server.close();
  console.error(c.red('\n✗ curriculum check could not load the content registries\n'));
  console.error(err);
  process.exit(1);
}

const {
  SKILLS, SKILL_IDS, DOMAINS, LEVEL_ORDER, THEMES, PARENT_WORDING,
  domainsOf, maxLevelOf, SESSION_CAP_MINUTES,
} = curriculum;

const THEME_IDS = new Set(THEMES.map((t) => t.id));

// ─── A · Taxonomy integrity ─────────────────────────────────────────────────

for (const id of SKILL_IDS) {
  const skill = SKILLS[id];
  const where = `skill ${id}`;

  if (!skill.statement?.trim()) fail(where, 'has no statement — a skill must be observable');
  if (!skill.evidence?.trim()) fail(where, 'has no evidence statement — nothing to assess against');

  const prefix = id.split('.')[0];
  const expected = PREFIX_DOMAIN[prefix];
  if (!expected) {
    fail(where, `id prefix "${prefix}" is not a known domain prefix`);
  } else if (expected !== skill.domain) {
    fail(where, `prefix "${prefix}" implies ${expected} but the skill declares ${skill.domain}`);
  }

  for (const need of skill.needs) {
    if (!SKILLS[need]) {
      fail(where, `prerequisite "${need}" does not exist`);
      continue;
    }
    if (LEVEL_ORDER[SKILLS[need].level] > LEVEL_ORDER[skill.level]) {
      fail(where, `prerequisite ${need} is ${SKILLS[need].level} but this skill is ${skill.level} — a child would need the harder skill first`);
    }
  }
}

// Prerequisite cycles. A cycle means a skill can never unlock — silently, forever.
{
  const state = new Map(); // 0 = visiting, 1 = done
  const walk = (id, trail) => {
    if (state.get(id) === 1) return;
    if (state.get(id) === 0) {
      fail('taxonomy', `prerequisite cycle: ${[...trail, id].join(' → ')}`);
      return;
    }
    state.set(id, 0);
    for (const need of SKILLS[id]?.needs ?? []) walk(need, [...trail, id]);
    state.set(id, 1);
  };
  for (const id of SKILL_IDS) walk(id, []);
}

// ─── B · The content contract ───────────────────────────────────────────────

const seenContentIds = new Set();

/** @param {string} kind @param {{id:string,curriculum:any}[]} items */
function checkContent(kind, items, { requiresConnect = false } = {}) {
  for (const item of items) {
    const where = `${kind} "${item.id}"`;

    const key = `${kind}:${item.id}`;
    if (seenContentIds.has(key)) fail(where, 'duplicate id in its registry');
    seenContentIds.add(key);

    const meta = item.curriculum;
    if (!meta) {
      fail(where, 'has no `curriculum` block — it does not say what it teaches');
      continue;
    }

    // 1 · Skills exist and are not empty.
    if (!Array.isArray(meta.skills) || meta.skills.length === 0) {
      fail(where, 'declares no skills');
      continue;
    }
    const unknown = meta.skills.filter((s) => !SKILLS[s]);
    if (unknown.length) fail(where, `unknown skill id(s): ${unknown.join(', ')}`);

    const known = meta.skills.filter((s) => SKILLS[s]);
    if (!known.length) continue;

    if (new Set(meta.skills).size !== meta.skills.length) {
      warn(where, 'lists the same skill twice');
    }
    for (const s of known) {
      if (SKILLS[s].deprecated) fail(where, `references deprecated skill "${s}"`);
    }

    // 2 · Declared domains must match the skills actually taught. This is the
    //     auditing assertion from Architecture §17 — it catches a content item
    //     drifting away from what its author believed it covered.
    const derived = domainsOf(known);
    const declared = [...(meta.domains ?? [])].sort();
    if (declared.join(',') !== derived.join(',')) {
      fail(where, `declares domains [${declared.join(', ') || '—'}] but its skills are in [${derived.join(', ')}]`);
    }

    // 3 · Level must not be below the hardest skill it teaches.
    const needed = maxLevelOf(known);
    if (!LEVEL_ORDER[meta.level]) {
      fail(where, `invalid level "${meta.level}"`);
    } else if (LEVEL_ORDER[meta.level] < LEVEL_ORDER[needed]) {
      fail(where, `is marked ${meta.level} but teaches ${needed} skills`);
    }

    // 4 · Theme.
    if (!THEME_IDS.has(meta.theme)) fail(where, `unknown theme "${meta.theme}"`);

    // 5 · Session cap (Architecture §16).
    if (typeof meta.minutes !== 'number' || meta.minutes <= 0) {
      fail(where, 'must declare positive `minutes`');
    } else if (meta.minutes > SESSION_CAP_MINUTES) {
      fail(where, `is ${meta.minutes} min, over the ${SESSION_CAP_MINUTES}-min session cap`);
    } else if (meta.minutes > SESSION_CAP_MINUTES * 0.75) {
      warn(where, `${meta.minutes} min consumes most of a ${SESSION_CAP_MINUTES}-min session on its own`);
    }

    // 6 · Steps 6 and 7 of the lesson loop — "not optional … and the two most
    //     commonly skipped under deadline pressure" (Architecture §11).
    for (const [field, label] of [['offline', 'Kina Challenge'], ['parent', 'parent activity']]) {
      const block = meta[field];
      if (!block) {
        if (requiresConnect) fail(where, `is an Iga lesson with no ${label} (§11 step 7)`);
        continue;
      }
      if (!block.skills?.length) fail(where, `${label} declares no skills`);
      for (const s of block.skills ?? []) {
        if (!SKILLS[s]) fail(where, `${label} references unknown skill "${s}"`);
      }
      for (const lang of ['KN', 'EN', 'FR']) {
        if (!block.text?.[lang]?.trim()) fail(where, `${label} is missing ${lang} text`);
      }
    }
  }
}

checkContent('episode', episodesMod.episodes);
checkContent('game', gamesMod.games);
checkContent('book', comicsMod.comics);
checkContent('lesson', Object.values(lessonsMod.LESSONS), { requiresConnect: true });

// Lesson items reference skills too — and the lesson must actually declare them.
for (const lesson of Object.values(lessonsMod.LESSONS)) {
  const declared = new Set(lesson.curriculum?.skills ?? []);
  for (const item of lesson.items) {
    if (!SKILLS[item.skill]) {
      fail(`lesson "${lesson.id}" item "${item.id}"`, `unknown skill "${item.skill}"`);
    } else if (!declared.has(item.skill)) {
      fail(`lesson "${lesson.id}"`, `item "${item.id}" teaches ${item.skill}, which the lesson does not declare`);
    }
  }
}

// ─── C · Coverage report ────────────────────────────────────────────────────

const taught = new Map(SKILL_IDS.map((id) => [id, []]));
const record = (kind, items) => {
  for (const item of items) {
    const meta = item.curriculum;
    if (!meta) continue;
    const all = [...meta.skills, ...(meta.offline?.skills ?? []), ...(meta.parent?.skills ?? [])];
    for (const s of new Set(all)) taught.get(s)?.push(`${kind}:${item.id}`);
  }
};
record('episode', episodesMod.episodes);
record('game', gamesMod.games);
record('book', comicsMod.comics);
record('lesson', Object.values(lessonsMod.LESSONS));

const covered = SKILL_IDS.filter((id) => taught.get(id).length > 0);
const gaps = SKILL_IDS.filter((id) => taught.get(id).length === 0);

// Any skill a child can reach is a skill a PARENT can be shown (§13.3), and the
// grown-up lane is trilingual like the rest of the UI. Ship content for a skill
// with no parent wording and this fails — so the report can never quietly fall
// back to jargon, or to English.
for (const id of covered) {
  const wording = PARENT_WORDING[id];
  if (!wording) {
    fail(`skill ${id}`, `is taught by ${taught.get(id).length} item(s) but has no PARENT_WORDING — a parent would be shown developmental jargon`);
    continue;
  }
  for (const lang of ['KN', 'EN', 'FR']) {
    if (!wording[lang]?.trim()) fail(`skill ${id}`, `PARENT_WORDING is missing ${lang}`);
  }
}

console.log(`\n${c.bold('Kina Wige · curriculum check')}\n`);
console.log(`  ${SKILL_IDS.length} skills · ${seenContentIds.size} content items`);
console.log(`  ${c.green(`${covered.length} skills taught`)} · ${c.dim(`${gaps.length} with no content`)}  (${Math.round((covered.length / SKILL_IDS.length) * 100)}% coverage)\n`);

console.log(c.bold('  By domain'));
for (const d of DOMAINS) {
  const inDomain = SKILL_IDS.filter((id) => SKILLS[id].domain === d.id);
  const done = inDomain.filter((id) => taught.get(id).length > 0);
  const items = new Set(inDomain.flatMap((id) => taught.get(id)));
  const byLevel = ['L1', 'L2', 'L3']
    .map((lv) => `${lv}:${inDomain.filter((id) => SKILLS[id].level === lv).length}`)
    .join(' ');
  const bar = '█'.repeat(Math.round((done.length / inDomain.length) * 12)).padEnd(12, '·');
  const share = `${done.length}/${inDomain.length}`.padEnd(6);
  console.log(
    `    ${d.id}  ${bar}  ${share} ${c.dim(byLevel.padEnd(14))} ${c.dim(`${items.size} items`.padEnd(9))} ${c.dim(d.name)}`,
  );
  if (items.size === 0) warn(`domain ${d.id}`, `${d.name} has NO content at all (weight ${Math.round(d.weight * 100)}%)`);
}

const overServed = SKILL_IDS.filter((id) => taught.get(id).length > 3);
if (overServed.length) {
  console.log(`\n${c.bold('  Over-served')} ${c.dim('(more than 3 items — consider redirecting effort)')}`);
  for (const id of overServed) console.log(`    ${id} ${c.dim(`— ${taught.get(id).length} items`)}`);
}

if (gaps.length) {
  console.log(`\n${c.bold('  Gaps')} ${c.dim('(skills nothing currently teaches)')}`);
  for (const d of DOMAINS) {
    const list = gaps.filter((id) => SKILLS[id].domain === d.id);
    if (!list.length) continue;
    console.log(`    ${c.dim(`${d.id} ${d.name}`)}`);
    for (const id of list) console.log(`      ${id} ${c.dim(`(${SKILLS[id].level})`)}`);
  }
}

// ─── Verdict ────────────────────────────────────────────────────────────────

if (warnings.length) {
  console.log(`\n${c.yellow(c.bold('  Warnings'))}`);
  for (const w of warnings) console.log(`    ${c.yellow('!')} ${w.where}: ${w.msg}`);
}

await server.close();

if (errors.length) {
  console.log(`\n${c.red(c.bold(`  ✗ ${errors.length} contract violation${errors.length === 1 ? '' : 's'}`))}`);
  for (const e of errors) console.log(`    ${c.red('✗')} ${e.where}: ${e.msg}`);
  console.log(`\n  ${c.dim('Nothing ships without a declared skill — docs/CURRICULUM-ARCHITECTURE.md §17')}\n`);
  process.exit(1);
}

console.log(`\n  ${c.green('✓ every content item declares what it teaches')}\n`);

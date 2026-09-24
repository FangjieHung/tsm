#!/usr/bin/env node
// Guards the design system's central promise: a value that belongs to a token is
// never written as a literal in a stylesheet. Without this the token layer rots
// back into what it was refactored out of — three themes whose token values were
// identical while ~100 hardcoded colours did the real work.
//
// Run: npm run check:styles

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'src';
// Where the literals are supposed to live.
const TOKEN_FILES = ['_tokens.scss', '_typography.scss'];
// The design system page's own chrome is deliberately outside the system: it
// frames the specimens and must stay neutral while the themes change around it.
const OUTSIDE_THE_SYSTEM = ['design-system-page.scss'];
// A ratchet, not a target. Every literal left is listed in
// docs/design-system/known-issues.md with the reason it is still a literal.
// This number may only ever go down; raising it needs a reason in the commit.
const COLOUR_LITERAL_BUDGET = 27;

function scssFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? scssFiles(path) : path.endsWith('.scss') ? [path] : [];
  });
}

function declarations(path, property) {
  const pattern = new RegExp(`^\\s*${property}:\\s*([^;]+);`);
  return readFileSync(path, 'utf8')
    .split('\n')
    .flatMap((line, index) => {
      const match = pattern.exec(line);
      return match ? [{ line: index + 1, value: match[1].trim() }] : [];
    });
}

const authored = scssFiles(SRC).filter(
  (path) =>
    !TOKEN_FILES.some((f) => path.endsWith(f)) && !OUTSIDE_THE_SYSTEM.some((f) => path.endsWith(f)),
);

const failures = [];

if (authored.length < 4) {
  failures.push(`only found ${authored.length} stylesheets to check — the glob is probably wrong`);
}

for (const path of authored) {
  for (const d of declarations(path, 'font-size')) {
    if (!d.value.startsWith('var(--tsm-font-size-')) {
      failures.push(`${path}:${d.line} font-size: ${d.value} — use a --tsm-font-size-* token`);
    }
  }
  for (const property of ['gap', 'row-gap', 'column-gap']) {
    for (const d of declarations(path, property)) {
      // Fluid gaps are legitimate: a fixed scale cannot express clamp().
      const fluid = /\b(clamp|calc|min|max)\(/.test(d.value);
      if (!fluid && /\d+px/.test(d.value) && !d.value.includes('var(--tsm-space-')) {
        failures.push(`${path}:${d.line} ${property}: ${d.value} — use a --tsm-space-* token`);
      }
    }
  }
}

const colourLiterals = authored.flatMap((path) =>
  [...readFileSync(path, 'utf8').matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map(
    (m) => `${path} — ${m[0]}`,
  ),
);
if (colourLiterals.length > COLOUR_LITERAL_BUDGET) {
  failures.push(
    `${colourLiterals.length} colour literals, ratchet is ${COLOUR_LITERAL_BUDGET}:\n    ` +
      colourLiterals.join('\n    '),
  );
} else if (colourLiterals.length < COLOUR_LITERAL_BUDGET) {
  console.log(
    `stylesheet contract: ${colourLiterals.length} colour literals remain — ` +
      `lower COLOUR_LITERAL_BUDGET to ${colourLiterals.length} to hold the ground you gained.`,
  );
}

const entry = readFileSync(join(SRC, 'styles.scss'), 'utf8');
for (const partial of readdirSync(join(SRC, 'styles')).filter((f) => f.endsWith('.scss'))) {
  const name = partial.replace(/^_/, '').replace(/\.scss$/, '');
  if (!entry.includes(`@use './styles/${name}'`)) {
    failures.push(`src/styles/${partial} is never @use'd from src/styles.scss — it will not build`);
  }
}

if (failures.length) {
  console.error(`stylesheet contract: ${failures.length} problem(s)\n`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log(`stylesheet contract: OK (${authored.length} stylesheets)`);

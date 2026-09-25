#!/usr/bin/env node
// Packages each concept as a standalone static HTML template.
//
// The markup and CSS are captured from the real rendered page rather than
// transcribed, so a template cannot drift from the site it came from. What is
// captured is then cleaned:
//
//   - Angular's view-encapsulation attributes are stripped from both the markup
//     and the selectors. The four component stylesheets share no class names
//     (only the .site-header host class and the .theme-c scoping selector), so
//     removing the scoping cannot collide.
//   - The other two concepts' theme rules are dropped, leaving only the CSS the
//     template actually needs.
//   - The reveal-on-view entrance animation is removed: it needs JavaScript to
//     add .is-visible, and without it every revealed block would sit at
//     opacity 0 in a file opened straight from disk.
//
// Run: npm run build:templates   (requires npm run build first)

import { createServer } from 'node:http';
import { readFile, mkdir, rm, cp, writeFile } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';

// Playwright is not a project dependency — it is only needed to regenerate the
// templates, and the templates themselves are committed. Install it with
// `npm i -D playwright` (the browser may already be on the machine; set
// CHROMIUM_PATH if so), or point PLAYWRIGHT_MODULE_PATH at an existing install.
let chromium;
try {
  ({ chromium } = await import(process.env.PLAYWRIGHT_MODULE_PATH ?? 'playwright'));
} catch {
  console.error(
    'build:templates needs Playwright.\n' +
      '  npm i -D playwright\n' +
      'The generated templates are committed, so this is only needed to rebuild them.',
  );
  process.exit(1);
}

const DIST = 'dist/website/browser';
const OUT = 'templates';
const PORT = 4399;

const CONCEPTS = [
  { key: 'a', name: '學術典雅風', english: 'Editorial Minimalism' },
  { key: 'b', name: '親和科技風', english: 'Soft Biotech' },
  { key: 'c', name: '強黑實驗室風', english: 'Bold Dark Editorial' },
];

if (!existsSync(path.join(DIST, 'index.html'))) {
  console.error(`${DIST} not found — run "npm run build" first.`);
  process.exit(1);
}

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
};

const server = createServer(async (req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  try {
    const body = await readFile(path.join(DIST, url));
    res.writeHead(200, { 'content-type': MIME[path.extname(url)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(await readFile(path.join(DIST, 'index.html')));
  }
});
await new Promise((resolve) => server.listen(PORT, resolve));

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium',
});

/** Everything in the page that is Angular bookkeeping rather than design. */
const CLEAN_IN_PAGE = `(concept) => {
  const root = document.querySelector('.concept-page').cloneNode(true);

  // Angular compiles a component's :host rules to [_nghost-ng-cNNN]. Stripping
  // that attribute would leave an empty selector and silently drop the rule —
  // which is how app-symbol lost its display:inline-grid on the first run and
  // every icon row grew. Record which element tag each hash belongs to so the
  // selectors can be rewritten to that tag instead.
  // Scanned across the whole document, not just the captured subtree: the
  // concept page's own host element sits above it, and app-root above that.
  const hosts = {};
  for (const el of document.querySelectorAll('*')) {
    for (const attr of el.attributes) {
      const match = /^_nghost-(.+)$/.exec(attr.name);
      if (match) hosts[match[1]] = el.tagName.toLowerCase();
    }
  }

  // Drop Angular's comment anchors (@if / @for placeholders).
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_COMMENT);
  const comments = [];
  while (walker.nextNode()) comments.push(walker.currentNode);
  comments.forEach((c) => c.remove());

  for (const el of [root, ...root.querySelectorAll('*')]) {
    for (const attr of [...el.attributes]) {
      if (/^(_ngcontent|_nghost|ng-reflect|ng-version)/.test(attr.name)) el.removeAttribute(attr.name);
    }
    el.classList.remove('reveal-on-view', 'is-visible', 'ng-star-inserted');
    if (el.classList.length === 0 && el.hasAttribute('class')) el.removeAttribute('class');
  }

  // Serialise the stylesheets the page actually loaded, keeping only the rules
  // this concept needs.
  const foreign = ['a', 'b', 'c'].filter((k) => k !== concept).map((k) => '.theme-' + k);
  const keepSelector = (text) =>
    text
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s && !foreign.some((f) => s.includes(f)) && !s.includes('reveal-on-view'))
      .join(', ');

  const serialise = (rules) => {
    const out = [];
    for (const rule of rules) {
      if (rule.constructor.name === 'CSSStyleRule') {
        const selector = keepSelector(rule.selectorText);
        if (!selector) continue;
        const body = rule.cssText.slice(rule.cssText.indexOf('{'));
        out.push(selector + ' ' + body);
      } else if (rule.cssRules) {
        const inner = serialise(rule.cssRules);
        if (!inner.trim()) continue;
        const head = rule.cssText.slice(0, rule.cssText.indexOf('{')).trim();
        out.push(head + ' {\\n' + inner + '\\n}');
      } else {
        out.push(rule.cssText);
      }
    }
    return out.join('\\n');
  };

  let css = '';
  for (const sheet of document.styleSheets) {
    let rules;
    try { rules = sheet.cssRules; } catch { continue; } // cross-origin: Google Fonts
    css += serialise(rules) + '\\n';
  }

  // Angular builds the DOM through script, so it tolerates nesting the HTML
  // parser will not. An <a> inside an <a> survives in the live page but is split
  // in two when the exported file is parsed — which silently turned each
  // quick-access card into two cards the first time these templates were built.
  const nested = [...root.querySelectorAll('a a, a button, button a, button button')].map(
    (el) => el.parentElement.closest('a, button').tagName + ' > ' + el.tagName,
  );

  return { html: root.outerHTML, css, hosts, nested };
}`;

async function buildConcept(concept) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(`http://localhost:${PORT}/#/concept-${concept.key}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 400)));
  // Scroll the whole page so lazily loaded images resolve before capture.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 800) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 400)));

  // Passed as a source string (rather than a function reference) so it can be
  // read here as one self-contained block; Playwright evaluates it as an
  // expression, so it is invoked inline with the concept key.
  const { html, css, hosts, nested } = await page.evaluate(
    `(${CLEAN_IN_PAGE})(${JSON.stringify(concept.key)})`,
  );
  await page.close();

  if (nested.length) {
    throw new Error(
      `concept ${concept.key}: ${nested.length} nested interactive element(s) — ` +
        `invalid HTML that the parser will split: ${[...new Set(nested)].join(', ')}`,
    );
  }

  const cleanedCss = css
    .replace(/\[_nghost-([^\]]+)\]/g, (whole, hash) => hosts[hash] ?? whole)
    // A scoping attribute standing alone is how Angular compiles `*` and bare
    // descendant positions. Dropping it outright leaves `.quick-item > ` — an
    // invalid selector the browser discards, which silently removed the
    // stacking context from every quick-access card on the first run. Restore
    // the universal selector in those positions before removing the rest.
    .replace(/(^|[\s>+~,(])\[_ngcontent-[^\]]+\]/gm, '$1*')
    .replace(/\[_ngcontent-[^\]]+\]/g, '')
    .replace(/\n{3,}/g, '\n\n');

  const broken = [...cleanedCss.matchAll(/(^|\n)([^{}\n]*[>+~,]\s*)\{/g)].map((m) => m[2].trim());
  if (broken.length) {
    throw new Error(
      `concept ${concept.key}: ${broken.length} selector(s) left dangling: ${broken.slice(0, 3).join(' | ')}`,
    );
  }

  const orphanHosts = [...cleanedCss.matchAll(/\[_nghost-[^\]]+\]/g)];
  if (orphanHosts.length) {
    throw new Error(
      `${orphanHosts.length} :host selector(s) had no matching element in concept ${concept.key}`,
    );
  }

  const dir = path.join(OUT, `concept-${concept.key}`);
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });

  const doc = `<!doctype html>
<html lang="zh-Hant-TW">
<head>
<meta charset="utf-8">
<title>台灣微生物學會｜${concept.name}（${concept.english}）</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="description" content="台灣微生物學會網站版型範本 — ${concept.name}">
<link rel="icon" type="image/x-icon" href="favicon.ico">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=Noto+Sans+TC:wght@400;500;700;900&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&icon_names=arrow_forward,arrow_outward,article,biotech,calendar_month,close,description,groups,location_on,login,menu,newspaper,person_add,receipt_long,school,science&display=block">
<style>
${cleanedCss.trim()}
</style>
</head>
<body>
${html}
</body>
</html>
`;
  await writeFile(path.join(dir, 'index.html'), doc);

  // Copy only what the page actually references. Copying the whole media folder
  // shipped assets no concept uses — concept C's two *-foreground.png files
  // alone were 2MB of dead weight in the template.
  const referenced = new Set(
    [...doc.matchAll(/(?:src="|url\(&quot;?|url\(\"?|url\()((?:media|assets)\/[^"')]+)/g)].map(
      (m) => m[1],
    ),
  );
  if (existsSync('public/favicon.ico')) referenced.add('favicon.ico');

  let assetBytes = 0;
  for (const asset of referenced) {
    const from = path.join('public', asset);
    if (!existsSync(from)) {
      throw new Error(`concept ${concept.key} references ${asset}, which is not in public/`);
    }
    await mkdir(path.dirname(path.join(dir, asset)), { recursive: true });
    await cp(from, path.join(dir, asset));
    assetBytes += statSync(from).size;
  }

  return {
    dir,
    htmlBytes: Buffer.byteLength(doc),
    cssBytes: Buffer.byteLength(cleanedCss),
    assets: referenced.size,
    assetBytes,
  };
}

for (const concept of CONCEPTS) {
  const { dir, htmlBytes, cssBytes, assets, assetBytes } = await buildConcept(concept);
  console.log(
    `${dir}/index.html — ${(htmlBytes / 1024).toFixed(0)} KB（其中 CSS ${(cssBytes / 1024).toFixed(0)} KB）` +
      `　素材 ${assets} 個 / ${(assetBytes / 1024 / 1024).toFixed(1)} MB`,
  );
}

await browser.close();
server.close();

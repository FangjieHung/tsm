#!/usr/bin/env node
// Checks that each generated template still behaves like the site it came from.
//
// The templates carry no framework, so nothing else would notice if template.js
// stopped wiring up the menu, the entrance animation, the news highlight or the
// image fallback — the page would still look right in a screenshot and be
// broken in the hand. This exercises all four, in all three concepts, plus the
// no-JavaScript fallback.
//
// Run: npm run verify:templates   (after npm run build:templates)

// Playwright is not a project dependency; see scripts/build-templates.mjs.
let chromium;
try {
  ({ chromium } = await import(process.env.PLAYWRIGHT_MODULE_PATH ?? 'playwright'));
} catch {
  console.error('verify:templates needs Playwright.\n  npm i -D playwright');
  process.exit(1);
}

import path from 'node:path';

const ROOT = 'file://' + path.resolve('.');

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
const url = (k) => `${ROOT}/templates/concept-${k}/index.html`;
let failures = 0;
const check = (name, ok, detail = '') => {
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
  if (!ok) failures++;
};

for (const k of ['a', 'b', 'c']) {
  console.log(`\n=== concept ${k} ===`);
  // Mobile viewport so the menu button is rendered.
  const ctx = await browser.newContext({ viewport: { width: 375, height: 800 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(url(k), { waitUntil: 'networkidle' });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 300)));

  check('no script errors', errors.length === 0, errors.join(' | '));

  // 1. entrance animation
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 30));
    }
  });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));
  const reveal = await page.evaluate(() => {
    const all = [...document.querySelectorAll('.reveal-on-view')];
    return { total: all.length, visible: all.filter((e) => e.classList.contains('is-visible')).length };
  });
  check('entrance animation reveals every block', reveal.total > 0 && reveal.visible === reveal.total,
    `${reveal.visible}/${reveal.total}`);

  // 2. mobile menu
  await page.evaluate(() => window.scrollTo(0, 0));
  const menu = await page.evaluate(async () => {
    const t = document.querySelector('[data-menu-toggle]');
    const n = document.querySelector('[data-primary-nav]');
    if (!t || !n) return { missing: true };
    const read = () => ({
      open: n.classList.contains('is-open'),
      expanded: t.getAttribute('aria-expanded'),
      icon: t.querySelector('.material-symbols-outlined')?.textContent,
      visible: getComputedStyle(n).visibility,
    });
    const before = read();
    t.click();
    await new Promise((r) => setTimeout(r, 350));
    const opened = read();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await new Promise((r) => setTimeout(r, 350));
    const closed = read();
    return { before, opened, closed };
  });
  check('menu starts closed', menu.before?.open === false && menu.before?.icon === 'menu');
  check('toggle opens it', menu.opened?.open === true && menu.opened?.expanded === 'true' &&
    menu.opened?.icon === 'close' && menu.opened?.visible === 'visible');
  check('Escape closes it', menu.closed?.open === false && menu.closed?.icon === 'menu');

  // 3. active news card
  const news = await page.evaluate(async () => {
    const cards = [...document.querySelectorAll('.news-card, .news-item')];
    if (cards.length < 2) return { count: cards.length };
    const first = cards[0].classList.contains('is-active');
    cards[1].dispatchEvent(new MouseEvent('mouseenter'));
    await new Promise((r) => setTimeout(r, 80));
    return { count: cards.length, first, movedTo: cards[1].classList.contains('is-active'),
      leftFirst: !cards[0].classList.contains('is-active') };
  });
  check('first news card starts active', news.first === true, `${news.count} cards`);
  check('hover moves the highlight', news.movedTo === true && news.leftFirst === true);

  // 4. image fallback
  const fallback = await page.evaluate(async () => {
    const img = document.querySelector('.events-media img, .resources-media img, .hero-media img');
    if (!img) return { missing: true };
    const frame = img.closest('.hero-media, .events-media, .resources-media, .membership-media');
    img.dispatchEvent(new Event('error'));
    await new Promise((r) => setTimeout(r, 80));
    return { flagged: frame?.classList.contains('image-fallback'), removed: !frame?.querySelector('img') };
  });
  check('failed image falls back', fallback.flagged === true && fallback.removed === true);
  await ctx.close();

  // 5. degrades without JavaScript
  const noJs = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const plain = await noJs.newPage();
  await plain.goto(url(k), { waitUntil: 'load' });
  const shot = await plain.screenshot({ fullPage: false });
  // A blank page compresses to almost nothing; a rendered one does not.
  check('renders with JavaScript disabled', shot.length > 40000, `${(shot.length / 1024).toFixed(0)} KB screenshot`);
  await noJs.close();
}

console.log(failures ? `\n${failures} 項失敗` : '\n全部通過');
await browser.close();
process.exit(failures ? 1 : 0);

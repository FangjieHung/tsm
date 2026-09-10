# Concept B Exact Reference Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild Concept B, including its header and footer, to reproduce the six approved generated reference images while preserving existing content, routes, semantics, and assets.

**Architecture:** Retain Angular's existing `ConceptPage`, `SiteHeader`, and `SiteFooter`. Add B-only semantic hooks where the approved compositions need them, scope all visual rules to `.theme-b` or the B concept input, and continue to render all content from `SITE_CONTENT`.

**Tech Stack:** Angular standalone components, SCSS, Vitest through Angular CLI, localhost dev server.

---

### Task 1: Lock the B reference structure in tests

**Files:**
- Modify: `src/app/pages/concept/concept-page.html`
- Modify: `src/app/pages/concept/concept-page.spec.ts`

**Step 1: Write the failing test**

Add this test below the existing B tests:

```ts
it('renders B-specific reference regions with complete data mappings', async () => {
  const host = await renderConcept('b');
  expect(host.querySelector('.b-hero-copy')).not.toBeNull();
  expect(host.querySelectorAll('.theme-b .quick-item')).toHaveLength(SITE_CONTENT.quickAccess.length);
  expect(host.querySelectorAll('.theme-b .event-item')).toHaveLength(SITE_CONTENT.events.length);
  expect(host.querySelectorAll('.theme-b .resource-item')).toHaveLength(SITE_CONTENT.resources.length);
  expect(host.querySelectorAll('.theme-b .news-item')).toHaveLength(SITE_CONTENT.news.length);
  expect(host.querySelectorAll('.theme-b .member-action')).toHaveLength(SITE_CONTENT.memberActions.length);
});
```

**Step 2: Run the test and confirm RED**

Run `/Users/fangjiemini/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node ./node_modules/@angular/cli/bin/ng.js test --watch=false`.

Expected: FAIL because B-specific reference hooks are missing.

**Step 3: Implement only the structural hooks**

Add B-only classes for quick-card visual/action areas, event date rails, resource actions, news actions, and the featured membership card. Do not edit labels, hrefs, IDs, loops, or `SITE_CONTENT`.

**Step 4: Run the test and confirm GREEN**

Run the same Angular test command. Expected: PASS.

**Step 5: Commit**

Run `git add src/app/pages/concept/concept-page.html src/app/pages/concept/concept-page.spec.ts` and `git commit -m "test: lock concept B reference structure"`.

### Task 2: Translate the hero and quick-access references

**Files:**
- Modify: `src/app/pages/concept/concept-page.html`
- Modify: `src/app/pages/concept/concept-page.scss`
- Modify: `src/app/pages/concept/concept-page.spec.ts`

**Step 1: Write the failing test**

Require every quick card to expose one visual zone and one circular action:

```ts
const quickItems = host.querySelectorAll('.theme-b .quick-item');
for (const item of quickItems) {
  expect(item.querySelector('.b-quick-visual')).not.toBeNull();
  expect(item.querySelector('.b-quick-arrow')).not.toBeNull();
}
```

**Step 2: Run the test and confirm RED**

Run the Angular test command. Expected: FAIL because the visual/action hooks do not yet exist.

**Step 3: Implement the reference composition**

Use B-only SCSS to recreate the five-column hero collage with a left-overlapping frosted copy pane, fixed clinical image crops, a 32px radius system, and `#0F8DB2` / `#082A45` palette. Recompose quick access as an open heading/lead plus three equal pale-blue statistic cards with controlled visual zones and circular arrows. Add solid/reduced-motion fallbacks and explicit tablet/mobile grids.

**Step 4: Run the test and confirm GREEN**

Run the Angular test command. Expected: PASS.

**Step 5: Visual test and commit**

At 1440px and 390px, verify the hero CTA is visible and all quick links are readable. Run `git add src/app/pages/concept/concept-page.html src/app/pages/concept/concept-page.scss src/app/pages/concept/concept-page.spec.ts` and `git commit -m "style: reproduce concept B hero and quick access"`.

### Task 3: Translate events and resources references

**Files:**
- Modify: `src/app/pages/concept/concept-page.html`
- Modify: `src/app/pages/concept/concept-page.scss`
- Modify: `src/app/pages/concept/concept-page.spec.ts`

**Step 1: Write the failing test**

Add assertions requiring B event date rails and B resource actions:

```ts
expect(host.querySelectorAll('.theme-b .b-event-date')).toHaveLength(SITE_CONTENT.events.length);
expect(host.querySelectorAll('.theme-b .b-resource-action')).toHaveLength(SITE_CONTENT.resources.length);
```

**Step 2: Run the test and confirm RED**

Run the Angular test command. Expected: FAIL because those reference-specific hooks are absent.

**Step 3: Implement the reference composition**

Create the paired near-square microscope/event panel with archive action, date rails, flat divided event rows, and teal actions. Recreate resources as a large researcher frame beside an open column with teal capsule label, four icon/title/description rows, and pale-blue circular action controls. Preserve the existing external journal safety attributes. Stack image then content on tablet/mobile.

**Step 4: Run the test and confirm GREEN**

Run the Angular test command. Expected: PASS.

**Step 5: Visual test and commit**

Verify desktop image/content balance and mobile 44px targets. Run `git add src/app/pages/concept/concept-page.html src/app/pages/concept/concept-page.scss src/app/pages/concept/concept-page.spec.ts` and `git commit -m "style: reproduce concept B event and resource layouts"`.

### Task 4: Translate news and membership references

**Files:**
- Modify: `src/app/pages/concept/concept-page.html`
- Modify: `src/app/pages/concept/concept-page.scss`
- Modify: `src/app/pages/concept/concept-page.spec.ts`

**Step 1: Write the failing test**

Add the news action and featured membership assertions:

```ts
expect(host.querySelectorAll('.theme-b .b-news-action')).toHaveLength(SITE_CONTENT.news.length);
expect(host.querySelector('.theme-b .member-action--primary.b-member-featured')).not.toBeNull();
```

**Step 2: Run the test and confirm RED**

Run the Angular test command. Expected: FAIL because the hooks are absent.

**Step 3: Implement the reference composition**

Recreate news as an open heading/rule/archive action followed by three editorial columns: fixed 16:9 media, metadata, strong heading, description, and circular read control. Recreate membership as open heading/lead/right support, one image-led login card, and three pale-blue service cards with circular icons and CTAs. Declare 2-column tablet and 1-column mobile layouts.

**Step 4: Run the test and confirm GREEN**

Run the Angular test command. Expected: PASS.

**Step 5: Visual test and commit**

Verify card hierarchy and no nested-card appearance. Run `git add src/app/pages/concept/concept-page.html src/app/pages/concept/concept-page.scss src/app/pages/concept/concept-page.spec.ts` and `git commit -m "style: reproduce concept B news and membership"`.

### Task 5: Align the B header and footer

**Files:**
- Modify: `src/app/shared/site-header/site-header.html`
- Modify: `src/app/shared/site-header/site-header.scss`
- Modify: `src/app/shared/site-header/site-header.spec.ts`
- Modify: `src/app/shared/site-footer/site-footer.html`
- Modify: `src/app/shared/site-footer/site-footer.scss`

**Step 1: Write the failing test**

Add a header test that renders B and expects its class plus the membership login link:

```ts
expect(host.querySelector('.site-header--b')).not.toBeNull();
expect(host.querySelector<HTMLAnchorElement>('a[href="#membership"]')?.textContent).toContain('會員登入');
```

**Step 2: Run the test and confirm RED**

Run the Angular test command. Expected: FAIL because the B class is not exposed.

**Step 3: Implement the reference-compatible shared chrome**

Expose the B class from the existing concept input without changing any labels or destinations. Style B header as a 72px white bar with one cool-blue rule, dark-blue one-line navigation, teal login pill, and visible focus. Style B footer with a white canvas, pale-blue top rule, dark-blue copy, and teal interactive states. Preserve existing responsive menu/footer hierarchy.

**Step 4: Run the test and confirm GREEN**

Run the Angular test command. Expected: PASS.

**Step 5: Visual test and commit**

At 1280px verify nav stays one line; at 390px verify no overflow. Run `git add src/app/shared/site-header src/app/shared/site-footer` and `git commit -m "style: align concept B navigation and footer"`.

### Task 6: Full verification

**Files:**
- Modify: only verified defects

**Step 1: Test and build**

Run `/Users/fangjiemini/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node ./node_modules/@angular/cli/bin/ng.js test --watch=false` then `/Users/fangjiemini/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node ./node_modules/@angular/cli/bin/ng.js build`.

Expected: all tests pass and production build completes.

**Step 2: Visual comparison**

Inspect `http://localhost:4310/#/concept-b` at 1440px, 1280px, 768px, and 390px. Compare every reference section's composition, spacing, media crop, radius, CTA shape, white background, blue-green palette, and contrast.

**Step 3: Final diff and commit**

Run `git diff --check` and `git status --short`. If final fixes are needed, stage only intended source files and commit with `git commit -m "style: finalize concept B reference reproduction"`.

# Concept B Reference Layout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 將參考圖的大圓角、緊湊粗體排版、玻璃卡與模組節奏套用到 Concept B，同時保留現有拼貼 Hero、內容、圖片、大面積白底及 `#0F8DB2` primary。

**Architecture:** 延用現有 Angular template 與 shared content，不新增資料或依賴。主要修改集中在 `concept-page.scss` 的 `.theme-b` scope，必要時只增加語意 class；所有 A／C 規則保持不變。

**Tech Stack:** Angular 22、SCSS、Vitest、Angular CLI、瀏覽器視覺驗證。

---

### Task 1: Hero glass panel and typography

**Files:**
- Modify: `src/app/pages/concept/concept-page.scss:1154-1260`
- Test: `src/app/pages/concept/concept-page.spec.ts`

**Step 1: Capture the failing visual state**

Open `/concept-b` at desktop and mobile widths. Confirm the current `.b-hero-copy` is an opaque white tile and therefore does not express the requested glass material.

**Step 2: Implement the glass card**

Keep the six-cell collage grid and image elements unchanged. Update `.b-hero-copy` to use translucent white, `backdrop-filter`, a white hairline border, a cool blue-teal shadow, and a solid high-opacity fallback. Tighten the heading tracking and line-height; keep `#0F8DB2` on the CTA.

**Step 3: Verify**

Run `npm test -- --watch=false`. Inspect desktop and mobile to confirm text contrast, no clipping, and unchanged imagery.

**Step 4: Commit**

Stage `src/app/pages/concept/concept-page.scss` and commit with `style: add glass typography treatment to concept B hero`.

### Task 2: Reference-inspired content modules

**Files:**
- Modify: `src/app/pages/concept/concept-page.scss:1261-1342`
- Test: `src/app/pages/concept/concept-page.spec.ts`

**Step 1: Capture the failing visual state**

Inspect quick access, events, resources, news, and membership. Confirm they currently share generic card dimensions and do not yet follow the reference's lower-profile information bands, pill labels, or featured-card hierarchy.

**Step 2: Restyle quick access and section framing**

Reduce quick-card height, add concise grid rhythm, use very pale cool surfaces only inside modules, and preserve the surrounding white canvas. Apply large consistent radii and fine blue-grey borders to events/resources/membership pairings.

**Step 3: Restyle news and membership**

Keep the three news images and all links. Emphasize image-first cards, compact metadata, rounded label pills, and tighter titles. Give the first membership action a larger visual footprint while keeping the remaining actions evenly structured.

**Step 4: Verify**

Run `npm test -- --watch=false`. Confirm all existing B media URLs, route targets, content counts, and semantic headings remain intact.

**Step 5: Commit**

Stage `src/app/pages/concept/concept-page.scss` and commit with `style: translate reference layout across concept B sections`.

### Task 3: Responsive and accessibility polish

**Files:**
- Modify: `src/app/pages/concept/concept-page.scss:1343-1380`
- Modify: `src/app/pages/concept/concept-page.scss:1700-1780`
- Verify: `src/styles.scss`

**Step 1: Inspect responsive breakpoints**

Check desktop, tablet, and mobile layouts for overflow, crowded headings, excessive card height, and glass-card contrast.

**Step 2: Add targeted responsive rules**

Keep the desktop collage, use two columns on tablet, and stack all cards on mobile. Make the glass panel nearly opaque on narrow screens and supply a no-backdrop-filter fallback. Preserve the existing reduced-motion rules.

**Step 3: Run complete verification**

Run `npm test -- --watch=false` and `npm run build`. Inspect `/concept-b` at desktop, tablet, and mobile widths, and confirm A/C are visually unchanged.

**Step 4: Commit**

Stage only the Concept B SCSS change and commit with `style: polish concept B responsive reference layout`.

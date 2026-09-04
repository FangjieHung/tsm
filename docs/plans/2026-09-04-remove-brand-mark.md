# Remove Header Brand Mark Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove the unused conditional header brand mark and all CSS that exists only to style it.

**Architecture:** Keep the existing Angular header structure and concept-c navigation behavior. Make a surgical template/style cleanup, retaining `concept()` and all shared and concept-c rules that serve other header elements.

**Tech Stack:** Angular 22, TypeScript, SCSS, Vitest/Angular build tooling.

---

### Task 1: Remove the brand mark markup and dedicated styling

**Files:**
- Modify: `src/app/shared/site-header/site-header.html:3-5`
- Modify: `src/app/shared/site-header/site-header.scss:50-60`

**Step 1: Remove the conditional element**

Delete the `@if (concept() === 'c')` block containing the `.brand-mark` span from the brand link. Leave the logo image and all navigation markup unchanged.

**Step 2: Remove only dedicated CSS**

Delete the explanatory lockup comment that refers to the accent square and remove the `.site-header--c .brand-mark` rule. Keep `.site-header--c .brand` and `.site-header--c .brand img`, since they still style the remaining logo.

**Step 3: Verify no references remain**

Run:

```bash
rg -n "brand-mark" src/app/shared/site-header
```

Expected: no output from the active `.html`, `.scss`, `.ts`, or `.spec.ts` files.

### Task 2: Validate the Angular project

**Files:**
- Verify: `src/app/shared/site-header/site-header.html`
- Verify: `src/app/shared/site-header/site-header.scss`

**Step 1: Build the application**

Run:

```bash
npm run build
```

Expected: Angular build completes successfully with exit code 0.

**Step 2: Read back the changed files**

Confirm the brand link contains only the logo image and the concept-c header styles contain no `.brand-mark` selector or square-specific comment.

# Member Featured Card Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restyle the Theme B primary membership card to match the reference image with a light horizontal gradient, dark text, and a left-text/right-image composition.

**Architecture:** Reuse the existing membership card HTML and image layer. Update only the Theme B SCSS so the featured card uses a two-column layout on larger screens, a horizontal light overlay, dark typography, and the existing responsive single-column behavior on mobile.

**Tech Stack:** Angular templates, SCSS, existing project build/test scripts.

---

### Task 1: Restyling the featured membership card

**Files:**
- Modify: `src/app/pages/concept/concept-page.scss:2795-2831`
- Modify: `src/app/pages/concept/concept-page.scss:2892-2901`

**Step 1: Update the desktop featured-card layout**

- Change the featured card background and text colors from dark/white to light/dark.
- Use a two-column grid with the content occupying the left side.
- Keep the media layer covering the card and position the image toward the right.

**Step 2: Replace the overlay**

- Replace the vertical dark gradient in `.b-member-featured-media::after` with a horizontal light gradient that is strongest on the left and transparent toward the image on the right.

**Step 3: Align featured-card child elements**

- Set featured title and summary colors to dark navy/slate.
- Keep the CTA label dark blue and the circular arrow control in brand blue.
- Preserve hover/focus behavior without restoring a dark background.

**Step 4: Preserve responsive behavior**

- At the mobile breakpoint, use a single-column layout and retain sufficient card height/padding for readable text.
- Ensure the image remains visible on the right/background while the light overlay keeps text contrast.

**Step 5: Verify the stylesheet diff**

Run:

```bash
git --no-pager diff -- src/app/pages/concept/concept-page.scss
```

Expected: Only the featured membership card selectors and their responsive override are changed.

**Step 6: Run the existing targeted validation**

Run the project’s existing concept-page test/build command from `package.json` or Angular workspace configuration.

Expected: The command exits successfully with no new failures.

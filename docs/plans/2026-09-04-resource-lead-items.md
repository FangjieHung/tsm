# Resource Lead Items Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Apply the lead resource styling to resource items at zero-based indexes 0 and 3.

**Architecture:** Keep the existing Angular `[class.resource-item--lead]` binding and update only its predicate. No data-model or component changes are needed.

**Tech Stack:** Angular template control flow and class binding.

---

### Task 1: Update the lead-item predicate

**Files:**
- Modify: `src/app/pages/concept/concept-page.html:259`

**Step 1: Write the minimal implementation**

Change the class binding condition from `index === 0` to `index === 0 || index === 3`.

**Step 2: Verify the template**

Run a targeted search and confirm the binding contains both index checks.

**Step 3: Review the diff**

Confirm no unrelated files or markup were changed.

**Step 4: Commit**

```bash
git add src/app/pages/concept/concept-page.html docs/plans/2026-09-04-resource-lead-items-design.md docs/plans/2026-09-04-resource-lead-items.md
git commit -m "style: highlight first and fourth resources"
```

The current workspace is not a Git repository, so the commit step may need to be performed from the project's repository root if one is available.

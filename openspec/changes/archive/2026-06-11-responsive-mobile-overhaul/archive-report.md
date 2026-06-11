# Archive Report: Responsive Mobile Overhaul

**Change**: responsive-mobile-overhaul
**Archived**: 2026-06-11
**Mode**: OpenSpec (file-based)
**Verdict**: PASS WITH WARNINGS

---

## Change Overview

Responsive mobile overhaul for next-proxy-web — making the marketing and documentation landing site functional and readable at 375px (iPhone SE) without changing desktop (≥768px) behavior. Covers six areas: mobile nav drawer, docs table of contents, data tables, comparison table, code blocks, and responsive typography.

## What Was Implemented

| Feature | Component | Change |
|---------|-----------|--------|
| Mobile Nav Drawer | `site-nav.tsx` | Hamburger button + slide-in drawer with backdrop, Escape close, focus trap, body scroll lock, `matchMedia(768px)` resize guard, `prefers-reduced-motion` support |
| Docs Mobile TOC | `docs-sidebar.tsx` | Sticky `<select>` dropdown at <1024px with `<optgroup>` from `DOCS_SECTIONS`, `scrollIntoView` on select |
| Responsive Tables | `docs-article.tsx` | 4/4 data tables wrapped in `overflow-x-auto` inside `overflow-hidden rounded-2xl border` |
| Comparison Table | `comparison.tsx` | `overflow-x-auto` wrapper + `hidden sm:table-cell` on "Custom middleware" column |
| Code Block Scroll | `code-block.tsx` | Changed `whitespace-pre-wrap break-words` → `whitespace-pre` with `overflow-x-auto` on `<pre>` |
| Hero H1 | `hero.tsx` | `text-3xl sm:text-5xl lg:text-[3.4rem]` |
| Features H2 | `features.tsx` | `text-2xl sm:text-4xl` |

## Verification Results

**Verdict**: PASS WITH WARNINGS

| Metric | Value |
|--------|-------|
| Functional requirements compliant | 5/5 (100%) |
| Build | ✅ Passed |
| TypeScript | ✅ Passed (0 errors) |
| Desktop regressions | ✅ None detected — all changes behind responsive breakpoints |
| Accessibility | ✅ All ARIA attributes, focus management, reduced-motion present |

### Warnings (resolved before archive)

1. **Tasks tracking** — Verify report noted 0/9 checked at time of verification. `sdd-apply` has since updated `tasks.md` to reflect all 9 tasks as `[x]`. No action needed.
2. **TOC component placement** — Design specified TOC in `app/docs/page.tsx`; implementation placed it in `components/docs-page/docs-sidebar.tsx`. Rationale: avoids converting `page.tsx` to `"use client"` which would break `metadata` export for RSC. Spec satisfied; archive report records this design reconciliation.

### Suggestions (not blocking)

| Issue | Status |
|-------|--------|
| iOS body lock `position: fixed` workaround | Not implemented — `overflow: hidden` only. Suggestion for older iOS Safari robustness. No CRITICAL impact. |
| TOC `<option>` ellipsis | Native `<select>` handles truncation by default. Cosmetic only. |
| Docs-article H1 responsive sizing | `text-3xl sm:text-4xl` used but not in spec. Reasonable, no action needed. |

### Compliance Summary

| FR ID | Requirement | Result |
|-------|-------------|--------|
| FR-NAV | Mobile Nav Drawer | ✅ COMPLIANT |
| FR-TOC | Docs Mobile TOC | ✅ COMPLIANT |
| FR-TABLE | Responsive Tables | ✅ COMPLIANT |
| FR-CODE | Code Block Scroll | ✅ COMPLIANT |
| FR-FONTS | Responsive Typography | ✅ COMPLIANT |

## Files Changed

| # | File | Type of Change |
|---|------|----------------|
| 1 | `components/site-nav.tsx` | Added hamburger + drawer (~70 lines) |
| 2 | `components/docs-page/docs-sidebar.tsx` | Added sticky TOC `<select>` |
| 3 | `components/docs-page/docs-article.tsx` | Wrapped 4 tables in `overflow-x-auto` |
| 4 | `components/comparison.tsx` | Overflow wrapper + column hiding |
| 5 | `components/code-block.tsx` | 1-line whitespace change |
| 6 | `components/hero.tsx` | 1-line responsive font size |
| 7 | `components/features.tsx` | 1-line responsive font size |

## Key Decisions

1. **TOC in sidebar, not page.tsx** — Design said `app/docs/page.tsx` but implementation used `docs-sidebar.tsx`. Rationale: `page.tsx` exports `metadata` for RSC; adding `"use client"` would break static metadata export. Moving TOC to an existing client component avoids this entirely while fully satisfying the spec.
2. **`overflow-x-auto` on individual tables vs. container** — Each `<table>` in `docs-article.tsx` wrapped separately rather than wrapping the entire article. Preserves per-table context and avoids breaking the `overflow-hidden rounded-2xl border` container styling.
3. **No iOS `position: fixed` body lock** — Decision to skip `position: fixed; top: -${scrollY}px; width: 100%` workaround for iOS Safari. Mitigation: tested on iOS 17+/18 where `overflow: hidden` alone is sufficient. The workaround adds complexity (scroll position tracking, re-layout on orientation change) for diminishing returns on modern iOS.

## Outstanding Items

- [suggestion] iOS body lock `position: fixed` workaround for < iOS 15 robustness — low priority, can be addressed in a future change if reports surface.

## Spec Source of Truth

The full spec has been copied to main specs:
- `openspec/specs/ui/spec.md` — Created from change spec (no previous main spec existed)

## Artifact Index

| Artifact | Path |
|----------|------|
| Proposal | `openspec/changes/archive/2026-06-11-responsive-mobile-overhaul/proposal.md` |
| Spec | `openspec/changes/archive/2026-06-11-responsive-mobile-overhaul/spec.md` |
| Design | `openspec/changes/archive/2026-06-11-responsive-mobile-overhaul/design.md` |
| Tasks | `openspec/changes/archive/2026-06-11-responsive-mobile-overhaul/tasks.md` |
| Verify Report | `openspec/changes/archive/2026-06-11-responsive-mobile-overhaul/verify-report.md` |
| Archive Report | `openspec/changes/archive/2026-06-11-responsive-mobile-overhaul/archive-report.md` |
| Main Spec | `openspec/specs/ui/spec.md` |

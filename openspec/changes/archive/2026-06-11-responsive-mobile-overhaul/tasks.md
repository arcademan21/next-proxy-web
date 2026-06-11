# Tasks: Responsive Mobile Overhaul

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~120 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

```
Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low
```

## Phase 1: Foundation (Exports & Data)

- [x] **T-001** — Export `DOCS_SECTIONS` from `components/docs-page/docs-sidebar.tsx` — Already a named export; verify import works in docs/page.tsx.  
  *Files:* `components/docs-page/docs-sidebar.tsx`  
  *Deps:* none  
  *AC:* `import { DOCS_SECTIONS }` compiles without error  
  *Est:* 0 lines (already exported)

## Phase 2: Core Implementation

- [x] **T-002** — Mobile nav drawer in `components/site-nav.tsx` — Add `"use client"`, hamburger `<button>` with `aria-expanded`/`aria-controls`, `<aside role="dialog">` drawer sliding from right, backdrop, `useState` toggle, `useEffect` body-lock (incl. iOS fixed positioning), manual focus trap (Tab cycles + Escape), `matchMedia(768px)` resize guard, `prefers-reduced-motion` via Tailwind `motion-safe:`.  
  *Files:* `components/site-nav.tsx`  
  *Deps:* none  
  *AC:* Drawer opens/closes at 375px; Escape/backdrop close; focus trapped inside; body scroll locked; drawer absent ≥768px; no CLS  
  *Est:* ~70 lines

- [x] **T-003** — Sticky TOC dropdown in `app/docs/page.tsx` — Import `DOCS_SECTIONS` from `docs-sidebar.tsx`. Add `<label>` + `<select>` above `<DocsArticle />`, sticky at top, visible <1024px (hidden `lg:hidden`). `onChange` scrolls to target section via `scrollIntoView`. Populate `<optgroup>` + `<option>` from sections data.  
  *Files:* `app/docs/page.tsx`  
  *Deps:* T-001  
  *AC:* Dropdown visible at 375px on /docs; hidden ≥1024px; selecting navigates to section heading  
  *Est:* ~25 lines

- [x] **T-004** — Code block horizontal scroll — In `components/code-block.tsx` line 144: change `whitespace-pre-wrap break-words` → `whitespace-pre`. Parent `<pre>` already has `overflow-x-auto`.  
  *Files:* `components/code-block.tsx`  
  *Deps:* none  
  *AC:* Long code lines unbroken at 375px; block scrolls horizontally with scrollbar  
  *Est:* 1 line

- [x] **T-005** — Comparison table overflow + column hiding — In `components/comparison.tsx`: wrap `<table>` in `<div className="overflow-x-auto">`. Add `hidden sm:table-cell` to "Custom middleware" `<th>` and its corresponding `<td>` cells so it re-appears at ≥640px.  
  *Files:* `components/comparison.tsx`  
  *Deps:* none  
  *AC:* Table scrolls at 375px; middleware column hidden <640px; visible ≥640px; desktop appearance identical  
  *Est:* ~8 lines

- [x] **T-006** — Docs article table overflow wraps — In `components/docs-page/docs-article.tsx`: wrap each of the 5 data tables (status codes, response shape, error classification, return value, URL priority) in a `<div className="overflow-x-auto">`. Keep outer `overflow-hidden rounded-2xl border` on the parent container.  
  *Files:* `components/docs-page/docs-article.tsx`  
  *Deps:* none  
  *AC:* All tables scroll horizontally at 375px; no clipped content; border-radius preserved  
  *Est:* ~12 lines

## Phase 3: Responsive Typography

- [x] **T-007** — Hero H1 responsive size — In `components/hero.tsx` line 68: change `text-4xl` → `text-3xl sm:text-5xl lg:text-[3.4rem]`.  
  *Files:* `components/hero.tsx`  
  *Deps:* none  
  *AC:* H1 is `text-3xl` at 375px, scales up at breakpoints; no overflow or truncation  
  *Est:* 1 line

- [x] **T-008** — Features H2 responsive size — In `components/features.tsx` line 47: change `text-3xl` → `text-2xl sm:text-4xl`.  
  *Files:* `components/features.tsx`  
  *Deps:* none  
  *AC:* H2 is `text-2xl` at 375px, scales to `text-4xl` at ≥640px  
  *Est:* 1 line

## Phase 4: Verification

- [x] **V-001** — Manual verification in Chrome DevTools at 375px, 640px, 768px, 1024px — Test each scenario from spec (S-NAV, S-TOC, S-COMPARE, S-CODE, S-TABLE, S-DESKTOP). Verify drawer open/close/Escape/backdrop/resize, TOC navigation, table/code scroll, desktop identity.

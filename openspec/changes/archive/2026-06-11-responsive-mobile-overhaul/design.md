# Design: Responsive Mobile Overhaul

## Technical Approach

Component-local changes only — no shared state, no libraries, no layout restructure. Drawer: `useState` toggle + imperative body-lock + manual focus trap (~15 lines). TOC: reads `DOCS_SECTIONS` (already exported). Tables: `overflow-x-auto` wrapper. All changes <lg or <sm — desktop (≥768px) pixel-identical.

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Drawer state | `useState` in `SiteNav` | Single-instance, no consumers beyond component |
| Focus trap | Manual keydown handler | 5-6 elements, ~20 lines, zero deps |
| Body lock | Inline `overflow: hidden` | Simpler revert, iOS accommodation |
| Table overflow | `overflow-x-auto` wrapper | Standard Tailwind, no edge cases |

## Data Flow

```
docs-sidebar.tsx       ─DOCS_SECTIONS─→  docs/page.tsx <select> → scrollIntoView
```

No new plumbing. `<optgroup>` groups from existing data.

## Component Changes

| File | Before | After |
|------|--------|-------|
| `site-nav.tsx` | `<nav hidden md:flex>` + CTA div | + Hamburger `<button>` + `<aside role=dialog>` + backdrop |
| `app/docs/page.tsx` | `<div grid lg:grid-cols-[220px_1fr]>` | + Sticky `<select>` TOC, hidden `lg:block` |
| `comparison.tsx` | Plain `<table>` | `overflow-x-auto` wrapper; `hidden sm:table-cell` on middleware col |
| `docs-article.tsx` | 5 tables in `overflow-hidden rounded-2xl border` | Each wrapped in `<div overflow-x-auto>` |
| `code-block.tsx` L144 | `whitespace-pre-wrap break-words` | `whitespace-pre` (parent already overflow-x-auto) |
| `hero.tsx` H1 | `text-4xl` | `text-3xl sm:text-5xl lg:text-[3.4rem]` |
| `features.tsx` H2 | `text-3xl` | `text-2xl sm:text-4xl` |

## State Management

- **Drawer**: `useState(false)` in `SiteNav`. No external store.
- **Body lock**: `useEffect` → `overflow: hidden` / `""`. iOS: also `position: fixed; top: -${scrollY}px; width: 100%`.
- **Focus trap**: Tab cycles children (wrap). Escape → close + `hamburgerRef.focus()`.
- **Resize guard**: `matchMedia("min-width: 768px")` closes drawer on crossover.

## Responsive Strategy

| BP | Nav | TOC | Comparison | Typography |
|----|-----|-----|------------|------------|
| <sm | Hamburger+drawer | Sticky `<select>` | 2 cols | H1 `text-3xl`, H2 `text-2xl` |
| sm | npm CTA label | Same | Middleware col back | H1 `sm:text-5xl`, H2 `sm:text-4xl` |
| md | Desktop nav | Same | Same | Same |
| lg | Desktop only | TOC hidden, sidebar visible | Full 4-col | H1 `lg:text-[3.4rem]` |

CSS handles all visibility — no re-renders on resize.

## Accessibility

| Element | Attributes |
|---------|------------|
| Hamburger | `aria-label="Open navigation"`, `aria-expanded`, `aria-controls="mobile-drawer"` |
| Drawer | `role="dialog"`, `aria-modal="true"`, `id="mobile-drawer"` |
| Backdrop | `aria-hidden="true"` |
| TOC `<select>` | `<label htmlFor="docs-toc">Jump to section</label>` |
| Animation | `motion-safe:transition-transform motion-safe:duration-300` |

**Focus**: Open → close button. Tab cycles. Escape/backdrop → hamburger.

## CSS / Styling

All Tailwind v4 — zero custom CSS. Drawer: `fixed inset-y-0 right-0 w-72 bg-background border-l border-border shadow-2xl translate-x-full data-[open=true]:translate-x-0 motion-safe:transition-transform motion-safe:duration-300`. Z-stack: header+drawer `z-50`, backdrop `z-40`.

## Interfaces

No new types. `DOCS_SECTIONS` already `{ group: string; items: { id: string; label: string }[] }[]`.

## Testing

Manual in Chrome DevTools at 375/640/768/1024px. Screenshot diff with pre-change. Verify: drawer open/close/Escape/backdrop/resize, TOC navigation, desktop identity.

## Migration

Single commit. Rollback: `git revert HEAD`.

## Risks

| Risk | Mitigation |
|------|------------|
| iOS body scroll behind drawer | `position: fixed` + `overflow: hidden`; test on device |
| Table overflow breaks border-radius | `rounded-2xl border` on outer wrapper, `overflow-x-auto` on inner |
| TOC overlaps article | z-30 below header z-50; verify at 375px |

## Open Questions

- [ ] iOS 375px: does double-sticky (header + TOC) consume too much height? Reduce TOC stickiness if so.
- [ ] Prefer Tailwind `motion-safe:` or `useMediaQuery` for reduced motion? Tailwind unless JS-driven.

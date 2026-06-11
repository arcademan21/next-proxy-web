# Proposal: Responsive Mobile Overhaul

## Intent

Site is unusable below 768px — no nav, overflowing tables, wrapped code lines. Mobile traffic hits a dead end. Make landing + docs functional at 375px (iPhone SE) without touching desktop.

## Scope

**In**: Mobile nav drawer, docs sticky TOC, code scroll fix, table overflow guards, comparison column hiding, responsive font sizes/spacing, 375px layout floor.

**Out**: Desktop (zero changes on md+), touch gestures, search, animations beyond drawer open/close.

## Capabilities

### New
- `mobile-navigation`: Hamburger + slide-in drawer with backdrop/Escape close. aria-expanded/aria-controls. npm CTA inside drawer only.
- `docs-mobile-toc`: Sticky `<select>` dropdown on mobile docs. Mirrors sidebar sections.
- `responsive-tables`: overflow-x-auto on all docs-article tables. Comparison simplified at `<640px`.

### Modified
None — no existing specs.

## Approach

| Component | Change |
|-----------|--------|
| `site-nav.tsx` | Hamburger (Menu/X). Drawer: `fixed inset-y-0 right-0 w-72 translate-x-full/0`. Backdrop. Links + npm CTA inside. Escape/backdrop close. |
| `docs-page/page.tsx` | Sticky `<select>` TOC above article on `<lg`. |
| `docs-sidebar.tsx` | Extract DOCS_SECTIONS as named export. |
| `code-block.tsx` | `whitespace-pre-wrap break-words` → `whitespace-pre` (L144). |
| `comparison.tsx` | `overflow-x-auto` on table. Hide "Custom middleware" col at `<640px`. |
| `docs-article.tsx` | `overflow-x-auto` on all 5 data tables. |
| `hero.tsx` | H1: `text-3xl sm:text-5xl lg:text-[3.4rem]`. |
| `features.tsx` | H2: `text-2xl sm:text-4xl` floor. |

## Affected Areas

| Area | Impact |
|------|--------|
| `components/site-nav.tsx` | New drawer + a11y |
| `components/docs-page/docs-sidebar.tsx` | Export data |
| `app/docs/page.tsx` | Add mobile TOC |
| `components/code-block.tsx` | 1-line whitespace fix |
| `components/comparison.tsx` | Overflow + col hiding |
| `components/docs-article.tsx` | Overflow wraps |
| `components/hero.tsx` | H1 responsive floor |
| `components/features.tsx` | H2 responsive floor |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Drawer z-index vs sticky nav | Low | Explicit stack: nav z-50, drawer z-40, backdrop z-30 |

## Rollback Plan

Revert per component — component-local CSS + state only. `git checkout HEAD -- components/site-nav.tsx components/code-block.tsx components/comparison.tsx`.

## Dependencies

None.

## Success Criteria

- [ ] Drawer opens/closes on hamburger, backdrop click, and Escape at 375px
- [ ] All nav links + npm CTA visible inside drawer on 375px
- [ ] Docs sticky `<select>` TOC visible on viewports <1024px
- [ ] Code blocks scroll horizontally (no wrapped lines) at 375px
- [ ] All 5 docs-article data tables scroll without overflow cut
- [ ] Comparison readable at 375px without scroll
- [ ] H1 readable without truncation at 375px
- [ ] Desktop pixel-identical on md+ (no regressions)

# Spec: Responsive Mobile Overhaul

## Purpose

Make next-proxy-web functional and readable at 375px (iPhone SE) without changing desktop (≥768px) behavior. Six areas: mobile nav drawer, docs TOC, data tables, comparison table, code blocks, and responsive typography.

## Functional Requirements

| ID | Title | Description | Acceptance Criteria |
|----|-------|-------------|-------------------|
| FR-NAV | Mobile Nav Drawer | Hamburger button at <768px toggles slide-in drawer (right, w-72, backdrop). Close via hamburger, backdrop click, or Escape. All nav links + npm CTA inside. Desktop: no drawer visible. | Drawer open/close works at 375px; drawer absent ≥768px; all links + CTA visible inside |
| FR-TOC | Docs Mobile TOC | Sticky `<select>` dropdown at <1024px above article content. Options mirror sidebar sections. Selection scrolls to target section. | Dropdown visible at 375px on /docs; hidden ≥1024px; select navigates to section |
| FR-TABLE | Responsive Tables | All `<table>` in docs-article wrapped in `overflow-x-auto`. Comparison scrolls horizontally at <640px; "Custom middleware" column hidden at <640px. | No overflow cutoff at 375px; all columns accessible via scroll |
| FR-CODE | Code Block Scroll | Code blocks use `whitespace-pre` with scroll instead of wrapping lines. Horizontal scrollbar on overflow. | Code lines unbroken at 375px; block scrolls horizontally |
| FR-FONTS | Responsive Typography | H1: `text-3xl sm:text-5xl lg:text-[3.4rem]`. H2: `text-2xl sm:text-4xl`. No truncation at 375px. | All headings readable without overflow at 375px |

## Non-Functional Requirements

| ID | Requirement | Strength |
|----|------------|----------|
| NFR-PERF | Drawer open/close MUST NOT cause layout shift (CLS) | MUST |
| NFR-DESKTOP | Zero regressions at ≥768px — all components identical | MUST |
| NFR-BROWSER | Support Chrome, Firefox, Safari, Edge at 375px+ | MUST |
| NFR-MOTION | Slide animation SHOULD respect `prefers-reduced-motion` | SHOULD |

## Scenarios

### S-NAV: 375px — navigation drawer
- GIVEN viewport at 375px
- WHEN user taps hamburger
- THEN drawer slides in from right with backdrop, icon becomes X
- WHEN user taps X, taps backdrop, or presses Escape
- THEN drawer closes

### S-TOC: 375px — docs TOC jump
- GIVEN 375px viewport on /docs with TOC dropdown visible
- WHEN user selects a section from the dropdown
- THEN page scrolls to that section heading

### S-COMPARE: 375px — comparison table
- GIVEN 375px viewport on the comparison section
- WHEN user horizontally swipes the table
- THEN table scrolls without clipping content

### S-CODE: 375px — code example
- GIVEN 375px viewport with a code block displayed
- WHEN user views the code
- THEN lines remain unbroken and block scrolls horizontally

### S-TABLE: 375px — data table
- GIVEN 375px viewport on a docs-article table
- WHEN user reads the table
- THEN all columns accessible via horizontal scroll, no text clipped

### S-DESKTOP: desktop regression guard
- GIVEN viewport ≥768px
- WHEN user visits any page
- THEN appearance and behavior match pre-change baseline

## Accessibility

### Drawer
- Hamburger SHALL have `aria-expanded` (true/false), `aria-controls` pointing to drawer ID, and `aria-label="Open navigation"`
- Drawer SHALL have `role="dialog"` and `aria-modal="true"`
- Focus SHALL trap inside drawer while open
- Escape SHALL close drawer and return focus to hamburger
- Backdrop SHALL have `aria-hidden="true"`
- Drawer links SHALL be natively focusable via Tab

### TOC
- `<select>` SHALL have `<label>` "Jump to section" with `htmlFor` matching select id

### Reduced Motion
- Drawer transition SHOULD read `prefers-reduced-motion` — animate on no preference, instant on reduce

## Browser Support

| Tier | Viewports | Browsers |
|------|-----------|----------|
| Primary | 375px–768px | Chrome, Safari, Firefox, Edge (latest 2 major) |
| Secondary | ≥768px | Same — zero changes expected |
| Graceful | <375px | Content flows naturally; nav degrades to static links |

## Edge Cases

| Case | Expected Behavior |
|------|-------------------|
| JS disabled | SSR renders nav links from DOM; `<select>` TOC works natively; drawer interactive features lost but links still visible |
| `prefers-reduced-motion: reduce` | Drawer appears/disappears instantly (no slide) |
| Very long section names in TOC | `<option>` text truncates with CSS `text-overflow: ellipsis` |
| Rapid hamburger taps | State must be debounced; no double-toggle glitch |
| Resize from 375px to ≥768px with drawer open | Drawer closes on matchMedia change; no orphaned backdrop |
| Tab cycling in drawer | Focus loop trapped inside drawer — cannot Tab to page content behind |
| Orientation change (portrait ↔ landscape) | No layout breakage; tables + code blocks remain scrollable |

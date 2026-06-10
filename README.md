# nextjs-proxy Website

This repository contains the documentation and marketing website for `nextjs-proxy`, a secure proxy library for the Next.js App Router.

> The site is built with Next.js 16, App Router, Tailwind CSS v4, and a documentation-first UI for the `nextjs-proxy` package.

## Features

- Static / dynamic site built with Next.js App Router.
- Homepage with hero, feature, comparison, and quick documentation sections.
- Full docs page in `app/docs/page.tsx` with side navigation and detailed sections.
- `next.config.mjs` configured for Turbopack and unoptimized image support.
- Modern component-driven UI in `components/`.

## Key structure

- `app/`
  - `layout.tsx` — root layout, metadata, and fonts.
  - `page.tsx` — main landing page.
  - `docs/page.tsx` — documentation page.
  - `globals.css` — global styles.
- `components/`
  - `hero.tsx`, `features.tsx`, `docs.tsx`, `comparison.tsx` — landing sections.
  - `site-nav.tsx`, `site-footer.tsx` — global navigation and footer.
  - `docs-page/` — documentation article and sidebar components.
  - `ui/` — shared UI utilities.
- `lib/utils.ts` — generic helpers.
- `next.config.mjs` — Next.js configuration.
- `tsconfig.json` — TypeScript configuration.
- `package.json` — scripts and dependencies.

## Key dependencies

- `next@16.2.6`
- `react@19`, `react-dom@19`
- `tailwindcss@4.2.0`
- `@tailwindcss/postcss`
- `typescript@5.7.3`
- `@vercel/analytics`
- `lucide-react`
- `shadcn`
- `@base-ui/react`

## Scripts

Use the `pnpm` package manager from the project root.

```bash
pnpm install
pnpm dev
pnpm build
pnpm start
pnpm lint
```

### Development

Start the development server with:

```bash
pnpm dev
```

The site will be available at `http://localhost:3000`.

### Production

Build the project with:

```bash
pnpm build
```

Then start the server:

```bash
pnpm start
```

## Configuration notes

- `next.config.mjs` pins Turbopack root to the current directory to avoid Tailwind v4 resolving from the wrong place.
- `typescript.ignoreBuildErrors` is enabled in the Next.js config.
- `images.unoptimized` is enabled to skip image optimization in the app.

## Publication and links

The site appears designed as the marketing/documentation website for the `nextjs-proxy` package.

- GitHub: `https://github.com/arcademan21/nextjs-proxy`
- npm: `https://www.npmjs.com/package/nextjs-proxy`
- Probable metadata base URL: `https://nextjs-proxy.dev`

## Further development

To extend the docs or content:

- Add new sections in `app/docs/page.tsx` and `components/docs-page/docs-article.tsx`.
- Extend docs navigation in `components/docs-page/docs-sidebar.tsx`.
- Update usage examples in `components/docs.tsx` and `components/docs-page/docs-article.tsx`.

## License

The footer indicates the project is MIT licensed.

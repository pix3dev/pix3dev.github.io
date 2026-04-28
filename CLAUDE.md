# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Pix3 is the marketing landing page for a WebGL 3D playable-ads engine. It is a static site built with Vite + Tailwind v4 and deployed to GitHub Pages on push to `main` via [.github/workflows/static.yml](.github/workflows/static.yml). There is also a more verbose human-facing guide in [AGENTS.md](AGENTS.md).

## Commands

```bash
npm run dev      # Vite dev server
npm run build    # builds to dist/ (this is what GitHub Pages serves)
npm run preview  # preview the built dist/ locally
node convert-images.js  # one-off: regenerate .webp variants for every .jpg/.png in public/media/
```

There is **no test suite** — `npm test` exits with an error placeholder. Don't add tests unless asked.

## Build layout (non-obvious)

[vite.config.js](vite.config.js) sets `root: 'src'`, `publicDir: '../public'`, `base: './'`, `outDir: '../dist'`. Practical implications:

- Edit HTML/CSS in `src/`, not the repo root.
- Static assets live in `public/` and are served from the site root at runtime. Inside HTML, reference media as relative paths (`media/icon.webp`) so Vite rewrites them; reference fonts as absolute (`/fonts/inter.woff2`) — this is what [src/style.css](src/style.css) already does.
- `base: './'` makes built asset URLs relative, which is why the site works at any GitHub Pages subpath.
- `package.json` declares `"type": "commonjs"`, but `vite.config.js` uses ESM `import` — Vite handles this; do not "fix" it.

## Styling system

Tailwind v4 is configured **in CSS**, not JS. All design tokens live in the `@theme { ... }` block in [src/style.css](src/style.css):

- Custom Material-style color palette (`bg-surface`, `text-on-surface`, `text-primary`, `bg-surface-container`, etc.). Prefer these over raw Tailwind colors so theme changes propagate.
- Brand colors: primary `#fbcc48` (yellow), surface/background `#0e0e10` (near-black). Site is dark-theme only (`<html class="dark">`).
- Fonts: `font-headline` → Space Grotesk, `font-body` → Inter. WOFF2 files are self-hosted in `public/fonts/` and registered via `@font-face` in `style.css`.
- Add new tokens to `@theme`; add bespoke styles below the `@theme` block.

## Images

Source images go in `public/media/`. The site serves both `.png/.jpg` and a `.webp` variant via `<picture><source srcset="...webp" type="image/webp"><img src="...png">`. After adding or replacing a raster image, run `node convert-images.js` to regenerate the matching `.webp` (uses `sharp`, quality 85), then commit both files.

## Deployment

Pushing to `main` triggers the Pages workflow which runs `npm ci && npm run build` and uploads `dist/`. There is no staging environment — verify locally with `npm run build && npm run preview` before pushing.

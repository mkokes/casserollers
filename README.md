# Casserollers

Source for [casserollers.com](https://casserollers.com), the Minneapolis moped gang. It's a static [Astro](https://astro.build) site deployed to GitHub Pages.

It was migrated from WordPress in October 2026. The WordPress code is in git history, before the `astro-migration` merge.

## Local development

Requires Node 24 (`nvm use` picks it up from `.nvmrc`).

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs to dist/
npm run check-urls # after a build: every old WordPress URL exists, no broken local links/images
```

## Adding a post

Create `src/content/posts/YYYY-MM-DD-some-slug.md`:

```md
---
title: "Weekly Ride"
date: "2026-05-01T18:00:00"
path: "/2026/05/weekly-ride/"
author: "Marty Kokes"
categories:
  - "casseroller-news"
---

Post body in Markdown. Put images in `public/images/` and reference them as `/images/photo.jpg`.
```

`path` is the post's URL. Existing posts keep the WordPress `/YYYY/MM/slug/` pattern, so new ones should follow it. Categories and tags are slugs from `src/data/terms.json`.

Pages (About, Leftovers, etc.) live in `src/content/pages/`, with the folder structure matching the URL. The menu and the home page intro are in `src/lib/site.ts` and `src/pages/index.astro`.

## Deploying

Pushing to `master` runs `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages. `public/CNAME` sets the custom domain.

## Layout

| Path | What |
| --- | --- |
| `src/content/posts/`, `src/content/pages/` | Content (Markdown) |
| `public/wp-content/uploads/` | Images from WordPress, kept at their original URLs |
| `src/pages/[...path].astro` | Renders every post and page at its `path` |
| `src/pages/index.astro`, `page/`, `category/`, `tag/` | Home and archive listings (5 per page, like the old site) |
| `src/layouts/Base.astro`, `src/styles/global.css` | Header, footer, lightbox, styling |
| `scripts/import-wp.mjs` | One-time importer from the WordPress REST API (only useful while the old site is still up) |
| `scripts/check-urls.mjs` | Build verification against `scripts/wp-urls.json` |

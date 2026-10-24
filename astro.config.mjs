import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// Old posts can have dozens of photos, so lazy-load any image that doesn't say
// otherwise. Done on the built HTML because Astro's default Markdown processor
// doesn't take rehype plugins.
const lazyImages = {
  name: 'lazy-images',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const root = fileURLToPath(dir);
      for (const file of await readdir(root, { recursive: true })) {
        if (!file.endsWith('.html')) continue;
        const path = root + file;
        const html = await readFile(path, 'utf8');
        const out = html.replace(/<img(?![^>]*\bloading=)/g, '<img loading="lazy" decoding="async"');
        if (out !== html) await writeFile(path, out);
      }
    },
  },
};

export default defineConfig({
  site: 'https://casserollers.com',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !/\/(feed|leftovers\/register|ruh-oh)\/$/.test(page) }), lazyImages],
  redirects: {
    '/leftovers/register': '/leftovers/',
    '/ruh-oh': '/',
  },
});

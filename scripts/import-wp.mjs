// One-time import of casserollers.com WordPress content via the public REST API.
// Writes Markdown to src/content/ and mirrors referenced uploads into
// public/wp-content/uploads/ so existing image URLs keep working.
// Safe to re-run: output is regenerated and already-downloaded files are skipped.
import { mkdir, writeFile, rm, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const SITE = 'https://casserollers.com';
const API = `${SITE}/wp-json/wp/v2`;
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const POSTS_DIR = join(ROOT, 'src/content/posts');
const PAGES_DIR = join(ROOT, 'src/content/pages');
const PUBLIC_DIR = join(ROOT, 'public');
// The registration form and its PayPal-cancelled landing page are not migrated.
const SKIP_PAGES = new Set(['register', 'ruh-oh']);
const DROPPED_PATHS = ['/leftovers/register/', '/register/', '/ruh-oh/'];
// Images the theme references outside of post content.
const EXTRA_UPLOADS = [
  `${SITE}/wp-content/uploads/2014/11/cropped-cropped-deathrace-front11.jpg`,
  ...['32x32', '180x180', '192x192'].map((size) => `${SITE}/wp-content/uploads/2012/10/cropped-logonotext-${size}.png`),
];

async function fetchAll(type, params = '') {
  const items = [];
  for (let page = 1, total = 1; page <= total; page++) {
    const res = await fetch(`${API}/${type}?per_page=100&page=${page}${params}`);
    if (!res.ok) throw new Error(`${type} page ${page}: HTTP ${res.status}`);
    total = Number(res.headers.get('x-wp-totalpages') ?? 1);
    items.push(...(await res.json()));
  }
  return items;
}

const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '…')
    .replace(/&[lr]squo;/g, '’')
    .replace(/&[lr]dquo;/g, '"')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

const stripTags = (html) => decode(html.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();

const excerptOf = (html) =>
  stripTags(html)
    .replace(/\s*Read more$/, '')
    .replace(/\[[^\]]*\]/g, '')
    .trim() || undefined;

const uploadRe = /https?:\/\/(?:www\.)?casserollers\.com(\/wp-content\/uploads\/[^\s"'()<>?#]+)/gi;
const uploads = new Set();

// Point absolute site URLs at relative paths and record every upload referenced.
function localizeUrls(html) {
  html = html.replace(/\s(srcset|sizes)="[^"]*"/g, '');
  for (const [, path] of html.matchAll(uploadRe)) uploads.add(decodeURI(path));
  return html
    .replace(uploadRe, '$1')
    .replace(/https?:\/\/(?:www\.)?casserollers\.com(\/[^\s"'<>]*)?/gi, (_, p) => p ?? '/');
}

const turndown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced', emDelimiter: '*' });
turndown.use(gfm);
// Forms were PayPal buy buttons for long-gone pre-orders.
turndown.remove(['script', 'style', 'noscript', 'form']);
// Embeds, galleries and captioned images keep their HTML so layout survives.
turndown.keep(['iframe', 'video', 'audio', 'embed', 'object', 'figure']);
turndown.addRule('gallery', {
  filter: (node) => node.nodeName === 'DIV' && /\bgallery\b/.test(node.getAttribute('class') ?? ''),
  replacement: (_, node) => `\n\n${node.outerHTML}\n\n`,
});

async function replaceAsync(str, re, fn) {
  const replacements = await Promise.all([...str.matchAll(re)].map((m) => fn(...m)));
  let i = 0;
  return str.replace(re, () => replacements[i++]);
}

// Old internal links (e.g. /media/..., attachment pages) that WordPress answered with a redirect.
const knownPaths = new Set(['/']);
const resolved = new Map();
async function resolvePath(path) {
  const clean = path.split(/[?#]/)[0];
  if (knownPaths.has(clean) || clean.startsWith('/wp-content/')) return path;
  if (!resolved.has(clean)) {
    resolved.set(
      clean,
      fetch(SITE + clean, { redirect: 'manual' }).then((res) => {
        const location = res.headers.get('location');
        if (res.status >= 300 && res.status < 400 && location) return localizeUrls(location);
        if (res.status !== 200) console.log(`  unresolved link ${clean} (HTTP ${res.status})`);
        return clean;
      }),
    );
  }
  return resolved.get(clean);
}

// The wp-o-matic image cache has been gone for years. Recover the image from the
// Blogspot original it links to, otherwise drop the broken image.
const recoveredHosts = /^https?:\/\/(?:\d\.bp\.blogspot\.com|lh\d\.ggpht\.com)\//;
async function recoverImage(url) {
  const name = decodeURIComponent(url.split('/').pop()).replace(/[^\w.-]+/g, '-');
  const path = `/wp-content/uploads/recovered/${createHash('md5').update(url).digest('hex').slice(0, 8)}-${name}`;
  const dest = join(PUBLIC_DIR, path);
  if (await exists(dest)) return path;
  const res = await fetch(url.replace(/^http:/, 'https:')).catch(() => null);
  if (!res?.ok || !res.headers.get('content-type')?.startsWith('image/')) return null;
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  return path;
}

const cacheImg = String.raw`!\[([^\]]*)\]\(/wp-content/plugins/wp-o-matic/[^)]+\)`;

async function toMarkdown(html) {
  let md = turndown.turndown(localizeUrls(html));
  md = await replaceAsync(md, new RegExp(String.raw`\[${cacheImg}\]\(([^)\s]+)[^)]*\)`, 'g'), async (_, alt, href) => {
    const path = recoveredHosts.test(href) ? await recoverImage(href) : null;
    return path ? `[![${alt}](${path})](${path})` : '';
  });
  md = md.replace(new RegExp(cacheImg, 'g'), '').replace(/\[([^\]]*)\]\(\/wp-content\/plugins\/wp-o-matic\/[^)]*\)/g, '$1');
  for (const path of DROPPED_PATHS) {
    // Unwrap links to pages that no longer exist, keeping their text.
    const escaped = path.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
    md = md.replace(new RegExp(`\\[([^\\]]*)\\]\\(${escaped}?\\)`, 'g'), '$1');
  }
  md = await replaceAsync(md, /\]\((\/[^)\s]*)/g, async (_, p) => `](${await resolvePath(p)}`);
  md = await replaceAsync(md, /href="(\/[^"]*)"/g, async (_, p) => `href="${await resolvePath(p)}"`);
  md = md.replace(/src="http:\/\/(www\.youtube\.com|player\.vimeo\.com|maps\.google\.com)/g, 'src="https://$1');
  return md.replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

const yaml = (v) => JSON.stringify(v);

function frontmatter(fields) {
  const lines = Object.entries(fields)
    .filter(([, v]) => v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0))
    .map(([k, v]) => (Array.isArray(v) ? `${k}:\n${v.map((x) => `  - ${yaml(x)}`).join('\n')}` : `${k}: ${yaml(v)}`));
  return `---\n${lines.join('\n')}\n---\n\n`;
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function download(path) {
  const dest = join(PUBLIC_DIR, path);
  if (await exists(dest)) return 'skipped';
  const res = await fetch(SITE + encodeURI(path));
  if (!res.ok) return `HTTP ${res.status}`;
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  return 'ok';
}

async function pool(items, size, fn) {
  const results = [];
  const queue = [...items];
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (queue.length) {
        const item = queue.shift();
        results.push([item, await fn(item)]);
      }
    }),
  );
  return results;
}

const [posts, pages, categories, tags, media, users] = await Promise.all([
  fetchAll('posts'),
  fetchAll('pages'),
  fetchAll('categories'),
  fetchAll('tags'),
  fetchAll('media', '&_fields=id,source_url'),
  fetchAll('users').catch(() => []),
]);
console.log(`Fetched ${posts.length} posts, ${pages.length} pages, ${media.length} media`);

const categoryById = new Map(categories.map((c) => [c.id, c]));
const tagById = new Map(tags.map((t) => [t.id, t]));
const mediaById = new Map(media.map((m) => [m.id, m.source_url]));
const userById = new Map(users.map((u) => [u.id, u.name]));

const keptPages = pages.filter((p) => !SKIP_PAGES.has(p.slug));
const terms = {
  categories: categories.filter((c) => c.count > 0).map(({ slug, name, description }) => ({ slug, name: decode(name), description })),
  tags: tags.filter((t) => t.count > 0).map(({ slug, name }) => ({ slug, name: decode(name) })),
};
// Every URL the old site served, used by scripts/check-urls.mjs.
const oldUrls = [...posts, ...keptPages].map((x) => new URL(x.link).pathname);
oldUrls.push(...terms.categories.map((c) => `/category/${c.slug}/`), ...terms.tags.map((t) => `/tag/${t.slug}/`));
for (const url of oldUrls) knownPaths.add(url);

await rm(POSTS_DIR, { recursive: true, force: true });
await rm(PAGES_DIR, { recursive: true, force: true });
await mkdir(POSTS_DIR, { recursive: true });

for (const post of posts) {
  const featured = mediaById.get(post.featured_media);
  const fields = {
    title: decode(post.title.rendered),
    date: post.date,
    path: new URL(post.link).pathname,
    author: userById.get(post.author),
    categories: post.categories.map((id) => categoryById.get(id)?.slug).filter((s) => s && s !== 'uncategorized'),
    tags: post.tags.map((id) => tagById.get(id)?.slug).filter(Boolean),
    featuredImage: featured ? localizeUrls(featured) : undefined,
    excerpt: excerptOf(post.excerpt.rendered),
  };
  const file = join(POSTS_DIR, `${post.date.slice(0, 10)}-${post.slug}.md`);
  await writeFile(file, frontmatter(fields) + (await toMarkdown(post.content.rendered)));
}

for (const page of keptPages) {
  const path = new URL(page.link).pathname;
  const fields = {
    title: decode(page.title.rendered),
    path,
    order: page.menu_order,
    excerpt: excerptOf(page.excerpt.rendered),
  };
  const file = join(PAGES_DIR, `${path.replace(/^\/|\/$/g, '')}.md`);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, frontmatter(fields) + (await toMarkdown(page.content.rendered)));
}

await writeFile(join(ROOT, 'src/data/terms.json'), JSON.stringify(terms, null, 2) + '\n');
await writeFile(join(ROOT, 'scripts/wp-urls.json'), JSON.stringify(oldUrls.sort(), null, 2) + '\n');

for (const url of EXTRA_UPLOADS) localizeUrls(url);
const results = await pool([...uploads], 8, download);
const failed = results.filter(([, r]) => r !== 'ok' && r !== 'skipped');
console.log(`Uploads: ${results.length} referenced, ${results.filter(([, r]) => r === 'ok').length} downloaded, ${failed.length} failed`);
for (const [path, r] of failed) console.log(`  ${r}  ${path}`);

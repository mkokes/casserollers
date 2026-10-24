// Verifies the built site covers every URL the WordPress site served
// (scripts/wp-urls.json, written by import-wp.mjs) and that every local
// link and image in the output resolves. Run after `npm run build`.
import { readFile, readdir, access } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const exists = (p) => access(p).then(() => true, () => false);
const target = (path) => join(DIST, decodeURI(path), path.endsWith('/') ? 'index.html' : '');

const oldUrls = JSON.parse(await readFile(join(ROOT, 'scripts/wp-urls.json'), 'utf8'));
const missingPages = [];
for (const url of oldUrls) if (!(await exists(target(url)))) missingPages.push(url);

const htmlFiles = (await readdir(DIST, { recursive: true })).filter((f) => f.endsWith('.html'));
const brokenRefs = new Map();
for (const file of htmlFiles) {
  const html = await readFile(join(DIST, file), 'utf8');
  for (const [, ref] of html.matchAll(/(?:href|src)="(\/(?!\/)[^"#?]*)/g)) {
    if (!(await exists(target(ref)))) brokenRefs.set(ref, file);
  }
}

console.log(`${oldUrls.length - missingPages.length}/${oldUrls.length} old URLs present`);
for (const url of missingPages) console.log(`  missing page: ${url}`);
console.log(`${brokenRefs.size} broken local references in ${htmlFiles.length} HTML files`);
for (const [ref, file] of brokenRefs) console.log(`  ${ref}  (in ${file})`);
process.exit(missingPages.length || brokenRefs.size ? 1 : 0);

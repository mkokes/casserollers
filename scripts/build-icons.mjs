// Renders public/icons/icon.svg to the PNG sizes the web manifest, favicon and
// iOS home screen need. Re-run after editing the SVG; the PNGs are committed.
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ICONS = fileURLToPath(new URL('../public/icons/', import.meta.url));
const SIZES = { 'icon-192.png': 192, 'icon-512.png': 512, 'apple-touch-icon.png': 180, 'favicon-32.png': 32 };

for (const [name, size] of Object.entries(SIZES)) {
  await sharp(ICONS + 'icon.svg', { density: 300 }).resize(size, size).png().toFile(ICONS + name);
  console.log(`${name} (${size}x${size})`);
}

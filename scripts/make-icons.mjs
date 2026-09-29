// Generates favicon and app icons from the theme colors in site.config.ts (same mark as the Logo component).
// Run: npm run icons
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';

const cfg = readFileSync(new URL('../src/config/site.config.ts', import.meta.url), 'utf8');
const pick = (key) => cfg.match(new RegExp('[^A-Za-z]' + key + ": *'(#[0-9A-Fa-f]{6})'"))[1];
const ink = pick('ink');
const coral = pick('coral');
const name = cfg.match(/name:\s*'([^']+)'/)[1];
const shortName = cfg.match(/shortName:\s*'([^']+)'/)[1];

// pad shrinks the mark for maskable/app icons that need a safe zone
const svg = (pad = 0) => {
  const s = (40 - pad * 2) / 40;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
  <rect width="40" height="40" rx="${pad ? 0 : 9}" fill="${ink}"/>
  <g transform="translate(${pad} ${pad}) scale(${s})">
    <path d="M8 32V22l12-12h12" fill="none" stroke="${coral}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="20" cy="10" r="4" fill="${ink}" stroke="#fff" stroke-width="3"/>
    <circle cx="8" cy="32" r="4" fill="${ink}" stroke="#fff" stroke-width="3"/>
  </g>
</svg>`;
};

writeFileSync('public/favicon.svg', svg());
for (const [file, size, pad] of [['public/favicon-32.png', 32, 0], ['public/apple-touch-icon.png', 180, 5], ['public/icon-192.png', 192, 5], ['public/icon-512.png', 512, 5]]) {
  await sharp(Buffer.from(svg(pad))).resize(size, size).png().toFile(file);
}
writeFileSync('public/site.webmanifest', JSON.stringify({
  name, short_name: shortName, lang: 'he', dir: 'rtl', start_url: '/', display: 'standalone',
  background_color: ink, theme_color: ink,
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
  ],
}, null, 2));
console.log('icons written');

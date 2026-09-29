import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync, appendFileSync } from 'node:fs';

// The site URL lives in src/config/site.config.ts. It is read here with a regex so the
// config stays the only place to change it, without importing image assets into this file.
const configSource = readFileSync(new URL('./src/config/site.config.ts', import.meta.url), 'utf8');
const siteUrl = configSource.match(/url:\s*'([^']+)'/)[1];
const isDemo = /isDemo:\s*true/.test(configSource);

// Demo mode also sends X-Robots-Tag on every response (Cloudflare Pages reads dist/_headers).
const demoHeaders = {
  name: 'demo-noindex-header',
  hooks: {
    'astro:build:done': ({ dir }) => {
      if (isDemo) appendFileSync(new URL('_headers', dir), '\n/*\n  X-Robots-Tag: noindex, nofollow\n');
    },
  },
};

export default defineConfig({
  site: siteUrl,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  integrations: [
    demoHeaders,
    sitemap({
      filter: (page) => !page.includes('/thank-you/') && !page.includes('/404'),
    }),
  ],
});

# Plumbing company website template (demo: FlowLine, Rishon LeZion and the Shfela)

Static Astro site, Hebrew RTL, for a plumbing company with a 24/7 dispatch desk and several technicians.
The same code can be offered to another company by editing one file.

## New client in 4 steps

1. **Edit `src/config/site.config.ts`** - identity, company numbers and promises, manager story, phone and
   WhatsApp, theme colors, services (one page each, each with its own line color and price rows), service
   areas (one page each, with map position, route from the depot, base arrival time and local content),
   rush-hour windows, emergency first steps, leak-test tariff, recent jobs, reviews, FAQ, form destinations
   and legal details. Nothing client-specific is typed into pages or components.
2. **Replace images** in `src/assets/img/` (same file names, or update the imports at the top of the config).
   See `CREDITS.md`.
3. **Set `site.url`** and **`site.isDemo: false`**. Demo mode adds `noindex` to every page, sends
   `X-Robots-Tag: noindex` from `dist/_headers`, blocks everything in `robots.txt`, and shows a demo banner
   and badge.
4. **Regenerate icons** after a color change: `npm run icons`, then `npm run build`.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server at http://localhost:4321 |
| `npm run build` | Build to `dist/` |
| `npm run preview` | Serve the built site |
| `npm run check` | Type-check Astro and TypeScript files |
| `npm run audit` | Check the build: broken links, orphans, titles, descriptions, H1, canonical, JSON-LD, alt, em dashes |
| `npm run icons` | Rebuild favicon and app icons from the theme colors |
| `npm run checklist` | Write the progress file for the Website Build Checklist |

## What is on the site

- **Dispatch map:** a schematic "metro map" of the service area with routes from the depot and live arrival
  estimates (Israel time, rush-hour extra on Sunday to Thursday). Each station links to its city page.
- **Flow line:** a vertical line with a station at each section heading runs down the home page and inner
  pages; on a service page it takes that service's color.
- **Live dispatch status** in a strip on every page.
- **Leak test:** a guided water-meter test with a timer that calculates liters and shekels lost per month.
- **Price estimator** and full price list per service.
- **Emergency page** with first steps per scenario (HowTo schema) and where to find the main valve.
- **Job log** instead of a before/after gallery: problem, solution, arrival time, duration and price.
- Schema: `Plumber` (24/7, areas, rating, offer catalog), `Service` with price ranges, `FAQPage`, `HowTo`,
  `BreadcrumbList`, `Review`, `Person`.

## Contact form

`form.destinations` in the config. Every lead goes to every destination in parallel; use two
(email via Web3Forms + a webhook to a Google Sheet) so no lead is lost. Empty list = demo mode.
Analytics (GA4) loads only after cookie consent; set `analytics.ga4`.

## Hosting

Built for Cloudflare Pages (any static host works). `public/_headers` holds security and cache headers.

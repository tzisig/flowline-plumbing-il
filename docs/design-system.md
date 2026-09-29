# Design system: FlowLine

## Concept

A transit map for a plumbing company. The brand name is "FlowLine", and what the company sells is
dispatch: a desk that sends the nearest van. So the site borrows the language of metro maps: the hero is
a schematic map with routes from the depot to six cities and live arrival times at each station, every
service has its own line color, and a single "flow line" runs down the page with a station at each
section heading. The map is the one bold element; the rest is plain panels on a cool gray page.

It is deliberately different from the other demo sites: the solo plumber (navy and orange blueprint),
the electrician (fuse-box labels), and the florist (serif herbarium in grape and vine green).

## Color

| Token | Hex | Use |
| --- | --- | --- |
| ink | `#10212b` | Headings, hero, footer, dark panels |
| inkSoft | `#1d3441` | Hover on dark buttons |
| coral | `#c9361f` | Primary buttons, the flow line, map routes, emergency |
| coralDeep | `#a82a16` | Button hover |
| teal | `#0a655c` | Links |
| paper | `#eef2f4` | Page background (cool gray) |
| panel | `#ffffff` | Cards and page heads |
| fog | `#dfe6ea` | Alternate sections |
| muted | `#51606a` | Secondary text |

Service line colors (each 4.5:1 with white text): emergency `#c9361f`, drains `#0e766b`, leaks `#2c5aa0`,
heaters `#9a5b00`, repiping `#6d4ab0`, pumps `#3b7a2a`. A color always appears next to the service
name, never alone. axe: 0 violations on every page, desktop and mobile.

## Type

One family: **Noto Sans Hebrew** (variable, width and weight axes, self-hosted).
- Headings: weight 800 at 75% width, like transit signage.
- Body: weight 400 at full width, 17px / 1.65.
- Numbers (phone, times, prices) use tabular figures.

## Layout

- The flow line sits on the inline-start edge of the content column; content is indented after it.
- Numbered circles only where content is a sequence (what happens after you call, the leak test steps).
- Cards only for real objects (jobs, reviews, services); everything else is rows and tables.

## Motion

One moment: the map routes draw in on page load. The live-status dot pulses. Both are off under
`prefers-reduced-motion`.

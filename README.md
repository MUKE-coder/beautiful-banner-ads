# beautiful-banner-ads

> Beautiful, on-brand banner ads for React — drop in, looks polished, fully yours.

`beautiful-banner-ads` is a small React component library for **first-party self-promotion** banners. You install it, pass in your content (text, image, CTA), and you get an ad that looks designed — no CSS to write, no ad network, no tracking, no third-party demand.

Status: **scaffolding** — building toward v1.

## What you get (v1)

- `<BannerAd>` — full-width / N%-width strip ad (Dribbble-style promo bar).
- `<BrandedBanner>` — premium branded banner with transparent product image + CTA.
- `<MediaBanner>` — video, GIF, or SVG hero banner.
- `<CustomBanner>` — headless/composable shell (`Banner.Media`, `Banner.Body`, `Banner.CTA`, `Banner.Close`).
- `<AdSlot>` — placement (top/bottom/inline/corner, sticky) + **opt-in** rotation across an array of ads.

All five components are:

- Beautiful by default — zero styling props required.
- Themed: `light`, `dark`, `system` (follows `prefers-color-scheme`).
- Works **with** and **without** Tailwind.
- TypeScript-first, SSR-safe, accessible, tree-shakeable.
- Callback-only analytics (`onView`, `onClick`, `onClose`) — no tracking, no storage by default.

## Quickstart

> Coming as Phase 9 lands. For now, see the spec docs in this repo for the full design and API.

## Design & philosophy

- [`project-description.md`](./project-description.md) — what this package is, scope, philosophy, component catalog.
- [`project-phases.md`](./project-phases.md) — the phased build plan (Phase 0 → 10).
- [`design-style-guide.md`](./design-style-guide.md) — the complete visual design system (color tokens, typography, motion, component specs).

## License

[MIT](./LICENSE) © MUKE JOHNBAPTIST

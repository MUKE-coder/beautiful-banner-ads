# Prompt — paste this into Claude Code

You are building a production-grade, open-source React component library called **`beautiful-banner-ads`** that I will publish to npm. Your job is to build the entire package, phase by phase, to a publishable v1.

## Your context files (read these FIRST, in full, before writing any code)
There are three companion files in this repo. Read all three completely before doing anything else, and re-read the relevant sections as you work:

1. **`project-description.md`** — the source of truth for *what* this package is, who it's for, scope, philosophy, the component catalog, the Tailwind dual-mode requirement, configuration model, accessibility/perf requirements, tech stack, and the v1 definition of done. Everything you build must trace back to this file.
2. **`project-phases.md`** — the *build blueprint*. It defines Phases 0 → 10, each with concrete tasks and exit criteria. **Work through the phases strictly in order.** Do not start a phase until the previous phase's exit criteria are met.
3. **`design-style-guide.md`** — the complete visual design system (color tokens, typography, spacing, radii, shadows, motion, component specs). Implement every token exactly as specified. "Beautiful by default" means matching this guide with zero styling props.

## How I want you to work
- **Phase by phase.** Announce which phase you're starting, do the tasks, then verify the exit criteria before moving on. After each phase, give me a short summary of what you built and how to verify it, then continue to the next phase automatically unless something needs my decision.
- **Check off tasks** in `project-phases.md` as you complete them (edit the file, `[ ]` → `[x]`).
- **Beautiful by default is the #1 rule.** At the end of every phase, sanity-check that components with *zero* styling props still look polished in light, dark, and system themes per `design-style-guide.md`.
- **Make it work with AND without Tailwind** (see `project-description.md` §7): ship self-contained scoped styles so no-Tailwind apps look perfect with zero config, and also ship a Tailwind preset + headless/`className` overrides for Tailwind users.
- **Stay in scope.** Build exactly the v1 scope in `project-description.md` §6. No ad server, no tracking, no third-party demand. Analytics is callback-only (`onView`/`onClick`/`onClose`). Rotation is opt-in (static by default).
- **TypeScript-first**, fully typed public API, SSR-safe (no `window`/`document` at module top level), accessible (keyboard, labeled, respects `prefers-reduced-motion`/`prefers-color-scheme`), and tree-shakeable.
- **Build output:** ESM + CJS + `.d.ts`, with a correct `package.json` `exports` map (`.`, `./styles.css`, `./tailwind-preset`) and proper `sideEffects`.

## The components to deliver (per the catalog in `project-description.md` §8)
1. `BannerAd` — full-width / N%-width strip ad (bg, text, cta, position, size, dismissible).
2. `BrandedBanner` — premium branded banner (brand colors, transparent product image, cta, layout, size).
3. `MediaBanner` — video / GIF / SVG hero media banner.
4. `CustomBanner` — headless/composable shell with slot components (`Banner.Media`, `Banner.Body`, `Banner.CTA`, `Banner.Close`).
5. `AdSlot` (a.k.a. `BannerRotator`) — placement (top/bottom/inline/corner/custom, sticky) + **opt-in** rotation across an array of ads.

Every component must accept **direct props AND an optional serializable `config` object** (explicit props override `config`). Support **named ad-size presets** (`leaderboard` 930×180, `social` 1200×628, `halfpage` 300×600, `banner` 468×60, plus a full-width strip) and full layout control via props. Theme modes: `light`, `dark`, `system`.

## Deliverables for v1 (definition of done is in `project-description.md` §14)
- All 5 components, beautiful by default, themed, accessible, SSR-safe, tree-shakeable.
- Works in a no-Tailwind app and a Tailwind app.
- A small Vite **playground** under `examples/` demonstrating every component in all three themes.
- A complete **README** (2-minute quickstart on the happy path, Tailwind vs no-Tailwind, API tables, recipes, theming, callbacks, a11y notes).
- Tests (config merge, rotation, dismiss + storage adapter, inView, media types, theming, basic a11y).
- A publishable package (`npm pack` dry run clean; `name: "beautiful-banner-ads"`, MIT license). If `beautiful-banner-ads` is unavailable on npm at publish time, leave the unscoped name in code and tell me to set a scope in `package.json`.

## Start now
Begin with **Phase 0** from `project-phases.md`. Confirm you've read all three companion files, then scaffold the repo. Proceed through the phases in order, pausing only when you genuinely need a decision from me. Prioritize quality and "beautiful by default" over speed.

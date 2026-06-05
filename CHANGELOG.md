# Changelog

All notable changes to `beautiful-banner-ads` are documented here. Format adapted from [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning follows [SemVer](https://semver.org/).

## [0.1.0] — 2026-06-05

The initial public release. Everything in `project-description.md` §14's Definition of Done for v1 is implemented:

### Added

- **5 React components**: `BannerAd`, `BrandedBanner`, `MediaBanner`, `CustomBanner` (headless + slots), `AdSlot` (with `BannerRotator` alias and opt-in rotation).
- **Themed**: light / dark / system modes via CSS custom properties; `ThemeProvider`, `useTheme`, `useSystemTheme`, `useResolvedTheme` hooks.
- **Tailwind dual-mode**: scoped stylesheet auto-injects in no-Tailwind apps; a `beautiful-banner-ads/tailwind-preset` export mirrors every token as `theme.extend` entries via `var(--bba-*)` references.
- **Full layout / sizing control**: `position` (`top` / `bottom` / `inline` / `corner` / `custom`), `sticky`, `corner`, `offset`, `width`, plus named ad-size presets (`leaderboard` 930×180, `social` 1200×628, `halfpage` 300×600, `banner` 468×60, `fullwidth-strip`, and `sm`/`md`/`lg`).
- **Props + JSON `config`**: every component accepts a serializable `BannerConfig` object; explicit props always override.
- **Callback-only analytics**: `onView` (50% IntersectionObserver, fires once), `onClick`, `onClose`. Receive `adMeta: { id, type, config }`.
- **Optional dismiss persistence** via a developer-supplied `StorageAdapter`. The package never touches storage on its own.
- **Accessibility**: `role="complementary"` + labelled close button + visible focus rings; respects `prefers-reduced-motion` (no autoplay video, no rotation auto-advance) and `prefers-color-scheme`.
- **SSR-safe**: no `window` / `document` at module top level; matchMedia / IntersectionObserver only touched in effects.
- **Tree-shakeable**: ESM-first, `sideEffects: ["./dist/styles.css", "**/*.css"]`, no top-level imports drag in unused components.
- **Build output**: ESM + CJS + `.d.ts` / `.d.cts` for both `import` and `require`, sourcemaps, `dist/styles.css`. Total tarball ≈ 86 KB packed.
- **MIT licensed** © MUKE JOHNBAPTIST.

### Tests

114 passing across 17 files (Vitest + Testing Library + jsdom): config-merge precedence, dismiss + storage adapter, inView fires once, CTA element switching, theme resolution, banner integration for all 5 components, layout/positioning, size presets, rotation cycling, pause-on-hover.

### Intentionally NOT in v1

No ad server, no hosted dashboard, no third-party demand, no built-in tracking, no A/B engine, no weighted rotation, no non-React framework adapters. See `project-description.md` §6.

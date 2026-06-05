# Project Phases — `beautiful-banner-ads`

> The build blueprint. Work through phases **in order**. Do not start a phase until the previous one's "Exit criteria" are met. Each task is small and checkable. Check tasks off as you go. Refer to `project-description.md` for the *what/why* and `design-style-guide.md` for the *look*.

**Legend:** `[ ]` = todo, `[x]` = done. Each phase ends with **Exit criteria** that must be true before moving on.

---

## Phase 0 — Repo & tooling foundation

Goal: an empty-but-correct, publishable, typed React library skeleton that builds.

**Tasks**
- [x] Initialize repo: `package.json`, `.gitignore`, `LICENSE` (MIT), `README.md` stub.
- [x] Set package name to `beautiful-banner-ads`; set `version` `0.1.0`; mark `private: false` only at publish time.
- [x] Add TypeScript with a strict `tsconfig.json` (strict, `jsx: react-jsx`, `declaration`, `isolatedModules`).
- [x] Add React 18/19 as `peerDependencies` (and devDeps for local dev). Do NOT bundle React.
- [x] Set up the bundler (recommend `tsup`) to output **ESM + CJS + `.d.ts`**.
- [x] Configure `package.json` `exports` map with entries for `.`, `./styles.css`, and `./tailwind-preset`. Set `main`, `module`, `types`, `files` whitelist, and `sideEffects` (CSS files listed as side-effectful, JS side-effect-free).
- [x] Add ESLint + Prettier configs and `lint`/`format` scripts.
- [x] Add test runner (recommend Vitest + @testing-library/react + jsdom) with a sample passing test.
- [x] Add scripts: `build`, `dev` (watch), `test`, `lint`, `typecheck`, `clean`.
- [x] Create folder structure: `src/`, `src/components/`, `src/primitives/`, `src/hooks/`, `src/theme/`, `src/utils/`, `src/types/`, `examples/`.

**Exit criteria:** `npm run build` produces ESM+CJS+types with no errors; `npm test` passes the sample test; `npm run typecheck` is clean. ✅

---

## Phase 1 — Design tokens & theming engine

Goal: the visual foundation. Tokens + light/dark/system theming, working with and without Tailwind.

**Tasks**
- [ ] Implement the full design-token set from `design-style-guide.md` as **CSS custom properties** (color, typography, spacing, radii, shadow, motion, z-index).
- [ ] Create a scoped base stylesheet (`src/theme/styles.css` → built to `beautiful-banner-ads/styles.css`) using a root scope class (e.g. `.bba-root`) so styles never leak.
- [ ] Implement light theme + dark theme token sets and a `system` mode that reads `prefers-color-scheme` and updates live (with an SSR-safe guard).
- [ ] Build a `ThemeProvider` (optional) and a `useTheme`/`useResolvedTheme` hook; also allow per-component `theme` prop without a provider.
- [ ] Implement a **style auto-injection** mechanism so a no-Tailwind consumer gets styles without manual CSS import (but ALSO export `styles.css` for those who prefer explicit import / SSR). Inject once, idempotent, SSR-safe.
- [ ] Create the **Tailwind preset** (`src/theme/tailwind-preset.ts` → `beautiful-banner-ads/tailwind-preset`) exporting the same tokens as Tailwind theme extensions.
- [ ] Implement a className-merge utility that lets consumer classes override package defaults predictably (low specificity defaults).
- [ ] Implement `prefers-reduced-motion` token/flag wiring.

**Exit criteria:** A throwaway component using the tokens renders identically in a no-Tailwind app and a Tailwind app; toggling light/dark/system visibly changes the theme; styles are scoped (no leakage proven by a test page with conflicting global CSS).

---

## Phase 2 — Core primitives & headless engine (the foundation all ads share)

Goal: the composable shell every banner is built on, plus the cross-cutting behaviors.

**Tasks**
- [ ] Define shared **TypeScript types**: `AdMeta`, `CTA`, `Position`, `SizePreset`, `ThemeMode`, `MediaSpec`, `BannerConfig`, `StorageAdapter`, callback signatures (`onView`, `onClick`, `onClose`).
- [ ] Build the **`Banner` (CustomBanner) primitive**: a beautiful, theme-aware shell container that accepts children/slots, handles theming, role/aria labeling ("Advertisement"), and forwards refs.
- [ ] Build **slot components** under a shared namespace: `Banner.Media`, `Banner.Body` (title/subtitle/text), `Banner.CTA`, `Banner.Close`.
- [ ] Implement **`useInView`** hook (IntersectionObserver, SSR-safe) → fires `onView` once per impression.
- [ ] Implement **`useDismiss`** hook: close state + `onClose`, optional persistence via a developer-supplied `StorageAdapter` (package never touches storage itself).
- [ ] Implement the **config-merge utility**: merge `config` object with explicit props (explicit props win, per `project-description.md` §9).
- [ ] Implement **CTA rendering**: anchor when `href`, button when `onClick`, accessible either way; fires `onClick(adMeta, e)`.
- [ ] Implement **a11y + keyboard**: focus styles, close button is a real labeled `<button>`, container labeling.
- [ ] Unit tests: config-merge precedence, dismiss + storage adapter, inView fires once, CTA renders correct element.

**Exit criteria:** `<CustomBanner>` can be composed from slots into a good-looking ad with zero extra CSS; view/click/close callbacks fire correctly in tests; dismissal persistence works through a mock storage adapter.

---

## Phase 3 — Layout, positioning & sizing system

Goal: "full layout control via props" — position, sizing (incl. named ad presets), alignment, sticky/corner.

**Tasks**
- [ ] Implement `position`: `top`, `bottom`, `inline`, `corner`, `custom`. `top`/`bottom` support `sticky`. `corner` floats (toast-like) with configurable corner + offset.
- [ ] Implement z-index layering tokens so sticky/corner ads sit above content predictably.
- [ ] Implement `width`: `full`, percentage (e.g. `80%`), explicit px/CSS values.
- [ ] Implement `size` presets (`sm`/`md`/`lg`) mapping to height/padding/typography.
- [ ] Implement **named ad-size presets** matching Image 2: `leaderboard` (≈728/930×~90/180), `social` (1200×628), `halfpage` (300×600), `banner` (468×60), plus `fullwidth-strip`. Document exact dimensions.
- [ ] Implement alignment/ordering props (media left/right/background; text alignment; CTA placement).
- [ ] Ensure responsive behavior: graceful down-scaling on small screens; presets adapt or scroll sensibly.
- [ ] Tests/visual checks for each position and preset.

**Exit criteria:** A developer can place a sticky bottom strip, a floating corner ad, an inline ad, and a fixed-size 300×600 ad purely via props, and each looks correct and responsive.

---

## Phase 4 — `BannerAd` (full-width / N%-width strip)

Goal: the Dribbble-style strip ad (Image 1), beautiful by default.

**Tasks**
- [ ] Build `<BannerAd>` on top of the `Banner` primitive: props `bg`, `title`, `subtitle`/`text`, `cta`, `position`, `width`, `size`, `dismissible`, `theme`, callbacks, and `config`.
- [ ] Beautiful default layout: text block + CTA, balanced spacing, works at `full` and `80%` widths.
- [ ] Support `bg` as solid color, gradient, or token; ensure text contrast (auto on-bg color from theme).
- [ ] Sticky top/bottom variants polished (matches the "Get 20% off" bottom bar vibe).
- [ ] Dismiss button styled and accessible.
- [ ] Snapshot/visual test in light/dark/system; verify zero-prop default looks great.

**Exit criteria:** `<BannerAd title="..." cta={{label,href}} />` with no styling props looks like a polished promo strip in all three themes.

---

## Phase 5 — `BrandedBanner` (premium branded campaign)

Goal: the inkwell-style branded banner (Image 2): brand colors + transparent product image + CTA.

**Tasks**
- [ ] Build `<BrandedBanner>`: props `brandColors` (primary/accent/bg/text or palette), `image` (transparent cutout), `title`, `subtitle`, `cta`, `position`, `size`, `layout` (image left/right/bg), `theme`, callbacks, `config`.
- [ ] Derive a harmonious palette from `brandColors` (e.g. accent on CTA, brand bg, readable text) with sensible auto-contrast.
- [ ] Beautiful image placement: transparent product image bleeds/overlaps tastefully; layout variants (image-left, image-right, image-as-background).
- [ ] Make it render correctly at the named ad-size presets (930×180, 1200×628, 300×600, 468×60) — the "one campaign, many sizes" use case.
- [ ] Polished CTA + secondary line (e.g. "Free delivery incl.*").
- [ ] Visual tests across presets + themes; verify it matches the premium reference quality.

**Exit criteria:** Passing only brand colors, a transparent image, a title, and a CTA yields a banner of the quality shown in Image 2 across the size presets.

---

## Phase 6 — `MediaBanner` (video / GIF / SVG)

Goal: same beautiful shell, hero visual is rich media.

**Tasks**
- [ ] Build `<MediaBanner>` with `media={{ type: 'video'|'gif'|'svg', src, poster?, autoplay?, loop?, muted? }}` + standard text/cta/position/size/theme/callbacks/config.
- [ ] Video: muted autoplay + loop options, `poster`, lazy-load, **respect `prefers-reduced-motion`** (no autoplay motion when set — show poster).
- [ ] GIF: render efficiently; optional play/pause respecting reduced-motion.
- [ ] SVG: support inline SVG string and `src`; ensure it scales and is theme-aware where appropriate.
- [ ] Dev warning if `media` missing/invalid.
- [ ] Tests: media type switch renders correct element; reduced-motion disables autoplay.

**Exit criteria:** Each media type renders beautifully inside the shell; reduced-motion is honored; SSR-safe.

---

## Phase 7 — `AdSlot` / rotation (placement + optional rotation)

Goal: a wrapper that handles placement and **opt-in** rotation across an array of ads.

**Tasks**
- [ ] Build `<AdSlot>` (alias/export `<BannerRotator>` if helpful): accepts a single ad (child or `ad` config) OR `ads={[...]}` array.
- [ ] Implement rotation as **opt-in**: `rotate` off → show first/chosen ad (static, the default). `rotate={{ interval, pauseOnHover?, random?, transition? }}` → cycle.
- [ ] Respect `prefers-reduced-motion`: no animated transitions / optionally pause auto-advance when set.
- [ ] Owns position/sticky/corner/layout for whatever ad it wraps; forwards per-ad `onView`/`onClick`/`onClose` with correct `adMeta`.
- [ ] Handle dismissal of one ad within a rotating set gracefully (skip dismissed).
- [ ] Tests: static by default; rotation advances on interval; pause-on-hover; reduced-motion disables auto-advance; callbacks carry correct ad meta.

**Exit criteria:** A single `<AdSlot ads={[...]}>` shows one ad by default and cycles only when `rotate` is set; works with all banner types as children.

---

## Phase 8 — Config-from-JSON & full DX polish

Goal: make props + optional JSON config first-class and the API delightful.

**Tasks**
- [ ] Verify every component accepts a serializable `config` object equivalent to its props; document precedence (explicit props override `config`).
- [ ] Verify `AdSlot ads={adsFromJson}` works from a plain JSON array (handlers attachable in code).
- [ ] Export all public types; ensure great autocomplete and JSDoc on every prop.
- [ ] Add dev-only warnings for common mistakes (missing media, no CTA, invalid position).
- [ ] Ensure tree-shaking: importing only `BannerAd` doesn't pull in video/rotation code.
- [ ] Finalize `exports` map and confirm `import "beautiful-banner-ads/styles.css"` + auto-inject both work.

**Exit criteria:** Both props-only and JSON-config usage work for every component; types are complete; unused components are tree-shaken out of a sample build.

---

## Phase 9 — Examples, docs & demo playground

Goal: a developer can copy-paste their way to success.

**Tasks**
- [ ] Build a small Vite **playground app** under `examples/` showing every component in light/dark/system, with a theme toggle.
- [ ] Add "recipes": sticky bottom strip, floating corner ad, branded campaign across sizes, rotating sidebar, video banner, JSON-driven slot.
- [ ] Write the **README**: install, 2-minute quickstart (the happy path with zero styling), Tailwind vs no-Tailwind notes, component API tables, recipes, theming/tokens, analytics callbacks, accessibility notes.
- [ ] Add per-component usage snippets that are copy-paste runnable.
- [ ] Add a CONTRIBUTING note and a short CHANGELOG.

**Exit criteria:** Following only the README quickstart, a fresh app shows a beautiful ad in under 2 minutes; the playground runs and demonstrates all features.

---

## Phase 10 — Test, harden & publish

Goal: ship it.

**Tasks**
- [ ] Round out unit + component tests (config merge, rotation, dismiss/storage, inView, media types, theming). Aim for meaningful coverage on logic.
- [ ] Add basic accessibility assertions (roles/labels, keyboard, focus) on key components.
- [ ] Manually verify in: a no-Tailwind Vite app, a Tailwind app, and a Next.js app (SSR — no crashes, no hydration warnings).
- [ ] Check bundle size; ensure no accidental heavy deps; confirm `sideEffects` correctness.
- [ ] Final `package.json` audit: `name`, `version`, `exports`, `files`, `peerDependencies`, `license`, `repository`, `keywords`, `description`.
- [ ] Verify build artifacts (`npm pack` dry run): correct files included, types resolve, CSS present.
- [ ] Tag `v0.1.0` (or `1.0.0` if confident) and publish to npm. Note the scoped-name fallback from `project-description.md` §5 if the name is taken.

**Exit criteria:** `npm pack` looks correct; installs cleanly in the three test apps; all DoD items in `project-description.md` §14 are satisfied; package is published.

---

## Cross-phase, always-on rules
- Keep it **beautiful by default** — re-check every component with zero styling props at the end of each phase.
- Keep it **SSR-safe** — never touch `window`/`document` at module top level.
- Keep it **accessible** and **reduced-motion-respecting** in every component you add.
- Keep it **tree-shakeable** — no top-level side effects in JS, no cross-imports that defeat splitting.
- Keep it **typed** — public surface fully typed, no `any` leaking out.
- Match **`design-style-guide.md`** exactly for all visual tokens.

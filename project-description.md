# Project Description — `beautiful-banner-ads`

> The single source of truth for what this package is, who it's for, and how it must behave. Read this fully before writing any code. Every decision in the codebase should trace back to something written here.

---

## 1. One-line pitch

**`beautiful-banner-ads`** is a React component library that lets a developer drop in gorgeous, on-brand banner ads with a single install — beautiful by default, fully customizable when you want it.

You install it, pass in your content (text, image, CTA), and you get a polished ad. No design skills required. No CSS to write. It just looks good.

---

## 2. The problem we're solving

The author is a developer who runs a high-traffic portfolio/blog and owns several SaaS tools, courses, and events. They want to promote their own products on their own site using banner ads — but:

- Hand-rolling ad markup for every promo is tedious and the results look amateur.
- Existing ad tooling (AdSense, ad networks) is for *third-party* ads, takes a cut, injects tracking, and looks generic/spammy.
- Design systems exist, but nothing gives you **production-grade, beautiful ad banners out of the box** that you fully own and self-host.

There is no good "npm install and get beautiful ads I control" option. That's the gap.

**This package is for self-promotion / first-party ads.** The developer is advertising *their own* products on *their own* site. This is NOT an ad network, has no server, serves no third-party demand, and does no cross-site tracking.

---

## 3. Who uses this

- **Primary persona — "The Indie Builder":** a developer with a content site (blog, docs, portfolio) who wants to cross-promote their own SaaS, courses, events, newsletter, etc. Comfortable with React + props. Values speed and beauty. Will spend ~5 minutes integrating, not 5 hours.
- **Secondary persona — "The Agency Dev":** building marketing sites for clients, wants reusable, themeable ad slots they can hand brand colors to and get a premium result.

Both want: **beautiful by default, escape hatches when needed.**

---

## 4. Core philosophy / design principles

These are non-negotiable. When in doubt, follow these.

1. **Beautiful by default.** With *zero* styling props passed, every ad must look professionally designed. Defaults are opinionated and good. The "empty state" is never ugly.
2. **Progressive disclosure of complexity.** Simple things are simple (`<BannerAd text="..." cta="..." />`). Powerful things are possible (full layout control, custom render, JSON config). A beginner never sees the advanced API; an expert is never blocked by the simple one.
3. **Works with or without Tailwind.** The package must render perfectly whether the host app uses Tailwind or not (see §7). The developer should never *have* to configure Tailwind to use it.
4. **First-party, privacy-respecting.** No network calls, no tracking pixels, no external dependencies that phone home. Analytics is callback-based only (the developer wires up their own).
5. **Composable, not monolithic.** A small set of well-designed primitives that compose, rather than one giant do-everything component.
6. **Accessible.** Keyboard navigable, screen-reader friendly, respects `prefers-reduced-motion` and `prefers-color-scheme`. Ads are clearly labeled as promotional.
7. **Tiny and tree-shakeable.** A developer who only uses one banner type shouldn't ship the bytes for all of them.

---

## 5. The package name

**Published package name: `beautiful-banner-ads`**

- npm: `beautiful-banner-ads`
- Import root: `import { BannerAd, BrandedBanner, ... } from "beautiful-banner-ads"`
- This name is the working assumption. If it's taken on npm at publish time, fall back to `@<scope>/beautiful-banner-ads` (scoped) — keep the unscoped name everywhere in code/docs and let the author swap the scope in `package.json` at publish.

---

## 6. Scope — what the package DOES and DOES NOT do

### In scope (v1)
- A set of React banner ad **components** (see §8 for the catalog).
- **Full layout control via props** (position, size, alignment, spacing, ordering of slots).
- **Props + optional JSON config**: every ad accepts direct props, and you can alternatively pass a single config object / array. JSON config and props are interchangeable.
- **Three theme modes**: `light`, `dark`, `system` (follows `prefers-color-scheme`). Shipped and beautiful by default.
- **Optional rotation**: a slot can show one static ad OR rotate through an array of ads. Rotation is opt-in by the developer (off by default).
- **Media support**: image (transparent PNG/JPG/WebP), SVG, GIF, and video (mp4/webm) as the banner's visual.
- **Callback-based analytics**: `onView` (impression, via IntersectionObserver), `onClick`, `onClose`/dismiss. No built-in tracking, no storage by default.
- **Dismiss / close behavior** with optional "remember dismissal" via a developer-supplied storage hook (developer owns persistence).
- **Works with/without Tailwind** (see §7).
- **SSR-safe** (no crashes in Next.js / Remix server rendering), even though the primary render model is client-side.

### Explicitly OUT of scope (v1)
- No ad server, no hosted dashboard, no backend.
- No third-party ad network integration / programmatic demand.
- No A/B testing engine (rotation is dumb cycling; weighting is a possible v2).
- No built-in analytics storage/reporting (callbacks only).
- No frameworks other than React in v1 (Vue/Web Components are future work — keep core logic framework-agnostic where cheap, but don't over-engineer).
- No CMS/no-code editor.

---

## 7. The Tailwind dual-mode requirement (critical detail)

The package must "make it work both ways." Concretely:

- **Default (no Tailwind in host app):** The package ships its own **self-contained, scoped CSS** so components look perfect with zero setup. This is the default import. Styles must be scoped/prefixed so they cannot leak into or be clobbered by the host app. Prefer **CSS variables for theming** + a scoped stylesheet (or CSS-in-JS that injects once). The developer does `import "beautiful-banner-ads/styles.css"` (or styles auto-inject) and everything works.
- **Tailwind opt-in:** For developers who *do* use Tailwind and want their utility classes / design tokens to apply, expose:
  - A way to pass `className` / utility classes that override defaults cleanly (the package's own styles must have low-but-predictable specificity so user classes win).
  - An optional **Tailwind preset** (`beautiful-banner-ads/tailwind-preset`) exporting the design tokens (colors, spacing, radii, fonts) so a Tailwind user can theme consistently.
  - A `unstyled` / headless mode where the package provides structure + behavior and the developer brings all classes.

**Acceptance test:** In a plain Create-React-App/Vite app with no Tailwind, ads render beautifully. In a Tailwind app, the same ads render beautifully AND respect overrides. Neither requires reading docs beyond the install snippet for the happy path.

---

## 8. The component catalog (the "ad types")

These map directly to the author's examples. Each must be beautiful by default and accept both props and a config object.

1. **`<BannerAd>` — Full-width / N%-width strip ad.**
   - The "Dribbble-style" promo strip. Sits top, bottom, or inline. Sticky option.
   - Props: `bg`, `text`/`title`/`subtitle`, `cta` (label + href + onClick), `position` (top/bottom/inline/custom), `width` (`full` | `80%` | px | any CSS), `size` (sm/md/lg or explicit height), `dismissible`, `theme`.
   - Reference: Image 1 (Dribbble "Start a Project Brief" + the "Get 20% off" bottom bar).

2. **`<BrandedBanner>` — Premium branded banner.**
   - Brand colors + a **transparent product image** + CTA. The polished, designed "campaign" look.
   - Props: `brandColors` (primary/accent/bg/text or a palette), `image` (transparent product cutout), `title`, `subtitle`, `cta`, `position`, `size`, `layout` (image left/right/bg), `theme`.
   - Reference: Image 2 (the "inkwell — Print smarter. Save 50% on ink." multi-size campaign with brand kit).

3. **`<MediaBanner>` — Video / GIF / SVG banner.**
   - Same beautiful shell, but the hero visual is a `video` (mp4/webm, autoplay-muted-loop optional, respects reduced-motion), animated GIF, or inline SVG.
   - Props: `media` (`{ type: 'video'|'gif'|'svg', src, poster?, autoplay?, loop?, muted? }`), plus the standard text/cta/position/size/theme.

4. **`<CustomBanner>` — Bring-your-own.**
   - A headless/composable primitive: the package provides the beautiful **shell** (container, positioning, dismiss, view/click tracking, theming, slots) and the developer supplies children / a render function for full creative control.
   - Also the base that 1–3 are built on. Exposes slot components: `<BannerAd.Media>`, `<BannerAd.Body>`, `<BannerAd.CTA>`, `<BannerAd.Close>` (or a shared `Banner.*` namespace).

5. **`<AdSlot>` (or `<BannerRotator>`) — placement + optional rotation wrapper.**
   - Wraps any of the above. Accepts a single ad or an array. If given an array AND `rotate` is set, it cycles (interval, optional pause-on-hover, optional random order). If `rotate` is off, shows the first / a chosen one.
   - Owns: position, sticky behavior, layout control, and forwards view/click/close callbacks per-ad.

### Shared concepts across all components
- **`position`**: `top | bottom | inline | corner | custom`. `top`/`bottom` can be `sticky`. `corner` floats (like a toast). `inline` flows in content. `custom` = developer positions via wrapper/className.
- **`size`**: presets (`sm | md | lg`) that map to sensible heights/paddings/typography, OR explicit dimensions. Should also support the standard ad sizes shown in Image 2 (e.g. 930×180, 1200×628, 300×600, 468×60) as named presets (`leaderboard`, `social`, `halfpage`, `banner`, etc.).
- **`theme`**: `light | dark | system`.
- **`dismissible`** + `onClose`, with optional persistence via a developer-provided `storage` adapter (`{ get, set }`) — package never writes storage on its own.
- **Callbacks:** `onView(adMeta)`, `onClick(adMeta, event)`, `onClose(adMeta)`. `adMeta` includes id, type, and the ad's config so the developer can route to their own analytics.

---

## 9. Configuration model (props + optional JSON)

- Every component is usable purely via props for the simple case.
- Every component also accepts a single `config` object that mirrors the props (props win over `config` when both given, OR `config` is the sole source — pick one rule and document it; recommended: **explicit props override `config`**).
- `AdSlot` accepts `ads={[config, config, ...]}` — an array of these config objects — enabling rotation and central management.
- Config objects must be plain, serializable JSON (so a developer could load them from a CMS/JSON file). No functions required in config for the basic case; functions (onClick handlers) can be attached in code.

**Example mental model:**
```jsx
// Simplest
<BannerAd title="Save 20% on my course" cta={{ label: "Get it", href: "/course" }} />

// With config object
<BannerAd config={myAdConfig} />

// Rotating slot from JSON
<AdSlot position="bottom" sticky rotate={{ interval: 8000, pauseOnHover: true }} ads={adsFromJson} />
```

---

## 10. Theming & design tokens

- Theming is driven by **CSS custom properties** (design tokens) so it works with and without Tailwind, supports light/dark/system, and lets developers override at any scope.
- Token categories: color (bg, surface, text, muted, brand/primary, accent, on-brand, border), typography (font family heading/body, sizes, weights, line-heights), spacing scale, radii, shadows, motion (durations, easings), z-index layers (for sticky/corner).
- `system` theme reads `prefers-color-scheme` and updates live.
- The full token set and visual language live in **`design-style-guide.md`** — implement tokens to match it exactly.

---

## 11. Accessibility & performance requirements

- Each ad container has `role` and an accessible label indicating it's promotional (e.g. `aria-label="Advertisement"` / `role="complementary"`); close buttons are real `<button>`s with labels.
- Fully keyboard operable; visible focus states; dismiss reachable via keyboard.
- Respect `prefers-reduced-motion` (no autoplay video motion / no rotation animation when set).
- `onView` uses `IntersectionObserver`; lazy and cheap. Guard for SSR (no `window`/`document` at module top level).
- Images/video lazy-load where possible; provide `poster` for video; never block paint.
- Tree-shakeable exports; no large runtime deps. Keep bundle small.

---

## 12. Developer experience (DX) targets

- **Time-to-first-beautiful-ad: under 2 minutes.** Install → import → render → looks great.
- TypeScript-first: full types, exported types for every config/prop, great autocomplete.
- Helpful prop defaults; sensible errors in dev (e.g. warn if a `MediaBanner` gets no `media`).
- A `docs/` or README with copy-paste snippets for every component and a "recipes" section (sticky bottom bar, corner toast ad, rotating sidebar, branded campaign).
- Examples/playground (a small demo app) showing all components in light/dark/system.

---

## 13. Tech stack & tooling (target)

- **Language:** TypeScript.
- **Framework:** React 18+ (peer dependency; support 18 and 19). Hooks-based.
- **Styling:** CSS variables + a scoped stylesheet that auto-injects (default), plus an optional Tailwind preset. No mandatory CSS framework for consumers.
- **Build:** a modern bundler producing ESM + CJS + types (e.g. `tsup`). Side-effect-free where possible for tree-shaking. Ship `styles.css` as an entry.
- **Lint/format:** ESLint + Prettier.
- **Tests:** unit tests for logic (rotation, dismissal, config merge) + component tests (e.g. Vitest + Testing Library). Basic a11y checks.
- **Demo:** a Vite playground app under `examples/` or `playground/`.
- **Package hygiene:** `package.json` with correct `exports` map (`.`, `./styles.css`, `./tailwind-preset`), `sideEffects` set correctly, `peerDependencies` for React, `files` whitelist, README, LICENSE (MIT).

> If any tool choice conflicts with simplicity, prefer the simpler choice. The above are recommendations, not dogma — but the *outputs* (ESM+CJS+types, scoped styles, small bundle) are requirements.

---

## 14. Definition of done (v1)

The package is "done" for v1 when:
- All five catalog items (§8) exist, are typed, and are beautiful by default with zero required styling props.
- It renders correctly in a no-Tailwind app AND a Tailwind app.
- Light/dark/system theming works and is visually polished in all three.
- Rotation works and is opt-in; static is the default.
- Image, SVG, GIF, and video media all render correctly.
- `onView`, `onClick`, `onClose` callbacks fire correctly; dismissal works with optional storage adapter.
- Full layout control via props is implemented (position incl. sticky/corner, size incl. named ad presets, alignment).
- Props + optional JSON config both work and are documented.
- It's SSR-safe and accessible (keyboard, reduced-motion, labeled).
- It builds to ESM+CJS+types, is tree-shakeable, and is publishable to npm.
- README + a working demo/playground exist.

---

## 15. Anti-goals / things to avoid

- Don't build an ad network or anything that fetches remote ad creatives.
- Don't add tracking, cookies, fingerprinting, or any data exfiltration.
- Don't make Tailwind a hard requirement.
- Don't make the simple case require reading documentation.
- Don't ship a bloated dependency tree.
- Don't produce ads that look generic, spammy, or "AdSense-y" — the whole point is *beautiful*.

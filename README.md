# beautiful-banner-ads

> Beautiful, on-brand banner ads for React — drop in, looks polished, fully yours.

[![MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![types: TypeScript](https://img.shields.io/badge/types-TypeScript-blue.svg)](#typescript)

`beautiful-banner-ads` is a React component library for **first-party self-promotion** banners — for cross-promoting your own SaaS, courses, events, and content on your own site. You install it, pass in your content, and you get a polished ad. No CSS to write, no ad network, no tracking, no third-party demand.

- **Beautiful by default.** Zero styling props required.
- **Works with AND without Tailwind.** Self-contained scoped CSS, optional Tailwind preset.
- **TypeScript-first** • SSR-safe • Accessible (keyboard, ARIA, `prefers-reduced-motion`) • Tree-shakeable.
- **Callback-only analytics** (`onView` / `onClick` / `onClose`). Nothing phones home.
- **5 components**: `BannerAd`, `BrandedBanner`, `MediaBanner`, `CustomBanner`, `AdSlot` (with opt-in rotation).

---

## Install

```bash
npm install beautiful-banner-ads
# or: pnpm add beautiful-banner-ads / yarn add beautiful-banner-ads
```

Peer deps: `react >=18` and `react-dom >=18` (React 19 supported).

---

## 2-minute quickstart

The simplest case — zero styling props, zero config:

```tsx
import { BannerAd } from "beautiful-banner-ads";

export function MyPage() {
  return (
    <BannerAd
      id="course-promo"
      title="Save 20% on my new course"
      subtitle="Learn React + TypeScript in 30 days"
      cta={{ label: "Get it", href: "/courses/react-30" }}
    />
  );
}
```

That's it. You get a polished promo strip in your theme (light/dark/system), with a labeled close-ready container, focus rings, and the lime-on-teal CTA you see in the design guide.

The package auto-injects its stylesheet when the first banner mounts, so **you don't need to import anything else for it to look good**. (See [SSR](#ssr) below if you want to ship the styles in your initial HTML.)

---

## Components at a glance

| Component | What it's for | Key props |
| --- | --- | --- |
| **`BannerAd`** | Full-width / N%-width strip ad. The "Dribbble-style" promo bar. | `title`, `subtitle`, `text`, `eyebrow`, `cta`, `bg`, `position`, `sticky`, `size`, `dismissible` |
| **`BrandedBanner`** | Premium branded campaign with a transparent product image. | `title`, `subtitle`, `eyebrow`, `cta`, `image`, `brandColors`, `layout`, `size` |
| **`MediaBanner`** | Hero `<video>`, `<img>` (GIF), or inline/external SVG. | `title`, `cta`, `media: { type, src, poster, autoplay, loop, muted, alt, svg }` |
| **`CustomBanner`** | Headless/composable shell. Slot components for full creative control. | `<CustomBanner.Media>`, `.Body`, `.Eyebrow`, `.Title`, `.Subtitle`, `.FinePrint`, `.CTA`, `.Close` |
| **`AdSlot`** *(alias `BannerRotator`)* | Placement wrapper. Single ad or rotating array. | `ads`, `rotate`, `position`, `sticky`, `corner`, `width` |

Every component also accepts:

- `id?: string` — used in callbacks + dismiss-storage key.
- `theme?: "light" | "dark" | "system"`.
- `position?: "top" | "bottom" | "inline" | "corner" | "custom"` (+ `sticky`, `corner`, `offset`).
- `width?: "full" | "80%" | "600px" | ...`.
- `size?: "sm" | "md" | "lg" | "leaderboard" | "social" | "halfpage" | "banner" | "fullwidth-strip"`.
- `dismissible?: boolean` (+ `storage`, `storageKey`).
- `onView` / `onClick` / `onClose` callbacks.
- `config?: BannerConfig` — a serializable object equivalent to props (props always win).
- `className?` / `style?` — escape hatches.

---

## Recipes

### Sticky bottom promo bar

```tsx
<BannerAd
  id="newsletter"
  title="Get one practical tip every Monday."
  cta={{ label: "Subscribe", href: "/newsletter" }}
  position="bottom"
  sticky
  bg="brand"
  dismissible
  storage={typeof window !== "undefined" ? localStorage : undefined}
/>
```

### Floating corner ad (toast-style)

```tsx
<BannerAd
  id="event-promo"
  title="React London is next week"
  cta={{ label: "RSVP", href: "/event" }}
  position="corner"
  corner="bottom-right"
  offset={24}
  dismissible
/>
```

### Branded campaign (Image 2 style — one campaign, many sizes)

```tsx
<BrandedBanner
  id="ink-2x1"
  title="Save 50% on ink"
  subtitle="Print smarter."
  finePrint="Free delivery incl.*"
  cta={{ label: "Shop", href: "/ink" }}
  image="/ink-bottle.png"
  brandColors={{ bg: "#0F3D38", accent: "#B6F23D", text: "#F3FBF7" }}
  size="leaderboard"   // 930 × 180
  layout="image-right"
/>
```

The same `config` swapped to `size="halfpage"` (300×600) or `size="banner"` (468×60) renders the same campaign at the new dimensions.

### Video hero banner

```tsx
<MediaBanner
  id="course-preview"
  title="See the course in 15 seconds"
  cta={{ label: "Watch", href: "/preview" }}
  media={{
    type: "video",
    src: "/preview.mp4",
    poster: "/preview-poster.jpg",
    autoplay: true,
    loop: true,
    muted: true,
  }}
/>
```

Under `prefers-reduced-motion: reduce`, the package automatically shows the poster instead of autoplaying.

### Rotating sidebar from JSON config

```tsx
import adsFromCms from "./ads.json";   // an array of BannerConfig objects

<AdSlot
  ads={adsFromCms}
  rotate={{ interval: 8000, pauseOnHover: true }}
  position="inline"
/>
```

Or pick a different banner per config:

```tsx
<AdSlot ads={adsFromCms} rotate={{ interval: 8000 }}>
  {(config) =>
    config.media ? <MediaBanner config={config} /> : <BannerAd config={config} />
  }
</AdSlot>
```

### Headless / custom creative

```tsx
<CustomBanner id="experiment" dismissible>
  <CustomBanner.Media>
    <YourCustomVisual />
  </CustomBanner.Media>
  <CustomBanner.Body>
    <CustomBanner.Eyebrow>NEW</CustomBanner.Eyebrow>
    <CustomBanner.Title>Whatever you want</CustomBanner.Title>
  </CustomBanner.Body>
  <CustomBanner.CTA label="Go" href="/x" />
  <CustomBanner.Close />
</CustomBanner>
```

---

## Tailwind: it works either way

### Without Tailwind (most apps)

Nothing to do. The package auto-injects a scoped stylesheet the first time a banner mounts. All rules live under `.bba-root` and use `:where()` to keep specificity at 0, so they never leak into your app and your global CSS / utility classes always win the cascade.

### With Tailwind

Use the bundled preset to expose every design token as Tailwind utilities (`bg-bba-surface`, `text-bba-on-brand`, `rounded-bba-lg`, `shadow-bba-cta`, …):

```ts
// tailwind.config.ts
import bbaPreset from "beautiful-banner-ads/tailwind-preset";

export default {
  presets: [bbaPreset],
  content: ["./src/your-glob-here"],
};
```

Then pass `className` to any banner / slot to override:

```tsx
<BannerAd
  title="Hi"
  cta={{ label: "Go", href: "/x" }}
  className="rounded-bba-xl shadow-bba-lg"
/>
```

Token values stay `var(--bba-*)`, so light/dark/system theme switching keeps working automatically — no `darkMode` config needed for those utilities.

---

## Theming

Three modes: `light`, `dark`, `system`. Default is `system` (follows `prefers-color-scheme` live).

```tsx
import { ThemeProvider, BannerAd } from "beautiful-banner-ads";

<ThemeProvider mode="dark">
  <BannerAd title="…" cta={{ label: "…", href: "…" }} />
</ThemeProvider>

// Or per-component
<BannerAd theme="light" title="…" cta={…} />
```

Or read the resolved theme in your own code:

```tsx
import { useResolvedTheme } from "beautiful-banner-ads";

const theme = useResolvedTheme();   // "light" | "dark"
```

All defaults follow the [`design-style-guide.md`](./design-style-guide.md) — deep teal surfaces, off-white text, electric lime CTAs. Override any token with regular CSS or with the Tailwind preset.

---

## Analytics

Callback-only. No network calls, no cookies, no fingerprinting.

```tsx
<BannerAd
  id="promo-2026q2"
  title="…"
  cta={{ label: "…", href: "/x" }}
  onView={({ id, type }) => analytics.track("ad_impression", { id, type })}
  onClick={({ id }, event) => analytics.track("ad_click", { id })}
  onClose={({ id }) => analytics.track("ad_dismissed", { id })}
/>
```

- `onView` fires **once per mount** the first time the banner crosses 50% intersection.
- `onClick` fires when the CTA is activated (click or keyboard).
- `onClose` fires when the user dismisses the banner.

All callbacks receive `adMeta`: `{ id, type, config }`.

---

## Dismissal persistence

`dismissible` shows the close button + handles dismissal. Persistence is opt-in — pass any storage adapter (`localStorage` works):

```tsx
<BannerAd
  id="newsletter"
  title="…"
  cta={…}
  dismissible
  storage={typeof window !== "undefined" ? localStorage : undefined}
/>
```

The package writes `"1"` to `bba-dismissed:<id>` (override with `storageKey`). It never touches storage unless you pass an adapter.

---

## Accessibility

- Every banner is `role="complementary"` with `aria-label="Advertisement"` (override with `ariaLabel`).
- Close button is a real labeled `<button>` with visible focus ring.
- CTA is `<a>` when `href` is set, `<button>` otherwise. `target="_blank"` auto-adds `rel="noopener noreferrer"`.
- All interactive elements meet the 40 × 40 px touch target.
- Reduced-motion: transitions/animations inside the scope are zeroed out, video autoplay is skipped (poster shown instead), and `AdSlot` rotation auto-advance is disabled.

---

## SSR

The package never touches `window` / `document` at module top level. Banners render fine in Next.js / Remix / SvelteKit / any SSR setup.

For zero FOUC on the first server-rendered paint, import the stylesheet explicitly in your root once:

```tsx
import "beautiful-banner-ads/styles.css";
```

(The runtime injection still happens after that — it's idempotent.)

---

## TypeScript

Full types are exported from the package root:

```ts
import type {
  AdMeta,
  BannerConfig,
  BrandColors,
  CTA,
  MediaSpec,
  OnClick,
  OnClose,
  OnView,
  Position,
  ResolvedTheme,
  SizePreset,
  StorageAdapter,
  ThemeMode,
} from "beautiful-banner-ads";
```

---

## Build outputs

- ESM (`dist/index.js`) + CJS (`dist/index.cjs`) + sourcemaps.
- `.d.ts` and `.d.cts` for both `import` and `require` resolution.
- `dist/styles.css` for explicit-import / SSR setups.
- `dist/tailwind-preset.{js,cjs,d.ts,d.cts}`.
- `sideEffects: ["./dist/styles.css", "**/*.css"]` for tree-shaking.

Importing only `BannerAd` doesn't pull in `MediaBanner`, `BrandedBanner`, `AdSlot`, or rotation logic — verified by tree-shake-safe entry structure.

---

## Roadmap

v1 (this release) intentionally ships **no** ad-server, A/B testing, third-party demand, weighted rotation, built-in storage, or any cross-site tracking. Those are out of scope by design.

Future considerations: framework adapters (Vue, Web Components), rotation weighting, more named ad-size presets, dev-only `console.warn` for low-contrast `brandColors`.

---

## License

[MIT](./LICENSE) © MUKE JOHNBAPTIST

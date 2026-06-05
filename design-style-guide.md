# Design Style Guide — `beautiful-banner-ads`

> The visual design system. This defines exactly how "beautiful by default" looks. Implement every token here as CSS custom properties (and mirror them in the Tailwind preset). When a component has no styling props, it must look like *this*. Reference images informed this system: the premium dark-teal/lime campaign look (inkwell), the punchy high-energy accent look (purple + lime starburst), and clean neutral card surfaces (the goals/objectives cards).

---

## 0. Design philosophy

Three feelings the default ads must evoke, in priority order:

1. **Premium & intentional** — looks designed, not generated. Confident spacing, real type hierarchy, tasteful color.
2. **Modern & punchy** — high-contrast CTAs, a vivid accent, just enough energy to convert without being loud.
3. **Calm enough to live on a content site** — it sits next to a blog post without screaming. Never "AdSense-y."

The signature look: **deep teal-green surfaces, crisp off-white text, and an electric lime accent** for CTAs and highlights — with clean neutral light/dark fallbacks. This is the "beautiful by default" identity.

---

## 1. Color tokens

All colors are CSS custom properties prefixed `--bba-`. Provide light and dark sets; `system` picks per `prefers-color-scheme`. Hex values below are the defaults — implement exactly.

### 1.1 Brand / accent (theme-independent core)
```
--bba-brand-900:  #0B2E2A   /* deepest teal-green — premium surface */
--bba-brand-800:  #0F3D38   /* primary brand surface (inkwell-style bg) */
--bba-brand-700:  #14524B   /* brand surface hover / gradient stop */
--bba-brand-600:  #1B6B61   /* mid teal */
--bba-accent-500: #B6F23D   /* ELECTRIC LIME — primary CTA + highlights */
--bba-accent-600: #9FDB2A   /* lime hover/active */
--bba-accent-300: #D6F98C   /* lime tint (subtle highlights) */
--bba-pop-500:    #7C4DFF   /* optional high-energy accent (purple) */
--bba-pop-600:    #6B3BEE   /* purple hover */
```

### 1.2 Light theme
```
--bba-bg:            #FFFFFF   /* page-level (when ad bg is light) */
--bba-surface:       #F4F6F8   /* neutral card surface (goals-card style) */
--bba-surface-2:     #FFFFFF
--bba-text:          #0E1726   /* near-black ink */
--bba-text-muted:    #5B6573
--bba-border:        #E4E8EC
--bba-on-brand:      #F3FBF7   /* text on dark brand surfaces */
--bba-on-accent:     #0B2E2A   /* text on lime (dark, for contrast) */
--bba-cta-bg:        var(--bba-accent-500)
--bba-cta-text:      var(--bba-on-accent)
--bba-cta-bg-hover:  var(--bba-accent-600)
--bba-focus-ring:    #1B6B61
--bba-overlay:       rgba(11,46,42,0.55)
```

### 1.3 Dark theme
```
--bba-bg:            #0B0F14
--bba-surface:       #11161D   /* dark card surface */
--bba-surface-2:     #161C24
--bba-text:          #EAF0F2
--bba-text-muted:    #9AA7B2
--bba-border:        #232B34
--bba-on-brand:      #F3FBF7
--bba-on-accent:     #0B2E2A
--bba-cta-bg:        var(--bba-accent-500)
--bba-cta-text:      var(--bba-on-accent)
--bba-cta-bg-hover:  var(--bba-accent-600)
--bba-focus-ring:    #B6F23D
--bba-overlay:       rgba(0,0,0,0.6)
```

### 1.4 Brand surface gradient (the signature look)
Default `BrandedBanner` / strong `BannerAd` backgrounds use a subtle diagonal:
```
--bba-brand-gradient: linear-gradient(105deg, var(--bba-brand-900) 0%, var(--bba-brand-800) 45%, var(--bba-brand-700) 100%);
```
A faceted/geometric darker wedge may overlay at ~8–12% opacity for depth (as in the inkwell reference). Keep it subtle.

### 1.5 Contrast rules
- Text on any surface must meet **WCAG AA (≥4.5:1 body, ≥3:1 large)**.
- CTA = lime bg + dark ink text (`--bba-on-accent`) — never light text on lime.
- When a developer passes a custom `bg`/`brandColors`, auto-pick `--bba-on-brand` vs dark text by luminance; warn in dev if contrast fails AA.

---

## 2. Typography

### 2.1 Font families
```
--bba-font-heading: "Inter", "Helvetica Neue", Helvetica, Arial, system-ui, sans-serif;
--bba-font-body:    "Inter", system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
--bba-font-display: "Clash Display", "Inter", system-ui, sans-serif; /* optional expressive headline for high-energy variant */
```
- Default uses a clean grotesque (Inter / Helvetica Neue — echoing the inkwell brand kit "Helvetica Neue / Helvetica").
- The package must NOT force webfont loading. Use system stack fallbacks; if a font isn't present, it still looks clean. `--bba-font-display` is opt-in for the "punchy" variant.

### 2.2 Type scale (rem, 16px base)
```
--bba-fs-xs:   0.75rem   /* 12 — fine print, "Free delivery incl.*" */
--bba-fs-sm:   0.875rem  /* 14 — secondary/subtitle */
--bba-fs-base: 1rem      /* 16 — body */
--bba-fs-lg:   1.25rem   /* 20 — strip headline (compact) */
--bba-fs-xl:   1.75rem   /* 28 — banner headline */
--bba-fs-2xl:  2.25rem   /* 36 — large branded headline */
--bba-fs-3xl:  3rem      /* 48 — hero / halfpage */
```

### 2.3 Weights & spacing
```
--bba-fw-regular: 400
--bba-fw-medium:  500
--bba-fw-semibold:600
--bba-fw-bold:    700
--bba-fw-black:   800   /* punchy headlines only */

--bba-lh-tight:   1.05  /* big headlines */
--bba-lh-snug:    1.2
--bba-lh-normal:  1.5   /* body */

--bba-ls-tight:  -0.02em /* headlines */
--bba-ls-normal:  0
--bba-ls-wide:    0.04em /* small caps labels, e.g. eyebrow */
```

### 2.4 Type roles
- **Eyebrow / label:** `--bba-fs-xs`, `--bba-fw-semibold`, `--bba-ls-wide`, uppercase, `--bba-text-muted` (or lime on brand). e.g. "STUDY ON THE GO".
- **Headline:** `--bba-fs-xl`/`2xl`, `--bba-fw-bold` (or `black` for punchy), `--bba-lh-tight`, `--bba-ls-tight`.
- **Subtitle:** `--bba-fs-sm`/`base`, `--bba-fw-regular`, `--bba-text-muted` or `--bba-on-brand` at ~85%.
- **CTA label:** `--bba-fs-sm`/`base`, `--bba-fw-semibold`.
- **Fine print:** `--bba-fs-xs`, `--bba-text-muted`.
- **Highlight word** (e.g. "Save 50%"): same size as headline but colored `--bba-accent-500` to draw the eye (inkwell pattern).

---

## 3. Spacing scale
4px base unit. Use these tokens for all padding/margins/gaps.
```
--bba-space-0:  0
--bba-space-1:  0.25rem  /* 4  */
--bba-space-2:  0.5rem   /* 8  */
--bba-space-3:  0.75rem  /* 12 */
--bba-space-4:  1rem     /* 16 */
--bba-space-5:  1.25rem  /* 20 */
--bba-space-6:  1.5rem   /* 24 */
--bba-space-8:  2rem     /* 32 */
--bba-space-10: 2.5rem   /* 40 */
--bba-space-12: 3rem     /* 48 */
```
**Defaults:** strip ad inner padding `--bba-space-4` (y) / `--bba-space-6` (x). Branded banner padding `--bba-space-6`–`8`. Gap between text block and CTA `--bba-space-4`–`6`.

---

## 4. Radii, borders, shadows

### 4.1 Radius
```
--bba-radius-sm:  6px
--bba-radius-md:  12px   /* default card/banner corner */
--bba-radius-lg:  18px   /* branded banner */
--bba-radius-xl:  24px   /* big hero/corner ads */
--bba-radius-pill: 9999px /* CTAs, eyebrow chips, close buttons */
```
Default banner corner = `--bba-radius-lg`. CTAs = `--bba-radius-pill` (matches the rounded CTAs in references). Sticky full-width strips = `0` radius when truly full-bleed, `--bba-radius-md` when inset.

### 4.2 Borders
```
--bba-border-width: 1px
--bba-border-color: var(--bba-border)
```
Branded/dark banners are mostly borderless; neutral light cards use a 1px `--bba-border` (goals-card style).

### 4.3 Shadows (elevation)
```
--bba-shadow-sm:  0 1px 2px rgba(14,23,38,0.06);
--bba-shadow-md:  0 6px 20px rgba(14,23,38,0.10);
--bba-shadow-lg:  0 16px 40px rgba(14,23,38,0.16);
--bba-shadow-cta: 0 4px 14px rgba(159,219,42,0.35); /* lime glow under CTA */
```
Corner/floating ads use `--bba-shadow-lg`. Inline ads use `--bba-shadow-sm`/none. Sticky strips use a top/bottom hairline + soft `--bba-shadow-md` lifting them off content.

---

## 5. Motion
```
--bba-dur-fast:   120ms
--bba-dur-base:   220ms
--bba-dur-slow:   400ms
--bba-ease-out:   cubic-bezier(0.16, 1, 0.3, 1);
--bba-ease-in-out:cubic-bezier(0.65, 0, 0.35, 1);
```
- Entrance (corner/sticky): slide+fade in over `--bba-dur-slow` with `--bba-ease-out`.
- CTA hover: bg + slight lift over `--bba-dur-fast`.
- Rotation transition (when enabled): cross-fade `--bba-dur-base`.
- **`prefers-reduced-motion: reduce` → disable all transitions/entrances/autoplay; show final state immediately.** Non-negotiable.

---

## 6. Z-index layers
```
--bba-z-inline:  1
--bba-z-sticky:  1000
--bba-z-corner:  1100
--bba-z-overlay: 1200
```

---

## 7. Component specs (the default look)

### 7.1 CTA button (shared)
- Shape: pill (`--bba-radius-pill`), padding `--bba-space-3` y / `--bba-space-5` x.
- Default: bg `--bba-cta-bg` (lime), text `--bba-cta-text` (dark ink), `--bba-fw-semibold`, `--bba-shadow-cta`.
- Hover: `--bba-cta-bg-hover`, translateY(-1px). Active: translateY(0). Focus: 2px `--bba-focus-ring` outline offset 2px.
- Secondary CTA variant: transparent bg, 1.5px border `--bba-on-brand`/`--bba-border`, same text color as surface context (used for "DOWNLOAD THE APP" style second button).

### 7.2 `BannerAd` (strip)
- Layout: horizontal — [eyebrow?] + headline + optional subtitle on the left, CTA on the right, optional close at far right.
- Default surface: light variant uses `--bba-surface` with `--bba-text`; "strong" variant uses `--bba-brand-gradient` with `--bba-on-brand` (the bold bottom-bar look).
- Highlight word in headline may use `--bba-accent-500`.
- Full-bleed sticky = radius 0; inset/80% = `--bba-radius-md`, `--bba-shadow-md`.
- Compact height: `sm` ~56px, `md` ~72px, `lg` ~96px (content-dependent).

### 7.3 `BrandedBanner` (premium)
- Surface: `--bba-brand-gradient` (or derived from `brandColors`), `--bba-radius-lg`.
- Logo/wordmark top-left, headline below with a colored highlight line ("Save 50% on ink." in lime), CTA pill, fine print under CTA.
- Transparent product image bleeds from one side, may overlap the container edge slightly for depth.
- Layout variants: `image-right` (default), `image-left`, `image-bg`.
- Must look correct at presets: `social` 1200×628, `leaderboard` 930×180, `halfpage` 300×600 (stacked vertical layout), `banner` 468×60 (ultra-compact, logo+headline+mini CTA).

### 7.4 `MediaBanner`
- Same shell as BrandedBanner; hero region holds video/gif/svg with `--bba-radius-md` clipping.
- Video: object-fit cover, muted/loop optional, poster shown under reduced-motion.
- Subtle dark scrim (`--bba-overlay`) behind text when text overlaps media for legibility.

### 7.5 Neutral card variant (goals-card style)
- For low-key inline promos: `--bba-surface`, `--bba-border` 1px, `--bba-radius-md`, `--bba-shadow-sm`, dark text, ghost/secondary CTA. Calm, content-friendly.

### 7.6 Close / dismiss button
- 24–28px circular, `--bba-radius-pill`, subtle bg (`--bba-text` at ~8% / `--bba-on-brand` at ~12% on dark), real `<button>`, `aria-label="Dismiss ad"`, visible focus ring, hover darkens slightly.

### 7.7 Eyebrow chip (optional)
- Pill, `--bba-accent-300` bg / `--bba-on-accent` text OR outline; small caps; used for "NEW", "20% OFF" tags.

### 7.8 High-energy / "punchy" variant (opt-in)
- For the bold look (purple surface + lime starburst + expressive display type): surface `--bba-pop-500`, `--bba-font-display`, `--bba-fw-black`, oversized headline, optional decorative lime starburst (provided as an SVG decoration slot, never required). Use sparingly; not the default.

---

## 8. Layout & responsive rules
- Container max-width respects parent; `width` prop controls (`full`/`80%`/explicit).
- Below ~640px: strip ads stack headline over CTA; branded banners switch to vertical (image top or as bg); fine print stays attached to CTA.
- Maintain min touch target 40×40px for all interactive elements.
- Honor safe-area insets for sticky bottom bars on mobile.

---

## 9. Accessibility (visual)
- Focus ring: 2px solid `--bba-focus-ring`, 2px offset, on every interactive element.
- Never convey meaning by color alone (highlight words also carry weight/position).
- Min body text 14px; fine print 12px only for legal-style text.
- Provide `alt` for images; decorative shapes (starburst, geometric wedge) are `aria-hidden`.

---

## 10. Tailwind preset mapping
The `beautiful-banner-ads/tailwind-preset` must expose these tokens as Tailwind theme extensions so a Tailwind consumer can use e.g. `bg-bba-brand-800`, `text-bba-on-brand`, `rounded-bba-lg`, `shadow-bba-md`, `ease-bba-out`. Keys mirror the CSS variable names (drop the `--bba-` prefix; group under `colors.bba.*`, `borderRadius.bba-*`, `boxShadow.bba-*`, etc.). The source of truth remains the CSS variables — the preset references `var(--bba-*)` so theme switching keeps working.

---

## 11. Do / Don't
**Do:** generous whitespace, one clear CTA, one accent color per ad, strong type hierarchy, subtle depth.
**Don't:** rainbow palettes, multiple competing CTAs, tiny cramped text, drop-shadow overload, default browser fonts looking unstyled, autoplaying motion under reduced-motion, low-contrast lime-on-white CTAs.

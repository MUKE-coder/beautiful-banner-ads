/**
 * beautiful-banner-ads — canonical stylesheet.
 *
 * Single source of truth for every style the package ships. Both the runtime
 * `injectStyles()` call (auto-injection for no-Tailwind apps) and the published
 * `dist/styles.css` (explicit import for SSR / consumers who prefer it) are
 * produced from this string. Edit here only.
 *
 * Every rule is scoped under `.bba-root` so styles never leak into the host app.
 * Tokens follow `design-style-guide.md` exactly.
 */
export const cssSource = String.raw`
.bba-root {
  /* — Brand / accent (theme-independent core) — */
  --bba-brand-900: #0B2E2A;
  --bba-brand-800: #0F3D38;
  --bba-brand-700: #14524B;
  --bba-brand-600: #1B6B61;
  --bba-accent-500: #B6F23D;
  --bba-accent-600: #9FDB2A;
  --bba-accent-300: #D6F98C;
  --bba-pop-500: #7C4DFF;
  --bba-pop-600: #6B3BEE;

  /* — Light theme (default) — */
  --bba-bg: #FFFFFF;
  --bba-surface: #F4F6F8;
  --bba-surface-2: #FFFFFF;
  --bba-text: #0E1726;
  --bba-text-muted: #5B6573;
  --bba-border: #E4E8EC;
  --bba-on-brand: #F3FBF7;
  --bba-on-accent: #0B2E2A;
  --bba-cta-bg: var(--bba-accent-500);
  --bba-cta-text: var(--bba-on-accent);
  --bba-cta-bg-hover: var(--bba-accent-600);
  --bba-focus-ring: #1B6B61;
  --bba-overlay: rgba(11, 46, 42, 0.55);
  --bba-brand-gradient: linear-gradient(105deg, var(--bba-brand-900) 0%, var(--bba-brand-800) 45%, var(--bba-brand-700) 100%);

  /* — Typography — */
  --bba-font-heading: "Inter", "Helvetica Neue", Helvetica, Arial, system-ui, sans-serif;
  --bba-font-body: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --bba-font-display: "Clash Display", "Inter", system-ui, sans-serif;
  --bba-fs-xs: 0.75rem;
  --bba-fs-sm: 0.875rem;
  --bba-fs-base: 1rem;
  --bba-fs-lg: 1.25rem;
  --bba-fs-xl: 1.75rem;
  --bba-fs-2xl: 2.25rem;
  --bba-fs-3xl: 3rem;
  --bba-fw-regular: 400;
  --bba-fw-medium: 500;
  --bba-fw-semibold: 600;
  --bba-fw-bold: 700;
  --bba-fw-black: 800;
  --bba-lh-tight: 1.05;
  --bba-lh-snug: 1.2;
  --bba-lh-normal: 1.5;
  --bba-ls-tight: -0.02em;
  --bba-ls-normal: 0;
  --bba-ls-wide: 0.04em;

  /* — Spacing scale (4px base) — */
  --bba-space-0: 0;
  --bba-space-1: 0.25rem;
  --bba-space-2: 0.5rem;
  --bba-space-3: 0.75rem;
  --bba-space-4: 1rem;
  --bba-space-5: 1.25rem;
  --bba-space-6: 1.5rem;
  --bba-space-8: 2rem;
  --bba-space-10: 2.5rem;
  --bba-space-12: 3rem;

  /* — Radii — */
  --bba-radius-sm: 6px;
  --bba-radius-md: 12px;
  --bba-radius-lg: 18px;
  --bba-radius-xl: 24px;
  --bba-radius-pill: 9999px;

  /* — Borders — */
  --bba-border-width: 1px;
  --bba-border-color: var(--bba-border);

  /* — Shadows / elevation — */
  --bba-shadow-sm: 0 1px 2px rgba(14, 23, 38, 0.06);
  --bba-shadow-md: 0 6px 20px rgba(14, 23, 38, 0.10);
  --bba-shadow-lg: 0 16px 40px rgba(14, 23, 38, 0.16);
  --bba-shadow-cta: 0 4px 14px rgba(159, 219, 42, 0.35);

  /* — Motion — */
  --bba-dur-fast: 120ms;
  --bba-dur-base: 220ms;
  --bba-dur-slow: 400ms;
  --bba-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --bba-ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);

  /* — Z-index — */
  --bba-z-inline: 1;
  --bba-z-sticky: 1000;
  --bba-z-corner: 1100;
  --bba-z-overlay: 1200;

  /* Base typography for the scoped subtree. Inherited by all descendants. */
  font-family: var(--bba-font-body);
  color: var(--bba-text);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Box-sizing applies to the scoped subtree only. */
.bba-root,
.bba-root *,
.bba-root *::before,
.bba-root *::after {
  box-sizing: border-box;
}

/* — Explicit dark theme override — */
.bba-root[data-bba-theme="dark"] {
  --bba-bg: #0B0F14;
  --bba-surface: #11161D;
  --bba-surface-2: #161C24;
  --bba-text: #EAF0F2;
  --bba-text-muted: #9AA7B2;
  --bba-border: #232B34;
  --bba-on-brand: #F3FBF7;
  --bba-on-accent: #0B2E2A;
  --bba-cta-bg: var(--bba-accent-500);
  --bba-cta-text: var(--bba-on-accent);
  --bba-cta-bg-hover: var(--bba-accent-600);
  --bba-focus-ring: #B6F23D;
  --bba-overlay: rgba(0, 0, 0, 0.6);
}

/* — System theme: follow prefers-color-scheme — */
@media (prefers-color-scheme: dark) {
  .bba-root[data-bba-theme="system"] {
    --bba-bg: #0B0F14;
    --bba-surface: #11161D;
    --bba-surface-2: #161C24;
    --bba-text: #EAF0F2;
    --bba-text-muted: #9AA7B2;
    --bba-border: #232B34;
    --bba-on-brand: #F3FBF7;
    --bba-on-accent: #0B2E2A;
    --bba-cta-bg: var(--bba-accent-500);
    --bba-cta-text: var(--bba-on-accent);
    --bba-cta-bg-hover: var(--bba-accent-600);
    --bba-focus-ring: #B6F23D;
    --bba-overlay: rgba(0, 0, 0, 0.6);
  }
}

/* ── Banner component default styles ───────────────────────────────────────
   All component selectors are wrapped in :where() so their specificity is 0.
   Consumer Tailwind utilities / hand-written classes therefore always win
   the cascade — combined with the head-prepended <style> tag, overrides are
   predictable from any host stack.
*/

:where(.bba-banner) {
  display: flex;
  align-items: center;
  gap: var(--bba-space-6);
  padding: var(--bba-space-5) var(--bba-space-6);
  background: var(--bba-surface);
  color: var(--bba-text);
  border-radius: var(--bba-radius-lg);
  box-shadow: var(--bba-shadow-md);
  border: 0;
  font-family: var(--bba-font-body);
  line-height: var(--bba-lh-normal);
  position: relative;
  max-width: 100%;
}

:where(.bba-banner__media) {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

:where(.bba-banner__body) {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: var(--bba-space-1);
  min-width: 0;
}

:where(.bba-banner__eyebrow) {
  display: inline-block;
  font-size: var(--bba-fs-xs);
  font-weight: var(--bba-fw-semibold);
  letter-spacing: var(--bba-ls-wide);
  color: var(--bba-text-muted);
  text-transform: uppercase;
  margin-bottom: var(--bba-space-1);
}

:where(.bba-banner__title) {
  font-family: var(--bba-font-heading);
  font-size: var(--bba-fs-xl);
  font-weight: var(--bba-fw-bold);
  line-height: var(--bba-lh-tight);
  letter-spacing: var(--bba-ls-tight);
  color: var(--bba-text);
  margin: 0;
}

:where(.bba-banner__subtitle) {
  font-size: var(--bba-fs-sm);
  color: var(--bba-text-muted);
  margin: 0;
}

:where(.bba-banner__fine-print) {
  font-size: var(--bba-fs-xs);
  color: var(--bba-text-muted);
  margin: 0;
}

:where(.bba-banner__cta) {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--bba-space-2);
  padding: var(--bba-space-3) var(--bba-space-5);
  background: var(--bba-cta-bg);
  color: var(--bba-cta-text);
  border-radius: var(--bba-radius-pill);
  border: 0;
  font-family: var(--bba-font-body);
  font-size: var(--bba-fs-sm);
  font-weight: var(--bba-fw-semibold);
  line-height: 1;
  text-decoration: none;
  cursor: pointer;
  box-shadow: var(--bba-shadow-cta);
  transition:
    transform var(--bba-dur-fast) var(--bba-ease-out),
    background var(--bba-dur-fast) var(--bba-ease-out);
  min-height: 40px;
}

:where(.bba-banner__cta:hover) {
  background: var(--bba-cta-bg-hover);
  transform: translateY(-1px);
}

:where(.bba-banner__cta:active) {
  transform: translateY(0);
}

:where(.bba-banner__cta:focus-visible) {
  outline: 2px solid var(--bba-focus-ring);
  outline-offset: 2px;
}

:where(.bba-banner__cta--secondary) {
  background: transparent;
  color: var(--bba-text);
  border: 1.5px solid var(--bba-border);
  box-shadow: none;
}

:where(.bba-banner__cta--secondary:hover) {
  background: var(--bba-surface);
}

:where(.bba-banner__close) {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  background: color-mix(in srgb, currentColor 10%, transparent);
  color: var(--bba-text);
  border: 0;
  border-radius: var(--bba-radius-pill);
  cursor: pointer;
  transition: background var(--bba-dur-fast) var(--bba-ease-out);
}

:where(.bba-banner__close:hover) {
  background: color-mix(in srgb, currentColor 18%, transparent);
}

:where(.bba-banner__close:focus-visible) {
  outline: 2px solid var(--bba-focus-ring);
  outline-offset: 2px;
}

/* Stack on small screens (mobile single-column). */
@media (max-width: 640px) {
  :where(.bba-banner) {
    flex-wrap: wrap;
    padding: var(--bba-space-4);
  }
  :where(.bba-banner__body) {
    flex: 1 1 100%;
  }
  :where(.bba-banner__cta) {
    flex: 1 1 100%;
  }
}

/* — Reduced motion: zero out transitions/animations inside the scope — */
@media (prefers-reduced-motion: reduce) {
  .bba-root *,
  .bba-root *::before,
  .bba-root *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
`.trim();

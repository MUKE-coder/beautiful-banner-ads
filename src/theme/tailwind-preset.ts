/**
 * beautiful-banner-ads — Tailwind preset.
 *
 * Mirrors every design token from `design-style-guide.md` (and `css-source.ts`)
 * as Tailwind theme extensions. Every value resolves to the same CSS custom
 * property used at runtime (`var(--bba-*)`), so light/dark/system theme
 * switching keeps working automatically — Tailwind doesn't need its own
 * darkMode strategy for these utilities.
 *
 * Usage (Tailwind v3+):
 *
 *   import bbaPreset from "beautiful-banner-ads/tailwind-preset";
 *
 *   export default {
 *     presets: [bbaPreset],
 *     content: ["./src/your-glob-here"],
 *   };
 *
 * Then utilities like `bg-bba-surface`, `text-bba-on-brand`,
 * `rounded-bba-lg`, etc. become available. The full token table lives in
 * `design-style-guide.md` §10.
 */
const preset = {
  theme: {
    extend: {
      colors: {
        "bba-brand": {
          900: "var(--bba-brand-900)",
          800: "var(--bba-brand-800)",
          700: "var(--bba-brand-700)",
          600: "var(--bba-brand-600)",
        },
        "bba-accent": {
          300: "var(--bba-accent-300)",
          500: "var(--bba-accent-500)",
          600: "var(--bba-accent-600)",
        },
        "bba-pop": {
          500: "var(--bba-pop-500)",
          600: "var(--bba-pop-600)",
        },
        bba: {
          bg: "var(--bba-bg)",
          surface: "var(--bba-surface)",
          "surface-2": "var(--bba-surface-2)",
          text: "var(--bba-text)",
          "text-muted": "var(--bba-text-muted)",
          border: "var(--bba-border)",
          "on-brand": "var(--bba-on-brand)",
          "on-accent": "var(--bba-on-accent)",
          "cta-bg": "var(--bba-cta-bg)",
          "cta-text": "var(--bba-cta-text)",
          "cta-bg-hover": "var(--bba-cta-bg-hover)",
          "focus-ring": "var(--bba-focus-ring)",
          overlay: "var(--bba-overlay)",
        },
      },
      fontFamily: {
        "bba-heading": ["var(--bba-font-heading)"],
        "bba-body": ["var(--bba-font-body)"],
        "bba-display": ["var(--bba-font-display)"],
      },
      fontSize: {
        "bba-xs": "var(--bba-fs-xs)",
        "bba-sm": "var(--bba-fs-sm)",
        "bba-base": "var(--bba-fs-base)",
        "bba-lg": "var(--bba-fs-lg)",
        "bba-xl": "var(--bba-fs-xl)",
        "bba-2xl": "var(--bba-fs-2xl)",
        "bba-3xl": "var(--bba-fs-3xl)",
      },
      fontWeight: {
        "bba-regular": "var(--bba-fw-regular)",
        "bba-medium": "var(--bba-fw-medium)",
        "bba-semibold": "var(--bba-fw-semibold)",
        "bba-bold": "var(--bba-fw-bold)",
        "bba-black": "var(--bba-fw-black)",
      },
      lineHeight: {
        "bba-tight": "var(--bba-lh-tight)",
        "bba-snug": "var(--bba-lh-snug)",
        "bba-normal": "var(--bba-lh-normal)",
      },
      letterSpacing: {
        "bba-tight": "var(--bba-ls-tight)",
        "bba-normal": "var(--bba-ls-normal)",
        "bba-wide": "var(--bba-ls-wide)",
      },
      spacing: {
        "bba-0": "var(--bba-space-0)",
        "bba-1": "var(--bba-space-1)",
        "bba-2": "var(--bba-space-2)",
        "bba-3": "var(--bba-space-3)",
        "bba-4": "var(--bba-space-4)",
        "bba-5": "var(--bba-space-5)",
        "bba-6": "var(--bba-space-6)",
        "bba-8": "var(--bba-space-8)",
        "bba-10": "var(--bba-space-10)",
        "bba-12": "var(--bba-space-12)",
      },
      borderRadius: {
        "bba-sm": "var(--bba-radius-sm)",
        "bba-md": "var(--bba-radius-md)",
        "bba-lg": "var(--bba-radius-lg)",
        "bba-xl": "var(--bba-radius-xl)",
        "bba-pill": "var(--bba-radius-pill)",
      },
      boxShadow: {
        "bba-sm": "var(--bba-shadow-sm)",
        "bba-md": "var(--bba-shadow-md)",
        "bba-lg": "var(--bba-shadow-lg)",
        "bba-cta": "var(--bba-shadow-cta)",
      },
      transitionDuration: {
        "bba-fast": "var(--bba-dur-fast)",
        "bba-base": "var(--bba-dur-base)",
        "bba-slow": "var(--bba-dur-slow)",
      },
      transitionTimingFunction: {
        "bba-out": "var(--bba-ease-out)",
        "bba-in-out": "var(--bba-ease-in-out)",
      },
      zIndex: {
        "bba-inline": "var(--bba-z-inline)",
        "bba-sticky": "var(--bba-z-sticky)",
        "bba-corner": "var(--bba-z-corner)",
        "bba-overlay": "var(--bba-z-overlay)",
      },
      backgroundImage: {
        "bba-brand-gradient": "var(--bba-brand-gradient)",
      },
    },
  },
} as const;

export default preset;

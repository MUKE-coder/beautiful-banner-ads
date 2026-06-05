/**
 * beautiful-banner-ads — Tailwind preset.
 *
 * Phase 1 will populate this with the full design-token set from design-style-guide.md,
 * mirroring the CSS custom properties via `var(--bba-*)` so theme switching stays in sync.
 *
 * Usage (Tailwind v3+):
 *   // tailwind.config.{ts,js}
 *   import bbaPreset from "beautiful-banner-ads/tailwind-preset";
 *   export default { presets: [bbaPreset], content: [...] };
 */
const preset = {
  theme: {
    extend: {},
  },
} as const;

export default preset;

/** Theme mode accepted by banner components. */
export type ThemeMode = "light" | "dark" | "system";

/** Actual rendered theme after resolving `system` against `prefers-color-scheme`. */
export type ResolvedTheme = "light" | "dark";

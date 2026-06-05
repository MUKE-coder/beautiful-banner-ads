import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { ResolvedTheme, ThemeMode } from "../types/theme";

interface ThemeContextValue {
  mode: ThemeMode;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  /** Theme mode applied to all banners in the subtree. Default: `"system"`. */
  mode?: ThemeMode;
  children: ReactNode;
}

/**
 * Optional provider that sets a default theme mode for all banners in the
 * subtree. Per-component `theme` props always override the provider value.
 *
 * Banners work without this provider — they default to `"system"`.
 */
export function ThemeProvider({ mode = "system", children }: ThemeProviderProps) {
  return <ThemeContext.Provider value={{ mode }}>{children}</ThemeContext.Provider>;
}

/** The theme mode from the nearest `ThemeProvider`, or `"system"` if none. */
export function useTheme(): ThemeMode {
  return useContext(ThemeContext)?.mode ?? "system";
}

/**
 * Reads `prefers-color-scheme` and returns the resolved light/dark choice.
 * Updates live when the system preference changes. SSR-safe (defaults to
 * `"light"` when `window` is unavailable).
 */
export function useSystemTheme(): ResolvedTheme {
  const [theme, setTheme] = useState<ResolvedTheme>("light");

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setTheme(mql.matches ? "dark" : "light");
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return theme;
}

/**
 * Resolves a `ThemeMode` to the actual rendered theme (`"light"` | `"dark"`).
 * Precedence: explicit arg → provider mode → `"system"` default.
 *
 * Useful when you need to make a runtime decision based on the rendered
 * theme (e.g. swapping an image asset).
 */
export function useResolvedTheme(explicit?: ThemeMode): ResolvedTheme {
  const ctxMode = useTheme();
  const mode = explicit ?? ctxMode;
  const systemTheme = useSystemTheme();
  return mode === "system" ? systemTheme : mode;
}

import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  ThemeProvider,
  useResolvedTheme,
  useSystemTheme,
  useTheme,
} from "../theme/theme-context";

const originalMatchMedia = typeof window !== "undefined" ? window.matchMedia : undefined;

function mockMatchMedia(isDarkPreferred: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: query === "(prefers-color-scheme: dark)" ? isDarkPreferred : false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

describe("theme context + hooks", () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  afterEach(() => {
    if (originalMatchMedia) {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        configurable: true,
        value: originalMatchMedia,
      });
    }
  });

  it("useTheme defaults to 'system' when there is no provider", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBe("system");
  });

  it("useTheme returns the mode set by ThemeProvider", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider mode="dark">{children}</ThemeProvider>,
    });
    expect(result.current).toBe("dark");
  });

  it("useSystemTheme returns 'light' when prefers-color-scheme is light", () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useSystemTheme());
    expect(result.current).toBe("light");
  });

  it("useSystemTheme returns 'dark' when prefers-color-scheme is dark", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useSystemTheme());
    expect(result.current).toBe("dark");
  });

  it("useResolvedTheme honors an explicit mode over context and system", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useResolvedTheme("light"), {
      wrapper: ({ children }) => <ThemeProvider mode="dark">{children}</ThemeProvider>,
    });
    expect(result.current).toBe("light");
  });

  it("useResolvedTheme falls back to provider mode when no explicit arg", () => {
    const { result } = renderHook(() => useResolvedTheme(), {
      wrapper: ({ children }) => <ThemeProvider mode="dark">{children}</ThemeProvider>,
    });
    expect(result.current).toBe("dark");
  });

  it("useResolvedTheme resolves 'system' to the actual system preference", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useResolvedTheme("system"));
    expect(result.current).toBe("dark");
  });
});

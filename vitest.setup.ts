import "@testing-library/jest-dom/vitest";

// jsdom does not implement `matchMedia` — provide a minimal default that
// returns `matches: false`. Individual tests override this when they need
// to simulate `prefers-color-scheme: dark` or `prefers-reduced-motion: reduce`.
if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: false,
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

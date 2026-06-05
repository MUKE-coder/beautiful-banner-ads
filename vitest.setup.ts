import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Vitest is configured with `globals: false`, so React Testing Library's
// implicit auto-cleanup hook does not fire. Register it explicitly here
// so every test starts with a fresh DOM.
afterEach(() => {
  cleanup();
});

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

// jsdom does not implement `IntersectionObserver` — provide a mock that
// fires the callback synchronously with `isIntersecting: true` when an
// element is observed. Tests that need a "not in view" scenario should
// override this with their own implementation.
if (typeof window !== "undefined" && typeof window.IntersectionObserver === "undefined") {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin: string = "";
    readonly thresholds: ReadonlyArray<number> = [];
    private readonly callback: IntersectionObserverCallback;

    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
    }

    observe(target: Element): void {
      const entry: IntersectionObserverEntry = {
        isIntersecting: true,
        intersectionRatio: 1,
        target,
        boundingClientRect: target.getBoundingClientRect(),
        intersectionRect: target.getBoundingClientRect(),
        rootBounds: null,
        time: performance.now(),
      };
      this.callback([entry], this);
    }

    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
  Object.defineProperty(globalThis, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
}

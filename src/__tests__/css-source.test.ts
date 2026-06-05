import { describe, expect, it } from "vitest";
import { cssSource } from "../theme/css-source";

describe("cssSource", () => {
  it("defines the brand / accent token core", () => {
    expect(cssSource).toMatch(/--bba-brand-900:\s*#0B2E2A/);
    expect(cssSource).toMatch(/--bba-brand-800:\s*#0F3D38/);
    expect(cssSource).toMatch(/--bba-accent-500:\s*#B6F23D/);
    expect(cssSource).toMatch(/--bba-pop-500:\s*#7C4DFF/);
  });

  it("includes the signature brand gradient", () => {
    expect(cssSource).toMatch(/--bba-brand-gradient:\s*linear-gradient/);
  });

  it("defines light theme tokens on the base .bba-root scope", () => {
    expect(cssSource).toMatch(/\.bba-root\s*\{[\s\S]*?--bba-bg:\s*#FFFFFF/);
    expect(cssSource).toMatch(/--bba-text:\s*#0E1726/);
  });

  it("defines an explicit dark theme override", () => {
    expect(cssSource).toMatch(/\.bba-root\[data-bba-theme="dark"\]\s*\{[\s\S]*?--bba-bg:\s*#0B0F14/);
  });

  it("defines a system theme dark fallback via prefers-color-scheme", () => {
    expect(cssSource).toMatch(/@media\s*\(prefers-color-scheme:\s*dark\)/);
    expect(cssSource).toMatch(/\.bba-root\[data-bba-theme="system"\]/);
  });

  it("honors prefers-reduced-motion inside the scope", () => {
    expect(cssSource).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
    expect(cssSource).toMatch(/transition-duration:\s*0\.001ms\s*!important/);
  });

  it("scopes every rule under .bba-root (no leaking global selectors)", () => {
    expect(cssSource).not.toMatch(/^\s*:root\s*\{/m);
    expect(cssSource).not.toMatch(/^\s*html\s*\{/m);
    expect(cssSource).not.toMatch(/^\s*body\s*\{/m);
    expect(cssSource).not.toMatch(/^\s*\*\s*\{/m);
  });

  it("ships the full type-scale + spacing + radii + shadow + motion + z-index sets", () => {
    expect(cssSource).toMatch(/--bba-fs-3xl:\s*3rem/);
    expect(cssSource).toMatch(/--bba-space-12:\s*3rem/);
    expect(cssSource).toMatch(/--bba-radius-pill:\s*9999px/);
    expect(cssSource).toMatch(/--bba-shadow-cta:/);
    expect(cssSource).toMatch(/--bba-ease-out:\s*cubic-bezier/);
    expect(cssSource).toMatch(/--bba-z-overlay:\s*1200/);
  });
});

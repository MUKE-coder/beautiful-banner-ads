import { afterEach, describe, expect, it } from "vitest";
import { __resetInjectStateForTests, injectStyles } from "../theme/inject-styles";

describe("injectStyles", () => {
  afterEach(() => {
    __resetInjectStateForTests();
  });

  it("injects a <style> tag containing the package CSS", () => {
    expect(document.getElementById("bba-injected-styles")).toBeNull();
    injectStyles();
    const tag = document.getElementById("bba-injected-styles");
    expect(tag).not.toBeNull();
    expect(tag?.tagName).toBe("STYLE");
    expect(tag?.textContent).toContain("--bba-brand-900");
    expect(tag?.textContent).toContain(".bba-root");
  });

  it("tags the injected element with the package version for debugging", () => {
    injectStyles();
    const tag = document.getElementById("bba-injected-styles");
    expect(tag?.getAttribute("data-bba-version")).toBe("0.1.0");
  });

  it("is idempotent — repeated calls produce a single tag", () => {
    injectStyles();
    injectStyles();
    injectStyles();
    expect(document.querySelectorAll("#bba-injected-styles")).toHaveLength(1);
  });

  it("inserts the style tag at the start of <head> so consumer styles cascade after", () => {
    const userStyle = document.createElement("style");
    userStyle.id = "user-style";
    document.head.appendChild(userStyle);

    injectStyles();
    expect((document.head.firstChild as HTMLElement | null)?.id).toBe("bba-injected-styles");

    userStyle.remove();
  });
});

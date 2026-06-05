import { describe, expect, it } from "vitest";
import { VERSION } from "../index";

describe("beautiful-banner-ads (sanity)", () => {
  it("exposes a VERSION constant matching package.json semver", () => {
    expect(VERSION).toBe("0.1.0");
    expect(VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });
});

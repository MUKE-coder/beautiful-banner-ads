import { describe, expect, it } from "vitest";
import { mergeConfigAndProps } from "../utils/merge-config";

describe("mergeConfigAndProps", () => {
  it("returns props alone when no config", () => {
    expect(mergeConfigAndProps(undefined, { title: "Hi" })).toEqual({ title: "Hi" });
  });

  it("returns config when no props override", () => {
    expect(mergeConfigAndProps({ title: "Hi" }, {})).toEqual({ title: "Hi" });
  });

  it("explicit props override config values", () => {
    expect(
      mergeConfigAndProps({ title: "From config" }, { title: "From prop" }),
    ).toEqual({ title: "From prop" });
  });

  it("treats undefined props as 'not provided' (keeps config value)", () => {
    expect(
      mergeConfigAndProps({ title: "From config" }, { title: undefined }),
    ).toEqual({ title: "From config" });
  });

  it("does NOT deep-merge nested cta — prop overrides whole object", () => {
    const config = { cta: { label: "Old", href: "/a" } };
    const props = { cta: { label: "New" } };
    expect(mergeConfigAndProps(config, props)).toEqual({ cta: { label: "New" } });
  });

  it("keeps unspecified config keys", () => {
    const result = mergeConfigAndProps(
      { id: "ad1", title: "A", subtitle: "B" },
      { title: "Z" },
    );
    expect(result).toEqual({ id: "ad1", title: "Z", subtitle: "B" });
  });
});

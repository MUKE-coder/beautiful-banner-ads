import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { composeRefs } from "../utils/compose-refs";

describe("composeRefs", () => {
  it("assigns the value to object refs", () => {
    const ref = createRef<HTMLDivElement>();
    const composed = composeRefs<HTMLDivElement>(ref);
    const el = document.createElement("div");
    composed(el);
    expect(ref.current).toBe(el);
  });

  it("invokes callback refs", () => {
    const cb = vi.fn();
    const composed = composeRefs<HTMLDivElement>(cb);
    const el = document.createElement("div");
    composed(el);
    expect(cb).toHaveBeenCalledWith(el);
  });

  it("composes mixed ref kinds in order", () => {
    const ref = createRef<HTMLDivElement>();
    const cb = vi.fn();
    const composed = composeRefs<HTMLDivElement>(ref, cb);
    const el = document.createElement("div");
    composed(el);
    expect(ref.current).toBe(el);
    expect(cb).toHaveBeenCalledWith(el);
  });

  it("tolerates undefined refs without throwing", () => {
    const cb = vi.fn();
    const composed = composeRefs<HTMLDivElement>(undefined, cb);
    composed(document.createElement("div"));
    expect(cb).toHaveBeenCalledOnce();
  });
});

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useInView } from "../hooks/useInView";

function makeAttachedRef() {
  return { current: document.createElement("div") };
}

describe("useInView", () => {
  it("fires onEnter once when the element enters view (mock IO)", () => {
    const onEnter = vi.fn();
    const ref = makeAttachedRef();
    const { result } = renderHook(() => useInView({ ref, onEnter, enabled: true }));
    expect(onEnter).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(true);
  });

  it("does not fire when disabled", () => {
    const onEnter = vi.fn();
    const ref = makeAttachedRef();
    renderHook(() => useInView({ ref, onEnter, enabled: false }));
    expect(onEnter).not.toHaveBeenCalled();
  });

  it("does not fire more than once even when re-rendered", () => {
    const onEnter = vi.fn();
    const ref = makeAttachedRef();
    const { rerender } = renderHook(() => useInView({ ref, onEnter, enabled: true }));
    rerender();
    rerender();
    expect(onEnter).toHaveBeenCalledTimes(1);
  });
});

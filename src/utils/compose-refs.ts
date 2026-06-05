import type { MutableRefObject, Ref, RefCallback } from "react";

/**
 * Compose multiple refs (object refs and/or callback refs) into a single
 * callback ref. Used internally to merge a consumer's `forwardRef` with the
 * primitive's own internal ref (needed for IntersectionObserver, focus, etc.).
 */
export function composeRefs<T>(
  ...refs: ReadonlyArray<Ref<T> | undefined>
): RefCallback<T> {
  return (value) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") {
        ref(value);
      } else {
        (ref as MutableRefObject<T | null>).current = value;
      }
    }
  };
}

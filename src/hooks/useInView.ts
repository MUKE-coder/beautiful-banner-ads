import { useEffect, useRef, useState, type RefObject } from "react";

interface UseInViewOptions {
  /** Element to observe. */
  ref: RefObject<Element | null>;
  /** Intersection ratio that counts as "in view". Default 0.5. */
  threshold?: number;
  rootMargin?: string;
  /** Whether to observe at all. Default true. */
  enabled?: boolean;
  /** Fired exactly once per mount, the first time threshold is reached. */
  onEnter?: () => void;
}

/**
 * SSR-safe `IntersectionObserver` wrapper. Returns whether the element is
 * currently in view and fires `onEnter` exactly once per mount.
 *
 * When `IntersectionObserver` is unavailable (very old browsers / non-DOM
 * test environments) the hook treats the element as in view and fires
 * `onEnter` immediately so impressions are never silently dropped.
 */
export function useInView({
  ref,
  threshold = 0.5,
  rootMargin,
  enabled = true,
  onEnter,
}: UseInViewOptions): boolean {
  const [inView, setInView] = useState(false);
  const firedRef = useRef(false);
  const onEnterRef = useRef(onEnter);
  onEnterRef.current = onEnter;

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      if (!firedRef.current) {
        firedRef.current = true;
        onEnterRef.current?.();
      }
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (!firedRef.current) {
              firedRef.current = true;
              onEnterRef.current?.();
              obs.disconnect();
              return;
            }
          } else {
            setInView(false);
          }
        }
      },
      rootMargin !== undefined ? { threshold, rootMargin } : { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold, rootMargin, enabled]);

  return inView;
}

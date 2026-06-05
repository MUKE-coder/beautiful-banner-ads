import { useEffect, useLayoutEffect } from "react";

/**
 * Use `useLayoutEffect` in the browser, `useEffect` on the server. Avoids the
 * "useLayoutEffect does nothing on the server" warning during SSR while still
 * running synchronously after paint in the client.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

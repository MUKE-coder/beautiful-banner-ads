import { createContext, useContext } from "react";
import type { AdMeta, OnClick } from "../types/ad";

export interface BannerContextValue {
  adMeta: AdMeta;
  dismiss: () => void;
  dismissible: boolean;
  /** Banner-level click handler. Slot CTAs forward their event through this. */
  onClick?: OnClick;
}

export const BannerContext = createContext<BannerContextValue | null>(null);

/** Read the context if present, return `null` otherwise (for standalone slots). */
export function useBannerContext(): BannerContextValue | null {
  return useContext(BannerContext);
}

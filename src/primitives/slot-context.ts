import { createContext, useContext } from "react";
import type { StorageAdapter } from "../types/ad";

/**
 * Slot-level cascade carrier for values that can't ride along inside a
 * serializable `BannerConfig` (like the `storage` adapter function). Any
 * `CustomBanner` rendered as a descendant of an `<AdSlot>` reads from
 * this context as a fallback when its own `storage`/`storageKey` prop is
 * undefined — so children-as-function consumers like
 * `<AdSlot storage={s}>{(c) => <BrandedBanner config={c} />}</AdSlot>`
 * inherit the slot's adapter without re-stating it on every banner.
 *
 * Per-banner props always win when set.
 */
export interface SlotContextValue {
  storage?: StorageAdapter;
  /** Pre-resolved per-ad storage key (already includes the slot's prefix). */
  storageKey?: string;
}

export const SlotContext = createContext<SlotContextValue | null>(null);

/** Read the slot context if present, `null` otherwise (banner used standalone). */
export function useSlotContext(): SlotContextValue | null {
  return useContext(SlotContext);
}

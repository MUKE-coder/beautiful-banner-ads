import { useCallback, useEffect, useState } from "react";
import type { AdMeta, OnClose, StorageAdapter } from "../types/ad";

interface UseDismissOptions {
  adMeta: AdMeta;
  /** Optional storage adapter. If provided, dismissals persist across reloads. */
  storage?: StorageAdapter;
  /** Storage key. Defaults to `bba-dismissed:${adMeta.id}`. */
  storageKey?: string;
  onClose?: OnClose;
  /** Whether dismissal is allowed at all. */
  enabled?: boolean;
}

interface UseDismissResult {
  dismissed: boolean;
  dismiss: () => void;
}

const DISMISSED_VALUE = "1";

/**
 * Manage banner dismissal state with optional persistence.
 *
 * Initial render always returns `dismissed: false` to avoid SSR hydration
 * mismatches — the prior-dismissal lookup runs in a post-mount effect.
 * Consumers who want zero-flicker should gate render in the host (e.g.
 * skip the banner entirely when the storage key is set).
 */
export function useDismiss({
  adMeta,
  storage,
  storageKey,
  onClose,
  enabled = true,
}: UseDismissOptions): UseDismissResult {
  const [dismissed, setDismissed] = useState(false);
  const key = storageKey ?? `bba-dismissed:${adMeta.id}`;

  useEffect(() => {
    if (!enabled || !storage) return;
    try {
      if (storage.get(key) === DISMISSED_VALUE) {
        setDismissed(true);
      }
    } catch {
      /* ignore storage errors (quota, security, etc.) */
    }
  }, [enabled, storage, key]);

  const dismiss = useCallback(() => {
    if (!enabled) return;
    setDismissed(true);
    if (storage) {
      try {
        storage.set(key, DISMISSED_VALUE);
      } catch {
        /* ignore storage errors */
      }
    }
    onClose?.(adMeta);
  }, [enabled, storage, key, onClose, adMeta]);

  return { dismissed, dismiss };
}

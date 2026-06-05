import type { StorageAdapter } from "../types/ad";

interface BaseStorageOptions {
  /** Underlying storage. Defaults to `window.localStorage` (or `sessionStorage` for `createSessionStorage`). */
  backing?: StorageAdapter;
  /** Optional key prefix — useful when sharing one origin across multiple ad placements. */
  namespace?: string;
}

interface ExpiringStorageOptions extends BaseStorageOptions {
  /** Days until a dismissed banner returns. */
  days: number;
}

interface ExpiringEntry {
  value: string;
  expiresAt: number;
}

function safeWindowStorage(kind: "localStorage" | "sessionStorage"): StorageAdapter | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    // Touching the property may throw in some sandboxed contexts
    // (Safari private mode historically, embedded WebViews, etc.).
    const store = window[kind];
    return store;
  } catch {
    return undefined;
  }
}

function withNamespace(store: StorageAdapter, namespace: string | undefined): StorageAdapter {
  if (!namespace) return store;
  const k = (key: string) => `${namespace}:${key}`;
  return {
    getItem: (key) => store.getItem(k(key)),
    setItem: (key, value) => store.setItem(k(key), value),
    removeItem: (key) => store.removeItem?.(k(key)),
  };
}

/**
 * Storage adapter that automatically forgets each key after `days` days.
 *
 * The intended pattern for self-promotion banners: respect the user's
 * "not now" — hide the banner — then quietly try again N days later.
 *
 * Returns `undefined` on the server (no `window`) so consumers can write:
 *
 *     <BannerAd
 *       dismissible
 *       storage={createExpiringStorage({ days: 7 })}
 *     />
 *
 * Survives legacy plain-string values (e.g. raw `"1"` written by an older
 * version of the package) by passing them through unchanged when JSON
 * parsing fails — so upgrading mid-session won't suddenly un-dismiss
 * already-dismissed banners.
 */
export function createExpiringStorage(
  options: ExpiringStorageOptions,
): StorageAdapter | undefined {
  const { days, backing, namespace } = options;
  const base = backing ?? safeWindowStorage("localStorage");
  if (!base) return undefined;

  const ttlMs = days * 24 * 60 * 60 * 1000;
  const k = (key: string) => (namespace ? `${namespace}:${key}` : key);

  return {
    getItem(key) {
      const raw = base.getItem(k(key));
      if (raw == null) return null;
      try {
        const parsed = JSON.parse(raw) as Partial<ExpiringEntry>;
        if (typeof parsed?.expiresAt !== "number" || typeof parsed.value !== "string") {
          // Not in our expiring shape — return as-is so legacy values still work.
          return raw;
        }
        if (Date.now() > parsed.expiresAt) {
          base.removeItem?.(k(key));
          return null;
        }
        return parsed.value;
      } catch {
        // Plain string written by some other code — return as-is.
        return raw;
      }
    },
    setItem(key, value) {
      const entry: ExpiringEntry = { value, expiresAt: Date.now() + ttlMs };
      base.setItem(k(key), JSON.stringify(entry));
    },
    removeItem(key) {
      base.removeItem?.(k(key));
    },
  };
}

/**
 * Wraps `window.sessionStorage` (SSR-safe). Dismissals only persist for
 * the current tab session.
 */
export function createSessionStorage(
  options: BaseStorageOptions = {},
): StorageAdapter | undefined {
  const base = options.backing ?? safeWindowStorage("sessionStorage");
  if (!base) return undefined;
  return withNamespace(base, options.namespace);
}

/**
 * Wraps `window.localStorage` (SSR-safe). Dismissals persist forever —
 * the user only ever sees a dismissed banner again if they clear storage.
 * Explicit name so the contrast with `createExpiringStorage` is clear at
 * the call site.
 */
export function createForeverStorage(
  options: BaseStorageOptions = {},
): StorageAdapter | undefined {
  const base = options.backing ?? safeWindowStorage("localStorage");
  if (!base) return undefined;
  return withNamespace(base, options.namespace);
}

import {
  Children,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useInjectStyles } from "../hooks/useInjectStyles";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { SlotContext, type SlotContextValue } from "../primitives/slot-context";
import type {
  AdMeta,
  BannerConfig,
  Position,
  SizePreset,
  StorageAdapter,
} from "../types/ad";
import type { ThemeMode } from "../types/theme";
import { cn } from "../utils/cn";
import { computeLayout, type Corner } from "../utils/layout";
import { BannerAd } from "./BannerAd";

export interface RotateOptions {
  /** Time between rotations, in milliseconds. */
  interval: number;
  /** Pause auto-advance when the user hovers over the slot. */
  pauseOnHover?: boolean;
  /** Pick the next ad randomly instead of cycling in order. */
  random?: boolean;
}

/**
 * Metadata fired once per full pass through `ads`. `lastAd` is the config
 * that just finished its display window; `nextAd` is the one about to mount.
 * For random rotation, `cycleCount` is not tracked — the callback never fires.
 */
export interface CycleCompleteMeta {
  /** How many full cycles have completed (1-based). */
  cycleCount: number;
  /** The ad that just finished displaying. */
  lastAd: AdMeta;
  /** The ad about to mount. Same as `lastAd` if rotation is paused. */
  nextAd?: AdMeta;
  /** Position context at the moment of cycle completion. */
  position: { corner?: Corner; offset?: number };
}

export interface AdSlotProps {
  /** Single ad configuration. Use this OR `children` OR `ads`. */
  ad?: BannerConfig;
  /** Multiple ads. When `rotate` is set, the slot cycles through them. */
  ads?: readonly BannerConfig[];
  /** Initial index. Default `0`. */
  initial?: number;
  /** Opt-in rotation. Off by default (static = show the first ad). */
  rotate?: RotateOptions;
  /** Position rules — same shape as `CustomBanner` props. */
  position?: Position;
  sticky?: boolean;
  /**
   * A single corner, or an array of corners. When an array is given the
   * slot advances to the next corner after every full pass through `ads`,
   * synced to AdSlot's internal rotation timer (no external `setInterval`
   * needed, no drift possible).
   */
  corner?: Corner | readonly Corner[];
  offset?: number;
  width?: string;
  /**
   * Storage adapter applied to every child ad's dismissal. Per-ad `config`
   * cannot carry a function, so this is the standard way to share one
   * adapter (e.g. `createExpiringStorage({ days: 7 })`) across a rotating
   * slot of self-promo banners. Only auto-applied to the default
   * `<BannerAd config={…} />` renderer — for `children-as-function`, pass
   * `storage` to your own component.
   */
  storage?: StorageAdapter;
  /**
   * Optional namespace prefix. When set, each child ad's dismiss key
   * becomes `${storageKey}:bba-dismissed:${ad.id}` — useful when one app
   * has multiple slots writing to the same `localStorage`.
   */
  storageKey?: string;
  /**
   * Slot-level default for `dismissible`. Each ad's `config.dismissible`
   * still wins per-ad — so you can set `dismissible` once on the slot and
   * mark a specific ad `dismissible: false` to make it permanent.
   */
  dismissible?: boolean;
  /**
   * Slot-level default for `layout`. Cascades into every child ad's config
   * unless the ad sets its own. Useful when one rotating slot of
   * `BrandedBanner` ads should all use the same layout (e.g. `"image-right"`).
   */
  layout?: "image-left" | "image-right" | "image-bg";
  /** Slot-level default for `size`. Per-ad `config.size` still wins. */
  size?: SizePreset;
  /** Slot-level default for `theme`. Per-ad `config.theme` still wins. */
  theme?: ThemeMode;
  /**
   * Fires once each time rotation wraps from the last ad back to the first.
   * Useful for analytics ("how many cycles did this reader see?") or for
   * mirroring AdSlot's cycle tick in your own UI without a racing
   * `setInterval`. Not fired for random rotation (no defined cycle).
   */
  onCycleComplete?: (meta: CycleCompleteMeta) => void;
  className?: string;
  style?: CSSProperties;
  /**
   * Either:
   *  - A render function `(config, index) => ReactNode` used when `ads` is given.
   *    Receives a config already merged with the slot's cascaded defaults
   *    (`dismissible`, `width`, `layout`, `size`, `theme`).
   *  - A single banner element (`<BannerAd …/>`) when neither `ad` nor `ads` is set.
   */
  children?: ReactNode | ((config: BannerConfig, index: number) => ReactNode);
}

function buildAdMeta(config: BannerConfig, fallbackIndex: number): AdMeta {
  return {
    id: config.id ?? `idx-${fallbackIndex}`,
    type: "Ad",
    config,
  };
}

/** Cascade slot-level defaults into the active config. Per-ad config always wins. */
function cascadeIntoConfig(
  activeConfig: BannerConfig,
  cascade: {
    dismissible?: boolean;
    width?: string;
    layout?: "image-left" | "image-right" | "image-bg";
    size?: SizePreset;
    theme?: ThemeMode;
  },
): BannerConfig {
  const patch: Partial<BannerConfig> = {};
  if (cascade.dismissible !== undefined && activeConfig.dismissible === undefined)
    patch.dismissible = cascade.dismissible;
  if (cascade.width !== undefined && activeConfig.width === undefined)
    patch.width = cascade.width;
  if (cascade.layout !== undefined && activeConfig.layout === undefined)
    patch.layout = cascade.layout;
  if (cascade.size !== undefined && activeConfig.size === undefined)
    patch.size = cascade.size;
  if (cascade.theme !== undefined && activeConfig.theme === undefined)
    patch.theme = cascade.theme;
  return Object.keys(patch).length === 0 ? activeConfig : { ...activeConfig, ...patch };
}

export function AdSlot(props: AdSlotProps) {
  const {
    ad,
    ads,
    initial = 0,
    rotate,
    position,
    sticky,
    corner,
    offset,
    width,
    storage,
    storageKey,
    dismissible,
    layout,
    size,
    theme,
    onCycleComplete,
    className,
    style,
    children,
  } = props;

  const reducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(initial);
  const [cycleCount, setCycleCount] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Refs avoid stale closures inside the rotation `setInterval` AND keep the
  // effect from re-running every time a callback identity changes. Side
  // effects live outside the `setIndex` updater so React Strict Mode's
  // double-invoke of updaters can't fire the callback twice per tick.
  const onCycleCompleteRef = useRef(onCycleComplete);
  const cycleCountRef = useRef(0);
  const indexRef = useRef(initial);
  useEffect(() => {
    onCycleCompleteRef.current = onCycleComplete;
  });
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useInjectStyles();

  const list = useMemo(() => ads ?? (ad ? [ad] : undefined), [ads, ad]);

  // Resolve corner: array form advances with cycleCount; single value passes through.
  const cornerArray = useMemo<readonly Corner[] | undefined>(
    () => (Array.isArray(corner) ? (corner as readonly Corner[]) : undefined),
    [corner],
  );
  const resolvedCorner: Corner | undefined = cornerArray
    ? (cornerArray[cycleCount % cornerArray.length] ?? cornerArray[0])
    : (corner as Corner | undefined);

  // Snapshot the resolved position info into a ref so the cycle-complete
  // callback always reports the corner that was active at the wrap moment.
  const positionRef = useRef({ corner: resolvedCorner, offset });
  useEffect(() => {
    positionRef.current = { corner: resolvedCorner, offset };
  });

  useEffect(() => {
    if (!list || !rotate || list.length <= 1) return;
    if (reducedMotion) return;
    if (rotate.pauseOnHover && isHovering) return;

    const id = setInterval(() => {
      const i = indexRef.current;

      if (rotate.random) {
        // Random rotation has no defined cycle — onCycleComplete is intentionally
        // not fired and corner arrays don't advance.
        let next = i;
        while (next === i) next = Math.floor(Math.random() * list.length);
        indexRef.current = next;
        setIndex(next);
        return;
      }

      const next = (i + 1) % list.length;
      indexRef.current = next;
      setIndex(next);

      if (next === 0 && i === list.length - 1) {
        cycleCountRef.current += 1;
        const newCount = cycleCountRef.current;
        setCycleCount(newCount);
        const meta: CycleCompleteMeta = {
          cycleCount: newCount,
          lastAd: buildAdMeta(list[i]!, i),
          nextAd: buildAdMeta(list[next]!, next),
          position: positionRef.current,
        };
        onCycleCompleteRef.current?.(meta);
      }
    }, rotate.interval);
    return () => clearInterval(id);
  }, [list, rotate, reducedMotion, isHovering]);

  const layoutStyles = computeLayout({
    position,
    sticky,
    corner: resolvedCorner,
    offset,
    width,
  });

  let content: ReactNode = null;
  if (list && list.length > 0) {
    const safeIndex = Math.min(index, list.length - 1);
    const activeConfig = list[safeIndex];
    if (activeConfig) {
      const mergedConfig = cascadeIntoConfig(activeConfig, {
        dismissible,
        width,
        layout,
        size,
        theme,
      });

      const adIdentity = activeConfig.id ?? `idx-${safeIndex}`;
      const resolvedStorageKey = storageKey
        ? `${storageKey}:bba-dismissed:${adIdentity}`
        : undefined;

      const inner =
        typeof children === "function" ? (
          children(mergedConfig, safeIndex)
        ) : (
          <BannerAd
            config={mergedConfig}
            storage={storage}
            storageKey={resolvedStorageKey}
          />
        );

      // Provide storage + resolved per-ad storageKey to any descendant
      // `CustomBanner` so children-as-function renderers don't have to
      // re-thread these props on the inner banner. Per-banner props win.
      if (storage || resolvedStorageKey) {
        const slotValue: SlotContextValue = {
          storage,
          storageKey: resolvedStorageKey,
        };
        content = <SlotContext.Provider value={slotValue}>{inner}</SlotContext.Provider>;
      } else {
        content = inner;
      }
    }
  } else if (children && typeof children !== "function") {
    const onlyChild = Children.only(children);
    if (isValidElement(onlyChild)) {
      content = onlyChild;
    } else {
      content = onlyChild;
    }
  }

  const handlers = rotate?.pauseOnHover
    ? {
        onMouseEnter: () => setIsHovering(true),
        onMouseLeave: () => setIsHovering(false),
        onFocus: () => setIsHovering(true),
        onBlur: () => setIsHovering(false),
      }
    : {};

  return (
    <div
      className={cn("bba-root", "bba-ad-slot", className)}
      style={{ ...layoutStyles.style, ...style }}
      data-bba-rotating={list && rotate ? "true" : undefined}
      {...layoutStyles.dataAttrs}
      {...handlers}
    >
      {content}
    </div>
  );
}
AdSlot.displayName = "AdSlot";

/** Alias — `BannerRotator` is sometimes a clearer name when rotation is the point. */
export const BannerRotator = AdSlot;

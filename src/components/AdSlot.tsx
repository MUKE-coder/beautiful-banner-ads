import {
  Children,
  isValidElement,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useInjectStyles } from "../hooks/useInjectStyles";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import type { BannerConfig, Position, StorageAdapter } from "../types/ad";
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
  corner?: Corner;
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
   * has multiple slots writing to the same `localStorage`. Per-ad
   * `config.storageKey` (if you ever add one) is not currently overridden
   * here since `storageKey` isn't part of `BannerConfig`.
   */
  storageKey?: string;
  /**
   * Slot-level default for `dismissible`. Each ad's `config.dismissible`
   * still wins per-ad — so you can set `dismissible` once on the slot and
   * mark a specific ad `dismissible: false` to make it permanent.
   */
  dismissible?: boolean;
  className?: string;
  style?: CSSProperties;
  /**
   * Either:
   *  - A render function `(config, index) => ReactNode` used when `ads` is given.
   *    Receives a config already merged with the slot's `dismissible` default.
   *  - A single banner element (`<BannerAd …/>`) when neither `ad` nor `ads` is set.
   */
  children?: ReactNode | ((config: BannerConfig, index: number) => ReactNode);
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
    className,
    style,
    children,
  } = props;

  const reducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(initial);
  const [isHovering, setIsHovering] = useState(false);

  useInjectStyles();

  const list = useMemo(() => ads ?? (ad ? [ad] : undefined), [ads, ad]);

  useEffect(() => {
    if (!list || !rotate || list.length <= 1) return;
    if (reducedMotion) return;
    if (rotate.pauseOnHover && isHovering) return;

    const id = setInterval(() => {
      setIndex((i) => {
        if (rotate.random) {
          if (list.length === 1) return 0;
          let next = i;
          while (next === i) next = Math.floor(Math.random() * list.length);
          return next;
        }
        return (i + 1) % list.length;
      });
    }, rotate.interval);
    return () => clearInterval(id);
  }, [list, rotate, reducedMotion, isHovering]);

  const layout = computeLayout({ position, sticky, corner, offset, width });

  let content: ReactNode = null;
  if (list && list.length > 0) {
    const safeIndex = Math.min(index, list.length - 1);
    const activeConfig = list[safeIndex];
    if (activeConfig) {
      // Cascade slot-level dismissible into config (per-ad config wins).
      const mergedConfig: BannerConfig =
        dismissible !== undefined && activeConfig.dismissible === undefined
          ? { ...activeConfig, dismissible }
          : activeConfig;

      // Build a per-ad storage key when the slot supplied a prefix.
      const adIdentity = activeConfig.id ?? `idx-${safeIndex}`;
      const resolvedStorageKey = storageKey
        ? `${storageKey}:bba-dismissed:${adIdentity}`
        : undefined;

      content =
        typeof children === "function" ? (
          children(mergedConfig, safeIndex)
        ) : (
          <BannerAd
            config={mergedConfig}
            storage={storage}
            storageKey={resolvedStorageKey}
          />
        );
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
      style={{ ...layout.style, ...style }}
      data-bba-rotating={list && rotate ? "true" : undefined}
      {...layout.dataAttrs}
      {...handlers}
    >
      {content}
    </div>
  );
}
AdSlot.displayName = "AdSlot";

/** Alias — `BannerRotator` is sometimes a clearer name when rotation is the point. */
export const BannerRotator = AdSlot;

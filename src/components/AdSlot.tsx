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
import type { BannerConfig, Position } from "../types/ad";
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
  className?: string;
  style?: CSSProperties;
  /**
   * Either:
   *  - A render function `(config, index) => ReactNode` used when `ads` is given.
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
      content =
        typeof children === "function"
          ? children(activeConfig, safeIndex)
          : <BannerAd config={activeConfig} />;
    }
  } else if (children && typeof children !== "function") {
    // Single-child placement wrapper — pass position to the child if possible.
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

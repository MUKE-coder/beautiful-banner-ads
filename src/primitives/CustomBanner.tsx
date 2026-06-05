import {
  forwardRef,
  useId,
  useMemo,
  useRef,
  type CSSProperties,
  type ForwardedRef,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { useDismiss, useInjectStyles, useInView } from "../hooks";
import { useTheme } from "../theme/theme-context";
import type {
  AdMeta,
  BannerConfig,
  CTA,
  OnClick,
  OnClose,
  OnView,
  StorageAdapter,
} from "../types/ad";
import type { ThemeMode } from "../types/theme";
import { cn } from "../utils/cn";
import { composeRefs } from "../utils/compose-refs";
import { mergeConfigAndProps } from "../utils/merge-config";
import { BannerContext, useBannerContext } from "./banner-context";

export interface CustomBannerProps {
  /** Stable id used in callbacks and as the default dismiss-storage key. */
  id?: string;
  /** Theme mode. Falls back to ThemeProvider, then `"system"`. */
  theme?: ThemeMode;
  /** Show a close button and handle dismissal. */
  dismissible?: boolean;
  /** Storage adapter for remembering dismissal across reloads. */
  storage?: StorageAdapter;
  /** Override the dismiss storage key. Defaults to `bba-dismissed:${id}`. */
  storageKey?: string;
  /** Accessible label for the banner. Default `"Advertisement"`. */
  ariaLabel?: string;
  /** Fires once when the banner reaches 50% intersection. */
  onView?: OnView;
  /** Fires when a CTA inside is activated. */
  onClick?: OnClick;
  /** Fires when the banner is dismissed. */
  onClose?: OnClose;
  /** Optional serializable config object. Explicit props always override these. */
  config?: BannerConfig;
  /** Extra class names appended after defaults (consumer wins cascade). */
  className?: string;
  style?: CSSProperties;
  /** Slot children (`CustomBanner.Body`, `.CTA`, …). */
  children?: ReactNode;
}

function CustomBannerInner(
  props: CustomBannerProps,
  forwardedRef: ForwardedRef<HTMLDivElement>,
) {
  const {
    config,
    id: idProp,
    theme: themeProp,
    dismissible: dismissibleProp,
    storage,
    storageKey,
    ariaLabel: ariaLabelProp,
    onView,
    onClick,
    onClose,
    className,
    style,
    children,
  } = props;

  const merged = mergeConfigAndProps(config, {
    id: idProp,
    theme: themeProp,
    dismissible: dismissibleProp,
    ariaLabel: ariaLabelProp,
  });

  const fallbackId = useId();
  const id = merged.id ?? fallbackId;
  const ariaLabel = merged.ariaLabel ?? "Advertisement";
  const dismissible = merged.dismissible ?? false;
  const providerTheme = useTheme();
  const themeMode: ThemeMode = merged.theme ?? providerTheme;

  useInjectStyles();

  const adMeta: AdMeta = useMemo(
    () => ({ id, type: "CustomBanner", config }),
    [id, config],
  );

  const internalRef = useRef<HTMLDivElement>(null);
  const composedRef = composeRefs<HTMLDivElement>(forwardedRef, internalRef);

  useInView({
    ref: internalRef,
    threshold: 0.5,
    enabled: !!onView,
    onEnter: () => onView?.(adMeta),
  });

  const { dismissed, dismiss } = useDismiss({
    adMeta,
    storage,
    storageKey,
    onClose,
    enabled: dismissible,
  });

  const ctxValue = useMemo(
    () => ({ adMeta, dismiss, dismissible, onClick }),
    [adMeta, dismiss, dismissible, onClick],
  );

  if (dismissed) return null;

  return (
    <BannerContext.Provider value={ctxValue}>
      <div
        ref={composedRef}
        className={cn("bba-root", "bba-banner", className)}
        data-bba-theme={themeMode}
        data-bba-id={id}
        role="complementary"
        aria-label={ariaLabel}
        style={style}
      >
        {children}
      </div>
    </BannerContext.Provider>
  );
}

const CustomBannerRoot = forwardRef<HTMLDivElement, CustomBannerProps>(CustomBannerInner);
CustomBannerRoot.displayName = "CustomBanner";

// ── Slot components ─────────────────────────────────────────────────────

interface SlotProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function BannerMedia({ children, className, style }: SlotProps) {
  return (
    <div className={cn("bba-banner__media", className)} style={style}>
      {children}
    </div>
  );
}
BannerMedia.displayName = "CustomBanner.Media";

export function BannerBody({ children, className, style }: SlotProps) {
  return (
    <div className={cn("bba-banner__body", className)} style={style}>
      {children}
    </div>
  );
}
BannerBody.displayName = "CustomBanner.Body";

export function BannerEyebrow({ children, className }: SlotProps) {
  return <span className={cn("bba-banner__eyebrow", className)}>{children}</span>;
}
BannerEyebrow.displayName = "CustomBanner.Eyebrow";

interface BannerTitleProps extends SlotProps {
  /** Element to render. Default `h2`. Use `h3` if your page already has a heading at h2. */
  as?: "h2" | "h3" | "h4" | "p" | "span" | "div";
}

export function BannerTitle({ children, className, as: Tag = "h2" }: BannerTitleProps) {
  return <Tag className={cn("bba-banner__title", className)}>{children}</Tag>;
}
BannerTitle.displayName = "CustomBanner.Title";

export function BannerSubtitle({ children, className }: SlotProps) {
  return <p className={cn("bba-banner__subtitle", className)}>{children}</p>;
}
BannerSubtitle.displayName = "CustomBanner.Subtitle";

export function BannerFinePrint({ children, className }: SlotProps) {
  return <p className={cn("bba-banner__fine-print", className)}>{children}</p>;
}
BannerFinePrint.displayName = "CustomBanner.FinePrint";

// ── CTA ─────────────────────────────────────────────────────────────────

export interface BannerCTAProps extends Partial<CTA> {
  /** Overrides `label` when both are present. */
  children?: ReactNode;
  className?: string;
}

export function BannerCTA(props: BannerCTAProps) {
  const ctx = useBannerContext();
  const { label, href, onClick, target, rel, variant = "primary", children, className } = props;
  const content = children ?? label;

  const handleClick = (event: ReactMouseEvent<HTMLElement>) => {
    if (ctx) ctx.onClick?.(ctx.adMeta, event.nativeEvent);
    onClick?.(event.nativeEvent);
  };

  const classes = cn(
    "bba-banner__cta",
    variant === "secondary" && "bba-banner__cta--secondary",
    className,
  );

  if (href) {
    const computedRel = target === "_blank" ? (rel ?? "noopener noreferrer") : rel;
    return (
      <a className={classes} href={href} target={target} rel={computedRel} onClick={handleClick}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={classes} onClick={handleClick}>
      {content}
    </button>
  );
}
BannerCTA.displayName = "CustomBanner.CTA";

// ── Close ───────────────────────────────────────────────────────────────

interface BannerCloseProps {
  /** Override the accessible label. Default `"Dismiss ad"`. */
  label?: string;
  className?: string;
  /** Custom icon. Default is a small "×" SVG. */
  children?: ReactNode;
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M1 1 L13 13 M13 1 L1 13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BannerClose({ label = "Dismiss ad", className, children }: BannerCloseProps) {
  const ctx = useBannerContext();
  if (!ctx || !ctx.dismissible) return null;
  return (
    <button
      type="button"
      className={cn("bba-banner__close", className)}
      aria-label={label}
      onClick={ctx.dismiss}
    >
      {children ?? <CloseIcon />}
    </button>
  );
}
BannerClose.displayName = "CustomBanner.Close";

// ── Compound export ─────────────────────────────────────────────────────

type CustomBannerType = typeof CustomBannerRoot & {
  Media: typeof BannerMedia;
  Body: typeof BannerBody;
  Eyebrow: typeof BannerEyebrow;
  Title: typeof BannerTitle;
  Subtitle: typeof BannerSubtitle;
  FinePrint: typeof BannerFinePrint;
  CTA: typeof BannerCTA;
  Close: typeof BannerClose;
};

const CustomBanner = CustomBannerRoot as CustomBannerType;
CustomBanner.Media = BannerMedia;
CustomBanner.Body = BannerBody;
CustomBanner.Eyebrow = BannerEyebrow;
CustomBanner.Title = BannerTitle;
CustomBanner.Subtitle = BannerSubtitle;
CustomBanner.FinePrint = BannerFinePrint;
CustomBanner.CTA = BannerCTA;
CustomBanner.Close = BannerClose;

export { CustomBanner };

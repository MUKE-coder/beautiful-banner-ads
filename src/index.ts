export { VERSION } from "./version";

// Theme
export {
  ThemeProvider,
  injectStyles,
  useResolvedTheme,
  useSystemTheme,
  useTheme,
} from "./theme";

// Hooks
export {
  useDismiss,
  useInjectStyles,
  useInView,
  useIsomorphicLayoutEffect,
  usePrefersReducedMotion,
} from "./hooks";

// Primitives
export {
  BannerBody,
  BannerCTA,
  BannerClose,
  BannerEyebrow,
  BannerFinePrint,
  BannerMedia,
  BannerSubtitle,
  BannerTitle,
  CustomBanner,
  type BannerCTAProps,
  type CustomBannerProps,
} from "./primitives";

// Utils
export { cn, composeRefs, mergeConfigAndProps, type ClassValue } from "./utils";

// Types
export type {
  AdMeta,
  BannerConfig,
  BrandColors,
  CTA,
  MediaSpec,
  OnClick,
  OnClose,
  OnView,
  Position,
  ResolvedTheme,
  SizePreset,
  StorageAdapter,
  ThemeMode,
} from "./types";

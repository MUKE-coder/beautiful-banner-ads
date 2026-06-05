import { forwardRef, type CSSProperties, type ForwardedRef } from "react";
import { CustomBanner, type CustomBannerProps } from "../primitives/CustomBanner";
import type { BrandColors, CTA } from "../types/ad";
import { cn } from "../utils/cn";

type ImageInput = string | { src: string; alt?: string };

export interface BrandedBannerProps
  extends Omit<CustomBannerProps, "children" | "componentType" | "mediaPosition"> {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  finePrint?: string;
  cta?: CTA;
  /** Transparent product image. Pass a URL or `{ src, alt }`. */
  image?: ImageInput;
  /** Brand palette — primary/accent/bg/text. Each is optional. */
  brandColors?: BrandColors;
  /** Where the image sits relative to the body. Default `"image-right"`. */
  layout?: "image-left" | "image-right" | "image-bg";
}

const LAYOUT_TO_MEDIA_POS = {
  "image-left": "left",
  "image-right": "right",
  "image-bg": "background",
} as const;

function normalizeImage(img: ImageInput | undefined): { src: string; alt: string } | null {
  if (!img) return null;
  if (typeof img === "string") return { src: img, alt: "" };
  return { src: img.src, alt: img.alt ?? "" };
}

function deriveBrandVars(b: BrandColors | undefined): CSSProperties | undefined {
  if (!b) return undefined;
  const out: Record<string, string> = {};
  if (b.bg) {
    out["--bba-brand-800"] = b.bg;
    out["--bba-brand-900"] = b.bg;
  }
  if (b.primary) {
    out["--bba-brand-700"] = b.primary;
    if (!b.bg) {
      out["--bba-brand-900"] = b.primary;
      out["--bba-brand-800"] = b.primary;
    }
  }
  if (b.accent) {
    out["--bba-accent-500"] = b.accent;
    out["--bba-accent-600"] = b.accent;
  }
  if (b.text) {
    out["--bba-on-brand"] = b.text;
  }
  const a = b.bg ?? b.primary ?? "var(--bba-brand-900)";
  const c = b.primary ?? "var(--bba-brand-700)";
  out["--bba-brand-gradient"] = `linear-gradient(105deg, ${a} 0%, ${a} 45%, ${c} 100%)`;
  return out as CSSProperties;
}

function BrandedBannerInner(
  props: BrandedBannerProps,
  forwardedRef: ForwardedRef<HTMLDivElement>,
) {
  const {
    title,
    subtitle,
    eyebrow,
    finePrint,
    cta,
    image,
    brandColors,
    layout,
    config,
    className,
    style,
    size,
    ...customProps
  } = props;

  const mergedTitle = title ?? config?.title;
  const mergedSubtitle = subtitle ?? config?.subtitle;
  const mergedEyebrow = eyebrow ?? config?.eyebrow;
  const mergedCta = cta ?? config?.cta;
  const mergedFinePrint = finePrint ?? config?.finePrint;
  const configImage = config?.media?.src ? { src: config.media.src, alt: config.media.alt } : undefined;
  const mergedImage = normalizeImage(image ?? configImage);
  const mergedBrand = brandColors ?? config?.brandColors;
  const mergedLayout = layout ?? config?.layout ?? "image-right";
  const mergedSize = size ?? config?.size ?? "leaderboard";

  const brandVars = deriveBrandVars(mergedBrand);

  return (
    <CustomBanner
      ref={forwardedRef}
      componentType="BrandedBanner"
      config={config}
      className={cn("bba-banner-branded", className)}
      style={{
        ...brandVars,
        background: "var(--bba-brand-gradient)",
        color: "var(--bba-on-brand)",
        ...style,
      }}
      mediaPosition={LAYOUT_TO_MEDIA_POS[mergedLayout]}
      size={mergedSize}
      {...customProps}
    >
      {mergedImage && (
        <CustomBanner.Media>
          <img
            src={mergedImage.src}
            alt={mergedImage.alt}
            className="bba-banner-branded__image"
            loading="lazy"
          />
        </CustomBanner.Media>
      )}
      <CustomBanner.Body>
        {mergedEyebrow && <CustomBanner.Eyebrow>{mergedEyebrow}</CustomBanner.Eyebrow>}
        {mergedTitle && <CustomBanner.Title>{mergedTitle}</CustomBanner.Title>}
        {mergedSubtitle && <CustomBanner.Subtitle>{mergedSubtitle}</CustomBanner.Subtitle>}
        {mergedFinePrint && <CustomBanner.FinePrint>{mergedFinePrint}</CustomBanner.FinePrint>}
      </CustomBanner.Body>
      {mergedCta && <CustomBanner.CTA {...mergedCta} />}
      <CustomBanner.Close />
    </CustomBanner>
  );
}

const BrandedBanner = forwardRef<HTMLDivElement, BrandedBannerProps>(BrandedBannerInner);
BrandedBanner.displayName = "BrandedBanner";

export { BrandedBanner };

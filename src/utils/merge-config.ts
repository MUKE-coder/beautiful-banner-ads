import type { BannerConfig } from "../types/ad";

/**
 * Merge a `config` object with explicit props. Explicit props always win
 * (`undefined` is treated as "not provided"). Nested objects like `cta` and
 * `media` are taken whole from props if defined, else from config — they are
 * **not deep-merged**.
 *
 * Per project-description.md §9: explicit props override `config`.
 */
export function mergeConfigAndProps<P extends Partial<BannerConfig>>(
  config: BannerConfig | undefined,
  props: P,
): BannerConfig & P {
  if (!config) return { ...props } as BannerConfig & P;
  const out: Record<string, unknown> = { ...config };
  for (const key of Object.keys(props) as (keyof P)[]) {
    const v = props[key];
    if (v !== undefined) out[key as string] = v;
  }
  return out as BannerConfig & P;
}

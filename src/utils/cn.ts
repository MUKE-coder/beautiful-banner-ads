export type ClassValue = string | number | false | null | undefined;

/**
 * Join class names into a single space-separated string. Falsy values
 * (`false`, `null`, `undefined`, `""`, `0`) are filtered out.
 *
 * Order is preserved so values passed later win the CSS cascade. The package
 * always passes its own defaults first and the consumer's `className` last,
 * meaning consumer classes (Tailwind utilities, hand-written CSS) override
 * the package's defaults predictably.
 *
 * Kept dep-free and ~50 bytes — for Tailwind-conflict resolution wrap output
 * with `tailwind-merge` in your own code.
 */
export function cn(...values: readonly ClassValue[]): string {
  let out = "";
  for (const v of values) {
    if (!v) continue;
    if (out) out += " ";
    out += String(v);
  }
  return out;
}

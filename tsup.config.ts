import { defineConfig } from "tsup";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const CSS_SOURCE_FILE = resolve("src/theme/css-source.ts");
const CSS_DEST_FILE = resolve("dist/styles.css");

/**
 * Extract the canonical CSS string from `src/theme/css-source.ts` and write
 * it to `dist/styles.css` for consumers who prefer an explicit stylesheet
 * import (SSR-rendered apps, no-FOUC setups).
 *
 * Regex parsing keeps this build step free of runtime TS imports — works
 * with any bundler or CI setup without needing a separate transform.
 */
async function extractCss(): Promise<void> {
  const source = await readFile(CSS_SOURCE_FILE, "utf8");
  const match = source.match(
    /cssSource\s*=\s*String\.raw\s*`([\s\S]*?)`\s*\.trim\s*\(\s*\)/,
  );
  const captured = match?.[1];
  if (typeof captured !== "string") {
    throw new Error(
      `[tsup] Could not extract canonical CSS from ${CSS_SOURCE_FILE}. ` +
        "Expected pattern: `export const cssSource = String.raw`...`.trim()`.",
    );
  }
  await mkdir(dirname(CSS_DEST_FILE), { recursive: true });
  await writeFile(CSS_DEST_FILE, captured.trim() + "\n");
}

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "tailwind-preset": "src/theme/tailwind-preset.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  splitting: false,
  target: "es2020",
  external: ["react", "react-dom", "react/jsx-runtime"],
  outDir: "dist",
  onSuccess: extractCss,
});

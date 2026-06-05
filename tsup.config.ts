import { defineConfig } from "tsup";
import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

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
  async onSuccess() {
    const src = resolve("src/theme/styles.css");
    const dest = resolve("dist/styles.css");
    await mkdir(dirname(dest), { recursive: true });
    await copyFile(src, dest);
  },
});

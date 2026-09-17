import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    css: true,
    include: ["src/tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/tests/**",
        "src/app/**",
        "src/styles/**",
        "**/*.css",
        "**/node_modules/**",
        "**/out/**",
        "**/.next/**",
        "**/vitest.setup.ts",
        "**/next.config.ts",
        "**/postcss.config.mjs",
        "**/eslint.config.mjs",
      ],
    },
  },
});

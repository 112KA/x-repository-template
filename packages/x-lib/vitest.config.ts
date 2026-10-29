import path from "node:path";
import { defineConfig } from "vite-plus";

export default defineConfig({
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://viteplus.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false,
    environment: "node",
    globals: true,
    include: ["tests/**/*.{test,spec}.{ts,js}"],
    coverage: { reporter: ["text" /* , 'lcov' */], provider: "v8" },
    alias: {
      "@112ka/x": path.resolve(__dirname, "../x/src"),
      x3: path.resolve(__dirname, "../x3/src"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

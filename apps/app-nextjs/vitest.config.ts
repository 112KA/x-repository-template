import { defineConfig } from "vite-plus";

export default defineConfig({
  css: {
    // disable loading project PostCSS config during tests
    postcss: undefined,
  },
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://viteplus.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false,
    environment: "happy-dom",
    exclude: ["**/e2e/**/*.spec.ts"],
    setupFiles: ["./vitest.setup.ts"],
    coverage: { reporter: ["text" /* , 'lcov' */], provider: "v8" },
    globals: true,
    css: false,
  },
});

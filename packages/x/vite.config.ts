import { defineConfig } from "vite-plus";

export default defineConfig({
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://viteplus.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false,
  },
  pack: {
    root: "src",
    entry: [
      "src/@types/*.ts",
      "!src/@types/*.test.ts",
      "src/application/*.ts",
      "!src/application/*.test.ts",
      "src/data/*.ts",
      "!src/data/*.test.ts",
      "src/decorators/*.ts",
      "!src/decorators/*.test.ts",
      "src/errors/*.ts",
      "!src/errors/*.test.ts",
      "src/features/*.ts",
      "!src/features/*.test.ts",
      "src/math/*.ts",
      "!src/math/*.test.ts",
      "src/structures/*.ts",
      "!src/structures/*.test.ts",
      "src/web/*.ts",
      "!src/web/*.test.ts",
    ],
    dts: true,
    unbundle: true,
    preserveModules: true,
  },
});

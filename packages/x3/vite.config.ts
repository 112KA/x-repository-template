import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    entry: [
      "src/application/*.ts",
      "!src/application/*.test.ts",
      "src/asset/*.ts",
      "!src/asset/*.test.ts",
      "src/camera/*.ts",
      "!src/camera/*.test.ts",
      "src/loaders/*.ts",
      "!src/loaders/*.test.ts",
      "src/misc/*.ts",
      "!src/misc/*.test.ts",
      "src/nodes/*.ts",
      "!src/nodes/*.test.ts",
      "src/textures/*.ts",
      "!src/textures/*.test.ts",
    ],
    dts: true,
    unbundle: true,
    // minify: true,
  },
});

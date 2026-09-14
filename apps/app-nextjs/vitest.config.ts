import { defineConfig } from 'vite-plus'

export default defineConfig({
  css: {
    // disable loading project PostCSS config during tests
    postcss: undefined,
  },
  test: {
    environment: 'happy-dom',
    exclude: ['**/e2e/**/*.spec.ts'],
    setupFiles: ['./vitest.setup.ts'],
    coverage: { reporter: ['text'/* , 'lcov' */], provider: 'v8' },
    globals: true,
    css: false,
  },
})

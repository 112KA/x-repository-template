import { defineConfig } from 'vitest/config'

export default defineConfig({
  css: {
    // disable loading project PostCSS config during tests
    postcss: undefined,
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: { reporter: ['text'/* , 'lcov' */], provider: 'v8' },
    globals: true,
    css: false,
  },
})

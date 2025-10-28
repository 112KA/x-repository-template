import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: [
      'tests/**/*.{test,spec}.{ts,js}',
    ],
    coverage: { reporter: ['text'/* , 'lcov' */], provider: 'v8' },
    alias: {
      'x': path.resolve(__dirname, '../x/src'),
      'x3': path.resolve(__dirname, '../x3/src'),
      '@': path.resolve(__dirname, './src'),
    },
  },
})

import { defineConfig } from 'vite-plus'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: [
      'src/**/*.{test,spec}.{ts,js}',
    ],
    coverage: { reporter: ['text'/* , 'lcov' */], provider: 'v8' },
    alias: {
    },
  },
})

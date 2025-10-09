import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts({ entryRoot: 'src' })],
  build: {
    outDir: './dist',
    sourcemap: true,
    target: 'es2018',
    lib: {
      entry: './src/index.ts',
      name: 'x3',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['three', 'three/webgpu', 'three/examples/jsm/Addons.js', 'x'],
      output: {
        inlineDynamicImports: false,
        preserveModules: true,
        preserveModulesRoot: 'src',
        exports: 'named',
        entryFileNames: ({ name: fileName }) => {
          return `${fileName}.js`
        },
      },
    },
  },
  resolve: {
    alias: {
      x3: resolve(__dirname, './src'),
      x: '@112ka/x',
    },
  },
})

import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
// @ts-check
import { defineConfig } from 'astro/config'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [basicSsl(), tailwindcss()],

    resolve: {
      alias: {
        x: resolve(__dirname, './node_modules/x/dist'),
      },
    },
  },
})

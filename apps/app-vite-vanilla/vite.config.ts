import tailwindcss from "@tailwindcss/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { defineConfig } from "vite";
import { lazyPlugins } from "vite-plus";

export default defineConfig({
  plugins: lazyPlugins(() => [tailwindcss(), basicSsl()]),
  server: {
    strictPort: false,
  },
});

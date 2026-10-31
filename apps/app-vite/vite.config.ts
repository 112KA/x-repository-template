import tailwindcss from "@tailwindcss/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { defineConfig, lazyPlugins } from "vite-plus";

export default defineConfig({
  plugins: lazyPlugins(() => [tailwindcss(), basicSsl()]),
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
  },
});

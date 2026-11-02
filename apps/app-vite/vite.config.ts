import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { defineConfig, lazyPlugins } from "vite-plus";

export default defineConfig(({ command, isPreview }) => ({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: lazyPlugins(() => [
    tailwindcss(),
    reactRouter(),
    // プリレンダリング用previewはHTTPを使うため、HTTPS化は開発サーバーに限定する。
    ...(command === "serve" && !isPreview ? [basicSsl()] : []),
  ]),
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
  },
}));

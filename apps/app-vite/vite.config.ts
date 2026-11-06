import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { defineConfig, lazyPlugins } from "vite-plus";
import { BASE_PATH } from "./base-path.ts";

export default defineConfig(({ command, isPreview }) => ({
  base: BASE_PATH,
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
  // 初回ページ読み込み中に依存が再最適化されると動的 import が失敗するため、読み込みで使う依存を事前に最適化しておく。
  optimizeDeps: {
    include: [
      "react",
      "react-dom/client",
      "react/jsx-runtime",
      "react-router",
      "react-router/dom",
      "@base-ui/react/navigation-menu",
      "@base-ui/react/switch",
      "class-variance-authority",
      "cn",
      "lucide-react",
    ],
  },
}));

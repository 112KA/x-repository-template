import type { Config } from "@react-router/dev/config";
import { BASE_PATH } from "./base-path.ts";

export default {
  appDirectory: "app",
  ssr: false,
  prerender: true,
  basename: BASE_PATH,
} satisfies Config;

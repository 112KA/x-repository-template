import { readdir, rename, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BASE_PATH } from "../base-path.ts";

const appDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const clientDir = path.join(appDir, "build", "client");
const basenameDir = path.join(clientDir, BASE_PATH);

// basename が "/" のときは移動先が build/client 自身になるため、移動は不要。
if (path.resolve(basenameDir) === path.resolve(clientDir)) {
  process.exit(0);
}

// react-router は prerender の HTML を basename 配下に出力するが、アセットや public 配下のファイルは build/client 直下に出力される。
// HTML やコードからは basename 配下で参照されるため、SPA fallback の index.html 以外を basename 配下へ移動して URL と配置を一致させる。
const basenameTopDir = BASE_PATH.split("/").filter(Boolean)[0];
const keepAtRoot = new Set(["index.html", "__spa-fallback.html", basenameTopDir]);
if (
  !(await stat(basenameDir).then(
    (s) => s.isDirectory(),
    () => false,
  ))
) {
  throw new Error(
    `basename 配下の出力が見つかりません: ${basenameDir}（react-router.config.ts の basename を確認してください）`,
  );
}
for (const entry of await readdir(clientDir)) {
  if (keepAtRoot.has(entry)) continue;
  const dest = path.join(basenameDir, entry);
  await rm(dest, { recursive: true, force: true });
  await rename(path.join(clientDir, entry), dest);
}

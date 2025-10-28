# Suggested Commands

Useful commands to work with this repository (run from the repository root):

## Install
- `pnpm install` — install all workspace dependencies

## Development
- `pnpm dev:astro` — start `app-astro` development server (commonly used together with `pnpm watch`)
- `pnpm dev:nextjs` — start `app-nextjs` development server
- `pnpm dev:vite` — start `app-vite-vanilla` development server
- `pnpm watch` — run package watch tasks (e.g., `tsdown --watch` for packages)
- `pnpm -F <package>` — focus on a single package (example: `pnpm -F @112ka/x`)

## Build
- `pnpm build` — build selected workspace packages (root script targets `@112ka/x` and `@112ka/x3`)
- `pnpm x build` — build `@112ka/x` package
- `pnpm x3 build` — build `@112ka/x3` package

## Lint / format
- `pnpm lint` — run workspace lint/fix (root maps to `pnpm -r lint:fix`)

## Git and misc
- `git status`, `git add -p`, `git commit`, `git push` — standard git workflows

## Notes
- The root `postinstall` runs `pnpm build`. If you want to avoid running build steps during install (for CI or local work), consider `pnpm install --ignore-scripts`.
# suggested_commands

開発でよく使うコマンド集（ルートから実行）:

- インストール
  - `pnpm install`

- 開発サーバ / ホットリロード
  - `pnpm dev:astro`  -> `apps/app-astro` の開発サーバ（`pnpm watch` と併用）
  - `pnpm dev:nextjs` -> `apps/app-nextjs` の開発サーバ
  - `pnpm dev:vite`   -> `apps/app-vite-vanilla` の開発サーバ
  - `pnpm watch`      -> ライブラリのウォッチ（`packages/*` の watch スクリプトを起動）

- ビルド
  - `pnpm build`           -> ワークスペース全体のビルド（`@112ka/x`, `@112ka/x3` を含む）
  - `pnpm x build`         -> `@112ka/x` パッケージのビルド
  - `pnpm x3 build`        -> `@112ka/x3` パッケージのビルド

- Lint / フォーマット
  - `pnpm lint`            -> ルートで定義された lint（fix を含む）
  - `pnpm -r lint:fix`     -> ワークスペース内の lint:fix を再帰実行

- その他
  - `pnpm install --filter <pkg>` 等でフィルタを利用
  - `pnpm -F <package>` でフォーカス実行

Git / ローカル操作の参考コマンド
- `git status`, `git add -p`, `git commit`, `git push`

注意: ルート `postinstall` が `pnpm build` を呼ぶため、CI やインストール後の副作用を考慮する（必要に応じて `--ignore-scripts` を使う）

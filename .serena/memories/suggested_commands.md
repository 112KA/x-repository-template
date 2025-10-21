主要コマンド（推奨）:

- 依存インストール:
  - `pnpm install`

- 開発:
  - ルートで全体開発（例）: `pnpm dev`（内部で `pnpm watch` と `pnpm app:astro dev` を並列実行）
  - 個別アプリ: `pnpm --filter app-astro dev` または `pnpm -F app-astro dev`（package.json の script を参照）

- ビルド:
  - ルートでワークスペース内の x と x3 をビルド: `pnpm build`
  - 個別パッケージ: `pnpm x` / `pnpm x3` にエイリアスがある

- ウォッチ/ホットリロード:
  - `pnpm watch`（ライブラリ監視）
  - 各アプリの dev スクリプトを併用

- Lint/Format:
  - `pnpm lint`（ルートでは `pnpm -r lint:fix` を実行）

- Git フック / コミット整形:
  - `husky` が `prepare` スクリプトで有効化されている。lint-staged の設定あり。コミット前に自動で lint が走る可能性あり。

- ユーティリティ:
  - `.npmrc.org` をコピーして `.npmrc` に調整: `cp .npmrc.org .npmrc`
  - pnpm のフィルタ指定: `pnpm -F <package>` / `pnpm --filter <package>`

備考: ルート `package.json` の scripts を参照すると便利（`app`, `dev`, `build`, `watch` など）。
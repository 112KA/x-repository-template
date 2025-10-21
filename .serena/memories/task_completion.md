タスク完了時に実行/確認すべきこと:

1. Lint/Format の適用
   - `pnpm lint` をルートで実行し、指摘がないことを確認する。自動修正が必要な場合は `pnpm -r lint:fix` を利用する。

2. ビルドの確認
   - 変更がパッケージに影響する場合は `pnpm build`（または個別 `pnpm x build`）を実行してビルドが成功することを確認する。

3. ローカル動作確認
   - 該当アプリがある場合はその dev モードで動作確認（例: `pnpm app:astro dev`）

4. Git / CI
   - コミット前に Husky が起動していることを確認。CI での `pnpm install` → `pnpm build` の流れを想定する。

5. ドキュメント更新
   - 変更に伴い README やパッケージの README を更新する。

備考: ルートの `postinstall` に `pnpm build` が設定されているので、依存インストール後の振る舞いに注意する。

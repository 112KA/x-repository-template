# Task completion checklist

- 変更したパッケージに応じて lint/check を実行: packages/x は pnpm x lint, apps/app-vite は pnpm check (vp check)。
- 関連テストを実行: pnpm testAll または pnpm x test。
- packages/x の export を追加した場合は src/index.ts 更新とビルド (pnpm build:x)。
- pre-commit で lint-staged が走るため、コミット前に lint:fix が通ることを確認。
- vp check が環境で失敗する場合は `vp env doctor` で診断。

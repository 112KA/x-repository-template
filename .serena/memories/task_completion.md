# Task Completion Checklist

Use this checklist before creating a pull request to ensure changes are ready.

1. Update local base
   - `git fetch`
   - `git rebase origin/main` (or `git merge`, depending on workflow)

2. Install or update dependencies
   - `pnpm install`

3. Build and type-check
   - `pnpm build` (or `pnpm x build` to build a specific package)
   - Run a TypeScript type-check if your workflow separates it (for example `pnpm -w tsc --noEmit` if configured)

4. Lint and auto-fix
   - `pnpm -r lint:fix` or `pnpm lint`

5. Run tests (if available)
   - `pnpm -r test` or package-specific test scripts

6. Review changes
   - `git diff --staged` to confirm staged changes

7. Commit and open PR
   - Use a clear commit message and follow any PR templates in the repository

8. Monitor CI and address feedback

Notes:
- The checklist assumes workspace-level scripts are available. Adjust per-package commands where appropriate.
# task_completion

タスク完了時に行う標準的な手順（PR を作る前のチェックリスト）:

1. 変更を最新にする
   - `git fetch` / `git rebase origin/main`（または `git merge`）

2. 依存関係を更新/インストール（必要な場合）
   - `pnpm install`

3. ビルドと型チェック
   - `pnpm build`（必要なパッケージのみなら `pnpm x build` など）
   - （型チェックが別に必要なら）`pnpm -w tsc --noEmit` をプロジェクトに合わせて実行

4. Lint / 自動修正
   - `pnpm -r lint:fix` または `pnpm lint`

5. 変更の確認
   - `git diff --staged` / `pnpm -r test`（テストがある場合）

6. コミットと PR 作成
   - コミットメッセージは意味を持つ短い要約 + 詳細
   - PR テンプレートがあればそれに従う

7. CI の確認
   - PR が通るまで必要に応じて修正

簡潔に: `pnpm install`, `pnpm -r lint:fix`, `pnpm build`, コミット -> プルリクの流れを基本とする。
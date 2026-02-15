# Git Workflow

## Commit メッセージ形式

```
<type>: <description>

<optional body>

```

- **Conventional Commits** 形式に従う:
  - `feat:` - 新機能
  - `fix:` - バグ修正
  - `refactor:` - リファクタリング
  - `test:` - テストの追加・修正
  - `docs:` - ドキュメントの更新
  - `chore:` - ビルドプロセスやツールの変更
  - `perf:` - パフォーマンスの改善
  - `ci:` - CI/CD パイプラインの変更
  - `style:` - コードスタイルの変更
  - `build:` - ビルドシステムの変更
  - `release:` - リリースの変更
  - `security:` - セキュリティの変更

## pre-commit フック

- `simple-git-hooks` が自動的に `lint-staged` を実行
- コミット前に自動でリンティングが行われる

## Pull Request Workflow

PR 作成時：

1. 最新のコミットだけでなく、完全なコミット履歴を分析する
2. `git diff [base-branch]...HEAD` を使用してすべての変更を確認する
3. 包括的な PR サマリーを起草する
4. TODO 付きのテスト計画を含める
5. 新しいブランチの場合は、`-u` フラグを使用してプッシュする

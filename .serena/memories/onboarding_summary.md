# オンボーディング概要

このプロジェクトは **x-repository-template** という pnpm モノレポテンプレートです。

## クイックスタート

1. **セットアップ**: [docs/CONTRIBUTING.md](../../docs/CONTRIBUTING.md) を参照
2. **プロジェクト概要**: [docs/PRODUCT.md](../../docs/PRODUCT.md) を参照
3. **アーキテクチャ**: [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md) を参照

## 重要なポイント

- **パッケージマネージャー**: `pnpm` のみ使用
- **コードスタイル**: @antfu/eslint-config に従う
- **日本語対応**: GitHub Copilot は日本語で回答
- **質問を推奨**: 不明点があれば必ず質問して明確化する

## メモリファイル

以下のメモリファイルが利用可能:
- `project_overview.md` - プロジェクト構造と技術スタック
- `style_conventions.md` - コーディング規約
- `suggested_commands.md` - よく使うコマンド一覧
- `task_completion.md` - タスク完了時のチェックリスト

## ディレクトリ構成

```
apps/       - アプリケーション (Next.js, Astro, Vite)
packages/   - 共通ライブラリ (@112ka/x, @112ka/x3, x-lib)
docs/       - ドキュメント
schemas/    - スキーマ定義
scripts/    - スクリプト
```

## 開発の基本フロー

1. `pnpm dev:nextjs` で開発サーバー起動
2. コード編集 (保存時に自動リンティング)
3. `pnpm lint:fix` でコード整形
4. `pnpm test` でテスト実行
5. `git commit -m "feat: ..."` でコミット (Conventional Commits)

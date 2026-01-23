# コーディング規約とスタイル

## 言語とフォーマット

- **言語**: TypeScript (Strict Mode)
- **リンティング**: ESLint + @antfu/eslint-config
- **コードスタイル**: [@antfu/eslint-config](https://github.com/antfu/eslint-config)
- **自動整形**: 保存時に ESLint が自動整形

## 命名規則

- **変数・関数**: camelCase
- **コンポーネント**: PascalCase
- **定数**: UPPER_SNAKE_CASE

## テストポリシー

- **テストフレームワーク**: Vitest
- **テストライブラリ**: @testing-library/react (Next.js アプリ)
- **カバレッジ**: 80% 以上を推奨
- **テストの粒度**: 開発コストを抑えるため、クリティカルパスのみテスト

## Git ワークフロー

- **ブランチ命名**: `feature/` または `fix/` から始める
- **コミットメッセージ**: Conventional Commits 形式に従う
  - 例: `feat: add new feature`, `fix: correct bug`
- **pre-commit フック**: lint-staged が自動実行され、リンティングが行われる

## ドキュメント

- **JSDoc**: 全ての関数には JSDoc 形式でコメントを記述
- **inline コメント**: 複雑なロジックには inline コメントを付ける

## ファイル構成ルール

- 機能が小さい場合は、テストファイルを過度に分割しない
- 統合テストファイルを優先し、ハッピーパスのみテスト

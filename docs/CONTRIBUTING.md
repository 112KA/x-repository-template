# Contributing Guidelines

## Setup

1. `.npmrc` の準備（重要）

- トークンをリポジトリにコミットしないでください。プロジェクトにはテンプレートファイル `.npmrc.org` が含まれています。
- ローカルで使う場合はコピーして必要な値を置き換えます:
```bash
cp .npmrc.org .npmrc
# - ★エディタで .npmrc を開き、%%PERSONAL_ACCESS_TOKEN%% を自分の Personal Access Token に置き換えてください
# - ★飯塚にpackages/xのaccess権限登録を依頼してください
```

2. 依存関係をインストール
```bash
pnpm install
```

## Usage

### 開発サーバー起動
```bash
pnpm dev:nextjs   # Next.js 開発サーバー
pnpm dev:astro    # Astro 開発サーバー
pnpm dev:vite     # Vite 開発サーバー
```

### 補足: ルートのスクリプトについて
- ルートの `postinstall` スクリプトは `pnpm build` を実行します。
- `prepare` スクリプトは simple-git-hooks のセットアップを行います。

## Coding Standards

### 言語とツール
- **Language**: TypeScript (Strict Mode)
- **Linting**: ESLint 9 + @antfu/eslint-config (保存時に自動整形)
- **Testing**: Vitest + @testing-library/react

### 命名規則
- **変数・関数**: camelCase
- **コンポーネント**: PascalCase
- **定数**: UPPER_SNAKE_CASE

### コード品質
```bash
# リンティング
pnpm lint

# リンティング (自動修正)
pnpm lint:fix
```

### コメント
- **JSDoc**: 全ての関数には JSDoc 形式でコメントを記述
- **inline コメント**: 複雑なロジックには inline コメントを付ける

### Code Patterns

**Internal Package References**: Use `"@112ka/x": "workspace:*"` in package.json for internal dependencies - automatically resolves to workspace version.

**Error Handling**: Extend custom errors from `packages/x/src/errors/` instead of generic Error.

**Exports**: All packages use ESM with proper `dist/` exports in package.json. Update `index.ts` and let `tsdown` generate dist files.

## Testing Policy

### 基本方針
- **粒度**: 機能が小さい場合はテストを統合し、過度な分割を避ける
- **対象**: ハッピーパス (正常系) を優先、エッジケースは必要最小限
- **カバレッジ**: 80% 以上を推奨 (開発コストとのバランスを重視)
- **テストツール**: Vitest, @testing-library/react, happy-dom

### テスト実行
```bash
# Next.js アプリのテスト
pnpm app:nextjs test

# カバレッジ付き
pnpm -F app-nextjs test
```

## Git Workflow

### ブランチ戦略
- **ブランチ命名**: `feature/` または `fix/` から始める
  - 例: `feature/add-login`, `fix/navigation-bug`

### コミット規則
- **Conventional Commits** 形式に従う:
  - `feat:` - 新機能
  - `fix:` - バグ修正
  - `refactor:` - リファクタリング
  - `test:` - テストの追加・修正
  - `docs:` - ドキュメントの更新
  - `chore:` - ビルドプロセスやツールの変更

### タスク完了時のフロー
1. `pnpm lint:fix` - コードの整形
2. `pnpm test` - テスト実行
3. `git add .` - 変更をステージング
4. `git commit -m "feat: add feature"` - コミット (pre-commit フックで自動リンティング)
5. `git push` - プッシュ


# x-repository-template: AI エージェント向けモノレポガイド

このドキュメントは、pnpm モノレポ全体での実践的な開発作業を支援するための情報を提供します。プロジェクトの概要や基本的な構造については [`.github/copilot-instructions.md`](.github/copilot-instructions.md) を参照してください。

## モノレポ設計の背景と思想

### pnpm workspace による統合管理

**背景**: 複数のフロントエンドフレームワーク（Next.js、Astro、Vite）と共有ライブラリを効率的に管理するため

- **workspace:* プロトコル**: 内部パッケージを自動的にワークスペースバージョンに解決
- **自動ビルドパイプライン**: `postinstall` フックで依存パッケージを自動ビルド
- **高速な依存関係解決**: pnpm のシンボリックリンク戦略による効率的な node_modules

### パッケージアーキテクチャ

**apps/**: アプリケーション層
- `app-nextjs`: Next.js 16 (App Router) - メインアプリケーション
- `app-astro`: Astro - 静的サイト生成
- `app-vite-vanilla`: Vite - シンプルな TypeScript アプリ

**packages/**: 共有ライブラリ層
- `@112ka/x`: コアライブラリ（プライベートパッケージ）
- `@112ka/x3`: 3D関連機能
- `x-lib`: 汎用ユーティリティ

## よくある開発タスク

### 1. 新しいアプリケーションの追加

```bash
# apps/ ディレクトリに新規アプリを作成
cd apps
mkdir app-new-framework
cd app-new-framework

# package.json を作成
cat > package.json <<EOF
{
  "name": "app-new-framework",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "your-dev-command",
    "build": "your-build-command",
    "lint": "eslint",
    "lint:fix": "eslint --fix"
  },
  "dependencies": {
    "x": "workspace:@112ka/x@*"
  }
}
EOF

# ルートの package.json にショートカットを追加
# "app:new": "pnpm -F app-new-framework"
```

### 2. 新しい共有パッケージの追加

```bash
# packages/ ディレクトリに新規パッケージを作成
cd packages
mkdir my-package
cd my-package

# package.json を作成
cat > package.json <<EOF
{
  "name": "@112ka/my-package",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    ".": "./dist/index.js"
  },
  "scripts": {
    "build": "tsdown",
    "watch": "tsdown --watch",
    "lint": "eslint",
    "lint:fix": "eslint --fix"
  },
  "devDependencies": {
    "tsdown": "latest",
    "typescript": "5.9.3"
  }
}
EOF

# tsdown.config.ts を作成
cat > tsdown.config.ts <<EOF
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  clean: true,
  dts: true,
})
EOF

# src/index.ts を作成
mkdir src
echo "export * from './utils'" > src/index.ts
```

### 3. パッケージ間の依存関係追加

```bash
# アプリケーションから共有パッケージを参照
cd apps/app-nextjs
pnpm add @112ka/my-package@workspace:*

# または package.json を直接編集
# "dependencies": {
#   "@112ka/my-package": "workspace:*"
# }

# インストール
pnpm install
```

### 4. 並列開発: パッケージ変更をリアルタイムで反映

```bash
# ターミナル1: パッケージを watch モードでビルド
pnpm watch  # または pnpm watch:x, pnpm watch:x3

# ターミナル2: アプリケーションを開発モードで起動
pnpm dev:nextjs  # または dev:astro, dev:vite
```

### 5. すべてのパッケージをビルド

```bash
# ルートから全パッケージビルド
pnpm build

# 特定のパッケージのみビルド
pnpm x build    # @112ka/x
pnpm x3 build   # @112ka/x3
```

### 6. リンティングとコード整形

```bash
# 全パッケージ・アプリをリント
pnpm lint

# 自動修正
pnpm lint:fix

# 特定のアプリのみ
pnpm app:nextjs lint:fix
```

## Git Subtree による外部パッケージ管理

### 背景

プライベートパッケージ（`@112ka/x`、`@112ka/x3`）を別リポジトリで管理しつつ、このモノレポに統合するため Git Subtree を使用します。

### セットアップ手順

```bash
# 1. リモートを追加
./scripts/git-add-remotes.sh \
  x=git@github.com:112KA/x.git \
  x3=git@github.com:112KA/x3.git

# 2. Subtree をセットアップ
./scripts/git-subtree-setup.sh x packages/x main
./scripts/git-subtree-setup.sh x3 packages/x3 main

# 自動的に以下のエイリアスが作成されます:
# - git x-push: packages/x の変更を x リポジトリにプッシュ
# - git x-pull: x リポジトリの変更を packages/x にプル
# - git x3-push: packages/x3 の変更を x3 リポジトリにプッシュ
# - git x3-pull: x3 リポジトリの変更を packages/x3 にプル
```

### 外部パッケージの更新

```bash
# 外部リポジトリの最新変更を取得
git x-pull
git x3-pull

# packages/ の変更を外部リポジトリにプッシュ
git x-push
git x3-push
```

## トラブルシューティング

### ビルドエラー: "Cannot find module '@112ka/x'"

**原因**: パッケージがビルドされていない、または依存関係が正しくインストールされていない

**解決策**:

```bash
# 1. 依存関係を再インストール
pnpm install

# 2. パッケージをビルド（postinstall で自動実行されるが、手動でも可）
pnpm build

# 3. 特定のパッケージのみビルド
pnpm x build
pnpm x3 build
```

### パッケージ変更が反映されない

**原因**: パッケージがビルドされていない、またはアプリケーションがキャッシュを使用している

**解決策**:

```bash
# パッケージを watch モードで起動
pnpm watch

# または、アプリケーションを再起動
pnpm dev:nextjs
```

### pnpm install が失敗: "401 Unauthorized"

**原因**: `.npmrc` に Personal Access Token が設定されていない

**解決策**:

```bash
# .npmrc をコピーして編集
cp .npmrc.org .npmrc

# エディタで .npmrc を開き、%%PERSONAL_ACCESS_TOKEN%% を置き換える
# 飯塚に @112ka/x のアクセス権限登録を依頼
```

### Git Subtree push が失敗

**原因**: コンフリクトまたはリモートの変更が先行している

**解決策**:

```bash
# 1. リモートの変更を取得
git x-pull

# 2. コンフリクトを解決

# 3. 再度プッシュ
git x-push
```

### ESLint エラーが大量に出る

**原因**: @antfu/eslint-config の設定が正しく適用されていない

**解決策**:

```bash
# 自動修正を実行
pnpm lint:fix

# それでも解決しない場合は、eslint.config.mjs を確認
# 各パッケージ/アプリに eslint.config.mjs が存在し、@antfu/eslint-config を使用していることを確認
```

### TypeScript の型エラー: "Cannot find module 'x/utils'"

**原因**: tsconfig.json の paths が正しく設定されていない

**解決策**:

各アプリケーションの `tsconfig.json` に以下を追加:

```json
{
  "compilerOptions": {
    "paths": {
      "x/*": ["../../packages/x/src/*"],
      "@112ka/x": ["../../packages/x/src/index.ts"]
    }
  }
}
```

## Serena MCP の使用

### 背景

Serena は AI エージェントがコードベースを理解し、効率的に編集するための Model Context Protocol (MCP) サーバーです。

### セットアップ

```bash
# プロジェクト名を設定（初回のみ）
# .serena/project.yml の project_name を編集
```

### 主な機能

- **シンボリック検索**: 関数、クラス、変数などのシンボルを検索
- **参照検索**: 特定のシンボルがどこで使用されているかを検索
- **コンテキスト取得**: ファイルの構造やシンボルの概要を取得
- **メモリ管理**: プロジェクト固有の情報を保存・読み込み

## ワークフローパターン

### 新機能の追加

1. **パッケージに機能を追加**

```bash
# packages/x/src/features/new-feature.ts を作成
# packages/x/src/index.ts でエクスポート
pnpm x build
```

2. **アプリケーションで使用**

```typescript
// apps/app-nextjs/src/components/my-component.tsx
import { newFeature } from 'x/features/new-feature'

export function MyComponent() {
  newFeature()
  return <div>Component</div>
}
```

3. **テスト**

```bash
# パッケージのテスト
pnpm x test

# アプリケーションのテスト
pnpm app:nextjs test
```

### バグ修正

1. **問題の特定**

```bash
# 関連コードを検索
pnpm grep "buggy-function"

# または Serena を使用して参照を検索
```

2. **修正の実装**

```bash
# パッケージを修正
vim packages/x/src/utils/buggy-function.ts

# リアルタイムで確認
pnpm watch  # ターミナル1
pnpm dev:nextjs  # ターミナル2
```

3. **テストとコミット**

```bash
pnpm lint:fix
pnpm test
git add .
git commit -m "fix: resolve issue in buggy-function"
```

### リファクタリング

1. **影響範囲の確認**

```bash
# シンボルの使用箇所を検索
pnpm grep "OldClassName"
```

2. **パッケージをリファクタリング**

```bash
# packages/x/src/ のコードを変更
pnpm x build
```

3. **アプリケーションを更新**

```bash
# apps/app-nextjs/src/ のインポートを更新
pnpm lint:fix
pnpm app:nextjs test
```

## 実装パターン集

### モノレポ内でのインポート

```typescript
// アプリケーションから内部パッケージをインポート
import { utils } from 'x/utils'
import { ThreeScene } from '@112ka/x3'
import { helper } from 'x-lib'

// 相対インポート（同じアプリ内）
import { Button } from '@/components/ui/button'
import { useCustomHook } from '@/hooks/use-custom-hook'
```

### パッケージのエクスポート

```typescript
// packages/x/src/index.ts
export * from './utils'
export * from './errors'
export * from './features'

// packages/x/src/utils/index.ts
export * from './array'
export * from './color'
export * from './guard'
```

### パッケージスクリプトの統一

すべてのパッケージ/アプリで以下のスクリプトを統一:

```json
{
  "scripts": {
    "dev": "...",
    "build": "...",
    "test": "vitest",
    "lint": "eslint",
    "lint:fix": "eslint --fix"
  }
}
```

## パフォーマンス最適化

### ビルド時間の短縮

```bash
# 並列ビルド（pnpm が自動的に並列化）
pnpm build

# 特定のパッケージのみビルド
pnpm -F @112ka/x build
```

### 依存関係の最適化

```bash
# 未使用の依存関係を検出
npx depcheck

# 重複する依存関係を確認
pnpm list --depth 0
```

### キャッシュのクリア

```bash
# pnpm キャッシュをクリア
pnpm store prune

# node_modules を削除して再インストール
rm -rf node_modules
pnpm install
```

## デバッグのヒント

### パッケージの依存関係を確認

```bash
# 特定のパッケージの依存関係を表示
pnpm list --filter @112ka/x

# ワークスペース全体の依存関係グラフ
pnpm list --depth 1
```

### ビルド出力を確認

```bash
# パッケージのビルド出力を確認
ls -la packages/x/dist/

# ビルドログを詳細表示
pnpm x build --verbose
```

### シンボリックリンクを確認

```bash
# node_modules のシンボリックリンクを確認
ls -la apps/app-nextjs/node_modules/@112ka/
```

## ベストプラクティス

### Do's

- **workspace:*** を使用して内部パッケージを参照
- **pnpm の並列実行** を活用（`-r` フラグ）
- **watch モード** でパッケージをリアルタイムビルド
- **git subtree** で外部パッケージを管理
- **統一されたスクリプト名** を各パッケージで使用
- **TypeScript Strict Mode** を全パッケージで有効化

### Don'ts

- **相対パス** で他のパッケージを参照しない（workspace:* を使用）
- **node_modules を直接編集** しない
- **ビルドされていないパッケージ** をコミットしない
- **未使用の依存関係** を放置しない
- **バージョンの固定** を避ける（catalog を活用）

## 関連ドキュメント

### プロジェクト全体

- [Copilot Instructions](.github/copilot-instructions.md) - 会話のコンテキストと基本構造
- [Product Specification](docs/PRODUCT.md) - プロジェクトの概要と主要機能
- [Architecture](docs/ARCHITECTURE.md) - 技術スタック、プロジェクト構造、設計原則
- [Contributing Guidelines](docs/CONTRIBUTING.md) - セットアップ、開発フロー、コーディング規約

### アプリケーション固有

- [app-nextjs AGENTS.md](apps/app-nextjs/AGENTS.md) - Next.js アプリの実践ガイド
- [app-nextjs Instructions](.github/instructions/app-nextjs.instructions.md) - Next.js のコーディング規約

### スクリプト

- [git-subtree-setup.sh](scripts/git-subtree-setup.sh) - Git Subtree セットアップスクリプト
- [git-add-remotes.sh](scripts/git-add-remotes.sh) - Git リモート追加スクリプト

---

**Note**: このドキュメントは pnpm モノレポ全体での実践的な開発作業を支援することを目的としています。プロジェクトの概要や基本的な構造については、上記の関連ドキュメントを参照してください。

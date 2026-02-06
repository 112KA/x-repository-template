# System Architecture

**最終更新：** February 6, 2026

## 1. Tech Stack

### Core
- **Package Manager**: pnpm (>= 10) - モノレポ管理
- **Node.js**: >= 24.12
- **Language**: TypeScript 5.9.3 (Strict Mode)

### Development
- **Build Tools**: tsdown 0.20.0-beta.3 (パッケージビルド), Turbopack (Next.js)
- **Linting**: ESLint 9.39.2 + @antfu/eslint-config 7.0.1
- **Testing**: Vitest 4.0.18
- **Task Runners**: concurrently 9.2.1 (並列実行), lint-staged 16.2.7, simple-git-hooks 2.13.1

### Applications
- **Next.js**: 16.1.4 (React 19.2.3, App Router, Turbopack)
- **Astro**: 5.16.11+ (Static Site Generation)
- **Vite**: 7.3.1+ (Vanilla TypeScript)
- **UI/Styling**: Tailwind CSS 4.1.18, shadcn/ui, Radix UI, GSAP 3.14.2

## 2. Project Structure

```
x-repository-template/
├── .claude/
├── .github/
│   ├── instructions/           # 開発ガイドライン
│   └── templates/              # コードマップテンプレート
├── .serena/
├── .vscode/
├── AGENTS.md                   # モノレポ開発ガイド
├── CONTRIBUTING.md             # プロジェクト参加ガイド
├── LICENSE
├── README.md
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
│
├── apps/
│   ├── app-astro/             # Astro 5.16+ (SSG)
│   ├── app-nextjs/            # Next.js 16.1.4 (メイン)
│   └── app-vite-vanilla/       # Vite 7.3.1+ (Vanilla TypeScript)
│
├── packages/
│   ├── x/                     # @112ka/x@0.0.10 (コアライブラリ)
│   ├── x3/                    # @112ka/x3@0.0.2 (3D関連)
│   └── x-lib/                 # x-lib@1.0.0 (共通ユーティリティ)
│
├── docs/
│   ├── PRODUCT.md             # 製品仕様
│   ├── codemaps/              # 構造マップ
│   └── guides/                # 機能ガイド
│
├── docs-raw/                   # 生ドキュメント（エージェント用）
├── rules/                      # プロジェクトルール
├── schemas/                    # XSD（ページ定義スキーマ）
└── scripts/                    # Git subtree/config スクリプト
```

## 3. Design Principles

### モノレポアーキテクチャ（実装から抽出）
- **Workspace範囲**: `pnpm-workspace.yaml` が `apps/*` と `packages/*` を管理
- **依存関係プロトコル**: `workspace:@112ka/x@*` で内部パッケージを参照（自動的にワークスペースバージョンに解決）
- **ビルドチェーン**: ルート `postinstall` フックが `pnpm build` を実行（依存パッケージを自動ビルド）
- **Git Hooks**: simple-git-hooks で `pre-commit` に lint-staged を設定（コード品質自動化）

### パッケージ設計（実装から抽出）
- **モジュール形式**: すべてのパッケージが ESM（`type: "module"`）
- **ビルドツール**: @112ka/x, @112ka/x3 は tsdown で TypeScript → ESM に変換
- **型システム**: TypeScript Strict Mode で全パッケージ統一
- **リント統一**: @antfu/eslint-config による統一スタイル

### 開発ワークフロー（実装から抽出）
```bash
# ターミナル1: パッケージを watch モードでビルド
pnpm watch                 # @112ka/x, @112ka/x3 を監視ビルド

# ターミナル2: アプリケーションを開発モード起動
pnpm dev:nextjs           # パッケージ変更がリアルタイムに反映
```

## 4. Package Dependencies

### 内部依存関係（実装から抽出）

```
app-nextjs         ┐
app-astro          ├─→ @112ka/x (workspace:@112ka/x@*)
app-vite-vanilla   ┘

@112ka/x3          ─(peer)→ @112ka/x 0.0.10

x-lib              (独立)
@112ka/x           (独立)
```

### 外部パッケージ管理
- **認証**: `.npmrc` に Personal Access Token を設定（テンプレート: `.npmrc.example`）
- **プライベートパッケージ**: @112ka/x はアクセス権限が必要
- **Catalog戦略**: pnpm-workspace.yaml で共有バージョン定義（tailwindcss 4.1.18 等）

## 5. Applications Overview

### app-nextjs (Next.js 16.1.4)
- **Build**: Turbopack (`--turbopack` フラグ)
- **Export Mode**: Static Export (output: 'export')
- **Key Features**: View Transitions API, GSAP fallback transitions
- **詳細構造**: [app-nextjs.md](app-nextjs.md)

### app-astro (Astro 5.16.11+)
- **Build**: Native Astro build
- **Purpose**: Static Site Generation template
- **Dependencies**: @112ka/x

### app-vite-vanilla (Vite 7.3.1+)
- **Build**: Vite + TypeScript compiler
- **Purpose**: Lightweight vanilla TypeScript template
- **Dependencies**: @112ka/x

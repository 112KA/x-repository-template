# Product Specification

## 概要

**x-repository-template** は pnpm monorepo テンプレートです。複数フロントエンドフレームワーク（Next.js、Astro、Vite）と共有パッケージ（@112ka/x、@112ka/x3、x-lib）を一元管理し、即座に開発を開始できる統合開発環境を提供します。

TypeScript 5.9.3 Strict Mode、ESLint 9、Vitest などの標準設定が完備されており、エンタープライズ級のコードベース管理に対応しています。

## Key Features

### プリセットアプリケーション

- **Next.js 16** (App Router)
  - Turbopack 高速ビルド
  - Tailwind CSS 4 + shadcn/ui + Radix UI
  - View Transitions API + GSAP によるページ遷移アニメーション
  - 実装済みの遷移システムと example ページ

- **Astro 5.16+**
  - 静的サイト生成（SSG）
  - Tailwind CSS 4 対応
  - @112ka/x 統合

- **Vite 7.3+** (Vanilla TypeScript)
  - シンプルな TypeScript アプリテンプレート
  - Tailwind CSS 4 対応

### 共有パッケージ

- **@112ka/x** (v0.0.10)
  - コアユーティリティライブラリ
  - データ処理（配列、オブジェクト、数値、カラー、ガード）
  - Web API ラッパー（DB、Network、MediaQuery、UA検出）
  - UI機能（Modal、Menu、Scroll、Paging、Share、YouTube）
  - 数学ユーティリティ（Vector2/3、Rectangle、Spline）
  - アプリケーション基盤（Stage、InteractiveObject）
  - テスト: Vitest + Autotag decorator

- **@112ka/x3** (v0.0.2)
  - 3D グラフィックス統合
  - Three.js ベースのレンダリング
  - アセット管理（Texture、GLTF、Font、TextureAtlas）
  - カメラコントロール（Orbit、Debug）
  - プラグインシステム（Stats、OrbitControls、Asset、DebugShader）
  - Noise 生成（Curl、Snoise3）

- **x-lib** (v1.0.0)
  - 汎用ユーティリティパッケージ（拡張予定）

### 開発環境・ツール

- **Package Manager**: pnpm 10+ / Node.js 24.12+
- **言語**: TypeScript 5.9.3 Strict Mode
- **リンティング**: ESLint 9 + @antfu/eslint-config
- **テスティング**: Vitest
- **ビルド**: tsdown (packages), Turbopack (Next.js), Vite
- **スタイリング**: Tailwind CSS 4
- **Git**: simple-git-hooks + lint-staged

## Architecture Highlights

### pnpm Workspace 構成

```
x-repository-template/
├── apps/
│   ├── app-nextjs/      # Next.js 16 メインアプリケーション
│   ├── app-astro/       # Astro 静的サイト
│   └── app-vite-vanilla/# Vite + Vanilla TypeScript
├── packages/
│   ├── @112ka/x/        # コアライブラリ
│   ├── @112ka/x3/       # 3D グラフィックス
│   └── x-lib/           # 汎用ユーティリティ
└── docs/                # ドキュメント
```

**特徴**:

- `workspace:*` プロトコルで内部パッケージを自動参照
- `postinstall` フックでパッケージを自動ビルド
- pnpm の symlink 戦略による高速な依存関係解決

## Design Philosophy

### シンプルさ優先

- 必要最小限の依存関係
- わかりやすいディレクトリ構造
- 過度な抽象化を避ける

### 開発体験重視

- 自動化されたビルドパイプライン
- 高速フィードバック（watch モード）
- 統一された開発コマンド

### 柔軟性確保

- 不要なアプリ・パッケージは削除可能
- 新規アプリ・パッケージの追加が容易
- フレームワーク・ツールの選択肢を制限しない

### 実用的なコスト管理

- テストは必要最小限（ただし重要箇所はカバー）
- 過度な最適化を避ける
- 保守性とパフォーマンスのバランス

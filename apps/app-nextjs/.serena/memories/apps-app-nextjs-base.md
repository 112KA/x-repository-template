# apps app-nextjs 基本情報

## このパッケージの責務（Intent）

- Next.js 16（App Router）+ React 19を使用したモダンなWebアプリケーション実装
- XMLベースのページ定義から自動生成された型安全なページシステム
- マルチビューページ機能：単一ページ内での複数ビューの切り替え
- View Transitions API と GSAP を活用した統一的なアニメーション戦略
- 静的エクスポート（Static Export）による高速配信

## 公開API

### 主要エクスポート（transitions 制約モジュール）

- `PageTransitionProvider`：ページ遷移時のアニメーション管理
- `ViewTransitionProvider`：ビュー切り替え時のアニメーション管理
- `ViewTransitionStrategy`：アニメーション戦略の型定義
  - `createFadeStrategy`：フェードイン・アウト
  - `createViewTransitionApiStrategy`：View Transitions API
  - `resolveStrategy`：戦略を文字列から解決
- `useViewSwitch`：ビュー切り替え用カスタムフック
- `useViewTransitionRouter`：ページ遷移用カスタムフック
- `View`：ビュー表示用コンポーネント

### 外部消費パッケージ

- `x`（内部パッケージ）を依存として定義

## 適用可能な設定ファイル

- `tsconfig.json`：PATH エイリアス `@/*`, `@constraints/*`, `x/*`
- `next.config.ts`：`output: 'export'`, `trailingSlash: true`, webpack alias
- `components.json`：shadcn/ui 設定（スタイル・アイコンライブラリ指定）
- `vitest.config.ts`：テスト環境（happy-dom）、セットアップファイル

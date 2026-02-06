# app-vite-vanilla Codemap

**最終更新：** 2026-02-06  
**エントリポイント：** index.html, src/main.ts

## 概要

Vite + TypeScript による vanilla JavaScript アプリケーション。Vite の開発サーバーと HMR を活用したシンプルな SPA の実装例。Tailwind CSS と Basic SSL プラグインを使用し、HTTPS ローカル開発環境を提供する。

**主要技術**
- Vite 7.3.1 (開発サーバー、ビルドツール)
- TypeScript (ES2022 target)
- Tailwind CSS v4 (Vite plugin)
- Basic SSL (HTTPS 開発環境)

**主要な責務**
- シンプルな UI デモアプリケーションの提供
- Vite + TypeScript の vanilla 構成の参考実装

## Package Structure

```
apps/app-vite-vanilla/
├── index.html           # HTML エントリポイント
├── vite.config.ts       # Vite 設定（Tailwind, SSL）
├── tsconfig.json        # TypeScript 設定（ES2022, bundler mode）
├── package.json         # パッケージ定義
├── eslint.config.mjs    # ESLint 設定
├── src/
│   ├── main.ts          # アプリケーションエントリポイント
│   ├── counter.ts       # カウンター UI ロジック
│   ├── style.css        # スタイル定義
│   └── typescript.svg   # TypeScript ロゴアセット
└── public/
    └── vite.svg         # Vite ロゴアセット
```

**構造の特徴**
- フラットな src/ ディレクトリ構造（モジュール分割なし）
- HTML ベースのエントリポイント（Vite 標準）
- 静的アセットは public/ に配置

## Key Modules

| Module | Role | Exports |
|--------|------|---------|
| `src/main.ts` | アプリケーション初期化 | なし（副作用のみ） |
| `src/counter.ts` | カウンター UI ロジック | `setupCounter()` |
| `vite.config.ts` | ビルド設定 | Vite config |
| `index.html` | HTML エントリポイント | - |

**main.ts**
```
役割: DOM構築とイベントハンドラー登録
処理:
  1. #app 要素に HTML を注入（Vite/TypeScript ロゴ、カウンターボタン）
  2. setupCounter() を呼び出してカウンター機能を初期化
```

**counter.ts**
```
役割: カウンターボタンのインタラクション
処理:
  1. ボタンクリックイベントリスナーを登録
  2. クリックごとにカウンターをインクリメント
  3. ボタンの innerHTML を更新
```

**vite.config.ts**
```
役割: Vite ビルドパイプライン設定
プラグイン:
  - @tailwindcss/vite: Tailwind CSS v4 統合
  - @vitejs/plugin-basic-ssl: HTTPS 開発サーバー有効化
```

## Data Flow

```
Browser
   ↓ (Request)
index.html
   ↓ (Load script module)
src/main.ts
   ↓ (Import)
src/counter.ts
   ↓ (DOM manipulation)
#app element
   ↓ (User click)
Button event listener
   ↓ (Update)
Counter state
```

**フロー説明**
1. ブラウザが index.html をリクエスト
2. Vite が src/main.ts をモジュールとしてロード
3. main.ts が DOM を構築し、counter.ts の setupCounter() を呼び出し
4. ユーザーがボタンをクリック
5. イベントリスナーがカウンター状態を更新し、DOM に反映

**ビルドフロー**
```
tsc (型チェック) → vite build → dist/
```

## 外部依存関係

**Runtime Dependencies**
- `x` (workspace:@112ka/x@*) - モノレポ内共有パッケージ（未使用）

**Build Dependencies**
- `vite` (^7.3.1) - 開発サーバー・ビルドツール
- `@tailwindcss/vite` (catalog) - Tailwind CSS v4 Vite プラグイン
- `@vitejs/plugin-basic-ssl` (catalog) - HTTPS 開発サーバー
- `tailwindcss` (catalog) - CSS フレームワーク
- `eslint-plugin-format` (catalog) - ESLint フォーマッター

**Import 構造**
```
src/main.ts
  → ./counter.ts
  → ./style.css
  → ./typescript.svg
  → /vite.svg (public/)
```

**外部サービス連携**
なし（スタンドアロンアプリケーション）

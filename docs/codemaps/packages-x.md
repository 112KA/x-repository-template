# @112ka/x Codemap

**最終更新：** 2026-02-06  
**エントリポイント：** src/index.ts, tsdown.config.ts

## Overview

フロントエンド開発のための包括的なユーティリティライブラリ。データ操作、Web API ラッパー、UI 機能、数学ユーティリティ、アプリケーション基盤を提供する ESM モジュール。すべてのモジュールは個別エントリポイントとしてエクスポート可能。

**主要技術**
- TypeScript (ES2022 target)
- tsdown (ビルドツール - unbundle mode)
- Vitest (テストフレームワーク)
- ESM only (sideEffects: false)

**主要な責務**
- 再利用可能なユーティリティ関数の提供
- ブラウザ API の型安全なラッパー提供
- 数学・幾何学計算の実装
- UI 機能のモジュール化実装

## Package Structure

```
packages/x/
├── src/
│   ├── index.ts                       # メインエントリポイント
│   ├── data/                          # データ処理・バリデーション
│   │   ├── index.ts
│   │   ├── array.ts                   # 配列ユーティリティ
│   │   ├── object.ts                  # オブジェクトユーティリティ
│   │   ├── number.ts                  # 数値フォーマット
│   │   ├── color.ts                   # 色操作（RGB/HSL/HEX）
│   │   ├── constants.ts               # 定数定義
│   │   ├── guard.ts                   # 型ガード関数
│   │   └── assert.ts                  # アサーション関数
│   ├── features/                      # 高レベル機能
│   │   ├── index.ts
│   │   ├── camera.ts                  # カメラ制御
│   │   ├── clock.ts                   # 時間管理
│   │   ├── clock.test.ts
│   │   ├── countdown.ts               # カウントダウンタイマー
│   │   ├── motion.ts                  # アニメーション
│   │   ├── menu.ts                    # メニュー制御
│   │   ├── viewport.ts                # ビューポート状態
│   │   ├── scroll.ts                  # スクロールハンドリング
│   │   ├── modal.ts                   # モーダル管理
│   │   ├── share.ts                   # 共有機能
│   │   ├── paging.ts                  # ページネーション
│   │   └── youtube.ts                 # YouTube 埋め込み
│   ├── web/                           # Web API ラッパー
│   │   ├── index.ts
│   │   ├── deferred.ts                # Promise ユーティリティ
│   │   ├── db.ts                      # LocalStorage/IndexedDB
│   │   ├── document.ts                # DOM ユーティリティ
│   │   ├── environment.ts             # ランタイム検出
│   │   ├── inline-worker.ts           # Web Worker
│   │   ├── media.ts                   # Audio/Video
│   │   ├── media-query.ts             # レスポンシブデザイン
│   │   ├── net.ts                     # Fetch/Network
│   │   ├── ticker.ts                  # Animation frame ticker
│   │   ├── timeout.ts                 # Delay/throttle
│   │   └── ua.ts                      # User agent 検出
│   ├── math/                          # 数学ユーティリティ
│   │   ├── index.ts
│   │   ├── vector2.ts                 # 2D ベクトル
│   │   ├── vector3.ts                 # 3D ベクトル
│   │   ├── rectangle.ts               # 矩形演算
│   │   ├── spline.ts                  # スプライン補間
│   │   └── types.ts                   # 数学型定義
│   ├── decorators/                    # デコレータ
│   │   ├── index.ts
│   │   ├── autotag.ts                 # @autotag デコレータ
│   │   └── autotag.test.ts
│   ├── application/                   # アプリケーション基盤
│   │   ├── index.ts
│   │   ├── stage.ts                   # Stage 管理
│   │   ├── interactive-object.ts      # インタラクティブ要素ベース
│   │   └── extend-event-target.ts     # EventTarget 拡張
│   ├── structures/                    # データ構造
│   │   ├── index.ts
│   │   ├── composite-key-map.ts       # 複合キー Map
│   │   └── node.ts                    # ツリーノード
│   ├── errors/                        # エラー型
│   │   ├── index.ts
│   │   ├── assertion-error.ts         # AssertionError
│   │   └── abstract-error.ts          # AbstractError ベース
│   └── @types/                        # TypeScript 型定義
│       ├── index.ts
│       ├── window.d.ts                # Window 拡張
│       ├── error.d.ts                 # Error 型
│       └── utils.ts                   # 型ユーティリティ
├── dist/                              # ビルド出力 (tsdown)
├── tsconfig.json                      # TypeScript 設定
├── tsdown.config.ts                   # tsdown 設定
├── vitest.config.ts                   # Vitest 設定
├── eslint.config.mjs
├── package.json
├── CHANGELOG.md
└── README.md
```

**構造の特徴**
- モジュール別に機能を分離（data, features, web, math, application）
- 各モジュールは独立した index.ts でエクスポート
- unbundle モードでビルド（モジュール構造を保持）
- テストファイルはソースと同じディレクトリに配置

## Key Modules

| Module | Role | Key Exports |
|--------|------|-------------|
| `data/` | データ処理・バリデーション | array, object, number, color, guard, assert |
| `features/` | 高レベル UI 機能 | Clock, Camera, Modal, Scroll, Viewport, YouTube |
| `web/` | Web API ラッパー | deferred, db, document, ticker, net, mediaQuery, ua |
| `math/` | 数学・幾何学計算 | Vector2, Vector3, Rectangle, Spline |
| `decorators/` | TypeScript デコレータ | autotag |
| `application/` | アプリケーション基盤 | Stage, InteractiveObject, ExtendEventTarget |
| `structures/` | データ構造 | CompositeKeyMap, Node |
| `errors/` | カスタムエラー型 | AssertionError, AbstractError |
| `@types/` | 型定義 | window.d.ts, error.d.ts, utils |

**data/**
```
役割: データ操作とバリデーション
主要機能:
  - array: 配列操作（shuffle など）
  - object: オブジェクトユーティリティ（clone, merge）
  - number: 数値フォーマット
  - color: RGB/HSL/HEX 変換、色操作
  - guard: 型ガード関数（ランタイム型チェック）
  - assert: アサーション（失敗時 AssertionError）
  - constants: プロジェクト全体の定数
```

**features/**
```
役割: すぐに使える UI 機能実装
主要クラス:
  - Clock: 時間管理（elapsed, delta, pause）- テスト済み
  - Camera: カメラ制御（position, rotation, zoom）
  - Modal: モーダル管理（open, close, stacking）
  - Scroll: スクロールハンドリング
  - Viewport: ビューポート状態トラッキング
  - YouTube: YouTube 埋め込みラッパー
  - Paging: ページネーション管理
  - Share: SNS 共有機能
  - Menu: メニュー状態管理
  - Motion: アニメーションフレームワーク
  - Countdown: カウントダウンタイマー
```

**web/**
```
役割: ブラウザ API の型安全なラッパー
主要機能:
  - deferred: Promise ユーティリティ
  - db: LocalStorage/IndexedDB ラッパー
  - document: DOM クエリ・操作
  - environment: ランタイム環境検出
  - inline-worker: Web Worker 作成
  - media: Audio/Video API ラッパー
  - media-query: CSS media query プログラマティックアクセス
  - net: Fetch API ラッパー
  - ticker: requestAnimationFrame ラッパー
  - timeout: 遅延・スロットルユーティリティ
  - ua: User agent 検出
```

**math/**
```
役割: 幾何学・数学計算
主要クラス:
  - Vector2: 2D ベクトル（add, subtract, distance など）
  - Vector3: 3D ベクトル（normalize, cross product など）
  - Rectangle: 矩形ジオメトリ（collision detection）
  - Spline: スプライン補間（Catmull-Rom, Bezier）
  - types: 数学型定義
```

**decorators/**
```
役割: TypeScript デコレータ
実装:
  - @autotag: インスタンスへの自動タグ生成
  - デバッグと型安全性向上に有用
  - テスト済み
```

**application/**
```
役割: アプリケーション構造の基盤クラス
主要クラス:
  - Stage: アプリケーション Stage/Scene 管理
  - InteractiveObject: インタラクティブ要素のベースクラス
  - ExtendEventTarget: EventTarget 拡張
```

**structures/**
```
役割: 高度なデータ構造
実装:
  - CompositeKeyMap: 複合キー対応 Map
  - Node: ツリー構造ノード（parent-child 関係）
```

**errors/**
```
役割: カスタムエラー型
実装:
  - AssertionError: assert モジュールがスロー
  - AbstractError: すべてのカスタムエラーのベース
```

## Data Flow

### モジュールインポートフロー
```
src/index.ts (メインエントリ)
   ↓ (re-export)
├─ data/index.ts → array, object, number, color, guard, assert, constants
├─ features/index.ts → Clock, Camera, Modal, Scroll, Viewport, etc.
├─ web/index.ts → deferred, db, document, ticker, net, mediaQuery, ua
├─ math/index.ts → Vector2, Vector3, Rectangle, Spline
├─ decorators/index.ts → autotag
├─ application/index.ts → Stage, InteractiveObject, ExtendEventTarget
├─ structures/index.ts → CompositeKeyMap, Node
├─ errors/index.ts → AssertionError, AbstractError
└─ @types/index.ts → 型定義
```

### ビルドフロー
```
TypeScript Source (src/)
   ↓
tsdown (unbundle: true)
   ↓
ESM Modules (dist/*.mjs)
+ Type Definitions (dist/*.d.mts)
```

### テストフロー
```
vitest.config.ts
   ↓
Node Environment (environment: 'node')
   ↓
src/**/*.{test,spec}.ts Execution
   ↓
Coverage Report (v8)
```

### アプリケーション統合フロー
```
Application (app-nextjs, app-astro, app-vite)
   ↓ (import)
workspace:@112ka/x@* (package.json dependency)
   ↓ (resolve)
packages/x/dist/index.mjs
   ↓ (tree-shaking)
使用されるモジュールのみバンドル
```

## External Dependencies

**Runtime Dependencies**
なし（純粋な TypeScript ユーティリティライブラリ）

**Dev Dependencies**
- `tsdown` (0.20.0-beta.3) - TypeScript ビルドツール（unbundle mode）
- `vitest` (4.0.18) - テストフレームワーク
- `@vitest/coverage-v8` (4.0.18) - テストカバレッジ
- `@antfu/eslint-config` (7.0.1) - ESLint 設定
- `eslint` (9.39.2) - リンター
- `@tsconfig/recommended` (1.0.13) - TypeScript 設定ベース
- `@types/webxr` (^0.5.22) - WebXR 型定義
- `@types/youtube` (^0.1.2) - YouTube API 型定義

**Build 設定**
```typescript
// tsdown.config.ts
{
  entry: ['src/index.ts'],
  dts: true,           // 型定義生成
  unbundle: true       // モジュール構造を保持
}
```

**Export 戦略**
```json
// package.json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.mts",
      "default": "./dist/index.mjs"
    },
    "./*.js": {
      "types": "./dist/*.d.mts",
      "default": "./dist/*.mjs"
    }
  },
  "sideEffects": false  // Tree-shaking 最適化
}
```

**内部依存関係**
```
data/ → errors/ (AssertionError を使用)
features/ → web/ticker (アニメーションループ)
application/ → web/document (DOM 操作)
decorators/ → (独立)
structures/ → (独立)
math/ → (独立)
```

**外部サービス連携**
- YouTube API (features/youtube.ts)
- Web Standards API (web/ モジュール)
- WebXR API (型定義のみ)

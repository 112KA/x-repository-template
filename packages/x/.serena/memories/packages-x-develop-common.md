# packages x 開発共通情報

## 技術スタック

- **言語**：TypeScript 5.x（`target: ES2020`, `lib: ES2020 + DOM`）
- **ビルド**：tsdown 0.20.0-beta.3
- **テスト**：vitest 4.0.18（environment: node、coverage: v8）
- **リント**：ESLint 9.39.2 + @antfu/eslint-config 7.0.1
- **型チェック**：TypeScript compiler（experimentalDecorators 有効）
- **パッケージマネージャー**：pnpm

## Architecture / フォルダ構成

```
src/
├── index.ts               # 全モジュールを再エクスポート
├── @types/                # 型定義ユーティリティ（eslint-ignore）
├── application/           # ステージ、インタラクティブオブジェクト
├── data/                  # 基本データ型操作（Array, Number, Object, 色値等）
├── decorators/            # クラスデコレーター群
├── errors/                # エラークラス
├── features/              # 機能ユーティリティ（Clock, Viewport, Camera等）
├── math/                  # 数学ユーティリティ（Vector, Rectangle等）
├── structures/            # 高度なデータ構造（CompositeKeyMap, Node等）
└── web/                   # Web API ラッパー（Ticker, Deferred, DOM, DB等）
```

### 特筆すべき構造的特徴

- **モジュール分割**: 責務を明確に分離し、各モジュール内に `index.ts` で再エクスポート
- **デコレーター活用**: `@autotag` で `Symbol.toStringTag` を自動付与
- **EventTarget 拡張**: `Stage`/`InteractiveObject` で DOM イベント中継
- **Ticker 統合**: `Clock` など複数の機能が内部 Ticker を利用

## ドメイン構造

### UI/イベント系
- **Stage**: グローバルなウィンドウイベント監視点（resize, scroll, wheel）
- **InteractiveObject**: pointer イベント受信・バブリング

### 時刻・タイマー系
- **Clock**: 秒単位での時刻 tick イベント発火
- **Ticker**: フレームレートベースのイベントジェネレータ
- **Countdown**: カウントダウン

### 数学・物理系
- **Vector2/Vector3**: 2D/3D ベクトル演算
- **Rectangle**: 矩形領域計算
- **Spline**: スプライン曲線補間

### Web API 抽象化
- **db**: IndexedDB
- **net**: Fetch ベース HTTP
- **ua**: ユーザーエージェント判定
- **environment**: 実行環境判定

### データ構造
- **CompositeKeyMap**: JSON.stringify ベースの複合キー管理
- **Node**: ツリー構造の基盤要素

## 禁止事項

- **CompositeKeyMap のキー**：JSON.stringify 不可な値（関数、循環参照）を使用しない
- **@types/ の依存**：他モジュールから直接インポートしない（`@types/index.ts` 経由のみ）
- **サイドエフェクト**：グローバルスコープへの予期しない変更禁止

## 依存先

### 内部パッケージ
- なし（単体ライブラリ）

### 外部ライブラリ
- **Production**: なし（ゼロ依存）
- **DevDependencies**:
  - `@tsconfig/recommended` - TypeScript 設定基盤
  - `@types/webxr`, `@types/youtube` - 型定義
  - `@antfu/eslint-config` - ESLint ベース設定
  - `tsdown` - ビルドツール
  - `vitest` - テストフレームワーク

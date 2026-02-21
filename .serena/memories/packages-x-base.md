# packages x 基本情報

## このパッケージの責務（Intent）

軽量でモジュール化された TypeScript ユーティリティライブラリ。複数の小さなモジュール群を ES モジュールとして提供し、必要な機能を選択的にインポート可能な設計。

## 公開 API

### @types
- 型定義ユーティリティ（`ErrorType`, `UtilsType` など）

### application
- `Stage` - アプリケーション全体のイベント中継点（EventTarget 拡張）
- `InteractiveObject` - pointer 系イベントハンドラの基底クラス
- `ExtendEventTarget` - 拡張 EventTarget 基盤

### data
- `isObject()` - プレーンオブジェクト判定
- `assert()` / `isEqual()` - アサーション・等値判定
- `Array`, `Number`, `Object` ユーティリティ群（`isArray`, `clamp`, `merge` など）
- `ColorValue` - 色値型定義
- `ZERO_VECTOR`, `EPSILON` - 定数

### decorators
- `@autotag` - `Symbol.toStringTag` を自動設定するクラスデコレーター

### errors
- `AssertionError` - アサーション失敗時のカスタムエラー
- `AbstractError` - エラー基底クラス

### features
- `Clock` - 秒単位の時刻管理（EventTarget 基盤）
- `setupSwitchViewport()` - レスポンシブ viewport 制御
- `setupViewportHeight()` - iOS Safari 対応の vh 設定
- `Camera`, `Menu`, `Modal`, `Motion`, `Paging`, `Scroll`, `Share`, `YouTube` - 各種機能ユーティリティ
- `Countdown` - カウントダウンタイマー

### math
- `Vector2`, `Vector3` - 2D/3D ベクトルクラス
- `Rectangle` - 矩形領域
- `Spline` - スプライン曲線
- `MathTypes` - 型定義

### structures
- `CompositeKeyMap<K1, K2, V>` - 複合キー Map（JSON.stringify ベース）
- `Node<T>` - ツリーノード基底クラス

### web
- `Ticker` - フレームレートベースのイベントジェネレータ
- `Deferred<T>` - Promise の遅延化ラッパー
- `qs()`, `qsa()` - DOM クエリユーティリティ
- `db` - IndexedDB ラッパー
- `media`, `mediaQuery` - メディアクエリユーティリティ
- `net` - ネットワーク関連（fetch ラッパー）
- `ua` - ユーザーエージェント判定
- `environment` - 実行環境判定
- `InlineWorker` - Web Worker 管理
- `timeout` - setTimeout ラッパー系

## 配布形式

- ESM のみ（`"type": "module"`）
- エクスポート条件：`./dist/index.mjs` および `./dist/*.mjs`
- 型定義：`./dist/index.d.mts` および `./dist/*.d.mts`
- サイドエフェクト：なし（`"sideEffects": false`）

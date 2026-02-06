# @112ka/x3 Codemap

**最終更新：** 2026-02-07  
**エントリポイント：** src/index.ts, tsdown.config.ts

## Overview

Three.js ベースの 3D グラフィックスフレームワーク。アセット管理、プラグインシステム、レンダラー抽象化を提供し、モジュラーで拡張可能なアーキテクチャでインタラクティブ 3D アプリケーション構築を支援。

**主要技術**
- Three.js 0.182.0 (3D レンダリングエンジン)
- TypeScript (ES2022 target)
- tsdown (ビルドツール - unbundle mode)
- stats-gl 3.8.0 (GPU パフォーマンス統計)

**主要な責務**
- Three.js アプリケーションの基盤クラス提供
- アセット管理システム（テクスチャ、モデル、フォント）
- プラグインシステムによる機能拡張
- レンダラー抽象化とポストプロセス

## Package Structure

```
packages/x3/
├── src/
│   ├── index.ts                                # メインエントリポイント
│   ├── application/                            # コアフレームワーク
│   │   ├── index.ts
│   │   ├── application-base.ts                 # アプリケーション基底クラス
│   │   ├── viewport.ts                         # Canvas 管理
│   │   ├── types.ts                            # 型定義
│   │   ├── renderer/                           # レンダリングパイプライン
│   │   │   ├── index.ts
│   │   │   ├── renderer-factory.ts             # Renderer 生成
│   │   │   ├── renderer-adapter.ts             # Adapter パターン
│   │   │   ├── abstract-postporcessing.ts      # ポストプロセス基底
│   │   │   └── types.ts
│   │   └── plugins/                            # プラグインシステム
│   │       ├── index.ts
│   │       ├── plugin-manager.ts               # プラグインライフサイクル
│   │       ├── types.ts
│   │       ├── asset-plugin.ts                 # アセット統合
│   │       ├── stats-plugin.ts                 # パフォーマンス統計
│   │       ├── stats-gl-plugin.ts              # GPU 統計
│   │       ├── orbit-controls-plugin.ts        # カメラ制御
│   │       └── debug-shader-plugin.ts          # シェーダーデバッグ
│   ├── asset/                                  # アセット管理
│   │   ├── index.ts
│   │   ├── asset-manager.ts                    # 統一アセットローダー
│   │   ├── types.ts
│   │   └── resolver/                           # フォーマット別ローダー
│   │       ├── index.ts
│   │       ├── types.ts
│   │       ├── texture-resolver.ts             # Image → Texture
│   │       ├── gltf-resolver.ts                # glTF/glb モデル
│   │       ├── font-resolver.ts                # フォント
│   │       └── texture-atlas-resolver.ts       # スプライトシート
│   ├── camera/                                 # カメラユーティリティ
│   │   ├── index.ts
│   │   └── camera-controls.ts                  # OrbitControls ラッパー
│   ├── textures/                               # テクスチャユーティリティ
│   │   ├── index.ts
│   │   ├── color-texture.ts                    # プログラマティック生成
│   │   └── texture-atlas.ts                    # スプライトアトラス管理
│   ├── nodes/                                  # シェーダーノード・エフェクト
│   │   ├── index.ts
│   │   ├── halftone.ts                         # ハーフトーンエフェクト
│   │   └── noise/                              # ノイズ生成
│   │       ├── index.ts
│   │       ├── curl.ts                         # カールノイズ
│   │       └── snoise3.ts                      # シンプレックスノイズ 3D
│   ├── loaders/                                # カスタムローダー
│   │   ├── index.ts
│   │   └── json-loader.ts                      # JSON ファイル読み込み
│   └── misc/                                   # その他ユーティリティ
│       ├── index.ts
│       ├── material-replacer.ts                # マテリアル置換
│       ├── constants.ts                        # 定数
│       └── environment.ts                      # 環境検出
├── dist/                                       # ビルド出力 (tsdown)
├── tsconfig.json                               # TypeScript 設定
├── tsdown.config.ts                            # tsdown 設定
├── eslint.config.mjs
├── package.json
├── CHANGELOG.md
└── README.md
```

**構造の特徴**
- Three.js を中心としたモジュラー設計
- プラグインシステムによる拡張性
- アセット管理の統一インターフェース
- unbundle モードでビルド（モジュール構造保持）

## Key Modules

| Module | Role | Key Exports |
|--------|------|-------------|
| `application/` | コアフレームワーク | ApplicationBase, Viewport, RendererFactory, PluginManager |
| `application/renderer/` | レンダリングパイプライン | RendererFactory, RendererAdapter, AbstractPostprocessing |
| `application/plugins/` | プラグインシステム | PluginManager, AssetPlugin, StatsPlugin, OrbitControlsPlugin |
| `asset/` | アセット管理 | AssetManager |
| `asset/resolver/` | フォーマット別ローダー | TextureResolver, GLTFResolver, FontResolver, TextureAtlasResolver |
| `camera/` | カメラユーティリティ | CameraControls |
| `textures/` | テクスチャユーティリティ | ColorTexture, TextureAtlas |
| `nodes/` | シェーダーノード | Halftone, CurlNoise, Snoise3 |
| `loaders/` | カスタムローダー | JSONLoader |
| `misc/` | その他ユーティリティ | MaterialReplacer, constants, environment |

**application/application-base.ts**
```
役割: 3D アプリケーションの基底クラス
機能:
  - Scene, Camera, Renderer 管理
  - ライフサイクル: init(), update(), render()
  - アニメーションループ管理
  - EventTarget 拡張
使用例:
  class MyApp extends ApplicationBase {
    onInit() { /* シーン初期化 */ }
    onUpdate(dt: number) { /* アニメーション */ }
  }
```

**application/viewport.ts**
```
役割: Canvas サイズと比率管理
機能:
  - Canvas リサイズ処理
  - DPI ハンドリング
  - アスペクト比計算
```

**application/renderer/**
```
役割: レンダリングパイプライン抽象化
コンポーネント:
  - RendererFactory: WebGLRenderer 生成
  - RendererAdapter: レンダラーアダプターパターン
  - AbstractPostprocessing: ポストプロセスエフェクト基底
```

**application/plugins/**
```
役割: プラグインシステムによる機能拡張
PluginManager:
  - プラグイン登録・解除
  - ライフサイクル管理 (init, update, dispose)
  - 依存関係解決

ビルトインプラグイン:
  - AssetPlugin: AssetManager 統合、ローディング状態管理
  - StatsPlugin: パフォーマンス監視（FPS, メモリ）
  - StatsGLPlugin: GPU 統計（GPU メモリ、描画コール数）
  - OrbitControlsPlugin: マウスベースカメラ制御
  - DebugShaderPlugin: シェーダーデバッグユーティリティ
```

**asset/asset-manager.ts**
```
役割: 統一アセットローダー
機能:
  - テクスチャ、モデル、フォント、アトラスの読み込み
  - アセットキャッシング
  - イベント発行（loading, loaded, error）
使用例:
  const manager = new AssetManager()
  const texture = await manager.load('image.png', 'texture')
  const model = await manager.load('model.gltf', 'gltf')
```

**asset/resolver/**
```
役割: フォーマット固有のローダー実装
Resolver:
  - TextureResolver: PNG/JPG/WebP → Three.js Texture
  - GLTFResolver: glTF/glb モデル読み込み
  - FontResolver: TrueType/WebFont → Font geometry
  - TextureAtlasResolver: スプライトシート管理
```

**camera/camera-controls.ts**
```
役割: OrbitControls ラッパー
機能:
  - 自動回転
  - ズーム・パン制限
  - デフォルト位置へのリセット
```

**textures/**
```
役割: テクスチャユーティリティ
実装:
  - ColorTexture: Canvas ベースのプログラマティック生成
  - TextureAtlas: スプライトシート管理、フレームアニメーション
```

**nodes/**
```
役割: シェーダーノード・エフェクト
実装:
  - Halftone: ハーフトーンエフェクト（GLSL）
  - CurlNoise: カールノイズ（流体力学向け）
  - Snoise3: 3D シンプレックスノイズ（プロシージャルテクスチャ）
```

**loaders/json-loader.ts**
```
役割: 汎用 JSON ファイルローダー
機能:
  - JSON パース・バリデーション
  - 設定ファイル読み込み
```

**misc/**
```
役割: その他ユーティリティ
実装:
  - MaterialReplacer: ロードしたモデルのマテリアル置換
  - constants: Three.js 関連定数
  - environment: WebGL 機能検出
```

## Data Flow

// Load texture
const texture = await assetManager.load('image.png', 'texture')

// Load model
const gltf = await assetManager.load('model.gltf', 'gltf')

// Load font
const font = await assetManager.load('font.json', 'font')
```

## Data Flow

### アプリケーション初期化フロー
```
new ApplicationBase(canvas)
   ↓
RendererFactory.create()
   ↓
Viewport 初期化
   ↓
PluginManager.use(plugins)
   ↓
各プラグイン init()
   ↓
ApplicationBase.onInit()
   ↓
アニメーションループ開始
```

### アセット読み込みフロー
```
AssetManager.load(path, type)
   ↓
Resolver 選択 (type に応じて)
   ↓
Resolver.resolve(path)
   ↓ (fetch)
リソース取得
   ↓ (parse)
Three.js オブジェクト生成
   ↓ (cache)
AssetManager でキャッシュ
   ↓
アプリケーションに返却
```

### レンダリングループフロー
```
requestAnimationFrame
   ↓
PluginManager.update(deltaTime)
   ↓
ApplicationBase.onUpdate(deltaTime)
   ↓
Scene 更新
   ↓
Renderer.render(scene, camera)
   ↓
(PostProcessing がある場合)
   ↓
AbstractPostprocessing.render()
   ↓
画面に描画
```

### プラグイン統合フロー
```
PluginManager.use(PluginClass)
   ↓
Plugin インスタンス化
   ↓
Plugin.init(app)
   ↓
アニメーションループに統合
   ↓ (毎フレーム)
Plugin.update(deltaTime)
   ↓ (破棄時)
Plugin.dispose()
```

### ビルドフロー
```
TypeScript Source (src/)
   ↓
tsdown (unbundle: true)
   ↓
ESM Modules (dist/*.mjs)
+ Type Definitions (dist/*.d.ts)
```

## External Dependencies

**Peer Dependencies**
- `three` (0.182.0) - 3D レンダリングエンジン（必須）
- `stats-gl` (3.8.0) - GPU パフォーマンス統計（StatsGLPlugin 使用時）
- `@112ka/x` (0.0.10) - 基底ユーティリティライブラリ

**Dev Dependencies**
- `@types/three` (0.182.0) - Three.js 型定義
- `tsdown` (0.20.0-beta.3) - TypeScript ビルドツール（unbundle mode）
- `@antfu/eslint-config` (^7.0.1) - ESLint 設定
- `eslint` (^9.39.2) - リンター
- `@tsconfig/recommended` (^1.0.13) - TypeScript 設定ベース

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
      "types": "./dist/index.d.ts",
      "default": "./dist/index.mjs"
    },
    "./*.js": {
      "types": "./dist/*.d.ts",
      "default": "./dist/*.mjs"
    }
  },
  "sideEffects": false  // Tree-shaking 最適化
}
```

**内部依存関係**
```
application/
  → renderer/ (RendererFactory, RendererAdapter)
  → plugins/ (PluginManager)
     → AssetPlugin → asset/AssetManager
     → StatsGLPlugin → stats-gl
     → OrbitControlsPlugin → three/OrbitControls

asset/
  → resolver/ (各種 Resolver)
  → three (Texture, GLTF, Font 型)

camera/
  → three/OrbitControls

textures/
  → three/Texture

nodes/
  → (独立 - GLSL シェーダーコード)

misc/
  → three/Material
```

**外部サービス連携**
- Three.js エコシステム（OrbitControls, GLTFLoader など）
- WebGL API
- Canvas API
- Fetch API（アセット読み込み）

# packages x3 開発共通情報

## 技術スタック

- **言語**：TypeScript 5.x（`target: ES2020`, `lib: ES2020 + DOM`）
- **3D エンジン**：Three.js 0.182.0（peerDependency）
- **統計表示**：stats-gl 3.8.0（peerDependency）
- **内部ユーティリティ**：@112ka/x 0.0.10（peerDependency）
- **ビルド**：tsdown 0.20.0-beta.3
- **リント**：ESLint 9.39.2 + @antfu/eslint-config 7.0.1
- **型チェック**：TypeScript compiler（emitDecoratorMetadata, experimentalDecorators 有効）

## Architecture / フォルダ構成

```
src/
├── index.ts                              # 全モジュール再エクスポート
├── application/
│   ├── application-base.ts               # シーン・カメラ・レンダラー統合管理
│   ├── viewport.ts                       # リサイズ監視（ResizeObserver）
│   ├── types.ts                          # ApplicationConfig
│   ├── renderer/                         # レンダラー抽象化
│   │   ├── renderer-factory.ts           # WebGL/WebGPU レンダラー生成（最適選択機能）
│   │   ├── renderer-adapter.ts           # レンダラー統一インターフェース
│   │   └── abstract-postprocessing.ts    # ポストプロセッシング基盤
│   └── plugins/                          # プラグインシステム
│       ├── plugin-manager.ts             # 登録・管理・フェーズ制御
│       ├── asset-plugin.ts               # アセット管理プラグイン
│       ├── orbit-controls-plugin.ts      # 軌道カメラコントローラー
│       ├── stats-plugin.ts               # フレームレート統計
│       ├── stats-gl-plugin.ts            # WebGPU/WebGL 統計表示
│       └── debug-shader-plugin.ts        # シェーダーデバッグ
├── asset/
│   ├── asset-manager.ts                  # リソース一括管理（EventDispatcher 拡張）
│   └── resolver/                         # 型別ローダー群
│       ├── gltf-resolver.ts              # glTF/glb ローダー
│       ├── texture-resolver.ts           # テクスチャ（PNG/JPG 等）ローダー
│       ├── font-resolver.ts              # フォント（TTF/OTF）ローダー
│       └── texture-atlas-resolver.ts     # テクスチャアトラスローダー
├── camera/
│   └── camera-controls.ts                # カメラの軌道制御実装
├── textures/
│   ├── texture-atlas.ts                  # 画像アトラス管理
│   └── color-texture.ts                  # 単色テクスチャ生成
├── nodes/
│   ├── halftone.ts                       # ハーフトーン効果
│   └── noise/                            # ノイズ関数実装
│       ├── curl.ts                       # Curl ノイズ
│       └── snoise3.ts                    # 3D Simplex ノイズ
├── loaders/
│   └── json-loader.ts                    # JSON パーサー＋キャッシュ
└── misc/
    ├── environment.ts                    # WebGPU/WebGL 環境判定
    ├── material-replacer.ts              # マテリアル置換ユーティリティ
    └── constants.ts                      # 定数群
```

### 特筆すべき構造的特徴

- **レンダラー抽象化**: RendererFactory で WebGL/WebGPU を明示的に選択・自動フォールバック対応
- **プラグインシステム**: PluginManager による初期化フェーズ管理（BeforeScene/AfterScene）
- **アセット型別リゾルバー**: IResolver インターフェースに基づいく拡張可能な設計
- **EventDispatcher 活用**: AssetManager, Clock, Viewport がイベント駆動
- **型付けイベント**: TypeScript ジェネリクス（AssetManagerEventMap, TViewportEventMap）による型安全性確保

## ドメイン構造

### 初期化フロー
1. `ApplicationBase` コンストラクタ：ラッパー要素、Scene, Camera, Viewport 初期化
2. `initialize()` 呼び出し：
   - `setupRenderer()` - RendererFactory でレンダラー決定・生成
   - `plugin.initializeAllBeforeScene()` - Scene 前の初期化（アセット読み込み等）
   - `initializeScene()` - ユーザー定義シーン初期化
   - `plugin.initializeAllAfterScene()` - Scene 後の初期化（カメラコントローラー等）

### アセット管理
- **AssetManager**: LoadingManager を内部保持、複数リゾルバー統合管理
- **リゾルバー型**：Font, Texture, GLTF, TextureAtlas
- **キャッシュ**：textures, objects, atlases, fonts の Record で管理

### レンダラー選択戦略
- `createBestAvailable()`: navigator.gpu チェック → WebGPU 優先 → WebGL フォールバック
- WebGPU 初期化失敗時は自動的に WebGL へ降格（console.warn 記録）

### ビューポート管理
- ResizeObserver による自動リサイズ検知
- resize イベント発火（width, height, aspectRatio）

## 禁止事項

- **直接的な Three.js import**: 型定義以外は `ApplicationBase` の `scene`/`camera` を経由して利用
- **アセット型の未登録**: IResolver に登録されていない型のアセット読み込みは実装禁止
- **PluginManager の直接操作**: plugin API 以外での Map 操作は禁止
- **WebGPU 専属コード**: WebGL フォールバック対応を無視した実装禁止

## 依存先

### 内部パッケージ
- **@112ka/x** 0.0.10 - ユーティリティ（`assertIsDefined` 等）

### 外部ライブラリ（peerDependencies）
- **three** 0.182.0 - 3D エンジン（WebGLRenderer, WebGPURenderer, Scene, Camera 等）
- **stats-gl** 3.8.0 - WebGPU/WebGL パフォーマンス統計表示

### DevDependencies
- **@types/three** 0.182.0 - Three.js 型定義
- **tsdown** - ビルドツール
- **eslint**, **@antfu/eslint-config** - リント設定

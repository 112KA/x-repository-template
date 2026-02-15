# packages x3 基本情報

## このパッケージの責務（Intent）

Three.js ベースの 3D グラフィックレンダリングライブラリ。WebGL/WebGPU レンダラーの抽象化、シーン・カメラ・ビューポート管理、アセット管理、プラグイン拡張機構を提供。

## 公開 API

### application
- `ApplicationBase` - Three.js シーン、カメラ、レンダラー、ビューポートの統合管理
- `Viewport` - ウィンドウリサイズの監視と寸法管理（ResizeObserver)
- `PluginManager` - プラグイン登録・管理・フェーズ制御
- `RendererFactory` - WebGL/WebGPU レンダラーの自動選択・生成

### asset
- `AssetManager` - リソース一括管理（Texture, GLTF, Font, TextureAtlas）
- `IResolver` - アセット型ごとのローダー基盤（FontResolver, GLTFResolver, TextureResolver, TextureAtlasResolver）

### renderer
- `RendererAdapter` - レンダラー抽象層（WebGL/WebGPU 統一インターフェース）
- `RendererFactory.createBestAvailable()` - デバイス能力に応じた最適レンダラー自動選択

### textures
- `TextureAtlas` - 画像アトラス管理
- `ColorTexture` - 単色テクスチャ生成

### camera
- `CameraControls` - インタラクティブなカメラ制御

### nodes
- `Halftone` - ハーフトーン効果ノード
- `curl`, `snoise3` - ノイズ関数（Perlin ノイズ、Curl ノイズ）

### plugins
- `AssetPlugin` - アセット管理プラグイン
- `OrbitControlsPlugin` - 軌道カメラコントローラープラグイン
- `StatsPlugin` - フレームレートおよびパフォーマンス統計表示
- `StatsGLPlugin` - WebGPU/WebGL パフォーマンス統計表示（stats-gl）
- `DebugShaderPlugin` - シェーダーデバッグプラグイン

### loaders
- `JsonLoader` - JSON ファイルローダー

### misc
- `environment` - WebGPU/WebGL 環境判定
- `MaterialReplacer` - マテリアル置換ユーティリティ
- `CONSTANTS` - 定数定義

## 配布形式

- ESM のみ（`"type": "module"`）
- エクスポート条件：`./dist/index.mjs` および `./dist/*.mjs`
- 型定義：`./dist/index.d.ts` および `./dist/*.d.ts`
- サイドエフェクト：なし（`"sideEffects": false`）

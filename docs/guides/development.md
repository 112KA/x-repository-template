# Development Guide

このガイドは x-repository-template での開発フローと実践的な手順を説明します。

## 開発ワークフロー

### パッケージ開発時のリアルタイム更新

複数ターミナルを開いて以下を実行：

```bash
# ターミナル 1: パッケージを watch モードでビルド
pnpm watch
# or 特定パッケージのみ:
# pnpm watch:x
# pnpm watch:x3

# ターミナル 2: アプリケーションを開発モードで起動
pnpm dev:nextjs        # Next.js
# or: pnpm dev:vite
```

### 単体アプリケーション開発

特定のアプリケーションのみで作業する場合：

```bash
# Vite アプリ
cd apps/app-vite
pnpm dev
```

Vite アプリは `https://localhost:5173/` で起動します。リモート環境でのポート転送に対応するため、`0.0.0.0` で待ち受けます。ネットワーク上の他の端末からも接続可能になるため、信頼できる開発環境で使用してください。ポート 5173 が使用中の場合は、別ポートに切り替えず起動エラーになります。HTTPS は自己署名証明書を使用するため、ブラウザーで証明書の信頼設定が必要になる場合があります。

Vite アプリの `@/` エイリアスは `apps/app-vite/app/` を参照します。`tsconfig.json` の `compilerOptions.paths` を開発サーバーとビルドでも使用するため、`vite.config.ts` で `resolve.tsconfigPaths: true` を設定しています。

### アプリケーション設定

テーマ関連の Provider・hook・切替 UI は `apps/app-vite/app/features/theme/` に集約しています。`theme-provider.tsx` が状態管理と永続化、`use-theme.ts` が Context と参照用 hook、`ui/theme-switch.tsx` が切替 UI を担当します。

Vite アプリのテーマは shadcn/ui の Vite 向け実装をベースとした `ThemeProvider` で共有し、`useTheme` から `theme` と `setTheme` を取得します。Provider 外での利用はエラーになります。テーマ切替 UI はライト・ダークの二択のアイコントグルで、現在のテーマがライトなら Sun、ダークなら Moon を表示します。アクセシビリティ上は「ダークモード」スイッチとして状態を公開します。共有状態と更新 API は `"light"`・`"dark"` のみを扱います。

ユーザーが選んだテーマはブラウザー単位の設定として localStorage に `"light"`・`"dark"` を保存します。Provider の props は `defaultTheme`（既定値 `"system"`）と `storageKey`（既定値 `"vite-ui-theme"`）です。このアプリは既存設定を引き継ぐため `storageKey="theme"` を指定しています。未設定時はデバイス環境からライト・ダークの初期値を決め、初期化だけでは保存しません。以前保存した `"system"` もデバイス環境から初期値を決める指定として扱います。それ以外の不正な保存値はエラーになります。

サンプルと異なり、プリレンダリングに対応するため保存値は hydration 後の Effect で読み込みます。テーマ専用の起動スクリプトは使わず、初期表示のライトからの切替を許容します。HTML の `light`・`dark` クラスはテーマ状態に応じた Effect で付け替えます。デバイス環境は初期値の決定にのみ使用し、表示中の OS 設定変更には追従しません。ユーザーの保存済み選択はデバイス環境より優先されます。保存に失敗した場合はエラーを伝播し、画面や共有状態だけが更新されないようにしています。

テーマ以外の設定を追加する際は、寿命と適用範囲に応じて Provider と保存先を選びます。全設定をテーマ用の Provider や localStorage に集約する仕組みにはしていません。

- 画面・セッション中だけの設定: 必要な範囲の React state。
- ブラウザー単位で再訪時も維持する小さな設定: localStorage。
- サーバー描画にも必要な設定: Cookie を検討。
- アカウント単位で端末間共有する設定: サーバー保存を検討。

現時点ではテーマのみを実装しています。別タブでの変更の自動同期は行いません。

## よく使うコマンド

### ビルド

```bash
# すべてのパッケージをビルド
pnpm build

# 特定パッケージのビルド
pnpm x build       # @112ka/x
pnpm x3 build      # @112ka/x3

# Next.js アプリケーション
pnpm app:nextjs build
```

### Linting & コード整形

```bash
# 全体を lint
pnpm lint

# 自動修正
pnpm lint:fix

# 特定パッケージのみ
pnpm x lint:fix
```

### テスト

```bash
# すべてのテストを実行
pnpm testAll

# 特定パッケージのみ
pnpm x test
```

### ショートカットコマンド

```bash
# 特定のアプリ・パッケージで作業
pnpm app:nextjs <command>    # Next.js
pnpm app:vite <command>      # Vite
pnpm x <command>             # @112ka/x
pnpm x3 <command>            # @112ka/x3
pnpm x-lib <command>         # x-lib

# 例:
pnpm x test
pnpm app:nextjs build
```

## ファイル構造

### アプリケーション（apps/）

```
apps/
└── app-vite/    Vite + React TypeScript
    ├── app/            TypeScript ソース
    └── public/         静的ファイル
```

### パッケージ（packages/）

```
packages/
├── x/                   コアユーティリティ
│   ├── src/
│   │   ├── data/       データ処理（array, object, color など）
│   │   ├── features/   高機能（Clock, Modal, Scroll など）
│   │   ├── web/        Web API（db, net, mediaQuery など）
│   │   ├── math/       数学ユーティリティ（Vector, Spline など）
│   │   ├── application/ アプリケーション基盤
│   │   └── index.ts    エントリーポイント
│   └── dist/           ビルド出力
├── x3/                  3D グラフィックス
│   ├── src/
│   │   ├── application/ 3D アプリケーション基盤
│   │   ├── asset/      アセット管理
│   │   ├── nodes/      シェーダーノード
│   │   └── plugins/    プラグインシステム
│   └── dist/           ビルド出力
└── x-lib/              汎用ユーティリティ（拡張予定）
    └── src/
```

## モノレポパターン

### パッケージ間の依存関係

内部パッケージは `workspace:*` プロトコルで参照：

```json
// apps/app-vite/package.json
{
  "dependencies": {
    "x": "workspace:@112ka/x@*"
  }
}
```

このプロトコルにより：

- 自動的にワークスペースバージョンに解決
- npm publish 時に実バージョンに置換
- シンボリックリンクで開発時の高速フィードバック

### パッケージのインポート

```typescript
// @112ka/x3 からインポート
import { ApplicationBase } from "@112ka/x3/application";
import { OrbitControlsPlugin, StatsPlugin } from "@112ka/x3/application/plugins";
import { AssetManager } from "@112ka/x3/asset";
// x-lib からインポート
import { someUtil } from "x-lib";
import { InteractiveObject, Stage } from "x/application";

import { arrayUtils, colorUtils } from "x/data";
// @112ka/x からインポート
import { Clock, Modal, Scroll } from "x/features";
import { Vector2, Vector3 } from "x/math";

import { db, mediaQuery, net } from "x/web";
```

## 新機能の追加

### パッケージに新機能を追加

```bash
# 1. パッケージのソースを編集
vim packages/x/src/features/new-feature.ts

# 2. パッケージの index.ts でエクスポート
vim packages/x/src/index.ts
# export * from './features/new-feature'

# 3. ビルド（自動: watch モード、手動: pnpm x build）
pnpm x build

# 4. アプリケーションで使用
# import { newFeature } from 'x/features/new-feature'
```

### パッケージにテストを追加

```typescript
// packages/x/src/features/clock.test.ts
import { describe, expect, it } from "vite-plus/test";
import { Clock } from "./clock";

describe("Clock", () => {
  it("should measure elapsed time", () => {
    const clock = new Clock();
    // テスト...
  });
});
```

```bash
pnpm x test
```

## TypeScript 設定

### TypeScript バージョン

プロジェクト全体で **TypeScript 5.9.3 Strict Mode** を使用：

```bash
# 確認
npx tsc --version

# 各アプリケーション/パッケージの tsconfig.json で Strict Mode 有効
```

### IDE 統合（VS Code）

```json
// .vscode/settings.json（推奨）
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

## 環境変数

環境変数が必要な場合は `.env.local` を作成：

```bash
# apps/app-vite/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
SECRET_KEY=your-secret
```

**注**: `.env.local` は `.gitignore` に含まれます。

## ビルドとデプロイ

### 開発ビルド

```bash
# Full monorepo rebuild
pnpm build
pnpm app:vite build
```

### 本番ビルド

```bash
# Optimize build
NODE_ENV=production pnpm build
NODE_ENV=production pnpm app:vite build

# Start Next.js production server
cd apps/app-vite
pnpm start
```

### デプロイ対象

- **Vite**: `apps/app-vite/build/client/`

## デバッグ

### ブラウザ DevTools

Next.js:

```bash
pnpm app:nextjs dev
# ブラウザで http://localhost:3000 を開く
# React DevTools, Redux DevTools (if applicable) を使用
```

### Node.js Debugger

```bash
# VS Code で F5 を押すか、debug configuration を使用
node --inspect-brk ./node_modules/.bin/vitest run
```

### Monorepo Debugging

パッケージが正しくビルドされているか確認：

```bash
ls -la packages/x/dist/
ls -la packages/x3/dist/

# node_modules でシンボリックリンクを確認
ls -la apps/app-vite/node_modules/@112ka/
```

## トラブルシューティング

### エラー: "Cannot find module '@112ka/x'"

**原因**: パッケージがビルドされていない

```bash
# 解決策
pnpm install   # postinstall で自動ビルド
pnpm build     # または手動ビルド
```

### エラー: "Unexpected token '}'"（TypeScript）

**原因**: TypeScript バージョンの不一致またはコンパイルエラー

```bash
# 解決策
npx tsc --noEmit              # 型チェック
pnpm lint:fix                 # ESLint 自動修正
```

### ポート 3000 が使用中

**原因**: Next.js 開発サーバーが既に起動している

```bash
# 別のポートで起動
pnpm app:nextjs dev -- -p 3001

# または既存プロセスを終了
lsof -i :3000
kill -9 <PID>
```

### pnpm install が遅い

**原因**: パッケージキャッシュの肥大化

```bash
# 解決策
pnpm store prune              # キャッシュを整理
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## パフォーマンス最適化

### バンドルサイズの確認

```bash
# Next.js
cd apps/app-vite
npm run build
# .next/static/chunks/ を確認
```

### Watch モードの最適化

```bash
# 不要なアプリを除外
pnpm -F @112ka/x watch       # x のみ watch
pnpm -F @112ka/x3 watch      # x3 のみ watch

# または両方:
pnpm watch                    # = watch:x + watch:x3
```

## リソース

- [PRODUCT.md](../PRODUCT.md) - プロダクト仕様
- [AGENTS.md](../../AGENTS.md) - モノレポ開発パターン

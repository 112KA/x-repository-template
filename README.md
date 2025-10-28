# x (@112ka/x)

軽量でモジュール化された TypeScript ユーティリティライブラリです。
ライブラリは複数の小さなモジュール（core, data, features, math, misc, utils など）で構成され、ES モジュールとして配布されます。

## 要点（短く）
- エントリポイント: `src/index.ts`（サブモジュールを再エクスポート）
 - エントリポイント: `src/index.ts`（サブモジュールを再エクスポート）
 - ビルド: `tsdown` によるビルド（`dist/` に成果物を出力）
 - 型定義: ビルドツールが `.d.ts` を生成することを想定（`types` フィールドを確認）
- パッケージ管理: pnpm を推奨

## セットアップ
1. 必要に応じて `.npmrc` を復元してください（リポジトリに `.npmrc.org` がある場合）。

```bash
mv .npmrc.org .npmrc   # 必要なら
# %%PERSONAL_ACCESS_TOKEN%%を自身のtokenで置換する
pnpm i
```

## 開発とビルド

- ビルド:

```bash
pnpm build   # runs tsdown
```

- ビルドのウォッチ:

```bash
pnpm watch   # runs tsdown --watch
```

## Lint

```bash
pnpm lint:fix
```

## 推奨ワークフロー
1. ブランチ作成: `git switch -c feat/your-feature`
2. 依存インストール: `pnpm i`
3. ローカルで確認: `pnpm build` を実行して出力を確認（開発サーバ用スクリプトは package.json に定義されていません）
4. Lint を実行/修正: `pnpm lint:fix`
5. PR を作成してレビューを依頼

## プロジェクト構成
- `src/` (主要な実装。`src/index.ts` が公開 API の起点)
- `core/`, `data/`, `features/`, `math/`, `misc/`, `utils/`, `errors/`, `decorators/`, `@types/`
- `dist/` (ビルド成果物。preserveModules による個別ファイル出力)

## TypeScript / ビルド設定の注意
- `tsconfig.json` は `@tsconfig/recommended` を拡張しており、`moduleResolution: "bundler"` とパスエイリアス `x/*` -> `./src/*` を持ちます。
- 出力ターゲットは互換性のために ES2018 を使っていますが、ソースは ES2020 の型で開発されています。

## スタイル & 慣例
- ESLint（`@antfu/eslint-config`）に従ってください。
- 公開 API には TSDoc/JSDoc を付けることを推奨します。
- 小さな単一責任のモジュールを心がけ、barrel（`src/index.ts`）で明示的に再エクスポートしてください。

## 作者
- Masayuki Iizuka <mas.iizuka@gmail.com>

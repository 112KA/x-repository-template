---
description: 'パッケージ/アプリ内の docs/*.md（PRODUCT、ARCHITECTURE、CONTRIBUTING）を自動生成するエージェント'
tools: ['read/readFile', 'edit/createDirectory', 'edit/createFile', 'edit/editFiles', 'search/fileSearch', 'search/listDirectory']
---

# Update Package Docs Agent

このエージェントは、指定された pnpm monorepo のパッケージまたはアプリケーション（`packages/*` または `apps/*`）内に以下のドキュメントを全置換で生成します：

- `${targetDir}/docs/PRODUCT.md`: 製品仕様
- `${targetDir}/docs/ARCHITECTURE.md`: アーキテクチャ
- `${targetDir}/docs/CONTRIBUTING.md`: 固有の開発ガイド

## Purpose

各パッケージ/アプリ固有のドキュメントを、`package.json` とソース構造から自動生成します。ルート `docs/` に記載されているモノレポ全体の共通情報との重複を避け、固有の情報のみを記載します。

## Scope Separation

### ルート docs/ との責務分離

| 項目 | ルート docs/ | パッケージ/アプリ docs/ |
|------|-------------|-----------------|
| モノレポ全体のセットアップ | ✓ | ✗（リンクのみ） |
| pnpm install / postinstall 手順 | ✓ | ✗（リンクのみ） |
| コミット規約・ブランチ戦略 | ✓ | ✗（リンクのみ） |
| 共通リンティングルール | ✓ | ✗（リンクのみ） |
| Git Workflow | ✓ | ✗（リンクのみ） |
| 固有のAPI/構造 | ✗ | ✓ |
| 固有のビルド手順 | ✗ | ✓ |
| 固有の依存関係 | ✗ | ✓ |
| 固有のテスト手順 | ✗ | ✓ |
| 固有の設計思想 | ✗ | ✓ |

### 共通事項への参照

パッケージ/アプリの docs 内では、共通事項についてはルートドキュメントへのリンクを記載：

```markdown
共通のセットアップ手順、コミット規約、ブランチ戦略については [ルートの CONTRIBUTING.md](../../docs/CONTRIBUTING.md) を参照してください。
```

## Input Parameters

### 必須

- **対象パス**: 対象パッケージまたはアプリケーションのディレクトリパス
  - 例: `packages/x`, `packages/x3`, `apps/app-nextjs`, `apps/app-astro`
  - `packages/*` または `apps/*` 配下に存在すること

### オプション

- **生成対象**: 生成するドキュメントの選択（デフォルト: すべて）
  - `PRODUCT`: 製品仕様のみ
  - `ARCHITECTURE`: アーキテクチャのみ
  - `CONTRIBUTING`: 開発ガイドのみ

## Information Sources

各ドキュメント生成時に以下の情報源から収集：

### PRODUCT.md 用

| 情報源 | 取得情報 |
|--------|----------|
| `package.json` | `name`, `description`, `keywords` |
| `CHANGELOG.md` | 最新バージョンの変更内容、Features |
| `src/index.ts` | 主要な公開 API から機能を推測 |

### ARCHITECTURE.md 用

| 情報源 | 取得情報 |
|--------|----------|
| `package.json` | `dependencies`, `devDependencies`, `peerDependencies` |
| `tsconfig.json` | TypeScript 設定、`compilerOptions` |
| `src/` ディレクトリ構造 | モジュール構成、ディレクトリツリー |
| `src/index.ts` | 公開API、エクスポート一覧 |

### CONTRIBUTING.md 用

| 情報源 | 取得情報 |
|--------|----------|
| `package.json` | `scripts`（build, test, lint など） |
| `vitest.config.ts` | テスト設定 |
| `eslint.config.mjs` | リンティング設定 |
| `tsdown.config.ts` | ビルド設定 |

## Output Templates

各出力ファイルのテンプレートは `.github/templates/package-docs/` ディレクトリに配置されています：

| 出力ファイル | テンプレートファイル |
|-------------|-------------------|
| `${targetDir}/docs/PRODUCT.md` | [PRODUCT.template.md](../templates/package-docs/PRODUCT.template.md) |
| `${targetDir}/docs/ARCHITECTURE.md` | [ARCHITECTURE.template.md](../templates/package-docs/ARCHITECTURE.template.md) |
| `${targetDir}/docs/CONTRIBUTING.md` | [CONTRIBUTING.template.md](../templates/package-docs/CONTRIBUTING.template.md) |

### テンプレート変数

各テンプレートで使用される変数：

| 変数 | 説明 | 例 |
|------|------|-----|
| `${packageName}` | パッケージ/アプリ名 | `@112ka/x`, `app-nextjs` |
| `${targetDir}` | 対象ディレクトリ | `packages/x`, `apps/app-nextjs` |
| `${description}` | package.json の description | `Core utility library` |
| `${features}` | CHANGELOG.md・src/index.ts から推測した Features | 箇条書きリスト |
| `${dependencies}` | 依存関係一覧 | テーブル形式 |
| `${srcStructure}` | src/ のディレクトリツリー | ツリー形式 |
| `${exports}` | index.ts のエクスポート一覧 | 箇条書きリスト |
| `${scripts}` | package.json の scripts | テーブル形式 |
| `${testCommand}` | テスト実行コマンド | `pnpm test` |
| `${lintCommand}` | リント実行コマンド | `pnpm lint` |
| `${rootDocsPath}` | ルート docs への相対パス | `../../../docs` |

## Workflow

このエージェントは以下の5ステップで実行します：

### Step 1: 対象パス検証

- 指定されたパスが `packages/*` または `apps/*` 配下に存在するか確認
- `package.json` が存在するか確認
- 存在しない場合はエラーを出力して終了

### Step 2: 情報源ファイル読み取り

- `package.json` を読み込み（必須）
- `CHANGELOG.md` を読み込み（存在しない場合はスキップ）
- `tsconfig.json` を読み込み（存在しない場合は警告）
- `src/` ディレクトリ構造を取得
- `src/index.ts` を読み込み（存在しない場合は警告）
- `vitest.config.ts`、`eslint.config.mjs`、`tsdown.config.ts` を読み込み（存在しない場合はスキップ）

### Step 3: テンプレート変数抽出

- 読み込んだ情報源からテンプレート変数を抽出
- 不足情報は警告としてリストアップ
- ルート docs への相対パスを計算

### Step 4: ドキュメント生成

- `${targetDir}/docs/` ディレクトリを作成（存在しない場合）
- 各テンプレートを適用し、ドキュメントを生成
- **全置換**: 既存ファイルは完全に上書き

### Step 5: 結果報告

- 生成したファイル一覧を出力
- 警告一覧を出力（情報不足があった場合）
- 手動で追記が必要な項目を提案

## Warnings

情報源が不足している場合、以下の警告を出力します：

| 条件 | 警告メッセージ | 対応 |
|------|--------------|------|
| description なし | `⚠️ package.json に description が未定義です。手動で追記してください。` | プレースホルダーを出力 |
| CHANGELOG.md なし | `⚠️ CHANGELOG.md が見つかりません。Features は src/index.ts から推測します。` | エクスポートから機能を推測 |
| src/index.ts なし | `⚠️ src/index.ts が見つかりません。エクスポート一覧は手動で追記してください。` | API セクションをスキップ |
| tests/ なし | `⚠️ テストディレクトリが見つかりません。テスト手順は手動で追記してください。` | テストセクションに注記を追加 |
| vitest.config.ts なし | `⚠️ vitest.config.ts が見つかりません。テスト設定は推測値を使用します。` | 一般的なコマンドを出力 |

## Limitations

- **手動実行のみ**: 自動実行は想定していません。ユーザーが明示的に呼び出してください。
- **完全上書き**: 既存の手動編集は失われます。重要な変更は事前にバックアップしてください。
- **pnpm workspace 専用**: yarn/npm workspace には対応していません。
- **単一対象**: 一度の実行で1つのパッケージまたはアプリのみ処理します。複数を処理する場合は繰り返し呼び出してください。
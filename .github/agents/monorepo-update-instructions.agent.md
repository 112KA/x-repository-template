---
description: 'monorepo環境でのinstructions.md, AGENTS.mdを自動生成するエージェント'
tools: ['read/readFile', 'edit/createDirectory', 'edit/createFile', 'edit/editFiles', 'search/fileSearch', 'search/listDirectory']
handoffs:
- label: Update Package Docs
  agent: update-package-docs
  prompt: Generate docs/*.md for the detected packages.
  send: false
---

# Generate Instructions Agent

このエージェントは、pnpm monorepo 環境で以下のファイルを手動実行により完全上書き生成します：

- `.github/copilot-instructions.md`: Copilot 専用ドキュメント（人が読まない）
- `.github/instructions/${packageName}.instructions.md`: 各パッケージの概要・設計パターン（Copilot Chat用）
- `AGENTS.md`（ルート）: 共通ルール（monorepo全体のビルド・CI・Git規約）（Copilot Coding Agent用）
- `${packageDir}/AGENTS.md`: 各パッケージ固有のビルド・テスト手順（Copilot Coding Agent用）

## Purpose

### ドキュメント分離の原則

| ドキュメント | 対象 | 記載内容 |
|-------------|------|----------|
| `docs/*.md`（PRODUCT、ARCHITECTURE、CONTRIBUTING） | **人向け** | プロジェクト概要、アーキテクチャ、開発手順、コード規約 |
| `.github/copilot-instructions.md` | **Copilot向け** | Copilot が開発タスク実行に必要なコンテキスト、ファイルリファレンス |
| `.github/instructions/${packageName}.instructions.md` | **Copilot Chat** | パッケージ固有の設計パターン、API仕様 |
| `AGENTS.md`（ルート + 各パッケージ） | **Copilot Coding Agent** | ビルド・テスト・CI手順 |

**copilot-instructions.md の役割**：
- Copilot が monorepo コンテキストを理解するために必要な情報を集約
- docs/ への参照リンク（人向けドキュメントへのナビゲーション）
- workspace 構造、ビルドパイプライン
- monorepo 全体に関わるファイルリファレンス（pnpm-workspace.yaml、ルートの package.json のみ）
- Copilot への明示的な指示（言語、スタイル）
- パッケージ固有の情報は各パッケージの instructions.md や AGENTS.md に委譲

## Target Packages Detection

### 検出ルール

1. `pnpm-workspace.yaml` の `packages` フィールドから glob パターンを取得
2. 該当ディレクトリの `package.json` を走査
3. 各 `package.json` の `name` フィールドをパッケージ名として取得
4. **除外なし**: すべてのパッケージを対象とする

### 例（このリポジトリの場合）

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

**検出されるパッケージ**:
- `apps/app-nextjs` → `app-nextjs`
- `apps/app-astro` → `app-astro`
- `apps/app-vite-vanilla` → `app-vite-vanilla`
- `packages/x` → `@112ka/x`
- `packages/x3` → `@112ka/x3`
- `packages/x-lib` → `x-lib`

## Filename Mapping Rules

### instructions.md のマッピング

パッケージ名を以下のルールで変換し、`.github/instructions/` 配下に配置：

```
filename = packageName
  .replace(/^@/, '')       // スコープの @ を削除
  .replace(/[\/._]/g, '-') // /, ., _ を - に置換
  .concat('.instructions.md')
```

| パッケージ名 | 出力ファイル名 |
|-------------|---------------|
| `@112ka/x` | `112ka-x.instructions.md` |
| `app-nextjs` | `app-nextjs.instructions.md` |
| `my.lib_name` | `my-lib-name.instructions.md` |

### AGENTS.md のマッピング

各パッケージのディレクトリ直下に配置：

| パッケージ | 出力パス |
|-----------|----------|
| `app-nextjs` | `apps/app-nextjs/AGENTS.md` |
| `@112ka/x` | `packages/x/AGENTS.md` |
| ルート共通 | `AGENTS.md` |

## Information Sources

各ファイル生成時に以下の情報源から収集：

### 全体（copilot-instructions.md、ルート AGENTS.md）
- `package.json`（ルート）: プロジェクト名、Node.js/pnpm バージョン
- `pnpm-workspace.yaml`: ワークスペース構成
- `docs/PRODUCT.md`: 製品仕様
- `docs/ARCHITECTURE.md`: アーキテクチャ
- `docs/CONTRIBUTING.md`: 開発ガイド
- `.github/instructions/*.instructions.md`: 既存のinstruction定義
- `eslint.config.mjs`: リンティング設定

### パッケージごと（${packageName}.instructions.md、${packageDir}/AGENTS.md）
- `${packageDir}/package.json`: パッケージ名、依存関係、scripts
- `${packageDir}/README.md`: 概要、使い方
- `${packageDir}/tsconfig.json`: TypeScript設定
- `${packageDir}/vitest.config.ts`: テスト設定
- `${packageDir}/src/index.ts`: エクスポートAPI

## Output Templates

各出力ファイルのテンプレートは `.github/templates/` ディレクトリに配置されています：

| 出力ファイル | テンプレートファイル | 説明 |
|-------------|-------------------|------|
| `.github/copilot-instructions.md` | [copilot-instructions.template.md](../templates/copilot-instructions.template.md) | Copilot 専用：Conversation Context、File References Quick Guide、人向けドキュメントへのナビゲーション |
| `.github/instructions/${packageName}.instructions.md` | [package-instructions.template.md](../templates/package-instructions.template.md) | 各パッケージの概要・設計パターン |
| `AGENTS.md`（ルート） | [root-agents.template.md](../templates/root-agents.template.md) | 共通ルール（monorepo全体のビルド・CI・Git規約） |
| `${packageDir}/AGENTS.md` | [package-agents.template.md](../templates/package-agents.template.md) | 各パッケージ固有のビルド・テスト手順 |

### テンプレート変数

各テンプレートで使用される変数：

- `${projectName}`: ルートの `package.json` の `name` フィールド
- `${packageName}`: 各パッケージの `package.json` の `name` フィールド
- `${packageDir}`: パッケージのディレクトリパス（例: `apps/app-nextjs`, `packages/x`）

## Workflow

このエージェントは以下の5ステップで実行します：

### Step 1: Workspace 解析
- `pnpm-workspace.yaml` を読み込み、パッケージ glob パターンを取得
- ルートの `package.json` を読み込み、プロジェクト情報を取得

### Step 2: Package 検出
- glob パターンに一致するディレクトリを走査
- 各ディレクトリの `package.json` を読み込み、パッケージ名とディレクトリパスを取得

### Step 3: Information 収集
- **全体**: `docs/` 配下のドキュメント、ルートの設定ファイルを読み込み
- **パッケージごと**: README.md、tsconfig.json、vitest.config.ts、src/index.ts を読み込み

### Step 4: Template 適用
- 収集した情報を各テンプレートに当てはめて内容を生成
- 重複排除ルールに従い、instructions.md と AGENTS.md の役割を分離

### Step 5: Output 生成
- `.github/copilot-instructions.md` を完全上書き
- `.github/instructions/${packageName}.instructions.md` を各パッケージごとに生成
- `AGENTS.md`（ルート）を完全上書き
- `${packageDir}/AGENTS.md` を各パッケージごとに生成
- 生成したファイル一覧をユーザーに報告

### Step 6: (Optional) Package Docs 生成への引き継ぎ

instructions と AGENTS.md の生成が完了したら、必要に応じて `update-package-docs` エージェントを呼び出し、各パッケージ内の `docs/*.md` を生成できます。

- **handoff ボタン**: 「Update Package Docs」をクリックで引き継ぎ
- **対象**: 検出されたすべてのパッケージ
- **生成物**: `${packageDir}/docs/PRODUCT.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md`

## Limitations

- **手動実行のみ**: 自動実行は想定していません。ユーザーが明示的に呼び出してください。
- **完全上書き**: 既存の手動編集は失われます。重要な変更は事前にバックアップしてください。
- **pnpm workspace 専用**: yarn/npm workspace には対応していません。
# ${packageName} Architecture

## 1. Tech Stack

### Core

| カテゴリ | 技術 |
|---------|------|
| Language | TypeScript (Strict Mode) |
| Build | tsdown |
| Module | ES Modules |

### Dependencies

${dependencies}

## 2. Project Structure

```
${packageDir}/
${srcStructure}
```

## 3. Public API

### Exports

${exports}

### Entry Point

- `src/index.ts`: 公開APIのエントリポイント
- `dist/`: ビルド成果物（ES Modules）

## 4. Design Principles

### モジュール設計

<!-- パッケージ固有のモジュール設計方針を記載 -->

- **単一責任**: 各モジュールは1つの責務のみを持つ
- **疎結合**: モジュール間の依存を最小限に抑える
- **明示的なエクスポート**: `index.ts` で公開APIを明示

### 型設計

- **Strict Mode**: `noImplicitAny`, `strictNullChecks` を有効化
- **型定義**: `@types/` ディレクトリに型定義を集約

## 5. Dependencies Policy

### 外部依存関係

${peerDependencies}

### 内部依存関係

<!-- 他の workspace パッケージへの依存を記載 -->

---

> 共通のアーキテクチャ方針については [ルートの ARCHITECTURE.md](${rootDocsPath}/ARCHITECTURE.md) を参照してください。

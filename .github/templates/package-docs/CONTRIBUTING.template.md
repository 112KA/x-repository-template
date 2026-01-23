# ${packageName} Contributing Guidelines

## Package-Specific Setup

このパッケージを単独でセットアップする場合：

```bash
# パッケージディレクトリに移動
cd ${packageDir}

# 依存関係のインストール（ルートから実行推奨）
pnpm install
```

> 共通のセットアップ手順、コミット規約、ブランチ戦略については [ルートの CONTRIBUTING.md](${rootDocsPath}/CONTRIBUTING.md) を参照してください。

## Available Scripts

${scripts}

### よく使うコマンド

```bash
# ビルド
${buildCommand}

# ウォッチモードでビルド
${watchCommand}

# リンティング
${lintCommand}

# テスト実行
${testCommand}
```

## Development Workflow

### 1. コード変更

1. `src/` 配下のファイルを編集
2. ウォッチモード (`${watchCommand}`) を起動しておくと自動リビルド

### 2. エクスポートの追加

新しいモジュールを公開する場合：

1. `src/` に新しいファイルを作成
2. `src/index.ts` にエクスポートを追加

```typescript
// src/index.ts
export * from './new-module'
```

### 3. テスト

${testInstructions}

## Build Configuration

### tsdown

${buildConfig}

### TypeScript

- `tsconfig.json` で設定を管理
- Strict Mode 有効

## Code Style

このパッケージは共通のリンティングルールに従います。

```bash
# リンティング実行
${lintCommand}

# 自動修正
${lintFixCommand}
```

---

> 共通のコーディング規約、Git ワークフローについては [ルートの CONTRIBUTING.md](${rootDocsPath}/CONTRIBUTING.md) を参照してください。

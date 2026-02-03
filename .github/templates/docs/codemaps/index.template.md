# System Architecture

## 1. Tech Stack

[全体に関わる技術スタックを記載]

例: 
```markdown
### Core
- **Package Manager**: pnpm (>= 10) - モノレポ管理
- **Node.js**: >= 24.12
- **Language**: TypeScript 5.9.3 (Strict Mode)

### Development
- **Build Tools**: tsdown (パッケージビルド), Turbopack (Next.js)
- **Linting**: ESLint 9 + @antfu/eslint-config
- **Testing**: Vitest + @testing-library/react
```

## 2. Project Structure

[全体構造を記載]

例: 
``` markdown
/
├── apps/                      # アプリケーション層
│   ├── app-nextjs/           # Next.js アプリ (メイン)
│   ├── app-astro/            # Astro アプリ
│   └── app-vite-vanilla/     # Vite vanilla アプリ
│
├── packages/                  # 共有ライブラリ層
│   ├── x/                    # @112ka/x (コアライブラリ)
│   ├── x3/                   # @112ka/x3 (3D関連)
│   └── x-lib/                # その他共通機能
│
├── docs/                      # ドキュメント
│   ├── PRODUCT.md            # 製品仕様
│   └── CONTRIBUTING.md         # プロジェクト参加ガイド
│   └── codemap/                # コードマップ
│   └── guides/                # 機能ガイド、tutorial
│
├── schemas/                   # スキーマ定義 (XSD)
└── scripts/                   # Git subtree 管理スクリプト
```

## 3. Design Principles

### モノレポアーキテクチャ
- **Workspace構成**: pnpm workspace で複数アプリ・パッケージを統一管理
- **依存関係**: `workspace:*` プロトコルで内部パッケージを参照
- **ビルドチェーン**: `postinstall` で自動的に依存パッケージをビルド

### パッケージ設計
- **ビルド戦略**: tsdown による高速ビルド、watch モードで開発効率化
- **型安全性**: TypeScript Strict Mode で型エラーを事前検出
- **再利用性**: 共通機能は packages/ に集約し、アプリから参照

### コード品質
- **リンティング**: @antfu/eslint-config による統一スタイル
- **Git Hooks**: pre-commit で自動リンティング、品質担保

## 4. Package Dependencies

### 内部依存関係

[内部依存関係を記載]

例: 
``` markdown
app-nextjs → @112ka/x (workspace:*)
app-astro  → (独立)
app-vite   → (独立)

@112ka/x3  → (独立)
@112ka/x   → (独立)
```

### 外部パッケージポリシー

[外部パッケージポリシーを記載]

例: 
``` markdown
- **認証**: `.npmrc` に Personal Access Token を設定
- **プライベートパッケージ**: `@112ka/x` はアクセス権限が必要
- **セキュリティ**: トークンをリポジトリにコミットしない (`.npmrc.example` をテンプレート化)
```

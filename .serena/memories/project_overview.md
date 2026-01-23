# Project Overview

## プロジェクト目的

x-repository-template は pnpm を用いたモノレポ向けのテンプレートリポジトリです。主にフロントエンドの Web Framework (Astro, Vite, Nuxt, Next.js) の template と共通パッケージを同一ワークスペースで管理するためのベース構成を提供します。新規プロジェクトの立ち上げや内部テンプレートとして利用することを想定しています。

## 技術スタック

- **パッケージマネージャー**: pnpm (>= 10)
- **Node.js**: >= 24.12
- **言語**: TypeScript 5.9.3
- **フレームワーク**: Next.js 16, Astro, Vite
- **リンティング**: ESLint 9 + @antfu/eslint-config
- **テスティング**: Vitest + @testing-library/react
- **Git Hooks**: simple-git-hooks + lint-staged
- **UI**: Tailwind CSS, Radix UI, shadcn/ui
- **アニメーション**: GSAP

## プロジェクト構造

```
/
├── apps/              # アプリケーション
│   ├── app-astro/    # Astro ベースのアプリ
│   ├── app-nextjs/   # Next.js ベースのアプリ
│   └── app-vite-vanilla/  # Vite vanilla アプリ
├── packages/          # 再利用可能なライブラリ
│   ├── x/            # @112ka/x コアライブラリ
│   ├── x3/           # @112ka/x3 3D 関連ライブラリ
│   └── x-lib/        # その他共通ライブラリ
├── docs/             # ドキュメント
├── schemas/          # スキーマ定義
└── scripts/          # スクリプト
```

## 主要コンポーネント

### アプリケーション (apps/)

- **app-nextjs**: Next.js 16 App Router ベース、Tailwind CSS、shadcn/ui、Vitest でテスト
- **app-astro**: Astro ベース
- **app-vite-vanilla**: Vite vanilla ベース

### パッケージ (packages/)

- **@112ka/x**: コアライブラリ (TypeScript + tsdown でビルド)
- **@112ka/x3**: 3D 関連ライブラリ
- **x-lib**: その他共通ライブラリ

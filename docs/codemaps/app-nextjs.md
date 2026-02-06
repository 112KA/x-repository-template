# app-nextjs Codemap

**最終更新：** 2026-02-06  
**エントリポイント：** src/app/layout.tsx, src/app/page.tsx, next.config.ts

## Overview

Next.js 16 with App Router, Turbopack ビルドシステム、および View Transitions API による統合ページ遷移システム。静的エクスポート（`output: 'export'`）設定で、shadcn/ui ベースの UI コンポーネントライブラリと GSAP アニメーションを統合。

**主要技術**
- Next.js 16.1.4 (App Router)
- React 19.2.3
- Turbopack (開発サーバー・ビルド)
- Tailwind CSS 4.1.18
- View Transitions API + GSAP 3.14.2
- Vitest + Testing Library

**主要な責務**
- ページ遷移システムの実装とデモ
- 再利用可能な UI コンポーネントライブラリ
- モノレポ内パッケージ統合の参考実装

## Package Structure

```
apps/app-nextjs/
├── src/
│   ├── app/                                    # App Router
│   │   ├── layout.tsx                          # ルートレイアウト
│   │   ├── page.tsx                            # ホームページ
│   │   ├── globals.css                         # グローバルスタイル
│   │   ├── _constraints/                       # プライベートシステム
│   │   │   └── transitions/                    # ページ遷移システム
│   │   │       ├── index.ts                    # Public API
│   │   │       ├── components/                 # React コンポーネント
│   │   │       │   ├── view.tsx                # View wrapper
│   │   │       │   └── transition-link.tsx     # Link wrapper
│   │   │       ├── strategies/                 # 遷移戦略
│   │   │       │   ├── index.ts
│   │   │       │   ├── view-transition-api.ts  # Native API
│   │   │       │   └── gsap-fade.ts            # GSAP fallback
│   │   │       ├── providers/                  # React Context
│   │   │       │   ├── index.ts
│   │   │       │   ├── view-transition-provider.tsx
│   │   │       │   ├── page-transition-provider.tsx
│   │   │       │   └── shared.ts               # 型定義
│   │   │       ├── hooks/                      # カスタムフック
│   │   │       │   ├── hook.ts
│   │   │       │   └── use-transition-provider.ts
│   │   │       ├── tests/                      # Unit tests
│   │   │       │   ├── view-transitions.test.tsx
│   │   │       │   ├── test-utils.tsx
│   │   │       │   └── mocks/
│   │   │       ├── README.md
│   │   │       └── requirements.md
│   │   └── (examples)/                         # ルートグループ
│   │       └── examples/
│   │           ├── transitions/                # 遷移デモ
│   │           │   ├── layout.tsx
│   │           │   ├── page.tsx
│   │           │   ├── page1/page.tsx
│   │           │   └── page2/page.tsx
│   │           └── page-mockup/                # インタラクティブモックアップ
│   │               ├── page.tsx
│   │               └── views/
│   │                   ├── view-1.tsx
│   │                   ├── view-2.tsx
│   │                   └── view-3.tsx
│   ├── components/
│   │   └── ui/
│   │       └── button.tsx                      # shadcn/ui Button
│   ├── hooks/                                  # カスタムフック
│   ├── lib/
│   │   ├── utils.ts                            # cn() - Tailwind merger
│   │   ├── font.ts                             # Noto Sans JP
│   │   └── page-definitions.generated.ts       # 自動生成
│   └── types/                                  # TypeScript 型定義
├── public/                                     # 静的アセット
├── certificates/                               # HTTPS 証明書 (dev)
├── definitions/                                # スキーマ定義
├── scripts/                                    # ビルドスクリプト
├── next.config.ts                              # Next.js 設定
├── tsconfig.json                               # TypeScript 設定
├── vitest.config.ts                            # Vitest 設定
├── vitest.setup.ts
├── postcss.config.mjs                          # PostCSS (Tailwind)
├── components.json                             # shadcn/ui 設定
├── eslint.config.mjs
├── package.json
├── AGENTS.md
└── README.md
```

**構造の特徴**
- App Router による file-system based routing
- `_constraints/` でプライベートシステムを分離
- `(examples)` ルートグループで URL 構造を制御
- shadcn/ui による統一されたコンポーネントライブラリ

## Key Modules

| Module | Role | Exports |
|--------|------|---------|
| `app/_constraints/transitions/` | ページ遷移システム | Provider, Hook, Component, Strategy |
| `app/_constraints/transitions/strategies/` | 遷移アニメーション実装 | `createViewTransitionApiStrategy`, `createFadeStrategy` |
| `app/_constraints/transitions/providers/` | React Context | `ViewTransitionProvider`, `PageTransitionProvider` |
| `app/_constraints/transitions/hooks/` | カスタムフック | `useViewSwitch`, `useViewTransitionRouter` |
| `app/_constraints/transitions/components/` | UI コンポーネント | `View`, `TransitionLink` |
| `components/ui/` | 再利用可能 UI | `Button` (shadcn/ui) |
| `lib/utils.ts` | ユーティリティ | `cn()` - Tailwind class merger |
| `lib/font.ts` | フォント設定 | `notoSansJp` |
| `app/layout.tsx` | ルートレイアウト | React Server Component |
| `app/page.tsx` | ホームページ | React Server Component |

**transitions/strategies/**
```
役割: 遷移アニメーションの実装戦略
戦略:
  - view-transition-api: ネイティブ View Transitions API 使用
  - gsap-fade: GSAP ベースのフェード（フォールバック）
処理:
  1. 戦略名を受け取る (string | ViewTransitionStrategy)
  2. resolveStrategy() で戦略オブジェクトに解決
  3. 各戦略は execute() メソッドを実装
```

**transitions/providers/**
```
役割: React Context でアプリケーション全体に遷移機能を提供
Provider:
  - ViewTransitionProvider: View内遷移用
  - PageTransitionProvider: ページ間遷移用
Context:
  - ViewTransitionContext
  - PageTransitionContext
```

**transitions/hooks/**
```
役割: コンポーネントから遷移機能にアクセス
Hooks:
  - useViewSwitch(): View 切り替え
  - useViewTransitionRouter(): ページ遷移
  - useTransitionProvider(): Context へのアクセス
```

**components/ui/**
```
役割: shadcn/ui ベースの再利用可能コンポーネント
コンポーネント:
  - Button: Radix UI Slot ベース、CVA でバリアント管理
追加方法: npx shadcn@latest add <component>
```

**lib/utils.ts**
```
役割: Tailwind CSS クラス名の結合とマージ
関数: cn(...inputs: ClassValue[])
  1. clsx でクラス名を結合
  2. twMerge で重複を解決
```

## Data Flow

### ページナビゲーションフロー
```
User Action (Link Click)
   ↓
TransitionLink Component
   ↓
useViewTransitionRouter()
   ↓
Strategy Resolution (resolveStrategy)
   ↓
View Transitions API / GSAP Animation
   ↓
Next.js Router (next/navigation)
   ↓
New Page Render
```

### View 切り替えフロー (内部遷移)
```
User Action
   ↓
useViewSwitch() Hook
   ↓
ViewTransitionProvider Context
   ↓
Strategy Execution
   ↓
DOM Update (View Component)
```

### ビルドフロー
```
TypeScript Source
   ↓
tsc (型チェック)
   ↓
Turbopack Bundle
   ↓
Static Export (output: 'export')
   ↓
out/ Directory
```

### テストフロー
```
vitest.config.ts
   ↓
happy-dom Environment
   ↓
vitest.setup.ts (global setup)
   ↓
*.test.tsx Execution
   ↓
Coverage Report (v8)
```

## External Dependencies

**Runtime Dependencies**
- `next` (16.1.4) - React フレームワーク
- `react` (19.2.3) - UI ライブラリ
- `react-dom` (19.2.3) - React DOM レンダラー
- `gsap` (3.14.2) - アニメーションライブラリ
- `x` (workspace:@112ka/x@*) - モノレポ内共有パッケージ

**UI Library Dependencies**
- `@radix-ui/react-slot` (1.2.4) - Radix UI プリミティブ
- `lucide-react` (0.562.0) - アイコンライブラリ
- `class-variance-authority` (0.7.1) - バリアント管理
- `clsx` (2.1.1) - クラス名結合
- `tailwind-merge` (3.4.0) - Tailwind クラスマージ

**Build/Dev Dependencies**
- `@next/eslint-plugin-next` (16.1.4) - Next.js ESLint プラグイン
- `tailwindcss` (catalog) - CSS フレームワーク
- `@tailwindcss/postcss` (^4.1.18) - PostCSS プラグイン
- `@vitest/coverage-v8` (4.0.18) - テストカバレッジ
- `@testing-library/react` (16.3.2) - React テストユーティリティ
- `@testing-library/jest-dom` (6.9.1) - DOM マッチャー
- `@testing-library/user-event` (14.6.1) - ユーザーイベントシミュレーション
- `happy-dom` (^20.3.4) - DOM 実装（テスト用）
- `vitest` (^4.0.18) - テストランナー

**Import 構造**
```
app/layout.tsx
  → lib/font.ts (notoSansJp)
  → globals.css

app/_constraints/transitions/index.ts
  → components/ (View, TransitionLink)
  → providers/ (ViewTransitionProvider, PageTransitionProvider)
  → strategies/ (createViewTransitionApiStrategy, createFadeStrategy)
  → hooks/ (useViewSwitch, useViewTransitionRouter)

components/ui/button.tsx
  → @radix-ui/react-slot
  → class-variance-authority
  → lib/utils (cn)
```

**外部サービス連携**
- HTTPS 開発サーバー（`--experimental-https`）
- 静的エクスポート（CDN デプロイ可能）

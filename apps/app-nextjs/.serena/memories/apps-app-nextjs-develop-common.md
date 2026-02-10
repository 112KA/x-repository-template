# apps app-nextjs 開発共通情報

## 技術スタック

- **Framework**: Next.js 16.1.4、React 19.2.3、App Router ベース
- **言語**: TypeScript（strict mode）、TSX/JSX
- **ビルドツール**: Turbopack
- **CSS フレームワーク**: Tailwind CSS 4 + tw-animate-css、postcss 4
- **UI ライブラリ**: shadcn/ui、Radix UI（@radix-ui/react-slot）
- **アニメーション**: GSAP 3.14.2 + View Transitions API（ブラウザサポート時）
- **テスト**: Vitest 4、@testing-library/react、happy-dom
- **スタイリングユーティリティ**: clsx、tailwind-merge、class-variance-authority
- **アイコン**: lucide-react
- **フォント**: Google Fonts（Noto Sans JP）

## Architecture、フォルダ構成

```
src/
├── app/                           # Next.js App Router
│   ├── layout.tsx                # ルートレイアウト
│   ├── page.tsx                  # ホームページ
│   ├── globals.css               # グローバルスタイル
│   ├── _constraints/             # 制約・共通ロジック
│   │   └── transitions/
│   │       ├── index.ts          # エクスポート
│   │       ├── providers/        # PageTransitionProvider, ViewTransitionProvider
│   │       ├── hooks/            # useViewSwitch, useViewTransitionRouter
│   │       ├── strategies/       # createFadeStrategy, createViewTransitionApiStrategy
│   │       └── components/       # View, TransitionLink
│   └── (examples)/               # ルートグループ（例示ページ）
├── components/
│   └── ui/                       # shadcn/ui コンポーネント集
├── hooks/                        # カスタムフック（空、将来拡張用）
├── lib/
│   ├── utils.ts                 # cn() 関数（Tailwind クラス結合）
│   ├── font.ts                  # Google Fonts 設定（Noto Sans JP）
│   └── page-definitions.generated.ts # XML 定義から自動生成される型定義
└── types/                        # TypeScript 型定義（空）

definitions/
└── pages/
    ├── definition.xml           # ページ・ビュー定義（宣言的管理）
    └── README.md

public/                          # 静的アセット
certificates/                    # 開発用 HTTPS 証明書
```

## ドメイン構造

- **ページレイヤー**: Next.js App Router の `app/` ツリー上で定義
- **ビュー管理**: マルチビューページをサポート（同一ページ内での複数ビュー切り替え）
- **トランジション戦略**:
  - ページ遷移時：`PageTransitionProvider` で管理
  - ビュー内切り替え：`ViewTransitionProvider` で管理
  - 戦略は pluggable（GSAP、View Transitions API のサポート）
- **コンポーネント**: shadcn/ui ベースの UI + カスタムコンポーネント
- **ミニマルな Hook**：フック層はまだ構築途上（`src/hooks/` は空）

## 禁止事項

- **any 型**の使用（strict TypeScript mode を堅守）
- **Default Export**（`page.tsx`, `layout.tsx` など Next.js 規約ファイル除外）
- **Inline styles**（Tailwind utility-first を使用）
- **不要な依存追加**
- **View Transitions API の非互換ブラウザ対応漏れ**：フォールバック戦略を用意すること
- 過度なテスト実装（開発効率とのバランスを取る）

## 依存先

### 内部パッケージ

- `x` workspace パッケージ（`packages/x/src` を webpack alias で直接参照）

### 外部ライブラリ（主要）

- react, react-dom
- next
- tailwindcss
- @radix-ui/react-slot
- gsap
- lucide-react（アイコン）
- clsx, tailwind-merge（Tailwind ユーティリティ）

### 開発依存パッケージ

- vitest（テスト）
- @testing-library/react, @testing-library/user-event
- tailwindcss postcss

## 制約・設計ルール

- **Path Alias 厳守**: `@/*`, `@constraints/*`, `x/*` を活用
- **Named Export**: `export function Component() {}` 形式（ページファイル除外）
- **Props 型定義**: インターフェース `Props` で必須
- **'use client' ディレクティブ**: Client Component には必ず記述
- **JSDoc コメント**: 公開 API、複雑なロジックにはコメント記述
- **Static Export**: ビルド結果は `out/` に静的ファイル（Next.js config より）
- **Trailing Slash**: URL 末尾にスラッシュを付与（`trailingSlash: true`）

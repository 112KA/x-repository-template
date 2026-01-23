---
description: 'Next.js アプリケーションの開発ガイドライン'
applyTo: 'apps/app-nextjs/**/*'
---

# Next.js アプリケーション開発ガイドライン

このドキュメントは `apps/app-nextjs` の開発における統一されたベストプラクティスと規約を定義します。

## プロジェクト構成

### 技術スタック

- **Framework**: Next.js 16 (App Router)
- **React**: 19.2.3
- **Build Tool**: Turbopack
- **UI Components**: shadcn/ui, Radix UI
- **Styling**: Tailwind CSS 4, tw-animate-css
- **Animation**: GSAP
- **Testing**: Vitest, @testing-library/react, happy-dom
- **Output Mode**: Static Export (`output: 'export'`)

### ディレクトリ構造

```
apps/app-nextjs/
├── definitions/pages/           # XMLページ定義
│   ├── definition.xml          # ページ・ビュー定義
│   └── README.md               # 定義の使用方法
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx          # ルートレイアウト
│   │   ├── page.tsx            # ホームページ
│   │   ├── globals.css         # グローバルスタイル
│   │   ├── _constraints/       # 制約・共通ロジック
│   │   │   └── view-transitions/ # ビュートランジション
│   │   └── (examples)/         # 例示ページ（ルートグループ）
│   ├── components/              # React コンポーネント
│   │   ├── multi-view-page.tsx # マルチビューページ
│   │   └── ui/                 # shadcn/ui コンポーネント
│   ├── hooks/                   # カスタムフック
│   ├── lib/                     # ユーティリティ
│   │   ├── font.ts             # フォント設定
│   │   ├── utils.ts            # 共通ユーティリティ (cn)
│   │   └── page-definitions.generated.ts # 自動生成型定義
│   └── types/                   # 型定義
├── public/                      # 静的アセット
├── scripts/                     # ビルドスクリプト
└── certificates/                # 開発用証明書 (HTTPS)
```

## コーディング規約

### TypeScript

- **Strict Mode**: 必須。`tsconfig.json` の `strict: true` を維持
- **型注釈**: 関数の引数と戻り値には明示的に型を指定
- **型推論**: ローカル変数は型推論を活用（冗長な型注釈を避ける）
- **Nullish Coalescing**: `??` と `?.` を積極的に使用

**Good:**
```typescript
export function formatDate(date: Date | null): string {
  return date?.toISOString() ?? 'N/A'
}
```

**Bad:**
```typescript
export function formatDate(date) { // 型注釈なし
  if (!date) return 'N/A'
  return date.toISOString()
}
```

### React コンポーネント

#### ファイル構成

- **コンポーネント**: PascalCase (`MultiViewPage.tsx`)
- **ユーティリティ**: camelCase (`utils.ts`)
- **定数**: UPPER_SNAKE_CASE (`const MAX_ITEMS = 10`)

#### コンポーネント定義

- **Named Export** を使用（デフォルトエクスポートは禁止）
- ただし、`page.tsx`, `layout.tsx`, `error.tsx` などの Next.js 規約ファイルは例外
- Props は `interface` で定義
- Client Component には `'use client'` ディレクティブを明記

**Good:**
```typescript
'use client'

interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

export function CustomButton({ label, onClick, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick} className={cn('btn', `btn-${variant}`)}>{label}</button>
}
```

**Bad:**
```typescript
// 'use client' がない、default export、Props の型定義なし
export default function CustomButton({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>
}
```

#### Hooks の使用

- カスタムフックは `hooks/` ディレクトリに配置
- フック名は `use` で始める
- 複雑な状態管理はカスタムフックに切り出す

```typescript
// hooks/use-view-transition.ts
export function useViewTransition(strategy: ViewTransitionStrategy) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  // ...
}
```

### スタイリング

#### Tailwind CSS

- **Utility-First**: Tailwind のユーティリティクラスを優先
- **Custom Classes**: 繰り返しが多い場合は `@apply` でカスタムクラス化
- **Dynamic Styles**: `cn()` ユーティリティで条件付きクラスを結合

```typescript
import { cn } from '@/lib/utils'

export function Card({ isActive }: { isActive: boolean }) {
  return (
    <div className={cn(
      'rounded-lg border p-4',
      isActive && 'bg-primary text-primary-foreground'
    )}>
      Content
    </div>
  )
}
```

#### グローバルスタイル

- `globals.css` にプロジェクト全体のスタイル定義
- Tailwind の `@theme` でカスタムトークンを定義
- CSS 変数は `--` プレフィックスで定義

### Path Alias

`tsconfig.json` で以下のエイリアスを使用:

```typescript
import { Button } from '@/components/ui/button'           // コンポーネント
import { cn } from '@/lib/utils'                          // ユーティリティ
import { createFadeStrategy } from '@constraints/view-transitions' // 制約
import { someUtility } from 'x/utils'                     // 外部パッケージ
```

## アーキテクチャパターン

### ページ定義システム

#### 概要

- **XML ベース**: `definitions/pages/definition.xml` でページ構造を定義
- **型生成**: XSD スキーマから TypeScript 型を自動生成
- **マルチビューページ**: クライアント側でのビュー切り替えをサポート
- **View Transitions API**: ページ間遷移とビュー切り替えで統一的なアニメーション

#### 使用方法

1. **定義ファイルにページを追加**

```xml
<page id="example-page" url="/example/" title="Example Page"
      defaultView="view-a" viewTransition="fade">
  <view id="view-a" name="View A" title="View A Title">
    <button label="Next" action="switchView:view-b"/>
  </view>
  <view id="view-b" name="View B" title="View B Title">
    <button label="Back" action="switchView:view-a"/>
  </view>
</page>
```

2. **型定義を生成**

```bash
pnpm app:nextjs generate:pages
```

3. **ページを実装**

```tsx
import { MultiViewPage } from '@/components/multi-view-page'
import { PAGE_DEFINITIONS } from '@/lib/page-definitions.generated'

export default function ExamplePage() {
  const pageDefinition = PAGE_DEFINITIONS['example-page']
  return <MultiViewPage pageDefinition={pageDefinition} />
}
```

### View Transitions

#### 戦略パターン

- **Strategy Interface**: `ViewTransitionStrategy` で統一
- **Built-in Strategies**: `createFadeStrategy()` など
- **Custom Strategies**: プロジェクト固有のアニメーションを実装可能

#### 実装例

```typescript
import type { ViewTransitionStrategy } from '@constraints/view-transitions'

const customStrategy: ViewTransitionStrategy = {
  beforeSwitchView: async ({ container, fromViewId, toViewId }) => {
    // 切り替え前処理（フェードアウトなど）
  },
  afterSwitchView: async ({ container, fromViewId, toViewId }) => {
    // 切り替え後処理（フェードインなど）
  },
  cleanup: () => {
    // クリーンアップ処理
  },
}
```

#### Provider の使用

```tsx
<ViewSwitchProvider
  strategy={strategy}
  currentViewId={currentViewId}
  onViewChange={setCurrentViewId}
>
  {children}
</ViewSwitchProvider>
```

### UI コンポーネント (shadcn/ui)

#### 追加方法

```bash
pnpm dlx shadcn@latest add button
```

#### カスタマイズ

- `components/ui/` に配置された shadcn コンポーネントは自由に編集可能
- `lib/utils.ts` の `cn()` を活用して動的スタイルを適用

#### ベストプラクティス

```typescript
// Good: shadcn コンポーネントを拡張
import { Button } from '@/components/ui/button'

export function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button disabled={isLoading}>
      {isLoading ? 'Loading...' : 'Submit'}
    </Button>
  )
}
```

## テスト

### テストファイル配置

- **単体テスト**: コンポーネントと同じディレクトリに `*.test.tsx`
- **統合テスト**: `__tests__/` ディレクトリに配置

### テスト記述

```typescript
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CustomButton } from './custom-button'

describe('CustomButton', () => {
  it('renders with label', () => {
    render(<CustomButton label="Click me" onClick={() => {}} />)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

### テストポリシー

- **ハッピーパス優先**: 正常系を優先的にテスト
- **カバレッジ**: 80% 以上を目標（過度なテストは避ける）
- **実行**: `pnpm app:nextjs test` でテスト実行

## ビルドとデプロイ

### 開発サーバー

```bash
pnpm dev:nextjs  # Turbopack + HTTPS で起動
```

- **HTTPS**: 開発時に HTTPS を使用（`--experimental-https`）
- **Hot Reload**: Turbopack による高速リロード
- **Port**: デフォルト 3000

### ビルド

```bash
pnpm app:nextjs build
```

- **Output**: Static Export (`out/` ディレクトリ)
- **Trailing Slash**: 有効（`trailingSlash: true`）

### 依存パッケージ

- **Internal Packages**: `"x": "workspace:@112ka/x@*"` で参照
- **Webpack Alias**: `x` パッケージは `packages/x/src/index.ts` に直接エイリアス

## 注意事項

### Do's

- **TypeScript Strict Mode** を維持
- **Named Export** を使用（Next.js 規約ファイル以外）
- **Path Alias** (`@/`, `@constraints/`, `x/`) を活用
- **JSDoc** で関数にコメントを記述
- **Tailwind Utility-First** でスタイリング
- **Client Component** には `'use client'` を明記

### Don'ts

- **any 型** の使用を避ける
- **デフォルトエクスポート** を避ける（ページファイル以外）
- **inline styles** を避ける（Tailwind を使用）
- **過度なテスト** を避ける（開発コストとのバランス）
- **不要な依存関係** を追加しない

## 参考リソース

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Vitest Documentation](https://vitest.dev/)

---

**Note**: このガイドラインは [CONTRIBUTING.md](../../../docs/CONTRIBUTING.md) および [ARCHITECTURE.md](../../../docs/ARCHITECTURE.md) と合わせて参照してください。

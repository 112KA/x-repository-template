# app-nextjs: AI エージェント向けプロジェクトガイド

このドキュメントは、`apps/app-nextjs` での実践的な開発作業を支援するための情報を提供します。コーディング規約については [`.github/instructions/app-nextjs.instructions.md`](../../.github/instructions/app-nextjs.instructions.md) を参照してください。

## プロジェクトの設計思想

### Static Export による配信

- **output: 'export'**: ビルド結果を静的ファイルとして出力し、任意のホスティングサービスで配信可能
- **trailingSlash: true**: URL の末尾にスラッシュを付与（静的ファイル配信との親和性向上）
- **Client-Side Routing**: Next.js の App Router によるクライアント側ルーティング

### XML ベースのページ定義

**背景**: ページ構造とビュー定義を宣言的に管理し、型安全性を確保するため

- **definition.xml**: ページとビューの構造を定義
- **型生成**: XSD スキーマから TypeScript 型を自動生成（現在は手動だが将来的にスクリプト化予定）
- **Multi-View Pages**: 単一ページ内で複数のビューを切り替え可能

### View Transitions の戦略パターン

**背景**: ページ遷移とビュー切り替えで同じアニメーション制御を再利用するため

- **Strategy Interface**: `ViewTransitionStrategy` で統一
- **GSAP/View Transitions API**: 環境に応じたフォールバック
- **Plugin Architecture**: カスタム戦略を自由に追加可能

## よくある開発タスク

### 1. 新しいページの追加

#### マルチビューページの場合

1. **definition.xml にページを定義**

```xml
<page id="my-page" url="/my-page/" title="My Page"
      defaultView="main" viewTransition="fade">
  <view id="main" name="Main View" title="Main View">
    <button label="Next" action="switchView:detail"/>
  </view>
  <view id="detail" name="Detail View" title="Detail View">
    <button label="Back" action="switchView:main"/>
  </view>
</page>
```

2. **型定義を更新**（将来的にスクリプト化予定）

現在は手動で `src/lib/page-definitions.generated.ts` を更新:

```typescript
export const PAGE_DEFINITIONS = {
  // ... 既存の定義
  'my-page': {
    id: 'my-page',
    url: '/my-page/',
    title: 'My Page',
    isMultiView: true,
    defaultView: 'main',
    viewTransition: 'fade',
    views: [
      {
        id: 'main',
        name: 'Main View',
        title: 'Main View',
        buttons: [{ label: 'Next', action: 'switchView:detail' }],
      },
      {
        id: 'detail',
        name: 'Detail View',
        title: 'Detail View',
        buttons: [{ label: 'Back', action: 'switchView:main' }],
      },
    ],
  },
} as const
```

3. **ページファイルを作成**

`src/app/my-page/page.tsx`:

```tsx
import { MultiViewPage } from '@/components/multi-view-page'
import { PAGE_DEFINITIONS } from '@/lib/page-definitions.generated'

export default function MyPage() {
  const pageDefinition = PAGE_DEFINITIONS['my-page']
  return <MultiViewPage pageDefinition={pageDefinition} />
}
```

#### 通常のページの場合

1. **src/app に直接ページを作成**

```tsx
// src/app/about/page.tsx
export default function AboutPage() {
  return (
    <div>
      <h1>About</h1>
      <p>This is the about page.</p>
    </div>
  )
}
```

### 2. shadcn/ui コンポーネントの追加

```bash
# プロジェクトルートから
pnpm dlx shadcn@latest add card

# 使用例
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function MyCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Content</p>
      </CardContent>
    </Card>
  )
}
```

### 3. カスタム View Transition の作成

#### GSAP を使ったスライドトランザクション

```typescript
// src/app/_constraints/view-transitions/strategies/slide.ts
import type { ViewTransitionStrategy } from '../types'
import gsap from 'gsap'

export function createSlideStrategy(): ViewTransitionStrategy {
  return {
    beforeNavigate: async ({ element, navigate }) => {
      if (!element) {
        navigate()
        return
      }

      // スライドアウト
      await gsap.to(element, {
        x: -100,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      })

      navigate()
    },
    afterEnter: async ({ element }) => {
      if (!element)
        return

      // スライドイン
      gsap.set(element, { x: 100, opacity: 0 })
      await gsap.to(element, {
        x: 0,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      })
    },
    cleanup: () => {
      gsap.killTweensOf('*')
    },
  }
}
```

#### View Transitions API を使った例

```typescript
// src/app/_constraints/view-transitions/strategies/view-transition-api.ts
import type { ViewTransitionStrategy } from '../types'

export function createViewTransitionApiStrategy(): ViewTransitionStrategy {
  return {
    beforeNavigate: async ({ navigate }) => {
      if (!document.startViewTransition) {
        // フォールバック: 即座に遷移
        navigate()
        return
      }

      const transition = document.startViewTransition(() => {
        navigate()
      })

      await transition.finished
    },
    afterEnter: async () => {
      // View Transitions API が DOM の更新を自動処理
    },
    cleanup: () => {},
  }
}
```

### 4. カスタムフックの作成

```tsx
// src/hooks/use-multi-view.ts
import { useCallback, useState } from 'react'

export function useMultiView(defaultViewId: string) {
  const [currentViewId, setCurrentViewId] = useState(defaultViewId)

  const switchView = useCallback((viewId: string) => {
    setCurrentViewId(viewId)
  }, [])

  return { currentViewId, switchView }
}

// 使用例
export function MyComponent() {
  const { currentViewId, switchView } = useMultiView('main')

  return (
    <div>
      <p>
        Current View:
        {currentViewId}
      </p>
      <button onClick={() => switchView('detail')}>Switch to Detail</button>
    </div>
  )
}
```

## トラブルシューティング

### ビルドエラー: "Module not found: Can't resolve 'x'"

**原因**: `x` パッケージのエイリアス設定が正しくない

**解決策**:

1. `next.config.ts` の webpack alias を確認:

```typescript
webpack: (config) => {
  config.resolve.alias = {
    ...config.resolve.alias,
    x: join(__dirname, '../../packages/x/src/index.ts'),
  }
}
```

2. `packages/x` がビルドされているか確認:

```bash
pnpm x build
```

### View Transition が動作しない

**原因 1**: `ViewSwitchProvider` が正しく配置されていない

**解決策**: マルチビューページのルートに Provider を配置:

```tsx
<ViewSwitchProvider
  strategy={strategy}
  currentViewId={currentViewId}
  onViewChange={setCurrentViewId}
>
  {children}
</ViewSwitchProvider>
```

**原因 2**: ビュー切り替え時に `currentViewId` が更新されていない

**解決策**: `onViewChange` コールバックで状態を更新:

```tsx
const [currentViewId, setCurrentViewId] = useState(defaultView)

// ボタンクリック時
onClick = () => {
  const viewId = button.action.replace('switchView:', '')
  setCurrentViewId(viewId) // これが重要
}
```

### Tailwind CSS クラスが適用されない

**原因**: `globals.css` のインポート漏れ

**解決策**: `src/app/layout.tsx` で `globals.css` をインポート:

```tsx
import './globals.css'
```

### テスト実行時に "Cannot find module '@/components/ui/button'"

**原因**: Vitest が path alias を解決できない

**解決策**: `vitest.config.ts` に alias を追加:

```typescript
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@constraints': resolve(__dirname, './src/app/_constraints'),
    },
  },
})
```

## 実装パターン集

### 条件付きレンダリング

```tsx
export function ConditionalButton({ isVisible }: { isVisible: boolean }) {
  if (!isVisible)
    return null

  return <Button>Click me</Button>
}

// または

export function ConditionalButton({ isVisible }: { isVisible: boolean }) {
  return isVisible ? <Button>Click me</Button> : null
}
```

### 動的スタイリング (cn ユーティリティ)

```tsx
import { cn } from '@/lib/utils'

export function DynamicCard({ variant }: { variant: 'default' | 'primary' | 'destructive' }) {
  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        variant === 'primary' && 'bg-primary text-primary-foreground',
        variant === 'destructive' && 'bg-destructive text-destructive-foreground'
      )}
    >
      Content
    </div>
  )
}
```

### 配列のマップレンダリング

```tsx
export function ItemList({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  )
}
```

### イベントハンドラ

```tsx
export function InteractiveButton() {
  const handleClick = () => {
    console.log('Button clicked')
  }

  const handleHover = () => {
    console.log('Button hovered')
  }

  return (
    <Button onClick={handleClick} onMouseEnter={handleHover}>
      Hover or Click
    </Button>
  )
}
```

## デバッグのヒント

### React DevTools の活用

1. ブラウザに React DevTools をインストール
2. Components タブで状態を確認
3. Profiler タブでパフォーマンスを分析

### コンソールログ

```tsx
export function DebugComponent({ data }: { data: unknown }) {
  console.log('[DebugComponent] data:', data)

  return <div>Check console</div>
}
```

### ビルドログの確認

```bash
pnpm app:nextjs build --debug
```

### テストでデバッグ

```tsx
import { render, screen } from '@testing-library/react'

it('debugs component', () => {
  render(<MyComponent />)
  screen.debug() // DOM ツリーを出力
})
```

## パフォーマンス最適化

### 画像最適化

```tsx
import Image from 'next/image'

export function OptimizedImage() {
  return (
    <Image
      src="/images/photo.jpg"
      alt="Photo"
      width={800}
      height={600}
      priority // LCP 対象の場合
    />
  )
}
```

### コンポーネントのメモ化

```tsx
import { memo } from 'react'

interface ExpensiveComponentProps {
  data: string[]
}

export const ExpensiveComponent = memo(({
  data,
}: ExpensiveComponentProps) => {
  // 複雑な計算や重いレンダリング
  return <div>{data.join(', ')}</div>
})
```

### 動的インポート

```tsx
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('@/components/heavy-component'), {
  loading: () => <p>Loading...</p>,
})

export function LazyLoadedPage() {
  return (
    <div>
      <HeavyComponent />
    </div>
  )
}
```

## 参考実装

- **Multi-View Page**: [src/components/multi-view-page.tsx](src/components/multi-view-page.tsx)
- **View Transitions**: [src/app/\_constraints/view-transitions/](src/app/_constraints/view-transitions/)
- **Example Pages**: [src/app/(examples)/examples/](<src/app/(examples)/examples/>)
- **Page Definitions**: [definitions/pages/definition.xml](definitions/pages/definition.xml)

## 関連ドキュメント

- [開発ガイドライン (Instructions)](../../.github/instructions/app-nextjs.instructions.md) - コーディング規約とアーキテクチャパターン
- [プロジェクト仕様 (PRODUCT.md)](../../docs/PRODUCT.md) - プロジェクト全体の仕様
- [貢献ガイド (CONTRIBUTING.md)](../../docs/CONTRIBUTING.md) - セットアップと開発フロー
- [View Transitions README](src/app/_constraints/view-transitions/README.md) - View Transitions の詳細
- [Page Definitions README](definitions/pages/README.md) - ページ定義の詳細

---

**Note**: このドキュメントは実践的な開発作業を支援することを目的としています。コーディング規約やアーキテクチャの原則については、上記の関連ドキュメントを参照してください。

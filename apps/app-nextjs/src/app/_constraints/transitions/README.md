# Transitions Constraint

`definition.xml` で定義されたページとビュー構造に基づいて、アニメーション付きの遷移機能を提供するコンストレイント（制約層）です。

## 概要

このディレクトリは、`generate-pages` プロンプトで生成されるページコンポーネントに対して、以下の遷移機能を実装します：

- **ページ遷移**：異なるURLへのナビゲーション時のアニメーション
- **ビュー遷移**：同一ページ内での複数ビュー切り替え
- **複数のアニメーション戦略**：GSAPフェード、View Transition APIなどの対応

## 構成

### ディレクトリ構造

```
transitions/
├── components/          # UI コンポーネント
│   ├── transition-link.tsx    # アニメーション付きリンク
│   └── view.tsx              # ビュー表示コンポーネント
├── hooks/              # カスタムフック
│   ├── use-context.ts        # Context 関連フック
│   └── use-transition.ts      # トランジション管理フック
├── providers/          # Context Provider
│   ├── page-transition-provider.tsx      # ページ遷移管理
│   └── view-transition-provider.tsx      # ビュー遷移管理
├── strategies/         # アニメーション戦略実装
│   ├── types.ts              # 戦略インターフェース
│   ├── gsap-fade.ts          # GSAPフェード実装
│   └── view-transition-api.ts # View Transition API 実装
└── tests/              # テストファイル
```

## 主要API

### Provider コンポーネント

#### `PageTransitionProvider`

ページ遷移時（異なるURL間）のアニメーションを管理します。

```tsx
import { createFadeStrategy, PageTransitionProvider } from '@/_constraints/transitions'

export default function RootLayout({ children }) {
  return (
    <PageTransitionProvider strategy={createFadeStrategy()}>
      {children}
    </PageTransitionProvider>
  )
}
```

#### `ViewTransitionProvider`

同一ページ内での複数ビュー切り替えアニメーションを管理します。

```tsx
import { View, ViewTransitionProvider } from '@/_constraints/transitions'

export default function Page() {
  return (
    <ViewTransitionProvider strategy={createFadeStrategy()} initialViewId="view-1">
      <View id="view-1">
        <h1>View 1</h1>
      </View>
      <View id="view-2">
        <h1>View 2</h1>
      </View>
    </ViewTransitionProvider>
  )
}
```

### Hook API

#### `usePageTransitionRouter`

ページ遷移を実行するルーター関数を取得します。

```tsx
const { push, replace } = usePageTransitionRouter()
await push('/new-page')
```

#### `useViewTransition`

ビュー遷移を実行します。

```tsx
const { transitionTo, currentViewId } = useViewTransition()
await transitionTo('view-2')
```

### コンポーネント

#### `View`

指定されたIDのビューのみを表示します。`ViewTransitionProvider` 内で使用します。

```tsx
<View id="view-1">
  <YourContent />
</View>
```

#### `TransitionLink`

アニメーション付きのリンクコンポーネント。

```tsx
<TransitionLink href="/next-page">
  Next Page
</TransitionLink>
```

## アニメーション戦略

### 利用可能な戦略

#### GSAP フェード

GSAPライブラリを使用したフェードアニメーション。

```tsx
import { createFadeStrategy } from '@/_constraints/transitions'

const strategy = createFadeStrategy({
  duration: 0.3,
  ease: 'power2.inOut'
})
```

#### View Transition API

ネイティブブラウザ API（対応ブラウザのみ）。

```tsx
import { createViewTransitionStrategy } from '@/_constraints/transitions'

const strategy = createViewTransitionStrategy()
```

### カスタム戦略の実装

`ViewTransitionStrategy` インターフェースを実装することで、カスタムアニメーション戦略を作成できます。

```tsx
import type { ViewTransitionStrategy } from '@/_constraints/transitions'

class CustomStrategy implements ViewTransitionStrategy {
  async beforeTransition(context: TransitionContext): Promise<void> {
    // 遷移前の処理
  }

  async afterTransition(context: TransitionContext): Promise<void> {
    // 遷移後の処理
  }

  cleanup(): void {
    // クリーンアップ処理
  }
}
```

## `definition.xml` との連携

`definition.xml` で定義されたページ構造は、`generate-pages` プロンプトで自動生成されます。

### 定義例

```xml
<page id="examples-test-transitions" url="/examples/test-transitions/" title="Transitions">
  <views default="view-1" transition="fade">
    <view id="view-1" title="View 1">
      <button label="Go to View 2" action="to:view-2"/>
      <button label="Page 1" href="page1/"/>
    </view>
    <view id="view-2" title="View 2">
      <button label="Back" action="to:view-1"/>
    </view>
  </views>
</page>
```

### 生成されるコンポーネント構造

- `action="to:xxx"`：ビュー遷移（`useViewTransition().transitionTo()` を呼び出す）
- `href="xxx"`：ページ遷移（`usePageTransitionRouter().push()` を呼び出す）
- `transition="fade"`：使用するアニメーション戦略を指定

## テスト

ユニットテストは `tests/` ディレクトリに配置されています。

```bash
# テスト実行
pnpm test transitions
```

## 参考資料

- [Next.js App Router Navigation](https://nextjs.org/docs/app/api-reference/functions/use-router)
- [GSAP Documentation](https://gsap.com/docs/)
- [View Transition API](https://developer.chrome.com/docs/web-platform/view-transitions/)

## view-transitions

Router 遷移時のエフェクト制御を行う実験的なフィーチャーです。

- `provider.tsx` / `hook.ts`: `ViewTransitionProvider` と `useViewTransitionRouter`を提供します。`index.ts` からまとめて import できます。
- `transition-link.tsx`: クリック時に自動でエフェクト→ページ遷移を実行するリンク。

### ストラテジーによるエフェクト切替

`ViewTransitionProvider` の `strategy` prop に `ViewTransitionStrategy` を渡すことで、遷移エフェクトを差し替えられます。デフォルトでは GSAP を利用したフェードが適用されます。

```tsx
import type { ReactNode } from 'react'
import {
  createViewTransitionApiStrategy,
  ViewTransitionProvider,
} from '@constraints/view-transitions'

function Layout({ children }: { children: ReactNode }) {
  return (
    <ViewTransitionProvider strategy={createViewTransitionApiStrategy()}>
      {children}
    </ViewTransitionProvider>
  )
}
```

### 組み込みストラテジー

- `createFadeStrategy(options?)`: 既存のフェード挙動。`duration` と `ease` をカスタマイズできます。
- `createViewTransitionApiStrategy()`: View Transitions API (`document.startViewTransition`) によるネイティブ遷移。未対応ブラウザではフォールバックとして通常遷移します。

### カスタムストラテジー

`ViewTransitionStrategy` を実装すると独自エフェクトを注入できます。`beforeNavigate` で遷移前処理を行い、必要に応じて `afterEnter` で遷移後処理を実装します。

```ts
import type { ViewTransitionStrategy } from '@constraints/view-transitions'

const slideStrategy: ViewTransitionStrategy = {
  beforeNavigate: async ({ element, navigate }) => {
    // animateOut/animateIn は任意のカスタム実装
    await animateOut(element)
    navigate()
  },
  afterEnter: async ({ element }) => {
    await animateIn(element)
  },
}
```

`apps/app-nextjs/src/app/(examples)/view-transitions` にサンプルページを配置しているので、挙動を確認しながらエフェクトを調整してください。

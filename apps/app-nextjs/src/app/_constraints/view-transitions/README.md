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
  cleanup: () => {}
}
```

`apps/app-nextjs/src/app/(examples)/view-transitions` にサンプルページを配置しているので、挙動を確認しながらエフェクトを調整してください。

## View Transitions Enhancement Plan

### ステップ 1: 要件定義

- **Viewトランジションの要件**: ページ内のview単位でのトランジションをサポートするための要件を定義します。
- **ユーザーストーリー**: ユーザーが異なるview間でスムーズなトランジションを体験できることを確認します。

### ステップ 2: テストフレームワークの設定

- プロジェクトにテストフレームワークが設定されていることを確認します。

### ステップ 3: 初期テストの作成

- ページ遷移のベースラインを先に作成し、その上でフェード戦略の挙動を検証します。
- 追加したテスト:
  - [**tests**/provider-and-hook.test.tsx](src/app/_constraints/view-transitions/__tests__/provider-and-hook.test.tsx): `push`/`replace`の単一起動と完了後ナビゲーション。
  - [**tests**/transition-link.test.tsx](src/app/_constraints/view-transitions/__tests__/transition-link.test.tsx): クリック→演出→`router.push`、修飾キー時は演出を起動しない。
  - [**tests**/fade-strategy.test.ts](src/app/_constraints/view-transitions/__tests__/fade-strategy.test.ts): `createFadeStrategy`の`beforeNavigate`/`afterEnter`が正しく解決すること。
- モック: `next/navigation`（`useRouter`/`usePathname`）、`gsap`（`to`）、`document.startViewTransition`（存在・非存在切替は後続）。
- 設定: [vitest.config.ts](vitest.config.ts)（`environment: jsdom`、PostCSS無効化）、[vitest.setup.ts](vitest.setup.ts)（`jest-dom`/DOMギャップ）。

### ステップ 4: Viewトランジションロジックの実装

- `layout.tsx`を更新し、viewトランジションを処理する新しいコンポーネントを作成します。

### ステップ 5: テストの実行

- ステップ3で作成したテストを実行し、失敗することを確認します。

### ステップ 6: リファクタリングと最適化

- テストが通過した後、コードを見直し、改善点を探します。

### ステップ 7: ドキュメントの更新

- 新機能をREADMEファイルやコード内のコメントで文書化します。

### ステップ 8: レビューとマージ

- 変更をレビューに提出し、すべてのテストが通過していることを確認します。

# pages definition

定義(pages/definition.xml)を元に、実ページにskeletonをつくる。

## 概要

- `definition.xml`: ページ構造とビュー定義をXMLで管理
- 型生成スクリプト: XMLから自動的にTypeScript型を生成
- マルチビューページ: ページ内でビューの切り替え（クライアント側での状態管理）に対応
- `ViewTransition`: ページ間遷移とビュー切り替えで同じトランザクション戦略を流用可能

## 使用方法

### 1. definition.xmlにページを定義

```xml
<!-- マルチビューページ -->
<page id="page-name" url="/path/" title="Title"
      defaultView="view-id" viewTransition="fade">
  <view id="view-id" name="View Name" title="View Title">
    <button label="Action" action="switchView:other-view-id"/>
  </view>
  <view id="other-view-id" name="Other View" title="Other Title">
    <button label="Back" action="switchView:view-id"/>
  </view>
</page>

<!-- 外部ナビゲーションページ -->
<page id="page1" url="/examples/page-mockup/page1/" title="Page 1">
  <button label="Back" href="../"/>
</page>
```

### 2. 型定義を生成

```bash
pnpm generate:pages
```

自動的に `src/lib/page-definitions.generated.ts` が生成されます。

### 3. ページを実装

```tsx
import { MultiViewPage } from '@/components/multi-view-page'
import { PAGE_DEFINITIONS } from '@/lib/page-definitions.generated'

export default function Page() {
  const pageDefinition = PAGE_DEFINITIONS['page-name']
  return <MultiViewPage pageDefinition={pageDefinition} />
}
```

## スキーマ

### page 要素

| 属性           | 必須 | 説明                                              |
| -------------- | ---- | ------------------------------------------------- |
| id             | ○    | ページID                                          |
| url            | ○    | ページURL                                         |
| title          |      | ページタイトル                                    |
| defaultView    |      | 初期表示ビューID（マルチビューページ）            |
| viewTransition |      | ビュー切り替えのトランザクション戦略（fade など） |

### view 要素（マルチビューページ内）

| 属性  | 必須 | 説明           |
| ----- | ---- | -------------- |
| id    | ○    | ビューID       |
| name  | ○    | ビュー名       |
| title |      | ビュータイトル |

### button 要素

| 属性   | 必須 | 説明                                                |
| ------ | ---- | --------------------------------------------------- |
| label  | ○    | ボタンラベル                                        |
| action |      | アクション（`switchView:view-id` でビュー切り替え） |
| href   |      | リンク先URL                                         |

## View Transition戦略

カスタムトランザクション戦略を実装可能：

```tsx
import type { ViewTransitionStrategy } from '@constraints/view-transitions'
import { ViewSwitchProvider } from '@constraints/view-transitions'

const customStrategy: ViewTransitionStrategy = {
  beforeSwitchView: async ({ container }) => {
    // アニメーション開始
  },
  afterSwitchView: async ({ container }) => {
    // アニメーション終了
  },
  cleanup: () => {},
}

// <ViewSwitchProvider strategy={customStrategy} ...>
//   {/* ... */}
// </ViewSwitchProvider>
```

## ToDos

- [x] XML定義でマルチビューページに対応
- [x] ページ内ビュー切り替え機能実装
- [x] View Transitionをカスタマイズ可能に
- [ ] より複雑なページ構造への対応（ネストされたビューなど）
- [ ] UIプレビュー機能

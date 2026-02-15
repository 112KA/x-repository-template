---
name: generate-pages
description: definition.xmlの定義に基づいてNext.jsのページをシンプルな指示から生成
---

# generate pages

## 目的

`apps/app-nextjs/definitions/pages/definition.xml`に定義されたページ構造に基づいて、実装されたページコンポーネントを生成する。

## 使用方法

次のような短い指示でページ生成を実行：

```
definition.xmlに従ってpageをつくって
```

## 前提条件

- `definition.xml`が既に存在し、ページの構造が定義されている
- 生成対象のページIDが明記されている（指定がない場合は全ページ生成）
- Next.js 15.x、TypeScript 5.xの開発環境が整備されている

## 生成時の処理フロー

1. **定義ファイルの解析**：`definition.xml`を読み込み、ページ定義を抽出
   - page要素のID、url、title
   - 各viewの構造とコンポーネント
   - アクション・遷移定義

2. **ファイル構造の準備**：`apps/app-nextjs/src/app/` 配下に必要なディレクトリを作成

3. **コンポーネント生成**：
   - layout.tsx：ページレイアウト
   - page.tsx：ページコンポーネント
   - 必要に応じてViewコンポーネント

4. **スタイル・機能実装**：
   - Tailwind CSSを使用したスタイリング
   - 状態管理（必要に応じて）
   - トランジション・アニメーション対応

## 注意点

- Next.jsのAppRouterを使用した実装
- TypeScript型安全性の確保
- `.serena/memories/`の開発ガイドラインに従う
- 既存のデザインシステム・コンポーネントを活用

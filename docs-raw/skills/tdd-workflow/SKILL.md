---
name: tdd-workflow
description: Use this skill when writing new features, fixing bugs, or refactoring code. Enforces test-driven development with 80%+ coverage including unit, integration, and E2E tests.
---

# Test-Driven Development Workflow

このスキルは、すべてのコード開発が包括的なテストカバレッジを伴うTDDの原則に従っていることを保証します。

## 有効化のタイミング

* 新機能または機能の実装時
* バグまたは問題の修正時
* 既存コードのリファクタリング時
* APIエンドポイントの追加時
* 新しいコンポーネントの作成時

## コア原則

### 1. コードの前にテストを

常に最初にテストを書き、その後テストに合格するようにコードを実装します。

### 2. カバレッジ要件

* 最小80%のカバレッジ（ユニット + 統合 + E2E）
* すべてのエッジケースを網羅
* エラーシナリオのテスト
* 境界条件の検証

### 3. テストの種類

#### ユニットテスト (Unit Tests)

* 個別の関数やユーティリティ
* コンポーネントのロジック
* 純粋関数
* ヘルパー

#### 統合テスト (Integration Tests)

* APIエンドポイント
* データベース操作
* サービス間の相互作用
* 外部APIの呼び出し

#### E2Eテスト (Playwright)

* 重要なユーザーフロー
* 完全なワークフロー
* ブラウザ自動化
* UI操作

## TDDワークフローの手順

### ステップ 1: ユーザージャーニーの記述

```
[役割] として、[利益] のために [アクション] したい。

例：
ユーザーとして、正確なキーワードがなくても関連市場を見つけられるよう、
市場を意味的に検索したい。

```

### ステップ 2: テストケースの生成

各ユーザージャーニーに対して包括的なテストケースを作成します。

```typescript
describe('セマンティック検索', () => {
  it('クエリに対して関連する市場を返す', async () => {
    // テスト実装
  })

  it('空のクエリを適切に処理する', async () => {
    // エッジケースのテスト
  })

  it('Redisが利用不可の場合、部分一致検索にフォールバックする', async () => {
    // フォールバック挙動のテスト
  })
})

```

### ステップ 3: テストの実行（失敗することを確認）

```bash
npm test
# まだ実装していないため、テストは失敗するはずです

```

### ステップ 4: コードの実装

テストに合格するための最小限のコードを書きます。

### ステップ 5: テストの再実行

```bash
npm test
# テストがパス（緑）になるはずです

```

### ステップ 6: リファクタリング

テストがパスした状態を維持しながら、コードの品質を向上させます。

* 重複の削除
* 命名の改善
* パフォーマンスの最適化
* 可読性の向上

### ステップ 7: カバレッジの確認

```bash
npm run test:coverage
# 80%以上のカバレッジが達成されているか確認します

```

## テストファイル構成

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx      # ユニットテスト
│   │   └── Button.stories.tsx   # Storybook
├── app/
│   └── api/
│       └── markets/
│           ├── route.ts
│           └── route.test.ts    # 統合テスト
└── e2e/
    ├── markets.spec.ts          # E2Eテスト

```

## よくある間違いと対策

### ❌ 誤り: 実装の詳細をテストする

```typescript
// 内部状態をテストしてはいけない
expect(component.state.count).toBe(5)

```

### ✅ 正解: ユーザーに見える挙動をテストする

```typescript
// ユーザーが見るものをテストする
expect(screen.getByText('カウント: 5')).toBeInTheDocument()

```

### ❌ 誤り: 壊れやすいセレクタ

```typescript
await page.click('.css-class-xyz')

```

### ✅ 正解: 意味的なセレクタ

```typescript
await page.click('button:has-text("送信")')
await page.click('[data-testid="submit-button"]')

```

---

**忘れないでください**: テストはオプションではありません。自信を持ったリファクタリング、迅速な開発、そして本番環境の信頼性を支える安全網です。
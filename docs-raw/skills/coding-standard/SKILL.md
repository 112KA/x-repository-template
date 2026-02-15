---
name: coding-standards
description: Universal coding standards, best practices, and patterns for TypeScript, JavaScript, React, and Node.js development.
---

# Coding Standards & Best Practices

すべてのプロジェクトに適用可能なユニバーサルなコーディング標準。

## コード品質の原則

### 1. 読みやすさ優先

- コードは書かれる時間よりも読まれる時間の方が長い。
- 変数名と関数名を明確にする。
- コメントよりも自己文書化されたコードを優先する。
- 一貫したフォーマットを保つ。

### 2. KISS (Keep It Simple, Stupid)

- 動作する最も単純な解決策を選ぶ。
- オーバーエンジニアリングを避ける。
- 時期尚早な最適化を行わない。
- 「賢いコード」よりも「理解しやすいコード」を優先する。

### 3. DRY (Don't Repeat Yourself)

- 共通のロジックを関数に抽出する。
- 再利用可能なコンポーネントを作成する。
- モジュール間でユーティリティを共有する。
- コピペによるプログラミングを避ける。

### 4. YAGNI (You Aren't Gonna Need It)

- 必要になるまで機能を構築しない。
- 推測による汎用化を避ける。
- 複雑さは必要な場合にのみ追加する。
- シンプルに開始し、必要に応じてリファクタリングする。

## TypeScript/JavaScript 標準

### 変数名

```typescript
// ✅ 良い例: 説明的な名前
const marketSearchQuery = 'election'
const isUserAuthenticated = true
const totalRevenue = 1000

// ❌ 悪い例: 不明瞭な名前
const q = 'election'
const flag = true
const x = 1000
```

### 関数名

```typescript
// ✅ 良い例: 動詞-名詞パターン
async function fetchMarketData(marketId: string) { }
function calculateSimilarity(a: number[], b: number[]) { }
function isValidEmail(email: string): boolean { }

// ❌ 悪い例: 不明瞭または名詞のみ
async function market(id: string) { }
function similarity(a, b) { }
function email(e) { }
```

### 不変性（イミュータビリティ）パターン (重要)

```typescript
// ✅ 常にスプレッド演算子を使用する
const updatedUser = {
  ...user,
  name: 'New Name'
}

const updatedArray = [...items, newItem]

// ❌ 直接変更（ミューテート）しない
user.name = 'New Name' // 悪い例
items.push(newItem) // 悪い例
```

### エラーハンドリング

```typescript
// ✅ 良い例: 包括的なエラーハンドリング
async function fetchData(url: string) {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  }
  catch (error) {
    console.error('Fetch failed:', error)
    throw new Error('Failed to fetch data')
  }
}

// ❌ 悪い例: エラーハンドリングなし
async function fetchData(url) {
  const response = await fetch(url)
  return response.json()
}
```

### Async/Await のベストプラクティス

```typescript
// ✅ 良い例: 可能な場合は並列実行する
const [users, markets, stats] = await Promise.all([
  fetchUsers(),
  fetchMarkets(),
  fetchStats()
])

// ❌ 悪い例: 不必要に逐次実行する
const users = await fetchUsers()
const markets = await fetchMarkets()
const stats = await fetchStats()
```

### 型の安全性

```typescript
// ✅ 良い例: 適切な型定義
interface Market {
  id: string
  name: string
  status: 'active' | 'resolved' | 'closed'
  created_at: Date
}

function getMarket(id: string): Promise<Market> {
  // 実装
}

// ❌ 悪い例: 'any' を使用する
function getMarket(id: any): Promise<any> {
  // 実装
}
```

## React ベストプラクティス

### コンポーネント構造

```typescript
// ✅ 良い例: 型定義付きの関数コンポーネント
interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}

export function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary'
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  )
}

// ❌ 悪い例: 型がなく、構造が不明瞭
export function Button(props) {
  return <button onClick={props.onClick}>{props.children}</button>
}

```

### カスタムフック

```typescript
// ✅ 良い例: 再利用可能なカスタムフック
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

// 使用例
const debouncedQuery = useDebounce(searchQuery, 500)
```

### 状態管理

```typescript
// ✅ 良い例: 適切な状態更新
const [count, setCount] = useState(0)

// 前の状態に基づいた関数型アップデート
setCount(prev => prev + 1)

// ❌ 悪い例: 状態の直接参照
setCount(count + 1) // 非同期シナリオで古い値になる可能性がある
```

### 条件付きレンダリング

```typescript
// ✅ 良い例: 明確な条件付きレンダリング
{isLoading && <Spinner />}
{error && <ErrorMessage error={error} />}
{data && <DataDisplay data={data} />}

// ❌ 悪い例: 三項演算子の入れ子（地獄）
{isLoading ? <Spinner /> : error ? <ErrorMessage error={error} /> : data ? <DataDisplay data={data} /> : null}

```

## API 設計標準

### REST API の慣習

```
GET    /api/markets              # すべてのマーケットを一覧表示
GET    /api/markets/:id          # 特定のマーケットを取得
POST   /api/markets              # 新しいマーケットを作成
PUT    /api/markets/:id          # マーケットを更新（全体）
PATCH  /api/markets/:id          # マーケットを更新（一部）
DELETE /api/markets/:id          # マーケットを削除

# フィルタリング用のクエリパラメータ
GET /api/markets?status=active&limit=10&offset=0

```

### レスポンス形式

```typescript
// ✅ 良い例: 一貫したレスポンス構造
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total: number
    page: number
    limit: number
  }
}

// 成功レスポンス
return NextResponse.json({
  success: true,
  data: markets,
  meta: { total: 100, page: 1, limit: 10 }
})

// エラーレスポンス
return NextResponse.json({
  success: false,
  error: 'Invalid request'
}, { status: 400 })
```

### 入力バリデーション

```typescript
import { z } from 'zod'

// ✅ 良い例: スキーマバリデーション
const CreateMarketSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  endDate: z.string().datetime(),
  categories: z.array(z.string()).min(1)
})

export async function POST(request: Request) {
  const body = await request.json()

  try {
    const validated = CreateMarketSchema.parse(body)
    // バリデーション済みデータで処理を進める
  }
  catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      }, { status: 400 })
    }
  }
}
```

## ファイル構成

### プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API ルート
│   ├── markets/           # マーケットページ
│   └── (auth)/           # 認証ページ (ルートグループ)
├── components/            # React コンポーネント
│   ├── ui/               # 汎用 UI コンポーネント
│   ├── forms/            # フォームコンポーネント
│   └── layouts/          # レイアウトコンポーネント
├── hooks/                # カスタム React フック
├── lib/                  # ユーティリティと設定
│   ├── api/             # API クライアント
│   ├── utils/           # ヘルパー関数
│   └── constants/       # 定数
├── types/                # TypeScript 型定義
└── styles/              # グローバルスタイル

```

### ファイル命名

```
components/Button.tsx          # コンポーネントは PascalCase
hooks/useAuth.ts              # 'use' プレフィックス付きの camelCase
lib/formatDate.ts             # ユーティリティは camelCase
types/market.types.ts         # .types サフィックス付きの camelCase

```

## コメントとドキュメンテーション

### コメントを書くタイミング

```typescript
// ✅ 良い例: 「何」ではなく「なぜ」を説明する
// 障害発生時に API に負荷をかけすぎないよう、エクスポネンシャルバックオフを使用する
const delay = Math.min(1000 * 2 ** retryCount, 30000)

// 巨大な配列に対するパフォーマンスのため、ここでは意図的にミューテーション（直接変更）を使用している
items.push(newItem)

// ❌ 悪い例: 見ればわかることを説明する
// カウンターを1増やす
count++

// 名前をユーザーの名前に設定する
name = user.name
```

### パブリック API のための JSDoc

````typescript
/**
 * 意味的な類似性を使用してマーケットを検索します。
 *
 * @param query - 自然言語による検索クエリ
 * @param limit - 最大結果数（デフォルト：10）
 * @returns 類似度スコアでソートされたマーケットの配列
 * @throws {Error} OpenAI API の失敗または Redis が利用不能な場合
 *
 * @example
 * ```typescript
 * const results = await searchMarkets('election', 5)
 * console.log(results[0].name) // "Trump vs Biden"
 * ```
 */
export async function searchMarkets(
  query: string,
  limit: number = 10
): Promise<Market[]> {
  // 実装
}
````

## パフォーマンスのベストプラクティス

### メモ化

```typescript
import { useCallback, useMemo } from 'react'

// ✅ 良い例: 高負荷な計算をメモ化する
const sortedMarkets = useMemo(() => {
  return markets.sort((a, b) => b.volume - a.volume)
}, [markets])

// ✅ 良い例: コールバックをメモ化する
const handleSearch = useCallback((query: string) => {
  setSearchQuery(query)
}, [])
```

### 遅延読み込み (Lazy Loading)

```typescript
import { lazy, Suspense } from 'react'

// ✅ 良い例: 重いコンポーネントを遅延読み込みする
const HeavyChart = lazy(() => import('./HeavyChart'))

export function Dashboard() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyChart />
    </Suspense>
  )
}

```

### データベースクエリ

```typescript
// ✅ 良い例: 必要なカラムのみを選択する
const { data } = await supabase
  .from('markets')
  .select('id, name, status')
  .limit(10)

// ❌ 悪い例: すべてを選択する
const { data } = await supabase
  .from('markets')
  .select('*')
```

## テスト標準

### テスト構造 (AAA パターン)

```typescript
test('calculates similarity correctly', () => {
  // Arrange (準備)
  const vector1 = [1, 0, 0]
  const vector2 = [0, 1, 0]

  // Act (実行)
  const similarity = calculateCosineSimilarity(vector1, vector2)

  // Assert (検証)
  expect(similarity).toBe(0)
})
```

### テストの命名

```typescript
// ✅ 良い例: 説明的なテスト名
test('returns empty array when no markets match query', () => { })
test('throws error when OpenAI API key is missing', () => { })
test('falls back to substring search when Redis unavailable', () => { })

// ❌ 悪い例: 曖昧なテスト名
test('works', () => { })
test('test search', () => { })
```

## コードの「不吉な臭い（Code Smell）」の検出

以下のアンチパターンに注意してください：

### 1. 長すぎる関数

```typescript
// ❌ 悪い例: 50行を超える関数
function processMarketData() {
  // 100行のコード
}

// ✅ 良い例: 小さな関数に分割する
function processMarketData() {
  const validated = validateData()
  const transformed = transformData(validated)
  return saveData(transformed)
}
```

### 2. 深いネスト

```typescript
// ❌ 悪い例: 5レベル以上のネスト
if (user) {
  if (user.isAdmin) {
    if (market) {
      if (market.isActive) {
        if (hasPermission) {
          // 何らかの処理
        }
      }
    }
  }
}

// ✅ 良い例: 早期リターン
if (!user)
  return
if (!user.isAdmin)
  return
if (!market)
  return
if (!market.isActive)
  return
if (!hasPermission)
  return

// 何らかの処理
```

### 3. マジックナンバー

```typescript
// ❌ 悪い例: 説明のない数字
if (retryCount > 3) { }
setTimeout(callback, 500)

// ✅ 良い例: 名前付き定数
const MAX_RETRIES = 3
const DEBOUNCE_DELAY_MS = 500

if (retryCount > MAX_RETRIES) { }
setTimeout(callback, DEBOUNCE_DELAY_MS)
```

**忘れないでください**: コードの品質に妥協の余地はありません。明確で保守しやすいコードこそが、迅速な開発と自信を持ったリファクタリングを可能にします。

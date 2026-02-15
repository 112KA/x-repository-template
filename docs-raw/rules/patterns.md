# Common Patterns

## API レスポンス形式

```typescript
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

```

## カスタム Hook パターン

```typescript
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

```

## リポジトリパターン

```typescript
interface Repository<T> {
  findAll(filters?: Filters): Promise<T[]>
  findById(id: string): Promise<T | null>
  create(data: CreateDto): Promise<T>
  update(id: string, data: UpdateDto): Promise<T>
  delete(id: string): Promise<void>
}

```

## ボイラープレート（骨格プロジェクト）

新機能を実装する際：

1. 実戦で検証済みのボイラープレートを検索する
2. 並列エージェントを使用してオプションを評価する：
- セキュリティ評価
- 拡張性分析
- 関連性スコアリング
- 実装計画


3. 最も適したものをベースとして複製する
4. 検証済みの構造内でイテレーション（反復開発）を行う
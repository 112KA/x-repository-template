---
name: security-review
description: Use this skill when adding authentication, handling user input, working with secrets, creating API endpoints, or implementing payment/sensitive features. Provides comprehensive security checklist and patterns.
---

# Security Review Skill

このスキルは、認証の追加、ユーザー入力の処理、シークレットの管理、APIエンドポイントの作成、または決済や機密機能の実装時に、すべてのコードがセキュリティのベストプラクティスに従っていることを確認し、潜在的な脆弱性を特定します。

## 有効化のタイミング

* 認証または認可の実装時
* ユーザー入力またはファイルアップロードの処理時
* 新しいAPIエンドポイントの作成時
* シークレットや認証情報の取り扱い時
* 決済機能の実装時
* 機密データの保存または送信時
* サードパーティAPIの統合時

## セキュリティチェックリスト

### 1. シークレット管理

#### ❌ 禁止事項

```typescript
const apiKey = "sk-proj-xxxxx"  // ハードコードされたシークレット
const dbPassword = "password123" // ソースコード内のパスワード

```

#### ✅ 推奨事項

```typescript
const apiKey = process.env.OPENAI_API_KEY
const dbUrl = process.env.DATABASE_URL

// シークレットの存在を確認
if (!apiKey) {
  throw new Error('OPENAI_API_KEYが設定されていません')
}

```

#### 検証ステップ

* [ ] APIキー、トークン、パスワードがハードコードされていないか
* [ ] すべてのシークレットが環境変数にあるか
* [ ] `.env.local` が .gitignore に含まれているか
* [ ] gitの履歴にシークレットが含まれていないか
* [ ] 本番用シークレットがホスティングプラットフォーム（Vercel、Railwayなど）に設定されているか

### 2. 入力バリデーション

#### 常にユーザー入力を検証する

```typescript
import { z } from 'zod'

// バリデーションスキーマの定義
const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  age: z.number().int().min(0).max(150)
})

// 処理前に検証
export async function createUser(input: unknown) {
  try {
    const validated = CreateUserSchema.parse(input)
    return await db.users.create(validated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors }
    }
    throw error
  }
}

```

#### ファイルアップロードのバリデーション

```typescript
function validateFileUpload(file: File) {
  // サイズチェック (最大5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('ファイルが大きすぎます (最大5MB)')
  }

  // タイプチェック
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('無効なファイル形式です')
  }

  // 拡張子チェック
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']
  const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0]
  if (!extension || !allowedExtensions.includes(extension)) {
    throw new Error('無効な拡張子です')
  }

  return true
}

```

#### 検証ステップ

* [ ] すべてのユーザー入力がスキーマで検証されているか
* [ ] ファイルアップロードが制限されているか（サイズ、タイプ、拡張子）
* [ ] クエリ内でユーザー入力が直接使用されていないか
* [ ] ホワイトリスト形式のバリデーションを行っているか（ブラックリストではなく）
* [ ] エラーメッセージに機密情報が漏洩していないか

### 3. SQLインジェクション対策

#### ❌ SQLの結合をしない

```typescript
// 危険 - SQLインジェクションの脆弱性
const query = `SELECT * FROM users WHERE email = '${userEmail}'`
await db.query(query)

```

#### ✅ パラメータ化クエリを使用する

```typescript
// 安全 - パラメータ化クエリ
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', userEmail)

// または生のSQLの場合
await db.query(
  'SELECT * FROM users WHERE email = $1',
  [userEmail]
)

```

#### 検証ステップ

* [ ] すべてのデータベースクエリでパラメータ化クエリが使用されているか
* [ ] SQL内での文字列結合がないか
* [ ] ORM/クエリビルダーが正しく使用されているか
* [ ] Supabaseのクエリが適切にサニタイズされているか

### 4. 認証と認可

#### JWTトークンの取り扱い

```typescript
// ❌ 誤り: localStorage (XSSに対して脆弱)
localStorage.setItem('token', token)

// ✅ 正解: httpOnly クッキー
res.setHeader('Set-Cookie',
  `token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`)

```

#### 認可チェック

```typescript
export async function deleteUser(userId: string, requesterId: string) {
  // 常に最初に認可を検証
  const requester = await db.users.findUnique({
    where: { id: requesterId }
  })

  if (requester.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 403 }
    )
  }

  // 削除処理へ進む
  await db.users.delete({ where: { id: userId } })
}

```

#### 行レベルセキュリティ (Supabase RLS)

```sql
-- すべてのテーブルでRLSを有効にする
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のデータのみ閲覧可能
CREATE POLICY "Users view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- ユーザーは自分のデータのみ更新可能
CREATE POLICY "Users update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

```

#### 検証ステップ

* [ ] トークンが httpOnly クッキーに保存されているか（localStorage ではないか）
* [ ] 機密性の高い操作の前に認可チェックが行われているか
* [ ] SupabaseでRLSが有効になっているか
* [ ] ロールベースのアクセス制御（RBAC）が実装されているか
* [ ] セッション管理が安全か

### 5. XSS対策

#### HTMLのサニタイズ

```typescript
import DOMPurify from 'isomorphic-dompurify'

// ユーザー提供のHTMLは常にサニタイズする
function renderUserContent(html: string) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p'],
    ALLOWED_ATTR: []
  })
  return <div dangerouslySetInnerHTML={{ __html: clean }} />
}

```

#### コンテンツセキュリティポリシー (CSP)

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self';
      connect-src 'self' https://api.example.com;
    `.replace(/\s{2,}/g, ' ').trim()
  }
]

```

#### 検証ステップ

* [ ] ユーザー提供のHTMLがサニタイズされているか
* [ ] CSPヘッダーが設定されているか
* [ ] 未検証の動的コンテンツレンダリングがないか
* [ ] Reactの標準的なXSS保護機能が活用されているか

### 6. CSRF対策

#### CSRFトークン

```typescript
import { csrf } from '@/lib/csrf'

export async function POST(request: Request) {
  const token = request.headers.get('X-CSRF-Token')

  if (!csrf.verify(token)) {
    return NextResponse.json(
      { error: 'Invalid CSRF token' },
      { status: 403 }
    )
  }

  // 処理を実行
}

```

#### SameSite クッキー

```typescript
res.setHeader('Set-Cookie',
  `session=${sessionId}; HttpOnly; Secure; SameSite=Strict`)

```

#### 検証ステップ

* [ ] 状態を変更する操作にCSRFトークンがあるか
* [ ] すべてのクッキーに SameSite=Strict が設定されているか
* [ ] 二重送信クッキーパターンなどが実装されているか

### 7. レート制限

#### APIレート制限

```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100, // ウィンドウ内で100リクエストまで
  message: 'リクエストが多すぎます'
})

// ルートに適用
app.use('/api/', limiter)

```

#### 高負荷な操作

```typescript
// 検索などには厳しめの制限を適用
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1分
  max: 10, // 1分間に10リクエストまで
  message: '検索リクエストが多すぎます'
})

app.use('/api/search', searchLimiter)

```

#### 検証ステップ

* [ ] すべてのAPIエンドポイントにレート制限があるか
* [ ] 負荷の高い操作に厳格な制限があるか
* [ ] IPベースのレート制限があるか
* [ ] 認証済みユーザーベースのレート制限があるか

### 8. 機密データの露出

#### ロギング

```typescript
// ❌ 誤り: 機密データのログ出力
console.log('User login:', { email, password })
console.log('Payment:', { cardNumber, cvv })

// ✅ 正解: 機密データの削除・マスク
console.log('User login:', { email, userId })
console.log('Payment:', { last4: card.last4, userId })

```

#### エラーメッセージ

```typescript
// ❌ 誤り: 内部詳細の露出
catch (error) {
  return NextResponse.json(
    { error: error.message, stack: error.stack },
    { status: 500 }
  )
}

// ✅ 正解: 汎用的なエラーメッセージ
catch (error) {
  console.error('Internal error:', error)
  return NextResponse.json(
    { error: 'エラーが発生しました。もう一度お試しください。' },
    { status: 500 }
  )
}

```

#### 検証ステップ

* [ ] ログにパスワード、トークン、シークレットが含まれていないか
* [ ] ユーザーへのエラーメッセージが汎用的か
* [ ] 詳細なエラーはサーバーログのみに出力されているか
* [ ] スタックトレースがユーザーに露出していないか

### 9. ブロックチェーンセキュリティ (Solana)

#### ウォレット所有権の検証

```typescript
import { verify } from '@solana/web3.js'

async function verifyWalletOwnership(
  publicKey: string,
  signature: string,
  message: string
) {
  try {
    const isValid = verify(
      Buffer.from(message),
      Buffer.from(signature, 'base64'),
      Buffer.from(publicKey, 'base64')
    )
    return isValid
  } catch (error) {
    return false
  }
}

```

#### 検証ステップ

* [ ] ウォレットの署名が検証されているか
* [ ] トランザクションの詳細が妥当か
* [ ] トランザクション前に残高チェックが行われているか
* [ ] ブラインド署名（内容不明の署名）をさせていないか

### 10. 依存関係のセキュリティ

#### 定期的なアップデート

```bash
# 脆弱性のチェック
npm audit

# 自動修正可能な問題の修正
npm audit fix

# パッケージの更新
npm update

```

#### 検証ステップ

* [ ] 依存関係が最新か
* [ ] 既知の脆弱性がないか（npm audit clean）
* [ ] ロックファイルがコミットされているか
* [ ] GitHubのDependabotなどが有効か

---

**注意**: セキュリティはオプションではありません。一つの脆弱性がプラットフォーム全体を危険にさらす可能性があります。疑わしい場合は、常に安全な側に倒して判断してください。
---
name: project-guidelines-example
description: This is an example of a project-specific skill. Use this as a template for your own projects.
---
実在するプロダクションアプリケーションに基づいています: [Zenith](https://zenith.chat) - AIを活用した顧客発見プラットフォーム。

# Project Guidelines Skill (Example)

## 使用タイミング

設計された特定のプロジェクトで作業する際に、このスキルを参照してください。プロジェクトスキルには以下が含まれます：

* アーキテクチャの概要
* ファイル構造
* コードパターン
* テスト要件
* デプロイワークフロー

---

## アーキテクチャの概要

**技術スタック:**

* **フロントエンド**: Next.js 15 (App Router), TypeScript, React
* **バックエンド**: FastAPI (Python), Pydantic モデル
* **データベース**: Supabase (PostgreSQL)
* **AI**: Claude API (ツール呼び出しと構造化出力)
* **デプロイ**: Google Cloud Run
* **テスト**: Playwright (E2E), pytest (バックエンド), React Testing Library

**サービス構成:**

```
┌─────────────────────────────────────────────────────────────┐
│                        フロントエンド                         │
│   Next.js 15 + TypeScript + TailwindCSS                     │
│   デプロイ先: Vercel / Cloud Run                             │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                        バックエンド                          │
│   FastAPI + Python 3.11 + Pydantic                          │
│   デプロイ先: Cloud Run                                      │
└─────────────────────────────────────────────────────────────┘
                               │
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
          ┌──────────┐    ┌──────────┐    ┌──────────┐
          │ Supabase │    │  Claude  │    │  Redis   │
          │ Database │    │   API    │    │  Cache   │
          └──────────┘    └──────────┘    └──────────┘

```

---

## ファイル構造

```
project/
├── frontend/
│   └── src/
│       ├── app/               # Next.js App Router ページ
│       │   ├── api/           # API ルート
│       │   ├── (auth)/        # 認証保護ルート
│       │   └── workspace/     # メインアプリのワークスペース
│       ├── components/        # React コンポーネント
│       │   ├── ui/            # ベース UI コンポーネント
│       │   ├── forms/         # フォームコンポーネント
│       │   └── layouts/       # レイアウトコンポーネント
│       ├── hooks/             # カスタム React フック
│       ├── lib/               # ユーティリティ
│       ├── types/             # TypeScript 定義
│       └── config/            # 設定
│
├── backend/
│   ├── routers/               # FastAPI ルートハンドラー
│   ├── models.py              # Pydantic モデル
│   ├── main.py                # FastAPI アプリのエントリポイント
│   ├── auth_system.py         # 認証システム
│   ├── database.py            # データベース操作
│   ├── services/              # ビジネスロジック
│   └── tests/                 # pytest テスト
│
├── deploy/                    # デプロイ設定
├── docs/                      # ドキュメント
└── scripts/                   # ユーティリティスクリプト

```

---

## コードパターン

### API レスポンス形式 (FastAPI)

```python
from pydantic import BaseModel
from typing import Generic, TypeVar, Optional

T = TypeVar('T')

class ApiResponse(BaseModel, Generic[T]):
    success: bool
    data: Optional[T] = None
    error: Optional[str] = None

    @classmethod
    def ok(cls, data: T) -> "ApiResponse[T]":
        return cls(success=True, data=data)

    @classmethod
    def fail(cls, error: str) -> "ApiResponse[T]":
        return cls(success=False, error=error)

```

### フロントエンド API 呼び出し (TypeScript)

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` }
    }

    return await response.json()
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

```

### Claude AI 統合 (構造化出力)

```python
from anthropic import Anthropic
from pydantic import BaseModel

class AnalysisResult(BaseModel):
    summary: str
    key_points: list[str]
    confidence: float

async def analyze_with_claude(content: str) -> AnalysisResult:
    client = Anthropic()

    response = client.messages.create(
        model="claude-sonnet-4-5-20250514",
        max_tokens=1024,
        messages=[{"role": "user", "content": content}],
        tools=[{
            "name": "provide_analysis",
            "description": "構造化された分析を提供します",
            "input_schema": AnalysisResult.model_json_schema()
        }],
        tool_choice={"type": "tool", "name": "provide_analysis"}
    )

    # ツール使用の結果を抽出
    tool_use = next(
        block for block in response.content
        if block.type == "tool_use"
    )

    return AnalysisResult(**tool_use.input)

```

---

## テスト要件

### バックエンド (pytest)

```bash
# すべてのテストを実行
poetry run pytest tests/

# カバレッジ付きで実行
poetry run pytest tests/ --cov=. --cov-report=html

# 特定のテストファイルを実行
poetry run pytest tests/test_auth.py -v

```

### フロントエンド (React Testing Library)

```bash
# テストを実行
npm run test

# E2E テストを実行
npm run test:e2e

```

---

## デプロイワークフロー

### デプロイ前チェックリスト

* [ ] ローカルですべてのテストがパスしている
* [ ] `npm run build` が成功する（フロントエンド）
* [ ] `poetry run pytest` がパスする（バックエンド）
* [ ] シークレットがハードコードされていない
* [ ] 環境変数がドキュメント化されている
* [ ] データベースマイグレーションの準備ができている

### デプロイコマンド

```bash
# フロントエンドのビルドとデプロイ
cd frontend && npm run build
gcloud run deploy frontend --source .

# バックエンドのビルドとデプロイ
cd backend
gcloud run deploy backend --source .

```

---

## 重要なルール

1. **絵文字禁止**: コード、コメント、ドキュメントに絵文字を使用しない
2. **不変性 (Immutability)**: オブジェクトや配列を直接変更しない
3. **TDD**: 実装前にテストを書く
4. **カバレッジ 80%** 以上を維持
5. **ファイルを小さく保つ**: 通常 200-400 行、最大 800 行
6. **console.log 禁止**: プロダクションコードに残さない
7. **適切なエラーハンドリング**: try/catch を適切に使用する
8. **入力バリデーション**: Pydantic/Zod を使用する

---

## 関連スキル

* `coding-standards.md` - 一般的なコーディングのベストプラクティス
* `backend-patterns.md` - API とデータベースのパターン
* `frontend-patterns.md` - React と Next.js のパターン

次は、あなたのプロジェクトに合わせてこのテンプレートをカスタマイズしましょうか？
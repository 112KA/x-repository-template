# [package.jsonのnameを記載] Codemap

**最終更新：** YYYY-MM-DD
**エントリポイント：** [list of main files]

## 概要
[package.jsonのdescriptionを記載]

## 構造

[packageのディレクトリ構造を記載]

## Key Modules

[packageの主要コンポーネントを記載]

例1:

| コンポーネント | 用途 | 場所 |
|------|------|------|
| HeaderWallet | ウォレット接続 | components/HeaderWallet.tsx |
| MarketsClient | 市場リスト | app/markets/MarketsClient.js |
| SemanticSearchBar | 検索 UI | components/SemanticSearchBar.js |

例2:

| ルート | メソッド | 用途 |
|------|------|------|
| /api/markets | GET | すべての市場をリスト |
| /api/markets/search | GET | セマンティック検索 |
| /api/market/[slug] | GET | 単一の市場 |
| /api/market-price | GET | リアルタイム価格 |

## Data Flow

[Description of how data flows through this area]]

例:
```
ユーザー → 市場ページ → API ルート → Supabase → Redis（オプション）→ レスポンス
```

## 外部依存関係

[packageの外部依存関係を記載]

例:
- React 19.0.0 - UI ライブラリ
- Privy - 認証
- Tailwind CSS 3.4.1 - スタイル
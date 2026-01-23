# 推奨コマンド

## セットアップ

```bash
# .npmrc ファイルのコピー
cp .npmrc.org .npmrc

# 依存関係のインストール (自動的に pnpm build も実行される)
pnpm install
```

## 開発

```bash
# 開発サーバー起動 (Next.js)
pnpm dev:nextjs

# 開発サーバー起動 (Astro)
pnpm dev:astro

# 開発サーバー起動 (Vite)
pnpm dev:vite

# パッケージの watch モード (x と x3 を同時に)
pnpm watch

# 個別パッケージの watch
pnpm watch:x
pnpm watch:x3
```

## リンティング・フォーマット

```bash
# 全パッケージのリンティング
pnpm lint

# 全パッケージのリンティング (自動修正)
pnpm lint:fix
```

## テスト

```bash
# Next.js アプリのテスト実行
pnpm app:nextjs test

# カバレッジ付きテスト
pnpm -F app-nextjs test
```

## ビルド

```bash
# 全パッケージのビルド
pnpm build

# 個別パッケージのビルド
pnpm build:x
pnpm build:x3
```

## パッケージ別コマンド

```bash
# app-nextjs のスクリプト実行
pnpm app:nextjs <script>

# @112ka/x のスクリプト実行
pnpm x <script>

# @112ka/x3 のスクリプト実行
pnpm x3 <script>
```

## システムコマンド (Linux)

```bash
# ファイル検索
find . -name "*.ts" -type f

# テキスト検索
grep -r "pattern" .

# ディレクトリ移動
cd /path/to/directory

# ファイル一覧
ls -la

# Git 操作
git status
git add .
git commit -m "message"
git push
```

## タスク完了時の推奨フロー

1. `pnpm lint:fix` - コードの整形とリンティング
2. `pnpm test` (該当プロジェクト) - テストの実行
3. `git add .` - 変更をステージング
4. `git commit -m "message"` - Conventional Commits 形式でコミット

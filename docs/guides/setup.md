# Setup Guide

1. `.npmrc` の準備（重要）

- トークンをリポジトリにコミットしないでください。プロジェクトにはテンプレートファイル `.npmrc.example` が含まれています。
- ローカルで使う場合はコピーして必要な値を置き換えます:

```bash
cp .npmrc.example .npmrc
# - ★エディタで .npmrc を開き、%%PERSONAL_ACCESS_TOKEN%% を自分の Personal Access Token に置き換えてください
# - ★飯塚にpackages/xのaccess権限登録を依頼してください
```

2. 依存関係をインストール

```bash
pnpm install
```

## Usage

### 開発サーバー起動

```bash
pnpm dev:nextjs   # Next.js 開発サーバー
pnpm dev:astro    # Astro 開発サーバー
pnpm dev:vite     # Vite 開発サーバー
```

### 補足: ルートのスクリプトについて

- ルートの `postinstall` スクリプトは `pnpm build` を実行します。
- `prepare` スクリプトは simple-git-hooks のセットアップを行います。

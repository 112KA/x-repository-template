# x-repository-template

## 概要

このリポジトリは pnpm を用いたモノレポ向けのテンプレートです。主にフロントエンドのWebFramework（astro, vite, nuxt, nextjs）のtemplate、共通パッケージを同一ワークスペースで管理するためのベース構成（TypeScript、pnpm workspace、標準的なビルド/テスト/リンティングスクリプト）を提供します。新規プロジェクトの立ち上げや内部テンプレートとして利用することを想定しています。

## Setup

1. `.npmrc` の準備（重要）

- トークンをリポジトリにコミットしないでください。プロジェクトにはテンプレートファイル `.npmrc.org` が含まれています。
- ローカルで使う場合はコピーして必要な値を置き換えます:
```bash
cp .npmrc.org .npmrc
# - ★エディタで .npmrc を開き、%%PERSONAL_ACCESS_TOKEN%% を自分の Personal Access Token に置き換えてください
# - ★飯塚にpackages/xのaccess権限登録を依頼してください
```

2. 依存関係をインストール
```bash
pnpm install
```

## Usage
補足: ルートのスクリプトについて

- ルートの `postinstall` スクリプトは `pnpm build` を実行します。
- `prepare` スクリプトは Husky のセットアップを行います。
- 開発起動の例: `pnpm dev:astro`, `pnpm dev:nextjs`, `pnpm dev:vite`

## ディレクトリ構成 (2階層)

リポジトリの主要なディレクトリを2階層まで示します。

```
/
├── apps/
│   ├── app-astro/
│   ├── app-nextjs/
│   └── app-vite-vanilla/
├── packages/
│   ├── x/
│   └── x3/
├── scripts/
├── .serena/
├── .vscode/
└── package.json
```

説明:
- `apps/` : 実際のアプリケーションを格納します。各アプリは独立して起動・ビルド可能で、ルートから `pnpm --filter <app> dev` などで操作します。
	- 例: `app-astro` は Astro ベースのフロントエンド
- `packages/` : 再利用可能なライブラリを格納します。パッケージは TypeScript + Vite を使ってビルドされ、他のパッケージ/アプリから参照されます。
	- 例: `@112ka/x`（コアライブラリ）, `@112ka/x3`（3D 関連ライブラリ）


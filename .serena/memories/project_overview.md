# Project Overview

## Purpose
This repository is a pnpm workspace template for front-end projects. It centralizes multiple front-end applications (Astro, Next.js, Vite) and reusable packages (for example `@112ka/x` and `@112ka/x3`) into a single monorepo. The template aims to standardize build, linting, and development workflows using TypeScript and pnpm workspace features.

## Tech Stack
- Package manager: pnpm workspace (requires pnpm >= 10)
- Runtime: Node.js (requires Node >= 22.11)
- Language: TypeScript (5.x)
- App frameworks: Astro, Next.js, Vite (vanilla)
- Build tools: Vite for app/package development, `tsdown` for library output
- Linters & tooling: ESLint (using `@antfu/eslint-config`), Husky, lint-staged

## High-level repository layout

- `apps/` – Actual applications. Examples: `app-astro`, `app-nextjs`, `app-vite-vanilla`.
- `packages/` – Reusable libraries and shared code. Examples: `x`, `x3`.
- `scripts/` – Repository helper scripts.
- Root `package.json` defines workspace-level scripts and tooling.

Example two-level layout:

```
/
├─ apps/
│  ├─ app-astro/
│  ├─ app-nextjs/
│  └─ app-vite-vanilla/
├─ packages/
│  ├─ x/
│  └─ x3/
├─ scripts/
├─ .serena/
├─ .vscode/
└─ package.json
```

## Important scripts (summary)

- `pnpm install` — install dependencies for the workspace.
- `pnpm dev:astro`, `pnpm dev:nextjs`, `pnpm dev:vite` — start app development servers (often used together with `pnpm watch` which watches packages).
- `pnpm watch` — runs package watch tasks (e.g., `tsdown --watch` for packages that use tsdown).
- `pnpm build` — build the workspace (root script targets `@112ka/x` and `@112ka/x3`).
- `pnpm lint` — workspace lint (root maps to `pnpm -r lint:fix`).

## Notes
- The repository includes a `postinstall` script that runs `pnpm build`. Be mindful of side effects when running `pnpm install` in CI or local environments.
- Some packages use `tsdown` to produce `dist` output and type declarations (`dist/*.d.ts`).
# project_overview

## 目的
このリポジトリは、pnpm ワークスペースを使ったフロントエンド向けモノレポのテンプレートです。複数のフロントエンドアプリ（Astro / Next.js / Vite）と再利用可能なパッケージ（@112ka/x, @112ka/x3 等）を同一ワークスペースで管理し、ビルド・開発・テスト・Lint を標準化して提供します。

## 技術スタック
- パッケージ管理: pnpm ワークスペース
- 言語: TypeScript (5.x)
- ビルド/バンドル: Vite（パッケージ開発向け）、tsdown を使ったライブラリ出力
- フレームワーク: Astro, Next.js, plain Vite
- Lint/Format: ESLint（@antfu/eslint-config を使用）
- フック/CI: Husky, lint-staged
- Node エンジン要件: Node >= 22.11
- pnpm 要件: pnpm >= 10

## 主要なディレクトリ構成
- `apps/` : 実際のアプリケーション（`app-astro`, `app-nextjs`, `app-vite-vanilla`）
- `packages/` : 再利用可能なライブラリ (`x`, `x3` など)
- `scripts/` : リポジトリ補助スクリプト
- ルートの `package.json` でワークスペース全体のスクリプトを定義

## 主要スクリプト（簡易）
- `pnpm install` : 依存関係をインストール
- `pnpm dev:astro` / `pnpm dev:nextjs` / `pnpm dev:vite` : 各アプリの開発サーバ起動（`pnpm watch` と併用）
- `pnpm build` : ワークスペース全体のビルド（`@112ka/x` と `@112ka/x3` をビルド）
- `pnpm lint` : ルートで ESLint（fix を含む）を実行（実態は `pnpm -r lint:fix`）
- `postinstall` により `pnpm build` が実行される

## 作者 / リポジトリ情報
- 作者: Masayuki Iizuka <mas.iizuka@gmail.com>
- GitHub: https://github.com/112KA/x

## 開発にあたっての注意点
- `.npmrc.org` が含まれている場合、ローカル `.npmrc` の設定（特にトークンやスコープの access 設定）を適切にコピー/更新する必要があります。
- ライブラリパッケージは `tsdown` を使って `dist` を生成する仕組みになっています。

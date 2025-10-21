プロジェクト名: x-repository-template
目的:
- pnpm workspace を用いたフロントエンド向けテンプレート（TypeScript + Vite/Astro/Next 等）のモノレポ構成を提供する。
- 再利用ライブラリ（packages/@112ka/x と @112ka/x3）と複数アプリ（apps/app-astro, apps/app-nextjs）を同一ワークスペースで管理する。

主要技術スタック:
- Node.js >= 22.11
- pnpm >= 10 (pnpm workspace)
- TypeScript 5.x
- Vite, Astro, Next.js（プロジェクト内にそれぞれのサンプルアプリあり）
- ESLint（@antfu/eslint-config）
- Husky + lint-staged

コード構成（概観）:
- apps/ : 実際に動作するアプリ群（例: app-astro, app-nextjs）
- packages/ : 再利用可能ライブラリ（@112ka/x, @112ka/x3 など）
- scripts/ : 開発用スクリプト
- .vscode/, .serena/ : エディタ/ツール設定

特徴/挙動:
- ルートの package.json にワークスペース用スクリプト（build, watch, dev 等）が定義され、pnpm の filter 機能を利用して個別パッケージを操作する。
- postinstall に pnpm build が走る設定があるため、CI/インストール後の振る舞いに注意。

備考:
- `.npmrc.org` を含むので、ローカルでトークン等の差し替えが必要な場合がある。
- 開発は Linux 環境（提供情報）で想定されている。
# Core

- pnpm モノレポ (x-repository-template)。apps/ は app-vite のみ (app-nextjs は削除済み)。
- apps/app-vite: React Router v8 + Vite (vp dev/build), fs-routes (app/routes.ts)。
- packages/x (@112ka/x): 共通 TS ユーティリティ。exports は dist/*.mjs。
- packages/x3: 3D/graphics 系。packages/x-lib: 汎用ユーティリティ (tests/*.spec.ts)。
- schemas/, scripts/, docs/ はルート直下の補助資産。
- 詳細: `mem:tech_stack`, `mem:suggested_commands`, `mem:conventions`, `mem:task_completion`

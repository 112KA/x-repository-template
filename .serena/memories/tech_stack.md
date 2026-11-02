# Tech stack

- Node >= 26.6, pnpm 12.16.1 (packageManager, devEngines で強制)。pnpm workspace (apps/_, packages/_)。
- TypeScript 6.0.3, ES modules only。
- Toolchain: Vite+ (`vp`) = Vite, Vitest, Oxlint, Oxfmt。packages/x は `vp pack` でビルド, `vp test` でテスト。
- Version は pnpm-workspace.yaml の catalog: で一元管理 (vite, vite-plus, vitest, tailwindcss 等)。
- app-vite: React 19, react-router 8.5.1 (@react-router/dev), Tailwind CSS 4, shadcn/base-ui, GSAP, Playwright e2e。
- Git hooks: simple-git-hooks の pre-commit で lint-staged (packages/* と apps/app-vite 対象)。

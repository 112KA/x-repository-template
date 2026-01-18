# Project overview

Name: x-repository-template

Purpose:
- Monorepo template using pnpm workspaces, intended as multi-frontend templates (Astro, Vite, Next.js) and shared TypeScript libraries. Provides standard build/test/lint tooling and workspace structure to bootstrap new projects.

Tech stack:
- Node.js >= 24.12, pnpm >= 10
- TypeScript 5.x targeting ES2020 (per repo instructions)
- ESLint, Vitest, Vite, tsdown for building packages
- Frontend frameworks: Astro, Next.js, Vite (vanilla)
- Husky, lint-staged for Git hooks

Repo structure:
- apps/: frontend apps (app-astro, app-nextjs, app-vite-vanilla)
- packages/: reusable libraries (@112ka/x, x-lib, x3)
- scripts/: helper scripts for git and repo setup

Key scripts (root `package.json`):
- pnpm install (setup)
- pnpm dev (starts watch for packages and app-astro dev by default)
- pnpm build (builds packages)
- pnpm lint (runs eslint --fix across workspace)
- pnpm prepare (runs husky setup)
- pnpm postinstall (runs pnpm build)

Notes:
- Packages use `tsdown` for build and `vitest` for tests
- `pnpm --filter` is used to target individual packages/apps
- `.npmrc.org` provided as a template; users must set `.npmrc` for tokens locally
- The repo is Linux-targeted development environment

How to develop (short):
1. Copy `.npmrc.org` to `.npmrc` and add credentials if needed
2. pnpm install
3. pnpm dev: start local development (e.g., `pnpm dev:astro`)


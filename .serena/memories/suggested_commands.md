# Suggested commands

Development setup:
- Copy npmrc template:
  - cp .npmrc.org .npmrc
- Install dependencies:
  - pnpm install

Run apps (examples):
- Start all dev (packages watch + astro app):
  - pnpm dev
- Start specific app:
  - pnpm dev:astro
  - pnpm dev:nextjs
  - pnpm dev:vite
- Run a specific package or app using filter:
  - pnpm -F app-astro dev
  - pnpm -F @112ka/x build

Build and watch packages:
- Build all packages:
  - pnpm build
- Build specific package:
  - pnpm build:x
  - pnpm build:x3
- Watch packages during development:
  - pnpm watch
  - pnpm watch:x

Linting / formatting / tests:
- Run eslint with autofix across workspace:
  - pnpm lint
- Run package test (example for packages/x):
  - pnpm -w -F @112ka/x test
- Run vitest directly in package:
  - pnpm -C packages/x test

Git hooks / prepare:
- Set up husky hooks (normally run automatically during prepare):
  - pnpm prepare

Utilities:
- Show changed files (git):
  - git status
- Run a single command in package's directory:
  - pnpm -C packages/x run build

Notes:
- Root `postinstall` triggers `pnpm build` so CI setups may call `pnpm install` and skip postinstall if desired.
- Use `pnpm --filter` to target package subsets when building or running.

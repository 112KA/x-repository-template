# Suggested commands (Linux)

## Setup

- pnpm install (postinstall で pnpm build 実行)

## Root scripts

- pnpm dev / pnpm dev:vite: watch (@112ka/x, x3) + app-vite dev を concurrently で起動
- pnpm build, pnpm build:x, pnpm build:x3
- pnpm watch, pnpm watch:x, pnpm watch:x3
- pnpm testAll: 全パッケージで pnpm -r test
- pnpm check / pnpm check:fix: vp check (--fix)
- pnpm app:vite <cmd>, pnpm x <cmd>, pnpm x3 <cmd>, pnpm x-lib <cmd>: 各パッケージの script 実行

## Per package

- packages/x: pnpm x lint, pnpm x lint:fix, pnpm x test (vp test --run --coverage)
- apps/app-vite: pnpm app:vite check, pnpm app:vite test:e2e (playwright)

## System utilities (Linux)

- ls, cd, pwd, cat, less, grep, rg, find, git status/diff/log

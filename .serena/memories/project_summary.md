x-repository-template: pnpm monorepo containing TypeScript libraries and an Astro app. Root scripts orchestrate building/publishing `@112ka/x` and `@112ka/x3` packages. Workspace uses pnpm, Node >=22.11, TypeScript 5.9, Vite for packages, and Astro for the app. Primary author: Masayuki Iizuka.

High-level structure:
- apps/app-astro: Astro site (dev server at localhost:4321)
- packages/x: TypeScript library built with Vite
- packages/x3: TypeScript library dependent on @112ka/x + three
- scripts/: git helper scripts

Key commands (from root):
- `pnpm install` — install deps
- `pnpm dev` / `pnpm dev:astro` — start dev server and watch builds
- `pnpm build` — build packages and app
- `pnpm lint` — run lint across workspace

Notes:
- Uses Husky for git hooks and lint-staged
- Project developed on Windows paths when activated via serena (Z: mapped)
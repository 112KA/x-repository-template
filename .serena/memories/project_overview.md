# Project Overview: x (@112ka/x)

- Purpose: Lightweight, modular TypeScript utility library exposing multiple submodules as ES modules.
- Entrypoint: `src/index.ts` which re-exports submodules.
- Build: `tsdown` used to compile and generate `dist/` with types and JS. `files` in package.json includes `dist` only.
- Package manager: pnpm recommended.
- Scripts: `build`, `watch`, `lint:fix`.
- Tech stack: TypeScript 5.x, ESLint, tsdown, vite (dev dependency), vite-plugin-dts.
- Notable config: `tsconfig.json` extends `@tsconfig/recommended` and targets ES2020.

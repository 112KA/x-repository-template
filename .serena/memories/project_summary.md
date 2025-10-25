Project: x (@112ka/x)

Purpose:
- A compact TypeScript utility library composed of modular packages (core, data, features, math, misc, utils, etc.).
- Intended to be published as an ES module package with per-file outputs in `dist/`.

Repository metadata (from package.json):
- Name: `@112ka/x`
- Type: `module`
- Version: `0.0.8`
- Author: Masayuki Iizuka <mas.iizuka@gmail.com>
- Repository: https://github.com/112KA/x.git
- Exports: configured for types (`./dist/index.d.ts`) and JS (`./dist/index.js`)
- Note: `types` field in package.json currently points to `dist/index.d.js` (verify if this is a typo).

Tech stack & toolchain:
- Language: TypeScript (source target ES2020)
- Module resolution: `bundler` (in `tsconfig.json`)
- Build tool: `tsdown` (used in `package.json` scripts as `build` / `watch`)
- Lint: ESLint (config via `@antfu/eslint-config`)
- Declaration generation: project previously used d.ts generation tooling (e.g., `vite-plugin-dts` seen historically), but the active build script uses `tsdown`.
- Package manager: pnpm (recommended)

Source layout & entrypoints:
- Public entry: `src/index.ts` (re-exports submodules)
- Source folders at repo root: `core`, `data`, `features`, `math`, `misc`, `utils`, `errors`, `decorators`, `@types`
- Build output directory: `dist/`

Important scripts (from `package.json`):
- `lint`: `eslint`
- `lint:fix`: `eslint --fix`
- `build`: `tsdown`
- `watch`: `tsdown --watch`

Key commands:
- `pnpm i` — install dependencies
- `pnpm build` — run `tsdown` build
- `pnpm watch` — watch build
- `pnpm lint` / `pnpm lint:fix` — run eslint

Notes & action items:
- `tsdown` is used for the build stage (verify whether a Vite config is still required or deprecated).
- `tsconfig.json` contains path alias `x/*` -> `./src/*` and `moduleResolution: "bundler"`.
- Confirm the `types` field in `package.json` that currently points to `dist/index.d.js` (likely should be `dist/index.d.ts`).
- Platform: Linux, default shell: bash

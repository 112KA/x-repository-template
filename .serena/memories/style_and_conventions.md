Style & conventions (updated to reflect current repo):

TypeScript & modules
- Use TypeScript (`.ts`) sources and export public API via `src/index.ts` barrel file.
- `tsconfig.json` extends `@tsconfig/recommended` with `composite: true`, `moduleResolution: "bundler"`, and path alias `x/*` -> `./src/*`.

Linting & formatting
- ESLint configured via `@antfu/eslint-config`. Run `pnpm lint` and `pnpm lint:fix` before merging changes.

Code organization
- Organize related functionality into root-level folders: `core`, `data`, `features`, `math`, `misc`, `utils`, `errors`, `decorators`, `@types`.
- Prefer small, single-responsibility modules and explicit exports from barrel files.

Build & distribution
- Current build script uses `tsdown` to produce outputs into `dist/`. Historically the project used Vite and `vite-plugin-dts` for declaration generation; confirm if `tsdown` replaces that workflow.
- Keep public API surface stable; consider semantic versioning for releases.

Documentation & types
- Document public functions/classes using TSDoc/JSDoc comments.
- Ensure declaration files are generated and referenced correctly in `package.json` (`types` field should point to `.d.ts`).

Recommendations
- Add a CI workflow to run lint and build on PRs.
- Add `CONTRIBUTING.md` if accepting external contributions frequently.

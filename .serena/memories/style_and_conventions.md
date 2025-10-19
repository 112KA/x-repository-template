Coding conventions and style:

- TypeScript with `@tsconfig/recommended` target. Use TypeScript strictness where appropriate.
- ESLint with `@antfu/eslint-config` preset. Use `pnpm lint` and `pnpm lint:fix`.
- Files use utf-8 encoding. Naming follows standard TS conventions (camelCase for variables, PascalCase for types/classes).
- Vite for builds; packages export types via `vite-plugin-dts`.
- Use Husky + lint-staged to enforce lint before commits.

Documentation: Keep README updated for apps and packages. Use `CHANGELOG.md` in packages when releasing.
# Style conventions

Derived from repo files and TypeScript instructions:

- Language: TypeScript 5.x targeting ES2020. Use ES modules.
- Filenames: kebab-case for files, PascalCase for classes/types, camelCase for variables/functions.
- No CommonJS; prefer `export` / `import` syntax.
- Avoid `any`; prefer `unknown` and proper type narrowing.
- Use ESLint with `@antfu/eslint-config` base. Run `pnpm lint` to autofix.
- Tests: Vitest with node environment and coverage via V8 provider.
- Build: `tsdown` for packages; packages are composite projects with `outDir: dist`.
- Decorators: experimentalDecorators enabled where needed.
- Keep public API documented with JSDoc; update `tsdown` outputs accordingly.

Formatting and tooling:
- Run `pnpm lint` and tests locally before PR.
- Husky + lint-staged enforces pre-commit checks.

Naming and architecture:
- Reuse shared utilities and keep modules single-purpose.
- Prefer immutable data and pure functions where practical.


# Task completion checklist

- Run linting: pnpm lint (or pnpm lint:fix if needed).
- Run tests relevant to the change (pnpm testAll or package-specific pnpm x test, etc.).
- If updating app-nextjs page definitions: update src/lib/page-definitions.generated.ts and/or run pnpm app:nextjs generate:pages.
- If adding new package exports: update packages/\*/src/index.ts and build as needed.
- Be aware of repo hooks: simple-git-hooks runs lint-staged on pre-commit.

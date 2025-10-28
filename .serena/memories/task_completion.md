# Task completion checklist

When you've completed a task or feature, run these checks before opening a PR:

1. Code quality
   - pnpm lint (root) -> autofix issues
   - Ensure no new ESLint errors remain
2. Tests
   - Run unit tests for affected packages:
     - pnpm -F @112ka/x test
     - pnpm -F @112ka/x3 test
   - Ensure coverage thresholds (if enforced) are met
3. Build
   - pnpm build (root) to ensure packages compile with `tsdown`
   - Optionally run `pnpm -F @112ka/x build` per-package
4. Commit & push
   - Run `pnpm prepare` if hooks need to be installed locally
   - Ensure lint-staged + husky ran and passed
5. PR checklist
   - Provide a clear description and link to relevant issues
   - Add changelog entry if library/package change
   - Ensure CI passes (install -> build -> test)

Optional:
- Run integration or manual checks for frontends:
  - pnpm dev:astro and test UI flows


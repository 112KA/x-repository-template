# Task completion checklist for @112ka/x

When finishing a task or PR:

1. Run tests (if added).
2. Run `pnpm build` and inspect `dist/` for correct outputs.
3. Run `pnpm lint:fix` and ensure ESLint passes.
4. Ensure new public API has TSDoc and follow barrel export patterns.
5. Update CHANGELOG.md and bump package version if releasing.
6. Create PR with description and request reviewers.

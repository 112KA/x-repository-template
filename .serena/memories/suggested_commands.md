Suggested commands (project root)

Install

pnpm i

Build

pnpm build    # runs tsdown
pnpm watch    # runs tsdown --watch

Lint

pnpm lint
pnpm lint:fix

TypeScript / cleanup

pnpm tsc:clean   # if configured

Useful git / shell commands

- git status
- git add -A
- git commit -m "<message>"
- git push
- ls -la
- grep -R "TODO" src/
- find . -name "*.ts"

Notes

- The build system currently uses `tsdown` per `package.json` scripts; ensure `tsdown` is installed when running `pnpm build`.
- The README previously referenced Vite; the current `package.json` indicates `tsdown`-based build. Verify which build flow is canonical for this repo.
- Environment: Linux (bash)

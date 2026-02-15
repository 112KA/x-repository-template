# Git Workflow

## Commit Message Format

```
<type>: <description>

<optional body>

```

- Follow **Conventional Commits** format:
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Refactoring
- `test:` - Adding or correcting tests
- `docs:` - Documentation updates
- `chore:` - Changes to build process or tools
- `perf:` - Performance improvements
- `ci:` - Changes to CI/CD pipelines
- `style:` - Changes to code style
- `build:` - Changes to build system
- `release:` - Release changes
- `security:` - Security changes

## pre-commit hooks

- `simple-git-hooks` automatically executes `lint-staged`
- Linting is performed automatically before committing

## Pull Request Workflow

When creating a PR:

1. Analyze the complete commit history, not just the latest commit
2. Use `git diff [base-branch]...HEAD` to review all changes
3. Draft a comprehensive PR summary
4. Include a test plan with TODOs
5. For new branches, push using the `-u` flag

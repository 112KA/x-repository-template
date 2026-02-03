# Task Completion Checklist

Steps to execute when a task is completed:

## 1. Code Quality Check

```bash
# Linting and auto-fix
pnpm lint:fix

```

## 2. Running Tests

```bash
# Run tests for the corresponding project
pnpm app:nextjs test  # For Next.js
# Or
pnpm -F <package-name> test

```

## 3. Build Confirmation (If necessary)

```bash
# Build the package
pnpm build

```

## 4. Git Commit

```bash
# Stage changes
git add .

# Commit in Conventional Commits format
git commit -m "feat: add new feature"
# Or
git commit -m "fix: correct bug"
# Or
git commit -m "refactor: improve code structure"

```

Reference: [Commit Message Format](./git-workflow.md)

## 5. Push

```bash
git push

```
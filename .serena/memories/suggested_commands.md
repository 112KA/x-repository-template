Development quick commands:

# Install and dev
pnpm install
pnpm dev

# Build
pnpm build
pnpm -r -F @112ka/x build
pnpm -r -F @112ka/x3 build

# Lint/format
pnpm lint
pnpm -r lint:fix

# Package-specific
pnpm -F @112ka/x dev
pnpm -F @112ka/x build
pnpm -F @112ka/x watch

# Git / utility
git status
git add -A
git commit -m "..."

Notes: Run commands from repository root. On Windows, use PowerShell or bash under WSL; pnpm commands are cross-platform.
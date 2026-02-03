# Copilot Instructions for x-repository-template

**Communication**: Answer in Japanese. Ask clarifying questions when requirements are ambiguous.

## Quick Navigation

- **Product Vision**: [PRODUCT.md](../docs/PRODUCT.md) - pnpm monorepository for unified frontend framework management
- **Architecture**: [codemaps/index.md](../docs/codemaps/index.md) - Workspace structure, tech stack, design principles
- **Development**: [guides/development.md](../docs/guides/development.md) - Setup, development commands, testing procedures

## Conversation Context

This is a **pnpm monorepo** with multiple apps and packages working together:

- **Monorepo structure**: `apps/` (applications) and `packages/` (shared libraries) are managed with pnpm workspace
- **Internal dependencies**: Use `workspace:*` protocol in package.json - automatically resolves to workspace version
- **Auto-build pipeline**: `postinstall` hook automatically builds packages after `pnpm install`
- **Build tools**: tsdown for package builds, Turbopack for Next.js app
- **Package references**: All internal packages (@112ka/x, @112ka/x3, x-lib) are published to dist/ with ES modules

## File References Quick Guide

Key configuration files in this monorepo:

- [pnpm-workspace.yaml](../pnpm-workspace.yaml) - Workspace package patterns
- [package.json](../package.json) - Root package metadata and monorepo scripts
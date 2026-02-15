# Copilot Instructions for ${projectName}

**Communication**: Answer in Japanese. Ask clarifying questions when requirements are ambiguous.

## Quick Navigation

- **Product Vision**: [PRODUCT.md](../docs/PRODUCT.md) - pnpm monorepository for unified frontend framework management
- **Architecture**: [ARCHITECTURE.md](../docs/ARCHITECTURE.md) - Workspace structure, tech stack, design principles
- **Development**: [CONTRIBUTING.md](../docs/CONTRIBUTING.md) - Setup, development commands, testing procedures

## Conversation Context

This is a **pnpm monorepo** with multiple apps and packages working together:

- **Monorepo structure**: `apps/` (applications) and `packages/` (shared libraries) are managed with pnpm workspace
- **Internal dependencies**: Use `workspace:*` protocol in package.json - automatically resolves to workspace version
- **Auto-build pipeline**: `postinstall` hook automatically builds packages after `pnpm install`
- **Build tools**: tsdown for package builds, Turbopack for Next.js app
- **Package references**: All internal packages are published to dist/ with ES modules

## File References Quick Guide

Key configuration files for monorepo-wide context:

- [pnpm-workspace.yaml](../../pnpm-workspace.yaml) - Workspace package patterns and configuration
- [package.json](../../package.json) - Root package metadata and monorepo scripts
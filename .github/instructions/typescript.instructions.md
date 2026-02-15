---
description: 'Guidelines for TypeScript Development targeting TypeScript 5.x and ES2020 output'
applyTo: '**/*.{ts,tsx}'
---

# TypeScript Coding Standards

## Code Style

- Avoid `any` type.
  - **Why**: Production bugs from implicit any bypassed type checking.

## Error Handling

- Use custom error classes (extend from `packages/x/src/errors/`).
  - **Why**: Generic Error stack traces lack debugging context.

## Project Constraints

- Use ES modules only - no CommonJS.
- Shared utilities belong in `packages/x/src/` - do not duplicate in apps.
- Keep implementations minimal - avoid unnecessary abstractions.

## Avoid

- Adding dependencies without approval.
- Creating multiple files for single-responsibility tasks.
- Using `console.log` for error handling.
- Avoid fallback.
  - **Why**: Leads to unpredictable behavior; complicates maintenance.

# Style and conventions
- TypeScript: strict mode; avoid any; add explicit types for function params/returns; prefer inference for locals.
- Error handling: extend custom errors from packages/x/src/errors/; avoid generic Error.
- Modules: ESM only; no CommonJS.
- Shared code: put reusable utilities in packages/x/src/; avoid duplication in apps.
- Dependencies: avoid adding deps without approval; keep abstractions minimal.
- Logging: do not use console.log for error handling.

## Next.js app conventions (apps/app-nextjs)
- Components: named exports only (default exports allowed for Next.js route files like page.tsx/layout.tsx).
- Client components: include 'use client' directive.
- Props: define with interface.
- Naming: components PascalCase, utilities camelCase, constants UPPER_SNAKE_CASE.
- Styling: Tailwind utilities; use cn() for conditional classes; use @apply for repeated patterns; global styles in globals.css.
- Path aliases: @/components, @/lib, @constraints, etc.

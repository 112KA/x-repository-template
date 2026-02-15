# Project overview
- Purpose: pnpm monorepo template for managing multiple frontend apps (Next.js, Astro, Vite) and shared packages in one workspace.
- Main apps live under apps/: app-nextjs (primary), app-astro, app-vite-vanilla.
- Shared packages live under packages/: x (core utilities), x3 (3D/graphics), x-lib (general utilities).
- Next.js app uses static export (output: 'export') and trailingSlash for static hosting.
- app-nextjs uses XML page definitions (definitions/pages/definition.xml) and generated TS types (src/lib/page-definitions.generated.ts).

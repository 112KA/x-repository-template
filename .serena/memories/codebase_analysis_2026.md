# Codebase Analysis - February 6, 2026 (Updated)

## Latest CodeMap Generation (`/codemap index`)

### Index.md Updates (February 6, 2026)
Generated comprehensive system architecture documentation from actual codebase structure:

**Key Changes**:
1. **Enhanced Tech Stack** - Clarified module formats, build tools, and UI libraries
2. **Detailed Dependency Graph** - Added external peer dependencies (three.js 0.182.0, stats-gl 3.8.0)
3. **Module Organization Trees** - Complete src/ structure for @112ka/x (9 modules) and @112ka/x3 (7 modules)
4. **Build Artifact Structure** - Documented .mjs/.d.ts/.d.mts files from tsdown output
5. **Application Details** - Engine, build commands, output directories, features for all 3 apps
6. **Development Commands** - Organized by workflow (build, watch, linting, testing)
7. **Design Constraints** - Monorepo strategy, module resolution, build ordering, boundary conditions

### Repository State
- **Branch**: features/pages (default: main)
- **Status**: Full monorepo with 3 apps (app-nextjs, app-astro, app-vite-vanilla) and 3 packages (@112ka/x, @112ka/x3, x-lib)

### Package Details (Verified)
- **@112ka/x@0.0.10**: 9 modules (data, features, web, application, math, structures, errors, decorators, @types)
- **@112ka/x3@0.0.2**: 7 modules (application, asset, camera, loaders, misc, nodes, textures)
- **x-lib@1.0.0**: Placeholder with src/index.ts only (minimal)

### Build Pipeline
1. postinstall hook runs `pnpm build`
2. @112ka/x builds first (no deps)
3. @112ka/x3 builds second (peer: @112ka/x) + three.js + stats-gl
4. x-lib builds independently
5. Apps build with workspace: protocol references

### Export Structure
- All packages use `.` and `./*.js` export patterns
- Build outputs: index.mjs + *.mjs for code
- Type declarations: index.d.mts (@112ka/x) or .d.ts (x3, x-lib)

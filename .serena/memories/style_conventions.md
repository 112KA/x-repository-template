# Style & Conventions for @112ka/x

- Language: TypeScript targeting ES2020, module: ES modules (type: module in package.json)
- Linter: ESLint with @antfu/eslint-config; stylistic rules enabled
- Compiler settings: extends @tsconfig/recommended, moduleResolution: bundler, paths: x/* -> ./src/*
- Declaration files: build generates .d.ts in dist/
- Project favors small single-responsibility modules and explicit re-exports via barrel `src/index.ts`.
- Documentation: TSDoc/JSDoc recommended for public API
- File layout: folders include core, data, features, math, misc, utils, errors, decorators, @types

# Contributing Guidelines

## Usage

### 開発サーバー起動
```bash
pnpm dev:nextjs   # Next.js 開発サーバー
pnpm dev:astro    # Astro 開発サーバー
pnpm dev:vite     # Vite 開発サーバー
```

### 補足: ルートのスクリプトについて
- ルートの `postinstall` スクリプトは `pnpm build` を実行します。
- `prepare` スクリプトは simple-git-hooks のセットアップを行います。

## Coding Standards

### 言語とツール
- **Language**: TypeScript (Strict Mode)
- **Linting**: ESLint 9 + @antfu/eslint-config (保存時に自動整形)
- **Testing**: Vitest + @testing-library/react

### Code Patterns

**Internal Package References**: Use `"@112ka/x": "workspace:*"` in package.json for internal dependencies - automatically resolves to workspace version.

**Error Handling**: Extend custom errors from `packages/x/src/errors/` instead of generic Error.

**Exports**: All packages use ESM with proper `dist/` exports in package.json. Update `index.ts` and let `tsdown` generate dist files.

# Style Conventions

## Summary
The repository primarily uses TypeScript and ESLint to maintain code quality. It follows a conservative, library-friendly layout: package source in `src/`, built output in `dist/`, and `exports` defined in package manifests.

## TypeScript
- Target: TypeScript 5.x
- Expectation: packages expose type definitions in `dist/*.d.ts` and are published as ES modules (`type: module` in some packages).
- Recommended: keep strict type checking enabled if possible (project tsconfig files may vary per package).

## Linting and formatting
- ESLint is used with `@antfu/eslint-config` as a baseline. Run `eslint --fix` (or workspace scripts) to automatically fix issues where possible.
- Husky + lint-staged is configured to run linting on staged files before commits.

## Package guidelines
- Prefer side-effect free modules (`sideEffects: false`) for better tree-shaking.
- Public API should be exported from a package root (for example `src/index.ts`) and declared via the `exports` field in `package.json`.

## Naming and code style
- Follow existing conventions in the repository; avoid changing lint rules without consensus.
- Keep APIs small and focused; maintain clear names for public exports.
# style_conventions

## 要約
このプロジェクトは TypeScript を第一として開発され、ESLint（@antfu/eslint-config）と TypeScript の組み合わせでコード品質を保ちます。ビルドターゲットはモジュール形式（`type: module`）および ES2020 相当を想定しています。

## 具体的な規約 / 想定
- TypeScript 5.x を想定。tsconfig はパッケージごとに設定されている（`packages/*/tsconfig.json` 等）。
- 出力ターゲット: ES2020（互換性のため）、型定義ファイルを `dist/*.d.ts` として配布。
- ESLint: `eslint --fix` を使って自動修正を行う。ルールは主に `@antfu/eslint-config` に依存。
- インデントとフォーマッティング: 既存設定に従う（プロジェクト内に Prettier 設定が見当たらないため ESLint の設定に従う）。
- コミット前の自動チェック: Husky の `prepare` でフックがセットされ、`lint-staged` により変更ファイルに対して lint が走る。`lint-staged` の設定はルート `package.json` にあり、対象ファイルパターンが定義されている。

## 命名と API ガイドライン（簡易）
- パッケージはスコープ付き（`@112ka/x` 等）。
- ライブラリは副作用なし（`sideEffects: false`）を意図しているため、ツリーシェイキングに適したエクスポートを心がける。
- public API は `src/index.ts` 経由でエクスポートし、`exports` フィールドで公開ファイルを明示する。

## 追加の想定（推定に基づく）
- 型安全を重視するため、可能なら `strict` な TypeScript 設定を使う想定。
- 既存の lint 設定に合わせること（ルールを勝手に変えない）。

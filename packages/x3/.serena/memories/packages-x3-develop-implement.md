# packages x3 開発実装情報

## スクリプト

| スクリプト | 用途 |
| --- | --- |
| `pnpm lint` | ESLint による静的解析 |
| `pnpm lint:fix` | ESLint による自動修正 |
| `pnpm build` | tsdown でビルド（`dist/` に出力） |
| `pnpm watch` | tsdown のウォッチモード |

## タスク完了後の lint, test, build のスクリプト処理

実装完了時の必須検証フロー：

```bash
# 1. Lint 修正（コードスタイル）
pnpm lint:fix

# 2. ビルド確認（型チェック + esm 形式への変換確認）
pnpm build

# 3. 成果物確認
ls -la dist/
```

### 実行順序の理由

1. **lint:fix** - 文法・スタイル統一
2. **build** - TypeScript 型チェック＆esm 形式への変換確認

### エラー時の対応

| エラー | 確認項目 |
| --- | --- |
| TypeScript エラー（build 時） | `tsconfig.json` の paths（x3/*, @112ka/x, three）と `src/**/*.ts` の include 確認 |
| ESLint エラー | `eslint.config.mjs` の rules 確認、`@antfu/eslint-config` の lib 型確認 |
| 依存解決エラー（build 時） | `tsconfig.json` の moduleResolution: bundler 確認、node_modules/@types タイムスタンプ確認 |
| Three.js 型エラー | `@types/three` が `package.json` devDependencies に存在し、バージョン 0.182.0 と整合していることを確認 |

### ホットリロードと開発フロー

```bash
# ウォッチモードでの開発
pnpm watch

# 別ターミナルで単独テスト（vitest 未構成のため、ビルドのみで動作確認）
pnpm build
```

### Note

- **テストについて**: `vitest.config.ts` が存在しないため、ユニットテストは外部統合時点で設定
- **peerDependencies**: three, stats-gl, @112ka/x は実際の使用環境で インストール必須
- `tsdown` により `dist/` 内で module structure が保持される（barrel ファイル対応）
- WebGPU/WebGL の切り替えはランタイム環境判定による（ビルド時分岐ではない）

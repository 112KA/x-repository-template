# packages x 開発実装情報

## スクリプト

| スクリプト | 用途 |
| --- | --- |
| `pnpm lint` | ESLint による静的解析 |
| `pnpm lint:fix` | ESLint による自動修正 |
| `pnpm build` | tsdown でビルド（`dist/` に出力） |
| `pnpm watch` | tsdown のウォッチモード |
| `pnpm test` | vitest による全テスト実行（coverage 付き） |

## タスク完了後のスクリプト処理

実装完了時の必須検証フロー：

```bash
# 1. Lint 修正（コードスタイル）
pnpm lint:fix

# 2. テスト実行（単体テスト + カバレッジ）
pnpm test

# 3. ビルド確認（型チェック + 成果物生成）
pnpm build

# 4. 成果物確認
ls -la dist/
```

### 実行順序の理由

1. **lint:fix** - 文法・スタイル統一
2. **test** - ロジック動作確認＆カバレッジ把握
3. **build** - 型チェック＆esm 形式への変換確認

### エラー時の対応

| エラー | 確認項目 |
| --- | --- |
| TypeScript エラー（build 時） | `tsconfig.json` の `include`/`exclude` と paths 確認 |
| ESLint エラー | `eslint.config.mjs` の rules 確認、`@antfu/eslint-config` の型確認 |
| vitest エラー | `vitest.config.ts` の environment と include パターン確認 |

### Coverage 目標

- `pnpm test` で vitest coverage（v8）が実行されつつ、text reporter に出力
- Coverage 基準は明示のプロジェクト設定に従う（デフォルト: 出力のみ）

## ホットリロードと開発フロー

```bash
# ウォッチモードでの開発
pnpm watch

# 別ターミナルでテストを並行実行
pnpm test --watch
```

### Note

- `vitest.config.ts` に alias 設定がある場合、`build` 後も同じ path 解決が利用可能か確認
- `tsdown` のデフォルト設定では、`preserveModules` により `src/` の構造を `dist/` へ保持

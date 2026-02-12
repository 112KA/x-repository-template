# apps app-nextjs 開発実装情報

## スクリプト

### 開発・実行

- `pnpm dev`: Next.js 開発サーバー起動（Turbopack + HTTPS）
  - ポート: 3000（変更可能）
  - オプション: `--experimental-https` で自動 HTTPS 有効化

### ビルド・デプロイ

- `pnpm build`: Static Export ビルド（`out/` ディレクトリ生成）
  - 設定: `next.config.ts` で `output: 'export'` を指定
  - 結果： 静的ファイル集合

### 型・コード品質

- `pnpm lint`: ESLint チェック（antfu preset、Next.js 対応）
- `pnpm lint:fix`: ESLint 自動修正
- `pnpm test`: Vitest でテスト実行
  - カバレッジレポート：v8 provider
  - 環境：happy-dom

### 構成例（root package.json の app-nextjs スクリプト）

```
"dev:nextjs": "cd apps/app-nextjs && pnpm dev"
"build:nextjs": "cd apps/app-nextjs && pnpm build"
"test:nextjs": "cd apps/app-nextjs && pnpm test"
"lint:nextjs": "cd apps/app-nextjs && pnpm lint"
"lint:fix:nextjs": "cd apps/app-nextjs && pnpm lint:fix"
```

## タスク完了後のプロセス

### 新機能実装完了時

1. **ローカルテスト実行**

   ```bash
   pnpm test  # または pnpm test --coverage
   ```

2. **Lint チェック・修正**

   ```bash
   pnpm lint:fix
   ```

3. **ビルド確認**

   ```bash
   pnpm build
   ```

4. **ブラウザ動作確認**
   - 開発サーバー実行: `pnpm dev`
   - ローカル確認: http://localhost:3000

### XML ページ定義追加時

- `definitions/pages/definition.xml` に追加
- 型定義手動更新（将来的にスクリプト化予定）：
  - `src/lib/page-definitions.generated.ts` に型と定義を記述
- ページファイル作成：`src/app/{page-name}/page.tsx`
- テスト追加（推奨）

### shadcn/ui コンポーネント追加時

```bash
pnpm dlx shadcn@latest add {component-name}
```

- `src/components/ui/{component-name}.tsx` に自動配置
- `components.json` で指定された style（new-york）, tailwind 設定に従う

### カスタムトランジション戦略追加時

1. `src/app/_constraints/transitions/strategies/{strategy-name}.ts` を新規作成
2. `ViewTransitionStrategy` インターフェース実装
3. `src/app/_constraints/transitions/strategies/index.ts` にエクスポート追加
4. テスト追加：`src/app/_constraints/transitions/tests/{strategy-name}.test.ts`

## バージョン・設定

- **Next.js**: 16.1.4 → `next build --turbopack` で Turbopack ビルド
- **TypeScript**: ES2017 ターゲット、Module Resolution は bundler
- **ESLint**: antfu preset + Next.js plugin
- **PostCSS**: Tailwind CSS 4 対応（@tailwindcss/postcss）

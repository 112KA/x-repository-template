コーディングスタイル/規約（要点）:

- 言語: TypeScript（厳密な型付けを推奨）
- ESLint: `@antfu/eslint-config` が devDependencies に含まれている。プロジェクト標準の ESLint ルールを利用。
- tsconfig: ルート/各パッケージに `tsconfig.json` がある。`@tsconfig/recommended` が依存に含まれている。
- フォーマット: 明示的な prettier は見当たらないが、ESLint の autofix を利用する流れ。
- コミットフック: Husky + lint-staged を利用。ステージされたファイルに対して lint を実行する設定がある。

慣習:
- パッケージ名は `@112ka/x` や `@112ka/x3` の形式
- apps と packages を分離した2階層構成
- 変更は可能な限りパッケージ単位で行い、pnpm filter を利用してローカルで検証する

エラー/例外ハンドリング:
- ライブラリ側で抽象エラークラス等が定義されている（packages/x/errors 以下）。API 変更時はそこを参照すること。
# Conventions

- TypeScript strict。any 禁止。関数の引数・戻り値は明示型、ローカルは推論。
- ESM のみ。CommonJS 禁止。
- 共通ロジックは packages/x/src/ に置き、apps での重複を避ける。
- カスタムエラーは packages/x/src/errors/ の abstract-error.ts を継承。generic Error を直接投げない。
- error 処理に console.log を使わない。
- 新規依存の追加は承認を前提に、抽象化は最小限。
- Vite+ 環境では vp コマンドを優先 (AGENTS.md 参照)。
- コメントは補足が必要な箇所のみ。ドキュメント・テスト名は日本語。

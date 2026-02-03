# Hooks System

## Hook の種類

- **PreToolUse**: ツール実行前（バリデーション、パラメータの修正）
- **PostToolUse**: ツール実行後（自動整形、チェック）
- **Stop**: セッション終了時（最終確認）

## 現在の Hook (`~/.claude/settings.json` 内)

### PreToolUse

- **tmux reminder**: 長時間実行されるコマンド（npm, pnpm, yarn, cargo など）に対して tmux の使用を提案
- **git push review**: プッシュ前にレビュー用の Zed を開く
- **doc blocker**: 不要な .md/.txt ファイルの作成をブロック

### PostToolUse

- **PR creation**: PR の URL と GitHub Actions のステータスをログに記録
- **Prettier**: 編集後に JS/TS ファイルを自動整形
- **TypeScript check**: .ts/.tsx ファイル編集後に `tsc` を実行
- **console.log warning**: 編集されたファイル内の `console.log` について警告

### Stop

- **console.log audit**: セッション終了前に、すべての修正済みファイルで `console.log` をチェック

## 権限の自動承認（Auto-Accept Permissions）

注意して使用してください：

- 信頼できる、明確に定義された計画に対して有効化する
- 探索的な作業では無効化する
- `dangerously-skip-permissions` フラグは決して使用しない
- 代わりに `~/.claude.json` の `allowedTools` を設定する

## TodoWrite のベストプラクティス

TodoWrite ツールを使用して以下を行います：

- マルチステップタスクの進捗追跡
- 指示の理解度の確認
- リアルタイムでの方向修正の有効化
- 詳細な実装ステップの提示

Todo リストによって以下の事項が明らかになります：

- 順序が正しくないステップ
- 不足している項目
- 不要な追加項目
- 不適切な粒度
- 誤解された要件
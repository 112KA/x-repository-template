# Git Workflow

## Commit メッセージ形式

```
<type>: <description>

<optional body>

```

**タイプ：** feat, fix, refactor, docs, test, chore, perf, ci

**注意：** 帰属情報は `~/.claude/settings.json` によりグローバルに無効化されています。

## Pull Request Workflow

PR 作成時：

1. 最新のコミットだけでなく、完全なコミット履歴を分析する
2. `git diff [base-branch]...HEAD` を使用してすべての変更を確認する
3. 包括的な PR サマリーを起草する
4. TODO 付きのテスト計画を含める
5. 新しいブランチの場合は、`-u` フラグを使用してプッシュする

## 機能実装ワークフロー

1. **計画（Plan First）**
- **planner** エージェントを使用して実装計画を作成する
- 依存関係とリスクを特定する
- フェーズごとに分解する


2. **TDD アプローチ**
- **tdd-guide** エージェントを使用する
- 最初にテストを書く（RED）
- テストをパスさせる実装を行う（GREEN）
- リファクタリングを行う（IMPROVE）
- 80% 以上のカバレッジを検証する


3. **コードレビュー**
- コード記述後、直ちに **code-reviewer** エージェントを使用する
- クリティカルおよび高優先度の問題に対処する
- 可能な限り中優先度の問題を修正する


4. **コミットとプッシュ**
- 詳細なコミットメッセージを記述する
- Conventional Commits 形式に従う
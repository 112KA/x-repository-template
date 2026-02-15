# Eval Command

評価駆動開発（Evaluation-Driven Development）ワークフローを管理します。

## 使用方法

`/eval [define|check|report|list] [feature-name]`

## Eval の定義

`/eval define feature-name`

新しい Eval 定義を作成します：

1. テンプレートを使用して `.claude/evals/feature-name.md` を作成します：

```markdown
## EVAL: feature-name

作成日：$(date)

### 機能 Eval

- [ ] [機能 1 の説明]
- [ ] [機能 2 の説明]

### 回帰 Eval

- [ ] [既存の振る舞い 1 が引き続き有効であること]
- [ ] [既存の振る舞い 2 が引き続き有効であること]

### 合格基準

- 機能 Eval の pass@3 > 90%
- 回帰 Eval の pass^3 = 100%

```

2. ユーザーに具体的な基準の記入を促します。

## Eval のチェック

`/eval check feature-name`

機能の Eval を実行します：

1. `.claude/evals/feature-name.md` から Eval 定義を読み取ります。
2. 各機能 Eval に対して：

- 基準の検証を試行
- 合格/不合格を記録
- 試行内容を `.claude/evals/feature-name.log` に記録

3. 各回帰 Eval に対して：

- 関連するテストを実行
- 基準値と比較
- 合格/不合格を記録

4. 現在のステータスを報告します：

```
EVAL チェック：feature-name
========================
機能：X/Y 合格
回帰：X/Y 合格
ステータス：進行中 / 完了

```

## Eval レポートの作成

`/eval report feature-name`

包括的な Eval レポートを生成します：

```
EVAL レポート：feature-name
=========================
生成日：$(date)

機能 EVALS
----------------
[eval-1]：合格（pass@1）
[eval-2]：合格（pass@2）- 再試行が必要
[eval-3]：不合格 - 備考を参照

回帰 EVALS
----------------
[test-1]：合格
[test-2]：合格
[test-3]：合格

メトリクス
-------
機能 pass@1：67%
機能 pass@3：100%
回帰 pass^3：100%

備考
-----
[問題点、エッジケース、または観察事項]

推奨事項
--------------
[リリース可 / 改善が必要 / ブロック中]

```

## Eval の一覧表示

`/eval list`

すべての Eval 定義を表示します：

```
EVAL 定義
================
feature-auth      [3/5 合格] 進行中
feature-search    [5/5 合格] 完了
feature-export    [0/4 合格] 未着手

```

## 引数

$ARGUMENTS:

- `define <name>` - 新しい Eval 定義を作成
- `check <name>` - Eval を実行してチェック
- `report <name>` - 詳細なレポートを生成
- `list` - すべての Eval を表示
- `clean` - 古い Eval ログを削除（直近 10 回分を保持）

---
name: continuous-learning-v2
description: Instinct-based learning system that observes sessions via hooks, creates atomic instincts with confidence scoring, and evolves them into skills/commands/agents.
version: 2.0.0
---

# 継続的学習 v2 - 本能ベースのアーキテクチャ

Claude Code セッションを、信頼スコア付きのアトミックな「本能（learned behaviors）」を通じて、再利用可能な知識に変換する高度な学習システム。

## v2 の新機能

| 機能 | v1 | v2 |
| --- | --- | --- |
| 観察 | Stop フック (セッション終了時) | PreToolUse/PostToolUse (100% 確実) |
| 分析 | メインコンテキスト | バックグラウンドエージェント (Haiku) |
| 粒度 | フルスキル | アトミックな「本能」 |
| 信頼度 | なし | 0.3〜0.9 の重み付け |
| 進化 | スキルへ直接 | 本能 → クラスター → スキル/コマンド/エージェント |
| 共有 | なし | 本能の書き出し/読み込み |

## 本能（Instinct）モデル

本能とは、学習された小さな断片的な振る舞いのことです。

```yaml
---
id: prefer-functional-style
trigger: "新しい関数を書くとき"
confidence: 0.7
domain: "code-style"
source: "session-observation"
---

# 関数型スタイルの優先

## アクション
適切な場合には、クラスよりも関数型パターンを使用する。

## エビデンス
- 関数型パターンの優先が 5 回観察された
- 2025-01-15 にユーザーがクラスベースのアプローチを関数型に修正した

```

**特性:**

* **アトミック** — 1 つのトリガーに対し 1 つのアクション。
* **信頼度の重み付け** — 0.3 = 暫定的、0.9 = ほぼ確実。
* **ドメインタグ** — code-style, testing, git, debugging, workflow など。
* **エビデンスに基づく** — どの観察結果から作成されたかを追跡。

## 仕組み

```
セッションアクティビティ
      │
      │ フックがプロンプトとツール使用をキャプチャ (100% 確実)
      ▼
┌─────────────────────────────────────────┐
│         observations.jsonl              │
│   (プロンプト、ツール呼び出し、結果)      │
└─────────────────────────────────────────┘
      │
      │ オブザーバーエージェントが読み取り (バックグラウンド、Haiku)
      ▼
┌─────────────────────────────────────────┐
│            パターン検出                  │
│   • ユーザーの修正 → 本能                │
│   • エラー解決 → 本能                    │
│   • 繰り返されるワークフロー → 本能      │
└─────────────────────────────────────────┘
      │
      │ 作成 / 更新
      ▼
┌─────────────────────────────────────────┐
│         instincts/personal/             │
│   • prefer-functional.md (0.7)          │
│   • always-test-first.md (0.9)          │
│   • use-zod-validation.md (0.6)         │
└─────────────────────────────────────────┘
      │
      │ /evolve コマンドでクラスター化
      ▼
┌─────────────────────────────────────────┐
│               evolved/                  │
│   • commands/new-feature.md             │
│   • skills/testing-workflow.md          │
│   • agents/refactor-specialist.md       │
└─────────────────────────────────────────┘

```

## クイックスタート

### 1. 観察フックを有効にする

`~/.claude/settings.json` に追加します。

**プラグインとしてインストールする場合** (推奨):

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "${CLAUDE_PLUGIN_ROOT}/skills/continuous-learning-v2/hooks/observe.sh pre"
      }]
    }],
    "PostToolUse": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "${CLAUDE_PLUGIN_ROOT}/skills/continuous-learning-v2/hooks/observe.sh post"
      }]
    }]
  }
}

```

**手動で `~/.claude/skills` にインストールする場合**:

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/skills/continuous-learning-v2/hooks/observe.sh pre"
      }]
    }],
    "PostToolUse": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/skills/continuous-learning-v2/hooks/observe.sh post"
      }]
    }]
  }
}

```

### 2. ディレクトリ構造の初期化

Python CLI が自動的に作成しますが、手動で作成することも可能です：

```bash
mkdir -p ~/.claude/homunculus/{instincts/{personal,inherited},evolved/{agents,skills,commands}}
touch ~/.claude/homunculus/observations.jsonl

```

### 3. 本能コマンドを使用する

```bash
/instinct-status     # 信頼スコア付きの学習済み本能を表示
/evolve              # 関連する本能をスキル/コマンドにクラスター化
/instinct-export     # 本能を共有用に書き出し
/instinct-import     # 他者からの本能を読み込み

```

## コマンド一覧

| コマンド | 説明 |
| --- | --- |
| `/instinct-status` | 学習されたすべての本能を信頼度と共に表示 |
| `/evolve` | 関連する本能をスキルやコマンドにまとめる |
| `/instinct-export` | 本能を共有可能な形式でエクスポートする |
| `/instinct-import <file>` | 他のユーザーの本能をインポートする |

## 設定

`config.json` を編集します：

```json
{
  "version": "2.0",
  "observation": {
    "enabled": true,
    "store_path": "~/.claude/homunculus/observations.jsonl",
    "max_file_size_mb": 10,
    "archive_after_days": 7
  },
  "instincts": {
    "personal_path": "~/.claude/homunculus/instincts/personal/",
    "inherited_path": "~/.claude/homunculus/instincts/inherited/",
    "min_confidence": 0.3,
    "auto_approve_threshold": 0.7,
    "confidence_decay_rate": 0.05
  },
  "observer": {
    "enabled": true,
    "model": "haiku",
    "run_interval_minutes": 5,
    "patterns_to_detect": [
      "user_corrections",
      "error_resolutions",
      "repeated_workflows",
      "tool_preferences"
    ]
  },
  "evolution": {
    "cluster_threshold": 3,
    "evolved_path": "~/.claude/homunculus/evolved/"
  }
}

```

## ファイル構造

```
~/.claude/homunculus/
├── identity.json           # ユーザープロフィール、技術レベル
├── observations.jsonl      # 現在のセッションの観察データ
├── observations.archive/   # 処理済みの観察データ
├── instincts/
│   ├── personal/           # 自動学習された本能
│   └── inherited/          # 他者からインポートした本能
└── evolved/
    ├── agents/             # 生成された専門エージェント
    ├── skills/             # 生成されたスキル
    └── commands/           # 生成されたコマンド

```

## 信頼スコア (Confidence Scoring)

信頼度は時間とともに進化します。

| スコア | 意味 | 振る舞い |
| --- | --- | --- |
| 0.3 | 暫定的 | 提案されるが強制はされない |
| 0.5 | 中程度 | 関連性がある場合に適用される |
| 0.7 | 強力 | 適用が自動承認される |
| 0.9 | ほぼ確実 | コアとなる振る舞い |

**信頼度が上がる要因:**

* パターンが繰り返し観察される。
* ユーザーが提案された振る舞いを修正しない。
* 他のソースからの同様の本能と一致する。

**信頼度が下がる要因:**

* ユーザーが明示的にその振る舞いを修正する。
* 長期間そのパターンが観察されない。
* 矛盾するエビデンスが現れる。

## なぜ観察にスキルではなくフックを使うのか？

> 「v1 はスキルの仕組みを利用して観察を行っていました。しかしスキルは確率的であり、Claude の判断に基づいて 50〜80% 程度の確率でしか発動しませんでした。」

フックは **100% 確実**に、決定論的に発動します。これにより：

* すべてのツール呼び出しが観察されます。
* パターンを見逃すことがありません。
* 学習が包括的になります。

## 後方互換性

v2 は v1 と完全に互換性があります：

* 既存の `~/.claude/skills/learned/` スキルは引き続き動作します。
* Stop フックも引き続き動作しますが、v2 にもデータを提供します。
* 並行して実行することで、徐々に移行することが可能です。

## プライバシー

* 観察データはユーザーのローカルマシン内に留まります。
* エクスポートできるのは「本能（パターン）」のみです。
* 実際のコードや会話内容は共有されません。
* 何をエクスポートするかはユーザーが制御できます。

---

*本能ベースの学習：一回一回の観察を通じて、あなたのパターンを Claude に教え込みます。*
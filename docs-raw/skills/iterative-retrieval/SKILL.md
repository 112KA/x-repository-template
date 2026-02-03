---
name: iterative-retrieval
description: Pattern for progressively refining context retrieval to solve the subagent context problem
---

# Iterative Retrieval Pattern

サブエージェントが作業を開始するまで「どのようなコンテキストが必要か」を正確に把握できないという、マルチエージェント・ワークフローにおける「コンテキスト問題」を解決します。

## 課題

サブエージェントは限られたコンテキストで生成されます。そのため、以下の情報が不足しています：

* どのファイルに関連するコードがあるか
* プロジェクト内にどのようなパターンが存在するか
* プロジェクトで使用されている用語（命名規則）

標準的なアプローチの限界：

* **すべて送る**: コンテキスト制限を超過する
* **何も送らない**: エージェントに必要な情報が欠落する
* **必要そうなものを推測する**: 多くの場合、的外れになる

## 解決策：反復的検索 (Iterative Retrieval)

段階的にコンテキストを洗練させる 4 フェーズのループ構造です：

### フェーズ 1: 配信 (DISPATCH)

候補となるファイルを収集するための、最初の広範なクエリ：

```javascript
// 高レベルの意図から開始
const initialQuery = {
  patterns: ['src/**/*.ts', 'lib/**/*.ts'],
  keywords: ['authentication', 'user', 'session'],
  excludes: ['*.test.ts', '*.spec.ts']
};

// 検索エージェントに配信
const candidates = await retrieveFiles(initialQuery);

```

### フェーズ 2: 評価 (EVALUATE)

取得した内容の関連性を評価：

```javascript
function evaluateRelevance(files, task) {
  return files.map(file => ({
    path: file.path,
    relevance: scoreRelevance(file.content, task), // 関連性スコア
    reason: explainRelevance(file.content, task), // 理由
    missingContext: identifyGaps(file.content, task) // 不足しているコンテキストの特定
  }));
}

```

スコアリング基準：

* **高 (0.8-1.0)**: 対象機能を直接実装している
* **中 (0.5-0.7)**: 関連するパターンや型が含まれている
* **低 (0.2-0.4)**: わずかに関連がある
* **なし (0-0.2)**: 関連なし、除外対象

### フェーズ 3: 洗練 (REFINE)

評価に基づいて検索条件を更新：

```javascript
function refineQuery(evaluation, previousQuery) {
  return {
    // 関連性の高いファイルで見つかった新しいパターンを追加
    patterns: [...previousQuery.patterns, ...extractPatterns(evaluation)],

    // コードベースで見つかった用語を追加
    keywords: [...previousQuery.keywords, ...extractKeywords(evaluation)],

    // 関連性がないと確定したパスを除外
    excludes: [...previousQuery.excludes, ...evaluation
      .filter(e => e.relevance < 0.2)
      .map(e => e.path)
    ],

    // 特定の不足部分に焦点を当てる
    focusAreas: evaluation
      .flatMap(e => e.missingContext)
      .filter(unique)
  };
}

```

### フェーズ 4: ループ (LOOP)

洗練された条件で繰り返す（最大 3 サイクル）：

```javascript
async function iterativeRetrieve(task, maxCycles = 3) {
  let query = createInitialQuery(task);
  let bestContext = [];

  for (let cycle = 0; cycle < maxCycles; cycle++) {
    const candidates = await retrieveFiles(query);
    const evaluation = evaluateRelevance(candidates, task);

    // 十分なコンテキストがあるか確認
    const highRelevance = evaluation.filter(e => e.relevance >= 0.7);
    if (highRelevance.length >= 3 && !hasCriticalGaps(evaluation)) {
      return highRelevance;
    }

    // 条件を洗練させて継続
    query = refineQuery(evaluation, query);
    bestContext = mergeContext(bestContext, highRelevance);
  }

  return bestContext;
}

```

## 具体的な例

### 例 1: バグ修正のコンテキスト

```
タスク: 「認証トークンの期限切れバグを修正する」

サイクル 1:
  配信: src/** 内の "token", "auth", "expiry" を検索
  評価: auth.ts (0.9), tokens.ts (0.8), user.ts (0.3) を発見
  洗練: "refresh", "jwt" キーワードを追加。user.ts を除外。

サイクル 2:
  配信: 洗練された用語で検索
  評価: session-manager.ts (0.95), jwt-utils.ts (0.85) を発見
  洗練: 十分なコンテキスト（高関連ファイルが複数）

結果: auth.ts, tokens.ts, session-manager.ts, jwt-utils.ts

```

### 例 2: 機能実装

```
タスク: 「API エンドポイントにレート制限を追加する」

サイクル 1:
  配信: routes/** 内の "rate", "limit", "api" を検索
  評価: 一致なし — コードベースでは "throttle" という用語を使用している
  洗練: "throttle", "middleware" キーワードを追加

サイクル 2:
  配信: 洗練された用語で検索
  評価: throttle.ts (0.9), middleware/index.ts (0.7) を発見
  洗練: ルーターのパターンが必要

サイクル 3:
  配信: "router", "express" パターンを検索
  評価: router-setup.ts (0.8) を発見
  洗練: 十分なコンテキスト

結果: throttle.ts, middleware/index.ts, router-setup.ts

```

## エージェントへの統合

エージェントのプロンプトで以下のように指示します：

```markdown
このタスクのコンテキストを取得する際：
1. まずは広範なキーワード検索から始めてください。
2. 各ファイルの関連性を評価してください（0〜1 スケール）。
3. まだ不足しているコンテキストを特定してください。
4. 検索条件を洗練させ、繰り返してください（最大 3 サイクル）。
5. 関連性が 0.7 以上のファイルを返してください。

```

## ベストプラクティス

1. **広く開始し、徐々に絞り込む**: 最初のクエリで条件を詰め込みすぎない。
2. **コードベースの用語を学ぶ**: 最初のサイクルで命名規則が明らかになることが多い。
3. **何が不足しているかを追跡する**: 明示的にギャップを特定することが洗練に繋がる。
4. **「十分な」ところで止める**: 10 個の平凡なファイルより、3 個の高関連ファイルの方が価値がある。
5. **自信を持って除外する**: 関連性の低いファイルが、後のサイクルで急に関連度を増すことは稀である。
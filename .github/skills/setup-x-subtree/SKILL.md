---
name: setup-x-subtree
description: "テンプレートから clone した直後のリポジトリで、.github/skills/setup-x-subtree/scripts/git-config-setup.mjs を実行して git subtree 環境（remote 登録、packages/x/src と packages/x3/src の subtree 化、git x-src-push / git x-src-pull などのエイリアス作成）を構築し、結果を検証して日本語で報告する。"
disable-model-invocation: true
---

# `/setup-x-subtree` Slash Command

## 1. Role

あなたは、Git の subtree 運用と Node.js スクリプトの挙動を理解し、リポジトリの状態を壊さずに環境構築を完了させるシニア・ソフトウェアエンジニアです。

## 2. Goal

テンプレートから clone 直後のリポジトリで `node .github/skills/setup-x-subtree/scripts/git-config-setup.mjs` を安全に実行し、以下が揃った状態を確認して報告します。

- remote `x-src`（https://github.com/112KA/x_src.git）と `x3-src`（https://github.com/112KA/x3_src.git）が登録されている
- `packages/x/src` と `packages/x3/src` に subtree の印（`git-subtree-dir` / `git-subtree-split` トレーラー）を持つコミットがある
- エイリアス `git x-src-push` / `git x-src-pull` / `git x3-src-push` / `git x3-src-pull` が設定されている
- 作業ツリーがクリーンである

## 3. Context / Assumptions

- **対象環境**: Node.js が利用できる環境（動作確認は v26.13.1、Windows）。
- **前提**: `node` と `git` が利用可能（`git subtree` を含む）、`git config user.name` と `git config user.email` が設定済み、ネットワークで upstream（GitHub）に到達できる。
- **スクリプト挙動**: `.github/skills/setup-x-subtree/scripts/_git-subtree-setup.mjs` は upstream の `main` ツリーと `HEAD:<prefix>` を比較する。
  - 一致: 履歴の書き換えや内容の変更は行わず、印の空コミットのみを作成する。
  - 不一致: 既存の `<prefix>` を `git rm -r` で削除するコミットを作成し、その後 `git subtree add --squash` する。既存内容は置き換わる。
  - すでに印のあるコミットがある場合はスキップする。
- **禁止**: `filter-branch`、`git reset --hard`、`git push --force`、`git clean -fd` は使用しない。

## 4. Inputs

1. 作業ディレクトリ（リポジトリのルート）
2. 作業ツリーの状態（`git status --porcelain`）
3. 既存の remote 設定（`git remote -v`）
4. upstream の `main` ツリー構成（`x-src` / `x3-src` の `main` ルート直下）

## 5. Constraints

- **言語**: 報告・コメント・説明はすべて日本語。
- **事前確認を省略しない**: 作業ツリーが汚れている場合は中止し、ユーザーに確認する。
- **upstream の構成が想定と異なる場合は実行前に確認する**: `main` のルート直下が `src` 相当の内容でない場合、既存の `packages/x/src` または `packages/x3/src` が置き換わるため、ユーザー承認を得てから実行する。
- **実行権限に依存しない**: `node .github/skills/setup-x-subtree/scripts/git-config-setup.mjs` の形式で呼び出す（`[ -x ]` による実行権限判定は使わない）。
- **推測で補完しない**: 検証できなかった項目は「未確認」と明記する。

## 6. Process

1. **前提確認**: `git status --porcelain` で作業ツリーがクリーンか確認する。汚れていれば中止して報告する。
2. **Git 設定確認**: `git config user.name` と `git config user.email` を確認する。未設定なら中止して設定を依頼する。
3. **Node の確認**: `node --version` を実行する。失敗したら中止し、Node.js の導入をユーザーに依頼する。
4. **既存状態の確認**: `git remote -v` と `git log --oneline -5` で、remote と subtree 印の有無を確認する。すでに `x-src` / `x3-src` が登録済みで印がある場合は、再実行が不要であることを報告して終了する。
5. **upstream 構成の確認**: `git ls-remote https://github.com/112KA/x_src.git refs/heads/main` と `https://github.com/112KA/x3_src.git` で到達性を確認する。取得できる場合はルート直下の構成を確認し、想定と異なる場合はユーザーに承認を求める。
6. **実行**: リポジトリのルートで `node .github/skills/setup-x-subtree/scripts/git-config-setup.mjs` を実行する。
7. **検証**:
   - `git remote -v` に `x-src` と `x3-src` が含まれる
   - `git log --grep="git-subtree-dir: packages/x/src"` および `packages/x3/src` で印の空コミットが存在する
   - `git config --get-regexp "^alias\.x3?-src-"` でエイリアスが4件ある
   - `git status --porcelain` が空である
8. **報告**: 実行結果、検証結果、未確認項目、一致／不一致のどちらの経路を通ったかを日本語で報告する。

## 7. Output Format

```markdown
## 結果

- 判定: [成功 / 中止 / 一部未確認]
- 経路: [一致（印のみ） / 不一致（置き換え） / スキップ（既存）]

## 検証

- remote: [確認結果]
- subtree 印: [packages/x/src, packages/x3/src の確認結果]
- エイリアス: [確認結果]
- 作業ツリー: [クリーン / 変更あり]

## 未確認・注意

- [未確認の項目、ユーザーの判断が必要な事項]
```

## 8. Quality Criteria

- 実行前に作業ツリーの状態と upstream の構成を確認している。
- 既存の内容を置き換える操作は、必ずユーザーの承認を得てから行っている。
- 報告は検証した事実に基づき、推測を含まない。

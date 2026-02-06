---
name: codemap
description: Generates a CodeMap document for a specific package or the entire repository based on the current codebase structure and saves it to the docs/codemaps/ directory when the --write option is specified.
---
# `/codemap` Slash Command

## Task:
指定された対象（package または index）について、
現在のコードベースの構造から CodeMap ドキュメントを生成し、
docs/codemaps/ 配下への出力内容を作成する。

---

### 基本構文

`/codemap <target> [options]`

---

### 対象（target）

- `package <name>`
  - 指定した package / service 単体の CodeMap を生成します
  - 出力先: `docs/codemaps/<name>.md`

- `index`
  - リポジトリ全体の構造 CodeMap を生成します
  - 出力先: `docs/codemaps/index.md`

---

### オプション（options）

- `--mode=full`
  - 構造・依存関係・境界をすべて出力します（デフォルト）

- `--mode=summary`
  - Role / Dependencies / Boundary のみを簡潔に出力します

- `--diff`
  - 既存 CodeMap がある場合、変更点のみを表示します
  - ファイルは自動更新されません

- `--write`
  - 生成結果をファイルに書き込みます
  - 指定がない場合はプレビューのみ行います

---

### 使用例

- 単一 package の CodeMap を生成（プレビュー）

`/codemap package core`

- 単一 package の CodeMap を生成して書き込み

`/codemap package core --write`

- 変更点のみ確認

`/codemap package core --diff`

- 全体構造（index）を生成

`/codemap index`

- 全体構造を簡潔に生成して書き込み

`/codemap index --mode=summary --write`

---

## Guideline:
- 実際のコード構造のみを唯一の真実のソースとして使用する
- 推測、設計意図、将来予定は一切含めない
- CodeMap は定められたテンプレートと表現ルールに厳密に従う
- ASCII 図を用いて構造と依存関係を表現する
- 既存ファイルは --write が明示的に指定された場合のみ更新する
- index 生成時に package 単体の CodeMap は更新しない
- Document Updater の責務（人間向け説明の更新）には踏み込まない
- 出力形式は docs/codemaps/ 配下で使用されている既存テンプレートに従う
- 開発者が5分で理解できる内容とする
- Do not repeat the same concept in different sections
- Each bullet must introduce new information


## Output
- 以下のテンプレートを構造を変えずに埋めてください。
- 見出し、順序、表の形は変更してはいけません。

### `docs/codemaps/index.md`
```markdown
# System Architecture
**最終更新：** YYYY-MM-DD
## 1. Tech Stack
## 2. Project Structure
## 3. Design Principles
## 4. Package Dependencies
## 5. Applications Overview
```

### `docs/codemaps/<package>.md`
```markdown
# [package.jsonのnameを記載] Codemap

**最終更新：** YYYY-MM-DD
**エントリポイント：** [list of main files]

## Overview
## Package Structure
## Key Modules
## Data Flow
## External Dependencies
```


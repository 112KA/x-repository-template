# Document Rules

## ドキュメント構成

本リポジトリはテンプレートリポジトリとして機能するため、ドキュメントは汎用的な構造で管理されています。

### ドキュメント一覧（3分で理解）

#### 仕様・概要

| ファイル | 内容 | 第一階層見出し |
|---------|------|--------------|
| PRODUCT.md | プロダクト仕様と機能一覧 | 概要、Key Features、Architecture、Design Philosophy |

#### アーキテクチャドキュメント（docs/codemaps/）

| ファイル | 内容 | 第一階層見出し |
|---------|------|--------------|
| index.md | モノレポ全体構造と技術スタック | Repository Structure、Applications、Packages、Monorepo Patterns、Technology Stack |
| app-{framework}.md | 各アプリケーションの詳細構成 | Overview、Key Features、Dependencies、Build System、Routes Structure |
| package-{name}.md | 各パッケージのモジュール詳細 | Overview、Module Reference、Exports、Testing、Development、Integration |

#### 開発ガイド（docs/guides/）

| ファイル | 内容 | 第一階層見出し |
|---------|------|--------------|
| setup.md | セットアップ手順 | クイックスタート、開発サーバー起動、Project Structure、トラブルシューティング |
| development.md | 詳細な開発ワークフロー | セットアップ、開発ワークフロー、よく使うコマンド、ファイル構造、モノレポパターン |

### テンプレート化ルール

テンプレートとして利用する際の命名・構成規則：

#### アプリケーション（apps/）
- **ドキュメント**: `docs/codemaps/app-{framework}.md`
- **内容抽象化**: フレームワーク名を{framework}に置換
- **記載項目**:
  - Framework/Version情報
  - Build Tool
  - Key Features
  - Dependencies
  - Development Commands
  - Routes Structure（該当時）

#### パッケージ（packages/）
- **ドキュメント**: `docs/codemaps/packages-{name}.md`
- **内容抽象化**: パッケージ名を{name}に置換
- **記載項目**:
  - Version情報
  - Module Reference（ディレクトリ構成）
  - 各モジュール機能説明
  - Exports / API
  - Testing / Development
  - Integration Examples

### 更新タイミング

以下の場合はドキュメント更新が必要：

- **apps/** にアプリケーション追加時 → `docs/codemaps/app-{framework}.md` を新規作成
- **packages/** にパッケージ追加時 → `docs/codemaps/packages-{name}.md` を新規作成
- 既存アプリ/パッケージに機能追加時 → 対応するコードマップを更新
- コマンドやスクリプト変更時 → `docs/guides/` を更新

### 記載のポイント

✓ 第一階層見出しは5個以下に統一  
✓ 各セクションは簡潔に（1-3段落）  
✓ コード例は実行可能なコマンドのみ記載  
✓ ファイルパスは相対パスで統一  
✓ Cross-reference を充実（関連ドキュメントへのリンク）
# 初期設定（リポジトリ管理者向け）

このセクションはリポジトリを新規に立ち上げる際にのみ実施してください。

1. project概要の記載

- package.jsonのdescriptionにproject概要を記載してください

2. serena MCPの準備

- エディタで `.serena/project.yml` を開き、`project name` を自身のプロジェクト名に置き換えてください

3. 利用するapp, packageを整理

- 不要な環境を整理し、必要なpackageを追加してください

4. app, packageのcontextをmemory保存

- 各app, packageで`/generate-package-memory`プロンプトを実行し、`.serena/memories/*`以下に解析結果のコンテキストを保存

# [x-repository-template](https://github.com/112KA/x-repository-template)

## リポジトリ管理者向け初期設定

[docs/guides/setup-maintainer.md](docs/guides/setup-maintainer.md)に記載

## git subtree セットアップ（テンプレートから clone した直後）

`.github/skills/setup-x-subtree/scripts/git-config-setup.mjs` は、`x-src`（`packages/x/src`）と `x3-src`（`packages/x3/src`）を git subtree として登録します。実行前に次の前提条件を満たしてください。

- Node.js が利用できること（動作確認は v26.13.1）
- `git subtree` コマンドが利用できること（Git for Windows には同梱されています）
- `git config user.name` と `git config user.email` が設定されていること（削除コミットや印用コミットを作成するため）
- 作業ツリーがクリーンであること（未コミットの変更があると中止します）
- `https://github.com/112KA/x_src.git` と `https://github.com/112KA/x3_src.git` に読み取り権限でアクセスできること
- 各 upstream の `main` ブランチのルート構成が、`packages/x/src` と `packages/x3/src` の中身と一致すること

内容が一致する場合は、履歴に同期済みの印を付けるだけで、既存ファイルは変更しません。一致しない場合は、既存の `packages/x/src` と `packages/x3/src` を削除するコミットを作成し、upstream の内容で置き換えます。置き換えを避けたい場合は、事前に upstream の構成を確認してください。

```bash
node .github/skills/setup-x-subtree/scripts/git-config-setup.mjs
```

## Documentation

- [プロジェクト概要](docs/PRODUCT.md)
- [setupガイド](docs/guides/setup.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

# タスク完了チェックリスト

タスクが完了した際に実行すべきステップ:

## 1. コードの品質チェック

```bash
# リンティングと自動修正
pnpm lint:fix
```

## 2. テストの実行

```bash
# 該当プロジェクトのテスト実行
pnpm app:nextjs test  # Next.js の場合
# または
pnpm -F <package-name> test
```

## 3. ビルドの確認 (必要に応じて)

```bash
# パッケージのビルド
pnpm build
```

## 4. Git コミット

```bash
# 変更をステージング
git add .

# Conventional Commits 形式でコミット
git commit -m "feat: add new feature"
# または
git commit -m "fix: correct bug"
# または
git commit -m "refactor: improve code structure"
```

参考: [Commit メッセージ形式](./git-workflow.md)

## 5. プッシュ

```bash
git push
```

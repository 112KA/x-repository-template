# Update Code Maps Command

コードベースの構造を分析し、アーキテクチャドキュメントを更新します。

1. **すべてのソースファイルの imports、exports、および依存関係の確認**
2. **以下の形式で簡潔なコードマップを生成：**
- `codemaps/architecture.md` - 全体アーキテクチャ
- `codemaps/backend.md` - バックエンド構造
- `codemaps/frontend.md` - フロントエンド構造
- `codemaps/data.md` - データモデルとスキーマ


3. **前バージョンとの差異（パーセンテージ）の算出**
4. **変更が 30% を超える場合は、更新前にユーザーの承認を要求**
5. **各コードマップに最新のタイムスタンプを追加**
6. **レポートを `.reports/codemap-diff.txt` に保存**

分析には TypeScript/Node.js を使用します。実装の詳細ではなく、ハイレベルな構造に焦点を当てます。
# 推奨コマンド一覧

## 開発コマンド
```bash
# 開発サーバーの起動
yarn start

# ビルド（本番環境用の静的ファイル生成）
yarn build

# ビルドしたファイルのローカルサーブ
yarn serve

# TypeScriptの型チェック
yarn typecheck

# Docusaurusキャッシュのクリア
yarn clear
```

## コンテンツ校正・品質管理
```bash
# textlintによる文章校正チェック
yarn textlint:check

# textlintによる自動修正
yarn textlint:fix
```

## Git関連（macOS用）
```bash
# ファイル検索
find . -name "*.md" -type f

# ディレクトリ一覧
ls -la

# ファイル内容検索
grep -r "検索文字列" docs/

# Git操作
git status
git add .
git commit -m "コミットメッセージ"
git push
```

## プロジェクト管理
```bash
# 依存関係のインストール
yarn install

# パッケージ情報確認
yarn list

# プロジェクト全体の情報確認
yarn info
```

## 注意事項
- commitする前には自動的にtextlintが実行されます（pre-commit hook）
- Node.js 18.0以上が必要です
- 日本語のMarkdownファイルは必ずtextlintチェックを通してください
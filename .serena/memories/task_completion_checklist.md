# タスク完了時の実行事項

## 必須チェック項目

### 1. textlintによる校正チェック
```bash
# Markdownファイルの校正チェック
yarn textlint:check

# 自動修正可能な問題の修正
yarn textlint:fix
```

### 2. TypeScript型チェック
```bash
# 型エラーの確認
yarn typecheck
```

### 3. ビルドテスト
```bash
# 本番ビルドの確認
yarn build
```

### 4. ローカル確認
```bash
# 開発サーバーでの動作確認
yarn start
```

## Git作業

### 5. コミット前の準備
```bash
# 変更ファイルの確認
git status

# ステージング
git add .

# コミット（pre-commit hookでtextlintが自動実行される）
git commit -m "適切なコミットメッセージ"
```

### 6. プッシュとPR
```bash
# リモートリポジトリへのプッシュ
git push

# GitHub上でPull Requestを作成
```

## 品質確認事項

### コンテンツ品質
- [ ] 全てのコードは実際に動作することを確認
- [ ] 最新の技術スタックに準拠
- [ ] 各レッスンで明確な学習目標を設定
- [ ] 初心者でも理解できる段階的な説明

### 技術的確認
- [ ] 画像ファイルが適切な場所に配置されている
- [ ] リンクが正しく機能する
- [ ] Markdownの構文が正しい
- [ ] 絵文字が適切に使用されている

## 注意事項
- pre-commit hookによりコミット時にtextlintが自動実行される
- textlintエラーがある場合はコミットできない
- GitHub Actionsでも再度textlintチェックが実行される
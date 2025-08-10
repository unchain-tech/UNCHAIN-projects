# UNCHAIN Projects - タスク完了チェックリスト（最新版）

## 必須チェック項目

### 1. textlintによる校正チェック ⭐ 重要度：最高
```bash
# Markdownファイルの校正チェック
yarn textlint:check

# 自動修正可能な問題の修正（推奨）
yarn textlint:fix

# 特定ファイルの修正
npx textlint --fix [file-path]
```

**textlint対応のベストプラクティス:**
- 大量エラー発生時は `--fix` フラグで自動修正を優先実行
- 手動修正が必要なエラーは少数のため、個別対応
- 全角・半角文字間のスペース問題が最も頻発

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

## Git作業プロセス

### 5. コミット前の準備
```bash
# 変更ファイルの確認
git status

# ステージング
git add .

# コミット（lint-stagedでtextlintが自動実行される）
git commit -m "適切なコミットメッセージ"
```

**⚠️ lint-staged注意事項:**
- commit時にtextlintエラーがあるとコミット失敗
- エラー発生時は以下の手順で対応:
  1. `npx textlint --fix [エラーファイル]` で自動修正
  2. 再度 `git add .` でステージング
  3. `git commit` でコミット実行

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
- [ ] **textlint準拠**: 日本語技術文書として適切な表記

### 技術的確認
- [ ] 画像ファイルが適切な場所に配置されている
- [ ] リンクが正しく機能する
- [ ] Markdownの構文が正しい
- [ ] 絵文字が適切に使用されている
- [ ] **ファイルパス**: 実際のプロジェクト構造と一致

## textlint頻出エラーパターンと対策

### 1. 全角・半角文字間スペース（ja-spacing/ja-space-between-half-and-full-width）
```markdown
❌ 日本語 と英語の間
✅ 日本語と英語の間
```

### 2. インラインコード前後スペース（ja-spacing/ja-space-around-code）
```markdown
❌ コードは `useState` です
✅ コードは`useState`です
```

### 3. 技術用語統一（prh）
```markdown
❌ Web3、(括弧)
✅ web3、（括弧）
```

### 4. 連続感嘆符（ja-technical-writing/ja-no-successive-word）
```markdown
❌ すごい！！
✅ すごい！ または すごい!!
```

## 注意事項
- **lint-staged**: コミット時に自動でtextlintが実行される
- **GitHub Actions**: プッシュ時にも再度品質チェックが実行される
- **MCP Serena**: 大規模修正時はSerenaツールを活用して効率化
- **自動修正**: 手動修正の前に必ず `textlint --fix` を実行

## 最近の実績
- **Base ZK NFT Project**: 67件のtextlintエラーを100%解決（2025年8月10日）
- **修正効率**: 65件を自動修正、2件を手動対応
- **品質向上**: lint-staged正常通過、コミットプロセス改善
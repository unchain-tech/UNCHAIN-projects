# GitHub Copilot カスタムインストラクション - UNCHAIN Projects

## プロジェクト概要
このリポジトリは、UNCHAIN Developer Communityが提供するWeb3・ブロックチェーン学習プラットフォームです。

Docusaurusを使用した静的サイトとして構築され、様々なブロックチェーンチェーン（Ethereum、Polygon、Avalanche、NEAR、Solana、ICP、Astar、XRPLなど）でのdApp開発チュートリアルを提供しています。

## 技術スタック
- **フレームワーク**: Docusaurus 3.8.1
- **言語**: TypeScript, JavaScript, Markdown
- **フロントエンド**: React 18, MDX
- **ツール**: textlint, prh（校正チェック）
- **デプロイ**: GitHub Pages
- **開発言語**: 日本語メイン

## コーディング規約・スタイル

### Markdown
- 日本語のtech記事・チュートリアル形式に従う
- セクション番号とレッスン番号の階層構造を維持
- 絵文字を効果的に使用（👋、🛠、⚡️、🙋‍♂️など）
- コードブロックには適切な言語指定を行う
- 画像は`/images/`フォルダ配下に配置

### TypeScript/JavaScript
- React 18のモダンな書き方（関数コンポーネント、Hooks）
- Docusaurus設定はTypeScriptで記述
- 厳密な型定義を推奨

### テキスト校正
- textlintルールに従った日本語表記
- `prh.yml`で定義された表記揺れ防止ルールを遵守
- 技術用語の統一（例：スマートコントラクト、ブロックチェーン、dApp等）

## プロジェクト構造の理解

### チュートリアル構造
各プロジェクトは以下の構造を持つ：
```
docs/[PROJECT-NAME]/ja/
  section-0/
    lesson-1_プロジェクト概要
  section-1/
    lesson-1_環境構築
  section-N/
    lesson-M_具体的な実装内容
```

### 共通パターン
- セクション0: プロジェクト概要・動機
- セクション1: 環境構築・初期設定
- セクション2以降: 段階的な機能実装
- 最終セクション: デプロイ・公開

### 標準的なファイル構成
- `lesson-1_XXX.md`: メインコンテンツ
- 画像: `/static/images/[PROJECT-NAME]/`
- コード例: チュートリアル内にインライン記述

## Web3・ブロックチェーン特有の考慮事項

### サポートするチェーン
- **Ethereum**: Solidity、Hardhat、ethers.js
- **Polygon**: EVM互換、ガス効率重視
- **Avalanche**: C-Chain、Subnet作成
- **NEAR**: Rust、AssemblyScript
- **Solana**: Rust、Anchor Framework
- **ICP**: Motoko、Internet Computer
- **Astar**: Polkadot Parachain
- **XRPL**: XRP Ledger

### 開発ツール・フレームワーク
- **スマートコントラクト**: Solidity、Rust、Motoko
- **フロントエンド**: Next.js、TypeScript
- **ウォレット連携**: MetaMask、Phantom、NEAR Wallet、Privy、Web3 Auth、WalletConnect、Rainbow Kit
- **Web3特化のSDK**： Viem、wagmi、ethers.js
- **テストネット**: 各チェーンのテストネット使用を前提

### セキュリティ・ベストプラクティス
- 秘密鍵の安全な管理方法を説明
- テストネット使用の徹底
- スマートコントラクトの基本的なセキュリティパターン

## コンテンツ作成ガイドライン

### 学習者への配慮
- 初心者向けの丁寧な説明
- 段階的な難易度設定
- 実際に動作するコード例の提供
- トラブルシューティング情報の充実

### 品質基準
- 全てのコードは実際に動作することを確認
- 最新の技術スタックに準拠
- 各レッスンで明確な学習目標を設定
- 実用的なプロジェクトの構築

### コミュニティ要素
- Discord質問フォーマットの提示
- GitHub Pull Requestの推奨
- オープンソース精神の促進

## 特殊な記法・規約

### 質問セクション
```markdown
### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#[channel-name]`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```
```

### プロジェクトアップグレード推奨
各プロジェクトの最後には以下のセクションを含める：
```markdown
### 🌍 プロジェクトをアップグレードする

[UNCHAIN](https://unchain.tech/) のプロジェクトは [UNCHAIN License](https://github.com/unchain-tech/UNCHAIN-projects/blob/main/LICENSE) により運用されています。

プロジェクトに参加していて、「こうすればもっと分かりやすいのに!」「これは間違っている!」と思ったら、ぜひ`pull request`を送ってください。
```

## 新しいコンテンツ作成時の注意点

1. **技術的正確性**: 最新のAPIや推奨パターンを使用
2. **アクセシビリティ**: 初心者でも理解できる段階的な説明
3. **実用性**: 実際のdApp開発で使える技術・パターンを重視
4. **継続性**: プロジェクト間での一貫性とプログレッション

## ブランチ・開発フロー
- メインブランチ: `main`
- GitHub Pagesでの自動デプロイ
- Pull Requestベースの協働開発

## MCP（Model Context Protocol）サーバー連携

### 🚀 セッション開始時の自動実行
GitHub Copilotとの会話開始時に、**必ず以下の手順を自動実行**してください：

1. **プロジェクトアクティベート**
   ```
   mcp_serena_activate_project("/Users/harukikondo/git/UNCHAIN-projects")
   ```

2. **オンボーディング確認**
   ```
   mcp_serena_check_onboarding_performed()
   ```

3. **初回の場合はオンボーディング実行**
   ```
   mcp_serena_onboarding() # オンボーディングが未実行の場合のみ
   ```

4. **プロジェクト記憶の確認**
   ```
   mcp_serena_list_memories()
   ```

### プロジェクト作業時の推奨フロー
- **ファイル編集前**: `mcp_serena_find_symbol` または `mcp_serena_search_for_pattern` でコンテキスト確認
- **大規模変更前**: `mcp_serena_think_about_task_adherence` で作業方針の確認  
- **作業完了時**: `mcp_serena_think_about_whether_you_are_done` で完了確認

---

このインストラクションに従って、Web3・ブロックチェーン学習コンテンツとして適切で、初心者にとって分かりやすく、かつ技術的に正確なコードとドキュメントの生成をサポートしてください。

Serena MCPを活用してプロジェクトの構造と状態を常に把握し、効率的な開発支援を行ってください。

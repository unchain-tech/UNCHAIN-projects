# UNCHAIN-projects プロジェクト概要

## プロジェクトの目的
UNCHAIN-projectsは、Web3・ブロックチェーン学習プラットフォームです。UNCHAIN Developer Communityが提供する教育コンテンツで、様々なブロックチェーンチェーン（Ethereum、Polygon、Avalanche、NEAR、Solana、ICP、Astar、XRPLなど）でのdApp開発チュートリアルを提供しています。

## 技術スタック
- **フレームワーク**: Docusaurus 3.8.1
- **言語**: TypeScript, JavaScript, Markdown
- **フロントエンド**: React 18, MDX
- **開発言語**: 日本語メイン
- **デプロイ**: GitHub Pages
- **Node.js**: 18.0以上が必要

## プロジェクト構造
```
UNCHAIN-projects/
├── docs/                 # メインコンテンツ（各ブロックチェーンのチュートリアル）
│   ├── Ethereum/
│   ├── Polygon/
│   ├── Avalanche/
│   ├── NEAR/
│   ├── Solana/
│   ├── ICP/
│   ├── AstarNetwork/
│   ├── TheGraph/
│   └── XRPLedger/
├── static/               # 静的ファイル（画像など）
├── public/               # パブリックファイル
├── package.json          # プロジェクト設定・依存関係
├── docusaurus.config.ts  # Docusaurus設定
├── sidebars.ts          # サイドバー設定
├── .textlintrc          # textlint設定
├── prh.yml              # 表記揺れ防止設定
└── README.md            # プロジェクトドキュメント
```

## 特徴
- 初心者向けの段階的なWeb3・ブロックチェーン学習コンテンツ
- 実際に動作するコード例の提供
- Discord質問サポート
- オープンソースでのコミュニティ開発
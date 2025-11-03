---
title: プロジェクトのセットアップ
---

### 🛠 開発環境の準備

このレッスンでは、プロジェクトの開発環境をセットアップします。

### 📋 必要な環境

以下のツールがインストールされていることを確認してください：

- **Node.js**：v18以上
- **npm**または**yarn**：パッケージマネージャー
- **Git**：バージョン管理

### 🚀 プロジェクトの作成

まず、Next.jsプロジェクトを作成します。

```bash
npx create-next-app@latest ai-agent-jpyc-chat --typescript --tailwind --app
cd ai-agent-jpyc-chat
```

オプションの選択：
- TypeScript：Yes
- ESLint：Yes
- Tailwind CSS：Yes
- `src/` directory：Yes
- App Router：Yes
- Import alias：No（または@を使用）

### 📦 依存関係のインストール

必要なパッケージをインストールします：

```bash
# Mastraフレームワーク
npm install @mastra/core @mastra/mcp

# JPYC SDK
npm install @jpyc/sdk

# Web3関連
npm install ethers viem

# Claude API
npm install @anthropic-ai/sdk

# その他のユーティリティ
npm install zod dotenv
```

開発用の依存関係もインストールします：

```bash
npm install -D @types/node typescript
```

### 📁 プロジェクト構造の作成

以下のディレクトリ構造を作成します：

```
ai-agent-jpyc-chat/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── lib/
│   │   ├── mastra/
│   │   │   ├── agent.ts
│   │   │   └── tools.ts
│   │   └── mcp/
│   │       └── server.ts
│   └── components/
│       └── ChatInterface.tsx
├── .env.local
├── package.json
└── tsconfig.json
```

必要なディレクトリを作成します：

```bash
mkdir -p src/lib/mastra
mkdir -p src/lib/mcp
mkdir -p src/app/api/chat
mkdir -p src/components
```

### 🔑 環境変数の設定

`.env.local`ファイルを作成し、必要な環境変数を設定します：

```bash
# Claude API
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# JPYC設定
JPYC_NETWORK=polygon
JPYC_RPC_URL=https://polygon-rpc.com

# ウォレット設定（テスト用）
WALLET_PRIVATE_KEY=your_test_wallet_private_key_here

# アプリケーション設定
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**重要**：
- `.env.local`は`.gitignore`に含まれていることを確認してください
- 本番環境では、秘密鍵を環境変数として安全に管理してください

### 🧪 セットアップの確認

開発サーバーを起動して、セットアップが正しく完了したか確認します：

```bash
npm run dev
```

ブラウザで`http://localhost:3000`を開き、Next.jsのデフォルトページが表示されることを確認してください。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#ai`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット

---

次のレッスンでは、MCPサーバーの実装を始めます！

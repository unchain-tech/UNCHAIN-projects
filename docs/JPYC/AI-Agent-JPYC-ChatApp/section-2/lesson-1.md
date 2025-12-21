---
title: プロジェクトのセットアップ
---

### 🛠 開発環境の準備

このレッスンでは、プロジェクトの開発環境をセットアップします。

### 📋 必要な環境

以下のツールがインストールされていることを確認してください：

- **Node.js**：v22以上
- **npm**または**yarn**：パッケージマネージャー
- **Git**：バージョン管理

### 🚀 プロジェクトの作成

まず、スターターリポジトリをクローンしてきます。

スターターリポジトリは以下のリンクからアクセスできます：

**https://github.com/unchain-tech/jpyc-ai-agent**

**自分のGitHubアカウントにフォークしていない場合は、まずフォークしてきましょう！**

```bash
git clone https://github.com/<your_github_account_name>/jpyc-ai-agent
cd jpyc-ai-agent
```

### 📦 依存関係のインストールとコンパイル

必要なパッケージをインストールします：

```bash
pnpm install

# JPYC SDK Coreパッケージをコンパイル
cd external/jpyc-sdk/packages/core
pnpm run compile
```

これで`external/jpyc-sdk/packages/core/dist`フォルダが作成され、TypeScriptの型定義とコンパイル済みのコードが生成されます。

### 📁 プロジェクト構造の作成

`jpyc-ai-agent`以下のディレクトリ構造が以下のようになっているかを確認します。

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
mkdir -p src/app/api/chat
mkdir -p src/components
```

### 🔑 環境変数の設定

`.env.local`ファイルを作成し、必要な環境変数を設定します：

```bash
cp .env.local.example .env.local
```

以下の値を設定します。

LLMはGPT、Gemini、Claudeのいずれを使用しても良いですが、**Claude**の利用を推奨します。

**Claude**の利用には**Anthropic**のコンソールでAPIキーを発行する必要があります。

以下のサイトにアクセスしてAPIキーを発行してください。

https://console.anthropic.com/settings/keys

```bash
# JPYC AI Agent - 環境変数設定
# ⚠️ 本番環境では絶対に使用しないでください！テストネット専用です
# ⚠️ このファイルをGitにコミットしないでください！

# サーバーサイドでのトランザクション署名用（Sepolia Testnet）
PRIVATE_KEY=0x...
# AI API Keys(Claudeの利用を推奨します。)
OPENAI_API_KEY=sk-...
GOOGLE_GENERATIVE_AI_API_KEY=
ANTHROPIC_API_KEY=
# JPYC MCPサーバーURL
JPYC_MCP_SERVER_URL="http://localhost:3001/sse"
```

次に、MCPサーバー用の環境変数ファイルも作成します。MCPサーバーは**独立したプロセス**として動作するため、`external/mcp`ディレクトリに`.env`ファイルを作成する必要があります。

```bash
# external/mcpディレクトリに移動
cd external/mcp

# .env.exampleをコピーして.envを作成（.env.exampleが存在する場合）
# 存在しない場合は直接.envファイルを作成してください
cp .env.example .env
touch .env
```

`external/mcp/.env`ファイルに環境変数を設定します：

```.env
# MCPサーバー用の環境変数
PRIVATE_KEY=0x... # ウォレットの秘密鍵（.env.localと同じ値を使用）
```

**重要**：
- `.env.local`は`.gitignore`に含まれていることを確認してください
- `external/mcp/.env`も`.gitignore`に含まれていることを確認してください
- ルートディレクトリの`.env.local`とは別に、`external/mcp/.env`も必要です
- 本番環境では、秘密鍵を環境変数として安全に管理してください

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#jpyc`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット

---

次のレッスンでは、MCPサーバーの実装を始めます！

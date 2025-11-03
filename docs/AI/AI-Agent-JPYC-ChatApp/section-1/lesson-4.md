---
title: MCPについて
---

### 🔌 MCP（Model Context Protocol）とは？

MCP（Model Context Protocol）は、**AI Agentとツールやデータソースをつなぐための標準化されたプロトコル**です。

Anthropic社によって開発され、AI Agentが外部のツールやサービスを簡単に利用できるようにします。

### 🤔 なぜ MCP が必要なのか？

AI Agentを開発する際、以下のような課題がありました：

**課題1：ツール統合の複雑さ**

各ツールやAPIごとに異なる実装方法を学ぶ必要がありました。

```typescript
// それぞれのツールで異なる実装が必要
await weatherAPI.getCurrentWeather(location);
await databaseClient.query(sql);
await blockchainRPC.sendTransaction(tx);
```

**課題2：再利用性の低さ**

ツールを別のプロジェクトで使いたい場合、コードを大幅に書き直す必要がありました。

**課題3：標準化の欠如**

AI Agentとツール間のインタフェースに統一性がなく、開発者ごとに異なる実装がされていました。

### ✨ MCP が解決すること

MCPは、これらの課題を以下のように解決します：

**1. 統一されたインタフェース**

すべてのツールが同じプロトコルで通信します。

```typescript
// MCPを使えば、すべてのツールが同じ方法で使える
await mcpServer.callTool('get_weather', { location });
await mcpServer.callTool('query_database', { sql });
await mcpServer.callTool('send_jpyc', { to, amount });
```

**2. プラグアンドプレイ**

一度作成したMCPサーバーは、どのAI Agentフレームワークでも使用できます。

**3. セキュリティと制御**

MCPは、ツールへのアクセス制御や権限管理を標準化します。

### 🏗 MCP のアーキテクチャ

MCPは、以下のコンポーネントで構成されます：

**MCPサーバー**

ツールやデータソースをホストする側です。

```typescript
// MCPサーバーの例
const server = new MCPServer({
  name: 'jpyc-tools',
  version: '1.0.0',
  tools: [
    {
      name: 'get_balance',
      description: 'JPYC残高を取得する',
      inputSchema: {
        type: 'object',
        properties: {
          address: { type: 'string' }
        }
      },
      handler: async ({ address }) => {
        // 残高取得の実装
      }
    }
  ]
});
```

**MCPクライアント**

AI AgentがMCPサーバーと通信するための部分です。

```typescript
// MCPクライアントの使用例
const client = new MCPClient({
  serverUrl: 'http://localhost:3000'
});

// ツールの呼び出し
const result = await client.callTool('get_balance', {
  address: '0x123...'
});
```

**プロトコル**

サーバーとクライアント間の通信ルールです。JSON-RPCベースの標準化されたメッセージフォーマットを使用します。

### 📡 MCP の通信フロー

MCPの典型的な通信フローは以下の通りです：

```
1. AI Agent: ユーザーから「残高を教えて」という指示を受ける

2. AI Agent → MCP Client: 適切なツールを選択
   "get_balance ツールを使う"

3. MCP Client → MCP Server: ツール呼び出しリクエスト
   {
     "tool": "get_balance",
     "parameters": {
       "address": "0x123..."
     }
   }

4. MCP Server: ツールを実行
   - JPYC SDKを使って残高を取得
   - 結果をフォーマット

5. MCP Server → MCP Client: 実行結果を返す
   {
     "success": true,
     "data": {
       "balance": "1000",
       "symbol": "JPYC"
     }
   }

6. MCP Client → AI Agent: 結果を渡す

7. AI Agent → User: 結果を自然言語で報告
   "あなたの残高は1,000 JPYCです"
```

### 🛠 MCP サーバーの構造

MCPサーバーは、以下の要素を定義します：

**1. ツール（Tools）**

AI Agentが実行できる具体的な機能です。

```typescript
{
  name: 'send_jpyc',
  description: 'JPYCを送金する',
  inputSchema: {
    type: 'object',
    properties: {
      to: {
        type: 'string',
        description: '送金先アドレス'
      },
      amount: {
        type: 'string',
        description: '送金額'
      }
    },
    required: ['to', 'amount']
  },
  handler: async ({ to, amount }) => {
    // 送金処理の実装
  }
}
```

**2. リソース（Resources）**

AI Agentがアクセスできるデータです。

```typescript
{
  uri: 'jpyc://transactions/history',
  name: 'Transaction History',
  description: 'JPYC取引履歴',
  mimeType: 'application/json'
}
```

**3. プロンプト（Prompts）**

AI Agentに提供するコンテキスト情報です。

```typescript
{
  name: 'jpyc_context',
  description: 'JPYC操作のためのコンテキスト',
  arguments: [
    {
      name: 'userAddress',
      description: 'ユーザーのウォレットアドレス',
      required: true
    }
  ]
}
```

### 🎯 MCP の利点

**開発者にとって**
- ツールの実装が簡単になる
- 既存のツールを再利用できる
- 標準化されたテストとデバッグが可能

**AI Agentにとって**
- 多様なツールに一貫した方法でアクセスできる
- ツールの機能を自動的に理解できる
- エラーハンドリングが統一される

**ユーザーにとって**
- より多機能なAI Agentを利用できる
- 信頼性の高いサービスを受けられる

### 🔐 MCP のセキュリティ

MCPは、以下のセキュリティ機能を提供します：

**認証と認可**
```typescript
const server = new MCPServer({
  auth: {
    type: 'bearer',
    token: process.env.MCP_AUTH_TOKEN
  }
});
```

**入力検証**
```typescript
inputSchema: {
  type: 'object',
  properties: {
    amount: {
      type: 'string',
      pattern: '^[0-9]+(\.[0-9]+)?$',  // 数値のみ許可
      maximum: '10000'                  // 最大値の制限
    }
  }
}
```

**レート制限**
```typescript
const server = new MCPServer({
  rateLimit: {
    windowMs: 60000,  // 1分
    maxRequests: 10    // 最大10リクエスト
  }
});
```

### 🌐 MCP のエコシステム

MCPは、様々なフレームワークやツールと統合できます：

- **AI Agentフレームワーク**：LangChain、Mastra、AutoGPTなど
- **LLMプロバイダー**：Claude、GPT-4、Geminiなど
- **開発ツール**：VS Code拡張、デバッガーなど

### 💡 このプロジェクトでの MCP の役割

このプロジェクトでは、以下のようにMCPを使用します：

1. **MCPサーバーの実装**（セクション3）
   - JPYC操作のためのツールを定義
   - JPYC SDKと連携する実装

2. **Mastraとの統合**（セクション4）
   - MastraフレームワークにMCPサーバーを接続
   - AI AgentからJPYCツールを利用可能にする

3. **フロントエンドからの利用**（セクション5）
   - Next.jsアプリからMastra経由でMCPを呼び出し
   - ユーザーインタフェースの実装

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#jpyc`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット

---

次のレッスンでは、Mastraについて学びます！

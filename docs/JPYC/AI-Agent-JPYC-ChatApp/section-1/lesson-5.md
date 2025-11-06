---
title: Mastraについて
---

### 🎭 Mastra とは？

Mastraは、**AI Agentを簡単に構築できるTypeScriptフレームワーク**です。

前のレッスンで学んだMCPプロトコルをネイティブサポートし、開発者が本質的な機能の実装に集中できるようにします。

### ✨ Mastra の特徴

**1. シンプルなAPI**
- 直感的で使いやすいAPIでAI Agentを作成できます。

**2. TypeScript完全対応**
- 型安全な開発が可能で、エディタの補完機能をフル活用できます。

**3. MCP統合**
- 前のレッスンで学んだMCPサーバーと簡単に接続できます。

**4. 複数のLLMに対応**
- Claude、OpenAI、Geminiなど、様々なLLMプロバイダーをサポートします。

### 🔌 MCP との関係

Mastraは、MCPプロトコルを実装する**AI Agentフレームワーク**です：

```
[ユーザー]
    ↓
[Mastra Agent] ← AI Agentフレームワーク
    ↓
[Mastra MCP Client] ← MCPクライアントの実装
    ↓
[MCP Server] ← 前のレッスンで学んだMCPサーバー
    ↓
[JPYC SDK]
```

### 🤖 Agent の作成

Mastraでは、`Agent`クラスを使ってAI Agentを作成します：

```typescript
import { Agent } from '@mastra/core/agent';

const jpycAgent = new Agent({
  name: 'JPYC Assistant',
  model: gpt4oMiniModel,
  tools: async () => {
    // MCPサーバーからツールを取得
    const tools = await jpycMCPClient.getTools();
    return tools;
  },
  instructions: `
    あなたはJPYC操作をサポートするAIアシスタントです。
    ...
  `,
});
```

**主要な設定項目：**

- `name`: Agentの名前
- `model`: 使用するLLMモデル
- `tools`: 利用可能なツール（関数で動的に取得）
- `instructions`: Agentへのシステムプロンプト

### 📝 Instructions の役割

`instructions`は、AI Agentの振る舞いを定義する重要な要素です：

```typescript
instructions: `
  あなたはJPYC操作をサポートするAIアシスタントです。

  対応テストネット: Ethereum Sepolia, Avalanche Fuji

  以下の操作が可能です：
  - 残高照会
  - 送信処理
  - チェーン切り替え

  ## 回答スタイル:
  - カジュアルで親しみやすい会話調
  - 絵文字は使わない
`
```

### 🔗 MCP クライアントの作成

MastraでMCPサーバーに接続するには、`MCPClient`を使用します：

```typescript
import { MCPClient } from '@mastra/mcp';

// MCPサーバーに接続
const jpycMCPClient = new MCPClient({
  name: 'jpyc-sdk',
  url: 'http://localhost:3001',  // MCPサーバーのURL
});

// ツールを取得
const tools = await jpycMCPClient.getTools();
```

### 🔄 動的ツール取得

Agentにツールを提供する際、**関数形式**で動的に取得します：

```typescript
const jpycAgent = new Agent({
  name: 'JPYC Assistant',
  model: gpt4oMiniModel,

  // ツールを動的に取得する関数
  tools: async () => {
    const { jpycMCPClient } = await import('@/lib/mastra/mcp/client');
    const tools = await jpycMCPClient.getTools();
    return tools;
  },
});
```

### 💬 Agent の実行

#### 通常実行（generate）

```typescript
const response = await jpycAgent.generate(
  '残高を教えて',
  { threadId: 'unique-thread-id' }
);

console.log(response.text);
// → "Ethereum Sepoliaチェーンの残高は1,000 JPYCです"
```

#### ストリーミング実行（stream）

```typescript
const stream = await jpycAgent.stream(
  '太郎に100JPYC送って',
  { threadId: 'unique-thread-id' }
);

for await (const chunk of stream) {
  if (chunk.type === 'text') {
    process.stdout.write(chunk.text);
  }
}
```

### 🔄 このプロジェクトでの処理フロー

実際のアプリケーションでの全体的な流れ：

```
1. ユーザー入力
   ↓
2. Next.js API Route (/api/chat)
   ↓
3. Mastra Agent (jpycAgent.stream())
   ↓
4. Mastra MCP Client (getTools())
   ↓
5. MCP Server (http://localhost:3001)
   ↓
6. JPYC SDK → Blockchain
   ↓
7. 結果を逆順で返す
   ↓
8. フロントエンドに表示
```

**API Route の実装例：**

```typescript
// src/app/api/chat/route.ts
import { jpycAgent } from '@/lib/mastra/agent';

export async function POST(req: Request) {
  const { message, threadId } = await req.json();

  // Agentをストリーミングモードで実行
  const stream = await jpycAgent.stream(message, { threadId });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream' },
  });
}
```

### 📊 スレッド管理

Mastraは会話のコンテキストを「スレッド」として管理します：

```typescript
// 新しいスレッドを作成
const threadId = crypto.randomUUID();

// 最初のメッセージ
await jpycAgent.generate('私の残高は？', { threadId });
// → "1,000 JPYCです"

// 同じスレッドで続けて会話（コンテキストを保持）
await jpycAgent.generate('半分を太郎さんに送って', { threadId });
// → コンテキストから「500 JPYC」と推測して送信
```

### 🎯 モデルの設定

Mastraは複数のLLMプロバイダーをサポートします：

```typescript
// OpenAI GPT-4o-mini
import { createOpenAI } from '@ai-sdk/openai';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const gpt4oMiniModel = openai('gpt-4o-mini');
```

```typescript
// Anthropic Claude
import { createAnthropic } from '@ai-sdk/anthropic';

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const claude = anthropic('claude-3-5-sonnet-20241022');
```

### 🚀 このプロジェクトでの構成

**1. MCPクライアント**（`src/lib/mastra/mcp/client.ts`）
```typescript
import { MCPClient } from '@mastra/mcp';

export const jpycMCPClient = new MCPClient({
  name: 'jpyc-sdk',
  url: 'http://localhost:3001',
});
```

**2. Agent**（`src/lib/mastra/agent.ts`）
```typescript
import { Agent } from '@mastra/core/agent';

export const jpycAgent = new Agent({
  name: 'JPYC Assistant',
  model: gpt4oMiniModel,
  tools: async () => {
    const tools = await jpycMCPClient.getTools();
    return tools;
  },
  instructions: '...',
});
```

**3. API Route**（`src/app/api/chat/route.ts`）
```typescript
export async function POST(req: Request) {
  const stream = await jpycAgent.stream(message, { threadId });
  return new Response(stream);
}
```

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#jpyc`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット

---

これでセクション1（座学）は完了です！ 次のセクションでは、実際に開発環境をセットアップしていきます。

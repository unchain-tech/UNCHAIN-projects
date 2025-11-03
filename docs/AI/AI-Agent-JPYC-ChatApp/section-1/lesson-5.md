---
title: Mastraについて
---

### 🎭 Mastra とは？

Mastraは、**AI Agentを簡単に構築できるモダンなTypeScriptフレームワーク**です。

複雑なAI Agentのロジックを抽象化し、開発者が本質的な機能の実装に集中できるようにします。

### ✨ Mastra の特徴

**1. シンプルなAPI**

Mastraは、直感的で使いやすいAPIを提供します。

```typescript
import { Mastra } from '@mastra/core';

const mastra = new Mastra({
  agents: [myAgent],
  tools: [myTool],
});
```

**2. TypeScript完全対応**

型安全な開発が可能で、エディタの補完機能をフル活用できます。

**3. 柔軟な統合**

様々なLLMプロバイダー（Claude、OpenAI、Geminiなど）をサポートします。

**4. MCP対応**

MCPプロトコルをネイティブサポートし、外部ツールを簡単に統合できます。

### 🏗 Mastra のアーキテクチャ

Mastraは、以下の主要コンポーネントで構成されます：

**Agentモジュール**

AI Agentの振る舞いを定義します。

```typescript
import { Agent } from '@mastra/core';

const jpycAgent = new Agent({
  name: 'JPYC Agent',
  instructions: `
    あなたはJPYC操作を支援するAIアシスタントです。
    ユーザーの指示に従って、送金や残高確認を行います。
  `,
  model: {
    provider: 'anthropic',
    name: 'claude-3-5-sonnet',
    toolChoice: 'auto',
  },
});
```

**Toolモジュール**

AI Agentが使用できるツールを定義します。

```typescript
import { createTool } from '@mastra/core';

const getBalanceTool = createTool({
  id: 'get_balance',
  description: 'JPYC残高を取得する',
  inputSchema: z.object({
    address: z.string().describe('ウォレットアドレス'),
  }),
  execute: async ({ context }) => {
    const { address } = context;
    // 残高取得の実装
  },
});
```

**Workflowモジュール**

複数のステップからなる複雑な処理を定義します。

```typescript
import { createWorkflow } from '@mastra/core';

const sendJPYCWorkflow = createWorkflow({
  name: 'send_jpyc',
  triggerSchema: z.object({
    to: z.string(),
    amount: z.string(),
  }),
})
  .step('check_balance')
  .step('validate_address')
  .step('execute_transfer')
  .commit();
```

### 🤖 Agent の作成

Mastraでは、Agentを簡単に作成できます：

```typescript
import { Agent } from '@mastra/core';

const agent = new Agent({
  name: 'JPYC Assistant',
  instructions: `
    あなたはJPYC（日本円ステーブルコイン）の操作を
    支援するAIアシスタントです。

    以下の操作をサポートします：
    - 残高確認
    - 送金処理
    - 取引履歴の表示

    ユーザーに対して親切で分かりやすい説明を心がけてください。
  `,
  model: {
    provider: 'anthropic',
    name: 'claude-3-5-sonnet',
    toolChoice: 'auto',
  },
  tools: {
    getBalance,
    sendJPYC,
    getHistory,
  },
});
```

### 🛠 Tool の作成

Toolは、AI Agentが実行できる具体的な機能です：

```typescript
import { createTool } from '@mastra/core';
import { z } from 'zod';

const sendJPYCTool = createTool({
  id: 'send_jpyc',
  description: '指定したアドレスにJPYCを送金する',
  inputSchema: z.object({
    to: z.string().describe('送金先のウォレットアドレス'),
    amount: z.string().describe('送金額（JPYC単位）'),
  }),
  execute: async ({ context }) => {
    const { to, amount } = context;

    try {
      // JPYC送金処理
      const tx = await jpycClient.transfer(to, amount);

      return {
        success: true,
        message: `${amount} JPYCを${to}に送金しました`,
        txHash: tx.hash,
      };
    } catch (error) {
      return {
        success: false,
        message: `送金に失敗しました: ${error.message}`,
      };
    }
  },
});
```

### 💬 Agent の実行

作成したAgentを実行するのは簡単です：

```typescript
// テキスト入力で実行
const response = await agent.generate('残高を教えて');
console.log(response.text);

// ストリーミング実行
const stream = await agent.stream('100 JPYC送って');
for await (const chunk of stream) {
  console.log(chunk.text);
}
```

### 🔄 Workflow の活用

Workflowを使うと、複数のステップを順序立てて実行できます：

```typescript
import { createWorkflow } from '@mastra/core';
import { z } from 'zod';

const transferWorkflow = createWorkflow({
  name: 'jpyc_transfer',
  triggerSchema: z.object({
    recipientAddress: z.string(),
    amount: z.string(),
  }),
})
  .step('validate_inputs', async ({ context }) => {
    // 入力値の検証
    const { recipientAddress, amount } = context.machineContext;

    if (!ethers.isAddress(recipientAddress)) {
      throw new Error('無効なアドレスです');
    }

    return { valid: true };
  })
  .step('check_balance', async ({ context }) => {
    // 残高確認
    const balance = await jpycClient.getBalance(userAddress);
    const required = ethers.parseUnits(context.machineContext.amount, 18);

    if (balance < required) {
      throw new Error('残高不足です');
    }

    return { sufficient: true };
  })
  .step('execute_transfer', async ({ context }) => {
    // 送金実行
    const { recipientAddress, amount } = context.machineContext;
    const tx = await jpycClient.transfer(recipientAddress, amount);

    return {
      txHash: tx.hash,
      status: 'success',
    };
  })
  .commit();

// Workflowの実行
const result = await transferWorkflow.execute({
  triggerData: {
    recipientAddress: '0x123...',
    amount: '100',
  },
});
```

### 🔌 MCP との統合

MastraはMCPをネイティブサポートしています：

```typescript
import { Mastra } from '@mastra/core';
import { MCPClient } from '@mastra/mcp';

// MCPクライアントを作成
const mcpClient = new MCPClient({
  serverUrl: 'http://localhost:3000',
});

// Mastraインスタンスを作成
const mastra = new Mastra({
  agents: [jpycAgent],
  mcpServers: {
    jpycServer: mcpClient,
  },
});

// MCPサーバーのツールが自動的にAgentで利用可能になる
```

### 📊 コンテキスト管理

Mastraは、会話のコンテキストを自動的に管理します：

```typescript
// 会話の開始
const thread = await agent.createThread();

// メッセージの送信（コンテキストを保持）
await agent.generate('私の残高は？', { threadId: thread.id });
// → "1,000 JPYCです"

await agent.generate('半分を太郎さんに送って', { threadId: thread.id });
// → 太郎さんに500 JPYCを送金します（コンテキストから金額を推測）
```

### 🎨 カスタマイズ

Mastraは、様々な側面でカスタマイズ可能です：

**モデルのカスタマイズ**
```typescript
const agent = new Agent({
  model: {
    provider: 'anthropic',
    name: 'claude-3-5-sonnet',
    toolChoice: 'auto',
    temperature: 0.7,
    maxTokens: 1000,
  },
});
```

**エラーハンドリング**
```typescript
const agent = new Agent({
  onError: async (error, context) => {
    console.error('Agent error:', error);
    // カスタムエラー処理
  },
});
```

**ログ記録**
```typescript
const mastra = new Mastra({
  logger: {
    level: 'debug',
    transport: customLogger,
  },
});
```

### 🚀 パフォーマンス最適化

Mastraは、以下のパフォーマンス最適化機能を提供します：

**キャッシング**
```typescript
const agent = new Agent({
  cache: {
    enabled: true,
    ttl: 300, // 5分
  },
});
```

**並列実行**
```typescript
// 複数のツールを並列実行
const results = await Promise.all([
  agent.executeTool('get_balance', { address: addr1 }),
  agent.executeTool('get_balance', { address: addr2 }),
  agent.executeTool('get_balance', { address: addr3 }),
]);
```

### 💡 このプロジェクトでの Mastra の役割

このプロジェクトでは、Mastraを以下のように活用します：

1. **Agentの定義**
   - JPYC操作を支援するAgentを作成
   - 適切な指示とモデル設定

2. **Toolの実装**
   - JPYC残高確認ツール
   - JPYC送金ツール
   - 取引履歴取得ツール

3. **MCPとの統合**
   - セクション3で作成するMCPサーバーを接続
   - AI Agentから自動的にMCPツールを利用

4. **API提供**
   - Next.jsのAPI Routeから利用
   - フロントエンドとのインターフェース

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#ai`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット

---

これでセクション1（座学）は完了です！次のセクションでは、実際に開発環境をセットアップしていきます。

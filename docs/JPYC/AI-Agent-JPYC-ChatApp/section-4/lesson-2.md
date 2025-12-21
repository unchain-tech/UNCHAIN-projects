---
title: MCPクライアントの作成
---

### 🔗 MCP クライアントの作成

このレッスンでは、Section 3で作成したMCPサーバーと通信するためのMCPクライアントを実装します。

MCPクライアントは、AI AgentからMCPサーバーに接続し、ツールのリストを取得する役割を担います。

### 📝 実装するファイル

`src/lib/mastra/mcp/client.ts`ファイルを作成し、以下のコードを記述します。

まず、ファイルを作成します：

```bash
cd jpyc-ai-agent

touch src/lib/mastra/mcp/client.ts
```

以下のコードを記述します：

```typescript
import { MCPClient } from "@mastra/mcp";

/**
 * JPYC MCPサーバーを呼び出すためのMCPクライアント
 */
export const jpycMCPClient = new MCPClient({
	servers: {
		// JPYC MCPサーバーのURLを設定する(MCPサーバー事前に起動しておくこと)
		"jpyc:mcp-server": {
			url: new URL(
				process.env.JPYC_MCP_SERVER_URL || "http://localhost:3001/sse",
			),
		},
	},
});
```

### 💡 コードの解説

このファイルは非常にシンプルですが、重要な役割を果たします。

主要なポイントを見ていきましょう。

#### 1. MCPClientのインポート

```typescript
import { MCPClient } from "@mastra/mcp";
```

MastraのMCPクライアントをインポートします。  
このクライアントは、MCPプロトコルを使用してサーバーと通信します。

#### 2. MCPClientインスタンスの作成

```typescript
export const jpycMCPClient = new MCPClient({
	servers: {
		"jpyc:mcp-server": {
			url: new URL(
				process.env.JPYC_MCP_SERVER_URL || "http://localhost:3001/sse",
			),
		},
	},
});
```

`MCPClient`は、複数のMCPサーバーに接続できるように設計されています。  
`servers`オブジェクトで、各サーバーの名前とURLを定義します。

**主要なパラメータ：**

- **サーバー名**: `"jpyc:mcp-server"` - MCPサーバーを識別するための名前
- **url**: MCPサーバーのSSEエンドポイントURL

#### 3. 環境変数の使用

```typescript
process.env.JPYC_MCP_SERVER_URL || "http://localhost:3001/sse"
```

環境変数`JPYC_MCP_SERVER_URL`が設定されている場合はそれを使用し、設定されていない場合はデフォルトの`http://localhost:3001/sse`を使用します。

これにより、本番環境と開発環境で異なるMCPサーバーURLを使い分けることができます。

#### 4. SSEエンドポイント

```typescript
"http://localhost:3001/sse"
```

Section 3で作成したMCPサーバーのSSEエンドポイントに接続します。  
このエンドポイントは、サーバーからクライアントへのイベント送信に使用されます。

### 🔄 MCPクライアントの動作

MCPクライアントは、AI Agentから以下のような流れで使用されます：

```
1. AI Agent起動
   ↓
2. jpycMCPClient.getTools() 呼び出し
   ↓
3. MCPサーバー (http://localhost:3001/sse) に接続
   ↓
4. サーバーからツールリストを取得
   ↓
5. ツール（jpyc_balance, jpyc_transfer, etc.）をAI Agentに登録
   ↓
6. ユーザーの指示に応じてツールを実行
```

次のレッスンでAI Agentを実装する際、このクライアントを使ってツールを動的に取得します。

### 🌐 複数サーバーへの対応

MCPClientは、複数のMCPサーバーに同時に接続できます。  
例えば、JPYC操作用のサーバーと、天気情報用のサーバーを同時に使用する場合：

```typescript
export const multiServerClient = new MCPClient({
	servers: {
		"jpyc:mcp-server": {
			url: new URL("http://localhost:3001/sse"),
		},
		"weather:mcp-server": {
			url: new URL("http://localhost:3002/sse"),
		},
	},
});
```

このようにすることで、AI Agentは両方のサーバーのツールを使用できるようになります。

### 🧪 動作確認

この段階では、まだAI Agentが完成していないため、動作確認はできません。

次のレッスンでAI Agentを実装することで、MCPクライアントが正しくサーバーに接続し、ツールを取得できることを確認できます。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#jpyc`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット

---

次のレッスンでは、いよいよAI Agentを実装します！

---
title: MCPサーバーの起動
---

### 🚀 MCP サーバーの起動

このレッスンでは、前の2つのレッスンで作成したJPYC SDK WrapperとMCPツールを公開するMCPサーバーを実装します。

MCPサーバーは、HTTP/SSE（Server-Sent Events）プロトコルを使用して、AI Agentと通信します。

### 📝 実装するファイル

`external/mcp/src/index.ts`ファイルを作成し、以下のコードを記述します。

まず、ファイルを作成します：

```bash
cd jpyc-ai-agent

mkdir -p external/mcp/src
touch external/mcp/src/index.ts
```

以下のコードを記述します：

```typescript
/**
 * JPYC MCP Server - Standalone MCP Server
 *
 * このサーバーはJPYC SDKの機能をMCPプロトコル経由で公開します。
 * HTTP/SSEを使用して、MCPClientから接続できるようにします。
 *
 * 学習用ポイント:
 * 1. MCPServerを独立したプロセスとして実行
 * 2. HTTP/SSE経由でMCPClientと通信
 * 3. 実際のMCPプロトコルの使い方を学習
 */

import "dotenv/config";
import { MCPServer } from "@mastra/mcp";
import http from "node:http";
import { jpycTools } from "./tools";

const PORT = process.env.MCP_PORT || 3001;

/**
 * JPYC MCP Server インスタンス
 */
const server = new MCPServer({
	name: "jpyc-sdk",
	version: "1.0.0",
	tools: jpycTools,
});

/**
 * HTTPサーバーを作成してMCPServerを統合
 */
const httpServer = http.createServer(async (req, res) => {
	console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

	// CORSヘッダーを設定（Next.jsアプリからのアクセスを許可）
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");

	if (req.method === "OPTIONS") {
		res.writeHead(200);
		res.end();
		return;
	}

	// ヘルスチェックエンドポイント
	if (req.url === "/health" && req.method === "GET") {
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ status: "ok", server: "jpyc-mcp-server" }));
		return;
	}

	// MCP SSEエンドポイント
	try {
		await server.startSSE({
			url: new URL(req.url || "", `http://localhost:${PORT}`),
			ssePath: "/sse",
			messagePath: "/message",
			req,
			res,
		});
	} catch (error) {
		console.error("MCP Server error:", error);
		if (!res.headersSent) {
			res.writeHead(500, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ error: "Internal server error" }));
		}
	}
});

// サーバー起動
httpServer.listen(PORT, () => {
	console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║          🚀 JPYC MCP Server is running!                   ║
║                                                            ║
║  SSE Endpoint:     http://localhost:${PORT}/sse               ║
║  Message Endpoint: http://localhost:${PORT}/message           ║
║  Health Check:     http://localhost:${PORT}/health            ║
║                                                            ║
║  Available Tools:                                          ║
║    - jpyc_balance           (残高照会)                     ║
║    - jpyc_transfer          (送信)                         ║
║    - jpyc_switch_chain      (チェーン切り替え)             ║
║    - jpyc_get_current_chain (現在のチェーン取得)           ║
║    - jpyc_total_supply      (総供給量照会)                 ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// エラーハンドリング
httpServer.on("error", (error) => {
	console.error("HTTP Server error:", error);
	process.exit(1);
});

// graceful shutdown
process.on("SIGTERM", () => {
	console.log("SIGTERM signal received: closing HTTP server");
	httpServer.close(() => {
		console.log("HTTP server closed");
		process.exit(0);
	});
});

process.on("SIGINT", () => {
	console.log("\nSIGINT signal received: closing HTTP server");
	httpServer.close(() => {
		console.log("HTTP server closed");
		process.exit(0);
	});
});
```

### 💡 コードの解説

このファイルは、MCPサーバーのエントリーポイントです。主要なポイントを見ていきましょう。

#### 1. 環境変数の読み込み

```typescript
import "dotenv/config";
```

最初に`dotenv/config`をインポートすることで、`.env`ファイルから環境変数を読み込みます。これにより、`PRIVATE_KEY`などの機密情報を安全に管理できます。

#### 2. MCPServerインスタンスの作成

```typescript
const server = new MCPServer({
	name: "jpyc-sdk",
	version: "1.0.0",
	tools: jpycTools,
});
```

MastraのMCPServerを作成します。前のレッスンで作成した`jpycTools`をツールとして登録することで、AI Agentがこれらのツールを使用できるようになります。

#### 3. HTTPサーバーの作成

```typescript
const httpServer = http.createServer(async (req, res) => {
	// リクエスト処理
});
```

Node.jsの標準モジュール`http`を使って、HTTPサーバーを作成します。MCPサーバーは、このHTTPサーバーを通じてクライアントと通信します。

#### 4. CORSヘッダーの設定

```typescript
res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
res.setHeader("Access-Control-Allow-Headers", "Content-Type");
```

CORS（Cross-Origin Resource Sharing）ヘッダーを設定することで、Next.jsアプリケーション（別のポートで動作）からMCPサーバーにアクセスできるようにします。

#### 5. ヘルスチェックエンドポイント

```typescript
if (req.url === "/health" && req.method === "GET") {
	res.writeHead(200, { "Content-Type": "application/json" });
	res.end(JSON.stringify({ status: "ok", server: "jpyc-mcp-server" }));
	return;
}
```

`/health`エンドポイントは、サーバーが正常に動作しているかを確認するために使用します。ブラウザで`http://localhost:3001/health`にアクセスすると、サーバーの状態を確認できます。

#### 6. SSE（Server-Sent Events）エンドポイント

```typescript
await server.startSSE({
	url: new URL(req.url || "", `http://localhost:${PORT}`),
	ssePath: "/sse",
	messagePath: "/message",
	req,
	res,
});
```

MCPプロトコルは、SSE（Server-Sent Events）を使用してリアルタイム通信を行います。

- **/sse**: クライアントがサーバーからのイベントを受信するエンドポイント
- **/message**: クライアントがサーバーにメッセージを送信するエンドポイント

#### 7. Graceful Shutdown

```typescript
process.on("SIGTERM", () => {
	console.log("SIGTERM signal received: closing HTTP server");
	httpServer.close(() => {
		console.log("HTTP server closed");
		process.exit(0);
	});
});
```

`SIGTERM`や`SIGINT`（Ctrl+C）シグナルを受信したとき、サーバーを適切に終了します。これにより、リクエスト処理中にサーバーが強制終了されることを防ぎます。

### 🔑 環境変数の設定

MCPサーバーは**独立したプロセス**として動作するため、`external/mcp`ディレクトリに`.env`ファイルを作成する必要があります。

```bash
# external/mcpディレクトリに移動
cd external/mcp

# .env.exampleをコピーして.envを作成
cp .env.example .env
```

`.env`ファイルに環境変数を設定します：

```.env
PRIVATE_KEY=0x... # ウォレットの秘密鍵
```

**重要：** ルートディレクトリの`.env.local`とは別に、`external/mcp/.env`も必要です。

### 🧪 動作確認

MCPサーバーを起動して、動作を確認しましょう。

#### 1. MCPサーバーの起動

ターミナルで以下のコマンドを実行します：

```bash
pnpm mcp:dev
```

以下のような出力が表示されれば、MCPサーバーが正常に起動しています：

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║          🚀 JPYC MCP Server is running!                   ║
║                                                            ║
║  SSE Endpoint:     http://localhost:3001/sse               ║
║  Message Endpoint: http://localhost:3001/message           ║
║  Health Check:     http://localhost:3001/health            ║
║                                                            ║
║  Available Tools:                                          ║
║    - jpyc_balance           (残高照会)                     ║
║    - jpyc_transfer          (送信)                         ║
║    - jpyc_switch_chain      (チェーン切り替え)             ║
║    - jpyc_get_current_chain (現在のチェーン取得)           ║
║    - jpyc_total_supply      (総供給量照会)                 ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

#### 2. ヘルスチェック

ブラウザで`http://localhost:3001/health`にアクセスします。

以下のJSONレスポンスが表示されれば、サーバーが正常に動作しています：

```json
{
  "status": "ok",
  "server": "jpyc-mcp-server"
}
```

#### 3. サーバーの停止

MCPサーバーを停止するには、ターミナルで`Ctrl+C`を押します。

```bash
SIGINT signal received: closing HTTP server
HTTP server closed
```

これで、Section 3（MCPサーバーの実装）が完了しました！

次のセクションでは、このMCPサーバーと通信するMastra Agentを実装していきます。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#jpyc`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット

---

次のセクションでは、Mastra Agentを実装します！

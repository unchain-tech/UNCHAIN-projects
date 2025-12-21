---
title: チャットAPIの実装
---

### 🌐 チャット API の実装

このレッスンでは、フロントエンドからAI Agentを呼び出すためのAPIエンドポイントを実装します。

このAPIはユーザーのメッセージを受け取り、Section 4で作成したAI Agentに渡しレスポンスを返します。

### 📝 実装するファイル

`src/app/api/chat/route.ts`ファイルを作成し、以下のコードを記述します。

まず、ファイルを作成します：

```bash
cd jpyc-ai-agent

touch src/app/api/chat/route.ts
```

以下のコードを記述します：

```typescript
import { jpycAgent } from "@/lib/mastra/agent";
import type { NextRequest } from "next/server";

/**
 * AI AgentのAPIを呼び出すエンドポイント
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
	try {
		// リクエストパラメータからメッセージ、会話ID、プロフィール、友達リストを取得
		const { message, conversationId, profile, friends } = await req.json();

		if (!message) {
			return new Response(
				JSON.stringify({ success: false, error: "Message is required" }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		// プロフィールと友達リストをコンテキストとして追加
		let contextMessage = message;
		if (profile || (friends && friends.length > 0)) {
			let context = "\n\n[ユーザー情報]\n";

			if (profile) {
				context += `- 自分の名前: ${profile.name}\n`;
				context += `- 自分のアドレス: ${profile.address}\n`;
			}

			if (friends && friends.length > 0) {
				context += "\n[友達リスト]\n";
				for (const friend of friends) {
					context += `- ${friend.name}: ${friend.address}\n`;
				}
			}

			contextMessage = message + context;
		}

		// Mastraで定義したJPYC AI Agentの機能を呼び出す
		const response = await jpycAgent.generate(contextMessage, {
			...(conversationId && { conversationId }),
		});

		console.log("Full generate response:", JSON.stringify(response, null, 2));
		console.log("Generate response summary:", {
			text: response.text,
			textLength: response.text?.length,
			object: response.object,
			steps: response.steps?.length,
			toolResults: response.toolResults?.length,
		});

		// レスポンステキストを返す
		return new Response(
			response.text || "エージェントからの応答がありませんでした",
			{
				headers: {
					"Content-Type": "text/plain; charset=utf-8",
				},
			},
		);
	} catch (error) {
		console.error("Chat API Error:", error);
		return new Response(
			JSON.stringify({
				success: false,
				error:
					error instanceof Error
						? error.message
						: "An error occurred while processing your request",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
}
```

### 💡 コードの解説

このファイルは、Next.js 15のApp Router API Routeとして実装されています。

主要なポイントを見ていきましょう。

#### 1. POSTメソッドの定義

```typescript
export async function POST(req: NextRequest) {
	// 処理
}
```

Next.js 15のApp Routerでは、APIルートを`route.ts`ファイルで定義し、HTTPメソッドごとに関数をエクスポートします。

#### 2. リクエストパラメータの取得

```typescript
const { message, conversationId, profile, friends } = await req.json();
```

クライアントから送信されたJSONデータを取得します：

- **message**: ユーザーのメッセージ
- **conversationId**: 会話を識別するID（会話の文脈を保持するため）
- **profile**: ユーザーのプロフィール（名前、アドレス）
- **friends**: 友達リスト（名前とアドレスのペア）

#### 3. パラメータ検証

```typescript
if (!message) {
	return new Response(
		JSON.stringify({ success: false, error: "Message is required" }),
		{ status: 400, headers: { "Content-Type": "application/json" } },
	);
}
```

必須パラメータ（`message`）が存在しない場合は、400エラーを返します。

#### 4. コンテキスト情報の追加

```typescript
let contextMessage = message;
if (profile || (friends && friends.length > 0)) {
	let context = "\n\n[ユーザー情報]\n";

	if (profile) {
		context += `- 自分の名前: ${profile.name}\n`;
		context += `- 自分のアドレス: ${profile.address}\n`;
	}

	if (friends && friends.length > 0) {
		context += "\n[友達リスト]\n";
		for (const friend of friends) {
			context += `- ${friend.name}: ${friend.address}\n`;
		}
	}

	contextMessage = message + context;
}
```

ユーザーのプロフィールと友達リストを、メッセージの末尾にコンテキストとして追加します。

これにより、AI Agentは以下のようなメッセージを受け取ります：

```
残高教えて

[ユーザー情報]
- 自分の名前: 太郎
- 自分のアドレス: 0x1234...

[友達リスト]
- 花子: 0x5678...
- 次郎: 0x9abc...
```

AI Agentは、Section 4で定義した`instructions`に従って、このコンテキストを解釈し適切なツールを呼び出します。

#### 5. AI Agentの呼び出し

```typescript
const response = await jpycAgent.generate(contextMessage, {
	...(conversationId && { conversationId }),
});
```

Section 4で作成した`jpycAgent`の`generate()`メソッドを呼び出します。

**パラメータ：**
- **contextMessage**: ユーザーのメッセージ（コンテキスト付き）
- **conversationId**: 会話IDがある場合は渡す

`conversationId`を渡すことで、Mastraは同じ会話の文脈を保持し前のメッセージを参照できるようになります。

#### 6. レスポンスの返却

```typescript
return new Response(
	response.text || "エージェントからの応答がありませんでした",
	{
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	},
);
```

AI Agentのレスポンステキストをプレーンテキストとして返します。

#### 7. エラーハンドリング

```typescript
catch (error) {
	console.error("Chat API Error:", error);
	return new Response(
		JSON.stringify({
			success: false,
			error: error instanceof Error ? error.message : "An error occurred while processing your request",
		}),
		{ status: 500, headers: { "Content-Type": "application/json" } },
	);
}
```

エラーが発生した場合は、500エラーとエラーメッセージを返します。

### 🔄 API の動作フロー

このAPIの典型的な動作フローは以下の通りです：

```
1. フロントエンドから POST /api/chat にリクエスト
   {
     "message": "太郎に100JPYC送って",
     "conversationId": "uuid-1234",
     "profile": { "name": "花子", "address": "0x..." },
     "friends": [{ "name": "太郎", "address": "0x..." }]
   }
   ↓
2. コンテキスト情報を追加
   "太郎に100JPYC送って\n\n[ユーザー情報]\n- 自分の名前: 花子\n..."
   ↓
3. jpycAgent.generate() 呼び出し
   ↓
4. AI Agentがinstructionsを読み、友達リストから太郎のアドレスを特定
   ↓
5. jpyc_transfer ツールを呼び出し
   { to: "0x...", amount: 100 }
   ↓
6. MCPサーバー経由でJPYC SDKが送信実行
   ↓
7. トランザクションハッシュを取得
   ↓
8. AI Agentが自然言語で回答を生成
   「太郎さんに 100 JPYC送りました！トランザクションは[こちらで確認](https://...)できます」
   ↓
9. レスポンスをフロントエンドに返す
```

次のレッスンでは、ユーザーのプロフィールと友達リストを管理するローカルストレージの実装を行います。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#jpyc`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット

---

次のレッスンでは、ローカルストレージの実装を行います！

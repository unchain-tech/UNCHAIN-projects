---
title: チャットインターフェース（前半）
---

### 💬 チャットインタフェース（前半）

このレッスンでは、ユーザーとAI Agentが対話するためのチャットインタフェースの前半部分を実装します。

前半では、状態管理、メッセージ表示、API連携を実装します。  
後半のレッスンでは、設定画面と友達リスト管理UIを実装します。

### 📝 実装するファイル（前半部分）

`src/components/ChatInterface.tsx`ファイルを作成し、以下のコードを記述します。

まず、ファイルを作成します：

```bash
cd jpyc-ai-agent

touch src/components/ChatInterface.tsx
```

以下のコードを記述します：

```typescript
"use client";

import {
	addFriend,
	deleteFriend,
	deleteProfile,
	type Friend,
	getFriends,
	getProfile,
	setProfile,
	type UserProfile,
} from "@/lib/storage/localStorage";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

type Message = {
	role: "user" | "assistant";
	content: string;
	timestamp: Date;
};

/**
 * ChatInterfaceコンポーネント
 * @returns
 */
export default function ChatInterface() {
	// 状態管理
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const [conversationId, setConversationId] = useState<string | null>(null);
	const [currentChainName, setCurrentChainName] = useState<string>("Loading...");
	const [profile, setProfileState] = useState<UserProfile | null>(null);
	const [friends, setFriendsState] = useState<Friend[]>([]);
	const [showSettings, setShowSettings] = useState(false);
	const [profileName, setProfileName] = useState("");
	const [friendName, setFriendName] = useState("");
	const [friendAddress, setFriendAddress] = useState("");
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// メッセージが更新されたら自動スクロール
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, loading]);

	// プロフィールと友達リストを読み込む
	useEffect(() => {
		setProfileState(getProfile());
		setFriendsState(getFriends());
	}, []);

	// 現在のチェーンを取得
	useEffect(() => {
		const fetchCurrentChain = async () => {
			try {
				const response = await fetch("/api/chain");
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				if (data.success) {
					setCurrentChainName(data.chainName);
				} else {
					throw new Error(data.error || "Unknown error");
				}
			} catch (error) {
				console.error("Failed to fetch current chain:", error);
				setCurrentChainName("Ethereum Sepolia");
			}
		};

		fetchCurrentChain();
		const interval = setInterval(fetchCurrentChain, 3000);
		return () => clearInterval(interval);
	}, [messages]);

	// メッセージ送信処理
	const sendMessage = async () => {
		if (!input.trim()) return;

		const userMessage: Message = {
			role: "user",
			content: input,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setLoading(true);

		try {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					message: input,
					conversationId,
					profile,
					friends,
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			// ストリーミングレスポンスを処理
			const reader = response.body?.getReader();
			const decoder = new TextDecoder();
			let assistantMessage = "";

			// アシスタントメッセージの枠を追加
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content: "",
					timestamp: new Date(),
				},
			]);

			if (reader) {
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					const chunk = decoder.decode(value);
					assistantMessage += chunk;

					// メッセージを更新
					setMessages((prev) => {
						const newMessages = [...prev];
						newMessages[newMessages.length - 1] = {
							role: "assistant",
							content: assistantMessage,
							timestamp: new Date(),
						};
						return newMessages;
					});
				}
			}
		} catch (error) {
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content: `❌ エラー: ${error instanceof Error ? error.message : "不明なエラー"}`,
					timestamp: new Date(),
				},
			]);
		} finally {
			setLoading(false);
		}
	};

	// プロフィール保存処理
	const handleSaveProfile = async () => {
		if (!profileName.trim()) {
			alert("名前を入力してください");
			return;
		}

		try {
			// サーバーサイドからアドレスを取得
			const response = await fetch("/api/address");
			const data = await response.json();

			if (!data.success) {
				throw new Error(data.error);
			}

			const newProfile = setProfile(profileName, data.address);
			setProfileState(newProfile);
			setProfileName("");
			alert("プロフィールを保存しました");
		} catch (error: any) {
			alert(`エラー: ${error.message}`);
		}
	};

	// プロフィール削除処理
	const handleDeleteProfile = () => {
		if (confirm("プロフィールを削除しますか？")) {
			deleteProfile();
			setProfileState(null);
			alert("プロフィールを削除しました");
		}
	};

	// 友達追加処理
	const handleAddFriend = () => {
		if (!friendName.trim() || !friendAddress.trim()) {
			alert("名前とアドレスを入力してください");
			return;
		}

		try {
			const newFriend = addFriend(friendName, friendAddress as `0x${string}`);
			setFriendsState(getFriends());
			setFriendName("");
			setFriendAddress("");
			alert(`${newFriend.name}を友達リストに追加しました`);
		} catch (error: any) {
			alert(`エラー: ${error.message}`);
		}
	};

	// 友達削除処理
	const handleDeleteFriend = (id: string, name: string) => {
		if (confirm(`${name}を友達リストから削除しますか？`)) {
			deleteFriend(id);
			setFriendsState(getFriends());
			alert(`${name}を削除しました`);
		}
	};

	// UIレンダリング（次のレッスンで実装）
	return (
		<div className="flex flex-col h-screen bg-gray-50">
			{/* ヘッダー */}
			<div className="bg-white border-b p-4 flex justify-between items-center">
				<div>
					<h1 className="text-xl font-bold">JPYC AI Agent</h1>
					<p className="text-sm text-gray-600">Current Chain: {currentChainName}</p>
				</div>
				<button
					onClick={() => setShowSettings(!showSettings)}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
				>
					設定
				</button>
			</div>

			{/* メッセージリスト */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{messages.map((message, index) => (
					<div
						key={index}
						className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
					>
						<div
							className={`max-w-3xl px-4 py-2 rounded-lg ${
								message.role === "user"
									? "bg-blue-500 text-white"
									: "bg-white border"
							}`}
						>
							<ReactMarkdown>{message.content}</ReactMarkdown>
						</div>
					</div>
				))}
				{loading && (
					<div className="flex justify-start">
						<div className="bg-white border px-4 py-2 rounded-lg">
							<p className="text-gray-500">...</p>
						</div>
					</div>
				)}
				<div ref={messagesEndRef} />
			</div>

			{/* 入力フォーム */}
			<div className="bg-white border-t p-4">
				<div className="flex gap-2">
					<input
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyPress={(e) => e.key === "Enter" && sendMessage()}
						placeholder="メッセージを入力..."
						className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						disabled={loading}
					/>
					<button
						onClick={sendMessage}
						disabled={loading}
						className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
					>
						送信
					</button>
				</div>
			</div>
		</div>
	);
}
```

### 💡 コードの解説

このファイルでは、Reactの状態管理とAPI連携を実装しています。  

主要なポイントを見ていきましょう。

#### 1. 状態管理

```typescript
const [messages, setMessages] = useState<Message[]>([]);
const [input, setInput] = useState("");
const [loading, setLoading] = useState(false);
const [conversationId, setConversationId] = useState<string | null>(null);
const [currentChainName, setCurrentChainName] = useState<string>("Loading...");
const [profile, setProfileState] = useState<UserProfile | null>(null);
const [friends, setFriendsState] = useState<Friend[]>([]);
```

**主要な状態：**

- **messages**: チャットメッセージの配列
- **input**: 入力フィールドの値
- **loading**: API呼び出し中かどうか
- **conversationId**: 会話を識別するID
- **currentChainName**: 現在のブロックチェーン名
- **profile**: ユーザーのプロフィール
- **friends**: 友達リスト

#### 2. 自動スクロール

```typescript
const messagesEndRef = useRef<HTMLDivElement>(null);

useEffect(() => {
	messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages, loading]);
```

新しいメッセージが追加されたとき、自動的に最新のメッセージまでスクロールします。

#### 3. データの読み込み

```typescript
useEffect(() => {
	setProfileState(getProfile());
	setFriendsState(getFriends());
}, []);
```

コンポーネントのマウント時に、localStorageからプロフィールと友達リストを読み込みます。

#### 4. チェーン情報の定期取得

```typescript
useEffect(() => {
	const fetchCurrentChain = async () => {
		const response = await fetch("/api/chain");
		const data = await response.json();
		if (data.success) {
			setCurrentChainName(data.chainName);
		}
	};

	fetchCurrentChain();
	const interval = setInterval(fetchCurrentChain, 3000);
	return () => clearInterval(interval);
}, [messages]);
```

現在のチェーン名を3秒ごとに取得します。  

ユーザーが「Avalancheに切り替えて」と言った場合、UIに反映されます。

#### 5. メッセージ送信処理

```typescript
const sendMessage = async () => {
	if (!input.trim()) return;

	const userMessage: Message = {
		role: "user",
		content: input,
		timestamp: new Date(),
	};

	setMessages((prev) => [...prev, userMessage]);
	setInput("");
	setLoading(true);

	// API呼び出し
}
```

**処理の流れ：**

1. 入力が空でないことを確認
2. ユーザーメッセージを作成してメッセージリストに追加
3. 入力フィールドをクリア
4. ローディング状態を有効化
5. APIを呼び出す

#### 6. ストリーミングレスポンスの処理

```typescript
const reader = response.body?.getReader();
const decoder = new TextDecoder();
let assistantMessage = "";

// 空のアシスタントメッセージを追加
setMessages((prev) => [
	...prev,
	{
		role: "assistant",
		content: "",
		timestamp: new Date(),
	},
]);

if (reader) {
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;

		const chunk = decoder.decode(value);
		assistantMessage += chunk;

		// メッセージを更新
		setMessages((prev) => {
			const newMessages = [...prev];
			newMessages[newMessages.length - 1] = {
				role: "assistant",
				content: assistantMessage,
				timestamp: new Date(),
			};
			return newMessages;
		});
	}
}
```

**ストリーミングの仕組み：**

1. レスポンスボディから`ReadableStream`を取得
2. 空のアシスタントメッセージを追加
3. チャンクを受信するたびにメッセージを更新
4. ユーザーはAI Agentの回答がリアルタイムで表示されるのを見ることができる


#### 7. プロフィール管理

```typescript
const handleSaveProfile = async () => {
	if (!profileName.trim()) {
		alert("名前を入力してください");
		return;
	}

	try {
		// サーバーサイドからアドレスを取得
		const response = await fetch("/api/address");
		const data = await response.json();

		if (!data.success) {
			throw new Error(data.error);
		}

		const newProfile = setProfile(profileName, data.address);
		setProfileState(newProfile);
		setProfileName("");
		alert("プロフィールを保存しました");
	} catch (error: any) {
		alert(`エラー: ${error.message}`);
	}
};
```

**重要な変更点：**

以前のバージョンではユーザーが手動でアドレスを入力していましたが、最新版では**サーバーサイド（`/api/address`）からアドレスを自動取得**します。

これにより：
- ユーザーはアドレスを知らなくてもプロフィールを設定できる
- プライベートキーから自動的にアドレスが導出される
- 入力ミスを防げる

#### 8. 友達管理

```typescript
const handleAddFriend = () => {
	if (!friendName.trim() || !friendAddress.trim()) {
		alert("名前とアドレスを入力してください");
		return;
	}

	try {
		const newFriend = addFriend(friendName, friendAddress as `0x${string}`);
		setFriendsState(getFriends());
		setFriendName("");
		setFriendAddress("");
		alert(`${newFriend.name}を友達リストに追加しました`);
	} catch (error: any) {
		alert(`エラー: ${error.message}`);
	}
};
```

友達の追加・削除処理を関数として分離することで、コードの可読性と保守性が向上します。

#### 9. UIレンダリング

```typescript
<div className="flex flex-col h-screen bg-gray-50">
	{/* ヘッダー */}
	<div className="bg-white border-b p-4">
		<h1 className="text-xl font-bold">JPYC AI Agent</h1>
		<p className="text-sm text-gray-600">Current Chain: {currentChainName}</p>
	</div>

	{/* メッセージリスト */}
	<div className="flex-1 overflow-y-auto p-4 space-y-4">
		{messages.map((message, index) => (
			<div key={index} className={message.role === "user" ? "justify-end" : "justify-start"}>
				<ReactMarkdown>{message.content}</ReactMarkdown>
			</div>
		))}
	</div>

	{/* 入力フォーム */}
	<div className="bg-white border-t p-4">
		<input
			value={input}
			onChange={(e) => setInput(e.target.value)}
			onKeyPress={(e) => e.key === "Enter" && sendMessage()}
		/>
		<button onClick={sendMessage}>送信</button>
	</div>
</div>
```

**UIの構成：**

- **ヘッダー**: タイトルと現在のチェーン表示
- **メッセージリスト**: ユーザーとAI Agentのメッセージ
- **入力フォーム**: メッセージ入力とEnterキーでの送信

**ReactMarkdown**: AI Agentの回答に含まれるマークダウン（リンクなど）を適切に表示します。

### 🧪 動作確認

この段階では、基本的なチャット機能が動作します。

1. **開発サーバーの起動**

```bash
# ターミナル1: MCPサーバー
pnpm mcp:dev

# ターミナル2: Next.jsアプリ
pnpm dev
```

2. **ブラウザで確認**

`http://localhost:3000`にアクセスし、メッセージを送信してみましょう：

- 「残高教えて」
- 「総供給量は？」
- 「現在のチェーンは？」

AI Agentが適切に応答することを確認できます。

次のレッスンでは、設定画面とプロフィール・友達リスト管理UIを実装します。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#jpyc`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット

---

次のレッスンでは、設定画面と友達リスト管理UIを実装します！

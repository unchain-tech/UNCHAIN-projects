---
title: チャットインターフェース（後半）
---

### 💬 チャットインタフェース（後半）

このレッスンでは、前のレッスンで実装したチャットインタフェースに、設定画面と友達リスト管理UIを追加して完成させます。

これにより、ユーザーは自分のプロフィールと友達リストをGUI上で管理できるようになります。

### 📝 実装するファイル（後半部分）

前のレッスンで作成した`src/components/ChatInterface.tsx`ファイルの`return`文を以下のコードに置き換えます：

```typescript
// UIレンダリング
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

		{/* 設定モーダル */}
		{showSettings && (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
				<div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-bold">設定</h2>
						<button
							onClick={() => setShowSettings(false)}
							className="text-gray-500 hover:text-gray-700"
						>
							✕
						</button>
					</div>

					{/* プロフィール設定 */}
					<div className="mb-6">
						<h3 className="text-lg font-semibold mb-2">プロフィール</h3>
						{profile ? (
							<div className="bg-gray-50 p-4 rounded-lg">
								<p className="text-sm text-gray-600">名前: {profile.name}</p>
								<p className="text-sm text-gray-600 break-all">
									アドレス: {profile.address}
								</p>
								<button
									onClick={() => {
										if (
											window.confirm(
												"プロフィールを削除しますか？この操作は取り消せません。",
											)
										) {
											deleteProfile();
											setProfileState(null);
										}
									}}
									className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
								>
									削除
								</button>
							</div>
						) : (
							<div className="space-y-2">
								<input
									type="text"
									value={profileName}
									onChange={(e) => setProfileName(e.target.value)}
									placeholder="名前"
									className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
								<input
									type="text"
									value={input}
									onChange={(e) => {
										const value = e.target.value;
										// 0xで始まる16進数のアドレスのみ許可
										if (value === "" || /^0x[0-9a-fA-F]*$/.test(value)) {
											setInput(value);
										}
									}}
									placeholder="アドレス (0x...)"
									className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
								<button
									onClick={() => {
										if (
											profileName &&
											input &&
											/^0x[0-9a-fA-F]{40}$/.test(input)
										) {
											try {
												const newProfile = setProfile(
													profileName,
													input as `0x${string}`,
												);
												setProfileState(newProfile);
												setProfileName("");
												setInput("");
											} catch (error) {
												alert(
													error instanceof Error
														? error.message
														: "プロフィールの保存に失敗しました",
												);
											}
										} else {
											alert(
												"名前と有効なアドレス（0x + 40桁の16進数）を入力してください",
											);
										}
									}}
									className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
								>
									保存
								</button>
							</div>
						)}
					</div>

					{/* 友達リスト */}
					<div>
						<h3 className="text-lg font-semibold mb-2">友達リスト</h3>
						<div className="space-y-2 mb-4">
							{friends.map((friend) => (
								<div
									key={friend.id}
									className="bg-gray-50 p-3 rounded-lg flex justify-between items-start"
								>
									<div className="flex-1">
										<p className="font-medium">{friend.name}</p>
										<p className="text-sm text-gray-600 break-all">
											{friend.address}
										</p>
									</div>
									<button
										onClick={() => {
											if (
												window.confirm(
													`${friend.name}を友達リストから削除しますか？`,
												)
											) {
												deleteFriend(friend.id);
												setFriendsState(getFriends());
											}
										}}
										className="ml-2 px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
									>
										削除
									</button>
								</div>
							))}
						</div>

						{/* 友達追加フォーム */}
						<div className="space-y-2">
							<input
								type="text"
								value={friendName}
								onChange={(e) => setFriendName(e.target.value)}
								placeholder="友達の名前"
								className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<input
								type="text"
								value={friendAddress}
								onChange={(e) => {
									const value = e.target.value;
									// 0xで始まる16進数のアドレスのみ許可
									if (value === "" || /^0x[0-9a-fA-F]*$/.test(value)) {
										setFriendAddress(value);
									}
								}}
								placeholder="友達のアドレス (0x...)"
								className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<button
								onClick={() => {
									if (
										friendName &&
										friendAddress &&
										/^0x[0-9a-fA-F]{40}$/.test(friendAddress)
									) {
										try {
											addFriend(friendName, friendAddress as `0x${string}`);
											setFriendsState(getFriends());
											setFriendName("");
											setFriendAddress("");
										} catch (error) {
											alert(
												error instanceof Error
													? error.message
													: "友達の追加に失敗しました",
											);
										}
									} else {
										alert(
											"名前と有効なアドレス（0x + 40桁の16進数）を入力してください",
										);
									}
								}}
								className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
							>
								友達を追加
							</button>
						</div>
					</div>
				</div>
			</div>
		)}

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
```

### 💡 コードの解説

このレッスンでは、設定モーダルとプロフィール・友達リスト管理UIを実装します。主要なポイントを見ていきましょう。

#### 1. 設定モーダルの表示/非表示

```typescript
{showSettings && (
	<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		<div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
			...
		</div>
	</div>
)}
```

**モーダルの実装：**

- `fixed inset-0`: 画面全体を覆う固定配置
- `bg-black bg-opacity-50`: 半透明の黒背景（オーバーレイ）
- `z-50`: 他の要素より前面に表示
- `max-h-[80vh] overflow-y-auto`: 画面の80％以内で、超えた場合はスクロール

#### 2. プロフィール設定UI

**既存プロフィールの表示**

```typescript
{profile ? (
	<div className="bg-gray-50 p-4 rounded-lg">
		<p className="text-sm text-gray-600">名前: {profile.name}</p>
		<p className="text-sm text-gray-600 break-all">
			アドレス: {profile.address}
		</p>
		<button onClick={() => { ... }}>削除</button>
	</div>
) : (
	// 新規プロフィール作成フォーム
)}
```

プロフィールが存在する場合は表示し、削除ボタンを提供します。

**新規プロフィール作成**

```typescript
<input
	type="text"
	value={profileName}
	onChange={(e) => setProfileName(e.target.value)}
	placeholder="名前"
/>
<input
	type="text"
	value={input}
	onChange={(e) => {
		const value = e.target.value;
		// 0xで始まる16進数のアドレスのみ許可
		if (value === "" || /^0x[0-9a-fA-F]*$/.test(value)) {
			setInput(value);
		}
	}}
	placeholder="アドレス (0x...)"
/>
```

**バリデーション：**

- アドレス入力時に正規表現で16進数のみ許可
- 保存時に完全な形式（0x + 40桁）をチェック

**保存処理**

```typescript
onClick={() => {
	if (profileName && input && /^0x[0-9a-fA-F]{40}$/.test(input)) {
		try {
			const newProfile = setProfile(profileName, input as `0x${string}`);
			setProfileState(newProfile);
			setProfileName("");
			setInput("");
		} catch (error) {
			alert(error instanceof Error ? error.message : "プロフィールの保存に失敗しました");
		}
	} else {
		alert("名前と有効なアドレス（0x + 40桁の16進数）を入力してください");
	}
}}
```

**処理の流れ：**

1. 入力値とアドレス形式をバリデーション
2. `setProfile()`でlocalStorageに保存
3. React stateを更新
4. 入力フィールドをクリア
5. エラーハンドリング

#### 3. 友達リストの表示

```typescript
{friends.map((friend) => (
	<div key={friend.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-start">
		<div className="flex-1">
			<p className="font-medium">{friend.name}</p>
			<p className="text-sm text-gray-600 break-all">{friend.address}</p>
		</div>
		<button onClick={() => { ... }}>削除</button>
	</div>
))}
```

**表示のポイント：**

- `key={friend.id}`: Reactのリストレンダリングに必須
- `break-all`: 長いアドレスを折り返して表示
- `flex justify-between`: 名前/アドレスと削除ボタンを両端に配置

**削除処理**

```typescript
onClick={() => {
	if (window.confirm(`${friend.name}を友達リストから削除しますか？`)) {
		deleteFriend(friend.id);
		setFriendsState(getFriends());
	}
}}
```

**処理の流れ：**

1. 確認ダイアログを表示
2. `deleteFriend()`でlocalStorageから削除
3. `getFriends()`で最新の友達リストを取得
4. React stateを更新

#### 4. 友達追加フォーム

```typescript
<input
	type="text"
	value={friendName}
	onChange={(e) => setFriendName(e.target.value)}
	placeholder="友達の名前"
/>
<input
	type="text"
	value={friendAddress}
	onChange={(e) => {
		const value = e.target.value;
		if (value === "" || /^0x[0-9a-fA-F]*$/.test(value)) {
			setFriendAddress(value);
		}
	}}
	placeholder="友達のアドレス (0x...)"
/>
```

プロフィール入力と同様に、アドレスの入力時に16進数のみを許可します。

**追加処理**

```typescript
onClick={() => {
	if (friendName && friendAddress && /^0x[0-9a-fA-F]{40}$/.test(friendAddress)) {
		try {
			addFriend(friendName, friendAddress as `0x${string}`);
			setFriendsState(getFriends());
			setFriendName("");
			setFriendAddress("");
		} catch (error) {
			alert(error instanceof Error ? error.message : "友達の追加に失敗しました");
		}
	} else {
		alert("名前と有効なアドレス（0x + 40桁の16進数）を入力してください");
	}
}}
```

**処理の流れ：**

1. 入力値とアドレス形式をバリデーション
2. `addFriend()`でlocalStorageに保存
   - 重複チェックは`addFriend()`内で実行される
3. React stateを更新
4. 入力フィールドをクリア
5. エラーハンドリング（重複エラーを含む）

#### 5. メッセージリストと入力フォーム

```typescript
{/* メッセージリスト */}
<div className="flex-1 overflow-y-auto p-4 space-y-4">
	{messages.map((message, index) => (
		<div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
			<div className={`max-w-3xl px-4 py-2 rounded-lg ${
				message.role === "user" ? "bg-blue-500 text-white" : "bg-white border"
			}`}>
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
			disabled={loading}
		/>
		<button onClick={sendMessage} disabled={loading}>
			送信
		</button>
	</div>
</div>
```

これらは前のレッスンと同じコードです。設定モーダルと共存できるように、適切にレイアウトされています。

### 🧪 動作確認

完成したアプリケーションを起動して、全機能を確認しましょう。

1. **開発サーバーの起動**

```bash
# ターミナル1: MCPサーバー
pnpm mcp:dev

# ターミナル2: Next.jsアプリ
pnpm dev
```

2. **ブラウザで確認**

`http://localhost:3000`にアクセスします。

**プロフィール設定**

1. 右上の「設定」ボタンをクリック
2. 名前とアドレスを入力
3. 「保存」をクリック
4. プロフィールが表示されることを確認

**友達追加**

1. 設定画面で「友達の名前」と「友達のアドレス」を入力
2. 「友達を追加」をクリック
3. 友達リストに追加されることを確認

**名前を使った送信**

1. 設定画面を閉じる
2. チャット欄に「太郎に100JPYC送って」と入力（太郎は友達リストに登録済みの名前）
3. AI Agentが友達リストから太郎のアドレスを検索し、送信を実行
4. トランザクションハッシュ付きの応答が返ることを確認

**友達の残高照会**

1. 「太郎の残高教えて」と入力
2. AI Agentが友達リストから太郎のアドレスを検索し、残高を照会
3. 残高が表示されることを確認

### 🎉 完成！

おめでとうございます！ JPYC AI Agent ChatAppが完成しました！

このアプリケーションでは、以下の機能が実装されています：

**AI Agent機能**
- 自然言語でのJPYC操作（送信、残高照会、総供給量照会）
- マルチチェーン対応（Ethereum Sepolia、Avalanche Fuji）
- チェーン切り替え機能

**ユーザー管理機能**
- プロフィール設定（名前、アドレス）
- 友達リスト管理（追加、削除）
- 名前を使った送信・残高照会

**チャットUI**
- リアルタイムストリーミング応答
- マークダウン対応
- 自動スクロール
- ローディング表示

### 🚀 次のステップ

このアプリケーションをベースに、さらに以下のような機能を追加できます：

1. **会話履歴の保存**: localStorageにメッセージを保存
2. **友達の編集機能**: 名前やアドレスの変更
3. **送信履歴の表示**: 過去のトランザクション一覧
4. **通知機能**: 送信完了時のトースト通知
5. **ダークモード**: UIのテーマ切り替え
6. **複数ウォレット対応**: MetaMask連携

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#jpyc`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット

---

これでAI Agent JPYC ChatAppのすべてのレッスンが完了しました！ お疲れ様でした！

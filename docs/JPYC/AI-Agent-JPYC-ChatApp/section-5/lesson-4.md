---
title: チャットインターフェース（後半）
---

### 💬 チャットインタフェース（後半）

このレッスンでは、前のレッスンで実装したチャットインタフェースに、モダンなUIデザインと完全な設定画面を追加して完成させます。

Glassmorphism、グラデーション、アニメーションを使用した美しいUIを実装します。

### 📝 実装するファイル（後半部分）

前のレッスンで作成した`src/components/ChatInterface.tsx`ファイルの`return`文を以下のコードに置き換えます：

```typescript
// UIレンダリング
return (
	<div className="relative flex flex-col h-screen max-w-7xl mx-auto p-6">
		{/* Header - Modern Glassmorphism Design */}
		<div className="glass rounded-2xl mb-6 p-6 border border-primary-500/20 shadow-glow">
			<div className="flex justify-between items-center">
				<div className="flex items-center gap-4">
					<div className="relative">
						<div className="absolute inset-0 bg-primary-500 blur-xl opacity-50 animate-pulse-slow"></div>
						<h1 className="relative text-3xl font-bold gradient-text">
							UNCHAIN × JPYC AI Agent
						</h1>
					</div>
					<div className="h-8 w-px bg-gradient-to-b from-transparent via-primary-500/50 to-transparent"></div>
					<div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500/10 border border-primary-500/20">
						<div className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></div>
						<span className="text-sm font-medium text-primary-300">
							{currentChainName}
						</span>
					</div>
				</div>
				<div className="flex items-center gap-3">
					{profile && (
						<div className="px-4 py-2 rounded-xl bg-dark-800/50 border border-primary-500/20">
							<span className="text-sm font-medium text-primary-200">
								👤 {profile.name}
							</span>
						</div>
					)}
					<button
						type="button"
						onClick={() => setShowSettings(!showSettings)}
						className="group relative px-5 py-2.5 rounded-xl bg-gradient-primary text-white font-medium overflow-hidden transition-all hover:shadow-glow-lg"
					>
						<span className="relative z-10">
							{showSettings ? "✕ 閉じる" : "⚙️ 設定"}
						</span>
						<div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
					</button>
				</div>
			</div>
		</div>

		{/* Settings Panel - Modern Card Design */}
		{showSettings && (
			<div className="glass rounded-2xl mb-6 p-6 border border-primary-500/20 shadow-glow animate-fadeIn">
				<div className="grid md:grid-cols-2 gap-6">
					{/* Profile Section */}
					<div className="space-y-4">
						<h2 className="text-xl font-bold text-primary-200 flex items-center gap-2">
							<span className="text-2xl">👤</span>
							プロフィール
						</h2>
						{profile ? (
							<div className="space-y-3 p-4 rounded-xl bg-dark-800/50 border border-primary-500/10">
								<div className="space-y-2">
									<p className="text-sm text-dark-400">名前</p>
									<p className="text-lg font-medium text-primary-100">
										{profile.name}
									</p>
								</div>
								<div className="space-y-2">
									<p className="text-sm text-dark-400">アドレス</p>
									<p className="text-sm font-mono text-primary-300 break-all bg-dark-900/50 p-2 rounded-lg">
										{profile.address}
									</p>
								</div>
								<button
									type="button"
									onClick={handleDeleteProfile}
									className="w-full px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all font-medium"
								>
									🗑️ 削除
								</button>
							</div>
						) : (
							<div className="space-y-3">
								<input
									type="text"
									value={profileName}
									onChange={(e) => setProfileName(e.target.value)}
									placeholder="あなたの名前"
									className="w-full px-4 py-3 rounded-xl bg-dark-800/50 border border-primary-500/20 text-primary-100 placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:shadow-glow-sm transition-all"
								/>
								<button
									type="button"
									onClick={handleSaveProfile}
									className="w-full px-4 py-3 rounded-xl bg-gradient-primary text-white font-medium hover:shadow-glow-lg transition-all"
								>
									💾 保存
								</button>
							</div>
						)}
					</div>

					{/* Friends Section */}
					<div className="space-y-4">
						<h2 className="text-xl font-bold text-primary-200 flex items-center gap-2">
							<span className="text-2xl">👥</span>
							友達リスト
						</h2>
						<div className="space-y-3 max-h-64 overflow-y-auto">
							{friends.length === 0 ? (
								<p className="text-sm text-dark-400 text-center py-8">
									友達が登録されていません
								</p>
							) : (
								friends.map((friend) => (
									<div
										key={friend.id}
										className="group flex justify-between items-start p-4 rounded-xl bg-dark-800/50 border border-primary-500/10 hover:border-primary-500/30 transition-all"
									>
										<div className="flex-1 min-w-0 space-y-1">
											<p className="font-medium text-primary-100">
												{friend.name}
											</p>
											<p className="text-xs font-mono text-dark-400 break-all">
												{friend.address}
											</p>
										</div>
										<button
											type="button"
											onClick={() =>
												handleDeleteFriend(friend.id, friend.name)
											}
											className="ml-3 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all text-sm opacity-0 group-hover:opacity-100"
										>
											削除
										</button>
									</div>
								))
							)}
						</div>
						<div className="space-y-2 pt-3 border-t border-primary-500/10">
							<input
								type="text"
								value={friendName}
								onChange={(e) => setFriendName(e.target.value)}
								placeholder="友達の名前"
								className="w-full px-4 py-2.5 rounded-xl bg-dark-800/50 border border-primary-500/20 text-primary-100 placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:shadow-glow-sm transition-all"
							/>
							<input
								type="text"
								value={friendAddress}
								onChange={(e) => setFriendAddress(e.target.value)}
								placeholder="0xから始まるアドレス"
								className="w-full px-4 py-2.5 rounded-xl bg-dark-800/50 border border-primary-500/20 text-primary-100 placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:shadow-glow-sm transition-all font-mono text-sm"
							/>
							<button
								type="button"
								onClick={handleAddFriend}
								className="w-full px-4 py-2.5 rounded-xl bg-gradient-primary text-white font-medium hover:shadow-glow-lg transition-all"
							>
								➕ 追加
							</button>
						</div>
					</div>
				</div>
			</div>
		)}

		{/* Messages Area - Premium Chat Design */}
		<div className="flex-1 overflow-y-auto mb-6 space-y-4 px-2">
			{messages.length === 0 && (
				<div className="glass rounded-2xl p-8 border border-primary-500/20 text-center animate-fadeIn">
					<div className="inline-block p-4 rounded-full bg-primary-500/10 mb-4">
						<span className="text-4xl">🤖</span>
					</div>
					<p className="text-2xl font-bold gradient-text mb-4">
						こんにちは！
					</p>
					<p className="text-dark-300 mb-6">
						JPYCの送金や残高照会をお手伝いします
					</p>
					<div className="grid md:grid-cols-3 gap-4 text-left max-w-3xl mx-auto">
						<div className="p-4 rounded-xl bg-dark-800/30 border border-primary-500/10">
							<p className="font-semibold text-primary-300 mb-2">
								⚙️ 初期設定
							</p>
							<ul className="text-sm text-dark-300 space-y-1">
								<li>• 名前を登録</li>
								<li>• 友達を追加</li>
							</ul>
						</div>
						<div className="p-4 rounded-xl bg-dark-800/30 border border-primary-500/10">
							<p className="font-semibold text-accent-cyan mb-2">
								🔄 チェーン切り替え
							</p>
							<ul className="text-sm text-dark-300 space-y-1">
								<li>• Sepoliaに切り替え</li>
								<li>• Amoyで実行</li>
							</ul>
						</div>
						<div className="p-4 rounded-xl bg-dark-800/30 border border-primary-500/10">
							<p className="font-semibold text-accent-purple mb-2">
								💰 操作例
							</p>
							<ul className="text-sm text-dark-300 space-y-1">
								<li>• 残高を教えて</li>
								<li>• 100JPYC送って</li>
							</ul>
						</div>
					</div>
				</div>
			)}

			{messages.map((msg) => (
				<div
					key={`${msg.role}-${msg.timestamp.getTime()}`}
					className={`flex animate-fadeIn ${msg.role === "user" ? "justify-end" : "justify-start"}`}
				>
					<div
						className={`max-w-[75%] rounded-2xl p-4 ${
							msg.role === "user"
								? "bg-gradient-primary text-white shadow-glow"
								: "glass border border-primary-500/20"
						}`}
					>
						{msg.role === "assistant" ? (
							<div className="prose prose-sm max-w-none prose-invert">
								<ReactMarkdown
									components={{
										a: ({ node, ...props }) => (
											<a
												{...props}
												className="text-accent-cyan hover:text-accent-cyan/80 underline transition-colors"
												target="_blank"
												rel="noopener noreferrer"
											/>
										),
										p: ({ node, ...props }) => (
											<p
												{...props}
												className="mb-2 last:mb-0 text-dark-100"
											/>
										),
										strong: ({ node, ...props }) => (
											<strong
												{...props}
												className="font-bold text-primary-200"
											/>
										),
									}}
								>
									{msg.content}
								</ReactMarkdown>
							</div>
						) : (
							<p className="whitespace-pre-wrap">{msg.content}</p>
						)}
						<p className="text-xs opacity-60 mt-2">
							{msg.timestamp.toLocaleTimeString("ja-JP")}
						</p>
					</div>
				</div>
			))}

			{loading && (
				<div className="flex justify-start animate-fadeIn">
					<div className="glass rounded-2xl p-4 border border-primary-500/20">
						<div className="flex items-center gap-3">
							<div className="flex gap-1">
								<div
									className="w-2 h-2 rounded-full bg-primary-400 animate-bounce"
									style={{ animationDelay: "0ms" }}
								></div>
								<div
									className="w-2 h-2 rounded-full bg-primary-400 animate-bounce"
									style={{ animationDelay: "150ms" }}
								></div>
								<div
									className="w-2 h-2 rounded-full bg-primary-400 animate-bounce"
									style={{ animationDelay: "300ms" }}
								></div>
							</div>
							<span className="text-sm text-dark-300">AIが考え中...</span>
						</div>
					</div>
				</div>
			)}

			<div ref={messagesEndRef} />
		</div>

		{/* Input Area - Premium Input Design */}
		<div className="glass rounded-2xl p-4 border border-primary-500/20 shadow-glow">
			<div className="flex gap-3">
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyPress={(e) => e.key === "Enter" && !loading && sendMessage()}
					placeholder="メッセージを入力... (Enterで送信)"
					disabled={loading}
					className="flex-1 px-5 py-3 rounded-xl bg-dark-800/50 border border-primary-500/20 text-primary-100 placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:shadow-glow-sm transition-all disabled:opacity-50"
				/>
				<button
					type="button"
					onClick={sendMessage}
					disabled={loading || !input.trim()}
					className="group relative px-8 py-3 rounded-xl bg-gradient-primary text-white font-medium overflow-hidden transition-all hover:shadow-glow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
				>
					<span className="relative z-10 flex items-center gap-2">
						<span>送信</span>
						<span className="group-hover:translate-x-1 transition-transform">
							→
						</span>
					</span>
					<div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
				</button>
			</div>
		</div>
	</div>
);
```

### 💡 コードの解説

このファイルでは、前のレッスンで実装した機能に、モダンで美しいUIデザインを適用します。

主要なポイントを見ていきましょう。

#### 1. Glassmorphism デザイン

```typescript
<div className="glass rounded-2xl mb-6 p-6 border border-primary-500/20 shadow-glow">
```

**Glassmorphism（ガラスモーフィズム）**は、半透明のガラスのような質感を表現するUIデザイン手法です。

このプロジェクトでは、`glass`クラスを使用して以下の効果を実現しています：
- 半透明の背景
- ぼかし効果（backdrop-filter）
- 柔らかいグラデーションボーダー

#### 2. グラデーションテキスト

```typescript
<h1 className="relative text-3xl font-bold gradient-text">
	UNCHAIN × JPYC AI Agent
</h1>
```

`gradient-text`クラスは、タイトルテキストにグラデーションを適用します。

これにより、視覚的に目を引く印象的なタイトルを実現しています。

#### 3. アニメーション効果

```typescript
<div className="absolute inset-0 bg-primary-500 blur-xl opacity-50 animate-pulse-slow"></div>
```

カスタムアニメーションを使用して、動的な視覚効果を追加しています：
- **animate-pulse-slow**: ゆっくりとしたパルスアニメーション
- **animate-fadeIn**: フェードイン効果
- **animate-bounce**: バウンスアニメーション（ローディング時）

#### 4. ステータスインジケーター

```typescript
<div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500/10 border border-primary-500/20">
	<div className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></div>
	<span className="text-sm font-medium text-primary-300">
		{currentChainName}
	</span>
</div>
```

現在のチェーンを視覚的に表示するステータスインジケーターです。

緑色の点滅するドットで、システムが稼働中であることを示します。

#### 5. プロフィール表示の改善

```typescript
{profile ? (
	<div className="space-y-3 p-4 rounded-xl bg-dark-800/50 border border-primary-500/10">
		<div className="space-y-2">
			<p className="text-sm text-dark-400">名前</p>
			<p className="text-lg font-medium text-primary-100">
				{profile.name}
			</p>
		</div>
		<div className="space-y-2">
			<p className="text-sm text-dark-400">アドレス</p>
			<p className="text-sm font-mono text-primary-300 break-all bg-dark-900/50 p-2 rounded-lg">
				{profile.address}
			</p>
		</div>
	</div>
) : (
	<div className="space-y-3">
		<input
			type="text"
			value={profileName}
			onChange={(e) => setProfileName(e.target.value)}
			placeholder="あなたの名前"
			className="w-full px-4 py-3 rounded-xl bg-dark-800/50 border border-primary-500/20 text-primary-100 placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:shadow-glow-sm transition-all"
		/>
		<button
			type="button"
			onClick={handleSaveProfile}
			className="w-full px-4 py-3 rounded-xl bg-gradient-primary text-white font-medium hover:shadow-glow-lg transition-all"
		>
			💾 保存
		</button>
	</div>
)}
```

**重要な変更点：**

以前のバージョンでは、プロフィール設定時にユーザーがアドレスを手動で入力する必要がありました。

最新版では、`handleSaveProfile`関数が**サーバーサイド（`/api/address`）からアドレスを自動取得**するため、ユーザーは名前だけを入力すればよくなりました。

#### 6. ウェルカムメッセージ

```typescript
{messages.length === 0 && (
	<div className="glass rounded-2xl p-8 border border-primary-500/20 text-center animate-fadeIn">
		<div className="inline-block p-4 rounded-full bg-primary-500/10 mb-4">
			<span className="text-4xl">🤖</span>
		</div>
		<p className="text-2xl font-bold gradient-text mb-4">
			こんにちは！
		</p>
		<p className="text-dark-300 mb-6">
			JPYCの送金や残高照会をお手伝いします
		</p>
		<div className="grid md:grid-cols-3 gap-4 text-left max-w-3xl mx-auto">
			{/* 操作ガイド */}
		</div>
	</div>
)}
```

メッセージが空の場合、ユーザーに対して機能の紹介と使い方ガイドを表示します。

これにより、初めてのユーザーでも何ができるかすぐに理解できます。

#### 7. メッセージバブルのデザイン

```typescript
<div
	className={`max-w-[75%] rounded-2xl p-4 ${
		msg.role === "user"
			? "bg-gradient-primary text-white shadow-glow"
			: "glass border border-primary-500/20"
	}`}
>
	{msg.role === "assistant" ? (
		<div className="prose prose-sm max-w-none prose-invert">
			<ReactMarkdown
				components={{
					a: ({ node, ...props }) => (
						<a
							{...props}
							className="text-accent-cyan hover:text-accent-cyan/80 underline transition-colors"
							target="_blank"
							rel="noopener noreferrer"
						/>
					),
					p: ({ node, ...props }) => (
						<p
							{...props}
							className="mb-2 last:mb-0 text-dark-100"
						/>
					),
					strong: ({ node, ...props }) => (
						<strong
							{...props}
							className="font-bold text-primary-200"
						/>
					),
				}}
			>
				{msg.content}
			</ReactMarkdown>
		</div>
	) : (
		<p className="whitespace-pre-wrap">{msg.content}</p>
	)}
	<p className="text-xs opacity-60 mt-2">
		{msg.timestamp.toLocaleTimeString("ja-JP")}
	</p>
</div>
```

**ReactMarkdownのカスタマイズ：**

AI Agentの回答に含まれるマークダウンを美しく表示するため、各要素にカスタムスタイルを適用しています：

- **リンク**: シアン色で目立たせ、ホバー時に色を変更
- **段落**: 適切な余白を設定
- **太字**: プライマリカラーで強調

#### 8. ローディングアニメーション

```typescript
{loading && (
	<div className="flex justify-start animate-fadeIn">
		<div className="glass rounded-2xl p-4 border border-primary-500/20">
			<div className="flex items-center gap-3">
				<div className="flex gap-1">
					<div
						className="w-2 h-2 rounded-full bg-primary-400 animate-bounce"
						style={{ animationDelay: "0ms" }}
					></div>
					<div
						className="w-2 h-2 rounded-full bg-primary-400 animate-bounce"
						style={{ animationDelay: "150ms" }}
					></div>
					<div
						className="w-2 h-2 rounded-full bg-primary-400 animate-bounce"
						style={{ animationDelay: "300ms" }}
					></div>
				</div>
				<span className="text-sm text-dark-300">AIが考え中...</span>
			</div>
		</div>
	</div>
)}
```

3つのドットが順番にバウンスするアニメーションで、AI Agentが応答を生成中であることを視覚的に示します。

`animationDelay`を使用して、各ドットのタイミングをずらすことで、波のような動きを実現しています。

#### 9. 入力エリアのインタラクション

```typescript
<button
	type="button"
	onClick={sendMessage}
	disabled={loading || !input.trim()}
	className="group relative px-8 py-3 rounded-xl bg-gradient-primary text-white font-medium overflow-hidden transition-all hover:shadow-glow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
>
	<span className="relative z-10 flex items-center gap-2">
		<span>送信</span>
		<span className="group-hover:translate-x-1 transition-transform">
			→
		</span>
	</span>
	<div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
</button>
```

ボタンにインタラクティブなエフェクトを追加：
- ホバー時に矢印アイコンが右に移動
- 背景が下からスライドイン
- グロー効果が強調される

### 🎨 必要なCSSクラス

このUIを実現するには、`src/app/globals.css`に以下のカスタムクラスとアニメーションを定義する必要があります：

```css
/* Glassmorphism */
.glass {
  background: rgba(17, 25, 40, 0.75);
  backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.125);
}

/* Gradient text */
.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Gradient button */
.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Glow effects */
.shadow-glow {
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.2);
}

.shadow-glow-lg {
  box-shadow: 0 0 30px rgba(102, 126, 234, 0.4);
}

/* Custom animations */
@keyframes pulse-slow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.8; }
}

.animate-pulse-slow {
  animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
```

### 🧪 動作確認

この段階で、完全なチャットアプリケーションが完成しました！

1. **開発サーバーの起動**

```bash
# ターミナル1: MCPサーバー
pnpm mcp:dev

# ターミナル2: Next.jsアプリ
pnpm dev
```

2. **ブラウザで確認**

`http://localhost:3000`にアクセスし、以下を確認しましょう：

**初期表示:**
- ✨ モダンなGlassmorphismデザイン
- ウェルカムメッセージと使い方ガイド
- グラデーションテキストとアニメーション

**設定画面:**
- プロフィール登録（名前のみ入力、アドレスは自動取得）
- 友達リストの追加・削除
- 美しいカードデザインとホバーエフェクト

**チャット機能:**
- メッセージの送受信
- ローディングアニメーション
- マークダウンリンクの表示
- タイムスタンプ表示

**試してみましょう：**
1. 設定から自分の名前を登録
2. 友達を追加
3. 「残高教えて」と送信
4. 「友達の名前に100JPYC送って」と送信
5. リンク付き応答を確認

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#jpyc`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット

---

🎉 おめでとうございます！ JPYC AI Agent ChatAppが完成しました！

次のステップとして、以下のような拡張機能を実装してみましょう：
- 他のブロックチェーン（Polygon Amoy）への対応
- トランザクション履歴の表示
- より高度なAI機能の追加

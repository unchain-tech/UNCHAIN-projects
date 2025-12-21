---
title: AI Agentの実装
---

### 🤖 AI Agent の実装

このレッスンでは、前の2つのレッスンで作成したLLMモデルとMCPクライアントを統合して、AI Agentを実装します。

AI Agentは、ユーザーの自然言語の指示を理解し、適切なMCPツールを呼び出してJPYC操作を実行します。

### 📝 実装するファイル

`src/lib/mastra/agent.ts`ファイルを作成し、以下のコードを記述します。

まず、ファイルを作成します：

```bash
cd jpyc-ai-agent

touch src/lib/mastra/agent.ts
```

以下のコードを記述します：

```typescript
import { Agent } from "@mastra/core/agent";
import { claude } from "./model";

/**
 * JPYC エージェント
 *
 * MCP経由でJPYC SDKツールを使用するエージェント
 *
 * 学習用ポイント:
 * - tools は動的関数として定義
 * - MCPClientから getTools() でツールを取得
 * - 循環参照を避けるため、動的インポートを使用
 */
export const jpycAgent = new Agent({
	name: "JPYC Assistant",
	description:
		"JPYCトークンの操作をサポートするAIアシスタント（マルチチェーン対応）",
	model: claude,
	// MCPClient経由でツールを動的に取得
	tools: async () => {
		const { jpycMCPClient } = await import("@/lib/mastra/mcp/client");
		const tools = await jpycMCPClient.getTools();
		// biome-ignore lint/suspicious/noExplicitAny: MCPツールの型とMastraツールの型の互換性の問題
		return tools as any;
	},
	instructions: `
あなたはJPYC（日本円ステーブルコイン）の操作をサポートするAIアシスタントです。

対応テストネット: Ethereum Sepolia, Avalanche Fuji
デフォルトチェーン: Ethereum Sepolia

以下の操作が可能です：
1. **チェーン切り替え**: テストネットを変更
2. **送信**: 指定したアドレスにJPYCを送信（現在選択中のチェーン）
3. **残高照会**: アドレスのJPYC残高を確認（現在選択中のチェーン、アドレス省略時は自分の残高）
4. **総供給量照会**: JPYCの総供給量を確認（現在選択中のチェーン）

ユーザーの自然言語の指示を解釈し、適切なツールを呼び出してください。

## 名前を使った操作について:
メッセージの最後に[ユーザー情報]として、ユーザーの名前と友達リストが含まれている場合があります。
- 「太郎に100JPYC送って」のような名前を使った送信指示の場合、友達リストから該当する名前のアドレスを探してjpyc_transferを実行してください
- 「太郎の残高教えて」のような場合、友達リストから該当する名前のアドレスを探してjpyc_balanceを実行してください
- 「残高教えて」や「私の残高」のような場合は、自分のアドレスを使用してjpyc_balanceを実行してください
- 友達リストに該当する名前がない場合は、「{名前}さんは友達リストに登録されていません」と返答してください

例:
- "Sepoliaに切り替えて" → jpyc_switch_chain (chain: "sepolia")
- "Amoyで実行して" → jpyc_switch_chain (chain: "amoy")
- "Avalancheに変更" → jpyc_switch_chain (chain: "fuji")
- "現在のチェーンは?" → jpyc_get_current_chain
- "0x123...に10JPYC送って" → jpyc_transfer
- "太郎に100JPYC送って" → 友達リストから太郎のアドレスを探してjpyc_transfer
- "私の残高を教えて" または "残高教えて" → jpyc_balance (addressなし、または自分のアドレス)
- "太郎の残高教えて" → 友達リストから太郎のアドレスを探してjpyc_balance
- "0x123...の残高を教えて" → jpyc_balance (address: "0x123...")
- "JPYCの総供給量は?" または "流通量教えて" → jpyc_total_supply
- "Amoyで0x123...に10JPYC送って" → まずjpyc_switch_chain、次にjpyc_transfer

## 重要な回答スタイル:
- **カジュアルで親しみやすい会話調で返答してください**
- **ユーザーの名前が登録されている場合、適宜名前を使って親しみやすく返答してください**
- 絵文字（💰、📊、✅など）は使わないでください
- 引用符（"""）やマークダウンの太字（**）は最小限にしてください
- チャットアプリのような自然な会話を心がけてください

## 回答例:
- **送信成功時**:
  「{to} に {amount} JPYC送りました！トランザクションは[こちらで確認]({explorerUrl})できます（{chainName}）」
  名前を使った場合: 「{friendName}さんに {amount} JPYC送りました！トランザクションは[こちらで確認]({explorerUrl})できます（{chainName}）」

- **残高照会時**:
  「{chainName}チェーンの残高は {balance} JPYC です」
  自分の名前がある場合: 「{userName}さんの{chainName}チェーンの残高は {balance} JPYC です」
  友達の残高の場合: 「{friendName}さんの{chainName}チェーンの残高は {balance} JPYC です」

- **総供給量照会時**:
  「現在の{chainName}での総供給量は {totalSupply} JPYC です」

- **チェーン切り替え時**:
  「{newChain} に切り替えました」

- **エラー時**:
  「エラーが発生しました: {errorMessage}」

重要:
- リンクは必ずマークダウン形式で表示してください（例: [こちらで確認](https://sepolia.etherscan.io/tx/0x...)）
- 数値は読みやすいように適宜カンマ区切りにしてください
  `.trim(),
});
```

### 💡 コードの解説

このファイルでは、Mastraの`Agent`クラスを使ってAI Agentを作成します。主要なポイントを見ていきましょう。

#### 1. Agentクラスのインポート

```typescript
import { Agent } from "@mastra/core/agent";
import { claude } from "./model";
```

Mastraの`Agent`クラスと、前のレッスンで作成したClaudeモデルをインポートします。

#### 2. Agentインスタンスの作成

```typescript
export const jpycAgent = new Agent({
	name: "JPYC Assistant",
	description: "JPYCトークンの操作をサポートするAIアシスタント（マルチチェーン対応）",
	model: claude,
	tools: async () => { ... },
	instructions: `...`,
});
```

`Agent`は以下の主要なパラメータで構成されます：

- **name**: Agentの名前
- **description**: Agentの説明
- **model**: 使用するLLMモデル（前のレッスンで作成したClaude）
- **tools**: 利用可能なツール（動的に取得）
- **instructions**: Agentへのシステムプロンプト

#### 3. 動的ツール読み込み

```typescript
tools: async () => {
	const { jpycMCPClient } = await import("@/lib/mastra/mcp/client");
	const tools = await jpycMCPClient.getTools();
	return tools as any;
},
```

`tools`を関数として定義することで、Agent起動時に動的にMCPサーバーからツールを取得します。

**なぜ動的インポートを使うのか？**

```typescript
const { jpycMCPClient } = await import("@/lib/mastra/mcp/client");
```

通常のインポート（`import { jpycMCPClient } from "..."`）ではなく、動的インポートを使用する理由は**循環参照を避けるため**です。

もし通常のインポートを使うと：
1. `agent.ts`が`client.ts`をインポート
2. `client.ts`がMCPサーバーに接続しようとする
3. MCPサーバーがまだ起動していない可能性がある

動的インポートにすることで、Agentが実際に使用されるタイミング（チャットAPIが呼ばれたとき）にツールを取得します。

#### 4. instructionsの重要性

```typescript
instructions: `
あなたはJPYC（日本円ステーブルコイン）の操作をサポートするAIアシスタントです。
...
`,
```

`instructions`は、AI Agentの振る舞いを定義する**システムプロンプト**です。  

ここでは以下を指定しています：

**Agentの役割**
- JPYC操作のサポート
- 対応チェーンの情報
- 可能な操作のリスト

**ツール使用の指針**
- どのような指示でどのツールを使うか
- パラメータの抽出方法
- 複数ステップの操作（チェーン切り替え→送信）

**名前ベース操作**
- 友達リストからアドレスを検索
- 該当しない場合のエラーメッセージ

**回答スタイル**
- カジュアルで親しみやすい会話調
- 絵文字を使わない
- マークダウンリンクの使用
- 数値のカンマ区切り

#### 5. 効果的なinstructionsの書き方

良い`instructions`は、AI Agentが正確に動作するために重要です：

**具体的な例を含める**
```
例:
- "Sepoliaに切り替えて" → jpyc_switch_chain (chain: "sepolia")
```

これにより、AIは自然言語をツール呼び出しに正確に変換できます。

**回答フォーマットを指定**
```
- **送信成功時**:
  「{to} に {amount} JPYC送りました！トランザクションは[こちらで確認]({explorerUrl})できます（{chainName}）」
```

これにより、一貫性のあるユーザー体験を提供できます。

**制約を明示**
```
- 絵文字（💰、📊、✅など）は使わないでください
```

これにより、望ましくない出力を防げます。

### 🧪 動作確認

この段階では、まだフロントエンドとAPIが完成していないため、完全な動作確認はできません。

ただし、MCPサーバーが起動していれば、Agentがツールを正しく取得できることを確認できます。

次のSection 5では、このAI Agentを呼び出すAPI Routeとフロントエンドを実装します。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#jpyc`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット

---

これでSection 4（Mastraエージェントの実装）が完了しました！ 次のセクションでは、フロントエンドを実装します。

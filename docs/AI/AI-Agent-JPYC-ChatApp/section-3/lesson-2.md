---
title: MCPツールの実装
---

### 🛠 MCP ツールの実装

このレッスンでは、前のレッスンで作成したJPYC SDK Wrapperを使用して、5つのMCPツールを実装します。

MCPツールは、AI Agentが実行できる「関数」として機能します。各ツールは、AI Agentに対して「何ができるか」を説明し、パラメータを検証し、実際の処理を実行します。

### 📝 実装するファイル

`external/mcp/src/tools.ts`ファイルを作成し、以下のコードを記述します。

```typescript
/**
 * JPYC Tools for Mastra
 *
 * JPYC SDKの機能をMastraツールとして提供
 */

import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import {
	getChainName,
	getCurrentAddress,
	getCurrentChain,
	jpyc,
	type SupportedChain,
	switchChain,
} from "./jpyc/sdk";

// エクスプローラーURLマッピング
const EXPLORER_URLS: Record<SupportedChain, string> = {
	sepolia: "https://sepolia.etherscan.io/tx/",
	amoy: "https://amoy.polygonscan.com/tx/",
	fuji: "https://testnet.snowtrace.io/tx/",
};

/**
 * JPYC残高照会ツール
 * 指定したアドレスのJPYC残高を照会します（現在選択されているテストネット）
 */
export const jpycBalanceTool = createTool({
	id: "jpyc_balance",
	description:
		"指定したアドレスのJPYC残高を照会します（現在選択されているテストネット）。アドレスが指定されていない場合は、現在のウォレットアドレスの残高を返します。",
	inputSchema: z.object({
		address: z
			.string()
			.optional()
			.describe(
				"残高を照会するEthereumアドレス（省略時は現在のウォレットアドレス）",
			),
	}),
	execute: async ({ context }) => {
		try {
			const { address } = context;
			// 現在接続中のチェーン情報を取得
			const currentChain = getCurrentChain();
			const chainName = getChainName(currentChain);

			// アドレスが指定されていない場合は、現在のアカウントアドレスを使用
			const targetAddress = address || getCurrentAddress();
			const balanceString = await jpyc.balanceOf({
				account: targetAddress as `0x${string}`,
			});

			console.log(
				`jpyc_balance: address=${targetAddress}, balance=${balanceString} JPYC`,
			);

			return {
				success: true,
				address: targetAddress,
				balance: `${balanceString} JPYC`,
				balanceRaw: balanceString,
				chain: currentChain,
				chainName: chainName,
			};
		} catch (error: unknown) {
			return {
				success: false,
				error: error instanceof Error ? error.message : String(error),
			};
		}
	},
});

/**
 * JPYC送金ツール
 * JPYCトークンを指定したアドレスに送金します（現在選択されているテストネット）
 */
export const jpycTransferTool = createTool({
	id: "jpyc_transfer",
	description:
		"JPYCトークンを指定したアドレスに送金します（現在選択されているテストネット）。例: 10 JPYCを0x123...に送る",
	inputSchema: z.object({
		to: z.string().describe("送信先のEthereumアドレス (0xから始まる42文字)"),
		amount: z.number().describe("送金額（JPYC単位、例: 10）"),
	}),
	execute: async ({ context }) => {
		try {
			const { to, amount } = context;
			// 現在接続中のチェーン情報を取得
			const currentChain = getCurrentChain();
			const chainName = getChainName(currentChain);

			// SDKのtransferメソッドを呼び出してJPYCを送金する
			const txHash = await jpyc.transfer({
				to: to as `0x${string}`,
				value: amount,
			});

			const explorerUrl = EXPLORER_URLS[currentChain];

			return {
				success: true,
				message: `✅ ${amount} JPYCを ${to} に送金しました（${chainName}）`,
				transactionHash: txHash,
				explorerUrl: `${explorerUrl}${txHash}`,
				chain: currentChain,
				chainName: chainName,
			};
		} catch (error: unknown) {
			return {
				success: false,
				error: error instanceof Error ? error.message : String(error),
			};
		}
	},
});

/**
 * チェーン切り替えツール
 * JPYCを操作するテストネットを切り替えます
 */
export const jpycSwitchChainTool = createTool({
	id: "jpyc_switch_chain",
	description:
		"JPYCを操作するテストネットを切り替えます。対応チェーン: sepolia (Ethereum), amoy (Polygon), fuji (Avalanche)。ユーザーが「Sepoliaで」「Amoyに切り替えて」「Avalancheで実行」などと言った場合に使用します。",
	inputSchema: z.object({
		chain: z
			.enum(["sepolia", "amoy", "fuji"])
			.describe(
				"切り替え先のチェーン: sepolia (Ethereum Sepolia), amoy (Polygon Amoy), fuji (Avalanche Fuji)",
			),
	}),
	execute: async ({ context }) => {
		try {
			const { chain } = context;
			// 接続前のチェーンを取得
			const previousChain = getCurrentChain();
			// チェーンを切り替え
			await switchChain(chain as SupportedChain);

			const newChainName = getChainName(chain as SupportedChain);
			const previousChainName = getChainName(previousChain);

			return {
				success: true,
				message: `✅ チェーンを ${previousChainName} から ${newChainName} に切り替えました`,
				previousChain: previousChain,
				newChain: chain,
				chainName: newChainName,
			};
		} catch (error: unknown) {
			return {
				success: false,
				error: error instanceof Error ? error.message : String(error),
			};
		}
	},
});

/**
 * 現在のチェーン取得ツール
 * 現在選択されているテストネットを取得します
 */
export const jpycGetCurrentChainTool = createTool({
	id: "jpyc_get_current_chain",
	description:
		"現在選択されているテストネットを取得します。ユーザーが「今どのチェーン？」「現在のネットワークは？」などと聞いた場合に使用します。",
	inputSchema: z.object({}),
	execute: async () => {
		try {
			// 現在接続中のチェーン情報を取得
			const currentChain = getCurrentChain();
			const chainName = getChainName(currentChain);

			return {
				success: true,
				chain: currentChain,
				chainName: chainName,
				address: getCurrentAddress(),
			};
		} catch (error: unknown) {
			return {
				success: false,
				error: error instanceof Error ? error.message : String(error),
			};
		}
	},
});

/**
 * 総供給量照会ツール
 * 現在選択されているテストネットでのJPYCの総供給量を照会します
 */
export const jpycTotalSupplyTool = createTool({
	id: "jpyc_total_supply",
	description:
		"現在選択されているテストネットでのJPYCの総供給量を照会します。ユーザーが「総供給量は？」「流通量を教えて」などと聞いた場合に使用します。",
	inputSchema: z.object({}),
	execute: async () => {
		try {
			// 現在接続中のチェーン情報を取得
			const currentChain = getCurrentChain();
			const chainName = getChainName(currentChain);
			// SDKのtotalSupplyメソッドを呼び出して総供給量を取得する
			const totalSupply = await jpyc.totalSupply();

			return {
				success: true,
				totalSupply: `${totalSupply} JPYC`,
				totalSupplyRaw: totalSupply,
				chain: currentChain,
				chainName: chainName,
			};
		} catch (error: unknown) {
			return {
				success: false,
				error: error instanceof Error ? error.message : String(error),
			};
		}
	},
});

/**
 * すべてのJPYCツールをエクスポートする
 */
export const jpycTools = {
	jpyc_balance: jpycBalanceTool,
	jpyc_transfer: jpycTransferTool,
	jpyc_switch_chain: jpycSwitchChainTool,
	jpyc_get_current_chain: jpycGetCurrentChainTool,
	jpyc_total_supply: jpycTotalSupplyTool,
};
```

### 💡 コードの解説

このファイルでは、5つのMCPツールを定義しています。各ツールの構造と役割を見ていきましょう。

#### 1. MCPツールの基本構造

MCPツールは、Mastraの`createTool()`を使用して作成します。各ツールは以下の要素で構成されます：

```typescript
createTool({
	id: "jpyc_balance",           // ツールの一意な識別子
	description: "...",            // AI Agentがツールの用途を理解するための説明
	inputSchema: z.object({...}),  // パラメータの型定義（Zodスキーマ）
	execute: async ({ context }) => {...}  // 実際の処理を行う関数
})
```

#### 2. Zodスキーマによるパラメータ検証

```typescript
inputSchema: z.object({
	to: z.string().describe("送信先のEthereumアドレス (0xから始まる42文字)"),
	amount: z.number().describe("送金額（JPYC単位、例: 10）"),
}),
```

Zodは、TypeScriptの型検証ライブラリです。`inputSchema`で定義したスキーマにより、ツールが受け取るパラメータの型が保証されます。

`describe()`メソッドは、AI Agentがパラメータの意味を理解するための説明を追加します。これにより、AIは自然言語の指示から適切なパラメータを抽出できます。

#### 3. descriptionの重要性

```typescript
description:
	"JPYCトークンを指定したアドレスに送金します（現在選択されているテストネット）。例: 10 JPYCを0x123...に送る",
```

`description`は、AI Agentがこのツールをいつ使うべきかを判断するための重要な情報です。

例えば、ユーザーが「太郎に100JPYC送って」と言った場合、AIは：
1. この`description`を読んで「送金する」ツールであることを理解
2. `inputSchema`を参照して、`to`（送信先）と`amount`（金額）が必要だと認識
3. 適切なパラメータを抽出して`execute`を呼び出す

という流れで動作します。

#### 4. 5つのツールの役割

**jpyc_balance（残高照会）**
```typescript
const targetAddress = address || getCurrentAddress();
const balanceString = await jpyc.balanceOf({
	account: targetAddress as `0x${string}`,
});
```

アドレスが指定されていない場合は、自分のアドレスの残高を返します。前のレッスンで作成したWrapperの`jpyc.balanceOf()`を呼び出します。

**jpyc_transfer（送金）**
```typescript
const txHash = await jpyc.transfer({
	to: to as `0x${string}`,
	value: amount,
});
```

JPYCを送金し、トランザクションハッシュを返します。ブロックチェーンエクスプローラーのURLも生成して返すことで、ユーザーがトランザクションを確認できるようにします。

**jpyc_switch_chain（チェーン切り替え）**
```typescript
await switchChain(chain as SupportedChain);
```

ユーザーが「Avalancheで実行して」と言った場合などに、チェーンを切り替えます。

**jpyc_get_current_chain（現在のチェーン取得）**
```typescript
const currentChain = getCurrentChain();
const chainName = getChainName(currentChain);
```

「今どのチェーン？」という質問に答えるためのツールです。

**jpyc_total_supply（総供給量照会）**
```typescript
const totalSupply = await jpyc.totalSupply();
```

JPYCの総供給量を取得します。

#### 5. エラーハンドリング

```typescript
try {
	// 処理
	return {
		success: true,
		// ...結果
	};
} catch (error: unknown) {
	return {
		success: false,
		error: error instanceof Error ? error.message : String(error),
	};
}
```

すべてのツールは、エラーが発生した場合に`success: false`を返します。これにより、AI Agentはエラーを適切にユーザーに伝えることができます。

#### 6. エクスポート

```typescript
export const jpycTools = {
	jpyc_balance: jpycBalanceTool,
	jpyc_transfer: jpycTransferTool,
	jpyc_switch_chain: jpycSwitchChainTool,
	jpyc_get_current_chain: jpycGetCurrentChainTool,
	jpyc_total_supply: jpycTotalSupplyTool,
};
```

最後に、すべてのツールを1つのオブジェクトとしてエクスポートします。これにより、次のレッスンでMCPサーバーに簡単に登録できます。

### 🧪 動作確認

この段階では、まだMCPサーバーが起動していないため、動作確認はできません。

次のレッスンでMCPサーバーを実装・起動することで、これらのツールが動作することを確認できます。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#jpyc`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット

---

次のレッスンでは、これらのツールを公開するMCPサーバーを実装します！

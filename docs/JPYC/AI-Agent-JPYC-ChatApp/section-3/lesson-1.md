---
title: JPYC SDK Wrapperの実装
---

### 🔧 JPYC SDK Wrapper の実装

このレッスンでは、JPYC SDKをMCPサーバーから利用しやすくするためのWrapperを実装します。

このWrapperは、JPYC SDK v2.0.0を使用してマルチチェーン対応（Ethereum Sepolia、Polygon Amoy、Avalanche Fuji）のJPYC操作を提供します。

### 📝 実装するファイル

`external/mcp/src/jpyc/sdk.ts`ファイルを作成し、以下のコードを記述します。

まず、ファイルを作成します：

```bash
cd jpyc-ai-agent

touch external/mcp/src/jpyc/sdk.ts
```

以下のコードを記述します：

```typescript
import { JPYC, type IJPYC, SdkClient, type ISdkClient } from "@jpyc/sdk-core";
import type { Hex } from "viem";
import type { PrivateKeyAccount } from "viem/accounts";

// サポートするチェーン
export type SupportedChain = "sepolia" | "amoy" | "fuji";

// JPYC SDKで使用するチェーンIDのマッピング
const CHAIN_ID_MAP: Record<SupportedChain, number> = {
	sepolia: 11155111, // Ethereum Sepolia
	amoy: 80002, // Polygon Amoy
	fuji: 43113, // Avalanche Fuji
};

const CHAIN_NAMES: Record<SupportedChain, string> = {
	sepolia: "Ethereum Sepolia",
	amoy: "Polygon Amoy",
	fuji: "Avalanche Fuji",
};

// チェーンごとのRPC URL
const RPC_URLS: Record<SupportedChain, string> = {
	sepolia: "https://ethereum-sepolia-rpc.publicnode.com",
	amoy: "https://rpc-amoy.polygon.technology",
	fuji: "https://api.avax-test.network/ext/bc/C/rpc",
};

// 現在選択されているチェーン（デフォルトはSepolia）
let _currentChain: SupportedChain = "sepolia";
let _jpycInstance: IJPYC | null = null;
let _account: PrivateKeyAccount | null = null;

/**
 * JPYC SDKインスタンスを生成するメソッド
 * @param chain
 */
function createJpycInstance(chain: SupportedChain) {
	// 環境変数の検証
	if (!process.env.PRIVATE_KEY) {
		throw new Error("PRIVATE_KEY environment variable is required");
	}

	const chainId = CHAIN_ID_MAP[chain];

	// SdkClientの初期化
	const sdkClient: ISdkClient = new SdkClient({
		chainId,
		rpcUrl: RPC_URLS[chain],
	});

	// アカウントの作成
	_account = sdkClient.configurePrivateKeyAccount({
		privateKey: process.env.PRIVATE_KEY as Hex,
	});

	// Clientの生成
	const client = sdkClient.configureClient({
		account: _account,
	});

	// JPYC SDKインスタンスの作成
	_jpycInstance = new JPYC({
		env: "prod",
		contractType: "jpycPrepaid",
		localContractAddress: undefined,
		client,
	});
}

/**
 * JPYC SDKインスタンスを取得するメソッド
 * @returns
 */
function getJpycInstance(): IJPYC {
	if (!_jpycInstance) {
		createJpycInstance(_currentChain);
	}
	return _jpycInstance!;
}

/**
 * チェーンを切り替える関数
 * @param chain
 */
export function switchChain(chain: SupportedChain): void {
	if (!CHAIN_ID_MAP[chain]) {
		throw new Error(
			`Unsupported chain: ${chain}. Supported chains: sepolia, amoy, fuji`,
		);
	}
	_currentChain = chain;
	// JPYC SDKインスタンスを再作成
	createJpycInstance(chain);
}

/**
 * 現在のチェーンを取得する関数
 * @returns
 */
export function getCurrentChain(): SupportedChain {
	return _currentChain;
}

/**
 * チェーンの表示名を取得する関数
 * @param chain
 * @returns
 */
export function getChainName(chain?: SupportedChain): string {
	const targetChain = chain || _currentChain;
	return CHAIN_NAMES[targetChain] || "Ethereum Sepolia";
}

/**
 * 現在のアカウントアドレスを取得する関数
 * @returns
 */
export function getCurrentAddress(): Hex {
	if (!_account) {
		// アカウントが未初期化の場合、JPYC SDKインスタンスを初期化
		getJpycInstance();
	}
	return _account!.address;
}

/**
 * JPYC操作インターフェース（JPYC SDKを使用）
 */
export const jpyc = {
	/**
	 * 総供給量を取得するメソッド
	 * @returns
	 */
	async totalSupply(): Promise<string> {
		try {
			const jpycInstance = getJpycInstance();
			// JPYC SDKのtotalSupply関数を呼び出す
			const result = await jpycInstance.totalSupply();
			// numberをstringに変換して返す
			return result.toString();
		} catch (error: any) {
			console.error("[jpyc.totalSupply] Error:", error);

			// コントラクトが存在しない場合のエラーハンドリング
			if (
				error.message?.includes("returned no data") ||
				error.message?.includes("0x")
			) {
				const chainName = getChainName(_currentChain);
				throw new Error(
					`JPYCコントラクトが${chainName}にデプロイされていないか、アドレスが正しくありません。` +
						`Ethereum Sepoliaでお試しください。`,
				);
			}

			throw new Error(`Failed to get total supply: ${error.message}`);
		}
	},

	/**
	 * JPYCの残高を取得するメソッド
	 * @param params
	 * @returns
	 */
	async balanceOf(params: { account: Hex }): Promise<string> {
		try {
			const jpycInstance = getJpycInstance();
			// JPYC SDKのbalanceOf関数を呼び出す
			const result = await jpycInstance.balanceOf({ account: params.account });
			// numberをstringに変換して返す
			return result.toString();
		} catch (error: any) {
			console.error("[jpyc.balanceOf] Error:", error);

			// コントラクトが存在しない場合のエラーハンドリング
			if (
				error.message?.includes("returned no data") ||
				error.message?.includes("0x")
			) {
				const chainName = getChainName(_currentChain);
				throw new Error(
					`JPYCコントラクトが${chainName}にデプロイされていないか、アドレスが正しくありません。` +
						`現在のチェーンを確認してください。`,
				);
			}

			throw new Error(`Failed to get balance: ${error.message}`);
		}
	},

	/**
	 * JPYCを送信するメソッド
	 * @param params
	 * @returns
	 */
	async transfer(params: { to: Hex; value: number }): Promise<string> {
		try {
			const jpycInstance = getJpycInstance();
			// JPYC SDKのtransfer関数を呼び出す
			// SDKはnumberを受け取り、内部で適切に変換する
			const hash = await jpycInstance.transfer({
				to: params.to,
				value: params.value,
			});

			return hash;
		} catch (error: any) {
			console.error("[jpyc.transfer] Error:", error);
			throw new Error(`Failed to transfer: ${error.message}`);
		}
	},
};
```

### 💡 コードの解説

このファイルは、JPYC SDK v2.0.0を使いやすくするためのラッパーです。主要なポイントを見ていきましょう。

#### 1. マルチチェーン対応

```typescript
const CHAIN_ID_MAP: Record<SupportedChain, number> = {
	sepolia: 11155111, // Ethereum Sepolia
	amoy: 80002, // Polygon Amoy
	fuji: 43113, // Avalanche Fuji
};
```

3つのテストネット（Ethereum Sepolia、Polygon Amoy、Avalanche Fuji）に対応しています。各チェーンのIDとRPC URLをマッピングすることで、簡単にチェーンを切り替えられます。

#### 2. モジュールレベルでの状態管理

```typescript
let _currentChain: SupportedChain = "sepolia";
let _jpycInstance: IJPYC | null = null;
let _account: PrivateKeyAccount | null = null;
```

現在のチェーン、JPYCインスタンス、アカウント情報をモジュールレベルの変数で管理しています。これにより、同じMCPサーバープロセス内で状態を保持できます。

#### 3. JPYC SDK v2.0.0のAPI使用

```typescript
// SdkClientの初期化
const sdkClient: ISdkClient = new SdkClient({
	chainId,
	rpcUrl: RPC_URLS[chain],
});

// アカウントの作成
_account = sdkClient.configurePrivateKeyAccount({
	privateKey: process.env.PRIVATE_KEY as Hex,
});

// Clientの生成
const client = sdkClient.configureClient({
	account: _account,
});

// JPYC SDKインスタンスの作成
_jpycInstance = new JPYC({
	env: "prod",
	contractType: "jpycPrepaid",
	localContractAddress: undefined,
	client,
});
```

JPYC SDK v2.0.0では、`SdkClient`を使ってチェーン接続を初期化します。その後、`configurePrivateKeyAccount()`でアカウントを作成し、`configureClient()`でクライアントを生成します。

このクライアントを使って`JPYC`インスタンスを作成することで、JPYCトークンの操作が可能になります。

#### 4. チェーン切り替え機能

```typescript
export function switchChain(chain: SupportedChain): void {
	if (!CHAIN_ID_MAP[chain]) {
		throw new Error(
			`Unsupported chain: ${chain}. Supported chains: sepolia, amoy, fuji`,
		);
	}
	_currentChain = chain;
	// JPYC SDKインスタンスを再作成
	createJpycInstance(chain);
}
```

`switchChain()`を呼び出すと、指定したチェーンに切り替わります。JPYC SDKインスタンスを再作成することで、新しいチェーンに接続できます。

#### 5. JPYC操作のインタフェース

```typescript
export const jpyc = {
	async totalSupply(): Promise<string> { ... },
	async balanceOf(params: { account: Hex }): Promise<string> { ... },
	async transfer(params: { to: Hex; value: number }): Promise<string> { ... },
};
```

今回のプロジェクトでは3つの主要な操作を提供します：

- **totalSupply()**: JPYCの総供給量を取得
- **balanceOf()**: 指定したアドレスの残高を取得
- **transfer()**: JPYCを送信

これらのメソッドは、内部でJPYC SDKを呼び出し、結果を適切な形式で返します。

### 🧪 動作確認

この段階では、まだMCPサーバーが完成していないため、動作確認はできません。

次のレッスンでMCPツールを実装し、その後MCPサーバーを起動することで、このWrapperが動作することを確認できます。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#jpyc`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット

---

次のレッスンでは、このWrapperを使用してMCPツールを実装します！

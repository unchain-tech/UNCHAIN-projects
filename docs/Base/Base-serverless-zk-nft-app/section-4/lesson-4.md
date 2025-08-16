---
title: "⛽️ Biconomyによるガスレスミントの実装"
---

このレッスンでは、**Biconomy** を使用してユーザーがガス代を支払うことなくNFTをミントできる機能を実装します！

Biconomyの **Smart Account** と **Paymaster** 機能により、ユーザーはガス代を一切気にすることなく、シームレスにブロックチェーン上でトランザクションを実行できるようになります。

## 🚀 Biconomyとは？

[Biconomy](https://www.biconomy.io/) は、web3アプリケーションのユーザー体験を劇的に改善するためのインフラストラクチャです。主な機能は以下の通りです。

- **Account Abstraction （AA）**:   
  従来のEOA（Externally Owned Account）の制約を超えて、プログラマブルなスマートコントラクトウォレットを提供します。

- **Gasless Transactions**:   
  **Paymaster** により、ユーザーの代わりにガス代を支払い、ユーザーは署名のみでトランザクションを実行できます。

- **Bundled Transactions**:   
  複数のトランザクションを1つにまとめて実行し、効率性とコストを最適化します。

## 🛠 Biconomyのセットアップ

### パッケージのインストール

まず、Biconomyの最新SDKをインストールします。

```bash
cd pkgs/frontend
pnpm install @biconomy/abstractjs
```

### 環境変数の設定

Biconomyを使用するために必要なAPIキーを設定します。

1. [Biconomy Dashboard](https://dashboard.biconomy.io/) にアクセスしてアカウントを作成
2. 新しいプロジェクトを作成し、Base Sepoliaネットワークを選択
3. **Bundler API Key** と **Paymaster API Key** を取得

取得したAPIキーを`.env.local`に追加します：

```bash
# pkgs/frontend/.env.local
NEXT_PUBLIC_BICONOMY_BUNDLER_API_KEY="YOUR_BUNDLER_API_KEY"
NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY="YOUR_PAYMASTER_API_KEY"
```

### コントラクトアドレスの設定

`lib/utils.ts`にスマートコントラクトのアドレスを定義します：

```typescript
// pkgs/frontend/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const NEXUS_IMPLEMENTATION = "0x000000004F43C49e93C970E84001853a70923B03";

export const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";

// ZKNFTコントラクトのアドレス（section-3でデプロイしたもの）
export const ZKNFT_CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS" as const;
```

**※ `YOUR_DEPLOYED_CONTRACT_ADDRESS`は、section-3 でデプロイした実際のコントラクトアドレスに置き換えてください。**

## 🎣 useBiconomyフックの実装

Biconomyの全ての機能を集約したカスタムフックを作成します。

`hooks/useBiconomy.ts`を作成し、以下のコードを記述します：

```typescript
// pkgs/frontend/hooks/useBiconomy.ts
import {
  type NexusClient,
  createBicoPaymasterClient,
  createSmartAccountClient,
  toNexusAccount,
} from "@biconomy/abstractjs";
import { useWallets } from "@privy-io/react-auth";
import { ZKNFT_ABI } from "lib/abi";
import { ZKNFT_CONTRACT_ADDRESS } from "lib/utils";
import { useCallback, useState } from "react";
import {
  type Abi,
  createWalletClient,
  custom,
  encodeFunctionData,
  http,
} from "viem";
import { baseSepolia } from "viem/chains";

// ゼロ知識証明のデータ構造を定義する型
interface ZKProof {
  a: [string, string];
  b: [[string, string], [string, string]];
  c: [string, string];
}

// Biconomyアカウントの状態を管理する型
interface BiconomyAccountState {
  nexusAccount: NexusClient | null;
  address: string | null;
  isLoading: boolean;
  error: string | null;
}

// initializeBiconomyAccount の戻り値の型
interface InitializeAccountResult {
  nexusClient: NexusClient;
  address: string;
}

/**
 * Biconomyのスマートアカウント機能を管理するカスタムフック
 *
 * @returns Biconomyアカウントの状態と操作メソッド
 */
export const useBiconomy = () => {
  const { wallets } = useWallets();

  // エンベデッドウォレットの取得（エラーハンドリング改善）
  const embeddedWallet = wallets?.[0];

  // Biconomyアカウントの状態を管理する
  const [accountState, setAccountState] = useState<BiconomyAccountState>({
    nexusAccount: null,
    address: null,
    isLoading: false,
    error: null,
  });

  /**
   * Biconomyスマートアカウントを初期化する
   *
   * @returns 初期化されたnexusClientとアドレス
   */
  const initializeBiconomyAccount =
    useCallback(async (): Promise<InitializeAccountResult> => {
      try {
        setAccountState((prev) => ({ ...prev, isLoading: true, error: null }));

        if (!embeddedWallet) {
          throw new Error("Embedded wallet is not available");
        }

        const provider = await embeddedWallet.getEthereumProvider();
        // Create a signer Object for the embedded wallet
        const walletClient = createWalletClient({
          account: embeddedWallet.address as `0x${string}`,
          chain: baseSepolia,
          transport: custom(provider),
        });

        // Create Smart Account Client
        const nexusClient = createSmartAccountClient({
          account: await toNexusAccount({
            signer: walletClient,
            chain: baseSepolia,
            transport: http(),
          }),
          transport: http(
            `https://bundler.biconomy.io/api/v3/${baseSepolia.id}/${process.env.NEXT_PUBLIC_BICONOMY_BUNDLER_API_KEY}`,
          ),
          paymaster: createBicoPaymasterClient({
            paymasterUrl: `https://paymaster.biconomy.io/api/v2/${baseSepolia.id}/${process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY}`,
          }),
        });
        // get the smart account address
        const address = await nexusClient.account.address;

        console.log("Nexus Account:", address);
        console.log("done initializing Biconomy account");

        setAccountState({
          nexusAccount: nexusClient,
          address: embeddedWallet.address,
          isLoading: false,
          error: null,
        });

        return { nexusClient, address };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        setAccountState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        throw error; // エラーを再スローして呼び出し元でキャッチできるようにする
      }
    }, [embeddedWallet]);

  /**
   * NFTをミントするためのメソッド
   *
   * @param nexusClient NexusClientのインスタンス
   * @param proof ゼロ知識証明のデータ(配列)
   * @param publicSignals パブリックシグナルのデータ(配列)
   * @returns トランザクションハッシュ値
   */
  const mintNFT = useCallback(
    async (
      nexusClient: NexusClient,
      proof: ZKProof,
      publicSignals: string[],
    ): Promise<string | null> => {
      try {
        console.log("Minting NFT with proof:", proof);

        // 実行したいトランザクションデータのfunction call dataを作成
        const functionCallData = encodeFunctionData({
          abi: ZKNFT_ABI as Abi,
          functionName: "safeMint",
          args: [
            embeddedWallet.address,
            proof.a,
            proof.b,
            proof.c,
            publicSignals,
          ],
        });

        console.log("Function call data:", functionCallData);

        // トランザクションを送信
        const hash = await nexusClient.sendTransaction({
          to: ZKNFT_CONTRACT_ADDRESS,
          data: functionCallData,
          chain: baseSepolia,
        });

        console.log("Submitted tx hash:", hash);

        // トランザクションの確認を待つ
        const receipt = await nexusClient.waitForTransactionReceipt({ hash });
        console.log("Transaction receipt: ", receipt);

        return hash;
      } catch (error) {
        console.error("Error minting NFT:", error);
        throw error; // エラーを再スローして呼び出し元でキャッチできるようにする
      }
    },
    [embeddedWallet?.address],
  );

  return {
    // アカウント状態
    smartAccount: accountState.nexusAccount,
    address: accountState.address,
    isLoading: accountState.isLoading,
    error: accountState.error,

    // メソッド
    initializeBiconomyAccount,
    mintNFT,
  };
};
```

### 🔍 コード解説

#### フックの構造

- **`useWallets`**:   
  Privyからエンベデッドウォレット情報を取得

- **状態管理**:   
  Reactの`useState`でBiconomyアカウントの状態を管理

- **型安全性**:   
  TypeScriptの型定義で厳密な型チェックを実装

#### `initializeBiconomyAccount`メソッド

1. **ウォレットクライアント作成**:   
  Privyの埋め込みウォレットからviemのウォレットクライアントを作成

2. **Nexus アカウント**:  
  Biconomyのスマートアカウントを初期化

3. **Paymaster 設定**:   
  ガス代を肩代わりするPaymasterを設定

#### `mintNFT`メソッド

1. **関数データエンコード**:   
  `safeMint`関数の呼び出しデータを生成

2. **トランザクション送信**:   
  Biconomy経由でガスレストランザクションを実行

3. **確認待ち**:   
  トランザクションの確認を待ち、レシートを取得

## 🎯 ダッシュボードでの統合

最後に、`app/dashboard/page.tsx`で`useBiconomy`フックを使用してNFTミント機能を完成させます。

```tsx
// pkgs/frontend/app/dashboard/page.tsx
"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useBiconomy } from "hooks/useBiconomy";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Header } from "../../components/layout/header";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { LoadingSpinner } from "../../components/ui/loading";
import { generateProof, hashPassword } from "./../../lib/zk-utils";

// 動的レンダリングを強制してプリレンダリングエラーを回避
export const dynamic = "force-dynamic";

/**
 * ダッシュボード（NFTミント画面）コンポーネント
 */
export default function DashboardPage() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();

  // 未認証の場合はログイン画面にリダイレクト
  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  // Privyが初期化中の場合はローディング表示
  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // 未認証の場合は何も表示しない（リダイレクト中）
  if (!authenticated) {
    return null;
  }

  // 認証済みの場合にのみダッシュボードコンテンツを表示
  return <AuthenticatedDashboard />;
}

/**
 * 認証済みユーザー向けのダッシュボードコンテンツ
 */
function AuthenticatedDashboard() {
  const { initializeBiconomyAccount, mintNFT } = useBiconomy();

  // NFTミント用のstate
  const [password, setPassword] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const [mintedTokens, setMintedTokens] = useState<
    Array<{
      tokenId: string;
      tokenURI: string;
      transactionHash: string;
    }>
  >([]);

  /**
   * NFTをミントするハンドラーメソッド
   * @returns
   */
  const handleMintNFT = async () => {
    if (!password.trim()) {
      toast.error("パスワードを入力してください");
      return;
    }

    setIsMinting(true);

    try {
      toast.loading("ZK Proofを生成中...", { id: "minting" });

      // パスワードからinputデータを生成
      const result = await hashPassword(password);
      const passwordNumber = result.data?.passwordNumber;
      // ZK Proofを生成
      // @ts-expect-error this is a workaround for the type error
      const proofResult = await generateProof(passwordNumber);

      if (!proofResult.success || !proofResult.data) {
        throw new Error(proofResult.error || "failed to generate proof");
      }

      toast.loading("NFTをミント中...", { id: "minting" });

      // Biconomyを初期化してSmart Walletを作成する
      const { nexusClient, address: smartWalletAddress } =
        await initializeBiconomyAccount();

      if (!smartWalletAddress) {
        throw new Error("Smart wallet initialization failed");
      }

      console.log("Smart wallet Address:", smartWalletAddress);

      // NFTをミントする
      const hash = await mintNFT(
        nexusClient,
        proofResult.data.proof,
        proofResult.data.publicSignals,
      );

      console.log("Minted NFT transaction hash:", hash);

      setPassword("");
      toast.success("NFTのミントが完了しました！", { id: "minting" });
    } catch (error) {
      console.error("Mint error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error("エラーが発生しました: " + errorMessage, { id: "minting" });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* メインのミントカード */}
          <Card className="glass-effect border-white/20 shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <div className="text-3xl font-bold text-white">🎨</div>
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Mint Your ZK NFT
              </CardTitle>
              <CardDescription className="text-gray-300">
                Enter a secret password to mint your zero-knowledge NFT
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* パスワード入力フィールド */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-medium">
                  Secret Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your secret password..."
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                  disabled={isMinting}
                />
                <div className="text-xs text-gray-400">
                  This password will be used to generate a zero-knowledge proof
                  without revealing it on the blockchain.
                </div>
              </div>

              {/* ミントボタン */}
              <Button
                onClick={handleMintNFT}
                disabled={isMinting || !password.trim()}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg neon-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
                {isMinting ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>Minting...</span>
                  </div>
                ) : (
                  "🎯 Mint NFT with ZK Proof"
                )}
              </Button>

              {/* セキュリティ情報 */}
              <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
                <div className="text-sm text-purple-200">
                  <div className="font-semibold mb-1">🔒 Zero-Knowledge Privacy</div>
                  <div className="text-xs">
                    Your password is never revealed on the blockchain. Only a
                    cryptographic proof that you know the password is stored.
                  </div>
                </div>
              </div>

              {/* ガスレス情報 */}
              <div className="bg-green-900/30 rounded-lg p-4 border border-green-500/30">
                <div className="text-sm text-green-200">
                  <div className="font-semibold mb-1">⛽️ Gas-Free Transaction</div>
                  <div className="text-xs">
                    This transaction is sponsored by Biconomy. You won&apos;t pay any
                    gas fees!
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ミント済みNFT一覧（実装時に追加予定） */}
          {mintedTokens.length > 0 && (
            <Card className="glass-effect border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">
                  Your Minted NFTs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {mintedTokens.map((token) => (
                    <div
                      key={token.tokenId}
                      className="p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="text-white font-medium">
                        Token #{token.tokenId}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        TX: {token.transactionHash.slice(0, 20)}...
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
```

### 🔍 コード解説

#### コンポーネント構成

- **`DashboardPage`**: ルート認証チェックとリダイレクト処理
- **`AuthenticatedDashboard`**: 実際のNFTミント機能を提供

#### `handleMintNFT`メソッドの流れ

1. **入力検証**: パスワードが入力されているかチェック
2. **ZK証明生成**: `hashPassword`と`generateProof`でゼロ知識証明を生成
3. **Biconomy初期化**: `initializeBiconomyAccount`でスマートアカウントを準備
4. **NFTミント**: `mintNFT`でガスレストランザクションを実行
5. **結果通知**: toastでユーザーに結果を通知

#### Biconomy統合のポイント

- **エラーハンドリング**: 各段階で適切なエラーキャッチとユーザー通知
- **ローディング状態**: ユーザーに処理状況を分かりやすく表示
- **型安全性**: TypeScriptでランタイムエラーを防止

---

お疲れ様でした！ 

これで、ゼロ知識証明を活用したガスレスNFTアプリケーションが完成しました！

アプリケーションを起動して、実際にパスワードを入力してNFTをミントしてみてください：

```bash
pnpm frontend run dev
```

ユーザーはガス代を一切支払うことなく、秘密のパスワードを知っていることを証明してNFTをミントできるはずです。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#zk`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット

### 🌍 プロジェクトをアップグレードする

[UNCHAIN](https://unchain.tech/) のプロジェクトは [UNCHAIN License](https://github.com/unchain-tech/UNCHAIN-projects/blob/main/LICENSE) により運用されています。

プロジェクトに参加していて、「こうすればもっと分かりやすいのに!」「これは間違っている!」と思ったら、ぜひ`pull request`を送ってください。

GitHubから直接コードを編集して修正を送ることもできます。

どんなリクエストでも大歓迎です 🎉

また、プロジェクトを自分のSNSでシェアしてください😆

あなたのプロジェクトがあることで、他の人がZK開発を始めるきっかけになる可能性があります。

web3へのハードルを一緒に下げていきましょう 🚀

### 🎉 おつかれさまでした！

あなたのゼロ知識NFTアプリケーションが完成しました！

あなたは、フロントエンドからZK証明を生成し、ガスレスでスマートコントラクトを実行する技術を習得しました。

これらは、**プライバシーとスケーラビリティ**という、現在のweb3が直面している最重要課題を解決する最先端技術です。

この知識を活用して、より良いユーザー体験を提供するdAppをぜひ構築してください！
---
title: "Biconomyによるガスレスミントの実装"
---

いよいよフロントエンド開発の最終段階です。このレッスンでは、**[Biconomy](https://www.biconomy.io/)** を使って、ユーザーがガス代を気にすることなくNFTをミントできる「ガスレスミント」機能を実装します。

Biconomyは、アカウントアブストラクション（AA）を簡単に実装するためのSDKを提供しています。AAを利用することで、ユーザーのウォレット（EOA）を「スマートアカウント（Smart Account）」と呼ばれるスマートコントラクトでラップし、トランザクションのガス代を肩代わりする（スポンサーする）などの高度な機能を実現できます。

## ⛽️ Biconomy Paymasterの設定

Biconomyでガス代をスポンサーするには、「Paymaster」という機能を利用します。

1.  **Biconomyにサインアップ**: [Biconomyの公式サイト](https://www.biconomy.io/)にアクセスし、アカウントを作成します。
2.  **Paymasterの作成**: ダッシュボードにログインし、新しいPaymasterを作成します。
    *   **Chain**: `Base Sepolia`を選択します。
    *   **Mode**: `Verifying Paymaster`を選択します。
3.  **Paymasterにデポジット**: 作成したPaymasterには、肩代わりするガス代の元手となるETHが必要です。Biconomyのダッシュボードからデポジット用のアドレスを取得し、Base SepoliaのテストネットETHを少量送金してください。
4.  **Paymaster URLの取得**: Paymasterのページで、`Paymaster URL`をコピーします。
5.  **環境変数の設定**: `pkgs/frontend/.env.local`ファイルに、取得したPaymaster URLを設定します。

    ```env
    # pkgs/frontend/.env.local

    NEXT_PUBLIC_PRIVY_APP_ID=YOUR_PRIVY_APP_ID
    NEXT_PUBLIC_BICONOMY_PAYMASTER_URL=YOUR_BICONOMY_PAYMASTER_URL
    ```

## 🔗 BiconomyとPrivyの連携

PrivyはBiconomyとの連携をネイティブでサポートしており、設定は非常に簡単です。`PrivyProvider`にBiconomyの設定を追加するだけで、Privyが管理するウォレットが自動的にBiconomyのスマートアカウントに対応します。

`pkgs/frontend/src/app/providers.tsx`を以下のように修正してください。

```tsx
// pkgs/frontend/src/app/providers.tsx
"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { baseSepolia } from "viem/chains"; // 👈 baseSepoliaをインポート

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ["email", "wallet"],
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
        // Biconomyの設定を追加
        smartAccount: {
          sponsorship: {
            paymasterUrl: process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_URL,
          },
        },
        // デフォルトのチェーンを設定
        defaultChain: baseSepolia,
        // サポートするチェーンを設定
        supportedChains: [baseSepolia],
      }}
    >
      {children}
    </PrivyProvider>
  );
}
```

### コード解説
- `smartAccount`: このオブジェクトでBiconomyの設定を行います。
- `sponsorship.paymasterUrl`: 環境変数から先ほど設定したPaymasterのURLを渡します。
- `defaultChain` & `supportedChains`: アプリケーションが`Base Sepolia`チェーンで動作することをPrivyとBiconomyに伝えます。

これだけで、`usePrivy`フックから取得できるウォレットが、ガスレス取引に対応したスマートアカウントになります。

## 🚀 ガスレスミントの実行

最後に、`page.tsx`の`handleMint`関数を更新し、生成したZK証明を使って、Biconomy経由で`safeMint`トランザクションを実行します。

`pkgs/frontend/src/app/page.tsx`を以下のように更新してください。

```tsx
// pkgs/frontend/src/app/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePrivy, useSmartAccount } from "@privy-io/react-auth"; // 👈 useSmartAccountをインポート
import { useState } from "react";
import { generateProof } from "@/lib/zk";
import Head from "next/head";
import { encodeFunctionData } from "viem"; // 👈 encodeFunctionDataをインポート
import { ZKNFT_ABI } from "@/lib/abi"; // 👈 ABIをインポート

export default function Home() {
  const [password, setPassword] = useState<string>("");
  const [isProving, setIsProving] = useState<boolean>(false);
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { sendTransaction } = useSmartAccount(); // 👈 sendTransactionを取得

  const zknftContractAddress =
    process.env.NEXT_PUBLIC_ZKNFT_CONTRACT_ADDRESS! as `0x${string}`;

  const handleMint = async () => {
    if (!password) {
      alert("Please enter a password.");
      return;
    }
    setIsProving(true);
    try {
      const calldata = await generateProof(password);
      if (calldata) {
        console.log("Proof generated successfully!");
        
        // スマートコントラクトのsafeMint関数を呼び出すためのデータをエンコード
        const txData = encodeFunctionData({
          abi: ZKNFT_ABI,
          functionName: "safeMint",
          args: [
            user!.wallet!.address, // ユーザーのウォレットアドレス
            calldata.pA,
            calldata.pB,
            calldata.pC,
            calldata.pubSignals,
          ],
        });

        // Biconomy経由でトランザクションを送信
        const tx = await sendTransaction({
          to: zknftContractAddress,
          data: txData,
        });

        console.log("Transaction sent:", tx);
        alert("Mint transaction sent! Check your wallet.");
      } else {
        alert("Failed to generate proof.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during the minting process.");
    } finally {
      setIsProving(false);
    }
  };

  // ... 既存のUIコード ...
}
```

また、コントラクトのABIを定義する`pkgs/frontend/src/lib/abi.ts`を作成します。

```typescript
// pkgs/frontend/src/lib/abi.ts
export const ZKNFT_ABI = [
  // ZKNFT.solのコンストラクタと関数に対応するABIをここに記述
  // ... (Hardhatのコンパイル成果物からコピー)
] as const;
```
> ABIは非常に長くなるため、ここでは省略します。`pkgs/backend/artifacts/contracts/ZKNFT.sol/ZKNFT.json`にある`abi`キーの内容をコピーして貼り付けてください。

### コード解説
- `useSmartAccount()`: この新しいフックから、スマートアカウントを操作するための`sendTransaction`関数を取得します。
- `encodeFunctionData`: `viem`ライブラリの関数で、スマートコントラクトの関数呼び出し（この場合は`safeMint`）を、トランザクションの`data`フィールドに含めることができる16進数の文字列に変換します。
- `sendTransaction`: これがガスレスミントの実行部分です。
    - `to`: 呼び出したいスマートコントラクトのアドレス（`ZKNFT.sol`）
    - `data`: どの関数をどの引数で呼び出すかを示したデータ
- `sendTransaction`を呼び出すと、BiconomyのSDKが裏側で以下の処理を自動的に行います。
    1. トランザクションを作成する。
    2. Paymasterにリクエストを送り、ガス代をスポンサーしてもらうための署名を取得する。
    3. スポンサー署名付きのトランザクションをブロックチェーンに送信する。

これで、アプリケーションのすべての機能が完成しました。アプリケーションを起動し、ログイン後にパスワードを入力して「Mint」ボタンをクリックすると、ガス代を要求されることなくNFTがミントされるはずです。

---

お疲れ様でした！ これで、Serverless ZK NFT Appのフロントエンド開発は完了です。次のセクションでは、プロジェクト全体のまとめと、考えられるアップグレード案について解説します。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#zk`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット

このレッスンでは、Biconomy Paymasterを利用して、ユーザーがガス代（手数料）を支払うことなくNFTをミントできる「ガスレス」な体験を実現します。PrivyのEmbedded WalletとBiconomyを連携させ、アプリケーションのUXを飛躍的に向上させます。

## ⛽️ Biconomy Paymasterとは？

Biconomy Paymasterは、アカウントアブストラクション（ERC-4337）を利用したサービスで、アプリケーション開発者がユーザーのガス代を肩代わりすることを可能にします。

## 🚀 実装手順

以下の手順で実装を進めます。

1.  **Biconomy Paymasterの設定**: BiconomyのダッシュボードでPaymasterを作成し、必要な設定を行います。
2.  **Privyとの連携**: PrivyProviderにBiconomyの設定を追加し、ウォレットがスマートアカウントに対応できるようにします。
3.  **ガスレスミント機能の実装**: `useSmartAccount`フックを使って、ガスレスでNFTをミントする機能を実装します。
4.  **UIの更新**: ユーザーが使いやすいように、UIを更新します。

## 1. Biconomy Paymasterの設定

まず、BiconomyのダッシュボードでPaymasterを設定します。

1.  **Biconomyにサインアップ**: [Biconomyの公式サイト](https://www.biconomy.io/)にアクセスし、アカウントを作成します。
2.  **Paymasterの作成**: ダッシュボードにログインし、新しいPaymasterを作成します。
    *   **Chain**: `Base Sepolia`を選択します。
    *   **Mode**: `Verifying Paymaster`を選択します。
3.  **Paymasterにデポジット**: 作成したPaymasterには、肩代わりするガス代の元手となるETHが必要です。Biconomyのダッシュボードからデポジット用のアドレスを取得し、Base SepoliaのテストネットETHを少量送金してください。
4.  **Paymaster URLの取得**: Paymasterのページで、`Paymaster URL`をコピーします。
5.  **環境変数の設定**: `pkgs/frontend/.env.local`ファイルに、取得したPaymaster URLを設定します。

    ```env
    # pkgs/frontend/.env.local

    NEXT_PUBLIC_PRIVY_APP_ID=YOUR_PRIVY_APP_ID
    NEXT_PUBLIC_BICONOMY_PAYMASTER_URL=YOUR_BICONOMY_PAYMASTER_URL
    ```

## 2. Privyとの連携

PrivyはBiconomyとの連携をネイティブでサポートしており、設定は非常に簡単です。`PrivyProvider`にBiconomyの設定を追加するだけで、Privyが管理するウォレットが自動的にBiconomyのスマートアカウントに対応します。

`pkgs/frontend/src/app/providers.tsx`を以下のように修正してください。

```tsx
// pkgs/frontend/src/app/providers.tsx
"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { baseSepolia } from "viem/chains"; // 👈 baseSepoliaをインポート

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ["email", "wallet"],
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
        // Biconomyの設定を追加
        smartAccount: {
          sponsorship: {
            paymasterUrl: process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_URL,
          },
        },
        // デフォルトのチェーンを設定
        defaultChain: baseSepolia,
        // サポートするチェーンを設定
        supportedChains: [baseSepolia],
      }}
    >
      {children}
    </PrivyProvider>
  );
}
```

### コード解説
- `smartAccount`: このオブジェクトでBiconomyの設定を行います。
- `sponsorship.paymasterUrl`: 環境変数から先ほど設定したPaymasterのURLを渡します。
- `defaultChain` & `supportedChains`: アプリケーションが`Base Sepolia`チェーンで動作することをPrivyとBiconomyに伝えます。

これだけで、`usePrivy`フックから取得できるウォレットが、ガスレス取引に対応したスマートアカウントになります。

## 3. ガスレスミント機能の実装

次に、ガスレスでNFTをミントする機能を実装します。`useSmartAccount`フックを使って、Biconomy経由でトランザクションを送信します。

`pkgs/frontend/src/hooks/useZKNFT.ts`という新しいファイルを作成し、以下のコードを追加します。

```tsx
// pkgs/frontend/src/hooks/useZKNFT.ts
import { useState } from "react";
import { usePrivy, useSmartAccount } from "@privy-io/react-auth";
import { generateProof } from "@/lib/zk";
import { encodeFunctionData } from "viem";
import { ZKNFT_ABI } from "@/lib/abi";
import { toast } from "@/components/ui/use-toast";

export const useZKNFT = () => {
    const { user, authenticated } = usePrivy();
    const { sendTransaction } = useSmartAccount();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const mintNFT = async (password: string) => {
        if (!authenticated || !user?.wallet?.address) return;

        setIsLoading(true);
        try {
            const calldata = await generateProof(password);
            if (!calldata) throw new Error("Failed to generate proof.");

            // スマートコントラクトのsafeMint関数を呼び出すためのデータをエンコード
            const txData = encodeFunctionData({
                abi: ZKNFT_ABI,
                functionName: "safeMint",
                args: [
                    user.wallet.address, // ユーザーのウォレットアドレス
                    calldata.pA,
                    calldata.pB,
                    calldata.pC,
                    calldata.pubSignals,
                ],
            });

            // Biconomy経由でトランザクションを送信
            const userOpResponse = await sendTransaction({
                to: process.env.NEXT_PUBLIC_ZKNFT_CONTRACT_ADDRESS!,
                data: txData,
            });

            const { transactionHash } = await userOpResponse.waitForTxHash();
            toast({
                title: "✅ Minting Transaction Sent",
                description: `Tx Hash: ${transactionHash}. Waiting for confirmation...`,
            });

            const userOpReceipt = await userOpResponse.wait();
            if (userOpReceipt.success === "true") {
                toast({
                    title: "🎉 NFT Minted Successfully!",
                    description: `Your ZK NFT has been minted. Receipt: ${userOpReceipt.receipt.transactionHash}`,
                });
            } else {
                throw new Error("Transaction failed");
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "❌ Minting Failed",
                description: "Something went wrong. Please check the console.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        mintNFT,
    };
};
```

**※注意**:
- `YOUR_ZKNFT_CONTRACT_ADDRESS`と`YOUR_BICONOMY_PAYMASTER_API_KEY`は、ご自身の値に必ず置き換えてください。PaymasterのAPIキーはBiconomyダッシュボードで確認できます。
- `unsafe_get_private_key`はPrivyのEmbedded Walletから秘密鍵をエクスポートするメソッドです。本番環境での使用には注意が必要ですが、BiconomyのSignerを作成するためにこのプロジェクトでは利用します。

## 🔌 UIとの最終統合

`page.tsx`を更新し、新しくなった`useZKNFT`フックの`mintNFT`関数を呼び出すようにします。

```tsx
// pkgs/frontend/src/app/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useZKNFT } from "@/hooks/useZKNFT"; // 👈 更新されたフックをインポート
import { usePrivy } from "@privy-io/react-auth";
import { useState } from "react";

export default function Home() {
    // ... (他のフック)
    const { isLoading, mintNFT } = useZKNFT(); // 👈 mintNFTを取得

    const [password, setPassword] = useState<string>("");

    const handleMint = async () => {
        if (!password) {
            // ... (パスワード空のチェック)
            return;
        }
        await mintNFT(password); // 👈 mintNFTを呼び出す
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            {/* ... (ログイン/ログアウトボタン) */}

            <Card className="w-[400px]">
                {/* ... (CardHeader, CardContent) */}
                <CardFooter>
                    <Button
                        className="w-full"
                        onClick={handleMint}
                        disabled={isLoading || !password || !authenticated}
                    >
                        {isLoading ? "Minting..." : "Mint ZK NFT"}
                    </Button>
                </CardFooter>
            </Card>
        </main>
    );
}
```

これで、すべての実装が完了しました！

アプリケーションを起動し、ログイン後、正しいパスワードを入力して`Mint ZK NFT`ボタンをクリックしてください。Biconomy Paymasterがガス代を肩代わりし、ユーザーは手数料なしでNFTをミントできるはずです。成功・失敗のステータスはToastメッセージで表示されます。

次のセクションでは、プロジェクト全体を振り返り、今後の改善案について考察します。
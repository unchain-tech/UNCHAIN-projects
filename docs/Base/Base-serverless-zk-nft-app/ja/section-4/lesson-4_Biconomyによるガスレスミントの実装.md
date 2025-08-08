---
title: "⛽️ Biconomyによるガスレスミントの実装"
---

いよいよフロントエンド開発の最終段階、そしてこのプロジェクトで最もエキサイティングな部分です！ 

このレッスンでは、**[Biconomy](https://www.biconomy.io/)** を使って、ユーザーが**ガス代を一切支払うことなく**NFTをミントできる、魔法のような「**ガスレスミント**」機能を実装します。

Biconomyは、 **アカウント抽象化（Account Abstraction, AA）** を驚くほど簡単に実装するためのSDKを提供しています。

アカウント抽象化を利用することで、ユーザーのウォレット（EOA）を「**スマートアカウント（Smart Account）**」と呼ばれる高機能なスマートコントラクトでラップし、トランザクションのガス代を肩代わりする（**スポンサーする**）などの高度な機能を実現できます。

## Biconomy Paymasterの設定

Biconomyを使ってガス代をスポンサーするには、「**Paymaster**」という機能を利用します。

Paymasterは、文字通り「支払い代行者」として、ユーザーに代わってガス代を支払ってくれるスマートコントラクトです。

1.  **Biconomyにサインアップ**:   
   [Biconomyの公式サイト](https://www.biconomy.io/)にアクセスし、アカウントを作成します。

2.  **Paymasterの作成**:   
    ダッシュボードにログインし、新しいPaymasterを作成します。
    *   **Chain**:  
       `Base Sepolia`を選択します。
    *   **Mode**:   
      `Verifying Paymaster`を選択します。
3.  **Paymasterにデポジット**:   
  作成したPaymasterには、肩代わりするガス代の元手となるETHが必要です。
  
    Biconomyのダッシュボードからデポジット用のアドレスを取得し、Base SepoliaのテストネットETHを少量送金してください（フォーセットから取得したものでOKです）

4.  **APIキーの取得**:   
  ダッシュボードの「API Keys」セクションで、`Base Sepolia`チェーン用の**Bundler & Paymaster URL**を取得します。
5.  **環境変数の設定**:   
  `pkgs/frontend/.env.local`ファイルに、取得したAPIキーを設定します。

    ```env
    # pkgs/frontend/.env.local

    NEXT_PUBLIC_PRIVY_APP_ID=YOUR_PRIVY_APP_ID
    # BiconomyのBundlerとPaymasterのURLを結合したものを設定
    NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY=YOUR_BICONOMY_PAYMASTER_API_KEY
    ```

## 🔗 BiconomyとPrivyの連携

PrivyはBiconomyとの連携をネイティブでサポートしており、設定は驚くほど簡単です。

`PrivyProvider`にBiconomyの設定を追加するだけで、Privyが管理するウォレットが自動的にBiconomyのスマートアカウントに対応します。

`pkgs/frontend/src/app/providers.tsx`を以下のように修正してください。

```tsx
// pkgs/frontend/src/app/providers.tsx
"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { baseSepolia } from "viem/chains"; // 👈 baseSepoliaをインポート
import { BiconomySmartAccount } from "@biconomy/account"; // 👈 Biconomyをインポート

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
            // BiconomyのAPIキーを渡す
            bundlerUrl: `https://bundler.biconomy.io/api/v2/84532/${process.env.NEXT_PUBLIC_BICONOMY_BUNDLER_API_KEY}`,
            paymasterUrl: `https://paymaster.biconomy.io/api/v1/84532/${process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY}`,
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

### 🔍 コード解説

- `smartAccount`:   
  このオブジェクトでBiconomyの設定を行います。
- `sponsorship`:   
  ガス代のスポンサー機能を有効にするための設定です。
    - `bundlerUrl`:   
      トランザクションをバンドルしてブロックチェーンに送信するBiconomyのサービスURLです。
    - `paymasterUrl`:   
      ガス代の支払いを代行するPaymasterサービスのURLです。
- `defaultChain` & `supportedChains`:   
  アプリケーションが`Base Sepolia`チェーンで動作することをPrivyとBiconomyに明示的に伝えます。

これだけの簡単な設定で、`usePrivy`フックから取得できるウォレットが、**ガスレス取引に対応したスマートアカウント**として機能するようになります。

## 🚀 ガスレスミントの実行

最後に、`page.tsx`の`handleMint`関数を更新し、生成したZK証明を使って、Biconomy経由で`safeMint`トランザクションを実行します。

まず、コントラクトとやり取りするために、`ZKNFT.sol`のABI（Application Binary Interface）をフロントエンドに配置する必要があります。

1.  `pkgs/backend/artifacts/contracts/ZKNFT.sol/ZKNFT.json`ファイルから`abi`の配列部分をコピーします。
2.  `pkgs/frontend/src/lib/abi.ts`というファイルを作成し、コピーしたABIをエクスポートします。

```ts
// pkgs/frontend/src/lib/abi.ts
export const ZKNFT_ABI = [
  // ... ZKNFT.jsonからコピーしたABIの内容 ...
] as const;
```

次に、`page.tsx`を以下のように更新してください。

```tsx
// pkgs/frontend/src/app/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePrivy } from "@privy-io/react-auth";
import { useState } from "react";
import { useZKNFT } from "@/hooks/useZKNFT";
import { Loader2 } from "lucide-react";
import { encodeFunctionData } from "viem"; // 👈 encodeFunctionDataをインポート
import { ZKNFT_ABI } from "@/lib/abi"; // 👈 ABIをインポート
import { useBiconomy } from "@biconomy/use-biconomy"; // 👈 Biconomyフックをインポート

export default function Home() {
  const [password, setPassword] = useState<string>("");
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { isProofLoading, generateProof } = useZKNFT();
  const { smartAccount } = useBiconomy(); // 👈 Biconomyのスマートアカウント情報を取得

  // デプロイしたZKNFTコントラクトのアドレス
  const zknftContractAddress = "YOUR_ZKNFT_CONTRACT_ADDRESS";

  const handleMint = async () => {
    if (!password) {
      alert("Please enter a password.");
      return;
    }
    // 1. ZK証明を生成
    const calldata = await generateProof(password);
    if (!calldata || !smartAccount) {
      alert("Failed to generate proof or smart account not ready.");
      return;
    }

    try {
      // 2. トランザクションデータをエンコード
      const txData = encodeFunctionData({
        abi: ZKNFT_ABI,
        functionName: "safeMint",
        args: [
          user?.wallet?.address, // ミント先のアドレス
          calldata.pA,
          calldata.pB,
          calldata.pC,
          calldata.pubSignals,
        ],
      });

      // 3. Biconomyでガスレス取引を実行
      const tx = await smartAccount.sendTransaction({
        to: zknftContractAddress,
        data: txData,
      });

      console.log("Transaction sent:", tx.hash);
      alert(`Mint successful! Transaction hash: ${tx.hash}`);
    } catch (error) {
      console.error("Minting failed:", error);
      alert("Minting failed. See console for details.");
    }
  };

  // ... (return文) ...
}
```

### コード解説

- `useBiconomy()`:   
  Biconomyのカスタムフックから`smartAccount`オブジェクトを取得します。  
  これにはガスレス取引を実行するためのメソッドが含まれていま
  す。
- `YOUR_ZKNFT_CONTRACT_ADDRESS`:   
  `section-3`でデプロイした`ZKNFT`コントラクトのアドレスに置き換えてください。

- `encodeFunctionData`:   
  `viem`ライブラリの強力な関数です。コントラクトのABI、関数名、引数を渡すだけで、ブロックチェーンが理解できる**バイトコード形式のトランザクションデータ**を生成してくれます。

- `smartAccount.sendTransaction`:   
  **ここがガスレスミントの実行部分です。**
    - `to`:   
      トランザクションの送信先（`ZKNFT`コントラクトのアドレス）。
    - `data`:   
      実行したい操作（`safeMint`関数の呼び出し）をエンコードしたデータ。

    - この関数を呼び出すと、BiconomyのSDKがバックグラウンドでPaymasterと通信し、ガス代を肩代わりするトランザクションを組み立て、Bundler経由でブロックチェーンに送信してくれます。ユーザーは署名するだけで、ガス代の支払いは一切不要です。

---

🎉 **おめでとうございます！** 🎉

これで、ゼロ知識証明、アカウント抽象化（ガスレス取引）、そしてモダンなWeb開発技術を組み合わせた、最先端のサーバーレスdAppが完成しました。

アプリケーションを起動し、パスワードを入力して、ガス代ゼロでNFTがミントされる未来の体験をぜひ味わってみてください！

---

### 🙋‍♂️ 質問する
> ABIは非常に長くなるため、ここでは省略します。`pkgs/backend/artifacts/contracts/ZKNFT.sol/ZKNFT.json`にある`abi`キーの内容をコピーして貼り付けてください。

次のセクションではプログラム全体を振り返ります！
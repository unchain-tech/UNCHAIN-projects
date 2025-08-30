# 3.3 Suiフックの実装

zkLoginの認証フローの準備ができたので、次はSuiブロックチェーンと対話するためのカスタムフック`useSui`を実装します。

このフックは、トランザクションの実行、NFTのミント、残高やNFT情報の取得といった、オンチェーン操作のロジックを集約する場所となります。

このレッスンでは、まずフックの骨格を作成し、ユーザーのSuiアドレスと残高を取得する基本的な機能を実装します。

## ファイルの作成

`src/hooks`ディレクトリに`useSui.ts`というファイルを開いて以下の内容をコピー&ペーストしてください！

## コードの実装

作成した`useSui.ts`ファイルに、以下のコードを記述します。

```typescript
import { useSuiClientQuery } from "@mysten/dapp-kit";
import type { SerializedSignature } from "@mysten/sui.js/cryptography";
import type { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { MIST_PER_SUI } from "@mysten/sui.js/utils";
import { genAddressSeed, getZkLoginSignature } from "@mysten/zklogin";
import type { JwtPayload } from "jwt-decode";
import { enqueueSnackbar } from "notistack";
import { useCallback } from "react";
import { suiClient } from "../lib/suiClient";
import type { PartialZkLoginSignature } from "../types/globalContext";
import { NFT_PACKAGE_ID } from "../utils/constant";

export interface ExecuteTransactionParams {
  ephemeralKeyPair: Ed25519Keypair;
  zkProof: PartialZkLoginSignature;
  decodedJwt: JwtPayload;
  userSalt: string;
  zkLoginUserAddress: string;
  maxEpoch: number;
  setExecutingTxn: (loading: boolean) => void;
  setExecuteDigest: (digest: string) => void;
}

export interface MintNFTParams {
  ephemeralKeyPair: Ed25519Keypair;
  zkProof: PartialZkLoginSignature;
  decodedJwt: JwtPayload;
  userSalt: string;
  zkLoginUserAddress: string;
  maxEpoch: number;
  name: string;
  description: string;
  imageUrl: string;
  setExecutingTxn: (loading: boolean) => void;
  setExecuteDigest: (digest: string) => void;
}

/**
 * Sui ブロックチェーンに関するReact Hookをまとめたカスタムフック
 * @returns {Object} - Contains the executeTransaction function
 */
export function useSui() {
  
}

/**
 * ユーザーの残高を取得するメソッド
 * @param zkLoginUserAddress
 * @returns
 */
export function useGetBalance(zkLoginUserAddress: string) {
  const { data: addressBalance, ...rest } = useSuiClientQuery(
    "getBalance",
    { owner: zkLoginUserAddress },
    {
      enabled: Boolean(zkLoginUserAddress),
      refetchInterval: 1500,
    },
  );
  return { addressBalance, ...rest };
}
/**
 * ユーザーが所有するNFTを取得するメソッド
 */
export function useGetOwnedNFTs(zkLoginUserAddress: string) {
  const { data: ownedObjects, ...rest } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: zkLoginUserAddress,
      filter: {
        StructType: `${NFT_PACKAGE_ID}::testnet_nft::TestnetNFT`,
      },
      options: {
        showContent: true,
        showDisplay: true,
        showType: true,
      },
    },
    {
      enabled: Boolean(zkLoginUserAddress),
      refetchInterval: 3000,
    },
  );

  return { ownedNFTs: ownedObjects?.data || [], ...rest };
}
```

### コードの解説

このファイルでは、Suiブロックチェーンとのやり取りをカプセル化する3つのカスタムフックが定義されています。

#### 1.`useGetBalance`フック

このフックは、指定されたSuiアドレスの残高をリアクティブに取得・監視します。

- `@mysten/dapp-kit`が提供する`useSuiClientQuery`を利用しています。これはSui RPCへのクエリを簡単に行うための便利なフックです。
- `getBalance` RPCメソッドを呼び出しています。
- `enabled: Boolean(zkLoginUserAddress)`: `zkLoginUserAddress`が存在する（つまりユーザーがログインしている）場合にのみクエリを実行します。
- `refetchInterval: 1500`: 1.5秒ごとに自動で残高を再取得し、UIを最新の状態に保ちます。

#### 2.`useGetOwnedNFTs`フック

このフックは、指定されたSuiアドレスが所有するNFTをリアクティブに取得・監視します。

- こちらも`useSuiClientQuery`を利用し、`getOwnedObjects` RPCメソッドを呼び出しています。
- `filter`: `StructType`を指定することで、数ある所有オブジェクトの中から特定のNFT（`TestnetNFT`）のみを絞り込んで取得します。
- `options`: `showContent`などを`true`に設定し、NFTのメタデータ（名前、画像URLなど）を含む詳細情報を取得するように指定しています。
- `refetchInterval: 3000`: 3秒ごとにNFTの所有状況を更新します。

---

これでブロックチェーンと通信するための基本的なフックが準備できました。次のレッスンでは、これらのフックを利用してアプリケーション全体の状態を管理する`GlobalProvider`を実装します。

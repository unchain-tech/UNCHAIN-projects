---
title: "トランザクションカードコンポーネントを実装する"
---

# Lesson 4: トランザクションカードコンポーネントを実装する

このレッスンでは、NFTのミント処理（トランザクション）が実行された際に、その結果（成功または失敗）やトランザクションハッシュをユーザーに分かりやすく表示するためのUIコンポーネント、`TransactionCard.tsx`を実装します。

## 📦 `components/TransactionCard.tsx`の実装

components/TransactionCard.tsx`というファイルを作成し、以下のコードを記述します。

```tsx
//components/TransactionCard.tsx

import { useNotification } from '@coinbase/onchainkit/minikit';
import {
  Transaction,
  TransactionButton,
  TransactionError,
  TransactionResponse,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
  TransactionToast,
  TransactionToastAction,
  TransactionToastIcon,
  TransactionToastLabel,
} from '@coinbase/onchainkit/transaction';
import { useCallback } from 'react';
import { Abi } from 'viem';
import { useAccount } from 'wagmi';

type TransactionProps = {
  calls: {
    address: `0x${string}`;
    abi: Abi;
    functionName: string;
    args: (string | number | bigint | boolean | `0x${string}`)[];
  }[];
};

/**
 * トランザクションカードコンポーネント
 * @returns
 */
export function TransactionCard({ calls }: TransactionProps) {
  const { address } = useAccount();

  const sendNotification = useNotification();

  /**
   * トランザクションが正常に実行された時に実行するコールバック関数
   */
  const handleSuccess = useCallback(
    async (response: TransactionResponse) => {
      const transactionHash = response.transactionReceipts[0].transactionHash;

      console.log(`Transaction successful: ${transactionHash}`);

      // トランザクション成功時に MiniKit 通知を送る
      await sendNotification({
        title: 'Congratulations!',
        body: `You sent your a transaction, ${transactionHash}!`,
      });
    },
    [sendNotification]
  );

  return (
    <div className="w-full">
      {address ? (
        <Transaction
          calls={calls}
          onSuccess={handleSuccess}
          onError={(error: TransactionError) => console.error('Transaction failed:', error)}
        >
          <TransactionButton className="text-md text-white" text="Mint NFT" />
          <TransactionStatus>
            <TransactionStatusAction />
            <TransactionStatusLabel />
          </TransactionStatus>
          <TransactionToast className="mb-4">
            <TransactionToastIcon />
            <TransactionToastLabel />
            <TransactionToastAction />
          </TransactionToast>
        </Transaction>
      ) : (
        <p className="mt-2 text-center text-sm text-yellow-400">
          Connect your wallet to send a transaction
        </p>
      )}
    </div>
  );
}
```

## 📖 コード解説

### `useAccount`フックの活用

`useOnchainKit`フックから`OnChainKit`で生成されたウォレットアドレスを取得しています。

```ts
const { address } = useAccount();
```

### `useNotification`フックの活用

`useNotification`フックの`sendNotification`メソッドを使ってトランザクション正常終了時にユーザー向けに通知を送信するようにしています。

 ```ts
const sendNotification = useNotification();
```

### トランザクションが正常に実行された時に実行するコールバック関数

`OnChainKit`のコンポーネント越しに送信したトランザクションが正常に終了した時にユーザー向けに通知を飛ばすようにしています。

`sendNotification`メソッドはテンプレプロジェクトで生成されたものをそのまま使っています。

```tsx
const handleSuccess = useCallback(
  async (response: TransactionResponse) => {
    const transactionHash = response.transactionReceipts[0].transactionHash;

    console.log(`Transaction successful: ${transactionHash}`);

    // トランザクション成功時に MiniKit 通知を送る
    await sendNotification({
      title: 'Congratulations!',
      body: `You sent your a transaction, ${transactionHash}!`,
    });
  },
  [sendNotification]
);
```

### OnChainKitのTransaction関連コンポーネント

トランザクションを送信する部分には`OnChainKit`の`Transaction`関連コンポーネントを活用しています。

```ts
import {
  Transaction,
  TransactionButton,
  TransactionError,
  TransactionResponse,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
  TransactionToast,
  TransactionToastAction,
  TransactionToastIcon,
  TransactionToastLabel,
} from '@coinbase/onchainkit/transaction';
```

これらのコンポーネントを活用するだけですぐにトランザクションを送信するアプリを構築することができます！

開発者側で用意する必要があるのはコールデータのみです！

コールデータは前のレッスンで実装した`calls`を渡すようにしています。

```ts
<Transaction
  calls={calls}
  onSuccess={handleSuccess}
  onError={(error: TransactionError) => console.error('Transaction failed:', error)}
>
  <TransactionButton className="text-md text-white" text="Mint NFT" />
  <TransactionStatus>
    <TransactionStatusAction />
    <TransactionStatusLabel />
  </TransactionStatus>
  <TransactionToast className="mb-4">
    <TransactionToastIcon />
    <TransactionToastLabel />
    <TransactionToastAction />
  </TransactionToast>
</Transaction>
```

---

これで、ユーザーにトランザクションを実行するためのUIコンポーネントが実装できました！

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#base`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

1.  質問が関連しているセクション番号とレッスン番号
2.  何をしようとしていたか
3.  エラー文をコピー&ペースト
4.  エラー画面のスクリーンショット

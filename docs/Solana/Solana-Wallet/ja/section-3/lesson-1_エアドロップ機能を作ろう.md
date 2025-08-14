### ⭐️ エアドロップの基礎

前のセクションでアカウントの残高が0であることを確認しましたが、アカウントに資金を供給して、残高の変化を見ることができたらいいと思いませんか？

アカウントをテストするために実際のお金を送金する必要があるのかと思うかもしれませんが、前回説明したように、ブロックチェーンの`Devnet`は通常、実際の経済価値を危険にさらすことなく取引をテストする方法を提供します。

このレッスンでは、ユーザーが`SOL`トークンを`Devnet`アカウントに「エアドロップ」できるようにする機能を構築します。暗号の世界では、エアドロップとは、プロトコルがアカウント所有者に無料でトークンを配布する方法のことを言います。

この場合、私たちはSolanaに組み込まれたネイティブな`Devnet`エアドロップ機能を利用して、アカウントに資金を供給することになります。これは、ブロックチェーン・プロトコルや暗号プロジェクトが行うメインネット・エアドロップとは対照的で、通常、アーリーアダプターや貢献者に報いるために発行されるものです。

このレッスンを完了すると、`Airdrop`ボタンを押下したときに、自動的に残高が増えるようになります。次のレッスンでは資金の送金機能をつくるため、ここで自分のアカウントの資金を増やしておきましょう。

### 🛫 導入

ここからは`components/Airdrop/index.js`を更新していきます。

前のセクションで、Solanaのネットワークの1つへの接続をインスタンス化する方法と、アカウントの公開鍵プロパティを変数に代入する方法を学びました。同じコードをここで適用して、`handleAirdrop`関数をつくっていきましょう。

まずは、エアドロップの実装に必要なメソッドをインポートし、これまでに作成したコンポーネント同様`Home`コンポーネントが保持しているデータのうち、実装に必要なデータを引数として受け取るようにします。

```js
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';

export default function Airdrop({ account, network, refreshBalance }) {
```

次に、`handleAirdrop`関数を定義していきましょう。`export default function Airdrop({ account, network, refreshBalance }) {`の直下に、下記のコードを追加してください。

```js
const handleAirdrop = async () => {
  try {
  } catch (error) {
    console.error(error);
  }
};
```

それでは、`handleAirdrop`関数の内部を実装していきましょう。`try-catch`文の`try{}`内にコードを追加していきます。

```js
const connection = new Connection(network, "confirmed");

// console.log(connection);
// > Connection {_commitment: 'confirmed', _confirmTransactionInitialTimeout: undefined, _rpcEndpoint: 'https://api.devnet.solana.com', _rpcWsEndpoint: 'wss://api.devnet.solana.com/', _rpcClient: ClientBrowser, …}
```

キーワードでドキュメントを検索するという以前のヒューリスティックな方法に従って、今度は「airdrop」を検索して、活用できるメソッドがあるかどうかを確認することができます。

驚いたことに、`Connection`クラスには`requestAirdrop`メソッドがあり、これは期待できそうです。これは2つのプロパティを受け取ります。 `to: PublicKey`と`lamports: number`です。

![](/images/Solana-Wallet/section-3/3_1_1.png)

```js
const signature = await connection.requestAirdrop(
  account.publicKey,
  1 * LAMPORTS_PER_SOL
);
```

上記のように`requestAirdrop`メソッドを呼び出すと、`1 SOL`をエアドロップすることができます。 `LAMPORTS_PER_SOL = 1SOL`になるからです。

### Confirming airdrop

最後に、アカウントの残高を自動的に更新する前に、refresh残高を呼び出す前に、ブロックチェーンの台帳がエアドロップされた資金で更新されていることを確認する方法が必要です。

データベース型の操作と同様に、ブロックチェーンの状態変更は非同期です。実際、ほとんどのブロックチェーン・プロトコルが分散型であることを考えると、一部の更新には時間がかかることがあります。

このことを念頭に置いて、残高を更新する前にエアドロップが確認されるのを待つ必要があります。もう一度ドキュメントを検索すると、`Connection`クラスに`confirmTransaction`メソッドがあり、2つの引数を受け取り、トランザクションがネットワークによって確認されると解決するプロミスを返していることがわかります。

![](/images/Solana-Wallet/section-3/3_1_2.png)

[`TransactionConfirmationStrategy`](https://solana-labs.github.io/solana-web3.js/types/TransactionConfirmationStrategy.html)については、定義に「すべてのトランザクション確認戦略を表す型」とあります。Solanaでは、トランザクションを確認するための方法が複数用意されており、これらをひとまとめに表す型名としてTransactionConfirmationStrategyが用意されています。リンク先を確認すると、トランザクションが有効である最後のブロックの高さを用いて確認する方法と、Nonceを用いて確認する方法が用意されていることがわかります。今回は、一般的なアプローチとしてブロックの高さを用いて確認する方法を選択します。

では、最新のブロックについてのデータを取得するにはどうすればよいでしょうか。再度ドキュメントを検索すると、`Connection`クラスには、`getLatestBlockhash`メソッドがあり、最新のブロックのハッシュと、そのブロックの高さを返すことがわかります。

![](/images/Solana-Wallet/section-3/3_1_3.png)

それでは、ドキュメントを参考に`confirmTransaction`メソッドを呼び出しましょう。トランザクションの成功を確認するためには、`confirmTransaction`メソッドが返すプロミスの`value`プロパティを確認する必要があります。`value`プロパティは、`signature`プロパティと`err`プロパティを持つオブジェクトを返します。`err`プロパティが`null`であれば、トランザクションは成功しています。

```js
const latestBlockHash = await connection.getLatestBlockhash();
await connection
  .confirmTransaction(
    {
      signature,
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    },
    "confirmed"
  )
  .then((response) => {
    const signatureResult = response.value;
    if (signatureResult.err) {
      console.error("Transaction failed: ", signatureResult.err);
    }
  });
```

ここで、残高確認のため変数を代入する必要がないことに注意してください。ウォレットは、ネットワークによってトランザクションが確認されたことを知ると、`refreshBalance`関数を呼び出してアカウントの残高を更新することができます。

下記のコードをtry{}内の最後に追加します。

```js
await refreshBalance();
```

最後に、 `Airdrop`ボタンを実装しましょう！ return文を下記のコードで更新してください。

```js
return (
  <button
    className="p-2 my-6 text-white bg-indigo-500 focus:ring focus:ring-indigo-300 rounded-lg cursor-pointer"
    onClick={handleAirdrop}
  >
    Airdrop
  </button>
);
```

`Airdrop`コンポーネントの実装が完了したので、テストスクリプトを実行して模擬的に動作確認をしてみましょう。

ターミナル上で`npm run test`を実行します。

components/Airdrop/index.test.jsが`PASS`し、`Test Suites`が下記のようになっていたらOKです！

```
Test Suites: 1 failed, 4 passed, 5 total
```

それでは、`Airdrop`コンポーネントを`Home`コンポーネントに組み込んで`Airdrop`ボタンを表示しましょう。`pages/index.js`を更新していきます。

インポート文を追加します。

```js
import Airdrop from "../components/Airdrop";
```

`Airdrop`コンポーネントを呼び出すコードを追加して、ボタンをレンダリングします。

```js
<div>
  <h2 className="p-2 border-dotted border-l-4 border-l-indigo-400">
    STEP4: エアドロップ機能を実装する
  </h2>
  {/* 下記を追加 */}
  {account && (
    <Airdrop
      account={account}
      network={network}
      refreshBalance={refreshBalance}
    />
  )}
</div>
```

### ✅ 動作確認

おめでとうございます!これでエアドロップの機能が完成しました。

実際に`Airdrop`ボタンを押下して、残高が増えていれば成功です!

### 📝 このセクションで追加したコード

- `components/Airdrop/index.js`

```js
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function Airdrop({ account, network, refreshBalance }) {
  const handleAirdrop = async () => {
    try {
      const connection = new Connection(network, "confirmed");
      const publicKey = account.publicKey;
      const signature = await connection.requestAirdrop(
        publicKey,
        1 * LAMPORTS_PER_SOL
      );

      const latestBlockHash = await connection.getLatestBlockhash();
      await connection
        .confirmTransaction(
          {
            signature,
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          },
          "confirmed"
        )
        .then((response) => {
          const signatureResult = response.value;
          if (signatureResult.err) {
            console.error("Transaction failed: ", signatureResult.err);
          }
        });

      // アカウントの残高を更新します。
      await refreshBalance();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <button
      className="p-2 my-6 text-white bg-indigo-500 focus:ring focus:ring-indigo-300 rounded-lg cursor-pointer"
      onClick={handleAirdrop}
    >
      Airdrop
    </button>
  );
}
```

- `pages/index.js`

```diff
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useEffect, useState } from 'react'; // useEffectの追加

+import Airdrop from '../components/Airdrop';
import GenerateWallet from '../components/GenerateWallet/';
import GetBalance from '../components/GetBalance';
import HeadComponent from '../components/Head';
import ImportWallet from '../components/ImportWallet';

export default function Home() {

  // ===== 省略 =====

  return (
    <div>

      // ===== 省略 =====

        <div>
          <h2 className="p-2 border-dotted border-l-4 border-l-indigo-400">
            STEP3: 残高を取得する
          </h2>
          {account && <GetBalance refreshBalance={refreshBalance} />}
        </div>
        <hr className="my-6" />
        <div>
          <h2 className="p-2 border-dotted border-l-4 border-l-indigo-400">
            STEP4: エアドロップ機能を実装する
          </h2>
+          {account && (
+            <Airdrop
+              account={account}
+              network={network}
+              refreshBalance={refreshBalance}
+            />
+          )}
        </div>
        <hr className="my-6" />
        <div>
          <h2 className="p-2 border-dotted border-l-4 border-l-indigo-400">
            STEP5: 送金機能を実装する
          </h2>
        </div>
      </div>
    </div>
  );
}
```

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#solana`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

おめでとうございます ✨ エアドロップ機能が完成しました!
次のレッスンに進んで、送金機能を実装していきましょう 😊

これから、以下の機能を実装するためにいくつかの関数を追加していきます。

1\. サーバー上でトランザクションオブジェクトを生成する
2\. サーバーからトランザクションオブジェクトを取得する
3\. ユーザーにトランザクションに署名するよう依頼する
4\. トランザクションが通ったことを確認する

トランザクションが処理されたら、ファイルをユーザーに送信するためのダウンロードボタンを表示しましょう。


### 💥 SOL トークンを送信する

ブロックチェーンのトランザクションには多くの構成要素がありますが、まずはUSDCの代わりにSOLを送るところから始めていきます。

まず、`api`フォルダ内に`createTransaction.js`ファイルを作成して以下のコードを貼り付けてください。

**※ `sellerAddress`にあなたのウォレットアドレスを設定してください!**

```jsx
// createTransaction.js

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import BigNumber from 'bignumber.js';

import products from './products.json';

// このアドレスを販売者のウォレットアドレスに置き換えてください。（ここでは販売者＝あなたです。）
const sellerAddress = 'あなたのウォレットアドレス'
const sellerPublicKey = new PublicKey(sellerAddress);

const createTransaction = async (req, res) => {
  try {
    // リクエストからトランザクションデータを抽出します。
    const { buyer, orderID, itemID } = req.body;

    // 必要なものがない場合は中止します。
    if (!buyer) {
      return res.status(400).json({
        message: 'Missing buyer address',
      });
    }

    if (!orderID) {
      return res.status(400).json({
        message: 'Missing order ID',
      });
    }

    // products.jsonからitemIDで商品価格を取得します。
    const itemPrice = products.find((item) => item.id === itemID).price;

    if (!itemPrice) {
      return res.status(404).json({
        message: 'Item not found. please check item ID',
      });
    }

    // 価格を適切な形式に変換します。
    const bigAmount = BigNumber(itemPrice);
    const buyerPublicKey = new PublicKey(buyer);
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = clusterApiUrl(network);
    const connection = new Connection(endpoint);

    // 各ブロックを識別するblockhashはblockのIDのようなものです。
    const { blockhash } = await connection.getLatestBlockhash('finalized');

    // トランザクションには直近のブロックIDと料金支払者の公開鍵の2つが必要です。
    const tx = new Transaction({
      recentBlockhash: blockhash,
      feePayer: buyerPublicKey,
    });

    // トランザクションによりSOLを送金します。
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: buyerPublicKey,
      // LamportsはSOLの最小単位で、EthereumにおけるGweiにあたります。
      lamports: bigAmount.multipliedBy(LAMPORTS_PER_SOL).toNumber(),
      toPubkey: sellerPublicKey,
    });

    // トランザクションにさらに命令を追加します。
    transferInstruction.keys.push({
      // あとでOrderIdを使用してこのトランザクションを検索します。
      pubkey: new PublicKey(orderID),
      isSigner: false,
      isWritable: false,
    });

    tx.add(transferInstruction);

    // トランザクションのフォーマットを設定します。
    const serializedTransaction = tx.serialize({
      requireAllSignatures: false,
    });
    const base64 = serializedTransaction.toString('base64');

    res.status(200).json({
      transaction: base64,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: 'error creating tx' });
  }
}

export default function handler(req, res) {
  if (req.method === 'POST') {
    createTransaction(req, res);
  } else {
    res.status(405).end();
  }
}
```

コードの見た目は複雑ですが、内容は見た目よりもはるかに単純なものとなっています。

ここで知っておく必要があるのは、あるアドレスから別のアドレスに一定量のSOLトークンを転送するSolanaトランザクションオブジェクトを作成しているということです。

続いて、ここで作成したエンドポイントを呼び出すために、新しいコンポーネント（購入ボタン）を作成します。

`components`フォルダに`Buy.js`を作成して以下のコードを貼り付けてください。

```jsx
// Buy.js

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, Transaction } from '@solana/web3.js';
import { useMemo, useState } from 'react';
import { InfinitySpin } from 'react-loader-spinner';

import IPFSDownload from './IpfsDownload';

export default function Buy({ itemID }) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const orderID = useMemo(() => Keypair.generate().publicKey, []); // 注文を識別するために使用される公開鍵を設定します。

  const [paid, setPaid] = useState(null);
  const [loading, setLoading] = useState(false); // 上記全てのロード状態を設定します。

  // useMemoは依存関係が変更された場合にのみ値を計算するReactフックです。
  const order = useMemo(
    () => ({
      buyer: publicKey.toString(),
      orderID: orderID.toString(),
      itemID: itemID,
    }),
    [publicKey, orderID, itemID]
  );

  // サーバーからトランザクションオブジェクトを取得します。
  const processTransaction = async () => {
    setLoading(true);
    const txResponse = await fetch('../api/createTransaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });
    const txData = await txResponse.json();

    // トランザクションオブジェクトを作成します。
    const tx = Transaction.from(Buffer.from(txData.transaction, 'base64'));
    console.log('Tx data is', tx);

    try {
      // ネットワークにトランザクションを送信します。
      const txHash = await sendTransaction(tx, connection);
      console.log(`Transaction sent: https://solscan.io/tx/${txHash}?cluster=devnet`);
      // この処理は失敗する可能性がありますが、現段階ではtrueを設定しておきます。
      setPaid(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!publicKey) {
    return (
      <div>
        <p>You need to connect your wallet to make transactions</p>
      </div>
    );
  }

  if (loading) {
    return <InfinitySpin color="gray" />;
  }

  return (
    <div>
      {paid ? (
        <IPFSDownload filename="anya" hash="QmcJPLeiXBwA17WASSXs5GPWJs1n1HEmEmrtcmDgWjApjm" cta="Download goods"/>
      ) : (
        <button disabled={loading} className="buy-button" onClick={processTransaction}>
          Buy now →
        </button>
      )}
    </div>
  );
}
```

このコンポーネントは今回作成するWebアプリケーションの中心となるコンポーネントです。

これから機能を追加していきますが、現段階ではトランザクションを送信し、ダウンロードボタンを有効にするためのコンポーネントとなっています。

このコンポーネントを使用するために、`components`フォルダ内の`Product.js`を以下のとおり変更します。

```jsx
// Product.js

import styles from '../styles/Product.module.css';
import Buy from './Buy';

export default function Product({ product }) {
  const { id, name, price, description, image_url } = product;

  return (
    <div className={styles.product_container}>
      <div >
        <img className={styles.product_image}src={image_url} alt={name} />
      </div>

      <div className={styles.product_details}>
        <div className={styles.product_text}>
          <div className={styles.product_title}>{name}</div>
          <div className={styles.product_description}>{description}</div>
        </div>

        <div className={styles.product_action}>
          <div className={styles.product_price}>{price} USDC</div>
            {/* IPFSコンポーネントをBuyコンポーネントに置き換えます。 */}
            <Buy itemID={id} />
        </div>
      </div>
    </div>
  );
}
```

ここで新しく作られた`Buy now →`ボタンをクリックすると、バックエンドを叩いてこの商品のトランザクションオブジェクトをフェッチします。

この処理が完了したら`Paid`をtrueに設定し、`Download`ボタンが有効化されます。


### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#solana`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンでは、SOLでなくUSDCで処理を実行できるように変更を加えていきます。

`Buy now →`ボタンを押すことでトランザクションは送信されますが、実際にはトランザクションが送られただけで残高の変動はありません。

実際に支払いを完了させるために必要なことは次のとおりです。

### 🤔 トランザクションを確認する

まず、`components`フォルダの`Buy.js`ファイルを以下のとおり更新します。

```jsx
// Buy.js

import { findReference, FindReferenceError } from '@solana/pay';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, Transaction } from '@solana/web3.js';
import { useEffect, useMemo, useState } from 'react';
import { InfinitySpin } from 'react-loader-spinner';

import IPFSDownload from './IpfsDownload';

const STATUS = {
  Initial: 'Initial',
  Submitted: 'Submitted',
  Paid: 'Paid',
};

export default function Buy({ itemID }) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const orderID = useMemo(() => Keypair.generate().publicKey, []); // 注文を識別するために使用される公開鍵を用意します。


  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(STATUS.Initial); // トランザクションステータス追跡用のstateを定義します。


  const order = useMemo(
    () => ({
      buyer: publicKey.toString(),
      orderID: orderID.toString(),
      itemID: itemID,
    }),
    [publicKey, orderID, itemID]
  );

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

    const tx = Transaction.from(Buffer.from(txData.transaction, 'base64'));
    console.log('Tx data is', tx);

    try {
      const txHash = await sendTransaction(tx, connection);
      console.log(`Transaction sent: https://solscan.io/tx/${txHash}?cluster=devnet`);
      setStatus(STATUS.Submitted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // トランザクションが確認されたかどうかを確認します。
    if (status === STATUS.Submitted) {
      setLoading(true);
      const interval = setInterval(async () => {
        try {
          const result = await findReference(connection, orderID);
          console.log('Finding tx reference', result.confirmationStatus);
          if (result.confirmationStatus === 'confirmed' || result.confirmationStatus === 'finalized') {
            clearInterval(interval);
            setStatus(STATUS.Paid);
            setLoading(false);
            alert('Thank you for your purchase!');
          }
        } catch (e) {
          if (e instanceof FindReferenceError) {
            return null;
          }
          console.error('Unknown error', e);
        } finally {
          setLoading(false);
        }
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [status]);

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
      { status === STATUS.Paid ? (
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

今回新しく追加したのは以下のコードブロックです。

```jsx
  useEffect(() => {
    // トランザクションが確認されたかどうかをチェックします。
    if (status === STATUS.Submitted) {
      setLoading(true);
      const interval = setInterval(async () => {
        try {
          // ブロックチェーン上でorderIDを探します。
          const result = await findReference(connection, orderID);
          console.log('Finding tx reference', result.confirmationStatus);

          // トランザクションがconfirmedまたはfinalizedした場合、支払いは成功となります。
          if (result.confirmationStatus === 'confirmed' || result.confirmationStatus === 'finalized') {
            clearInterval(interval);
            setStatus(STATUS.Paid);
            setLoading(false);
            alert('Thank you for your purchase!');
          }
        } catch (e) {
          if (e instanceof FindReferenceError) {
            return null;
          }
          console.error('Unknown error', e);
        } finally {
          setLoading(false);
        }
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [status]);
```

トランザクションオブジェクトを作成する際に、参照フィールドとしてorder IDを追加しました。

これにより、支払いが行われたかどうかを確認できるようになります。

このWebアプリケーションでは、トランザクションを検索することができるため、決済が行われたかどうかを瞬時に確認することができるのです。

```jsx
const result = await findReference(connection, orderID);
```

[findReference](https://docs.solanapay.com/api/core/function/findReference)関数は、order IDを参照する最も古いトランザクション署名を検索します。

見つかった場合は、トランザクションステータスがconfirmedまたはfinalizedされたことを確認します。

```jsx
  if (e instanceof FindReferenceError) {
    return null;
  }
```

トランザクションが見つからない場合、この関数はトランザクションが送信された直後にエラーとなる可能性があります。

そのため、エラーが[FindReferenceError](https://docs.solanapay.com/api/core/class/FindReferenceError)クラスによるものかどうかを確認します。

ユーザーが **Approve** するのと同時に、コードはトランザクションの検索を始めます。

(トランザクションには約0.5秒かかるため、最初の検索はおそらく失敗します。そのため、`setInterval`を使用しています)。

2回目のチェックでは、トランザクションが検出され、それを確認することでWebアプリケーションが支払いを促します。

ブロックチェーンを使用することで、無効なトランザクションを心配する必要がなくなります。


### 🧠 オーダーブックに追加する

現段階では、支払い後にページを更新すると`Download`ボタンが消えてしまいます。

この現象は、注文情報をどこにも保存していないために起こります。

これからこの部分を修正していきます。

まず、 `pages/api`フォルダ内に`orders.json`を作成します。

**※今のところは空のままにしたいので、中身は以下のとおりとします。**

```json
// order.json
[

]
```

次に、書き込みと読み取りを行うAPIエンドポイントを作成します。

※データベースとして`orders.json`を使用します。

`pages/api`ディレクトリ内に`orders.js`ファイルを作成して以下のコードを貼り付けてください。

```jsx
// orders.js

// このAPIエンドポイントでは、ユーザーがレコードを追加するためにデータをPOSTし、レコードを取得するためにGETします。
import orders from './orders.json';

import { writeFile } from 'fs/promises';

function get(req, res) {
  const { buyer } = req.query;

  // このアドレスに注文があるかどうかを確認します。
  const buyerOrders = orders.filter((order) => order.buyer === buyer);
  if (buyerOrders.length === 0) {
    // 204はリクエストを正常に処理し、コンテンツを返さないステータスです。
    res.status(204).send();
  } else {
    res.status(200).json(buyerOrders);
  }
}

async function post(req, res) {
  console.log('Received add order request', req.body);
  // 新しい注文をorders.jsonに追加します。
  try {
    const newOrder = req.body;

    // このアドレスが対象の商品を購入していない場合は、orders.jsonに注文を追加します。
    if (
      !orders.find(
        (order) => order.buyer === newOrder.buyer.toString() &&
        order.itemID === newOrder.itemID,
      )
    ) {
      orders.push(newOrder);
      await writeFile(
        './pages/api/orders.json',
        JSON.stringify(orders, null, 2)
      );
      res.status(200).json(orders);
    } else {
      res.status(400).send('Order already exists');
    }
  } catch (err) {
    res.status(400).send(err);
  }
}

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      get(req, res);
      break;
    case 'POST':
      await post(req, res);
      break;
    default:
      res.status(405).send(`Method ${req.method} not allowed`);
  }
}
```

ここでは、データを読み取って`orders.json`ファイルに書き込む処理をしています。

これから、このAPIを操作していきます。

個々のファイルの中で処理を書くことはできますが、それは一般的に悪い習慣と言われています。

ということで、API操作専用のファイルを作成していきましょう。

プロジェクトのルートディレクトリ(`components`などと同じ階層)に`lib`フォルダを作成し、さらにその中に`api.js`ファイルを作成します。

`api.js`ファイルを作成したら、以下のコードを貼り付けてください。

```jsx
// api.js

export const addOrder = async (order) => {
  console.log('adding order ', order, 'To DB');
  await fetch('../api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  });
};
```

これを使用するためには、`addOrder`関数をインポートして、トランザクションが確認された直後に`Buy.js`で呼び出す必要があります。

それでは早速`Buy.js`を更新しましょう。

```jsx
// Buy.js

import { findReference, FindReferenceError } from '@solana/pay';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, Transaction } from '@solana/web3.js';
import { useEffect, useMemo, useState } from 'react';
import { InfinitySpin } from 'react-loader-spinner';

import { addOrder } from '../lib/api';
import IPFSDownload from './IpfsDownload';

const STATUS = {
  Initial: 'Initial',
  Submitted: 'Submitted',
  Paid: 'Paid',
};

export default function Buy({ itemID }) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const orderID = useMemo(() => Keypair.generate().publicKey, []); // 注文を識別するために使用する公開鍵を用意します。

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(STATUS.Initial); // トランザクションステータス追跡用のstateを定義します。

  const order = useMemo(
    () => ({
      buyer: publicKey.toString(),
      orderID: orderID.toString(),
      itemID: itemID,
    }),
    [publicKey, orderID, itemID]
  );

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

    const tx = Transaction.from(Buffer.from(txData.transaction, 'base64'));
    console.log('Tx data is', tx);

    try {
      const txHash = await sendTransaction(tx, connection);
      console.log(
        `Transaction sent: https://solscan.io/tx/${txHash}?cluster=devnet`
      );
      setStatus(STATUS.Submitted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // トランザクションが確認されたかどうかチェックします。
    if (status === STATUS.Submitted) {
      setLoading(true);
      const interval = setInterval(async () => {
        try {
          const result = await findReference(connection, orderID);
          console.log('Finding tx reference', result.confirmationStatus);
          if (
            result.confirmationStatus === 'confirmed' ||
            result.confirmationStatus === 'finalized'
          ) {
            clearInterval(interval);
            setStatus(STATUS.Paid);
            setLoading(false);
            addOrder(order); // ここに追加します。
            alert('Thank you for your purchase!');
          }
        } catch (e) {
          if (e instanceof FindReferenceError) {
            return null;
          }
          console.error('Unknown error', e);
        } finally {
          setLoading(false);
        }
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [status]);

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
      {status === STATUS.Paid ? (
        <IPFSDownload filename="anya" hash="QmcJPLeiXBwA17WASSXs5GPWJs1n1HEmEmrtcmDgWjApjm" cta="Download goods"/>
      ) : (
        <button
          disabled={loading}
          className="buy-button"
          onClick={processTransaction}
        >
          Buy now →
        </button>
      )}
    </div>
  );
}
```

ここまでで、注文情報を保存することができるようになりました。


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

次のレッスンでは、購入機能を実装していきます!

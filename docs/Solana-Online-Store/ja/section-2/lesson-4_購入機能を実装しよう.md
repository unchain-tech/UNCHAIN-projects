### 👀 ロード時に購入済かどうかを確認する

それでは、`order.json`の「データベース」を上手く利用して、ストアに購入機能を実装していきましょう!

これを行うためのフローは`api.js`で使用した`addOrder`とよく似ています。

まず、`lib/api.js`の**さいごに以下のコードを追加**します。

```jsx
// api.js

// 指定された公開鍵が過去に商品を購入していた場合はtrueを返します。
export const hasPurchased = async (publicKey, itemID) => {
  // 公開鍵をパラメータとしてGETリクエストを送信します。
  const response = await fetch(`../api/orders?buyer=${publicKey.toString()}`);
  // レスポンスコードが200の場合の処理です。
  if (response.status === 200) {
    const json = await response.json();
    console.log("Current wallet's orders are:", json);
    // 注文が存在した場合の処理です。
    if (json.length > 0) {
      // この購入者とアイテムIDのレコードがあるかどうかを確認します。
      const order = json.find(
        (order) =>
          order.buyer === publicKey.toString() && order.itemID === itemID,
      );
      if (order) {
        return true;
      }
    }
  }
  return false;
};
```

ここではエンドポイントとやり取りし、指定されたアドレスが特定のアイテムを購入したかどうかを確認しています。

この機能を実装するにあたって、`Buy.js`で以下の2つのことを行う必要があります。

1\. インポートに`hasPurchased`を含める。

2\. useEffectでページの読み込み時に`hasPurchased`チェックを実行する。

それぞれの変更を加えるために、以下のとおり更新していきましょう。

```jsx
// Buy.js

import { findReference, FindReferenceError } from '@solana/pay';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, Transaction } from '@solana/web3.js';
import { useEffect, useMemo, useState } from 'react';
import { InfinitySpin } from 'react-loader-spinner';

import { addOrder, hasPurchased } from '../lib/api';
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
    // このアドレスがすでに対象の商品を購入しているか確認し、購入している場合は商品データを取得してPaidをtrueに設定します。
    async function checkPurchased() {
      const purchased = await hasPurchased(publicKey, itemID);
      if (purchased) {
        setStatus(STATUS.Paid);
        console.log('Address has already purchased this item!');
      }
    }
    checkPurchased();
  }, [publicKey, itemID]);


  useEffect(() => {
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
            addOrder(order);
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

以下が今回追加した部分になります。

コメントのとおり動作します。

```jsx
  useEffect(() => {
    // このアドレスがすでに対象の商品を購入しているか確認し、購入している場合は商品データを取得してPaidをtrueに設定します。
    async function checkPurchased() {
      const purchased = await hasPurchased(publicKey, itemID);
      if (purchased) {
        setStatus(STATUS.Paid);
        console.log('Address has already purchased this item!');
      }
    }
    checkPurchased();
  }, [publicKey, itemID]);
```


### 👏 API を使ってデータベースからアイテム情報を取得する

今まで、アイテムの一覧をハードコーディングしてきましたが、ここでその部分を修正していきます。

まず手始めに、`pages/api`ディレクトリに`fetchItem.js`というファイルを作成して以下のコードを貼り付けてください。

```jsx
// fetchItem.js

// このエンドポイントはユーザーに対して IPFS からファイルハッシュを送信します。
import products from './products.json'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { itemID } = req.body;

    if (!itemID) {
      return res.status(400).send('Missing itemID');
    }

    const product = products.find((p) => p.id === itemID);

    if (product) {
      const { hash, filename } = product;
      return res.status(200).send({ hash, filename });
    } else {
      return res.status(404).send('Item not found');
    }
  } else {
    return res.status(405).send(`Method ${req.method} not allowed`);
  }
}
```

この段階では、ハッシュを削除しているため、`fetchProducts`が使えなくなっています。

そのため、`lib/api.js`の**さいごに以下のコードを追加**します。

```jsx
// api.js

export const fetchItem = async (itemID) => {
  const response = await fetch('../api/fetchItem', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ itemID }),
  });
  const item = await response.json();
  return item;
}
```

さいごに、`Buy.js`を以下のとおり更新します。

```jsx
// Buy.js

import { findReference, FindReferenceError } from '@solana/pay';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, Transaction } from '@solana/web3.js';
import { useEffect, useMemo, useState } from 'react';
import { InfinitySpin } from 'react-loader-spinner';

import { addOrder, fetchItem, hasPurchased } from '../lib/api';
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

  const [item, setItem] = useState(null); // 購入したアイテムのIPFSハッシュとファイル名を設定します。
  const [loading, setLoading] = useState(false); // 上記のすべてのロード状態を設定します。
  const [status, setStatus] = useState(STATUS.Initial); // トランザクションステータス追跡用のstateを定義します。

  const order = useMemo(
    () => ({
      buyer: publicKey.toString(),
      orderID: orderID.toString(),
      itemID: itemID,
    }),
    [publicKey, orderID, itemID]
  );

  // サーバーからトランザクションオブジェクトを取得します。（改ざんを回避するために実行されます。）
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
    // トランザクションをネットワークに送信します。
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
    // このアドレスがすでに対象の商品を購入しているか確認し、購入している場合は商品データを取得してPaidをtrueに設定します。
    async function checkPurchased() {
      const purchased = await hasPurchased(publicKey, itemID);
      if (purchased) {
        setStatus(STATUS.Paid);
        const item = await fetchItem(itemID);
        setItem(item);
      }
    }
    checkPurchased();
  }, [publicKey, itemID]);

  useEffect(() => {
    // トランザクションが確認されているかチェックします。
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
            addOrder(order);
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

    async function getItem(itemID) {
      const item = await fetchItem(itemID);
      setItem(item);
    }

    if (status === STATUS.Paid) {
      getItem(itemID);
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
      {/* ハッシュが存在するかどうかに基づいて購入ボタンまたはIPFS Downloadコンポーネントのいずれかを表示します。 */}
      {item ? (
        <IPFSDownload hash={item.hash} filename={item.filename} />
      ) : (
        <button disabled={loading} className="buy-button" onClick={processTransaction}>
          Buy now →
        </button>
      )}
    </div>
  );
}
```

### ✅ コンポーネントの動作確認

`Buy`コンポーネントの全ての機能を実装したので、テストスクリプトを実行してみましょう。

簡単にテスト内容を説明します。`__tests__/Buy.test.js`では、**アイテムの購入状態に応じてレンダリングされる内容が変わるか**、**ボタンを押したときに期待する関数が実行されるか**をテストしています。

アイテムの購入状態は、`lib/api.js`の`hasPurchased`関数をモック化することで設定しています。

```javascript
// __tests__/Buy.test.js

// 各テストの状況に合わせて戻り値を設定します。
describe('Buy', () => {
  it('should render buy button when product is not purchased', async () => {
    /** hasPurchased関数をモックして、未購入を示す`false`を返すようにする */
    hasPurchased.mockResolvedValue(false);

  ...

  it('should not render buy button when product is purchased', async () => {
    /** hasPurchased関数をモックして、購入済みを示す`true`を返すようにする */
    hasPurchased.mockResolvedValue(true);
```

Buy nowボタンを押したときの挙動は、fetch関数をモックして成功ステータスを返す・sendTransaction関数が期待する引数を受け取るかどうかを確認することでテストしています。

```javascript
// __tests__/Buy.test.js

// 下記のように成功ステータスを含むレスポンスを定義します。
const createTransactionMock = () => {
  return Promise.resolve({
    status: 200,
    json: () =>
      Promise.resolve({
        transaction: 'transaction',
      }),
  });
};

// テスト内でfetch関数の戻り値を設定します。
global.fetch = jest.fn(() => createTransactionMock());
```

関数が期待する引数を受け取るかどうかは、下記の部分で確認しています。

```javascript
// __tests__/Buy.test.js

/** 確認 */
/** 期待する引数で関数が実行されているかを確認します */
expect(fetch).toBeCalledWith('../api/createTransaction', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    buyer: 'publicKey',
    orderID: 'orderID',
    itemID: 1,
  }),
});
expect(sendTransactionMock).toBeCalledWith('mockTx', 'connection');
```

それでは、テストスクリプトを実行してみましょう。`package.json`ファイルのjestコマンドを更新してBuyコンポーネントのテスト実行を追加します。

```json
// package.json

"scripts": {
  // 下記に更新
  "test": "jest IpfsDownload.test.js Buy.test.js"
}
```

jestコマンドを更新したら、ターミナルで`yarn test`を実行してみましょう。

```
yarn test
```

テストがパスしたら、Buyコンポーネントの実装は完了です。

![](/public/images/Solana-Online-Store/section-2/2_4_1.png)

ブラウザ上で実際に操作してみましょう。

おめでとうございます!

これで購入ボタンと商品データ、注文情報などをすべてリンクさせることができました🤣🤣🤣

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

おめでとうございます!

セクション2は終了です!

ぜひ、Webアプリケーションの商品購入時のローディング画面をコミュニティに投稿してください!

あなたの成功をコミュニティで祝いましょう 🎉

次のセクションでは、商品の追加を行っていきます!

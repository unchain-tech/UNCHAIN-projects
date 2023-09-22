### 💸 アカウントの残高について

暗号化ウォレットの主な役割は、秘密鍵を保管することです。秘密鍵を保管することで、デジタル資産の管理（送金、受領、整理）を可能にします。この機能の一部として、ウォレットはオンチェーンに保存されている特定のデータを取得し、ユーザーダッシュボードに表示する必要があります。

残高とは、あるアカウントで保有している暗号通貨やトークンの一定量を表します。ブロックチェーンを所有者記録を保持するデータベースと考え、公開鍵を所有者IDと考えるなら、残高は各所有者が特定のトークンをどれだけ保持しているかを追跡するデータベースの整数カラムと考えることができます。

本レッスンで、Solanaのネットワークの1つに接続し、作成したアカウントの残高を取得してみましょう。

また、次のセクションではエアドロップ機能を実装し、テストトークンをアカウントに付与できるようにします。

### 🌍 Networks

1つのプロトコルに様々なネットワークがあるという概念は、アプリに様々な環境（開発、テスト、本番など）があるという概念と似ています。

一般的にブロックチェーン・プロトコルは、実際の経済価値と公式トランザクションを持つ本番用ブロックチェーンを指すメインネットワークまたはメインネットと、メインネットで稼働する前に機能をテストするための同一のブロックチェーンを指す少なくとも1つの実験用ネットワークがあります。

Solanaは、`Mainnet`と呼ばれる本番用ネットワークと、`Testnet`および`Devnet`と呼ばれる2つの実験用ネットワークを持っています。

Solanaの`Devnet`は、開発者やユーザーが実際の経済的影響を伴うメインネット上で起動する前に、様々な機能で遊んだり、dAppsをデバッグしたりするために設計されています。 `Testnet`は、Solanaが潜在的なプロトコルのアップデートをテストする場所です。

### 👋 導入

前セクションまでで、"ウォレット=アカウントアドレスとそれにアクセスするためのキーを表すキーペアを保持するキーチェーンに近いものであること" を説明しました。私たちは、一意のアカウントと、そのアカウントにアクセスするためのパスワードのように機能する対応するフレーズを生成するための関数を作成しました。

次に、Solanaブロックチェーンに接続して、アカウントの残高を取得する必要があります。この時点では、アカウントを作成したばかりなので、残高は0になっているはずです。

### 🤝 接続

ブロックチェーンと対話するための最初のステップは、コネクションをインスタンス化することです。便利なことに、`@solana/web3.js`には`Connection`クラスがあり、まさにそれを行うために設計されています。

ドキュメントを見直すと、 `Connection`のコンストラクタは2つの引数を必要とすることがわかります。

![](/public/images/Solana-Wallet/section-2/2_1_1.png)

`endpoint`の説明では、「fullnode JSON RPCエンドポイントへのURL」であることが言及されています。接続のためのURLを持っていないので、Solanaから見つけるか、URLを返す関数を探す必要があります。web3.jsのドキュメントで「URL」を検索すると、clusterApiUrlという関数があり、「指定したクラスターのRPC API URL」を返してくれることがわかります。さらに、Clusterの種類を見直すと、接続したいネットワークを指していることがわかります。

`commitmentOrConfig`については、Commitment型の定義に「状態を問い合わせる際に希望するコミットメントのレベル」とあるように、現時点では意味のない定義であるように見受けられます。しかし、Commitmentにはいくつかの文字列があるようなので、そのうちの1つを選んで関数をテストしてみましょう。この場合、"confirmed" を妥当な推測として選択し、先に進むことができます。

以上を踏まえると、Connectionインスタンスの作成をこのようにコード化できます。

```javascript
const NETWORK = 'devnet';
const connection = new Connection(clusterApiUrl(NETWORK), "confirmed");

console.log(connection);
// > Connection {_commitment: 'confirmed', _confirmTransactionInitialTimeout: undefined, _rpcEndpoint: 'https://api.devnet.solana.com', _rpcWsEndpoint: 'wss://api.devnet.solana.com/', _rpcClient: ClientBrowser, …}
```

それでは実際に、接続先URLを取得する機能を実装してみましょう。下記を参考に、`pages/index.js`を更新しましょう。

```javascript
// 残高の取得に必要なメソッドのインポートを追加
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
// useEffectのインポートを追加
import { useState, useEffect } from 'react';

// NETWORKの定義を追加
const NETWORK = 'devnet';

export default function Home() {
  // 下記を追加
  const [network, setNetwork] = useState(null);

  useEffect(() => {
    // Connectionインスタンスを生成する際に使用する、接続先のURLを取得します。
    // 現在の実装では、'devnet'のみをサポートしています。
    if (NETWORK === 'devnet') {
      const network = clusterApiUrl(NETWORK);
      setNetwork(network);
    } else {
      console.error(`Invalid network: ${NETWORK}. Use 'devnet'.`);
    }
  }, []);
```

### 🛠 残高を取得する関数を実装しよう

さて、接続ができたので、アカウントの残高を取得する必要があります。口座のパブリックアドレスをパラメータとして受け取り、口座の残高を返す`getBalance`関数があるはずだと推測されるかもしれません。web3.jsのドキュメントで「残高」というキーワードを検索すると、get残高メソッドがあるだけでなく、それはConnectionクラスのメソッドであることがわかります。
Connectionのget残高メソッドを確認すると、パラメータとして口座の公開鍵を想定していることがわかります。

```javascript
const publicKey = account.publicKey;
let balance = await connection.getBalance(publicKey);
balance = balance / LAMPORTS_PER_SOL;

console.log(balance);
// > 0;
```

この関数のこの部分を構成するには、いくつかの方法があります。私たちは、publicKey変数に口座の公開鍵を代入し、それをget残高に渡してネットワークに残高を問い合わせることにしました。
ドキュメントによると、get残高はプロミスを返すので、awaitを使い、その戻り値を残高変数に代入しています。

ここで１つ注意点があります。仮に残高が`1SOL`の場合、 `getBalance`関数の戻り値は`1`になるように思いますが、実際には`1,000,000,000`（10億）が返ってきます。

SOLはSolanaのネイティブトークンの名前ですが、マイクロペイメントを実行するために`lamports`という端数のネイティブトークンがあります。

`1 lamport = 0.000000001 SOL`です。

残高がlamportで返ってくるため、それをSOLに変換したいと思います。
`@solana/web3.js`から`LAMPORTS_PER_SOL`定数を読み込み、 `balance / LAMPORTS_PER_SOL`とすればSOLになります。

Connectionインスタンスの作成と、残高の取得の処理をまとめて`refreshBalance`関数を定義します。取得した残高は`useState`で値を保持しておきます。下記を参考に、`pages/index.js`を更新しましょう。

```javascript
const [balance, setBalance] = useState(null);

useEffect(() => {
  // ...
}, []);

const refreshBalance = async () => {
  try {
    // Connectionインスタンスを生成します。
    const connection = new Connection(network, 'confirmed');
    const publicKey = account.publicKey;

    let balance = await connection.getBalance(publicKey);
    // 残高がlamportで返ってくるため、SOLに変換します。
    // 100,000,000lamport = 1SOL
    balance = balance / LAMPORTS_PER_SOL;

    setBalance(balance);
  } catch (error) {
    console.error(error);
  }
};
```

### 🧱 コンポーネントを作成する

残高を取得する`refreshBalance`関数を作成したので、それを実行するボタンを実装していきましょう。ここからは、`components/GetBalance/index.js`を更新していきます。

先ほど作成した`refreshBalance`関数を引数として受け取り、[残高を取得]ボタンがクリックされた時に実行するようにします。

```javascript
export default function GetBalance({ refreshBalance }) {
  return (
    <button
      className="p-2 my-6 text-white bg-indigo-500 focus:ring focus:ring-indigo-300 rounded-lg cursor-pointer"
      onClick={refreshBalance}
    >
      残高を取得
    </button>
  );
}
```

実装はシンプルですが、ここでもテストスクリプトを実行して模擬的に動作確認をしてみましょう。

ターミナル上で`npm run test`を実行します。

components/GetBalance/index.test.jsが`PASS`し、`Test Suites`が下記のようになっていたらOKです！

```
Test Suites: 2 failed, 3 passed, 5 total
```

### 👀 フロントで残高を表示する

それでは、`GetBalance`コンポーネントを`Home`コンポーネントに組み込み、残高の表示を実装していきましょう。再度、`pages/index.js`を更新していきます。

まずは、`GetBalance`コンポーネントをインポートしましょう。

```javascript
import GetBalance from '../components/GetBalance';
```

`GetBalance`コンポーネントを呼び出すコードを追加して、ボタンをレンダリングします。

```javascript
<div>
  <h2 className="p-2 border-dotted border-l-4 border-l-indigo-400">
    STEP3: 残高を取得する
  </h2>
  {/* 下記を追加 */}
  {account && <GetBalance refreshBalance={refreshBalance} />}
</div>
```

最後に、残高を表示するコードを追加しましょう。

```javascript
<div>
  <h3 className="p-2 border-dotted border-l-8 border-l-indigo-600">My Wallet</h3>
  {account && (
    <>
      <div className="my-6 text-indigo-600 font-bold">
        <span>アドレス: </span>
        {account.publicKey.toString()}
      </div>
      {/* 下記を追加 */}
      <div className="my-6 font-bold">ネットワーク: {NETWORK}</div>
      {typeof balance === "number" && (
        <div className="my-6 font-bold">💰 残高: {balance} SOL</div>
      )}
    </>
  )}
</div>
```

### ✅ 動作確認

おめでとうございます!これで残高の取得と表示の実装ができました!

実際に`残高を取得`ボタンを押下して動作確認してみましょう。

ただし残念なことに、作成したばかりのアカウントでは当然残高が0であることがわかります。残高が変わるのを確認するには、アカウントに`SOL`  を付与する必要があるので、次のセクションでエアドロップ機能を実装します。

「でも、早く残高増やしたい!エアドロップの実装は待てない!」

そんなあなたに朗報です!!

[Sol Faucet](https://solfaucet.com/)というサイトを使えば、あなたのアカウントに`SOL`を付与することができます。

![](/public/images/Solana-Wallet/section-2/2_1_2.png)

フォームにウォレットアドレスを入力し、 `DEVNET`ボタンを押下してみましょう。少し待てば`1 SOL`が付与されるので、再度`残高を取得`ボタンを押して、SOLが増えているか確認してみてください!

### 📝 このセクションで追加したコード

- `components/GetBalance/index.js`

```javascript
export default function GetBalance({ refreshBalance }) {
  return (
    <button
      className="p-2 my-6 text-white bg-indigo-500 focus:ring focus:ring-indigo-300 rounded-lg cursor-pointer"
      onClick={refreshBalance}
    >
      残高を取得
    </button>
  );
}
```

- `pages/index.js`

```diff
+import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
+import { useEffect, useState } from 'react'; // useEffectの追加

import GenerateWallet from '../components/GenerateWallet/';
+import GetBalance from '../components/GetBalance';
import HeadComponent from '../components/Head';
import ImportWallet from '../components/ImportWallet';

export default function Home() {
  const [account, setAccount] = useState(null);
+  const [balance, setBalance] = useState(null);
+  const [network, setNetwork] = useState(null);

+  useEffect(() => {
+    // Connectionインスタンスを生成する際に使用する、接続先のURLを取得します。
+    // 現在の実装では、'devnet'のみをサポートしています。
+    if (NETWORK === 'devnet') {
+      const network = clusterApiUrl(NETWORK);
+      setNetwork(network);
+    } else {
+      console.error(`Invalid network: ${NETWORK}. Use 'devnet'.`);
+    }
+  }, []);
+
+  const refreshBalance = async () => {
+    try {
+      // Connectionインスタンスを生成します。
+      const connection = new Connection(network, 'confirmed');
+      const publicKey = account.publicKey;
+
+      let balance = await connection.getBalance(publicKey);
+      // 残高がlamportで返ってくるため、SOLに変換します。
+      // 100,000,000lamport = 1SOL
+      balance = balance / LAMPORTS_PER_SOL;
+
+      setBalance(balance);
+    } catch (error) {
+      console.error(error);
+    }
+  };

  return (
    <div>
      <HeadComponent />
      <div className="p-10">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
          <span className="text-[#9945FF]">Solana</span>ウォレットを作ろう！
        </h1>
        <div className="mx-auto mt-5 text-gray-500">
          Solanaウォレットの新規作成、インポート、エアドロップ、送金機能の開発にチャレンジしてみよう
        </div>

        <hr className="my-6" />

        <div>
          <h3 className="p-2 border-dotted border-l-8 border-l-indigo-600">
            My Wallet
          </h3>
          {account && (
            <>
              <div className="my-6 text-indigo-600 font-bold">
                <span>アドレス: </span>
                {account.publicKey.toString()}
              </div>
+              <div className="my-6 font-bold">ネットワーク: {network}</div>
+              {typeof balance === 'number' && (
+                <div className="my-6 font-bold">💰 残高: {balance} SOL</div>
+              )}
            </>
          )}
        </div>

        <hr className="my-6" />
        <div>
          <h2 className="p-2 border-dotted border-l-4 border-l-indigo-400">
            STEP1: ウォレットを新規作成する
          </h2>
          <GenerateWallet setAccount={setAccount} />
        </div>
        <hr className="my-6" />
        <div>
          <h2 className="p-2 border-dotted border-l-4 border-l-indigo-400">
            STEP2: 既存のウォレットをインポートする
          </h2>
          <ImportWallet setAccount={setAccount} />
        </div>
        <hr className="my-6" />
        <div>
          <h2 className="p-2 border-dotted border-l-4 border-l-indigo-400">
            STEP3: 残高を取得する
          </h2>
+          {account && <GetBalance refreshBalance={refreshBalance} />}
        </div>
        <hr className="my-6" />
        <div>
          <h2 className="p-2 border-dotted border-l-4 border-l-indigo-400">
            STEP4: エアドロップ機能を実装する
          </h2>
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

### ☕️ 豆知識

`lamport`と呼ばれるマイクロペイメントのトークンは、Solana最大の技術的影響力を持つLeslie Lamportにちなんで名付けられたそうですよ!🥭

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

おつかれさまでした! これでSection 2は終了です!

`残高を取得`ボタンを押して出力される結果をぜひDiscordの`#solana`にシェアしてください!😊

次のセクションではエアドロップや送金機能を実装していきます✨

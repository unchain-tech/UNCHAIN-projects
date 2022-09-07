### 💸 アカウントの残高について

暗号化ウォレットの主な役割は、秘密鍵を保管することです。秘密鍵を保管することで、デジタル資産の管理（送金、受領、整理）を可能にします。この機能の一部として、ウォレットはオンチェーンに保存されている特定のデータを取得し、ユーザーダッシュボードに表示する必要があります。

残高とは、あるアカウントで保有している暗号通貨やトークンの一定量を表します。ブロックチェーンを所有者記録を保持するデータベースと考え、公開鍵を所有者IDと考えるなら、残高は各所有者が特定のトークンをどれだけ保持しているかを追跡するデータベースの整数カラムと考えることができます。

本セクションで、Solanaのネットワークの1つに接続し、作成したアカウントの残高を取得してみましょう。

また、次のセクションではエアドロップ機能を実装し、テストトークンをアカウントに付与できるようにします。

### 🌍 Networks

1つのプロトコルに様々なネットワークがあるという概念は、アプリに様々な環境（開発、テスト、本番など）があるという概念と似ています。

一般的にブロックチェーン・プロトコルは、実際の経済価値と公式トランザクションを持つ本番用ブロックチェーンを指すメインネットワークまたはメインネットと、メインネットで稼働する前に機能をテストするための同一のブロックチェーンを指す少なくとも一つの実験用ネットワークがあります。

Solana は、`Mainnet` と呼ばれる本番用ネットワークと、`Testnet` および `Devnet` と呼ばれる2つの実験用ネットワークを持っています。

Solana の `Devnet` は、開発者やユーザーが実際の経済的影響を伴うメインネット上で起動する前に、様々な機能で遊んだり、dApps をデバッグしたりするために設計されています。 `Testnet` は、Solana が潜在的なプロトコルのアップデートをテストする場所です。

今回構築するアプリのデフォルトのネットワークは `Devnet` で変更はできないようになっていますが、各機能はどのネットワークでも機能します。

### 👋 導入

前セクションまでで、"ウォレット=アカウントアドレスとそれにアクセスするためのキーを表すキーペアを保持するキーチェーンに近いものであること" を説明しました。私たちは、一意のアカウントと、そのアカウントにアクセスするためのパスワードのように機能する対応するフレーズを生成するための関数を作成しました。

次に、Solana ブロックチェーンに接続して、アカウントの残高を取得する必要があります。この時点では、アカウントを作成したばかりなので、残高は0になっているはずです。

### 🤝 接続

ブロックチェーンと対話するための最初のステップは、コネクションをインスタンス化することです。便利なことに、`@solana/web3.js` には `Connection` クラスがあり、まさにそれを行うために設計されています。

ドキュメントを見直すと、 `Connection` のコンストラクタは2つの引数を必要とすることがわかります。

![](/public/images/304-Solana-Wallet/2_1_1.png)

`endpoint` の説明では、「fullnode JSON RPC エンドポイントへの URL」であることが言及されています。接続のためのURLを持っていないので、Solanaから見つけるか、URLを返す関数を探す必要があります。web3.jsのドキュメントで「URL」を検索すると、clusterApiUrlという関数があり、「指定したクラスターのRPC API URL」を返してくれることがわかります。さらに、Clusterの種類を見直すと、接続したいネットワークを指していることがわかります。

`commitmentOrConfig` については、Commitment型の定義に「状態を問い合わせる際に希望するコミットメントのレベル」とあるように、現時点では意味のない定義であるように見受けられる。しかし、Commitmentにはいくつかの文字列があるようなので、そのうちの一つを選んで関数をテストしてみよう。この場合、"confirmed" を妥当な推測として選択し、先に進むことができます。

以上を踏まえると、Connectionインスタンスの作成をこのようにコード化できます。

```javascript
const NETWORK = 'devnet';
const connection = new Connection(clusterApiUrl(NETWORK), "confirmed");

console.log(connection);
// > Connection {_commitment: 'confirmed', _confirmTransactionInitialTimeout: undefined, _rpcEndpoint: 'https://api.devnet.solana.com', _rpcWsEndpoint: 'wss://api.devnet.solana.com/', _rpcClient: ClientBrowser, …}
```

### 🛠 残高を取得する関数を実装しよう

さて、接続ができたので、アカウントの残高を取得する必要があります。口座のパブリックアドレスをパラメータとして受け取り、口座の残高を返す `getBalance` 関数があるはずだと推測されるかもしれません。web3.jsのドキュメントで「balance」というキーワードを検索すると、getBalanceメソッドがあるだけでなく、それはConnectionクラスのメソッドであることがわかります。
ConnectionのgetBalanceメソッドを確認すると、パラメータとして口座の公開鍵を想定していることがわかります。

```javascript
const publicKey = account.publicKey;
let balance = await connection.getBalance(publicKey);
balance = balance / LAMPORTS_PER_SOL;

console.log(balance);
// > 0;
```

この関数のこの部分を構成するには、いくつかの方法があります。私たちは、publicKey変数に口座の公開鍵を代入し、それをgetBalanceに渡してネットワークに残高を問い合わせることにしました。
ドキュメントによると、getBalanceはプロミスを返すので、awaitを使い、その戻り値をbalance変数に代入しています。

ここで１つ注意点があります。仮に残高が `1SOL` の場合、 `getBalance` 関数の戻り値は `1` になるように思いますが、実際には `100,000,000`(10億) が返ってきます。

SOL は Solana のネイティブトークンの名前ですが、マイクロペイメントを実行するために `lamports` という端数のネイティブトークンがあります。

`1 lamport = 0.000000001 SOL` です。

balance が lamport で返ってくるため、それを SOL に変換したいと思います。
`@solana/web3.js` から `LAMPORTS_PER_SOL` 定数を読み込み、 `balance / LAMPORTS_PER_SOL` とすれば SOL になります。

Connectionインスタンスの作成と、残高の取得の処理をまとめて `refreshBalance` 関数を定義します。取得した残高は `useState` で値を保持しておきます。

```javascript
const refreshBalance = async () => {
  try {
    const NETWORK = 'devnet';
    const connection = new Connection(clusterApiUrl(NETWORK), "confirmed");
    const publicKey = account.publicKey;

    let balance = await connection.getBalance(publicKey);
    balance = balance / LAMPORTS_PER_SOL;
    console.log('balance', balance);
    setBalance(balance);
  } catch (error) {
    console.log('error', error);
  }
};
```

### 👀 フロントで残高を表示する

残高を取得する `refreshBalance` 関数を作成したので、それを実行するボタンと、残高の表示を実装していきましょう。

- `refreshBalance` 関数を実行するボタンのレンダリング

```javascript
<div>
  <h2 className="p-2 border-dotted border-l-4 border-l-indigo-400">STEP3: 残高を取得する</h2>
  {account &&
    <button
      className="p-2 my-6 text-white bg-indigo-500 focus:ring focus:ring-indigo-300 rounded-lg cursor-pointer"
      onClick={refreshBalance}
    >
      残高を取得
    </button>
  }
</div>
```

- 残高の表示

```javascript
<div>
  <h3 className="p-2 border-dotted border-l-8 border-l-indigo-600">My Wallet</h3>
  {account && (
    <>
      <div className="my-6 text-indigo-600 font-bold">アドレス: {account.publicKey.toString()}</div>
      <div className="my-6 font-bold">ネットワーク: {NETWORK}</div>
      {typeof balance === "number" && <div className="my-6 font-bold">💰 残高: {balance} SOL</div>}
    </>
  )}
</div>
```

### ✅ 動作確認

おめでとうございます!これで残高の取得と表示の実装ができました!

実際に`残高を取得`ボタンを押下して動作確認してみましょう。

ただし残念なことに、作成したばかりのアカウントでは当然残高が0であることがわかります。残高が変わるのを確認するには、アカウントに `SOL`  を付与する必要があるので、次のセクションでエアドロップ機能を実装します。

「でも、早く残高増やしたい!エアドロップの実装は待てない!」

そんなあなたに朗報です!!

[Sol Faucet](https://solfaucet.com/)というサイトを使えば、あなたのアカウントに `SOL` を付与することができます。

![](/public/images/304-Solana-Wallet/2_1_2.png)

フォームにウォレットアドレスを入力し、 `DEVNET` ボタンを押下してみましょう。少し待てば `1 SOL` が付与されるので、再度 `残高を取得` ボタンを押して、SOLが増えているか確認してみてください!

### 📝 このセクションで追加したコード

```diff
 import { useState } from "react";
-import { Keypair } from "@solana/web3.js";
+import { Keypair, Connection, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
 import * as Bip39 from "bip39";

+const NETWORK = 'devnet';
+
 export default function Home() {
   const [mnemonic, setMnemonic] = useState(null);
   const [account, setAccount] = useState(null);
+  const [balance, setBalance] = useState(null);

   const generateWallet = () => {
     const generatedMnemonic = Bip39.generateMnemonic();
@@ -31,6 +34,20 @@ export default function Home() {
     setAccount(importedAccount);
   };

+  const refreshBalance = async () => {
+    try {
+      const connection = new Connection(clusterApiUrl(NETWORK), "confirmed");
+      const publicKey = account.publicKey;
+
+      let balance = await connection.getBalance(publicKey);
+      balance = balance / LAMPORTS_PER_SOL;
+      console.log('balance', balance);
+      setBalance(balance);
+    } catch (error) {
+      console.log('error', error);
+    }
+  };
+
   return (
     <div className="p-10">
       <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
@@ -44,7 +61,13 @@ export default function Home() {

       <div>
         <h3 className="p-2 border-dotted border-l-8 border-l-indigo-600">My Wallet</h3>
-        {account && <div className="my-6 text-indigo-600 font-bold">アドレス: {account.publicKey.toString()}</div>}
+        {account && (
+          <>
+            <div className="my-6 text-indigo-600 font-bold">アドレス: {account.publicKey.toString()}</div>
+            <div className="my-6 font-bold">ネットワーク: {NETWORK}</div>
+            {typeof balance === "number" && <div className="my-6 font-bold">💰 残高: {balance} SOL</div>}
+          </>
+        )}
       </div>

       <hr className="my-6" />
@@ -92,6 +115,14 @@ export default function Home() {

       <div>
         <h2 className="p-2 border-dotted border-l-4 border-l-indigo-400">STEP3: 残高を取得する</h2>
+        {account &&
+          <button
+            className="p-2 my-6 text-white bg-indigo-500 focus:ring focus:ring-indigo-300 rounded-lg cursor-pointer"
+            onClick={refreshBalance}
+          >
+            残高を取得
+          </button>
+        }
       </div>

       <hr className="my-6" />
```

### ☕️ 豆知識

`lamport` と呼ばれるマイクロペイメントのトークンは、Solana 最大の技術的影響力を持つ Leslie Lamport にちなんで名付けられたそうですよ!🥭

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#solana-wallet` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 3 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

おつかれさまでした! これで Section 2 は終了です!

`残高を取得` ボタンを押して出力される結果を ぜひ Discord の `#solana-wallet` にシェアしてください!😊

次のセクションではエアドロップや送金機能を実装していきます✨

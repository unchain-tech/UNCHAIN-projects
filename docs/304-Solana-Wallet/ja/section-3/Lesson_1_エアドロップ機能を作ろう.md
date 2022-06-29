### ⭐️ エアドロップの基礎

前のセクションでアカウントの残高が0であることを確認しましたが、アカウントに資金を供給して、残高の変化を見ることができたらいいと思いませんか？

アカウントをテストするために実際のお金を送金する必要があるのかと思うかもしれませんが、前回説明したように、ブロックチェーンの `Devnet` は通常、実際の経済価値を危険にさらすことなく取引をテストする方法を提供します。

このセクションでは、ユーザーが `SOL` トークンを `Devnet` アカウントに「エアドロップ」できるようにする機能を構築します。暗号の世界では、エアドロップとは、プロトコルがアカウント所有者に無料でトークンを配布する方法のことを言います。

この場合、私たちはSolanaに組み込まれたネイティブな `Devnet` エアドロップ機能を利用して、アカウントに資金を供給することになります。これは、ブロックチェーン・プロトコルや暗号プロジェクトが行うメインネット・エアドロップとは対照的で、通常、アーリーアダプターや貢献者に報いるために発行されるものです。

このセクションを完了すると、`Airdrop` ボタンを押下したときに、自動的に残高が増えるようになります。次のセクションでは資金の送金機能をつくるため、ここで自分のアカウントの資金を増やしておきましょう。

### 🛫 導入

前のセクションで、Solanaのネットワークの1つへの接続をインスタンス化する方法と、アカウントの公開鍵プロパティを変数に代入する方法を学びました。同じコードをここで適用して、 `handleAirdrop` 関数をつくっていきましょう。

```javascript
const connection = new Connection(clusterApiUrl(NETWORK), "confirmed");

console.log(connection);
// > Connection {_commitment: 'confirmed', _confirmTransactionInitialTimeout: undefined, _rpcEndpoint: 'https://api.devnet.solana.com', _rpcWsEndpoint: 'wss://api.devnet.solana.com/', _rpcClient: ClientBrowser, …}
```

キーワードでドキュメントを検索するという以前のヒューリスティックな方法に従って、今度は「airdrop」を検索して、活用できるメソッドがあるかどうかを確認することができます。

驚いたことに、`Connection` クラスには `requestAirdrop` メソッドがあり、これは期待できそうです。これは2つのプロパティを受け取ります。 `to: PublicKey` と `lamports: number` です。

![](/public/images/304-Solana-Wallet/3_1_1.png)

```javascript
const confirmation = await connection.requestAirdrop(account.publicKey, LAMPORTS_PER_SOL);
```

上記のように `requestAirdrop` メソッドを呼び出すと、`1 SOL` をエアドロップすることができます。 `LAMPORTS_PER_SOL = 1SOL` になるからです。

### Confirming airdrop

最後に、アカウントの残高を自動的に更新する前に、refreshBalanceを呼び出す前に、ブロックチェーンの台帳がエアドロップされた資金で更新されていることを確認する方法が必要です。

データベース型の操作と同様に、ブロックチェーンの状態変更は非同期です。実際、ほとんどのブロックチェーン・プロトコルが分散型であることを考えると、一部の更新には時間がかかることがあります。

このことを念頭に置いて、残高を更新する前にエアドロップが確認されるのを待つ必要があります。もう一度ドキュメントを検索すると、`Connection` クラスに `confirmTransaction` メソッドがあり、確認署名とコミットメントを受け取り、トランザクションがネットワークによって確認されると解決するプロミスを返していることがわかります。

![](/public/images/304-Solana-Wallet/3_1_2.png)

ドキュメント通りに `confirmTransaction` メソッドを呼び出しましょう。

```javascript
await connection.confirmTransaction(confirmation, "confirmed");
```

ここで確認に変数を代入する必要がないことに注意してください。ウォレットは、ネットワークによってトランザクションが確認されたことを知ると、refreshBalanceを呼び出してアカウントの残高を更新することができます。

```javascript
await refreshBalance();
```

最後に、 `Airdrop` ボタンをレンダリングしましょう!

```javascript
<div>
  <h2 className="p-2 border-dotted border-l-4 border-l-indigo-400">STEP4: エアドロップ機能を実装する</h2>
  {account && (
    <button
      className="p-2 my-6 text-white bg-indigo-500 focus:ring focus:ring-indigo-300 rounded-lg cursor-pointer"
      onClick={handleAirdrop}
    >
      Airdrop
    </button>
  )}
</div>
```

### ✅ 動作確認

おめでとうございます!これでエアドロップの機能が完成しました。

実際に `Airdrop` ボタンを押下して、残高が増えていれば成功です!

### 📝 このセクションで追加したコード

```diff
+  const handleAirdrop = async () => {
+    try {
+      const connection = new Connection(clusterApiUrl(NETWORK), "confirmed");
+      const publicKey = account.publicKey;
+
+      const confirmation = await connection.requestAirdrop(account.publicKey, LAMPORTS_PER_SOL);
+      await connection.confirmTransaction(confirmation, "confirmed");
+      await refreshBalance();
+    } catch (error) {
+      console.log('error', error);
+    }
+  };
+
   return (
     <div className="p-10">
       <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
@@ -129,6 +142,14 @@ export default function Home() {

       <div>
         <h2 className="p-2 border-dotted border-l-4 border-l-indigo-400">STEP4: エアドロップ機能を実装する</h2>
+        {account && (
+          <button
+            className="p-2 my-6 text-white bg-indigo-500 focus:ring focus:ring-indigo-300 rounded-lg cursor-pointer"
+            onClick={handleAirdrop}
+          >
+            Airdrop
+          </button>
+        )}
       </div>

       <hr className="my-6" />
```
### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#section-3` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 3 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```
---

おめでとうございます✨エアドロップ機能が完成しました!
次のレッスンに進んで、送金機能を実装していきましょう😊

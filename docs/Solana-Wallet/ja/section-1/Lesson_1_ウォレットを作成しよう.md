### 👛 HDウォレットについて

このセクションでは、HD ウォレットと呼ばれる種類のウォレットを構築します。HD とは階層的決定性(Hierarchy Deterministic)の略です。

これは簡単に言うと、1 つのシードからマスタキーとなる秘密鍵を生成し、そこから木構造のような階層的に複数の派生秘密鍵と派生公開鍵及びアドレスを生成します。

最初の秘密鍵は、シードと呼ばれるランダムな文字列から作ります。その後は作った秘密鍵をシードとして新たな秘密鍵を階層的に作ることができます。

シードは覚えにくい文字列ですので、シードから「シードフレーズ」や「リカバリーフレーズ」などと呼ばれる、12 個から 24 個の単語に変換して記録しておく方法が使われています。

<!--
参考
https://zelos.co.jp/crypto-asset-wallet-02-hd-wallet
https://coinpedia.cc/hd-wallet
-->

### ⏬ BIP39ライブラリを追加する

フレーズを生成するには、決定論的なキーのフレーズ生成の標準を設定した `BIP39仕様` を満たす外部ライブラリを活用する必要があります。

JavaScript には [`BIP39`](https://github.com/bitcoinjs/bip39) と呼ばれるライブラリがあるのでこれを利用していきましょう。

`BIP39` ライブラリは、フレーズを生成し、それを Solana ウォレットキーの生成に必要なシードに変換するために必要な機能を提供してくれます。

- `BIP39` ライブラリを `npm install` する

```bash
npm install bip39
```

- import する

ライブラリのインストールが完了したら、 ファイルの先頭でライブラリを読み込みましょう。

```javascript
import * as Bip39 from "bip39";
```

### 🏭 ニーモニックフレーズを生成する

`BIP39` にはニーモニックフレーズを生成するためのメソッド `generateMnemonic` があります。これを呼び出し、変数に格納してみましょう。

```javascript
const generatedMnemonic = Bip39.generateMnemonic();
```

これにより、ユーザーがメモして安全に保管できるように、ニーモニックフレーズを設定し、表示することができます。フレーズそれ自体で、その所持者はそのフレーズに一致するアカウントにアクセスすることが可能になります。

### 🔐 キーペアとシード

ブロックチェーン上のアカウントに接続する前に、このニーモニックフレーズをブロックチェーンが理解できる形に変換する必要があります。ニーモニックフレーズは、長くて古風な数字を、より人間に近い形に変換する抽象的なものなのです。

`@solana/web3.js` ライブラリがキーペアオブジェクトを生成するためにこのフレーズを使用できるように、フレーズをバイトに変換する必要があります。キーペアは、データを暗号化できる公開キーとデータを復号化できる秘密キーからなるウォレットアカウントとなります。

[`@solana/web3.js`](https://solana-labs.github.io/solana-web3.js/classes/Keypair.html) ドキュメントを確認すると、`Keypair` クラスが "An account keypair used for signing transactions." として定義されていることがわかります。これはまさに、ニーモニックフレーズを使用して生成する必要があるものです。

またドキュメントを読むと、 `Keypair` クラスには、32 バイトのシードから `Keypair` を生成する `fromSeed` メソッドがあることがわかります。そして、シードは `Uint8Array` である必要があります。つまり、ニーモニックフレーズを `Uint8Array` に変換する方法が必要だということです。

`BIP39` ライブラリに戻ると、`mnemonicToSeedSync(mnemonic)` というメソッドがあり、16 進数のリストのような `Buffer` オブジェクトが返されます。このメソッドを実行し、生成したニーモニックを渡すことで、テストすることができます。

```javascript
const seed = Bip39.mnemonicToSeedSync(generatedMnemonic);

console.log(seed);
// > Uint8Array(64)
```

ゴールまでもう少しです!🥭

`Keypair` クラスは 32 バイトの `Uint8Array` を必要としますが、現在は 64 バイトの `Uint8Array` を取得しています。シードを slice して、最初の 32 バイトだけを保持するようにしましょう。

```javascript
const seed = Bip39.mnemonicToSeedSync(generatedMnemonic).slice(0, 32);

console.log(seed);
// > Uint8Array(32)
```

正しい形式のシードがあれば、`Keypair` の `fromSeed` メソッドを使って、アカウントのキーペアを生成することができます。

```javascript
// ファイルの先頭で Keypair クラスを読み込んでおく
import { Keypair } from "@solana/web3.js";

const newAccount = Keypair.fromSeed(seed);

console.log('newAccount', newAccount.publicKey.toString());
// > ランダムな文字列
```

### 👛 ウォレット生成関数を定義する

これまでの説明を踏まえて、ウォレットを生成するための関数 `generateWallet` を定義します。

```javascript
const generateWallet = () => {
  const generatedMnemonic = Bip39.generateMnemonic();
  setMnemonic(generatedMnemonic);
  console.log('generatedMnemonic', generatedMnemonic);

  const seed = Bip39.mnemonicToSeedSync(generatedMnemonic).slice(0, 32);
  console.log('seed', seed);

  const newAccount = Keypair.fromSeed(seed);
  console.log('newAccount', newAccount.publicKey.toString());

  setAccount(newAccount);
};
```

`generateWallet` 関数では、ニーモニックフレーズとアカウントの生成を行ってます。

また、生成したニーモニックフレーズとアカウントは、`useState` を用いて値を保持します。

`export default function Home() {` の直下に、それぞれのデータを保時する状態変数を定義しましょう。

```javascript
export default function Home() {
  // 下記を追加
  const [mnemonic, setMnemonic] = useState(null);
  const [account, setAccount] = useState(null);
```

### 🎨 ウォレット生成ボタンをレンダリングする

さきほど定義した `generateWallet` 関数を呼び出すためのボタンを用意しましょう。

```javascript
<h2 className="p-2 border-dotted border-l-4 border-l-indigo-400">STEP1: ウォレットを新規作成する</h2>

// 下記を追加
<button
  className="p-2 my-6 text-white bg-indigo-500 focus:ring focus:ring-indigo-300 rounded-lg cursor-pointer"
  onClick={generateWallet}
>
  ウォレットを生成
</button>
{mnemonic && (
  <>
    <div className="mt-1 p-4 border border-gray-300 bg-gray-200">{mnemonic}</div>
    <strong className="text-xs">
      このフレーズは秘密にして、安全に保管してください。このフレーズが漏洩すると、誰でもあなたの資産にアクセスできてしまいます。<br />
      オンライン銀行口座のパスワードのようなものだと考えてください。
    </strong>
  </>
)}
```

### 🖥 生成したウォレットアドレスを表示する

`My Wallet` の下に、生成したウォレットのアドレスを表示するコードを追加しましょう。

```javascript
<h3 className="p-2 border-dotted border-l-8 border-l-indigo-600">My Wallet</h3>

// 下記を追加
{account && <div className="my-6 text-indigo-600 font-bold">アドレス: {account.publicKey.toString()}</div>}
```

### ✅ 動作確認

おめでとうございます!これでウォレットの作成機能が完成しました。

実際に `ウォレットを生成` ボタンを押下してみて、

- ニーモニックフレーズが表示されること
- `My Wallet` の下に作成したウォレットのアドレスが表示されること

の２点を確認しましょう!

### 📝 このセクションで追加したコード

```diff
+import { useState } from "react";
+import { Keypair } from "@solana/web3.js";
+import * as Bip39 from "bip39";
+
 export default function Home() {
+  const [mnemonic, setMnemonic] = useState(null);
+  const [account, setAccount] = useState(null);
+
+  const generateWallet = () => {
+    const generatedMnemonic = Bip39.generateMnemonic();
+    setMnemonic(generatedMnemonic);
+    console.log('generatedMnemonic', generatedMnemonic);
+
+    const seed = Bip39.mnemonicToSeedSync(generatedMnemonic).slice(0, 32);
+    console.log('seed', seed);
+
+    const newAccount = Keypair.fromSeed(seed);
+    console.log('newAccount', newAccount.publicKey.toString());
+
+    setAccount(newAccount);
+  };
+
   return (
     <div className="p-10">
       <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
@@ -12,12 +33,28 @@ export default function Home() {

       <div>
         <h3 className="p-2 border-dotted border-l-8 border-l-indigo-600">My Wallet</h3>
+        {account && <div className="my-6 text-indigo-600 font-bold">アドレス: {account.publicKey.toString()}</div>}
       </div>

       <hr className="my-6" />

       <div>
         <h2 className="p-2 border-dotted border-l-4 border-l-indigo-400">STEP1: ウォレットを新規作成する</h2>
+        <button
+          className="p-2 my-6 text-white bg-indigo-500 focus:ring focus:ring-indigo-300 rounded-lg cursor-pointer"
+          onClick={generateWallet}
+        >
+          ウォレットを生成
+        </button>
+        {mnemonic && (
+          <>
+            <div className="mt-1 p-4 border border-gray-300 bg-gray-200">{mnemonic}</div>
+            <strong className="text-xs">
+              このフレーズは秘密にして、安全に保管してください。このフレーズが漏洩すると、誰でもあなたの資産にアクセスできてしまいます

+              オンライン銀行口座のパスワードのようなものだと考えてください。
+            </strong>
+          </>
+        )}
       </div>

       <hr className="my-6" />
```

### ☕️ 豆知識

ニーモニック（Mnemonic）は、日本語で `記憶を助ける短い語句` ということを意味するそうですよ🥭

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

ウォレットが完成しました!次のレッスンに進んで、アプリにウォレットを連携させていきましょう✨

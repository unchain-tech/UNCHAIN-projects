### 👛 HDウォレットについて

このセクションでは、HDウォレットと呼ばれる種類のウォレットを構築します。HDとは階層的決定性（Hierarchy Deterministic）の略です。

これは簡単に言うと、1つのシードからマスタキーとなる秘密鍵を生成し、そこから木構造のような階層的に複数の派生秘密鍵と派生公開鍵及びアドレスを生成します。

最初の秘密鍵は、シードと呼ばれるランダムな文字列から作ります。その後は作った秘密鍵をシードとして新たな秘密鍵を階層的に作ることができます。

シードは覚えにくい文字列ですので、シードから「シードフレーズ」や「リカバリーフレーズ」などと呼ばれる、12個から24個の単語に変換して記録しておく方法が使われています。

参考: [暗号資産におけるウォレットとは② 〜HDウォレット編〜
](https://zelos.co.jp/crypto-asset-wallet-02-hd-wallet)

### 🧱 コンポーネントを作成する

まずは、コードを記述するファイルを作成しましょう。`components`ディレクトリの中に、`GenerateWallet/index.js`ファイルを作成します。

```diff
 components/
+├── GenerateWallet/
+│   └── index.js
 └── Head.js
```

作成した`index.js`に、以下のコードを記述します。

```javascript
import { useState } from 'react';

export default function GenerateWallet({ setAccount }) {
  return ();
}
```

### ⏬ BIP39ライブラリを追加する

フレーズを生成するには、決定論的なキーのフレーズ生成の標準を設定した`BIP39仕様`を満たす外部ライブラリを活用する必要があります。

JavaScriptには [`BIP39`](https://github.com/bitcoinjs/bip39) と呼ばれるライブラリがあるのでこれを利用していきましょう。

`BIP39`ライブラリは、フレーズを生成し、それをSolanaウォレットキーの生成に必要なシードに変換するために必要な機能を提供してくれます。

- `BIP39`ライブラリを`npm install`する

```bash
npm install bip39
```

- importする

ライブラリのインストールが完了したら、 ファイルの先頭でライブラリを読み込みましょう。

```javascript
import * as bip39 from "bip39";
```

### 🏭 ニーモニックフレーズを生成する

`BIP39`にはニーモニックフレーズを生成するためのメソッド`generateMnemonic`があります。これを呼び出し、変数に格納してみましょう。

```javascript
const generatedMnemonic = bip39.generateMnemonic();
```

これにより、ユーザーがメモして安全に保管できるように、ニーモニックフレーズを設定し、表示することができます。フレーズそれ自体で、その所持者はそのフレーズに一致するアカウントにアクセスすることが可能になります。

### 🔐 キーペアとシード

ブロックチェーン上のアカウントに接続する前に、このニーモニックフレーズをブロックチェーンが理解できる形に変換する必要があります。ニーモニックフレーズは、長くて古風な数字を、より人間に近い形に変換する抽象的なものなのです。

`@solana/web3.js`ライブラリがキーペアオブジェクトを生成するためにこのフレーズを使用できるように、フレーズをバイトに変換する必要があります。キーペアは、データを暗号化できる公開キーとデータを復号化できる秘密キーからなるウォレットアカウントとなります。

[`@solana/web3.js`](https://solana-labs.github.io/solana-web3.js/classes/Keypair.html) ドキュメントを確認すると、`Keypair`クラスが "An account keypair used for signing transactions." として定義されていることがわかります。これはまさに、ニーモニックフレーズを使用して生成する必要があるものです。

またドキュメントを読むと、 `Keypair`クラスには、32バイトのシードから`Keypair`を生成する`fromSeed`メソッドがあることがわかります。そして、シードは`Uint8Array`である必要があります。つまり、ニーモニックフレーズを`Uint8Array`に変換する方法が必要だということです。

`BIP39`ライブラリに戻ると、`mnemonicToSeedSync(mnemonic)`というメソッドがあり、16進数のリストのような`Buffer`オブジェクトが返されます。このメソッドを実行し、生成したニーモニックを渡すことで、テストすることができます。

```javascript
const seed = bip39.mnemonicToSeedSync(generatedMnemonic);

console.log(seed);
// > Uint8Array(64)
```

ゴールまでもう少しです!🥭

`Keypair`クラスは32バイトの`Uint8Array`を必要としますが、現在は64バイトの`Uint8Array`を取得しています。シードをsliceして、最初の32バイトだけを保持するようにしましょう。

```javascript
const seed = bip39.mnemonicToSeedSync(generatedMnemonic).slice(0, 32);

console.log(seed);
// > Uint8Array(32)
```

正しい形式のシードがあれば、`Keypair`の`fromSeed`メソッドを使って、アカウントのキーペアを生成することができます。

```javascript
// ファイルの先頭で Keypair クラスを読み込んでおく
import { Keypair } from "@solana/web3.js";

const newAccount = Keypair.fromSeed(new Uint8Array(seed));

console.log('newAccount', newAccount.publicKey.toString());
// > ランダムな文字列
```

### 👛 ウォレット生成関数を定義する

これまでの説明を踏まえて、ウォレットを生成するための関数`generateWallet`を定義します。

```javascript
const generateWallet = () => {
  const generatedMnemonic = bip39.generateMnemonic();
  // ニーモニックフレーズを使用して、シードを生成します。
  const seed = bip39.mnemonicToSeedSync(generatedMnemonic).slice(0, 32);
  // シードを使用して、アカウントを生成します。
  const newAccount = Keypair.fromSeed(new Uint8Array(seed));

  setMnemonic(generatedMnemonic);
  setAccount(newAccount);
};
```

`generateWallet`関数では、ニーモニックフレーズとアカウントの生成を行ってます。

また、生成したニーモニックフレーズとアカウントは、`useState`を用いて値を保持します。ニーモニックフレーズは、`GenerateWallet`コンポーネント内でのみ表示するため、`mnemonic`という状態変数に格納します。アカウントは、複数のコンポーネント間で共有したいので、`Home`コンポーネント内で状態変数を定義し、各コンポーネントに引数で渡す形にしましょう。

`export default function GenerateWallet({ setAccount }) {`の直下に、`mnemonic`を保持する状態変数を定義しましょう。

```javascript
export default function GenerateWallet({ setAccount }) {
  // 下記を追加
  const [mnemonic, setMnemonic] = useState(null);
```

### 🎨 ウォレット生成ボタンをレンダリングする

さきほど定義した`generateWallet`関数を呼び出すためのボタンを用意しましょう。

```javascript
return (
  {/* 下記を追加 */}
  <>
    <button
      className="p-2 my-6 text-white bg-indigo-500 focus:ring focus:ring-indigo-300 rounded-lg cursor-pointer"
      onClick={generateWallet}
    >
      ウォレットを生成
    </button>
    {mnemonic && (
      <>
        <div className="mt-1 p-4 border border-gray-300 bg-gray-200">
          {mnemonic}
        </div>
        <strong className="text-xs">
          このフレーズは秘密にして、安全に保管してください。このフレーズが漏洩すると、誰でもあなたの資産にアクセスできてしまいます。
          <br />
          オンライン銀行口座のパスワードのようなものだと考えてください。
        </strong>
      </>
    )}
  </>
);
```

### 🖥 生成したウォレットアドレスを表示する

それでは、作成した`GenerateWallet`コンポーネントを`Home`コンポーネントに組み込みましょう。ここからは、`pages/index.js`ファイルの編集になります。

まずは、`GenerateWallet`コンポーネントをインポートしましょう。

```javascript
import GenerateWallet from "../components/GenerateWallet";
```

`export default function Home() {`の直下に、アカウントを保時する状態変数を定義しましょう。

```javascript
export default function Home() {
  // 下記を追加
  const [account, setAccount] = useState(null);
```

`GenerateWallet`コンポーネントを呼び出すコードを追加しましょう。

```javascript
<div>
  <h2 className="p-2 border-dotted border-l-4 border-l-indigo-400">
    STEP1: ウォレットを新規作成する
  </h2>
  {/* 下記を追加 */}
  <GenerateWallet setAccount={setAccount} />
</div>
```

最後に、`My Wallet`の下に生成したウォレットのアドレスを表示するコードを追加しましょう。

```javascript
<h3 className="p-2 border-dotted border-l-8 border-l-indigo-600">
  My Wallet
</h3>
{/* 下記を追加 */}
{account && (
  <>
    <div className="my-6 text-indigo-600 font-bold">
      <span>アドレス: </span>
      {account.publicKey.toString()}
    </div>
  </>
)}
```

### ✅ 動作確認

おめでとうございます!これでウォレットの作成機能が完成しました。

実際に`ウォレットを生成`ボタンを押下してみて、

- ニーモニックフレーズが表示されること
- `My Wallet`の下に作成したウォレットのアドレスが表示されること

の２点を確認しましょう!

### 📝 このセクションで追加したコード

- `components/GenerateWallet/index.js`

```javascript
import * as bip39 from 'bip39';
import { Keypair } from '@solana/web3.js';
import { useState } from 'react';

export default function GenerateWallet({ setAccount }) {
  const [mnemonic, setMnemonic] = useState(null);

  const generateWallet = () => {
    const generatedMnemonic = bip39.generateMnemonic();
    // ニーモニックフレーズを使用して、シードを生成します。
    const seed = bip39.mnemonicToSeedSync(generatedMnemonic).slice(0, 32);
    // シードを使用して、アカウントを生成します。
    const newAccount = Keypair.fromSeed(new Uint8Array(seed));

    setMnemonic(generatedMnemonic);
    setAccount(newAccount);
  };

  return (
    <>
      <button
        className="p-2 my-6 text-white bg-indigo-500 focus:ring focus:ring-indigo-300 rounded-lg cursor-pointer"
        onClick={generateWallet}
      >
        ウォレットを生成
      </button>
      {mnemonic && (
        <>
          <div className="mt-1 p-4 border border-gray-300 bg-gray-200">
            {mnemonic}
          </div>
          <strong className="text-xs">
            このフレーズは秘密にして、安全に保管してください。このフレーズが漏洩すると、誰でもあなたの資産にアクセスできてしまいます。
            <br />
            オンライン銀行口座のパスワードのようなものだと考えてください。
          </strong>
        </>
      )}
    </>
  );
}
```

- `pages/index.js`

```diff
+import { useState } from 'react';

+import GenerateWallet from '../components/GenerateWallet/';
import HeadComponent from '../components/Head';

export default function Home() {
+  const [account, setAccount] = useState(null);

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
+          {account && (
+            <>
+              <div className="my-6 text-indigo-600 font-bold">
+                <span>アドレス: </span>
+                {account.publicKey.toString()}
+              </div>
+            </>
+          )}
        </div>

        <hr className="my-6" />
        <div>
          <h2 className="p-2 border-dotted border-l-4 border-l-indigo-400">
            STEP1: ウォレットを新規作成する
          </h2>
+          <GenerateWallet setAccount={setAccount} />
        </div>
        <hr className="my-6" />
        <div>
          <h2 className="p-2 border-dotted border-l-4 border-l-indigo-400">
            STEP2: 既存のウォレットをインポートする
          </h2>
        </div>
        <hr className="my-6" />
        <div>
          <h2 className="p-2 border-dotted border-l-4 border-l-indigo-400">
            STEP3: 残高を取得する
          </h2>
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

ニーモニック（Mnemonic）は、日本語で`記憶を助ける短い語句`ということを意味するそうですよ🥭

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

ウォレットが完成しました!次のレッスンに進んで、アプリにウォレットを連携させていきましょう✨

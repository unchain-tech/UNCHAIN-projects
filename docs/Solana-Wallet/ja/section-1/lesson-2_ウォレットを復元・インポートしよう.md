### 🔐 アカウントへのアクセス

従来のアプリケーションにとってアカウントへのアクセスは重要な機能ですが、今回学ぶアーキテクチャでは、ログインとログアウトのためにパスワードの暗号化と復号化について心配する必要はありません。

公開鍵暗号方式の優れた点は、秘密鍵が事実上、従来のパスワードであることです。暗号アプリケーションのセキュリティは、秘密鍵をパスワードとして使用するよりも高度ですが、特に産業用の強力なウォレットでは、前レッスンで学んだウォレット作成の知識を活用して、ウォレットにアクセスする基本機能を実現することができます。

### ⏫ ニーモニックフレーズによるウォレットのインポート

前レッスンで`HDウォレット`と呼ばれるタイプのウォレットを作成しました。つまり、12単語のニーモニックフレーズをシードにマッピングすることができます。

アカウントを作成するキーペアはこのシードから派生するので、ニーモニックフレーズ（リカバリフレーズとも言う）さえあれば、ウォレットをインポート、つまりアカウントにアクセスすることができます。

この機能を実現するには、フレーズを使ってシードを生成し、そのシードを使ってキーペアを取得する機能を実装する必要があります。

前レッスンでは、`BIP39`ライブラリの`generateMnemonic`関数を用いて、ニーモニックフレーズを生成しました。次に、キーペアを生成するために、そのフレーズを`@solana/web3.js`の`Keypair`クラスが使用できるシードに変換して、アカウントへのアクセスを許可するキーペアを生成する必要がありました。

### 🌱 ニーモニックフレーズを使ってシードを生成する

前レッスンで生成したニーモニックフレーズを覚えていれば、それをシードに変換し、`Keypair`の`fromSeed`メソッドを利用してアカウントにアクセスすることができます。

※ニーモニックフレーズを忘れた場合は、ウォレットを生成ボタンを押下し、フレーズを取得しましょう。

```javascript
const inputMnemonic = "ニーモニックフレーズ（12語）";
const seed = Bip39.mnemonicToSeedSync(inputMnemonic).slice(0, 32);
const importedAccount = Keypair.fromSeed(seed);
```

この数行のコードで、ニーモニックフレーズさえあれば、ユーザーがどのデバイスからでも自分のアカウントにアクセスできるようになります。

それでは、`components/ImportWallet/index.js`を更新していきましょう。

実際には、ニーモニックフレーズはフォームから入力します。`export default function ImportWallet() {`の直下に、以下のようにフォームに入力されたニーモニックフレーズを保持する状態変数と`handleImport`関数を定義して、フォームから入力されたフレーズをもとに、ウォレットをインポートできるようにしましょう。また、前のレッスンで作成したGenerateWalletコンポーネント同様、引数に`setAccount`を受け取るようにします。これは、入力されたニーモニックフレーズをもとに、アカウントを更新するためです。

```javascript
export default function ImportWallet({ setAccount }) {
  const [recoveryPhrase, setRecoveryPhrase] = useState(null);

  const handleImport = (e) => {
    e.preventDefault();

    // ニーモニックフレーズを使用して、シードを生成します。
    const seed = bip39.mnemonicToSeedSync(recoveryPhrase).slice(0, 32);
    // シードを使用して、アカウントを生成します。
    const importedAccount = Keypair.fromSeed(new Uint8Array(seed));

  setAccount(importedAccount);
  };
```

ファイルの先頭に、下記のインポート文を追加します。

```javascript
import * as bip39 from 'bip39';
import { Keypair } from '@solana/web3.js';
import { useState } from 'react';
```

そして、ニーモニックフレーズを入力するフォームと、インポートボタンをレンダリングします。return文を下記のコードで更新してください。
フォームの`onSubmit`では、上記で定義した`handleImport`関数を実行するようにしましょう。

```javascript
return (
  <form onSubmit={handleImport} className="my-6">
    <div className="flex items-center border-b border-indigo-500 py-2">
      <input
        type="text"
        className="w-full text-gray-700 mr-3 p-1 focus:outline-none"
        placeholder="シークレットリカバリーフレーズ"
        onChange={(e) => setRecoveryPhrase(e.target.value)}
      />
      <input
        type="submit"
        className="p-2 text-white bg-indigo-500 focus:ring focus:ring-indigo-300 rounded-lg cursor-pointer"
        value="インポート"
      />
    </div>
  </form>
);
```

`ImportWallet`コンポーネントの実装が完了したので、テストスクリプトを実行して模擬的に動作確認をしてみましょう。

ターミナル上で`npm run test`を実行します。

components/ImportWallet/index.test.jsが`PASS`し、`Test Suites`が下記のようになっていたらOKです！

```
Test Suites: 3 failed, 2 passed, 5 total
```

### ✅ 動作確認

それでは、作成した`ImportWallet`コンポーネントを`Home`コンポーネントに組み込みましょう。ここからは、`pages/index.js`ファイルの編集になります。

まずは、`ImportWallet`コンポーネントをインポートしましょう。

```javascript
import ImportWallet from '../components/ImportWallet';
```

続いて、`ImportWallet`コンポーネントを呼び出すコードを追加しましょう。

```javascript
<div>
  <h2 className="p-2 border-dotted border-l-4 border-l-indigo-400">
    STEP2: 既存のウォレットをインポートする
  </h2>
  {/* 下記を追加 */}
  <ImportWallet setAccount={setAccount} />
</div>
```

おめでとうございます!これでウォレットのインポート機能が完成しました。

実際にニーモニックフレーズを入力して`インポート`ボタンを押下してみてください。
`My Wallet`の下にインポートしたウォレットのアドレスが表示されたら成功です!

### 📝 このセクションで追加したコード

- `components/ImportWallet/index.js`
```javascript
import * as bip39 from 'bip39';
import { Keypair } from '@solana/web3.js';
import { useState } from 'react';

export default function ImportWallet({ setAccount }) {
  const [recoveryPhrase, setRecoveryPhrase] = useState(null);

  const handleImport = (e) => {
    e.preventDefault();

    // ニーモニックフレーズを使用して、シードを生成します。
    const seed = bip39.mnemonicToSeedSync(recoveryPhrase).slice(0, 32);
    // シードを使用して、アカウントを生成します。
    const importedAccount = Keypair.fromSeed(new Uint8Array(seed));

    setAccount(importedAccount);
  };

  return (
    <form onSubmit={handleImport} className="my-6">
      <div className="flex items-center border-b border-indigo-500 py-2">
        <input
          type="text"
          className="w-full text-gray-700 mr-3 p-1 focus:outline-none"
          placeholder="シークレットリカバリーフレーズ"
          onChange={(e) => setRecoveryPhrase(e.target.value)}
        />
        <input
          type="submit"
          className="p-2 text-white bg-indigo-500 focus:ring focus:ring-indigo-300 rounded-lg cursor-pointer"
          value="インポート"
        />
      </div>
    </form>
  );
}
```

- `pages/index.js`

```diff
import { useState } from 'react';

import GenerateWallet from '../components/GenerateWallet/';
import HeadComponent from '../components/Head';
+import ImportWallet from '../components/ImportWallet';

export default function Home() {
  const [account, setAccount] = useState(null);

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
+          <ImportWallet setAccount={setAccount} />
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

みなさんが良く知っているイーサリアム対応の`MetaMask`やSolana対応の`Phantom`のようなウォレットは、初回のアクセスはニーモニックーフレーズを使い、その後のログインはローカルでパスワードを設定する方式になっています🥭 ブラウザを変えたときなどに、再度パスワードを設定する必要があるのは、こういった理由からですね!

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

`My Wallet`の下に表示されているウォレットアドレスをDiscordの`#solana`にシェアしましょう🎉 次のレッスンでは、フロントエンドに残高を取得する機能を実装します😊

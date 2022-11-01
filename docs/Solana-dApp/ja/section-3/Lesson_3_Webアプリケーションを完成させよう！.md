さて、ようやく GIF を保存できるようになりました。

これから `sendGif` 関数を変更していきます。

`addGif` 関数を呼び出し、`getGifList` 関数を呼び出すことで、 Web アプリケーションをリフレッシュして最新の GIF 画像を表示しましょう。

```javascript
// App.js

const sendGif = async () => {
  if (inputValue.length === 0) {
    console.log("No gif link given!")
    return
  }
  setInputValue('');
  console.log('Gif link:', inputValue);
  try {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);

    await program.rpc.addGif(inputValue, {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    });
    console.log("GIF successfully sent to program", inputValue)

    await getGifList();
  } catch (error) {
    console.log("Error sending GIF:", error)
  }
};
```

GIF リンクを送信し、Phantom Wallet 経由でトランザクションを承認すると、Web アプリケーションに送信した GIF が表示されるようになります。


### 🙈 アカウントが持続しない問題を解決する

ページを更新するたびにアカウントがリセットされる問題を解決していきましょう。

問題は次の行で起こっています。

```javascript
let baseAccount = Keypair.generate();
```

ここでは、プログラムが通信する際に、毎回新しいアカウントを生成しています。

これを修正するためには、すべてのユーザーが共有する 1 つのキーペアを用意してあげる必要があります。

そのために、`src` ディレクトリの下に `createKeyPair.js`という名前のファイルを作成し、以下のコードを貼り付けてください。

```javascript
// createKeyPair.js

const fs = require('fs')
const anchor = require("@project-serum/anchor")

const account = anchor.web3.Keypair.generate()

fs.writeFileSync('./keypair.json', JSON.stringify(account))
```

このスクリプトは、キーペアを直接ファイルシステムに書き込んでいます。

このように処理すれば、Web アプリケーションにアクセスする人はいつでも同じキーペアを読み込むことができます。

`createKeyPair.js` の準備ができたら以下のコマンドをそれぞれ実行してください。

※ `src` ディレクトリ内に移動したことを確認してから `node createKeyPair.js` コマンドを実行してください。

```bash
cd src
node createKeyPair.js
```

無事に実行されると、`src` 内に `keypair.json` という名前の共有キーペアができあがります。

次に、`App.js` を少し変更します。

`App.js` の上部で以下のように `keypair.json` を `import` しましょう。

```javascript
import kp from './keypair.json'
```

続いて、`let baseAccount = Keypair.generate();` を以下のように修正しましょう。

```javascript
const arr = Object.values(kp._keypair.secretKey)
const secret = new Uint8Array(arr)
const baseAccount = web3.Keypair.fromSecretKey(secret)
```

これで永久的なキーペアができました!

Web アプリケーションをリフレッシュしても同じアカウントを利用できます。

なお、新しい `BaseAccount` を作成する `createKeyPair.js` は何度でも実行できます。

`createKeyPair.js` を再度実行してもアカウントは削除されません。

プログラムが指す新しいアカウントを作成するだけです。

**おめでとうございます!**

これで Solana プログラムと連携する Web アプリケーション（MVP）が完成しました!!


### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#solana-dapp` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 4 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---


おめでとうございます!

セクション 3 は終了です!

ぜひ、あなたが登録したお気に入りの GIF 画像が表示されているフロントエンドのスクリーンショットを `#solana-dapp` に投稿してください 😊

あなたの成功をコミュニティで祝いましょう 🎉

次のレッスンで、他の機能を実装していきましょう!

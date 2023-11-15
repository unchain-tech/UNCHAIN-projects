### ☘️ Web アプリケーションから NFT を Mint する　

前回のレッスンでは、Webアプリケーションを立ち上げました。

このレッスンでは、アプリケーションをXummと連携し、NFTのMintトランザクションを実行する方法を学びます。

- [🏃 Xummでのログインを実装しよう](#-xummでのログインを実装しよう)
- [🌥️ 画像のアップロードを実装しよう](#️-画像のアップロードを実装しよう)
- [📝 NFTのMint処理を実装しよう](#-nftのmint処理を実装しよう)
- [🙋‍♂️ 質問する](#️-質問する)

### 🏃 Xummでのログインを実装しよう

アプリケーションがアカウント情報を取得するために、Xummでのログイン処理を作成しましょう！

ここからは、`src/components/NftMinter`ディレクトリ内の`index.jsx`ファイルを更新していきます。

まずは次のコメントアウトを解除し、`api-key`の箇所をsection-1のlesson-2で取得したXummのAPI Keyに置き換えてください。

ここでは`api-secret`は使用しません。

```js
const xumm = new Xumm('api-key')
```

次に
```js
export const NftMinter = () => {
```
の下に次のコードを貼り付けてください。

```js
  const [account, setAccount] = useState(undefined);

  useEffect(() => {
    xumm.on("success", async () => {
      setAccount(await xumm.user.account);
    });
  }, []);

  const connect = () => {
    xumm.authorize();
  };
```

次に、Reactが提供するフックをインポートします。

`import "./index.css";`の下に次のコードを追加してください。

```js
import { useEffect, useState } from "react";
```

１つずつ見ていきましょう。

- アカウントアドレスを格納するための`account`という変数を定義しています。

```js
const [account, setAccount] = useState(undefined);
```

- Xummとの連携が成功時に`success`イベントが発生するので、それを検知してアカウント情報を取得します。

```js
  useEffect(() => {
    xumm.on("success", async () => {
      setAccount(await xumm.user.account);
    });
  }, []);
```

- Xummと接続するための`connect`関数を定義しています。

```js
  const connect = () => {
    xumm.authorize();
  };
```

次にXummへ接続するためのボタンを作成しましょう！

```jsx
<div className="title">XRP NFT</div>
```
上記の行の下に次のコードを貼り付けてください。

```jsx
  <div className="account-box">
    <div className="account">{account}</div>
    <Button variant="contained" onClick={connect}>
      connect
    </Button>
  </div>
```

現在ログイン中のアカウントアドレスである`account`とXummと接続するためのConnectボタンを配置しました。

> **✅ テストを実行してみよう**
>
> ログイン機能を実装したので、ここで`npm run test`を実行してみましょう！
>
> ![test1](/public/images/XRPL-NFT-Maker/section-3/3_2_5.png)
>
> **not connected**（未ログイン）と**connected**（ログイン済み）、それぞれの状況においてテストを行なっており、合計5つのテストにパスすることが期待されます。
>
> **not connected**のテストに注目してみます。connectボタンが表示されるかだけではなく、ボタンのクリック操作を行なった結果`authorize`関数が呼び出されているかを確認することもできます。
>
> なお、テスト実行時には実際の`Xumm`が呼び出されないようにモックしています。

この時点で`npm start`からアプリケーションを起動してみましょう！

次のような画面が表示されれば成功です。

![](/public/images/XRPL-NFT-Maker/section-3/3_2_1.png)

ここで一度Xummへログインをしてみましょう。

先ほど作成したConnectボタンを押下してみてください。
次のようなポップアップが表示されるはずです。

![](/public/images/XRPL-NFT-Maker/section-3/3_2_2.png)

このQRコードをXummで読み取ってみましょう。

読み取り後、SignInへ署名することでログインが完了します！

Webアプリケーションにアカウントのアドレスが表示されていればログイン成功です！

### 🌥️ 画像のアップロードを実装しよう

次に画像をアップロードするための機能を実装していきましょう！

先ほど追加したaccount変数の下に次のコードを追加してください。

```js
const [file, setFile] = useState(undefined);
```

また、先ほど追加したconnect関数の下に次のコードを追加してください。
```js
  const uploadImage = (e) => {
    const files = e.target.files;
    setFile(files[0])
  };
```

これは画像のアップロード時に画像データを保存する処理です。

ファイルを選択ボタンを押下時にuploadImage関数が呼ばれるようにしましょう。
ボタンを次のように修正してください。`onChange={uploadImage}`を追加します。

```js
<div className="image-box">
  <Button variant="contained" onChange={uploadImage}>
    ファイルを選択
    <input
      className="imageInput"
      type="file"
      accept=".jpg , .jpeg , .png"
    />
  </Button>
</div>
```

また上記コードの下に次のコードを追加しましょう。
画像選択後、画像を表示するためのコードです。

```js
  {file && <img src={window.URL.createObjectURL(file)} alt="nft" className="nft-image" />}
```

> **✅ テストを実行してみよう**
>
> 画像のアップロード機能を実装したので、再度テスト結果を確認してみましょう。
>
> ![test2](/public/images/XRPL-NFT-Maker/section-3/3_2_6.png)
>
> ここまでで合計6つのテストにパスすることが期待されます。
>
> `should exists img tag when select img`に注目してみます。このテストは、ファイルのアップロード操作を行なった結果画像が表示されるか（`<img>`要素が取得できるか）を確認しています。

実際にブラウザから操作してみましょう。

アプリケーションを起動後ファイルを選択ボタンを押して好きな画像を選択してみましょう。

ブラウザに選択した画像が表示されれば成功です！

![](/public/images/XRPL-NFT-Maker/section-3/3_2_3.png)

### 📝 NFTのMint処理を実装しよう

次にXummを通じてNFTを発行する処理を実装していきましょう。
uploadImage関数の下に次のコードを追加してください。

```js
const mint = async () => {
    if (!file) {
      alert("画像ファイルを選択してください！");
      return;
    }
    // 画像とメタデータをIPFSにアップロード
    const { url } = await nftStorage.store({
      schema: "ipfs://QmNpi8rcXEkohca8iXu7zysKKSJYqCvBJn3xJwga8jXqWU",
      nftType: "art.v0",
      image: file,
      name: "some name",
      description: "some description",
    });
    // Xummにトランザクションデータを送信
    const payload = await xumm.payload.createAndSubscribe({
      TransactionType: "NFTokenMint",
      NFTokenTaxon: 0,
      Flags: 8,
      URI: Buffer.from(url).toString("hex"),
    });
    payload.websocket.onmessage = (msg) => {
      const data = JSON.parse(msg.data.toString());
      // トランザクションへの署名が完了/拒否されたらresolve
      if (typeof data.signed === "boolean") {
        payload.resolve({ signed: data.signed, txid: data.txid });
      }
    };
    // resolveされるまで待機
    const { signed, txid } = await payload.resolved;
    if (!signed) {
      alert("トランザクションへの署名は拒否されました！");
      return;
    }
    // テストネットからトランザクションの情報を取得
    const client = new XrplClient("wss://testnet.xrpl-labs.com");
    const txResponse = await client.send({
      command: "tx",
      transaction: txid,
    });
    // トランザクション情報からNFTの情報を取得
    const nftokenId = txResponse.meta.nftoken_id
    alert("NFTトークンが発行されました！");
    window.open(`https://test.bithomp.com/nft/${nftokenId}`, "_blank");
  };
```

次に選択した画像の表示とミント用のボタンを追加します。

ファイル選択処理を表す次のコードの下にコードを追加してください。

```js
      <div className="image-box">
        <Button variant="contained" onChange={uploadImage}>
          ファイルを選択
          <input
            className="imageInput"
            type="file"
            accept=".jpg , .jpeg , .png"
          />
        </Button>
      </div>
```

- 追加するコード
```jsx
      {file && (
          <img
            src={window.URL.createObjectURL(file)}
            alt="nft"
            className="nft-image"
          />
      )}
      {account && (
        <div>
          <Button variant="outlined" onClick={mint}>
            mint
          </Button>
        </div>
      )}
```

`<div className="image-box">`のスコープの外に追加しましょう！

追加したコードは次のような意味を持っています。

- 画像が選択されている場合はその画像を表示します。
- ログイン済みの場合は、ミント用のボタンを表示します。


次に、この関数内で使うライブラリをインポートします。

まずはコンソールで`npm install buffer@^6.0.3 xrpl-client@^2.0.11 nft.storage@^7.0.3`を実行してください。

`import { useEffect, useState } from "react";`の下に次のコードを追加してください。

```js
import { Buffer } from "buffer";
import { XrplClient } from 'xrpl-client'
import { NFTStorage } from "nft.storage";
```

また`const xumm = new Xumm("api-key");`の下に次のコードを追加してください。
NFT.Storageに画像とメタデータをアップロードするために必要です。
APIキーは[NFT.Storage](https://nft.storage)のサイトから取得できます。

[このページ](https://nft-guide.jp/2022/03/17/post-2977/#outline__2)を参考に取得してください。

```js
const nftStorage = new NFTStorage({ token: "api-key",});
```

mint関数の処理を1つずつ説明していきます。

- 画像が選択されていない場合は、アラートを表示して処理を終了します。

```js
    if (!file) {
      alert("画像ファイルを選択してください！");
      return;
    }
```

- NFTの画像およびメタデータをIPFSに保存します。
  ここではNFT.Storageを使用しています。
  store関数を使うことで画像とメタデータのアップロードを同時に行ってくれます。
  
  今回はXRP LedgerのNFTメタデータ規格のXLS-24に合わせてメタデータを作成しています。
  XLS-24の詳細は[こちら](https://github.com/XRPLF/XRPL-Standards/discussions/69)をご覧ください。
 
  nameやdescriptionは好きな値に変更してください。

```js
    const { url } = await nftStorage.store({
      schema: "ipfs://QmNpi8rcXEkohca8iXu7zysKKSJYqCvBJn3xJwga8jXqWU",
      nftType: "art.v0",
      image: file,
      name: "some name",
      description: "some description",
    });
```

- Xummへトランザクションの元となる情報を送信します。
  TransactionTypeはNFTを発行するための`NFTokenMint`を指定します。
  今回は第三者間での売買が可能なようにtfTransferableフラグ（8）を設定しています。
  URIには先ほどNFT.Storageから取得したIPFSのURLを16進数値で指定します。
  
  NFTokenMintトランザクションの送信は[こちら](https://xrpl.org/ja/nftokenmint.html)をご覧ください

```js
    const payload = await xumm.payload.createAndSubscribe({
      TransactionType: "NFTokenMint",
      NFTokenTaxon: 0,
      Flags: 8,
      URI: Buffer.from(url).toString("hex"),
    });
```

- Xummから署名されたトランザクションの情報を受け取ります。
  Xummでトランザクション署名画面を開いたり署名したりするとイベントが発生します。このイベントのデータから署名されたかどうかを監視しています。署名に成功または署名を拒否した場合`signed`に`true/false`が設定されますので、resolve関数を呼び出して`signed`,`txid`を返します。
  トランザクションが拒否(`signed=false`)された場合は、アラートを表示し、処理を終了します。

```js
    payload.websocket.onmessage = (msg) => {
      const data = JSON.parse(msg.data.toString());
      if (typeof data.signed === "boolean") {
        payload.resolve({ signed: data.signed, txid: data.txid });
      }
    };
    const { signed, txid } = await payload.resolved;
    if (!signed) {
      alert("トランザクションへの署名は拒否されました！");
      return;
    }
```

- Xummから署名されたトランザクションの情報を取得します。
  取得したトランザクション情報から発行したNFTのIDを取得し、NFTの詳細ページを開きます。

```js
    const client = new XrplClient("wss://testnet.xrpl-labs.com");
    const txResponse = await client.send({
      command: "tx",
      transaction: txid,
    });
    const nftokenId = txResponse.meta.nftoken_id
    alert('NFTトークンが発行されました！');
    window.open(`https://test.bithomp.com/nft/${nftokenId}`, "_blank");
```

> **✅ テストを実行してみよう**
>
> ミント機能を実装する際に、新しいライブラリ「`xrpl-client`」と「`nft.storage`」をインポートしました。テストを実行するためにこれらのライブラリをモックする必要があります。`src/components/NftMinter`ディレクトリ内の`index.test.jsx`を更新しましょう。
>
>9行目から17行目までのコードのコメントアウトを下記のように外してください。
>
>```js
>// Section2 Lesson2 「📝 NFTのMint処理を実装しよう」が完了した後にコメントアウトを外してください。
>   jest.mock('nft.storage', () => {
>     const { MockedNFTStorage } = require('../../__test__/__mock__/NFTStorage');
>     return { NFTStorage: MockedNFTStorage };
>   });
>
>   jest.mock('xrpl-client', () => {
>     const { XrplClient } = require('../../__test__/__mock__/XrplClient');
>     return { XrplClient };
>   });
>```
>
> それでは改めてテストを実行してみましょう。
>
> ![test3](/public/images/XRPL-NFT-Maker/section-3/3_2_7.png)
>
> `should mint success`に注目してみます。このテストは、ミントボタンのクリック操作を行なった結果、期待するNFTの詳細ページが開かれるか（`window.open関数`が期待するNFTのIDを含んだ引数で実行されるか）を確認しています。
>
> ここまでで全てのテストにパスすることが期待されます。

実際にブラウザから操作してみましょう。

画像を選択しミント・Xummでのトランザクションの署名を行うと、Bithompのページが開きます。

選択した画像が表示されていれば成功です！

![](/public/images/XRPL-NFT-Maker/section-3/3_2_4.png)

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#xrpl`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

おめでとうございます!

NFTをMintできるWebアプリケーションはほぼ完成です!

Bithompのリンクを`#xrpl`に貼り付けて、あなたのNFTをシェアしましょう 😊

あなたの作ったNFTがどんなものなのか気になります ✨

次のレッスンに進みましょう 🎉


シンプルなNFTのmintコードを実行し、mintまでの流れを理解しましょう！

XRP LedgerのクライアントライブラリはJavaScriptやPythonなどに対応したクライアントライブラリが存在します。
今回はJavaScriptを使っていきます。

### ✅ Node.jsをインストールする

[こちら](https://developer.mozilla.org/ja/docs/Learn/Server-side/Express_Nodejs/development_environment#node_%E3%81%AE%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB)のページを参考にNode.jsをインストールしてください。

インストール済みの方はスキップしてください。

### 🔧 コードを作成する

お好きな場所にプロジェクト用のディレクトリを作成します。

1. `npm init`でpackage.jsonファイルを作成します。
1. `npm install xumm xrpl`を実行し`xumm`と`xrpl`の2つのパッケージをインストールします。

  `xumm`はその名の通りXummアプリと接続するために必要となるパッケージです。
  https://www.npmjs.com/package/xumm

  `xrpl`はXRP Ledgerと接続が可能なパッケージです。今回はXRP Ledgerとの接続部分はxummを使用し、`xrpl`ではユーティリティメソッドのみ使用します。
  https://www.npmjs.com/package/xrpl

1. `index.js`ファイルを作成し、以下のコードを入力します。
   `api-key`と`api-secret`はlesson-2でXumm Developer Consoleから取得したものに置き換えてください。
   URIにはIPFSのURIを指定します。メタデータのJSONファイルであることが望ましいですが、ここでは画像のURIで構いません。

   IPFSについては[IPFSってなんだろう](https://app.unchain.tech/learn/ETH-NFT-Maker/ja/2/1/)、IPFSに画像をアップロードする方法については[IPFSを使ってみよう！](https://app.unchain.tech/learn/ETH-NFT-Maker/ja/2/2/)をご覧ください！

```js
const { Xumm } = require('xumm');
const { convertStringToHex, NFTokenMintFlags } = require('xrpl');

const xumm = new Xumm('api-key', 'api-secret');
const transaction = {
  TransactionType: 'NFTokenMint',
  NFTokenTaxon: 0,
  Flags: NFTokenMintFlags.tfTransferable,
  TransferFee: 10 * 1000, // 10%
  URI: convertStringToHex('ipfs://***'),
};
xumm.payload?.create(transaction).then(payload=>{
  console.log(payload);
});
```

- コードの説明

1. Xummへアクセスするためのインスタンスを作成します。

```js
const xumm = new Xumm('api-key', 'api-secret');
```

2. NFTをミントするための`NFTokenMint`トランザクションの指定とNFTの情報を指定します。

```js
const transaction = {
  TransactionType: 'NFTokenMint',
  NFTokenTaxon: 0,
  Flags: NFTokenMintFlags.tfTransferable,
  TransferFee: 10 * 1000, // 10%
  URI: convertStringToHex('ipfs://***'),
};
```

- `TransactionType`: トランザクションの種類を指定します。今回はNFTをミントするために`NFTokenMint`を指定します。
- `NFTokenTaxon`: NFTのコレクションの識別IDを指定します。今回は`0`を指定します。
- `Flags`: NFTの特性を指定します。今回は`tfTransferable`を指定します。`tfTransferable`を指定することでNFTを他のアドレスに送信することが可能になります。他にも発行者によるバーンを許可する`tfBurnable`やNFTの売買をXRPのみに制限する`tfOnlyXRP`が存在し、複数のフラグを指定することも可能です。
- `TransferFee`: NFTのロイヤリティを指定します。今回は10％を指定しています。Flagsに`tfTransferable`を指定している場合のみ有効です。
- `URI`: NFTのメタデータを指定します。今回はIPFSのURIを指定しています。URIフィールドにはHEX値を指定する必要があるため、URIの文字列を`xrpl`が提供する`convertStringToHex`メソッドで16進数値へ変換します。

`NFTokenMint`トランザクションの詳細は[ドキュメント](https://xrpl.org/ja/nftokenmint.html)をご覧ください！

3. トランザクション情報からXummで利用可能なペイロードを取得します。

```js
xumm.payload?.create(transaction).then(payload=>{
  console.log(payload);
});
```

トランザクション情報が間違っている場合はpayloadは`null`になります。

### 🏃 コードを実行する

`node index.js`でコードの実行を行います。
コードが正しければ以下のような情報が出力されます。

```js
{
  uuid: '85a6b00d-066a-43d5-9ef4-f52a0f85aed2',
  next: {
    always: 'https://xumm.app/sign/85a6b00d-066a-43d5-9ef4-f52a0f85aed2'
  },
  refs: {
    qr_png: 'https://xumm.app/sign/85a6b00d-066a-43d5-9ef4-f52a0f85aed2_q.png',
    qr_matrix: 'https://xumm.app/sign/85a6b00d-066a-43d5-9ef4-f52a0f85aed2_q.json',
    qr_uri_quality_opts: [ 'm', 'q', 'h' ],
    websocket_status: 'wss://xumm.app/sign/85a6b00d-066a-43d5-9ef4-f52a0f85aed2'
  },
  pushed: false
}
```

alwaysフィールドのurl(上記の例では`https://xumm.app/sign/85a6b00d-066a-43d5-9ef4-f52a0f85aed2`)にアクセスすることで表示されるQRコードをXummアプリから読み取ることでトランザクションに署名することができます✨

### 🔎 NFTを確認する

次のTestnet NFT Explorerページからアカウントのアドレスを入力し検索することで発行したNFTを確認することができます！

https://test.bithomp.com/nft-explorer

フラグやURIなどを変更して複数のNFTを発行してみましょう！

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

完了したら次のセクションへ進みましょう 🎉

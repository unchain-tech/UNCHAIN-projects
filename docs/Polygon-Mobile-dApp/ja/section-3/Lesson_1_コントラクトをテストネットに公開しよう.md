### 🦊 MetaMask に Polygon Network を追加する

MetaMask ウォレットに Matic Mainnet と Polygon Mumbai-Testnet を追加してみましょう。

**1 \. Matic Mainnet を MetaMask に接続する**

Matic Mainnet を MetaMask に追加するには、次の手順に従ってください。

まず、[Polygonscan](https://polygonscan.com/) に向かい、ページの一番下までスクロールして、`Add Polygon Network` ボタンをクリックします。

![](/public/images/Polygon-Mobile-dApp/section-3/3_1_01.png)

下記のようなポップアップが立ち上がったら、`Switch Network` をクリックしましょう。

![](/public/images/Polygon-Mobile-dApp/section-3/3_1_02.png)

`Matic Mainnet` があなたの MetaMask にセットアップされました。

![](/public/images/Polygon-Mobile-dApp/section-3/3_1_03.png)

**2 \. Polygon Mumbai-Testnet を MetaMask に接続する**

Polygon Mumbai-Testnet を MetaMask に追加するには、次の手順に従ってください。

まず、[mumbai.polygonscan.com](https://mumbai.polygonscan.com/) に向かい、ページの一番下までスクロールして、`Add Mumbai Network` ボタンをクリックします。

`Matic Mainnet` を設定した時と同じ要領で `Polygon Testnet` をあなたの MetaMask に設定してください。

### 🚰 偽 MATIC を入手する

MetaMask で Polygon ネットワークの設定が完了したら、偽の MATIC を取得していきましょう。

[こちら](https://faucet.polygon.technology/) にアクセスして、下記のように偽 MATIC をリクエストしてください。

![](/public/images/Polygon-Mobile-dApp/section-3/3_1_04.png)

Rinkeby とは異なり、これらのトークンの取得にそれほど問題はないはずです。

1 回のリクエストで 0.5 MATIC（偽）が手に入るので、2 回リクエストして、1 MATIC 入手しましょう。

**⚠️: Polygon のメインネットワークにコントラクトをデプロイする際の注意事項**

> Polygon のメインネットワークにコントラクトをデプロイする準備ができたら、本物の MATIC を入手する必要があります。
>
> これには 2 つの方法があります。
>
> 1. イーサリアムのメインネットで MATIC を購入し、Polygon のネットワークにブリッジする。
>
> 2. 仮想通貨の取引所（ WazirX や Coinbase など）で MATIC を購入し、それを直接 MetaMask に転送する。
>
> Polygon のようなサイドチェーンの場合、`2` の方が簡単で安く済みます。


### ✨ スマートコントラクトを Mumbai testnet に公開する

`Truffle-config.js` にテストネットのプロバイダの詳細を追加することで、Polygon Mumbai testnetにスマートコントラクトを公開していきます。

まず、 `todo-dApp-contract` ディレクトリに `.secret` ファイルを作成し、そのファイルに metamask の秘密のリカバリフレーズを貼り付けてください。

※ `.secret` ファイルが `.gitignore` ファイルに追加されていることを確認してください。`.gitignore` ファイルが無ければ、作成してください。

`todo-dApp-contract` 上でターミナルを開き、以下のコマンドを実行し、`hdwallet-provider` をインストールして、ガス料金を自分のアカウントで支払うことができるようにします。

```bash
npm install @truffle/hdwallet-provider
```

すべて正しく設定できたら、`truffle-config.js`の内容を削除し、以下のコードを追加してください。

```js
//truffle-config.js
const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();
const fs = require("fs");
const mnemonic = fs.readFileSync(".secret").toString().trim();

var ALCHEMY_API_KEY = "YOU-ALCHEMY_API_KEY-FOR-POLYGON";

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*",
    },
    matic: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: mnemonic,
          },
          providerOrUrl: process.env.ALCHEMY_API_KEY,
          chainId: 80001,
        }),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      chainId: 80001,
    },
  },
  contracts_directory: "./contracts",
  compilers: {
    solc: {
      version: "0.8.11",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    }
  },
  db: {
    enabled: false,
  },
};
```

上記の `providerOrUrl: process.env.ALCHEMY_API_KEY,` の `process.env.ALCHEMY_API_KEY` の部分を、[alchemy.com](https://www.alchemy.com/)で作成したPolygon用のデプロイ先の `API key` に設定します。

手順は下記のとおりです。

まず、先ほどのリンクからログインして、`Create App` を選択し、下記のように設定してください。

![](/public/images/Polygon-Mobile-dApp/section-3/3_1_05.png)

下の画像で示す部分をクリックすると、`HTTP`を確認できます。

![](/public/images/Polygon-Mobile-dApp/section-3/3_1_06.jpg)

次に下記のコマンドを`todo-dApp-contract`フォルダ上でターミナルを開いて実行してください。

```bash
npm install dotenv
```

インストールができたら、`todo-dApp-contract` フォルダ直下に `.env` ファイルを作成し、下記のコードを追加してください。

```js
//.env
POLYGON_URL = "Alchemy Polygon URL";
```

`Alchemy Polygon URL` の部分に、先ほど確認した `HTTP` を貼り付けてください。

次に、`.gitignore` ファイルを以下のように更新してください。

```
node_modules
package-lock.json
.secret
.env
```

以上が完了したら、`todo-dApp-contract` 上でターミナルを開き、以下のコマンドを実行し、Polygon testnet上にスマートコントラクトをデプロイします。

```bash
truffle migrate --network matic
```

上記のコマンドでエラーになった方は、以下を実行してください。

```bash
npx truffle migrate --network matic
```

エラーが起きた方は、下記をお試しください。

```bash
npx truffle migrate --network matic --reset
```

下記のような結果になれば成功です。

![](/public/images/Polygon-Mobile-dApp/section-3/3_1_07.png)

[mumbai.polygonscan.com](https://mumbai.polygonscan.com/) に向かい、`contract address` を貼り付けて、デプロイできているか確認してみましょう。

確認できたら、デプロイの作業は終わりです。

今回のプロジェクトでは、残念ながらテストネット上のスマートコントラクトとフロント側との接続は行いません。webアプリでは拡張機能でmetamaskとの連携が容易に実装できますが、mobileだとそうはいかないようだからです。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#polygon-mobile-dapp` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 3 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---
あなたのコントラクトアドレスのリンクを Discord の `#polygon-mobile-dapp` に投稿してください!

次のセクションに進んで、動作状況をGifに収めるを開始しましょう 🎉

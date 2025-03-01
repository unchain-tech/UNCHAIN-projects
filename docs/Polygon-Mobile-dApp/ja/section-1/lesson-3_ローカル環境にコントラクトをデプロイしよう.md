### 🐣 テストネットにデプロイする

前のセクションでスマートコントラクトが書けたので、次はそれをデプロイします。

### 🦊 MetaMask に Polygon Network を追加する

MetaMaskウォレットにMatic MainnetとPolygon Amoy-Testnetを追加してみましょう。

**1 \. Matic Mainnet を MetaMask に接続する**

Matic MainnetをMetaMaskに追加するには、次の手順に従ってください。

まず、[Polygonscan](https://polygonscan.com/) に向かい、ページの一番下までスクロールして、`Add Polygon Network`ボタンをクリックします。

![](/images/Polygon-Mobile-dApp/section-3/3_1_1.png)

下記のようなポップアップが立ち上がったら、`Switch Network`をクリックしましょう。

![](/images/Polygon-Mobile-dApp/section-3/3_1_2.png)

`Matic Mainnet`があなたのMetaMaskにセットアップされました。

![](/images/Polygon-Mobile-dApp/section-3/3_1_3.png)

**2 \. Polygon Amoy-Testnet を MetaMask に接続する**

Polygon Amoy-TestnetをMetaMaskに追加するには、次の手順に従ってください。

まず、[amoy.polygonscan.com](https://amoy.polygonscan.com/) に向かい、ページの一番下までスクロールして、`Add Amoy Network`ボタンをクリックします。

`Matic Mainnet`を設定した時と同じ要領で`Polygon Testnet`をあなたのMetaMaskに設定してください。

### 🚰 偽 MATIC を入手する

MetaMaskでPolygonネットワークの設定が完了したら、偽のMATICを取得していきましょう。

[こちら](https://faucet.polygon.technology/) にアクセスして、下記のように偽MATICをリクエストしてください。

![](/images/Polygon-Mobile-dApp/section-3/3_1_4.png)

Sepoliaとは異なり、これらのトークンの取得にそれほど問題はないはずです。

1回のリクエストで0.5 MATIC（偽）が手に入るので、2回リクエストして、1 MATIC入手しましょう。

**⚠️: Polygon のメインネットワークにコントラクトをデプロイする際の注意事項**

> Polygon のメインネットワークにコントラクトをデプロイする準備ができたら、本物の MATIC を入手する必要があります。
>
> これには 2 つの方法があります。
>
> 1. イーサリアムのメインネットで MATIC を購入し、Polygon のネットワークにブリッジする。
>
> 2. 仮想通貨の取引所（ WazirX や Coinbase など）で MATIC を購入し、それを直接 MetaMask に転送する。
>
> Polygon のようなサイドチェーンの場合、`2`の方が簡単で安く済みます。

### 💎 Alchemy でネットワークを作成

[こちら](https://www.alchemy.com/) からAlchemyのアカウントを作成してください。アカウントを作成したら、Appsページの`+ Create new app`ボタンを押してください。

![](/images/Polygon-Mobile-dApp/section-1/1_3_1.png)

次に、下記の項目を埋めていきます。下図を参考にしてください。

![](/images/Polygon-Mobile-dApp/section-1/1_3_2.png)

- `Chain`: `Polygon PoS`を選択
- `Network`: `Polygon Mumbai`を選択
- `Name`: プロジェクトの名前(例: `Polygon Mobile dApp`)
- `Description`: プロジェクトの概要

`Create app`ボタンを押すと、プロジェクトが作成されます。`API Key`をクリックすると、表示されたポップアップからKeyを取得することができます（今回のプロジェクトで使用するのは、`HTTPS`に表示されているものになります）。

![](/images/Polygon-Mobile-dApp/section-1/1_3_3.png)

これがあなたが本番環境のネットワークに接続する際に使用する`API Key`になります。

### ✨ スマートコントラクトを Amoy testnet に公開する

それでは、実際にコントラクトをデプロイしてみましょう。まずは、`scripts`ディレクトリの中にある`deploy.js`を以下の内容で上書きしてください。

```js
const hre = require('hardhat');
const main = async () => {
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log('Deploying contracts with account: ', deployer.address);
  console.log('Account balance: ', accountBalance.toString());

  const todoContractFactory = await hre.ethers.getContractFactory(
    'TodoContract',
  );
  /* コントラクトに資金を提供できるようにする */
  const todoContract = await todoContractFactory.deploy();

  await todoContract.deployed();

  console.log('TodoContract address: ', todoContract.address);
};

const runMain = async () => {
  try {
    await main();
  } catch (error) {
    console.error(error);
    throw new Error('there is error!');
  }
};

runMain();
```

次に`hardhat.config.js`の既存の内容をすべて削除し、以下のコードに置き換えてください。

solidityのバージョンはあなたが使用しているものに合わせて変更してください。

```js
//hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { PRIVATE_KEY, STAGING_ALCHEMY_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    amoy: {
      url: STAGING_ALCHEMY_KEY || "",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : ["0".repeat(64)],
    },
  },
};
```

それでは、hardhat.config.jsに設定する値を準備します。`packages/contract`ディレクトリに`.env`ファイルを作成して次のように記述しましょう。

```
STAGING_ALCHEMY_KEY=YOUR_ALCHEMY_KEY
PRIVATE_KEY=YOUR_PRIVATE_KEY
```

`YOUR_ALCHEMY_KEY`にはAlchemyで作成したAPI Key（HTTPSの値）を、`YOUR_PRIVATE_KEY`にはMetaMaskで作成したウォレットのプライベートキーを代入しましょう（取得方法は[こちら](https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key)のドキュメントを参照してください）。

では早速デプロイ作業に移りましょう。プロジェクトのルートで、以下のコマンドを実行します。

```
yarn contract deploy
```

下のようになっていれば成功です！

```
Deploying contracts with account:  0x04CD057E4bAD766361348F26E847B546cBBc7946
Account balance:  287212753772831574
TodoContract address:  0x14479CaB58EB7B2AF847FCb2DbFD5F7e1bB17A08
```

- **TodoContract のアドレスは後ほど必要になるので、PC 上のわかりやすいところに保存しておきましょう。**

次は、Flutterアプリケーションへ接続していきましょう。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#polygon`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

ターミナルの出力結果をDiscordの`#polygon`に投稿して、コミュニティにシェアしてください!

次のセクションに進んで、Flutterアプリケーションへの接続を開始しましょう 🎉

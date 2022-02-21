🖥 本番環境の構築を行う
------------------

ローカル環境のイーサリアムネットワークを終了します。

- ターミナルを閉じれば完了です。

これから、実際のブロックチェーンにコントラクトをデプロイするための環境を構築していきます。

💳 トランザクション
------------------
**イーサリアムネットワーク上でブロックチェーンに新しく情報を書き込むこと**を、**トランザクション**と呼びます。

ここまでのレッスンに登場した**トランザクション**は以下です。

- **新規にスマートコントラクトをデプロイした**という情報をブロックチェーンに書き込む。

- **NFT が Mint されたという情報**をブロックチェーンに書き込む。

- **NFT を 10 点、コントラウト所有者のためにキープした**情報をブロックチェーンに書き込む。

トランザクションにはマイナーの承認が必要なので、Alchemy を導入します。

Alchemy は、世界中のトランザクションを一元化し、マイナーの承認を促進するプラットフォームです。

[こちら](https://www.alchemy.com/) から Alchemy のアカウントを作成してください。

💎 Alchemyでネットワークを作成
------------------

Alchemyのアカウントを作成したら、`CREATE APP` ボタンを押してください。
![](https://i.imgur.com/S5eY4E7.png)

次に、下記の項目を埋めていきます。下図を参考にしてください。

![](https://i.imgur.com/Hbk6BQs.png)
- `NAME`: プロジェクトの名前（例: `NFTCollectible` ）
- `DESCRIPTION`: プロジェクトの概要
- `ENVIRONMENT`: `Development` を選択。
- `CHAIN`: `Ethereum` を選択。
- `NETWORK`: `Rinkeby` を選択。

それから、作成した App の `VIEW DETAILS` をクリックします。

![](https://i.imgur.com/3lnKTmF.png)

プロジェクトを開いたら、`VIEW KEY` ボタンをクリックします。

![](https://i.imgur.com/5N5sRt9.png)

ポップアップが開くので、`HTTP` のリンクをコピーしてください。

これがあなたが本番環境のネットワークに接続する際に使用する `API Key` になります。

- **`API Key` は、今後必要になるので、PC上のわかりやすいところに保存しておきましょう。**



🦊 Metamask をダウンロードする
-----------

次に、イーサリアムウォレットをダウンロードしましょう。

このプロジェクトでは Metamask を使用します。

- [こちら](https://metamask.io/download.html) からブラウザの拡張機能をダウンロードし、Metamask ウォレットをあなたのブラウザに設定します。

すでに別のウォレットをお持ちの場合でも、今回は Metamask を使用してください。

✍️: Metamask が必要な理由
> ユーザーが、スマートコントラクトを呼び出すとき、本人のイーサリアムアドレスと秘密鍵を備えたウォレットが必要となります。
> - これは、認証作業のようなものです。

🐣 テストネットから始める
------------

今回のプロジェクトでは、コスト（＝ 本物の ETH ）が発生するメインネットではなく、**テストネットにコントラクトをデプロイします。**

テストネットはメインネットを模しています。

- メインネットにコントラクトをデプロイした際に発生するイベントのテストを行うのに最適です。

- テストネットは偽の ETH を使用しているため、いくらでもトランザクションのテストを行えます。

今回は、以下のイベントをテストしていきます。

1. トランザクションの発生を世界中のマイナーたちに知らせる

2. あるマイナーがトランザクションを発見する

3. そのマイナーがトランザクションを承認する

4. そのマイナーがトランザクションを承認したことを他のマイナーたちに知らせ、トランザクションのコピーを更新する

このセクションでは、コードを書きながら、これらのイベントについての理解を深めていきます。

🚰 偽の ETH を取得する
------------------------

今回は、`Rinkeby` というイーサリアム財団によって運営されているテストネットを使用します。

`Rinkeby` にコントラクトをデプロイし、コードのテストを行うために、偽の ETH を取得しましょう。ユーザーが偽の ETH を取得するために用意されたインフラは、「フォーセット（＝蛇口）」と呼ばれています。

フォーセットを使用する前に、あなたの MetaMask ウォレットを `Rinkeby Test Network` に設定してください。

✍️: Metamask で `Rinkeby Test Network` を設定する方法
> 1 \. Metamask ウォレットのネットワークトグルを開く。
![](https://i.imgur.com/vaZA6gj.png)

> 2 \. `Show/hide test networks` をクリック。
> ![](https://i.imgur.com/GLItmnE.png)

> 3 \. `Show test networks` を `ON` にする。
> ![](https://i.imgur.com/jOQZZeq.png)

> 4 \. `Rinkeby Test Network` を選択する。
>![](https://i.imgur.com/aKJAquh.png)

MetaMask ウォレットに `Rinkeby Test Network` が設定されたら、下記のリンクの中から条件に合うものを選んで、少量の偽 ETH を取得しましょう。

| WEBサイト|リンク| 偽ETHの取得額| 取得までにかかる時間|
| ---------------- | ------------------------------------- | --------------- | ------------ |
| MyCrypto         | https://app.mycrypto.com/faucet       | 0.01            | なし         |
| Buildspace       | https://buildspace-faucet.vercel.app/ | 0.025           | 1日           |
| Ethily           | https://ethily.io/rinkeby-faucet/     | 0.2             | 1週間           |
| Official Rinkeby | https://faucet.rinkeby.io/            | 3 / 7.5 / 18.75 | 8時間 / 1日 / 3日 |
| Chainlink        | https://faucets.chain.link/rinkeby    | 0.1             | なし         |


🤫 機密情報を隠す
---

まず、`dotenv` ライブラリを使用して、先ほど作成した `Alchemy URL` とあなたの Metamask の秘密鍵を隠していきます。


`.env` というファイルを `nft-collectible` ディレクトリ内に作成し、下記のように編集しましょう。

```
API_URL = "YOUR_ALCHEMY_API_URL"
PRIVATE_KEY = "YOUR_PRIVATE_RINKEBY_ACCOUNT_KEY"
```
1. \. `YOUR_ALCHEMY_API_URL`の取得

> `.env` の `YOUR_ALCHEMY_API_URL` の部分を先ほど取得した Alchemy の URL（ `HTTP` リンク） と入れ替えます。

2. \. `YOUR_PRIVATE_RINKEBY_ACCOUNT_KEY` の取得
> 1. お使いのブラウザから、Metamask プラグインをクリックして、ネットワークを `Rinkeby Test Network` に変更します。
> ![](https://i.imgur.com/aKJAquh.png)
> 2. それから、`Account details` を選択してください。
> ![](https://i.imgur.com/fWiywxO.png)
> 3. `Account details` から `Export Private Key` をクリックしてください。
> ![](https://i.imgur.com/0joCdPT.png)
> 4. Metamask のパスワードを求められるので、入力したら `Confirm` を推します。
> ![](https://i.imgur.com/WBeVAOd.png)
> 5. あなたの秘密鍵（＝ `Private Key` ）が表示されるので、クリックしてコピーします。
> ![](https://i.imgur.com/JcwQ2pg.png)
> `.env` の `YOUR_PRIVATE_RINKEBY_ACCOUNT_KEY` の部分をここで取得した秘密鍵とを入れ替えます。

**✍️: スマートコントラクトをデプロイするのに秘密鍵が必要な理由**
> **新しくスマートコントラクトをイーサリアムネットワーク上にデプロイすること**も、トランザクションの一つです。
>
> トランザクションを行うためには、ブロックチェーンに「ログイン」する必要があります。
>
> 「ログイン」には下記の情報が必要となります。
> - ユーザー名: Metamask の公開アドレス
> - パスワード: Metamask の秘密鍵
>
> ユーザー名とパスワードを使用して、AWS にログインしてプロジェクトをデプロイするのと同じです。


🗂 `hardhat.config.js` ファイルを編集する
---------------------------------

`hardhat.config.js` ファイルを変更する必要があります。

これは、スマートコントラクトプロジェクトのルートディレクトリにあります。

- `nft-collectible/hardhat.config.js`

- 今回は、`nft-collectible` ディレクトリの直下に `hardhat.config.js` が存在するはずです。

例）ターミナル上で `nft-collectible` に移動し、`ls` を実行した結果
```
README.md			package-lock.json
artifacts			package.json
cache				scripts
contracts			test
hardhat.config.js
```

`hardhat.config.js` を VS Code で開いて、中身を下記のように更新しましょう。

```javascript
// hardhat.config.js

require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

const { API_URL, PRIVATE_KEY } = process.env;

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "rinkeby",
  networks: {
    rinkeby: {
      url: API_URL,
      accounts: [PRIVATE_KEY]
    }
  },
};
```

これで、`.env` に定義した `API_URL` と `PRIVATE_KEY` の値が呼び出され、`hardhat.config.js` が使用できるようになりました。

🙊 秘密鍵は誰にも教えてはいけません
------------------------

`hardhat.config.js` を更新したら、ここで一度立ち止まりましょう。

**🚨: あなたの個人情報を Github にコミットしたり、他の人に教えてはいけません**。

> ここで取得した Metamask の秘密鍵は、あなたの Mainnet の秘密鍵と同じです。
>
> 秘密鍵が流出してしまうと、誰でもあなたのウォレットにアクセスすることができてしまうので、とても危険です。
>
> **絶対に秘密鍵を自分以外の人が見れる場所に置かないようにしましょう**。
>
> `.env` を設定することで、あなたの個人情報が Github に流出するのを防ぎます。

🚀 Rinkeby Test Network にコントラクトをデプロイする
------------------------

`hardhat.config.js` の更新が完了したら、Rinkeby Test Network にコントラクトをデプロイしてみましょう。

`nft-collectible/scripts` の中に、`deploy.js` というファイルを作成してください。

その中に、`run.js` の中身を下を貼り付けましょう。

⚠️: 注意
> `run.js` はあくまでローカル環境でコントラクトのテストを実行するスクリプトです。
>
> 一方、`deploy.js` はテストネットやメインネットに実際にコントラクトをデプロイするときに使用するスクリプトです。
>
> `run.js` と `deploy.js` は分けて管理することをおすすめします。


`deploy.js` が作成できたら、ターミナル上で `nft-collectible` ディレクトリに移動し、下記のコマンドを実行しましょう。

```bash
npx hardhat run scripts/deploy.js --network rinkeby
```

下記のような結果がターミナルに出力されていることを確認してください。

```bash
Contract deployed to: 0x97517fEEEA81d82aA637C8c3d901771155EF4bca
10 NFTs have been reserved
Owner has tokens:  [
  BigNumber { value: "0" },
  BigNumber { value: "1" },
  BigNumber { value: "2" },
  BigNumber { value: "3" },
  BigNumber { value: "4" },
  BigNumber { value: "5" },
  BigNumber { value: "6" },
  BigNumber { value: "7" },
  BigNumber { value: "8" },
  BigNumber { value: "9" },
  BigNumber { value: "10" },
  BigNumber { value: "11" },
  BigNumber { value: "12" }
]
```

あなたのターミナル上で、`Contract deployed to` の後に出力されたコントラクトアドレス（ `0x..` ）をコピーして、保存しておきましょう。

後でフロントエンドを構築する際に必要となります。

👀 Etherscanでトランザクションを確認する
------------------------

`Contract deployed to:` に続くアドレス（ `0x..` ）をコピーして、[Etherscan](https://rinkeby.etherscan.io/) に貼り付けてみましょう。

あなたのスマートコントラクトのトランザクション履歴が確認できます。

- Etherscan は、イーサリアムネットワーク上のトランザクションに関する情報を確認するのに便利なプラットフォームです。

- *表示されるまでに約1分かかり場合があります。*

下記のような結果が、Rinkeby Etherscan 上で確認できれば、テストネットへのデプロイは成功です。

![無題](https://i.imgur.com/zIgjjwb.png)

**デプロイのデバッグに Rinkeby Etherscan 使うことに慣れましょう。**

Rinkeby Etherscan はデプロイを追跡する最も簡単な方法であり、問題を特定するのに適しています。

- Etherscan にトランザクションが表示されないということは、まだ処理中か、何か問題があったということになります。

🙋‍♂️ 質問する
-------------------------------------------
ここまでの作業で何かわからないことがある場合は、Discord の `#section-1-help` sで質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください✨
```
1. 何をしようとしていたか
2. エラー文をコピー&ペースト
3. エラー画面のスクリーンショット
```
-------------------------------------------
Rinkeby Test Network へのデプロイが完了したら、次のレッスンに進みましょう🎉

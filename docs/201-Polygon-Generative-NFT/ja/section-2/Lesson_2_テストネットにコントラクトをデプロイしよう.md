### 🖥 本番環境の構築を行う

ローカル環境のイーサリアムネットワークを終了します。

- ターミナルを閉じれば完了です。

これから、実際のブロックチェーンにコントラクトをデプロイするための環境を構築していきます。
### 💳 トランザクション

**イーサリアムネットワーク上でブロックチェーンに新しく情報を書き込むこと**を、**トランザクション**と呼びます。

ここまでのレッスンに登場した**トランザクション**は以下です。

- **新規にスマートコントラクトをデプロイした**という情報をブロックチェーンに書き込む。

- **NFT が Mint されたという情報**をブロックチェーンに書き込む。

- **NFT を 10 点、コントラクト所有者のためにキープした**情報をブロックチェーンに書き込む。

トランザクションにはマイナーの承認が必要ですので、Alchemy を導入します。

Alchemy は、世界中のトランザクションを一元化し、マイナーの承認を促進するプラットフォームです。

[こちら](https://www.alchemy.com/) から Alchemy のアカウントを作成してください。
### 💎 Alchemyでネットワークを作成

Alchemy のアカウントを作成したら、`CREATE APP` ボタンを押してください。
![](/public/images/201-Polygon-Generative-NFT/section-2/2_2_1.png)

次に、下記の項目を埋めていきます。下図を参考にしてください。

![](/public/images/201-Polygon-Generative-NFT/section-2/2_2_2.png)
- `NAME`: プロジェクトの名前（例: `NFTCollectible`）
- `DESCRIPTION`: プロジェクトの概要
- `ENVIRONMENT`: `Development` を選択。
- `CHAIN`: `Ethereum` を選択。
- `NETWORK`: `Rinkeby` を選択。

それから、作成した App の `VIEW DETAILS` をクリックします。

![](/public/images/201-Polygon-Generative-NFT/section-2/2_2_3.png)

プロジェクトを開いたら、`VIEW KEY` ボタンをクリックします。

![](/public/images/201-Polygon-Generative-NFT/section-2/2_2_4.png)

ポップアップが開くので、`HTTP` のリンクをコピーしてください。

これがあなたが本番環境のネットワークに接続する際に使用する `API Key` になります。

- **`API Key` は、今後必要になるので、PC上のわかりやすいところに保存しておきましょう。**
### 🦊 MetaMask をダウンロードする

次に、イーサリアムウォレットをダウンロードしましょう。

このプロジェクトでは MetaMask を使用します。

- [こちら](https://MetaMask.io/download.html) からブラウザの拡張機能をダウンロードし、MetaMask ウォレットをあなたのブラウザに設定します。

すでに別のウォレットをお持ちの場合でも、今回は MetaMask を使用してください。

>✍️: MetaMask が必要な理由
> ユーザーが、スマートコントラクトを呼び出すとき、本人のイーサリアムアドレスと秘密鍵を備えたウォレットが必要となります。
> - これは、認証作業のようなものです。
### 🐣 テストネットから始める

今回のプロジェクトでは、コスト（＝ 本物の ETH）が発生するイーサリアムメインネットではなく、**テストネットにコントラクトをデプロイします。**

テストネットはイーサリアムメインネットを模しています。

- イーサリアムメインネットにコントラクトをデプロイした際に発生するイベントのテストを行うのに最適です。

- テストネットは偽の ETH を使用しているため、いくらでもトランザクションのテストを行えます。

今回は、以下のイベントをテストしていきます。

1\. トランザクションの発生を世界中のマイナーたちに知らせる

2\. あるマイナーがトランザクションを発見する

3\. そのマイナーがトランザクションを承認する

4\. そのマイナーがトランザクションを承認したことをほかのマイナーたちに知らせ、トランザクションのコピーを更新する

このセクションでは、コードを書きながら、これらのイベントについての理解を深めていきます。
### 🚰 偽の ETH を取得する

今回は、`Rinkeby` というイーサリアム財団によって運営されているテストネットを使用します。

`Rinkeby` にコントラクトをデプロイし、コードのテストを行うために、偽の ETH を取得しましょう。ユーザーが偽の ETH を取得するために用意されたインフラは、「フォーセット（＝蛇口）」と呼ばれています。

フォーセットを使用する前に、あなたの MetaMask ウォレットを `Rinkeby Test Network` に設定してください。

>✍️: MetaMask で `Rinkeby Test Network` を設定する方法
> 1 \. MetaMask ウォレットのネットワークトグルを開く。
> ![](/public/images/201-Polygon-Generative-NFT/section-2/2_2_5.png)
>
> 2 \. `Show/hide test networks` をクリック。
> ![](/public/images/201-Polygon-Generative-NFT/section-2/2_2_6.png)
>
> 3 \. `Show test networks` を `ON` にする。
> ![](/public/images/201-Polygon-Generative-NFT/section-2/2_2_7.png)
>
> 4 \. `Rinkeby Test Network` を選択する。
> ![](/public/images/201-Polygon-Generative-NFT/section-2/2_2_8.png)

MetaMask ウォレットに `Rinkeby Test Network` が設定されたら、下記のリンクの中から条件に合うものを選んで、少量の偽 ETH を取得しましょう。
- [MyCrypto](https://app.mycrypto.com/faucet) - 0.01 ETH（その場でもらえる）
- [Official Rinkeby](https://faucet.rinkeby.io/) - 3 / 7.5 / 18.75 ETH ( 8 時間 / 1 日 / 3 日)
- [Chainlink](https://faucets.chain.link/rinkeby) - 0.1 ETH（その場でもらえる）
  * Chainlink を使うときは `Connect wallet` をクリックして MetaMask と接続する必要があります。
### 🤫 機密情報を隠す

まず、`dotenv` ライブラリを使用して、先ほど作成した `Alchemy URL` とあなたの MetaMask の秘密鍵を隠していきます。

`.env` というファイルを `nft-collectible` ディレクトリ内に作成し、下記のように編集しましょう。

```
API_URL="YOUR_ALCHEMY_API_URL"
PRIVATE_KEY="YOUR_PRIVATE_RINKEBY_ACCOUNT_KEY"
```
※ ターミナルで `ls` を押すと（コマンドプロンプトでは `dir`）、隠しファイルを確認できます。

1\. `YOUR_ALCHEMY_API_URL`の取得
> `.env` の `YOUR_ALCHEMY_API_URL` の部分を先ほど取得した Alchemy の URL（ `HTTP` リンク） と入れ替えます。

2\. `YOUR_PRIVATE_RINKEBY_ACCOUNT_KEY` の取得
> 1\. お使いのブラウザから、MetaMask プラグインをクリックして、ネットワークを `Rinkeby Test Network` に変更します。
>
> ![](/public/images/201-Polygon-Generative-NFT/section-2/2_2_9.png)
>
> 2\. それから、`Account details` を選択してください。
> ![](/public/images/201-Polygon-Generative-NFT/section-2/2_2_10.png)
>
> 3\. `Account details` から `Export Private Key` をクリックしてください。
>
> ![](/public/images/201-Polygon-Generative-NFT/section-2/2_2_11.png)
>
> 4\. MetaMask のパスワードを求められるので、入力したら `Confirm` を推します。
>
> ![](/public/images/201-Polygon-Generative-NFT/section-2/2_2_12.png)
>
> 5\. あなたの秘密鍵（＝ `Private Key` ）が表示されるので、クリックしてコピーします。
>
> ![](/public/images/201-Polygon-Generative-NFT/section-2/2_2_13.png)
>
> `.env` の `YOUR_PRIVATE_RINKEBY_ACCOUNT_KEY` の部分をここで取得した秘密鍵とを入れ替えます。

>**✍️: スマートコントラクトをデプロイするのに秘密鍵が必要な理由**
> **新しくスマートコントラクトをイーサリアムネットワーク上にデプロイすること**も、トランザクションの一つです。
>
> トランザクションを行うためには、ブロックチェーンに「ログイン」する必要があります。
>
> 「ログイン」には下記の情報が必要となります。
> - ユーザー名: MetaMask の公開アドレス
> - パスワード: MetaMask の秘密鍵
>
> ユーザー名とパスワードを使用して、AWS にログインしてプロジェクトをデプロイするのと同じです。
### 🗂 `hardhat.config.js` ファイルを編集する

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

require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const { API_URL, PRIVATE_KEY } = process.env;

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.9",
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
### 🙊 秘密鍵は誰にも教えてはいけません

`hardhat.config.js` を更新したら、ここで一度立ち止まりましょう。

**🚨: あなたの個人情報を GitHub にコミットしたり、ほかの人に教えてはいけません**。

> ここで取得した MetaMask の秘密鍵は、あなたの Mainnet の秘密鍵と同じです。
>
> 秘密鍵が流出してしまうと、誰でもあなたのウォレットにアクセスすることができてしまうので、とても危険です。
>
> **絶対に秘密鍵を自分以外の人が見れる場所に置かないようにしましょう**。
### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#section-2` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 3 点を記載してください✨
```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```
---
Rinkeby Test Network へのデプロイが完了したら、次のレッスンに進みましょう🎉

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

トランザクションにはマイナーの承認が必要ですので、Alchemyを導入します。

Alchemyは、世界中のトランザクションを一元化し、マイナーの承認を促進するプラットフォームです。

[こちら](https://www.alchemy.com/) からAlchemyのアカウントを作成してください。
### 💎 Alchemyでネットワークを作成

Alchemyのアカウントを作成したら、`CREATE APP`ボタンを押してください。
![](/public/images/Polygon-Generative-NFT/section-2/2_2_1.png)

次に、下記の項目を埋めていきます。下図を参考にしてください。

![](/public/images/Polygon-Generative-NFT/section-2/2_2_2.png)

- `NAME`: プロジェクトの名前(例: `NFTCollectible`)
- `DESCRIPTION`: プロジェクトの概要
- `CHAIN`: `Ethereum`を選択。
- `NETWORK`: `sepolia`を選択。

それから、作成したAppの`VIEW DETAILS`をクリックします。

![](/public/images/Polygon-Generative-NFT/section-2/2_2_3.png)

プロジェクトを開いたら、`VIEW KEY`ボタンをクリックします。

![](/public/images/Polygon-Generative-NFT/section-2/2_2_4.png)

ポップアップが開くので、`HTTP`のリンクをコピーしてください。

これがあなたが本番環境のネットワークに接続する際に使用する`API Key`になります。

- **`API Key`は、今後必要になるので、PC上のわかりやすいところに保存しておきましょう。**
### 🦊 MetaMask をダウンロードする

次に、イーサリアムウォレットをダウンロードしましょう。

このプロジェクトではMetaMaskを使用します。

- [こちら](https://MetaMask.io/download.html) からブラウザの拡張機能をダウンロードし、MetaMaskウォレットをあなたのブラウザに設定します。

すでに別のウォレットをお持ちの場合でも、今回はMetaMaskを使用してください。

>✍️: MetaMask が必要な理由
> ユーザーが、スマートコントラクトを呼び出すとき、本人のイーサリアムアドレスと秘密鍵を備えたウォレットが必要となります。
> - これは、認証作業のようなものです。
### 🐣 テストネットから始める

今回のプロジェクトでは、コスト（＝ 本物のETH）が発生するイーサリアムメインネットではなく、**テストネットにコントラクトをデプロイします。**

テストネットはイーサリアムメインネットを模しています。

- イーサリアムメインネットにコントラクトをデプロイした際に発生するイベントのテストを行うのに最適です。

- テストネットは偽のETHを使用しているため、いくらでもトランザクションのテストを行えます。

今回は、以下のイベントをテストしていきます。

1\. トランザクションの発生を世界中のマイナーたちに知らせる

2\. あるマイナーがトランザクションを発見する

3\. そのマイナーがトランザクションを承認する

4\. そのマイナーがトランザクションを承認したことをほかのマイナーたちに知らせ、トランザクションのコピーを更新する

このセクションでは、コードを書きながら、これらのイベントについての理解を深めていきます。
### 🚰 偽の ETH を取得する

今回は、`Sepolia`というイーサリアム財団によって運営されているテストネットを使用します。

`Sepolia`にコントラクトをデプロイし、コードのテストを行うために、偽のETHを取得しましょう。ユーザーが偽のETHを取得するために用意されたインフラは、「フォーセット（＝蛇口）」と呼ばれています。

フォーセットを使用する前に、あなたのMetaMaskウォレットを`Sepolia Test Network`に設定してください。

>✍️: MetaMask で`Sepolia Test Network`を設定する方法
> 1 \. MetaMask ウォレットのネットワークトグルを開く。
> ![](/public/images/Polygon-Generative-NFT/section-2/2_2_5.png)
>
> 2 \. `Show/hide test networks`をクリック。
> ![](/public/images/Polygon-Generative-NFT/section-2/2_2_6.png)
>
> 3 \. `Show test networks`を`ON`にする。
> ![](/public/images/Polygon-Generative-NFT/section-2/2_2_7.png)
>
> 4 \. `Sepolia Test Network`を選択する。
> ![](/public/images/Polygon-Generative-NFT/section-2/2_2_8.png)

MetaMaskウォレットに`Sepolia Test Network`が設定されたら、下記のリンクの中から条件に合うものを選んで、少量の偽ETHを取得しましょう。

- [Alchemy](https://sepoliafaucet.com/) - 1 Sepolia ETH（24時間に1度もらうことができる）
  - ウォレットアドレスを入力して`Send Me ETH`ボタンを押下するとその場でもらえます。

### 🤫 機密情報を隠す

まず、`dotenv`ライブラリを使用して、先ほど作成した`Alchemy URL`とあなたのMetaMaskの秘密鍵を隠していきます。

`.env`というファイルを`packages/contract`ディレクトリ内に作成し、下記のように編集しましょう。

```
API_URL="YOUR_ALCHEMY_API_URL"
PRIVATE_KEY="YOUR_PRIVATE_SEPOLIA_ACCOUNT_KEY"
```
※ ターミナルで`ls`を押すと(コマンドプロンプトでは`dir`)、隠しファイルを確認できます。

1\. `YOUR_ALCHEMY_API_URL`の取得
> `.env`の`YOUR_ALCHEMY_API_URL`の部分を先ほど取得した Alchemy の URL（ `HTTP`リンク） と入れ替えます。

2\. `YOUR_PRIVATE_SEPOLIA_ACCOUNT_KEY`の取得
> 1\. お使いのブラウザから、MetaMask プラグインをクリックして、ネットワークを`Sepolia Test Network`に変更します。
>
> ![](/public/images/Polygon-Generative-NFT/section-2/2_2_8.png)
>
> 2\. それから、`Account details`を選択してください。
> ![](/public/images/Polygon-Generative-NFT/section-2/2_2_10.png)
>
> 3\. `Account details`から`Export Private Key`をクリックしてください。
>
> ![](/public/images/Polygon-Generative-NFT/section-2/2_2_11.png)
>
> 4\. MetaMask のパスワードを求められるので、入力したら`Confirm`を推します。
>
> ![](/public/images/Polygon-Generative-NFT/section-2/2_2_12.png)
>
> 5\. あなたの秘密鍵（＝ `Private Key` ）が表示されるので、クリックしてコピーします。
>
> ![](/public/images/Polygon-Generative-NFT/section-2/2_2_13.png)
>
> `.env`の`YOUR_PRIVATE_SEPOLIA_ACCOUNT_KEY`の部分をここで取得した秘密鍵とを入れ替えます。

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
### 🗂 `hardhat.config.js`ファイルを編集する

`hardhat.config.js`ファイルを変更する必要があります。

これは、スマートコントラクトプロジェクトのルートディレクトリにあります。

- `packages/contract/hardhat.config.js`

- 今回は、`contract`ディレクトリの直下に`hardhat.config.js`が存在するはずです。

例)ターミナル上で`packages/contract`に移動し、`ls`を実行した結果
```
README.md         artifacts         cache             contracts         hardhat.config.js node_modules      package.json      scripts           test
```

`hardhat.config.js`をVS Codeで開いて、中身を下記のように更新しましょう。

```javascript
require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "sepolia",
  networks: {
    sepolia: {
      url: API_URL,
      accounts: [PRIVATE_KEY]
    }
  },
};
```

これで、`.env`に定義した`API_URL`と`PRIVATE_KEY`の値が呼び出され、`hardhat.config.js`が使用できるようになりました。
### 🙊 秘密鍵は誰にも教えてはいけません

`hardhat.config.js`を更新したら、ここで一度立ち止まりましょう。

**🚨: あなたの個人情報を GitHub にコミットしたり、ほかの人に教えてはいけません**。

> ここで取得した MetaMask の秘密鍵は、あなたの Mainnet の秘密鍵と同じです。
>
> 秘密鍵が流出してしまうと、誰でもあなたのウォレットにアクセスすることができてしまうので、とても危険です。
>
> **絶対に秘密鍵を自分以外の人が見れる場所に置かないようにしましょう**。
### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#polygon`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください✨
```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```
---
Sepolia Test Networkへのデプロイが完了したら、次のレッスンに進みましょう🎉

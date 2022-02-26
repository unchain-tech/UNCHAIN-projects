🖥 本番環境の構築を行う
------------------

ローカル環境のイーサリアムネットワークを終了します。

- ターミナルを閉じれば完了です。

これから、実際のブロックチェーンにコントラクトをデプロイするための環境を構築していきます。

💳 トランザクション
------------------
**イーサリアムネットワーク上でブロックチェーンに新しく情報を書き込むこと**を、**トランザクション**と呼びます。

ここまでのレッスンに登場した**トランザクション**は以下です。

- **新規にスマートコントラクトをデプロイした**という情報をブロックチェーン上に書き込む。

- **WEBサイト上で送信された「👋（wave）」の数**をブロックチェーンに書き込む。

トランザクションにはマイナーの承認が必要なので、Alchemy を導入します。

Alchemy は、世界中のトランザクションを一元化し、マイナーの承認を促進するプラットフォームです。

[こちら](https://www.alchemy.com/) から Alchemy のアカウントを作成してください。

💎 Alchemyでネットワークを作成
------------------
Alchemyのアカウントを作成したら、`CREATE APP` ボタンを押してください。

![](/public/images/ETH-dApp/section-2/2_2_1.png)
次に、下記の項目を埋めていきます。下図を参考にしてください。

![](/public/images/ETH-dApp/section-2/2_2_2.png)
- `NAME`: プロジェクトの名前（例: `WavePortal` ）
- `DESCRIPTION`: プロジェクトの概要
- `ENVIRONMENT`: `Development` を選択。
- `CHAIN`: `Ethereum` を選択。
- `NETWORK`: `Rinkeby` を選択。

それから、作成した App の `VIEW DETAILS` をクリックします。
![](/public/images/ETH-dApp/section-2/2_2_3.png)

プロジェクトを開いたら、`VIEW KEY` ボタンをクリックします。
![](/public/images/ETH-dApp/section-2/2_2_4.png)
ポップアップが開くので、`HTTP` のリンクをコピーしてください。

これがあなたが本番環境のネットワークに接続する際に使用する `API Key` になります。

- **`API Key` は、今後必要になるので、PC上のわかりやすいところに保存しておきましょう。**

🐣 テストネットから始める
------------

今回のプロジェクトでは、コスト（＝ 本物のETH ）が発生するメインネットではなく、**テストネットにコントラクトをデプロイします。**

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
>
> ![](/public/images/ETH-dApp/section-2/2_2_13.png)

> 2 \. `Show/hide test networks` をクリック。
>
> ![](/public/images/ETH-dApp/section-2/2_2_14.png)

> 3 \. `Show test networks` を `ON` にする。
>
> ![](/public/images/ETH-dApp/section-2/2_2_15.png)

> 4 \. `Rinkeby Test Network` を選択する。
>
>![](/public/images/ETH-dApp/section-2/2_2_16.png)

MetaMask ウォレットに `Rinkeby Test Network` が設定されたら、下記のリンクの中から条件に合うものを選んで、少量の偽 ETH を取得しましょう。

| WEBサイト|リンク| 偽ETHの取得額| 取得までにかかる時間|
| ---------------- | ------------------------------------- | --------------- | ------------ |
| MyCrypto         | https://app.mycrypto.com/faucet       | 0.01            | なし         |
| Buildspace       | https://buildspace-faucet.vercel.app/ | 0.025           | 1日           |
| Ethily           | https://ethily.io/rinkeby-faucet/     | 0.2             | 1週間           |
| Official Rinkeby | https://faucet.rinkeby.io/            | 3 / 7.5 / 18.75 | 8時間 / 1日 / 3日 |
| Chainlink        | https://faucets.chain.link/rinkeby    | 0.1             | なし         |

📈 `hardhat.config.js` ファイルを編集する
---------------------------------

`hardhat.config.js` ファイルを変更する必要があります。

これは、スマートコントラクトプロジェクトのルートディレクトリにあります。

- 今回は、`my-wave-portal` ディレクトリの直下に `hardhat.config.js` が存在するはずです。

例）ターミナル上で `my-wave-portal` に移動し、`ls` を実行した結果
```
yukis4san@Yukis-MacBook-Pro my-wave-portal % ls
README.md			package-lock.json
artifacts			package.json
cache				scripts
contracts			test
hardhat.config.js
```

`hardhat.config.js` を VS Code で開いて、中身を編集していきます。
```javascript
// hardhat.config.js
require("@nomiclabs/hardhat-waffle");
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: "YOUR_ALCHEMY_API_URL",
      accounts: ["YOUR_PRIVATE_RINKEBY_ACCOUNT_KEY"],
    },
  },
};
```

1. \. `YOUR_ALCHEMY_API_URL`の取得

> `hardhat.config.js` の `YOUR_ALCHEMY_API_URL` の部分を先ほど取得した Alchemy の URL（ `HTTP` リンク） と入れ替えます。

2. \. `YOUR_PRIVATE_RINKEBY_ACCOUNT_KEY` の取得
> 1. お使いのブラウザから、Metamask プラグインをクリックして、ネットワークを `Rinkeby Test Network` に変更します。
>
> ![](/public/images/ETH-dApp/section-2/2_2_5.png)
>
> 2. それから、`Account details` を選択してください。
>
> ![](/public/images/ETH-dApp/section-2/2_2_6.png)
>
> 3. `Account details` から `Export Private Key` をクリックしてください。
>
> ![](/public/images/ETH-dApp/section-2/2_2_7.png)
>
> 4. Metamask のパスワードを求められるので、入力したら `Confirm` を推します。
>
> ![](/public/images/ETH-dApp/section-2/2_2_8.png)
>
> 5. あなたの秘密鍵（＝ `Private Key` ）が表示されるので、クリックしてコピーします。
>
> ![](/public/images/ETH-dApp/section-2/2_2_9.png)
>
> - `hardhat.config.js` の `YOUR_PRIVATE_RINKEBY_ACCOUNT_KEY` の部分をここで取得した秘密鍵とを入れ替えます。

🙊 秘密鍵は誰にも教えてはいけません
------------------------

`hardhat.config.js` を更新したら、ここで一度立ち止まりましょう。

**🚨: `hardhat.config.js` ファイルをあなたの秘密鍵の情報を含んだ状態で Github にコミットしてはいけません**。

> この秘密鍵は、あなたのメインネットの秘密鍵と同じです。
>
> 秘密鍵が流出してしまうと、誰でもあなたのウォレットにアクセスすることができてしまうので、とても危険です。
>
> **絶対に秘密鍵を自分以外の人が見れる場所に置かないようにしましょう**。

下記を実行して、VS Code で `.gitignore` ファイルを編集しましょう。
```
code .gitignore
```
`.gitignore` に `hardhat.config.js` の行を追加します。

`.gitignore` の中身が下記のようになっていれば、問題ありません。

```bash
node_modules
.env
coverage
coverage.json
typechain

#Hardhat files
cache
artifacts
hardhat.config.js
```

`.gitignore` に記載されているファイルやディレクトリは、Github にディレクトリをプッシュされずに、ローカル環境にのみ保存されます。

**✍️: スマートコントラクトをデプロイするのに秘密鍵が必要な理由**

> **新しくスマートコントラクトをイーサリアムネットワーク上にデプロイすること**も、トランザクションの一つです。
>
> トランザクションを行うためには、ブロックチェーンに「ログイン」する必要があります。
>
> 「ログイン」には下記の情報が必要となります。
> - ユーザー名: 公開アドレス
>
> ![](/public/images/ETH-dApp/section-2/2_2_10.png)
>
> - パスワード: 秘密鍵
>
> ![](/public/images/ETH-dApp/section-2/2_2_11.png)
>
> ユーザー名とパスワードを使用して、AWS にログインしてプロジェクトをデプロイするのと同じです。

🚀 Rinkeby Test Network にコントラクトをデプロイする
------------------------

`hardhat.config.js` の更新が完了したら、Rinkeby Test Network にコントラクトをデプロイしてみましょう。

ターミナル上で `my-wave-portal` ディレクトリに移動し、下記のコマンドを実行しましょう。

```bash
npx hardhat run scripts/deploy.js --network rinkeby
```

下記のような結果が出力されていれば成功です🎉

```bash
Deploying contracts with account: 0x821d451FB0D9c5de6F818d700B801a29587C3dCa
Account balance: 352858095262705541
WavePortal address: 0x489BdD5f9ad2D061F0bC648fd0A06e4D024A9a81
```

あなたのターミナル上で、`WavePortal address` の後に出力されたコントラクトアドレス（ `0x..` ）をコピーして、保存しておきましょう。後でフロントエンドを構築する際に必要となります。

例）出力されたコントラクトアドレスをコピー

![](/public/images/ETH-dApp/section-2/2_2_12.png)

👀 Etherscanでトランザクションを確認する
------------------------
コピーした `WavePortal address` アドレスを、[Etherscan](https://rinkeby.etherscan.io/) に貼り付けて、あなたのスマートコントラクトのトランザクション履歴を見てみましょう。

Etherscan は、イーサリアムネットワーク上のトランザクションに関する情報を確認するのに便利なプラットフォームです。

*表示されるまでに約1分かかり場合があります。*

🙋‍♂️ 質問する
-------------------------------------------
ここまでの作業で何かわからないことがある場合は、Discord の `#section-2-help` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください✨
```
1. 何をしようとしていたか
2. エラー文をコピー&ペースト
3. エラー画面のスクリーンショット
```
-------------------------------------------
Rinkeby Test Network にスマートコントラクトをデプロイしたら、次のレッスンに進みましょう。

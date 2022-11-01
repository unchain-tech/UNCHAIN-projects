### 🍪 thirdweb のセットアップをしよう

前回までの Lesson でユーザーのウォレット接続ができるようになりました。

つまり、ユーザーが DAO に参加しているかどうかをチェックできるようになったということです。

一般的に、ユーザーが DAO に参加するためにはメンバーシップ NFT を所有する必要があります。

もし、メンバーシップ NFT を持っていなければ、メンバーシップ NFT をミントし、DAO に参加するよう促しましょう。

ただし、NFT をミントするためには、独自の NFT スマートコントラクトを作成し、デプロイする必要がでてきます。

**そこで [thirdweb](https://thirdweb.com/) の出番となるわけ**です。

[thirdweb](https://thirdweb.com/) は、Solidity を一切書かずにスマートコントラクトを作成するためのツール一式を提供してくれるのです。

このプロジェクトでは、Solidity を書きません。

必要なのは、コントラクトを作成し、デプロイするために TypeScript で書かれたスクリプトを記述することだけです。

[thirdweb](https://thirdweb.com/) は、作成された安全で標準的な[コントラクト](https://github.com/thirdweb-dev/contracts)を使用します。

興味のある方はぜひ覗いてみてください。

thirdweb を利用してコントラクトをデプロイすると、クライアントサイド SDK を通してフロントエンドから簡単にそれらのコントラクトとやりとりができます。

Solidity のコードを書くのに比べて、thirdweb でスマートコントラクトを作るのがいかに簡単であるかは明らかです。

では、さっそくコードを書いていきましょう。

[thirdweb のダッシュボード](https://thirdweb.com/dashboard)から、コードを書かずにコントラクトを作成することもできますが、このプロジェクトでは TypeScript を使って実装していくことにします。

※ thirdweb はデータベースを持っておらず、あなたのデータはすべてオンチェーンに保存されます。


### 📝 環境変数を設定しよう

thirdweb を使って Goerli にコントラクトを作成し、デプロイするためにはスクリプトをいくつか作成する必要があります。

その前に、まずはプロジェクトのルートに以下の `.env.local` ファイルを作成しましょう。

ここに記載する情報は誰にも教えてはならない情報なので、取り扱いには十分に注意しましょう。

```plaintext
PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE
WALLET_ADDRESS=YOUR_WALLET_ADDRESS
ALCHEMY_API_URL=YOUR_ALCHEMY_API_URL
```

> ⚠️ 注意：thirdweb は、あなたに代わってコントラクトをデプロイするために、これらすべての環境変数を必要とします。
>
> 秘密鍵を盗まれてしまう恐れがあるので、**`.env.local` ファイルを GitHub にコミットしないよう気をつけてください**。

各値は、こちらのリンクを参照してください。

[PRIVATE_KEY の取得](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key)

[WALLET_ADDRESS の取得](https://metamask.zendesk.com/hc/en-us/articles/360015289512-How-to-copy-your-MetaMask-account-public-address-)

※ ALCHEMY_API_URL の取得方法については以下で解説していきます。


### 💎 Alchemy でネットワークを作成

Alchemy のアカウントを作成したら、`CREATE APP` ボタンを押してください。

![](/public/images/ETH-DAO/section-2/2_1_1.png)

※ Ecosystem 選択欄が出てきた場合は `Ethereum` を選択しましょう。

![](/public/images/ETH-DAO/section-2/2_1_2.png)

次に、下記の項目を埋めていきます。

![](/public/images/ETH-DAO/section-2/2_1_3.png)

- `NAME`: プロジェクトの名前（例: `MyDAO`）
- `DESCRIPTION`: プロジェクトの概要
- `CHAIN`: `Ethereum` を選択
- `NETWORK`: `Goerli` を選択

それから、作成した App の `VIEW DETAILS` をクリックします。

![](/public/images/ETH-DAO/section-2/2_1_4.png)

プロジェクトを開いたら、`VIEW KEY` ボタンをクリックします。

![](/public/images/ETH-DAO/section-2/2_1_5.png)

ポップアップが開くので、`HTTP` のリンクをコピーしてください。

これがあなたが本番環境のネットワークに接続する際に使用する `API Key` になります。

- **`API Key` は、今後必要になるので、PC 上のわかりやすいところに保存しておきましょう。**


### 🐣 テストネットから始める

今回のプロジェクトでは、コスト（＝ 本物の ETH）が発生するイーサリアムメインネットではなく、**テストネットにコントラクトをデプロイします。**

テストネットはイーサリアムメインネットを模しています。

- イーサリアムメインネットにコントラクトをデプロイした際に発生するイベントのテストを行うのに最適です。
- テストネットは偽の ETH を使用しているため、いくらでもトランザクションのテストを行えます。

今回は、以下のイベントをテストしていきます。

1. トランザクションの発生を世界中のマイナーたちに知らせる
2. あるマイナーがトランザクションを発見する
3. そのマイナーがトランザクションを承認する
4. そのマイナーがトランザクションを承認したことをほかのマイナーたちに知らせ、トランザクションのコピーを更新する

このセクションでは、コードを書きながら、これらのイベントについての理解を深めていきます。


### 🚰 偽の ETH を取得する

`ALCHEMY_API_URL` についてはこれから取得していきます。

今回は、`Goerli` というイーサリアム財団によって運営されているテストネットを使用します。

`Goerli` にコントラクトをデプロイし、コードのテストを行うために、偽の ETH を取得しましょう。ユーザーが偽の ETH を取得するために用意されたインフラは、「フォーセット（＝蛇口）」と呼ばれています。

フォーセットを使用する前に、あなたの MetaMask ウォレットを `Goerli Test Network` に設定してください。

> ✍️: MetaMask で `Goerli Test Network` を設定する方法
>
> 1 \. MetaMask ウォレットのネットワークトグルを開く。
>
> ![](/public/images/ETH-DAO/section-2/2_1_6.png)
>
> 2 \. `Show/hide test networks` をクリック。
>
> ![](/public/images/ETH-DAO/section-2/2_1_7.png)
>
> 3 \. `Show test networks` を `ON` にする。
>
> ![](/public/images/ETH-DAO/section-2/2_1_8.png)
>
> 4 \. `Goerli Test Network` を選択する。
>
> ![](/public/images/ETH-DAO/section-2/2_1_9.png)

MetaMask ウォレットに `Goerli Test Network` が設定されたら、下記のリンクの中から条件に合うものを選んで、少量の偽 ETH を取得しましょう。

- [Alchemy](https://goerlifaucet.com/) - 0.25 Goerli ETH （24 時間に 1 度もらうことができる）
  - ウォレットアドレスを入力して `Send Me ETH` ボタンを押下するとその場でもらえます。
- [Chainlink](https://faucets.chain.link/) - 0.1 Goerli ETH（その場でもらえる）
  - `Connect wallet` をクリックして MetaMask と接続する必要があります。
  - Twitter アカウントを連携する必要があります。


### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#eth-dao` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 4 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンでは、実際に thirdweb スクリプトを書きメンバーシップ NFT をデプロイします！

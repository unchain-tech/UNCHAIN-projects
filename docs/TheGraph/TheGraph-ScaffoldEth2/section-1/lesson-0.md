---
title: コースの紹介
---
## はじめに

### 🎉 コースの紹介

このワークショップは、Scaffold-ETH 2とThe Graphを中心に構築されています。以下の内容を学びます：

1. Scaffold-ETH 2とThe Graphを使用して、dappの開発環境をセットアップする方法
2. スマートコントラクトの更新とデプロイをする方法
3. The Graphにサブグラフを作成してデプロイする方法
4. フロントエンドを編集して、スマートコントラクトとサブグラフの両方とやり取りする方法

### 🏗 Scaffold-ETH 2 とは 🏗

🧪 イーサリアムブロックチェーン上で分散型アプリケーション（dApps）を構築するためのオープンソースの最新ツールキットです。開発者にとって、スマートコントラクトの作成・デプロイ、およびそれらのコントラクトとやり取りを行うユーザーインタフェースの構築がより簡単に行えることを目的としています。

⚙️ NextJS、RainbowKit、Hardhat、Wagmi、Typescriptを使用して構築されています。

- ✅ **コントラクトのホットリロード**: スマートコントラクトを編集すると、フロントエンドが自動的にそれに適応します。
- 🔥 **バーナーウォレット＆ローカルフォーセット**: バーナーウォレットとローカルフォーセットを使用して、アプリケーションを素早くテストします。
- 🔐 **ウォレットプロバイダーとの統合**: 異なるウォレットプロバイダーに接続し、Ethereumネットワークとやり取りします。

![](/images/TheGraph-ScaffoldEth2/section-0/0_1_1.png)

![](/images/TheGraph-ScaffoldEth2/section-0/0_1_2.png)

![](/images/TheGraph-ScaffoldEth2/section-0/0_1_3.png)

![](/images/TheGraph-ScaffoldEth2/section-0/0_1_4.png)

Scaffold-ETHについてもっと知りたい場合は、[Github リポジトリ](https://github.com/scaffold-eth/scaffold-eth-2) や [Scaffoldeth.io](https://scaffoldeth.io) をご覧ください。

### 🧑🏼‍🚀 The Graph とは？

[The Graph](https://thegraph.com/) は、GraphQLを使用してEthereumとIPFS上でdAppを素早く構築するためのプロトコルです。

- 🗃️ **分散型インデックス作成**: The Graphは、効率的にブロックチェーンデータをインデックス化・整理するためのオープンAPI（「サブグラフ」）を可能にします。
- 🔎 **効率的なクエリ**: プロトコルは、GraphQLを使用してブロックチェーンデータを効率的にクエリできます。
- 🙌 **コミュニティエコシステム**: The Graphは、開発者がサブグラフを構築・デプロイ・共有できることで、コラボレーションを促進します！

詳しい手順と背景については、[Getting Started Guide](https://thegraph.com/docs/en/cookbook/quick-start) をご覧ください。

### 🧱 何を構築するのか

イベントデータのデータストレージにThe Graphプロトコルを利用するスマートコントラクトとフロントエンドを構築します。

https://sendmessage-tau.vercel.app

![](/images/TheGraph-ScaffoldEth2/section-0/0_1_5.png)

### 🌍 プロジェクトをアップグレードする

この学習コンテンツは、[UNCHAIN License](https://github.com/unchain-tech/UNCHAIN-projects/blob/main/LICENSE) のもとで運用されています。

プロジェクトに参加していて、「こうすればもっと分かりやすいのに!」「これは間違っている!」と思ったら、ぜひ`pull request`を送ってください。

GitHubから直接コードを編集して直接`pull request`を送る方法は、[こちら](https://docs.github.com/ja/repositories/working-with-files/managing-files/editing-files#editing-files-in-another-users-repository)を参照してください。

どんなリクエストでも大歓迎です 🎉

また、プロジェクトを自分のGitHubアカウントに`Fork`して、中身を編集してから`pull request`を送ることもできます。

- プロジェクトを`Fork`する方法は、[こちら](https://docs.github.com/ja/get-started/quickstart/fork-a-repo) を参照してください。
- `Fork`から`pull request`を作成する方法は、[こちら](https://docs.github.com/ja/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork) です。

**👋 `UNCHAIN-projects`に`pull request`を送る! ⏩ [UNCHAIN の GitHub](https://github.com/shiftbase-xyz/UNCHAIN-projects) にアクセス!**

### ⚡️ `Issue`を作成する

`pull request`送るほどでもないけど、提案を残したい!　と思ったら、[こちら](https://github.com/unchain-tech/UNCHAIN-projects/issues) に`Issue`を作成してみましょう。

`Issue`の作成方法に関しては、[こちら](https://docs.github.com/ja/issues/tracking-your-work-with-issues/creating-an-issue)を参照してください。

`pull request`や`issue`の作成は、実際にチームで開発を行う際に重要な作業になるので、ぜひトライしてみてください。

UNCHAINのプロジェクトをみんなでより良いものにしていきましょう ✨

---

## 必要条件

## 必要条件

### ✅ 必要なもの

始める前に、以下のツールをインストールする必要があります：

- [Node.js](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) または [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)
- [Docker](https://docs.docker.com/get-docker/)

---

## Scaffold-ETH 2のセットアップ

## Scaffold-ETH 2 のセットアップ

### 🖥️ サブグラフパッケージのセットアップ

まず、Edge and NodeのSimonが作成したScaffold-ETH 2の特別なビルドを使って始めましょう。ありがとう、Simon! 🫡

Scaffold-ETH 2とThe Graphをセットアップするために、合計4つの異なるウィンドウが必要になります。

![](/images/TheGraph-ScaffoldEth2/section-0/0_3_1.png)

```
git clone -b subgraph-package \
  https://github.com/scaffold-eth/scaffold-eth-2.git \
  scaffold-eth-2-subgraph-package
```

これをあなたのマシンにチェックアウトしたら、ディレクトリに移動し、yarnを使用してすべての依存関係をインストールします。

```
cd scaffold-eth-2-subgraph-package && \
  yarn install
```

![](/images/TheGraph-ScaffoldEth2/section-0/0_3_2.png)

次に、スマートコントラクトをデプロイしてテストするために、ローカルブロックチェーンを起動する必要があります。Scaffold-ETH 2はデフォルトでHardhatを使用しています。チェーンを起動するには、次のyarnコマンドを入力します。

```
yarn chain
```

![](/images/TheGraph-ScaffoldEth2/section-0/0_3_3.png)

> このウィンドウを開いたままにしておくと、hardhat コンソールからの出力を確認できます。🖥️

次に、フロントエンドアプリケーションを起動します。Scaffold-ETH 2はデフォルトでNextJSを使用しており、単純なyarnコマンドで起動することもできます。新しいコマンドラインを開き、次のコマンドを入力します。

```
yarn start
```

![](/images/TheGraph-ScaffoldEth2/section-0/0_3_4.png)

> このウィンドウも常に開いておくと、NextJS に加えたコード変更のデバッグ、パフォーマンスのチェック、またはサーバーが適切に動作しているかを確認できます。

次に、スマートコントラクトをデプロイするための第三のウィンドウを開きます。Scaffold-ETHには他にも便利なコマンドがあります。デプロイを行うには、単に以下を実行します…

```
yarn deploy
```

![](/images/TheGraph-ScaffoldEth2/section-0/0_3_5.png)

> デプロイにかかったガスの量と共に、トランザクションとアドレスが表示されるはずです。⛽

http://localhost:3000 にアクセスすると、NextJSアプリケーションが表示されます。Scaffold-ETH 2のメニューや機能を探索してみましょう！ 緊急事態ですね、これはすごい！ 🔥

setGreeting関数にアップデートを送信してテストすることができます。これを行うには、右上のバーナーウォレットアドレスの隣にある現金アイコンをクリックしてガスを入手する必要があります。これにより、フォーセットから1 ETHが送られます。

次に、「Debug Contracts」に移動し、setGreetingの下の文字列フィールドをクリックしてお好きな文字を入力し、「SEND」をクリックします。

![](/images/TheGraph-ScaffoldEth2/section-0/0_3_6.png)

これが完了すると、成功したことを確認するために展開できるTransaction Receiptが表示されます。


---

## The Graphのセットアップ

## The Graph のセットアップ（Docker）

### 🚀 The Graph 統合のセットアップ

ブロックチェーンを起動し、フロントエンドアプリケーションを始動し、スマートコントラクトをデプロイしたので、次はサブグラフを設定し、The Graphを利用しましょう！

まず、古いデータをクリアするために以下のコマンドを実行します。すべてをリセットしたい場合にこれを行ってください。

```
yarn clean-node
```

> これでグラフノードを起動する準備ができました。以下のコマンドを実行しましょう… 🧑‍🚀

```
yarn run-node
```

![](/images/TheGraph-ScaffoldEth2/section-0/0_4_1.png)

これにより、docker-composeを使用してThe Graphのすべてのコンテナが起動します。"Downloading latest blocks from Ethereum..."と表示されたら、完了です。

> 前述の通り、Docker からのログ出力を確認するためにこのウィンドウを開いたままにしておいてください。🔎


---

## ローカルホストにデプロイする

## デプロイ

### ✅ サブグラフの作成と公開

これで、The Graphの設定を完了するために、第4のウィンドウを開くことができます。😅 この4番目のウィンドウでは、ローカルサブグラフを作成します！

> 注意：これは一度だけ行う必要があります。

```
yarn local-create
```

![](/images/TheGraph-ScaffoldEth2/section-0/0_5_1.png)

> サブグラフが作成されたことを示す出力と、docker 内の graph-node でのログ出力が表示されるはずです。

次に、サブグラフを公開します！ このコマンドを実行すると、サブグラフにバージョンを付ける必要があります（例：0.0.1）。

```
yarn local-ship
```

![](/images/TheGraph-ScaffoldEth2/section-0/0_5_2.jpg)

> このコマンドは、以下のことを一度に行います... 🚀🚀🚀

- hardhat/deploymentsフォルダからコントラクトのABIをコピーします
- networks.jsonファイルを生成します
- サブグラフスキーマとコントラクトABIからAssemblyScriptタイプを生成します
- マッピング関数をコンパイルしてチェックします
- ...そして、ローカルサブグラフをデプロイします！

> ts-node のエラーが発生した場合は、次のコマンドでインストールできます。

```
npm install -g ts-node
```

サブグラフのデプロイが成功すると、以下のようになります：

![](/images/TheGraph-ScaffoldEth2/section-0/0_5_3.png)

ビルドが完了し、サブグラフのエンドポイントアドレスが表示されます。

```
Build completed: QmYdGWsVSUYTd1dJnqn84kJkDggc2GD9RZWK5xLVEMB9iP

Deployed to http://localhost:8000/subgraphs/name/scaffold-eth/your-contract/graphql

Subgraph endpoints:
Queries (HTTP):     http://localhost:8000/subgraphs/name/scaffold-eth/your-contract
```


---

## テスト

## テスト

### ✅ サブグラフのテスト

サブグラフのエンドポイントに移動し、確認してみましょう！

> 以下はクエリの例です...

```
  {
    greetings(first: 25, orderBy: createdAt, orderDirection: desc) {
      id
      greeting
      premium
      value
      createdAt
      sender {
        address
        greetingCount
      }
    }
  }
```

![](/images/TheGraph-ScaffoldEth2/section-0/0_6_1.png)

> すべてがうまくいっていて、スマートコントラクトにトランザクションを送信した場合は、同様のデータ出力が表示されるはずです！

次に、The Graphがどのように機能するかをもう少し詳しく説明します。これにより、スマートコントラクトにイベントを追加する際に、フロントエンドアプリケーションに必要なデータのインデックス作成や解析ができるようになります。

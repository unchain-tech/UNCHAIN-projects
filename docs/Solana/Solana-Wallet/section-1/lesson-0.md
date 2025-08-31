---
title: Solanaのウォレット開発にチャレンジしてみよう
---
### 🥭 Solana Wallet 開発プロジェクトへようこそ

このプロジェクトでは、Solana対応のウォレットの開発を行なっていきます。

プロジェクトを進めるには以下の技術が必要です。

- [Terminal 操作](https://qiita.com/ryouzi/items/f9dee1540a04a0bfb9a3)
- [Javascript](https://developer.mozilla.org/ja/docs/Web/JavaScript)
- [React.js](https://ja.reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

### ⛅️ Solana とは何か？

`Solana`（ソラナ）は、スケーラビリティを優先した方法で分散型アプリケーション（dApps）の基盤を提供しようとするプラットフォームです。

`Solana`は、 `Ethereum`, `Cardano`などと競合するブロックチェーン・プロジェクトの1つで、暗号資産を利用した製品やサービスのエコシステムを成長させることを目的としています。

`Solana`は、差別化を図るため、取引決済時間の短縮を図るアーキテクチャ設計の選択と、開発者が複数のプログラミング言語でカスタマイズ可能なアプリケーションを作成・起動できる、柔軟性に重点を置いたインフラを組み合わせて導入しています。

これらの機能を実現するために、 `Solana`のネットワークのネイティブ暗号資産である`SOL`は、カスタムプログラムの実行、トランザクションの送信、 `Solana`ネットワークをサポートする人へのインセンティブに使用されています。

最近ですと、Move and Earnの「STEPN」が`Solana`基盤で作られていることで、注目を浴びてますね 👟

<!-- 参考: https://www.kraken.com/ja-jp/learn/what-is-solana-sol -->

### 👛 ウォレット（Wallet） とは何か？

暗号資産のウォレットは、秘密鍵（あなたの暗号資産にアクセスするためのパスワード）を安全で利用しやすいものにし、`BTC`や`ETH`, そして今回扱う`SOL`などの暗号資産の出入庫を可能にします。ウォレットには、Ledger（USBメモリのようなもの）のようなハードウェアウォレットからモバイルアプリまでさまざまな形態があります。ウォレットを使うと、オンラインでクレジットカードを使って買い物をするのと同じくらい簡単に暗号資産を使用することができます。

<!-- 参考: https://www.coinbase.com/ja/learn/crypto-basics/what-is-a-crypto-wallet -->

### 🛠 何を開発するのか？

このレッスンでは、オンチェーン資金の受け取りと送金によってSolanaブロックチェーン上で資金の確認、エアドロップ、送金ができる最低限の機能的なウォレットを作っていきます。

次のセクションで環境構築を行い、それ以降でウォレットの作成や復元、残高の確認や送金などの機能を開発していきます。

すでに`MetaMask`や`Phantom`といったウォレットを使ったことがある方にとっては、内部の仕組みや動きを知ることができ、ウォレットに対する知識がより深まると思います。

- レッスン完了後の画面イメージ
  ![](/images/Solana-Wallet/section-0/0_1_1.png)

### 🌍 プロジェクトをアップグレードする

[UNCHAIN](https://app.shiftbase.xyz) のプロジェクトは [UNCHAIN License](https://github.com/unchain-tech/UNCHAIN-projects/blob/main/LICENSE) により運用されています。

プロジェクトに参加していて、「こうすればもっと分かりやすいのに!」「これは間違っている!」と思ったら、ぜひ`pull request`を送ってください。

GitHubから直接コードを編集して直接`pull request`を送る方法は、[こちら](https://docs.github.com/ja/repositories/working-with-files/managing-files/editing-files#editing-files-in-another-users-repository)を参照してください。

どんなリクエストでも大歓迎です 🎉

また、プロジェクトを自分のGitHubアカウントに`Fork`して、中身を編集してから`pull request`を送ることもできます。

- プロジェクトを`Fork`する方法は、[こちら](https://docs.github.com/ja/get-started/quickstart/fork-a-repo) を参照してください。
- `Fork`から`pull request`を作成する方法は、[こちら](https://docs.github.com/ja/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork) です。

### ⚡️ `Issue`を作成する

`pull request`送るほどでもないけど、提案を残したい!　と思ったら、[こちら](https://github.com/shiftbase-xyz/UNCHAIN-projects/issues) に`Issue`を作成してみましょう。

`Issue`の作成方法に関しては、[こちら](https://docs.github.com/ja/issues/tracking-your-work-with-issues/creating-an-issue)を参照してください。

`pull request`や`issue`の作成は実際にチームで開発する際、重要な作業になるので、ぜひトライしてみてください。

UNCHAINのプロジェクトをみんなでより良いものにしていきましょう ✨

---

次のレッスンに進んでプログラミングの環境構築しましょう 🎉

---

Documentation created by [mango55555go](https://github.com/mango55555go)（UNCHAIN discord ID: mango55555go#6826）



---

## 環境構築をしよう

### 🛠 環境構築をしていこう

まずはアプリの雛形であるソースコードをもとに、ローカル環境を作成します。

まだ`GitHub`のアカウントをお持ちでない方は、[こちら](https://qiita.com/okumurakengo/items/848f7177765cf25fcde0) の手順に沿ってアカウントを作成してください。

`GitHub`のアカウントをお持ちの方は、下記の手順に沿ってフロントエンドの基盤となるリポジトリをあなたのGitHubに[フォーク](https://denno-sekai.com/github-fork/)しましょう。

1\. [こちら](https://github.com/unchain-tech/Solana-Wallet.git)からunchain-tech/Solana-Walletリポジトリにアクセスをして、ページ右上の`Fork`ボタンをクリックします。

![](/images/Solana-Wallet/section-0/0_2_2.png)

2\. Create a new forkページが開くので、「Copy the `main` branch only」という項目に**チェックが入っていることを確認します**。

![](/images/Solana-Wallet/section-0/0_2_3.png)

3\. 設定が完了したら`Create fork`ボタンをクリックします。あなたのGitHubアカウントに`Solana-Wallet`リポジトリのフォークが作成されたことを確認してください。

それでは、フォークしたリポジトリをローカル環境にクローンしましょう。

`Code`ボタンをクリックして`SSH`を選択し、Gitリンクをコピーしましょう。

![](/images/Solana-Wallet/section-0/0_2_4.png)

ターミナルで任意の作業ディレクトリに移動し、先ほどコピーしたリンクを貼り付け、下記を実行してください。

```
git clone コピーした_github_リンク
```

ターミナル上で`Solana-Wallet`に移動して下記を実行しましょう。

```
npm install
```

`npm`コマンドを実行することで、 `JavaScript`ライブラリのインストールが行われます。

次に、下記を実行してみましょう。

```
npm run dev
```

あなたのローカル環境で、Webサイトのフロントエンドが立ち上がりましたか？

**ローカル環境で表示されている Web サイト**

![](/images/Solana-Wallet/section-0/0_2_1.png)

上記のような形でフロントエンドが確認できれば成功です。

これからフロントエンドの表示を確認したい時は、ターミナルに向かい、`Solana-Wallet`ディレクトリ上で、`npm run dev`を実行します。これからも必要となる作業ですので、よく覚えておいてください。

ターミナルを閉じるときは、以下のコマンドが使えます ✍️

- Mac: `ctrl + c`
- Windows: `ctrl + shift + w`

### 🎁 雛形のソースコードについて

雛形ではすでに [`@solana/web3.js`](https://solana-labs.github.io/solana-web3.js/index.html) というライブラリがインストールされるようになっています。 この`Javascript`で記述されたライブラリは、 `Solana`のプログラムと対話するプログラムを書くのに役立ちます。

また [`Tailwind CSS`](https://tailwindcss.com/) というUtility Firstを掲げて設計されたCSSフレームワークも導入しています。

これからウォレット開発を進めていく上で変更されるファイルは以下になります。

- `pages/index.js`および`components/各コンポーネント/index.js`: メインで変更を加えていくファイル
- `package.json`および`package-lock.json`: ライブラリを新しく追加した際に変更されるファイル

### ✅ テストスクリプトについて

このプロジェクトには、各コンポーネントのテストスクリプトが`components/各コンポーネント/index.test.js`として格納されています。これらは、期待するMVPの機能が実装されているかをテストする内容となっており、テストフレームワークとして[Jest](https://jestjs.io/ja/)を、UIコンポーネントのテストを行うために[Testing Library](https://testing-library.com/)を導入しています。Solanaネットワークとやり取りを行う機能をモック（模擬）しているため、ブラウザ上で実際に動作確認を行うよりもより迅速に機能テストを行うことが可能です。ただし、あくまでも模擬的なので、各コンポーネントの実装ができたら実際にSolanaネットワークを使用した動作確認をブラウザ上で行いましょう！

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#solana`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

ターミナルで`npm run dev`を実行した出力結果をDiscordの`#solana`にシェアしてください!✨ 他の人たちとアウトプットが一致しているか確認したら、次のレッスンに進みましょう!


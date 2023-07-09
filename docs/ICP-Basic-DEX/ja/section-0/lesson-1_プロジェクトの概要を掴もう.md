### 👋 ICP Basic DEX 開発プロジェクトへようこそ！

このプロジェクトでは、オーダーブック形式のトークン取引所を作成しICPにデプロイする方法を学びます。

このプロジェクトを進めるには以下の技術が必要です。

- [Terminal 操作](https://qiita.com/ryouzi/items/f9dee1540a04a0bfb9a3)
- [Motoko](https://internetcomputer.org/docs/current/developer-docs/build/cdks/motoko-dfinity/motoko/)
- [Javascript](https://developer.mozilla.org/ja/docs/Web/JavaScript)
- [React.js](https://ja.reactjs.org/)

※ ICPでの開発が初めての方は、まず`ICP-Static-Site`のプロジェクトから始めることをお勧めします ☺️

いますべてを理解している必要はありません。

わからないことがあったらインターネットで検索したり、コミュニティで質問しながらプロジェクトを進めていきましょう!

### 🌐 IC とは何か？

IC（Internet Computer）とは、トークンやdAppsをホストするためのプラットフォームを提供する汎用ブロックチェーンです。2021年にDFINITY財団によりローンチ・オープンソース化されました。

DFINITY財団は、ICを2009年の暗号通貨（ビットコイン）、2015年のスマートコントラクト（イーサリアム）に続く第3の革新であると述べています。

概念的には既存のインターネットを拡張したもので、アプリケーションを実行するためのリソースをコンピュータのグローバル・ネットワークで提供しようとするものです。これには、世界中の独立運営されるデータセンターが利用されています。

ICの目的は、従来のIT技術（例えばビッグテックのクラウドサービスやファイルシステム、webサーバーなど）に代わりあらゆるシステムとサービスをホストし、完全にオンチェーン化されたweb 3を実現することです。

データの保存にAWSを利用するサービスや、ホストに従来の非分散的なサービスを用いていたアプリケーションもICを利用することで、完全に分散化されたアプリケーションを構築することが可能になります。

### 🛠 何を構築するのか？

今回開発するものは、Fungible token（代替性トークン）の分散型取引所です。分散型取引所は、DEX（Decentralized Exchangesの略称）と呼ばれます。取引の方法は、ユーザーが取引を行いたいトークンとその量をオーダーとして提出し、別のユーザーがそれに応じるオーダーブック形式となります。従来のオーダーブック形式をとるDEXは、売買の注文をオフチェーンで行い取引の実行をオンチェーンで行うことが一般的ですが、安価なストレージといったICPの特徴を使用することでデータの保存をすべてオンチェーンで行います。

本プロジェクトは、以下の機能を実装します。

1. Internet Identityを使用したユーザー認証
2. オリジナルトークンをFaucetから受け取る
3. DEXに対してトークンを入金・出金する
4. オーダーを作成して取引を実行する

完成したDEXアプリケーションはこのような見た目になります 💪

![](/public/images/ICP-Basic-DEX/section-0/0_1_1.png)

![](/public/images/ICP-Basic-DEX/section-0/0_1_2.png)

### 🌍 プロジェクトをアップグレードする

[UNCHAIN](https://unchain.tech/) のプロジェクトはすべてオープンソース([MIT ライセンス](https://wisdommingle.com/mit-license/))で運用されています。

プロジェクトに参加していて、「こうすればもっと分かりやすいのに！」「これは間違っている！」と思ったら、ぜひ`pull request`を送ってください。

GitHubから直接コードを編集して直接`pull request`を送る方法は、[こちら](https://docs.github.com/ja/repositories/working-with-files/managing-files/editing-files#editing-files-in-another-users-repository)を参照してください。

どんなリクエストでも大歓迎です 🎉

また、プロジェクトを自分のGitHubアカウントに`Fork`して、中身を編集してから`pull request`を送ることもできます。

- プロジェクトを`Fork`する方法は、[こちら](https://docs.github.com/ja/get-started/quickstart/fork-a-repo) を参照してください。
- `Fork`から`pull request`を作成する方法は、[こちら](https://docs.github.com/ja/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork) です。

### ⚡️ `Issue`を作成する

`pull request`送るほどでもないけど、提案を残したい！　と思ったら、[こちら](https://github.com/unchain-tech/UNCHAIN-projects/issues) に`Issue`を作成してみましょう。

`Issue`の作成方法に関しては、[こちら](https://docs.github.com/ja/issues/tracking-your-work-with-issues/creating-an-issue)を参照してください。

`pull request`や`issue`の作成は、実際にチームで開発を行う際に重要な作業になるので、ぜひトライしてみてください。

UNCHAINのプロジェクトをみんなでより良いものにしていきましょう ✨

### 🙋‍♂️ 質問する

ここまで何かわからないことがある場合は、Discordの`#icp`で質問をしてください。

---

次のレッスンに進んでプログラミングの環境構築を行いましょう 🎉

---

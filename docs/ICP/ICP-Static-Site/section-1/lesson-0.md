---
title: プロジェクトの概要を掴もう
---
### 👋 IC Static Website 開発プロジェクトへようこそ！

このプロジェクトでは、静的Webサイトを作成しブロックチェーンにデプロイする方法を学びます。

プロジェクトを進めるには以下の技術が必要です。

- [Terminal 操作](https://qiita.com/ryouzi/items/f9dee1540a04a0bfb9a3)
- [Javascript](https://developer.mozilla.org/ja/docs/Web/JavaScript)
- [Svelte](https://svelte.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

いますべてを理解している必要はありません。

わからないことがあったらインターネットで検索したり、コミュニティで質問しながらプロジェクトを進めていきましょう!

### 🛠 何を開発するのか？

今回開発するものは、ブロックチェーン上にホストされたポートフォリオサイトです。これまでのプロジェクトとは異なり、ブロックチェーンが直接エンドユーザーへWebサイトを提供する点が特徴です。

ポートフォリオサイトは、以下で構成されます。

- ホーム
- プロフィール
- ポートフォリオ

完成したポートフォリオサイトは以下のような見た目になります 💪

![](/images/ICP-Static-Site/section-0/0_1_1.png)

![](/images/ICP-Static-Site/section-0/0_1_2.png)

![](/images/ICP-Static-Site/section-0/0_1_3.png)

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

それでは次のレッスンに進みましょう！



---

## ICとは

### 🌐 IC とは

コーディングに入る前に、ICと関連するWordについて簡単にお話ししましょう。

IC（Internet Computer）とは、トークンやdAppsをホストするためのプラットフォームを提供する汎用ブロックチェーンです。2021年にDFINITY財団によりローンチ・オープンソース化されました。

DFINITY財団は、ICを2009年の暗号通貨（ビットコイン）、2015年のスマートコントラクト（イーサリアム）に続く第3の革新であると述べています。

概念的には既存のインターネットを拡張したもので、アプリケーションを実行するためのリソースをコンピュータのグローバル・ネットワークで提供しようとするものです。これには、世界中の独立運営されるデータセンターが利用されています。

ICの目的は、従来のIT技術（例えばビッグテックのクラウドサービスやファイルシステム、webサーバーなど）に代わりあらゆるシステムとサービスをホストし、完全にオンチェーン化されたweb3を実現することです。

データの保存にAWSを利用するサービスや、ホストに従来の非分散的なサービスを用いていたアプリケーションもICを利用することで、完全に分散化されたアプリケーションを構築することが可能になります。

### 📦 キャニスター

キャニスターとは、ICにホストされるスマートコントラクトのことです。コンパイルされた実行プログラムのほかに、データを保存するためのメモリを持つなど、従来のスマートコントラクトを進化させたものになっています。

### 🏭 サイクル

サイクルとは、イーサリアムにおける**ガス**のようなものでキャニスターが稼働するためのコストとして使われます。根本的な違いは、イーサリアムが「ユーザーペイ」、ICは「スマートコントラクトペイ」（リバースガス）モデルを活用している点です。キャニスターにあらかじめ開発者がサイクルをチャージするため、エンドユーザーは自分が開始した計算の対価としてトークンを支払うことなく、サービスを利用することができます。

ICはICPというユーティリティ・トークンを使用しています。サイクルは、このトークンから変換されたものです。

なぜ、ICPトークンではなくサイクルに変換する必要があるのでしょうか？

ICPトークンは市場価格により変動しますが、サイクルの価格はキャニスターの運用コストが予測可能であることを保証するために固定されています(コストについては[こちら](https://internetcomputer.org/docs/current/developer-docs/deploy/computation-and-storage-costs))。開発者がIC上で開発を行いやすくするためにサイクルを用います。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#icp`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のセクションに進み、開発の準備を始めましょう！


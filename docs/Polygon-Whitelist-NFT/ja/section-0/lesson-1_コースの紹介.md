## はじめに

### 🎉 自己紹介

皆さんこんにちは、講師のWTOMです。このチュートリアルでは、ChainIDEを使用してホワイトリストに登録されたユーザーだけがNFTをミントできるようにするdAppを開発する方法を紹介します。開発には、Solidity、TypeScript、Reactの知識が必要ですが、心配しないでください。

### 🎓 ChainIDEとは

[ChainIDE](https://chainide.com/)は、分散型アプリケーションを開発するためのクラウドベースIDEです。Ethereum、BNB Chain、Polygon、Conflux、Nervos、Dfinity、Flow、Aptosなど様々なブロックチェーンをサポートしています。

開発に必要なプラグインがあらかじめ準備されており、スマートコントラクトの記述、コンパイル、デバッグ、テスト、デプロイなどのためのモジュールも備えています。そのため、複雑な環境構築を行うことなく、すぐにコーディングを始めることができます。

### 🧱 何を構築するのか

私たちはNFTのミントページを作成したいと考えていますが、NFTを請求できるのは特定の人々だけにしたいと思います。

具体的には、このdAppではユーザーが自身のMetaMaskウォレットを接続できるようにし、ホワイトリストに登録されているユーザーだけがMintにアクセスできるようにします。ユーザーはミントを終えると、NFTをNFT流通市場で転売したり、保有したりすることができます。以上がこのコースで行うことの概要です。

これがミントページです：

![image-20230223171808615](/public/images/Polygon-Whitelist-NFT/section-0/0_1_1.png)

これが完成後のOpenSeaでの様子です：

![image-20230223163620536](/public/images/Polygon-Whitelist-NFT/section-0/0_1_2.png)

### 🌍 プロジェクトをアップグレードする

この学習コンテンツは、[UNCHAIN License](https://github.com/unchain-dev/UNCHAIN-projects/blob/main/LICENSE) のもとで運用されています。

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

### 🙋‍♂️ 質問する
ここまで何かわからないことがある場合は、Discordの`#polygon`で質問をしてください。
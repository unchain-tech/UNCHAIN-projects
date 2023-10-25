### 👋 ASTAR SNS 開発プロジェクトへようこそ!

本プロジェクトでは、`ASTAR`というチェーン上でスマートコントラクトの実装とそれとやりとりをするwebアプリケーションを作成します。

使用する技術は以下のものです。

1. Rust
2. Terminalの基本操作
3. React
4. Next.js

今すべてを理解している必要はありません。

わからないことがあったらインターネットで検索したり、コミュニティで質問しながらプロジェクトを進めていきましょう!

### 👁‍🗨 ASTAR の特徴は？

最近話題になっている日本初のパブリックブロックチェーン`ASTAR`をご存じの方も多いのではないかと思いますが、そのチェーンの特徴とはどのようなものなのでしょうか？

その最大の特徴は`Polkadot`のパラチェーン（Polkadotに接続するための特別なチェーン）であることです。なぜこれがすごいのかというと、`Polkadot`のパラチェーンとして認められるのは100個までと決められているのですが、ASTARは世界で ３ 番目の速さでその中に選ばれたからです！

では技術的な特徴とは何なのでしょうか？

主なものは以下の4つとなります。

`1.開発者への報酬制度`

ASTARは`EVM`と`WASM`を用いたスマートコントラクトの開発者をサポートしています。これらどちらかで作成されたdAppをAstar上にデプロイしてASTARトークンの保有者に気に入ってもらえればASTARトークンを受け取れるという仕組みが用意されています。

`2.スケーラビリティ`

`TPS(Transaction Per Second)`が他のチェーンと比べて小さく、ユーザーはトランザクションを待つのに時間を無駄にすることが少ないです。

`3.サブストレイト`

ASTARが用意してくれている基礎的なシステムをしようすれば、開発者は独自のチェーンを簡単に作成することができます。

### 🦀 アプリの概要

本アプリはブラウザで使用可能なフルオンチェーンSNS webアプリです。

また投稿に対して受け取ったいいねの数に従って、トークンを獲得できるという特徴があります！

では具体的にこのアプリが持つ機能を画面ごとに簡単に紹介していきます。

[`ログイン画面`]

この画面の`Connect`ボタンを押すことでウォレットを接続できるようになっています。

うまく接続が完了すれば次にホーム画面へ飛ぶようにできています。
![](/public/images/ASTAR-SocialFi/section-0/0_1_1.png)

[`ホーム画面`]

この画面では全体のユーザーの投稿を最新のものから順番に見られるようになっています。

また、それらの投稿に`いいね`を押せたりまだフォローしていないユーザーをフォローすることもできます。

このフォローによってそのアカウントとメッセージでやりとりを行うことができます。

加えて、いいねの数に従ってトークンを獲得できる機能も備えておりロゴとプロフィールアイコンの間に残高が表示されます。

![](/public/images/ASTAR-SocialFi/section-0/0_1_2.png)

[`プロフィール画面`]

自分のプロフィール、フォロワー数、フォロー数、投稿内容を見ることができます。

また、プロフィールの画像と名前を変更することもできます。
![](/public/images/ASTAR-SocialFi/section-0/0_1_3.png)

[`メッセージ画面`]

フォローしている、またはされているユーザーとメッセージのやりとりができる画面です。
![](/public/images/ASTAR-SocialFi/section-0/0_1_4.png)
![](/public/images/ASTAR-SocialFi/section-0/0_1_5.png)

以上を踏まえて実装する機能は下のようになっています。

1.ウォレット接続

2.投稿

3.メッセージのやりとり

4.フォロー

これらの機能を`Rust, Next.js`を使って実装していきます！

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

`pull request`送るほどでもないけど、提案を残したい!　と思ったら、[こちら](https://github.com/shiftbase-xyz/UNCHAIN-projects/issues) に`Issue`を作成してみましょう。

`Issue`の作成方法に関しては、[こちら](https://docs.github.com/ja/issues/tracking-your-work-with-issues/creating-an-issue)を参照してください。

`pull request`や`issue`の作成は、実際にチームで開発を行う際に重要な作業になるので、ぜひトライしてみてください。

UNCHAINのプロジェクトをみんなでより良いものにしていきましょう ✨

### 🙋‍♂️ 質問する

わからないことがあれば、Discordの`#astar`でsection ・ Lesson名とともに質問をしてください 👋

---

では早速次のレッスンに進んで、ASTAR SNS作成のための環境構築をしていきましょう 🚀

---

Documentation created by [shø](https://github.com/neila) and [Tonny](https://github.com/honganji)（UNCHAIN discord ID: shø#0537, Tonny#5693）

### 🌈 Aurora Multiple Payment dApp 開発プロジェクトへようこそ!

このプロジェクトでは Aurora というチェーン上で複数コインでの送金 dApp の作成を行なっていきます！

プロジェクトを進めるには以下の技術が必要です。

- [Terminal 操作](https://qiita.com/ryouzi/items/f9dee1540a04a0bfb9a3)
- [Dart](https://dart.dev/)
- [Solidity](https://docs.soliditylang.org/en/v0.8.16/)

### 🧐 Aurora とは何か？

Aurora はブロックチェーンの一つで、Ethereum 上で動くコントラクトを NEAR 上で動かすことができるということが大きな特徴です。

NEAR の特徴としては、独自の`シャーディング技術`によって他のチェーンと比べて低い手数料での取引が可能だったり、トランザクションの完了が素早いという特徴があります。

このシャーディング技術は複数のトランザクションを一つのブロックチェーンで処理するのではなく、「シャード」と呼ばれる単位の複数のチェーンで処理を分散化することで並行処理ができるようにする技術のことです。

また、環境への配慮もされており従来の通貨に比べて約 1/1300 の電気しか使用しないそうです。

従来では`Rust` や `AssemblyScript`（Javascript っぽい言語）の二つの言語で作成されたコントラクトしか動かすことができなかったのですが、Aurora チェーンを仲介することで Ethereum 上で動かすことができるコントラクト（Solidity で作成されたものなど）を NEAR 上で動かすことができるようになりました。

このことでより多くのサービスを NEAR という高速トランザクションを実現したチェーンで展開できるということです。

このようにユーザーにも開発者にも素晴らしい環境を用意してくれている Aurora の世界へ飛び込んでみましょう！

### 🛠 何を開発するのか？

今回開発するものは、swap 機能を利用した送金 dApp です。

現在 Ethereum 上ではたくさんのサービスが展開されるとともに、それに伴ってたくさんのトークンが流通しています。

これによってユーザー一人一人が欲しいトークンが異なる状況が想定されます。そのような状況において送金者と受取人がそれぞれ異なるトークンでやりとりしたいとなることが考えられます。

そこで NEAR の高速なトランザクションと swap 機能によって異なるトークンでやりとりができるようにすることがこの送金 dApp の目的です。具体的には以下の機能を作成していきます。

- ユーザーの保有トークン残高の表示
- ユーザーの wallet address の QR コード化
- QR コードのスキャン
- 異なるトークン間での送金

完成した`Multiple Payment dApp`は以下のような見た目になります 💪

![](/public/images/NEAR-MulPay/section-0/0_1_1.png)
![](/public/images/NEAR-MulPay/section-0/0_1_2.png)
![](/public/images/NEAR-MulPay/section-0/0_1_3.png)
![](/public/images/NEAR-MulPay/section-0/0_1_4.png)

### 🌍 プロジェクトをアップグレードする

[UNCHAIN](https://app.shiftbase.xyz) のプロジェクトはすべてオープンソース（[MIT ライセンス](https://wisdommingle.com/mit-license/)）で運用されています。

プロジェクトに参加していて、「こうすればもっと分かりやすいのに！」「これは間違っている！」と思ったら、ぜひ `pull request` を送ってください。

GitHub から直接コードを編集して直接 `pull request` を送る方法は、[こちら](https://docs.github.com/ja/repositories/working-with-files/managing-files/editing-files#editing-files-in-another-users-repository)を参照してください。

どんなリクエストでも大歓迎です 🎉

また、プロジェクトを自分の GitHub アカウントに `Fork` して、中身を編集してから `pull request` を送ることもできます。

- プロジェクトを `Fork` する方法は、[こちら](https://docs.github.com/ja/get-started/quickstart/fork-a-repo) を参照してください。
- `Fork` から `pull request` を作成する方法は、[こちら](https://docs.github.com/ja/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork) です。

### ⚡️ `Issue` を作成する

`pull request` 送るほどでもないけど、提案を残したい！　と思ったら、[こちら](https://github.com/shiftbase-xyz/UNCHAIN-projects/issues) に `Issue` を作成してみましょう。

`Issue` の作成方法に関しては、[こちら](https://docs.github.com/ja/issues/tracking-your-work-with-issues/creating-an-issue)を参照してください。

`pull request` や `issue` の作成は実際にチームで開発する際、重要な作業になるので、ぜひトライしてみてください。

UNCHAIN のプロジェクトをみんなでより良いものにしていきましょう ✨

---

では、早速次のレッスンに進んでプログラミングの環境構築しましょう 🎉

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#section-0` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 4 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンで環境構築を行い、そこからは上でに挙げたような機能をスマートコントラクトに実装していきます！

楽しんでいきましょう！

---

Documentation created by [honganji](https://github.com/honganji) (UNCHAIN discord ID: Tonny#5693)

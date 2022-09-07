### ✨ NEAR Election dApp 開発プロジェクトへようこそ!

このプロジェクトでは NEAR というチェーン上で投票アプリの作成を行なっていきます！

プロジェクトを進めるには以下の技術が必要です。

- [Terminal 操作](https://qiita.com/ryouzi/items/f9dee1540a04a0bfb9a3)
- [Javascript](https://developer.mozilla.org/ja/docs/Web/JavaScript)
- [React.js](https://ja.reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Rust](https://www.rust-lang.org/)

### 🧐 NEAR とは何か？

NEAR はブロックチェーンの一つで、Ethereum に取って替わるともいわれています。

特徴としては、独自の`シャーディング技術`によって他のチェーンと比べて低い手数料での取引が可能だったり、トランザクションの完了が素早いという特徴があります。

このシャーディング技術は複数のトランザクションを一つのブロックチェーンで処理するのではなく、「シャード」と呼ばれる単位の複数のチェーンで処理を分散化することで並行処理ができるようにする技術のことです。

また、環境への配慮もされており従来の通貨に比べて約 1/1300 の電気しか使用しないそうです。

開発者に対する配慮もされています。`Rust` や `AssemblyScript`（Javascript っぽい言語）など比較的広く利用されているプログラミング言語を利用して開発が行えるようになっています。

加えて、NEAR が公式的に「grant」という`報酬システム`を用意してくれています。NEAR 上での面白いアイディアやプロダクトを提出して承認されると NEAR という暗号通貨で報酬をもらえるというものです。詳しくは[こちら](https://near.org/grants/)をご覧ください。

このようにユーザーにも開発者にも素晴らしい環境を用意してくれている NEAR の世界へ飛び込んでみましょう！

### 🛠 何を開発するのか？

今回開発するものは、ブロックチェーンの大きな特徴の一つである対改ざん性を生かした`投票dApp`です。この dApp では主に以下の機能を実装します

- 投票券の付与
- 候補者の追加
- 投票
- 投票結果の開示

完成した`投票dApp`は以下のような見た目になります💪
![](/public/images/401-NEAR-Election-dApp/section-0/0_1_1.png)
![](/public/images/401-NEAR-Election-dApp/section-0/0_1_2.png)
![](/public/images/401-NEAR-Election-dApp/section-0/0_1_3.png)
![](/public/images/401-NEAR-Election-dApp/section-0/0_1_4.png)

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

ここまでの作業で何かわからないことがある場合は、Discord の `#near-election-dapp` で質問をしてください。

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

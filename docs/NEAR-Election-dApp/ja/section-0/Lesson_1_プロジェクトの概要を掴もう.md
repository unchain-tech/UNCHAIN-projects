### ✨ NEAR Election dApp 開発プロジェクトへようこそ!

このプロジェクトではNEARというチェーン上で投票アプリの作成を行なっていきます！

プロジェクトを進めるには以下の技術が必要です。

- [Terminal 操作](https://qiita.com/ryouzi/items/f9dee1540a04a0bfb9a3)
- [Javascript](https://developer.mozilla.org/ja/docs/Web/JavaScript)
- [React.js](https://ja.reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Rust](https://www.rust-lang.org/)

### 🧐 NEAR とは何か？

NEARはブロックチェーンの1つで、Ethereumに取って替わるともいわれています。

特徴としては、独自の`シャーディング技術`によって他のチェーンと比べて低い手数料での取引が可能だったり、トランザクションの完了が素早いという特徴があります。

このシャーディング技術は複数のトランザクションを1つのブロックチェーンで処理するのではなく、「シャード」と呼ばれる単位の複数のチェーンで処理を分散化することで並行処理ができるようにする技術のことです。

また、環境への配慮もされており従来の通貨に比べて約1/1300の電気しか使用しないそうです。

開発者に対する配慮もされています。`Rust`や`AssemblyScript`（JavaScriptっぽい言語）など比較的広く利用されているプログラミング言語を利用して開発が行えるようになっています。

加えて、NEARが公式的に「grant」という`報酬システム`を用意してくれています。NEAR上での面白いアイデアやプロダクトを提出して承認されるとNEARという暗号通貨で報酬をもらえるというものです。詳しくは[こちら](https://near.org/grants/)をご覧ください。

このようにユーザーにも開発者にとっても素晴らしい環境を用意してくれているNEARの世界へ飛び込んでみましょう！

### 🛠 何を開発するのか？

今回開発するものは、ブロックチェーンの大きな特徴の1つである対改ざん性を生かした`投票dApp`です。このdAppでは主に以下の機能を実装します

- 投票券の付与
- 候補者の追加
- 投票
- 投票結果の開示

完成した`投票dApp`は以下のような見た目になります💪

<ログイン画面>

NEARのwalletと接続することでログインする画面になります！

`Sign in`ボタンを押すことでNEARが用意しているwallet接続画面に移動することでwallet接続してホーム画面に移動します。
![](/public/images/NEAR-Election-dApp/section-0/0_1_1.png)

<ホーム画面>

追加された候補者情報と、得票数が表示されます。

投票は一人1回できるようになっていてそれぞれの投票者の下にある`vote`ボタンを押すと確認画面が出てきて、指定の候補者に投票することができます。具体的にいうと、NEARが用意しているトランザクション画面に移動してトランザクションを承認することになります。

また、コントラクトをdeployしたウォレットでログインした場合に限り下の画像のような`Close Election`ボタンが表示されることになります。

このボタンを押すことによって投票を締め切ることができます。
![](/public/images/NEAR-Election-dApp/section-0/0_1_4.png)

<候補者追加画面>

一番上の入力欄にはIPFSのURIを入れ、その下には候補者の名前を、一番下には政策を入れることになります。

そしてAddボタンを押すと候補者NFTを発行できることになります。
![](/public/images/NEAR-Election-dApp/section-0/0_1_2.png)

<投票者追加画面>

ここには追加する投票者のアドレスを入れることで、そのwalletに投票券を送ることができます。ただし、この操作はコントラクトをdeployした人しかできないようになっています。

![](/public/images/NEAR-Election-dApp/section-0/0_1_3.png)


### 🌍 プロジェクトをアップグレードする

[UNCHAIN](https://app.shiftbase.xyz) のプロジェクトは [UNCHAIN License](https://github.com/unchain-dev/UNCHAIN-projects/blob/main/LICENSE) により運用されています。

プロジェクトに参加していて、「こうすればもっと分かりやすいのに！」「これは間違っている！」と思ったら、ぜひ`pull request`を送ってください。

GitHubから直接コードを編集して直接`pull request`を送る方法は、[こちら](https://docs.github.com/ja/repositories/working-with-files/managing-files/editing-files#editing-files-in-another-users-repository)を参照してください。

どんなリクエストでも大歓迎です 🎉

また、プロジェクトを自分のGitHubアカウントに`Fork`して、中身を編集してから`pull request`を送ることもできます。

- プロジェクトを`Fork`する方法は、[こちら](https://docs.github.com/ja/get-started/quickstart/fork-a-repo) を参照してください。
- `Fork`から`pull request`を作成する方法は、[こちら](https://docs.github.com/ja/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork) です。

### ⚡️ `Issue`を作成する

`pull request`送るほどでもないけど、提案を残したい！　と思ったら、[こちら](https://github.com/shiftbase-xyz/UNCHAIN-projects/issues) に`Issue`を作成してみましょう。

`Issue`の作成方法に関しては、[こちら](https://docs.github.com/ja/issues/tracking-your-work-with-issues/creating-an-issue)を参照してください。

`pull request`や`issue`の作成は実際にチームで開発する際、重要な作業になるので、ぜひトライしてみてください。

UNCHAINのプロジェクトをみんなでより良いものにしていきましょう ✨

---

では、早速次のレッスンに進んでプログラミングの環境構築しましょう 🎉

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#near`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンで環境構築を行い、そこからは上で挙げたような機能をスマートコントラクトに実装していきます！

楽しんでいきましょう！

---

Documentation created by [honganji](https://github.com/honganji)（UNCHAIN discord ID: Tonny#5693）

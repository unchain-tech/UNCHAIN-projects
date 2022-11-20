### 🛏 NEAR Hotel Booking dApp 開発プロジェクトへようこそ!

このプロジェクトでは、NEARブロックチェーン上で宿泊予約ができるWebアプリケーションを構築します。
プロジェクトを進めるには以下の技術が必要です。

- [Terminal 操作](https://qiita.com/ryouzi/items/f9dee1540a04a0bfb9a3)
- [Rust](https://www.rust-lang.org/ja/)
- [Javascript](https://developer.mozilla.org/ja/docs/Web/JavaScript)
- [React](https://ja.reactjs.org/)
- [React Bootstrap](https://react-bootstrap.github.io/)

いますべてを理解している必要はありません。

わからないことがあったらインターネットで検索したり、コミュニティで質問しながらプロジェクトを進めていきましょう!

### 🧐 NEAR とは何か？

NEARはブロックチェーンの1つで、Ethereumに取って替わるともいわれています。

特徴としては、独自の`シャーディング技術`によって他のチェーンと比べて低い手数料での取引が可能だったり、トランザクションの完了が素早いという特徴があります。

このシャーディング技術は複数のトランザクションを1つのブロックチェーンで処理するのではなく、「シャード」と呼ばれる単位の複数のチェーンで処理を分散化することで並行処理ができるようにする技術のことです。

また、環境への配慮もされており従来の通貨に比べて約1/1300の電気しか使用しないそうです。

開発者に対する配慮もされています。`Rust`や`AssemblyScript`（JavaScriptっぽい言語）など比較的広く利用されているプログラミング言語を利用して開発が行えるようになっています。

加えて、NEARが公式的に「grant」という`報酬システム`を用意してくれています。NEAR上での面白いアイデアやプロダクトを提出して承認されるとNEARという暗号通貨で報酬をもらえるというものです。詳しくは[こちら](https://near.org/grants/)をご覧ください。

このようにユーザーにも開発者にとっても素晴らしい環境を用意してくれているNEARの世界へ飛び込んでみましょう！

### 🛠 何を開発するのか？

本プロジェクトでは、以下の機能を実装します。

- 部屋を掲載
- チェックイン・チェックアウトの操作
- 日付で宿泊できる部屋を探す
- 部屋の予約

以下は作成するWebアプリケーションのイメージです。

![](/public/images/NEAR-Hotel-Booking-dApp/section-0/0_1_1.png)

![](/public/images/NEAR-Hotel-Booking-dApp/section-0/0_1_2.png)

![](/public/images/NEAR-Hotel-Booking-dApp/section-0/0_1_3.png)

![](/public/images/NEAR-Hotel-Booking-dApp/section-0/0_1_4.png)

![](/public/images/NEAR-Hotel-Booking-dApp/section-0/0_1_5.png)

本プロジェクトは以下のステップに分かれています。

1 \. **環境構築を行います。**

- NEARで開発を行うためのツールをインストールします。
- プロジェクトの雛形となるフォルダを作成します。

2 \. **スマートコントラクトを作成します。**

- 始めに、部屋のデータを登録・取得するためのロジックを実装します。
- 次に、予約機能のためのロジックを実装します。
- それぞれ実装後にテストを行い、スマートコントラクトの動作確認を行います。

3 \. **フロントエンドを作成し、アプリケーションを完成させます。**

- スマートコントラクトとフロントエンドの接続部分を実装します。
- アプリケーションの基礎となる画面遷移、コンポーネントを実装します。
- オーナーに操作してもらう機能・ページを実装し、部屋の登録・確認ができるようにします。
- 宿泊者に操作してもらう機能・ページを実装し、日付による部屋の検索・予約ができるようにします。
- 最後に、任意の画像を **IPFS** にアップロードできる機能を追加します。

## 4 \. **アプリケーションを公開します。**

- **Netlify** というサービスにホストし、完成したアプリケーションを公開しましょう 🎉

### 🌍 プロジェクトをアップグレードする

[UNCHAIN](https://app.shiftbase.xyz) のプロジェクトは [UNCHAIN License](https://github.com/unchain-dev/UNCHAIN-projects/blob/main/LICENSE) により運用されています。

プロジェクトに参加していて、「こうすればもっと分かりやすいのに!」「これは間違っている!」と思ったら、ぜひ`pull request`を送ってください。

GitHubから直接コードを編集して直接`pull request`を送る方法は、[こちら](https://docs.github.com/ja/repositories/working-with-files/managing-files/editing-files#editing-files-in-another-users-repository)を参照してください。

どんなリクエストでも大歓迎です 🎉

**👋 `UNCHAIN-projects`に`pull request`を送る! ⏩ [UNCHAIN の GitHub](https://github.com/shiftbase-xyz/UNCHAIN-projects) にアクセス!**

また、プロジェクトを自分のGitHubアカウントに`Fork`して、中身を編集してから`pull request`を送ることもできます。

- プロジェクトを`Fork`する方法は、[こちら](https://docs.github.com/ja/get-started/quickstart/fork-a-repo) を参照してください。
- `Fork`から`pull request`を作成する方法は、[こちら](https://docs.github.com/ja/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork) です。

### ⚡️ `Issue`を作成する

`pull request`送るほどでもないけど、提案を残したい!　と思ったら、[こちら](https://github.com/shiftbase-xyz/UNCHAIN-projects/issues) に`Issue`を作成してみましょう。

`Issue`の作成方法に関しては、[こちら](https://docs.github.com/ja/issues/tracking-your-work-with-issues/creating-an-issue)を参照してください。

`pull request`や`issue`の作成は実際にチームで開発する際、重要な作業になるので、ぜひトライしてみてください。

UNCHAINのプロジェクトをみんなでより良いものにしていきましょう ✨

---

次のレッスンに進み、環境構築から始めていきましょう 🎉

---

Documentation created by [yk-saito](https://github.com/yk-saito)（UNCHAIN discord ID: ysaito#8278）

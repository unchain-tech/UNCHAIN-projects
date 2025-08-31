---
title: NEAR上に宿泊予約アプリケーションを作ろう
---
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

![](/images/NEAR-Hotel-Booking-dApp/section-0/0_1_1.png)

![](/images/NEAR-Hotel-Booking-dApp/section-0/0_1_2.png)

![](/images/NEAR-Hotel-Booking-dApp/section-0/0_1_3.png)

![](/images/NEAR-Hotel-Booking-dApp/section-0/0_1_4.png)

![](/images/NEAR-Hotel-Booking-dApp/section-0/0_1_5.png)

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

[UNCHAIN](https://app.shiftbase.xyz) のプロジェクトは [UNCHAIN License](https://github.com/unchain-tech/UNCHAIN-projects/blob/main/LICENSE) により運用されています。

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

## 環境構築をしよう

### 🤖 環境構築をしよう

このレッスンでは、NEARで開発を行うために準備をしていきます。
それでは早速、ターミナルを開いて始めていきましょう！

### 🦄 NEAR CLI をインストールする

[NEAR CLI](https://docs.near.org/tools/near-cli)とは、シェルから直接NEARネットワークを操作することができるツールです。さまざまなコマンドが用意されています。今回は主に、NEARネットワークにデプロイされたスマートコントラクトと直接やり取りをするために使用します。

NEAR CLIをインストールします。

```
npm install -g near-cli
```

インストールが成功したか確認をします。以下を実行してコマンドの使い方が表示されたら成功です。

```
near
```

### 🦀 Rust をインストールする

このプロジェクトでは、[Rust](https://www.rust-lang.org/ja/) というプログラミング言語でスマートコントラクトを記述していきます。

まずは`Rust`をインストールします。

```
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

以下のように表示されたら成功です！

```
Rust is installed now. Great!

To get started you may need to restart your current shell.
This would reload your PATH environment variable to include
Cargo's bin directory ($HOME/.cargo/bin).

To configure your current shell, run:
source "$HOME/.cargo/env"
```

また、環境変数を設定するために下のコマンドを実行します([環境変数とは？](https://wa3.i-3-i.info/word11027.html))

```
source $HOME/.cargo/env
```

### 🗂 新規プロジェクトの雛形を作成する

NEARが提供するパッケージで、プロジェクトの雛形を作成しましょう。

[Create NEAR App](https://github.com/near/create-near-app)は、NEARブロックチェーンにフックしたスターターアプリの作成ができるパッケージです。作成されるプロジェクトには、サンプルとして`greeter`というシンプルなアプリケーションが実装されています。

プロジェクトを作成する任意の作業ディレクトリに移動し、以下のコマンドを実行します。

```
npx create-near-app@3.1.0 --frontend=react --contract=rust near-hotel-booking-dapp
```

指定したオプションはこちらです。

- `--frontend=react` : フロントエンドのテンプレートに`React`を指定する
- `--contract=rust` : スマートコントラクトに`Rust`を指定する

デフォルトでは、フロントエンドに`vanilla JavaScript`、スマートコントラクトに` AssemblyScript`を使用したプロジェクトが作成されます。**必ずオプションを指定**してください。

コマンドの最後に、プロジェクト名を指定しています。上記のコマンドでは、`near-hotel-booking-dapp`という名前で作成されます。

作成が成功すると、以下のように出力されます。

```
success Saved lockfile.
✨  Done in 42.74s.

Success! Created test
Inside that directory, you can run several commands:

  yarn dev
    Starts the development server. Both contract and client-side code will
    auto-reload once you change source files.

  yarn test
    Starts the test runner.

We suggest that you begin by typing:

    cd test
    yarn dev

Happy hacking!
```

作成されたプロジェクトのファイル構成を確認します。

ここでは`tree`コマンドを実行して確認したいと思います。`-L 1`は1つ下の階層まで、`-F`はディレクトリを`/`で表現する、`-a`は隠しファイル（.ファイル）を表示するという意味です。

```
tree -L 1 -F -a near-hotel-booking-dapp
```

このような構成のプロジェクトが確認できると思います。

```
near-hotel-booking-dapp/
├── .gitignore
├── .gitpod.yml
├── README.md
├── ava.config.cjs
├── contract/
├── frontend/
├── integration-tests/
├── neardev/
├── node_modules/
├── out/
├── package.json
└── yarn.lock
```

それでは、プロジェクトのディレクトリへ移動し実際に起動してみましょう。

```
cd near-hotel-booking-dapp
yarn dev
```

あらかじめ用意されているスマートコントラクトがコンパイル・デプロイされ、Webアプリケーションが起動されます。

![](/images/NEAR-Hotel-Booking-dApp/section-0/0_2_2.jpeg)

動作確認ができたので、これで環境構築＋新規プロジェクトの雛形作成は完了です！

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

おめでとうございます！ レッスン0は終了です！

次のレッスンに進み、スマートコントラクトの実装を開始しましょう 🚀

Documentation created by [yk-saito](https://github.com/yk-saito)（UNCHAIN discord ID: ysaito#8278）


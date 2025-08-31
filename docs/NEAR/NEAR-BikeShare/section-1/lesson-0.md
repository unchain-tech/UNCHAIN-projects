---
title: プロジェクトの概要を掴もう
---
### ✨ NEAR Sharing Economy 開発プロジェクトへようこそ!

このプロジェクトでは`NEAR`というブロックチェーン上でアプリを作成して、バイクの`シェアリングエコノミー`を構築しましょう！

プロジェクトを進めるには以下の技術が必要です。

- Terminal操作
- [Rust](https://doc.rust-jp.rs/book-ja/) (このリンクでは[第 11 章](https://doc.rust-jp.rs/book-ja/ch11-00-testing.html)までが主に本プロジェクトで扱う範囲です)
- [Javascript](https://ja.javascript.info/)
- [React.js](https://ja.reactjs.org/docs/getting-started.html)

簡単な説明とコードを載せながら進めて行きますが、特にRustについては初めて触れる概念が多い人もいるかもしれません！
わからないところは都度調べていきましょう！
アプリ開発に進む前に技術を体系的に学びたい方は上記参考リンクから必要な部分を先に学ぶのも良いと思います。👍

### 💻 Rust とは？

開発者がバグの修正よりもプログラムのロジックに集中できるように設計された言語です。
例えばコード内にバグを含む場合はコンパイラが拒んでくれるので[コンパイル](https://e-words.jp/w/%E3%82%B3%E3%83%B3%E3%83%91%E3%82%A4%E3%83%AB.html)ができません。
そのためコードを書いていく上で、コンパイラに拒まれることもしばしばあるでしょうが、
慣れていくうちにその開発環境の素晴らしさに触れることになるでしょう！

### 🧐 NEAR とは何か？

NEARの特徴は以下のようなものが挙げられます。

**1. ユーザ（開発者とエンドユーザ共に）の利用しやすい設計**

- NEARには`アカウント`という概念があり、NEARのエコシステムに参加するためには誰しもアカウントを作成する必要があります。
  - 開発者はアカウントにスマートコントラクトをデプロイします。
  - エンドユーザはアカウントを通してウォレットやスマートコントラクトを利用します。
  - アカウント名はユーザが理解しやすいように任意の文字列で決めることができます。
- つまりアカウントというインタフェースを用意して、NEARへのアクセスをシンプルな構造にしているのです。
- またエンドユーザが資産を持たずとも利用できるようなコントラクト作成ができるといった特徴もあります。

**2. スケーラビリティ**

- `シャーディング`という技術を利用してトランザクションを高速化することができます。
- ノードを追加することでネットワークの容量を増やせるので、ネットワークの拡大がしやすい設計になっています。

**3. ブリッジ**

- NEARではAuroraと呼ばれる仕組みを使い`ブリッジ`機能を実現しています。
- ブリッジ機能はイーサリアム上で動作するアプリをNEARプロトコル上で動作するように橋渡しすることができます。
- また`grant`という報酬システムを用意することでNEAR上での開発を支援をしているので、
  - 詳しくは[こちら](https://near.org/grants/)をご覧ください。

### 🛠 何を開発するのか？

バイクシェアdappを開発することで簡単な`シェリングエコノミー`を構築しましょう！
シェアリングエコノミーを循環させるために`オリジナルトークン`を利用します。
以降このオリジナルトークンをft（fungible tokenの略）と呼びます。
主に以下の機能を実装します

- ftの発行と利用
- バイクの管理
  - エンドユーザはバイクを使用・点検・返却することができます
  - バイクを使用するにはftを消費する必要があります
  - バイクを点検するとftを報酬として受け取ることができます

完成した`バイクシェアdapp`は以下のような見た目になります

![](/images/NEAR-BikeShare/section-0/0_1_1.png)

### 🌍 プロジェクトをアップグレードする

[UNCHAIN](https://app.shiftbase.xyz) のプロジェクトは [UNCHAIN License](https://github.com/unchain-tech/UNCHAIN-projects/blob/main/LICENSE) により運用されています。

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

## 開発の準備をしよう

### 🏭 開発の準備をしよう

ここでは開発に必要な以下の準備をしましょう！

- `node`/`npm`の取得
- `Rust`のインストール
- NEARアカウント作成
- `near cli`のインストール
- `near cli`でアカウントの操作

**`node`/`npm`の取得**
`node`/`npm`をお持ちでない方は[こちら](https://hardhat.org/tutorial/setting-up-the-environment#installing-node.js)にアクセスし、node v16をインストールしてください。
（例として使われているバージョンを16に変更することをお忘れなく!）。
今回はこちらのバージョンで進めていきます。
この先バージョンによる違いによりエラーに遭遇する場合があるので参考にしてください。

```
$ node -v
v16.15.0

$ npm -v
8.11.0
```

**Rust のインストール**

まずは下のコマンドをターミナルで実行しましょう！

```
$ curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

このコマンドはスクリプトをダウンロードし、rustup（rustを管理するツール）のインストールを開始し、Rustの最新の安定版をインストールします。
成功していれば下のようなメッセージが表示されているでしょう。

```
Rust is installed now. Great!
```

Windowsを使用している方や失敗した方は[こちら](https://doc.rust-jp.rs/book-ja/ch01-01-installation.html)を参考にしてください。

次に [WebAssembly(Wasm)](https://webassembly.org/) 形式でコンパイルするためのtoolchain（Rustではツールまたはその集まりをtoolchainと総称しています）を追加しましょう！
※ スマートコントラクトはRustからWasmへコンパイルした後NEAR上にデプロイします。

```
$ rustup target add wasm32-unknown-unknown
```

**NEAR アカウント作成**
[こちら](https://wallet.testnet.near.org/)からNEARのテストネットアカウントを作成してください。

Create Accountを選択します。

![](/images/NEAR-BikeShare/section-0/0_2_1.png)

自由なアカウント名をつけてください。
ここで作成するアカウントは次項の`ftコントラクト`に利用するのでftにちなんだアカウント名にするのも良いかもしれません。
ここでは`ft_account.testnet`として進めます。

![](/images/NEAR-BikeShare/section-0/0_2_2.png)

Secure Passphraseを選択（Ledger Hardware Walletでも構いません 🙆‍♂️）してパスフレーズをどこかに保存しておきましょう！

![](/images/NEAR-BikeShare/section-0/0_2_3.png)

Passphraseの確認が取れたらアカウント作成の完了です! 以下のような画面に移ります。

![](/images/NEAR-BikeShare/section-0/0_2_4.png)

**`near-cli`のインストール**

ローカルコンピュータからNEARに接続するための [cli](https://wa3.i-3-i.info/word13118.html) ツールである`near-cli`をインストールしましょう！

```
$ npm install -g near-cli
```

`near`と打ち込み、nearコマンドの使い方一覧が表示されたらインストール成功です！

```
$ near
Usage: near <command> [options]

Commands:
:
:
```

**`near cli`でアカウントの操作**
cliを利用してコマンドラインからアカウントにログインしてみましょう！
以下のコマンドを実行するとログイン画面がブラウザで開きます。

```
$ near login
```

![](/images/NEAR-BikeShare/section-0/0_2_5.png)
アカウントへのアクセス許可を確認し、接続へ進むとログインが成功します。
ここではアカウントへのフルアクセスを許可したので、アカウントの作成や削除、アカウントによるコントラクトの呼び出しなどあらゆる操作をコマンドラインから実行できるようになります。

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

おめでとうございます！

次のレッスンではトークンを発行します！

---

Documentation created by [ryojiroakiyama](https://github.com/ryojiroakiyama)（UNCHAIN discord ID: rakiyama#8051）


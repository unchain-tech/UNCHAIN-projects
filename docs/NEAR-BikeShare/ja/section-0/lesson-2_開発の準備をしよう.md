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

![](/public/images/NEAR-BikeShare/section-0/0_2_1.png)

自由なアカウント名をつけてください。
ここで作成するアカウントは次項の`ftコントラクト`に利用するのでftにちなんだアカウント名にするのも良いかもしれません。
ここでは`ft_account.testnet`として進めます。

![](/public/images/NEAR-BikeShare/section-0/0_2_2.png)

Secure Passphraseを選択（Ledger Hardware Walletでも構いません 🙆‍♂️）してパスフレーズをどこかに保存しておきましょう！

![](/public/images/NEAR-BikeShare/section-0/0_2_3.png)

Passphraseの確認が取れたらアカウント作成の完了です! 以下のような画面に移ります。

![](/public/images/NEAR-BikeShare/section-0/0_2_4.png)

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

![](/public/images/NEAR-BikeShare/section-0/0_2_5.png)
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

セクション0は終了です！

次のセクションではトークンを発行します！

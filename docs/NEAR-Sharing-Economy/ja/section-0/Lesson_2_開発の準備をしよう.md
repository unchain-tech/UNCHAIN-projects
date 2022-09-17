### 🏭 開発の準備をしよう

ここでは開発に必要な以下の準備をしましょう！

- `node`/`npm`の取得
- `Rust` のインストール
- NEAR アカウント作成
- `near cli` のインストール
- `near cli` でアカウントの操作

**`node`/`npm`の取得**
`node`/`npm`をお持ちでない方は[こちら](https://hardhat.org/tutorial/setting-up-the-environment#installing-node.js)にアクセスし、node v16 をインストールしてください。
(例として使われているバージョンを 16 に変更することをお忘れなく!)。
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

このコマンドはスクリプトをダウンロードし、rustup(rust を管理するツール)のインストールを開始し、Rust の最新の安定版をインストールします。
成功していれば下のようなメッセージが表示されているでしょう。

```
Rust is installed now. Great!
```

Windows を使用している方や失敗した方は[こちら](https://doc.rust-jp.rs/book-ja/ch01-01-installation.html)を参考にしてください。

次に [WebAssembly(Wasm)](https://webassembly.org/) 形式でコンパイルするための toolchain(Rust ではツールまたはその集まりを toolchain と総称しています)を追加しましょう！
※ スマートコントラクトは Rust から Wasm へコンパイルした後 NEAR 上にデプロイします。

```
$ rustup target add wasm32-unknown-unknown
```

**NEAR アカウント作成**
[こちら](https://wallet.testnet.near.org/)から NEAR のテストネットアカウントを作成してください。

Create Account を選択します。
![](/public/images/NEAR-Sharing-Economy/section-0/0_2_1.png)

自由なアカウント名をつけてください。
ここで作成するアカウントは次項の `ftコントラクト`に利用するので ft にちなんだアカウント名にするのも良いかもしれません。
ここでは`ft_account.testnet`として進めます。
![](/public/images/NEAR-Sharing-Economy/section-0/0_2_2.png)

Secure Passphrase を選択(Ledger Hardware Wallet でも構いません 🙆‍♂️)してパスフレーズをどこかに保存しておきましょう！
![](/public/images/NEAR-Sharing-Economy/section-0/0_2_3.png)

Passphrase の確認が取れたらアカウント作成の完了です! 以下のような画面に移ります。
![](/public/images/NEAR-Sharing-Economy/section-0/0_2_4.png)

**`near-cli`のインストール**

ローカルコンピュータから NEAR に接続するための [cli](https://wa3.i-3-i.info/word13118.html) ツールである`near-cli`をインストールしましょう！

```
$ npm install -g near-cli
```

`near`と打ち込み, near コマンドの使い方一覧が表示されたらインストール成功です！

```
$ near
Usage: near <command> [options]

Commands:
:
:
```

**`near cli` でアカウントの操作**
cli を利用してコマンドラインからアカウントにログインしてみましょう！
以下のコマンドを実行するとログイン画面がブラウザで開きます。

```
$ near login
```

![](/public/images/NEAR-Sharing-Economy/section-0/0_2_5.png)
アカウントへのアクセス許可を確認し, 接続へ進むとログインが成功します。
ここではアカウントへのフルアクセスを許可したので, アカウントの作成や削除, アカウントによるコントラクトの呼び出しなどあらゆる操作をコマンドラインから実行できるようになります。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#near-sharing-dapp` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 4 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

おめでとうございます！

セクション 0 は終了です！

次のセクションではトークンを発行します！

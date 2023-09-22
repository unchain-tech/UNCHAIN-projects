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

![](/public/images/NEAR-Hotel-Booking-dApp/0_2_2.png)

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

おめでとうございます！ セクション0は終了です！

次のセクションに進み、スマートコントラクトの実装を開始しましょう 🚀

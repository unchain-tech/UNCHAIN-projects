### 🛠 Solana プログラムを接続するための準備をする

現段階で、Webアプリケーションの構築はほぼ完了しています。

これからSolanaプログラムを作成・デプロイし、Solanaチェーンと対話できるようにしていきましょう。

これはAPIをデプロイしてからWebアプリケーションに接続するようなものです。

> ⚠️ 注意
>
> 以下ので説明する環境構築方法は Mac 環境のものです。
>
> Windows 環境の方は[WSL ( Windows Subsystem for Linux )](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl)をインストールしたうえで、Ubuntu を起動して進めることをおすすめします。


### 🦀 Rust をインストールする

**Solana のプログラムは Rust で書かれています!**

Rustがわからなくても心配しないでください。

他のプログラミング言語を知っている限り、このプロジェクトの過程でRustを理解することができるでしょう。

それでは早速、[Rust](https://www.rust-lang.org/ja/tools/install) をインストールしていきましょう。

ターミナルを開いて次のコマンドを実行します。

```
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

インストールする際に複数のオプションが表示されるので、1を入力しましょう。

インストールが完了したらターミナルを再起動し、Rustがインストールされていることを確認します。

以下のコマンドを実行して、Rustのバージョンが表示されていればOKです。

```
rustup --version
```

次に、以下のコマンドを実行してRustコンパイラがインストールされていることを確認します。

Rustコンパイラのバージョンが表示されていればOKです。

```
rustc --version
```

最後に、以下のコマンドを実行してRustのパッケージマネージャー Cargoが機能しているかどうかを確認しましょう。

Cargoのバージョンが表示されていればOKです。

```
cargo --version
```

これらすべてのコマンドでバージョン情報が出力され、エラーが発生しなければ問題はありません。


### 🔥 Solana をインストールする

Solanaの[公式サイト](https://docs.solana.com/cli/install-solana-cli-tools#use-solanas-install-tool)を参考にインストールしましょう。

Solana CLIをWindows、Linux、およびMacにインストールするための手順が記載されているのでご確認ください。

※ 安定版をインストールするには、以下のようにバージョン番号を`stable`に置き換えます（以下のコマンドは参考ですので、環境にあったインストール方法を実行してください）。

```
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
```

> ⚠️ 注意
>
> Solana をインストールすると、 `Close and reopen your terminal to apply the PATH changes or run the following in your existing shell:`というメッセージが出力される場合があります。
>
> このメッセージが表示された場合は、メッセージに続くコマンドをコピーして PATH が正しく設定されるようにコマンドを実行してください。

インストールが完了したら、以下のコマンドを実行してSolanaのバージョンを確認します。

以下のコマンドを実行します。

```
solana --version
```

次に、以下の2つのコマンドを別々に実行してください。

```
solana config set --url localhost
solana config get
```

コマンドを入力すると以下のように出力されます。

```
Config File: 任意のディレクトリ名\.config\solana\cli\config.yml
RPC URL: http://localhost:8899
WebSocket URL: ws://localhost:8900/ (computed)
Keypair Path: ~/.config/solana/devnet.json
Commitment: confirmed
```

この設定はSolanaプログラムがローカルネットワークと通信するように設定されていることを意味しています。

プログラムを開発するとき、ローカルに稼働させたSolanaネットワークを使用して作業することで、すばやくテストすることができます。

また、プログラムのテスト用に、ローカルコンピューターにバリデーターを設定することもできます。

`packages/contractに移動して、以下のコマンドを実行しましょう。

```
solana-test-validator
```

開始されると以下のように表示されます。

![solana test validator](/public/images/Solana-dApp/section-2/2_1_1.jpg)

これで、ローカルバリデーターが実行されました。


### ☕️ Node.js / NPM / Mocha をインストールする

ここまでの段階で`Node.js`と`NPM`はインストールされていると思います。

不安な方は以下のコマンドを別々に実行して、それぞれのバージョン情報が出力されるかどうか確認してみてください。

```
node -v
npm -v
```

上記の確認ができたら、次はテストフレームワークMochaをインストールしましょう。

以下のコマンドを実行します。

```
npm install -g mocha
```


### ⚓️ Anchor をインストールする

Solanaプログラムを作成する前に、Solana用のフレームワーク[Anchor](https://hackmd.io/@ironaddicteddog/solana-anchor-escrow)をインストールしましょう。

AnchorはSolanaのために作られたHardhatのようなものです。

Anchorをインストールする前に、まずはパッケージマネージャー `yarn`を以下のコマンドを実行してインストールします。

```
npm install -g yarn
```

次に、以下のコマンドを実行してAnchor CLIをインストールします。

```
npm i -g @project-serum/anchor-cli
```

続いて、以下のコマンドを実行してAnchorのバージョン情報を出力しましょう。

```
anchor --version
```

バージョン情報が出力されていればOKです。

ここまででAnchorを使用するための準備が整いました。

### 🔑 ローカルキーペアを作成する

Solanaプログラムと通信するには、トランザクションにデジタル署名をするためのキーペアを生成する必要があります。

上記のコマンドで生成したディレクトリに移動して、以下のコマンドを実行してキーペアを作りましょう。

```
solana-keygen new
```

パスフレーズの作成を求められますが、何も入力せずに[Enter]を押してください。

次に、以下のコマンドを実行して、作成したキーペアを確認します。

```
solana address
```

作成したローカルウォレットのパブリックアドレスが表示されればOKです。

最後に`packages/contract/Anchor.toml`の12行目にあるパスを自身のPCのものに置き換えてください。

```toml
wallet = "/Users/{YOUR_USERNAME}/.config/solana/id.json" # YOUR_USERNAMEは自分のPCのユーザー名に置き換えてください
```


### 🥳 テストプログラムを実行する

プログラムを実行するには以下の手順が必要になります。

1\. プログラムをコンパイルする。

2\. ウォレットアドレスを使用してローカルのSolanaネットワーク上にデプロイする。

3\. デプロイされたプログラムを実行する。

実は、Anchorを利用することでこれらの手順を1つステップで実行できます。

以下のコマンドを実行してみてください。

```
anchor test
```

※ 初めて実行するときはしばらく時間がかかる場合があります。

出力の一番下に「1 passing」という緑色の単語が表示されていれば問題ありません。

![anchor test](/public/images/Solana-dApp/section-2/2_1_2.jpg)

これでようやくSolana環境のセットアップに成功しました。


### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#solana`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンでは、Solanaプログラムを作成していきます!

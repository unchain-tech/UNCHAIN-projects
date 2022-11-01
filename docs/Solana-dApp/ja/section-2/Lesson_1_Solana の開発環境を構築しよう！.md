### 🛠 Solana プログラムを接続するための準備をする

現段階で、Web アプリケーションの構築はほぼ完了しています。

これから Solana プログラムを作成・デプロイし、Solana チェーンと対話できるようにしていきましょう。

これは API をデプロイしてから Web アプリケーションに接続するようなものです。

> ⚠️ 注意
>
> 以下ので説明する環境構築方法は Mac 環境のものです。
>
> Windows 環境の方は[WSL ( Windows Subsystem for Linux )](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl)をインストールしたうえで、Ubuntu を起動して進めることをおすすめします。


### 🦀 Rust をインストールする

**Solana のプログラムは Rust で書かれています!**

Rust がわからなくても心配しないでください。

他のプログラミング言語を知っている限り、このプロジェクトの過程で Rust を理解することができるでしょう。

それでは早速、[Rust](https://www.rust-lang.org/ja/tools/install) をインストールしていきましょう。

ターミナルを開いて次のコマンドを実行します。

```bash
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

インストールする際に複数のオプションが表示されるので、1 を入力しましょう。

インストールが完了したらターミナルを再起動し、Rust がインストールされていることを確認します。

以下のコマンドを実行して、Rust のバージョンが表示されていれば OK です。

```bash
rustup --version
```

次に、以下のコマンドを実行して Rust コンパイラがインストールされていることを確認します。

Rust コンパイラのバージョンが表示されていれば OK です。

```bash
rustc --version
```

最後に、以下のコマンドを実行して Rust のパッケージマネージャー Cargo が機能しているかどうかを確認しましょう。

Cargo のバージョンが表示されていれば OK です。

```bash
cargo --version
```

これらすべてのコマンドでバージョン情報が出力され、エラーが発生しなければ問題はありません。


### 🔥 Solana をインストールする

Solana の[公式サイト](https://docs.solana.com/cli/install-solana-cli-tools#use-solanas-install-tool)を参考にインストールしましょう。

Solana CLI を Windows、Linux、および Mac にインストールするための手順が記載されているのでご確認ください。

※ 安定版をインストールするには、以下のようにバージョン番号を `stable` に置き換えます（以下のコマンドは参考ですので、環境にあったインストール方法を実行してください）。

```bash
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
```

> ⚠️ 注意
>
> Solana をインストールすると、 `Close and reopen your terminal to apply the PATH changes or run the following in your existing shell:` というメッセージが出力される場合があります。
>
> このメッセージが表示された場合は、メッセージに続くコマンドをコピーして PATH が正しく設定されるようにコマンドを実行してください。

インストールが完了したら、以下のコマンドを実行して Solana のバージョンを確認します。

以下のコマンドを実行します。

```bash
solana --version
```

次に、以下の 2 つのコマンドを別々に実行してください。

```bash
solana config set --url localhost
solana config get
```

コマンドを入力すると以下のように出力されます。

```bash
Config File: 任意のディレクトリ名\.config\solana\cli\config.yml
RPC URL: http://localhost:8899
WebSocket URL: ws://localhost:8900/ (computed)
Keypair Path: ~/.config/solana/devnet.json
Commitment: confirmed
```

この設定は Solana プログラムがローカルネットワークと通信するように設定されていることを意味しています。

プログラムを開発するとき、ローカルに稼働させた Solana ネットワークを使用して作業することで、すばやくテストすることができます。

また、プログラムのテスト用に、ローカルコンピューターにバリデーターを設定することもできます。

以下のコマンドを実行しましょう。

```bash
solana-test-validator
```

開始されると以下のように表示されます。

![solana test validator](/public/images/Solana-dApp/section-2/2_1_1.jpg)

これで、ローカルバリデーターが実行されました。


### ☕️ Node.js / NPM / Mocha をインストールする

ここまでの段階で `Node.js` と `NPM` はインストールされていると思います。

不安な方は以下のコマンドを別々に実行して、それぞれのバージョン情報が出力されるかどうか確認してみてください。

```bash
node -v
npm -v
```

上記の確認ができたら、次はテストフレームワーク Mocha をインストールしましょう。

以下のコマンドを実行します。

```bash
npm install -g mocha
```


### ⚓️ Anchor をインストールする

Solana プログラムを作成する前に、Solana 用のフレームワーク[Anchor](https://hackmd.io/@ironaddicteddog/solana-anchor-escrow)をインストールしましょう。

Anchor は Solana のために作られた Hardhat のようなものです。

Anchor をインストールする前に、まずはパッケージマネージャー `yarn` を以下のコマンドを実行してインストールします。

```bash
npm install -g yarn
```

次に、以下のコマンドを実行して Anchor CLI をインストールします。

```bash
npm i -g @project-serum/anchor-cli
```

続いて、以下のコマンドを実行して Anchor のバージョン情報を出力しましょう。

```bash
anchor --version
```

バージョン情報が出力されていれば OK です。

また、Anchor の npm モジュールと Solana Web3.js を使用するため、こちらも併せてインストールしておきましょう。

以下のコマンドを実行します。

```bash
npm install @project-serum/anchor @solana/web3.js
```

ここまでで Anchor を使用するための準備が整いました。


### 🏃‍♂️ Solana プロジェクトを作成する

以下のコマンドを実行して Solana プロジェクトのテンプレートを作成します。

```bash
anchor init myepicproject --javascript
```

まるで React の create-react-app のように、実行したディレクトリ内に様々なファイルやディレクトリが作成されます。


### 🔑 ローカルキーペアを作成する

Solana プログラムと通信するには、トランザクションにデジタル署名をするためのキーペアを生成する必要があります。

上記のコマンドで生成したディレクトリに移動して、以下のコマンドを実行してキーペアを作りましょう。

```bash
solana-keygen new
```

パスフレーズの作成を求められますが、何も入力せずに[Enter]を押してください。

次に、以下のコマンドを実行して、作成したキーペアを確認します。

```bash
solana address
```

作成したローカルウォレットのパブリックアドレスが表示されれば OK です。


### 🥳 テストプログラムを実行する

プログラムを実行するには以下の手順が必要になります。

1\. プログラムをコンパイルする。

2\. ウォレットアドレスを使用してローカルの Solana ネットワーク上にデプロイする。

3\. デプロイされたプログラムを実行する。

実は、Anchor を利用することでこれらの手順を 1 つステップで実行できます。

以下のコマンドを実行してみてください。

```bash
anchor test
```

※ 初めて実行するときはしばらく時間がかかる場合があります。

出力の一番下に「1 passing」という緑色の単語が表示されていれば問題ありません。

![anchor test](/public/images/Solana-dApp/section-2/2_1_2.jpg)

これでようやく Solana 環境のセットアップに成功しました。


### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#solana-dapp` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 4 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンでは、Solana プログラムを作成していきます!

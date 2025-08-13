### 🦾 本セクションで行うこと

セクション2の目標は、ユーザーが**ウォレットを接続し、ミントをクリックして、ウォレット内のコレクションから NFT を受け取ることができる Web アプリケーションを作成することです。**

これを実行するには、Solana CLIとCandy Machine CLIをインストールする必要があります。

Solana CLIを使用すると、実際の [バリデーター](https://solana.com/validators) によって実行される実際のブロックチェーンであるdevnetにデプロイできます。

Candy Machine CLIを使用すると、MetaplexのデプロイされたNFTコントラクトと通信できます。このプロジェクトでは、SugarというCLIツールを使用して下記を実行していきます。

1\. Candy Machineを作成する

2\. NFTをCandy Machineにアップロードする

3\. ユーザーが実際にCandy Machineを叩いてNFTを作成できるようにします。

### 🔥 Solana をインストールする

[公式サイト](https://docs.solana.com/cli/install-solana-cli-tools#use-solanas-install-tool) を参考にSolanaをインストールしましょう。

Solana CLIをWindows、Linux、およびMacにインストールするための手順が記載されているのでご確認ください。

※ 安定版をインストールするには、次のようにバージョン番号を`stable`に置き換えます。

```
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
```

⚠️ 注意: Solanaインストールの注意

> システムによっては、Solana をインストールすると、「PATH 環境変数を更新してください」などのメッセージが出力され、コピーして実行するための行が表示される場合があります。
>
> そのコマンドをコピーして実行し、PATH が正しく設定されるようにしてください。
>
> PATH の更新後はターミナルで`source ~/.bash_profile`を叩いて PATH を更新してください。

インストールが完了したら、ターミナルで下記を実行し、機能していることを確認します。

```txt
solana --version
```

バージョンが表示された場合は次に進んでください。

次に下記2つのコマンドを別々に実行してください。

```txt
solana config set --url devnet
solana config get
```

コマンドを入力すると次のように出力されます。

```txt
Config File: /Users/任意のディレクトリ名/.config/solana/cli/config.yml
RPC URL: https://api.devnet.solana.com
WebSocket URL: wss://api.devnet.solana.com/ (computed)
Keypair Path: /Users/任意のディレクトリ名/.config/solana/id.json
Commitment: confirmed
```

本プロジェクトはすべて、Solanaのdevnet上に直接構築します。これはSolanaのステージング環境のようなもので、開発者は無料で使用できます。

### 💦 Help me

Solanaのセットアップは複雑なため、うまくいかないことがあるかもしれません。その場合はDiscordの`#solana`にメッセージを投稿して、メンバーに助けを求めてみてください。

OS情報、エラーのスクリーンショットなど、できるだけ多くの情報を伝えるとスムーズにデバッグが進みます。

### 🤩 Sugar をインストールする

[Metaplex Docs](https://docs.metaplex.com/developer-tools/sugar/overview/installation)を参考に、Sugarのインストールを行います。

```
bash <(curl -sSf https://sugar.metaplex.com/install.sh)
```

上記のコマンドを実行すると、Sugarのインストールスクリプトが実行されます。このとき、インストールするSugarのバージョンを問われますがこのプロジェクトではCandy Machine V3を使用するため、`V2.x`を選択してください。下記の実行例では1. `v2.1.1`を選択しています。

```
# 実行例
$ bash <(curl -sSf https://sugar.metaplex.com/install.sh)

🍬 Sugar CLI binary installation script
---------------------------------------

Checking available releases...

🧰 Available releases:

Recommended:
1. v2.1.1 (Metaplex Candy Machine V3)

Legacy:
2. v1.2.2 (Metaplex Candy Machine V2)

Select a release [1-2] (default 1): 1

🖥  Downloading binary
############################################################################################################# 100.0%

📤 Moving binary into place

'sugar' binary will be moved to '/Users/任意のディレクトリ/.cargo/bin'.

✅ Installation successful: type 'sugar' to start using it.
```

先に進む前に、`sugar --version`を実行して、インストール時に選択したバージョンが表示されるかを確認しましょう。

```
# 実行例
$ sugar --version

sugar-cli 2.1.1
```

バージョンが表示されていれば、インストールは成功です。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#solana`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンに進んで、NFT画像の準備をしましょう 🎉

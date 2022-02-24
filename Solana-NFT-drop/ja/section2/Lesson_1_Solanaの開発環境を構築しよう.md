🦾 本セクションで行うこと
----

セクション2の目標は、ユーザーが**ウォレットを接続し、ミントをクリックして、ウォレット内のコレクションから NFT を受け取ることができるWEBアプリを作成することです。**

これを実行するには、SolanaCLI と MetaplexCLI をインストールする必要があります。

Solana CLI を使用すると、実際の [バリデーター](https://solana.com/validators) によって実行される実際のブロックチェーンである devnet にデプロイできます。

Metaplex CLI を使用すると、Metaplex のデプロイされたNFTコントラクトと通信することができます。smart-contracts-as-a-service を使用して、下記を実行していきます。

1. Candy Machine を作成する

2. NFT を Candy Machine にアップロードする

3. ユーザーが実際に Candy Machine を叩いて NFT を作成できるようにします。

🤖 必要なツールをインストールする
----

Candy Machine CLI と通信するには、いくつかの開発ツールをインストールする必要があります。

下記コマンドを実行し、開発環境を確認してください。

```txt
git version
> git version 2.31.1 (以降のバージョンであれば問題ないです)

node --version
> v14.17.0 (これ以降のバージョンかつ, v17以下であれば問題ありません。 -- 私たちはnode v16がベストだと思います)

yarn --version
> 1.22.11 (以降のバージョンであれば問題ないです)

ts-node --version
> v10.2.1(以降のバージョンであれば問題ないです)
```

これらのコマンドのいずれかが見つからない場合は、先に進む前に必ずインストールしてください。

- [gitインストール](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

- [nodeのインストール](https://nodejs.org/en/download/)

- [yarnのインストール](https://classic.yarnpkg.com/lang/en/docs/install)

- [ts-nodeのインストール](https://www.npmjs.com/package/ts-node#installation)

必ず `ts-node` を**ルートディレクト**にインストールしてください。

次のコマンドを使用してください：`npm install -g ts-node`

>インストール中に EACCES 権限エラーが発生した場合は、この [リンク](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally) をチェックしてください。

🔥 Solanaをインストールする
----

[公式サイト](https://docs.solana.com/cli/install-solana-cli-tools#use-solanas-install-tool) を参考に Solana をインストールしましょう。

Solana CLI を Windows、Linux、および Mac にインストールするための手順が記載されているのでご確認ください。

※ 安定版をインストールするには、次のようにバージョン番号を `stable` に置き換えます。

```
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
```

⚠️ 注意: Solana インストールの注意
> システムによっては、Solana をインストールすると、「PATH環境変数を更新してください」などのメッセージが出力され、コピーして実行するための行が表示される場合があります。
>
>そのコマンドをコピーして実行し、PATH が正しく設定されるようにしてください。
>
>PATH の更新後はターミナルで `source ~/.bash_profile` を叩いて PATH を更新してください。

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

本プロジェクトは全て、Solana の devnet 上に直接構築します。これは Solana のステージング環境のようなもので、開発者は無料で使用できます。

☹️ Help me!
----

Solana のセットアップは複雑なため、うまくいかないことがあるかもしれません。その場合は `section-2-help` にメッセージを投稿して、メンバーに助けを求めてみてください。

OS情報、エラーのスクリーンショットなど、できるだけ多くの情報を伝えるとスムーズにデバッグが進みます。

🤩 MetaplexCLI を使ってみる
----

Solana CLI がインストールできました。次に Candy Machine を作成するために MetaplexCLI をインストールする必要があります。

Github からリポジトリのクローンを作成することから始めましょう。

⚠️: リポジトリをユーザーのホームフォルダに複製することをお勧めします。

ターミナルで `cd` コマンドを使用してホームディレクトリへ移動し、下記コマンドを入力してください。

```txt
git clone -b v1.1.1 https://github.com/metaplex-foundation/metaplex.git ~/metaplex
```

ここからは、Metaplex をインストールしたディレクトリでこのコマンドを使用して、この CLI のすべての依存関係をインストールするだけです。

下記のコードは生成されたディレクトリに移動せず、ホームディレクトリからコマンドを実行してください。`metaplex` ディレクトリの中に入ることはありません。

```txt
yarn install --cwd ~/metaplex/js/
```

`There appears to be trouble with your network connection. Retrying...` というエラーが表示された場合は下記コマンドを入力してみてください。

```txt
yarn install --cwd ~/metaplex/js/ --network-timeout 600000
```

Yarn 側で設定されているデフォルトのタイムアウトが低すぎるため、この時間が経過するとネットワークの問題だと判断されてしまうためです。

先に進む前に、次のコマンドを実行して `version` を確認しましょう。

```txt
ts-node ~/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts --version
```

`0.0.2` が表示されるはずです。これで NFT 設定を始めることができます。

⚠️: 注意
> MacOS を使用している場合、古いバージョンの MetaplexCLI がインストールされていると問題が発生する可能性があります。
>
>ルートディレクトリの `metaplex` ディレクトリを必ず削除してから上記の設定を行ってください。

🙋‍♂️ 質問する
-------------------------------------------
ここまでの作業で何かわからないことがある場合は、Discord の `#section-2-help` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください✨
```
1. 何をしようとしていたか
2. エラー文をコピー&ペースト
3. エラー画面のスクリーンショット
```

------
次のレッスンに進んで、NFT画像の準備を行いましょう🎉

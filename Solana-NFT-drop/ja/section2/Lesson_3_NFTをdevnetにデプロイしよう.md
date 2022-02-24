🛫 Candy Machine と NFT を devnet に接続する
----

本プロジェクトのメインパートです。Candy Machine と NFT を devnet に持ち込みます。

Candy Machine v2 により、このプロセスが大幅に簡素化されました。

1つのコマンドで、以下を実行できます。

1. NFTを [Arweave](https://www.arweave.org) (分散型ファイルストア)にアップロードし、Candy Machine の構成を初期化する

2. Metaplex のコントラクトで Candy Machine を作成する

3. Candy Machine を、価格、番号、開始日、その他諸々の設定を実施する

🔑 Solana キーペアの設定
----

アップロードするためには、ローカルの Solana キーペアを設定する必要があります。

※ 過去にこの作業を行ったことがある場合は、引き続き以下の手順に従ってください。

NFT を Solana にアップロードするためには、コマンドラインで作業するための「ローカルウォレット」が必要になります。

ウォレットは基本的に公開鍵と秘密鍵の「キーペア」であり、ウォレットがなければ Solana と通信することはできません。

これは以下のコマンドを実行することで可能です。

※パスフレーズの入力を求められたら、Enter キーを押して空にしておくといいでしょう。

```txt
solana-keygen new --outfile ~/.config/solana/devnet.json
```

ここから、このキーペアをデフォルトのキーペアとして設定できます。

```txt
solana config set --keypair ~/.config/solana/devnet.json
```

ここで、`solana config get` を実行すると、次のように `devnet.json` が `KeypairPath` として表示されます。

```txt
Config File: /Users/任意のフォルダ名/.config/solana/cli/config.yml
RPC URL: https://api.devnet.solana.com
WebSocket URL: wss://api.devnet.solana.com/ (computed)
Keypair Path: /Users/任意のフォルダ名/.config/solana/devnet.json
Commitment: confirmed
```

下記コマンドで Solana の仮想通貨である SOL の保有数を確認できます。

```txt
solana balance
```

`0SOL` と出力されます。

SOL なしでは Solana にデータをデプロイすることはできません。

ブロックチェーンにデータを書き込むには、コストがかかります。

　現在 devnet 上にいるので、偽の SOL を自分自身に与えることができます。

下記実行します。

```txt
solana airdrop 2
```

もう一度 `solana balance` を実行して、2 SOLと表示されるはずです。

※ 偽のSOLが不足した場合は、上記のコマンドを再度実行してください

🎂 Candy Machine を構築する
---

`Candy Machine` にどのような動作をさせるかを伝えるには、設定が必要です。`Candy MachineV2` はこれを簡単に行うことができます。

プロジェクトのルートフォルダ（ `assets` フォルダと同じ場所）に `config.json` というファイルを作成し、以下の内容を追加します。

```json
{
    "price": 0.1,
    "number": 3,
    "gatekeeper": null,
    "solTreasuryAccount": "<YOUR WALLET ADDRESS>",
    "splTokenAccount": null,
    "splToken": null,
    "goLiveDate": "05 Jan 2021 00:00:00 GMT",
    "endSettings": null,
    "whitelistMintSettings": null,
    "hiddenSettings": null,
    "storage": "arweave",
    "ipfsInfuraProjectId": null,
    "ipfsInfuraSecret": null,
    "awsS3Bucket": null,
    "noRetainAuthority": false,
    "noMutable": false
}
```

最初は少し難しいと思うかもしれませんが、必要なのはこのうち5つだけです。残りのものは今のところ無視します。それでは必要な項目を見ていきましょう。

- `price`：各 NFT の価格

- `number`：デプロイしたい NFT の数。イメージと json のペアの数と一致していないとバグが起きます。

- `solTreasuryAccount`：あなたの Phantom Wallet のアドレスです。SOL 支払いからの手続きが行われるウォレットになります。

- `goLiveDate`：ミントを開始日時を設定します。

- `storage`：あなたの NFT が保存される場所です。

ここでは `solTreasuryAccount` だけ修正します。

`solTreasuryAccount` にはあなたの Fantom Wallet のアドレスを入力しましょう。

余談ですが、devnet には最大10個の NFT をデプロイできます。

今回は NFT を3つしか上げないのですが、3つ以上あげたい場合は `number` の数字を変更してください。

🚀  NFT をアップロードし、Candy Machine を作成する
----

次に、Metaplex の `upload` コマンドを使用して、`Assets` ディレクトリにある NFT をアップロードし、Candy Machine を作成します。この作業は一度に行われます。

このコマンドは `assets` ディレクトリの1つ上の階層から実行する必要があります。

※ ターミナルから `ls` を入力して、下記のようなディレクトリになっていれば大丈夫です。

![無題](/public/images/Solana-NFT-mint/section2/2_3_1.png)

それでは下記コマンドをターミナルに入力し、NFT をアップロードしましょう。

```txt
ts-node ~/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts upload -e devnet -k ~/.config/solana/devnet.json -cp config.json ./assets

```

`no such file or directory, scandir './assets'` のようなエラーが出た場合は、コマンドの実行場所が間違っていることを意味します。必ず `assets` フォルダがあるのと同じディレクトリで実行してください。

`upload` コマンドは下記を実行しています。

- `assets` フォルダ内のすべての NFT ペアを取得する

-  Arweave に NFT をアップロードする

- これらの NFT へのポインタを保持する Candy Machine の config を初期化する

- その config を Solana の devnet に保存


このコマンドが実行されると、現在どの NFT がアップロードされているか、ターミナルに何らかの出力が表示されるはずです。

```txt
wallet public key: A1AfJpXEiqiP3twp6CdZCWixpyx6p8E26zej4TNQ12GT
WARNING: The "arweave" storage option will be going away soon. Please migrate to arweave-bundle or arweave-sol for mainnet.

Beginning the upload for 3 (img+json) pairs
started at: 1641470635118
Size 3 { mediaExt: '.png', index: '0' }
Processing asset: 0
initializing candy machine
initialized config for a candy machine with publickey: 5FUh6tm4sATuCA6hth9a4JAuko9GEAhsewULrXa5zS8C
Processing asset: 0
Processing asset: 1
Processing asset: 2
Writing indices 0-2
Done. Successful = true.
ended at: 2022-01-06T12:04:38.862Z. time taken: 00:00:43
```

`initialized config for a candy machine"` と記載され、キーを出力している箇所を見てください。

そのキーをコピーして Solana の [Devnet Explorer](https://explorer.solana.com/?cluster=devnet) に貼り付けると、実際にブロックチェーンにデプロイされたことが確認できます。ぜひやってみてください。

将来的に必要になるので、このアドレスを手元に置いておきましょう。

ここで、NFTを変更して再度 `upload` を実行しても、実際には新しいものはアップロードされないことに気づくでしょう。

```txt
ts-node ~/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts upload -e devnet -k ~/.config/solana/devnet.json -cp config.json ./assets
```

その理由は、このデータを保存する `.cache` フォルダが作成されているからです。

変更したい場合はプロジェクトのルートディレクトリに存在している `.cache` フォルダを削除して、`upload` を再度実行する必要があります。

これにより、Candy Machine 構成が初期化されます。

コレクションを公開する前にコレクションに変更を加えたい場合は、必ずこれを行ってください。

✅  NFTを確認する
----

次に進む前に、下記 `verify` コマンドを実行して、NFT が実際にアップロードされたことを確認します。

```txt
ts-node ~/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts verify_upload -e devnet -k ~/.config/solana/devnet.json
```

うまくいっている場合、出力は次のようになります。

```txt
wallet public key: A1AfJpXEiqiP3twp6CdZCWixpyx6p8E26zej4TNQ12GT
Key size 3
uploaded (3) out of (3)
ready to deploy!
```

`/.cache/devnet-temp.json` ファイルを見ると、3つの Arweave リンクがあります。これらは NFT の格納先です。

Arweave リンクの1つをコピーしてブラウザに貼り付け、NFT のメタデータを確認してください。

Arweave はデータを**永続的に**保存します。

これは、IPFS / Filecoin の世界とは大きく異なります。

IPFS/ Filecoin では、ファイルを保持することを決定したノードに基づいてデータがピアツーピアで保存されます。

Arweave は一度支払うと、**永久に**保存します。

Arweave では、ファイルの大きさに応じて、保存に必要なコストを見積もる[ アルゴリズム ](https://arwiki.wiki/#/en/storage-endowment#toc_Transaction_Pricing)を作成し、これを利用しています。

[電卓](https://arweavefees.com/) を使って計算することもできます。たとえば1MBを永久に保存するには、約0.0083ドルの費用がかかります。悪くないですね。

「じゃあ、私のものをホストするのに誰がお金を払っているんだよ！」と疑問に思うかもしれませんが、[こちら](https://github.com/metaplex-foundation/metaplex/blob/59ab126e41e6d85b53c79ad7358964dadd12b5f4/js/packages/cli/src/helpers/upload/arweave.ts#L93 )のソースコードを見れば、今のところ Metaplex がお金を払ってくれていることがわかります。

🔨 Candy Machineの構成を更新する
---
Candy Machineの構成を更新するには、`config.json` ファイルを更新して、次のコマンドを実行するだけです。

```txt
ts-node ~/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts update_candy_machine -e devnet -k ~/.config/solana/devnet.json -cp config.json
```

😡 注意すべきエラー
----

以下のようなエラーが発生した場合：

```txt
/Users/flynn/metaplex-foundation/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts:53
      return fs.readdirSync(`${val}`).map(file => path.join(val, file));
                      ^
TypeError: Cannot read property 'candyMachineAddress' of undefined
    at /Users/flynn/metaplex-foundation/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts:649:53
    at step (/Users/flynn/metaplex-foundation/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts:53:23)
    at Object.next (/Users/flynn/metaplex-foundation/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts:34:53)
    at fulfilled (/Users/flynn/metaplex-foundation/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts:25:58)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
```

これは Candy Machine や NFT に関するデータが入った `.cache` フォルダにアクセスできないことを意味します。

このエラーが発生した場合は、Candy Machine のコマンドを `.cache` フォルダと `assets` フォルダがある同じディレクトリから実行しているか確認してください。起こりがちなミスなので十分注意してください！

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
次のレッスンに進んで、WEBアプリから Candy Machine を呼び出していきましょう🎉

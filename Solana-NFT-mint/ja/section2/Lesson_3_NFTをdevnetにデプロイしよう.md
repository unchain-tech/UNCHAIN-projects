本プロジェクトのメインパートです。Candy MachineとNFTをdevnetに持ち込みます。

Candy Machine v2により、このプロセスが大幅に簡素化されました。1つのコマンドで、以下を実行できます。

1. NFTを[ Arweave ](https://www.arweave.org)(分散型ファイルストア)にアップロードし、Candy Machineの構成を初期化
2. MetaplexのコントラクトでCandy Machineを作成
3. Candy Machineを、価格、番号、開始日、その他諸々の設定を実施

###  🔑  ** Solanaキーペアの設定**

アップロードするためには、ローカルのSolanaキーペアを設定する必要があります。<br>
※過去にこの作業を行ったことがある場合は、引き続き以下の手順に従ってください。

NFTをSolanaにアップロードするためには、コマンドラインで作業するための「ローカルウォレット」が必要になります。ウォレットは基本的に公開鍵と秘密鍵の「キーペア」であり、ウォレットがなければSolanaと通信することはできません。
これは以下のコマンドを実行することで可能です。<br>
※パスフレーズの入力を求められたら、Enterキーを押して空にしておくといいでしょう。
```txt
solana-keygen new --outfile ~/.config/solana/devnet.json
```

ここから、このキーペアをデフォルトのキーペアとして設定できます。

```txt
solana config set --keypair ~/.config/solana/devnet.json
```

ここで、`solana config get`を実行すると、次のように` devnet.json`が`KeypairPath`として表示されます。

```txt
Config File: /Users/任意のフォルダ名/.config/solana/cli/config.yml
RPC URL: https://api.devnet.solana.com
WebSocket URL: wss://api.devnet.solana.com/ (computed)
Keypair Path: /Users/任意のフォルダ名/.config/solana/devnet.json
Commitment: confirmed
```

下記コマンドでSolanaの仮想通貨であるSOLの保有数を確認できます。

```txt
solana balance
```

`0SOL`と出力されます。
SOLなしではSolanaにデータをデプロイすることはできません。ブロックチェーンにデータを書き込むには、コストがかかります。現在devnet上にいるので、偽のSOLを自分自身に与えることができます。
下記実行します。

```txt
solana airdrop 2
```

もう一度`solana balance`を実行して、2 SOLと表示されるはずです。

*※偽のSOLが不足した場合は、このコマンドを再度実行してください*

###  ⚙  **Candy Machineを構築する**
Candy Machineにどのような動作をさせるかを伝えるには、設定が必要です。Candy MachineV2はこれを簡単に行うことができます。プロジェクトのルートフォルダ（assetsフォルダと同じ場所）に`config.json`というファイルを作成し、以下の内容を追加します。

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

- `price`：各NFTの価格

- `number`：デプロイしたいNFTの数。イメージとjsonのペアの数と一致していないとバグが起きます。

- `solTreasuryAccount`：あなたのPhantom Walletのアドレスです。SOL支払いからの手続きが行われるウォレットになります。

- `goLiveDate`：ミントを開始日時を設定します。

- `storage`：あなたのNFTが保存される場所です。

ここでは`solTreasuryAccount`だけ修正します。`solTreasuryAccount`にはあなたのfantom walletのアドレスを入力しましょう。

余談ですが、devnetには最大10個のNFTをデプロイできます。  今回はNFTを3つしか上げないのですが、3つ以上あげたい場合は`number`の数字を変更してください。

###  🚀  ** NFTをアップロードし、Candy Machineを作成する**

次に、Metaplexの`upload`コマンドを使用して、` Assets`ディレクトリにあるNFTをアップロードし、Candy Machineを作成します。この作業は一度に行われます。

このコマンドは`assets`ディレクトリの1つ上の階層から実行する必要があります。

※ターミナルから`ls`を入力して、下記のようなディレクトリになっていれば大丈夫です。

![無題](/public/images/Solana-NFT-mint/section2/2_3_1.png)

それでは下記コマンドをターミナルに入力し、NFTをアップロードしましょう。

```txt
ts-node ~/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts upload -e devnet -k ~/.config/solana/devnet.json -cp config.json ./assets

```

*`no such file or directory, scandir './assets'`のようなエラーが出た場合は、コマンドの実行場所が間違っていることを意味します。必ずassetsフォルダがあるのと同じディレクトリで実行してください。*

`upload`コマンドは下記を実行しています。
- assetsフォルダ内のすべての NFT ペアを取得
-  Arweave にアップロード
- これらのNFTへのポインタを保持するCandy Machineのconfigを初期化
- そのconfigを Solanaのdevnetに保存


このコマンドが実行されると、現在どのNFTがアップロードされているか、ターミナルに何らかの出力が表示されるはずです。

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

`initialized config for a candy machine"`と記載され、キーを出力している箇所を見てください。そのキーをコピーしてSolanaのDevnetExplorer [ここ](https://explorer.solana.com/?cluster=devnet)に貼り付けると、実際にブロックチェーンにデプロイされたことが確認できます。ぜひやってみてください。

将来的に必要になるので、このアドレスを手元に置いておきましょう。

ここで、NFTを変更して再度`upload`を実行しても
```txt
ts-node ~/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts upload -e devnet -k ~/.config/solana/devnet.json -cp config.json ./assets
```
実際には新しいものはアップロードされないことに気づくでしょう。その理由は、このデータを保存する`.cache`フォルダが作成されているからです。

変更したい場合はプロジェクトのルートディレクトリに存在している `.cache`フォルダを削除して、 ` upload`を再度実行する必要があります。これにより、Candy Machine構成が初期化されます。コレクションを公開する前にコレクションに変更を加えたい場合は、必ずこれを行ってください。

###  ✅  ** NFTを確認する**

次に進む前に、下記 `verify`コマンドを実行して、NFTが実際にアップロードされたことを確認します。

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

/.cache/devnet-temp.json`ファイルを見ると、3つのArweaveリンクがあります。これらはNFTの格納先です。
Arweaveリンクの1つをコピーしてブラウザに貼り付け、NFTのメタデータを確認してください。

Arweaveはデータを**永続的に**保存します。これは、IPFS / Filecoinの世界とは大きく異なります。IPFS/ Filecoinでは、ファイルを保持することを決定したノードに基づいてデータがピアツーピアで保存されます。

Arweaveは一度支払うと、**永久に**保存します。Arweaveでは、ファイルの大きさに応じて、保存に必要なコストを見積もる[アルゴリズム](https://arwiki.wiki/#/en/storage-endowment#toc_Transaction_Pricing)を作成し、これを利用しています。[電卓](https://arweavefees.com/)を使って計算することもできます。たとえば1MBを永久に保存するには、約0.0083ドルの費用がかかります。悪くないですね。

「じゃあ、私のものをホストするのに誰がお金を払っているんだよ！」と疑問に思うかもしれませんが、[ここ](https://github.com/metaplex-foundation/metaplex/blob/59ab126e41e6d85b53c79ad7358964dadd12b5f4/js/packages/cli/src/helpers/upload/arweave.ts#L93 )のソースコードを見れば、今のところMetaplexがお金を払ってくれていることがわかります。

###  🔨  **Candy Machineの構成を更新します。**
Candy Machineの構成を更新するには、`config.json`ファイルを更新して、次のコマンドを実行するだけです。

```txt
ts-node ~/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts update_candy_machine -e devnet -k ~/.config/solana/devnet.json -cp config.json
```

###  😡  **注意すべきエラー**

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

これはCandy MachineやNFTに関するデータが入った`.cache`フォルダにアクセスできないことを意味します。このエラーが発生した場合は、Candy Machine のコマンドを`.cache`フォルダと `assets`フォルダがある同じディレクトリから実行しているか確認してください。起こりがちなミスなので十分注意してください！

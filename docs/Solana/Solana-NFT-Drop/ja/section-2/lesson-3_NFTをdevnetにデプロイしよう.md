### 🛫 Candy Machine と NFT を devnet に接続する

本プロジェクトのメインパートです。Candy MachineとNFTをdevnetに持ち込みます。

Candy Machine v2から、このプロセスが大幅に簡素化されました。

`sugar`コマンドで、以下を実行できます。

1\. NFTを [Arweave](https://www.arweave.org)（分散型ファイルストア）にアップロードし、Candy Machineの構成を初期化する

2\. MetaplexのコントラクトでCandy Machineを作成する

3\. Candy Machineを、価格、番号、開始日、そのほか諸々の設定を実施する

### 🔑 Solana キーペアの設定

アップロードするためには、ローカルのSolanaキーペアを設定する必要があります。

※ 過去にこの作業したことがある場合は、引き続き以下の手順に従ってください。

NFTをSolanaにアップロードするためには、コマンドラインで作業するための「ローカルウォレット」が必要になります。

ウォレットは基本的に公開鍵と秘密鍵の「キーペア」であり、ウォレットがなければSolanaと通信できません。

これは以下のコマンドを実行できます。

※パスフレーズの入力を求められたら、Enterキーを押して空にしておくとよいでしょう。

```txt
solana-keygen new --outfile ~/.config/solana/devnet.json
```

ここから、このキーペアをデフォルトのキーペアとして設定できます。

```txt
solana config set --keypair ~/.config/solana/devnet.json
```

ここで、`solana config get`を実行すると、次のように`devnet.json`が`KeypairPath`として表示されます。

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

SOLなしではSolanaにデータをデプロイできません。

ブロックチェーンにデータを書き込むには、コストがかかります。

現在devnet上にいるので、偽のSOLを自分自身に与えることができます。

下記コマンドを実行します。

```txt
solana airdrop 2
```

もう一度`solana balance`を実行して、2 SOLと表示されるはずです。

※ 偽のSOLが不足した場合は、上記のコマンドを再度実行してください

### 🎂 Candy Machine を構築する

`Candy Machine`にどのような動作をさせるかを伝えるには、設定が必要です。

Section2 Lesson1の環境構築でインストールした`sugar`コマンドを用いて、設定ファイルを作成しましょう。設定ファイルは、アセット数、使用するクリエイター、適用する設定などの値で、キャンディマシンをどのように構成するかをSugarに指示します。それでは、下記コマンドを実行してください。

```
sugar config create
```

いくつかの質問に答えていきます。下記の例は質問とその入力例になります。詳しくは[公式ドキュメント](https://docs.metaplex.com/programs/candy-machine/how-to-guides/my-first-candy-machine-part1#create-a-config-file)を参考にしてください。

```
# 入力例
✔ Found 3 file pairs in "assets". Is this how many NFTs you will have in your candy machine? #「y」を入力
✔ Found no symbol in your metadata file. Is this value correct? #「y」を入力
✔ What is the seller fee basis points? #「500」を入力
✔ Do you want to use a sequential mint index generation? We recommend you choose no. #「n」を入力
✔ How many creator wallets do you have? (max limit of 4) #「1」を入力
✔ Enter creator wallet address #1 · $ solana address で取得したアドレスを入力
✔ Enter royalty percentage share for creator #1 (e.g., 70). Total shares must add to 100. · 「100」を入力
✔ Which extra features do you want to use? (use [SPACEBAR] to select options you want and hit [ENTER] when done) · #「Enter」を押す
✔ What upload method do you want to use? #「Bundlr」を選択
✔ Do you want your NFTs to remain mutable? We HIGHLY recommend you choose yes. #「y」を入力

[2/2] 📝 Saving config file

Saving config to file: "config.json"

Successfully generated the config file. 🎉

✅ Command successful.
```

`config.json`ファイルがプロジェクトのルートに作成されたことを確認しましょう。

次に、`assets`内のファイルをBundler経由でArweaveにアップロードします。

```
sugar upload
```

assetsディレクトリの各アセットがArweaveにアップロードされ、そのURIがキャッシュファイルに保存されました。

アップロード終了時に生成される`cache.log`ファイル内の`image_link`や`metadata_link`にアクセスしてみましょう。前のレッスンで準備したNFT画像やメタデータが表示されたでしょうか？

なお、この時点では、cache.jsonファイルの最初に記載されているcandyMachineに関する値は空です。

次に、Candh Machineをデプロイします。

```
sugar deploy
```

```
# 実行例
sugar deploy

[1/3] 📦 Creating collection NFT for candy machine
Collection mint ID: FTE4mtHZPexDUeVsq4Zmc7GoKXx8rCJkceFSK1YAU7DW

[2/3] 🍬 Creating candy machine
Candy machine ID: 6PLikotuLDHonQanV1Uk8xekSkyTvthYbtSPVTXV2rEU

[3/3] 📝 Writing config lines
Sending config line(s) in 1 transaction(s): (Ctrl+C to abort)
[00:00:02] Write config lines successful █████████████████████████████████████████████████████████████████ 1/1

✅ Command successful.
```

デプロイ完了後、再度`cache.json`ファイルを開いてみましょう。デプロイ前は空だったcandyMachineの値が設定されていることが確認できます。なお、この時点では、candyGuardの値は空です。

また、以下のコマンドを実行するとCandy Machineのデプロイに成功したかを再確認することができます。

```
sugar verify
```

価格や開始日などのコンフィギュレーションをどこで設定するのか気になりますよね。そこで、キャンディマシンV3では、ガードの出番です。

`config.json`ファイルを更新します。初期設定では`null`が設定されている`"guards"`を以下のように更新しましょう。

```json
"guards": {
  "default": {
    "solPayment": {
      "value": 0.1,
       "destination": "WALLET_ADDRESS_TO_PAY_TO"
    },
    "startDate": {
      "date": "2023-01-01T00:00:00Z"
    }
  }
}
```

- `solPayment`は、宛先のウォレット（destination）に0.1 SOL（value）の支払いを要求します。
- `startDate`は、設定した日付（ここでは2023年01月01日00:00:00）より前のミントを許可しないように制限します。

`destination`の値は、SOLを受け取るアドレスを設定しましょう。

これでドロップ開始時刻を設定することができました。それでは、以下のコマンドを実行してガードの設定を適用しましょう。

```
sugar guard add
```

コマンド実行後、再度`cache.json`ファイルを開いてみましょう。candyGuardの値が設定されていることが確認できます。

現在のガード設定を確認するには、以下のコマンドを実行します。

```
sugar guard show
```

なお、ガードの設定を更新したい場合は、ファイルを更新後にアップロードコマンドを実行する必要があります。

```
sugar guard update
```

Candy Machineの構築とデプロイが成功したので、次はブラウザからミントができるようにしましょう！

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

おめでとうございます!　セクション2は終了です!

ぜひ、ターミナルの出力結果をコミュニティに投稿してください!

あなたの成功をコミュニティで祝いましょう 🎉

次のレッスンでは、WebアプリケーションからCandy Machineを呼び出していきます!

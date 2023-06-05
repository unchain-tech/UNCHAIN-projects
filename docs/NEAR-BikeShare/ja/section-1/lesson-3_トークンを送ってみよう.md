ここまでであなたは以下のことを実行しました ✨

- アカウント作成（環境変数IDへexport）
- サブアカウント作成
- サブアカウントに`ftコントラクト`をデプロイ

このレッスンでは以下のことに挑戦します 🚀

- オリジナルトークンの発行
- アカウントの登録
- トークンの転送

### 🌱 トークンを発行しよう

トークンを発行するためにコマンドラインから以下のコマンドを実行しましょう！

```
$ near call sub.$ID new '{"owner_id": "'$ID'", "total_supply": "1000000000000000", "metadata": { "spec": "ft-1.0.0", "name": "My First Token", "symbol": "MYFT", "decimals": 8 }}' --accountId $ID
```

実行結果
![](/public/images/NEAR-BikeShare/section-1/1_3_1.png)

`near cli`でコントラクトのメソッドを呼ぶ場合はこのような構文になっています。

```
near call (or view) [コントラクトのデプロイされたアカウント名] [メソッド名] [メソッドの引数(json形式)]
```

つまり、先ほどのコマンドでは、`sub.ft_account.testnet`のコントラクト(`ftコントラクト`)の
`new`メソッドを引数とともに呼び出していました。
引数では

```
owner_id: 発行したftを所有するアカウント名 (今回はft_account.testnetを指定)
total_supply: 発行する総量
metadata: ftに関するメタデータ
```

を指定していました。
メタデータの中身は発行するftのシンボルなどを指定していました。(詳しくは[こちら](https://nomicon.io/Standards/Tokens/FungibleToken/Metadata#reference-level-explanation)を参照してください)

また、`--accountId`によってどのアカウントから`new`メソッドを呼び出すかを指定していました。

`new`メソッドの呼び出しを終えたら、[testnet wallet](https://wallet.testnet.near.org/)から
owner_idで指定したアカウントにftが発行されていることを確認しましょう！

![](/public/images/NEAR-BikeShare/section-1/1_3_2.png)

### 🎈 コントラクトのメソッドについて

ブロックチェーン上にデプロイされたスマートコントラクトにはメソッド（関数）が用意されています。
コントラクトのメソッドを呼び出すことでそのコントラクトの機能を使えるということです。
メソッドには大きく分けて2種類あります。
コントラクトの情報を読み取るのみのメソッドと情報を書き換えるメソッドです。
読み取るのみのメソッドを`viewメソッド`、書き換えるメソッドを`changeメソッド`と呼ぶことにしましょう。
以下に各メソッドの特徴を整理します。

**`viewメソッド`**

- 呼び出しに手数料（ガス代）がかからない
- アカウントなしで呼び出すことが可能
- `near-cli`から呼び出す際には`near view`で呼び出す

**`changeメソッド`**

- 呼び出す際に手数料（ガス代）がかかる
- アカウントから呼び出す必要がある
- `near-cli`から呼び出す際には`near call`で呼び出す

### 🚢 トークンを転送しよう

トークンを転送するために [testnet wallet](https://wallet.testnet.near.org/) から（好きな名前で）他のアカウントを作成しましょう。

![](/public/images/NEAR-BikeShare/section-1/1_3_3.png)

ここでは`ft_receiver.testnet`というアカウントを作成しました。
コマンドラインから操作できるように`near-cli`で作成したアカウントにログインしましょう。

```
$ near login
```

そしてトークンのやり取りを行うために、`ft_receiver.testnet`を`ftコントラクト`に登録します。
以下を実行しましょう。

```
$ near call sub.$ID storage_deposit '' --accountId ft_receiver.testnet --amount 0.00125
```

実行結果
![](/public/images/NEAR-BikeShare/section-1/1_3_4.png)

このアカウントの登録作業は`ftコントラクト`が[NEP-145](https://nomicon.io/Standards/StorageManagement)という規約（ルール）に則ったストレージマネジメントを採用していることが所以です。

> ストレージマネージメント
> NEAR は[ストレージステーキング](https://docs.near.org/concepts/storage/storage-staking)という仕組みを採用しており、
> コントラクトのアカウントはブロックチェーン上で使用するすべてのストレージをカバーするのに十分な残高(NEAR)を持っていなければなりません。
> `ftコントラクト`では ft のやり取りをするアカウントが増えるほど、アカウント情報を保存するために使用するストレージが増えてゆきます。
> そのため長期的に増えてゆくストレージコストをユーザアカウントに払ってもらおうというのがここでいうストレージマネージメントで,
> そのルールをまとめたのが`NEP-145`です。

先ほど実行した`storage_deposit`というメソッドは`ftコントラクト`に`NEP-145`に則って実装されているもので,
`ft_receiver.testnet`は`0.00125NEAR`を支払い登録を行いました。

それではトークンの転送を行います！
コマンドラインで以下を実行します。

```
$ near call sub.$ID ft_transfer '{"receiver_id": "ft_receiver.testnet", "amount": "19"}' --accountId $ID --amount 0.000000000000000000000001
```

実行結果（結果に表示されるURLをブラウザに貼り付けるとトランザクションの内容が見られます）。
![](/public/images/NEAR-BikeShare/section-1/1_3_5.png)

結果を[testnet wallet](https://wallet.testnet.near.org/)で確認することもできますが、`viewメソッド`の`ft_balance_of`を使用して`ft_receiver.testnet`の残高を確認してみましょう。

```
$ near view sub.$ID ft_balance_of '{"account_id": "ft_receiver.testnet"}'
```

実行結果
![](/public/images/NEAR-BikeShare/section-1/1_3_6.png)

トークンの転送が完了しました 🎉

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
このセクションでの作業はここで終了です。
トークンの転送結果を`#near`に投稿して、あなたの成功をコミュニティで祝いましょう 🎉
最後にコントラクトのコードを少しだけ覗きに行きます！
次のレッスンに進みましょう！

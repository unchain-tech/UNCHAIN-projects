ここまでで必要な API はほぼ揃いました。

では、これから Web アプリケーションと Solana プログラムを接続しましょう。

まず、Solana のテストネットである Devnet に Solana プログラムをデプロイする必要があります。


### 🌳 Devnet の環境設定をする

Devnet にデプロイするのはかなり大変です。

必要なステップを見逃さないように注意しながら進めてください。

まず、Devnet への切り替えを行います。

```bash
solana config set --url devnet
```

次に。以下のコマンドを実行します。

```bash
solana config get
```

このコマンドは Anchor がどこにデプロイするかを知る方法です。

Solana ネットワークの接続先の設定が `https://api.devnet.solana.com` となっていることを確認してください。

![solana config](/public/images/301-Solana-dApp/section-3/3_1_1.jpg)

それでは、次に Devnet 上の SOL をエアドロップしましょう。

エアドロップはとても簡単です。

以下のコマンドを 2 回実行してください。

```bash
solana airdrop 2
```

次に、以下のコマンドを実行します。

```bash
solana balance
```

ウォレットに 4 SOL が入っていることを確認できました。（Devnet での残高を取得しています。）

※ 現時点では、一度にエアドロップできる SOL の量は 2 SOL までです。

![airdrop](/public/images/301-Solana-dApp/section-3/3_1_2.jpg)


### ✨ 変数を変更する

Devnet に接続するために、`Anchor.toml` の変数を変更する必要があります。

まず、`[programs.localnet]` を `[programs.devnet]` に変更します。

次に、`cluster="localnet"` を `cluster="devnet"` に変更します。

上記の変更が完了したら、以下のコマンドを実行してください。

```bash
anchor build
```

これにより、プログラム ID を持つ新しいビルドが作成されます。

以下のコマンドを実行することでアクセスできます。

```bash
solana address -k target/deploy/myepicproject-keypair.json
```

これによりプログラム ID が出力されます。

このプログラム ID は後ほど使うので、コピーしておいてください。

次に、`lib.rs` にを表示します。

この ID が上部に表示されているはずです。

```bash
declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");
```

このプログラム ID は `anchor init` で最初に自動生成される ID です。

プログラム ID とは、プログラムを読み込んで実行する方法を指定し、Solana ランタイムがどのようにプログラムを実行するかの情報を含んでいる ID のことを指します。

この ID があることで、Solana はプログラムによって生成されたすべてのアカウントを確認、参照することができるようになります。

したがって、`declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");` の ID 部分を `solana address -k target/deploy/myepicproject-keypair.json` コマンドで出力されたプログラム ID に変更する必要があります。

また、`Anchor.toml` の `[programs.devnet]` 下の`myepicproject="Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"` の ID 部分も上記と同じように変更する必要があります。

以上の 2 か所でプログラム ID を変更しましたか？

ここまで終わったら、以下のコマンドを再度実行しましょう。

```bash
anchor build
```

新しいプログラム ID でプロジェクトをビルドしました。

Anchor はビルド時に特定のファイルを `target` ディレクトリの下に生成します。

それらの生成されたファイルが最新のプログラム ID を持っているか確認しましょう。

Devnet の設定には様々な手順がありました。

以下に使用したコマンドをまとめます。

```bash
solana config set --url devnet

// devnetに切り替えられていることを確認します。
solana config get

anchor build

// 新しいプログラムIDを入手します。
solana address -k target/deploy/myepicproject-keypair.json

// Anchor.tomlとlib.rsの必要な個所を新しいプログラムIDに更新します。
// Anchor.tomlがdevnet上にあることを確認します。

// 再ビルドします。
anchor build
```

### 🚀 Devnet にデプロイする

Devnet に Solana プログラムをデプロイしましょう。

```bash
anchor deploy
```

デプロイには少し時間がかかる場合があります。

以下の画像のように `Deploy success` という単語が表示されていればデプロイ完了です。

![Deploy success](/public/images/301-Solana-dApp/section-3/3_1_3.jpg)


完了したら、[Solana Explorer](https://explorer.solana.com/?cluster=devnet)にアクセスして、すべてがうまくいったかどうかを確認します。

※ 今回は Devnet にデプロイしたため、必ず右上の接続先が [Devnet] になっているかどうか確認する必要があります。

エスプローラーで、プログラム ID （ `solana address -k target/deploy/myepicproject-keypair.json` で取得した ID ）を貼り付けて検索します。

デプロイされた Solana プログラムが表示されたら、下にスクロールしてトランザクション履歴を確認すると、そこにデプロイ履歴が表示されているので確認してみてください。

![solana explorer](/public/images/301-Solana-dApp/section-3/3_1_4.jpg)

> ⚠️ 注意
>
> Solana プログラムを変更する際は、毎回再デプロイして上記のステップを踏む必要があります。

※ Devnet は「メインネット」ではありませんが、Devnet もマイナーによって運営されています。


### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#section-3` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 4 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンでは、Solana プログラムと Web アプリケーションを接続します!

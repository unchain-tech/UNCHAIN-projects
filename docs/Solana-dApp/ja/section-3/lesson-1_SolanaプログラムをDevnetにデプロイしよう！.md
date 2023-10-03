ここまでで必要なAPIはほぼ揃いました。

では、これからWebアプリケーションとSolanaプログラムを接続しましょう。

まず、SolanaのテストネットであるDevnetにSolanaプログラムをデプロイする必要があります。


### 🌳 Devnet の環境設定をする

Devnetにデプロイするのはかなり大変です。

必要なステップを見逃さないように注意しながら進めてください。

まず、Devnetへの切り替えを行います。`packages/contract`ディレクトリへ移動してください。

```
solana config set --url devnet
```

次に。以下のコマンドを実行します。

```
solana config get
```

このコマンドはAnchorがどこにデプロイするかを知る方法です。

Solanaネットワークの接続先の設定が`https://api.devnet.solana.com`となっていることを確認してください。

![solana config](/public/images/Solana-dApp/section-3/3_1_1.jpg)

それでは、次にDevnet上のSOLをエアドロップしましょう。

エアドロップはとても簡単です。

以下のコマンドを2回実行してください。

```
solana airdrop 2
```

次に、以下のコマンドを実行します。

```
solana balance
```

ウォレットに4 SOLが入っていることを確認できました（Devnetでの残高を取得しています）。

※ 現時点では、一度にエアドロップできるSOLの量は2 SOLまでです。

![airdrop](/public/images/Solana-dApp/section-3/3_1_2.jpg)


### ✨ 変数を変更する

Devnetに接続するために、`Anchor.toml`の変数を変更する必要があります。

まず、`[programs.localnet]`を`[programs.devnet]`に変更します。

次に、`cluster="localnet"`を`cluster="devnet"`に変更します。

上記の変更が完了したら、以下のコマンドを実行してください。

```
anchor build
```

これにより、プログラムIDを持つ新しいビルドが作成されます。

以下のコマンドを実行することでアクセスできます。

```
solana address -k target/deploy/myepicproject-keypair.json
```

これによりプログラムIDが出力されます。

このプログラムIDは後ほど使うので、コピーしておいてください。

次に、`lib.rs`を表示します。

このIDが上部に表示されているはずです。

```
declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");
```

このプログラムIDは`anchor init`で最初に自動生成されるIDです。

プログラムIDとは、プログラムを読み込んで実行する方法を指定し、Solanaランタイムがどのようにプログラムを実行するかの情報を含んでいるIDのことを指します。

このIDがあることで、Solanaはプログラムによって生成されたすべてのアカウントを確認、参照することができるようになります。

したがって、`declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");`のID部分を`solana address -k target/deploy/myepicproject-keypair.json`コマンドで出力されたプログラムIDに変更する必要があります。

また、`Anchor.toml`の`[programs.devnet]`下の`myepicproject="Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"`のID部分も上記と同じように変更する必要があります。

以上の2か所でプログラムIDを変更しましたか？

ここまで終わったら、以下のコマンドを再度実行しましょう。

```
anchor build
```

新しいプログラムIDでプロジェクトをビルドしました。

Anchorはビルド時に特定のファイルを`target`ディレクトリの下に生成します。

それらの生成されたファイルが最新のプログラムIDを持っているか確認しましょう。

Devnetの設定には様々な手順がありました。

以下に使用したコマンドをまとめます。

```
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

DevnetにSolanaプログラムをデプロイしましょう。

```
anchor deploy
```

デプロイには少し時間がかかる場合があります。

以下の画像のように`Deploy success`という単語が表示されていればデプロイ完了です。

![Deploy success](/public/images/Solana-dApp/section-3/3_1_3.jpg)


完了したら、[Solana Explorer](https://explorer.solana.com/?cluster=devnet)にアクセスして、すべてがうまくいったかどうかを確認します。

※ 今回はDevnetにデプロイしたため、必ず右上の接続先が[Devnet]になっているかどうか確認する必要があります。

エスプローラーで、プログラムID ( `solana address -k target/deploy/myepicproject-keypair.json`で取得したID)を貼り付けて検索します。

デプロイされたSolanaプログラムが表示されたら、下にスクロールしてトランザクション履歴を確認すると、そこにデプロイ履歴が表示されているので確認してみてください。

![solana explorer](/public/images/Solana-dApp/section-3/3_1_4.jpg)

> ⚠️ 注意
>
> Solana プログラムを変更する際は、毎回再デプロイして上記のステップを踏む必要があります。

※ Devnetは「メインネット」ではありませんが、Devnetもマイナーによって運営されています。


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

次のレッスンでは、SolanaプログラムとWebアプリケーションを接続します!

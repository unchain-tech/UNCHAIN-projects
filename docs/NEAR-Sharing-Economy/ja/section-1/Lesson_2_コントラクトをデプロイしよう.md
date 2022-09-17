### 🛫 スマートコントラクトをデプロイしよう

Rust コードをコンパイルしてスマートコントラクトをアカウントにデプロイしましょう！

**コンパイル**
前項で確認した `ft` ディレクトリへ移動してコンパイルを実行します。

```
$ cd ft
$ cargo build --all --target wasm32-unknown-unknown --release
```

コンパイルが成功していれば以下のメッセージが表示されます。

```
Finished release [optimized] target(s) in 0.26s
```

`cargo` は Rust のビルドシステム兼パッケージマネージャです。
`cargo build`でコンパイルを行います。
各 option の説明は`cargo build --help`で確認できますが,
ここでは`--target`を使用することで Wasm 形式で Rust のコードをコンパイルしたということだけ分かれば十分です 🙆‍♀️

コンパイルしたファイルは`target/wasm32-unknown-unknown/release`ディレクトリに`fungible_token.wasm`という名前で保存されています。
これをプロジェクトルート直下の`res`ディレクトリにコピーしましょう!

```
$ cp target/wasm32-unknown-unknown/release/fungible_token.wasm ../res
```

**サプアカウントの作成**

NEAR ではコントラクトを**アカウントへデプロイ**するという形をとります。
なのでコントラクトをデプロイするには, デプロイ先のアカウントがあることが前提となります。
そして NEAR のアカウントにはサブアカウントを作ることができます。
サブアカウントを作る際は既存のアカウントの前に追加する名前と`.`をつけます。
既存のアカウント名が`alice.testnet`とすると, `bob.alice.testnet`や`mike.alice.testnet`のようなサブアカウントを作成することができます。
さらに`bob.alice.testnet`には`mike.bob.alice.testnet`というように, `.`と追加する名前を既存のアカウントの先頭につけることでサブアカウントを増やしていくことができます。

サブアカウントは作成と削除が容易なので,
コントラクトをサブアカウントにデプロイしておき,
再デプロイした時にはそのサブアカウントごと削除してもう一度やり直せば良いので楽なのです。

それでは前項で作成したアカウント(ここでは`ft_account.testnet`)を使用してサブアカウントを作りましょう。
この先の流れを簡単にするためアカウント名を環境変数へ格納しておきます。

```
$ export ID=ft_account.testnet
```

※`echo $ID`で export できているか確認しましょう!

サブアカウント名は好きなもので良いですが, ここでは`sub.ft_account.testnet`で進めていきます。
以下のコマンドで`ft_account.testnet`にサブアカウントを作成します。

```
$ near create-account sub.$ID --masterAccount $ID --initialBalance 30
```

以下のような出力がされたら作成成功です。

```
Account sub.ft_account.testnet for network "testnet" was created.
```

`--initialBalance`でサブアカウントに持たせる NEAR token の量を指定しています。
アカウントは作成時に 200NEAR を受け取れるのでそこから 30 NEAR 分けているということです。
もし既存のアカウントの所持する token の量が足りずにエラーが出る場合は, [NEAR faucet](https://near-faucet.io/)から NEAR を受け取る,
またはアカウントを再作成してからやり直しましょう。

**デプロイ**

プロジェクトのルートディレクトリ(`res`ディレクトリのあるディレクトリ)へ移動しデプロイコマンドを実行します。

```
$ near deploy sub.$ID --wasmFile res/fungible_token.wasm
```

`--wasmFile`でデプロイする Wasm ファイルを先ほどコンパイルしたもので指定しています。

デプロイが成功すると以下のような表示がされます(メッセージ表示から処理の終了までに少し時間がかかる場合があります)。

```
Done deploying to sub.ft_account.testnet
```

> 今後コントラクトを再デプロイしたい時には
>
> ```
> $ near delete sub.$ID $ID
> ```
>
> でサブアカウントごと削除した後, もう一度サブアカウント作成~デプロイまでの流れを実行することで可能です。

うまくいかない方は, アカウントの再作成(作成時に NEAR がもらえます), `near login`での再ログインを試してみましょう。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#near-sharing-economy` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 4 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

それでは次のレッスンで実際にコントラクトを使用していきます！

###  🖥 このレッスンの参考動画URL
[Dapp University](https://youtu.be/CgXQC4dbGUE?t=6654)

### ✅ ブロックチェーンをリセットする

ここからはフロントエンドのコーディングを行っていきます。

フロントエンドを始める前に、バックエンドのデバッグのためにブロックチェーンを編集したので、一度ブロックチェーンをリセットしましょう。

ターミナルを開いて `yield-farm-starter-project` にいることを確認してから下記のコードを順番に実行してみましょう。

```bash
truffle migrate --reset
```

次に、用意したフロントエンドの内容（テンプレート）を確認するために、以下のコマンドを実行しましょう。

```bash
npm run start
```

以下のような画面がフロントエンドに表示されているでしょうか？
![](/public/images/8-Ganache-Yield-Farm/section-1/12_3_1.png)

### 🦊 Ganache と Metamask を接続する

次に、Ganache のアカウントを MetaMask に接続していきましょう。

まず、MetaMask を開き、ネットワークが Ganache であることを確認したら、右上のアカウントボタンを押してアカウントの情報を見れるようにします。

![](/public/images/8-Ganache-Yield-Farm/section-1/12_3_2.png)

次に `Import Account` と書いてあるボタンを押して Ganache のアカウントをインポートしていきます。

![](/public/images/8-Ganache-Yield-Farm/section-1/12_3_3.png)

`Import Account` を選択すると、`Private Key` を入力するよう求められます。

![](/public/images/8-Ganache-Yield-Farm/section-1/12_3_4.png)

そこで Ganache に向かい、`100mDai` トークンを送金したアカウント(ここまで手順通りにコーディングした場合 Ganache 画面の上から2番目のアカウント)の Private key をコピーしましょう。

Metamask の `Private Key` 入力欄にコピーした Private key を貼り付け、Import ボタンを押してください。

![](/public/images/8-Ganache-Yield-Farm/section-1/12_3_5.png)

このプロセスにより、Ganache のアカウントが Metamask にインポートされます。

> ⚠️: Ganache のアカウントの設定をはじめて行う場合は、以下のステップを踏んでください。
>
> 1. Metamask 上のネットワーク設定ボタンをクリックする。
> * デフォルトでは、`Ethereum Mainnet` と表示されています。
> 2. ネットワーク設定のドロップダウンから `Custom RPC` を選択し、以下の情報を入力する:
> - Network Name: `Ganache`
> - New RPC URL: `HTTP://127.0.0.1:7545`（Ganache に表示されているRPC URLをコピーペースト)
> 3. `Save` ボタンを押す。

現在、Token Farm のフロントエンドとは、まだ接続されていないので Metamask の左上には `Not connected` と表示されているはずです。

`Not connected` と書いてある部分をクリックして、接続画面へ進んでください。

![](/public/images/8-Ganache-Yield-Farm/section-1/12_3_6.png)

自分が使用している Metamask のアカウントが黄色くハイライトされていることがわかります。
自分が使用しているアカウントの下にある `Connect` を押せばフロントエンドとMetamaskの接続が完了します！

![](/public/images/8-Ganache-Yield-Farm/section-1/12_3_7.png)

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#section-3` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 3 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---
これでフロントのコードを書く準備は整ったので次のレッスンでフロントの作成に映っていきます。

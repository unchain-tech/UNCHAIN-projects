###  🖥 このレッスンの参考動画URL
[Dapp University](https://youtu.be/CgXQC4dbGUE?t=6654)

### ✅ ブロックチェーンをリセットする

ここからはフロントエンドのコーディングを行っていきます。

フロントエンドを始める前に、バックエンドのデバッグのためにブロックチェーンを編集したので、一度ブロックチェーンをリセットしましょう。

ターミナルを開いて`yield-farm-starter-project`にいることを確認してから下記のコードを順番に実行してみましょう。

```bash
truffle migrate --reset
```

次に、用意したフロントエンドの内容（テンプレート）を確認するために、以下のコマンドを実行しましょう。

```bash
npm run start
```

以下のような画面がフロントエンドに表示されているでしょうか？
![](/public/images/ETH-Yield-Farm/section-3/3_1_1.png)

### 🦊 Ganache と Metamask を接続する

次に、GanacheのアカウントをMetaMaskに接続していきましょう。

まず、MetaMaskを開き、ネットワークがGanacheであることを確認したら、右上のアカウントボタンを押してアカウントの情報を見れるようにします。

![](/public/images/ETH-Yield-Farm/section-3/3_1_2.png)

次に`Import Account`と書いてあるボタンを押してGanacheのアカウントをインポートしていきます。

![](/public/images/ETH-Yield-Farm/section-3/3_1_3.png)

`Import Account`を選択すると、`Private Key`を入力するよう求められます。

![](/public/images/ETH-Yield-Farm/section-3/3_1_4.png)

そこでGanacheに向かい、`100mDai`トークンを送金したアカウント（ここまで手順通りにコーディングした場合Ganache画面の上から2番目のアカウント）のPrivate keyをコピーしましょう。

Metamaskの`Private Key`入力欄にコピーしたPrivate keyを貼り付け、Importボタンを押してください。

![](/public/images/ETH-Yield-Farm/section-3/3_1_5.png)

このプロセスにより、GanacheのアカウントがMetamaskにインポートされます。

> ⚠️: Ganache のアカウントの設定をはじめて行う場合は、以下のステップを踏んでください。
>
> 1. Metamask 上のネットワーク設定ボタンをクリックする。
> * デフォルトでは、`Ethereum Mainnet`と表示されています。
> 2. ネットワーク設定のドロップダウンから`Custom RPC`を選択し、以下の情報を入力する:
> - Network Name: `Ganache`
> - New RPC URL: `HTTP://127.0.0.1:7545`(Ganache に表示されているRPC URLをコピーペースト)
> 3. `Save`ボタンを押す。

現在、Token Farmのフロントエンドとは、まだ接続されていないのでMetamaskの左上には`Not connected`と表示されているはずです。

`Not connected`と書いてある部分をクリックして、接続画面へ進んでください。

![](/public/images/ETH-Yield-Farm/section-3/3_1_6.png)

自分が使用しているMetamaskのアカウントが黄色くハイライトされていることがわかります。
自分が使用しているアカウントの下にある`Connect`を押せばフロントエンドとMetamaskの接続が完了します!

![](/public/images/ETH-Yield-Farm/section-3/3_1_7.png)

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#eth-yield-farm`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---
これでフロントのコードを書く準備は整ったので次のレッスンでフロントの作成に映っていきます。

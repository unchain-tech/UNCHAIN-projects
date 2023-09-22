### ✅ Xumm をダウンロードする

XRP Ledgeにアクセスするためのウォレットをダウンロードしましょう！

このプロジェクトではXummを使用します。

- [こちら](https://xumm.app) からアプリをダウンロードし、セットアップを完了してください。

> ✍️ Xumm とは
> XRP Ledgerのデファクトスタンダードなモバイルウォレットアプリです。
> トークン一覧やNFT一覧を表示することはもちろん、アプリ内アプリとしてxApp機能も提供しています。

### 🪧 接続するネットワークを変更する

デフォルトではXummはメインネットへ接続しています。
Xummアプリの設定→詳細設定→ノードからテストネットのノード`wss://testnet.xrpl-labs.com`を選択してください。

![](/public/images/XRPL-NFT-Maker/section-1/1_2_1.png)

### 🚰 Faucetを取得する

XRP Ledgerでトランザクションを送信するためにはごく少額のXRPが必要です。
今回はテストネットを使用するため、[Faucetサイト](https://xrpl.org/ja/xrp-testnet-faucet.html)からテストネット専用の`XRP`を取得します。

Testnetを選択後Generate Testnet Credentialsボタンを押しましょう！
表示されたAddressとSecretをメモしておいてください。

### 👤 テストネットアカウントをXummへ登録する

先ほど取得したテストネットアカウントをXummへ登録しましょう！

Xummアプリ内下部の設定→アカウント→アカウントを追加する→既存のアカウントをインポートと選択します。

![](/public/images/XRPL-NFT-Maker/section-1/1_2_2.png)

さらに全権アクセス→シークレットキーと選択していき、先ほど取得したシークレットを入力します。

![](/public/images/XRPL-NFT-Maker/section-1/1_2_3.png)

Xummアプリ内のXRP残高が1000XRPになっていたら成功です！

> ⚠️注意
> ここで取得したアカウントはメインネットでは使用しないでください。

### 🏠 XummのAPI Keyを取得する

アプリケーションからXummアプリへアクセスを行うにはXummのAPIキーが必要になります。

[Xumm Developer Console](https://apps.xumm.dev)へログインし、アプリケーションの作成を行ってください。

![](/public/images/XRPL-NFT-Maker/section-1/1_2_4.png)

メールアドレスやGithub、Xummでアカウントの作成が可能です。お好きな方法を選択してください！

![](/public/images/XRPL-NFT-Maker/section-1/1_2_5.png)

今回はテスト用のアプリケーションなので入力内容は仮のもので構いません。

作成後API KeyとAPI Secretが取得可能になりますのでメモしておいてください。

また、「Origin/Redirect URIs（one per line）to use」のフィールドに`http://localhost:3000`を入力して`Update Application`ボタンで設定を反映しておいてください。
このフィールドに設定したURIからのみXummアプリからのアクセスを許可します。
![](/public/images/XRPL-NFT-Maker/section-1/1_2_6.png)


### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#xrpl`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

完了したら次のセクションに進みましょう 🎉

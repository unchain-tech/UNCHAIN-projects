### 🛠 環境構築をはじめる

Section 1 では、ウォレットでアプリに接続するという、Web3 で最も重要な機能の実装を主な目的としています。

ユーザーが Solana ウォレットでデータショップにログインできるようにしたいのですが、通常は認証の構築はかなり面倒です。

ユーザー名、パスワードなどのデータベースが必要になります。

しかし、ブロックチェーンを使えば、あなたが思っているよりもずっと簡単に認証を行うことが出来るのです!


### 🔌 Phantom Wallet をインストールする

このプロジェクトでは、[Phantom Wallet](https://phantom.app/)という、Solana 専用のウォレットを使用します。

まずはブラウザに拡張機能をダウンロードして Phantom Wallet をセットアップしてください。

Phantom Wallet は **Chrome**、 **Brave**、 **Firefox**、および **Edge** をサポートしています。

Chrome の方は[こちら](https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa)から Phantom Wallet をインストールすることがきます。

インストールが完了したら、Phantom Wallet のネットワークを Devnet に変更しておきましょう。

※ 今回は Devnet を使用するので、ウォレットも Devnet に変更する必要があります。

- 「設定」→「ネットワークの変更」→「Devnet」から変更できます。

![phantom wallet settings](/public/images/Solana-Online-Store/section-1/1_1_1.png)

※ 本プロジェクトでは Brave と Chrome でのみ動作が確認できます。


### 🤖 ローカル開発環境を設定する

※ GitHub アカウントの初期設定がお済みでない方は、アカウント設定を行ってからお進みください。

まず、 [この GitHub リンク](https://github.com/unchain-dev/solana-pay-starter-project) にアクセスして、ページの右上にある[Fork]ボタンを押してください。

このリポジトリをフォークすると、自分の GitHub に同一のリポジトリがコピーされます。

次に、新しくフォークされたリポジトリをローカルに保存します。

`Code` ボタンをクリックして、コピーしたリポジトリのリンクをコピーしてください。

![github code button](/public/images/Solana-Online-Store/section-1/1_1_2.png)

最後に、ターミナルで `cd` コマンドを実行してプロジェクトが存在するディレクトリまで移動し、次のコマンドを実行します。

※ `YOUR_FORKED_LINK` に先ほどコピーしたリポジトリのリンクを張り付けましょう。

```bash
git clone YOUR_FORKED_LINK
```

無事に複製されたらローカル開発環境の準備は完了です。
### 🏁 Web アプリケーションを起動する

今回の Web アプリケーションは **Next.js** を使用しています。

これはフレームワーク **React.js** 上に構築されているものです。

すでに React.js に精通している場合は Next.js を使いこなすのは比較的簡単です（React.js が分からない場合でも適宜説明を加えますのでご安心ください）。

それでは早速、以下の手順で Web アプリケーションを起動してみましょう。

1\. ターミナルを開き、`cd` でプロジェクトのルートディレクトリまで移動します。

2\. `npm install` を実行します。

3\. `npm run dev` を実行します。

これらを実行すると、ローカルサーバーで Web アプリケーションが立ち上がり、中心のあたりにかわいらしい女の子の画像が表示されるはずです。

※自動的に Web アプリケーションが立ち上がらない場合は、ブラウザに `http://localhost:3000` と入力して Web アプリケーションを確認しましょう!

![stater project](/public/images/Solana-Online-Store/section-1/1_1_3.png)


### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#solana-online-store` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 4 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンに進んで、開発を進めていきましょう 🎉

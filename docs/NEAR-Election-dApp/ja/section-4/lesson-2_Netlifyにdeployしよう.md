### 🦋 netlify に deploy しよう

作成したWebアプリケーションをデプロイしてみましょう。

ここでは[Netlify](https://www.netlify.com/)を用いてデプロイします。

`Netlify`は静的サイトのホスティングを提供するwebサービスです。

Netlifyのアカウントをお持ちでない方は、上記のリンクにアクセスして、アカウントを作成してください。

まずはターミナルで下のコマンドを実行しましょう。これはnetlifyとやりとりをするためのものです。

```diff
yarn add netlify-cli -g
```

次に下のコードでログインしましょう。

```diff
netlify login
```

次にNetlifyでのページ遷移がうまく行くように`Near-Election-dApp/packages/client`の直下（.gitignoreやpackage.jsonと同じ階層）に`netlify.toml`というファイルを作成して下のコードを加えましょう。

[netlify.toml]

```diff
+ [[redirects]]
+   from = "/*"
+   to = "/"
+   status = 200
```

最後に`client`ディレクトリにいることを確認しnetlifyにコードをデプロイするために下のコマンドを実行しましょう。

```
netlify deploy --prod
```

この時、コマンドを実行するにはいくつかターミナルで入力する必要があります。

まず、すでに`Netlify`に存在するプロジェクトを更新するのか、新しいプロジェクトとしてdeployするのかを聞かれます。ここでは後者を選択してください。

```
? What would you like to do?
+  Create & configure a new site
```

次にどのチームとしてdeployするかを聞かれるので、ログインの時に作成したチーム名にしてください。

```
? Team: Tonny
```

次にサイト名を聞かれるので自分の好きなサイト名にしてください

```
Choose a unique site name (e.g. super-cool-site-by-honganji.netlify.app) or leave it blank for a random name. You can update the site name later.

? Site name (optional): near-election-dapp
```

最後にdeployに必要なHTMLなどの情報を含んでいる`Publish Directory`を指定する必要があるので、その部分を下のように指定しましょう。

```
Publish directory: ./dist
```

これでdeployの作業が始まりますのでしばらくお待ちください。

deployが完了したら下のようにURLが返ってくるので、一番下の'Website URL

```
Deploying to main site URL...
✔ Finished hashing
✔ CDN requesting 4 files
✔ Finished uploading 4 assets
✔ Deploy is live!

Logs:              https://app.netlify.com/sites/near-election-dapp/deploys/62e70f7be8e9f53c94cf1ed3

Unique Deploy URL: https://62e70f7be8e9f53c94cf1ed3--near-election-dapp.netlify.app

Website URL:       https://near-election-dapp.netlify.app
```

ここで`Website URL: `URLをコピーして自分が使用しているブラウザに貼り付けてみましょう。

成功すれば以下のようにブラウザ上で自分の作成したdAppが使えるようになるはずです！
![](/public/images/NEAR-Election-dApp/section-4/4_2_1.png)

ぜひデプロイされたWebアプリケーションを自分の目で確認してみてください！ ！

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#near`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

### 🎫 NFT を取得しよう！

NFTを取得する条件は、以下のようになります。

1. MVPの機能がすべて実装されている（実装OK）

2. WebアプリケーションでMVPの機能が問題なく実行される（テストOK）

3. このページの最後にリンクされているProject Completion Formに記入する

4. Discordの`🔥｜completed-projects`チャンネルに、あなたのWebサイトをシェアしてください 😉🎉 。Discordへ投稿する際に、追加実装した機能とその概要も教えていただけると幸いです！

プロジェクトを完成させていただいた方には、NFTをお送りします。

### 🎉 おつかれさまでした！

これで投票dAppを作成することができました！

今回学習したrustの知識やnearでのコントラクトの作りかたはweb3がより一般的になる社会の中で、世界を変える重要なスキルです。

UIのデザインや機能をアップグレードして、ぜひコミュニティにシェアしてください！　 😊

これからもweb3への旅をあなたが続けてくれることを願っています 🚀

---

Project Completion Formは[こちら](https://airtable.com/shrf1cCtTx0iQuszX)です。

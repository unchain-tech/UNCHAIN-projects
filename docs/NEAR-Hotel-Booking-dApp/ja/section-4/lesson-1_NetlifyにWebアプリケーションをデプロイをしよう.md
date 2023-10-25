### 🔷 Netlify にデプロイをしよう

完成したWebアプリケーションをデプロイしてみましょう。

ここでは、[Netlify](https://www.netlify.com/)を用いてデプロイをします。

Netlifyは静的サイトのホスティングを提供するwebサービスです。

Netlifyのアカウントをお持ちでない方は、上記のリンクにアクセスして、アカウントを作成してください。

まずはターミナルで下のコマンドを実行しましょう。これはnetlifyとやりとりをするためのものです。

```
yarn add --dev netlify-cli
```

次に、以下のコマンドを実行してログインをしましょう。

```
netlify login
```

デプロイの前に、Netlifyで画面遷移がうまくいくように`near-hotel-booking-dapp/`直下（.gitignoreやpackage.jsonと同じ階層）にnetlify.tomlというファイルを作成して、以下のコードを加えましょう。

```diff
+ //以下を追加してください
[[redirects]]
  from = "/*"
  to = "/"
  status = 200
```

最後に`near-hotel-booking-dapp/`にいることを確認し、netlifyにWebアプリケーションをデプロイするために以下のコマンドを実行しましょう。

```
netlify deploy --prod
```

いくつかターミナルで入力する必要があります。

まず、既にNetlifyに存在するプロジェクトを更新するのか、新しいプロジェクトとしてデプロイするのかを聞かれます。ここでは後者を選択してください。

```
? What would you like to do?
+  Create & configure a new site
```

次に、どのチームとしてデプロイするかを聞かれるので、ログインの時に作成したチーム名にしてください。

```
? Team: ysaito
```

次に、サイト名を聞かれるので自分の好きなサイト名にしてください

```
Choose a unique site name (e.g. netlify-thinks-ysaito-is-great.netlify.app) or leave it blank for a random name. You can update the site name later.
? Site name (optional): near-hotel-booking-dapp
```

最後に、デプロイに必要なHTMLなどの情報を含んでいるPublish Directoryを指定する必要があるので、その部分を`./dist`と指定しましょう。

```
? Publish directory ./frontend/dist
```

これでデプロイの作業が始まりますのでしばらくお待ちください。

デプロイが完了したら下のようにURLが返ってきます。一番下の`Website URL:`に表示された`URL`にアクセスしてみましょう。

```
Deploy path:        /Users/user/Desktop/git/near-hotel-booking-dapp/dist
Configuration path: /Users/user/Desktop/git/near-hotel-booking-dapp/netlify.toml
Deploying to main site URL...
✔ Finished hashing
✔ CDN requesting 7 files
✔ Finished uploading 7 assets
✔ Deploy is live!

Logs:              https://app.netlify.com/sites/near-hotel-booking-dapp/deploys/62f298a154d04c253f5982da
Unique Deploy URL: https://62f298a154d04c253f5982da--near-hotel-booking-dapp.netlify.app
Website URL:       https://near-hotel-booking-dapp.netlify.app
```

ブラウザ上で自分の作成したWebアプリケーションが使えたらデプロイ成功です！

![](/public/images/NEAR-Hotel-Booking-dApp/section-4/4_1_1.png)

ぜひ、デプロイされたWebアプリケーションを自分の目で確認してみてください ✨

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

4. Discordの`🔥｜completed-projects`チャンネルに、あなたのWebサイトをシェアしてください 😉 🎉 。Discordへ投稿する際に、追加実装した機能とその概要も教えていただけると幸いです！

プロジェクトを完成させていただいた方には、NFTをお送りします。

### 🎉 おつかれさまでした！

これで宿泊予約アプリケーションを作成することができました！

今回学習したrustの知識やnearでのスマートコントラクトの作りかたはweb3がより一般的になる社会の中で、世界を変える重要なスキルです。

UIのデザインや機能をアップグレードして、ぜひコミュニティにシェアしてください！　 😊

これからもweb3への旅をあなたが続けてくれることを願っています 🚀

---

Project Completion Formは[こちら](https://airtable.com/shrf1cCtTx0iQuszX)です。

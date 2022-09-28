### 🔷 Netlify にデプロイをしよう

完成した Web アプリケーションをデプロイしてみましょう。

ここでは、[Netlify](https://www.netlify.com/)を用いてデプロイをします。

Netlify は静的サイトのホスティングを提供する web サービスです。

Netlify のアカウントをお持ちでない方は、上記のリンクにアクセスして、アカウントを作成してください。

まずはターミナルで下のコマンドを実行しましょう。これは netlify とやりとりをするためのものです。

```
npm install netlify-cli -g
```

次に、以下のコマンドを実行してログインをしましょう。

```
netlify login
```

デプロイの前に、Netlify で画面遷移がうまくいくように`near-hotel-booking-dapp/`直下(.gitignore や package.json と同じ階層)に netlify.toml というファイルを作成して、以下のコードを加えましょう。

```diff
+ //以下を追加してください
[[redirects]]
  from = "/*"
  to = "/"
  status = 200
```

最後に`near-hotel-booking-dapp/`にいることを確認し、 netlify に Web アプリケーションをデプロイするために以下のコマンドを実行しましょう。

```bash
netlify deploy --prod
```

いくつかターミナルで入力する必要があります。

まず、既に Netlify に存在するプロジェクトを更新するのか、新しいプロジェクトとしてデプロイするのかを聞かれます。ここでは後者を選択してください。

```bash
? What would you like to do?
+  Create & configure a new site
```

次に、どのチームとして デプロイ するかを聞かれるので、ログインの時に作成したチーム名にしてください。

```bash
? Team: ysaito
```

次に、サイト名を聞かれるので自分の好きなサイト名にしてください

```bash
Choose a unique site name (e.g. netlify-thinks-ysaito-is-great.netlify.app) or leave it blank for a random name. You can update the site name later.
? Site name (optional): near-hotel-booking-dapp
```

最後に、デプロイに必要な HTML などの情報を含んでいる Publish Directory を指定する必要があるので、その部分を`./dist`と指定しましょう。

```bash
? Publish directory ./frontend/dist
```

これでデプロイの作業が始まりますのでしばらくお待ちください。

デプロイが完了したら下のように URL が返ってきます。一番下の`Website URL:`に表示された`URL`にアクセスしてみましょう。

```bash
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

ブラウザ上で自分の作成した Web アプリケーションが使えたらデプロイ成功です！

![](/public/images/NEAR-Hotel-Booking-dApp/section-4/4_1_1.png)

ぜひ、デプロイされた Web アプリケーションを自分の目で確認してみてください ✨

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#near-booking-dapp` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 4 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

### 🎫 NFT を取得しよう！

NFT を取得する条件は、以下のようになります。

1. MVP の機能がすべて実装されている（実装 OK ）

2. Web アプリケーションで MVP の機能が問題なく実行される（テスト OK ）

3. このページの最後にリンクされている Project Completion Form に記入する

4. Discord の `🔥｜near-post-projects` チャンネルに、あなたの Web サイトをシェアしてください 😉 🎉 。Discord へ投稿する際に、追加実装した機能とその概要も教えていただけると幸いです！

プロジェクトを完成させていただいた方には、NFT をお送りします。

### 🎉 おつかれさまでした！

これで宿泊予約アプリケーションを作成することができました！

今回学習した rust の知識や near でのスマートコントラクトの作りかたは Web3 がより一般的になる社会の中で、世界を変える重要なスキルです。

UI のデザインや機能をアップグレードして、ぜひコミュニティにシェアしてください！　 😊

これからも Web3 への旅をあなたが続けてくれることを願っています 🚀

### 🦋 netlify に deploy しよう

作成した Web アプリケーションをデプロイしてみましょう。

ここでは[Netlify](https://www.netlify.com/)を用いてデプロイします。

`Netlify` は静的サイトのホスティングを提供する web サービスです。

Netlify のアカウントをお持ちでない方は、上記のリンクにアクセスして、アカウントを作成してください。

まずはターミナルで下のコマンドを実行しましょう。これは netlify とやりとりをするためのものです。

```diff
npm install netlify-cli -g
```

次に下のコードでログインしましょう。

```diff
netlify login
```

次に Netlify でのページ遷移がうまく行くように`near-election-dapp/near-election-dapp-frontend`の直下(.gitignore や package.json と同じ階層)に`netlify.toml`というファイルを作成して下のコードを加えましょう。

[netlify.toml]

```diff
+ [[redirects]]
+   from = "/*"
+   to = "/"
+   status = 200
```

最後にnear-election-dapp-frontendディレクトリにいることを確認し netlify にコードをデプロイするために下のコマンドを実行しましょう。

```bash
netlify deploy --prod
```

この時、コマンドを実行するにはいくつかターミナルで入力する必要があります。

まず、すでに`Netlify`に存在するプロジェクトを更新するのか、新しいプロジェクトとして deploy するのかを聞かれます。ここでは後者を選択してください。

```bash
? What would you like to do?
+  Create & configure a new site
```

次にどのチームとして deploy するかを聞かれるので、ログインの時に作成したチーム名にしてください。

```bash
? Team: Tonny
```

次にサイト名を聞かれるので自分の好きなサイト名にしてください

```bash
Choose a unique site name (e.g. super-cool-site-by-honganji.netlify.app) or leave it blank for a random name. You can update the site name later.

? Site name (optional): near-election-dapp
```

最後に deploy に必要な HTML などの情報を含んでいる`Publish Directory`を指定する必要があるので、その部分を下のように指定しましょう。

```bash
Publish directory: ./dist
```

これで deploy の作業が始まりますのでしばらくお待ちください。

deploy が完了したら下のように URL が返ってくるので、一番下の'Website URL

```bash
Deploying to main site URL...
✔ Finished hashing
✔ CDN requesting 4 files
✔ Finished uploading 4 assets
✔ Deploy is live!

Logs:              https://app.netlify.com/sites/near-election-dapp/deploys/62e70f7be8e9f53c94cf1ed3

Unique Deploy URL: https://62e70f7be8e9f53c94cf1ed3--near-election-dapp.netlify.app

Website URL:       https://near-election-dapp.netlify.app
```

ここで`Website URL: `URL をコピーして自分が使用しているブラウザに貼り付けてみましょう。

成功すれば以下のようにブラウザ上で自分の作成した dApp が使えるようになるはずです！
![](/public/images/401-NEAR-Election-dApp/section-4/4_2_1.png)

ぜひデプロイされた Web アプリケーションを自分の目で確認してみてください！！

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#near-election-dapp` で質問をしてください。

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

4. Discord の `🔥｜near-post-projects` チャンネルに、あなたの Web サイトをシェアしてください 😉🎉 。Discord へ投稿する際に、追加実装した機能とその概要も教えていただけると幸いです！

プロジェクトを完成させていただいた方には、NFT をお送りします。

### 🎉 おつかれさまでした！

これで投票 dApp を作成することができました！

今回学習した rust の知識や near でのコントラクトの作りかたは Web3 がより一般的になる社会の中で、世界を変える重要なスキルです。

UI のデザインや機能をアップグレードして、ぜひコミュニティにシェアしてください！　 😊

これからも Web3 への旅をあなたが続けてくれることを願っています 🚀

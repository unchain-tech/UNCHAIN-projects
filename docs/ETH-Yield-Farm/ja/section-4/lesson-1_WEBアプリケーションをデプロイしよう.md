### 🚀 プロジェクトをアップグレードする

このYield Farmingプロジェクトは、主にステーキングの機能を理解し、実装することに焦点を当てました。

あなたのプロジェクトをさらにクールなものにしたい場合は、以下の機能を実装してみてください!

- ユーザーが自分でMetaMaskをWebアプリに接続できるように、Wallet Connectボタンを実装する。
- Dappトークンをユーザーに自前で配布する仕組みを実装する。
- TailwindCSSなどでフロントエンドを編集して、自分だけのToken Farmをデザインする。

### 🤟 Vercel に Web アプリケーションをデプロイする

最後に、[Vercel](https://vercel.com/) にWebアプリケーションをホストする方法を学びます。

Vercelはサーバーレス機能のホスティングを提供するクラウドプラットフォームです。

スケーリングやサーバーの監視はVercelが行うため、開発者はVercelへデプロイするだけでアプリケーションを公開・運用できます。

Vercelに関する詳しい説明は、[こちら](https://zenn.dev/lollipop_onl/articles/eoz-vercel-pricing-2020)をご覧ください。

まず、GitHubの`ETH-Yield-Farm`にローカルファイルをアップロードしていきます。

ターミナル上で`ETH-Yield-Farm`に移動して、下記を実行しましょう。

```
git add .
git commit -m "upload to github"
git push
```

次に、GitHub上の`ETH-Yield-Farm`に、ローカル環境に存在する`ETH-Yield-Farm`のファイルとディレクトリが反映されていることを確認してください。

Vercelのアカウントを取得したら、下記を実行しましょう。

1\. `Dashboard`へ進んで、`New Project`を選択してください。
![](/public/images/ETH-Yield-Farm/section-4/4_1_1.png)

2\. `Import Git Repository`で自分のGitHubアカウントを接続したら、`ETH-Yield-Farm`を選択し、`Import`してください。
![](/public/images/ETH-Yield-Farm/section-4/4_1_2.png)

3\. プロジェクトを作成します。`Root Directory`が「packages/client」となっていることを確認してください。

![](/public/images/ETH-Yield-Farm/section-4/4_1_3.png)

4\. `Deploy`ボタンを押しましょう。

VercelはGitHubと連動しているので、GitHubが更新されるたびに自動でデプロイを行ってくれます。

下記のように、`Building`ログが出力されます。

基本的に`warning`は無視して問題ありません。

![](/public/images/ETH-Yield-Farm/section-4/4_1_4.png)

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#ethereum`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

### 🎫 NFT を取得しよう!

NFTを取得する条件は、以下のようになります。

1. MVPの機能がすべて実装されている（実装OK）

2. WebアプリケーションでMVPの機能が問題なく実行される（テストOK）

3. このページの最後にリンクされているProject Completion Formに記入する

4. Discordの`🔥｜completed-projects`チャンネルに、あなたのWebサイトをシェアしてください 😉🎉 Discordに投稿する際に、追加実装した機能とその概要も教えていただけると幸いです!

プロジェクトを完成させていただいた方には、NFTをお送りします。

### 🎉 おつかれさまでした!

長い道のりでしたがよくここまで辿り着きましたね!お疲れ様でした!

これであなたのYield Farmが完成しました🥳

このアプリケーションは分散型Webアプリケーションがより一般的になる社会の中で、世界を変える重要なスキルの基礎的なものを組み合わせて作られたものです。

これからもweb3への旅をあなたが続けてくれることを願っています 🚀

---

Project Completion Formは[こちら](https://airtable.com/shrf1cCtTx0iQuszX)です。

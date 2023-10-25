### 😎 Web アプリケーションをアップグレードする

ここまでのLessonでMVPは完成です。

ですが、実際にDAOとして機能させるにはまだまだ不十分といえます。

このMVPを起点にWebアプリケーションを好きなようにアップグレードしてみてください（以下は参考です）。

1. 会員ごとの専用ページを作成する。
2. 提案について議論できる場を設ける。
3. 提案のステータス（投票受付中・可決済みなど）をフロントエンドに表示させる。

ぜひチャレンジしてみてください！ ！

### 🤟 Vercel に Web アプリケーションをデプロイする

最後に、[Vercel](https://vercel.com/) にWebアプリケーションをホストする方法を学びます。

Vercelはサーバーレス機能のホスティングを提供するクラウドプラットフォームです。

スケーリングやサーバーの監視はVercelが行うため、開発者はVercelへデプロイするだけでアプリケーションを公開・運用できます。

Vercelに関する詳しい説明は、[こちら](https://zenn.dev/lollipop_onl/articles/eoz-vercel-pricing-2020)をご覧ください。

まず、Vercelにアップロードする前に、section-2のlesson-2でスクリプト用に設定を変更した`package.json`と`next.config.js`を元に戻しましょう。

※ これをやらずにアップロードするとエラーが発生し、デプロイすることができません。

`package.json`では、追加した以下の行を削除します。

```json
"type": "module",
```

`next.config.js`では、全てのコードを以下のとおり更新します。

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;
```

ここまでの作業が完了したら、GitHubにローカルファイルをアップロードしていきましょう。

Githubにアクセスし、このプロジェクト用のリポジトリを作成してください。

リモートリポジトリの作成が終わったら、ターミナル上でプロジェクトのルートディレクトリに移動して、下記を一行ずつ実行します。

```
git add .
git commit -m "upload to github"
git remote add origin git@github.com:【アカウント名/リポジトリ名】.git
git push -u origin main
```

次に、GitHubのリモートリポジトリに、ローカル環境のプロジェクトデータ一式が反映されていることを確認してください。

Vercelのアカウントを取得したら、下記を実行しましょう。

1\. `Dashboard`へ進んで、`New Project`を選択してください。

![](/public/images/ETH-DAO/section-4/4_2_1.png)

2\. `Import Git Repository`で自分のGitHubアカウントを接続したら、先ほどpushしたリモートリポジトリを選択し、`Import`してください。

![](/public/images/ETH-DAO/section-4/4_2_2.png)

3\. プロジェクトを作成します。Environment Variableに下記を追加します。

`NAME`＝`CI`、`VALUE`＝`false`（下図参照）

![](/public/images/ETH-DAO/section-4/4_2_3.png)

4\. `Deploy`ボタンを推しましょう。

VercelはGitHubと連動しているので、GitHubが更新されるたびに自動でデプロイを行ってくれます。

下記のように、`Building`ログが出力されます。

基本的に`warning`は無視して問題ありません。

![](/public/images/ETH-DAO/section-4/4_2_4.png)

[こちら](https://eth-dao-mu.vercel.app/)が見本となるサイトです！

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#ethereum`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

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

あなたのオリジナルのDAOが完成しました。

あなたは、thirdwebを利用して複数のコントラクトをデプロイし、DAOを運営するために必要なWebアプリケーションを立ち上げました。

これらは、分散型の世界を目指すうえで非常に重要なスキルです。

これからもweb3への旅をあなたが続けてくれることを願っています 🚀

---

Project Completion Formは[こちら](https://airtable.com/shrf1cCtTx0iQuszX)です。

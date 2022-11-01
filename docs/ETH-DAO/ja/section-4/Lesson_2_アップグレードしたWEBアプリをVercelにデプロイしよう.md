### 😎 Web アプリケーションをアップグレードする

ここまでの Lesson で MVP は完成です。

ですが、実際に DAO として機能させるにはまだまだ不十分といえます。

この MVP を起点に Web アプリケーションを好きなようにアップグレードしてみてください（以下は参考です）。

1. 会員ごとの専用ページを作成する。
2. 提案について議論できる場を設ける。
3. 提案のステータス（投票受付中・可決済みなど）をフロントエンドに表示させる。

ぜひチャレンジしてみてください！　！


### 🤟 Vercel に Web アプリケーションをデプロイする

最後に、[Vercel](https://vercel.com/) に Web アプリケーションをホストする方法を学びます。

Vercel はサーバレス機能のホスティングを提供するクラウドプラットフォームです。

スケーリングやサーバの監視は Vercel が行うため、開発者は Vercel へデプロイするだけでアプリケーションを公開・運用できます。

Vercel に関する詳しい説明は、[こちら](https://zenn.dev/lollipop_onl/articles/eoz-vercel-pricing-2020)をご覧ください。

まず、Vercel にアップロードする前に、section-2 の Lesson-2 でスクリプト用に設定を変更した `package.json` と `next.config.js` を元に戻しましょう。

※ これをやらずにアップロードするとエラーが発生し、デプロイすることができません。

`package.json` では、追加した以下の行を削除します。

```json
"type": "module",
```

`next.config.js` では、全てのコードを以下のとおり更新します。

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
```

ここまでの作業が完了したら、GitHub にローカルファイルをアップロードしていきましょう。

Github にアクセスし、このプロジェクト用のリポジトリを作成してください。

リモートリポジトリの作成が終わったら、ターミナル上でプロジェクトのルートディレクトリに移動して、下記を一行ずつ実行します。

```
git add .
git commit -m "upload to github"
git remote add origin git@github.com:【アカウント名/リポジトリ名】.git
git push -u origin main
```

次に、GitHub のリモートリポジトリに、ローカル環境のプロジェクトデータ一式が反映されていることを確認してください。

Vercel のアカウントを取得したら、下記を実行しましょう。

1\. `Dashboard` へ進んで、`New Project` を選択してください。

![](/public/images/ETH-DAO/section-4/4_2_1.png)

2\. `Import Git Repository` で自分の GitHub アカウントを接続したら、先ほど push したリモートリポジトリを選択し、`Import` してください。

![](/public/images/ETH-DAO/section-4/4_2_2.png)

3\. プロジェクトを作成します。Environment Variable に下記を追加します。

`NAME`＝`CI`、`VALUE`＝`false`（下図参照）

![](/public/images/ETH-DAO/section-4/4_2_3.png)

4\. `Deploy`ボタンを推しましょう。

Vercel は GitHub と連動しているので、GitHub が更新されるたびに自動でデプロイを行ってくれます。

下記のように、`Building` ログが出力されます。

基本的に `warning` は無視して問題ありません。

![](/public/images/ETH-DAO/section-4/4_2_4.png)


### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#eth-dao` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 4 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

### 🎫 NFT を取得しよう!

NFT を取得する条件は、以下のようになります。

1. MVP の機能がすべて実装されている（実装 OK）

2. Web アプリケーションで MVP の機能が問題なく実行される（テスト OK）

3. このページの最後にリンクされている Project Completion Form に記入する

4. Discord の `🔥｜eth-post-projects` チャンネルに、あなたの Web サイトをシェアしてください 😉🎉 Discord に投稿する際に、追加実装した機能とその概要も教えていただけると幸いです!

プロジェクトを完成させていただいた方には、NFT をお送りします。


### 🎉 おつかれさまでした!

あなたのオリジナルの DAO が完成しました。

あなたは、thirdweb を利用して複数のコントラクトをデプロイし、DAO を運営するために必要な Web アプリケーションを立ち上げました。

これらは、分散型の世界を目指すうえで非常に重要なスキルです。

これからも Web3 への旅をあなたが続けてくれることを願っています 🚀

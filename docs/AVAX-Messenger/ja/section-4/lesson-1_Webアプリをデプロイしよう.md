### 🎨 UI を完成させる

今回のプロジェクトでは、あなたは以下を達成しました 🎉

**1 \. `Messenger`コントラクトを作成する**

- Solidityでコントラクトを書く
- コントラクトをローカルでテストする

**2 \. ユーザーのウォレットを Web アプリケーションから接続して、コントラクトと通信する web3 アプリケーションを作成する**

- MetaMaskを設定する
- コントラクトを実際のAvalanche Fuji Networkにデプロイする
- ウォレットをWebアプリケーションに接続する
- Webアプリケーションからデプロイされたコントラクトを呼び出す
- Webアプリケーションを介してAVAXを取引する

プロジェクトをレベルアップさせましょう！
これまでのレッスンで作成したdappを元にあなたのお好きなように機能を追加してみてください 💪 🚀

- CSSや文章を変更したり、画像や動画を自分のWebアプリケーションに乗せてみる
- コントラクトやフロントエンドに機能を追加してみる

### 🌍 サーバーにホストしてみよう

最後に、[Vercel](https://vercel.com/) にWebアプリケーションをホストする方法を学びます。

Vercelはサーバーレス機能のホスティングを提供するクラウドプラットフォームです。

スケーリングやサーバーの監視はVercelが行うため、開発者はVercelへデプロイするだけでアプリケーションを公開・運用できます。

Vercelに関する詳しい説明は、[こちら](https://zenn.dev/lollipop_onl/articles/eoz-vercel-pricing-2020)をご覧ください。

まず、ローカルファイルをGitHubへアップロードしましょう。

まだアップロードをしていない方は、ターミナル上で`AVAX-Messenger`に移動して、下記を実行しましょう。  
⚠️ `packages/contract/.gitignore`ファイル内に`.env`が記載されていることを確認していください。

```
git add .
git commit -m "upload to github"
git push
```

次に、ローカル環境に存在する`AVAX-Messenger`のファイルとディレクトリがGitHub上の`AVAX-Messenger`に反映されていることを確認してください。

Vercelのアカウントを取得したら、下記を実行しましょう。

1\. `Dashboard`へ進んで、`New Project`を選択してください。

![](/public/images/AVAX-Messenger/section-4/4_1_1.png)

2\. `Import Git Repository`で自分のGitHubアカウントを接続したら、当リポジトリを選択し`Import`してください。

![](/public/images/AVAX-Messenger/section-4/4_1_2.png)

3\. プロジェクトを作成します。

`Framework Preset`は`Next.js`、`Root Directory`は「packages/client」となっていることを確認してください。

![](/public/images/AVAX-Messenger/section-4/4_1_3.png)

4\. `Deploy`ボタンをクリックしましょう。

VercelはGitHubと連動しているので、GitHubが更新されるたびに自動でデプロイを行ってくれます。

しばらくしてビルドが完了すると
下記のように、メッセージとホーム画面が出力されます。

![](/public/images/AVAX-Messenger/section-4/4_1_4.png)

ホーム画面の表示部分はリンクになっているので、クリックするとあなたの作成したdappがブラウザで確認できます 🎉

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#avalanche`で質問をしてください。

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

あなたは、コントラクトをAvalanche C-Chainへデプロイし、コントラクトと通信するWebアプリケーションを立ち上げました。

このdappプロジェクトが、現在多くの開発者の注目を集めるAvalancheというプラットフォームを理解する手助けになれば幸いです。

これからもweb3への旅を一緒に楽しみましょう 🚀

---

Project Completion Formは[こちら](https://airtable.com/shrf1cCtTx0iQuszX)です。

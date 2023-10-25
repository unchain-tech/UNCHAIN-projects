### 🌍 サーバーにホストしてみよう

最後に、[Vercel](https://vercel.com/) にWebアプリケーションをホストします。

Vercelはサーバーレス機能のホスティングを提供するクラウドプラットフォームです。

スケーリングやサーバーの監視はVercelが行うため、 開発者はVercelへデプロイするだけでアプリケーションを公開・運用できます。

Vercelに関する詳しい説明は、[こちら](https://zenn.dev/lollipop_onl/articles/eoz-vercel-pricing-2020)をご覧ください。

まず、 ローカルファイルをGitHubへアップロードしましょう。

まだアップロードをしていない方は、 ターミナル上で`AVAX-Asset-Tokenization`に移動して、下記を実行しましょう。
⚠️ `packages/contract/.gitignore`ファイル内に`.env`が記載されていることを確認していください。

```
git add .
git commit -m "upload to github"
git push
```

次に、 ローカル環境に存在する`AVAX-Asset-Tokenization`のファイルとディレクトリがGitHub上の`AVAX-Asset-Tokenization`に反映されていることを確認してください。

Vercelのアカウントを取得したら、下記を実行しましょう。

1\. `Dashboard`へ進んで、 `New Project`を選択してください。

![](/public/images/AVAX-Asset-Tokenization/section-4/4_1_1.png)

2\. `Import Git Repository`で自分のGitHubアカウントを接続したら、 当リポジトリを選択し`Import`してください。

![](/public/images/AVAX-Asset-Tokenization/section-4/4_1_2.png)

3\. プロジェクトを作成します。

`Framework Preset`に`Next.js`を、`Root directory`に`packages/client`を選択してください。

![](/public/images/AVAX-Asset-Tokenization/section-4/4_1_3.png)

4\. `Deploy`ボタンをクリックしましょう。

VercelはGitHubと連動しているので、GitHubでリポジトリが更新されるたびに自動でデプロイを行ってくれます。

しばらくしてビルドが完了すると
メッセージと、 下記のようにホーム画面が表示されます。

![](/public/images/AVAX-Asset-Tokenization/section-4/4_1_4.png)

ホーム画面の表示部分はリンクになっているので、 クリックするとあなたの作成したdappがブラウザで確認できます 🎉

### 💃 プロジェクトをアップデートしよう

本プロジェクトをベースにあなたのより良いと思うアップデートを施しましょう！

例えばこんなことが考えられます 🚀

- NFTの画像をフロントエンドで表示させる
- トークンのロック機能、ERC721以外のトークン規格、chainlinkを使用した定期実行処理などを利用して
  ユーザのトークンが自動的に引き落とされる仕組みを構築 => よりサブスクリプションサービスに近づける。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#avalanche`で質問をしてください。

ヘルプをするときのフローが円滑になるので、 エラーレポートには下記の3点を記載してください ✨

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

4. Discordの`🔥｜completed-projects`チャンネルに、 あなたのWebサイトをシェアしてください

😉🎉 Discordに投稿する際に、追加実装した機能とその概要も教えていただけると幸いです!

プロジェクトを完成させていただいた方には、NFTをお送りします。

### 🎉 おつかれさまでした!

あなたは、 コントラクトを`Avalanche Fuji C-Chain`へデプロイし、 コントラクトと通信するWebアプリケーションを立ち上げました。

作成したdappを元にあなた独自の機能を追加してみてください 💪

実際にこのプロジェクトを実施するには、NFTを作成した人が実際に農家を営んでいることへの情報の信頼性が必要であったり、 農業協定組合などのスマートコントラクトのみでは解決できないサプライチェーンの存在など、 考慮しなければいけない事はいくつもあると思います。

しかしchainlinkなどのオラクルサービスの台頭とその需要から、 ブロックチェーンを使用した資産のトークン化・デジタル化の流れは大きな可能性があります。

本プロジェクトがAvalancheや資産のトークン化について知るお役に立てれば幸いです 🤗

これからのあなたのご活躍を期待しております! 🚀

---

Project Completion Formは[こちら](https://airtable.com/shrf1cCtTx0iQuszX)です。
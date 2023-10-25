### 🤵 UX のアップグレード

これで、ユーザーがNFTをMintできる、web3フロントエンドが完成しました。

しかし、お気付きのように、WebサイトのUXには多くの不都合があります。

以下のポイントを考慮して、UX/UIをアップグレードしましょう。

### ✅ ユーザーが正しいネットワークに接続されていることを確認する

あなたのWebサイトでは、ユーザーはPolygon Testnetに接続すれば、NFTをMintできます。

OpenSeaのように、ユーザーが間違ったネットワークに接続している場合、警告を出す機能を実装してみてはどうでしょうか？

![](/public/images/Polygon-Generative-NFT/section-4/4_2_1.png)

また、ユーザーが間違ったネットワークに接続しているときに、`Mint NFT`ボタンを見えなくする機能も有効な手段でしょう。

### 💫 取引状況の表示

現在、Webサイトでは、取引状況をConsoleに出力しています。

実際のプロジェクトでは、ユーザーがWebサイトを操作している間にConsoleを開くことはほぼありません。

トランザクションの状態を追跡し、リアルタイムでユーザーにフィードバックするような状態を実装できないでしょうか。

取引処理中はローダを表示し、取引に失敗した場合はユーザーに通知し、取引に成功した場合は取引ハッシュを表示する必要があります。

### 👉 資金が存在しない場合でも MetaMask を促す

MetaMaskのウォレットにETHがない場合、`Mint NFT`をクリックしてもMetaMaskは反応しません。

よって、ユーザーには何のフィードバックもありません。

ユーザーが資金不足の場合でもMetaMaskがプロンプトされるようにできませんか？

ETHがいくら必要で、いくら足りないかをユーザーに知らせるのはMetaMaskであることが理想的です。

### 🛀 そのほかの Quality Of Life のアップグレード

そのほかに検討可能なQOLの変更をいくつか紹介します。

- ユーザーが一度に1つ以上のNFTをMintできるようにする。

- Openseaにあなたのコレクションへのリンクを追加する。

- コントラクトで何が起こっているのかをユーザーが確認できるように、検証済みのスマートコントラクトのアドレスを追加する。

- あなたのTwitter、Discordへのリンクを追加する。

アップグレードされたUXはこのようになります。

![](/public/images/Polygon-Generative-NFT/section-4/4_2_2.png)

[こちら](https://nft-collectible-demoo.vercel.app/) のWebサイトは、UXのアップグレードの大部分を実装しています。

- 実際にNFTをMintして、あなたのWebWebサイトとの違いを検証してみてください。

- あなたのGitHubアカウントにこの[レポジトリ](https://github.com/yukis4san/nft-collectible-frontend-git)をフォークしましょう。

- クローンしたリポジトリをあなたのローカル環境にダウンロードしてください。

- ターミナルを開き、ディレクトリのルートで`yarn install`を実行します。

- `yarn start`を実行してプロジェクトを開始します。

- `localhost:3000`でWebサイトをホストしながら、コードの中身を調べてみてください。

UIをアップデートする際に参考になるコードが、`App.js` / `App.cs` / `Header.js` / `Footer.js`に隠されています ✨

![](/public/images/Polygon-Generative-NFT/section-4/4_2_3.png)

ぜひ、あなたのWebアプリケーションをアップグレードして、HTML/CSS/JavaScriptへの理解を深めましょう。

web3フロントエンドのマスタに一歩近付くことができます。

ターミナルを閉じるときは、以下のコマンドが使えます ✍️

- Mac: `ctrl + c`
- Windows: `ctrl + shift + w`

### 🤟 Vercel に Web サイトをデプロイする

最後に、[Vercel](https://vercel.com/) にWebサイトをホストする方法を学びます。

Vercelはサーバーレス機能のホスティングを提供するクラウドプラットフォームです。

スケーリングやサーバーの監視はVercelが行うため、開発者はVercelへデプロイするだけでアプリケーションを公開・運用できます。

Vercelに関する詳しい説明は、[こちら](https://zenn.dev/lollipop_onl/articles/eoz-vercel-pricing-2020)をご覧ください。

まず、GitHubに向かい、新しいリポジトリを作成していきましょう。

`Your repositories`ページを開き、`New`ボタンを押してください。

![](/public/images/Polygon-Generative-NFT/section-4/4_2_4.png)

リポジトリに、`Polygon-Generative-NFT-git`と名前を付け足ら、`Create repository`ボタンを押してください。

次に、ディレクトリのリンクをコピーしましょう。

![](/public/images/Polygon-Generative-NFT/section-4/4_2_6.png)

ターミナルに向かい、任意のディレクトリに移動し、コピーしたリンクを下記に貼り付け、実行しましょう。

```
git clone コピーしたリンクを貼り付け
```

次に、`Polygon-Generative-NFT`を開き、中に入っているフォルダとファイルをすべて`Polygon-Generative-NFT-git`に移動させましょう。

それでは、GitHubの`Polygon-Generative-NFT-git`にローカルファイルをアップロードしていきます。

ターミナル上で`Polygon-Generative-NFT-git`に移動して、下記を実行しましょう。

```
git add .
git commit -m "upload to github"
git push
```

次に、[Vercel](https://vercel.com/) のアカウントを取得して、下記を実行していきます。

1\. `Dashboard`へ進んで、`Project`を選択してください。

![](/public/images/Polygon-Generative-NFT/section-4/4_2_7.png)

2\. `Import Git Repository`で自分のGitHubアカウントを接続したら、`Polygon-Generative-NFT-git`を選択し、`Import`してください。

![](/public/images/Polygon-Generative-NFT/section-4/4_2_8.png)

3\. プロジェクトを作成します。`Root Directory`が「packages/client」となっていることを確認してください。

![](/public/images/ETH-NFT-Collection/section-4/4_2_9.png)

4\. `Deploy`ボタンを推しましょう。

VercelはGitHubと連動しているので、GitHubが更新されるたびに自動でデプロイを行ってくれます。

下記のように、`Building`ログが出力されます。

基本的に`warning`は無視して問題ありません。

![](/public/images/Polygon-Generative-NFT/section-4/4_2_10.png)

デプロイが完了したら、自分のWebサイトに向かい、NFTをMintしてみましょう。

![](/public/images/Polygon-Generative-NFT/section-4/4_2_11.png)

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#polygon`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

### 🎉 おつかれさまでした!

あなたのオリジナルのGenerative Art NFT Collectionを販売できるWebサイトが完成しました。

あなたが習得したスキルは、分散型Webアプリケーションがより一般的になる社会の中で、世界を変える重要なスキルです。

これからもweb3への旅をあなたが続けてくれることを願っています 🚀

### 🎫 NFT を取得しよう!

NFTを取得する条件は、以下のようになります。

1. MVPの機能がすべて実装されている（実装OK）

2. WebアプリケーションでMVPの機能が問題なく実行される（テストOK）

3. このページの最後にリンクされているProject Completion Formに記入する

4. Discordの`🔥｜completed-projects`チャンネルに、あなたのWebサイトをシェアしてください 😉🎉 Discordに投稿する際に、追加実装した機能とその概要も教えていただけると幸いです!

プロジェクトを完成させていただいた方には、NFTをお送りします。

### 🎉 おつかれさまでした!

あなたのオリジナルのNFT Collectionが完成しました。

あなたは、コントラクトをデプロイし、NFTがMintできるWebサイトを立ち上げました。

これらは、分散型Webサイトがより一般的になる社会の中で、世界を変える2つの重要なスキルです。

これからもweb3への旅をあなたが続けてくれることを願っています 🚀

---

Project Completion Formは[こちら](https://airtable.com/shrf1cCtTx0iQuszX)です。

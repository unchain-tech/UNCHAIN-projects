### 🤟 Vercel に Web アプリケーションをデプロイする

最後に、[Vercel](https://vercel.com/) に Web アプリケーションをホストする方法を学びます。

Vercel はサーバレス機能のホスティングを提供するクラウドプラットフォームです。

スケーリングやサーバの監視は Vercel が行うため、開発者は Vercel へデプロイするだけでアプリケーションを公開・運用できます。

Vercel に関する詳しい説明は、[こちら](https://zenn.dev/lollipop_onl/articles/eoz-vercel-pricing-2020)をご覧ください。

まず、GitHub の `nft-game-starter-project` にローカルファイルをアップロードしていきます。

ターミナル上で `nft-game-starter-project` に移動して、下記を実行しましょう。

```
git add .
git commit -m "upload to github"
git push
```

次に、GitHub 上の `nft-game-starter-project` に、ローカル環境に存在する `nft-game-starter-project` のファイルとディレクトリが反映されていることを確認してください。

Vercel のアカウントを取得したら、下記を実行しましょう。

1\. `Dashboard` へ進んで、`New Project` を選択してください。
![](/public/images/4-ETH-NFT-Game/section-4/4_3_1.png)

2\. `Import Git Repository` で自分の GitHub アカウントを接続したら、`nft-game-starter-project` を選択し、`Import` してください。
![](/public/images/4-ETH-NFT-Game/section-4/4_3_2.png)

3\. プロジェクトを作成します。Environment Variable に下記を追加します。

`NAME`＝`CI`、`VALUE`＝`false`（下図参照）。
![](/public/images/4-ETH-NFT-Game/section-4/4_3_3.png)

4\. `Deploy`ボタンを推しましょう。

Vercel は GitHub と連動しているので、GitHub が更新されるたびに自動でデプロイを行ってくれます。

下記のように、`Building` ログが出力されます。
基本的に `warning` は無視して問題ありません。
![](/public/images/4-ETH-NFT-Game/section-4/4_3_4.png)

こちらが、今回のプロジェクトで作成される Web アプリケーションのデモです。

https://my-nft-game-nine.vercel.app/

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#section-4` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 3 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

### 🎫 NFT を取得しよう！

NFT を取得する条件は、以下のようになります。

1. MVP の機能がすべて実装されている（実装 OK）

2. Web アプリケーションで MVP の機能が問題なく実行される（テスト OK）

3. このページの最後にリンクされている Project Completion Form に記入する

4. Discord の `🔥｜post-your-project` チャンネルに、あなたの Web サイトをシェアしてください 😉🎉 Discord に投稿する際に、追加実装した機能とその概要も教えていただけると幸いです！

プロジェクトを完成させていただいた方には、NFT をお送りします。

### 🎉 おつかれさまでした！

あなたのオリジナルの NFT Game が完成しました。

あなたは、コントラクトをデプロイし、Mint した NFT キャラクターを使ってボスと対戦できる Web アプリケーションを立ち上げました。

これらは、分散型 Web アプリケーションがより一般的になる社会の中で、世界を変える 2 つの重要なスキルです。

これからも Web3 への旅をあなたが続けてくれることを願っています 🚀

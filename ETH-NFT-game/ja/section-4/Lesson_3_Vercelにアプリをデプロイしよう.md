🤟 Vercel に WEBアプリをデプロイする
---

最後に、[Vercel](https://vercel.com/) にWEBアプリをホストする方法を学びます。

Vercel はサーバレス機能のホスティングを提供するクラウドプラットフォームです。

スケーリングやサーバーの監視は Vercel が行うため、開発者は Vercel へデプロイするだけでアプリケーションを公開・運用できます。

Vercel に関しする詳しい説明は、[こちら](https://zenn.dev/lollipop_onl/articles/eoz-vercel-pricing-2020)をご覧ください。

まず、Github の `your-NFT-game` にローカルファイルをアップロードしていきます。

ターミナル上で `your-NFT-game` に移動して、下記を実行しましょう。

```
git add .
git commit -m "upload to github"
git push
```

次に、Github上の `your-NFT-game` に、ローカル環境に存在する `your-NFT-game` のファイルとディレクトリが反映されていることを確認してください。

Vercel のアカウントを取得したら、下記を実行しましょう。

1\. `Dashboard` へ進んで、`New Project` を選択してください。
![](https://i.imgur.com/ugQsnep.png)

2\. `Import Git Repository` で自分のGithubアカウントを接続したら、`your-NFT-game` を選択し、`Import` してください。
![](https://i.imgur.com/y5XwrNO.png)

3\. プロジェクトを作成します。Environment Variable に下記を追加します。

`NAME`＝`CI`、`VALUE`＝`false`（下図参照）
![](https://i.imgur.com/P6H0uBb.png)

4\. `Deploy`ボタンを推しましょう。

VercelはGithubと連動しているので、Githubが更新されるたびに自動でデプロイを行ってくれます。

下記のように、`Building` ログが出力されます。
基本的に `warning` は無視して問題ありません。
![](https://i.imgur.com/UhEcZus.png)

こちらが、今回のプロジェクトで作成されるWEBアプリのデモです。

https://my-nft-game-nine.vercel.app/


🙋‍♂️ 質問する
-------------------------------------------
ここまでの作業で何かわからないことがある場合は、Discordの `#section-4-help` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください✨
```
1. 何をしようとしていたか
2. エラー文をコピー&ペースト
3. エラー画面のスクリーンショット
```

🎉 おつかれさまでした！
--------------------------------

あなたのオリジナルの NFT Game が完成しました。

あなたは、コントラクトをデプロイし、Mint した NFT キャラクターを使ってボスと対戦できるWEBアプリを立ち上げました。

これらは、分散型WEBアプリがより一般的になる社会の中で、世界を変える2つの重要なスキルです。

これからもweb3への旅をあなたが続けてくれることを願っています🚀

### 🌍 サーバにホストしてみよう

最後に,[Vercel](https://vercel.com/) に Web アプリケーションをホストします。

Vercel はサーバレス機能のホスティングを提供するクラウドプラットフォームです。

スケーリングやサーバの監視は Vercel が行うため, 開発者は Vercel へデプロイするだけでアプリケーションを公開・運用できます。

Vercel に関する詳しい説明は,[こちら](https://zenn.dev/lollipop_onl/articles/eoz-vercel-pricing-2020)をご覧ください。

まず,GitHub の `client` にあるローカルファイルを GitHub へアップロードしましょう。

まだアップロードをしていない方は, ターミナル上で `client` に移動して,下記を実行しましょう。
⚠️ `.gitignore`ファイル内に`.env`が記載されていることを確認していください。

```
git add .
git commit -m "upload to github"
git push
```

次に,GitHub 上の `client` とローカル環境に存在する`client` のファイルとディレクトリが反映されていることを確認してください。

Vercel のアカウントを取得したら,下記を実行しましょう。

1\. `Dashboard` へ進んで, `New Project` を選択してください。

![](/public/images/AVAX-amm/section-4/4_1_1.png)

2\. `Import Git Repository` で自分の GitHub アカウントを接続したら, `client(あなたのレポジトリの名前)` を選択し `Import` してください。

![](/public/images/AVAX-amm/section-4/4_1_2.png)

3\. プロジェクトを作成します。

デフォルトの設定で良いはずですが,
もし `FRAME WORK PRESET` が `Next.js` になっていない場合は `Next.js` を選択してください。

![](/public/images/AVAX-amm/section-4/4_1_3.png)

4\. `Deploy` ボタンをクリックしましょう。

Vercel は GitHub と連動しているので,GitHub が更新されるたびに自動でデプロイを行ってくれます。

しばらくしてビルドが完了すると
メッセージと, 下記のようにホーム画面が出力されます。

![](/public/images/AVAX-amm/section-4/4_1_4.png)

ホーム画面の表示部分はリンクになっているので, クリックするとあなたの作成した dapp がブラウザで確認できます 🎉

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は,Discord の `#avax-amm` で質問をしてください。

ヘルプをするときのフローが円滑になるので,エラーレポートには下記の 3 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

### 🎫 NFT を取得しよう!

NFT を取得する条件は,以下のようになります。

1. MVP の機能がすべて実装されている（実装 OK）

2. Web アプリケーションで MVP の機能が問題なく実行される（テスト OK）

3. このページの最後にリンクされている Project Completion Form に記入する

4. Discord の `avalanche-post-projects` チャンネルに, あなたの Web サイトをシェアしてください

😉🎉 Discord に投稿する際に,追加実装した機能とその概要も教えていただけると幸いです!

プロジェクトを完成させていただいた方には,NFT をお送りします。

### 🎉 おつかれさまでした!

あなたは,コントラクトを Avalanche Fuji C-Chain へデプロイし, コントラクトと通信する AMM Web アプリケーションを立ち上げました。

作成した dapp を元にあなた独自の機能を追加してみてください 💪

本プロジェクトが, あなたが Avalanche や AMM のことを知るお役に立てれば幸いです 🤗

これからのあなたのご活躍を期待しております! 🚀

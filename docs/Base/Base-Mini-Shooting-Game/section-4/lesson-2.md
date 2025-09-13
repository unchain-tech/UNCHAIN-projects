---
title: "FarcasterでMini Appを起動する"
---

# Lesson 2: FarcasterでMini Appを起動する

ついに最終レッスンです。これまでに作成し、デプロイしたMini AppをFarcaster上で実際に起動し、動作を確認します。

## 🚀 Farcasterに投稿（Cast）する

1.  Farcasterクライアント（例: [Warpcast](https://warpcast.com/)）を開きます。
2.  新規投稿画面で、あなたのアプリケーションのVercel URL（例: `https://your-app-name.vercel.app`）を貼り付けます。
3.  URLを貼り付けると、Farcasterが自動的にメタデータを読み込み、Mini Appのプレビューが表示されるはずです。
4.  そのまま「**Cast**」ボタンを押して投稿します。

<br/>

すると以下のような投稿画面となるはずです！

![](/images/Base-Mini-Shooting-Game/section-4/lesson-2/0.png)

**Launch**ボタン押してアプリの動作確認を行なってみましょう！

起動するとウォレット接続が求められるのでウォレットを選択して接続処理を進めます。

![](/images/Base-Mini-Shooting-Game/section-4/lesson-2/1.png)

![](/images/Base-Mini-Shooting-Game/section-4/lesson-2/2.png)

以下のようにシューティングゲームが立ち上がればOKです！ ！

![](/images/Base-Mini-Shooting-Game/section-4/lesson-2/3.png)

## 🔨 Base Buildへの登録

では最後に**Base Build**への登録を試してみようと思います！

[Base Build](https://www.base.dev/)にアクセスします。

SignInを行いましょう。

![](/images/Base-Mini-Shooting-Game/section-4/lesson-2/4.png)

![](/images/Base-Mini-Shooting-Game/section-4/lesson-2/5.png)

SignInが完了したら以下のような画面に遷移するはずなので`Import your mini app`をクリックして自作したMiniAppをBase Buildに登録しましょう！

![](/images/Base-Mini-Shooting-Game/section-4/lesson-2/6.png)

App UrlにはVercelにデプロイした時のURLを入力します。

![](/images/Base-Mini-Shooting-Game/section-4/lesson-2/7.png)

正常に登録が完了したら以下のように`Farcaster`の右上の`Mini App`に自分のアプリが表示されるようになります！

![](/images/Base-Mini-Shooting-Game/section-4/lesson-2/8.png)

Mini Appをクリックすると自分のアプリが起動するはずです！ ！

![](/images/Base-Mini-Shooting-Game/section-4/lesson-2/9.png)

## 🎮 動作確認

最後に以下の手順で動作を確認しましょう。

1.  **Mini Appの起動**: フィードに表示されたプレビュー内の「Play Game」ボタンや画像をクリックすると、アプリがフィード内で直接起動します。
2.  **ウォレット接続**: アプリが起動したら、左上の`<Wallet />`コンポーネントを使ってウォレットを接続します。
3.  **ゲームプレイ**: ウォレットを接続するとゲーム画面が表示されます。キーボードで操作してゲームをプレイし、敵を倒してスコアを獲得してください。

![](/images/Base-Mini-Shooting-Game/section-4/lesson-2/10.png)

4.  **NFTミント**: ゲームオーバーになると、スコアと「Mint Score NFT」ボタンが表示されます。ボタンをクリックすると、ウォレットがトランザクションの確認を求めてきます。

![](/images/Base-Mini-Shooting-Game/section-4/lesson-2/11.png)

5.  **トランザクション確認**: トランザクションを承認すると、`TransactionCard`が表示され、ミント処理の進行状況がわかります。

![](/images/Base-Mini-Shooting-Game/section-4/lesson-2/12.png)

6.  **ブロックエクスプローラーで確認**: `View on Explorer`のリンクをクリックすると、Basescanが開き、ミントされたNFTのトランザクション詳細を確認できます。倒した敵の数（スコア）と同じIDのNFTが、あなたのアドレスにミントされていれば成功です！

**NFTマーケットプレイスでの様子**

![](/images/Base-Mini-Shooting-Game/section-4/lesson-2/13.png)

**ブロックチェーンエクスプローラーの様子**

![](/images/Base-Mini-Shooting-Game/section-4/lesson-2/14.png)

おめでとうございます！

これで、Base上で動作するMini Appの開発からデプロイ、公開までの一連の流れをすべて体験しました。

## 🌍 プロジェクトをアップグレードする

[UNCHAIN](https://unchain.tech/) のプロジェクトは [UNCHAIN License](https://github.com/unchain-tech/UNCHAIN-projects/blob/main/LICENSE) により運用されています。

プロジェクトに参加していて、「こうすればもっと分かりやすいのに！」「これは間違っている！」と思ったら、ぜひ`pull request`を送ってください。

-   **新しい敵やアイテムを追加する**: ゲームをより面白くしてみましょう。
-   **リーダーボードを実装する**: スマートコントラクトを改良して、ハイスコアを記録できるようにしてみましょう。
-   **デザインを改善する**: CSSを駆使して、オリジナルのゲーム画面を作成してみましょう。

このプロジェクトで学んだ知識を活かして、ぜひあなただけのオリジナルMini App開発に挑戦してみてください！

---

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#base`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

1.  質問が関連しているセクション番号とレッスン番号
2.  何をしようとしていたか
3.  エラー文をコピー&ペースト
4.  エラー画面のスクリーンショット

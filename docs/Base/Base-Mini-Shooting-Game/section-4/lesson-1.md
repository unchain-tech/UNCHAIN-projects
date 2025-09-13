---
title: "Vercelにデプロイする"
---

# Lesson 1: Vercelにデプロイする

このレッスンでは、完成したNext.jsアプリケーションを**Vercel**にデプロイし、世界中の誰もがアクセスできるようにします。

デプロイにはVercel CLI（コマンドラインインタフェース）を使用します。

## 🚀 Vercel CLIのインストールとログイン

まず、Vercel CLIをインストールし、アカウントにログインします。

ターミナルで以下のコマンドを実行してください。

```bash
pnpm add -g vercel
vercel login
```

`vercel login`を実行すると、どの方法でログインするか尋ねられます。

GitHubアカウントでのログインがおすすめです。

ブラウザが開き、認証が完了すると、CLIでのログインも完了します。

## 🌐 デプロイの実行

プロジェクトのルートディレクトリ（`Base-Mini-Shooting-Game`）で、以下のコマンドを実行します。

```bash
vercel
```

初めてこのプロジェクトを`vercel`コマンドでデプロイする場合、いくつか質問されます。

1.  **Set up and deploy “~/パス/to/your/project”?** -> `Y`
2.  **Which scope do you want to deploy to?** -> 自分のVercelアカウント名を選択
3.  **Link to existing project?** -> `N`
4.  **What’s your project’s name?** ->（デフォルトのままでOK）
5.  **In which directory is your code located?** -> `packages/frontend`と入力
6.  **Want to override the settings?** -> `N`

これにより、Vercelは`packages/frontend`ディレクトリをNext.jsプロジェクトとして認識し、ビルドとデプロイを自動的に開始します。

デプロイが完了すると、ターミナルに複数のURLが表示されます。

この時点ではまだプレビュー版のみのデプロイとなります。

なので次にプロダクション版のデプロイを行います。

```bash
vercel --prod
```

問題なくデプロイされればプロダクション版のURLがコンソールに出力されるはずです。

そして出力されたURLにデプロイしてシューティングゲームの画面が描画されれば大丈夫です！

![](/images/Base-Mini-Shooting-Game/section-4/lesson-1/0.png)

## accountAssociationの設定

次にaccountAssociationの設定に必要な以下の3つの値を取得します。

- FARCASTER_HEADER
- FARCASTER_PAYLOAD
- FARCASTER_SIGNATURE

<br/>

まず`Farcaster`のWebサイトにアクセスします。

そして左側のメニュー欄から`Developers`をクリックします。

![](/images/Base-Mini-Shooting-Game/section-4/lesson-1/1.png)

すると以下のような画面が表示されるはずです。

このうちの`Manifests`ボタンをクリックします。

![](/images/Base-Mini-Shooting-Game/section-4/lesson-1/2.png)

すると以下のような画面に遷移するはずです。

ここでvercelにデプロイしたアプリのドメイン情報を入力しましょう！

例： my-minikit-app-delta.vercel.app

![](/images/Base-Mini-Shooting-Game/section-4/lesson-1/3.png)

すると以下のように検証が成功し`accountAssociation`のデータが表示されるはずです！

![](/images/Base-Mini-Shooting-Game/section-4/lesson-1/4.png)

ここで表示されている以下の3つの値を控えておいてください。

```json
"accountAssociation": {
    "header": "<各々の値に置き換えてください>",
    "payload": "<各々の値に置き換えてください>",
    "signature": "<各々の値に置き換えてください>"
},
```

## 🔑 環境変数の設定

次にVercelの管理画面で環境変数を設定します。

これらはデプロイしたアプリをMiniApp化するために絶対に必要なステップとなります。

1.  [Vercelのダッシュボード](https://vercel.com/dashboard)にアクセスし、デプロイしたプロジェクトを選択します。
2.  「**Settings**」タブに移動し、左側のメニューから「**Environment Variables**」を選択します。
3.  以下の内容で5つの環境変数を追加します。

    - **NEXT_PUBLIC_ONCHAINKIT_API_KEY**
        -   **KEY**: `NEXT_PUBLIC_ONCHAINKIT_API_KEY`
        -   **VALUE**: あなたのCDP APIキー（公開キー）を貼り付けます。
    - **NEXT_PUBLIC_URL**
        -   **KEY**: `NEXT_PUBLIC_URL`
        -   **VALUE**: Vercelにデプロイして公開されたURLをそのまま入力します。
    - **FARCASTER_HEADER**
        -   **KEY**: `FARCASTER_HEADER`
        -   **VALUE**: 上記`"accountAssociation`のうち、`header`の値を貼り付けます
    - **FARCASTER_PAYLOAD**
        -   **KEY**: `FARCASTER_PAYLOAD`
        -   **VALUE**: 上記`"accountAssociation`のうち、`payload`の値を貼り付けます
    - **FARCASTER_SIGNATURE**
        -   **KEY**: `FARCASTER_SIGNATURE`
        -   **VALUE**: 上記`"accountAssociation`のうち、`signature`の値を貼り付けます
    
4.  「**Save**」ボタンをクリックします。

環境変数を追加した後、再度デプロイを行います。

「**Deployments**」タブに移動し、最新のデプロイのステータスが「**Ready**」になったら、設定は完了です。

---

これで、あなたのMini Appはインターネット上に公開されました。

次のレッスンでは、この公開URLを使って、FarcasterにMini Appとして認識させるための最終設定を行います。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#base`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

1.  質問が関連しているセクション番号とレッスン番号
2.  何をしようとしていたか
3.  エラー文をコピー&ペースト
4.  エラー画面のスクリーンショット

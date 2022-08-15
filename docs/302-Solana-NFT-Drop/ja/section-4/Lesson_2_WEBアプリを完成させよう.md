### 🚀 Vercel で Web アプリケーションをデプロイする

作成した Web アプリケーションをデプロイしてみましょう。

ここでは [Vercel](https://Vercel.com) を用いてデプロイします。

Vercel のアカウントをお持ちでない方は、上記のリンクにアクセスして、アカウントを作成してください。

デプロイ方法を簡単に説明します。

1 \. 最新のコードを GitHub にプッシュします。`.cache` をコミットしないでください。

2 \. Vercel のダッシュボードから、`New Project` をクリックしてください。

![無題](/public/images/302-Solana-NFT-Drop/section4/4_2_1.png)

3 \. Web アプリケーションのリポジトリを `Import` してください。

![無題](/public/images/302-Solana-NFT-Drop/section4/4_2_2.png)

4 \. 必要項目を埋めていきます。**FRAMEWORK PRESET** には `Create React App`、**ROOT DIRECTORY** は `app` を入力してください。

5 \. **Environment Variables** には環境変数を直接入力してください。GitHub には `.env` ファイルを保存していないため、`Vercel` に直接記載する必要があります。`プロジェクト名/app/.env` に記載されている 3 つの環境変数と、追加で `CI=false` を Vercel に登録してください。

![無題](/public/images/302-Solana-NFT-Drop/section4/4_2_3.png)

環境変数 `CI = false` を追加することにより、警告が原因でビルドが失敗しないようになります。

![無題](/public/images/302-Solana-NFT-Drop/section4/4_2_4.png)

6 \. デプロイします!

### 🎫 NFT を取得しよう!

NFT を取得する条件は、以下のようになります。

1. MVP の機能がすべて実装されている（実装 OK）

2. Web アプリケーションで MVP の機能が問題なく実行される（テスト OK）

3. このページの最後にリンクされている Project Completion Form に記入する

4. Discord の `🔥｜solana-post-projects` チャンネルに、あなたの Web サイトをシェアしてください 😉🎉 。Discord へ投稿する際に、追加実装した機能とその概要も教えていただけると幸いです!

プロジェクトを完成させていただいた方には、NFT をお送りします。

### 😍 完成!

これにて本プロジェクトは終了です。

他にも、Web アプリケーション上で入手した NFT を確認できる機能や、NFT ミントが完了した際にポップアップを表示したりなど、機能を実装してみてください。

イケている機能を実装できたら Discord でコミュニティに紹介してみてください!

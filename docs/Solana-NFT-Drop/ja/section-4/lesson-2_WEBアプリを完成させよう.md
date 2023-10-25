### 🚀 Vercel で Web アプリケーションをデプロイする

作成したWebアプリケーションをデプロイしてみましょう。

ここでは [Vercel](https://Vercel.com) を用いてデプロイします。

Vercelのアカウントをお持ちでない方は、上記のリンクにアクセスして、アカウントを作成してください。

デプロイ方法を簡単に説明します。

1 \. 最新のコードをGitHubにプッシュします。`cache.json`をコミットしないでください。

2 \. Vercelのダッシュボードから、`Add New...`をクリックし、`Project`を選択します。

![無題](/public/images/Solana-NFT-Drop/section-4/4_2_1.png)

3 \. Webアプリケーションのリポジトリを`Import`してください。

![無題](/public/images/Solana-NFT-Drop/section-4/4_2_2.png)

4 \. 必要項目を埋めていきます。**FRAMEWORK PRESET** には`Next.js`、**ROOT DIRECTORY** は`./`を入力してください。

5 \. **Environment Variables** には環境変数を直接入力してください。GitHubには`.env.local`ファイルを保存していないため、`Vercel`に直接記載する必要があります。`プロジェクト名/.env.local`に記載されている3つの環境変数と、追加で`CI=false`をVercelに登録してください。

環境変数`CI = false`を追加することにより、警告が原因でビルドが失敗しないようになります。

![無題](/public/images/Solana-NFT-Drop/section-4/4_2_3.png)

6 \. デプロイします!

### 🎫 NFT を取得しよう!

NFTを取得する条件は、以下のようになります。

1. MVPの機能がすべて実装されている（実装OK）

2. WebアプリケーションでMVPの機能が問題なく実行される（テストOK）

3. このページの最後にリンクされているProject Completion Formに記入する

4. Discordの`🔥｜completed-projects`チャンネルに、あなたのWebサイトをシェアしてください 😉🎉 。Discordへ投稿する際に、追加実装した機能とその概要も教えていただけると幸いです!

プロジェクトを完成させていただいた方には、NFTをお送りします。

### 😍 完成!

これにて本プロジェクトは終了です。

他にも、Webアプリケーション上で入手したNFTを確認できる機能や、NFTミントが完了した際にポップアップを表示したりなど、機能を実装してみてください。

イケている機能を実装できたらDiscordでコミュニティに紹介してみてください!

---

Project Completion Formは[こちら](https://airtable.com/shrf1cCtTx0iQuszX)です。

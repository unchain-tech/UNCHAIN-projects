### **🚀vercelでデプロイします**

作成したwebアプリをデプロイしてみましょう。<br>
ここでは[vercel](https://vercel.com)を用いてデプロイします。vercelへのサインアップは事前に済ませておいてください。

※vercelは無料版で進めてください。


デプロイ方法を簡単に説明します。

1. 最新のコードをGithubにプッシュします。`.cache`をコミットしないでください。
2. vercelのダッシュボードから、New Projectをクリックしてください。
![無題](/public/images/Solana-NFT-mint/section4/4_2_1.png)

3. webアプリのレポジトリをImportしてください<br>
![無題](/public/images/Solana-NFT-mint/section4/4_2_2.png)

4. 必要項目を埋めていきます。**FRAMEWORK PRESET**にはCreate React App、**ROOT DIRECTORY**はappを入力してください。

5. **Environment Variables**には環境変数を直接入力してください。githubには.envファイルを保存していないため、vercelに直接記載する必要があります。`プロジェクト名/app/.env`に記載されている3つの環境変数と、追加で`CI=false`をvercelに登録してください。
![無題](/public/images/Solana-NFT-mint/section4/4_2_3.png)
<br>
※Vercelでは、環境変数`CI = false`を追加する必要があります。これにより、警告が原因でビルドが失敗しないようになります。
![無題](/public/images/Solana-NFT-mint/section4/4_2_4.png)
6. デプロイします。


### **😍完成！**

これにて本プロジェクトは終了です。他にも、webアプリ上で入手したNFTを確認できる機能や、NFTミントが完了した際にポップアップを表示したりなど、機能を実装してみてください。
イケてる機能を実装できたらDiscordでコミュニティに紹介してみてください！

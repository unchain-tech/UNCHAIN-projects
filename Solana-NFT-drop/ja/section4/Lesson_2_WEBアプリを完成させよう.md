🚀 Vercel でWEBアプリをデプロイする
---

作成したWEBアプリをデプロイしてみましょう。

ここでは [Vercel](https://Vercel.com) を用いてデプロイします。

Vercel のアカウントをお持ちでない方は、上記のリンクにアクセスして、アカウントを作成してください。

デプロイ方法を簡単に説明します。

1 \. 最新のコードを Github にプッシュします。`.cache` をコミットしないでください。

2 \. Vercel のダッシュボードから、`New Project` をクリックしてください。

![無題](/public/images/Solana-NFT-mint/section4/4_2_1.png)

3 \. WEBアプリのレポジトリを `Import` してください

![無題](/public/images/Solana-NFT-mint/section4/4_2_2.png)

4 \. 必要項目を埋めていきます。**FRAMEWORK PRESET** には `Create React App`、**ROOT DIRECTORY** は `app` を入力してください。

5 \. **Environment Variables** には環境変数を直接入力してください。github には `.env` ファイルを保存していないため、`Vercel` に直接記載する必要があります。`プロジェクト名/app/.env` に記載されている3つの環境変数と、追加で `CI=false` を Vercel に登録してください。

![無題](/public/images/Solana-NFT-mint/section4/4_2_3.png)

環境変数 `CI = false` を追加することにより、警告が原因でビルドが失敗しないようになります。

![無題](/public/images/Solana-NFT-mint/section4/4_2_4.png)

6 \. デプロイします!

😍 完成！
----

これにて本プロジェクトは終了です。

他にも、WEB アプリ上で入手したNFTを確認できる機能や、NFT ミントが完了した際にポップアップを表示したりなど、機能を実装してみてください。

イケてる機能を実装できたら Discord でコミュニティに紹介してみてください！

🎫 NFTを取得しよう！
----

NFT を取得する条件は、以下のようになります。

1. MVP の機能がすべて実装されている（実装 OK）

2. WEBアプリで MVP の機能が問題なく実行される（テスト OK）

3. [Project Completion Form](https://airtable.com/shrf1cCtTx0iQuszX) を提出してください。

Discord の `🔥｜post-your-project` チャンネルに、あなたのWEBサイトをぜひシェアしてください😉🎉

プロジェクトを完成させていただいた方には、NFT をお送りします。
※ 現在準備中なので、今しばらくお待ちください！

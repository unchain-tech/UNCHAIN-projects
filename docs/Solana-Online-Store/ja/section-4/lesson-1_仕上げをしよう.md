### 🚢 メインネットへ移行したいとき

このチュートリアルの素晴らしいところは、**デプロイコストがかからない** ところです。

無料でデプロイして、メインネットで販売することで、誰でもUSDCで収入を得ることができます。

**メインネットに移行したい場合は以下を参照してみてください（チュートリアル内では実施しません）。**

メインネットでトランザクションを受けるには、以下の2つの変数を更新する必要があります。

1\. `createTransaction.js`で設定したテストネットのUSDC SPLトークンアドレスを以下のとおりメインネットのUSDC SPLトークンアドレスに変更します。

```jsx
const usdcAddress = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
```

2\. `_app.js`及び`createTransaction.js`ファイル内の`WalletAdapterNetwork`関数内にある`network`を以下のとおり変更します。

```jsx
const network = WalletAdapterNetwork.Mainnet;
```

たったこれだけでメインネットで販売することができます!


### 🎨 Web アプリケーションをアップグレードする

これにてMVPは完成です!

さて、それでは最後にあなたのWebアプリケーションのアップグレードに挑戦してみてください!

どうアレンジするかはあなたの自由ですが、私からは3つヒントを示しておきます!

1\. ショップのオーナーを増やし、オーナー権限のある人が商品を追加できるようにする。

2\. 商品データ及び注文情報をSolanaチェーン上に保存する。

3\. 画像をNFT化して商品にする機能を設ける。


### 🙉 `.gitignore`を確認する

GitHubなどにコードをアップロードする際は、秘密鍵や構成ファイル等の見られたくないファイルはアップロードしないように設定する必要があります。

前のレッスンでも触れましたが、そういった際には`dotenv`モジュールを使用します。

ただし、GitHubにアップロードする場合、`.gitignore`に`.env.local`が含まれていないと`.env.local`も一緒にアップロードされてしまうので注意が必要です。

`.gitignore`の中身に以下のファイルやフォルダが設定されているかを確認しましょう（不足しているものがあれば追加しましょう）。

```txt
node_modules
.DS_STORE
.env.local
```

> ⚠️ 注意
>
> ファイルの先頭に`.`がついているファイルは、「不可視ファイル」です。
>
> `.`がついているファイルやフォルダはその名の通り見ることができないので、「隠しファイル」「隠しフォルダ」とも呼ばれます。
>
> 操作されては困るファイルなどは、このように「不可視」の属性を持たせて、一般の人が触れられないように設定しておきましょう。


### 🚀 Vercel に Web アプリケーションをデプロイする

作成したWebアプリケーションをデプロイしてみましょう。

ここでは[Vercel](https://Vercel.com)を用いてデプロイします。

Vercelはサーバーレス機能のホスティングを提供するクラウドプラットフォームです。

スケーリングやサーバーの監視はVercelが行うため、開発者はVercelへデプロイするだけでアプリケーションを公開・運用できます。

Vercelのアカウントをお持ちでない方は、上記のリンクにアクセスして、アカウントを作成してください。

まず、`Solana-Online-Store`の最新コードをGitHubにプッシュします。

ターミナルで`Solana-Online-Store`に移動し、以下のコマンドをそれぞれ実行しましょう。

```
git add .
git commit -m "upload to github"
git push
```

続いて、以下の手順でVercelにデプロイします。

1\. Vercelのダッシュボードから、`Add New...`をクリックし、`Project`を選択します。

![new project](/public/images/Solana-Online-Store/section-4/4_1_1.png)

2\. `Import Git Repository`で自分のGitHubアカウントを接続したら、Webアプリケーションのリポジトリを`Import`してください。

![Import](/public/images/Solana-Online-Store/section-4/4_1_2.png)

3\. プロジェクトの設定では、**FRAMEWORK PRESET** に`Next.js`、**ROOT DIRECTORY** に`./`を入力してください。

4\. **Environment Variables** に環境変数`CI = false`（NAME: CI、VALUE: false）を追加します（警告が原因でビルドが失敗しないようになります）。

5\. **Environment Variables** に`.env.local`で設定した環境変数（NAME: NEXT_PUBLIC_OWNER_PUBLIC_KEY、VALUE: `phantom wallet address`）を直接入力してください( GitHubには`.env.local`ファイルを保存していないため、`Vercel`に直接記載する必要があります)。

![Environment Variables1](/public/images/Solana-Online-Store/section-4/4_1_3.png)

6\.`Deploy`ボタンを押してデプロイします（VercelはGitHubと連動しているので、GitHubが更新されるたびに自動でデプロイを行ってくれます）。

**Vercel へのデプロイが無事完了しました!**

ぜひデプロイされたWebアプリケーションを自分の目で確認してみてください!!


### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#solana`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```


### 🎫 NFT を取得しよう!

NFTを取得する条件は、以下のようになります。

1. MVPの機能がすべて実装されている（実装OK）

2. WebアプリケーションでMVPの機能が問題なく実行される（テストOK）

3. このページの最後にリンクされているProject Completion Formに記入する

4. Discordの`🔥｜completed-projects`チャンネルに、あなたのWebサイトをシェアしてください 😉🎉 。Discordへ投稿する際に、追加実装した機能とその概要も教えていただけると幸いです!

プロジェクトを完成させていただいた方には、NFTをお送りします。


### 🎉 おつかれさまでした!

あなたは、独自のオンラインストアをデプロイし、Webアプリケーションを立ち上げました。

これらは、分散型Webアプリケーションがより一般的になる社会の中で、世界を変える重要なスキルです。

UIのデザインや機能をアップグレードして、ぜひコミュニティにシェアしてください!　 😊

これからもweb3への旅をあなたが続けてくれることを願っています 🚀

---

Project Completion Formは[こちら](https://airtable.com/shrf1cCtTx0iQuszX)です。

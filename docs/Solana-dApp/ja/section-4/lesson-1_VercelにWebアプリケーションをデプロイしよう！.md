### 😎 Web アプリケーションをアップグレードする

ここまででMVPは完成です。

MVPを起点にしてWebアプリケーションのアップグレードにチャレンジしてみましょう。

※ 以下は一例です。

1\. Webアプリケーションに接続したユーザーのウォレットアドレスを表示する(ヒント： `item.userAddress.toString()`)

2\. それぞれのGIF画像に「いいね数」が表示される「いいね」ボタンを実装する。

3\. GIFデータ送信時に表示されるローディング画面を実装する。


### 🙉 `.env`プロパティを設定する

Git hubなどにコードをアップロードする際は、秘密鍵や構成ファイル等の見られたくないファイルはアップロードしないように設定する必要があります。

まず、ターミナルでプロジェクトのルートディレクトリまで移動し、以下のコマンドを実行しましょう。

```
yarn add --dev dotenv
```

`dotenv`モジュールに関する詳しい説明は、[こちら](https://maku77.github.io/nodejs/env/dotenv.html)を参照してください。

`dotenv`をインストールしたら、ルートディレクトリ直下に`.env`ファイルを作成し、以下のとおり更新します。

※ 以下は記載例です（プログラムIDには作成したものを入れてください）。

```txt
SOLANA_NETWORK=devnet
```

> ⚠️ 注意
>
> ファイルの先頭に`.`がついているファイルは、「不可視ファイル」です。
>
> `.`がついているファイルやフォルダはその名の通り見ることができないので、「隠しファイル」「隠しフォルダ」とも呼ばれます。
>
> 操作されては困るファイルなどは、このように「不可視」の属性を持たせて、一般の人が触れられないように設定しておきましょう。

`.env`を更新したら、`App.js`ファイルを以下のとおり更新してください。

※ `require('dotenv').config();`はimport文の直下に追加し、`clusterApiUrl`の引数を`process.env.SOLANA_NETWORK`に変更してください。

```javascript
require('dotenv').config();

// ネットワークをdevnetに設定します。
const network = clusterApiUrl(process.env.SOLANA_NETWORK);
```

最後に`.gitignore`に`.env`が含まれていることを確認しましょう。

また、その他の機密ファイルも併せて追記しておきましょう。

`.gitignore`の中身が以下のようになっていればOKです。

```txt
node_modules
.DS_STORE
.env
```

これで、GitHubにアップロードしたくない情報をアップロードしないで済みます。


### 🚀 Vercel に Web アプリケーションをデプロイする

作成したWebアプリケーションをデプロイしてみましょう。

ここでは[Vercel](https://Vercel.com)を用いてデプロイします。

Vercelはサーバーレス機能のホスティングを提供するクラウドプラットフォームです。

スケーリングやサーバーの監視はVercelが行うため、開発者はVercelへデプロイするだけでアプリケーションを公開・運用できます。

Vercelのアカウントをお持ちでない方は、上記のリンクにアクセスして、アカウントを作成してください。

まず、`Solana-dApp`の最新コードをGitHubにプッシュします。

ターミナルで`Solana-dApp`に移動し、以下のコマンドをそれぞれ実行しましょう。

```
git add .
git commit -m "upload to github"
git push
```

続いて、以下の手順でVercelにデプロイします。

1\. Vercelのダッシュボードから、`New Project`をクリックしてください。

![new project](/public/images/Solana-dApp/section-4/4_1_1.png)

2\. `Import Git Repository`で自分のGitHubアカウントを接続したら、Webアプリケーションのリポジトリを`Import`してください。

![Import](/public/images/Solana-dApp/section-4/4_1_2.png)

3\. プロジェクトの設定では、**FRAMEWORK PRESET** に`Create React App`、**ROOT DIRECTORY** に`app`を入力してください。

4\. プロジェクトを作成します。`Root Directory`が「packages/client」となっていることを確認してください。

![](/public/images/ETH-NFT-Collection/section-4/4_2_9.png)

5\. **Environment Variables** に`.env`で設定した環境変数（NAME: SOLANA_NETWORK、VALUE: devnet）を直接入力してください( GitHubには`.env`ファイルを保存していないため、`Vercel`に直接記載する必要があります)。

![Environment Variables1](/public/images/Solana-dApp/section-4/4_1_3.png)

![Environment Variables2](/public/images/Solana-dApp/section-4/4_1_4.png)

6\.[Deploy]ボタンを押してデプロイします（VercelはGitHubと連動しているので、GitHubが更新されるたびに自動でデプロイを行ってくれます）。

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


### 😍 完成!

これにて本プロジェクトは終了です。

Webアプリケーション上でオリジナルの機能を実装して遊んでみてください。

イケている機能を実装できたらDiscordでコミュニティに紹介してみてください!

---

Project Completion Formは[こちら](https://airtable.com/shrf1cCtTx0iQuszX)です。

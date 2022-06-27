### 😎 Web アプリケーションをアップグレードする

ここまでで MVP は完成です。

MVP を起点にして Web アプリケーションのアップグレードにチャレンジしてみましょう。

※ 以下は一例です。

1\. Web アプリケーションに接続したユーザーのウォレットアドレスを表示する。（ヒント： `item.userAddress.toString()` ）

2\. それぞれの GIF 画像に「いいね数」が表示される「いいね」 ボタンを実装する。

3\. GIF データ送信時に表示されるローディング画面を実装する。


### 🙉 `.env` プロパティを設定する

Git hub などにコードをアップロードする際は、秘密鍵や構成ファイル等の見られたくないファイルはアップロードしないように設定する必要があります。

まず、ターミナルでプロジェクトのルートディレクトリまで移動し、以下のコマンドを実行しましょう。

```bash
npm install --save dotenv
```

`dotenv` モジュールに関する詳しい説明は、[こちら](https://maku77.github.io/nodejs/env/dotenv.html)を参照してください。

`dotenv` をインストールしたら、ルートディレクトリ直下に `.env` ファイルを作成し、以下のとおり更新します。

※ 以下は記載例です。（プログラムIDには作成したものを入れてください。）

```txt
SOLANA_NETWORK=devnet
```

> ⚠️ 注意
>
> ファイルの先頭に `.` がついているファイルは、「不可視ファイル」です。
>
> `.` がついているファイルやフォルダはその名の通り見ることができないので、「隠しファイル」「隠しフォルダ」とも呼ばれます。
>
> 操作されては困るファイルなどは、このように「不可視」の属性を持たせて、一般の人が触れられないように設定しておきましょう。

`.env` を更新したら、`App.js` ファイルを以下のとおり更新してください。

※ `require('dotenv').config();` は import 文の直下に追加し、`clusterApiUrl` の引数を `process.env.SOLANA_NETWORK` に変更してください。

```javascript
// App.js

require('dotenv').config();

// ネットワークをdevnetに設定します。
const network = clusterApiUrl(process.env.SOLANA_NETWORK);
```

最後に `.gitignore` に `.env` が含まれていることを確認しましょう。

また、その他の機密ファイルも併せて追記しておきましょう。

`.gitignore` の中身が以下のようになっていれば OK です。

```txt
node_modules
.DS_STORE
.env
```

これで、GitHub にアップロードしたくない情報をアップロードしないで済みます。


### 🚀 Vercel に Web アプリケーションをデプロイする

作成した Web アプリケーションをデプロイしてみましょう。

ここでは[Vercel](https://Vercel.com)を用いてデプロイします。

Vercel はサーバレス機能のホスティングを提供するクラウドプラットフォームです。

スケーリングやサーバの監視は Vercel が行うため、開発者は Vercel へデプロイするだけでアプリケーションを公開・運用できます。

Vercel のアカウントをお持ちでない方は、上記のリンクにアクセスして、アカウントを作成してください。

まず、`gif-portal-starter` の最新コードを GitHub にプッシュします。

ターミナルで `gif-portal-starter` に移動し、以下のコマンドをそれぞれ実行しましょう。

```bash
git add .
git commit -m "upload to github"
git push
```

続いて、以下の手順で Vercel にデプロイします。

1\. Vercel のダッシュボードから、`New Project` をクリックしてください。

![new project](/public/images/301-Solana-dApp/section-4/4_1_1.png)

2\. `Import Git Repository` で自分の GitHub アカウントを接続したら、Web アプリケーションのリポジトリを `Import` してください。

![Import](/public/images/301-Solana-dApp/section-4/4_1_2.png)

3\. プロジェクトの設定では、**FRAMEWORK PRESET** に `Create React App`、**ROOT DIRECTORY** に `app` を入力してください。

4\. **Environment Variables** に環境変数 `CI = false` （ NAME: CI 、 VALUE: false ）を追加します。（警告が原因でビルドが失敗しないようになります。）

5\. **Environment Variables** に `.env` で設定した環境変数（ NAME: SOLANA_NETWORK 、 VALUE: devnet ）を直接入力してください。（ GitHub には `.env` ファイルを保存していないため、`Vercel` に直接記載する必要があります。）

![Environment Variables1](/public/images/301-Solana-dApp/section-4/4_1_3.png)

![Environment Variables2](/public/images/301-Solana-dApp/section-4/4_1_4.png)

6\. [Deploy]ボタンを押してデプロイします。（ Vercel は GitHub と連動しているので、GitHub が更新されるたびに自動でデプロイを行ってくれます。）

**Vercel へのデプロイが無事完了しました！**

ぜひデプロイされた Web アプリケーションを自分の目で確認してみてください！！


### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#section-4` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 4 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```


### 🎫 NFT を取得しよう！

NFT を取得する条件は、以下のようになります。

1. MVP の機能がすべて実装されている（実装 OK ）

2. Web アプリケーションで MVP の機能が問題なく実行される（テスト OK ）

3. このページの最後にリンクされている Project Completion Form に記入する

4. Discord の `🔥｜post-your-project` チャンネルに、あなたの Web サイトをシェアしてください 😉🎉 。Discord へ投稿する際に、追加実装した機能とその概要も教えていただけると幸いです！

プロジェクトを完成させていただいた方には、NFT をお送りします。


### 😍 完成！

これにて本プロジェクトは終了です。

Web アプリケーション上でオリジナルの機能を実装して遊んでみてください。

イケている機能を実装できたら Discord でコミュニティに紹介してみてください！

### 🌏 Web サイトをデプロイしよう

前回のセクションで、IC上にデプロイするための準備が完了しました。

以下のコマンドを実行しましょう。必ず、`icp-static-site/`下で実行してください。

```
dfx deploy --network ic --with-cycles 1000000000000
```

⚠️ 使用しているPCの環境によっては、フロントエンドのビルドに失敗する可能性があります。

```
Error: Failed while trying to deploy canisters.
Caused by: Failed while trying to deploy canisters.
  Failed to build call canisters.
    Failed while trying to build all canisters.
      The post-build step failed for canister 'CANISTER_ID' (website) with an embedded error: Failed to build frontend for network 'ic'.: The command '"npm" "run" "build"' failed with exit status 'exit status: 1'.
Stdout:

> icp-static-site@0.0.0 build
> vite build


Stderr:
failed to load config from ../icp-static-site/vite.config.js
error during build:
Error:
You installed esbuild on another platform than the one you're currently using.
This won't work because esbuild is written with native code and needs to
install a platform-specific binary executable.
...
```

上記エラーの対応としては、Nodeバージョン管理ツールである`nvm`を使用してインストールしたNodeを準備することです。
`nvm`のインストールと使い方は[こちら](https://github.com/nvm-sh/nvm#installing-and-updating)を参照してください。

問題がなければ、`dfx.json`ファイルで定義したキャニスターが、IC上にデプロイされます。

```
Deploying all canisters.
Creating canisters...
Creating canister website...
website canister created on network ic with canister id: CREATED_CANISTER_ID
Building canisters...
Building frontend...
Installing canisters...
Installing code for canister website, with canister ID CREATED_CANISTER_ID
Uploading assets to asset canister...
Starting batch.
Staging contents of new and changed assets:
  /assets/index.95e5393f.css 1/1 (7311 bytes)
  /index.html 1/1 (452 bytes)
  /index.html (gzip) 1/1 (301 bytes)
  /assets/index.0fb8d857.js 1/1 (7877 bytes)
  /assets/index.95e5393f.css (gzip) 1/1 (2010 bytes)
  /assets/unchain_logo.9fc9ba05.png 1/1 (11126 bytes)
  /assets/index.0fb8d857.js (gzip) 1/1 (3149 bytes)
Committing batch.
Deployed canisters.
```

これで、デプロイは完了です！

### 🔐 Identity Anchor を作成しよう

それでは、デプロイしたポートフォリオサイトにアクセスしてみましょう。URLはキャニスター IDを用いたものになります。

`https://<CREATED_CANISTER_ID>.icp0.io/`

キャニスター IDは、デプロイ時の出力や生成された`canister_ids.json`ファイル、または以下のコマンドで確認できます。

```
dfx canister --network ic id website
```

ここで、初めてIC上のアプリケーションにアクセスする場合、URLにアクセスすると**Welcome to Internet Identity**と表示されるサイトに誘導されたかと思います。

ここでは、ICがサポートする認証システム`Internet Identity`を利用するための設定を行なっていきます。既に設定されている方はスキップしてください。

Web2の世界では、個人情報（生年月日やメールアドレス、パスワードなど）を登録することでユーザーを認証していました。これは、企業側や他のユーザーに個人情報を提示するという欠点があります。他のブロックチェーン上では、ウォレットを紐づけることでユーザーを認証していました。ブロックチェーンとのやりとりにユーザーがコストを支払うという点でウォレットの作成は必須でしたが、ICでは、必須ではありません（リバースガスモデル）。**Internet Identity**は、デバイスを使ってIC上のdAppsに仮名で認証・サインインできるようにするものです。つまり、デバイスとユーザーを紐付けることで識別されると考えることができます。

Internet Identityを利用するためには、Anchorと呼ばれる一意のIDを作成する必要があります。

以下に、作成手順を簡単に説明します。設定に使用するデバイスやリカバリー方法に複数の選択肢があるため、詳しくは[こちら](https://internetcomputer.org/docs/current/tokenomics/identity-auth/auth-how-to/)を参照してください。

1. `Create an internet identity Anchor`をクリックします。
   ![](/public/images/ICP-Static-Site/section-4/4_1_1.png)

2. デバイスの名前を入力し、`Create`ボタンを押します（例：Brave, iPhone, など）。
   ![](/public/images/ICP-Static-Site/section-4/4_1_2.png)

3. 認証方法として使用するアイテムを選びます。
   ![](/public/images/ICP-Static-Site/section-4/4_1_3.png)

4. プロンプトが表示されたら、選択した方法で認証します。例えば、3.で`This device`を選択した場合、デバイスに搭載されている生体認証やロック解除のパスワードなどでの認証が求められます。

5. 認証が成功すると、一意の番号で表される`Internet Anchor`が表示されます。確認後、`Continue`をクリックします。

6. 作成されたanchorのリカバリー方法を設定することができます。スキップすることができますが、公式では設定することを強く勧めています。お好きな方を選択して設定しましょう。

リカバリー方法を設定後、登録したデータが表示されたら完了です！ 再度デプロイしたサイトにアクセスしてみましょう。

Webサイトが確認できたらデプロイ完了です！

![](/public/images/ICP-Static-Site/section-4/4_1_4.png)

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#icp`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

### 🎫 NFT を取得しよう！

NFTを取得する条件は、以下のようになります。

1. MVPの機能がすべて実装されている（実装OK）

2. WebアプリケーションでMVPの機能が問題なく実行される（テストOK）

3. このページの最後にリンクされているProject Completion Formに記入する

4. Discordの`🔥｜completed-projects`チャンネルに、あなたのWebサイトをシェアしてください 😉 🎉 。Discordへ投稿する際に、追加実装した機能とその概要も教えていただけると幸いです！

プロジェクトを完成させていただいた方には、NFTをお送りします。

### 🎉 おつかれさまでした！

今回のプロジェクトで、ブロックチェーン上にホストされたポートフォリオサイトが完成しました！

これは、web3がより一般的になる社会の中で、世界を変える重要なスキルです。

UIのデザインや機能をアップグレードして、ぜひコミュニティにシェアしてください！　 😊

これからもweb3への旅をあなたが続けてくれることを願っています 🚀

---

Project Completion Formは[こちら](https://airtable.com/shrf1cCtTx0iQuszX)です。

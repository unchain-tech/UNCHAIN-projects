### 🚲 `bikeコントラクト`を自分のアカウントにデプロイしよう

これまで`bikeコントラクト`は`dev-account`にデプロイしていましたが,
自分の作成したアカウントにデプロイしましょう。
[testnet wallet](https://wallet.testnet.near.org/)から新しいアカウントを作成します。
ここでは`bike_account.testnet`としました。

![](/public/images/NEAR-BikeShare/section-4/4_2_1.png)

新アカウントにログインしましょう。

```
$ near login
```

![](/public/images/NEAR-BikeShare/section-4/4_2_2.png)

それではターミナルからデプロイまでの一連の流れを実行しましょう！
前回までのレッスンでコンパイル済みの`out/main.wasm`が存在することが前提です。
※ `near_bike_share_dapp`直下で実行してください。

```
$ export ID=bike_account.testnet
$ near create-account sub.$ID --masterAccount $ID --initialBalance 50
$ near deploy sub.$ID --wasmFile out/main.wasm  --initFunction 'new' --initArgs '{"num_of_bikes": 5}'
```

デプロイの実行結果

```
Done deploying and initializing sub.bike_account.testnet
```

次に`bikeコントラクト`のアカウントにftを転送します。
`package.json`に記載した`init`スクリプトと同じことを実行していきますが,
コントラクト名のみ正しいものに使用するよう気をつけてください。
環境変数用意

```
$ export FT_CONTRACT=sub.ft_account.testnet FT_OWNER=ft_account.testnet CONTRACT_NAME=sub.bike_account.testnet
```

init処理

```
$ near call $FT_CONTRACT storage_deposit '' --accountId $CONTRACT_NAME --amount 0.00125 && near call $FT_CONTRACT ft_transfer '{"receiver_id": "'$CONTRACT_NAME'", "amount": "100"}' --accountId $FT_OWNER --amount 0.000000000000000000000001
```

成功すれば最後の出力結果は`''`（空）となっています。

次に`frontend/assets/js/near/config.js`の以下の部分を書き換えます。

```js
// config.js

const CONTRACT_NAME = process.env.CONTRACT_NAME || "sub.bike_account.testnet";
// "sub.bike_account.testnet" を　あなたがbikeコントラクトをデプロイしたアカウントに変更してください

// ...
```

[parcel](https://parceljs.org/docs/)でwebアプリをビルドします。
※ `near_bike_share_dapp`のルートディレクトリで実行してください。

```
$ yarn parcel frontend/index.html
```

実行結果

![](/public/images/NEAR-BikeShare/section-4/4_2_3.png)

上記のような表示がされたら`ctrl + c`で抜けましょう。
`./dist`ディレクトリにコンパイルされたソースコードが出力されています。

### 🦋 netlify に deploy しよう

最後にあなたが作成したアプリをホストしましょう！

ここでは[Netlify](https://www.netlify.com/)を用いてデプロイします。
`Netlify`は静的サイトのホスティングを提供するwebサービスです。
Netlifyのアカウントをお持ちでない方は、上記のリンクにアクセスして、アカウントを作成してください。
その際`team name`などはご自由にご記入ください！

次にnetlifyをローカルで実行するために以下のコマンドを実行してください。

```
$ yarn add netlify-cli --dev
```

ログインします。

```
$ netlify login
```

デプロイします。

```diff
netlify deploy --prod
```

コマンド実行後、対話形式でいくつか質問に答えます。

`Create & configure a new site`を選択します。

```
? What would you like to do?
  Link this directory to an existing site
❯ +  Create & configure a new site
```

次にアカウント作成時に決めたチーム名を選択します。

```
? Team: (Use arrow keys)
❯ rakiyama
```

次にお好きなサイト名を決定します。

```
? Site name (optional): near-bikeshare-dapp
```

最後にディレクトリを指定します。

```
? Publish directory ./dist
```

しばらく待つとデプロイ作業が終了します！

```
Deploy path: /Users/ryojiroakiyama/Desktop/icloud/lang/crypt/near/creating_contents/near_bike_share_dapp/dist
Deploying to main site URL...
✔ Finished hashing
✔ CDN requesting 4 files
✔ Finished uploading 4 assets
✔ Deploy is live!

Logs:              https://app.netlify.com/sites/near-bikeshare-dapp/deploys/62f5c61e5760ee5d76132194
Unique Deploy URL: https://62f5c61e5760ee5d76132194--near-bikeshare-dapp.netlify.app
Website URL:       https://near-bikeshare-dapp.netlify.app
```

`Website URL:`欄にあるURLをブラウザに貼り付けてアプリを確認しましょう！

![](/public/images/NEAR-BikeShare/section-4/4_2_4.png)

### ⭐ 好きな機能を追加しよう

ご自身の好きなように、またより良いと思うようにアプリをアップデートしましょう！
機能追加の例

- フロントエンドの変更
- 1ユーザにつき1つのバイクのみ利用できるようにする
- `bikeコントラクト`にも`owner_id`属性を追加し、`owner_id`はバイクの数を増やせるなど管理者機能をつける
- ftのやり取りにルールを追加する

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#near`で質問をしてください。

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

4. Discordの`🔥｜completed-projects`チャンネルに、あなたのWebサイトをシェアしてください 😉🎉 。Discordへ投稿する際に、追加実装した機能とその概要も教えていただけると幸いです！

プロジェクトを完成させていただいた方には、NFTをお送りします。

### 🎉 おつかれさまでした！

これでバイクシェアdappを作成することができました！

このアプリがあなたのこれからのweb3での活動に少しでも糧となれば幸いです ✨

これからもweb3への旅を一緒に楽しみましょう 🚀

---

Project Completion Formは[こちら](https://airtable.com/shrf1cCtTx0iQuszX)です。

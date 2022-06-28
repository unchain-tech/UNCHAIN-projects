### 🙉 GitHub に 関する注意点

**GitHub にコントラクト（ `ipfs-nfts`）のコードをアップロードする際は、秘密鍵を含むハードハット構成ファイルをリポジトリにアップロードしないよう注意しましょう。**

秘密鍵などのファイルを隠すために、ターミナルで `ipfs-nfts` に移動して、下記を実行してください。

```bash
npm install --save dotenv
```

`dotenv` モジュールに関する詳しい説明は、[こちら](https://maku77.github.io/nodejs/env/dotenv.html)を参照してください。

`dotenv` をインストールしたら、`.env` ファイルを更新します。

ファイルの先頭に `.` がついているファイルは、「不可視ファイル」です。

`.` がついているファイルやフォルダはその名の通り、見ることができないので、「隠しファイル」「隠しフォルダ」とも呼ばれます。

操作されては困るファイルについては、このように「不可視」の属性を持たせて、一般の人が触れられないようにします。

ターミナル上で `ipfs-nfts` ディレクトリにいることを確認し、下記を実行しましょう。VS Code から `.env` ファイルを開きます。

```
code .env
```

そして、`.env` ファイルを下記のように更新します。

```
PRIVATE_KEY = hardhat.config.jsにある秘密鍵（accounts）を貼り付ける
STAGING_ALCHEMY_KEY = hardhat.config.js内にあるAlchemyのURLを貼り付ける
PROD_ALCHEMY_KEY = イーサリアムメインネットにデプロイする際に使用するAlchemyのURLを貼り付ける（今は何も貼り付ける必要はありません）
```

私の `.env` は、下記のようになります。

```javascript
PRIVATE_KEY = 0x...
STAGING_ALCHEMY_KEY = https://...
```

`.env` を更新したら、 `hardhat.config.js` ファイルを次のように更新してください。

```javascript
// hardhat.config.js
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: process.env.STAGING_ALCHEMY_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```

最後に ` .gitignore` に `.env` が含まれていることを確認しましょう。

`cat .gitignore` をターミナル上で実行します。

下記のような結果が表示されていれば成功です。

```
node_modules
.env
coverage
coverage.json
typechain
#Hardhat files
cache
artifacts
```

これで、GitHub にあなたの秘密鍵をアップロードせずに、GitHub にコントラクトのコードをアップロードできます。



### 🔮 プロジェクトを拡張する

このプロジェクトで学んだことは、Web3 への旅の始まりに過ぎません。

NFT とスマートコントラクトできることはたくさんあります。

あなたのプロジェクトに拡張性を与えるインサイトをいくつか共有します。

**🧞‍♂️: NFT を販売する**

- NFT をユーザーが Mint する際に、あなたに ETH を支払うしくみを実装しましょう。

- コントラクトに `payable` を追加したり、`require` を使用すれば、ユーザーが NFT を購入する際の最小金額を設定できます。

**🍁: ロイヤリティを追加する**

- スマートコントラクトにロイヤリティを追加して、NFT が転売されるごとに、あなたに、一定の資金が振り込まれるしくみを作りましょう。

- 詳細については、こちらをご覧ください: [EIP-2981：NFT Royally Standard ](https://eips.ethereum.org/EIPS/eip-2981)

### 🤟 Vercel に Web アプリケーションをデプロイする

最後に、[Vercel](https://vercel.com/) に Web アプリケーションをホストする方法を学びます。

Vercel はサーバレス機能のホスティングを提供するクラウドプラットフォームです。

スケーリングやサーバの監視は Vercel が行うため、開発者は Vercel へデプロイするだけでアプリケーションを公開・運用できます。

Vercel に関する詳しい説明は、[こちら](https://zenn.dev/lollipop_onl/articles/eoz-vercel-pricing-2020)をご覧ください。

まず、GitHub の `nft-maker-starter-project` にローカルファイルをアップロードしていきます。

ターミナル上で `nft-maker-starter-project` に移動して、下記を実行しましょう。

```
git add .
git commit -m "upload to github"
git push
```

次に、GitHub 上の `nft-maker-starter-project` に、ローカル環境に存在する `nft-maker-starter-project` のファイルとディレクトリが反映されていることを確認してください。

Vercel のアカウントを取得したら、下記を実行しましょう。

1\. `Dashboard` へ進んで、`New Project` を選択してください。

![](/public/images/103-ETH-NFT-Maker/section4/4-2-1.png)

2\. `Import Git Repository` で自分の GitHub アカウントを接続したら、`nft-maker-starter-project` を選択し、`Import` してください。

![](/public/images/103-ETH-NFT-Maker/section4/4-2-2.png)

3\. プロジェクトを作成します。Environment Variable に下記を追加します。

`NAME`＝`CI`、`VALUE`＝`false`（下図参照）

![](/public/images/103-ETH-NFT-Maker/section4/4-2-3.png)

4\. `Deploy`ボタンを推しましょう。

Vercel は GitHub と連動しているので、GitHub が更新されるたびに自動でデプロイを行ってくれます。

下記のように、`Building` ログが出力されます。

基本的に `warning` は無視して問題ありません。

![](/public/images/103-ETH-NFT-Maker/section4/4-2-4.png)


### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#section-4` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 3 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

### 🎫 NFT を取得しよう!

NFT を取得する条件は、以下のようになります。

1. MVP の機能がすべて実装されている（実装 OK）

2. Web アプリケーションで MVP の機能が問題なく実行される（テスト OK）

3. このページの最後にリンクされている Project Completion Form に記入する

4. Discord の `🔥｜post-your-project` チャンネルに、あなたの Web サイトをシェアしてください 😉🎉 Discord に投稿する際に、追加実装した機能とその概要も教えていただけると幸いです!

プロジェクトを完成させていただいた方には、NFT をお送りします。

### 🎉 おつかれさまでした!

あなたのオリジナルの NFT Collection が完成しました。

あなたは、コントラクトをデプロイし、NFT が Mint できる Web アプリケーションを立ち上げました。

これらは、分散型 Web アプリケーションがより一般的になる社会の中で、世界を変える 2 つの重要なスキルです。

これからも Web3 への旅をあなたが続けてくれることを願っています 🚀

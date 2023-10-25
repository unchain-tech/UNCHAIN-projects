### 🙉 GitHub に 関する注意点

**GitHub にコントラクト(`contract`)のコードをアップロードする際は、秘密鍵を含むハードハット構成ファイルをリポジトリにアップロードしないよう注意しましょう。**

秘密鍵などのファイルを隠すために`dotenv`というパッケージを追加します。ターミナル上で、プロジェクトのルートから下記を実行してください。

```
yarn workspace contract add dotenv@^16.3.1
```

`dotenv`モジュールに関する詳しい説明は、[こちら](https://maku77.github.io/nodejs/env/dotenv.html)を参照してください。

`dotenv`をインストールしたら、`.env`ファイルを更新します。

ファイルの先頭に`.`がついているファイルは、「不可視ファイル」です。

`.`がついているファイルやフォルダはその名の通り、見ることができないので、「隠しファイル」「隠しフォルダ」とも呼ばれます。

操作されては困るファイルについては、このように「不可視」の属性を持たせて、一般の人が触れられないようにします。

ターミナル上で`packages/contract`ディレクトリにいることを確認し、下記を実行しましょう。VS Codeから`.env`ファイルを開きます。

```
code .env
```

そして、`.env`ファイルを下記のように更新します。

```
PRIVATE_KEY = hardhat.config.jsにある秘密鍵（accounts）を貼り付ける
STAGING_ALCHEMY_KEY = hardhat.config.js内にあるAlchemyのURLを貼り付ける
PROD_ALCHEMY_KEY = イーサリアムメインネットにデプロイする際に使用するAlchemyのURLを貼り付ける（今は何も貼り付ける必要はありません）
```

私の`.env`は、下記のようになります。

```
PRIVATE_KEY=0x...
STAGING_ALCHEMY_KEY=https://...
```

`.env`を更新したら、 `hardhat.config.js`ファイルを次のように更新してください。

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
module.exports = {
  solidity: "0.8.17",
  networks: {
    sepolia: {
      url: process.env.STAGING_ALCHEMY_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```

最後に` .gitignore`に`.env`が含まれていることを確認しましょう。

`cat .gitignore`をターミナル上で実行します。

下記のような結果が表示されていれば成功です。

```
node_modules
.env
coverage
coverage.json
typechain
typechain-types

#Hardhat files
cache
artifacts
```

これで、GitHubにあなたの秘密鍵をアップロードせずに、GitHubにコントラクトのコードをアップロードできます。

### 🔮 プロジェクトを拡張する

このプロジェクトで学んだことは、web3への旅の始まりに過ぎません。

NFTとスマートコントラクトできることはたくさんあります。

あなたのプロジェクトに拡張性を与えるインサイトをいくつか共有します。

**🧞‍♂️: NFT を販売する**

- NFTをユーザーがMintする際に、あなたにETHを支払うしくみを実装しましょう。

- コントラクトに`payable`を追加したり、`require`を使用すれば、ユーザーがNFTを購入する際の最小金額を設定できます。

**🍁: ロイヤリティを追加する**

- スマートコントラクトにロイヤリティを追加して、NFTが転売されるごとに、あなたに、一定の資金が振り込まれるしくみを作りましょう。

- 詳細については、こちらをご覧ください: [EIP-2981：NFT Royally Standard ](https://eips.ethereum.org/EIPS/eip-2981)

### 🤟 Vercel に Web アプリケーションをデプロイする

最後に、[Vercel](https://vercel.com/) にWebアプリケーションをホストする方法を学びます。

Vercelはサーバーレス機能のホスティングを提供するクラウドプラットフォームです。

スケーリングやサーバーの監視はVercelが行うため、開発者はVercelへデプロイするだけでアプリケーションを公開・運用できます。

Vercelに関する詳しい説明は、[こちら](https://zenn.dev/lollipop_onl/articles/eoz-vercel-pricing-2020)をご覧ください。

まず、GitHubの`ETH-NFT-Maker`にローカルファイルをアップロードしていきます。

ターミナル上で`ETH-NFT-Maker`に移動して、下記を実行しましょう。

```
git add .
git commit -m "upload to github"
git push
```

次に、GitHub上の`ETH-NFT-Maker`に、ローカル環境に存在する`ETH-NFT-Maker`のファイルとディレクトリが反映されていることを確認してください。

Vercelのアカウントを取得したら、下記を実行しましょう。

1\. `Dashboard`へ進んで、`New Project`を選択してください。

![](/public/images/ETH-NFT-Maker/section-4/4_2_1.png)

2\. `Import Git Repository`で自分のGitHubアカウントを接続したら、`ETH-NFT-Maker`を選択し、`Import`してください。

![](/public/images/ETH-NFT-Maker/section-4/4_2_2.png)

3\. プロジェクトを作成します。`Root Directory`が「packages/client」となっていることを確認してください。

![](/public/images/ETH-NFT-Collection/section-4/4_2_9.png)

4\. `Deploy`ボタンを推しましょう。

VercelはGitHubと連動しているので、GitHubが更新されるたびに自動でデプロイを行ってくれます。

下記のように、`Building`ログが出力されます。

基本的に`warning`は無視して問題ありません。

![](/public/images/ETH-NFT-Maker/section-4/4_2_4.png)

[こちら](https://eth-nft-maker-client.vercel.app/)が完成版のURLです！

mintされた画像は[こちら](https://gemcase.vercel.app/view/evm/sepolia/0xe380122a59930a7ef893d2046cae208a11cf2931)で確認することができます。


### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#ethereum`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

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

4. Discordの`🔥｜completed-projects`チャンネルに、あなたのWebサイトをシェアしてください 😉🎉 Discordに投稿する際に、追加実装した機能とその概要も教えていただけると幸いです!

プロジェクトを完成させていただいた方には、NFTをお送りします。

### 🎉 おつかれさまでした!

あなたのオリジナルのNFT Collectionが完成しました。

あなたは、コントラクトをデプロイし、NFTがMintできるWebアプリケーションを立ち上げました。

これらは、分散型Webアプリケーションがより一般的になる社会の中で、世界を変える2つの重要なスキルです。

これからもweb3への旅をあなたが続けてくれることを願っています 🚀

---

Project Completion Formは[こちら](https://airtable.com/shrf1cCtTx0iQuszX)です。

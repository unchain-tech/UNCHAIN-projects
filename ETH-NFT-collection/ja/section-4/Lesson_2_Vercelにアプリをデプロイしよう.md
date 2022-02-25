🙉 Githubに 関する注意点
--------------------------------

**Githubにコントラクト（ `epic-nfts` ）のコードをアップロードする際は、秘密鍵を含むハードハット構成ファイルをリポジトリにアップロードしないよう注意しましょう。**

秘密鍵などのファイルを隠すために、ターミナルで `epic-nfts` に移動して、下記を実行してください。

```bash
npm install --save dotenv
```

`dotenv` モジュールに関する詳しい説明は、[こちら](https://maku77.github.io/nodejs/env/dotenv.html)を参照してください。

`dotenv` をインストールしたら、`.env` ファイルを更新します。

ファイルの先頭に `.` がついているファイルは、「不可視ファイル」です。

`.` がついているファイルやフォルダはその名の通り、見ることができないので、「隠しファイル」「隠しフォルダ」とも呼ばれます。

操作されては困るファイルについては、このように「不可視」の属性を持たせて、一般の人が触れられないようにします。

ターミナル上で `epic-nfts` ディレクトリにいることを確認し、下記を実行しましょう。VS Code から `.env` ファイルを開きます。
```
code .env
```
そして、`.env` ファイルを下記のように更新します。

```
PRIVATE_KEY = hardhad.config.jsにある秘密鍵（accounts）を貼り付ける
STAGING_ALCHEMY_KEY = hardhad.config.js内にあるAlchemyのyURLを貼り付ける
PROD_ALCHEMY_KEY = メインネットにデプロイする際に使用するAlchemyのURLを貼り付ける（今は何も貼り付ける必要はありません）
```

私の `.env` は、下記のようになります。

```javascript
PRIVATE_KEY = 0x...
STAGING_ALCHEMY_KEY = https://...
PROD_ALCHEMY_KEY = ""
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
    mainnet: {
      chainId: 1,
      url: process.env.PROD_ALCHEMY_KEY,
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

これで、Github にあなたの秘密鍵をアップロードせずに、Github にコントラクトのコードをアップロードすることができます。

🌎 IPFS について
--------------------------------

[IPFS](https://docs.ipfs.io/concepts/what-is-ipfs/) は誰にも所有されていない分散型データストレージシステムです。

たとえば、動画の NFT をあなたが発行したいと考えたとしましょう。
オンチェーンでそのデータを保存すると、ガス代が非常に高くなります。

このような場合、IPFS が役に立ちます。

[Pinata](https://www.pinata.cloud/) というサービスを使用すると、簡単に画像や動画を NFT にできます。

- NFTは、いくつかのメタデータにリンクする単なるJSONファイルであることを思い出してください💡

- このJSONファイルを IPFS に配置できます。。

**NFT データを保存する一般的な方法として、多くの人が IPSF を利用しています。**

📝 Etherscan を使ってコントラクトを verify（検証）する
------------------

Etherscan の **コントラクトの Verification（検証）** を行いましょう。

この機能を使えば、あなたの Solidity プログラムを世界中の人に公開することができます。

また、あなたも他の人の書いたコードを読むことができます。

まず、Etherscan のアカウントを取得して、`apiKey` を取得しましょう。

アカウントをまだお持ちでない場合は、[https://etherscan.io/register](https://etherscan.io/register) にアクセスして、無料のユーザーアカウントを作成してください。

アカウントが作成できたら、`My Profile` 画面に移動してください。

![](/public/images/ETH-NFT-collection/section-4/4_2_1.png)

`API Keys` タブを選択し、`+ Add` ボタンを押したら、`Create API Key` のポップアップが表示されるので、あなたの API に任意の名前をつけましょう。

![](/public/images/ETH-NFT-collection/section-4/4_2_2.png)

次に、あなたが作成した API の横の `Edit` ボタンを選択してください。ポップアップが表示されるので、`apiKey` を取得しましょう。

![](/public/images/ETH-NFT-collection/section-4/4_2_3.png)

次に、ターミナルで `epic-nfts` ディレクトリに移動して、次のコマンドを実行してください。 Etherscan で verification を行うために必要なツールをインストールします。

```bash
npm install @nomiclabs/hardhat-etherscan
```

そして、`epic-nfts/hardhat.config.js` を編集していきます。

先ほど Etherscan から取得した `apiKey` を `Your_Etherscan_apiKey` に貼り付けてください。

`require("@nomiclabs/hardhat-etherscan");` を含むのも忘れないようにしましょう。

```javascript
// hardhat.config.js

require("@nomiclabs/hardhat-etherscan");

module.exports = {
solidity: '0.8.4',
etherscan: {
apiKey: "Your_Etherscan_apiKey",
},
networks: {
	rinkeby: {
	url: 'Your_Alchemy_API_Key',
	accounts: ['Your_Private_Key'],
	},
},
};
```

最後に、下記を実行して、あなたのコントラクトを verify = 世界に公開してみましょう。

```
npx hardhat clean
npx hardhat verify YOUR_CONTRACT_ADDRESS --network rinkeby
```

[ここ](https://rinkeby.etherscan.io/address/0x902ebbecafc54f7a8013a9d7954e7355309b50e6#code) は、承認済みのコントラクトがどのように表示されるかの一例です。

Etherscanで **Contract** タブを選択すると、下図のような `0x608060405234801 ...` で始まる長いテキストのリストが表示されます。

![画像](https://user-images.githubusercontent.com/60590919/139609052-f4bba83c-f224-44b1-be74-de8eaf31b403.png)

実は、このテキストのリストは、デプロイされたコントラクトのバイトコードです。
- バイトコードに関する詳しい説明は、[こちら](https://e-words.jp/w/%E3%83%90%E3%82%A4%E3%83%88%E3%82%B3%E3%83%BC%E3%83%89.html) をご覧ください。

バイトコードは、私たち人間には読めません。

幸いなことに、Etherscan には、実際のコードを直接表示する機能があります。

契約のソースコードを**確認して公開**するように求めるプロンプトが表示されることに注意してください。リンクをたどる場合は、契約設定を手動で選択し、コードを貼り付けてソースコードを公開する必要があります。

幸いなことに、hardhatはこれを行うためのよりスマートな方法を提供します。

ハードハットプロジェクトに戻り、次のコマンドを実行して`@nomiclabs/hardhat-etherscan` をインストールします。

```
npm i -D @nomiclabs/hardhat-etherscan
```

次に、`hardhat.config.js` に以下を追加します。

```javascript
require("@nomiclabs/hardhat-etherscan");
// Rest of code
...
module.exports = {
  solidity: "0.8.0",
  // Rest of the config
  ...,
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "こちらにAPI KEYを埋め込みます",
  }
};
```

`etherscan` オブジェクトに `apiKey` を埋め込むため、Etherscan のアカウントを取得しましょう。

アカウントをまだお持ちでない場合は、[https://etherscan.io/register](https://etherscan.io/register) にアクセスして、無料のユーザーアカウントを作成してください。

その後、プロファイル設定に移動し、 [APIキー]の下に新しいAPIキーを作成しましょう。

API の名前を設定

![](/public/images/ETH-NFT-collection/section-4/4_2_4.png)

`Edit` を選択し、`apiKey` を取得します。

![](/public/images/ETH-NFT-collection/section-4/4_2_5.png)

API キーが取得できたら、`hardhat.config.js` ファイルに戻り、 `apiKey` プロパティを新しく生成されたキーに変更します。

**注：EtherscanAPI キーを他のユーザーと共有しないでください**

私たちは約束する最後のステップに向かっています。今残っているのはコマンドを実行することだけです

```
npx hardhat verify YOUR_CONTRACT_ADDRESS --network rinkeby
```

下記のような結果が表示されれば、verification は成功です。

```
Successfully submitted source code for contract
contracts/MyEpicNFT.sol:MyEpicNFT at 0xB3340071dc206d09170a7269331155ff1BeE64de
for verification on the block explorer. Waiting for verification result...

Successfully verified contract MyEpicNFT on Etherscan.
https://rinkeby.etherscan.io/address/0xB3340071dc206d09170a7269331155ff1BeE64de#code
```

出力された URLリンク をブラウザに貼り付け、中身を確認してみましょう。

わたしの [URLリンク](https://rinkeby.etherscan.io/address/0xB3340071dc206d09170a7269331155ff1BeE64de#code) の中身は下記のように表示されます。

![](/public/images/ETH-NFT-collection/section-4/4_2_6.png)

これで、あなたのスマートコントラクトが世界中の誰でも見れるようになりました🚀

🔮 プロジェクトを拡張する
---------

このプロジェクトで学んだことは、web3 への旅の始まりに過ぎません。

NFT とスマートコントラクトでできることはたくさんあります。

あなたのプロジェクトに拡張性を与えるインサイトをいくつか共有します。

**🧞‍♂️: NFTを販売する**

- NFT をユーザーが Mint する際に、あなたに ETH を支払う仕組みを実装しましょう。

- コントラクトに `payable` を追加したり、`require` を使用すれば、ユーザーが NFT を購入する際の最小金額を設定することができます。

**🍁: ロイヤリティを追加する**

- スマートコントラクトにロイヤリティを追加して、NFT が転売されるごとに、あなたに、一定の資金が振り込まれる仕組みを作りましょう。

- 詳細については、こちらをご覧ください: [EIP-2981：NFT Royaly Standard ](https://eips.ethereum.org/EIPS/eip-2981/)


🤟 Vercel に WEBアプリをデプロイする
---

最後に、[Vercel](https://vercel.com/) にWEBアプリをホストする方法を学びます。

Vercel はサーバレス機能のホスティングを提供するクラウドプラットフォームです。

スケーリングやサーバーの監視は Vercel が行うため、開発者は Vercel へデプロイするだけでアプリケーションを公開・運用できます。

Vercel に関しする詳しい説明は、[こちら](https://zenn.dev/lollipop_onl/articles/eoz-vercel-pricing-2020)をご覧ください。

まず、Github の `nft-collection-starter-project` にローカルファイルをアップロードしていきます。

ターミナル上で `nft-collection-starter-project` に移動して、下記を実行しましょう。

```
git add .
git commit -m "upload to github"
git push
```

次に、Github上の `nft-collection-starter-project` に、ローカル環境に存在する `nft-collection-starter-project` のファイルとディレクトリが反映されていることを確認してください。

Vercel のアカウントを取得したら、下記を実行しましょう。

1\. `Dashboard` へ進んで、`New Project` を選択してください。

![](/public/images/ETH-NFT-collection/section-4/4_2_7.png)

2\. `Import Git Repository` で自分のGithubアカウントを接続したら、`nft-collection-starter-project` を選択し、`Import` してください。

![](/public/images/ETH-NFT-collection/section-4/4_2_8.png)

3\. プロジェクトを作成します。Environment Variable に下記を追加します。

`NAME`＝`CI`、`VALUE`＝`false`（下図参照）

![](/public/images/ETH-NFT-collection/section-4/4_2_9.png)

4\. `Deploy`ボタンを推しましょう。

VercelはGithubと連動しているので、Githubが更新されるたびに自動でデプロイを行ってくれます。

下記のように、`Building` ログが出力されます。

基本的に `warning` は無視して問題ありません。

![](/public/images/ETH-NFT-collection/section-4/4_2_10.png)

こちらが、今回のプロジェクトで作成されるWEBアプリのデモです。

https://nft-minter-jl0e7c9yw-yukis4san.vercel.app/


🙋‍♂️ 質問する
-------------------------------------------
ここまでの作業で何かわからないことがある場合は、Discordの `#section-4-help` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください✨
```
1. 何をしようとしていたか
2. エラー文をコピー&ペースト
3. エラー画面のスクリーンショット
```

🎉 おつかれさまでした！
--------------------------------

あなたのオリジナルの NFT Collection が完成しました。

あなたは、コントラクトをデプロイし、NFT が Mint できるWEBアプリを立ち上げました。

これらは、分散型WEBアプリがより一般的になる社会の中で、世界を変える2つの重要なスキルです。

これからもweb3への旅をあなたが続けてくれることを願っています🚀

🎫 NFTを取得しよう！
----

NFT を取得する条件は、以下のようになります。

1. MVP の機能がすべて実装されている（実装 OK）

2. WEBアプリで MVP の機能が問題なく実行される（テスト OK）

Discord の `🔥｜post-your-project` チャンネルに、あなたのWEBサイトをぜひシェアしてください😉🎉

プロジェクトを完成させていただいた方には、NFT をお送りします。
※ 現在準備中なので、今しばらくお待ちください！

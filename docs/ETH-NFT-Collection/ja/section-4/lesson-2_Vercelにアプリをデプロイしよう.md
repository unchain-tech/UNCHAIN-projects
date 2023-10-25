### 🙉 GitHub に 関する注意点

**GitHub にコントラクト( `packages/contract/`)のコードをアップロードする際は、秘密鍵を含むハードハット構成ファイルをリポジトリにアップロードしないよう注意しましょう。**

秘密鍵などのファイルを隠すために、ターミナルで`packages/contract`ディレクトリに移動して、下記を実行してください。

```
yarn add --dev dotenv
```

`dotenv`モジュールに関する詳しい説明は、[こちら](https://maku77.github.io/nodejs/env/dotenv.html)を参照してください。

`dotenv`をインストールしたら、`.env`ファイルを作成します。

ファイルの先頭に`.`がついているファイルは、「不可視ファイル」です。

`.`がついているファイルやフォルダはその名の通り、見ることができないので、「隠しファイル」「隠しフォルダ」とも呼ばれます。

操作されては困るファイルについては、このように「不可視」の属性を持たせて、一般の人が触れられないようにします。

`packages/contract`ディレクトリ直下に、`.env`ファイルを作成します。

```diff
packages/
 └── contract/
+    └── .env
```

そして、`.env`ファイルを下記のように更新します。

```
PRIVATE_KEY = hardhat.config.jsにある秘密鍵（accounts）を貼り付ける
STAGING_ALCHEMY_KEY = hardhat.config.js内にあるAlchemyのyURLを貼り付ける
PROD_ALCHEMY_KEY = イーサリアムメインネットにデプロイする際に使用するAlchemyのURLを貼り付ける（今は何も貼り付ける必要はありません）
```

私の`.env`は、下記のようになります。

```javascript
// .env
PRIVATE_KEY = 0x...
STAGING_ALCHEMY_KEY = https://...
```

`.env`を更新したら、 `hardhat.config.js`ファイルを次のように更新してください。

```javascript
// hardhat.config.js
require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

const { STAGING_ALCHEMY_KEY, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: '0.8.18',
  defaultNetwork: 'hardhat',
  networks: {
    sepolia: {
      url: STAGING_ALCHEMY_KEY || '',
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
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

### 🌎 IPFS について

[IPFS](https://docs.ipfs.io/concepts/what-is-ipfs/) は誰にも所有されていない分散型データストレージシステムです。

たとえば、動画のNFTをあなたが発行したいと考えたとしましょう。
オンチェーンでそのデータを保存すると、ガス代が非常に高くなります。

このような場合、IPFSが役に立ちます。

[Pinata](https://www.pinata.cloud/) というサービスを使用すると、簡単に画像や動画をNFTにできます。

- NFTは、いくつかのメタデータにリンクする単なるJSONファイルであることを思い出してください 💡

- このJSONファイルをIPFSに配置できます。

**NFT データを保存する一般的な方法として、多くの人が IPFS を利用しています。**

### 📝 Etherscan を使ってコントラクトを verify（検証）する

Etherscanの **コントラクトの Verification（検証）** を行いましょう。

この機能を使えば、あなたのSolidityプログラムを世界中の人に公開できます。

また、あなたもほかの人の書いたコードを読むことができます。

まず、Etherscanのアカウントを取得して、`apiKey`を取得しましょう。

アカウントをまだお持ちでない場合は、[https://etherscan.io/register](https://etherscan.io/register) にアクセスして、無料のユーザーアカウントを作成してください。

アカウントが作成できたら、`My Profile`画面に移動してください。

![](/public/images/ETH-NFT-Collection/section-4/4_2_1.png)

`API Keys`タブを選択し、`+ Add`ボタンを押したら、`Create API Key`のポップアップが表示されるので、あなたのAPIに任意の名前をつけましょう。

![](/public/images/ETH-NFT-Collection/section-4/4_2_2.png)

次に、あなたが作成したAPIの横の`Edit`ボタンを選択してください。ポップアップが表示されるので、`apiKey`を取得しましょう。

![](/public/images/ETH-NFT-Collection/section-4/4_2_3.png)

⚠️：Ethereum API keyは誰にも教えてはいけません!

まず、`.env`ファイルを開き、先ほどEtherscanから取得した`apiKey`を`Your_Etherscan_apiKey`に貼り付けてください。

```javascript
// .env
PRIVATE_KEY = 0x...
STAGING_ALCHEMY_KEY = https://...
ETHERSCAN_API_KEY = Your_Etherscan_apiKey
```

そして、`packages/contract/hardhat.config.js`を編集していきます。


`require("@nomiclabs/hardhat-etherscan");`を含むのも忘れないようにしましょう。Etherscanでverificationを行うために必要なパッケージです（こちらはスタータープロジェクトに含まれており、既にインストール済みです）。

```javascript
// hardhat.config.js
require('@nomiclabs/hardhat-etherscan');
require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

const { ETHERSCAN_API_KEY, STAGING_ALCHEMY_KEY, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: '0.8.18',
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  defaultNetwork: 'hardhat',
  networks: {
    sepolia: {
      url: STAGING_ALCHEMY_KEY || '',
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
};
```
最後に、下記を実行して、あなたのコントラクトをverifyして、世界に公開してみましょう。

```
npx hardhat clean
npx hardhat verify YOUR_CONTRACT_ADDRESS --network sepolia
```

下記のような結果が表示されれば、verificationは成功です。

```
Successfully submitted source code for contract
contracts/MyEpicNFT.sol:MyEpicNFT at 0xB3340071dc206d09170a7269331155ff1BeE64de
for verification on the block explorer. Waiting for verification result...

Successfully verified contract MyEpicNFT on Etherscan.
https://sepolia.etherscan.io/address/0xF7d8473eF4555B158689Ae8F3c1b39c246A1244E#code
```

出力されたURLリンクをブラウザに貼り付け、中身を確認してみましょう。

私の [URL リンク](https://sepolia.etherscan.io/address/0xF7d8473eF4555B158689Ae8F3c1b39c246A1244E#code) の中身は下記のように表示されます。

![](/public/images/ETH-NFT-Collection/section-4/4_2_6.png)

Etherscanで **Contract** タブを選択すると、下図のような`0x608060405234801 ...`で始まる長いテキストのリストが表示されます。

![](/public/images/ETH-NFT-Collection/section-4/4_2_12.png)

実は、このテキストのリストは、デプロイされたコントラクトのバイトコードです。

- バイトコードに関する詳しい説明は、[こちら](https://e-words.jp/w/%E3%83%90%E3%82%A4%E3%83%88%E3%82%B3%E3%83%BC%E3%83%89.html) をご覧ください。

`Read Contract`と`Write Contract`の2つのサブタブが追加されたことを確認してださい。これらの機能を使えば、コントラクトをオンチェーンで簡単に操作できます。フロントエンドがなくても、コントラクトから直接関数を呼び出せるので、便利ですね 😊

![](/public/images/ETH-NFT-Collection/section-4/4_2_11.png)

おめでとうございます!　これで、あなたのスマートコントラクトが世界中の誰でも見られるようになりました 🚀

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

まずは、ローカル環境に存在する`ETH-NFT-Collection`をGitHub上へアップロードしましょう。

⚠️ `packages/contract/.gitignore/ファイル内に.envが記載されていることを再度確認してください。

最初に、GitHub上に新しくリポジトリを作成しましょう。

1. 右上のドロップダウンメニューから、「New repository」をクリック
2. `Repository name`を設定（ここでは作成したプロジェクトと同じ名前`ETH-NFT-Collection`を設定しています）
3. 「Create repository」をクリック

![](/public/images/ETH-NFT-Collection/section-4/4_2_13.png)

作成されたリポジトリのURLをコピーします。ここでは、`SSH`を選択しています。

![](/public/images/ETH-NFT-Collection/section-4/4_2_14.png)

次に、ターミナル上で`ETH-NFT-Collection`ディレクトリにいることを確認し、以下のコマンドを実行します。

スタータープロジェクト内の`.git`ディレクトリを削除します。

```
rm -rf packages/client/.git
```

ローカル環境の`ETH-NFT-Collection`ディレクトリと、GitHubのリポジトリを紐づけてコードをアップロードします。

```
git init
git add .
git commit -m "upload to github"
git remote add origin <コピーしたGitHubリポジトリのURL>
git push origin main
```

GitHub上の`ETH-NFT-Collection`にファイルが反映されていることを確認してください。

それでは、Vercelの操作を行います。Vercelのアカウントを取得したら、下記を実行しましょう。

1\. `Dashboard`へ進んで、`New Project`を選択してください。

![](/public/images/ETH-NFT-Collection/section-4/4_2_7.png)

2\. `Import Git Repository`で自分のGitHubアカウントを接続したら、`ETH-NFT-Collection`を選択し、`Import`してください。

![](/public/images/ETH-NFT-Collection/section-4/4_2_8.png)

3\. プロジェクトを作成します。`Root Directory`が「packages/client」となっていることを確認してください。

![](/public/images/ETH-NFT-Collection/section-4/4_2_9.png)

4\. `Deploy`ボタンを推しましょう。

VercelはGitHubと連動しているので、GitHubが更新されるたびに自動でデプロイを行ってくれます。

下記のように、`Building`ログが出力されます。

基本的に`warning`は無視して問題ありません。

![](/public/images/ETH-NFT-Collection/section-4/4_2_10.png)

こちらが、今回のプロジェクトで作成されるWebアプリケーションのデモです。

https://nft-minter-jl0e7c9yw-yukis4san.vercel.app/

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

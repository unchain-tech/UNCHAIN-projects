🎨 UIを完成させる
--------------------------------------

今回のプロジェクトでは、あなたは下記を達成しました🎉

**1 \. `WavePortal` コントラクトを作成して、ローカル環境でイーサリアムネットワークにデプロイする**

- Solidity でコントラクトを書く
- コントラクトをローカルでコンパイルして実行する
- コントラクトにデータを保存する
- ローカル環境にWEBアプリを展開して、構築を行う

**2 \. ユーザーのウォレットをWEBアプリから接続して、コントラクトと通信するweb3アプリを作成する**

- Metamask を設定する
- コントラクトを実際の Rinkeby Test Network にデプロイする
- ウォレットをWEBアプリに接続する
- WEBアプリからデプロイされたコントラクトを呼び出す

**3 \. WEBアプリからユーザーにETHを送る**
- コントラクトに送金機能を実装する
- WEBアプリからユーザーにランダムで ETH を送る

最後に、UI を完成させましょう。

CSS や文章を変更したり、画像や動画を自分のWEBアプリに乗せてみてください😊🎨

🔍 トランザクションの検証を行う
---------------------------

ユーザーに ETH が送金されたか確認するために、`App.js` に下記2つのコードを追加してみましょう。

**1 \. コントラクトのバランスを取得**

まず、`App.js` の中にある下記のコードを確認します。
```javascript
// App.js
console.log("Retrieved total wave count...", count.toNumber());
```

このコードの直下に下記を追加しましょう。

```javascript
// App.js
let contractBalance = await provider.getBalance(
	wavePortalContract.address
);
console.log(
	"Contract balance:",
	ethers.utils.formatEther(contractBalance)
);
```

これにより、コントラクトの現在の資金額が `Console` に出力されます。

**2 \. ユーザーがETHを獲得したか検証**


次に、`App.js` の中にある下記のコードを確認します。

```javascript
// App.js
console.log("Retrieved total wave count...", count.toNumber());
```
このコードの直下に下記を追加しましょう。

```javascript
// App.js
let contractBalance_post = await provider.getBalance(wavePortalContract.address);
/* 契約の残高が減っていることを確認 */
if (contractBalance_post < contractBalance){
	 /* 減っていたら下記を出力 */
	console.log("User won ETH!");
} else {
	console.log("User didn't win ETH.");
}
console.log(
	"Contract balance after wave:",
	ethers.utils.formatEther(contractBalance_post)
);
```
ユーザーに ETH が送金されたか確認するために、ローカル環境でWEBアプリを開いて `wave` を送ってみましょう。

WEBアプリを `Inspect` して、下記のような結果が `Console` に出力されているか確認しましょう。

![](/public/images/ETH-dApp/section-4/4_2_1.png)

ここでは、ユーザーが ETH を獲得したこと、コントラクトの資金が `0.000996` から `0.000995` に減少したことがわかります。

さらに詳しくトランザクションについて検証する場合は、[Rinkeby Etherscan](https://rinkeby.etherscan.io/) を使用することをおすすめします。

Rinkeby Etherscan にコントラクトのアドレスを貼り付けて、発生したトランザクションを表示することができます。

それでは、上記で実行した最新のトランザクションを見ていきましょう。

下図のように、確認したい `Txn Hash` を選択します。
![](/public/images/ETH-dApp/section-4/4_2_2.png)

トランザクションの情報が、確認できます。
![](/public/images/ETH-dApp/section-4/4_2_3.png)
枠で囲った部分に、先程のトランザクションの結果が表示されています。

少額の ETH をコントラクトアドレスからユーザーアドレスに転送したことがわかります。

🌍 サーバーにホストしてみよう
--------------------------------

最後に、[Vercel](https://vercel.com/) にWEBアプリをホストする方法を学びます。

Vercel はサーバレス機能のホスティングを提供するクラウドプラットフォームです。

スケーリングやサーバーの監視は Vercel が行うため、開発者は Vercel へデプロイするだけでアプリケーションを公開・運用できます。

Vercel に関しする詳しい説明は、[こちら](https://zenn.dev/lollipop_onl/articles/eoz-vercel-pricing-2020)をご覧ください。

まず、Github の `dApp-starter-project` にローカルファイルをアップロードしていきます。

ターミナル上で `dApp-starter-project` に移動して、下記を実行しましょう。

```
git add .
git commit -m "upload to github"
git push
```

次に、Github上の `dApp-starter-project` に ローカル環境に存在する`dApp-starter-project` のファイルとディレクトリが反映されていることを確認してください。

Vercel のアカウントを取得したら、下記を実行しましょう。

1\. `Dashboard` へ進んで、`New Project` を選択してください。

![](/public/images/ETH-dApp/section-4/4_2_4.png)

2\. `Import Git Repository` で自分のGithubアカウントを接続したら、`dApp-starter-project` を選択し、`Import` してください。

![](/public/images/ETH-dApp/section-4/4_2_5.png)

3\. プロジェクトを作成します。

`Environment Variable` に下記を追加します。

- `NAME`＝`CI`
- `VALUE`＝`false`（下図参照）

![](/public/images/ETH-dApp/section-4/4_2_6.png)

4\. `Deploy`ボタンを推しましょう。

VercelはGithubと連動しているので、Githubが更新されるたびに自動でデプロイを行ってくれます。

下記のように、`Building` ログが出力されます。
基本的に `warning` は無視して問題ありません。

![](/public/images/ETH-dApp/section-4/4_2_7.png)

こちらが、今回のプロジェクトで作成されるWEBアプリのデモは、[こちら](https://my-wave-portal2-nine.vercel.app/) です。

これは MVP（=最小機能のついたプロダクト）です。

ぜひ CSS を駆使して、あなたのアプリを魅力的なものにしてください🪄

🙉 githubに関するメモ
--------------------------------

**Githubにコントラクト（ `my-wave-portal` ）のコードをアップロードする際は、秘密鍵を含むハードハット構成ファイルをリポジトリにアップロードしないよう注意しましょう**

秘密鍵などのファイルを隠すために、ターミナルで `my-wave-portal` に移動して、下記を実行してください。

```bash
npm install --save dotenv
```

`dotenv` モジュールに関する詳しい説明は、[こちら](https://maku77.github.io/nodejs/env/dotenv.html)を参照してください。

`dotenv` をインストールしたら、`.env` ファイルを更新します。

ファイルの先頭に `.` がついているファイルは、「不可視ファイル」です。

`.` がついているファイルやフォルダはその名の通り、見ることができないので、「隠しファイル」「隠しフォルダ」とも呼ばれます。

操作されては困るファイルについては、このように「不可視」の属性を持たせて、一般の人が触れられないようにします。

ターミナル上で `my-wave-portal` ディレクトリにいることを確認し、下記を実行しましょう。VS Code から `.env` ファイルを開きます。

```
code .env
```

そして、`.env` ファイルを下記のように更新します。

```
PRIVATE_KEY = hardhad.config.jsにある秘密鍵（accounts）を貼り付ける
STAGING_ALCHEMY_KEY = hardhad.config.jsにあるAlchemyのyURLを貼り付ける
PROD_ALCHEMY_KEY = メインネットにデプロイする際に使用するAlchemyのURLを貼り付ける（今は何も貼り付ける必要はありません）
```

`.env` を更新したら、 `hardhat.config.js` ファイルを次のように更新してください。

```javascript
// hardhat.config.js
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: "0.8.0",
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

あなたのオリジナルの dApp が完成しました。

あなたは、コントラクトをデプロイし、コントラクトと通信するWEBアプリを立ち上げました。

これらは、分散型WEBアプリがより一般的になる社会の中で、世界を変える2つの重要なスキルです。

UI のデザインや機能をアップグレードしたら、ぜひコミュニティにシェアしてください！😊

これからもweb3への旅をあなたが続けてくれることを願っています🚀


🎫 NFTを取得しよう！
----

NFT を取得する条件は、以下のようになります。

1. MVP の機能がすべて実装されている（実装 OK）

2. WEBアプリで MVP の機能が問題なく実行される（テスト OK）

Discord の `🔥｜post-your-project` チャンネルに、あなたのWEBサイトをぜひシェアしてください😉🎉

プロジェクトを完成させていただいた方には、NFT をお送りします。
※ 現在準備中なので、今しばらくお待ちください！

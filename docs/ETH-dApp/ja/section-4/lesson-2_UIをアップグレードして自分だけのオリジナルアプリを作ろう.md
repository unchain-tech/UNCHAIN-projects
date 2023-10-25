### 🎨 UI を完成させる

今回のプロジェクトでは、あなたは下記を達成しました 🎉

**1 \. `WavePortal`コントラクトを作成して、ローカル環境でイーサリアムネットワークにデプロイする**

- Solidityでコントラクトを書く
- コントラクトをローカルでコンパイルして実行する
- コントラクトにデータを保存する
- ローカル環境にWebアプリケーションを展開して、構築を行う

**2 \. ユーザーのウォレットを Web アプリケーションから接続して、コントラクトと通信する web3 アプリケーションを作成する**

- MetaMaskを設定する
- コントラクトを実際のSepolia Test Networkにデプロイする
- ウォレットをWebアプリケーションに接続する
- Webアプリケーションからデプロイされたコントラクトを呼び出す

**3 \. Web アプリケーションからユーザーに ETH を送る**

- コントラクトに送金機能を実装する
- WebアプリケーションからユーザーにランダムでETHを送る

最後に、UIを完成させましょう。

CSSや文章を変更したり、画像や動画を自分のWebアプリケーションに乗せてみてください 😊🎨

### 🔍 トランザクションの検証を行う

ユーザーにETHが送金されたか確認するために、`App.js`に下記2つのコードを追加してみましょう。

**1 \. コントラクトの残高を取得**

まず、`App.js`の中にある下記のコードを確認します。

```javascript
/* ABIを参照 */
const wavePortalContract = new ethers.Contract(
  contractAddress,
  contractABI,
  signer
);
let count = await wavePortalContract.getTotalWaves();
console.log('Retrieved total wave count...', count.toNumber());
```

このコードの直下に下記を追加しましょう。

```javascript
const contractBalance = await provider.getBalance(wavePortalContract.address);
console.log('Contract balance:', ethers.utils.formatEther(contractBalance));
```

これにより、コントラクトの現在の資金額がConsoleに出力されます。

**2 \. ユーザーが ETH を獲得したか検証**

次に、`App.js`の中にある下記のコードを確認します。

```javascript
/* コントラクトに👋（wave）を書き込む */
const waveTxn = await wavePortalContract.wave(messageValue, {
  gasLimit: 300000,
});
console.log('Mining...', waveTxn.hash);
await waveTxn.wait();
console.log('Mined -- ', waveTxn.hash);
count = await wavePortalContract.getTotalWaves();
console.log('Retrieved total wave count...', count.toNumber());
```

このコードの直下に下記を追加しましょう。

```javascript
const contractBalancePost = await provider.getBalance(
  wavePortalContract.address
);
/* コントラクトの残高が減っていることを確認 */
if (contractBalancePost.lt(contractBalance)) {
  /* 減っていたら下記を出力 */
  console.log('User won ETH!');
} else {
  console.log("User didn't win ETH.");
}
console.log(
  'Contract balance after wave:',
  ethers.utils.formatEther(contractBalancePost)
);
```

ユーザーにETHが送金されたか確認するために、ローカル環境でWebアプリケーションを開いて`wave`を送ってみましょう。

Webアプリケーションを`Inspect`して、下記のような結果がConsoleに出力されているか確認しましょう。

![](/public/images/ETH-dApp/section-4/4_2_1.png)

ここでは、ユーザーがETHを獲得したこと、コントラクトの資金が`0.000996`から`0.000995`に減少したことがわかります。

さらに詳しくトランザクションについて検証する場合は、[Sepolia Etherscan](https://sepolia.etherscan.io/) を使用することをお勧めします。

Sepolia Etherscanにコントラクトのアドレスを貼り付けて、発生したトランザクションを表示できます。

それでは、上記で実行した最新のトランザクションを見ていきましょう。

下図のように、確認したい`Txn Hash`を選択します。
![](/public/images/ETH-dApp/section-4/4_2_2.png)

トランザクションの情報が、確認できます。
![](/public/images/ETH-dApp/section-4/4_2_3.png)
枠で囲った部分に、先程のトランザクションの結果が表示されています。

少額のETHをコントラクトアドレスからユーザーアドレスに転送したことがわかります。

### 🌍 サーバーにホストしてみよう

最後に、[Vercel](https://vercel.com/) にWebアプリケーションをホストする方法を学びます。

Vercelはサーバーレス機能のホスティングを提供するクラウドプラットフォームです。

スケーリングやサーバーの監視はVercelが行うため、開発者はVercelへデプロイするだけでアプリケーションを公開・運用できます。

Vercelに関する詳しい説明は、[こちら](https://zenn.dev/lollipop_onl/articles/eoz-vercel-pricing-2020)をご覧ください。

まず、GitHubの`ETH-dApp`にローカルファイルをアップロードしていきます。

ターミナル上で`ETH-dApp`に移動して、下記を実行しましょう。

```
git add .
git commit -m "upload to github"
git push
```

次に、GitHub上の`ETH-dApp`にローカル環境に存在する`ETH-dApp`のファイルとディレクトリが反映されていることを確認してください。

Vercelのアカウントを取得したら、下記を実行しましょう。

1\. `Dashboard`へ進んで、`New Project`を選択してください。

![](/public/images/ETH-dApp/section-4/4_2_4.png)

2\. `Import Git Repository`で自分のGitHubアカウントを接続したら、`ETH-dApp`を選択し、`Import`してください。

![](/public/images/ETH-dApp/section-4/4_2_5.png)

3\. プロジェクトを作成します。`Root Directory`が「packages/client」となっていることを確認してください。

![](/public/images/ETH-dApp/section-4/4_2_6.png)

4\. `Deploy`ボタンを推しましょう。

VercelはGitHubと連動しているので、GitHubが更新されるたびに自動でデプロイを行ってくれます。

下記のように、`Building`ログが出力されます。
基本的に`warning`は無視して問題ありません。

![](/public/images/ETH-dApp/section-4/4_2_7.png)

こちらが、今回のプロジェクトで作成されるWebアプリケーションのデモは、[こちら](https://eth-dapp-three.vercel.app/) です。

これはMVP（=最小機能のついたプロダクト）です。

ぜひCSSを駆使して、あなたのアプリケーションを魅力的なものにしてください 🪄

### 🙉 GitHub に関するメモ

**GitHub にコントラクト( `contract`)のコードをアップロードする際は、秘密鍵を含むハードハット構成ファイルをリポジトリにアップロードしないよう注意しましょう**

秘密鍵などのファイルを隠すために、ターミナルで`ETH-dApp`にいることを確認して、下記を実行してください。

```
yarn workspace contract add --dev dotenv
```

`dotenv`モジュールに関する詳しい説明は、[こちら](https://maku77.github.io/nodejs/env/dotenv.html)を参照してください。

`dotenv`をインストールしたら、`packages/contract`ディレクトリ内に`.env`ファイルを更新します。

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
STAGING_ALCHEMY_KEY = hardhat.config.jsにあるAlchemyのURLを貼り付ける
PROD_ALCHEMY_KEY = メインネットにデプロイする際に使用するAlchemyのURLを貼り付ける（今は何も貼り付ける必要はありません）
```

`.env`を更新したら、 `hardhat.config.js`ファイルを次のように更新してください。

```javascript
require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

module.exports = {
  solidity: '0.8.19',
  networks: {
    sepolia: {
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

最後に`.gitignore`に`.env`が含まれていることを確認してください!

これで、GitHubにあなたの秘密鍵をアップロードせずに、GitHubにコントラクトのコードをアップロードできます。

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

あなたのオリジナルのdAppが完成しました。

あなたは、コントラクトをデプロイし、コントラクトと通信するWebアプリケーションを立ち上げました。

これらは、分散型Webアプリケーションがより一般的になる社会の中で、世界を変える2つの重要なスキルです。

UIのデザインや機能をアップグレードしたら、ぜひコミュニティにシェアしてください!　 😊

これからもweb3への旅をあなたが続けてくれることを願っています 🚀

---

Project Completion Formは[こちら](https://airtable.com/shrf1cCtTx0iQuszX)です。

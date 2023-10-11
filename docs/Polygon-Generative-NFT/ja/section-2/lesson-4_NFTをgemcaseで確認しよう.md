### 🐝 gemcase で NFT を確認する

コントラクトのアドレス(`Contract deployed to`に続く`0x..`)をターミナルからコピーします。

次に、[gemcase(NFTを閲覧できるサービス)](https://gemcase.vercel.app/) に先ほどコピーしたコントラクトアドレスを含めた必要な情報を下のように打ち込んでいきます。

![](/public/images/Polygon-Generative-NFT/section-2/2_4_7.png)

そして`View`ボタンをクリックするとコレクションの詳細が表示されます。

私のコレクションはこのような形で表示されます。

![](/public/images/Polygon-Generative-NFT/section-2/2_4_8.png)

下にスクロールすると他のコレクションが見れるので`View`ボタンをクリックしてみましょう。

![](/public/images/Polygon-Generative-NFT/section-2/2_4_9.png)

`deploy.js`で、10個のNFTを自分用にキープしてから、3個NFTをMintしました。

したがって、表示できるNFTコレクションは、13個となっているはずです。

### 📝 Etherscan を使ってコントラクトを verify（検証）する

最後に、Etherscanで **コントラクトの Verification（検証）** を行いましょう。

この機能を使えば、あなたのSolidityプログラムを世界中の人に公開できます。

また、あなたもほかの人の書いたコードを読むことができます。

まず、Etherscanのアカウントを取得して、API Keyを取得しましょう。

アカウントをまだお持ちでない場合は、[https://etherscan.io/register](https://etherscan.io/register) にアクセスして、無料のユーザーアカウントを作成してください。

アカウントが作成できたら、`My Profile`画面に移動してください。

![](/public/images/Polygon-Generative-NFT/section-2/2_4_2.png)

`API Keys`タブを選択し、`+ Add`ボタンを押したら、`Create API Key`のポップアップが表示されるので、あなたのAPIに任意の名前をつけましょう。

![](/public/images/Polygon-Generative-NFT/section-2/2_4_3.png)

次に、あなたが作成したAPIの横の`Edit`ボタンを選択してください。ポップアップが表示されるので、`apiKey`を取得しましょう。

次に、ターミナルで`packages/contract`に移動して、次のコマンドを実行してください。

Etherscanでverificationを行うために必要なツールをインストールします。

```
yarn add --dev @nomiclabs/hardhat-etherscan@^3.1.7
```

![](/public/images/Polygon-Generative-NFT/section-2/2_4_4.png)

次に、`packages/contract`ディレクトリにある`.env`を開きます。

`YOUR ETHERSCAN apiKey HERE`の部分にEtherscanから取得した`apiKey`を貼り付けたら、下記のコードを`.env`に追加しましょう。

```
ETHERSCAN_API = "YOUR ETHERSCAN apiKey HERE"
```

最後に、`contract/hardhat.config.js`を下記のように更新しましょう。

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

const { API_URL, PRIVATE_KEY, ETHERSCAN_API } = process.env;

module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "sepolia",
  networks: {
    sepolia: {
      url: API_URL,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API,
  },
};
```

これでコントラクトを検証する準備は整いました。

下記の`DEPLOYED_CONTRACT_ADDRESS`と`"BASE_TOKEN_URI"`をあなたのものに更新したら、`packages/contract`へ移動してターミナルで実行していきましょう。

```
npx hardhat clean

npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS "BASE_TOKEN_URI"
```

- `DEPLOYED_CONTRACT_ADDRESS`はあなたのコントラクトアドレスです。

- `"BASE_TOKEN_URI"`は、`deploy.js`に記載されているものと同一である必要があります。

私のコマンドは下記のようになります。

```
npx hardhat verify --network sepolia 0x94E614a7D82d9dD24CBED7607a40eBE4243491dF "ipfs://QmSvw119ALMN9SkP89Xj37jvqJik8jZrSjU5c1vgBhkhz8/"
```

ターミナルに、下記のような結果が表示されていることを確認してください。

```
Compiling 1 file with 0.8.17
Successfully submitted source code for contract
contracts/NFTCollectible.sol:NFTCollectible at 0x94E614a7D82d9dD24CBED7607a40eBE4243491dF
for verification on the block explorer. Waiting for verification result...

Successfully verified contract NFTCollectible on Etherscan.
https://sepolia.etherscan.io/address/0x94E614a7D82d9dD24CBED7607a40eBE4243491dF#code
```

出力された`sepolia.etherscan.io`のURLにアクセスしてみましょう。

私の [URL リンク](https://sepolia.etherscan.io/address/0x94E614a7D82d9dD24CBED7607a40eBE4243491dF#code) の中身は下記のように表示されます。

![](/public/images/Polygon-Generative-NFT/section-2/2_4_5.png)

`Contract`タブの横に小さな緑のチェックマーク ✅ が表示されているでしょうか？

✅ は、ユーザーがMetaMaskを使ってし、Etherscan自体からコントラクトの機能を呼び出せるようになったということを意味します。

![](/public/images/Polygon-Generative-NFT/section-2/2_4_6.png)

`Contract`タブの中の`Write Contract`を選択して以下を試してみましょう。

- コントラクトをデプロイするのに使用したMetaMaskアカウントに接続し、`withdraw`関数を呼び出します。

- 0.03 ETHをコントラクトから自分のウォレットに転送できるはずです。

- また、`mintNFTs`関数を呼び出して数枚のNFTをMintしてみましょう。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#polygon`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

Etherscanリンクを`#polygon`に投稿してください 😊

コミュニティであなたの成功を祝いましょう 🎉

コントラクトの検証が完了したら、次のレッスンに進みましょう 🎉

### 🐝 Rarible で NFT を確認する

コントラクトのアドレス（`Contract deployed to` に続く `0x..`）をターミナルからコピーして、[`rinkeby.rarible.com`](https://rinkeby.rarible.com/) に貼り付け、検索してみてください。

- [テストネット用の OpenSea](https://testnets.opensea.io/) でも同じように確認できますが、NFT が OpenSea に反映されるまでに時間がかかるので、Rarible で検証することをお勧めします。

私のコレクションはこのような形で表示されます。

![](/public/images/Polygon-Generative-NFT/section-2/2_4_1.png)

`deploy.js` で、10 個の NFT を自分用にキープしてから、3 個 NFT を Mint しました。

したがって、今コントラクトアドレスから表示できる NFT コレクションは、13 個です。

### 📝 Etherscan を使ってコントラクトを verify（検証）する

最後に、Etherscan で **コントラクトの Verification（検証）** を行いましょう。

この機能を使えば、あなたの Solidity プログラムを世界中の人に公開できます。

また、あなたもほかの人の書いたコードを読むことができます。

まず、Etherscan のアカウントを取得して、API Key を取得しましょう。

アカウントをまだお持ちでない場合は、[https://etherscan.io/register](https://etherscan.io/register) にアクセスして、無料のユーザーアカウントを作成してください。

アカウントが作成できたら、`My Profile` 画面に移動してください。

![](/public/images/Polygon-Generative-NFT/section-2/2_4_2.png)

`API Keys` タブを選択し、`+ Add` ボタンを押したら、`Create API Key` のポップアップが表示されるので、あなたの API に任意の名前をつけましょう。

![](/public/images/Polygon-Generative-NFT/section-2/2_4_3.png)

次に、あなたが作成した API の横の `Edit` ボタンを選択してください。ポップアップが表示されるので、`apiKey` を取得しましょう。

次に、ターミナルで `nft-collectible` ディレクトリに移動して、次のコマンドを実行してください。

Etherscan で verification を行うために必要なツールをインストールします。

```bash
npm install @nomiclabs/hardhat-etherscan
```

![](/public/images/Polygon-Generative-NFT/section-2/2_4_4.png)

次に、`nft-collectible` ディレクトリにある `.env` を開きます。

`YOUR ETHERSCAN apiKey HERE` の部分に Etherscan から取得した `apiKey` を貼り付けたら、下記のコードを `.env` に追加しましょう。

```
ETHERSCAN_API = "YOUR ETHERSCAN apiKey HERE"
```

最後に、`nft-collectible/hardhat.config.js` を下記のように更新しましょう。

```javascript
// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

const { API_URL, PRIVATE_KEY, ETHERSCAN_API } = process.env;

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.9",
  defaultNetwork: "rinkeby",
  networks: {
    rinkeby: {
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

下記の `DEPLOYED_CONTRACT_ADDRESS` と `"BASE_TOKEN_URI"` をあなたのものに更新したら、ターミナルで実行していきましょう。

```bash
npx hardhat clean

npx hardhat verify --network rinkeby DEPLOYED_CONTRACT_ADDRESS "BASE_TOKEN_URI"
```

- `DEPLOYED_CONTRACT_ADDRESS` はあなたのコントラクトアドレスです。

- `"BASE_TOKEN_URI"` は、`deploy.js` に記載されているものと同一である必要があります。

私のコマンドは下記のようになります。

```
npx hardhat verify --network rinkeby 0x94E614a7D82d9dD24CBED7607a40eBE4243491dF "ipfs://QmSvw119ALMN9SkP89Xj37jvqJik8jZrSjU5c1vgBhkhz8/"
```

ターミナルに、下記のような結果が表示されていることを確認してください。

```
Compiling 1 file with 0.8.9
Successfully submitted source code for contract
contracts/NFTCollectible.sol:NFTCollectible at 0x94E614a7D82d9dD24CBED7607a40eBE4243491dF
for verification on the block explorer. Waiting for verification result...

Successfully verified contract NFTCollectible on Etherscan.
https://rinkeby.etherscan.io/address/0x94E614a7D82d9dD24CBED7607a40eBE4243491dF#code
```

出力された `rinkeby.etherscan.io` の URL にアクセスしてみましょう。

私の [URL リンク](https://rinkeby.etherscan.io/address/0x94E614a7D82d9dD24CBED7607a40eBE4243491dF#code) の中身は下記のように表示されます。

![](/public/images/Polygon-Generative-NFT/section-2/2_4_5.png)

`Contract` タブの横に小さな緑のチェックマーク ✅ が表示されているでしょうか？

✅ は、ユーザーが MetaMask を使ってし、Etherscan 自体からコントラクトの機能を呼び出せるようになったということを意味します。

![](/public/images/Polygon-Generative-NFT/section-2/2_4_6.png)

`Contract` タブの中の `Write Contract` を選択して以下を試してみましょう。

- コントラクトをデプロイするのに使用した MetaMask アカウントに接続し、`withdraw` 関数を呼び出します。

- 0.03 ETH をコントラクトから自分のウォレットに転送できるはずです。

- また、`mintNFTs` 関数を呼び出して数枚の NFT を Mint してみましょう。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#polygon-generative-nft` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 3 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

Etherscan リンクを `#polygon-generative-nft` に投稿してください 😊

コミュニティであなたの成功を祝いましょう 🎉

コントラクトの検証が完了したら、次のレッスンに進みましょう 🎉

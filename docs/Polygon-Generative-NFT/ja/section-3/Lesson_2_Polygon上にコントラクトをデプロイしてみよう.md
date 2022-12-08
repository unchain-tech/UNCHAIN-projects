### 🦉 Polygon に スマートコントラクトをデプロイする

このレッスンでは、プロジェクトをPolygonネットワークにコントラクトをデプロイする方法を紹介します。

手順はほかのイーサリアムのサイドチェーン(例：[Plasma](https://aire-voice.com/blockchain/4479/))とほぼ同じです。

まず、`nft-collectible`ディレクトリに向かい、下記を修正していきましょう。

1 \. `.env`ファイルを下記のように修正してください。

```
API_URL = ""
PRIVATE_KEY = "あなたの秘密鍵は、以前に貼り付けたものを保持してください。"
ETHERSCAN_API = ""
POLYGON_URL = ""
```

今回の実装では、`API_URL`（Alchemy API）は必要ないので、空文字列`""`を設定してください。

- ただし削除しないでください、設定ファイルが壊れてしまいます。

`ETHERSCAN_API`と`POLYGON_URL`は現段階では、空文字列`""`にしておきます。

2 \. `hardhat.config.js`を開き、コードを下記のように更新しましょう。

```javascript
// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

const { API_URL, PRIVATE_KEY, ETHERSCAN_API, POLYGON_URL } = process.env;

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.9",
  networks: {
    goerli: {
      url: API_URL,
      accounts: [PRIVATE_KEY],
    },
    mumbai: {
      url: POLYGON_URL,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API,
  },
};
```

3 \. 最後に、ターミナルに向かい、`nft-collectible`ディレクトリ上で以下のコマンドを実行します。

```
npx hardhat run scripts/run.js
```

ターミナル上で、上記がエラーなく実行されれば、Polygonネットワークにコントラクトをデプロイする準備は完了です。

### 🕵️‍♂️ NFT 価格の再設定

私たちは、NFTの基本価格を0.01 ETHに設定しました。

```solidity
// NFTCollectible.sol
uint public constant PRICE = 0.01 ether;
```

ここでは、ユーザーはNFTをMintするたびにガス代 + 0.01 ETHを支払います。

ですが、Polygonサイドチェーンで使用されるのはETHではなく、MATICという独自のERC20トークンです。

> ✍️: ERC20 トークンについて
> ERC20 は、イーサリアムのブロックチェーンを利用したトークンに適用される仕様です。
>
> イーサリアムネットワーク上では、誰でもオリジナルの仮想通貨（トークン）を作ることができます。
>
> ただし、トークンの仕様（プログラミング言語など）が異なる場合、そのトークンのために独自のウォレットの開発が必要になります。
>
> ERC20 に準拠しているトークンは、MetaMask のような既存のウォレットで管理することができます。

現在（2022年2月）、ETHとMATICを日本円に換算すると以下のようになります。

```
1 ETH    ≒  340,000円
1 MATIC  ≒  200 円
```

したがって、ETHで表記したNFT 1つあたりの価格（0.01 ETH）をMATICに換算すると、17 MATICとなります。

この変更を反映させるために、`NFTCollectible.sol`の価格表記を下記のように更新しましょう。

```solidity
// NFTCollectible.sol
uint public constant PRICE = 17 ether;
```

ここで、`PRICE`を`17 MATIC`と表記しないのには、理由があります。

**Solidity では、`ether`というキーワードは`10¹⁸`に過ぎません。**

- Solidityにとって、`17 ether`は下記と同じです。

  ```javascript
  // 17 * 10¹⁸
  1700000000000000;
  ```

実際にSolidityでは`Wei`という単位で支払い金額を指定しています。

イーサリアムメインネットでは、`1 ETH`は`10¹⁸ Wei`です。

Polygonでは、`10¹⁸ Wei`が`1 MATIC`です。

> ✍️: `Wei`と`Gwei`
> イーサリアムのガス代（コスト）は、下記で決まります。
>
>     `コスト = ガス価格（ Gas Price ） x 消費したガスの量（ Gas limit & Usage by Txn ）`
>
> `Gwei`はガス価格の単位、`Wei`はイーサリアムの最小単位となります。

**異なるネットワークにコントラクトを移行する場合は、常に価格の修正を正しく行うようにしましょう。**

このレッスンでは、Polygon Mumbai-Testnetを使用するので、NFTの価格を`0.01 MATIC`にします。

そこで、NFTの価格を元通りにリセットすることにします。

**下記のように、`NFTCollectible.sol`の価格をもう一度書き換えてください。**

```solidity
// NFTCollectible.sol
uint public constant PRICE = 0.01 ether;
```

> ⚠️: 注意
>
> **Polygon ネットワークにデプロイする場合、`0.01 ether`は`0.01 MATIC`です。`0.01 ETH`ではありません。**

### 🦊 MetaMask と Hardhat に Polygon Network を追加する

MetaMaskウォレットにMatic MainnetとPolygon Mumbai-Testnetを追加してみましょう。

**1 \. Matic Mainnet を MetaMask に接続する**

Matic MainnetをMetaMaskに追加するには、次の手順に従ってください。

まず、[Polygonscan](https://polygonscan.com/) に向かい、ページの一番下までスクロールして、`Add Polygon Network`ボタンをクリックします。

![](/public/images/Polygon-Generative-NFT/section-3/3_2_1.png)

下記のようなポップアップが立ち上がったら、`Switch Network`をクリックしましょう。

![](/public/images/Polygon-Generative-NFT/section-3/3_2_2.png)

`Matic Mainnet`があなたのMetaMaskにセットアップされました。

![](/public/images/Polygon-Generative-NFT/section-3/3_2_3.png)

**2 \. Polygon Mumbai-Testnet を MetaMask に接続する**

Polygon Mumbai-TestnetをMetaMaskに追加するには、次の手順に従ってください。

まず、[mumbai.polygonscan.com](https://mumbai.polygonscan.com/) に向かい、ページの一番下までスクロールして、`Add Mumbai Network`ボタンをクリックします。

`Matic Mainnet`を設定した時と同じ要領で`Polygon Testnet`をあなたのMetaMaskに設定してください。

Hardhatを使用する場合、AlchemyのカスタムRPC URLが必要です。

[alchemy.com](https://www.alchemy.com/) に再度ログインして、`Create App`を選択し、下記のように設定してください。

![](/public/images/Polygon-Generative-NFT/section-3/3_2_4.png)

次に、下図のように、新しく作成した`Polygon NFT`アプリケーションの`VIEW DETAILS`をクリックしましょう。

![](/public/images/Polygon-Generative-NFT/section-3/3_2_5.png)

次に、アプリケーションの`VIEW KEY`をクリックし、`HTTP` URLをコピーしてください。

![](/public/images/Polygon-Generative-NFT/section-3/3_2_6.png)

それでは、`nft-collectible/.env`ファイルを開き、コピーした`HTTP` URLを下記の`Alchemy Polygon URL`の部分に貼り付けていきます。

```javascript
// .env
POLYGON_URL = "Alchemy Polygon URL";
```

### 🚰 偽 MATIC を入手する

MetaMaskとHardhatの両方でPolygonネットワークの設定が完了したら、偽のMATICを取得していきましょう。

[こちら](https://faucet.polygon.technology/) にアクセスして、下記のように偽MATICをリクエストしてください。

![](/public/images/Polygon-Generative-NFT/section-3/3_2_7.png)

Goerliとは異なり、これらのトークンの取得にそれほど問題はないはずです。

1回のリクエストで0.5 MATIC（偽）が手に入るので、2回リクエストして、1 MATIC入手しましょう。

**⚠️: Polygon のメインネットワークにコントラクトをデプロイする際の注意事項**

> Polygon のメインネットワークにコントラクトをデプロイする準備ができたら、本物の MATIC を入手する必要があります。
>
> これには 2 つの方法があります。
>
> 1. イーサリアムのメインネットで MATIC を購入し、Polygon のネットワークにブリッジする。
>
> 2. 仮想通貨の取引所（ WazirX や Coinbase など）で MATIC を購入し、それを直接 MetaMask に転送する。
>
> Polygon のようなサイドチェーンの場合、`2`の方が簡単で安く済みます。

### 🇮🇳 Polygon テストネットにコントラクトをデプロイする

準備完了です!

`nft-collectible/scripts`に向かい、`deploy.js`を下記のように更新してください。

```javascript
// deploy.js
async function main() {
  // あなたのコレクションの Base Token URI（JSON の CID）に差し替えてください
  // 注: 十分な NFT を確保するために、下記のサンプル Token URI を使用しても問題ありません。
  const baseTokenURI = "ipfs://QmZbWNKJPAjxXuNFSEaksCJVd1M6DaKQViJBYPK2BdpDEP/";

  // オーナー/デプロイヤーのウォレットアドレスを取得する
  const [owner] = await hre.ethers.getSigners();

  // デプロイしたいコントラクトを取得
  const contractFactory = await hre.ethers.getContractFactory("NFTCollectible");

  // 正しいコンストラクタ引数（baseTokenURI）でコントラクトをデプロイします。
  const contract = await contractFactory.deploy(baseTokenURI);

  // このトランザクションがマイナーに承認（mine）されるのを待つ
  await contract.deployed();

  // コントラクトアドレスをターミナルに出力
  console.log("Contract deployed to:", contract.address);

  // 所有者の全トークンIDを取得
  let tokens = await contract.tokensOfOwner(owner.address);
  console.log("Owner has tokens: ", tokens);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
const { utils } = require("ethers");
```

ターミナルで`nft-collectible`ディレクトリに移動し、以下のコマンドを実行します。

```
npx hardhat run scripts/deploy.js --network mumbai
```

下記のような結果がターミナルに出力されていることを確認してください。

```
Contract deployed to: 0xF899DeB963208560a7c667FA78376ecaFF684b8E
Owner has tokens:  []
```

次に、[mumbai.polygonscan.com](https://mumbai.polygonscan.com/) に向かい、コントラクトアドレス(`Contract deployed to`に続く`0x..`)を検索して、コントラクトがデプロイされたことを確認しましょう。

![](/public/images/Polygon-Generative-NFT/section-3/3_2_8.png)

### 📝 Polygonscan を使ってコントラクトを verify（検証）する

最後に、Polygonscanで **コントラクトの Verification（検証）** を行い、ユーザーがPolygonscanから直接あなたのNFTをMintできるようにしましょう。

まず、[Polygonscan](https://polygonscan.com/) に向かい、アカウントを作成しましょう。

次に、APIの作成に進みます。下図のように、`API-Keys`のタブを選択し、`+ Add`ボタンを押してください。

![](/public/images/Polygon-Generative-NFT/section-3/3_2_9.png)

ポップアップが開くので、APIに任意の名前をつけて、保存しましょう。

APIを作成したら、そのAPIの`Edit`ボタンをクリックしてください。
![](/public/images/Polygon-Generative-NFT/section-3/3_2_10.png)

下記の画面に遷移するので、`Polygon-API-Key`をコピーしましょう。

![](/public/images/Polygon-Generative-NFT/section-3/3_2_11.png)

最後にもう一度`nft-collectible/.env`ファイルを開き、下記にコピーした`Polygon-API-Key`の値を貼り付けます。

```javascript
// .env
ETHERSCAN_API = "Polygonscan-API-key";
```

PolygonscanはEtherscanを搭載しているため、`ETHERSCAN_API`という変数名は前回のレッスンで使用したものを残しています。

下記の`DEPLOYED_CONTRACT_ADDRESS`と`"BASE_TOKEN_URI"`をあなたのものに更新したら、ターミナルで実行していきましょう。

```bash
npx hardhat clean

npx hardhat verify --network mumbai DEPLOYED_CONTRACT_ADDRESS "BASE_TOKEN_URI"
```

- `DEPLOYED_CONTRACT_ADDRESS`はあなたのコントラクトアドレスです。

- `"BASE_TOKEN_URI"`は、`deploy.js`に記載されているものと同一である必要があります。

私のコマンドは下記のようになります。

```
npx hardhat verify --network mumbai 0xF899DeB963208560a7c667FA78376ecaFF684b8E "ipfs://QmSvw119ALMN9SkP89Xj37jvqJik8jZrSjU5c1vgBhkhz8/"
```

下記のような結果がターミナルに出力されていることを確認してください。

```
Compiling 15 files with 0.8.9
Solidity compilation finished successfully
Compiling 1 file with 0.8.9
Successfully submitted source code for contract
contracts/NFTCollectible.sol:NFTCollectible at 0xF899DeB963208560a7c667FA78376ecaFF684b8E
for verification on the block explorer. Waiting for verification result...

Successfully verified contract NFTCollectible on Etherscan.
https://mumbai.polygonscan.com/address/0xF899DeB963208560a7c667FA78376ecaFF684b8E#code

```

出力された`https://mumbai.polygonscan.com/address/0x...`のリンクをブラウザで開いてコントラクトの中身がオンラインで読み込めるか検証してみましょう。

無事コントラクトの中身がPolygonscanに表示されていたでしょうか？

コントラクトが`verify`されると、誰でもPolygonscan上で関数を呼び出して、あなたのNFTをMintできます。

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

おめでとうございます!　セクション3は終了です!

ぜひ、あなたのPolygonscanリンクを`#polygon`に投稿してください 😊

コミュニティであなたの成功を祝いましょう 🎉

次のレッスンでは、フロントエンドを構築していきます。

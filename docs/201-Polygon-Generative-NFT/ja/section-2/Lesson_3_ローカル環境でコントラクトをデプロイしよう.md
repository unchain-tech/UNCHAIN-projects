### 🛫 ローカル環境でコントラクトをデプロイする

ローカル環境で、Rinkeby テストネットワークにコントラクトをデプロイするための準備をしましょう。

`nft-collectible/scripts` ディレクトリに移動し、`run.js` という名前のファイルを作成してください。

**`run.js` はローカル環境でスマートコントラクトのテストを行うためのテストプログラムです。**

```javascript
// run.js
async function main() {
  // あなたのコレクションの Base Token URI（JSON の CID）に差し替えてください
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

  // NFTを 10 点、コントラクト所有者のためにキープする
  let txn = await contract.reserveNFTs();
  await txn.wait();
  console.log("10 NFTs have been reserved");

  // 0.03 ETH を送信して3つ NFT を mint する
  txn = await contract.mintNFTs(3, {
    value: hre.ethers.utils.parseEther("0.03"),
  });
  await txn.wait();

  // コントラクト所有者の保有するtokenIdsを取得
  let tokens = await contract.tokensOfOwner(owner.address);
  console.log("Owner has tokens: ", tokens);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

`run.js` は、`ethers.js` ライブラリを利用してコントラクトをデプロイし、デプロイ後にコントラクトの関数を呼び出す JavaScript コードです。

以下は、その `run.js` で実行されるテストの流れです。

- NFT コレクションのメタデータを取得。**`beseTokenURI` のアドレスをあなたの IPSF のアドレスに変更してください。**

  ```javascript
  // run.js
  // あなたのコレクションの Base Token URI（JSON の CID）に差し替えてください
  const baseTokenURI = "ipfs://QmZbWNKJPAjxXuNFSEaksCJVd1M6DaKQViJBYPK2BdpDEP/";
  ```

- コントラクトの所有者（あなた）のアドレスを取得。

  ```javascript
  // run.js
  // オーナー/デプロイヤーのウォレットアドレスを取得する
  const [owner] = await hre.ethers.getSigners();
  ```

- デプロイしたいコントラクトを取得。

  ```javascript
  // run.js
  // デプロイしたいコントラクトを取得
  const contractFactory = await hre.ethers.getContractFactory("NFTCollectible");
  ```

- コントラクトをデプロイするためのリクエストを送り、マイナーがこのリクエストを選んでブロックチェーンに追加するのを待つ（トランザクションの承認待ち）。

  ```javascript
  // run.js
  // 正しいコンストラクタ引数（baseTokenURI）でコントラクトをデプロイします。
  const contract = await contractFactory.deploy(baseTokenURI);

  // このトランザクションがマイナーに承認（mine）されるのを待つ
  await contract.deployed();
  ```

- トランザクションが承認（mine）されると、コントラクトのアドレスが取得される。

  ```javascript
  // run.js
  // コントラクトアドレスをターミナルに出力
  console.log("Contract deployed to:", contract.address);
  ```

その後、コントラクトの `public` 関数を呼び出します。

- 10 NFT を予約し、コントラクトに 0.03 ETH を送信して、3 NFT を Mint し、所有する NFT をチェックします。

  ```javascript
  // run.js
  // 1. NFTを 10 点、コントラクト所有者のためにキープする
  let txn = await contract.reserveNFTs();
  await txn.wait();
  console.log("10 NFTs have been reserved");

  // 2. 0.03 ETH を送信して 3 つ NFTを mint する
  txn = await contract.mintNFTs(3, {
    value: hre.ethers.utils.parseEther("0.03"),
  });
  await txn.wait();

  // 3. コントラクト所有者の保有する tokenIds を取得
  let tokens = await contract.tokensOfOwner(owner.address);
  console.log("Owner has tokens: ", tokens);
  ```

- ブロックチェーンにデータを書き込んでいるため、`reserveNFTs` と `mintNFTs` の呼び出しにはガス代が必要です。

- `tokensOfOwner` の呼び出しは、単にブロックチェーンからデータを読み込んでいるので、ガス代はかかりません。

これをローカルで実行してみましょう。

```bash
npx hardhat run scripts/run.js
```

ターミナルに下記のような出力結果が表示されていればテストは成功です。

```bash
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
10 NFTs have been reserved
Owner has tokens:  [
  BigNumber { value: "0" },
  BigNumber { value: "1" },
  BigNumber { value: "2" },
  BigNumber { value: "3" },
  BigNumber { value: "4" },
  BigNumber { value: "5" },
  BigNumber { value: "6" },
  BigNumber { value: "7" },
  BigNumber { value: "8" },
  BigNumber { value: "9" },
  BigNumber { value: "10" },
  BigNumber { value: "11" },
  BigNumber { value: "12" }
]
```

### 🚀 Rinkeby Test Network にコントラクトをデプロイする

それでは、Rinkeby Test Network にコントラクトをデプロイしましょう。

`nft-collectible/scripts` の中ににある `deploy.js` を以下のとおり更新します。

その中に、`run.js` の中身を下を貼り付けましょう。

> ⚠️: 注意
>
> `run.js` はあくまでローカル環境でコントラクトのテストを実行するスクリプトです。
>
> 一方、`deploy.js` はテストネットやイーサリアムメインネットに実際にコントラクトをデプロイするときに使用するスクリプトです。
>
> `run.js` と `deploy.js` は分けて管理することをおすすめします。

`deploy.js` が作成できたら、ターミナル上で `nft-collectible` ディレクトリに移動し、下記のコマンドを実行しましょう。

```bash
npx hardhat run scripts/deploy.js --network rinkeby
```

下記のような結果がターミナルに出力されていることを確認してください。

```bash
Contract deployed to: 0x97517fEEEA81d82aA637C8c3d901771155EF4bca
10 NFTs have been reserved
Owner has tokens:  [
  BigNumber { value: "0" },
  BigNumber { value: "1" },
  BigNumber { value: "2" },
  BigNumber { value: "3" },
  BigNumber { value: "4" },
  BigNumber { value: "5" },
  BigNumber { value: "6" },
  BigNumber { value: "7" },
  BigNumber { value: "8" },
  BigNumber { value: "9" },
  BigNumber { value: "10" },
  BigNumber { value: "11" },
  BigNumber { value: "12" }
]
```

あなたのターミナル上で、`Contract deployed to` の後に出力されたコントラクトアドレス（`0x..`）をコピーして、保存しておきましょう。

後でフロントエンドを構築する際に必要となります。

### 👀 Etherscan でトランザクションを確認する

`Contract deployed to:` に続くアドレス（`0x..`）をコピーして、[Etherscan](https://rinkeby.etherscan.io/) に貼り付けてみましょう。

あなたのスマートコントラクトのトランザクション履歴が確認できます。

- Etherscan は、イーサリアムネットワーク上のトランザクションに関する情報を確認するのに便利なプラットフォームです。

- _表示されるまでに約 1 分かかり場合があります。_

下記のような結果が、Rinkeby Etherscan 上で確認できれば、テストネットへのデプロイは成功です。

![](/public/images/201-Polygon-Generative-NFT/section-2/2_2_14.png)

**デプロイのデバッグに Rinkeby Etherscan 使うことに慣れましょう。**

Rinkeby Etherscan はデプロイを追跡する最も簡単な方法であり、問題を特定するのに適しています。

- Etherscan にトランザクションが表示されないということは、まだ処理中か、何か問題があったということになります。

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

テストが完了したら、次のレッスンに進んでコントラクトをテストネットにデプロイしましょう 🎉

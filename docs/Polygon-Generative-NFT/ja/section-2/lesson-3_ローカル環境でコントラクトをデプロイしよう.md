### 🛫 ローカル環境でコントラクトをデプロイする

ローカル環境で、Sepoliaテストネットワークにコントラクトをデプロイするための準備をしましょう。

`packages/contract/scripts`ディレクトリに移動し、`run.js`という名前のファイルを作成してください。

**`run.js`はローカル環境でスマートコントラクトのテストを行うためのテストプログラムです。**

```javascript
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

`run.js`は、`ethers.js`ライブラリを利用してコントラクトをデプロイし、デプロイ後にコントラクトの関数を呼び出すJavaScriptコードです。

以下は、その`run.js`で実行されるテストの流れです。

- NFTコレクションのメタデータを取得。**`beseTokenURI`のアドレスをあなたの IPSF のアドレスに変更してください。**

  ```javascript
  // あなたのコレクションの Base Token URI（JSON の CID）に差し替えてください
  const baseTokenURI = "ipfs://QmZbWNKJPAjxXuNFSEaksCJVd1M6DaKQViJBYPK2BdpDEP/";
  ```

- コントラクトの所有者（あなた）のアドレスを取得。

  ```javascript
  // オーナー/デプロイヤーのウォレットアドレスを取得する
  const [owner] = await hre.ethers.getSigners();
  ```

- デプロイしたいコントラクトを取得。

  ```javascript
  // デプロイしたいコントラクトを取得
  const contractFactory = await hre.ethers.getContractFactory("NFTCollectible");
  ```

- コントラクトをデプロイするためのリクエストを送り、マイナーがこのリクエストを選んでブロックチェーンに追加するのを待つ（トランザクションの承認待ち）。

  ```javascript
  // 正しいコンストラクタ引数（baseTokenURI）でコントラクトをデプロイします。
  const contract = await contractFactory.deploy(baseTokenURI);

  // このトランザクションがマイナーに承認（mine）されるのを待つ
  await contract.deployed();
  ```

- トランザクションが承認（mine）されると、コントラクトのアドレスが取得される。

  ```javascript
  // コントラクトアドレスをターミナルに出力
  console.log("Contract deployed to:", contract.address);
  ```

その後、コントラクトの`public`関数を呼び出します。

- 10 NFTを予約し、コントラクトに0.03 ETHを送信して、3 NFTをMintし、所有するNFTをチェックします。

  ```javascript
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

- ブロックチェーンにデータを書き込んでいるため、`reserveNFTs`と`mintNFTs`の呼び出しにはガス代が必要です。

- `tokensOfOwner`の呼び出しは、単にブロックチェーンからデータを読み込んでいるので、ガス代はかかりません。

次にターミナル上でプロジェクトのルートに移動し、下記を実行してみましょう。

```
yarn contract run:script
```

ターミナルに下記のような出力結果が表示されていればテストは成功です。

```
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

### 🚀 Sepolia Test Network にコントラクトをデプロイする

それでは、Sepolia Test Networkにコントラクトをデプロイしましょう。

`packages/contract/scripts`フォルダ内の`deploy.js`の内容を、`run.js`の内容と同じにしてください。

> ⚠️: 注意
>
> `run.js`はあくまでローカル環境でコントラクトのテストを実行するスクリプトです。
>
> 一方、`deploy.js`はテストネットやイーサリアムメインネットに実際にコントラクトをデプロイするときに使用するスクリプトです。
>
> `run.js`と`deploy.js`は分けて管理することをおすすめします。

`deploy.js`が作成できたら、ターミナル上で下記のコマンドを実行しましょう。

```
yarn contract deploy
```

下記のような結果がターミナルに出力されていることを確認してください。

```
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

あなたのターミナル上で、`Contract deployed to`の後に出力されたコントラクトアドレス(`0x..`)をコピーして、保存しておきましょう。

後でフロントエンドを構築する際に必要となります。

### 👀 Etherscan でトランザクションを確認する

`Contract deployed to:`に続くアドレス(`0x..`)をコピーして、[Etherscan](https://sepolia.etherscan.io/) に貼り付けてみましょう。

あなたのスマートコントラクトのトランザクション履歴が確認できます。

- Etherscanは、イーサリアムネットワーク上のトランザクションに関する情報を確認するのに便利なプラットフォームです。

- _表示されるまでに約 1 分かかり場合があります。_

下記のような結果が、Sepolia Etherscan上で確認できれば、テストネットへのデプロイは成功です。

![](/public/images/Polygon-Generative-NFT/section-2/2_2_14.png)

**デプロイのデバッグに Sepolia Etherscan 使うことに慣れましょう。**

Sepolia Etherscanはデプロイを追跡する最も簡単な方法であり、問題を特定するのに適しています。

- Etherscanにトランザクションが表示されないということは、まだ処理中か、何か問題があったということになります。

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

テストが完了したら、次のレッスンに進んでコントラクトをテストネットにデプロイしましょう 🎉

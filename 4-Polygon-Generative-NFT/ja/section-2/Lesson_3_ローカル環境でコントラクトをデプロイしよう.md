🛫 ローカル環境でコントラクトをデプロイする
----

ローカル環境で、Rinkeby テストネットワークにコントラクトをデプロイするための準備をしましょう。

`nft-collectible/scripts` ディレクトリに移動し、`run.js` という名前のファイルを作成してください。

**`run.js` はローカル環境でスマートコントラクトのテストを行うためのテストプログラムです。**

```javascript
// run.js
async function main() {

    // あなたのコレクションの Base Token URI を記入してください。
    const baseTokenURI = "ipfs://QmZbWNKJPAjxXuNFSEaksCJVd1M6DaKQViJBYPK2BdpDEP/";

    // オーナー/デプロイヤーのウォレットアドレスを取得する
    const [owner] = await hre.ethers.getSigners();

    // デプロイしたいコントラクトを取得
    const contractFactory = await hre.ethers.getContractFactory("NFTCollectible");

    // 正しいコンストラクタ引数（baseTokenURI）でコントラクトをデプロイします。
    const contract = await contractFactory.deploy(baseTokenURI);

    // このトランザクションがマイナーにs承認（mine）されるのを待つ
    await contract.deployed();

    // コントラクトアドレスをターミナルに出力
    console.log("Contract deployed to:", contract.address);

    // NFTを 10 点、コントラウト所有者のためにキープする
    let txn = await contract.reserveNFTs();
    await txn.wait();
    console.log("10 NFTs have been reserved");

    // 0.03 ETH を送信して3つ NFT を mint する
    txn = await contract.mintNFTs(3, { value: utils.parseEther('0.03') });
    await txn.wait()

    // コントラクト所有者の保有するtokenIdsを取得
    let tokens = await contract.tokensOfOwner(owner.address)
    console.log("Owner has tokens: ", tokens);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
```

`run.js` は、`ethers.js` ライブラリを利用してコントラクトをデプロイし、デプロイ後にコントラクトの関数を呼び出す Javascript コードです。

以下は、その `run.js` で実行されるテストの流れです。

-  NFT コレクションのメタデータを取得。**`beseTokenURI` のアドレスピックスをあなたの IPSF のアドレスに変更してください。**
    ```javascript
    // あなたのコレクションの Base Token URI を記入してください。
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

    // このトランザクションがマイナーにs承認（mine）されるのを待つ
    await contract.deployed();
    ```

- トランザクションが承認（ mine ）されると、コントラクトのアドレスが取得される。

    ```javascript
    // コントラクトアドレスをターミナルに出力
    console.log("Contract deployed to:", contract.address);
    ```

その後、コントラクトの `public` 関数を呼び出します。

- 10 NFTを予約し、コントラクトに 0.03 ETHを送信して、3 NFTを Mint し、所有する NFT をチェックします。


    ```javascript
    // 1. NFTを 10 点、コントラウト所有者のためにキープする
    let txn = await contract.reserveNFTs();
    await txn.wait();
    console.log("10 NFTs have been reserved");

    // 2. 0.03 ETH を送信して 3 つ NFTを mint する
    txn = await contract.mintNFTs(3, { value: utils.parseEther('0.03') });
    await txn.wait()

    // 3. コントラクト所有者の保有する tokenIds を取得
    let tokens = await contract.tokensOfOwner(owner.address)
    console.log("Owner has tokens: ", tokens);
    ```

- ブロックチェーンにデータを書き込んでいるため、`reserveNFTs` と `mintNFTs` の呼び出しにはガス代が必要です。

- `tokensOfOwner` の呼び出しは、単にブロックチェーンからデータを読み込んでいるので、ガス代はかかりません。

これをローカルで実行してみましょう。

```bash
npx hardhat run scripts/run.js
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

🙋‍♂️ 質問する
-------------------------------------------
ここまでの作業で何かわからないことがある場合は、Discord の `#section-1-help` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください✨
```
1. 何をしようとしていたか
2. エラー文をコピー&ペースト
3. エラー画面のスクリーンショット
```
-------------------------------------------
テストが完了したら、次のレッスンに進んでコントラクトをテストネットにデプロイしましょう🎉

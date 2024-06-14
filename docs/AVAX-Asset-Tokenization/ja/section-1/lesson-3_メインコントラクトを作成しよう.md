### 🥮 `AssetTokenization`コントラクトを作成する

フロントエンドとのデータのやりとり、FarmNftのデプロイと管理をする機能を持つ`AssetTokenization`コントラクトを作成します。

`contracts`ディレクトリの下に`AssetTokenization.sol`という名前のファイルを作成します。

`AssetTokenization.sol`の中に以下のコードを貼り付けてください。

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "./FarmNft.sol";

contract AssetTokenization {
    address[] private _farmers; // 農家のアドレスを保存します。
    mapping(address => FarmNft) private _farmerToNftContract; // 農家のアドレスとデプロイしたFarmNftをマッピングします。

    struct NftContractDetails {
        address farmerAddress;
        string farmerName;
        string description;
        uint256 totalMint;
        uint256 availableMint;
        uint256 price;
        uint256 expirationDate;
    }
}
```

もし、`hardhat.config.ts`の中に記載されているSolidityのバージョンが`0.8.17`でなかった場合は、`FarmNft.sol`の中身を`hardhat.config.ts`に記載されているバージョンに変更しましょう。

コントラクトのはじめに状態変数を定義しています。
その次には`NftContractDetails`という構造体を定義しています。
`NftContractDetails`は、 フロントエンドへ`farmNft`の情報を渡すために使用する型になります。

次に`AssetTokenization`の最後の行に以下のコードを貼り付けてください。

```solidity
    function availableContract(address farmer) public view returns (bool) {
        return address(_farmerToNftContract[farmer]) != address(0);
    }

    function _addFarmer(address newFarmer) internal {
        for (uint256 index = 0; index < _farmers.length; index++) {
            if (newFarmer == _farmers[index]) {
                return;
            }
        }
        _farmers.push(newFarmer);
    }

    function generateNftContract(
        string memory _farmerName,
        string memory _description,
        uint256 _totalMint,
        uint256 _price,
        uint256 _expirationDate
    ) public {
        address farmerAddress = msg.sender;

        require(
            availableContract(farmerAddress) == false,
            "Your token is already deployed"
        );

        _addFarmer(farmerAddress);

        FarmNft newNft = new FarmNft(
            farmerAddress,
            _farmerName,
            _description,
            _totalMint,
            _price,
            _expirationDate
        );

        _farmerToNftContract[farmerAddress] = newNft;
    }
```

`availableContract`では、（農家の）アドレスをもとに`farmNft`がデプロイされているのかを確認しています。
`farmNft`がデプロイされていない場合、 または期限が切れマッピングからdeleteされた場合は、address()で表現すると`0x0`になります。

`_addFarmer`は農家のアドレスが新規だった場合に状態変数に保存します。

`generateNftContract`は農家がNFTを作成する(=`farmNft`をデプロイする)際に使用する関数です。
`new FarmNft()`により新しく`farmNft`をデプロイします。
そして`_farmerToNftContract`のマッピングに追加します。

次に`AssetTokenization`の最後の行に以下のコードを貼り付けてください。

```solidity
    function getNftContractDetails(address farmerAddress)
        public
        view
        returns (NftContractDetails memory)
    {
        require(availableContract(farmerAddress), "not available");

        NftContractDetails memory details;
        details = NftContractDetails(
            _farmerToNftContract[farmerAddress].farmerAddress(),
            _farmerToNftContract[farmerAddress].farmerName(),
            _farmerToNftContract[farmerAddress].description(),
            _farmerToNftContract[farmerAddress].totalMint(),
            _farmerToNftContract[farmerAddress].availableMint(),
            _farmerToNftContract[farmerAddress].price(),
            _farmerToNftContract[farmerAddress].expirationDate()
        );

        return details;
    }

    function buyNft(address farmerAddress) public payable {
        require(availableContract(farmerAddress), "Not yet deployed");

        address buyerAddress = msg.sender;
        _farmerToNftContract[farmerAddress].mintNFT{value: msg.value}(
            buyerAddress
        );
    }

    function getBuyers() public view returns (address[] memory) {
        address farmerAddress = msg.sender;

        require(availableContract(farmerAddress), "Not yet deployed");

        return _farmerToNftContract[farmerAddress].getTokenOwners();
    }

    function getFarmers() public view returns (address[] memory) {
        return _farmers;
    }
```

`getNftContractDetails`は指定された`farmNft`の情報を`NftContractDetails`型の変数に格納して返却する関数です。

`buyNft`は指定された`farmNft`のNFTを購入する関数です。
この関数は購入者から（NFTの価格分の）AVAXを付与して呼び出されることを想定しているので、 `msg.value`によってその量の取得できます。さらにその量のAVAXを付与して指定された`farmNft`の`mintNFT`を呼び出しています。

`getBuyers`は指定された`farmNft`の購入者のアドレスを返却する関数です。

### 🧪 テストを追加しましょう

`test`ディレクトの下に`AssetTokenization.ts`を作成し、 以下のコードを貼り付けてください。

```ts
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { BigNumber, Overrides } from "ethers";
import { ethers } from "hardhat";

describe("AssetTokenization", function () {
  const oneWeekInSecond = 60 * 60 * 24 * 7;

  async function deployContract() {
    const accounts = await ethers.getSigners();

    const AssetTokenization = await ethers.getContractFactory(
      "AssetTokenization"
    );
    const assetTokenization = await AssetTokenization.deploy();

    return {
      deployAccount: accounts[0],
      userAccounts: accounts.slice(1, accounts.length),
      assetTokenization,
    };
  }

  describe("basic", function () {
    it("generate NFT contract and check details", async function () {
      const { userAccounts, assetTokenization } = await loadFixture(
        deployContract
      );

      const farmerName = "farmer";
      const description = "description";
      const totalMint = BigNumber.from(5);
      const price = BigNumber.from(100);
      const expirationDate = BigNumber.from(Date.now())
        .div(1000) // in second
        .add(oneWeekInSecond); // one week later

      const farmer1 = userAccounts[0];
      const farmer2 = userAccounts[1];

      await assetTokenization
        .connect(farmer1)
        .generateNftContract(
          farmerName,
          description,
          totalMint,
          price,
          expirationDate
        );

      await assetTokenization
        .connect(farmer2)
        .generateNftContract(
          farmerName,
          description,
          totalMint,
          price,
          expirationDate
        );

      const details1 = await assetTokenization.getNftContractDetails(
        farmer1.address
      );
      expect(details1.farmerAddress).to.equal(farmer1.address);
      expect(details1.farmerName).to.equal(farmerName);
      expect(details1.description).to.equal(description);
      expect(details1.totalMint).to.equal(totalMint);
      expect(details1.availableMint).to.equal(totalMint);
      expect(details1.price).to.equal(price);
      expect(details1.expirationDate).to.equal(expirationDate);

      const details2 = await assetTokenization.getNftContractDetails(
        farmer2.address
      );
      expect(details2.farmerAddress).to.equal(farmer2.address);
      expect(details2.farmerName).to.equal(farmerName);
      expect(details2.description).to.equal(description);
      expect(details2.totalMint).to.equal(totalMint);
      expect(details2.availableMint).to.equal(totalMint);
      expect(details2.price).to.equal(price);
      expect(details2.expirationDate).to.equal(expirationDate);
    });
  });

  describe("buyNFT", function () {
    it("balance should be change", async function () {
      const { userAccounts, assetTokenization } = await loadFixture(
        deployContract
      );

      const farmerName = "farmer";
      const description = "description";
      const totalMint = BigNumber.from(5);
      const price = BigNumber.from(100);
      const expirationDate = BigNumber.from(Date.now())
        .div(1000) // in second
        .add(oneWeekInSecond); // one week later

      const farmer = userAccounts[0];
      const buyer = userAccounts[1];

      await assetTokenization
        .connect(farmer)
        .generateNftContract(
          farmerName,
          description,
          totalMint,
          price,
          expirationDate
        );

      await expect(
        assetTokenization
          .connect(buyer)
          .buyNft(farmer.address, { value: price } as Overrides)
      ).to.changeEtherBalances([farmer, buyer], [price, -price]);
    });
  });
});
```

`deployContract`関数は`farmNft`のテストで記入したものとほとんど同じものです。

`describe('basic', function () { ...`に続くテストでは、 `generateNftContract`によって`farmNft`が正しくデプロイされているのかを確認しております。
`generateNftContract`を2度呼び出し、 それぞれについて`getNftContractDetails`で`farmNft`の情報を取得し正しい値かどうかをテストしています。

`describe('buyNFT', function () { ...`に続くテストでは、 `buyNFT`を呼び出した際に正しい量のAVAXが購入者から農家へ支払われているのかを確認しています。
これは`farmNft`でも同じようなテストをしましたが、 `AssetTokenization`は購入者と`farmNft`を仲介してNFTの購入を行っているので、 ここではその仲介が正しく機能しているのかを確認しています。
<br />
<br />
※
`const { userAccounts, assetTokenization } = await ...`では分割代入という構文を用いています。
くわしくは[こちら](https://typescript-jp.gitbook.io/deep-dive/future-javascript/destructuring)に説明が載っています。

### ⭐ テストを実行しましょう

以下のコマンドを実行してください。

```
yarn test
```

以下のような表示がされたらテスト成功です！

![](/images/AVAX-Asset-Tokenization/section-1/1_1_4.png)

### 🌔 参考リンク

> [こちら](https://github.com/unchain-dev/AVAX-Asset-Tokenization)に本プロジェクトの完成形のレポジトリがあります。
> 期待通り動かない場合は参考にしてみてください。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#avalanche`で質問をしてください。

ヘルプをするときのフローが円滑になるので、 エラーレポートには下記の3点を記載してください ✨

```

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット

```

---

スマートコントラクトのベースとなるものが作成できました 🎉

次のsectionでは期限切れの`farmNft`を自動的に検知・削除処理をする方法も学びます！

`section1`のこれから先の作業は、 `AVAX-Asset-Tokenization/packages/contract`ディレクトリをルートディレクトリとして話を進めます。 🙌

### 👩‍💻 実装する内容の確認

本プロジェクトで作成するdappの内容を整理します。

農家とその収穫物を購入する購入者を対象に、NFTの作成と購入ができるアプリを作成します。

農家は収穫物を得る権利をトークンとして購入者に販売することで、 収穫物を直接取引する形態の他にサブスクリプション型など新たな収入形態を実現することができます。

購入者はトークンをNFTマーケットで転売したり、 トークンを所持している人のみ参加できるイベントに参加したりなど、 体験の幅が広がります。

今回作成するスマートコントラクトは2種類です。

**FarmNft**

NFTの機能を持つスマートコントラクトです。
農家1つに対して1つの`FarmNft`がデプロイされます。

このコントラクトには有効期限を設けます。
デプロイ時に指定された有効期限の日時を過ぎるとNFTのmintができなくなります。

**AssetTokenization**

フロントエンドとのデータのやりとり、 `FarmNft`のデプロイと管理をする機能を持つスマートコントラクトです。
`AssetTokenization`は1つで、 `FarmNft`は農家の数だけ存在することができます。

作成する2つのスマートコントラクトとフロントエンドとの関係図は以下です。

ここでは`AssetTokenization`がフロントエンドとやり取りをすることと、 複数の`FarmNft`を管理しているという関係性が掴めれば十分です！

![](/public/images/AVAX-Asset-Tokenization/section-1/1_1_2.png)

### 🥮 `FarmNft`コントラクトを作成する

まずはNFTの機能を持つ`FarmNft`コントラクトを作成します。

`contracts`ディレクトリの下に`FarmNft.sol`という名前のファイルを作成します。

Hardhatを使用する場合ファイル構造は非常に重要ですので、 注意する必要があります。
ファイル構造が下記のようになっていれば大丈夫です 😊

```diff
 contract/
  └── contracts/
+     └── FarmNft.sol
```

次に、 コードエディタでプロジェクトのコードを開きます。

`FarmNft.sol`の中に以下のコードを貼り付けてください。

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FarmNft is ERC721 {
    address public farmerAddress;  //このスマートコントラクトを作成した農家のアドレスを保存します。
    string public farmerName; // 農家の名前を保存します。
    string public description; // NFTに関する説明文を保存します。
    uint256 public totalMint; // mintできるNFTの総量を保存します。
    uint256 public availableMint; // 現在mintできる残りのNFTの数を保存します。
    uint256 public price; // 1つのNFTの値段を保存します。
    uint256 public expirationDate; // このコントラクト自体の有効期限を保存します。

    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds; // 次にmintされるNFTのidを保存します。

    constructor(
        address _farmerAddress,
        string memory _farmerName,
        string memory _description,
        uint256 _totalMint,
        uint256 _price,
        uint256 _expirationDate
    ) ERC721("Farm NFT", "FARM") {
        farmerAddress = _farmerAddress;
        farmerName = _farmerName;
        description = _description;
        totalMint = _totalMint;
        availableMint = _totalMint;
        price = _price;
        expirationDate = _expirationDate;
    }
}
```

もし、`hardhat.config.ts`の中に記載されているSolidityのバージョンが`0.8.17`でなかった場合は、`FarmNft.sol`の中身を`hardhat.config.ts`に記載されているバージョンに変更しましょう。

このコントラクトはNFTの機能を持たせたい + 監査の通ったコードを使用したいので、openzeppelinが提供している`ERC721`のコントラクトを継承しています。

```
contract FarmNft is ERC721
```

その下には、 このコントラクトの情報を保存できるように状態変数を用意しています。

constructorでは、 引数で受け取った値を元に状態変数に値を代入しています。

次に`FarmNft`の最後の行に以下のコードを貼り付けてください。

```solidity
    function mintNFT(address to) public payable {
        require(availableMint > 0, "Not enough nft");
        require(isExpired() == false, "Already expired");
        require(msg.value == price, "Incorrect amount of tokens");

        uint256 newItemId = _tokenIds.current();
        _safeMint(to, newItemId);
        _tokenIds.increment();
        availableMint--;

        (bool success, ) = (farmerAddress).call{value: msg.value}("");
        require(success, "Failed to withdraw AVAX");
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        name(),
                        ' -- NFT #: ',
                        Strings.toString(_tokenId),
                        '", "description": "',
                        description,
                        '", "image": "',
                        'https://i.imgur.com/GZCdtXu.jpg',
                        '"}'
                    )
                )
            )
        );
        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );
        return output;
    }

    function isExpired() public view returns (bool) {
        if (expirationDate < block.timestamp) {
            return true;
        } else {
            return false;
        }
    }

    function burnNFT() public {
        require(isExpired(), "still available");
        for (uint256 id = 0; id < _tokenIds.current(); id++) {
            _burn(id);
        }
    }

    function getTokenOwners() public view returns (address[] memory) {
        address[] memory owners = new address[](_tokenIds.current());
        for (uint256 index = 0; index < _tokenIds.current(); index++) {
            owners[index] = ownerOf(index);
        }
        return owners;
    }
```

1つずつ関数を見ていきましょう。

```solidity
    function mintNFT(address to) public payable {
        require(availableMint > 0, "Not enough nft");
        require(isExpired() == false, "Already expired");
        require(msg.value == price, "Incorrect amount of tokens");

        uint256 newItemId = _tokenIds.current();
        _safeMint(to, newItemId);
        _tokenIds.increment();
        availableMint--;

        (bool success, ) = (farmerAddress).call{value: msg.value}("");
        require(success, "Failed to withdraw AVAX");
    }
```

`mintNFT`はNFTの購入者(引数`to`に購入者のアドレスが渡されます)にmintする関数です。

はじめにmintのできる条件（mint上限を超えていないか、 期限切れではないか、NFTの価格分のトークンが付与されているか）を`require`により確認しています。

今回は実装を簡単にするため、NFTの購入にAvalancheのネイティブトークンである`AVAX`を使用します。
そのため、 `mintNFT`関数の呼び出しに付与された`AVAX`の量を`msg.value`により参照することができます。

次に、 `_safeMint`により`to`に対してNFTをmintします。
mint後にidのインクリメントやmint可能なNFTの数を更新します。

最後に、 農家に`AVAX`を送信します。

```solidity
    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        name(),
                        ' -- NFT #: ',
                        Strings.toString(_tokenId),
                        '", "description": "',
                        description,
                        '", "image": "',
                        'https://i.imgur.com/GZCdtXu.jpg',
                        '"}'
                    )
                )
            )
        );
        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );
        return output;
    }
```

`tokenURI`はJSON形式にしたNFTの情報をURIにして返却します。
openseaなどのNFTマーケットサービスは、 このtokenURI関数のデータをみています(詳しくは[こちら](https://docs.opensea.io/docs/metadata-standards#implementing-token-uri))。

トークン化された資産をNFTマーケットで取引するというような活用方法を想定したため`tokenURI`を実装していますが、 本プロジェクトで実際に利用することはありません。

```solidity
    function isExpired() public view returns (bool) {
        if (expirationDate < block.timestamp) {
            return true;
        } else {
            return false;
        }
    }
```

`isExpired`関数はコントラクトの有効期限が切れている場合true、 切れていない場合はfalseを返却する関数です。

> 📓 `block.timestamp`の使用について
> スマートコントラクトで時間の参照方法はいくつかあります。
> `block.timestamp`はブロックチェーンにブロックが書き込まれる際に、 バリデータによって操作ができるという懸念点がありますが、 操作のできる範囲は 30 秒ほどです。
> つまり 30 秒の範囲で実際とは差のある時間をコントラクト内のロジックに使用しても良いのなら`block.timestamp`を使用できます。
> 今回は簡易的な実装なのでこちらを使います。
> Ethereum のコントラクトでは、 `block.number`を使用した方法([参考](https://zoom-blc.com/solidity-time-logic))などもありますが、 Avalanche では定期的にブロックが生成されるという仕組みではないためこちらは使用できなそうです。
> 正確な情報を取得するためにはオラクルを使用する必要があります。

```solidity
    function burnNFT() public {
        require(isExpired(), "still available");
        for (uint256 id = 0; id < _tokenIds.current(); id++) {
            _burn(id);
        }
    }
```

`burnNFT`はコントラクトの期限が切れた後に既に発行されているNFTをバーンするために使用します。
発行済みのNFTの数だけループ処理でトークンをバーンします。

```solidity
    function getTokenOwners() public view returns (address[] memory) {
        address[] memory owners = new address[](_tokenIds.current());
        for (uint256 index = 0; index < _tokenIds.current(); index++) {
            owners[index] = ownerOf(index);
        }
        return owners;
    }
```

`getTokenOwners`は発行済みのNFTの所有者のアドレスを配列に詰めて返却する関数です。

農家が自らが作成したNFTの購入者を確認するために使用します。

### 🧪 テストを実装する

コントラクトを実装したのでテストを書きます。

テストコードは詳細な説明を省きますが、 コード自体は量が多いのでGit hub上からコピーして頂きたいです。

`test`ディレクトの下に`FarmNft.ts`を作成し、 [こちら](https://github.com/unchain-dev/AVAX-Asset-Tokenization/blob/main/packages/contract/test/FarmNft.ts)のファイル内のコードをコピーして貼り付けてください。

また、 ここでテストに関わる参考文献を紹介しますのでこの先の説明でわからない時は参考にしてください。

💁 hardhatで行うテストの記述方法に関しては[こちら](https://hardhat.org/hardhat-runner/docs/guides/test-contracts)。

💁 ファイル冒頭に`chai`というパッケージから`expect`をimportしています。`expect`の使い方に関しては[こちら](https://hardhat.org/hardhat-chai-matchers/docs/reference)。

💁 ファイル冒頭に`hardhat-network-helpers`というパッケージから`loadFixture`と`time`をimportしています。それぞれ使い方に関しては[こちら](https://hardhat.org/hardhat-network-helpers/docs/reference)。

それではテストコードを見ていきます。

以下のように、 各テストで呼び出される`deployContract`とその後に続くテストコードが記述されているかと思います。

```ts
describe('farmNft', function () {
  const oneWeekInSecond = 60 * 60 * 24 * 7;

  async function deployContract() {
    // コントラクトのデプロイ
  }

  // テストコード
});
```

`deployContract`内ではコントラクトのデプロイ作業を実装しています。
返り値にデプロイに使用したアカウント、 その他に使用できるアカウント、 デプロイしたコントラクトのオブジェクトがあります。
この関数は各テストで最初に呼ばれます。

次に以下のような形で`mint`に関するテストが4つ記述されているかと思います。

```ts
describe('mint', function () {
  it('NFT should be minted', async function () {
    // テストコード
  });

  it('balance should be change', async function () {
    // テストコード
  });

  it('revert when not enough nft to mint', async function () {
    // テストコード
  });

  it('revert when not enough currency to mint', async function () {
    // テストコード
  });
});
```

1つ目のテストではNFTをmintした後、 そのNFTの保有者が指定したアドレスと一致するかをテストしています。
2つ目のテストではmintNFTの実行時にAVAXの移動が正しく行われているのかを確認しています。
3つ目のテストでは上限までNFTがmintされている場合にmintNFTの呼び出しが失敗することを確認しています。
4つ目のテストでは関数呼び出しに付与したAVAXが足りない場合に、mintNFTの呼び出しが失敗することを確認しています。

その下の`describe('tokenURI', function () { ...`に続くテストでは、 `tokeURI`の挙動を確認しています。
`tokeURI`は本プロジェクトでは使用しないため、 返り値を出力することのみしています。

その下の`describe('burnNFT', function () { ...`に続くテストでは、 `burnNFT`の挙動を確認しています。
`mintNFT`後に`burnNFT`を呼び出し、NFTがバーンされていることを確認しています。

最後に`describe('getTokenOwners', function () { ...`に続くテストでは、 `getTokenOwners`の挙動を確認しています。
`mintNFT`後に`burnNFT`を呼び出し、NFTがバーンされていることを確認しています。

### ⭐ テストを実行しましょう

`contract`ディレクトリ直下で以下のコマンドを実行してください。

⚠️ 追加したテストコードではテストヘルパーパッケージのtimeを使用しています。
timeの使用はテスト環境全体の時間に影響するため、 今後複数のテストファイルを同時にテストすると予期せぬ挙動を起こす場合があります。よって以下のコマンドではテストをする対象ファイルを引数によって指定しています。

```
$ npx hardhat test test/FarmNft.ts
```

以下のような表示がされます。
実行したテスト名とそのテストがパスしたことがわかります。

![](/public/images/AVAX-Asset-Tokenization/section-1/1_1_3.png)

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

次のレッスンでは、 もう1つのスマートコントラクトを作成します！

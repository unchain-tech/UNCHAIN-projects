### 🪄 IPFS を使おう

IPFSに写真をアップロードできたところで、その写真を使ってNFTを作ってみましょう。

`Web3Mint.sol`を下記のように更新してみましょう。

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
//OpenZeppelinが提供するヘルパー機能をインポートします。
import "@openzeppelin/contracts/utils/Counters.sol";
import "./libraries/Base64.sol";
import "hardhat/console.sol";

contract Web3Mint is ERC721 {
    struct NftAttributes {
        string name;
        string imageURL;
    }

    NftAttributes[] Web3Nfts;

    using Counters for Counters.Counter;
    // tokenIdはNFTの一意な識別子で、0, 1, 2, .. N のように付与されます。
    Counters.Counter private _tokenIds;

    constructor() ERC721("NFT", "nft") {
        console.log("This is my NFT contract.");
    }

    // ユーザーが NFT を取得するために実行する関数です。
    function mintIpfsNFT(string memory name, string memory imageURI) public {
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        Web3Nfts.push(NftAttributes({name: name, imageURL: imageURI}));
        console.log(
            "An NFT w/ ID %s has been minted to %s",
            newItemId,
            msg.sender
        );
        _tokenIds.increment();
    }

    function tokenURI(
        uint256 _tokenId
    ) public view override returns (string memory) {
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        Web3Nfts[_tokenId].name,
                        " -- NFT #: ",
                        Strings.toString(_tokenId),
                        '", "description": "An epic NFT", "image": "ipfs://',
                        Web3Nfts[_tokenId].imageURL,
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
}
```

解説していきましょう

```solidity
// Web3Mint.sol
import "./libraries/Base64.sol";
```

`tokenURI`には、NFTデータをJSON形式で渡さなければいけません。
Base64のやり方は、[project3](https://app.unchain.tech/learn/ETH-NFT-Game/ja/1/5/) のやり方を参考にしています。

なぜ、Base64で渡す必要があるのかを調べてみてください!

まずは`packages/contract/contracts`ディレクトリの直下に`libraries`ディレクトリを作成します。

その`libraries`ディレクトリの下に`Base64.sol`ファイルを作成して、下記のコードを貼り付けてください

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

/// [MIT License]
/// @title Base64
/// @notice Provides a function for encoding some bytes in base64
/// @author Brecht Devos <brecht@loopring.org>
library Base64 {
    bytes internal constant TABLE =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    /// @notice Encodes some bytes to the base64 representation
    function encode(bytes memory data) internal pure returns (string memory) {
        uint256 len = data.length;
        if (len == 0) return "";

        // multiply by 4/3 rounded up
        uint256 encodedLen = 4 * ((len + 2) / 3);

        // Add some extra buffer at the end
        bytes memory result = new bytes(encodedLen + 32);

        bytes memory table = TABLE;

        assembly {
            let tablePtr := add(table, 1)
            let resultPtr := add(result, 32)

            for {
                let i := 0
            } lt(i, len) {

            } {
                i := add(i, 3)
                let input := and(mload(add(data, i)), 0xffffff)

                let out := mload(add(tablePtr, and(shr(18, input), 0x3F)))
                out := shl(8, out)
                out := add(
                    out,
                    and(mload(add(tablePtr, and(shr(12, input), 0x3F))), 0xFF)
                )
                out := shl(8, out)
                out := add(
                    out,
                    and(mload(add(tablePtr, and(shr(6, input), 0x3F))), 0xFF)
                )
                out := shl(8, out)
                out := add(
                    out,
                    and(mload(add(tablePtr, and(input, 0x3F))), 0xFF)
                )
                out := shl(224, out)

                mstore(resultPtr, out)

                resultPtr := add(resultPtr, 4)
            }

            switch mod(len, 3)
            case 1 {
                mstore(sub(resultPtr, 2), shl(240, 0x3d3d))
            }
            case 2 {
                mstore(sub(resultPtr, 1), shl(248, 0x3d))
            }

            mstore(result, encodedLen)
        }

        return string(result);
    }
}
```

次は、下記のコードを解説します。

```solidity
// Web3Mint.sol
struct NftAttributes {
    string name;
    string imageURL;
}

NftAttributes[] Web3Nfts;
```

最初に書いていたNFTのデータを保存するための配列がこれです。
この配列の番号と、NFTの識別子の番号を揃えます。

例えば、0番目の識別子のNFTのデータは、`Web3Nfts`の配列の0番目に入るようにするといったような感じです。

次はmintIpfsNFT関数です。

```solidity
// Web3Mint.sol
function mintIpfsNFT(string memory name,string memory imageURI) public {
    uint256 newItemId = _tokenIds.current();
    _safeMint(msg.sender,newItemId);
    Web3Nfts.push(NftAttributes({
        name: name,
        imageURL: imageURI
    }));
    console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);
    _tokenIds.increment();
}
```

先程のコードから`setTokenURI`関数が消え、代わりに下記のコードが追加されています。

```solidity
// Web3Mint.sol
Web3Nfts.push(NftAttributes({
    name: name,
    imageURL: imageURI
}));
```

`mintIpfsNFT`関数が引数で、NFTにしたいもののデータを受け取り、ここで配列に加えます。`tokenId`の値と、配列の番号は同じになっています。

次は`tokenURI`関数です。

```solidity
// Web3Mint.sol
function tokenURI(uint256 _tokenId) public override view returns(string memory) {
    string memory json = Base64.encode(
        bytes(
            string(
                abi.encodePacked(
                    '{"name": "',
                    Web3Nfts[_tokenId].name,
                    ' -- NFT #: ',
                    Strings.toString(_tokenId),
                    '", "description": "An epic NFT", "image": "ipfs://',
                    Web3Nfts[_tokenId].imageURL,'"}'
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

openseaなどのNFTマーケットサービスは、この`tokenURI`関数のデータをみています。
詳しく知りたい方は [こちら](https://docs.opensea.io/docs/metadata-standards#implementing-token-uri) をごらんください。

> For OpenSea to pull in off-chain metadata for ERC721 and ERC1155 assets, your contract will need to return a URI where we can find the metadata. > To find this URI, we use the tokenURI method in ERC721 and the uri method in ERC1155

`tokenURI`関数はERC721からoverrideしている関数で、外部からでも`_tokenId`をいれればreturnを返してくれる関数でないといけないので、引数などからNFTのメタデータを送ることはできません。なので、`tokenId`だけを与えられて、NFTのmetadataを返せるようにしなければならないです。
そこで、配列を使おうという発想になっています。

### 🧙‍♂️ テストを作成・実行する

`scripts/run.js`でテストを行ってもいいのですが、あれはローカル環境にデプロイしているためやはり少し時間が掛かるので、自分でテストコードを書くときには、ミスをすることも多いでしょうし、下記のようにテストを行うことをおすすめします。

ここまでの作業でコントラクトには基本機能としてNFTのmint機能が追加されました。

この機能をテストスクリプトに記述してテストを実効してみましょう。
ではpackages/contract/testに`test.js`という名前でファイルを作成して、以下のように記述しましょう。

```javascript
const { assert } = require('chai');
const { ethers } = require('hardhat');

describe('Web3Mint', () => {
  it('Should return the nft', async () => {
    const Mint = await ethers.getContractFactory('Web3Mint');
    const mintContract = await Mint.deploy();
    await mintContract.deployed();

    const [owner, addr1] = await ethers.getSigners();

    const nftName = 'poker';
    const ipfsCID =
      'bafkreievxssucnete4vpthh3klylkv2ctll2sk2ib24jvgozyg62zdtm2y';

    // 違うアドレスでNFTをmint
    await mintContract.connect(owner).mintIpfsNFT(nftName, ipfsCID);
    await mintContract.connect(addr1).mintIpfsNFT(nftName, ipfsCID);

    // mintしたアドレスによって違うNFTが作成されていることをテスト
    assert.equal(
      await mintContract.tokenURI(0),
      'data:application/json;base64,eyJuYW1lIjogInBva2VyIC0tIE5GVCAjOiAwIiwgImRlc2NyaXB0aW9uIjogIkFuIGVwaWMgTkZUIiwgImltYWdlIjogImlwZnM6Ly9iYWZrcmVpZXZ4c3N1Y25ldGU0dnB0aGgza2x5bGt2MmN0bGwyc2syaWIyNGp2Z296eWc2MnpkdG0yeSJ9',
    );
    assert.equal(
      await mintContract.tokenURI(1),
      'data:application/json;base64,eyJuYW1lIjogInBva2VyIC0tIE5GVCAjOiAxIiwgImRlc2NyaXB0aW9uIjogIkFuIGVwaWMgTkZUIiwgImltYWdlIjogImlwZnM6Ly9iYWZrcmVpZXZ4c3N1Y25ldGU0dnB0aGgza2x5bGt2MmN0bGwyc2syaWIyNGp2Z296eWc2MnpkdG0yeSJ9',
    );
  });
});
```

次に、`Web3Mint`コントラクト内で定義していた`console.log`を削除しましょう。

import文を削除します。

```solidity
// === 下記を削除 ===
import "hardhat/console.sol";
```

constructor関数内の`console.log`を削除します。

```solidity
    // === 下記を削除 ===
    console.log('This is my NFT contract.');
```

`mintIpfsNFT`関数内の`console.log`を削除します。

```solidity
        // === 下記を削除 ===
        console.log(
            "An NFT w/ ID %s has been minted to %s",
            newItemId,
            msg.sender
        );
```

では下のコマンドを実行してみましょう。

```
yarn test
```

結果として下のような結果が出力されていればテスト成功です！

```
Compiled 1 Solidity file successfully


  Web3Mint
    ✔ Should return the nft (904ms)


  1 passing (905ms)

```

**brave**ブラウザでは、`ipfs://bafkreievxssucnete4vpthh3klylkv2ctll2sk2ib24jvgozyg62zdtm2y`のままブラウザに貼れば表示され、他のブラウザの場合は`https://ipfs.io/ipfs/自分のCID`のようにして、画像を確認してみましょう!

最終確認として`run.js`でも確認してみましょう。

`run.js`を下記に更新してください。

```javascript
const main = async () => {
  // コントラクトがコンパイルします
  // コントラクトを扱うために必要なファイルが `artifacts` ディレクトリの直下に生成されます。
  const nftContractFactory = await hre.ethers.getContractFactory('Web3Mint');
  // Hardhat がローカルの Ethereum ネットワークを作成します。
  const nftContract = await nftContractFactory.deploy();
  // コントラクトが Mint され、ローカルのブロックチェーンにデプロイされるまで待ちます。
  await nftContract.deployed();
  console.log('Contract deployed to:', nftContract.address);

  let txn = await nftContract.mintIpfsNFT(
    'poker',
    'bafybeibewfzz7w7lhm33k2rmdrk3vdvi5hfrp6ol5vhklzzepfoac37lry'
  );
  await txn.wait();
  let returnedTokenUri = await nftContract.tokenURI(0);
  console.log('tokenURI:', returnedTokenUri);
};

// エラー処理を行っています。
const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
```

`mintIpfsNft`関数と`tokenURI`関数がしっかりとできているかを確認しましょう。

スマートコントラクトの関数がしっかりと機能していることがわかったので、テストネットにデプロイしましょう。

`deploy.js`を下記のように更新して`yarn contract deploy`をしてください。

```javascript
const main = async () => {
  // コントラクトがコンパイルします
  // コントラクトを扱うために必要なファイルが `artifacts` ディレクトリの直下に生成されます。
  const nftContractFactory = await hre.ethers.getContractFactory('Web3Mint');
  // Hardhat がローカルの Ethereum ネットワークを作成します。
  const nftContract = await nftContractFactory.deploy();
  // コントラクトが Mint され、ローカルのブロックチェーンにデプロイされるまで待ちます。
  await nftContract.deployed();
  console.log('Contract deployed to:', nftContract.address);
};

// エラー処理を行っています。
const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
```

このコントラクトアドレスは今後も使用するので保存しておいてください。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#ethereum`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

おめでとうございます!Lesson2は終了です。あなたのIPFSにあげた画像をコミュニティで共有してみましょう!

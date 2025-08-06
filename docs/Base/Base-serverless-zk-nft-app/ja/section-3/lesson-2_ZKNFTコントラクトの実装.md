---
title: "ZKNFTコントラクトの実装"
---

このレッスンでは、前のレッスンで定義した`IPasswordHashVerifier`インタフェースを利用して、メインとなる`ZKNFT.sol`コントラクトをステップバイステップで実装します。

## 뼈대となるコードの作成

まず、`pkgs/backend/contracts/ZKNFT.sol`ファイルを作成し、基本的な構造を記述します。
// ... existing code ...
import "base64-sol/base64.sol";
import "./interface/IPasswordHashVerifier.sol";

contract ZKNFT is ERC721 {
    // ここにコードを実装していきます
}
```

### コード解説
- `import "@openzeppelin/contracts/token/ERC721/ERC721.sol"`: OpenZeppelinのERC721コントラクトをインポートします。これにより、NFTの標準的な機能を簡単に利用できます。
- `import "base64-sol/base64.sol"`: NFTのメタデータをオンチェーンで生成するために、Base64エンコーディングライブラリをインポートします。
- `import "./interface/IPasswordHashVerifier.sol"`: 前のレッスンで作成した検証コントラクトのインタフェースをインポートします。
- `contract ZKNFT is ERC721`: `ERC721`を継承して、`ZKNFT`コントラクトを定義します。

## 📦 状態変数と定数の定義

次に、コントラクトが使用する状態変数、定数、そしてコンストラクタを定義します。
// ... existing code ...
// ... existing code ...
    function tokenURI(
        uint256 _tokenId
    ) public view override returns (string memory) {
        require(_tokenId < _nextTokenId, "ERC721: URI query for nonexistent token");

        string memory json = Base64.encode(
            bytes(
                string.concat(
                    '{"name": "',
                    nftName,
                    '", "description": "',
                    description,
                    '", "image": "',
                    nftImage,
                    '"}'
                )
            )
        );
        return string(abi.encodePacked("data:application/json;base64,", json));
    }
}
```

これで`ZKNFT.sol`のすべての実装が完了しました。次のレッスンでは、このコントラクトをテストし、デプロイするスクリプトを作成します。

## 뼈대となるコードの作成

まず、`pkgs/backend/contracts/ZKNFT.sol`ファイルを作成し、基本的な構造を記述します。

```solidity
// pkgs/backend/contracts/ZKNFT.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "base64-sol/base64.sol";
import "./interface/IPasswordHashVerifier.sol";

contract ZKNFT is ERC721 {
    // ここにコードを実装していきます
}
```

### コード解説
- `import "@openzeppelin/contracts/token/ERC721/ERC721.sol"`: OpenZeppelinのERC721コントラクトをインポートします。これにより、NFTの標準的な機能を簡単に利用できます。
- `import "base64-sol/base64.sol"`: NFTのメタデータをオンチェーンで生成するために、Base64エンコーディングライブラリをインポートします。
- `import "./interface/IPasswordHashVerifier.sol"`: 前のレッスンで作成した検証コントラクトのインタフェースをインポートします。
- `contract ZKNFT is ERC721`: `ERC721`を継承して、`ZKNFT`コントラクトを定義します。

## 📦 状態変数と定数の定義

次に、コントラクトが使用する状態変数、定数、そしてコンストラクタを定義します。

```solidity
// ... import文 ...

contract ZKNFT is ERC721 {
    // 検証コントラクトのインスタンスを格納する不変変数
    IPasswordHashVerifier public immutable verifier;

    // 次にミントされるNFTのIDを追跡するカウンター
    uint256 private _nextTokenId;

    // NFTメタデータ用の定数
    string private constant nftName = "UNCHAIN ZK NFT";
    string private constant description = "This is a ZK NFT issued by UNCHAIN.";
    string private constant nftImage = "https://unchain.tech/images/UNCHAIN-logo-seal.png";

    // コンストラクタ
    constructor(address _verifier) ERC721("ZK NFT", "ZNFT") {
        verifier = IPasswordHashVerifier(_verifier);
    }

    // ... 関数の実装 ...
}
```

### コード解説
- `IPasswordHashVerifier public immutable verifier`: 検証コントラクトのアドレスを保持する変数です。`immutable`キーワードにより、コンストラクタで一度だけ設定され、その後は変更できなくなります。これにより、ガス代を節約し、セキュリティを向上させます。
- `_nextTokenId`: ミントされるNFTのIDを管理するためのプライベート変数です。
- `nftName`, `description`, `nftImage`: NFTのメタデータとしてオンチェーンで保存される情報です。
- `constructor(address _verifier)`: コントラクトがデプロイされるときに、検証コントラクトのアドレス（`_verifier`）を受け取ります。`ERC721("ZK NFT", "ZNFT")`の部分で、NFTの名前とシンボルを初期化しています。

## 🔐 NFTミント関数の実装

プロジェクトの核心機能である`safeMint`関数を実装します。この関数は、ゼロ知識証明を検証し、検証が成功した場合にのみNFTをミントします。

```solidity
// ... 状態変数とコンストラクタ ...

    function safeMint(
        address to,
        uint256[2] calldata _pA,
        uint256[2][2] calldata _pB,
        uint256[2] calldata _pC,
        uint256[1] calldata _pubSignals
    ) public {
        // ZK証明を検証
        require(verifier.verifyProof(_pA, _pB, _pC, _pubSignals), "Invalid proof");

        // 次のトークンIDを取得
        uint256 tokenId = _nextTokenId++;
        // NFTをミント
        _safeMint(to, tokenId);
    }

// ... tokenURI関数の実装 ...
```

### コード解説
- `function safeMint(...)`: フロントエンドから呼び出される関数です。引数として、ミント先の`to`アドレスと、証明データ（`_pA`, `_pB`, `_pC`, `_pubSignals`）を受け取ります。
- `require(verifier.verifyProof(...), "Invalid proof")`: `verifier`インスタンスの`verifyProof`関数を呼び出し、証明を検証します。もし`verifyProof`が`false`を返した場合、トランザクションは`"Invalid proof"`というエラーメッセージと共に失敗します。
- `_nextTokenId++`: 証明が有効な場合、トークンIDをインクリメントします。
- `_safeMint(to, tokenId)`: OpenZeppelinの`ERC721`コントラクトが提供する内部関数を呼び出し、新しいNFTを指定された`to`アドレスにミントします。

## 🖼️ オンチェーンメタデータ生成関数の実装

最後に、NFTのメタデータを返す`tokenURI`関数を実装します。このプロジェクトでは、外部のストレージ（IPFSなど）を使わず、すべての情報をオンチェーンで生成します。

```solidity
// ... safeMint関数の実装 ...

    function totalSupply() public view returns (uint256) {
        return _nextTokenId;
    }

    function tokenURI(
        uint256 _tokenId
    ) public pure override returns (string memory) {
        require(_tokenId == 0, "nonexistent token");

        string memory json = Base64.encode(
            bytes(
                string.concat(
                    '{"name": "',
                    nftName,
                    '", "description": "',
                    description,
                    '", "image": "',
                    nftImage,
                    '"}'
                )
            )
        );
        return string(abi.encodePacked("data:application/json;base64,", json));
    }
}
```

### コード解説
- `totalSupply()`: これまでにミントされたNFTの総数を返すシンプルな関数です。
- `function tokenURI(...)`: `ERC721`標準で定められている関数で、特定の`_tokenId`に対するメタデータURIを返します。`override`キーワードは、親コントラクト（`ERC721`）の関数を上書きしていることを示します。
- `require(_tokenId == 0, "nonexistent token")`: このプロジェクトでは、簡単化のため、各ユーザーは1つのNFTしかミントできない仕様にしています。そのため、`tokenId`が`0`以外の場合はエラーとします。
- `string.concat(...)`: NFTの名前、説明、画像URLを含むJSON文字列を組み立てます。
- `Base64.encode(...)`: 組み立てたJSON文字列をBase64形式にエンコードします。
- `string(abi.encodePacked("data:application/json;base64,", json))`: エンコードした文字列を、標準的なデータURI形式にして返します。

## ✅ 完成版コード

ここまでの実装をまとめた、`pkgs/backend/contracts/ZKNFT.sol`の最終的なコードは以下のようになります。

```solidity
// pkgs/backend/contracts/ZKNFT.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "base64-sol/base64.sol";
import "./interface/IPasswordHashVerifier.sol";

contract ZKNFT is ERC721 {
    // 検証コントラクトのインスタンスを格納する不変変数
    IPasswordHashVerifier public immutable verifier;

    // 次にミントされるNFTのIDを追跡するカウンター
    uint256 private _nextTokenId;

    // NFTメタデータ用の定数
    string private constant nftName = "UNCHAIN ZK NFT";
    string private constant description = "This is a ZK NFT issued by UNCHAIN.";
    string private constant nftImage = "https://unchain.tech/images/UNCHAIN-logo-seal.png";

    // コンストラクタ
    constructor(address _verifier) ERC721("ZK NFT", "ZNFT") {
        verifier = IPasswordHashVerifier(_verifier);
    }

    function safeMint(
        address to,
        uint256[2] calldata _pA,
        uint256[2][2] calldata _pB,
        uint256[2] calldata _pC,
        uint256[1] calldata _pubSignals
    ) public {
        // ZK証明を検証
        require(verifier.verifyProof(_pA, _pB, _pC, _pubSignals), "Invalid proof");

        // 次のトークンIDを取得
        uint256 tokenId = _nextTokenId++;
        // NFTをミント
        _safeMint(to, tokenId);
    }

    function totalSupply() public view returns (uint256) {
        return _nextTokenId;
    }

    function tokenURI(
        uint256 _tokenId
    ) public pure override returns (string memory) {
        require(_tokenId == 0, "nonexistent token");

        string memory json = Base64.encode(
            bytes(
                string.concat(
                    '{"name": "',
                    nftName,
                    '", "description": "',
                    description,
                    '", "image": "',
                    nftImage,
                    '"}'
                )
            )
        );
        return string(abi.encodePacked("data:application/json;base64,", json));
    }
}
```

これで`ZKNFT.sol`のすべての実装が完了しました。次のレッスンでは、このコントラクトをテストし、デプロイするスクリプトを作成します。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#zk`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット

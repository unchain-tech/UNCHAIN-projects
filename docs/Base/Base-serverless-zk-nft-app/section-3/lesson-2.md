---
title: "🖼️ ZKNFTコントラクトの実装"
---

このレッスンでは、前のレッスンで定義した`IPasswordHashVerifier`インタフェースを利用して、メインとなる`ZKNFT.sol`コントラクトをステップバイステップで実装します。

ゼロ知識証明の検証とNFTの発行という、2つの重要な要素を組み合わせた魔法のようなコントラクトを一緒に作り上げましょう！

## 🏗️ 骨格となるコードの作成

まず、`pkgs/backend/contracts/ZKNFT.sol`ファイルを作成し、コントラクトの基本的な骨格（ボイラープレート）を記述します。

```solidity
// pkgs/backend/contracts/ZKNFT.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "base64-sol/base64.sol";
import "./interface/IPasswordHashVerifier.sol";

/**
 * @title ZKNFT
 * @dev ゼロ知識証明を利用してNFTをミントするERC721コントラクト。
 * 正しいパスワードを知っている証明を提出したユーザーのみがミントできます。
 */
contract ZKNFT is ERC721 {
    // ここに魔法のコードを実装していきます ✨
}
```

### 🔍 コード解説
- `import "@openzeppelin/contracts/token/ERC721/ERC721.sol"`:   
    NFTの標準規格である**ERC721**を簡単に実装するための、OpenZeppelinライブラリの優れものです。  
    
    NFTの所有権管理や転送機能などがすでに組み込まれています。

- `import "base64-sol/base64.sol"`:   
    NFTのメタデータ（名前、説明、画像など）を、外部サーバーに頼らず**オンチェーン**で直接生成するために、Base64エンコーディングライブラリをインポートします。これにより、完全に自律したNFTが実現できます。

- `import "./interface/IPasswordHashVerifier.sol"`:  
    前のレッスンで作成した、検証コントラクトとの「約束事」であるインタフェースをインポートします。

- `contract ZKNFT is ERC721`:   
    `ERC721`コントラクトを**継承**して、`ZKNFT`コントラクトを定義します。  
    これにより、`ZKNFT`は`ERC721`のすべての機能を引き継ぎます。

## 📦 状態変数とコンストラクタの定義

次に、コントラクトが内部で保持するデータ（**状態変数**）と、コントラクトがデプロイされる時に一度だけ実行される初期化処理（**コンストラクタ**）を定義します。

```solidity
// ... import文 ...

contract ZKNFT is ERC721 {
    // === 状態変数と定数 ===

    // 検証コントラクトのアドレスを格納する不変変数。一度設定したら変更不可！
    IPasswordHashVerifier public immutable verifier;

    // 次にミントされるNFTのIDを追跡するためのカウンター
    uint256 private _nextTokenId;

    // NFTメタデータ用の定数。ブロックチェーン上に直接書き込まれます。
    string private constant nftName = "UNCHAIN ZK NFT";
    string private constant description = "This is a ZK NFT issued by UNCHAIN.";
    string private constant nftImage = "https://unchain.tech/images/UNCHAIN-logo-seal.png";

    // === コンストラクタ ===

    /**
     * @dev コントラクトの初期化
     * @param _verifier 検証コントラクトのデプロイ済みアドレス
     */
    constructor(address _verifier) ERC721("ZK NFT", "ZNFT") {
        // 検証コントラクトのアドレスを状態変数に設定
        verifier = IPasswordHashVerifier(_verifier);
    }

    // ... 関数の実装はここから ...
}
```

### 🔍 コード解説
- `IPasswordHashVerifier public immutable verifier`:   
    `immutable`キーワードは、変数が**コンストラクタ内でのみ設定可能**で、その後は変更できないことを意味します。
    
    これにより、検証コントラクトのアドレスが後から悪意を持って変更されることを防ぎ、セキュリティを高めます。

- `uint256 private _nextTokenId`:   
    ミントされるNFTのIDを管理します。`private`なので、このコントラクト内部からしかアクセスできません。

- `constructor(address _verifier) ERC721("ZK NFT", "ZNFT")`:   
    コンストラクタはデプロイ時に`_verifier`（検証コントラクトのアドレス）を受け取ります。
    
    同時に、`ERC721`のコンストラクタを呼び出して、このNFTコレクションの名前（"ZK NFT"）とシンボル（"ZNFT"）を設定しています。

## 🔐 NFTミント関数の実装

いよいよ、このコントラクトの核心機能である`safeMint`関数を実装します。  
この関数が、ゼロ知識証明の検証とNFTのミントを結びつけます。

```solidity
// ... 状態変数とコンストラクタ ...

    // === 関数 ===

    /**
     * @dev ゼロ知識証明を検証し、成功した場合に新しいNFTをミントします。
     * @param _to NFTを受け取るアドレス
     * @param a Groth16証明のコンポーネント
     * @param b Groth16証明のコンポーネント
     * @param c Groth16証明のコンポーネント
     * @param _publicSignals 証明の公開入力（パスワードのハッシュ値）
     */
    function safeMint(
        address _to,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[1] memory _publicSignals
    ) public {
        // ステップ1: ZK証明の検証
        // `verifier`コントラクトの`verifyProof`関数を呼び出す
        require(
            verifier.verifyProof(a, b, c, _publicSignals),
            "ZKNFT: Invalid proof"
        );

        // ステップ2: NFTのミント
        // トークンIDを取得
        uint256 tokenId = _nextTokenId;
        // カウンターをインクリメントして次のミントに備える
        _nextTokenId++;
        // ERC721の`_safeMint`関数を呼び出して、実際にNFTを発行
        _safeMint(_to, tokenId);
    }
// ... tokenURI関数の実装 ...
```

### 🔍 コード解説
- `require(verifier.verifyProof(...), "ZKNFT: Invalid proof")`:  
     **ここが最重要ポイントです！** 
     
     `verifier`コントラクトに証明データ（`a`, `b`, `c`, `_publicSignals`）を渡し、`verifyProof`関数を呼び出します。この関数が`false`を返した場合（＝証明が無効な場合）、`require`文が失敗し、トランザクションはここで停止します。エラーメッセージ "ZKNFT: Invalid proof" が返され、NFTはミントされません。

- `_nextTokenId++`:   
    ミントが成功するたびに、次のトークンIDを1つ増やします。

- `_safeMint(_to, tokenId)`:  
    OpenZeppelinの`ERC721`が提供する内部関数です。  
    `_to`で指定されたアドレスに、`tokenId`を持つ新しいNFTを安全に発行します。

## 🎨 オンチェーンメタデータ関数の実装

最後に、各NFTのメタデータを返す`tokenURI`関数を実装します。  
これにより、OpenSeaなどのマーケットプレイスがNFTの情報を表示できるようになります。

```solidity
// ... safeMint関数の実装 ...

    /**
     * @dev 指定されたトークンIDのURIを返します。
     * メタデータはオンチェーンで動的に生成されます。
     * @param _tokenId トークンID
     * @return string メタデータを含むData URI
     */
    function tokenURI(
        uint256 _tokenId
    ) public view override returns (string memory) {
        // 存在しないトークンIDが指定された場合はエラー
        require(_tokenId < _nextTokenId, "ERC721: URI query for nonexistent token");

        // メタデータJSONを文字列として構築
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
        // Base64エンコードされたJSONをData URI形式で返す
        return string(abi.encodePacked("data:application/json;base64,", json));
    }
}
```
### 🔍 コード解説

- `override`:   
    この関数は、親コントラクトである`ERC721`にすでに定義されている`tokenURI`関数を**上書き**していることを示します。

- `Base64.encode(...)`:  
    `nftName`, `description`, `nftImage`といった定数を使ってJSON文字列を組み立て、それをBase64形式にエンコードします。

- `string(abi.encodePacked("data:application/json;base64,", json))`:   
    標準的な**Data URI**形式の文字列を返します。これにより、外部のサーバーに依存することなく、すべての情報がブロックチェーン上で完結します。

---

お疲れ様でした！ これで`ZKNFT.sol`のすべての実装が完了しました。スマートコントラクトがゼロ知識証明を検証し、その結果に基づいてNFTを発行するという、非常に強力な仕組みをコードに落とし込むことができました。

次のレッスンでは、このコントラクトをテストし、デプロイするスクリプトを作成します。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#zk`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット

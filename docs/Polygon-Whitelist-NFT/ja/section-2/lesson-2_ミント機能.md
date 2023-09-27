### ホワイトリスト内のアドレスのみがミントできるNFTコントラクトを書く

このdAppスマートコントラクトには、BAYCと同じERC 721コントラクトを選択します。コントラクトにホワイトリスト制限機能を追加していきましょう。

```solidity
    address public owner;

    constructor(address[] memory initialAddresses) {
        owner = msg.sender;
		...
    }
    
    function addToWhitelist(address _address) public {
        // Check if the user is the owner
        require(owner == msg.sender, "Caller is not the owner");
        ...
    }
```

Whitelistコントラクトでは、オーナーアドレスを設定し、`require`メソッドを使用してホワイトリストに追加または削除する機能がコントラクトのデプロイヤーによってのみ呼び出されるようにします。

ここでは、より安全で効率的な方法である[OpenZeppelin](https://www.openzeppelin.com/about)スマートコントラクトライブラリを使用します。

[OpenZeppelin](https://www.openzeppelin.com/about)の`Ownable.sol`を使ってオーナー権限機能を実装します。

デフォルトでは、Ownableコントラクトのオーナーはそれをデプロイしたアカウントになります。
- Ownableは次のことも可能です：
  - オーナーのアカウントの所有権を新しいアカウントに移譲する
  - 所有権を放棄する： オーナーがこの管理権限を放棄する、コントラクトの初期管理フェーズ後の一般的なパターンで、コントラクトをより分散化させます。

さらに、ERC721コントラクトの拡張である[ERC721 Enumerable](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721Enumerable.sol)を使用します。これには、ERC721のすべての機能に加えて、追加の実装が含まれています。

- ERC721 Enumerableは、コントラクト内のすべてのtokenIdsおよびコントラクト内の指定されたアドレスが保持するtokenIdsを追跡するのに役立ちます。
- これには、`tokenOfOwnerByIndex`などの便利な[関数](https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721Enumerable) がいくつか実装されています。

それでは、`contracts`ディレクトリの下に`interfaces`というフォルダを作成しましょう。

![image-20230222235209219](/public/images/Polygon-Whitelist-NFT/section-2/2_2_1.png)

`interfaces`フォルダ内に、`IWhitelist.sol`というスマートコントラクトファイルを作成します。

> 注意：インターフェースのみを含むSolidityファイルは、通常、それらがインターフェースであることを示すための接頭辞`I`を持っています。

![image-20230222235330497](/public/images/Polygon-Whitelist-NFT/section-2/2_2_2.png)

`IWhitelist.sol`に次のコードを記述します。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IWhitelist {
    function whitelistedAddresses(address) external view returns (bool);
}
```

これはインタフェースファイルです。他のスマートコントラクトが`Whitelist.sol`内の`whitelistedAddresses`関数を呼び出すのを便利にします。これにより、アドレスがホワイトリストに登録されているかどうかを確認できます。

次に、`Shield.sol`を`contracts`フォルダ内に作成します。

![image-20230223091938319](/public/images/Polygon-Whitelist-NFT/section-2/2_2_3.png)

`Shield.sol`に次のコードを記述します。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IWhitelist.sol";

contract Shield is ERC721Enumerable, Ownable {
    /**
      * @dev _baseTokenURI for computing {tokenURI}. If set, the resulting URI for each
      * token will be the concatenation of the `baseURI` and the `tokenId`.
      */
    string private _baseTokenURI;

    //  price is the price of one Shield NFT
    uint256 public price = 0.01 ether;

    // paused is used to pause the contract in case of an emergency
    bool public paused;

    // max number of Shield NFT
    uint256 public maxTokenIds = 4;

    // total number of tokenIds minted
    uint256 public tokenIds;

    // Whitelist contract instance
    IWhitelist private _whitelist;

    modifier onlyWhenNotPaused {
        require(!paused, "Contract currently paused");
        _;
    }

    /**
      * @dev ERC721 constructor takes in a `name` and a `symbol` to the token collection.
      * name in our case is `Shields` and symbol is `CS`.
      * Constructor for Shields takes in the baseURI to set _baseTokenURI for the collection.
      * It also initializes an instance of whitelist interface.
      */
    constructor (string memory baseURI, address whitelistContract) ERC721("ChainIDE Shields", "CS") {
        _baseTokenURI = baseURI;
        _whitelist = IWhitelist(whitelistContract);
    }


    /**
      * @dev presaleMint allows a user to mint one NFT per transaction during the presale.
      */
    function mint() public payable onlyWhenNotPaused {
        require(_whitelist.whitelistedAddresses(msg.sender), "You are not whitelisted");
        require(tokenIds < maxTokenIds, "Exceeded maximum Shields supply");
        require(msg.value >= price, "Ether sent is not correct");
        tokenIds += 1;
        //_safeMint is a safer version of the _mint function as it ensures that
        // if the address being minted to is a contract, then it knows how to deal with ERC721 tokens
        // If the address being minted to is not a contract, it works the same way as _mint
        _safeMint(msg.sender, tokenIds);
    }

    /**
    * @dev _baseURI overides the Openzeppelin's ERC721 implementation which by default
    * returned an empty string for the baseURI
    */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    /**
    * @dev setPaused makes the contract paused or unpaused
      */
    function setPaused(bool val) public onlyOwner {
        paused = val;
    }

    /**
    * @dev withdraw sends all the ether in the contract
    * to the owner of the contract
      */
    function withdraw() public onlyOwner  {
        address _owner = owner();
        uint256 amount = address(this).balance;
        (bool sent, ) =  _owner.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }
}
```

心配いりません、このコントラクトを順に解説していきましょう。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IWhitelist.sol";

contract Shield is ERC721Enumerable, Ownable {
    ...
    }
```

`ERC721Enumerable`や`Ownable`のように、ここでは多くのことが起こっています。まず、コントラクトを宣言する際に、2つの`OpenZeppelin`のコントラクトを「継承」しています。継承に関して詳しくは[こちら](https://solidity-by-example.org/inheritance/?utm_source=buildspace.so&utm_medium=buildspace_project)で読むことができますが、基本的に、Shieldコントラクトのコードには、ERC721EnumerableとOwnableの2つのコントラクトのコードが含まれています。よって、これら2つの機能を実装するためのコードを再度書く必要がなくなります。

以下のより重要な状態変数について説明しましょう。

```solidity
    /**
      * @dev _baseTokenURI for computing {tokenURI}. If set, the resulting URI for each
      * token will be the concatenation of the `baseURI` and the `tokenId`.
      */
    string _baseTokenURI;
    // total number of tokenIds minted
    uint256 public tokenIds;
```

`_baseTokenURI`はNFTメタデータのルートリンクで、例えば：`ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/`（IPFSは分散型ストレージプロトコルです。これについては後述します）や、集中型のアドレス、例えば：`https://xxxxxxxxxxxx/`などです。

`tokenIds`は各NFTの数値IDを表しており、これらのIDはユニークです。`_baseTokenURI`と組み合わせることで、各NFTのメタデータが形成されます（メタデータについては後ほど説明します。今は、メタデータがあることでNFTをさまざまなNFTプラットフォームで表示できることを覚えておいてください）。

```solidity
    //  price is the price of one Shield NFT
    uint256 public price = 0.01 ether;
    
    // max number of Shield NFT
    uint256 public maxTokenIds = 4;
```

`price`は各NFTの価格を設定します。Ethereum（ETH）ではETHそのものを指し、PolygonではMaticを指します。ether以外にも単位があります：1 ether = 10^9 gwei、1 gwei = 10^9 weiです。

`maxTokenIds`はNFTの最大数を示しています。ここでは4に設定されているため、4つのNFTのメタデータを準備する必要があります。

```solidity
    /**
      * @dev ERC721 constructor takes in a `name` and a `symbol` to the token collection.
      * name in our case is `Shields` and symbol is `CS`.
      * Constructor for Shields takes in the baseURI to set _baseTokenURI for the collection.
      * It also initializes an instance of whitelist interface.
      */
    constructor (string memory baseURI, address whitelistContract) ERC721("ChainIDE Shields", "CS") {
        _baseTokenURI = baseURI;
        _whitelist = IWhitelist(whitelistContract);
    }
```

コントラクトをデプロイする際には、`_baseTokenURI`と`Whitelist`コントラクトのアドレスを入力する必要があります。同時に、このNFTの名前を「ChainIDE Shields」、記号を「CS」と設定します。

```solidity
     /**
      * @dev presaleMint allows a user to mint one NFT per transaction during the presale.
      */
    function mint() public payable onlyWhenNotPaused {
        require(_whitelist.whitelistedAddresses(msg.sender), "You are not whitelisted");
        require(tokenIds < maxTokenIds, "Exceeded maximum Shields supply");
        require(msg.value >= price, "Ether sent is not correct");
        tokenIds += 1;
        //_safeMint is a safer version of the _mint function as it ensures that
        // if the address being minted to is a contract, then it knows how to deal with ERC721 tokens
        // If the address being minted to is not a contract, it works the same way as _mint
        _safeMint(msg.sender, tokenIds);
    }
```

`mint`関数の説明に焦点を当てましょう：

1. `payable`というキーワードは、この関数が直接トークンを受け取ることができることを示しており、NFTの価格は0.01 etherです。onlyWhenNotPausedは[modifier](https://solidity-by-example.org/function-modifier/)が定義されています。`paused`が`false`のときのみ関数が実行されることを示しています（注：コントラクトは_pausedがfalseの状態で開始されるため、ホワイトリストのユーザーはコントラクトのデプロイ後に直接ミントを行うことができます）。

```solidity
    modifier onlyWhenNotPaused {
        require(!paused, "Contract currently paused");
        _;
    }
```

2. `require(_whitelist.whitelistedAddresses(msg.sender), "You are not whitelisted");`：ミントプロセスへの参加をホワイトリストに載っているユーザーのみに制限します。

3. `require(tokenIds < maxTokenIds, "Exceeded maximum Shields supply");`：`tokenIds`の最大量が設定された`maxTokenIds`（4）を超えないように制限されています。

4. `require(msg.value >= price, "Ether sent is not correct");`：送られてくるトークンは0.01 ether以上である必要があります。もし0.01 etherよりも多ければ、それも問題ありません！ 😄

5. `tokenIds += 1;`：上記すべての条件が満たされた後で、`tokenIds`は1増加します。デフォルトの`tokenIds`値は0なので、`tokenIds`の範囲は1, 2, 3, 4となります。

6. `_safeMint(msg.sender, tokenIds);`：この機能は`"@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol"`によって実装されています。そのコントラクトを参照することで具体的な機能を確認することができます。今のところ、この関数を呼び出した人にNFTがミントされるということだけ理解しておけば良いです。

```solidity
    /**
    * @dev setPaused makes the contract paused or unpaused
      */
    function setPaused(bool val) public onlyOwner {
        paused = val;
    }
```

コントラクトのミントを一時停止する機能は、`paused`変数を通じて実現されています。この変数はbool型で、初期値は`false`です。したがって、ユーザーがミントを開始する前に、オーナーだけがこの関数を呼び出す必要があります。

```solidity
    /**
    * @dev withdraw sends all the ether in the contract
    * to the owner of the contract
      */
    function withdraw() public onlyOwner  {
        address _owner = owner();
        uint256 amount = address(this).balance;
        (bool sent, ) =  _owner.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }
```

コントラクトから`ether`を引き出すには、`withdraw()`関数を使用して行います。このコードの目的は、コントラクト内の資金を`owner`に転送することです。[こちら](https://solidity-by-example.org/sending-ether/)に示されているように、トークンの転送を処理する方法はいくつかあります。この場合、`call`メソッドを使用しています。

次に、`JS VM`を使用してこのスマートコントラクトをコンパイルしてデプロイします（ChainIDEが自動的に選択するコンパイラを使用しても問題ありません）。

![image-20230223092112169](/public/images/Polygon-Whitelist-NFT/section-2/2_2_4.png)

`DEPLOY`セクションを見るとわかるように、`baseURI`（メタデータのルートリンク）と`whitelistContract`（以前のホワイトリストのアドレス）を入力する必要があります。したがって、次はメタデータのルートリンクをどのように生成するか考えましょう。

![image-20230223092203406](/public/images/Polygon-Whitelist-NFT/section-2/2_2_5.png)
### ✨ Hardhat をインストールする

スマートコントラクトをすばやくコンパイルし、ローカル環境にてテストを行うために、**Hardhat** というツールを使用します。

- Hardhatにより、ローカル環境でイーサリアムネットワークを簡単に起動し、テストネットでイーサリアムを利用できます。

- 「サーバー」がブロックチェーンであることを除けば、Hardhatはローカルサーバーと同じです。

それでは、先ほど作成した`packages/contract`ディレクトリ内にファイルを作成します。ターミナルに向かい、packages/contract`ディレクトリ内で以下のコマンドを実行します。

```bash
cd packages/contract
yarn init --private -y
# Hardhatのインストール
yarn add --dev hardhat
# スマートコントラクトの開発に必要なプラグインのインストール
yarn add --dev @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-network-helpers @nomicfoundation/hardhat-chai-matchers @nomiclabs/hardhat-ethers @nomiclabs/hardhat-etherscan chai ethers@^5.4.7 hardhat-gas-reporter solidity-coverage @typechain/hardhat typechain @typechain/ethers-v5 @ethersproject/abi @ethersproject/providers
```

> ✍️: `warning`について
> Hardhat をインストールすると、脆弱性に関するメッセージが表示される場合があります。
>
> 基本的に`warning`は無視して問題ありません。
>
> YARN から何かをインストールするたびに、インストールしているライブラリに脆弱性が報告されているかどうかを確認するためにセキュリティチェックが行われます。

### 👏 サンプルプロジェクトを開始する

次に、Hardhatを実行します。

`packages/contract`ディレクトリにいることを確認し、次のコマンドを実行します。

```bash
npx hardhat
```

`hardhat`がターミナル上で立ち上がったら、それぞれの質問を以下のように答えていきます。

```
・What do you want to do? →「Create a JavaScript project」を選択
・Hardhat project root: →「'Enter'を押す」 (自動で現在いるディレクトリが設定されます。)
・Do you want to add a .gitignore? (Y/n) → 「y」
```

（例）
```bash
$ npx hardhat

888    888                      888 888               888
888    888                      888 888               888
888    888                      888 888               888
8888888888  8888b.  888d888 .d88888 88888b.   8888b.  888888
888    888     "88b 888P"  d88" 888 888 "88b     "88b 888
888    888 .d888888 888    888  888 888  888 .d888888 888
888    888 888  888 888    Y88b 888 888  888 888  888 Y88b.
888    888 "Y888888 888     "Y88888 888  888 "Y888888  "Y888

👷 Welcome to Hardhat v2.13.0 👷‍

✔ What do you want to do? · Create a JavaScript project
✔ Hardhat project root: · /ETH-NFT-Collection/packages/contract
✔ Do you want to add a .gitignore? (Y/n) · y

✨ Project created ✨

See the README.md file for some example tasks you can run

Give Hardhat a star on Github if you're enjoying it! 💞✨

     https://github.com/NomicFoundation/hardhat
```

> ⚠️: 注意 #1
>
> Windows で Git Bash を使用してハードハットをインストールしている場合、このステップ (HH1) でエラーが発生する可能性があります。問題が発生した場合は、WindowsCMD（コマンドプロンプト）を使用して HardHat のインストールを実行してみてください。

> ⚠️: 注意 #2
>
> `npx hardhat`が実行されなかった場合、以下をターミナルで実行してください。
>
> ```bash
> yarn add --dev @nomicfoundation/hardhat-toolbox
> ```

この段階で、フォルダー構造は下記のようになっていることを確認してください。

```diff
ETH-NFT-Collection
 ├── .gitignore
 ├── package.json
 └── packages/
     ├── client/
     └── contract/
+        ├── .gitignore
+        ├── README.md
+        ├── contracts/
+        ├── hardhat.config.js
+        ├── package.json
+        ├── scripts/
+        └── test/
```

それでは、`contract`ディレクトリ内に生成された`package.json`ファイルを以下を参考に更新をしましょう。

```diff
{
  "name": "contract",
  "version": "1.0.0",
-  "main": "index.js",
-  "license": "MIT",
  "private": true,
  "devDependencies": {
    "@nomicfoundation/hardhat-chai-matchers": "^1.0.6",
    "@nomicfoundation/hardhat-network-helpers": "^1.0.8",
    "@nomicfoundation/hardhat-toolbox": "^2.0.2",
    "@nomiclabs/hardhat-ethers": "^2.2.2",
    "@nomiclabs/hardhat-etherscan": "^3.1.7",
    "@typechain/ethers-v5": "^10.2.0",
    "@typechain/hardhat": "^6.1.5",
    "chai": "^4.3.7",
    "ethers": "^6.1.0",
    "hardhat": "^2.13.0",
    "hardhat-gas-reporter": "^1.0.9",
    "solidity-coverage": "^0.8.2",
    "typechain": "^8.1.1"
  },
+  "scripts": {
+    "test": "npx hardhat test"
+  }
}
```

不要な定義を削除し、hardhatの自動テストを実行するためのコマンドを追加しました。

次に、安全なスマートコントラクトを開発するために使用されるライブラリ **OpenZeppelin** をインストールします。

`packages/contract`ディレクトリにいることを確認し、以下のコマンドを実行してください。

```bash
yarn add --dev @openzeppelin/contracts
```

[OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts) はイーサリアムネットワーク上で安全なスマートコントラクトを実装するためのフレームワークです。

OpenZeppelinには非常に多くの機能が実装されておりインポートするだけで安全にその機能を使うことができます。

### ⭐️ 実行する

すべてが機能していることを確認するには、以下を実行します。

```
npx hardhat compile
```

次に、以下を実行します。

```
npx hardhat test
```

次のように表示されます。

![](/public/images/ETH-NFT-Collection/section-1/1_2_2.png)

ターミナル上で`ls`と入力してみて、下記のフォルダーとファイルが表示されていたら成功です。

```bash
README.md         cache             hardhat.config.js package.json      test
artifacts         contracts         node_modules      scripts
```

ここまできたら、フォルダーの中身を整理しましょう。

まず、`test`の下のファイル`Lock.js`を削除します。

1. `test`フォルダーに移動: `cd test`

2. `Lock.js`を削除: `rm Lock.js`

次に、上記の手順を参考にして`contracts`の下の`Lock.sol`を削除してください。実際のフォルダは削除しないように注意しましょう。


### ☀️ Hardhat の機能について

Hardhatは段階的に下記を実行しています。

1\. **Hardhat は、スマートコントラクトを Solidity からバイトコードにコンパイルしています。**

- バイトコードとは、コンピュータが読み取れるコードの形式のことです。

2\. **Hardhat は、あなたのコンピュータ上でテスト用の「ローカルイーサリアムネットワーク」を起動しています。**

3\. **Hardhat は、コンパイルされたスマートコントラクトをローカルイーサリアムネットワークに「デプロイ」します。**

ターミナルに出力されたアドレスを確認してみましょう。

```bash
Greeter deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

これは、イーサリアムネットワークのテスト環境でデプロイされたスマートコントラクトのアドレスです。

### 🖋 コントラクトを作成する

これから、ETHとガス代を支払うことで、誰でもNFTをMintできるスマートコントラクトをSolidityで作成していきます。

- ここで作成するスマートコントラクトは、後でユースケースに合わせて自由に変更できます。

`contracts`ディレクトリの下に`NFTCollectible.sol`という名前のファイルを作成します。

Hardhatを使用する場合、ファイル構造は非常に重要ですので、注意する必要があります。ファイル構造が下記のようになっていれば大丈夫です 😊

```bash
contract
    |_ contracts
           |_  NFTCollectible.sol
```

次に、コードエディタでプロジェクトのコードを開きます。

ここでは、VS Codeの使用をお勧めします。ダウンロードは[こちら](https://azure.microsoft.com/ja-jp/products/visual-studio-code/)から。

VS Codeをターミナルから起動する方法は[こちら](https://maku.blog/p/f5iv9kx/)をご覧ください。今後VS Codeを起動するのが一段と楽になるので、ぜひ導入してみてください。

コーディングのサポートツールとして、VS Code上でSolidityの拡張機能をダウンロードすることをお勧めします。ダウンロードは [こちら](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity) から。

それでは、これから`NFTCollectible.sol`の中身の作成していきます。`NFTCollectible.sol`をVS Codeで開き、下記を入力します。

```solidity
// NFTCollectible.sol
//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract NFTCollectible is ERC721Enumerable, Ownable {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
}
```

コードを詳しくみていきましょう。

```solidity
// NFTCollectible.sol
// SPDX-License-Identifier: MIT
```

これは「SPDXライセンス識別子」と呼ばれ、ソフトウェア・ライセンスの種類が一目でわかるようにするための識別子です。

```solidity
// NFTCollectible.sol
pragma solidity ^0.8.9;
```

これは、コントラクトで使用するSolidityコンパイラのバージョンです。上記の場合「このコントラクトを実行するときは、Solidityコンパイラのバージョン0.8.9のみを使用し、それ以下のものは使用しません」という意味です。コンパイラのバージョンが`hardhat.config.js`で同じであることを確認してください。

もし、`hardhat.config.js`の中に記載されているSolidityのバージョンが`0.8.9`でなかった場合は、`NFTCollectible.sol`の中身を`hardhat.config.js`に記載されているバージョンに変更しましょう。

```solidity
// NFTCollectible.sol
import "hardhat/console.sol";
```

コントラクトを実行する際、コンソールログをターミナルに出力するためにHardhatの`console.sol`のファイルをインポートしています。これは、今後スマートコントラクトのデバッグが発生した場合に、とても役立つツールです。

```solidity
// NFTCollectible.sol
import "hardhat/console.sol";
```

```solidity
// NFTCollectible.sol
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract NFTCollectible is ERC721Enumerable, Ownable {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
```

ここでは、OpenZeppelinのERC721 EnumerableコントラクトとOwnableコントラクトを継承しています。

### 🗃 定数( `constants`)と変数( `variables`)を保存する

これからコントラクトに、特定の変数や定数を保存していきます。

`NFTCollectible.sol`の中の`Counters.Counter private _tokenIds;`の直下に以下のコードを追加しましょう。

```solidity
// NFTCollectible.sol
uint public constant MAX_SUPPLY = 30;
uint public constant PRICE = 0.01 ether;
uint public constant MAX_PER_MINT = 3;

string public baseTokenURI;
```

まず、ここでは以下の3つを定数(`constants`)として定義します。

1\. **NFT の供給量( `MAX_SUPPLY`)**: コレクションでMint可能なNFTの最大数。

2\. **NFT の価格( `PRICE`)**: NFTを購入するのにユーザーが支払うETHの額。

3\. **1 取引あたりの最大 Mint 数( `MAX_PER_MINT`)**: ユーザーが一度にMintできるNFTの上限限。

**コントラクトがデプロイされたら、定数の中身を変更することはできません。**

- これらコンスタントが取る値(`30`、`0.01 ether`など)は、自由に変更できます。

それから、下記を変数として定義します。

**Base Token URI( `baseTokenURI`)**: JSONファイル（メタデータ）が格納されているフォルダのIPFS URL。

コントラクトの所有者（またはデプロイ先）が必要に応じてBase Token URIを変更できるように、これから`baseTokenURI`のセッタ関数を記述していきます。

> ✍️: `public`は Solidity の**アクセス修飾子**です。
> Solidity のアクセス修飾子に関しては、[こちら](https://github.com/shiftbase-xyz/UNCHAIN-projects/blob/main/docs/102-ETH-NFT-Collection/ja/section-2/lesson-4_Solidity%E3%81%AE%E6%9B%B8%E3%81%8D%E6%96%B9%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6%E5%AD%A6%E3%81%BC%E3%81%86.md) をご覧ください。
>
> `public`を含む、他のアクセス修飾子について詳しく説明しています。

### 🤖 コンストラクタ( `constructor`)を記述する

コンストラクタ(`constructor`)の呼び出して、`baseTokenURI`を設定していきます。

> 🔩: `constructor`とは
> `constructor`はオプションの関数で、`contract`の状態変数を初期化するために使用されます。これから詳しく説明していくので、`constructor`に関しては、まず以下の特徴を理解してください。
>
> - `contract`は 1 つの`constructor`しか持つことができません。
>
> - `constructor`は、スマートコントラクトの作成時に一度だけ実行され、`contract`の状態を初期化するために使用されます。
>
> - `constructor`が実行された後、コードがブロックチェーンにデプロイされます。

`NFTCollectible.sol`の中の`string public baseTokenURI;`の直下に以下のコードを追加しましょう。

```solidity
// NFTCollectible.sol
constructor(string memory baseURI) ERC721("NFT Collectible", "NFTC") {
     setBaseURI(baseURI);
}
```

`setBaseURI(baseURI);`は、メタデータが存在する場所のBase Token URIを設定します。

この処理により、個々のNFTに対して手動でBase Token URIを設定する作業が軽減されます。

- `setBaseURI`関数については、後で詳しく説明します。

また、`ERC721("NFT Collectible", "NFTC")`では、**親**コンストラクタ(`ERC721`)を呼び出して、NFTコレクションの名前とシンボルを設定します。

- NFTコレクションの名前: `"NFT Collectible"`

- NFTコレクションのシンボル: `"NFTC"`

* NFTコレクションの名前とシンボルは任意で変更して大丈夫です 😊

### 🎟 いくつかの NFT を無料で配布する

スマートコントラクトは、一度ブロックチェーン上にデプロイしてしまうと中身を変更できません。

したがって、すべてのNFTを有料にすると、自分自身や友達、イベントの景品として無料でNFTを配布できなくなってしまいます。

なので今から、ある一定数（この場合は10個）のNFTをキープしておいて、ユーザーが無料でMintできる関数(`reserveNFTs`)をコントラクトに実装していきます。

下記を、`constructor`のコードブロック直下に追加しましょう。

```solidity
// NFTCollectible.sol
function reserveNFTs() public onlyOwner {
     uint totalMinted = _tokenIds.current();
     require(
        totalMinted.add(10) < MAX_SUPPLY, "Not enough NFTs"
     );
     for (uint i = 0; i < 10; i++) {
          _mintSingleNFT();
     }
}
```

`reserveNFTs`数を呼び出すユーザーは、ガス代だけ払えばよいので、`onlyOwner`とマークして、コントラクトの所有者だけが呼び出せるようにします。

`tokenIds.current()`を呼び出して、これまでにMintされたNFTの総数を確認します。

- `tokenId`は`0`から始まり、NFTがMintされるごとに`+1`されます。

次に、`require`を使って、キープできるNFT（＝ 10個）がコレクションに残っているかどうかを確認します。

- `totalMinted.add(10) < MAX_SUPPLY`は、現在Mintされようとしている`tokenId`に`+10`した数が、`MAX_SUPPLY`(この場合は`30`)を超えていないかチェックしています。

キープできるNFTがコレクションに残っていた場合、`_mintSingleNFT`を10回呼び出して10個のNFTをMintします。

`_mintSingleNFT`関数については、後で詳しく説明します。

> ✍️: `Ownable` / `onlyOwner`について
> `Ownable`は、OpenZeppelin が提供するコントラクトへのアクセス制御を提供するモジュールです。
>
> このモジュールは、コントラクトの継承によって使用されます。
>
> `onlyOwner`という修飾子を関数に適用することで、関数の使用をコントラクトの所有者に限定することができます。

### 🔗 Base Token URI を設定する

これから、Base Token URIを効率よくコントラクトに取得して、tokenIdと紐付ける関数を実装していきます。

前回のレッスンでIPFSに保存したJSONファイルを覚えていますか？

`#0`番目のNFTコレクションのメタデータは、下記のエンドポイントを持つサーバーでホストされています。

```
https://gateway.pinata.cloud/ipfs/QmSvw119ALMN9SkP89Xj37jvqJik8jZrSjU5c1vgBhkhz8/0
```

上記のリンクを分解すると下記のようになります。

- Base Token URI = `https://gateway.pinata.cloud/ipfs/QmSvw119ALMN9SkP89Xj37jvqJik8jZrSjU5c1vgBhkhz8`

- tokenId = `0`

上記を踏まえ、下記を`reserveNFTs`のコードブロック直下に追加しましょう。

```solidity
// NFTCollectible.sol
function _baseURI() internal
                    view
                    virtual
                    override
                    returns (string memory) {
     return baseTokenURI;
}

function setBaseURI(string memory _baseTokenURI) public onlyOwner {
     baseTokenURI = _baseTokenURI;
}
```

NFTのJSONメタデータは、IPFSの次のURLで入手できます： ipfs://QmZbWNKJPAjxXuNFSEaksCJVd1M6DaKQViJBYPK2BdpDEP/

`setBaseURI()`は、メタデータが存在する場所のBase Token URIを設定します。

`setBaseURI(baseURI)`を実行すると、OpenZeppelinの実装は各Base Token URIを自動的に推論します。

例：

- tokenId = `1`のメタデータは: `ipfs://QmZbWNKJPAjxXuNFSEaksCJVd1M6DaKQViJBYPK2BdpDEP/1`

- tokenId = `2`のメタデータは`ipfs://QmZbWNKJPAjxXuNFSEaksCJVd1M6DaKQViJBYPK2BdpDEP/2`

しかし、`setBaseURI()`を実行する前に、コントラクトの最初で定義した`baseTokenURI`変数が、コントラクトが使用すべきToken Base URIであることを明示する必要があります。

これを行うために、`_baseURI()`という空の関数をオーバーライドして、`baseTokenURI`を返すようにします。

また、コントラクトがデプロイされた後でもコントラクトの所有者が`baseTokenURI`を変更できるように、`onlyOwner`修飾子を記述しています。

### 🎰 NFT を Mint する関数を実装する

次に、ユーザーがNFTをMintする際に3点のチェックを実施する関数` mintNFTs`を実装していきます。

下記を`setBaseURI`関数のコードブロック直下に追加しましょう。

```solidity
// NFTCollectible.sol
function mintNFTs(uint _count) public payable {
     uint totalMinted = _tokenIds.current();
     require(
	// 1つ目のチェック
      	totalMinted.add(_count) <= MAX_SUPPLY, "Not enough NFTs!"
     );
     require(
	// 2つ目のチェック
       	_count > 0 && _count <= MAX_PER_MINT,
       	"Cannot mint specified number of NFTs."
     );
     require(
	// 3つ目のチェック
      	msg.value >= PRICE.mul(_count),
	    "Not enough ether to purchase NFTs."
     );
     for (uint i = 0; i < _count; i++) {
	　// すべてのチェックが終わったら、_count 個の NFT をユーザーに Mint する
	    _mintSingleNFT();
     }
}
```

ユーザーは、あなたのコレクションからNFTを購入してMintしたいときにこの関数を呼び出します。

ユーザーはこの関数にETHを送るので、`payable`修飾子を関数に付与する必要があります。

下記を参考に、Mintが実行される前に以下3点のチェックを行います。

```solidity
// NFTCollectible.sol
uint public constant MAX_SUPPLY = 30;
uint public constant PRICE = 0.01 ether;
uint public constant MAX_PER_MINT = 3;
```

1\. ユーザーがMintを希望するNFTの数がコレクションに残っていること。

2\. ユーザーが`0`以上、トランザクションごとに許可されるNFTの最大数(`MAX_PER_MINT`)未満のMintを実行しようとしていること。

3\. ユーザーはNFTをMintするのに十分なETHを送金していること。

### 🌱 `_mintSingleNFT()`関数を実装する

最後に、ユーザーがNFTをMintするときに呼び出される`_mintSingleNFT()`関数を実装していきましょう。

下記を`mintNFTs`関数のコードブロック直下に追加しましょう。

```solidity
// NFTCollectible.sol
function _mintSingleNFT() private {
      uint newTokenID = _tokenIds.current();
      _safeMint(msg.sender, newTokenID);
      _tokenIds.increment();
}
```

まず、`uint newTokenID = _tokenIds.current();`で、まだMintされていないNFTのIDを取得します。

次に、`_safeMint(msg.sender, newTokenID);`で、OpenZeppelinですでに定義されている`_safeMint()`関数を使用して、ユーザー（関数を呼び出したアドレス）にNFT IDを割り当てます。

最後に、`_tokenIds.increment();`で、tokenIdのカウンタを +1しています。

`_mintSingleNFT`関数が初めて呼び出されたとき、`newTokenID`は`0`であり、関数を呼び出したユーザーに、`tokenId` 0番が与えられます。

- Mintが完了したら、カウンタが1にインクリメントされます。

次にこの関数が呼ばれたとき、`_newTokenID`の値は`1`になります。

各NFTのメタデータを明示的に設定する必要はないことに注意してください。

Token Base URIを設定することで、各NFTにIPFSに格納された正しいメタデータが自動的に割り当てられます。

### 👀 特定のアカウントが所有する NFT について知る

NFT保有者に何らかの実用性を提供する場合、各ユーザーがどのNFTを保有しているかを知れると便利です。

ここでは、特定の保有者が所有するすべての`tokenId`を返す簡単な関数`tokensOfOwner`を作成します。

下記を`_mintSingleNFT`関数のコードブロック直下に追加しましょう。

```solidity
// NFTCollectible.sol
function tokensOfOwner(address _owner)
         external
         view
         returns (uint[] memory) {
     uint tokenCount = balanceOf(_owner);
     uint[] memory tokensId = new uint256[](tokenCount);
     for (uint i = 0; i < tokenCount; i++) {
          tokensId[i] = tokenOfOwnerByIndex(_owner, i);
     }

     return tokensId;
}
```

ERC721 Enumerableの`balanceOf`と`tokenOfOwnerByIndex`関数を使用していきます。

- `balanceOf` : 特定の所有者がいくつのトークンを保持しているかを示す関数。

- `tokenOfOwnerByIndex` : 所有者が`index`番目に所有する`tokenId`を取得する関数。

### 🏧 残高引き出し機能を実装する

コントラクトに送られたETHを引き出せないのでは、これまでの苦労が水の泡です。

そこで、コントラクトの残高をすべて引き出すことができる`withdraw`関数を作成してみましょう。

- `onlyOwner`修飾子をつけていきます。

```solidity
// NFTCollectible.sol
function withdraw() public payable onlyOwner {
     uint balance = address(this).balance;
     require(balance > 0, "No ether left to withdraw");
     (bool success, ) = (msg.sender).call{value: balance}("");
     require(success, "Transfer failed.");
}
```

### 👏 コントラクトの完成

`NFTCollectible.sol`が完成しました。

下記が最終的なコードです。

```solidity
// NTCollectible.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract NFTCollectible is ERC721Enumerable, Ownable {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    uint public constant MAX_SUPPLY = 30;
    uint public constant PRICE = 0.01 ether;
    uint public constant MAX_PER_MINT = 3;

    string public baseTokenURI;

    constructor(string memory baseURI) ERC721("NFT Collectible", "NFTC") {
        setBaseURI(baseURI);
    }

    function reserveNFTs() public onlyOwner {
        uint totalMinted = _tokenIds.current();

        require(totalMinted.add(10) < MAX_SUPPLY, "Not enough NFTs left to reserve");

        for (uint i = 0; i < 10; i++) {
            _mintSingleNFT();
        }
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function setBaseURI(string memory _baseTokenURI) public onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    function mintNFTs(uint _count) public payable {
        uint totalMinted = _tokenIds.current();

        require(totalMinted.add(_count) <= MAX_SUPPLY, "Not enough NFTs left!");
        require(_count >0 && _count <= MAX_PER_MINT, "Cannot mint specified number of NFTs.");
        require(msg.value >= PRICE.mul(_count), "Not enough ether to purchase NFTs.");

        for (uint i = 0; i < _count; i++) {
            _mintSingleNFT();
        }
    }

    function _mintSingleNFT() private {
        uint newTokenID = _tokenIds.current();
        _safeMint(msg.sender, newTokenID);
        _tokenIds.increment();
    }

    function tokensOfOwner(address _owner) external view returns (uint[] memory) {

        uint tokenCount = balanceOf(_owner);
        uint[] memory tokensId = new uint256[](tokenCount);

        for (uint i = 0; i < tokenCount; i++) {
            tokensId[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokensId;
    }

    function withdraw() public payable onlyOwner {
        uint balance = address(this).balance;
        require(balance > 0, "No ether left to withdraw");

        (bool success, ) = (msg.sender).call{value: balance}("");
        require(success, "Transfer failed.");
    }

}
```

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

コントラクトが完成したら、次のレッスンに進んでイーサリアムネットワークにデプロイしましょう 🎉

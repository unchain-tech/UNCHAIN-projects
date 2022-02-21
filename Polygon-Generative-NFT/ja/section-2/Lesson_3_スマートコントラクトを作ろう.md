
✨ Hardhat をインストールする
----------------------

これから、すマートコントラクトを作成して、ガス代と NFT アバターに設定した価格を支払えば、誰でも NFT コレクションが Mint できる仕組みを実装していきます。

スマートコントラクトを素早くコンパイルし、ローカル環境でテストするために、**Hardhat** というツールを使用します。

- Hardhat により、ローカル環境でイーサリアムネットワークを簡単に起動し、テストネットでイーサリアムを利用できるようになります。

- 「サーバー」がブロックチェーンであることを除けば、Hardhat はローカルサーバーと同じです。

まず、`node` / `npm` を取得する必要があります。お持ちでない場合は、[こちら](https://hardhat.org/tutorial/setting-up-the-environment.html)にアクセスしてください。
`node v16` をインストールすることを推奨しています。

次に、ターミナルに向かいましょう。

作業したいディレクトリに移動したら、次のコマンドを実行して、プロジェクト用の空のフォルダーを作成し、空の package.json ファイルを作成します。

```bash
mkdir nft-collectible && cd nft-collectible && npm init -y
```

この処理により、`nft-collectible` フォルダ内に `package.json` という名前のファイルが作成されます。

次に、`Hardhat` をインストールしましょう。

ターミナル上で、`nft-collectible` フォルダにいることを確認したら、以下のコマンドを実行します。

```
npm install --save-dev hardhat
```

次に、下記のコマンドを実行して、Hardhat のサンプルプロジェクトを作成しましょう。

```
npx hardhat
```

`Create a basic sample project` を選択し、すべてに `yes` と答えましょう。

⚠️: 注意

> `npx hardhat` が実行されなかった場合、以下をターミナルで実行してください。
>
>```bash
>npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers
>```
>
> その後、もう一度 `npx hardhat` を実行しましょう。

サンプルプロジェクトが正しくインストールされたことを確認するため、下記のコマンドを実行してください。

```
npx hardhat run scripts/sample-script.js
```

すべてがうまくいけば、次のような出力が表示されるはずです。

```
Compiling 2 files with 0.8.4
Solidity compilation finished successfully
Deploying a Greeter with greeting: Hello, Hardhat!
Greeter deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

これで hardhat の開発環境は無事構築できました。

次に、下記を実行して、OpenZeppelin のコントラクトパッケージをインストールしましょう。

```
npm install @openzeppelin/contracts
```

これにより、ERC 721 コントラクト（ NFT の標準規格）と、OpenZeppelin が提供するヘルパー・ライブラリにアクセスできるようになります。

GitHub などのウェブサイトでプロジェクトのコードを公開する場合、秘密鍵、Etherscan API キー、Alchemy URL などの機密情報をローカル環境にのみ保存し、非公開にする必要があります。

上記を実装する下準備として、下記を実行し、dotenv という別のライブラリをインストールしましょう。

```
npm install dotenv
```

以上で、スマートコントラクトの開発を始める環境が整いました。

ターミナル上で `nft-collectible` に移動し、`ls` と入力してみて、下記のフォルダーとファイルが表示されていたら成功です。

```
README.md		hardhat.config.js	scripts
artifacts		node_modules		test
cache			package-lock.json
contracts		package.json
```

ここまできたら、フォルダーの中身を整理しましょう。

まず、`test` の下のファイル `sample-test.js` を削除します。

1. `test` フォルダーに移動: `cd test`

2. `sample-test.js` を削除: `rm -r sample-test.js`

また、`scripts` の下の `sample-script.js` を削除します。

1. 一つ上の階層のフォルダー（ `nft-collectible` ）に移動: `cd ..`

2. `cd scripts` フォルダーに移動: `cd script`

3. `sample-script.js` を削除: `rm -r sample-script.js`

次に、上記の手順を参考にして `contracts` の下の `Greeter.sol` を削除してください。実際のフォルダは削除しないように注意しましょう。

🖋 コントラクトを作成する
---

これから、ETH と ガス代を支払うことで、誰でも NFT を Mint できるスマートコントラクトを Solidity で作成していきます。

- ここで作成するスマートコントラクトは、後でユースケースに合わせて自由に変更することが可能です。

`contracts` ディレクトリの下に `NFTCollectible.sol` という名前のファイルを作成します。

ターミナル上で新しくファイルを作成する場合は、下記のコマンドが役立ちます。

1. `nft-collectible` ディレクトリに移動: `cd nft-collectible`

2. `contracts` ディレクトリに移動: `cd contracts`

3. `NFTCollectible.sol` ファイルを作成: `touch NFTCollectible.sol`

Hardhat を使用する場合、ファイル構造は非常に重要なので、注意する必要があります。ファイル構造が下記のようになっていれば大丈夫です😊
```bash
nft-collectible
    |_ contracts
           |_  NFTCollectible.sol
```

次に、コードエディタでプロジェクトのコードを開きます。

ここでは、VS Code の使用をお勧めします。ダウンロードは[こちら](https://azure.microsoft.com/ja-jp/products/visual-studio-code/)から。

VS Code をターミナルから起動する方法は[こちら](https://maku.blog/p/f5iv9kx/)をご覧ください。今後 VS Code を起動するのが一段と楽になるので、ぜひ導入してみてください。

コーディングのサポートツールとして、VS Code 上で Solidity の拡張機能をダウンロードすることをおすすめします。ダウンロードは [こちら](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity) から。

それでは、これから `NFTCollectible.sol` の中身の作成していきます。`NFTCollectible.sol` を VS Code で開き、下記を入力します。

```javascript
// NFTCollectible.sol
//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

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

```javascript
// NFTCollectible.sol
// SPDX-License-Identifier: UNLICENSED
```
これは「SPDXライセンス識別子」と呼ばれ、ソフトウェア・ライセンスの種類が一目でわかるようにするための識別子です。

```javascript
// NFTCollectible.sol
pragma solidity ^0.8.4;
```
これは、コントラクトで使用する Solidity コンパイラのバージョンです。上記の場合「このコントラクトを実行するときは、Solidity コンパイラのバージョン0.8.4のみを使用し、それ以下のものは使用しません。」という意味です。コンパイラのバージョンが `hardhat.config.js` で同じであることを確認してください。

もし、`hardhat.config.js` の中に記載されている Solidity のバージョンが `0.8.4` でなかった場合は、`NFTCollectible.sol` の中身を `hardhat.config.js` に記載されているバージョンに変更しましょう。

```javascript
// NFTCollectible.sol
import "hardhat/console.sol";
```

コントラクトを実行する際、コンソールログをターミナルに出力するために Hardhat の `console.sol` のファイルをインポートしています。これは、今後スマートコントラクトのデバッグが発生した場合に、とても役立つツールです。

```javascript
// NFTCollectible.sol
import "hardhat/console.sol";
```

```javascript
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

ここでは、OpenZeppelin の ERC721 Enumerable コントラクトと Ownable コントラクトを継承しています。

- ERC721 Enumerable コントラクトには、NFT コレクションを扱うときに便利ないくつかのヘルパー関数が搭載されています。

- Ownable コントラクトでは、コントラクトの特定の側面に管理者権限を追加することができます。

上記に加えて、OpenZeppelin の SafeMath ライブラリと Counters ライブラリを使用して、符号なし整数演算（オーバーフローを防止）とトークン ID の安全に処理を行なっていきます。

`contract` は、他の言語でいうところの「[class](https://wa3.i-3-i.info/word1120.html)」のようなものなのです。

class の概念については、[こちら](https://aiacademy.jp/media/?p=131) を参照してくさい。

🗃 定数（ `constants` ）と変数（ `variables` ）を保存する
---

これからコントラクトに、特定の変数や定数を保存していきます。

`NFTCollectible.sol` の中の `Counters.Counter private _tokenIds;` の直下に以下のコードを追加しましょう。

```javascript
// NFTCollectible.sol
uint public constant MAX_SUPPLY = 30;
uint public constant PRICE = 0.01 ether;
uint public constant MAX_PER_MINT = 3;

string public baseTokenURI;
```

まず、ここでは以下の3つを定数（ `constants` ）として定義します。

1. **NFT の供給量（ `MAX_SUPPLY` ）**: コレクションで Mint 可能な NFT の最大数。

2. **NFT の価格（ `PRICE` ）**: NFTを購入するのにユーザーが支払う ETH の額。

3. **1取引あたりの最大 Mint 数（ `MAX_PER_MINT` ）**: ユーザーが度に Mint できる NFT の上限限。

**コントラクトがデプロイされたら、定数の中身を変更することはできません。**

* これらコンスタントが取る値（ `30`、`0.01 ether` など）は、自由に変更できます。

それから、下記を変数として定義します。

**Base Token URI（ `baseTokenURI` ）**: JSON ファイル（メタデータ）が格納されているフォルダの IPFS URL。

コントラクトの所有者 (またはデプロイ先) が必要に応じて Base Token URI を変更できるように、これから `baseTokenURI` のセッター関数を記述する予定です。

✍️: `public` は Solidity の**アクセス修飾子**です。

> Solidity のアクセス修飾子に関しては、[こちら](https://github.com/yukis4san/Intro-NFT/blob/main/section-2/NFT-S2-lesson-4.md)をご覧ください。
>
> `public` を含む、他のアクセス修飾子について詳しく説明しています。

🤖 コンストラクタ（ `constructor` ）を記述する
---

コンストラクタ（ `constructor` ）の呼び出して、`baseTokenURI` を設定していきます。

🔩: `contructor`とは

> `contructor` はオプションの関数で、`contract` の状態変数を初期化するために使用されます。これから詳しく説明していくので、`contructor` に関しては、まず以下の特徴を理解してください。
>
>- `contract` は 1 つの `contructor` しか持つことができません。
>
>- `contructor` は、スマートコントラクトの作成時に一度だけ実行され、`contract` の状態を初期化するために使用されます。
>
>- `contructor` が実行された後、コードがブロックチェーンにデプロイされます。

`NFTCollectible.sol` の中の `string public baseTokenURI;` の直下に以下のコードを追加しましょう。

```javascript
// NFTCollectible.sol
constructor(string memory baseURI) ERC721("NFT Collectible", "NFTC") {
     setBaseURI(baseURI);
}
```

`setBaseURI(baseURI);` は、メタデータが存在する場所の Base Token URIを設定します。

この処理により、個々の NFT に対して手動で Base Token URI を設定する作業が軽減されます。

- `setBaseURI` 関数については、後で詳しく説明します。

また、`ERC721("NFT Collectible", "NFTC")` では、**親**コンストラクタ（ `ERC721` ）を呼び出して、NFT コレクションの名前とシンボルを設定します。

- NFT コレクションの名前: `"NFT Collectible"`

- NFT コレクションのシンボル: `"NFTC"`

* NFT コレクションの名前とシンボルは任意で変更して大丈夫です😊

🎟 いくつかの NFT を無料で配布する
----

スマートコントラクトは、一度ブロックチェーン上にデプロイしてしまうと中身を変更することができません。

したがって、すべての NFT を有料にすると、自分自身や友達、イベントの景品として無料で NFT を配布することができなくなってしまいます。

なので今から、ある一定数（この場合は 10 個）の NFT をキープしておいて、ユーザーが無料で Mint できる関数（ `reserveNFTs` ）をコントラクトに実装していきます。

下記を、`constructor` のコードブロック直下に追加しましょう。

```javascript
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

`reserveNFTs` 数を呼び出すユーザーは、ガス代だけ払えばいいので、`onlyOwner`とマークして、コントラクトの所有者だけが呼び出せるようにします。

`tokenIds.current()` を呼び出して、これまでに Mint された NFT の総数を確認します。

- `tokenId` は `0` から始まり、NFT が Mint されるごとに `+1` されます。

次に、`require` を使って、キープできる NFT（＝ 10 個）がコレクションに残っているかどうかを確認します。

- `totalMinted.add(10) < MAX_SUPPLY` は、現在 Mint されようとしている `tokenId` に `+10` した数が、`MAX_SUPPLY` （この場合は `30` ）を超えていないかチェックしています。

キープできる NFT がコレクションに残っていた場合、`_mintSingleNFT` を 10 回呼び出して 10 個のNFT を Mint します。

`_mintSingleNFT` 関数については、後で詳しく説明します。


✍️: `Ownable` / `onlyOwner` について
>
>`Ownable` は、OpenZeppelin が提供するコントラクトへのアクセス制御を提供するモジュールです。
>
>このモジュールは、コントラクトの継承によって使用されます。
>
>`onlyOwner` という修飾子を関数に適用することで、関数の使用をコントラクトの所有者に限定することができます。

🔗 Base Token URI を設定する
---

これから、Base Token URI を効率よくコントラクトに取得して、tokenIdと紐付ける関数を実装していきます。

前回のレッスンで IPFS で保存した JSON ファイルを覚えていますか？

`#0` 番目の NFT コレクションのメタデータは、下記のエンドポイントを持つサーバーでホストされています。

```
https://gateway.pinata.cloud/ipfs/QmSvw119ALMN9SkP89Xj37jvqJik8jZrSjU5c1vgBhkhz8/0
```

上記のリンクを分解すると下記のようになります。

- Base Token URI = `https://gateway.pinata.cloud/ipfs/QmSvw119ALMN9SkP89Xj37jvqJik8jZrSjU5c1vgBhkhz8`

- tokenId = `0`

上記を踏まえ、下記を `reserveNFTs` のコードブロック直下に追加しましょう。

```javascript
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
NFT の JSON メタデータは、IPFS の次のURLで入手できます： ipfs://QmZbWNKJPAjxXuNFSEaksCJVd1M6DaKQViJBYPK2BdpDEP/

`setBaseURI()` は、メタデータが存在する場所の Base Token URI を設定します。

`setBaseURI(baseURI)` を実行すると、OpenZeppelin の実装は各 NFT no
 URIを自動的に推論します。

例：

- tokenId = `1` のメタデータは: `ipfs://QmZbWNKJPAjxXuNFSEaksCJVd1M6DaKQViJBYPK2BdpDEP/1`

- tokenId = `2` のメタデータは `ipfs://QmZbWNKJPAjxXuNFSEaksCJVd1M6DaKQViJBYPK2BdpDEP/2`


しかし、`setBaseURI()` を実行する前に、コントラクトの最初で定義した `baseTokenURI` 変数が、コントラクトが使用すべき Token Base URI であることを明示する必要があります。

これを行うために、`_baseURI()` という空の関数をオーバーライドして、`baseTokenURI`を返すようにします。

また、コントラクトがデプロイされた後でもコントラクトの所有者が `baseTokenURI` を変更できるように、`onlyOwner` 修飾子を記述しています。

🎰 NFT を Mint する関数を実装する
---

次に、ユーザーが NFT を Mint する際に3点のチェックを実施する関数 ` mintNFTs` を実装していきます。

下記を `setBaseURI` 関数のコードブロック直下に追加しましょう。

```javascript
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

ユーザーは、あなたのコレクションから NFT を購入して Mint したいときにこの関数を呼び出します。

ユーザーはこの関数に ETH を送るので、`payable` 修飾子を関数に付与する必要があります。

下記を参考に、Mint が実行される前に以下 3 点のチェックを行います。

```javascript
// NFTCollectible.sol
uint public constant MAX_SUPPLY = 30;
uint public constant PRICE = 0.01 ether;
uint public constant MAX_PER_MINT = 3;
```

1. ユーザーが Mint を希望する NFT の数がコレクションに残っていること。

2. ユーザーが `0` 以上、トランザクションごとに許可される NFT の最大数（ `MAX_PER_MINT` ）未満の Mint を実行しようとしていること。

3. ユーザーは NFT を Mint するのに十分な ETH を送金していること。


🌱 `_mintSingleNFT()` 関数を実装する
---

最後に、ユーザーが NFT を Mint するときに呼び出される `_mintSingleNFT()` 関数を実装していきましょう。

下記を `mintNFTs` 関数のコードブロック直下に追加しましょう。

```javascript
// NFTCollectible.sol
function _mintSingleNFT() private {
      uint newTokenID = _tokenIds.current();
      _safeMint(msg.sender, newTokenID);
      _tokenIds.increment();
}
```

まず、`uint newTokenID = _tokenIds.current();` で、まだ Mint されていない NFT の ID を取得します。

次に、`_safeMint(msg.sender, newTokenID);` で、OpenZeppelin ですでに定義されている `_safeMint()` 関数を使用して、ユーザー（関数を呼び出したアドレス）に NFT ID を割り当てます。

最後に、`_tokenIds.increment();` で、tokenId のカウンターを +1 しています。

`_mintSingleNFT` 関数が初めて呼び出されたとき、`newTokenID` は `0` であり、関数を呼び出したユーザーに、`tokenId` 0 番が与えられます。

- Mint が完了したら、カウンターが 1 にインクリメントされます。

次にこの関数が呼ばれたとき、`_newTokenID` の値は `1` になります。

各 NFT のメタデータを明示的に設定する必要はないことに注意してください。

Token Base URIを設定することで、各 NFT にIPFSに格納された正しいメタデータが自動的に割り当てられるようになります。


👀 特定のアカウントが所有する NFT について知る
---

NFT 保有者に何らかの実用性を提供する場合、各ユーザーがどの NFT を保有しているかを知れると便利です。

ここでは、特定の保有者が所有するすべての `tokenId` を返す簡単な関数 `tokensOfOwner` を作成します。

下記を `_mintSingleNFT` 関数のコードブロック直下に追加しましょう。

```javascript
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

ERC721 Enumerable の `balanceOf` と `tokenOfOwnerByIndex` 関数を使用していきます。

- `balanceOf` : 特定の所有者がいくつのトークンを保持しているかを示す関数。

- `tokenOfOwnerByIndex` : 所有者が所有するすべての `tokenId` を取得する関数。


🏧 残高引き出し機能を実装する

---

コントラクトに送られた ETH を引き出せないのでは、これまでの苦労が水の泡です。

そこで、コントラクトの残高をすべて引き出すことができる `withdraw` 関数を作成してみましょう。

- `onlyOwner` 修飾子をつけていきます。

```javascript
// NFTCollectible.sol
function withdraw() public payable onlyOwner {
     uint balance = address(this).balance;
     require(balance > 0, "No ether left to withdraw");
     (bool success, ) = (msg.sender).call{value: balance}("");
     require(success, "Transfer failed.");
}
```

👏 コントラクトの完成
---

`NFTCollectible.sol` が完成しました。

下記が最終的なコードです。

```javascript
// NTCollectible.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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
コントラクトが完成したら、次のレッスンに進んでイーサリアムネットワークにデプロイしましょう🎉

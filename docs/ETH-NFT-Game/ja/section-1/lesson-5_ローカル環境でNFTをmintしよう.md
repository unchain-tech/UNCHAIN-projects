### ✨ NFT を Mint する

さて、キャラクターのデータが整ったので、次は実際にNFTをMintしていきましょう。

下記のように、`MyEpicGame.sol`を更新してください。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// NFT発行のコントラクト ERC721.sol をインポートします。
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

//OpenZeppelinが提供するヘルパー機能をインポートします。
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "hardhat/console.sol";

// MyEpicGameコントラクトは、NFTの標準規格であるERC721を継承します。
contract MyEpicGame is ERC721 {

  struct CharacterAttributes {
    uint characterIndex;
    string name;
    string imageURI;
    uint hp;
    uint maxHp;
    uint attackDamage;
  }

  //OpenZeppelin が提供する tokenIds を簡単に追跡するライブラリを呼び出しています。
  using Counters for Counters.Counter;
  // tokenIdはNFTの一意な識別子で、0, 1, 2, .. N のように付与されます。
  Counters.Counter private _tokenIds;

  // キャラクターのデフォルトデータを保持するための配列 defaultCharacters を作成します。それぞれの配列は、CharacterAttributes 型です。
  CharacterAttributes[] defaultCharacters;

  // NFTの tokenId と CharacterAttributes を紐づける mapping を作成します。
  mapping(uint256 => CharacterAttributes) public nftHolderAttributes;

  // ユーザーのアドレスと NFT の tokenId を紐づける mapping を作成しています。
  mapping(address => uint256) public nftHolders;

  constructor(
	// プレイヤーが新しく NFT キャラクターを Mint する際に、キャラクターを初期化するために渡されるデータを設定しています。これらの値は フロントエンド（js ファイル）から渡されます。
    string[] memory characterNames,
    string[] memory characterImageURIs,
    uint[] memory characterHp,
    uint[] memory characterAttackDmg
  )
    // 作成するNFTの名前とそのシンボルをERC721規格に渡しています。
    ERC721("OnePiece", "ONEPIECE")
  {
	// ゲームで扱う全てのキャラクターをループ処理で呼び出し、それぞれのキャラクターに付与されるデフォルト値をコントラクトに保存します。
	// 後でNFTを作成する際に使用します。
    for(uint i = 0; i < characterNames.length; i += 1) {
      defaultCharacters.push(CharacterAttributes({
        characterIndex: i,
        name: characterNames[i],
        imageURI: characterImageURIs[i],
        hp: characterHp[i],
        maxHp: characterHp[i],
        attackDamage: characterAttackDmg[i]
      }));

      CharacterAttributes memory character = defaultCharacters[i];

    //  ハードハットのconsole.log()では、任意の順番で最大4つのパラメータを指定できます。
	  // 使用できるパラメータの種類: uint, string, bool, address
      console.log("Done initializing %s w/ HP %s, img %s", character.name, character.hp, character.imageURI);
    }

    // 次の NFT が Mint されるときのカウンターをインクリメントします。
    _tokenIds.increment();
  }

  // ユーザーは mintCharacterNFT 関数を呼び出して、NFT を Mint ことができます。
  // _characterIndex は フロントエンドから送信されます。
  function mintCharacterNFT(uint _characterIndex) external {
    // 現在の tokenId を取得します（constructor内でインクリメントしているため、1から始まります）。
    uint256 newItemId = _tokenIds.current();

    // msg.sender でフロントエンドからユーザーのアドレスを取得して、NFT をユーザーに Mint します。
    _safeMint(msg.sender, newItemId);

    // mapping で定義した tokenId を CharacterAttributesに紐付けます。
    nftHolderAttributes[newItemId] = CharacterAttributes({
      characterIndex: _characterIndex,
      name: defaultCharacters[_characterIndex].name,
      imageURI: defaultCharacters[_characterIndex].imageURI,
      hp: defaultCharacters[_characterIndex].hp,
      maxHp: defaultCharacters[_characterIndex].maxHp,
      attackDamage: defaultCharacters[_characterIndex].attackDamage
    });

    console.log("Minted NFT w/ tokenId %s and characterIndex %s", newItemId, _characterIndex);

    // NFTの所有者を簡単に確認できるようにします。
    nftHolders[msg.sender] = newItemId;

    // 次に使用する人のためにtokenIdをインクリメントします。
    _tokenIds.increment();
  }
}
```

一行ずつ、更新されたコードを見ていきましょう。

```solidity
// NFT発行のコントラクト ERC721.sol をインポートします。
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

//OpenZeppelinが提供するヘルパー機能をインポートします。
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
```

[OpenZepplin](https://openzeppelin.com/) は、イーサリアムネットワーク上の開発を便利にするフレームワークです。

OpenZeppelinは、NFTの標準規格を実装し、そのうえに独自のロジックを書いてカスタマイズできるライブラリを提供しています。ここでは、それらを`MyEpicGame.sol`にインポートしています。

次に、下記のコードを見ていきましょう。

```solidity
contract MyEpicGame is ERC721 {
```

ここでは、コントラクトを宣言する際に、`is ERC721`を使用してOpenZeppelinのコントラクトを「継承」しています。

- NFTの標準規格は`ERC721`と呼ばれます。[こちら](https://eips.ethereum.org/EIPS/eip-721) に説明が記載されています。

- `ERC721`コントラクトの詳細は、[こちら](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol) をご覧ください。

「継承」とは、OpenZeppelinのようなライブラリやほかのスマートコントラクトから、必要なモジュールを呼び出すことを意味します。

- これは関数をインポートするようなイメージで理解してください。

- NFTのモジュールは`ERC721`として知られています。

- このモジュールには、NFTの発行に必要な標準機能が含まれているため、開発者は自分のコントラクトをカスタマイズすることに集中できます。

次に、下記のコードを見ていきましょう。

```solidity
using Counters for Counters.Counter;
```

`using Counters for Counters.Counter`はOpenZeppelinが`_tokenIds`を追跡するために提供するライブラリを呼び出しています。

これにより、トラッキングの際に起こりうるオーバーフローを防ぎます。

> 💡 オーバーフローとは？
>
> 例えば、8 ビットの情報量しか持てない`uint8`があるとします。つまり、格納できる最大の数値は 2 進数の 11111111（10 進数では、`2^8 - 1 = 255` ）です。
> 次のコードを見てください。最後の number は何に等しいでしょうか？
>
> ```
> uint8 number = 255;
> number++;
> ```
>
> この場合、オーバーフローを起こしたので、`number`は増加したにもかかわらず、実は 0 になっています。( 2 進数の 11111111 に 1 を加えると、時計が 23 時 59 分 から 00 時 00 分 に戻るように、00000000 にリセットされます)。
>
> アンダーフローも同様で、0 に等しい`uint8`から 1 を引くと、255 になります（ `uint`は符号なしなので、負にすることはできないからです）。
>
> ここでは`uint8`を使用していませんし、`uint256`が毎回 1 ずつ増加するときにオーバーフローする可能性は低いと思われますが（ `2^256`は本当に大きな数です）、将来的に DApp が予期せぬ動作をすることがないように、コントラクトに保護規定を設けることはグッとプラクティスです!👍

次に、下記のコードを見ていきましょう。

```solidity
Counters.Counter private _tokenIds;
```

ここでは、`private _tokenIds`を宣言して、`_tokenIds`を初期化しています。

- `_tokenIds`の初期値は0です。

tokenIdはNFTの一意な識別子で、0, 1, 2, .. Nのように付与されます。

次に、下記のコードを見ていきましょう。

```solidity
mapping(uint256 => CharacterAttributes) public nftHolderAttributes;
```

`nftHolderAttributes`はプレイヤーのNFTの状態を保存する変数になります。

ここでは、NFTのIDを`CharacterAttributes`構造体に`mapping`しています。

> **✍️: `mapping`について**
> ここでは、`mapping`と呼ばれる特別なデータ構造を使用しています。
>
> Solidity の`mapping`は、他の言語におけるハッシュテーブルや辞書のような役割を果たします。
>
> これらは、下記のように`_Key`と`_Value`のペアの形式でデータを格納するために使用されます。
>
> 例：
>
> ```solidity
> mapping（_Key=> _Value）public mappingName
> ```

今回は、NFTキャラクターの`tokenId`(= `_Key` = `uint256`)をそのユーザーがMintするNFTの`CharacterAttributes`(= `_Value`)に関連付けるために`mapping`を使用しました。

- `nftHolderAttributes`という状態変数には、`tokenId`と`CharacterAttributes`構造体に格納されたデータが対になって保存されます。

- コードの後半に、`nftHolderAttributes[newItemId] = CharacterAttributes({...})`という処理が記載されています。ここでは、現在の`tokenId`である`newItemId`を`CharacterAttributes`構造体に紐付ける処理が行われています。

  - 後で詳しく解説します。

同じように`mapping`を使用している下記のコードを見ていきましょう。

```solidity
mapping(address => uint256) public nftHolders;
```

ここでは、ユーザーの`address`と`tokenId`を紐づけるため、`mapping`を使用しています。

- `nftHolders`という状態変数には、ユーザーの`address`と`tokenId`に格納されたデータが対になって保存されます。

- コードの後半に、`nftHolders[msg.sender] = newItemId`という処理が記載されています。ここでは、`msg.sender`(＝フロントエンドから送信されるユーザーの`address`)に`newItemId`に紐付ける処理が行われています。
  - 後で詳しく解説します。

次に下記のコードを見ていきましょう。

```solidity
ERC721("OnePiece", "ONEPIECE");
```

ここでは、作成するNFTの名前(`"OnePiece"`)とそのシンボル(`"ONEPIECE"`)をERC721の規格に渡しています。

NFTはNon-Fungible "Token" の略であり、Tokenには、必ず名前とシンボルを付与する必要があります。

例：

- トークンの名前：Ethereum
- トークンのシンボル：ETH

次に、下記のコードを見ていきましょう。

```solidity
_tokenIds.increment();
```

Solidityにおいて、すべての数は`0`から始まるため、`_tokenIds`の初期値は`0`です。

ここでは`_tokenIDs`に`1`を加算しています。

**`constructor`の中で** `_tokenIDs`を`1`にインクリメントするのは、1番目の`tokenId`を`1`とした方が、あとあと処理が楽になるためです。

- `increment()`関数に関しては、[こちら](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/fa64a1ced0b70ab89073d5d0b6e01b0778f7e7d6/contracts/utils/Counters.sol#L32) を参照してください。

次に、`mintCharacterNFT`関数の中身を見ていきましょう。

```solidity
function mintCharacterNFT(uint _characterIndex) external {
```

この関数を呼び出すことにより、**NFT の Mint が行われます。**

`_characterIndex`はフロントエンドから送信される変数です。

`_characterIndex`を`mintCharacterNFT`関数に渡すことで、プレイヤーがどのキャラクター（例：ナミ）を欲しいか、コントラクトに伝えます。

たとえば、`mintCharacterNFT(1)`とすると、`defaultCharacters[1]`のデータを持つキャラクターがMintされます。

次に下記のコードを見ていきましょう。

```solidity
uint256 newItemId = _tokenIds.current();
```

ここでは、ユーザーが新しくNFTをMintする際に発行される`tokenID`を格納するために、`newItemId`変数を定義してます。

これはNFT自体のIDです。

各NFTは「一意」であり、そのために各トークンに一意のIDを付与しています。

通常`_tokenIds.current()`は`0`から始まりますが、`constructor`で`_tokenIds.increment()`を行ったので、`newItemId`は`1`になります。

NFTの一意な識別子を追跡するために`_tokenIds`を使用していますが、これは単なる数字です。

- 最初に`mintCharacterNFT`を呼び出すと`newItemId`は`1`になり、もう一度呼び出すと`newItemId`は`2`になり、これが繰り返されます。

- `newItemId`の値を変更すると、その値はグローバル変数のように直接コントラクトに格納され、メモリ上に永久に残ります。

次に、下記のコードを見ていきましょう。

```solidity
_safeMint(msg.sender, newItemId);
```

上記が実行されると、`newItemId`というIDのNFTキャラクターが`msg.sender`（＝フロントエンドからユーザーのアドレス）に、Mintされます。

> ✍️: `msg.sender`について
> `msg.sender`は [Solidity が提供する](https://docs.soliditylang.org/en/develop/uints-and-global-variables.html#block-and-transaction-properties) 変数で、フロントエンドからコントラクトを呼び出したユーザーの **公開アドレス** を保持した変数です。
>
> **原則として、ユーザーは、コントラクトを匿名で呼び出すことはできません。**
>
> ユーザーは、フロントエンドからウォレット認証を行って、NFT を Mint する必要があります。
>
> - これは、コントラクトへの「サインイン」機能のようなものです。

### 🎨 NFT のデータを更新する

引き続き、`MyEpicGame.sol`の内容を見ていきます。

今回のWebアプリケーションゲームでは、ボスに攻撃されると、プレイヤーの保持するNFTキャラクターのHPが減少します。

例を見ていきましょう。

私が新しくNFTをMintした際、私のNFTキャラクターには以下のようなデフォルト値が与えられます。

```text
{
  characterIndex: 1,
  name: "USOPP",
  imageURI: "https://i.imgur.com/WVAaMPA.png",
  hp: 200,
  maxHp: 200,
  attackDamage: 50
}
```

たとえば、私のキャラクターが攻撃を受けてHPが50減ったとします。

HPは200 → 150になります。

その値を下記のように、NFT上で変更する必要があります。

```text
{
  characterIndex: 1,
  name: "USOPP",
  imageURI: "https://i.imgur.com/WVAaMPA.png",
  hp: 150, // 更新された値
  maxHp: 200,
  attackDamage: 50
}
```

⚠️: 注意

> **すべてのプレイヤーは、それぞれ自分のキャラクター NFT を持っており、それぞれの NFT がキャラクターの状態に関する固有のデータを保持しています**。

このようなゲームの仕様を実装するために、コントラクトの中に、NFTキャラクターのHPが減ったことをデータとして保存するロジックを追加しました。

それでは、下記のコードを見ていきましょう。

```solidity
nftHolderAttributes[newItemId] = CharacterAttributes({
  characterIndex: _characterIndex,
  name: defaultCharacters[_characterIndex].name,
  imageURI: defaultCharacters[_characterIndex].imageURI,
  hp: defaultCharacters[_characterIndex].hp,
  maxHp: defaultCharacters[_characterIndex].maxHp,
  attackDamage: defaultCharacters[_characterIndex].attackDamage,
});
```

ここでは、`newItemId`というIDを持つNFTキャラクターの状態を、更新しています。

データを更新するために、NFTの`tokenId`(＝ `newItemId`)を`CharacterAttributes`構造体にマップする`nftHolderAttributes`変数を使用します。

これにより、プレイヤーのNFTに関連する値を簡単に更新できます。

- プレイヤーが攻撃されて、NFTキャラクターの`hp`値が減ると、`nftHolderAttributes`上でそのキャラクターの`hp`値が更新されます。

- この処理によって、プレイヤー固有のNFTデータをコントラクトに保存できます。

> ✍️: `mapping`を覚えていますか？
>
> ```solidity
> // MyEpicGame.sol
> mapping(uint256 => CharacterAttributes) public nftHolderAttributes
> ```
>
> ここで、現在の`tokenId`（＝ `newItemId` ）を`CharacterAttributes`構造体に紐づける`nftHolderAttributes`変数を定義しました。
>
> `nftHolderAttributes`はプレイヤーの NFT の状態を保存する変数になります。

NFTのメタデータは変更できないと思われがちですが、そんなことはありません。実はクリエイター次第なんです 😊

次に、下記の処理を見ていきましょう。

```solidity
nftHolders[msg.sender] = newItemId;
```

ここでは、ユーザーのパブリックウォレットアドレスをNFTの`tokenI`(＝ `newItemId`)にマップしています。

この処理によって、誰がどのNFTを所有しているかを簡単に追跡できます。

**🦖: プレイヤーと NFT キャラクター**

> 簡単のために、今回のプロジェクトでは、各プレイヤーはウォレットアドレスにつき 1 つの NFT キャラクターしか保有できないようになっています。
>
> もし興味があれば、プレイヤーが複数のキャラクターを保持できるようにコントラクトを調整してみてください 😊

最後に、下記のコードを見ていきましょう。

```solidity
_tokenIds.increment();
```

NFTをMintした後、OpenZeppelinが提供する関数`_tokenIds.increment()`を使って`_tokenIds`をインクリメントしています。

この処理によって、次回NFTをミントするユーザーには、新しい`tokenId`が付与されます。すでにMintされた`tokenId`は誰も持つことができません。

### 😳 ローカル環境でテストを実行する

次は、`run.js`に、`mintCharacterNFT`関数を呼び出す処理を追加していきます。

以下のコードを`run.js`の`console.log`の直下に追加しましょう。

```javascript
// 再代入可能な変数 txn を宣言
let txn;
// 3体のNFTキャラクターの中から、3番目のキャラクターを Mint しています。
txn = await gameContract.mintCharacterNFT(2);

// Minting が仮想マイナーにより、承認されるのを待ちます。
await txn.wait();

// NFTのURIの値を取得します。tokenURI は ERC721 から継承した関数です。
let returnedTokenUri = await gameContract.tokenURI(1);
console.log("Token URI:", returnedTokenUri);
```

コードを1行ずつ見ていきましょう。

```javascript
// 再代入可能な変数 txn を宣言
let txn;
// 3体のNFTキャラクターの中から、3番目のキャラクターを Mint しています。
txn = await gameContract.mintCharacterNFT(2);
```

https://qiita.com/y-temp4/items/289686fbdde896d22b5e

ここでは、`MyEpicGame.sol`から`mintCharacterNFT`関数を呼び出して、3体のNFTキャラクターの中から、3番目のキャラクターをMintしています。

`run.js`から`mintCharacterNFT`関数を実行する際、Hardhatはあなたのローカル環境に設定された **デフォルトウォレット** をコントラクトに展開します。

- したがって、`MyEpicGame.sol`上では、Hardhatが提供したデフォルトウォレットのパブリックアドレスが`msg.sender`に格納されます。

次に、下記のコードを見ていきましょう。

```javascript
// Minting が仮想マイナーにより、承認されるのを待ちます。
await txn.wait();
// NFTのURIの値を取得します。tokenURI は ERC721 から継承した関数です。
let returnedTokenUri = await gameContract.tokenURI(1);
console.log("Token URI:", returnedTokenUri);
```

`tokenURI()`は、NFTにアタッチされている **実際のデータ** を返す関数です。

`gameContract.tokenURI(1)`が呼び出されると、`returnedTokenUri`には、`tokenId` ＝ `1`のNFTキャラクターのデータ（キャラクターの名前、HPなど）が格納されます。

それでは、ターミナル上で下記を実行してみましょう。

```
yarn contract run:script
```

下記のような結果がターミナルに出力されていれば、テストは成功です。

```
Compiling 11 files with 0.8.17
Solidity compilation finished successfully
Done initializing ZORO w/ HP 100, img https://i.imgur.com/TZEhCTX.png
Done initializing USOPP w/ HP 200, img https://i.imgur.com/WVAaMPA.png
Done initializing USOPP w/ HP 300, img https://i.imgur.com/pCMZeiM.png
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Minted NFT w/ tokenId 1 and characterIndex 2
Token URI:
```

現在、NFTに実際のデータは添付されていないので、ターミナルには、Token URIが出力されていません。

これから、`MyEpicGame.sol`の`nftHolderAttributes`を更新して、`tokenURI`を添付していきます。

### ⭐️ `tokenURI`をセットアップする

`tokenURI`には、NFTデータを **JSON** 形式で渡す必要があります。

まず、`contract/contracts`ディレクトリの下に`libraries`というディレクトリを作成しましょう。

下記のディレクトリ構図を参考にしてください。

```
contract
   |_ contracts
		  |_ libraries
```

`libraries`ディレクトリに`Base64.sol`という名前のファイルを作成し、下記のコードを貼り付けてください。

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

このファイルには、SVGとJSONをBase64に変換するための関数が含まれています。

次に、`MyEpicGame.sol`に`Base64.sol`をインポートするコードを追加します。

下記のコードを、`MyEpicGame.sol`の先頭付近（ライブラリをインポートしているコードブロックの近く）に、追加してください。

```solidity
// Base64.sol からヘルパー関数をインポートする。
import "./libraries/Base64.sol";
```

次に、`MyEpicGame`コントラクトの中に、`tokenURI`という関数を記述します。

- `mintCharacterNFT`関数の下に、下記の関数を追加してください。

```solidity
// nftHolderAttributes を更新して、tokenURI を添付する関数を作成
function tokenURI(uint256 _tokenId) public view override returns (string memory) {
  CharacterAttributes memory charAttributes = nftHolderAttributes[_tokenId];
  // charAttributes のデータ編集して、JSON の構造に合わせた変数に格納しています。
  string memory strHp = Strings.toString(charAttributes.hp);
  string memory strMaxHp = Strings.toString(charAttributes.maxHp);
  string memory strAttackDamage = Strings.toString(charAttributes.attackDamage);

	string memory json = Base64.encode(
		// abi.encodePacked で文字列を結合します。
		// OpenSeaが採用するJSONデータをフォーマットしています。
  		abi.encodePacked(
        '{"name": "',
        charAttributes.name,
        ' -- NFT #: ',
        Strings.toString(_tokenId),
        '", "description": "This is an NFT that lets people play in the game Metaverse Slayer!", "image": "',
        charAttributes.imageURI,
        '", "attributes": [ { "trait_type": "Health Points", "value": ',strHp,', "max_value":',strMaxHp,'}, { "trait_type": "Attack Damage", "value": ',
        strAttackDamage,'} ]}'
  		)
	);
	// 文字列 data:application/json;base64, と json の中身を結合して、tokenURI を作成しています。
	string memory output = string(
		abi.encodePacked("data:application/json;base64,", json)
	);
	return output;
}
```

コードを見ていきましょう。

```solidity
  // nftHolderAttributes を更新して、tokenURI を添付する関数を作成
function tokenURI(uint256 _tokenId) public view override returns (string memory) {
// _tokenId を使って特定の NFT データを照会し、データを取得しています。
CharacterAttributes memory charAttributes = nftHolderAttributes[_tokenId];
	:
```

ここでは、`nftHolderAttributes`関数に渡された`_tokenId`を使って、特定のNFTデータを照会し、そのデータを`charAttributes`に格納しています。

- もし私が`tokenURI(151)`を実行したら、151番目のNFTに関連するJSONデータを返します。

次に、下記のコードを見ていきましょう。

```solidity
string memory strHp = Strings.toString(charAttributes.hp);
string memory strMaxHp = Strings.toString(charAttributes.maxHp);
string memory strAttackDamage = Strings.toString(charAttributes.attackDamage);
```

ここでは、`charAttributes`データ編集して、JSONの構造に合わせた変数に格納しています。

次に、下記のコードを見ていきましょう。

```solidity
string memory json = Base64.encode(
  // abi.encodePacked で文字列を結合します。
  abi.encodePacked(
        '{"name": "',
        charAttributes.name,
        ' -- NFT #: ',
        Strings.toString(_tokenId),
        '", "description": "This is an NFT that lets people play in the game Metaverse Slayer!", "image": "',
        charAttributes.imageURI,
        '", "attributes": [ { "trait_type": "Health Points", "value": ',strHp,', "max_value":',strMaxHp,'}, { "trait_type": "Attack Damage", "value": ',
        strAttackDamage,'} ]}'
  )
);
```

ここでは、OpenSeaなどのNFTマーケットプレイスが採用しているNFTのメタデータのデータ構造に沿って、JSONをフォーマットしています。

- OpenSeaなどのNFTマーケットプレイスで扱えるJSONのデータ構造に関しては、[こちら](https://zenn.dev/hayatoomori/articles/f26cc4637c7d66) をご覧ください。

NFTのメタデータとして使用できるJSONは、下記のようなデータ構造になります。

```json
{
  "name": "USOPP",
  "description": "This is an NFT that lets people play in the game Metaverse Slayer!",
  "image": "https://i.imgur.com/WVAaMPA.png",
  "attributes": [
    { "trait_type": "Health Points", "value": 200, "max_value": 200 },
    { "trait_type": "Attack Damage", "value": 50 }
  ]
}
```

最後に、下記のコードを見ていきましょう。

```solidity
abi.encodePacked("data:application/json;base64,", json);
```

ここでは、文字列`data:application/json;base64,`と`json`の中身を結合して、`tokenURI`を作成しています。

それでは、ターミナル上で下記を実行してみましょう。

```
yarn contract run:script
```

下記のような結果がターミナルに出力されていれば、テストは成功です。

```plaintext
Compiling 2 files with 0.8.17
Solidity compilation finished successfully
Done initializing ZORO w/ HP 100, img https://i.imgur.com/TZEhCTX.png
Done initializing NAMI w/ HP 200, img https://i.imgur.com/WVAaMPA.png
Done initializing USOPP w/ HP 300, img https://i.imgur.com/pCMZeiM.png
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Minted NFT w/ tokenId 1 and characterIndex 2
Token URI: data:application/json;base64,eyJuYW1lIjogIlpFTklHQU1FIC0tIE5GVCAjOiAxIiwgImRlc2NyaXB0aW9uIjogIkJyYXZlIGFzIGEgYmxhemluZyBmaXJlLiIsICJpbWFnZSI6ICJodHRwczovL2kuaW1ndXIuY29tL2NmdG9kajkucG5nIiwgImF0dHJpYnV0ZXMiOiBbIHsgInRyYWl0X3R5cGUiOiAiSGVhbHRoIFBvaW50cyIsICJ2YWx1ZSI6IDMwMCwgIm1heF92YWx1ZSI6MzAwfSwgeyAidHJhaXRfdHlwZSI6ICJBdHRhY2sgRGFtYWdlIiwgInZhbHVlIjogMjV9IF19
```

Token URIがターミナルに出力されました!

`Token URI:`の後に続く文字列全体をコピーしてください。

例)

```plaintext
data:application/json;base64 eyJuYW1lIjogIlpFTklHQU1FIC0tIE5GVC...
```

その文字列をブラウザのURLバーに貼り付けて、中身を確認してみましょ。

ブラウザに表示されるているのは、`MyEpicGame.sol`に追加した`tokenURI`関数の中で、NFTキャラクターの情報がJSONファイル形式にフォーマットされ、さらにBase64形式で**エンコード**された結果です。

- JSONファイルの前に`data:application/json;base64,`を付けると、上記のようなエンコード文字列になり、ブラウザで読み込めます。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#ethereum`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンに進んで、テストネットにコントラクトをデプロイしていきましょう 🎉

### 🏠 ドメインを販売する

スマートコントラクトができてきました。

ただし、現在はマッピングを提供しているだけです。

ウォレットやOpenSeaで実際に表示することはできません。

これから行うことは、**ドメインを OpenSea で表示可能な NFT に変換**し、ドメインの長さに応じてさまざまな金額で販売することです。

ちなみに、ENSドメインでは一度に特定のドメインを保持できるウォレットは1つだけです。

### 💰 支払いを実装しよう

私たちは実際には`.eth`のようなTLD（トップレベルドメイン）をコントラクトに入れていません。

ミントしたいドメインを設定しましょう! 私は`.ninja`を使います 🥷

**ご自身のものを設定してみてください。**。「.takeshi」など何でも結構です：

`Domains.sol`を変更します。

```solidity
// Domains.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// インポートを忘れずに。
import { StringUtils } from "./libraries/StringUtils.sol";

import "hardhat/console.sol";

contract Domains {
  // トップレベルドメイン(TLD)です。
  string public tld;

  mapping(string => address) public domains;
  mapping(string => string) public records;

  // constructorに"payable"を加えます。
  constructor(string memory _tld) payable {
    tld = _tld;
    console.log("%s name service deployed", _tld);
  }

  // domainの長さにより価格が変わります。
  function price(string calldata name) public pure returns(uint) {
    uint len = StringUtils.strlen(name);
    require(len > 0);
    if (len == 3) { // 3文字のドメインの場合 (通常,ドメインは3文字以上とされます。あとのセクションで触れます。)
      return 0.005 * 10**18; // 5 MATIC = 5 000 000 000 000 000 000 (18ケタ).あとでfaucetから少量もらう関係 0.005MATIC。
    } else if (len == 4) { //4文字のドメインの場合
      return 0.003 * 10**18; // 0.003MATIC
    } else {
      return 0.001 * 10**18; // 0.001MATIC
    }
  }

  function register(string calldata name) public payable{
    require(domains[name] == address(0));
    uint _price = price(name);

    // トランザクションを処理できる分だけのMATICがあるか確認
    require(msg.value >= _price, "Not enough Matic paid");

    domains[name] = msg.sender;
    console.log("%s has registered a domain!", msg.sender);
  }
  // 他のfunction は変更せず。
}
```

ここで新しい言葉に気付くでしょう。

`register`に`payable`を追加しました。

```solidity
// Domains.sol
uint _price = price(name);
require(msg.value >= _price, "Not enough Matic paid");
```

ここでは、送信された`msg`の`value`が一定量を超えているかどうかを確認します。 `value`は送信されたMaticの量であり、`msg`はトランザクション本体です。

これは実はすごいことです。 数行のコードで、アプリに支払い機能を追加できます。APIキーは必要ありません。 大手プロバイダーとやりとりする必要もありません。

これがブロックチェーンのすばらしいところです。

また、トランザクションに十分なMaticがない場合、トランザクションは元に戻され、何も変更されません。

`price`関数を詳しく見ると、これは`pure`関数であることがわかります。

つまり、コントラクトの状態を読み取ったり変更したりすることはありません。

価格はJavaScriptなどを使用してフロントエンドでも実行できますが、その必要もないでしょう。ここでは、チェーン上で最終価格を計算します。

**ドメインの長さに基づいて価格を返すように設定しました。 ドメインが短いほどコストが高くなります**

.comなどでもシンプルなドメインは価値が出ますよね。

MATICトークンには小数点以下18桁があるため、価格の最後に`* 10**18`を付ける必要があります。

```solidity
// Domains.sol
function price(string calldata name) public pure returns(uint) {
  uint len = StringUtils.strlen(name);
  require(len > 0);
  if (len == 3) {
    return 0.005 * 10**18; // 5 MATIC = 5 000 000 000 000 000 000 (18ケタ).
    //ここではあとでfaucetから少量のMATICをもらう関係で0.005MATICとしておきます。
  } else if (len == 4) {
    return 0.003 * 10**18; // ドメイン文字数が増えると少し安くなる。0.003MATIC
  } else {
    return 0.001 * 10**18; //  0.001MATIC
  }
}
```

_注：**Mumbai などテストネットでは価格を下げてミントしましょう。** 1 Matic のような設定をするとテストネットの資金がすぐになくなります。 ローカルで実行している場合は何回でも課金できますが、実際のテストネットワークを使用している場合は注意が必要です。_

他に、次の3つを追加しました。

- `import{StringUtils}`バッケージをインポートしています。 これについては下で説明しています。

- 文字列`tld`これは、ドメインの末尾を記録します(例：`.ninja`)。

- `string memory _tld` constructorは1回だけ実行されます。これはpublicの`tld`変数を設定する方法です。

`contracts`フォルダーに`libraries`という新しいフォルダーを作成し、`StringUtils.sol`というファイルを作成します。[こちら](https://gist.github.com/AlmostEfficient/669ac250214f30347097a1aeedcdfa12)からコピーしてくださいSolidityの文字列は少し特殊なので、変換するのに関数などが必要です。 この外部ライブラリは文字列をバイトに変換し、ガス効率を向上させます。

作成したスマートコントラクトは支払いを受ける準備ができています。

今、私たちのドメインを望んでいるすべての人に販売することができます。

`run.js`に向かい、次のように更新しましょう。

```javascript
// run.js
const main = async () => {
  const domainContractFactory = await hre.ethers.getContractFactory("Domains");
  // "ninja"をデプロイ時にconstructorに渡します。
  const domainContract = await domainContractFactory.deploy("ninja");
  await domainContract.deployed();

  console.log("Contract deployed to:", domainContract.address);

  // valueで代金をやりとりしています。
  let txn = await domainContract.register("mortal", {
    value: hre.ethers.utils.parseEther("0.01"),
  });
  await txn.wait();

  const address = await domainContract.getAddress("mortal");
  console.log("Owner of domain mortal:", address);

  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(balance));
};

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

ここでは実際に何をしているのでしょうか。

登録されているすべてのドメインの末尾を`.ninja`にします。 つまり、 `tld`プロパティを初期化するには、`deploy`関数に`ninja`を渡す必要があります。 次に、ドメインを登録するには、実際に`register`関数を呼び出す必要があります。 このとき2つの引数が必要であることに注意しておきましょう。

- 登録するdomain
- **Matic 建ての domain（ガスを含む）の価格**

単位換算は[Solidity では動作が異なる](https://docs.soliditylang.org/en/v0.8.11/units-and-global-variables.html#units-and-globally-available)ため、特別な`parseEther`関数を使用します)。 これにより、支払いとして0.01Maticがウォレットからコントラクトに送信されます。 その後、ドメインは私のウォレットアドレスに作成されます。

**たったこれだけです。**

スマートコントラクトで支払いを行うのはとても簡単です。

高額な手数料を支払い処理業者に払ったり、クレジットカード手数料を払わなければならないといったこともありません。

数行のコードでいいのです。

さあ、`run.js`スクリプトを実行しましょう。 これを行うと、次のような結果が表示されます。

![](/public/images/Polygon-ENS-Domain/section-1/1_4_1.png)

**やりました!** シンプルなコントラクトコードだけで、ENSの基本的なアクションを実行できるようになりました。

ただし、これで終わりではありません。いくつかNFTを使用して、このドメインをもっとかっこよくしましょう 👀

### 💎 Non Fungible ドメイン

ではドメインマッピングを**✨NFT✨**に変換してみましょう。

OpenSeaにENSドメインを所有している場合、実際には次のようなものが表示されます。

![](/public/images/Polygon-ENS-Domain/section-1/1_4_2.png)

もしかしたら、なぜ私たちは自分のドメインをNFTにする必要があるのだろうと考えるかもしれません。

ポイントは何なのでしょうか。

伝統的なweb2ドメインについて考えても、それらはすでにNFTとも言えます。

名前ごとにドメインは1つしか存在できません。

複数の人が同じドメインを所有することはできません。

ドメインを購入すると、実際にはインターネット全体で唯一のコピーを所有および管理します。

だから私たちはそれを活用してきたわけですが、これらを非常に簡単に交換/譲渡できればもっと素晴らしいのではないでしょうか。

結局、ENSドメインは単なる"トークン"です。

さらに進んで、NFTを使用してブロックチェーン上のドメインを最大限活用してみましょう 🤘

コードに取り組む前にここで実際に行うことを確認しましょう。

1. OpenZeppelinのコントラクトを使用して、ERC721トークンを簡単に作成します。
2. NFT用のSVGを作成し、チェーンストレージで使用します。
3. トークンメタデータ（NFTが保持するデータ）を設定します。
4. ミントします!

最後には**新しく登録したドメインを取得して、そこから NFT を作成し**します。

`Domains.sol`のコードを以下のように変更します。`register`関数が特に大きく変更されています。あとでまた説明しますね。

```solidity
// Domains.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// 最初にOpenZeppelinライブラリをインポートします.
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {StringUtils} from "./libraries/StringUtils.sol";
// Base64のライブラリをインポートします。
import {Base64} from "./libraries/Base64.sol";

import "hardhat/console.sol";

// インポートしたコントラクトを継承します。継承したコントラクトのメソッドを使用できるようになります。
contract Domains is ERC721URIStorage {
  // OpenZeppelinによりtokenIdsの追跡が容易になります。
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  string public tld;

  // NFTのイメージ画像をSVG形式でオンチェーンに保存します。
  string svgPartOne = '<svg xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none"><path fill="url(#B)" d="M0 0h270v270H0z"/><defs><filter id="A" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" height="270" width="270"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity=".225" width="200%" height="200%"/></filter></defs><path d="M72.863 42.949c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-10.081 6.032-6.85 3.934-10.081 6.032c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-8.013-4.721a4.52 4.52 0 0 1-1.589-1.616c-.384-.665-.594-1.418-.608-2.187v-9.31c-.013-.775.185-1.538.572-2.208a4.25 4.25 0 0 1 1.625-1.595l7.884-4.59c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v6.032l6.85-4.065v-6.032c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595L41.456 24.59c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-14.864 8.655a4.25 4.25 0 0 0-1.625 1.595c-.387.67-.585 1.434-.572 2.208v17.441c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l10.081-5.901 6.85-4.065 10.081-5.901c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v9.311c.013.775-.185 1.538-.572 2.208a4.25 4.25 0 0 1-1.625 1.595l-7.884 4.721c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-7.884-4.59a4.52 4.52 0 0 1-1.589-1.616c-.385-.665-.594-1.418-.608-2.187v-6.032l-6.85 4.065v6.032c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l14.864-8.655c.657-.394 1.204-.95 1.589-1.616s.594-1.418.609-2.187V55.538c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595l-14.993-8.786z" fill="#fff"/><defs><linearGradient id="B" x1="0" y1="0" x2="270" y2="270" gradientUnits="userSpaceOnUse"><stop stop-color="#cb5eee"/><stop offset="1" stop-color="#0cd7e4" stop-opacity=".99"/></linearGradient></defs><text x="32.5" y="231" font-size="27" fill="#fff" filter="url(#A)" font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">';
  string svgPartTwo = '</text></svg>';

  mapping(string => address) public domains;
  mapping(string => string) public records;

  constructor(string memory _tld) payable ERC721("Ninja Name Service", "NNS") {
    tld = _tld;
    console.log("%s name service deployed", _tld);
  }

  function register(string calldata name) public payable {
    require(domains[name] == address(0));

    uint256 _price = price(name);
    require(msg.value >= _price, "Not enough Matic paid");

    // ネームとTLD(トップレベルドメイン)を結合します。
    string memory _name = string(abi.encodePacked(name, ".", tld));
    // NFT用にSVGイメージを作成します。
    string memory finalSvg = string(abi.encodePacked(svgPartOne, _name, svgPartTwo));
    uint256 newRecordId = _tokenIds.current();
    uint256 length = StringUtils.strlen(name);
    string memory strLen = Strings.toString(length);

    console.log("Registering %s.%s on the contract with tokenID %d", name, tld, newRecordId);

    // JSON形式のNFTのメタデータを作成。文字列を結合しbase64でエンコードします。
    string memory json = Base64.encode(
      abi.encodePacked(
        '{"name": "',
        _name,
        '", "description": "A domain on the Ninja name service", "image": "data:image/svg+xml;base64,',
        Base64.encode(bytes(finalSvg)),
        '","length":"',
        strLen,
        '"}'
      )
    );

    string memory finalTokenUri = string( abi.encodePacked("data:application/json;base64,", json));

    console.log("\n--------------------------------------------------------");
    console.log("Final tokenURI", finalTokenUri);
    console.log("--------------------------------------------------------\n");

    _safeMint(msg.sender, newRecordId);
    _setTokenURI(newRecordId, finalTokenUri);
    domains[name] = msg.sender;

    _tokenIds.increment();
  }

  // price, getAddress, setRecord, getRecord などのfunction は変更しません。
}
```

_注：引き続き`price`、` getAddress`、`setRecord`および`getRecord`関数は必要です。変更されていないため、ここでは省略していますが消さないでください。_

```solidity
// Domains.sol
// 最初にOpenZeppelinライブラリをインポートします.
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// Base64のライブラリをインポートします。
import {Base64} from "./libraries/Base64.sol";

contract Domains is ERC721URIStorage {
```

前に出てきた`StringUtils`と同様に、既存の外部ライブラリをインポートしています。 今回はOpenZeppelinからインポートします。 次に、ドメインコントラクトを宣言するときに、`ERC721URIStorage`を使用してそれらを「継承」します。 継承について詳しくは[こちら](https://solidity-by-example.org/inheritance/)をご覧ください。基本的には、他のコントラクトを私たちから呼び出すことができることを意味します。 これは、私たちが使用する関数をインポートするようなものです。

では、ここから何が得られるのでしょうか。

`ERC721`として知られている規格を使用してNFTを作成することができます。

[こちら](https://eips.ethereum.org/EIPS/eip-721)で詳細を読むことができます。

OpenZeppelinは、NFTの標準を実装していて、それをベースに独自のロジックを記述してカスタマイズできるようにしています。 つまり、いわゆるボイラープレートコードを記述する必要はありません。 ライブラリを使用せずにHTTPサーバーを最初から作成するのは現実的でないでしょう。 同様に、NFTコントラクトを最初から作成する必要はありません。

`Base64`は外部ライブラリの関数で、NFTイメージに使用されるSVGとそのメタデータのJSONを、Solidityの`Base64`に変換するのに役立ちます。 ライブラリフォルダ`libraries`に`Base64.sol`という名前のファイルを作成し、[ここ](https://gist.github.com/farzaa/f13f5d9bda13af68cc96b54851345832)からコードをコピーして貼り付けます。

```solidity
// Domains.sol
using Counters for Counters.Counter;
Counters.Counter private _tokenIds;
```

次に、コントラクトの上部に`Counters`が表示されます。これは何でしょうか。何かを数えるために必ずライブラリが必要なわけではありませんがここではガス効率が高く、NFT用に構築されたものをインポートしています。

`_tokenIds`を使用して、NFTの一意の識別子を追跡します。 これは、`private _tokenIds`を宣言したときに自動的に0に初期化される数値です。

したがって、最初に`register`を呼び出すと、`newRecordId`は0になります。再度実行すると、 `newRecordId`は1になり、以下同様に続きます。 `_tokenIds`は**状態変数**であることに注意してください。これは、変更されると、値がコントラクトに直接保存されることを意味します。

```solidity
// Domains.sol
constructor(string memory _tld) payable ERC721("Ninja Name Service", "NNS") {
  tld = _tld;
  console.log("%s name service deployed", _tld);
}
```

ここで、継承したいすべてのERC721コントラクト情報を取り込むようにコントラクトに指示しています。 渡す必要があるのは次のとおりです。

- NFTコレクション名、`Ninja Name Service`。
- NFTのシンボル名、`NNS`。

ご自分で好きな名前に変えてみてください。

次に、NFTを設計します。 これはアプリの非常に重要な部分となります。NFTは、誰もが自分のウォレットやOpenSeaで目にするものです。 実際には、NFTをPolygonブロックチェーン上に保存します。 多くのNFTは、画像ホスティングサービスを指す単なるリンクです。 通常サーバーサービスがダウンした場合、NFTにはイメージ画像がなくなります。 それをブロックチェーン上に置くことによって、永続性を持ちます。

これを実現するために、SVG（コードで構築されたイメージ）を使用します。 グラデーション、ポリゴンロゴ、ドメインテキストを含む正方形のボックスのSVGコードは次のとおりです。

```html
<svg xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none">
  <path fill="url(#B)" d="M0 0h270v270H0z" />
  <defs>
    <filter
      id="A"
      color-interpolation-filters="sRGB"
      filterUnits="userSpaceOnUse"
      height="270"
      width="270"
    >
      <feDropShadow
        dx="0"
        dy="1"
        stdDeviation="2"
        flood-opacity=".225"
        width="200%"
        height="200%"
      />
    </filter>
  </defs>
  <path
    d="M72.863 42.949c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-10.081 6.032-6.85 3.934-10.081 6.032c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-8.013-4.721a4.52 4.52 0 0 1-1.589-1.616c-.384-.665-.594-1.418-.608-2.187v-9.31c-.013-.775.185-1.538.572-2.208a4.25 4.25 0 0 1 1.625-1.595l7.884-4.59c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v6.032l6.85-4.065v-6.032c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595L41.456 24.59c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-14.864 8.655a4.25 4.25 0 0 0-1.625 1.595c-.387.67-.585 1.434-.572 2.208v17.441c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l10.081-5.901 6.85-4.065 10.081-5.901c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v9.311c.013.775-.185 1.538-.572 2.208a4.25 4.25 0 0 1-1.625 1.595l-7.884 4.721c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-7.884-4.59a4.52 4.52 0 0 1-1.589-1.616c-.385-.665-.594-1.418-.608-2.187v-6.032l-6.85 4.065v6.032c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l14.864-8.655c.657-.394 1.204-.95 1.589-1.616s.594-1.418.609-2.187V55.538c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595l-14.993-8.786z"
    fill="#fff"
  />
  <defs>
    <linearGradient
      id="B"
      x1="0"
      y1="0"
      x2="270"
      y2="270"
      gradientUnits="userSpaceOnUse"
    >
      <stop stop-color="#cb5eee" />
      <stop offset="1" stop-color="#0cd7e4" stop-opacity=".99" />
    </linearGradient>
  </defs>
  <text
    x="32.5"
    y="231"
    font-size="27"
    fill="#fff"
    filter="url(#A)"
    font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif"
    font-weight="bold"
  >
    mortal.ninja
  </text>
</svg>
```

HTMLファイルのようなものですね。 ここではSVGを作成する方法を知る必要はありません。 無料で作成できるツールはたくさんあります。 これは[Figma](https://www.figma.com/)を使って作りました。興味がある方は調べてみるといいでしょう。

[こちら](https://www.svgviewer.dev/)のウェブサイトにアクセスし、上のコードを貼り付けて確認してみてください。

**コード付きの画像**を作成できるので有用です。

SVGは**多くの場合**カスタマイズできます。SVGをアニメーション化することもできます。 詳細については、[こちら](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial)をご参照ください。

最終的なNFTは以下のようなものになりました。

![](/public/images/Polygon-ENS-Domain/section-1/1_4_3.png)

SVGをカスタマイズしてみても面白いでしょう。興味がある方は、アニメーション化されたSVGを試すこともいいでしょう 👀

```javascript
  string svgPartOne = '<svg xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none"><path fill="url(#B)" d="M0 0h270v270H0z"/><defs><filter id="A" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" height="270" width="270"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity=".225" width="200%" height="200%"/></filter></defs><path d="M72.863 42.949c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-10.081 6.032-6.85 3.934-10.081 6.032c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-8.013-4.721a4.52 4.52 0 0 1-1.589-1.616c-.384-.665-.594-1.418-.608-2.187v-9.31c-.013-.775.185-1.538.572-2.208a4.25 4.25 0 0 1 1.625-1.595l7.884-4.59c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v6.032l6.85-4.065v-6.032c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595L41.456 24.59c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-14.864 8.655a4.25 4.25 0 0 0-1.625 1.595c-.387.67-.585 1.434-.572 2.208v17.441c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l10.081-5.901 6.85-4.065 10.081-5.901c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v9.311c.013.775-.185 1.538-.572 2.208a4.25 4.25 0 0 1-1.625 1.595l-7.884 4.721c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-7.884-4.59a4.52 4.52 0 0 1-1.589-1.616c-.385-.665-.594-1.418-.608-2.187v-6.032l-6.85 4.065v6.032c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l14.864-8.655c.657-.394 1.204-.95 1.589-1.616s.594-1.418.609-2.187V55.538c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595l-14.993-8.786z" fill="#fff"/><defs><linearGradient id="B" x1="0" y1="0" x2="270" y2="270" gradientUnits="userSpaceOnUse"><stop stop-color="#cb5eee"/><stop offset="1" stop-color="#0cd7e4" stop-opacity=".99"/></linearGradient></defs><text x="32.5" y="231" font-size="27" fill="#fff" filter="url(#A)" font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">';
  string svgPartTwo = '</text></svg>';
```

ここで行っているのは、ドメインに基づいてSVGを作成することだけです。SVGを2つに分割し、その間にドメインを配置します。

```solidity
// Domains.sol
string memory _name = string(abi.encodePacked(name, ".", tld));
string memory finalSvg = string(abi.encodePacked(svgPartOne, _name, svgPartTwo));
```

この`abi.encodePacked`について簡単に見てみましょう。

Solidityの文字列が特殊だと言ったのを覚えていますでしょうか？

文字列を直接組み合わせることはできません。

代わりに、`encodePacked`関数を使用して、一連の文字列をバイトに変換してから結合する必要があります。

```solidity
// Domains.sol
string(abi.encodePacked(svgPartOne, _name, svgPartTwo));
```

これは、SVGコードとドメインを実際に組み合わせる強力な1行です。`<svg>自分のドメイン</svg>`を実行するようなものです。

ドメインのアセットができたので、`register`関数を詳しく見て、メタデータがどのように構築されているかを確認しましょう。

```solidity
// Domains.sol
function register(string calldata name) public payable {
  require(domains[name] == address(0));

  uint256 _price = price(name);
  require(msg.value >= _price, "Not enough Matic paid");

  string memory _name = string(abi.encodePacked(name, ".", tld));
  string memory finalSvg = string(abi.encodePacked(svgPartOne, _name, svgPartTwo));
  uint256 newRecordId = _tokenIds.current();
  uint256 length = StringUtils.strlen(name);
  string memory strLen = Strings.toString(length);

  console.log("Registering %s on the contract with tokenID %d", name, newRecordId);

  string memory json = Base64.encode(
    abi.encodePacked(
        '{"name": "',
        _name,
        '", "description": "A domain on the Ninja name service", "image": "data:image/svg+xml;base64,',
        Base64.encode(bytes(finalSvg)),
        '","length":"',
        strLen,
        '"}'
    )
  );

  string memory finalTokenUri = string( abi.encodePacked("data:application/json;base64,", json));

  console.log("\n--------------------------------------------------------");
  console.log("Final tokenURI", finalTokenUri);
  console.log("--------------------------------------------------------\n");

  _safeMint(msg.sender, newRecordId);
  _setTokenURI(newRecordId, finalTokenUri);
  domains[name] = msg.sender;

  _tokenIds.increment();
}
```

ほとんどはもう学習済みです。今までで取り上げていないのは、`_tokenIds`と`json`の使用だけです。

`json` NFTはJSONを使用して、名前（name）、説明（description）、属性（attributes）、メディア（media）などの詳細情報を保存します。 `json`で行っているのは、文字列と`abi.encodePacked`を組み合わせてJSONオブジェクトを作成することです。 次に、トークンURIとして設定する前に、Base64文字列としてエンコードしています。

`_tokenIds`について知っておく必要があるのは、NFTの一意のトークン番号にアクセスして設定できるオブジェクトであるということだけです。 各NFTには一意の`id`があり、それはNFTを確認するのに役立ちます。 以下の2つの行は、実際にNFTを作成する行です。

```solidity
// Domains.sol
// newRecordId にNFTをミントします。
_safeMint(msg.sender, newRecordId);

// ドメイン情報をnewRecordIdにセットします。
_setTokenURI(newRecordId, finalTokenUri);
```

`finalTokenUri`をコンソールに出力するコンソールログを追加しました。 `data：application / json; base64`の1つを取得し、それをブラウザのアドレスバーに入力すると、すべてのJSONメタデータが表示されます。

### 🥸 NFT ドメインをローカルで作成する

コントラクトを実行する準備ができました! ローカルブロックチェーンでミントしてみましょう。

```
Compiled 13 Solidity files successfully
ninja name service deployed
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Registering mortal.ninja on the contract with tokenID 0

--------------------------------------------------------
Final tokenURI data:application/json;base64,eyJuYW1lIjogIm1vcnRhbC5uaW5qYSIsICJkZXNjcmlwdGlvbiI6ICJBIGRvbWFpbiBvbiB0aGUgTmluamEgbmFtZSBzZXJ2aWNlIiwgImltYWdlIjogImRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEhOMlp5QjRiV3h1Y3

//(長いため途中省略)

wWmlJZ1ptOXVkQzEzWldsbmFIUTlJbUp2YkdRaVBtMXZjblJoYkM1dWFXNXFZVHd2ZEdWNGRENDhMM04yWno0PSIsImxlbmd0aCI6IjYifQ==
--------------------------------------------------------

Owner of domain mortal: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Contract balance: 0.1
```

`npx hardhat run scripts/run.js`を実行します。 大きな違いは、コンソールの出力です。 私の外観です（このスクリーンショットのURIは短縮してあります）：

![](/public/images/Polygon-ENS-Domain/section-1/1_4_4.png)

`tokenURI`をコピーしてブラウザのアドレスに入力すると、JSONオブジェクトが表示されます。 別のタブでJSONオブジェクト内のimageの部分のみを貼り付けると、NFT画像が取得されます。

ブラウザのアドレスに下の様に入力するとJSONオブジェクトを表示できます。

```
data:application/json;base64,[ここにデコードしたいデータを入れるとブラウザ上にJSONオブジェクトが返ってきます]
```

JSONオブジェクトではなくimageの画像を直接ブラウザに表示する場合、data:image/svg...の部分をブラウザのアドレスに入力します。

```
data:image/svg+xml;base64,[ここにデコードしたいimageの部分のデータを入れるとブラウザ上にimageが表示されます]
```

※imageの部分の長い文字の羅列データの後、末尾に"length":"xx"などが付いているとうまく動作しませんのでこの部分は省いてください。

![](/public/images/Polygon-ENS-Domain/section-1/1_4_5.png)

さぁ、ドメインサービスを作成することができましたね!

SVGをオンチェーンに生成もできました。

ポリゴン上での支払いも実装できました。

着実な進歩です!素晴らしいです!

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

お疲れ様でした。今回も長いレッスンでしたのでひと休みして次のレッスンに進んでくださいね 🎉

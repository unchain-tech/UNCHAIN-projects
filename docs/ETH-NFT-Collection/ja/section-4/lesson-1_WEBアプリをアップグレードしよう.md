### 🌊 ユーザー に gemcase のリンクを提供する

NFTが発行された後、gemcaseでNFTへのリンクを共有できます。

gemcaseのNFTへのリンクは次のようになります。

```
https://gemcase.vercel.app/view/evm/sepolia/0x42d097396b8fe79a06f896db6fed76664777600a/2
```

リンクには、下記2つの変数が組み込まれています。

```
https://gemcase.vercel.app/view/evm/sepolia/あなたのコントラクトアドレス/tokenId
```

### 🗂 コントラクトを更新して tokenId を取得する

現在、`App.js`にはコントラクトアドレスが記載されています。

```javascript
// App.js
const CONTRACT_ADDRESS = "0x.."; ← こちら
```

ですが、現在`App.js`には、`tokenId`が記載されていません。

これから、`tokenId`を取得するコードを`MyEpicNFT.sol`に追加し、再度デプロイしていきます。

下記2点の変更を`MyEpicNFT.sol`に反映させましょう。

**1 \. `NewEpicNFTMinted`イベントを定義する**

`string[] thirdWords`が定義されているコードの直下に、下記のコードを追加してください。

```solidity
// MyEpicNFT.sol
event NewEpicNFTMinted(address sender, uint256 tokenId);
```

**2 \. `NewEpicNFTMinted`イベントを`emit`する**

`makeAnEpicNFT`関数の一番下に、下記のコードを追加しましょう。

```solidity
// MyEpicNFT.sol
emit NewEpicNFTMinted(msg.sender, newItemId);
```

このコードが、`makeAnEpicNFT`関数の最後の行になるように注意してくだい。

> **✍️: Solidity では、`event`と`emit`が頻繁に使用されます。**

上記の実装は、`NewEpicNFTMinted`イベントが`emit`されるごとに、コントラクトに書き込まれたデータをWebアプリケーションのフロントエンドに反映させることを目的としています。

- コントラクトでイベントが`emit`されると、フロントエンド(`App.js`)でその情報を受け取ります。

- `NewEpicNFTMinted`イベントが`emit`される際、フロントエンド(`App.js`)で使用する変数`msg.sender`と`newItemId`をフロントエンドに送信しています。

### ✅ 自動テストを更新しよう

`makeAnEpicNFT`関数に、新たに`NewEpicNFTMinted`イベントの`emit`機能を追加したので、正しく機能するかをテストしてみましょう。

それでは、`test/MyEpicNFT.js`を更新しましょう。以下を参考に、`makeAnEpicNFT`関数のテストを`pickRandomThirdWord`関数のテスト下に追加します。

```javascript
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('MyEpicNFT', function () {
  // 各テストの前に呼び出す関数です。テストで使用する変数やコントラクトのデプロイを行います。
  async function deployMyEpicNFTFixture() {
    // === 省略 ===
  }

  describe('pickRandomFirstWord', function () {
    // === 省略 ===
  });

  describe('pickRandomSecondWord', function () {
    // === 省略 ===
  });

  describe('pickRandomThirdWord', function () {
    // === 省略 ===
  });

  // === 追加するテスト ===
  describe('makeAnEpicNFT', function () {
    it('emit a NewEpicNFTMinted event', async function () {
      const { MyEpicNFT, owner } = await loadFixture(deployMyEpicNFTFixture);

      await expect(MyEpicNFT.makeAnEpicNFT())
        .to.emit(MyEpicNFT, 'NewEpicNFTMinted')
        .withArgs(owner.address, 0);
    });
  });
  // ===================
});

```

`makeAnEpicNFT`関数のイベント発行のテストを追加しました。

`to.emit(コントラクト名, イベント名).withArgs(emitされる値)`と定義することで、発行されるイベントの値を確認することができます。今回の`NewEpicNFTMinted`イベントは、第一引数にNFTを受け取るアドレス、第二引数にNFTのIDを設定するので期待する値を上記のようにテストしています。

それでは、自動テストを実行してみましょう。`ETH-NFT-Collection`ディレクトリ直下で次のコマンドを実行します。

```
yarn contract test
```

以下のような出力があり、全てのテストに通過したことが確認できたら完了です！

```
  MyEpicNFT
    pickRandomFirstWord
This is my NFT contract.
rand - seed:  96777463446932378109744360884080025980584389114515208476196941633474201541706
rand - first word:  0
      ✔ should get strings in firstWords (1037ms)
    pickRandomSecondWord
      ✔ should get strings in secondWords
    pickRandomThirdWord
      ✔ should get strings in thirdWords
    makeAnEpicNFT
rand - seed:  96777463446932378109744360884080025980584389114515208476196941633474201541706
rand - first word:  0

----- SVG data -----
<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>EpicPopBird</text></svg>
--------------------


----- Token URI ----
data:application/json;base64,eyJuYW1lIjogIkVwaWNQb3BCaXJkIiwgImRlc2NyaXB0aW9uIjogIkEgaGlnaGx5IGFjY2xhaW1lZCBjb2xsZWN0aW9uIG9mIHNxdWFyZXMuIiwgImltYWdlIjogImRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEhOMlp5QjRiV3h1Y3owbmFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1qQXdNQzl6ZG1jbklIQnlaWE5sY25abFFYTndaV04wVW1GMGFXODlKM2hOYVc1WlRXbHVJRzFsWlhRbklIWnBaWGRDYjNnOUp6QWdNQ0F6TlRBZ016VXdKejQ4YzNSNWJHVStMbUpoYzJVZ2V5Qm1hV3hzT2lCM2FHbDBaVHNnWm05dWRDMW1ZVzFwYkhrNklITmxjbWxtT3lCbWIyNTBMWE5wZW1VNklESTBjSGc3SUgwOEwzTjBlV3hsUGp4eVpXTjBJSGRwWkhSb1BTY3hNREFsSnlCb1pXbG5hSFE5SnpFd01DVW5JR1pwYkd3OUoySnNZV05ySnlBdlBqeDBaWGgwSUhnOUp6VXdKU2NnZVQwbk5UQWxKeUJqYkdGemN6MG5ZbUZ6WlNjZ1pHOXRhVzVoYm5RdFltRnpaV3hwYm1VOUoyMXBaR1JzWlNjZ2RHVjRkQzFoYm1Ob2IzSTlKMjFwWkdSc1pTYytSWEJwWTFCdmNFSnBjbVE4TDNSbGVIUStQQzl6ZG1jKyJ9
--------------------

An NFT w/ ID 0 has been minted to 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
      ✔ emit a NewEpicNFTMinted event (89ms)


  4 passing (1s)
```

### 🛩 もう一度デプロイする

コントラクトを更新したので、下記を実行する必要があります。

1\. 再度コントラクトをデプロイする

2\. フロントエンドのコントラクトアドレスを更新する(更新するファイル: `App.js`)

3\. フロントエンドのABIファイルを更新する(更新するファイル: `packages/client/src/utils/MyEpicNFT.json`)

**コントラクトを更新するたび、これらの 3 つのステップを実行する必要があります。**

復習もかねて、丁寧に実行していきましょう。

**1\. ターミナル上で`ETH-NFT-Collection`ディレクトリ直下に移動します。**

下記を実行し、コントラクトを再度デプロイしましょう。

```
yarn contract deploy:sepolia
```

下記のように、ターミナルに出力されたコントラクトアドレス(`0x..`)をコピーしましょう。

```
Contract deployed to: 0x... ← あなたのコントラクトアドレスをコピー
```

**2\. コピーしたアドレスを`App.js`の`const CONTRACT_ADDRESS = "こちら"`に貼り付けましょう。**

**3\. 以前と同じように`artifacts`から ABI ファイルを取得します。下記のステップを実行してください。**

1\. ターミナル上で`packages/contract`ディレクトリにいることを確認する（もしくは移動する）。

2\. ターミナル上で下記を実行する。

> ```
> code artifacts/contracts/MyEpicNFT.sol/MyEpicNFT.json
> ```

3\. VS Codeで`MyEpicNFT.json`ファイルが開かれるので、中身をすべてコピーする。※ VS Codeのファインダーを使って、直接`MyEpicNFT.json`を開くことも可能です。

4\. コピーした`packages/contract/artifacts/contracts/MyEpicNFT.sol/MyEpicNFT.json`の中身を`packages/client/src/utils/MyEpicNFT.json`の中身と交換する。

**繰り返しますが、コントラクトを更新するたびにこれを行う必要があります。**

### 🪄 フロントエンドを更新する

下記のように、`App.js`を更新してください。

まず、`const TWITTER_HANDLE = 'こちら'`に、あなたのTwitterハンドルを貼り付けてみてください。あなたのWebサイトからあなたのTwitterアカウントをリンクさせることができます。

次に、下記2つのコードブロックに`setupEventListener()`を設定しましょう。

1つ目のイベントリスナを設定。

```javascript
// App.js
//ユーザーが認証可能なウォレットアドレスを持っている場合は、ユーザーに対してウォレットへのアクセス許可を求める。許可されれば、ユーザーの最初のウォレットアドレスを accounts に格納する。
const accounts = await ethereum.request({ method: "eth_accounts" });

if (accounts.length !== 0) {
  const account = accounts[0];
  console.log("Found an authorized account:", account);
  setCurrentAccount(account);

  // **** イベントリスナーをここで設定 ****
  // この時点で、ユーザーはウォレット接続が済んでいます。
  setupEventListener();
} else {
  console.log("No authorized account found");
}
```

2つ目のイベントリスナを設定。

```javascript
// App.js
// connectWallet メソッドを実装します。
const connectWallet = async () => {
  try {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Get MetaMask!");
      return;
    }
    // ウォレットアドレスに対してアクセスをリクエストしています。
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });

    console.log("Connected", accounts[0]);

    // ウォレットアドレスを currentAccount に紐付けます。
    setCurrentAccount(accounts[0]);

    // **** イベントリスナーをここで設定 ****
    setupEventListener();
  } catch (error) {
    console.log(error);
  }
};
```

次に、`connectWallet`関数の直下に、下記の`setupEventListener`関数を追加してください。

```javascript
// App.js
// setupEventListener 関数を定義します。
// MyEpicNFT.sol の中で event が　emit された時に、
// 情報を受け取ります。
const setupEventListener = async () => {
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      // NFT が発行されます。
      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicNft.abi,
        signer
      );
      // Event が　emit される際に、コントラクトから送信される情報を受け取っています。
      connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
        console.log(from, tokenId.toNumber());
        alert(
          `あなたのウォレットに NFT を送信しました。gemcase に表示されるまで数分かかることがあります。NFT へのリンクはこちらです: https://gemcase.vercel.app/view/evm/sepolia/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`,
        );
      });
      console.log("Setup event listener!");
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error);
  }
};
```

`setupEventListener`関数は、NFTが発行される際に`emit`される`NewEpicNFTMinted`イベントを受信します。

- `tokenId`を取得して、新しくミントされたNFTへのgemcaseリンクをユーザーに提供しています。

### 🪄 MVP = `MyEpicNFT.sol` × `App.js`

今回のプロジェクトのMVP（＝最小限の機能を備えたプロダクト）を構築する`MyEpicNFT.sol`、`MyEpicNFT.js`（自動テスト）、`App.js`のスクリプトを共有します。

- 見やすいように少し整理整頓してあります 🧹✨

もしコードにエラーが発生してデバッグが困難な場合は、下記のコードを使用してみてください。

**`MyEpicNFT.sol`はこちら:**

```solidity
// MyEpicNFT.sol
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

// いくつかの OpenZeppelin のコントラクトをインポートします。
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// utils ライブラリをインポートして文字列の処理を行います。
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

// Base64.solコントラクトからSVGとJSONをBase64に変換する関数をインポートします。
import { Base64 } from "./libraries/Base64.sol";

// インポートした OpenZeppelin のコントラクトを継承しています。
// 継承したコントラクトのメソッドにアクセスできるようになります。
contract MyEpicNFT is ERC721URIStorage {
  // OpenZeppelin　が　tokenIds　を簡単に追跡するために提供するライブラリを呼び出しています
  using Counters for Counters.Counter;
  // _tokenIdsを初期化（_tokenIds = 0）
  Counters.Counter private _tokenIds;

  // SVGコードを作成します。
  // 変更されるのは、表示される単語だけです。
  // すべてのNFTにSVGコードを適用するために、baseSvg変数を作成します。
  string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

  // 3つの配列 string[] に、それぞれランダムな単語を設定しましょう。
  string[] firstWords = ["Epic", "Fantastic", "Crude", "Crazy", "Hysterical", "Grand"];
  string[] secondWords = ["Meta", "Live", "Pop", "Cute", "Sweet", "Hot"];
  string[] thirdWords = ["Kitten", "Puppy", "Monkey", "Bird", "Panda", "Elephant"];

  // NewEpicNFTMinted イベントを定義します。
  event NewEpicNFTMinted(address sender, uint256 tokenId);

  // NFT トークンの名前とそのシンボルを渡します。
  constructor() ERC721 ("SquareNFT", "SQUARE") {
    console.log("This is my NFT contract.");
  }

  // シードを生成する関数を作成します。
  function random(string memory input) internal pure returns (uint256) {
      return uint256(keccak256(abi.encodePacked(input)));
  }

  // 各配列からランダムに単語を選ぶ関数を3つ作成します。
  // pickRandomFirstWord関数は、最初の単語を選びます。
  function pickRandomFirstWord(uint256 tokenId) public view returns (string memory) {
    // pickRandomFirstWord 関数のシードとなる rand を作成します。
    uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
    // seed rand をターミナルに出力する。
	console.log("rand - seed: ", rand);
	// firstWords配列の長さを基準に、rand 番目の単語を選びます。
    rand = rand % firstWords.length;
	// firstWords配列から何番目の単語が選ばれるかターミナルに出力する。
	console.log("rand - first word: ", rand);
    return firstWords[rand];
  }

  // pickRandomSecondWord関数は、2番目に表示されるの単語を選びます。
  function pickRandomSecondWord(uint256 tokenId) public view returns (string memory) {
    // pickRandomSecondWord 関数のシードとなる rand を作成します。
    uint256 rand = random(string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId))));
    rand = rand % secondWords.length;
    return secondWords[rand];
  }

  // pickRandomThirdWord関数は、3番目に表示されるの単語を選びます。
  function pickRandomThirdWord(uint256 tokenId) public view returns (string memory) {
    // pickRandomThirdWord 関数のシードとなる rand を作成します。
    uint256 rand = random(string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId))));
    rand = rand % thirdWords.length;
    return thirdWords[rand];
  }

  // ユーザーが NFT を取得するために実行する関数です。
  function makeAnEpicNFT() public {
    // NFT が Mint されるときのカウンターをインクリメントします。
    _tokenIds.increment();

    // 現在のtokenIdを取得します。tokenIdは1から始まります。
    uint256 newItemId = _tokenIds.current();

    // 3つの配列からそれぞれ1つの単語をランダムに取り出します。
    string memory first = pickRandomFirstWord(newItemId);
    string memory second = pickRandomSecondWord(newItemId);
    string memory third = pickRandomThirdWord(newItemId);

	  // 3つの単語を連携して格納する変数 combinedWord を定義します。
    string memory combinedWord = string(abi.encodePacked(first, second, third));

    // 3つの単語を連結して、<text>タグと<svg>タグで閉じます。
    string memory finalSvg = string(abi.encodePacked(baseSvg, combinedWord, "</text></svg>"));

	  // NFTに出力されるテキストをターミナルに出力します。
	  console.log("\n----- SVG data -----");
    console.log(finalSvg);
    console.log("--------------------\n");

    // JSONファイルを所定の位置に取得し、base64としてエンコードします。
    string memory json = Base64.encode(
        bytes(
            string(
                abi.encodePacked(
                    '{"name": "',
                    // NFTのタイトルを生成される言葉（例: GrandCuteBird）に設定します。
                    combinedWord,
                    '", "description": "A highly acclaimed collection of squares.", "image": "data:image/svg+xml;base64,',
                    //  data:image/svg+xml;base64 を追加し、SVG を base64 でエンコードした結果を追加します。
                    Base64.encode(bytes(finalSvg)),
                    '"}'
                )
            )
        )
    );

    // データの先頭に data:application/json;base64 を追加します。
    string memory finalTokenUri = string(
        abi.encodePacked("data:application/json;base64,", json)
    );

	  console.log("\n----- Token URI ----");
    console.log(finalTokenUri);
    console.log("--------------------\n");

    // msg.sender を使って NFT を送信者に Mint します。
    _safeMint(msg.sender, newItemId);

    // tokenURIを更新します。
    _setTokenURI(newItemId, finalTokenUri);

 	  // NFTがいつ誰に作成されたかを確認します。
	  console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);

    emit NewEpicNFTMinted(msg.sender, newItemId);
  }
}
```

**`MyEpicNFT.js`はこちら:**

```javascript
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('MyEpicNFT', function () {
  // 各テストの前に呼び出す関数です。テストで使用する変数やコントラクトのデプロイを行います。
  async function deployMyEpicNFTFixture() {
    // テストアカウントを取得します。
    const [owner] = await ethers.getSigners();

    // コントラクト内で使用する単語の配列を定義します。
    const firstWords = [
      'Epic',
      'Fantastic',
      'Crude',
      'Crazy',
      'Hysterical',
      'Grand',
    ];
    const secondWords = ['Meta', 'Live', 'Pop', 'Cute', 'Sweet', 'Hot'];
    const thirdWords = [
      'Kitten',
      'Puppy',
      'Monkey',
      'Bird',
      'Panda',
      'Elephant',
    ];

    // コントラクトのインスタンスを生成し、デプロイを行います。
    const MyEpicNFTFactory = await ethers.getContractFactory('MyEpicNFT');
    const MyEpicNFT = await MyEpicNFTFactory.deploy();

    return { MyEpicNFT, owner, firstWords, secondWords, thirdWords };
  }

  describe('pickRandomFirstWord', function () {
    it('should get strings in firstWords', async function () {
      // テストの準備をします。
      const { MyEpicNFT, firstWords } = await loadFixture(
        deployMyEpicNFTFixture,
      );

      // 実行＆確認をします。
      expect(firstWords).to.include(await MyEpicNFT.pickRandomFirstWord(0));
    });
  });

  describe('pickRandomSecondWord', function () {
    it('should get strings in secondWords', async function () {
      const { MyEpicNFT, secondWords } = await loadFixture(
        deployMyEpicNFTFixture,
      );

      expect(secondWords).to.include(await MyEpicNFT.pickRandomSecondWord(0));
    });
  });

  describe('pickRandomThirdWord', function () {
    it('should get strings in thirdWords', async function () {
      const { MyEpicNFT, thirdWords } = await loadFixture(
        deployMyEpicNFTFixture,
      );

      expect(thirdWords).to.include(await MyEpicNFT.pickRandomThirdWord(0));
    });
  });

  describe('makeAnEpicNFT', function () {
    it('emit a NewEpicNFTMinted event', async function () {
      const { MyEpicNFT, owner } = await loadFixture(deployMyEpicNFTFixture);

      // 発行されるイベントの確認をします。
      await expect(MyEpicNFT.makeAnEpicNFT())
        .to.emit(MyEpicNFT, 'NewEpicNFTMinted')
        .withArgs(owner.address, 0);
    });
  });
});
```

**`App.js`はこちら:**

```javascript
// App.js
import "./styles/App.css";

// フロントエンドとコントラクトを連携するライブラリをインポートします。
import { ethers } from "ethers";
// useEffect と useState 関数を React.js からインポートしています。
import React, { useEffect, useState } from "react";

import twitterLogo from "./assets/twitter-logo.svg";
import myEpicNft from "./utils/MyEpicNFT.json";

const TWITTER_HANDLE = "あなたのTwitterハンドル";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

// コトントラクトアドレスをCONTRACT_ADDRESS変数に格納
const CONTRACT_ADDRESS = "あなたのコントラクトアドレス";

const App = () => {
  // ユーザーのウォレットアドレスを格納するために使用する状態変数を定義します。
  const [currentAccount, setCurrentAccount] = useState("");

  // setupEventListener 関数を定義します。
  // MyEpicNFT.sol の中で event が　emit された時に、
  // 情報を受け取ります。
  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );

        // Event が　emit される際に、コントラクトから送信される情報を受け取っています。
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          alert(
            `あなたのウォレットに NFT を送信しました。gemcase に表示されるまで数分かかることがあります。NFT へのリンクはこちらです: https://gemcase.vercel.app/view/evm/sepolia/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`,
          );
        });

        console.log("Setup event listener!");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ユーザーが認証可能なウォレットアドレスを持っているか確認します。
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    // ユーザーが認証可能なウォレットアドレスを持っている場合は、ユーザーに対してウォレットへのアクセス許可を求める。許可されれば、ユーザーの最初のウォレットアドレスを accounts に格納する。
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);

      // イベントリスナーを設定
      // この時点で、ユーザーはウォレット接続が済んでいます。
      setupEventListener();
    } else {
      console.log("No authorized account found");
    }
  };

  // connectWallet メソッドを実装します。
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      // ウォレットアドレスに対してアクセスをリクエストしています。
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);

      // ウォレットアドレスを currentAccount に紐付けます。
      setCurrentAccount(accounts[0]);

      // イベントリスナーを設定
      setupEventListener();
    } catch (error) {
      console.log(error);
    }
  };

  // NFT を Mint する関数を定義しています。
  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );

        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.makeAnEpicNFT();

        console.log("Mining...please wait.");
        await nftTxn.wait();
        console.log(nftTxn);
        console.log(
          `Mined, see transaction: https://sepolia.etherscan.io/tx/${nftTxn.hash}`
        );
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ページがロードされた際に下記が実行されます。
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  // renderNotConnectedContainer メソッド（ Connect to Wallet を表示する関数）を定義します。
  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Connect to Wallet
    </button>
  );

  // Mint NFT ボタンをレンダリングするメソッドを定義します。
  const renderMintUI = () => (
    <button
      onClick={askContractToMintNft}
      className="cta-button connect-wallet-button"
    >
      Mint NFT
    </button>
  );

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">あなただけの特別な NFT を Mint しよう💫</p>
          {/*条件付きレンダリング。
          // すでにウォレット接続されている場合は、
          // Mint NFT を表示する。*/}
          {currentAccount === ""
            ? renderNotConnectedContainer()
            : renderMintUI()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
```

### 😎 Web アプリケーションをアップグレードする

MVPを起点にWebアプリケーションを自分の好きなようにアップグレードしましょう。

**1\. ミントされた NFT の数に制限を設定する**

- `MyEpicNFT.sol`を変更して、あらかじめ設定された数のNFTのみをミントできるようにすることをお勧めします。
- `App.js`を更新して、Webアプリケーション上でMintカウンタを表示してみましょう!（例、「これまでに作成された4/50 NFT」）

**2\. ユーザーが間違ったネットワーク上にいるときアラートを出す**

- あなたのWebサイトはSepolia Test Networkで**のみ**機能します。
- ユーザーが、Sepolia以外のネットワークにログインしている状態で、あなたのWebサイトに接続しようとしたら、それを知らせるアラートを出しましょう。
- `methereum.request`と`eth_accounts`と`eth_requestAccounts`というメソッドを使用して、アラートを作成できます。
- `eth_chainId`を使ってブロックチェーンを識別するIDを取得します。

下記のコードを`App.js`に組み込んでみましょう。

```javascript
// App.js
let chainId = await ethereum.request({ method: "eth_chainId" });
console.log("Connected to chain " + chainId);
// 0xaa36a7(11155111) は　Sepolia の ID です。
const sepoliaChainId = "0xaa36a7";
if (chainId !== sepoliaChainId) {
  alert("You are not connected to the Sepolia Test Network!");
}
```

他のブロックチェーンIDは [こちら](https://docs.MetaMask.io/guide/ethereum-provider.html#chain-ids) から見つけることができます。

**3\. マイニングアニメーションを作成する**

- 一部のユーザーは、Mintをクリックした後、15秒以上何も起こらないと、混乱してしまう可能性があるでしょう。
- "Loading ..." のようなアニメーションを追加して、ユーザーに安心してもらいましょう。

**4\. あなたのコレクション Web アプリケーションをリンクさせる**

- あなたのコレクションを見にいけるボタンをWebアプリケーション上に作成して、ユーザーがいつでもあなたのNFTコレクションを見に行けるようにしましょう。
- あなたのWebサイトに、「gemcaseでコレクションを表示」という小さなボタンを追加します。
- ユーザーがそれをクリックすると、コレクションのページに行けるようにしましょう。
- gemcaseへのリンクは`App.js`にハードコーディングする必要があります。

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

それでは、最後のレッスンに進みましょう 🎉

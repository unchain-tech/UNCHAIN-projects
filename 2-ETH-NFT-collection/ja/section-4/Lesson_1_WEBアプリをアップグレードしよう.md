🌊 ユーザー に OpenSea/Rarible のリンクを提供する
--------------

NFTが発行された後、OpenSea や Rarible でNFTへのリンクを共有できるようになります。

OpenSea の NFT へのリンクは次のようになります。

```
https://testnets.opensea.io/assets/0x88a0e9c2F3939598c402eccb7Ae1612e45448C04/0
```

リンクには、下記2つの変数が組み込まれています。

```
https://testnets.opensea.io/assets/あなたのコントラクトアドレス/tokenId
```

また、Rarible の NFT のリンクは次のようになります。

```
https://rinkeby.rarible.com/token/0x88a0e9c2F3939598c402eccb7Ae1612e45448C04:0
```

リンクには、下記2つの変数が組み込まれています。

```
https://rinkeby.rarible.com/token/あなたのコントラクトアドレス:tokenId
```

🗂 コントラクトを更新して tokenId を取得する
--------------

現在、`App.js`にはコントラクトアドレスが記載されています。

```javascript
// App.js
const CONTRACT_ADDRESS = "0x.."; ← こちら
```

ですが、現在 `App.js` には、`tokenId` が記載されていません。

これから、`tokenId` を取得するコードを `MyEpicNFT.sol` に追加し、再度デプロイしていきます。

下記2点の変更を `MyEpicNFT.sol` に反映させましょう。

**1 \. `NewEpicNFTMinted` イベントを定義する**

`string[] thirdWords` が定義されいるコードの直下に、下記のコードを追加してください。

```javascript
// MyEpicNFT.sol
event NewEpicNFTMinted(address sender, uint256 tokenId);
```

**2 \. `NewEpicNFTMinted` イベントを `emit` する**

`makeAnEpicNFT` 関数の一番下に、下記のコードを追加しましょう。

```javascript
// MyEpicNFT.sol
emit NewEpicNFTMinted(msg.sender, newItemId);
```

このコードが、`makeAnEpicNFT` 関数の最後の行になるように注意してくだい。

**✍️: Solidityでは、`event` と `emit` が頻繁に使用されます。**

上記の実装は、`NewEpicNFTMinted` イベントが `emit` されるごとに、コントラクトに書き込まれたデータをWEBアプリのフロントエンドに反映させることを目的としています。

- コントラクトでイベントが `emit` されると、フロントエンド（ `App.js` ）でその情報を受け取ります。

- `NewEpicNFTMinted` イベント が `emit` される際、フロントエンド（ `App.js` ）で使用する変数 `msg.sender` と `newItemId` をフロントエンドに送信しています。

🛩 もう一度デプロイする
------------

コントラクトを更新したので、下記を実行する必要があります。

1. 再度コントラクトをデプロイする

2. フロントエンドの契約アドレスを更新する（更新するファイル: `App.js`）

3. フロントエンドのABIファイルを更新する（更新するファイル: `your-first-NET-collection/src/utils/MyEpicNFT.json`）

**コントラクトを更新するたび、これらの3つのステップを実行する必要があります。**

復習もかねて、丁寧に実行していきましょう。

**1 \. ターミナル上で `epic-nfts` に移動します。**

下記を実行し、コントラクトを再度デプロイしましょう。
```
npx hardhat run scripts/deploy.js --network rinkeby
```

下記のように、ターミナルに出力されたコントラクトアドレス（ `0x..` ）をコピーしましょう。
```
Contract deployed to: 0x... ← あなたのコントラクトアドレスをコピー
```

**2 \. コピーしたアドレスを `App.js` の  `const CONTRACT_ADDRESS = "こちら"` に貼り付けましょう。**

**3 \. 以前と同じように `artifacts` からABIファイルを取得します。下記のステップを実行してください。**


1. ターミナル上で `epic-nfts` にいることを確認する（もしくは移動する）。
2. ターミナル上で下記を実行する。
> ```
> code artifacts/contracts/MyEpicNFT.sol/MyEpicNFT.json
> ```
3. VS Codeで `MyEpicNFT.json` ファイルが開かれるので、中身を全てコピーしましょう。

	※ VS Codeのファインダーを使って、直接 `MyEpicNFT.json` を開くことも可能です。

4. コピーした `epic-nfts/artifacts/contracts/MyEpicNFT.sol/MyEpicNFT.json` の中身を `your-first-dapp/src/utils/MyEpicNFT.json` の中身と交換してください。

**繰り返しますが、コントラクトを更新するたびにこれを行う必要があります。**

🪄 フロントエンドを更新する
--------------

下記のように、`App.js` を更新してください。

まず、`const TWITTER_HANDLE = 'こちら'` に、あなたの Twitter ハンドルを貼り付けてみてください。あなたのWEBサイトからあなたの Twitter アカウントをリンクさせることができます。

次に、下記2つのコードブロックに `setupEventListener()` を設定しましょう。

1つ目のイベントリスナーを設定。
```javascript
// App.js
//ユーザーが認証可能なウォレットアドレスを持っている場合は、ユーザーに対してウォレットへのアクセス許可を求める。許可されれば、ユーザーの最初のウォレットアドレスを accounts に格納する。
const accounts = await ethereum.request({ method: 'eth_accounts' });

if (accounts.length !== 0) {
	const account = accounts[0];
	console.log("Found an authorized account:", account);
		setCurrentAccount(account)

	// **** イベントリスナーをここで設定 ****
	// この時点で、ユーザーはウォレット接続が済んでいます。
	setupEventListener()
} else {
	console.log("No authorized account found")
}
```

2つ目のイベントリスナーを設定。
```javascript
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
	setupEventListener()
} catch (error) {
	console.log(error)
}
}
```

次に、`connectWallet` 関数の直下に、下記の `setupEventListener` 関数を追加してください。

```javascript
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
	const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

	// Event が　emit される際に、コントラクトから送信される情報を受け取っています。
	connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
		console.log(from, tokenId.toNumber())
		alert(`あなたのウォレットに NFT を送信しました。OpenSea に表示されるまで最大で10分かかることがあります。NFT へのリンクはこちらです: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
	});

	console.log("Setup event listener!")

	} else {
	console.log("Ethereum object doesn't exist!");
	}
} catch (error) {
	console.log(error)
}
}
```
`setupEventListener` 関数は、NFT が発行される際に `emit` される `NewEpicNFTMinted` イベントを受信します。
- `tokenId` を取得して、新しくミントされた NFT への OpenSea リンクをユーザーに提供しています。

🪄 MVP = `MyEpicNFT.sol` × `App.js`
--------------

今回のプロジェクトのMVP（＝最小限の機能を備えたプロダクト）を構築する `MyEpicNFT.sol` と `App.js` のスクリプトを共有します。
- 見やすいように少し整理整頓してあります🧹✨

もしコードにエラーが発生してデバッグが困難な場合は、下記のコードを使用してみてください。

**`MyEpicNFT.sol`はこちら:**
```javascript
// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.4;

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

  // シードを生成する関数を作成します。
  function random(string memory input) internal pure returns (uint256) {
      return uint256(keccak256(abi.encodePacked(input)));
  }

  // ユーザーが NFT を取得するために実行する関数です。
  function makeAnEpicNFT() public {
    // 現在のtokenIdを取得します。tokenIdは0から始まります。
    uint256 newItemId = _tokenIds.current();

    // 3つの配列からそれぞれ1つの単語をランダムに取り出します。
    string memory first = pickRandomFirstWord(newItemId);
    string memory second = pickRandomSecondWord(newItemId);
    string memory third = pickRandomThirdWord(newItemId);

	// 3つの単語を組み合わせた言葉（例: GrandCuteBird）を combinedWord に格納しています。
    string memory combinedWord = string(abi.encodePacked(first, second, third));

    // 3つの単語を連結して、<text>タグと<svg>タグで閉じます。
    string memory finalSvg = string(abi.encodePacked(baseSvg, first, second, third, "</text></svg>"));

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

    // 次の NFT が Mint されるときのカウンターをインクリメントする。
    _tokenIds.increment();

    // イベントを emit します。
    emit NewEpicNFTMinted(msg.sender, newItemId);
    }
}
```

**`App.js`はこちら:**
```javascript

import './styles/App.css';

// フロントエンドとコントラクトを連携するライブラリをインポートします。
import { ethers } from "ethers";
// useEffect と useState 関数を React.js からインポートしています。
import React, { useEffect, useState } from "react";

import twitterLogo from './assets/twitter-logo.svg';
import myEpicNft from './utils/MyEpicNFT.json';

const TWITTER_HANDLE = 'あなたのTwitterハンドル';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

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
			const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

			// Event が　emit される際に、コントラクトから送信される情報を受け取っています。
			connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
			console.log(from, tokenId.toNumber())
			alert(`あなたのウォレットに NFT を送信しました。OpenSea に表示されるまで最大で10分かかることがあります。NFT へのリンクはこちらです: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
			});

			console.log("Setup event listener!")

		} else {
			console.log("Ethereum object doesn't exist!");
		}
		} catch (error) {
		console.log(error)
		}
	}

	// ユーザーが認証可能なウォレットアドレスを持っているか確認します。
    const checkIfWalletIsConnected = async () => {
      const { ethereum } = window;

      if (!ethereum) {
          console.log("Make sure you have metamask!");
          return;
      } else {
          console.log("We have the ethereum object", ethereum);
      }

	  // ユーザーが認証可能なウォレットアドレスを持っている場合は、ユーザーに対してウォレットへのアクセス許可を求める。許可されれば、ユーザーの最初のウォレットアドレスを accounts に格納する。
      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
		       setCurrentAccount(account)

          // イベントリスナーを設定
		  // この時点で、ユーザーはウォレット接続が済んでいます。
          setupEventListener()
      } else {
          console.log("No authorized account found")
      }
  }

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

      // イベントリスナーを設定
      setupEventListener()
    } catch (error) {
      console.log(error)
    }
  }

  // NFT を Mint する関数を定義しています。
  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeAnEpicNFT();

        console.log("Mining...please wait.")
        await nftTxn.wait();
        console.log(nftTxn);
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  // ページがロードされた際に下記が実行されます。
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  // renderNotConnectedContainer メソッド（ Connect to Wallet を表示する関数）を定義します。
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  // Mint NFT ボタンをレンダリングするメソッドを定義します。
  const renderMintUI = () => (
    <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
      Mint NFT
    </button>
  )

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
          あなただけの特別な NFT を Mint しよう💫
          </p>
		  {/*条件付きレンダリング。
          // すでにウォレット接続されている場合は、
          // Mint NFT を表示する。*/}
          {currentAccount === "" ? renderNotConnectedContainer() : renderMintUI()}
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

😎 WEBアプリをアップグレードする
--------------

MVP を起点にWEBアプリを自分の好きなようにアップグレードしましょう。

**1. ミントされたNFTの数に制限を設定する**
- `MyEpicNFT.sol` を変更して、あらかじめ設定された数のNFTのみをミントできるようにすることをおすすめします。
- `App.js` を更新して、WEBアプリ上で Mint カウンターを表示してみましょう。
- 例）「これまでに作成された 4/50 NFT」

**2. ユーザーが間違ったネットワーク上にいるときアラートを出す**

- あなたのWEBサイトは Rinkeby Test Network で**のみ**機能します。

- ユーザーが、Rinkeby 以外のネットワークにログインしている状態で、あなたの WEBサイトに接続しようとしたら、それを知らせるアラートを出しましょう。

- `methereum.request` と `eth_accounts` と `eth_requestAccounts` というメソッドを使用して、アラートを作成することができます。

- `eth_chainId` を使って ブロックチェーンを識別する ID を取得します。

- 下記のコードを `App.js` に組み込んでみましょう。

```javascript
let chainId = await ethereum.request({ method: 'eth_chainId' });
console.log("Connected to chain " + chainId);
// 0x4 は　Rinkeby の ID です。
const rinkebyChainId = "0x4";
if (chainId !== rinkebyChainId) {
	alert("You are not connected to the Rinkeby Test Network!");
}
```

- 他のブロックチェーン ID は [ここ](https://docs.metamask.io/guide/ethereum-provider.html#chain-ids) で見つけることができます。


**3. マイニングアニメーションを作成する**

- 一部のユーザーは、Mint をクリックした後、15秒以上何も起こらないと、混乱してしまう可能性があるでしょう。

- "Loading ..." のようなアニメーションを追加して、ユーザーに安心してもらいましょう。

**4. あなたのコレクションWEBアプリをリンクさせる**

- あなたのコレクションを見にいけるボタンをWEBアプリ上に作成して、ユーザーがいつでもあなたの NFT コレクションを見に行けるようにしましょう。

- なたのWEBサイトに、「Rarible でコレクションを表示」という小さなボタンを追加します。

- ユーザーがそれをクリックすると、コレクションのページに行けるようにしましょう。

- Rarible へのリンクは `App.js` にハードコーディングする必要があります。

🙋‍♂️ 質問する
-------------------------------------------
ここまでの作業で何かわからないことがある場合は、Discordの`#section-4-help`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください✨
```
1. 何をしようとしていたか
2. エラー文をコピー&ペースト
3. エラー画面のスクリーンショット
```
-------------------------------------------
それでは、最後のレッスンに進みましょう🎉

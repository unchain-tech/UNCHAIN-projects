🪄 NFTを作成しよう
________

これから、いくつかのNFTを作成します。

下記のように、`MyEpicNFT.sol`を更新しましょう。

```javascript
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
// いくつかの OpenZeppelin のコントラクトをインポートします。
import "@OpenZeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@OpenZeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

// インポートした OpenZeppelin のコントラクトを継承しています。
// 継承したコントラクトのメソッドにアクセスできるようになります。
contract MyEpicNFT is ERC721URIStorage {

  // OpenZeppelin が tokenIds を簡単に追跡するために提供するライブラリを呼び出しています
  using Counters for Counters.Counter;

  // _tokenIdsを初期化（_tokenIds = 0）
  Counters.Counter private _tokenIds;

  // NFT トークンの名前とそのシンボルを渡します。
  constructor() ERC721 ("TanyaNFT", "TANYA") {
    console.log("This is my NFT contract.");
  }

  // ユーザーが NFT を取得するために実行する関数です。
  function makeAnEpicNFT() public {

     // 現在のtokenIdを取得します。tokenIdは0から始まります。
    uint256 newItemId = _tokenIds.current();

     // msg.sender を使って NFT を送信者に Mint します。
    _safeMint(msg.sender, newItemId);

    // NFT データを設定します。
    _setTokenURI(newItemId, "Valuable data!");

    // NFTがいつ誰に作成されたかを確認します。
    console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);

    // 次の NFT が Mint されるときのカウンターをインクリメントする。
    _tokenIds.increment();
  }
}
```

1行ずつコードを見ていきましょう。

```javascript
// MyEpicNFT.sol
contract MyEpicNFT is ERC721URIStorage {
	:
```
ここでは、コントラクトを宣言する際に、`is ERC721URIStorage` を使用して OpenZeppelin のコントラクトを「継承」しています。

継承とは、OpenZepplin 等のイーサリアムに関する開発を便利にするフレームワークを提供するライブラリから、スマートコントラクトに必要なモジュールを呼び出すことを意味します。

これは関数をインポートするようなイメージで理解してください。

NFTのモジュールは `ERC721` として知られています。

このモジュールには、NFT発行に必要な標準機能が含まれているため、開発者は独自のロジックを記述してカスタマイズするところに集中することができます。

次に、下記のコードを見ていきましょう。

```javascript
// MyEpicNFT.sol
using Counters for Counters.Counter;
```

`using Counters for Counters.Counter` は OpenZeppelin が `_tokenIds` を追跡するために提供するライブラリを呼び出しています。

これにより、トラッキングの際に起こりうる [オーバーフロー](https://eng-entrance.com/buffer-overflow) を防ぎます。

次に、下記のコードを見ていきましょう。

```javascript
// MyEpicNFT.sol
Counters.Counter private _tokenIds;
```
ここでは、`private _tokenIds` を宣言して、`_tokenIds` を初期化しています。
- `_tokenIds` の初期値は 0 です。

tokenId は NFT の一意な識別子で、0, 1, 2, .. N のように付与されます。

次に、下記のコードを見ていきましょう。

```javascript
// MyEpicNFT.sol
constructor() ERC721 ("TanyaNFT", "TANYA") {
    console.log("This is my NFT contract.");
}
```
`ERC721` モジュールを使用した `constructor` を定義しています。

ここでは任意の NFT トークンの名前とシンボルを引数として渡しています。

- `TanyaNFT`: NFT トークンの名前
- `TANYA`: NFT トークンのそのシンボル

次に、下記の `makeAnEpicNFT` 関数を段階的に見ていきましょう。

```javascript
// MyEpicNFT.sol
// ユーザーが NFT を取得するために実行する関数です。
function makeAnEpicNFT() public {
	// 現在の tokenId を取得します。tokenId は 0 から始まります。
	uint256 newItemId = _tokenIds.current();
	// msg.sender を使って NFT を送信者に Mint します。
	_safeMint(msg.sender, newItemId);
	// NFT データを設定します。
	_setTokenURI(newItemId, "Valuable data!");
	// 次の NFT が Mint されるときのカウンターをインクリメントする。
	_tokenIds.increment();
}
```

まず、下記のコードを見ていきます。

```javascript
// MyEpicNFT.sol
uint256 newItemId = _tokenIds.current();
```

`_tokenIds` について理解を深めましょう。

ピカソの例を覚えているでしょうか？

彼は、自分の NFT コレクションに、`Sketch ＃1` から `Sketch ＃100` までのユニークな識別子を付与していました。

ここでは、ピカソがしたように、`_tokenIds` を使用して NFT に対して一意の識別子を付与し、トラッキングできようにしています。

`_tokenIds` は単なる数字です。

したがって、 `makeAnEpicNFT` 関数が初めて呼び出されたとき、 `newItemId` は 0 になります。
- `Counters.Counter private _tokenIds` により初期化されているため、`newItemId` は 0 です。

もう一度実行すると、`newItemId` は1になり、以下同様に続きます。

`_tokenIds` は**状態変数**です。つまり、変更すると、値はコントラクトに直接保存されます。

次に、下記のコードを見ていきましょう。

```javascript
// MyEpicNFT.sol
_safeMint(msg.sender, newItemId);
```
ここでは、コントラクトを呼び出したユーザー（＝ `msg.sender` ）のアドレスに、ID（= `newItemId` ）の付与された NFT を Mint しています。

`msg.sender` は Solidity が提供している変数であり、あなたのスマートコントラクトを呼び出したユーザーのパブリックアドレスを取得するために使用されます。

これは、**ユーザーのパブリックアドレスを取得するための安全な方法**です。

- ユーザーはパブリックアドレスを使用して、コントラクトを呼び出す必要があります。
- これは、「サインイン」のような認証機能の役割を果たします。

次に、下記のコードを見ていきましょう。

```javascript
// MyEpicNFT.sol
_setTokenURI(newItemId, "Valuable data!");
```

これにより、NFT の一意の識別子と、その一意の識別子に関連付けられたデータが紐付けられます。

- NFT を価値あるものにするのは、文字通り「 NFT の一意の識別子」と「実際のデータ」を紐付ける必要があります。

今は、`Valuable data!` という文字列が、「実際のデータ」として設定されていますが、これは後で変更します。

- `Valuable data!` は、`ERC721`の基準に準拠していません。
- `Valuable data!` と入れ替わる `tokenURI` についてこれから学んでいきます。

次に、下記のコードを見ていきましょう。

```javascript
console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);
```
ここでは、NFTがいつ誰に作成されたかを確認しています。

最後に、下記のコードを見ていきましょう。

```javascript
// MyEpicNFT.sol
_tokenIds.increment();
```

NFT が発行された後、`_tokenIds.increment()`（＝ OpenZeppelin が提供する関数）を使用して、`tokenIds` をインクリメント（＝ `+1` ）しています。

これにより、毎回 NFT が発行されると、異なる `tokenIds` 識別子が NFT と紐付けられます。

複数のユーザーが、同じ `tokenIds` を持つことはありません。

🎟 `tokenURI` を取得して、コントラクトをローカル環境で実行しよう
------------------------

`tokenURI` は、**NFT データが保存されている場所**を意味します。

`tokenURI` は、下記のような「**メタデータ**」と呼ばれる JSON ファイルに**リンク**されています。

```bash
{
    "name": "Tanya",
    "description": "A mindful creature. Just woke up like this.",
    "image": "https://i.imgur.com/t1fye4S.jpg"
}
```

メタデータの構造に注意してください。
- `"name"`: デジタルデータの名前
- `"description"`: デジタルデータの説明
- `"image"`: デジタルデータへのリンク

メタデータの構造が [OpenSeaの要件](https://zenn.dev/hayatoomori/articles/f26cc4637c7d66) と一致しない場合、デジタルデータは OpenSea 上で正しく表示されません。

- Openseaは、`ERC721` のメタデータ規格をサポートしています。
- 音声ファイル、動画ファイル、3Dメディアなどに対応するメタデータ構造に関しては、[OpenSeaの要件](https://zenn.dev/hayatoomori/articles/f26cc4637c7d66) を参照してください。

上記の `Tanya` の JSON メタデータをコピーして、 [ここ](https://jsonkeeper.com/)のWEBサイトに貼り付けてください。

このWEBサイトは、JSON データをホストするのに便利です。

このレッスンでは、NFTデータを保持するために使用します。

下図のように、WEBサイトにメタデータを貼り付けて、`Save` ボタンをクリックすると、JSONファイルへのリンクが表示されます。

![](/public/images/ETH-NFT-collection/section-1/1_4_1.png)

枠で囲んだ部分をコピーして、ブラウザに貼り付け、メタデータがリンクとして保存されていることを確認しましょう。

こちらは、わたしのリンクです：
[`https://jsonkeeper.com/b/OLSM`](https://jsonkeeper.com/b/OLSM)


🐱 オリジナルの画像を使用する方法
-------------

[Imgur](imgur.com) というWEBサイトを使うと、無料で画像をオンライン上でホストすることができます。

メタデータの `"image"` にリンクを貼り付ける場合は、`Direct Link` を使用するようにしてください。

下記に Imgur で画像をアップロードした際に選択する `Direct Link` の取得方法を示します。

![](/public/images/ETH-NFT-collection/section-1/1_4_2.png)

ぜひ自分のお気に入りの画像を使って、自分だけのメタデータを作成してみましょう。


🐈 `MyEpicNFT.sol` を更新する
-------------

それでは、スマートコントラクトに向かい、下記の行を変更しましょう。

```javascript
// MyEpicNFT.sol
_setTokenURI(newItemId, "Valuable data!");
```

先ほど取得した JSON ファイルへのリンクこそ、`tokenURI`（＝ **NFT データが保存されている場所**）です。

そのリンクを下記に貼り付けましょう。

```javascript
// MyEpicNFT.sol
_setTokenURI(newItemId, "こちらに、JSON ファイルへのリンクを貼り付けてください");
```

🎉 NFT をローカルネットワークにデプロイしよう
------------------------

ここから、実際に `makeAnEpicNFT()` 関数を呼び出し、スマートコントラクトが問題なくデプロイされるかテストしていきます。

テスト用のプログラム `run.js` ファイルを下記のように変更しましょう。

```javascript
// run.js
const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory('MyEpicNFT');
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);
  // makeAnEpicNFT 関数を呼び出す。NFT が Mint される。
  let txn = await nftContract.makeAnEpicNFT()
  // Minting が仮想マイナーにより、承認されるのを待つ。
  await txn.wait()
  // makeAnEpicNFT 関数をもう一度呼び出す。NFT がまた Mint される。
  txn = await nftContract.makeAnEpicNFT()
  // Minting が仮想マイナーにより、承認されるのを待つ。
  await txn.wait()
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

上記を `run.js` に反映させえたら、下記をターミナル上で実行しましょう。

```bash
npx hardhat run scripts/run.js
```
エラーが発生した場合は、`pwd` を実行して、 `epic-nfts` ディレクトリにいることを確認して、もう一度上記のコードを実行してみてください。

下記のような結果が、ターミナルに出力されれば、テストは成功です。

```
Compiling 1 file with 0.8.4
Solidity compilation finished successfully
This is my NFT contract.
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
An NFT w/ ID 0 has been minted to 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
An NFT w/ ID 1 has been minted to 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
```

現在、ユーザーがこのスマートコントラクトにアクセスしてNFTを発行するたび、データは常に同じ `Tanya` です！🐱

次のセクションでは、NFT を作成するすべての人がランダムで一意の NFT を取得できるようにする方法を学習していきます。

それでは、テストネットに `MyEpicNFT.sol` コントラクトをデプロイしましょう。

🎉 テストネットへコントラクトをデプロイする
------------------------

これから、テストネットにあなたのスマートコントラクトをデプロイしていきます。

これが成功すると、**NFT をオンラインで表示**できるようになり、 世界中のユーザーがあなたの NFT を OpenSea から見ることができるようになります。

💳 トランザクションについて
------------------
**イーサリアムネットワーク上でブロックチェーンに新しく情報を書き込むこと**を、**トランザクション**と呼びます。

**新しくスマートコントラクトをイーサリアムネットワークにデプロイした**という情報をブロックチェーン上に書き込むこともトランザクションです。

トランザクションにはマイナーの承認が必要なので、Alchemy を導入します。

Alchemy は、世界中のトランザクションを一元化し、マイナーの承認を促進するプラットフォームです。

[こちら](https://www.alchemy.com/) から Alchemy のアカウントを作成してください。

💎 Alchemyでネットワークを作成する
------------------
Alchemyのアカウントを作成したら、`CREATE APP` ボタンを押してください。

![](/public/images/ETH-NFT-collection/section-1/1_4_3.png)

次に、下記の項目を埋めていきます。下図を参考にしてください。

![](/public/images/ETH-NFT-collection/section-1/1_4_4.png)

- `NAME` : プロジェクトの名前（例: `MyEpicNFT` ）
- `DESCRIPTION` : プロジェクトの概要（任意）
- `ENVIRONMENT` : `Development` を選択。
- `CHAIN` : `Ethereum` を選択。
- `NETWORK` : `Rinkeby` を選択。

それから、作成した App の `VIEW DETAILS` をクリックします。

![](/public/images/ETH-NFT-collection/section-1/1_4_5.png)

プロジェクトを開いたら、`VIEW KEY` ボタンをクリックします。

![](/public/images/ETH-NFT-collection/section-1/1_4_6.png)

ポップアップが開くので、`HTTP` のリンクをコピーしてください。

これがあなたが本番環境のネットワークに接続する際に使用する `API Key` になります。

- **`API Key` は、後で必要になるので、あなたのPC上のわかりやすいところに、メモとして残しておいてください。**

🐣 テストネットとは？
------------

今回のプロジェクトでは、コスト（＝ 本物の ETH ）が発生するメインネットではなく、**テストネットにコントラクトをデプロイします。**

テストネットはメインネットを模しています。
- メインネットにコントラクトをデプロイした際に発生するイベントのテストを行うのに最適です。
- テストネットは偽の ETH を使用しているため、いくらでもトランザクションのテストを行えます。

今回は、以下のイベントをテストしていきます。

1. トランザクションの発生を世界中のマイナーたちに知らせる

2. あるマイナーがトランザクションを発見する

3. そのマイナーがトランザクションを承認する

4. そのマイナーがトランザクションを承認したことを他のマイナーたちに知らせ、トランザクションのコピーを更新する

🚰 偽の ETH を取得する
------------------------

今回は、`Rinkeby` というイーサリアム財団によって運営されているテストネットを使用します。

`Rinkeby` にコントラクトをデプロイし、コードのテストを行うために、偽の ETH を取得しましょう。

ユーザーが偽の ETH を取得するために用意されたインフラは、「フォーセット（＝蛇口）」と呼ばれています。

フォーセットを使用する前に、あなたの MetaMask ウォレットを `Rinkeby Test Network` に設定してください。

✍️: Metamask で `Rinkeby Test Network` を設定する方法
>
> 1 \. Metamask ウォレットのネットワークトグルを開く。
>
>![](/public/images/ETH-NFT-collection/section-1/1_4_7.png)
>
> 2 \. `Show/hide test networks` をクリック。
>
> ![](/public/images/ETH-NFT-collection/section-1/1_4_8.png)
>
> 3 \. `Show test networks` を `ON` にする。
>
> ![](/public/images/ETH-NFT-collection/section-1/1_4_9.png)
>
> 4 \. `Rinkeby Test Network` を選択する。
>
>![](/public/images/ETH-NFT-collection/section-1/1_4_10.png)

MetaMask ウォレットに `Rinkeby Test Network` が設定されたら、下記のリンクの中から条件に合うものを選んで、少量の偽 ETH を取得しましょう。

| WEBサイト|リンク| 偽ETHの取得額| 取得までにかかる時間|
| ---------------- | ------------------------------------- | --------------- | ------------ |
| MyCrypto         | https://app.mycrypto.com/faucet       | 0.01            | なし         |
| Buildspace       | https://buildspace-faucet.vercel.app/ | 0.025           | 1日           |
| Ethily           | https://ethily.io/rinkeby-faucet/     | 0.2             | 1週間           |
| Official Rinkeby | https://faucet.rinkeby.io/            | 3 / 7.5 / 18.75 | 8時間 / 1日 / 3日 |
| Chainlink        | https://faucets.chain.link/rinkeby    | 0.1             | なし         |

🚀 `deploy.js` ファイルを作成する
------------------------

`run.js` は、あくまでローカル環境でコードのテストを行うためのスクリプトでした。

テストネットにコントラクトをデプロイするために、`scripts` フォルダの下に` deploy.js` という名前のファイルを作成しましょう。

下記のように、`deploy.js` スクリプトを更新しましょう。

```javascript
const main = async () => {
	// コントラクトがコンパイルします
  	// コントラクトを扱うために必要なファイルが `artifacts` ディレクトリの直下に生成されます。
	const nftContractFactory = await hre.ethers.getContractFactory('MyEpicNFT');
	// Hardhat がローカルの Ethereum ネットワークを作成します。
	const nftContract = await nftContractFactory.deploy();
	// コントラクトが Mint され、ローカルのブロックチェーンにデプロイされるまで待ちます。
	await nftContract.deployed();
	console.log("Contract deployed to:", nftContract.address);
	// makeAnEpicNFT 関数を呼び出す。NFT が Mint される。
	let txn = await nftContract.makeAnEpicNFT()
	// Minting が仮想マイナーにより、承認されるのを待ちます。
	await txn.wait()
	console.log("Minted NFT #1")
	// makeAnEpicNFT 関数をもう一度呼び出します。NFT がまた Mint されます。
	txn = await nftContract.makeAnEpicNFT()
	// Minting が仮想マイナーにより、承認されるのを待ちます。
	await txn.wait()
	console.log("Minted NFT #2")
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

📈 Rinkeby Test Network に コントラクトをデプロイしましょう
------------------------

`hardhat.config.js` ファイルを変更する必要があります。

これは、スマートコントラクトプロジェクトのルートディレクトリにあります。

- 今回は、`epic-nfts` ディレクトリの直下に `hardhat.config.js` が存在するはずです。

例）`epic-nfts` で `ls` を実行した結果
```
README.md			package-lock.json
artifacts			package.json
cache				scripts
contracts			test
hardhat.config.js
```

下記のように、`hardhat.config.js` の中身を更新します。

```javascript
require('@nomiclabs/hardhat-waffle');
module.exports = {
  solidity: '0.8.4',
  networks: {
    rinkeby: {
      url: 'YOUR_ALCHEMY_API_URL',
      accounts: ['YOUR_PRIVATE_RINKEBY_ACCOUNT_KEY'],
    },
  },
};
```
次に、`YOUR_ALCHEMY_API_URL` と`YOUR_PRIVATE_RINKEBY_ACCOUNT_KEY` を取得して、`hardhat.config.js` に貼り付けましょう。

1. \. `YOUR_ALCHEMY_API_URL`の取得

> `hardhat.config.js` の `YOUR_ALCHEMY_API_URL` の部分を先ほど取得した Alchemy の URL（ `HTTP` リンク） と入れ替えます。

2. \. `YOUR_PRIVATE_RINKEBY_ACCOUNT_KEY` の取得
>
> 1. お使いのブラウザから、Metamask プラグインをクリックして、ネットワークを `Rinkeby Test Network` に変更します。
>
> ![](/public/images/ETH-NFT-collection/section-1/1_4_11.png)
>
> 2. それから、`Account details` を選択してください。
>
> ![](/public/images/ETH-NFT-collection/section-1/1_4_12.png)
>
> 3. `Account details` から `Export Private Key` をクリックしてください。
>
> ![](/public/images/ETH-NFT-collection/section-1/1_4_13.png)
>
> 4. Metamask のパスワードを求められるので、入力したら `Confirm` を推します。
>
> ![](/public/images/ETH-NFT-collection/section-1/1_4_14.png)
>
> 5. あなたの秘密鍵（＝ `Private Key` ）が表示されるので、クリックしてコピーします。
>
> ![](/public/images/ETH-NFT-collection/section-1/1_4_15.png)
>
> `hardhat.config.js` の `YOUR_PRIVATE_RINKEBY_ACCOUNT_KEY` の部分をここで取得した秘密鍵とを入れ替えます。



⚠️: 注意
> `hardhat.config.js` ファイルを Github にコミットしないでください。
>
> `hardhat.config.js` ファイルは、あなたのウォレットの秘密鍵を保持しており、他の人が見れる場所に保存するのは、大変危険です。

下記を実行して、VS Code で `.gitignore` ファイルを編集しましょう。
```
code .gitignore
```
`.gitignore` に `hardhat.config.js` の行を追加します。

`.gitignore` の中身が下記のようになっていれば、問題ありません。
```bash
node_modules
.env
coverage
coverage.json
typechain

#Hardhat files
cache
artifacts
hardhat.config.js
```

`.gitignore` に記載されているファイルやディレクトリは、Github にディレクトリをプッシュされずに、ローカル環境にのみ保存されます。

**✍️: スマートコントラクトをデプロイするのに秘密鍵が必要な理由**
> **新らしくスマートコントラクトをイーサリアムネットワーク上にデプロイすること**も、トランザクションの一つです。
>
> トランザクションを行うためには、ブロックチェーンに「ログイン」する必要があります。
>
> 「ログイン」には下記の情報が必要となります。
> - ユーザー名: 公開アドレス
> ![](/public/images/ETH-NFT-collection/section-1/1_4_16.png)
>
> - パスワード: 秘密鍵
> ![](/public/images/ETH-NFT-collection/section-1/1_4_17.png)
>
> ユーザー名とパスワードを使用して、AWS にログインしてプロジェクトをデプロイするのと同じです。

⭐️ 実行する
------------------------

構成のセットアップが完了すると、前に作成したデプロイスクリプトを使用してデプロイするように設定されます。

`epic-nfts` のルートディレクトリからこのコマンドを実行します 。

```bash
npx hardhat run scripts/deploy.js --network rinkeby
```

`deploy.js` を実行すると、実際に NFT を作成します。
このプロセスは、約 20〜40 秒かかります。

下記のような結果がターミナルに出力されば、成功です。

```
Contract deployed to: 0x8F315ec3999874A676bbC9323cE31F3d242a4bC7
Minted NFT #1
Minted NFT #2
```

👀 Etherscan でトランザクションを確認する
------------------------
ターミナルに出力された `Contract deployed to` に続くアドレスを、[Etherscan](https://rinkeby.etherscan.io/) に貼り付けて、あなたのスマートコントラクトのトランザクション履歴を見てみましょう。

Etherscan は、イーサリアムネットワーク上のトランザクションに関する情報を確認するのに便利なプラットフォームです。

*表示されるまでに約1分かかり場合があります。*

🖼 NFT をオンラインで確認しよう
------------------------

作成した NFT は、Rarible や OpenSea の TestNet サイトで確認することができます。

**🌊: OpeanSea で NFT を確認する方法**

[testnets.opensea.io](https://testnets.opensea.io/) にアクセスしてください。

ターミナルに出力された `Contract deployed to` に続くアドレスを検索してみましょう。

**`Enter` をクリックしないように注意してください。検索でコレクションが表示されたら、コレクション自体をクリックしてください** 。

⚠️: OpenSea で NFT を確認するのに時間が掛かる場合があります。5分以上経ってもコレクションが表示されない場合は、Rarible を使いましょう😇

**🐝: Rarible で NFT を確認する方法**

[`rinkeby.rarible.com`](https://rinkeby.rarible.com/) にアクセスしてください。

ターミナルに出力された `Contract deployed to` に続くアドレスを検索してみましょう。

![](/public/images/ETH-NFT-collection/section-1/1_4_18.png)

`TanyaNFT` をクリックしてみましょう。

![](/public/images/ETH-NFT-collection/section-1/1_4_19.png)

コレクションが Rarible に表示されているのを確認してください。

![](/public/images/ETH-NFT-collection/section-1/1_4_20.png)

わたしが作成した Tanya コレクションの `tokenID` 0番 のリンクは[こちら](https://rinkeby.rarible.com/token/0x67cd3f53c20e3a6211458dd5b7465e1f9464531c:0)になります。

リンクの内容は以下のようになります。
```
https://rinkeby.rarible.com/token/0x67cd3f53c20e3a6211458dd5b7465e1f9464531c:0
```
中身を見ていきましょう。

`0x67cd3f53c20e3a6211458dd5b7465e1f9464531c` は、`MyEpicNFT` コントラクトのデプロイ先のアドレスです。

`0` は、`tokenID` が 0番であることを意味しています。

上記のリンクを共有すれば、誰でもあなたの NFT をオンライン上で見ることができます。

🙋‍♂️ 質問する
-------------------------------------------
ここまでの作業で何かわからないことがある場合は、Discord の `#section-1-help` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください✨
```
1. 何をしようとしていたか
2. エラー文をコピー&ペースト
3. エラー画面のスクリーンショット
```
-----
オンラインであなたの NFT を確認したら、次のレッスンに進みましょう🎉

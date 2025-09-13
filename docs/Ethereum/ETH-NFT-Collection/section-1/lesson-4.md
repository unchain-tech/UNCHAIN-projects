---
title: NFTを発行するスマートコントラクトを作ろう
---
### 🪄 NFT を作成しよう

これから、いくつかのNFTを作成します。

下記のように、`MyEpicNFT.sol`を更新しましょう。

```solidity
// MyEpicNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
// いくつかの OpenZeppelin のコントラクトをインポートします。
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
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

      // NFT が Mint されるときのカウンターをインクリメントします。
      _tokenIds.increment();

      // 現在のtokenIdを取得します。tokenIdは1から始まります。
      uint256 newItemId = _tokenIds.current();

       // msg.sender を使って NFT を送信者に Mint します。
      _safeMint(msg.sender, newItemId);

      // NFT データを設定します。
      _setTokenURI(newItemId, "Valuable data!");

      // NFTがいつ誰に作成されたかを確認します。
      console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);
    }
}
```

1行ずつコードを見ていきましょう。

```solidity
// MyEpicNFT.sol
contract MyEpicNFT is ERC721URIStorage {
  :
```

ここでは、コントラクトを宣言する際に、`is ERC721URIStorage`を使用してOpenZeppelinのコントラクトを「継承」しています。

継承とは、OpenZepplin等のイーサリアムに関する開発を便利にするフレームワークを提供するライブラリから、スマートコントラクトに必要なモジュールを呼び出すことを意味します。

これは関数をインポートするようなイメージで理解してください。

NFTのモジュールは`ERC721`として知られています。

このモジュールには、NFT発行に必要な標準機能が含まれているため、開発者は独自のロジックを記述してカスタマイズするところに集中できます。

次に、下記のコードを見ていきましょう。

```solidity
// MyEpicNFT.sol
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
> ここでは`uint8`を使用していませんし、`uint256`が毎回 1 ずつ増加するときにオーバーフローする可能性は低いと思われますが（ `2^256`は本当に大きな数です）、将来的に DApp が予期せぬ動作をすることがないように、コントラクトに保護規定を設けることはグッドプラクティスです!👍

次に、下記のコードを見ていきましょう。

```solidity
// MyEpicNFT.sol
Counters.Counter private _tokenIds;
```

ここでは、`private _tokenIds`を宣言して、`_tokenIds`を初期化しています。

- `_tokenIds`の初期値は0です。

tokenIdはNFTの一意な識別子で、0, 1, 2, .. Nのように付与されます。

次に、下記のコードを見ていきましょう。

```solidity
// MyEpicNFT.sol
constructor() ERC721 ("TanyaNFT", "TANYA") {
    console.log("This is my NFT contract.");
}
```

`ERC721`モジュールを使用した`constructor`を定義しています。

ここでは任意のNFTトークンの名前とシンボルを引数として渡しています。

- `TanyaNFT`: NFTトークンの名前
- `TANYA`: NFTトークンのそのシンボル

次に、下記の`makeAnEpicNFT`関数を段階的に見ていきましょう。

```solidity
// MyEpicNFT.sol
// ユーザーが NFT を取得するために実行する関数です。
function makeAnEpicNFT() public {
    // NFT が Mint されるときのカウンターをインクリメントします。
    _tokenIds.increment();
    // 現在のtokenIdを取得します。tokenIdは1から始まります。
    uint256 newItemId = _tokenIds.current();
     // msg.sender を使って NFT を送信者に Mint します。
    _safeMint(msg.sender, newItemId);
    // NFT データを設定します。
    _setTokenURI(newItemId, "Valuable data!");
    // NFTがいつ誰に作成されたかを確認します。
    console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);
}
```

まず、下記のコードを見ていきます。

```solidity
// MyEpicNFT.sol
_tokenIds.increment();
```

`_tokenIds.increment()`（＝ OpenZeppelinが提供する関数）を使用して、`tokenIds`をインクリメント(＝ `+1`)しています。

これにより、毎回NFTが発行されると、異なる`tokenIds`識別子がNFTと紐付けられます。

複数のユーザーが、同じ`tokenIds`を持つことはありません。

次に、下記のコードを見ていきましょう。

```solidity
// MyEpicNFT.sol
uint256 newItemId = _tokenIds.current();
```

`_tokenIds`について理解を深めましょう。

ピカソの例を覚えているでしょうか？

彼は、自分のNFTコレクションに、`Sketch ＃1`から`Sketch ＃100`までのユニークな識別子を付与していました。

ここでは、ピカソがしたように、`_tokenIds`を使用してNFTに対して一意の識別子を付与し、トラッキングできようにしています。

`_tokenIds`は単なる数字です。

したがって、 `makeAnEpicNFT`関数が初めて呼び出されたとき、 `newItemId`は1になります。

- `Counters.Counter private _tokenIds`により初期化し、`makeAnEpicNFT`関数の最初でインクリメントされているため、`newItemId`は1です。

もう一度実行すると、`newItemId`は2になり、以下同様に続きます。

`_tokenIds`は**状態変数**です。つまり、変更すると、値はコントラクトに直接保存されます。

次に、下記のコードを見ていきましょう。

```solidity
// MyEpicNFT.sol
_safeMint(msg.sender, newItemId);
```

ここでは、コントラクトを呼び出したユーザー(＝ `msg.sender`)のアドレスに、ID(= `newItemId`)の付与されたNFTをMintしています。

`msg.sender`はSolidityが提供している変数であり、あなたのスマートコントラクトを呼び出したユーザーのパブリックアドレスを取得するために使用されます。

これは、**ユーザーのパブリックアドレスを取得するための安全な方法**です。

- ユーザーはパブリックアドレスを使用して、コントラクトを呼び出す必要があります。
- これは、「サインイン」のような認証機能の役割を果たします。

次に、下記のコードを見ていきましょう。

```solidity
// MyEpicNFT.sol
_setTokenURI(newItemId, "Valuable data!");
```

これにより、NFTの一意の識別子と、その一意の識別子に関連付けられたデータが紐付けられます。

- NFTを価値あるものにするのは、文字通り「NFTの一意の識別子」と「実際のデータ」を紐付ける必要があります。

今は、`Valuable data!`という文字列が、「実際のデータ」として設定されていますが、これは後で変更します。

- `Valuable data!`は、`ERC721`の基準に準拠していません。
- `Valuable data!`と入れ替わる`tokenURI`についてこれから学んでいきます。

最後に、下記のコードを見ていきましょう。

```js
console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);
```

ここでは、NFTがいつ誰に作成されたかを確認しています。

### 🎟 `tokenURI`を取得して、コントラクトをローカル環境で実行しよう

`tokenURI`は、**NFT データが保存されている場所**を意味します。

`tokenURI`は、下記のような「**メタデータ**」と呼ばれるJSONファイルに**リンク**されています。

```json
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

メタデータの構造が [`ERC721`のメタデータ規格](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md) と一致しない場合、デジタルデータはOpenSeaや今回使用するNFTビュアーの[gemcase](https://gemcase.vercel.app/)では正しく表示されません。

- Openseaは、`ERC721`のメタデータ規格をサポートしています。
- 音声ファイル、動画ファイル、3Dメディアなどに対応するメタデータ構造に関しては、[OpenSea の要件](https://zenn.dev/hayatoomori/articles/f26cc4637c7d66) を参照してください。

上記の`Tanya`のJSONメタデータをコピーして、 [こちら](https://www.npoint.io/) のWebサイトに貼り付けてください。

このWebサイトは、JSONデータをホストするのに便利です。

このレッスンでは、NFTデータを保持するために使用します。

下図のように、Webサイトにメタデータを貼り付けて、`Save`ボタンをクリックすると、JSONファイルへのリンクが表示されます。

![](/images/ETH-NFT-Collection/section-1/1_4_1.png)

枠で囲んだ部分をコピーして、ブラウザに貼り付け、メタデータがリンクとして保存されていることを確認しましょう。

### 🐱 オリジナルの画像を使用する方法

[Imgur](https://imgur.com/) というWebサイトを使うと、無料で画像をオンライン上でホストできます。

メタデータの`"image"`にリンクを貼り付ける場合は、`Direct Link`を使用するようにしてください。

下記にImgurで画像をアップロードした際に選択する`Direct Link`の取得方法を示します。

![](/images/ETH-NFT-Maker/section-1/1_4_2.jpg)

ぜひ自分のお気に入りの画像を使って、自分だけのメタデータを作成してみましょう。

### 🐈 `MyEpicNFT.sol`を更新する

それでは、スマートコントラクトに向かい、下記の行を変更しましょう。

```solidity
// MyEpicNFT.sol
_setTokenURI(newItemId, "Valuable data!");
```

先ほど取得したJSONファイルへのリンクこそ、`tokenURI`(＝ **NFT データが保存されている場所**)です。

そのリンクを下記に貼り付けましょう。

```solidity
// MyEpicNFT.sol
_setTokenURI(
    newItemId,
    "こちらに、JSON ファイルへのリンクを貼り付けてください"
);
```

### 🎉 NFT をローカルネットワークにデプロイしよう

ここから、実際に`makeAnEpicNFT()`関数を呼び出し、スマートコントラクトが問題なくデプロイされるかテストしていきます。

`scripts/deploy.js`ファイルを下記のように変更しましょう。

```js
// deploy.js
async function main() {
  const nftContractFactory = await hre.ethers.getContractFactory("MyEpicNFT");
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);
  // makeAnEpicNFT 関数を呼び出す。NFT が Mint される。
  let txn = await nftContract.makeAnEpicNFT();
  // Minting が仮想マイナーにより、承認されるのを待つ。
  await txn.wait();
  // makeAnEpicNFT 関数をもう一度呼び出す。NFT がまた Mint される。
  txn = await nftContract.makeAnEpicNFT();
  // Minting が仮想マイナーにより、承認されるのを待つ。
  await txn.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

上記を`deploy.js`に反映させたら、ターミナル上で`ETH-NFT-Collection`ディレクトリ直下にいることを確認し下記を実行しましょう。

```
yarn contract deploy
```

エラーが発生した場合は、`pwd`を実行して、 `packages/contract`ディレクトリにいることを確認して、もう一度上記のコードを実行してみてください。

下記のような結果が、ターミナルに出力されれば、テストは成功です。

```
Compiled 17 Solidity files successfully
This is my NFT contract.
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
An NFT w/ ID 1 has been minted to 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
An NFT w/ ID 2 has been minted to 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
```

現在、ユーザーがこのスマートコントラクトにアクセスしてNFTを発行するたび、データは常に同じ`Tanya`です!　 🐱

次のセクションでは、NFTを作成するすべての人がランダムで一意のNFTを取得できるようにする方法を学習していきます。

それでは、テストネットに`MyEpicNFT.sol`コントラクトをデプロイしましょう。

### 🛫 テストネットへコントラクトをデプロイする

これから、テストネットにあなたのスマートコントラクトをデプロイしていきます。

これが成功すると、**NFT をオンラインで表示**できるようになり、 世界中のユーザーがあなたのNFTを見ることができます。今回は、`gemcase`というNFTビュアーを使用してオンライン上で確認してみたいと思います。

### 💳 トランザクションについて

**イーサリアムネットワーク上でブロックチェーンに新しく情報を書き込むこと**を、**トランザクション**と呼びます。

**新しくスマートコントラクトをイーサリアムネットワークにデプロイした**という情報をブロックチェーン上に書き込むこともトランザクションです。

トランザクションにはマイナーの承認が必要ですので、Alchemyを導入します。

Alchemyは、世界中のトランザクションを一元化し、マイナーの承認を促進するプラットフォームです。

[こちら](https://www.alchemy.com/) からAlchemyのアカウントを作成してください。

### 💎 Alchemy でネットワークを作成する

Alchemyのアカウントを作成したら、`CREATE APP`ボタンを押してください。

![](/images/ETH-NFT-Collection/section-1/1_4_3.png)

次に、下記の項目を埋めていきます。下図を参考にしてください。

![](/images/ETH-NFT-Collection/section-1/1_4_4.png)

- `NAME` : プロジェクトの名前(例: `MyEpicNFT`)
- `DESCRIPTION` : プロジェクトの概要（任意）
- `CHAIN` : `Ethereum`を選択
- `NETWORK` : `Sepolia`を選択

それから、作成したAppの`VIEW DETAILS`をクリックします。

![](/images/ETH-NFT-Collection/section-1/1_4_5.png)

プロジェクトを開いたら、`VIEW KEY`ボタンをクリックします。

![](/images/ETH-NFT-Collection/section-1/1_4_6.png)

ポップアップが開くので、`HTTPS`のリンクをコピーしてください。

これがあなたが本番環境のネットワークに接続する際に使用する`API Key`になります。

- **`API Key`は、後で必要になるので、あなたの PC 上のわかりやすいところに、メモとして残しておいてください。**

### 🐣 テストネットとは？

今回のプロジェクトでは、コスト（＝ 本物のETH）が発生するイーサリアムメインネットではなく、**テストネットにコントラクトをデプロイします。**

テストネットはイーサリアムメインネットを模しています。

- イーサリアムメインネットにコントラクトをデプロイした際に発生するイベントのテストを行うのに最適です。
- テストネットは偽のETHを使用しているため、いくらでもトランザクションのテストを行えます。

今回は、以下のイベントをテストしていきます。

1. トランザクションの発生を世界中のマイナーたちに知らせる
2. あるマイナーがトランザクションを発見する
3. そのマイナーがトランザクションを承認する
4. そのマイナーがトランザクションを承認したことをほかのマイナーたちに知らせ、トランザクションのコピーを更新する

### 🚰 偽の ETH を取得する

今回は、`Sepolia`というイーサリアム財団によって運営されているテストネットを使用します。

`Sepolia`にコントラクトをデプロイし、コードのテストを行うために、偽のETHを取得しましょう。

ユーザーが偽のETHを取得するために用意されたインフラは、「フォーセット（＝蛇口）」と呼ばれています。

フォーセットを使用する前に、あなたのMetaMaskウォレットを`Sepolia Test Network`に設定してください。

> ✍️: MetaMask で`Sepolia Test Network`を設定する方法
>
> 1 \. MetaMask ウォレットのネットワークトグルを開く。
>
> ![](/images/ETH-NFT-Collection/section-1/1_4_7.png)
>
> 2 \. `Show/hide test networks`をクリック。
>
> ![](/images/ETH-NFT-Collection/section-1/1_4_8.png)
>
> 3 \. `Show test networks`を`ON`にする。
>
> ![](/images/ETH-NFT-Collection/section-1/1_4_9.png)
>
> 4 \. `Sepolia Test Network`を選択する。
>
> ![](/images/ETH-NFT-Collection/section-1/1_4_10.png)

MetaMaskウォレットに`Sepolia Test Network`が設定されたら、下記のリンクの中から条件に合うものを選んで、少量の偽ETHを取得しましょう。

- [Alchemy](https://sepoliafaucet.com/) - 1 Sepolia ETH（24時間に1度もらうことができる）
  - ウォレットアドレスを入力して`Send Me ETH`ボタンを押下するとその場でもらえます。
- [Chainlink](https://faucets.chain.link/) - 0.1 test ETH（その場でもらえる）
  - `Connect wallet`をクリックしてMetaMaskと接続する必要があります。
  - Twitterアカウントを連携する必要があります。

### 📈 Sepolia Test Network に コントラクトをデプロイしましょう

`hardhat.config.js`ファイルを変更する必要があります。

これは、スマートコントラクトプロジェクトのルートディレクトリにあります。

- 今回は、`packages/contract`ディレクトリの直下に`hardhat.config.js`が存在するはずです。

例)`contract`で`ls`を実行した結果

```
README.md			hardhat.config.js
artifacts			package.json
cache				scripts
contracts			test
```

下記のように、`hardhat.config.js`の中身を更新します。

```js
// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.18",
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: "YOUR_ALCHEMY_API_URL" || "",
      accounts: "YOUR_PRIVATE_ACCOUNT_KEY" ? ["YOUR_PRIVATE_ACCOUNT_KEY"] : [],
    },
  },
};
```

次に、`YOUR_ALCHEMY_API_URL`と`YOUR_PRIVATE_ACCOUNT_KEY`を取得して、`hardhat.config.js`に貼り付けましょう。

1\. `YOUR_ALCHEMY_API_URL`の取得

> `hardhat.config.js`の`YOUR_ALCHEMY_API_URL`の部分を先ほど取得した Alchemy の URL（ `HTTPS`リンク） と入れ替えます。

2\. `YOUR_PRIVATE_ACCOUNT_KEY`の取得

> 1\. お使いのブラウザから、MetaMask プラグインをクリックして、ネットワークを`Sepolia Test Network`に変更します。
>
> ![](/images/ETH-NFT-Collection/section-1/1_4_10.png)
>
> 2\. それから、`Account details`を選択してください。
>
> ![](/images/ETH-NFT-Game/section-1/1_5_9.png)
>
> 3\. `Account details`から`Export Private Key`をクリックしてください。
>
> ![](/images/ETH-NFT-Game/section-1/1_5_10.png)
>
> 4\. MetaMask のパスワードを求められるので、入力したら`Confirm`を推します。
>
> ![](/images/ETH-NFT-Game/section-1/1_5_11.png)
>
> 5\. あなたの秘密鍵（＝ `Private Key` ）が表示されるので、クリックしてコピーします。
>
> ![](/images/ETH-NFT-Collection/section-1/1_4_15.png)
>
> `hardhat.config.js`の`YOUR_PRIVATE_ACCOUNT_KEY`の部分をここで取得した秘密鍵とを入れ替えます。

> ⚠️: 注意
>
> `hardhat.config.js`ファイルを Github にコミットしないでください。
>
> `hardhat.config.js`ファイルは、あなたのウォレットの秘密鍵を保持しており、他の人が見れる場所に保存するのは、大変危険です。

下記を実行して、VS Codeで`.gitignore`ファイルを編集しましょう。

```
code .gitignore
```

`.gitignore`に`hardhat.config.js`の行を追加します。

`.gitignore`の中身が下記のようになっていれば、問題ありません。

```
node_modules
.env
coverage
coverage.json
typechain
typechain-types

#Hardhat files
cache
artifacts
hardhat.config.js
```

`.gitignore`に記載されているファイルやディレクトリは、GitHubにディレクトリをプッシュされずに、ローカル環境にのみ保存されます。

> **✍️: スマートコントラクトをデプロイするのに秘密鍵が必要な理由** > **新らしくスマートコントラクトをイーサリアムネットワーク上にデプロイすること**も、トランザクションの一つです。
>
> トランザクションを行うためには、ブロックチェーンに「ログイン」する必要があります。
>
> 「ログイン」には下記の情報が必要となります。
>
> - ユーザー名: 公開アドレス
>   ![](/images/ETH-dApp/section-2/2_1_12.png)
>
> - パスワード: 秘密鍵
>   ![](/images/ETH-NFT-Collection/section-1/1_4_17.png)
>
> ユーザー名とパスワードを使用して、AWS にログインしてプロジェクトをデプロイするのと同じです。

### ⭐️ 実行する

構成のセットアップが完了すると、前に作成したデプロイスクリプトを使用してデプロイするように設定されます。

`ETH-NFT-Collection`ディレクトリ直下でこのコマンドを実行します。

```
yarn contract deploy:sepolia
```

`deploy.js`を実行すると、実際にNFTを作成します。
このプロセスは、約20〜40秒かかります。

下記のような結果がターミナルに出力されば、成功です。

```
Contract deployed to: 0x8F315ec3999874A676bbC9323cE31F3d242a4bC7
Minted NFT #1
Minted NFT #2
```

### 👀 Etherscan でトランザクションを確認する

ターミナルに出力された`Contract deployed to`に続くアドレスを、[Etherscan](https://sepolia.etherscan.io/) に貼り付けて、あなたのスマートコントラクトのトランザクション履歴を見てみましょう。

Etherscanは、イーサリアムネットワーク上のトランザクションに関する情報を確認するのに便利なプラットフォームです。

_表示されるまでに約 1 分かかり場合があります。_

### 🖼 NFT をオンラインで確認しよう

それでは、作成したNFTをNFTビュアーで確認してみましょう。

[gemcase](https://gemcase.vercel.app/) にアクセスし、フォームに情報を入力します。

- Blockchain : `EVM`
- Chain : `Sepolia Testnet`
- Address : ターミナルに出力された`Contract deployed to`に続くアドレス
- Token ID : `1`

![](/images/ETH-NFT-Collection/section-1/1_4_18.png)

`TanyaNFT`が表示されたら、`View`をクリックします。

ミントをしたNFTの情報が表示されます。

![](/images/ETH-NFT-Collection/section-1/1_4_19.jpg)

画面を下にスクロールをすると、現在ミントされているNFT一覧が確認できます。ここでは、2つのNFT画像が表示されています。デプロイ時に2回ミントを行ったため、Token ID 1と2のNFT画像が確認できます。

![](/images/ETH-NFT-Collection/section-1/1_4_20.jpg)

私が作成したTanyaコレクションの`tokenID` 1番のリンクは[こちら](https://gemcase.vercel.app/view/evm/sepolia/0x8f561c94cc0c6c2771052d10980937804cd53cd6/1)になります。

リンクの内容は以下のようになります。

```
https://gemcase.vercel.app/view/evm/sepolia/0x8f561c94cc0c6c2771052d10980937804cd53cd6/1
```

中身を見ていきましょう。

`0x8F561C94CC0c6C2771052d10980937804CD53Cd6`は、`MyEpicNFT`コントラクトのデプロイ先のアドレスです。

`1`は、`tokenID`が1番であることを意味しています。

上記のリンクを共有すれば、誰でもあなたのNFTをオンライン上で見ることができます。

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

おめでとうございます!　セクション1が終了しました!

gemcaseのリンクを`#ethereum`に貼り付けて、コミュニティにあなたのNFTをシェアしてください 😊

どんなNFTなのか気になります ✨

オンラインであなたのNFTを確認したら、次のレッスンに進みましょう 🎉


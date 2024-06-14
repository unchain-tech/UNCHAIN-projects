### 🙉 GitHub に関する注意点

**GitHub にコントラクト( `contract`)のコードをアップロードする際は、秘密鍵を含むハードハット構成ファイルをリポジトリにアップロードしないよう注意しましょう**

秘密鍵などのファイルを隠すために、ターミナルで`contract`に移動して、下記を実行してください。

```
yarn add --dev dotenv
```

`dotenv`モジュールに関する詳しい説明は、[こちら](https://maku77.github.io/nodejs/env/dotenv.html)を参照してください。

`dotenv`をインストールしたら、`.env`ファイルを更新します。

ファイルの先頭に`.`がついているファイルは、「不可視ファイル」です。

`.`がついているファイルやフォルダはその名の通り、見ることができないので、「隠しファイル」「隠しフォルダ」とも呼ばれます。

操作されては困るファイルについては、このように「不可視」の属性を持たせて、一般の人が触れられないようにします。

ターミナル上で`contract`ディレクトリにいることを確認し、下記を実行しましょう。VS Codeから`.env`ファイルを開きます。

```
code .env
```

そして、`.env`ファイルを下記のように更新します。

```
PRIVATE_KEY = hardhat.config.jsにある秘密鍵（accounts）を貼り付ける
STAGING_ALCHEMY_KEY = hardhat.config.js内にあるAlchemyのyURLを貼り付ける
PROD_ALCHEMY_KEY = イーサリアムメインネットにデプロイする際に使用するAlchemyのURLを貼り付ける（今は何も貼り付ける必要はありません）
```

私の`.env`は、下記のようになります。

```javascript
PRIVATE_KEY = 0x...
STAGING_ALCHEMY_KEY = https://...
PROD_ALCHEMY_KEY = ""
```

`.env`を更新したら、 `hardhat.config.js`ファイルを次のように更新してください。

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.9",
  networks: {
    sepolia: {
      url: process.env.STAGING_ALCHEMY_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
    mainnet: {
      chainId: 1,
      url: process.env.PROD_ALCHEMY_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```

最後に` .gitignore`に`.env`が含まれていることを確認しましょう。

`cat .gitignore`をターミナル上で実行します。

下記のような結果が表示されていれば成功です。

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
```

これで、GitHubにあなたの秘密鍵をアップロードせずに、GitHubにコントラクトのコードをアップロードできます。

### 🌎 IPFS に 画像を保存する

現在、NFTキャラクターとボスの画像はImgurに保存されています。

しかし、Imgurのサーバーがダウンしたり、終了してしまうと、それらの画像は永久に失われてしまうでしょう。

このようなケースを避けるために、[IPFS](https://docs.ipfs.io/concepts/what-is-ipfs/) に画像を保存する方法を紹介します。

- IPFSは誰にも所有されていない分散型データストレージシステムで、S3やGCPストレージなどを提供しています。

- たとえば、動画のNFTをあなたが発行したいと考えたとしましょう。

- オンチェーンでそのデータを保存すると、ガス代が非常に高くなります。

- このような場合、IPFSが役に立ちます。

[Pinata](https://www.pinata.cloud/) というサービスを使用すると、簡単に画像や動画をNFTにできます。

- NFTは、いくつかのメタデータにリンクする単なるJSONファイルであることを思い出してください 💡

- このJSONファイルをIPFSに配置できます。

[Pinata](https://www.pinata.cloud/) に向かい、アカウントを作成して、UIからキャラクターの画像ファイルをアップロードしてみましょう。

ファイルをアップロードしたら、UIに表示されている「CID」をコピーしてください。

**CID は IPFS のファイルコンテンツアドレスです。**

下記の画面から、CIDをコピーします。

![](/images/ETH-NFT-Game/section-4/4_2_1.png)

それでは、下記の`https`アドレスに、コピーしたCIDを貼り付け、ブラウザで中身を見てみましょう。

```
https://cloudflare-ipfs.com/ipfs/あなたのCIDコードを貼り付けます
```

> ⚠️: 注意
>
> IPFS がすでに組み込まれている **Brave Browser** を使用している場合は、下記のリンクをブラウザに貼り付けてください。
>
> ```
> ipfs://あなたのCIDコードを貼り付けます
> ```

下記のように、ブラウザにあなたの画像が表示されいることを確認してください。

![](/images/ETH-NFT-Game/section-4/4_2_2.png)

次に、`contract/scripts/run.js`と`contract/scripts/deploy.js`の`imgur`リンクを`CID`（＝ IPFSハッシュ）に変更していきましょう。

```javascript
// Hardhat がローカルの Ethereum ネットワークを、コントラクトのためだけに作成します。
const gameContract = await gameContractFactory.deploy(
  // キャラクターの名前
  ["ZORO", "NAMI", "USOPP"],
  // キャラクターの画像を IPFS の CID に変更
  [
    "QmXxR67ryeUw4xppPLbF2vJmfj1TCGgzANfiEZPzByM5CT",
    "QmPHX1R4QgvGQrZym5dpWzzopavyNX2WZaVGYzVQQ2QcQL",
    "QmUGjB7oQLBZdCDNJp9V9ZdjsBECjwcneRhE7bHcs9HwxG",
  ],
  [100, 200, 300],
  [100, 50, 25],
  "CROCODILE", // Bossの名前
  "https://i.imgur.com/BehawOh.png", // Bossの画像
  10000, // Bossのhp
  50 // Bossの攻撃力
);
```

```javascript
const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");

  const gameContract = await gameContractFactory.deploy(
    ["ZORO", "NAMI", "USOPP"], // キャラクターの名前
    [
      "QmXxR67ryeUw4xppPLbF2vJmfj1TCGgzANfiEZPzByM5CT", // キャラクターの画像
      "QmPHX1R4QgvGQrZym5dpWzzopavyNX2WZaVGYzVQQ2QcQL",
      "QmUGjB7oQLBZdCDNJp9V9ZdjsBECjwcneRhE7bHcs9HwxG",
    ],
    [100, 200, 300],
    [100, 50, 25],
    "CROCODILE", // Bossの名前
    "https://i.imgur.com/BehawOh.png", // Bossの画像
    10000, // Bossのhp
    50 // Bossの攻撃力
  );
  // ここでは、nftGame コントラクトが、
  // ローカルのブロックチェーンにデプロイされるまで待つ処理を行っています。
  const nftGame = await gameContract.deployed();

  console.log("Contract deployed to:", nftGame.address);
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

次に、`MyEpicGame.sol`を開き、`tokenURI`関数の中身を編集しましょう。

- `Base64.encode`の中身を更新してください。

```solidity
string memory json = Base64.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "',
            charAttributes.name,
            ' -- NFT #: ',
            Strings.toString(_tokenId),
            '", "description": "An epic NFT", "image": "ipfs://',
            charAttributes.imageURI,
            '", "attributes": [ { "trait_type": "Health Points", "value": ',strHp,', "max_value":',strMaxHp,'}, { "trait_type": "Attack Damage", "value": ',
            strAttackDamage,'} ]}'
          )
        )
      )
    );
```

ここでは、`image`タグの後に`ipfs://`を追加しています。

コントラクトを再度デプロイした後、最終的なメタデータは下記のような形になります。

```solidity
{
	"name": "USOPP -- NFT #: 1",
	"description": "An epic NFT game.",
	"image": "ipfs://QmUGjB7oQLBZdCDNJp9V9ZdjsBECjwcneRhE7bHcs9HwxG",
	"attributes": [{
		"trait_type": "Health Points",
		"value": 300,
		"max_value": 300
	}, {
		"trait_type": "Attack Damage",
		"value": 25
	}]
}
```

最後に、下記のコードを更新します。

1 \. `SelectCharacter/index.js`の中に記載されている`renderCharacters`メソッドの中の`<img src={character.imageURI} alt={character.name} />`を下記に更新しましょう。

```javascript
<img src={`https://cloudflare-ipfs.com/ipfs/${character.imageURI}`} />
```

2 \. `Arena/index.js`の中に記載されているHTMLを出力する`return();`に着目してください。

```javascript
<img src={characterNFT.imageURI} alt={`Character ${characterNFT.name}`} />
```

上記のコードを下記に更新してください。

```javascript
<img
  src={`https://cloudflare-ipfs.com/ipfs/${characterNFT.imageURI}`}
  alt={`Character ${characterNFT.name}`}
/>
```

### 🧙‍♂️ テストを作成・実行する

ここまでの作業でコントラクトには基本機能として以下の機能が追加されました。

- ボスを含めた複数のキャラクターに性質を持たせ、NFTとしてmintする機能
- ボスに攻撃をする機能
- ボスまたは他のキャラクターのhpが無くなった場合は攻撃ができなくなる機能

これらの基本機能をテストスクリプトとして記述していきましょう。

ではpackages/contract/testに`test.js`という名前でファイルを作成して、以下のように記述してください。

```javascript
const hre = require("hardhat");
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("MyEpicGame", () => {
  // テストで使用するキャラクターの情報を定義
  const characters = [
    {
      name: "ZORO",
      imageURI: "QmXxR67ryeUw4xppPLbF2vJmfj1TCGgzANfiEZPzByM5CT",
      hp: 100,
      maxHp: 100,
      attackDamage: 100,
    },
    {
      name: "NAMI",
      imageURI: "QmPHX1R4QgvGQrZym5dpWzzopavyNX2WZaVGYzVQQ2QcQL",
      hp: 50,
      maxHp: 50,
      attackDamage: 50,
    },
    {
      name: "USOPP",
      imageURI: "QmUGjB7oQLBZdCDNJp9V9ZdjsBECjwcneRhE7bHcs9HwxG",
      hp: 300,
      maxHp: 300,
      attackDamage: 25,
    },
  ];
  // テストで使用するボスの情報を定義
  const bigBoss = {
    name: "CROCODILE",
    imageURI: "https://i.imgur.com/BehawOh.png",
    hp: 100,
    maxHp: 100,
    attackDamage: 50,
  };

  async function deployTextFixture() {
    const gameContractFactory = await hre.ethers.getContractFactory(
      "MyEpicGame"
    );

    // Hardhat がローカルの Ethereum ネットワークを、コントラクトのためだけに作成
    const gameContract = await gameContractFactory.deploy(
      // キャラクターの名前
      [characters[0].name, characters[1].name, characters[2].name],
      // キャラクターの画像を IPFS の CID に変更
      [characters[0].imageURI, characters[1].imageURI, characters[2].imageURI],
      [characters[0].hp, characters[1].hp, characters[2].hp],
      [
        characters[0].attackDamage,
        characters[1].attackDamage,
        characters[2].attackDamage,
      ],
      bigBoss.name, // Bossの名前
      bigBoss.imageURI, // Bossの画像
      bigBoss.hp, // Bossのhp
      bigBoss.attackDamage // Bossの攻撃力
    );
    await gameContract.deployed();

    return {
      gameContract,
      characters,
      bigBoss,
    };
  }

  it("check if the characters are deployed correctly", async () => {
    const { gameContract, characters } = await loadFixture(deployTextFixture);

    const savedCharacters = await gameContract.getAllDefaultCharacters();

    // デプロイ時に指定したキャラクターの情報が保存されているかを確認
    expect(savedCharacters.length).to.equal(characters.length);

    for (let i = 0; i < savedCharacters.length; i++) {
      expect(savedCharacters[i].name).to.equal(characters[i].name);
      expect(savedCharacters[i].imageURI).to.equal(characters[i].imageURI);
      expect(savedCharacters[i].hp.toNumber()).to.equal(characters[i].hp);
      expect(savedCharacters[i].maxHp.toNumber()).to.equal(characters[i].maxHp);
      expect(savedCharacters[i].attackDamage.toNumber()).to.equal(
        characters[i].attackDamage
      );
    }
  });

  it("check if the big boss is deployed correctly", async () => {
    const { gameContract, bigBoss } = await loadFixture(deployTextFixture);

    const savedBigBoss = await gameContract.getBigBoss();

    // デプロイ時に指定したボスの情報が保存されているかを確認
    expect(savedBigBoss.name).to.equal(bigBoss.name);
    expect(savedBigBoss.imageURI).to.equal(bigBoss.imageURI);
    expect(savedBigBoss.hp.toNumber()).to.equal(bigBoss.hp);
    expect(savedBigBoss.maxHp.toNumber()).to.equal(bigBoss.maxHp);
    expect(savedBigBoss.attackDamage.toNumber()).to.equal(bigBoss.attackDamage);
  });

  it("attack was successful", async () => {
    const { gameContract } = await loadFixture(deployTextFixture);

    // 3体のNFTキャラクターの中から、3番目のキャラクターを Mint する
    let txn = await gameContract.mintCharacterNFT(2);

    // Minting が仮想マイナーにより、承認されるのを待つ
    await txn.wait();

    // mintしたNFTにおける、攻撃前と後のhpを取得する
    let hpBefore = 0;
    let hpAfter = 0;
    // NFTの情報を得る
    // かつきちんとMintがされているかを確認
    let NFTInfo = await gameContract.checkIfUserHasNFT();
    hpBefore = NFTInfo.hp.toNumber();

    // 1回目の攻撃: attackBoss 関数を追加
    txn = await gameContract.attackBoss();
    await txn.wait();

    NFTInfo = await gameContract.checkIfUserHasNFT();
    hpAfter = NFTInfo.hp.toNumber();

    expect(hpBefore - hpAfter).to.equal(50);
  });

  // ボスのHPがなくなった時に、ボスへの攻撃ができないことを確認
  it("check boss attack does not happen if boss hp is smaller than 0", async () => {
    const { gameContract } = await loadFixture(deployTextFixture);

    // 3体のNFTキャラクターの中から、1番目のキャラクターを Mint する
    let txn = await gameContract.mintCharacterNFT(0);

    // Minting が仮想マイナーにより、承認されるのを待つ
    await txn.wait();

    // 1回目の攻撃: attackBoss 関数を追加
    txn = await gameContract.attackBoss();
    await txn.wait();

    // 2回目の攻撃: attackBoss 関数を追加
    // ボスのhpがなくなった時に、エラーが発生することを確認
    expect(gameContract.attackBoss()).to.be.revertedWith(
      "Error: boss must have HP to attack characters."
    );
  });

  // キャラクターのHPがなくなった時に、ボスへの攻撃ができないことを確認
  it("check boss attack does not happen if character hp is smaller than 0", async () => {
    const { gameContract } = await loadFixture(deployTextFixture);

    // 3体のNFTキャラクターの中から、2番目のキャラクターを Mint する
    let txn = await gameContract.mintCharacterNFT(1);

    // Minting が仮想マイナーにより、承認されるのを待つ
    await txn.wait();

    // 1回目の攻撃: attackBoss 関数を追加
    txn = await gameContract.attackBoss();
    await txn.wait();

    // 2回目の攻撃: attackBoss 関数を追加
    // キャラクターのhpがなくなった時に、エラーが発生することを確認
    expect(gameContract.attackBoss()).to.be.revertedWith(
      "Error: character must have HP to attack boss."
    );
  });
});
```

次に、MyEpicGameコントラクト内に定義していた`console.log`を削除しましょう。テストスクリプトを作成することにより、目視で結果を確認する必要がなくなります。

`import`文を削除します。

```solidity
// === 下記を削除 ===
import 'hardhat/console.sol';
```

constructor内の`bigBoss`をログ出力している箇所を削除します。

```solidity
    // === 下記を削除 ===
    console.log(
      'Done initializing boss %s w/ HP %s, img %s',
      bigBoss.name,
      bigBoss.hp,
      bigBoss.imageURI
    );
```

constructor内の`character`変数と`defaultCharacters`をログ出力している箇所を削除します。

```solidity
      // === 下記を削除 ===
      CharacterAttributes memory character = defaultCharacters[i];

      //  ハードハットのconsole.log()では、任意の順番で最大4つのパラメータを指定できます。
      // 使用できるパラメータの種類: uint, string, bool, address
      console.log(
        'Done initializing %s w/ HP %s, img %s',
        character.name,
        character.hp,
        character.imageURI
      );
```

`mintCharacterNFT`関数内のログ出力を削除します。

```solidity
    // === 下記を削除 ===
    console.log(
      'Minted NFT w/ tokenId %s and characterIndex %s',
      newItemId,
      _characterIndex
    );
```

`attackBoss`関数内の4つのログ出力を削除します。

```solidity
    // === 下記を削除 ===
    console.log(
      '\nPlayer w/ character %s about to attack. Has %s HP and %s AD',
      player.name,
      player.hp,
      player.attackDamage
    );
    console.log(
      'Boss %s has %s HP and %s AD',
      bigBoss.name,
      bigBoss.hp,
      bigBoss.attackDamage
    );

    // ...

    // === 下記を削除 ===
    // プレイヤーの攻撃をターミナルに出力する。
    console.log('Player attacked boss. New boss hp: %s', bigBoss.hp);
    // ボスの攻撃をターミナルに出力する。
    console.log('Boss attacked player. New player hp: %s\n', player.hp);
```

では下のコマンドを実行することでコントラクトのテストをしていきましょう！

```
yarn test
```

下のような結果がでいれば成功です！

```
Compiled 1 Solidity file successfully


  MyEpicGame
    ✔ check if the characters are deployed correctly (1031ms)
    ✔ check if the big boss is deployed correctly
    ✔ attack was successful (41ms)
    ✔ check boss attack does not happen if boss hp is smaller than 0
    ✔ check boss attack does not happen if character hp is smaller than 0


  5 passing (1s)

```

### 🤩 Web アプリケーションをアップグレードする

これであなたのWebアプリケーション完成です!

ここからは、Webアプリケーションを好きにアップグレードしていきましょう。

**🐸: ゲーム内に複数のプレイヤーを表示する**

- 現在、ゲーム上で表示されるのは、あなたのNFTキャラクターとボスだけです。

- マルチプレイヤーの仕様を実装してみるのはいかがでしょうか？

- コントラクトを変更するために必要なすべての情報と、マルチプレイヤーを実現するための基盤はすでにあなたの手の中にあります。

- コントラクトに、`getAllPlayers`関数を作成し、それをWebアプリケーションから呼び出してみましょう。

- データをレンダリングする方法もあなたにお任せします。

**🐣: Twitter アカウントを Web アプリケーションに連携する**

`App.js`の下記をあなたのTwitterハンドルに更新しましょう。

```javascript
const TWITTER_HANDLE = "あなたのTwitterハンドル";
```

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#ethereum`で質問してください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンに進んで、WebアプリケーションをVercelにデプロイしましょう 🎉

### 🤔 NFT とは何か？

NFTの概要については、[こちら](https://www.bridge-salon.jp/toushi/nft/#back) をご覧ください。

一般的にNFTが何であるかが理解できたら、次のステップに進みましょう。

### 🌱 Mint とは何か？

NFTにおける「Mint（ミント）」とは、スマートコントラクトを用いて、NFTを新らしく作成・発行することを意味します。

### 🎰 ゲームで遊べる NFT を作る

このプロジェクトでは、**プレイヤーが協力して、ボスを倒すゲーム**を作成していきます。

ゲームの内容は以下のようになります。

- ゲームが始まると、プレイヤーは、一定の攻撃力**と HP** を持つ**キャラクター NFT** を発行します。

- プレイヤーは、その**キャラクター NFT** にボスを攻撃するよう命令し、ボスにダメージを与えます。

- しかし、ボスのHPは、100万ですので、一人のプレイヤーの攻撃でボスを倒すのは不可能です。

- したがって、このゲームでは、プレイヤーは協力してボスを倒す必要があります。ボスのHPが0になれば、プレイヤーの勝利です。

- プレイヤーがボスを攻撃するたびに、ボスもプレイヤーを攻撃してきます。

- プレイヤーのNFTキャラクターのHPが0になると、そのキャラクターは**死亡**し、ボスを攻撃できなくなります。

- プレイヤーはウォレットの中に1つのキャラクターのNFTしか持つことができません。

- つまり、**複数のプレイヤーが力を合わせてボスを攻撃し、ボスを倒す必要があります。**

ここで知っておくべき重要なことは、キャラクターそのものが **NFT** であるということです。

ゲームの中では、以下のようなフローが必要になります。

1. プレイヤーは、ゲームを開始する際に、Webアプリケーションにウォレットを接続します。
2. Webアプリケーションは、プレイヤーがウォレットにキャラクター NFTをまだ持っていないことを検知します。
3. プレイヤーに、キャラクターを選んでもらい、自分のキャラクター NFTをMintしてゲームを開始してもらいます。
   - 各キャラクター NFTは、NFTに保存された独自の属性（HP、攻撃ダメージ、キャラクターのイメージなど）を持っています。
   - HPが0になると`hp: 0`と表示されます。

**これは、世界で最も人気のある NFT ゲームのしくみです。** これから、このしくみをゼロから構築していきます!

### ✨ NFT データをセットアップする

それでは、キャラクター NFTをセットアップしていきましょう。

各キャラクターに、画像、名前、HP値、攻撃ダメージ値の属性を付与していきます。

キャラクターのNFTは、決まった数（例：3体）だけ存在することになります。

**各キャラクターの NFT は無制限に Mint できます。**

- 最初のポケモンを選ぶ作業を想像してください。

- ポケモンでは、ゲームを開始する際に、火のポケモン、水のポケモン、草のポケモンの3体から一匹、旅をともにするキャラクターを選びます。

- 複数のプレイヤーが同じ種類のNFTキャラクターをMintした場合、彼らは同じキャラクター NFTを持つことになりますが、プレイヤー各々が、固有のNFTを持つので、**各 NFT キャラクターは独自の状態を保持します。**

- つまり、あるプレイヤーのNFTキャラクターが攻撃を受けてHPを失ったとしても、ほかのプレイヤーのNFTキャラクターに影響はありません。

これから、NFTキャラクターの**デフォルト属性**（デフォルトHP、デフォルト攻撃力、デフォルト画像など）を初期化していきます。

- たとえば、「ピカチュウ」という名前のキャラクターがいた場合、ピカチュウのデフォルトHP、デフォルト攻撃力などを設定します。

それでは、`MyEpicGame.sol`を以下のように更新しましょう。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "hardhat/console.sol";
contract MyEpicGame {
  // キャラクターのデータを格納する CharacterAttributes 型の 構造体（`struct`）を作成しています。
  struct CharacterAttributes {
    uint characterIndex;
    string name;
    string imageURI;
    uint hp;
    uint maxHp;
    uint attackDamage;
  }
  // キャラクターのデフォルトデータを保持するための配列 defaultCharacters を作成します。それぞれの配列は、CharacterAttributes 型です。
  CharacterAttributes[] defaultCharacters;
  constructor(
	// プレイヤーが新しく NFT キャラクターを Mint する際に、キャラクターを初期化するために渡されるデータを設定しています。これらの値は フロントエンド（js ファイル）から渡されます。
    string[] memory characterNames,
    string[] memory characterImageURIs,
    uint[] memory characterHp,
    uint[] memory characterAttackDmg
  )
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

	  // hardhat の console.log() では、任意の順番で最大4つのパラメータを指定できます。
	  // 使用できるパラメータの種類: uint, string, bool, address
      console.log("Done initializing %s w/ HP %s, img %s", character.name, character.hp, character.imageURI);
    }
  }
}
```

ここでは、`constructor`に複数の値を渡して、キャラクターをセットアップしています。

この処理により、プレイヤーがNFTキャラクターを発行する際、そのキャラクターにデフォルトHP、デフォルト攻撃力、デフォルト画像などのデータを付与できます。

それでは、一行ずつコードの理解を深めましょう。

```solidity
struct CharacterAttributes {
  uint characterIndex;
  string name;
  string imageURI;
  uint hp;
  uint maxHp;
  uint attackDamage;
}
```

ここでは、キャラクターのデータを格納する`CharacterAttributes`型の構造体(`struct`)を定義しています。

`CharacterAttributes`には、下記の属性情報が格納されます。

```solidity
uint characterIndex; // キャラクターID（1番、2番.. N番）
string name; // キャラクターの名前
string imageURI; // キャラクターの画像情報
uint hp; // キャラクターの現在のHP
uint maxHp; // キャラクターの最大HP
uint attackDamage; // キャラクターの攻撃力
```

次に、下記のコードを見ていきましょう。

```solidity
CharacterAttributes[] defaultCharacters;
```

ここでは、キャラクターのデフォルトデータを保持するための配列`defaultCharacters`を作成しています。

`defaultCharacters`配列は、`CharacterAttributes`型ですので、キャラクターそれぞれに、`characterIndex`から`attackDamage`までの6種類の情報が付与されます。

次に下記のコードを見ていきましょう。

```solidity
constructor(
	string[] memory characterNames,
	string[] memory characterImageURIs,
	uint[] memory characterHp,
	uint[] memory characterAttackDmg
)
```

**`constructor`は、コントラクトが呼び出されるに、一度だけ実行されます。**

今回のプロジェクトでは、プレイヤーがNFTキャラクターを新しくMintする際に、コントラクトが呼び出されます。

上記の処理では、新しくNFTキャラクターがMintされる際に、キャラクターを初期化するために渡されるデータ（＝デフォルト属性）のセットアップを行っています。

- デフォルトデータは、`characterNames`から`characterAttackDmg`の4種類ですので、ここで定義しています。

最後に、次のコードを見ていきましょう。

```solidity
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
	console.log("Done initializing %s w/ HP %s, img %s", character.name, character.hp, character.imageURI);
}
```

`constructor`が実行されると、上記のループ処理が実行されます。

ここでは、ゲームに登場するすべてのキャラクターをループ処理で呼び出し、それぞれのキャラクターのデフォルト値をコントラクトに保存しています。

この処理によって、プログラムは、各キャラクターにアクセスできます。

- たとえば、`defaultCharacters[0]`と実行するだけで、1番目のキャラクターのデフォルト属性に簡単にアクセスできます。

- キャラクターは最初無傷ですので、`hp` ＝ `maxHp` = `characterHp[i]`となっています。

### ⭐️ テストを実行する

`MyEpicGame.sol`を更新したので、テストを行っていきます。

テスト用のスクリプト`run.js`を下記のように更新していきましょう。

```javascript
const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");
  const gameContract = await gameContractFactory.deploy(
    ["ZORO", "NAMI", "USOPP"], // キャラクターの名前
    [
      "https://i.imgur.com/TZEhCTX.png", // キャラクターの画像
      "https://i.imgur.com/WVAaMPA.png",
      "https://i.imgur.com/pCMZeiM.png",
    ],
    [100, 200, 300], // キャラクターのHP
    [100, 50, 25] // キャラクターの攻撃力
  );
  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);
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

ここでは、3体のキャラクターとその基本情報を定義しています。

- キャラクターは、ワンピースのゾロ、ナミ、ウソップを用意しました。
- 各キャラクターには、ID、名前、画像、HP、攻撃力の情報が付与されます。

**上記の`gameContractFactory.deploy()`の中に格納されている情報が、`MyEpicGame.sol`の`constructor`に渡されます。**

```solidity
// 例：["ZORO", "NAMI", "USOPP"] = キャラクターの名前 が `characterNames` 配列に渡されます。
string[] memory characterNames,
string[] memory characterImageURIs,
uint[] memory characterHp,
uint[] memory characterAttackDmg
```

[Imgur](https://imgur.com/) に画像をアップロードすれば、あなたの好きなキャラクターを設定できます!

> サンプルで使用しているワンピースの素材は、[こちら](https://www.irasutoya.com/2021/01/onepiece.html) から取得しています。※ 集英社様の許可を得て掲載しているイラストです。作品のイメージを傷つけないよう注意してご利用ください。

ぜひ、`run.js`の中の`https://i.imgur.com/...`の画像のリンクをあなたのオリジナルの画像に差し替えてください 😊

```javascript
["ZORO", "NAMI", "USOPP"], // キャラクターの名前
["https://i.imgur.com/TZEhCTX.png",  // キャラクターの画像
 "https://i.imgur.com/WVAaMPA.png",
 "https://i.imgur.com/pCMZeiM.png"],
```

それでは、ターミナル上で下記を実行してみましょう。

```
yarn contract run:script
```

ターミナル上で`console.log`の中身とコントラクトアドレスが表示されていることを確認してください。

例)ターミナル上でのアウトプット:

```
Compiling 1 file with 0.8.17
Solidity compilation finished successfully
Done initializing ZORO w/ HP 100, img https://i.imgur.com/TZEhCTX.png
Done initializing NAMI w/ HP 200, img https://i.imgur.com/WVAaMPA.png
Done initializing USOPP w/ HP 300, img https://i.imgur.com/pCMZeiM.png
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

上記のようなアウトプットターミナルに表示されていればテストは成功です。

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

テストの出力が完了したら次のレッスンに進んでください 🎉

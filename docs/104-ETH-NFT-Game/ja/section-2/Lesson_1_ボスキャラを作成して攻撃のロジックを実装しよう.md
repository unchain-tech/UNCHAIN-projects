### 😈 ボスを作る

これから、ゲーム内のボス作成していきます。

このゲームのゴールは、**ボスを攻撃して、ボスの HP を 0 にすることです。**

- ボスの HP は多く、ボスを攻撃するたびに反撃されるので、NFT キャラクターの HP は減ってしまいます。

- NFT キャラクターの HP が 0 になると、ボスを攻撃できなくなり、ゲームオーバーとなります。

- したがって、ボスを攻撃するためにはほかのプレイヤーが必要です。

- まず、ボスのデータを格納するための構造体を作り、キャラクターと同じようにデータを初期化しましょう。

- ボスは、名前、画像、攻撃力、HP を持っています。

**ボスは NFT ではありません。**

ボスのデータはスマートコントラクトに保存されるだけです。

次のコードを `MyEpicGame.sol` の `struct CharacterAttributes` コードブロックの直下に追加しましょう。

```solidity
// MyEpicGame.sol
struct BigBoss {
  string name;
  string imageURI;
  uint hp;
  uint maxHp;
  uint attackDamage;
}
BigBoss public bigBoss;
```

ここでは、ボスのデータを整理して保持するための構造体と、ボスを保持するための変数 `bigBoss` を作成しています。

次に、ボスを初期化するために、下記のように `MyEpicGame.sol` を更新していきましょう。

- `constructor` の中身に下記を追加していきます。

```solidity
// MyEpicGame.sol
constructor(
  string[] memory characterNames,
  string[] memory characterImageURIs,
  uint[] memory characterHp,
  uint[] memory characterAttackDmg,
  // これらの新しい変数は、run.js や deploy.js を介して渡されます。
  string memory bossName,
  string memory bossImageURI,
  uint bossHp,
  uint bossAttackDamage
)
  ERC721("OnePiece", "ONEPIECE")
{
  // ボスを初期化します。ボスの情報をグローバル状態変数 "bigBoss"に保存します。
  bigBoss = BigBoss({
    name: bossName,
    imageURI: bossImageURI,
    hp: bossHp,
    maxHp: bossHp,
    attackDamage: bossAttackDamage
  });
  console.log("Done initializing boss %s w/ HP %s, img %s", bigBoss.name, bigBoss.hp, bigBoss.imageURI);
```

最後に、`run.js` と `deploy.js` を変更して、ボスに渡すパラメータを変更しましょう。

```javascript
// run.js, deploy.js
const gameContract = await gameContractFactory.deploy(
  ["ZORO", "NAMI", "USOPP"], // キャラクターの名前
  [
    "https://i.imgur.com/TZEhCTX.png", // キャラクターの画像
    "https://i.imgur.com/WVAaMPA.png",
    "https://i.imgur.com/pCMZeiM.png",
  ],
  [100, 200, 300],
  [100, 50, 25],
  "CROCODILE", // Bossの名前
  "https://i.imgur.com/BehawOh.png", // Bossの画像
  10000, // Bossのhp
  50 // Bossの攻撃力
);
```

ボスには、クロコダイルの画像を設定しました。

今回のゲームでは、ワンピースのサンプル画像を使用していますが、ぜひオリジナルキャラクターを選んであなただけのゲームを作成してみてください ✨

[Imgur](https://imgur.com/) を使用して、あなたのボスをセットアップしてください!

あなただけのオリジナルゲームを作りましょう ✨

### 👾 プレイヤーの NFT キャラクターの属性を取得する。

これから `attackBoss` という関数を作成して、`MyEpicGame.sol` に追加していきましょう。

- `mintCharacterNFT` 関数のコードブロック直下に下記を追加してください。

```solidity
// MyEpicGame.sol
function attackBoss() public {
	// 1. プレイヤーのNFTの状態を取得します。
	uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
	CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];
	console.log("\nPlayer w/ character %s about to attack. Has %s HP and %s AD", player.name, player.hp, player.attackDamage);
	console.log("Boss %s has %s HP and %s AD", bigBoss.name, bigBoss.hp, bigBoss.attackDamage);

	// 2. プレイヤーのHPが0以上であることを確認する。
	require (
		player.hp > 0,
		"Error: character must have HP to attack boss."
	);
	// 3. ボスのHPが0以上であることを確認する。
	require (
		bigBoss.hp > 0,
		"Error: boss must have HP to attack characters."
	);

	// 4. プレイヤーがボスを攻撃できるようにする。
	if (bigBoss.hp < player.attackDamage) {
		bigBoss.hp = 0;
	} else {
		bigBoss.hp = bigBoss.hp - player.attackDamage;
	}
	// 5. ボスがプレイヤーを攻撃できるようにする。
	if (player.hp < bigBoss.attackDamage) {
		player.hp = 0;
	} else {
		player.hp = player.hp - bigBoss.attackDamage;
	}

	// プレイヤーの攻撃をターミナルに出力する。
	console.log("Player attacked boss. New boss hp: %s", bigBoss.hp);
	// ボスの攻撃をターミナルに出力する。
	console.log("Boss attacked player. New player hp: %s\n", player.hp);
}
```

追加したコードを、5 つの段階に分けて見ていきましょう。

**1️⃣ \. プレイヤーの NFT の状態を取得する**

まず、**プレイヤーの NFT キャラクターの状態を取得していきます。**

プレイヤーの NFT キャラクターの状態に関するデータは `nftHolderAttributes` に格納されています。

以前記述した下記のコードを覚えているでしょうか？

```solidity
// MyEpicGame.sol

// ユーザーのアドレスと NFT の tokenId を紐づける mapping を作成しています。
mapping(address => uint256) public nftHolders;

// ユーザーの tokenId を取得します。
uint256 newItemId = _tokenIds.current();

// NFTの所有者を簡単に確認できるようにします。
nftHolders[msg.sender] = newItemId;
```

これらの処理により、`nftHolders` からユーザーの `tokenId` を取得できるようになりました。

下記のコードブロックでは、`nftHolders` を使用しています。詳しく見ていきましょう。

```solidity
// MyEpicGame.sol
function attackBoss() public {
  // 1. プレイヤーのNFTの状態を取得します。
  uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
  CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];
  console.log("\nPlayer w/ character %s about to attack. Has %s HP and %s AD", player.name, player.hp, player.attackDamage);
  console.log("Boss %s has %s HP and %s AD", bigBoss.name, bigBoss.hp, bigBoss.attackDamage);
}
```

まず、下記のコードに注目してください。

```solidity
// MyEpicGame.sol
uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
```

ここでは、`nftHolders[msg.sender]` を使って、プレイヤーが所有する NFT の `tokenId` を取得し、`nftTokenIdOfPlayer` に格納しています。

たとえば、コレクションの 3 番目の NFT を Mint した場合、`nftHolders[msg.sender]` は `3` となります!

次に、下記のコードを見ていきましょう。

```solidity
// MyEpicGame.sol
CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];
```

ここでは、`nftHolderAttributes[nftTokenIdOfPlayer]` を使ってプレイヤーの属性を取得しています。

> ✍️: `storage` と `memory` について
> ここでは `storage` というデータを保存する際に使用するキーワードを使っています。
>
> 一般的に、`storage` はブロックチェーンにデータを保存するときに使用されるキーワードです。
>
> 一方、`memory` はコントラクト実行時に一時的にデータを保持するときに使用されます。
>
> 例えば、`storage` と記載してから、`player.hp = 0` とすると、ブロックチェーン上で **NFT キャラクターの HP 値** を `0` に変更することになります。
>
> これに対して、もし `storage` の代わりに `memory` を使用すると、関数のスコープ内に変数のローカルコピーが作成されます。
>
> `memory` を使用すれば、`player.hp = 0` とした場合でも、それは関数の中だけのことであり、ブロックチェーン上のデータが更新されることはありません。
>
> `storage` と `memory` に関する詳しい説明は、[こちら](https://tomokazu-kozuma.com/what-is-storage-and-memory-in-solidity/) を参照してください。

最後に、下記のコードを見ていきましょう。

```solidity
// MyEpicGame.sol
console.log(
  "\nPlayer w/ character %s about to attack. Has %s HP and %s AD",
  player.name,
  player.hp,
  player.attackDamage
);
console.log(
  "Boss %s has %s HP and %s AD",
  bigBoss.name,
  bigBoss.hp,
  bigBoss.attackDamage
);
```

ここでは、下記をターミナルに出力しています。

- 攻撃を開始する NFT キャラクターの名前（`player.name`）、HP 値（`player.hp`）、攻撃力（`player.attackDamage`）をターミナルに出力しています。
- ボスの名前（`bigBoss.name`）、HP 値（`bigBoss.hp`）、攻撃力（`bigBoss.attackDamage`）をターミナルに出力しています。

**2️⃣ \. プレイヤーの HP が 0 以上であることを確認する**

次に、**プレイヤーの HP が 0 以上であることを確認していきます。**

```solidity
// MyEpicGame.sol
// 2. プレイヤーのHPが0以上であることを確認する。
require(player.hp > 0, "Error: character must have HP to attack boss.");
```

ここでは、`require` 関数を使用して、`player.hp > 0` であることを確認しています。

NFT キャラクターの HP が 0 である場合は、攻撃できません。

`require` は `if` 文のような役割を果たします。ロジックは、下記のようになります。

```plaintext
require(
	player.hp > 0 であれば（true）、コードを進める,
	player.hp > 0 でなければ Error を出力し(false)
	、処理実行前のコントラクトの状態に戻す
);
```

**3️⃣ \. ボスの HP が 0 以上であることを確認する**

ステップ 2 と同じように、**ボスの HP も 0 以上であることを確認していきます。**

```solidity
// MyEpicGame.sol
// 3. ボスのHPが0以上であることを確認する。
require(bigBoss.hp > 0, "Error: boss must have HP to attack boss.");
```

ボスの HP が 0 の場合、NFT キャラクターはボスをこれ以上攻撃することはできません。

> ⚠️: 注意
>
> VS Code を使用している場合、`"Function state mutability can be restricted to view"` という `warning` が表示されることがあります。
>
> ここでの `warning` は基本的に無視して大丈夫です 😊

**4️⃣ \. プレイヤーがボスを攻撃できるようにする**

次に、**プレイヤーがボスを攻撃するターンを実装していきます。**

```solidity
// MyEpicGame.sol
// 4. プレイヤーがボスを攻撃できるようにする。
if (bigBoss.hp < player.attackDamage) {
  bigBoss.hp = 0;
} else {
  bigBoss.hp = bigBoss.hp - player.attackDamage;
}
```

`if` / `else` 文のロジックは、下記のようになります。

- `if` : もし、ボスの HP（`bigBoss.hp`）が NFT キャラクターの攻撃力（`player.attackDamage`）を下回っていたら、ボスの HP を `0` に設定します。

- `else` : もし、ボスの HP（`bigBoss.hp`）が、NFT キャラクターの攻撃力（`player.attackDamage`）を上回っていたら、ボスの HP を「現在のボスの HP」から「NFT キャラクターの攻撃力」を差し引いた値に更新します。

> ✍️: `uint` について
> ここで使用されている変数（`bigBoss.hp` と `player.attackDamage`）は、`constructor` の中で `uint` として定義されています。
>
> `uint` とは、符号なし整数を意味しており、負の値をとることはできません。
>
> なので、ボスの HP（ `bigBoss.hp` ）が NFT キャラクターの攻撃力 （ `player.attackDamage` ）を下回っている場合、`bigBoss.hp = 0` と直接値を更新しています。
>
> 変数を定義する際に、負の数をとることができる `int` を使用すると、エラーが発生することがあるので、注意しましょう。
>
> OpenZeppelin や Hardhat は、ライブラリの中で `int` をサポートしていません。
> 例えば、`MyEpicGame.sol` の中で `Strings.toString` を使用していますが、これは `uint` で定義されている変数にのみ動作します。
>
> また、`console.log` も `int` に対応していません。

**5️⃣ \. ボスがプレイヤーを攻撃できるようにする**

```solidity
// MyEpicGame.sol
// 5. ボスがプレイヤーを攻撃できるようにする。
if (player.hp < bigBoss.attackDamage) {
  player.hp = 0;
} else {
  player.hp = player.hp - bigBoss.attackDamage;
}
```

ここでは、ステップ 4 と同じ容量で、ボスがプレイヤーを攻撃する際のロジックを実装しています。

最後に、下記のコードを見ていきましょう。

```solidity
// MyEpicGame.sol
// プレイヤーの攻撃をターミナルに出力する。
console.log("Player attacked boss. New boss hp: %s", bigBoss.hp);
// ボスの攻撃をターミナルに出力する。
console.log("Boss attacked player. New player hp: %s\n", player.hp);
```

ここでは、プレイヤーとボスの攻撃をターミナルに出力し、それぞれの現在の HP を表示しています。

### 🦖 テストを実行する

`run.js` に下記を追加して、`attackBoss` 関数のテストをしてみましょう。

- `attackBoss` 関数のコードブロックを 2 回 `txn = await gameContract.mintCharacterNFT(2)` の直下に追加します。

```javascript
// run.js
let txn;
txn = await gameContract.mintCharacterNFT(2);
await txn.wait();

// 1回目の攻撃: attackBoss 関数を追加
txn = await gameContract.attackBoss();
await txn.wait();

// 2回目の攻撃: attackBoss 関数を追加
txn = await gameContract.attackBoss();
await txn.wait();
```

コードを詳しく見ていきましょう。

```javascript
// run.js
txn = await gameContract.mintCharacterNFT(2);
await txn.wait();
```

ここではまず、インデックス `2` のキャラクターを作成しています。

これは `constructor` に渡される配列の 3 番目のキャラクターです。

- 私のゲームの場合、3 番目のキャラクターは「ウソップ」です。

- ゲーム内で「ウソップ」が「クロコダイル」を攻撃します。

- 「ウソップ」は `run.js` を起動した際に、最初に Mint されるキャラクターですので、NFT の ID ( `tokenId` ) は、自動的に `1` になります。

  > ⚠️: 通常 `_tokenIds` は 0 で始まりますが、`constructor` 内で `1` にインクリメントされるため、`tokenId` は `1` から始まります。

次に、下記のコードを見ていきましょう。

```javascript
// run.js
// 1回目の攻撃: attackBoss 関数を追加
txn = await gameContract.attackBoss();
await txn.wait();

// 2回目の攻撃: attackBoss 関数を追加
txn = await gameContract.attackBoss();
await txn.wait();
```

ここでは、`attackBoss()` を 2 回実行しています。

それでは、`epic-game` ディレクトリ上で、下記を実行し、テストを行いましょう。

```bash
npx hardhat run scripts/run.js
```

下記のような結果が出力されていれば、テストは成功です。

```plaintext
Done initializing boss CROCODILE w/ HP 10000, img https://i.imgur.com/BehawOh.png
Done initializing ZORO w/ HP 100, img https://i.imgur.com/TZEhCTX.png
Done initializing NAMI w/ HP 200, img https://i.imgur.com/WVAaMPA.png
Done initializing USOPP w/ HP 300, img https://i.imgur.com/pCMZeiM.png
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Minted NFT w/ tokenId 1 and characterIndex 2

Player w/ character USOPP about to attack. Has 300 HP and 25 AD
Boss CROCODILE has 10000 HP and 50 AD
Player attacked boss. New boss hp: 9975
Boss attacked player. New player hp: 250


Player w/ character USOPP about to attack. Has 250 HP and 25 AD
Boss CROCODILE has 9975 HP and 50 AD
Player attacked boss. New boss hp: 9950
Boss attacked player. New player hp: 200

Token URI: data:application/json;base64,eyJuYW1lIjogIlpFTklHQU1FIC0tIE5GVCAjOiAxIiwgImRlc2NyaXB0aW9uIjogIlRoaXMgaXMgYW4gTkZUIHRoYXQgbGV0cyBwZW9wbGUgcGxheSBpbiB0aGUgZ2FtZSBNZXRhdmVyc2UgU2xheWVyISIsICJpbWFnZSI6ICJodHRwczovL2kuaW1ndXIuY29tL2tXMmROQ3MucG5nIiwgImF0dHJpYnV0ZXMiOiBbIHsgInRyYWl0X3R5cGUiOiAiSGVhbHRoIFBvaW50cyIsICJ2YWx1ZSI6IDIwMCwgIm1heF92YWx1ZSI6MzAwfSwgeyAidHJhaXRfdHlwZSI6ICJBdHRhY2sgRGFtYWdlIiwgInZhbHVlIjogMjV9IF19
```

1 回目の攻撃の結果を詳しく見ていきましょう。

```
Player w/ character USOPP about to attack. Has 300 HP and 25 AD
Boss CROCODILE has 10000 HP and 50 AD
Player attacked boss. New boss hp: 9975
Boss attacked player. New player hp: 250
```

ここでは、ウソップがクロコダイルを `25` の攻撃力（`AD`）で攻撃して、クロコダイルの HP が `10000` から `9975` になりました。

そして、クロコダイルはウソップに `50` の攻撃力（`AD`）で攻撃し、ウソップの HP は「300」から「250」に減少しました。

次に、2 回目の攻撃の結果を確認しましょう。

```
Player w/ character USOPP about to attack. Has 250 HP and 25 AD
Boss CROCODILE has 9975 HP and 50 AD
Player attacked boss. New boss hp: 9950
Boss attacked player. New player hp: 200
```

2 回目の攻撃では、キャラクターとボスの両方に更新された HP 値が使用されているのがわかります。

これで、`attackBoss` 関数は完成です ✨

ゲームのロジックが完全にブロックチェーンに保存されました。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#section-2` で質問してください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 3 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンに進んで、テストネットに更新したコントラクトをデプロイしましょう 🎉

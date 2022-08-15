### 🤝 フロントエンドと連携するための関数を作成する

これから、Web アプリケーションにゲームを構築していくので、コントラクトとフロントエンドを連携させるための関数を実装していきます。

- 下記で実装していく関数は、フロントエンドから呼び出すことを前提としています。

- したがって、今わからないことがあったとしても、フロントエンドのスクリプトを実装する段階では、それらはクリアになるはずです。

- まずは、`MyEpicGame.sol` を更新することをゴールに進んでいきましょう。

### ✅ ユーザーが NFT キャラクターを持っているか確認する

`checkIfUserHasNFT` 関数を作成していきます。

この関数の機能は下記の 2 つです。

- ユーザーがすでに NFT キャラクターを持っているかどうかを確認する。

- ユーザーのウォレットに NFT キャラクターがすでに存在する場合は、その属性を取得情報（HP など）を取得する。

下記の関数を `MyEpicGame.sol` に追加してください。

- `attackBoss` 関数のコードブロック直下がお勧めです。

```solidity
// MyEpicGame.sol
function checkIfUserHasNFT() public view returns (CharacterAttributes memory) {
	// ユーザーの tokenId を取得します。
	uint256 userNftTokenId = nftHolders[msg.sender];

	// ユーザーがすでにtokenIdを持っている場合、そのキャラクターの属性情報を返します。
	if (userNftTokenId > 0) {
		return nftHolderAttributes[userNftTokenId];
	}
	// それ以外の場合は、空文字を返します。
	else {
		CharacterAttributes memory emptyStruct;
		return emptyStruct;
	}
}
```

上記のコードを詳しく見ていきましょう。

```solidity
// MyEpicGame.sol
function checkIfUserHasNFT() public view returns (CharacterAttributes memory) {
	// ユーザーの tokenId を取得します。
	uint256 userNftTokenId = nftHolders[msg.sender];
	:
```

`checkIfUserHasNFT` 関数がフロントエンドから呼び出されると、`uint256 userNftTokenId = nftHolders[msg.sender];` を実行して、ユーザーがすでに NFT キャラクターを持っているかチェックします。

`userNftTokenId` には、Web アプリケーションにログインしたユーザーの `tokenId` が入ります。

次に、下記のコードを見ていきましょう。

```solidity
// MyEpicGame.sol
// ユーザーがすでにtokenIdを持っている場合、そのキャラクターの属性情報を返します。
if (userNftTokenId > 0) {
	return nftHolderAttributes[userNftTokenId];
}
// それ以外の場合は、空文字を返します。
else {
	CharacterAttributes memory emptyStruct;
	return emptyStruct;
}
```

`constructor` で `_tokenIds.increment()` を行っているので、`tokenId` の `0` 番を保持している人は存在しません。

よって、`userNftTokenId > 0` の場合、ユーザーは何かしらの `tokenId` を保持していることになります。

同時に、`nftHolders[msg.sender]` に新しいユーザーのアドレスが渡された場合は、デフォルト値である `0` が `userNftTokenId` に格納されます。

もし、ユーザーが NFT キャラクターをまだ持っていない場合は、`emptyStruct` が返されるので、そこに新しく NFT キャラクターの情報を格納していくことになります。

### 🎃 キャラクターを選ぶ

Web アプリケーションに、「キャラクター選択画面」を作成し、プレイヤーに Mint する NFT キャラクターを選んでもらいます。

そのための関数 `getAllDefaultCharacters` を `MyEpicGame.sol` の中に作成していきます。

- `checkIfUserHasNFT` 関数のコードブロック直下がお勧めです。

```solidity
// MyEpicGame.sol
function getAllDefaultCharacters() public view returns (CharacterAttributes[] memory) {
  return defaultCharacters;
}
```

これにより、Web アプリケーションから、3 体の NFT キャラクターのデフォルト情報が取得できます。

### 💀 フロントエンドからボスのデータを取得する

フロントエンドに、ボスの情報（HP、名前、画像など）を反映させる関数を作成します。

- `getAllDefaultCharacters` 関数のコードブロック直下がお勧めです。

```solidity
// MyEpicGame.sol
function getBigBoss() public view returns (BigBoss memory) {
  return bigBoss;
}
```

### 🧠 コントラクトにイベントを追加する

これから、[イベント](https://qiita.com/hakumai-iida/items/3da0252415ec24fe177b) をコントラクトに実装していきます。

イベントは [Webhooks](https://kintone-blog.cybozu.co.jp/developer/000283.html) のようなものです。

Solidity の `event` はバックエンドであるスマートコントラクトから、フロントエンドであるクライアントへメッセージを「発射（`emit`）」するために宣言されます。

- `event` / `emit` を使用することで、ブロックチェーン上で更新された情報が、フロントエンドに自動で反映されます。

- 次のレッスンで、`App.js` というフロントエンド用のスクリプトを作成し、Web アプリケーションがイベントを「キャッチ」するための実装を行います。

それでは、`mapping(address => uint256) public nftHolders` の直下に下記 2 つのイベントを宣言しましょう。

```solidity
// MyEpicGame.sol
// ユーザーが NFT を Mint したこと示すイベント
event CharacterNFTMinted(address sender, uint256 tokenId, uint256 characterIndex);
// ボスへの攻撃が完了したことを示すイベント
event AttackComplete(uint newBossHp, uint newPlayerHp);
```

**`event CharacterNFTMinted` は、ユーザーが NFT キャラクターを Mint し終えたときに発生します。**

- これにより、NFT キャラクターの Mint が完了したことをフロントエンドに通知できます。

**`event AttackComplete` は NFT キャラクターがボスを攻撃したときに発生します。**

- イベントによって、ボスの新しい HP（`newBossHp`）とプレイヤーの新しい HP（`newPlayerHp`）がそれぞれ返されます。

- `event AttackComplete` をフロントエンドでキャッチすることで、ページを再度読み込みすることなく、プレイヤーやボスの HP を動的に更新できます。

次に、`mintCharacterNFT` 関数の一番下 (`_tokenIds.increment();` の直下) に、次の行を追加していきましょう。

```solidity
// MyEpicGame.sol
// ユーザーが NFT を Mint したことをフロントエンドに伝えます。
emit CharacterNFTMinted(msg.sender, newItemId, _characterIndex);
```

それから、`attackBoss` 関数の一番下に次の行を追加しましょう。

```solidity
// MyEpicGame.sol
// ボスへの攻撃が完了したことをフロントエンドに伝えます。
emit AttackComplete(bigBoss.hp, player.hp);
```

`emit` は `event` の発射機能です。

これにより、フロントエンドで、イベントを受け取ることができます。

- フロントエンドでイベントを「キャッチ」する方法に関しては、次のレッスンで説明します 🚀

> ✍️: `event` / `emit` について補足
>
> `event` / `emit` を使用することで、ブロックチェーン上で更新された情報が、フロントエンドに表示されるようになります。

### ➡️ コントラクトを更新して、もう一度デプロイする

これで、Web アプリケーション内で使用する機能の準備ができました。

これから、コントラクトを再度テストネットにデプロイしていきます。

まず、下記のように、`deploy.js` を更新しましょう。

- フロントエンド用のスクリプトに `attackBoss()` 関数は実装していくので、`deploy.js` では排除しています。

```javascript
// deploy.js
const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");

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

それでは、ターミナルに向かい、下記を `epic-game` ディレクトリ上で実行していきましょう。

```
npx hardhat run scripts/deploy.js --network rinkeby
```

下記のような結果がターミナルに出力されたことを確認してください。

```
Compiling 1 file with 0.8.9
Solidity compilation finished successfully
Contract deployed to: 0xEC4D62E631c4FdC9c293772b3897C64A07874B06
```

> ⚠️: 注意
>
> 次のセクションで、コントラクトのアドレス（ `0x..` ）が必要なので、保存しておいてください。

上記のような結果が出れば、デプロイは成功です!

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#eth-nft-game` で質問してください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 3 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

これでセクション 2 は終了です!　おめでとうございます!

ぜひ、ターミナルの出力結果を `#eth-nft-game` に投稿してください 😊

コミュニティであなたの成功を祝いましょう 🎉

次のレッスンでは、Web アプリケーションを作り始めます!

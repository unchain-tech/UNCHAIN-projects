🏝 コントラクトをテストネットにデプロイする
----

これから、実際にコントラクトをテストネットにデプロイしていきます。

テストネットにデプロイすると、NFT をオンラインで見ることができるようになります。

🦊 Metamask をダウンロードする
-----------

次に、イーサリアムウォレットをダウンロードしましょう。

このプロジェクトでは Metamask を使用します。

- [こちら](https://metamask.io/download.html) からブラウザの拡張機能をダウンロードし、Metamask ウォレットをあなたのブラウザに設定します。

すでに別のウォレットをお持ちの場合でも、今回は Metamask を使用してください。

✍️: Metamask が必要な理由
> ユーザーが、スマートコントラクトを呼び出すとき、本人のイーサリアムアドレスと秘密鍵を備えたウォレットが必要となります。
> - これは、認証作業のようなものです。


💳 トランザクション
------------------
**イーサリアムネットワーク上でブロックチェーンに新しく情報を書き込むこと**を、**トランザクション**と呼びます。

ここまでのレッスンに登場した**トランザクション**は以下です。
- **新規にスマートコントラクトをイーサリアムネットワークにデプロイした**という情報をブロックチェーン上に書き込む。
- **ユーザーが NFT を Mint した**という情報をブロックチェーンに書き込む。

トランザクションにはマイナーの承認が必要なので、Alchemy を導入します。

Alchemy は、世界中のトランザクションを一元化し、マイナーの承認を促進するプラットフォームです。

[こちら](https://www.alchemy.com/) から Alchemy のアカウントを作成してください。

💎 Alchemyでネットワークを作成
------------------
Alchemyのアカウントを作成したら、`CREATE APP` ボタンを押してください。

![](/public/images/ETH-NFT-game/section-1/1_5_1.png)

次に、下記の項目を埋めていきます。下図を参考にしてください。

![](/public/images/ETH-NFT-game/section-1/1_5_2.png)

- `NAME`: プロジェクトの名前（例: `MyEpicGame` ）
- `DESCRIPTION`: プロジェクトの概要
- `ENVIRONMENT`: `Development` を選択。
- `CHAIN`: `Ethereum` を選択。
- `NETWORK`: `Rinkeby` を選択。

それから、作成した App の `VIEW DETAILS` をクリックします。

![](/public/images/ETH-NFT-game/section-1/1_5_3.png)

プロジェクトを開いたら、`VIEW KEY` ボタンをクリックします。

![](/public/images/ETH-NFT-game/section-1/1_5_4.png)

ポップアップが開くので、`HTTP` のリンクをコピーしてください。

これがあなたが本番環境のネットワークに接続する際に使用する `API Key` になります。

- **これは、後に何回か必要になるので、あなたのPC上のわかりやすいところに、メモとして残しておいてください。**

🐣 テストネットから始める
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

このセクションでは、コードを書きながら、これらのイベントについての理解を深めていきます。


🚰 偽の ETH を取得する
------------------------

今回は、`Rinkeby` というイーサリアム財団によって運営されているテストネットを使用します。

`Rinkeby` にコントラクトをデプロイし、コードのテストを行うために、偽の ETH を取得しましょう。ユーザーが偽の ETH を取得するために用意されたインフラは、「フォーセット（＝蛇口）」と呼ばれています。

フォーセットを使用する前に、あなたの MetaMask ウォレットを `Rinkeby Test Network` に設定してください。

✍️: Metamask で `Rinkeby Test Network` を設定する方法
> 1 \. Metamask ウォレットのネットワークトグルを開く。
>
>![](/public/images/ETH-NFT-game/section-1/1_5_5.png)

> 2 \. `Show/hide test networks` をクリック。
>
> ![](/public/images/ETH-NFT-game/section-1/1_5_6.png)

> 3 \. `Show test networks` を `ON` にする。
>
> ![](/public/images/ETH-NFT-game/section-1/1_5_7.png)

> 4 \. `Rinkeby Test Network` を選択する。
>
> ![](/public/images/ETH-NFT-game/section-1/1_5_8.png)

MetaMask ウォレットに `Rinkeby Test Network` が設定されたら、下記のリンクの中から条件に合うものを選んで、少量の偽 ETH を取得しましょう。

| WEBサイト|リンク| 偽ETHの取得額| 取得までにかかる時間|
| ---------------- | ------------------------------------- | --------------- | ------------ |
| MyCrypto         | https://app.mycrypto.com/faucet       | 0.01            | なし         |
| Buildspace       | https://buildspace-faucet.vercel.app/ | 0.025           | 1日           |
| Ethily           | https://ethily.io/rinkeby-faucet/     | 0.2             | 1週間           |
| Official Rinkeby | https://faucet.rinkeby.io/            | 3 / 7.5 / 18.75 | 8時間 / 1日 / 3日 |
| Chainlink        | https://faucets.chain.link/rinkeby    | 0.1             | なし         |


🚀 `deploy.js` ファイルを作成する
----

今までは、ローカル環境でスマートコントラクトのテストを行う際に、`run.js` スクリプトを使用してきました。

`epic-game/scripts` ディレクトリに、`deploy.js` を作成して、下記のコードを貼り付けましょう。

内容は、既存の `run.js` に、`mintCharacterNFT` 関数の呼び出しを追加しただけです。

```javascript
// deploy.js
const main = async () => {
	// これにより、`MyEpicGame` コントラクトがコンパイルされます。
    // コントラクトがコンパイルされたら、コントラクトを扱うために必要なファイルが artifacts ディレクトリの直下に生成されます。
	const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
	// Hardhat がローカルの Ethereum ネットワークを、コントラクトのためだけに作成します。
	const gameContract = await gameContractFactory.deploy(
		["FUSHIGIDANE", "HITOKAGE", "ZENIGAME"], // キャラクターの名前
		["https://i.imgur.com/IjX49Yf.png",      // キャラクターの画像
		"https://i.imgur.com/Xid5qaC.png",
		"https://i.imgur.com/kW2dNCs.png"],
		[100, 200, 300],                         // キャラクターのHP
		[100, 50, 25]                            // キャラクターの攻撃力
	);
	// ここでは、`nftGame` コントラクトが、
	// ローカルのブロックチェーンにデプロイされるまで待つ処理を行っています。
	const nftGame = await gameContract.deployed();

	console.log("Contract deployed to:", nftGame.address);

	/* ---- mintCharacterNFT関数を呼び出す ---- */
	// Mint 用に再代入可能な変数 txn を宣言
	let txn;
	// 3体のNFTキャラクターの中から、0番目のキャラクターを Mint しています。
	// キャラクターは、3体（0番, 1番, 2番）体のみ。
	txn = await gameContract.mintCharacterNFT(0);
	// Minting が仮想マイナーにより、承認されるのを待ちます。
	await txn.wait();
	console.log("Minted NFT #1");

	txn = await gameContract.mintCharacterNFT(1);
	await txn.wait();
	console.log("Minted NFT #2");

	txn = await gameContract.mintCharacterNFT(2);
	await txn.wait();
	console.log("Minted NFT #3");

	console.log("Done deploying and minting!");

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

📈 `hardhat.config.js` ファイルを編集する
---------------------------------

`hardhat.config.js` ファイルを変更する必要があります。

これは、スマートコントラクトプロジェクトのルートディレクトリにあります。

- 今回は、`epic-game` ディレクトリの直下に `hardhat.config.js` が存在するはずです。

例）`epic-game` で `ls` を実行した結果
```
yukis4san@Yukis-MacBook-Pro epic-game % ls
README.md			package-lock.json
artifacts			package.json
cache				scripts
contracts			test
hardhat.config.js
```

`hardhat.config.js` をVS Code で開いて、中身を編集していきます。
```javascript
// hardhat.config.js
require("@nomiclabs/hardhat-waffle");
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: "YOUR_ALCHEMY_API_URL",
      accounts: ["YOUR_PRIVATE_RINKEBY_ACCOUNT_KEY"],
    },
  },
};
```


1. \. `YOUR_ALCHEMY_API_URL`の取得

> `hardhat.config.js` の `YOUR_ALCHEMY_API_URL` の部分を先ほど取得した Alchemy の URL（ `HTTP` リンク） と入れ替えます。

2. \. `YOUR_PRIVATE_RINKEBY_ACCOUNT_KEY` の取得
> 1. お使いのブラウザから、Metamask プラグインをクリックして、ネットワークを `Rinkeby Test Network` に変更します。
> ![](/public/images/ETH-NFT-game/section-1/1_5_8.png)
>
> 2. それから、`Account details` を選択してください。
> ![](/public/images/ETH-NFT-game/section-1/1_5_9.png)
>
> 3. `Account details` から `Export Private Key` をクリックしてください。
> ![](/public/images/ETH-NFT-game/section-1/1_5_10.png)
>
> 4. Metamask のパスワードを求められるので、入力したら `Confirm` を推します。
> ![](/public/images/ETH-NFT-game/section-1/1_5_11.png)
>
> 5. あなたの秘密鍵（＝ `Private Key` ）が表示されるので、クリックしてコピーします。
> ![](/public/images/ETH-NFT-game/section-1/1_5_12.png)
>
> `hardhat.config.js` の `YOUR_PRIVATE_RINKEBY_ACCOUNT_KEY` の部分をここで取得した秘密鍵とを入れ替えます。

🙊 秘密鍵は誰にも教えてはいけません
------------------------

`hardhat.config.js` を更新したら、ここで一度立ち止まりましょう。

**🚨: `hardhat.config.js` ファイルをあなたの秘密鍵の情報を含んだ状態で Github にコミットしてはいけません**。

> この秘密鍵は、あなたのメインネットの秘密鍵と同じです。
>
> 秘密鍵が流出してしまうと、誰でもあなたのウォレットにアクセスすることができてしまうので、とても危険です。
>
> **絶対に秘密鍵を自分以外の人が見れる場所に置かないようにしましょう**。

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
> **新しくスマートコントラクトをイーサリアムネットワーク上にデプロイすること**も、トランザクションの一つです。
>
> トランザクションを行うためには、ブロックチェーンに「ログイン」する必要があります。
>
> 「ログイン」には下記の情報が必要となります。
> - ユーザー名: 公開アドレス ![](/public/images/ETH-NFT-game/section-1/1_5_13.png)
> - パスワード: 秘密鍵
> ![](/public/images/ETH-NFT-game/section-1/1_5_14.png)
>
> ユーザー名とパスワードを使用して、AWS にログインしてプロジェクトをデプロイするのと同じです。


🚀 Rinkeby Test Network にコントラクトをデプロイする
------------------------

`hardhat.config.js` の更新が完了したら、Rinkeby Test Network にコントラクトをデプロイしてみましょう。

ターミナル上で `epic-game` ディレクトリに移動し、下記のコマンドを実行しましょう。

```bash
npx hardhat run scripts/deploy.js --network rinkeby
```

ターミナルに、下記のような結果が出力されていることを確認してください。

```bash
Contract deployed to: 0x534bA0eEFbA75bb8C306CD306AB02E8FfFB4eB71
Minted NFT #1
Done deploying and minting!
```

⚠️: 注意
> 通常1〜2分程度でデプロイが完了します。
>
> `deploy.js` で NFT を Mint し、マイナーにトランザクションを承認してもらう必要があるため、時間がかかります。

👀 Etherscanでトランザクションを確認する
------------------------
`Contract deployed to:` に続くアドレス（ `0x..` ）をコピーして、[Etherscan](https://rinkeby.etherscan.io/) に貼り付けてみましょう。

あなたのスマートコントラクトのトランザクション履歴が確認できます。

- Etherscan は、イーサリアムネットワーク上のトランザクションに関する情報を確認するのに便利なプラットフォームです。

- *表示されるまでに約1分かかり場合があります。*

下記のような結果が、Rinkeby Etherscan 上で確認できれば、テストネットへのデプロイは成功です🎉

![無題](/public/images/ETH-NFT-game/section-1/1_5_15.png)

**デプロイのデバッグに Rinkeby Etherscan 使うことに慣れましょう。**

Rinkeby Etherscan はデプロイを追跡する最も簡単な方法であり、問題を特定するのに適しています。

- Etherscan にトランザクションが表示されないということは、まだ処理中か、何か問題があったということになります。

🐝 Rarible で NFT を確認する
---

最後に、コントラクトのアドレス（`Contract deployed to` に続く `0x..` ）をターミナルからコピーして、[`rinkeby.rarible.com`](https://rinkeby.rarible.com/) に貼り付け、検索してみてください。

- [テストネット用の OpenSea](https://testnets.opensea.io/) でも同じように確認することができますが、NFT が OpenSea に反映されるまでに時間がかかるので、Rarible で検証することをおすすめします。

下記のように、あなたの NFT も Rarible で確認できたでしょうか？
![](/public/images/ETH-NFT-game/section-1/1_5_16.png)

キャラクターをクリックして、右下に表示されている `Properties` を確認してみましょう。

![](/public/images/ETH-NFT-game/section-1/1_5_17.png)
キャラクター の 攻撃力（ `Attack Damage` ）や HP が Rarible に反映されています。

Rarible や OpenSea はキャラクター属性を適切にレンダリングしてくれます😊

⚠️: 注意
> 現在、一つのウォレットに 3 つの NFT が Mint されています。
>
> また、現在 `nftHolders` は、1 つのユニークなアドレスに対して 1 つの `tokenId` しか保持できません。
>
> そのため、同じアドレスに新しい NFT が Mint されるたびに、以前の `tokenId` が上書きされます。
>
> これからゲームを更新して、一つのウォレットに 1 つの NFT が Mint される仕組みを実装していきます。

🥳 NFT ゲームの可能性
---

世界最大のNFTゲーム「Axie Infinity」も、NFT キャラクターに属性を付与しています。

「Axie Infinity」は、ポケモンのようなターン制のゲームで、他のプレイヤーと1対1で戦います。

[こちら](https://opensea.io/assets/0xf5b0a3efb8e8e4c201e2a935f110eaaf3ffecb8d/78852) で Axie キャラクターの `Propertis` や `Levels` など、さまざまな属性をチェックしてみてください。

これらの属性によって、NFT キャラクターはゲーム内で個性豊かな能力を発揮します。

💪: 次のセクションで行うこと

> これから、NFT に新たなロジックを組み込んで、ゲーム内の「ボス」と戦う機能を実装していきます。
>
>- プレイヤーは NFT キャラクターを**アリーナ**に連れて行き、他のプレイヤーと協力して、ボスをと戦います。
>
>- NFT キャラクターがボスを攻撃すると、ボスば反撃し、NFT キャラクターの**HPが減ります**。
>
>- OpenSea や Rarible 上でも NFT キャラクターの HP 値は減少します。
>

👉 **NFT は見た目がカッコいいだけでなく、このように実用性を持たすことができます。**

NFT の実用性は、革新的な技術です。

大乱闘スマッシュブラザーズのおような一般的なゲームでは、ゲームを買ってからキャラクターを選びます。

**ブロックチェーンの技術を使うと、プレイヤーは自分のキャラクター NFT を選び、ゲーム内に持ち込んで遊ぶことができます。**

例えば、ポケモンの作者が、「ピカチュウ」の NFT を作成し、10万人のユーザーがそれを Mint したとします。

- ピカチュウ NFT を所有するユニークプレイヤーは10万人です。

別の開発者がやってきて、ピカチュウ NFT を基盤に別のゲームを作り、ピカチュウ NFT を持っているプレイヤーは誰でも新しいゲームに参加できるようにしたとしましょう。

- ピカチュウ NFT を持っている人は、そのゲームの中でピカチュウとしてプレイすることができます！

さらに、ピカチュウ NFT の作者が販売する NFT が転売される度に、ロイヤリティを請求することができます。つまり、NFT の人気が上がれば、クリエイターは販売ごとにお金を稼ぐことができるのです✨

🙋‍♂️ 質問する
-------------------------------------------
ここまでの作業で何かわからないことがある場合は、Discordの `#section-1-help` で質問してください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください✨
```
1. 何をしようとしていたか
2. エラー文をコピー&ペースト
3. エラー画面のスクリーンショット
```
-------------------------------------------
次のレッスンに進んで、実際にゲームのロジックを構築していきましょう🎉

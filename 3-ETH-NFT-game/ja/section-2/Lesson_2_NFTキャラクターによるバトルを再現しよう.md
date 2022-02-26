👻 コントラクトを再度デプロイして、NFT の値が変化するのを確認する
----

これから、NFT キャラクターの属性情報が更新されていることを確認していきます。

`player.hp = player.hp - bigBoss.attackDamage;` が実行されると、更新された NFT キャラクターの `Health Points` の情報が Rarible や OpenSea に反映されるはずです。

`deploy.js` を下記のように更新していきましょう。

```javascript
cconst main = async () => {
	// これにより、`MyEpicGame` コントラクトがコンパイルされます。
    // コントラクトがコンパイルされたら、コントラクトを扱うために必要なファイルが
	// `artifacts` ディレクトリの直下に生成されます。
	const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
	// Hardhat がローカルの Ethereum ネットワークを、コントラクトのためだけに作成します。
	const gameContract = await gameContractFactory.deploy(
		["FUSHIGIDANE", "HITOKAGE", "ZENIGAME"], // キャラクターの名前
		["https://i.imgur.com/IjX49Yf.png",      // キャラクターの画像
		 "https://i.imgur.com/Xid5qaC.png",
		 "https://i.imgur.com/kW2dNCs.png"],
		 [100, 200, 300],
		 [100, 50, 25],
		 "MYU2", // Bossの名前
		 "https://i.imgur.com/3Ikh51a.png", // Bossの画像
		 10000, // Bossのhp
		 50 // Bossの攻撃力
	);
	// ここでは、nftGame コントラクトが、
	// ローカルのブロックチェーンにデプロイされるまで待つ処理を行っています。
	const nftGame = await gameContract.deployed();

	console.log("Contract deployed to:", nftGame.address);
	let txn;
	// 3体のNFTキャラクターの中から、2番目のキャラクターを Mint しています。
	txn = await gameContract.mintCharacterNFT(2);

	// Minting が仮想マイナーにより、承認されるのを待ちます。
	await txn.wait();
	txn = await gameContract.attackBoss();
	await txn.wait();
	console.log("First attack.");
	txn = await gameContract.attackBoss();
	await txn.wait();
	console.log("Second attack.");

	console.log("Done!");
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

次に、ターミナルに向かい、`epic-game` ディレクトリ上で下記を実行して、テストネットに再びコントラクトをデプロイしていきましょう。

```bash
npx hardhat run scripts/deploy.js --network rinkeby
```

下記のような結果がターミナルに表示されていることを確認してください。

```plaintext
Contract deployed to: 0x0dbF6c5Df4aDdD647efb842759C7fA7AE99B22A9
First attack.
Second attack.
Done!
```

数分待つと、OpenSea や Rarible などのサイトに NFT キャラクターと更新された HP が表示されるはずです。

`deploy.js` では、「ゼニガメ」の NFT を 1 体作り、「ゼニガメ」に「ミュウツー」を 2 回攻撃させました。

ゼニガメの HP は **300** から始まっているので、ミュウツーを 2 回攻撃した場合、ピカチュウの HP は 200 になるはずです。

[rinkeby.rarible.com](https://rinkeby.rarible.com/) にコントラクトのアドレスを貼り付け、あなたの NFT キャラクターの属性情報が更新されたか確認してみてください。

下記のアドレスを直接ブラウザに貼り付けて、NFT キャラクターを確認することもできます。

```
https://rinkeby.rarible.com/token/INSERT_DEPLOY_CONTRACT_ADDRESS_HERE:INSERT_TOKEN_ID_HERE
```

Rarible で NFT を確認したら、`Refresh Metadata` をクリックしてみてください。
![](/public/images/ETH-NFT-game/section-2/2_2_1.png)

`Health Points` が `200` に更新されていれば、成功です。

⚠️: 注意
> OpenSea でも同じように NFT データを確認できますが、反映されるまでに30分以上かかることがあるので、このプロジェクトでは Rarible をお勧めしています。

🙋‍♂️ 質問する
-------------------------------------------
ここまでの作業で何かわからないことがある場合は、Discordの `#section-2-help` で質問してください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください✨
```
1. 何をしようとしていたか
2. エラー文をコピー&ペースト
3. エラー画面のスクリーンショット
```
-------------------------------------------
次のレッスンに進んで、コントラクトをブラッシュアップしていきましょう🎉

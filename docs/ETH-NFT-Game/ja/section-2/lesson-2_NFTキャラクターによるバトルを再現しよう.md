### 👻 コントラクトを再度デプロイして、NFT の値が変化するのを確認する

これから、NFTキャラクターの属性情報が更新されていることを確認していきます。

`player.hp = player.hp - bigBoss.attackDamage;`が実行されると、更新されたNFTキャラクターの`Health Points`の情報がOpenSeaなどのNFTマーケットプレイスに反映されるはずです。

`deploy.js`を下記のように更新していきましょう。

```javascript
const main = async () => {
  // これにより、`MyEpicGame` コントラクトがコンパイルされます。
  // コントラクトがコンパイルされたら、コントラクトを扱うために必要なファイルが
  // `artifacts` ディレクトリの直下に生成されます。
  const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");
  // Hardhat がローカルの Ethereum ネットワークを、コントラクトのためだけに作成します。
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
  let txn;
  // 3体のNFTキャラクターの中から、3番目のキャラクターを Mint しています。
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

次に、ターミナルに向かいテストネットに再びコントラクトをデプロイしていきましょう。

```
yarn contract deploy
```

下記のような結果がターミナルに表示されていることを確認してください。

```plaintext
Contract deployed to: 0x0dbF6c5Df4aDdD647efb842759C7fA7AE99B22A9
First attack.
Second attack.
Done!
```

数分待つと、OpenSeaなどのNFTマーケットプレイスにNFTキャラクターと更新されたHPが表示されるはずです。

`deploy.js`では、「ウソップ」のNFTを1体作り、「ウソップ」に「クロコダイル」を2回攻撃させました。

ウソップのHPは **300** から始まっているので、クロコダイルを2回攻撃した場合、ウソップのHPは200になるはずです。

次に、[gemcase(NFTを閲覧できるサービス)](https://gemcase.vercel.app/) に先ほどコピーしたコントラクトアドレスを含めた必要な情報を下のように打ち込んでいきます。

下記のアドレスを直接ブラウザに貼り付けて、NFTキャラクターを確認することもできます。

```
https://gemcase.vercel.app/view/evm/sepolia/1INSERT_DEPLOY_CONTRACT_ADDRESS_HERE:INSERT_TOKEN_ID_HERE/1
```

gemcaseでNFTを確認したら、`Refresh Metadata`をクリックしてみてください。
![](/public/images/ETH-NFT-Game/section-2/2_2_1.png)

`Health Points`が`200`に更新されていれば、成功です。


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

次のレッスンに進んで、コントラクトをブラッシュアップしていきましょう 🎉

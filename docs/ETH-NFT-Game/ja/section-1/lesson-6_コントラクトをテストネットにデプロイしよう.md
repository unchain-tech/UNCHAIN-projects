### 🏝 コントラクトをテストネットにデプロイする

これから、実際にコントラクトをテストネットにデプロイしていきます。

テストネットにデプロイすると、NFTをオンラインで見ることができます。

### 🦊 MetaMask をダウンロードする

次に、イーサリアムウォレットをダウンロードしましょう。

このプロジェクトではMetaMaskを使用します。

- [こちら](https://MetaMask.io/download.html) からブラウザの拡張機能をダウンロードし、MetaMaskウォレットをあなたのブラウザに設定します。

すでに別のウォレットをお持ちの場合でも、今回はMetaMaskを使用してください。

> ✍️: MetaMask が必要な理由
> ユーザーが、スマートコントラクトを呼び出すとき、本人のイーサリアムアドレスと秘密鍵を備えたウォレットが必要となります。
>
> - これは、認証作業のようなものです。

### 💳 トランザクション

**イーサリアムネットワーク上でブロックチェーンに新しく情報を書き込むこと**を、**トランザクション**と呼びます。

ここまでのレッスンに登場した**トランザクション**は以下です。

- **新規にスマートコントラクトをイーサリアムネットワークにデプロイした**という情報をブロックチェーン上に書き込む。
- **ユーザーが NFT を Mint した**という情報をブロックチェーンに書き込む。

トランザクションにはマイナーの承認が必要ですので、Alchemyを導入します。

Alchemyは、世界中のトランザクションを一元化し、マイナーの承認を促進するプラットフォームです。

[こちら](https://www.alchemy.com/) からAlchemyのアカウントを作成してください。

### 💎 Alchemy でネットワークを作成

Alchemyのアカウントを作成したら、`CREATE APP`ボタンを押してください。

![](/public/images/ETH-NFT-Game/section-1/1_5_1.png)

次に、下記の項目を埋めていきます。下図を参考にしてください。

![](/public/images/ETH-NFT-Game/section-1/1_5_2.png)

- `NAME`: プロジェクトの名前(例: `MyEpicGame`)
- `DESCRIPTION`: プロジェクトの概要
- `CHAIN`: `Ethereum`を選択。
- `NETWORK`: `sepolia`を選択。

それから、作成したAppの`VIEW DETAILS`をクリックします。

![](/public/images/ETH-NFT-Game/section-1/1_5_3.png)

プロジェクトを開いたら、`VIEW KEY`ボタンをクリックします。

![](/public/images/ETH-NFT-Game/section-1/1_5_4.png)

ポップアップが開くので、`HTTP`のリンクをコピーしてください。

これがあなたが本番環境のネットワークに接続する際に使用する`API Key`になります。

- **これは、後に何回か必要になるので、あなたの PC 上のわかりやすいところに、メモとして残しておいてください。**

### 🐣 テストネットから始める

今回のプロジェクトでは、コスト（＝ 本物のETH）が発生するメインネットではなく、**テストネットにコントラクトをデプロイします。**

テストネットはイーサリアムメインネットを模しています。

- イーサリアムメインネットにコントラクトをデプロイした際に発生するイベントのテストを行うのに最適です。

- テストネットは偽のETHを使用しているため、いくらでもトランザクションのテストを行えます。

今回は、以下のイベントをテストしていきます。

1\. トランザクションの発生を世界中のマイナーたちに知らせる

2\. あるマイナーがトランザクションを発見する

3\. そのマイナーがトランザクションを承認する

4\. そのマイナーがトランザクションを承認したことをほかのマイナーたちに知らせ、トランザクションのコピーを更新する

このセクションでは、コードを書きながら、これらのイベントについての理解を深めていきます。

### 🚰 偽の ETH を取得する

今回は、`Sepolia`というイーサリアム財団によって運営されているテストネットを使用します。

`Sepolia`にコントラクトをデプロイし、コードのテストを行うために、偽のETHを取得しましょう。ユーザーが偽のETHを取得するために用意されたインフラは、「フォーセット（＝蛇口）」と呼ばれています。

フォーセットを使用する前に、あなたのMetaMaskウォレットを`Sepolia Test Network`に設定してください。

> ✍️: MetaMask で`Sepolia Test Network`を設定する方法
> 1 \. MetaMask ウォレットのネットワークトグルを開く。
>
> ![](/public/images/ETH-NFT-Game/section-1/1_5_5.png)

> 2 \. `Show/hide test networks`をクリック。
>
> ![](/public/images/ETH-NFT-Game/section-1/1_5_6.png)

> 3 \. `Show test networks`を`ON`にする。
>
> ![](/public/images/ETH-NFT-Game/section-1/1_5_7.png)

> 4 \. `sepolia Test Network`を選択する。
>
> ![](/public/images/ETH-NFT-Game/section-1/1_5_8.png)

MetaMaskウォレットに`Sepolia Test Network`が設定されたら、下記のリンクの中から条件に合うものを選んで、少量の偽ETHを取得しましょう。

- [Alchemy](https://sepoliafaucet.com/) - 1 Sepolia ETH（24時間に1度もらうことができる）
  - ウォレットアドレスを入力して`Send Me ETH`ボタンを押下するとその場でもらえます。

### 🚀 `deploy.js`ファイルを作成する

今までは、ローカル環境でスマートコントラクトのテストを行う際に、`run.js`スクリプトを使用してきました。

`contract/scripts`ディレクトリに、`scripts`ディレクトリの中にある`deploy.js`を以下のとおり更新します。

内容は、既存の`run.js`に、`mintCharacterNFT`関数の呼び出しを追加しただけです。

```javascript
const main = async () => {
  // これにより、`MyEpicGame` コントラクトがコンパイルされます。
  // コントラクトがコンパイルされたら、コントラクトを扱うために必要なファイルが artifacts ディレクトリの直下に生成されます。
  const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");
  // Hardhat がローカルの Ethereum ネットワークを、コントラクトのためだけに作成します。
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

### 📈 `hardhat.config.js`ファイルを編集する

`hardhat.config.js`ファイルを変更する必要があります。

これは、スマートコントラクトプロジェクトのルートディレクトリにあります。

- 今回は、`contract`ディレクトリの直下に`hardhat.config.js`が存在するはずです。

例)`contract`で`ls`を実行した結果

```
yukis4san@Yukis-MacBook-Pro contract % ls
README.md			package-lock.json
artifacts			package.json
cache				scripts
contracts			test
hardhat.config.js
```

`hardhat.config.js`をVS Codeで開いて、中身を編集していきます。

```javascript
require("@nomicfoundation/hardhat-toolbox");
module.exports = {
  solidity: "0.8.17",
  networks: {
    sepolia: {
      url: "YOUR_ALCHEMY_API_URL",
      accounts: ["YOUR_PRIVATE_SEPOLIA_ACCOUNT_KEY"],
    },
  },
};
```

1. \. `YOUR_ALCHEMY_API_URL`の取得

> `hardhat.config.js`の`YOUR_ALCHEMY_API_URL`の部分を先ほど取得した Alchemy の URL（ `HTTP`リンク） と入れ替えます。

2. \. `YOUR_PRIVATE_SEPOLIA_ACCOUNT_KEY`の取得
   > 1\. お使いのブラウザから、MetaMask プラグインをクリックして、ネットワークを`Sepolia Test Network`に変更します。
   > ![](/public/images/ETH-NFT-Game/section-1/1_5_8.png)
   >
   > 2\. それから、`Account details`を選択してください。
   > ![](/public/images/ETH-NFT-Game/section-1/1_5_9.png)
   >
   > 3\. `Account details`から`Export Private Key`をクリックしてください。
   > ![](/public/images/ETH-NFT-Game/section-1/1_5_10.png)
   >
   > 4\. MetaMask のパスワードを求められるので、入力したら`Confirm`を推します。
   > ![](/public/images/ETH-NFT-Game/section-1/1_5_11.png)
   >
   > 5\. あなたの秘密鍵（＝ `Private Key` ）が表示されるので、クリックしてコピーします。
   > ![](/public/images/ETH-NFT-Game/section-1/1_5_12.png)
   >
   > `hardhat.config.js`の`YOUR_PRIVATE_SEPOLIA_ACCOUNT_KEY`の部分をここで取得した秘密鍵とを入れ替えます。

### 🙊 秘密鍵は誰にも教えてはいけません

`hardhat.config.js`を更新したら、ここで一度立ち止まりましょう。

> **🚨: `hardhat.config.js`ファイルをあなたの秘密鍵の情報を含んだ状態で Github にコミットしてはいけません**。
> この秘密鍵は、あなたのイーサリアムメインネットの秘密鍵と同じです。
>
> 秘密鍵が流出してしまうと、誰でもあなたのウォレットにアクセスすることができてしまうので、とても危険です。
>
> **絶対に秘密鍵を自分以外の人が見れる場所に置かないようにしましょう**。

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

> **✍️: スマートコントラクトをデプロイするのに秘密鍵が必要な理由** > **新しくスマートコントラクトをイーサリアムネットワーク上にデプロイすること**も、トランザクションの一つです。
>
> トランザクションを行うためには、ブロックチェーンに「ログイン」する必要があります。
>
> 「ログイン」には下記の情報が必要となります。
>
> - ユーザー名: 公開アドレス ![](/public/images/ETH-NFT-Game/section-1/1_5_13.png)
> - パスワード: 秘密鍵
>   ![](/public/images/ETH-NFT-Game/section-1/1_5_14.png)
>
> ユーザー名とパスワードを使用して、AWS にログインしてプロジェクトをデプロイするのと同じです。

### 🚀 Sepolia Test Network にコントラクトをデプロイする

`hardhat.config.js`の更新が完了したら、Sepolia Test Networkにコントラクトをデプロイしてみましょう。

ターミナル上で下記のコマンドを実行しましょう。

```
yarn contract deploy
```

ターミナルに、下記のような結果が出力されていることを確認してください。

```
Contract deployed to: 0x534bA0eEFbA75bb8C306CD306AB02E8FfFB4eB71
Minted NFT #1
Done deploying and minting!
```

> ⚠️: 注意
>
> 通常 1〜2 分程度でデプロイが完了します。
>
> `deploy.js`で NFT を Mint し、マイナーにトランザクションを承認してもらう必要があるため、時間がかかります。

### 👀 Etherscan でトランザクションを確認する

`Contract deployed to:`に続くアドレス(`0x..`)をコピーして、[Etherscan](https://sepolia.etherscan.io/) に貼り付けてみましょう。

あなたのスマートコントラクトのトランザクション履歴が確認できます。

- Etherscanは、イーサリアムネットワーク上のトランザクションに関する情報を確認するのに便利なプラットフォームです。

- _表示されるまでに約 1 分かかり場合があります。_

下記のような結果が、Sepolia Etherscan上で確認できれば、テストネットへのデプロイは成功です 🎉

![](/public/images/ETH-NFT-Game/section-1/1_5_15.png)

**デプロイのデバッグに Sepolia Etherscan 使うことに慣れましょう。**

Sepolia Etherscanはデプロイを追跡する最も簡単な方法であり、問題を特定するのに適しています。

- Etherscanにトランザクションが表示されないということは、まだ処理中か、何か問題があったということになります。

### 🐝 gemcase で NFT を確認する

![](/public/images/ETH-NFT-Game/section-1/1_5_22.png)

そして`View`ボタンをクリックするとコレクションの詳細が表示されます。

私のコレクションはこのような形で表示されます。

![](/public/images/ETH-NFT-Game/section-1/1_5_19.png)

下にスクロールすると他のコレクションが見れるのでV`View`ボタンをクリックしてみましょう。

![](/public/images/ETH-NFT-Game/section-1/1_5_20.png)
![](/public/images/ETH-NFT-Game/section-1/1_5_21.png)

OpenSeaなどのNFTマーケットプレイスはキャラクター属性を適切にレンダリングしてくれます 😊

> ⚠️: 注意
>
> 現在、一つのウォレットに 3 つの NFT が Mint されています。
>
> また、現在`nftHolders`は、1 つのユニークなアドレスに対して 1 つの`tokenId`しか保持できません。
>
> そのため、同じアドレスに新しい NFT が Mint されるたびに、以前の`tokenId`が上書きされます。
>
> これからのレッスンでは、一つのウォレットに 1 つの NFT が Mint された後に上書きされない仕組みを実装していきます。

### 🥳 NFT ゲームの可能性

世界最大のNFTゲーム「Axie Infinity」も、NFTキャラクターに属性を付与しています。

「Axie Infinity」は、ポケモンのようなターン制のゲームで、ほかのプレイヤーと1対1で戦います。

[こちら](https://opensea.io/assets/0xf5b0a3efb8e8e4c201e2a935f110eaaf3ffecb8d/78852) でAxieキャラクターの`Properties`や`Levels`など、さまざまな属性をチェックしてみてください。

これらの属性によって、NFTキャラクターはゲーム内で個性豊かな能力を発揮します。

💪: 次のセクションで行うこと

> これから、NFT に新たなロジックを組み込んで、ゲーム内の「ボス」と戦う機能を実装していきます。
>
> - プレイヤーは NFT キャラクターを**アリーナ**に連れて行き、他のプレイヤーと協力して、ボスをと戦います。
>
> - NFT キャラクターがボスを攻撃すると、ボスば反撃し、NFT キャラクターの**HP が減ります**。
>
> - OpenSea などの NFT マーケットプレイス上でも NFT キャラクターの HP 値は減少します。

👉 **NFT は見た目がかっこいいだけでなく、このように実用性を持たすことができます。**

NFTの実用性は、革新的な技術です。

大乱闘スマッシュブラザーズのおような一般的なゲームでは、ゲームを買ってからキャラクターを選びます。

**ブロックチェーンの技術を使うと、プレイヤーは自分のキャラクター NFT を選び、ゲーム内に持ち込んで遊ぶことができます。**

たとえば、ポケモンの作者が、「ピカチュウ」のNFTを作成し、10万人のユーザーがそれをMintしたとします。

- ピカチュウNFTを所有するユニークプレイヤーは10万人です。

別の開発者がやってきて、ピカチュウNFTを基盤に別のゲームを作り、ピカチュウNFTを持っているプレイヤーは誰でも新しいゲームに参加できるようにしたとしましょう。

- ピカチュウNFTを持っている人は、そのゲームの中でピカチュウとしてプレイできます!

さらに、ピカチュウNFTの作者が販売するNFTが転売される度に、ロイヤリティを請求できます。つまり、NFTの人気が上がれば、クリエイターは販売ごとにお金を稼ぐことができるのです ✨

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

おめでとうございます!　セクション1は終了です!
gemcaseのリンクを`#ethereum`にシェアしてください 😊
あなたの作ったNFTが気になります!　 ✨
次のレッスンに進んで、実際にゲームのロジックを構築していきましょう 🎉

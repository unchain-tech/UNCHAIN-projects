🐣 ローカル環境でスマートコントラクトをデプロイする
-------------------------------------

実際には、今まで `run.js` でテストを行うたび、下記が行われていました。

1. ローカル環境でイーサリアムネットワークを新規に作成する。

2. ローカル環境でコントラクトをデプロイする。

3. プログラムが終了すると、Hardhat は自動的にそのイーサリアムネットワークを削除する。

このレッスンでは、ローカル環境でイーサリアムネットワークを削除せず、**存続**させる方法を学びます。

ターミナルで、**新しい**ウィンドウを作成します。

`my-wave-portal` ディレクトに移動して、下記を実行してください。

```bash
npx hardhat node
```

これにより、ローカルネットワークでイーサリアムネットワークを立ち上がります。

ターミナルの出力結果を見て、あなたに Hardhat から 20 個のアカウント（ `Account` ）が提供されていること、それらすべてに `10000 ETH` が付与されていることを確認してください。

このローカルネットワークで、スマートコントラクトをデプロイしていきます。

`scripts` ディレクトリの中に、 `deploy.js` というファイルを作成します。

- `deploy.js` は、今後あなたの構築するフロントエンドと、あなたのスマートコントラクト（ `WavePortal.sol` ）を結びつける役割を果たします。

- `run.js` がテスト用のプログラムなら、`deploy.js` は本番用です。

それでは、ターミナル上で `scripts` ディレクトリに移動して、下記を実行しましょう。

```bash
touch deploy.js
```

`deploy.js` ファイルが `scripts` の中に作成されます。

`ls` を実行して、`scripts` ディレクトリに入っているファイルをターミナル上に出力しましょう。

ターミナル上で `deploy.js`が作成されていることを確認してください。

それでは、`deploy.js` を下記のように更新していきましょう。

```javascript
// deploy.js
const main = async () => {
	const [deployer] = await hre.ethers.getSigners();
	const accountBalance = await deployer.getBalance();
	const waveContract = await hre.ethers.getContractFactory('WavePortal');
	const wavePortal = await waveContract.deploy();

	console.log("Deploying contracts with account: ", deployer.address);
	console.log("Account balance: ", accountBalance.toString());
	console.log("Contract deployed to: ", wavePortal.address);
	console.log("Contract deployed by: ", deployer.address);
  };

  const runMain = async () => {
	try {
	  await main();
	  process.exit(0);
	} catch (error) {
	  console.error(error);
	  process.exit(1);
	}
  };

  runMain();
```

コードの中身は、`run.js` とほぼ同じです。

🎉 デプロイする
---------

**新しくターミナルのウィンドウを立ち上げ**、`scripts` ディレクトリに移動しましょう。

下記のコマンドを実行して、あなたのスマートコントラクトを、ローカルネットワークにデプロイしましょう。

```bash
npx hardhat run deploy.js --network localhost
```
下記のような出力結果がターミナルに表示されたでしょうか？

```
Deploying contracts with account:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Account balance:  10000000000000000000000
WavePortal address:  0x5FbDB2315678afecb367f032d93F642f64180aa3
```

上記のような結果があなたのターミナルに表示されていれば、デプロイは成功です🎉

詳しく出力結果を見ていきましょう。

```
Deploying contracts with account:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

ここには、スマートコントラクトをデプロイした人（＝ここでいうあなた）のアドレスが表示されています。

```
Account balance:  10000000000000000000000
```

これは、あなたの口座に割り当てられた残高（ **wei** ）を表す文字列です。デフォルト値である `10000000000000000 wei`（＝ `10000 ETH` ）が表示されています。

- `Wei` は、イーサリアムの最小額面です。

- `1ETH ＝ 1,000,000,000,000,000 wei` です。つまり、 **1 wei は 1,000 億分の 1ETH** ということになります。

```
WavePortal address:  0x5FbDB2315678afecb367f032d93F642f64180aa3
```

ここには、**あなたのスマートコントラクトのデプロイ先のアドレス**が表示されています。

**もう一つのターミナルウィンドウ**には、下記のような出力結果が表示されているはずです。確認してみましょう。

```
  Contract deployment: WavePortal
  Contract address:    0x5fbdb2315678afecb367f032d93f642f64180aa3
  Transaction:         0x01476c51516f5d457af924f87f1d2f3803f4fad1945073215abad6c7a8aac50c
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  Value:               0 ETH
  Gas used:            354975 of 354975
  Block #1:            0xbc2c2d5a605fa1d91617f9603c1312ac60918cc9271d6676b458e00a84cff2f3
```

**このターミナルウィンドウが、ローカル環境上のイーサリアムネットワークを維持しています。**

出力結果を詳しく見ていきましょう。

- `Contract deployment`: あなたのコントラクトの名前です。

- `Contract address`: ここに出力されているハッシュ値（`0x..`）は、イーサリアムネットワーク上でコントラクトがデプロイされている先のアドレスです。

- `Transaction`: ここに出力されているハッシュ値（ `0x..` ）は、取引IDとも呼ばれる、ブロックチェーンにおける取引のユニークなアドレスです。取引が行われたことの証明として機能します。

- `From`: コントラクトのオーナーであるあなたのアドレスが出力されています。あくまで `0x..` の値は、Hardhat が生成したものであることを覚えておいてください。

- `Value`: トランザクションされた ETH の額です。`WavePortal` では金銭のやり取りは発生していないので、出力結果は `0` になっています。

- `Gas used`: Hardhat Network のブロックチェーンで使用するブロックガスの上限を示しています。

- `Block #`:  あなたのローカル環境に構築されたイーサリアムネットワーク上に存在するブロックの数です。`npx hardhat run deploy.js --network localhost` をターミナルで実行するたびに、ブロックの数は増えていきます。

🙋‍♂️ 質問する
-------------------------------------------
ここまでの作業で何かわからないことがある場合は、Discord の `#section-1-help` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください✨
```
1. 何をしようとしていたか
2. エラー文をコピー&ペースト
3. エラー画面のスクリーンショット
```
----------------------------------
おめでとうございます🎉セクション1が終了しました。次のセクションに進みましょう！

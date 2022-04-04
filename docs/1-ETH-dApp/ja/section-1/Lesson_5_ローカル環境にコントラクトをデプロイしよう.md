### 🐣 ローカル環境でスマートコントラクトをデプロイする

実際には、今まで `run.js` でテストを行うたび、下記が行われていました。

1. ローカル環境でイーサリアムネットワークを新規に作成する。

2. ローカル環境でコントラクトをデプロイする。

3. プログラムが終了すると、Hardhat は自動的にそのイーサリアムネットワークを削除する。

このレッスンでは、ローカル環境でイーサリアムネットワークを削除せず、**存続**させる方法を学びます。

ターミナルで、**新しい**ウィンドウを作成します。

`my-wave-portal` ディレクトリに移動して、下記を実行してください。

```bash
npx hardhat node
```

これにより、ローカルネットワークでイーサリアムネットワークを立ち上がります。

ターミナルの出力結果を見て、あなたに Hardhat から 20 個のアカウント（`Account`）が提供されていること、それらすべてに `10000 ETH` が付与されていることを確認してください。

このローカルネットワークで、スマートコントラクトをデプロイしていきます。

`scripts` ディレクトリの中に、 `deploy.js` というファイルを作成します。

- `deploy.js` は、今後あなたの構築するフロントエンドと、あなたのスマートコントラクト（`WavePortal.sol`）を結び付ける役割を果たします。

- `run.js` がテスト用のプログラムなら、`deploy.js` は本番用です。

それでは、ターミナル上で `scripts` ディレクトリに移動して、下記を実行しましょう。

もう 1 つターミナルウィンドウを立ち上げて、下記を実行してみましょう。

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
  const waveContract = await hre.ethers.getContractFactory("WavePortal");
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

### 🎉 デプロイする

**新しくターミナルのウィンドウを立ち上げ**、ターミナル上で `ETH-dApp/my-wave-portal` に移動したら、下記のコマンドを実行しましょう。あなたのスマートコントラクトを、ローカルネットワークにデプロイします。

```bash
npx hardhat run scripts/deploy.js --network localhost
```

下記のような出力結果がターミナルに表示されたでしょうか？

```
Deploying contracts with account:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Account balance:  10000000000000000000000
Contract deployed to:  0x5FbDB2315678afecb367f032d93F642f64180aa3
Contract deployed by:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

上記のような結果があなたのターミナルに表示されていれば、デプロイは成功です 🎉

詳しく出力結果を見ていきましょう。

```
Deploying contracts with account:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

ここには、スマートコントラクトをデプロイした人（＝ここでいうあなた）のアドレスが表示されています。

```
Account balance:  10000000000000000000000
```

これは、あなたの口座に割り当てられた残高（**wei**）を表す文字列です。デフォルト値である `10^22 wei`（＝ `10000 ETH`）が表示されています。

- `Wei` は、イーサリアムの最小額面です。
- `1ETH ＝ 1,000,000,000,000,000,000 wei (10^18)` です。

```
Contract deployed to:  0x5FbDB2315678afecb367f032d93F642f64180aa3
```

ここには、**あなたのスマートコントラクトのデプロイ先のアドレス**が表示されています。
### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#section-1` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 3 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

おめでとうございます！　セクション 1 が終了しました！
ターミナルに出力されたアウトプットを `#section-1` に投稿して、あなたの成功をコミュニティで祝いましょう 🎉
次のセクションに進みましょう！

### 🔥 スマートコントラクトをローカル環境で実行しよう

前回のレッスンでは、`WavePortal.sol`というスマートコントラクトを作成しました。

今回のレッスンでは下記を実行します。

1. `WavePortal.sol`をコンパイルします。
2. `WavePortal.sol`をローカル環境でブロックチェーン上にデプロイします。
3. 上記が完了したら、`console.log`の中身がターミナル上に表示されることを確認します。

このプロジェクトの最終ゴールは、あなたのスマートコントラクトをブロックチェーン上にのせ、あなたのWebアプリケーションを介して世界中の人々がそのスマートコントラクトにアクセスできる状態を実現することです。

まずは、上記の作業をローカル環境で行います。

### 📝 コントラクトを実行するためのプログラムを作成する

`scripts`ディレクトリに移動し、`run.js`という名前のファイルを作成してください。

**`run.js`はローカル環境でスマートコントラクトのテストを行うためのプログラムです。**

`run.js`の中身に、以下を記入しましょう。

```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
  const waveContract = await waveContractFactory.deploy();
  const wavePortal = await waveContract.deployed();

  console.log('WavePortal address: ', wavePortal.address);
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

それでは、1行ずつコードの理解を深めましょう。

```javascript
const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
```

これにより、`WavePortal`コントラクトがコンパイルされます。

コントラクトがコンパイルされたら、コントラクトを扱うために必要なファイルが`artifacts`ディレクトリの直下に生成されます。

> ✍️: `hre.ethers.getContractFactory`について
> `getContractFactory`関数は、デプロイをサポートするライブラリのアドレスと`WavePortal`コントラクトの連携を行っています。
>
> `hre.ethers`は、Hardhat プラグインの仕様です。

> ✍️: `const main = async ()`と`await`について
> Javascript でコードを書いていると、コードの上から順に実行されなくて困ることがあります。これを非同期処理に関する問題といいます。
>
> 解決法の一つとして、ここでは`async` / `await`を使用します。
>
> これを使うと、`await`が先頭についている処理が終わるまで、`main`関数の他の処理は行われません。
>
> つまり、`hre.ethers.getContractFactory('WavePortal')`の処理が終わるまで、`main`関数の中に記載されている他の処理は実行されないということです。

次に、下記の処理を見ていきましょう。

```javascript
const waveContract = await waveContractFactory.deploy();
```

HardhatがローカルのEthereumネットワークを、コントラクトのためだけに作成します。

そして、スクリプトの実行が完了した後、そのローカル・ネットワークを破棄します。

つまり、コントラクトを実行するたびに、毎回ローカルサーバーを更新するかのようにブロックチェーンが新しくなります。

- 常にゼロリセットとなるので、エラーのデバッグがしやすくなります。

次に下記の処理を見ていきましょう。

```javascript
const wavePortal = await waveContract.deployed();
```

ここでは、`WavePortal`コントラクトが、ローカルのブロックチェーンにデプロイされるまで待つ処理を行っています。

Hardhatは実際にあなたのマシン上に「マイナー」を作成し、ブロックチェーンを構築してくれます。

`constructor`は、コントラクトがデプロイされるときに初めて実行されます。

最後に、下記の処理を見ていきましょう。

```javascript
console.log('WavePortal address:', wavePortal.address);
```

最後に、デプロイされると、`wavePortal.address`はデプロイされたコントラクトのアドレスを出力します。

このアドレスから、ブロックチェーン上でコントラクトを見つけることができますが、今回はローカルのイーサリアムネットワーク（=ブロックチェーン）に実装しているため、世界中の人がアクセスできるわけでありません。

一方、イーサリアムメインネット上のブロックチェーンにデプロイしていれば、世界中の誰でもコントラクトにアクセスできます。

実際のブロックチェーン上には、すでに何百万ものスマートコントラクトがデプロイされています。

アドレスさえわかれば、世界中どこにいても、私たちが興味を持っているコントラクトに簡単にアクセスできます。

### 🪄 実行してみよう

`packages/contract/package.json`の`script`部分を以下のように編集してください。

```json
  "scripts": {
    "run:script": "npx hardhat run scripts/run.js",
    "test": "npx hardhat test",
    "deploy": "npx hardhat run scripts/deploy.js --network sepolia"
  },
```
その後ルートディレクトリにいることを確認して、ターミナル上で下記を実行してみましょう。

```
yarn contract run:script
```

ターミナル上で`console.log`の中身とコントラクトアドレスが表示されていることを確認してください。

例)ターミナル上でのアウトプット:

```
Compiled 2 Solidity files successfully
Here is my first smart contract!
WavePortal address:  0x5FbDB2315678afecb367f032d93F642f64180aa3
```

上記のようなアウトプットターミナルに表示されていればテストは成功です。

### 🎩 Hardhat Runtime Environment について

`run.js`の中で、`hre.ethers`が登場します。

しかし、`hre`はどこにもインポートされていません。それはなぜでしょうか？

それは、ずばり、HardhatがHardhat Runtime Environment（HRE）を呼び出しているからです。

HREは、Hardhatが用意したすべての機能を含むオブジェクト（＝コードの束）です。

`hardhat`で始まるターミナルコマンドを実行するたびに、HREにアクセスしているので、`hre`を`run.js`にインポートする必要はありません。

詳しくは、[Hardhat 公式ドキュメント（英語）](https://hardhat.org/advanced/hardhat-runtime-environment.html) にて確認できます。

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

ターミナル上に`console.log`の中身とコントラクトアドレスを出力できたら、次のレッスンに進んでください 🎉

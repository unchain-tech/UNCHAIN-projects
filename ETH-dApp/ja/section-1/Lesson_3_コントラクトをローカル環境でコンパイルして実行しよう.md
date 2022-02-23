🔥 スマートコントラクトをローカル環境で実行しよう
-----------------------------------------------

前回のレッスンでは、`WavePortal.sol` というスマートコントラクトを作成しました。

今回のレッスンでは下記を実行します。

1. `WavePortal.sol` をコンパイルします。

2. `WavePortal.sol` をローカル環境でブロックチェーン上にデプロイします。

3. 上記が完了したら、`console.log` の中身がターミナル上に表示されることを確認します。

このプロジェクトの最終ゴールは、あなたのスマートコントラクトをブロックチェーン上にのせ、あなたのWEBアプリを介して世界中の人々がそのスマートコントラクトにアクセスできる状態を実現することです。

まずは、上記の作業をローカル環境で行います。

📝 コントラクトを実行するためのプログラムを作成する
-------------------------------------

`scripts` ディレクトリに移動し、`run.js` という名前のファイルを作成してください。

**`run.js` はローカル環境でスマートコントラクトのテストを行うためのプログラムです。**

`run.js` の中身に、以下を記入しましょう。

```javascript
// run.js
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  const wavePortal = await waveContract.deployed();

  console.log("Contract deployed to:", wavePortal.address);
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
// run.js
const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
```

これにより、`WavePortal` コントラクトがコンパイルされます。

コントラクトがコンパイルされたら、コントラクトを扱うために必要なファイルが `artifacts` ディレクトリの直下に生成されます。

✍️: `hre.ethers.getContractFactory` について
> `getContractFactory` 関数は、デプロイをサポートするライブラリのアドレスと `WavePortal` コントラクトの連携を行っています。
>
> `hre.ethers` は、Hardhat プラグインの仕様です。

✍️: `const main = async ()` と `await` について

> Javascript でコードを書いていると、コードの上から順に実行されなくて困ることがあります。これを同期処理に関する問題といいます。
>
> 解決法の一つとして、ここでは `async` / `await` を使用します。
>
> これを使うと、`await` が先頭についている処理が終わるまで、`main` 関数の他の処理は行われません。
>
> つまり、`hre.ethers.getContractFactory("WavePortal")` の処理が終わるまで、`main` 関数の中に記載されている他の処理は実行されないということです。

次に、下記の処理を見ていきましょう。

```javascript
// run.js
const waveContract = await waveContractFactory.deploy();
```

Hardhat がローカルの Ethereum ネットワークを、コントラクトのためだけに作成します。

そして、スクリプトの実行が完了した後、そのローカル・ネットワークを破棄します。

つまり、コントラクトを実行するたびに、毎回ローカルサーバーを更新するかのようにブロックチェーンが新しくなります。

- 常にゼロリセットとなるので、エラーのデバッグがしやすくなります。

次に下記の処理を見ていきましょう。

```javascript
// run.js
const wavePortal = await waveContract.deployed();
```

ここでは、`WavePortal` コントラクトが、ローカルのブロックチェーンにデプロイされるまで待つ処理を行っています。

Hardhat は実際にあなたのマシン上に「マイナー」を作成し、ブロックチェーンを構築してくれます。

 `constructor` は、コントラクトがデプロイされたときにはじめて実行されます。

最後に、下記の処理を見ていきましょう。

```javascript
// run.js
console.log("Contract deployed to:", wavePortal.address);
```

最後に、デプロイされると、`wavePortal.address` はデプロイされたコントラクトのアドレスを出力します。

このアドレスから、ブロックチェーン上でコントラクトを見つけることができますが、今回はのローカルのイーサリアムネットワーク（＝ブロックチェーン）に実装しているため、世界中の人がアクセスできるわけでありません。

一方、ETH のメインネット上のブロックチェーンにデプロイしていれば、世界中の誰でもコントラクトにアクセスすることができるようになります。

実際のブロックチェーン上には、すでに何百万ものスマートコントラクトがデプロイされています。

アドレスさえわかれば、世界中どこにいても、私たちが興味を持っているコントラクトに簡単にアクセスすることができます。

🪄 実行してみよう
-----------------------------------------------

ターミナル上で、`scripts` ディレクトリに移動して下記を実行してみましょう。

```bash
npx hardhat run run.js
```

ターミナル上で `console.log` の中身とコントラクトアドレスが表示されていることを確認してください。

例）ターミナル上でのアウトプット:
```
Compiling 1 file with 0.8.4
Solidity compilation finished successfully
Here is my first smart cotract!
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```
上記のようなアウトプットターミナルに表示されていればテストは成功です。

🎩 Hardhat Runtime Environment について
--------------------------------

`run.js` の中で、`hre.ethers` が登場します。

しかし、`hre` はどこにもインポートされていません。それはなぜでしょうか？

それは、ずばり、Hardhat が Hardhat Runtime Environment（HRE） を呼び出しているからです。

HRE は、Hardhat が用意した全ての機能を含むオブジェクト（＝コードの束）です。

`hardhat` で始まるターミナルコマンドを実行するたびに、HRE にアクセスしているので、`hre` を `run.js` にインポートする必要はありません。

詳しくは、[Hardhat 公式ドキュメント（英語）](https://hardhat.org/advanced/hardhat-runtime-environment.html) にて確認できます。

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
ターミナル上に `console.log` の中身とコントラクトアドレスを出力できたら、次のレッスンに進んでください🎉

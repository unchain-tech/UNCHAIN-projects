👩‍💻 コントラクトを作成する
-------------------------------------------

NFT を作成するスマートコントラクトを作成します。

- ここで作成するスマートコントラクトは、後でユースケースに合わせて自由に変更することが可能です。

`contracts` ディレクトリの下に `MyEpicGame.sol` という名前のファイルを作成します。

ターミナル上で新しくファイルを作成する場合は、下記のコマンドが役立ちます。

1. `epic-game` ディレクトリに移動: `cd epic-game`

2. `contracts` ディレクトリに移動: `cd contracts`

3. `MyEpicGame.sol` ファイルを作成: `touch MyEpicGame.sol`

Hardhat を使用する場合、ファイル構造は非常に重要なので、注意する必要があります。ファイル構造が下記のようになっていれば大丈夫です😊
```bash
epic-game
    |_ contracts
           |_  MyEpicGame.sol
```

次に、コードエディタでプロジェクトのコードを開きます。

ここでは、VS Code の使用をお勧めします。ダウンロードは[こちら](https://azure.microsoft.com/ja-jp/products/visual-studio-code/)から。

VS Code をターミナルから起動する方法は[こちら](https://maku.blog/p/f5iv9kx/)をご覧ください。今後 VS Code を起動するのが一段と楽になるので、ぜひ導入してみてください。

それでは、これから `MyEpicGame.sol` の中身の作成していきます。`MyEpicGame.sol` を VS Code で開き、下記を入力します。

```javascript
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract MyEpicGame {
  constructor() {
    console.log("THIS IS MY GAME CONTRACT.");
  }
}
```

コーディングのサポートツールとして、VS Code 上で Solidity の拡張機能をダウンロードすることをおすすめします。ダウンロードは [こちら](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity) から。

一行ずつコードを見ていきましょう。

```javascript
// MyEpicGame.sol
// SPDX-License-Identifier: UNLICENSED
```

これは「SPDXライセンス識別子」と呼ばれ、ソフトウェア・ライセンスの種類が一目でわかるようにするための識別子です。

詳細については、[ここ](https://www.skyarch.net/blog/?p=15940)を参照してみてください。

```javascript
// MyEpicGame.sol
pragma solidity ^0.8.4;
```

これは、コントラクトで使用する Solidity コンパイラのバージョンです。上記の場合「このコントラクトを実行するときは、Solidity コンパイラのバージョン0.8.4のみを使用し、それ以下のものは使用しません。」という意味です。コンパイラのバージョンが `hardhat.config.js` で同じであることを確認してください。

もし、`hardhat.config.js` の中に記載されている Solidity のバージョンが `0.8.4` でなかった場合は、`MyEpicGame.sol` の中身を `hardhat.config.js` に記載されているバージョンに変更しましょう。


```javascript
// MyEpicGame.sol
import "hardhat/console.sol";
```

コントラクトを実行する際、コンソールログをターミナルに出力するために Hardhat の`console.sol` のファイルをインポートしています。これは、今後スマートコントラクトのデバッグが発生した場合に、とても役立つツールです。

```javascript
// MyEpicGame.sol
contract MyEpicGame {
    constructor() {
        console.log("THIS IS MY GAME CONTRACT.");
    }
}
```
`contract` は、他の言語でいうところの「[class](https://wa3.i-3-i.info/word1120.html)」のようなものなのです。

この `contract` を初期化すると、`contructor` が実行されて `console.log` の中身がターミナル上に表示されます。

class の概念については、[ここ](https://aiacademy.jp/media/?p=131)を参照してみてください。

🔩 `contructor`とは
-------------------------------------------
`contructor` はオプションの関数で、`contract` の状態変数を初期化するために使用されます。これから詳しく説明していくので、`contructor` に関しては、まず以下の特徴を理解してください。

- `contract` は 1 つの `contructor` しか持つことができません。

- `contructor` は、スマートコントラクトの作成時に一度だけ実行され、`contract` の状態を初期化するために使用されます。

- `contructor` が実行された後、コードがブロックチェーンにデプロイされます。

🔥 スマートコントラクトをテスト環境で実行しよう
-----------------------------------------------

前回のレッスンでは、`MyEpicGame.sol` というスマートコントラクトを作成しました。

今回のレッスンでは下記を実行します。
1. `MyEpicGame.sol` をコンパイルします。
2. `MyEpicGame.sol` をテスト環境（=ローカル環境）でブロックチェーン上にデプロイします。
3. 上記が完了したら、`console.log` の中身がターミナル上に表示されます。

このプロジェクトの最終ゴールは、あなたのスマートコントラクトをブロックチェーン上にのせ、あなたのWEBアプリを介して世界中の人々がそのスマートコントラクトにアクセスできる状態を実現することです。

まずは、上記の作業をテスト環境で行います。


📝 コントラクトを実行するためのプログラムを作成する
-------------------------------------

`scripts` ディレクトリに移動し、`run.js` という名前のファイルを作成してください。

**`run.js` はローカル環境でスマートコントラクトのテストを行うためのプログラムです。**

`run.js` の中身に、以下を記入しましょう。

```javascript
// run.js
const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
  const gameContract = await gameContractFactory.deploy();
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

それでは、1行ずつコードの理解を深めましょう。

```javascript
// run.js
const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
```
これにより、`MyEpicGame` コントラクトがコンパイルされます。
コントラクトがコンパイルされたら、コントラクトを扱うために必要なファイルが `artifacts` ディレクトリの直下に生成されます。

✍️: `hre.ethers.getContractFactory` について
> `getContractFactory` 関数は、デプロイをサポートするライブラリのアドレスと `MyEpicGame` コントラクトの連携を行っています。
>
> `hre.ethers` は、Hardhat プラグインの仕様です。

✍️: `const main = async ()` と `await` について

> Javascript でコードを書いていると、コードの上から順に実行されなくて困ることがあります。これを同期処理に関する問題といいます。
>
> 解決法の一つとして、ここでは `async` / `await` を使用します。
>
> これを使うと、`await` が先頭についている処理が終わるまで、`main` 関数の他の処理は行われません。
>
> つまり、`hre.ethers.getContractFactory("MyEpicGame")` の処理が終わるまで、`main` 関数の中に記載されている他の処理は実行されないということです。

次に、下記の処理を見ていきましょう。

```javascript
// run.js
const gameContract = await gameContractFactory.deploy();
```

Hardhat がローカルの Ethereum ネットワークを、コントラクトのためだけに作成します。
そして、スクリプトの実行が完了した後、そのローカル・ネットワークを破棄します。
つまり、コントラクトを実行するたびに、毎回ローカルサーバーを更新するかのようにブロックチェーンが新しくなります。
- 常にゼロリセットとなるので、エラーのデバッグがしやすくなります。

次に下記の処理を見ていきましょう。

```javascript
// run.js
const nftGame = await gameContract.deployed();
```

ここでは、`nftGame` コントラクトが、ローカルのブロックチェーンにデプロイされるまで待つ処理を行っています。
Hardhat は実際にあなたのマシン上に「マイナー」を作成し、ブロックチェーンを構築してくれます。

私たちの `constructor` は、私たちが実際に完全にデプロイされたときに実行されます!

```javascript
// run.js
console.log("Contract deployed to:", gameContract.address);
```

最後に、デプロイされると、`gameContract.address` はデプロイされたコントラクトのアドレスを出力します。

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
THIS IS MY GAME CONTRACT.
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

上記のようなアウトプットターミナルに表示されていればテストは成功です。

🎩 Hardhat Runtime Environment について
--------------------------------

`run.js` の中で、`hre.ethers` が登場します。

しかし、`hre` はどこにもインポートされていません。それはなぜでしょうか？

それは、ずばり、Hardhat が Hardhat Runtime Environment（HRE） を呼び出しているからです。

HRE は、Hardhat が用意した全ての機能を含むオブジェクト（＝コードの束）です。`hardhat` で始まるターミナルコマンドを実行するたびに、HRE にアクセスしているので、`hre` を `run.js` にインポートする必要はありません。

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

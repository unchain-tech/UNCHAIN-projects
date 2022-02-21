📝 スマートコントラクトを作成する
-------------------

`contracts` ディレクトリの下に `MyEpicNFT.sol` という名前のファイルを作成します。

ターミナル上で新しくファイルを作成する場合は、下記のコマンドが役立ちます。

1. `epic-nfts` ディレクトリに移動: `cd epic-nfts`
2. `contracts` ディレクトリに移動: `cd contracts`
3. `MyEpicNFT.sol` ファイルを作成: `touch MyEpicNFT.sol`

Hardhat を使用する場合、ファイル構造は非常に重要なので、注意する必要があります。ファイル構造が下記のようになっていれば大丈夫です😊
```bash
epic-nfts
    |_ contracts
           |_  MyEpicNFT.sol
```

次に、コードエディタでプロジェクトのコードを開きます。

ここでは、VS Code の使用をお勧めします。ダウンロードは[こちら](https://azure.microsoft.com/ja-jp/products/visual-studio-code/)から。

- VS Code をターミナルから起動する方法は [こちら](https://maku.blog/p/f5iv9kx/) をご覧ください。今後 VS Code を起動するのが一段と楽になるので、ぜひ導入してみてください。

- VS Code 用の [Solidity拡張機能](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity) をダウンロードすることをお勧めします。この拡張機能により、構文が見やすくなります。

それでは、実際にコントラクトを書いていきましょう。

` MyEpicNFT.sol` のファイル内に以下のコードを記載します。

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import "hardhat/console.sol";
contract MyEpicNFT {
    constructor() {
        console.log("This is my NFT contract.");
    }
}
```

⚠️: 注意
> 上記のコードに対して、VS Code がエラーを表示する場合があります。
> 例えば、`import hardhat` に下線が引かれ、`don't exist` と表示される場合があります。
>
> これは、グローバル Solidity コンパイラがローカルに設定されていないために発生します。
>
> 修正する方法がわからなくても心配しないでください。
> 無視して問題ありません。
>


さて、行ごとにコードをみていきましょう。

```solidity
// SPDX-License-Identifier: UNLICENSED
```
これは「SPDXライセンス識別子」と呼ばれます。

詳細については、[ここ](https://www.skyarch.net/blog/?p=15940)を参照してみてください。

```javascript
// MyEpicNFT.sol
pragma solidity ^0.8.4;
```

これは、コントラクトで使用する Solidity コンパイラのバージョンです。

上記の場合「このコントラクトを実行するときは、Solidity コンパイラのバージョン0.8.0のみを使用し、それ以下のものは使用しません。」という意味です。コ

ンパイラのバージョンが `hardhat.config.js` で同じであることを確認してください。

もし、`hardhat.config.js` の中に記載されている Solidity のバージョンが `0.8.4` でなかった場合は、`MyEpicNFT.sol` の中身を `hardhat.config.js` に記載されているバージョンに変更しましょう。

```javascript
// MyEpicNFT.sol
import "hardhat/console.sol";
```

Hardhat のおかげで、コントラクトでコンソールログを実行できます。

実際には、ブロックチェーン上にデプロイしたスマートコントラクトをデバッグすることは困難です。

なぜなら、一度デプロイしてしまったコントラクトを改変することができないからです。

これには、ブロックチェーンが改ざんできない特性でもあります。

よって、Hardhat はローカル環境でコントラクトのデプロイを行えるため、ブロックチェーン上にアップロードする前に簡単にデバックができる便利なツールといえます。

```javascript
// MyEpicNFT.sol
contract MyEpicNFT {
    constructor() {
        console.log("This is my NFT contract.");
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

😲 スマートコントラクトを実行する
-------------------

スマートコントラクトを実行するためには以下の手順が必要です。

1. コンパイルする。

2. ローカル環境のブロックチェーンにデプロイする。

3. `console.log`が実行される。

ここでは、この3つのステップを処理して、テストするプログラムを作成していきます。

`scripts` ディレクトリに移動して、`run.js` という名前のファイルを作成しましょう。

 `run.js` の中身を下記のように更新しましょう。

```javascript
// run.js
const main = async () => {
  // コントラクトがコンパイルします
  // コントラクトを扱うために必要なファイルが `artifacts` ディレクトリの直下に生成されます。
  const nftContractFactory = await hre.ethers.getContractFactory('MyEpicNFT');
  // Hardhat がローカルの Ethereum ネットワークを作成します。
  const nftContract = await nftContractFactory.deploy();
  // コントラクトが Mint され、ローカルのブロックチェーンにデプロイされるまで待ちます。
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);
};
// エラー処理を行っています。
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

一行ずつコードを見ていきましょう。

```javascript
// run.js
const nftContractFactory = await hre.ethers.getContractFactory("MyEpicNFT");
```

実際にコントラクトがコンパイルされ、コントラクトを扱うために必要なファイルが `artifacts` ディレクトリの直下に生成されます。

✍️: `hre.ethers.getContractFactory` について
> `getContractFactory` 関数は、デプロイをサポートするライブラリのアドレスと `MyEpicNFT` コントラクトの連携を行っています。
>
> `hre.ethers` は、Hardhat プラグインの仕様です。

✍️: `const main = async ()` と `await` について

> Javascript でコードを書いていると、コードの上から順に実行されなくて困ることがあります。これを同期処理に関する問題といいます。
>
> 解決法の一つとして、ここでは `async` / `await` を使用します。
>
> これを使うと、`await` が先頭についている処理が終わるまで、`main` 関数の他の処理は行われません。
>
> つまり、`hre.ethers.getContractFactory("MyEpicNFT")` の処理が終わるまで、`main` 関数の中に記載されている他の処理は実行されないということです。


```javascript
// run.js
const nftContract = await nftContractFactory.deploy();
```

Hardhat がローカルの Ethereum ネットワークを、コントラクトのためだけに作成します。
そして、スクリプトの実行が完了した後、そのローカル・ネットワークを破棄します。
つまり、コントラクトを実行するたびに、毎回ローカルサーバーを更新するかのようにブロックチェーンが新しくなります。
- 常にゼロリセットとなるので、エラーのデバッグがしやすくなります。

```javascript
// run.js
await nftContract.deployed();
```

コントラクトが Mint され、ローカルのブロックチェーンにデプロイされるまで待ちます。
Hardhat は実際にあなたのマシン上に「マイナー」を作成し、ブロックチェーンを構築してくれます。

 `constructor` は、コントラクトがデプロイされたときにはじめて実行されます。

```javascript
console.log("Contract deployed to:", nftContract.address);
```

最後に、デプロイされると、`nftContract.address` はデプロイされたコントラクトのアドレスを出力します。

このアドレスから、ブロックチェーン上でコントラクトを見つけることができますが、今回はのローカルのブロックチェーンに実装しているため、世界中の人がアクセスできるわけでありません。

一方、ETH のメインネット上のブロックチェーンにデプロイしていれば、世界中の誰でもコントラクトにアクセスすることができるようになります。

実際のブロックチェーン上には、すでに何百万ものスマートコントラクトがデプロイされています。

アドレスさえわかれば、世界中どこにいても、私たちが興味を持っているコントラクトに簡単にアクセスすることができます。

💨 実行してみましょう。
-------------------

では、実行してみましょう。

ターミナルを開いて、下記を実行してください。

```bash
npx hardhat run scripts/run.js
```

コントラクト内から`console.log`が実行され、さらにコントラクトのアドレスがプリントアウトされるのが確認できるはずです！

以下、出力結果のサンプルです。
```
Compiling 1 file with 0.8.4
Solidity compilation finished successfully
This is my NFT contract.
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```
上記のような結果がターミナルに出力されていれば、テストは成功です。

🌱 Mint とは
-----------
NFT における「Mint（ミント）」とは、**スマートコントラクトを用いて、NFT を新らしく作成・発行すること**を意味します。


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

-----
テストが終わったら、次のレッスンに進んで、NFT を Mint するためにスマートコントラクトを更新していきましょう🎉

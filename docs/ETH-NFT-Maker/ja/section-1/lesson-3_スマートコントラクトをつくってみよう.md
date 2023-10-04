### 📝 スマートコントラクトを作成する

`contracts`ディレクトリの下に`Web3Mint.sol`という名前のファイルを作成しましょう。

Hardhatを使用する場合、ファイル構造は非常に重要ですので、注意する必要があります。ファイル構造が下記のようになっていれば大丈夫です 😊

```
contract
 └── contracts
     └── Web3Mint.sol
```

次に、コードエディタでプロジェクトのコードを開きます。

ここでは、VS Codeの使用をお勧めします。ダウンロードは [こちら](https://azure.microsoft.com/ja-jp/products/visual-studio-code/) から。

- VS Codeをターミナルから起動する方法は [こちら](https://maku.blog/p/f5iv9kx/) をご覧ください。今後VS Codeを起動するのが一段と楽になるので、ぜひ導入してみてください。
- VS Code用の [Solidity 拡張機能](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity) をダウンロードすることをお勧めします。この拡張機能により、構文が見やすくなります。

それでは、実際にコントラクトを書いていきましょう。

`Web3Mint.sol`のファイル内に以下のコードを記載します。

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;
import "hardhat/console.sol";
contract Web3Mint {
    constructor() {
        console.log("This is my NFT contract.");
    }
}
```

> ⚠️: 注意
>
> 上記のコードに対して、VS Code がエラーを表示する場合があります。
> 例えば、`import hardhat`に下線が引かれ、`don't exist`と表示される場合があります。
>
> これは、グローバル Solidity コンパイラがローカルに設定されていないために発生します。
>
> 修正する方法がわからなくても心配しないでください。
> 無視して問題ありません。
さて、行ごとにコードをみていきましょう。

```solidity
// Web3Mint.sol
// SPDX-License-Identifier: UNLICENSED
```

これは「SPDXライセンス識別子」と呼ばれます。

詳細については、[ここ](https://www.skyarch.net/blog/?p=15940)を参照してみてください。

```solidity
// Web3Mint.sol
pragma solidity ^0.8.17;
```

これは、コントラクトで使用するSolidityコンパイラのバージョンです。

上記の場合「このコントラクトを実行するときは、Solidityコンパイラのバージョン0.8.17のみを使用し、それ以下のものは使用しません」という意味です。

コンパイラのバージョンが`hardhat.config.js`で同じであることを確認してください。

もし、`hardhat.config.js`の中に記載されているSolidityのバージョンが`0.8.17`でなかった場合は、`Web3Mint.sol`の中身を`hardhat.config.js`に記載されているバージョンに変更しましょう。

```solidity
// Web3Mint.sol
import "hardhat/console.sol";
```

Hardhatのおかげで、コントラクトでコンソールログを実行できます。

実際には、ブロックチェーン上にデプロイしたスマートコントラクトをデバッグすることは困難です。

なぜなら、一度デプロイしてしまったコントラクトを改変できないからです。

これには、ブロックチェーンが改ざんできない特性でもあります。

よって、Hardhatはローカル環境でコントラクトのデプロイを行えるため、ブロックチェーン上にアップロードする前に簡単にデバッグができる便利なツールといえます。

```solidity
// Web3Mint.sol
contract Web3Mint {
    constructor() {
        console.log("This is my NFT contract.");
    }
}
```

`contract`は、ほかの言語でいうところの「[class](https://wa3.i-3-i.info/word1120.html)」のようなものなのです。

この`contract`を初期化すると、`constructor`が実行されて`console.log`の中身がターミナル上に表示されます。

classの概念については、[ここ](https://aiacademy.jp/media/?p=131)を参照してみてください。

### 🔩 constructor とは

`constructor`はオプションの関数で、`contract`の状態変数を初期化するために使用されます。これから詳しく説明していくので、`constructor`に関しては、まず以下の特徴を理解してください。

- `contract`は1つの`constructor`しか持つことができません。

- `constructor`は、スマートコントラクトの作成時に一度だけ実行され、`contract`の状態を初期化するために使用されます。

- `constructor`は、コントラクトがデプロイされたときに初めて実行されます。

- `constructor`が実行された後、コードがブロックチェーンにデプロイされます。

### 😲 スマートコントラクトを実行する

スマートコントラクトを実行するためには以下の手順が必要です。

1. コンパイルする。
2. ローカル環境のブロックチェーンにデプロイする。
3. `console.log`が実行される。

ここでは、この3つのステップを処理して、テストするプログラムを作成していきます。

`scripts`ディレクトリに移動して、`run.js`という名前のファイルを作成しましょう。

`run.js`の中身を下記のように更新しましょう。

```javascript
const main = async () => {
  // コントラクトがコンパイルします
  // コントラクトを扱うために必要なファイルが `artifacts` ディレクトリの直下に生成されます。
  const nftContractFactory = await hre.ethers.getContractFactory('Web3Mint');
  // Hardhat がローカルの Ethereum ネットワークを作成します。
  const nftContract = await nftContractFactory.deploy();
  // コントラクトが Mint され、ローカルのブロックチェーンにデプロイされるまで待ちます。
  await nftContract.deployed();
  console.log('Contract deployed to:', nftContract.address);
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
const nftContractFactory = await hre.ethers.getContractFactory('Web3Mint');
```

実際にコントラクトがコンパイルされ、コントラクトを扱うために必要なファイルが`artifacts`ディレクトリの直下に生成されます。

> ✍️: `hre.ethers.getContractFactory`について
> `getContractFactory`関数は、デプロイをサポートするライブラリのアドレスと`Web3Mint`コントラクトの連携を行っています。
>
> `hre.ethers`は、Hardhat プラグインの仕様です。
> ✍️: `const main = async ()`と`await`について
> Javascript でコードを書いていると、コードの上から順に実行されなくて困ることがあります。これを非同期処理に関する問題といいます。
>
> 解決法の一つとして、ここでは`async` / `await`を使用します。
>
> これを使うと、`await`が先頭についている処理が終わるまで、`main`関数の他の処理は行われません。
>
> つまり、`hre.ethers.getContractFactory('Web3Mint')`の処理が終わるまで、`main`関数の中に記載されている他の処理は実行されないということです。

```javascript
// run.js
const nftContract = await nftContractFactory.deploy();
```

HardhatがローカルのEthereumネットワークを、コントラクトのためだけに作成します。
そして、スクリプトの実行が完了した後、そのローカル・ネットワークを破棄します。
つまり、コントラクトを実行するたびに、毎回ローカルサーバーを更新するかのようにブロックチェーンが新しくなります。

- 常にゼロリセットとなるので、エラーのデバッグがしやすくなります。

```javascript
// run.js
await nftContract.deployed();
```

コントラクトがMintされ、ローカルのブロックチェーンにデプロイされるまで待ちます。
Hardhatは実際にあなたのマシン上に「マイナー」を作成し、ブロックチェーンを構築してくれます。

最後に、デプロイされると、`nftContract.address`はデプロイされたコントラクトのアドレスを出力します。

```javascript
// run.js
console.log('Contract deployed to:', nftContract.address);
```

このアドレスから、ブロックチェーン上でコントラクトを見つけることができますが、今回はローカルのブロックチェーンに実装しているため、世界中の人がアクセスできるわけでありません。

一方、イーサリアムメインネット上のブロックチェーンにデプロイしていれば、世界中の誰でもコントラクトにアクセスできます。

実際のブロックチェーン上には、すでに何百万ものスマートコントラクトがデプロイされています。

アドレスさえわかれば、世界中どこにいても、私たちが興味を持っているコントラクトに簡単にアクセスできます。

### 💨 実行してみよう!

ターミナルを開いて下記を実行してください。

```
yarn contract run:script
```

コントラクト内から`console.log`が実行され、さらにコントラクトのアドレスがプリントアウトされるのが確認できるはずです!

以下、出力結果のサンプルです。

```
Compiling 1 file with 0.8.17
Solidity compilation finished successfully
This is my NFT contract.
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

上記のような結果がターミナルに出力されていれば、テストは成功です。

### 🌱 Mint とは

NFTにおける「Mint（ミント）」とは、**スマートコントラクトを用いて、NFT を新らしく作成・発行すること**を意味します。mintの意味としては、〔貨幣を〕鋳造するというような意味合いがあるそうです。mint a gold coinというような使い方をします。

### 🎩 Hardhat Runtime Environment について

`run.js`の中で、`hre.ethers`が登場します。

しかし、`hre`はどこにもインポートされていません。それはなぜでしょうか？

それは、ずばり、HardhatがHardhat Runtime Environment（HRE）を呼び出しているからです。

HREは、Hardhatが用意したすべての機能を含むオブジェクト（＝コードの束）です。`hardhat`で始まるターミナルコマンドを実行するたびに、HREにアクセスしているので、`hre`を`run.js`にインポートする必要はありません。

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

テストが終わったら、次のレッスンに進んで、NFTをMintするためにスマートコントラクトを更新していきましょう 🎉

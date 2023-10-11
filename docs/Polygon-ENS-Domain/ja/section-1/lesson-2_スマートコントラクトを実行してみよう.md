### 👶 スマートコントラクトを作成してみよう

前回、あらかじめ設定されていたテストのコントラクトを実行できました。

ではいよいよ自分でコントラクトを作成していきましょう。

`packages/contract/contracts`ディレクトリの下に`Domains.sol`という名前のファイルを作成してください。

Hardhatを使用する場合、ファイル構造は非常に重要ですので、注意する必要があります。ファイル構造が下記のようになっていれば大丈夫です 😊

```
packages
└── contract
    └── contracts
        └── Domains.sol
```

次に、コードエディタでプロジェクトのコードを開きます。

ここでは、VS Codeの使用をお勧めします。ダウンロードは [こちら](https://azure.microsoft.com/ja-jp/products/visual-studio-code/) から。

VS Codeをターミナルから起動する方法は [こちら](https://maku.blog/p/f5iv9kx/) をご覧ください。

- ターミナル上で、`code .`コマンドを実行

今後VS Codeを起動するのが一段と楽になるので、ぜひ導入してみてください。

コーディングのサポートツールとして、VS Code上でSolidityの拡張機能をダウンロードすることをお勧めします。

ダウンロードは [こちら](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity) から。

それでは、これから`Domains.sol`の中身の作成していきます。

`Domains.sol`をVS Codeで開き、下記を入力します。

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract Domains {
  constructor() {
    console.log("THIS IS MY DOMAINS CONTRACT. NICE.");
  }
}
```
コードを詳しくみていきましょう。

```solidity
// SPDX-License-Identifier: UNLICENSED
```

これは「SPDXライセンス識別子」と呼ばれ、ソフトウェア・ライセンスの種類が一目でわかるようにするための識別子です。

詳細については、[こちら](https://www.skyarch.net/blog/?p=15940) を参照してみてください。

```solidity
pragma solidity ^0.8.17;
```

これは、コントラクトで使用するSolidityコンパイラのバージョンです。

上記のコードでは、このコントラクトを実行するときはSolidityコンパイラのバージョン`0.8.17`のみを使用しそれ以下のものは使用しません、という宣言をしています。

コンパイラのバージョンが`hardhat.config.js`で同じであることを確認してください。

もし記載されているSolidityのバージョンが`0.8.17`でなかった場合は、`Domains.sol`の中身を`hardhat.config.js`に記載されているバージョンに変更しましょう。

```solidity
import "hardhat/console.sol";
```
コントラクトを実行する際、コンソールログをターミナルに出力するためにHardhatの`console.sol`のファイルをインポートしています。

これは、今後スマートコントラクトのデバッグが発生した場合に、とても役立つツールです。


```solidity
contract Domains{
    constructor() {
        console.log("THIS IS MY DOMAIN CONTRACT. NICE.");
    }
}

```

`contract`は、ほかの言語でいうところの「[class](https://wa3.i-3-i.info/word1120.html)」のようなものなのです。

この`contract`を初期化すると、`constructor`が実行されて`console.log`の中身がターミナル上に表示されます。

classの概念については、[こちら](https://aiacademy.jp/media/?p=131) を参照してください。

### 🔩 constructor とは

`constructor`はオプションの関数で、`contract`の状態変数を初期化するために使用されます。

これから詳しく説明していくので、`constructor`に関しては、まず以下の特徴を理解してください。

- `contract`は1つの`constructor`しか持つことができません。
- `constructor`は、スマートコントラクトの作成時に一度だけ実行され、`contract`の状態を初期化するために使用されます。
- `constructor`が実行された後、コードがブロックチェーンにデプロイされます。
### 😲 コントラクトを実行しましょう

さぁ、スマートコントラクトを作成しました。

しかし、まだそれが機能するかどうかはわかりません。

実際に実行してみましょう。次のような手順となります。

1. `Domains.sol`をコンパイルします。
2. `Domains.sol`をローカル環境でブロックチェーン上にデプロイします。
3. 上記が完了したら、`console.log`の中身がターミナル上に表示されることを確認します。
### 📝 コントラクトを実行するためのプログラムを作成する

前に挙げた3つのステップを処理するスクリプトを作成します。

`scripts`ディレクトリに移動し、`run.js`という名前のファイルを作成してください。

**`run.js`はローカル環境でスマートコントラクトのテストを行うためのプログラムです。**

`run.js`の中身に、以下を記入しましょう。

```javascript
const main = async () => {
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  const domainContract = await domainContractFactory.deploy();
  await domainContract.deployed();
  console.log("Contract deployed to:", domainContract.address);
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
const domainContractFactory = await hre.ethers.getContractFactory('Domains');
```

これにより、`Domains`コントラクトがコンパイルされます。

コントラクトがコンパイルされたら、コントラクトを扱うために必要なファイルが`artifacts`ディレクトリの直下に生成されます。

> ✍️: `hre.ethers.getContractFactory`について
> `getContractFactory`関数は、デプロイをサポートするライブラリのアドレスと`Domains`コントラクトの連携を行っています。
>
> `hre.ethers`は、Hardhat プラグインの仕様です。

> ✍️: `const main = async ()`と`await`について
> Javascript でコードを書いていると、コードの上から順に実行されなくて困ることがあります。これを非同期処理に関する問題といいます。
>
> 解決法の一つとして、ここでは`async` / `await`を使用します。
>
> これを使うと、`await`が先頭についている処理が終わるまで、`main`関数の他の処理は行われません。
>
> つまり、`hre.ethers.getContractFactory("Domains")`の処理が終わるまで、`main`関数の中に記載されている他の処理は実行されないということです。

次に、下記の処理を見ていきましょう。

```javascript
const domainContract = await domainContractFactory.deploy();
```

HardhatがローカルのEthereumネットワークを、コントラクトのためだけに作成します。

そして、スクリプトの実行が完了した後、そのローカル・ネットワークを破棄します。

つまり、コントラクトを実行するたびに、毎回ローカルサーバーを更新するかのようにブロックチェーンが新しくなります。

- 常にゼロリセットとなるので、エラーのデバッグがしやすくなります。

次に下記の処理を見ていきましょう。

```javascript
await domainContract.deployed();
```

ここでは、`Domains`コントラクトが、ローカルのブロックチェーンにデプロイされるまで待つ処理を行っています。

Hardhatは実際にあなたのマシン上に「マイナー」を作成し、ブロックチェーンを構築してくれます。

`constructor`は、スマートコントラクトがデプロイされるときに初めて実行されます。

```javascript
console.log("Contract deployed to:", domainContract.address);
```

最後に、デプロイされると、`domainContract.address`はデプロイされたスマートコントラクトのアドレスを出力します。

このアドレスから、ブロックチェーン上でスマートコントラクトを見つけることができますが、今回はローカルのイーサリアムネットワーク（＝ブロックチェーン）に実装しているため、世界中の人がアクセスできるわけでありません。

一方、イーサリアムやポリゴンのブロックチェーンにデプロイしていれば、世界中の誰でもコントラクトにアクセスできます。

実際のブロックチェーン上には、すでに何百万ものスマートコントラクトがデプロイされています。

アドレスさえわかれば、世界中どこにいても、私たちが興味を持っているスマートコントラクトに簡単にアクセスできます。

### 💨 実行してみよう

ターミナル上で、下記を実行してみましょう。

```
yarn contract run:script
```

ターミナル上で`console.log`の中身とコントラクトアドレスが表示されていることを確認してください。

例)ターミナル上でのアウトプット:

```
Compiled 1 Solidity file successfully
THIS IS MY DOMAINS CONTRACT. NICE.
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### 🎩 Hardhat Runtime Environment について

`run.js`の中で、`hre.ethers`が登場します。

しかし、`hre`はどこにもインポートされていません。それはなぜでしょうか？

それは、ずばり、HardhatがHardhat Runtime Environment（HRE）を呼び出しているからです。

HREは、Hardhatが用意したすべての機能を含むオブジェクト（＝コードの束）です。

`hardhat`で始まるターミナルコマンドを実行するたびに、HREにアクセスしているので、`hre`を`run.js`にインポートする必要はありません。

詳しくは、[Hardhat 公式ドキュメント（英語）](https://hardhat.org/advanced/hardhat-runtime-environment.html) にて確認できます。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#polygon`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

ターミナル上に`console.log`の中身とコントラクトアドレスを出力できたら、次のレッスンに進んでください 🎉

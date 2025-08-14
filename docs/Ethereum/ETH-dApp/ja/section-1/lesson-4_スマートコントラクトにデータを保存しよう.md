### 📦 データを保存しよう

このレッスンでは、ユーザーがあなたに送った「👋（wave）」の数をデータとして保存する方法を学びます。

ブロックチェーンは、AWSのようなクラウド上にデータを保存できるサーバーのようなものです。

しかし、誰もそのデータを所有していません。

世界中に、ブロックチェーン上にデータを保存する作業を行う「マイナー」と呼ばれる人々が存在します。この作業に対して、私たちは代金を支払います。

その代金は、通称**ガス代**と呼ばれます。

イーサリアムのブロックチェーン上にデータを書き込む場合、私たちは代金として`$ETH`を「マイナー」に支払います。

それでは、「👋（wave）」を保存するために、`WavePortal.sol`を更新していきましょう。

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "hardhat/console.sol";

contract WavePortal {

    uint256 private _totalWaves;

    constructor() {
        console.log("Here is my first smart contract!");
    }

    function wave() public {
        _totalWaves += 1;
        console.log("%s has waved!", msg.sender);
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", _totalWaves);
        return _totalWaves;
    }
}
```

新しく追加されたコードの理解を深めましょう。

```solidity
uint256 private _totalWaves;
```

自動的に`0`に初期化される`_totalWaves`変数が追加されました。この変数は「状態変数」と呼ばれ、`WavePortal`コントラクトのストレージに永続的に保存されます。

- [uint256](https://www.iuec.co.jp/blockchain/uint256.html) は、非常に大きな数を扱うことができる「符号なし整数のデータ型」を意味します。

### 🎁 Solidity のアクセス修飾子について

```solidity
function wave() public {
    _totalWaves += 1;
    console.log("%s has waved!", msg.sender);
}
```

ここで、「👋（wave）」の回数を記録する`wave()`関数が追加されました。まず、`public`について見ていきます。

これは、Solidityのアクセス修飾子の1つです。

Solidity含めさまざまな言語において、各関数のアクセス権限について指定する必要があります。その指定を行うのが、アクセス修飾子です。

Solidityには、4つのアクセス修飾子が存在します。

- **`public`**: `public`で定義された関数や変数は、それらが定義されているコントラクト、そのコントラクトが継承された別のコントラクト、それらコントラクトの外部と、**基本的にどこからでも**呼び出すことができます。Solidityでは、アクセス修飾子がついてない**関数**を、自動的に`public`として扱います。

- **`private`**: `private`で定義された関数や変数は、**それらが定義されたコントラクトでのみ**呼び出すことができます。

- **`internal`**: `internal`で定義された関数や変数は、**それらが定義されたコントラクト**と、**そのコントラクトが継承された別のコントラクト**の**両方**から呼び出すことができます。Solidityでは、アクセス修飾子がついてない**変数**を、自動的に`internal`として扱います。

- **`external`**: `external`で定義された関数や変数は、**外部からのみ**呼び出すことができます。

以下に、Solidityのアクセス修飾子とアクセス権限についてまとめています。

![](/images/ETH-dApp/section-1/1_4_1.png)

これからSolidityのアクセス修飾子は頻繁に登場するので、まずは大まかな理解ができれば大丈夫です。

### 🔍 `msg.sender`について

```solidity
function wave() public {
    _totalWaves += 1;
    console.log("%s has waved!", msg.sender);
}
```

`wave()`関数の中に`msg.sender`が登場するのをお気付きでしょうか？

`msg.sender`に入る値は、ずばり、**関数を呼び出した人（＝あなたに「👋（wave）」を送った人）のウォレットアドレス**です。

これは、**ユーザー認証**のようなものです。

- スマートコントラクトに含まれる関数を呼び出すには、ユーザーは有効なウォレットを接続する必要があります。
- `msg.sender`では、誰が関数を呼び出したかを正確に把握し、ユーザー認証を行っています。

### 🖋 Solidity の関数修飾子について

Solidityには、関数（function）に対してのみ使用される修飾子（＝関数修飾子）が存在します。

Solidity開発では関数修飾子を意識しておかないとデータを記録する際のコスト（＝ガス代）が跳ね上がってしまうので注意が必要です。

ここでポイントとなるのは、**ブロックチェーンに値を書き込むにはガス代を払う必要があること、そしてブロックチェーンから値を参照するだけなら、ガス代を払う必要がないことです。**

ここでは、主要な2つの関数修飾子を紹介します。

- **`view`**: `view`関数は、読み取り専用の関数であり、呼び出した後に関数の中で定義された状態変数が変更されないようにします。
- **`pure`**: `pure`関数は、関数の中で定義された状態変数を読み込んだり変更したりせず、関数に渡されたパラメータや関数に存在するローカル変数のみを使用して値を返します。

以下に、Solidityの関数修飾子`pure`と`view`についてまとめています。

![](/images/ETH-dApp/section-1/1_4_2.png)

ここまで理解してほしいのは、`pure`や`view`関数を使用すれば、**ガス代を削減できる**ということです。

同時に、ブロックチェーン上にデータを書き込まないことで、**処理速度も向上します**。

`WavePortal.sol`に追加された下記の関数を見ていきましょう。

```solidity
function wave() public {
    _totalWaves += 1;
    console.log("%s has waved!", msg.sender);
}
```

`wave()`関数には関数修飾子がついていないことをお気付きでしょうか。

- 同一のユーザーが送った「👋（wave）」の回数が`_totalWaves += 1`によってカウントされ、ブロックチェーン上にデータが書き込まれます。
- また、この関数が呼び出されると、`console.log("%s has waved!", msg.sender)`によって、あなたに「👋（wave）」を送ったユーザーのアドレスがターミナル上に表示されます。

それでは、下記のコードも見ていきましょう。

```solidity
function getTotalWaves() public view returns (uint256) {
    console.log("We have %d total waves!", _totalWaves);
    return _totalWaves;
}
```

一方、`view`という関数修飾子がついた`getTotalWaves()`関数は、ユーザーがあなたに送った「👋（wave）」の総数の参照のみを行います。

### ✅ `run.js`を更新して関数を呼び出す

次に、`run.js`を以下のように更新していきます。

```js
const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  const wavePortal = await waveContract.deployed();

  console.log("Contract deployed to:", wavePortal.address);
  console.log("Contract deployed by:", owner.address);

  let waveCount;
  waveCount = await waveContract.getTotalWaves();

  let waveTxn = await waveContract.wave();
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();
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

`WavePortal.sol`の中で`public`と指定した`wave()`関数と`getTotalWaves()`関数は、ブロックチェーン上で呼び出すことができるようになりました。

`run.js`から、それら関数を呼び出していきます。

- 復習となりますが、 `run.js`はデバッグ用のテストコードです。
- `run.js`は本番環境でユーザーがあなたのスマートコントラクトを呼び出すシチュエーションを想定して、コードが問題なく走るかテストするために、作られています。

`public`で定義した関数はAPIのエンドポイントのようなものです。

更新された部分を1行ずつ見ていきましょう。

```js
const [owner, randomPerson] = await hre.ethers.getSigners();
```

ブロックチェーンに`WavePortal`コントラクトをデプロイする際、「👋（wave）」を送る側のウォレットアドレスが必要です。

`hre.ethers.getSigners()`はHardhatが提供する任意のアドレスを返す関数です。

- ここでは、コントラクト所有者（＝あなた）のウォレットアドレスと、あなたに「👋（wave）」を送るユーザーのウォレットアドレスをHardhatがそれぞれ生成し、`owner`と`randomPerson`という変数に格納しています。

- `randomPerson`は、テスト環境で「👋（wave）」を送ってくるユーザーだと思ってください。

次に、下記のコードを見ていきましょう。

```js
console.log("Contract deployed to:", wavePortal.address);
```

ここでは、あなたのスマートコントラクトのデプロイ先のアドレス(＝ `wavePortal.address`)をターミナルに出力しています。

```js
console.log("Contract deployed by:", owner.address);
```

ここでは、`WavePortal`コントラクトをデプロイした人（＝あなた）のアドレス(＝ `owner.address`)をターミナルに出力しています。

最後に、下記のコードを見ていきましょう。

```js
let waveCount;
waveCount = await waveContract.getTotalWaves();

let waveTxn = await waveContract.wave();
await waveTxn.wait();

waveCount = await waveContract.getTotalWaves();
```

ここでは、通常のAPIと同じように、関数を手動で呼び出しています。1行ずつ見ていきましょう。

```js
let waveCount;
waveCount = await waveContract.getTotalWaves();
```

まず、`let waveCount`でローカル変数を宣言します。

次に、`waveContract.getTotalWaves()`で`WavePortal.sol`に記載された`getTotalWaves()`を呼び出し、既存の「👋（wave）」の総数を取得します。

```js
let waveTxn = await waveContract.wave();
await waveTxn.wait();
```

`let waveTxn = await waveContract.wave()`では、ユーザーが新しい「👋（wave）」を送ったことを承認するまで、コントラクトからの応答をフロントエンドが待機するよう設定しています。

`.wave()`関数ではブロックチェーン上の書き込みが発生するので、ガス代がかかります。よって、ユーザーは取引を確認する必要があります。

MetaMaskを使っていて、取引を承認するために数秒手間どった経験はありませんか？

あなたが承認を行っている間、コードは次の処理に進まず、待機しています。

承認が終わったら、`await waveTxn.wait()`が実行され、トランザクションの結果を取得します。コードが冗長に感じるかもしれませんが、大事な処理です。

```js
waveCount = await waveContract.getTotalWaves();
```

ここで最後に、`waveCount`をもう一度取得して、`+1`されたかどうかを確認します。

### 🧙‍♀️ テストを実行しよう

ルートディレクトリにいることを確認して、ターミナルで下記を実行してみましょう。

```
yarn contract run:script
```

例)ターミナルの出力結果

```
Compiled 1 Solidity file successfully
Here is my first smart contract!
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Contract deployed by: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
We have 0 total waves!
0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 has waved!
We have 1 total waves!
```

あなたのターミナルでも同じような結果が出力されたでしょうか？

この結果は、あなたがこのスマートコントラクトの`owner`であり、同時にあなた自身が自分に「👋（wave）」を送ったことを示しています。

ですので、`Contract deployed by`に続くアドレスと、「`0x...` has waved!」のアドレスは一致しているはずです。

ここまで実装した内容は、ほとんどのスマートコントラクトの基本になるものです。

1. 関数を読み込む。
2. 関数を書き込む。
3. 状態変数を変更する。

これらは、WavePortalのWebサイトを構築する上で大切な要素です。

### 🤝 ほかのユーザーに 👋（wave）を送ってもらう

ここでは、ほかのユーザーがあなたに「👋（wave）」を送った場合のシミュレーションを行います。

下記を`run.js`に反映させて、ターミナルにどのような結果がでるかテストしてみましょう。

```js
const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  const wavePortal = await waveContract.deployed();

  console.log("Contract deployed to:", wavePortal.address);
  console.log("Contract deployed by:", owner.address);

  let waveCount;
  waveCount = await waveContract.getTotalWaves();

  let waveTxn = await waveContract.wave();
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();

  waveTxn = await waveContract.connect(randomPerson).wave();
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();
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

`run.js`に追加されたコードは以下になります。確認していきましょう。

```js
waveTxn = await waveContract.connect(randomPerson).wave();
await waveTxn.wait();
waveCount = await waveContract.getTotalWaves();
```

このレッスンの序盤で、`run.js`の中で`randomPerson`のアドレスを取得したのを覚えていますか？

- `randomPerson`には、Hardhatが取得したランダムなアドレスが格納されています。
- `randomPerson`は、このシミュレーションのために存在していたのです。

```js
waveTxn = await waveContract.connect(randomPerson).wave();
```

ここでは、`.connect(randomPerson)`を用いて、ほかのユーザーがあなたに「👋（wave）」を送った状態をシミュレーションしています。

```js
await waveTxn.wait();
waveCount = await waveContract.getTotalWaves();
```

ここでは、あなたが自分自身に「👋（wave）」を送り、その承認を持ってから　`waveCount`の値を更新したように、`randomPerson`の挙動を確認してから`waveCount`の更新(`+1`)を行っています。

それでは、`run.js`を更新して、下記を実行してみましょう。

```
yarn contract run:script
```

下記のような結果がターミナルに出力されれば成功です。

例)ターミナルの出力結果

```
Here is my first smart contract!
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Contract deployed by: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
We have 0 total waves!
0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 has waved!
We have 1 total waves!
0x70997970c51812dc3a010c7d01b50e0d17dc79c8 has waved!
We have 2 total waves!
```

`We have # total waves!`の`#`が更新されていることを確認してください。

一人の目の「👋（wave）」はあなた自身なので`We have 1 total waves!`の前に表示されているアドレスは、`Contract deployed by`に続くアドレスと一致していることを確認してください。

`We have 2 total waves!`に続くアドレスは、Hardhatが取得した`randomPerson`のアドレスです。

下記のように`run.js`に`randomPerson`を追加すると、さらにもう一人追加して、シミュレーションを行うこともできます。

```js
const [owner, randomPerson1, randomPerson2] = await hre.ethers.getSigners();
```

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

次のレッスンでは、テスト環境にあなたのスマートコントラクトをデプロイします。次に進みましょう 🎉

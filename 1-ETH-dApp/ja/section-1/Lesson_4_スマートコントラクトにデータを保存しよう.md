📦 データを保存しよう
------------------

このレッスンでは、ユーザーがあなたに送った「👋（wave）」の数をデータとして保存する方法を学びます。

ブロックチェーンは、AWS のようなクラウド上にデータを保存できるサーバーのようなものです。

しかし、誰もそのデータを所有していません。

世界中に、ブロックチェーン上にデータを保存する作業を行う「マイナー」と呼ばれる人々が存在します。この作業に対して、わたしたちは代金を支払います。

その代金は、通称**ガス代**と呼ばれます。

イーサリアムのブロックチェーン上にデータを書き込む場合、わたしたちは代金として `$ETH` を「マイナー」に支払います。

それでは、「👋（wave）」を保存するために、`WavePortal.sol` を更新していきましょう。

```javascript
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract WavePortal {

    uint256 totalWaves;

    constructor() {
        console.log("Here is my first smart contract!");
    }

    function wave() public {
        totalWaves += 1;
        console.log("%s has waved!", msg.sender);
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}
```

新しく追加されたコードの理解を深めましょう。

```javascript
// WavePortal.sol
uint256 totalWaves;
```

自動的に `0` に初期化される `totalWaves` 変数が追加されました。この変数は「状態変数」と呼ばれ、`WavePortal` コントラクトのストレージに永続的に保存されます。

- [unit256](https://www.iuec.co.jp/blockchain/uint256.html) は、非常に大きな数を扱うことができる「独自定義のクラス」を意味します。

🎁 Solidity のアクセス修飾子について
------------------

```javascript
// WavePortal.sol
function wave() public {
    totalWaves += 1;
    console.log("%s has waved!", msg.sender);
}
```

ここで、「👋（wave）」の回数を記録する `wave()` 関数が追加されました。まず、`public`について見ていきます。

これは、Solidity のアクセス修飾子の一つです。

Solidity 含め様々な言語において、各関数のアクセス権限について指定する必要があります。その指定を行うのが、アクセス修飾子です。

Solidityには、4つのアクセス修飾子が存在します。

1. **`public`**: `public` で定義された関数や変数は、それらが定義されているコントラクト、そのコントラクトが継承された別のコントラクト、それらコントラクトの外部と、**基本的にどこからでも**呼び出すことができます。*Solidityでは、アクセス修飾子がついてない**関数**を、自動的に `public` として扱います。*

2. **`private`**: `private` で定義された関数や変数は、**それらが定義されたコントラクトでのみ**呼び出すことができます。

3. **`internal`**: `internal` で定義された関数や変数は、**それらが定義されたコントラクト**と、**そのコントラクトが継承された別のコントラクト**の**両方**から呼び出すことができます。
*Solidity では、アクセス修飾子がついてない**変数**を、自動的に `internal` として扱います。*

4. **`external`**: `external`で定義された関数は変数は、**外部からのみ**呼び出すことができます。

以下に、Solidity のアクセス修飾子とアクセス権限についてまとめています。


|  |  <p align = center> コントラクトの外からの呼び出し</p> | <p align = center>コントラクトの内からの呼び出し</p>| <p align = center>コントラクトの継承先からの呼び出し</p> |
| ----------- | ----------- |----------- |----------- |
| <p align = center> public<br>（関数の初期設定）</p>|<p align = center> ✅</p>|<p align = center> ✅</p>|<p align = center> ✅</p>|
|  <p align = center> private</p>|<p align = center>❌</p>|<p align = center> ✅</p>|<p align = center>❌</p>|
|  <p align = center> internal<br>（変数の初期設定）</p>|<p align = center>❌</p>|<p align = center> ✅</p>|<p align = center> ✅</p>|
|  <p align = center> external</p>|<p align = center> ✅</p>|<p align = center>❌</p>|<p align = center>❌</p>|


これから Solidity のアクセス修飾子は頻繁に登場するので、まずは大まかな理解ができれば大丈夫です。

🔍 `msg.sender` について
------------------
```javascript
// WavePortal.sol
function wave() public {
    totalWaves += 1;
    console.log("%s has waved!", msg.sender);
}
```
`wave()` 関数の中に `msg.sender` が登場するのをお気づきでしょうか？

`msg.sender` に入る値は、ずばり、**関数を呼び出した人（＝あなたに「👋（wave）」を送った人）のウォレットアドレス**です。

これは、**ユーザー認証**のようなものです。

- スマートコントラクトに含まれる関数を呼び出すには、ユーザーは有効なウォレットを接続する必要があります。

- `msg.sender` では、誰が関数を呼び出したかを正確に把握し、ユーザー認証を行っています。

🖋 Solidity の関数修飾子について
------------------

Solidity には、関数（function）に対してのみ使用される修飾子（＝関数修飾子）が存在します。

Solidity 開発では関数修飾子を意識しておかないとデータを記録する際のコスト（＝ガス代）が跳ね上がってしまうので注意が必要です。

ここでポイントとなるのは、**ブロックチェーンに値を書き込むにはガス代を払う必要があること、そしてブロックチェーンから値を参照するだけなら、ガス代を払う必要がないことです。**

ここでは、主要な2つの関数修飾子を紹介します。

1. **`view`**: `view` 関数は、読み取り専用の関数であり、呼び出した後に関数の中で定義された状態変数が変更されないようにします。

2. **`pure`**: `pure` 関数は、関数の中で定義された状態変数を読み込んだり変更したりせず、関数に渡されたパラメータや関数に存在するローカル変数のみを使用して値を返します。

以下に、Solidity の関数修飾子 `pure` と `view` についてまとめています。

|  | <p align = center>関数の中で定義された状態変数をブロックチェーン上で参照する（read）</p> | <p align = center>関数の中で定義された状態変数をブロックチェーン上に書き込む（write）|
| ----------- | ----------- |----------- |
| <p align = center> 関数修飾子がついていない関数<br>（デフォルト）</p>|<p align = center>✅</p>|<p align = center>✅</p>|
|  <p align = center> `view`関数</p>|<p align = center>✅</p>|<p align = center>❌</p>|
| <p align = center> `pure`関数</p>|<p align = center>❌</p>|<p align = center>❌</p>|


ここまでで理解して欲しいのは、`pure` や `view` 関数を使用すれば、**ガス代を削減できる**ということです。

同時に、ブロックチェーン上にデータを書き込まないことで、**処理速度も向上します**。

`WavePortal.sol` に追加された下記の関数を見ていきましょう。

```javascript
// WavePortal.sol
function wave() public {
    totalWaves += 1;
    console.log("%s has waved!", msg.sender);
}
```

`wave()` 関数には関数修飾子がついていないことをお気づきでしょうか。

- 同一のユーザーが送った「👋（wave）」の回数が `totalWaves += 1` によってカウントされ、ブロックチェーン上にデータが書き込まれます。

- また、この関数が呼び出されると、`console.log("%s has waved!", msg.sender)` によって、あなたに「👋（wave）」を送ったユーザーのアドレスがターミナル上に表示されます。

それでは、下記のコードも見ていきましょう。

```javascript
// WavePortal.sol
function getTotalWaves() public view returns (uint256) {
    console.log("We have %d total waves!", totalWaves);
    return totalWaves;
}
```

一方、`view` という関数修飾子がついた `getTotalWaves()` 関数は、ユーザーがあなたに送った「👋（wave）」の総数の参照のみを行います。

✅ `run.js` を更新して関数を呼び出す
---------------------------------------

次に、`run.js` を以下のように更新していきます。

```javascript
// run.js
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

`WavePortal.sol` の中で `public` と指定した `wave()` 関数と `getTotalWaves()` 関数は、ブロックチェーン上で呼び出すことができるようになりました。

`run.js`から、それら関数を呼び出していきます。

- 復習となりますが、 `run.js` はデバッグ用のテストコードです。

- `run.js` は本番環境でユーザーがあなたのスマートコントラクトを呼び出すシチュエーションを想定して、コードが問題なく走るかテストするために、作られています。

`public` で定義した関数は API のエンドポイントのようなものです。

更新された部分を1行ずつ見ていきましょう。

```javascript
// run.js
const [owner, randomPerson] = await hre.ethers.getSigners();
```

ブロックチェーンに `WavePortal` コントラクトをデプロイする際、「👋（wave）」を送る側のウォレットアドレスが必要です。

`hre.ethers.getSigners()` はHardhat が提供するランダムなアドレスを生成する関数です。

- ここでは、コントラクト所有者（＝あなた）のウォレットアドレスと、あなたに「👋（wave）」を送るユーザーのウォレットアドレスを Hardhat がそれぞれ生成し、`owner` と `randomPerson` という変数に格納しています。

- `randomPerson` は、テスト環境で「👋（wave）」を送ってくるユーザーだと思ってください。

次に、下記のコードを見ていきましょう。

```javascript
// run.js
  console.log("Contract deployed to:", wavePortal.address);
```

ここでは、あなたのスマートコントラクトのデプロイ先のアドレス（＝ `wavePortal.address` ）をターミナルに出力しています。

```javascript
// run.js
console.log("Contract deployed by:", owner.address);
```

ここでは、`WavePortal` コントラクトをデプロイした人（＝あなた）のアドレス（＝ `owner.address` ）をターミナルに出力しています。

最後に、下記のコードを見ていきましょう。

```javascript
// run.js
let waveCount;
waveCount = await waveContract.getTotalWaves();

let waveTxn = await waveContract.wave();
await waveTxn.wait();

waveCount = await waveContract.getTotalWaves();
```

ここでは、通常の API と同じように、関数を手動で呼び出しています。1行ずつ見ていきましょう。

```javascript
// run.js
let waveCount;
waveCount = await waveContract.getTotalWaves();
```

まず、`let waveCount` でローカル変数を宣言します。

次に、`waveContract.getTotalWaves()` で `WavePortal.sol` に記載された `getTotalWaves()` を呼び出し、既存の「👋（wave）」の総数を取得します。

```javascript
// run.js
let waveTxn = await waveContract.wave();
await waveTxn.wait();
```

`let waveTxn = await waveContract.wave()` では、ユーザーが新しい「👋（wave）」を送ったことを承認するまで、コントラクトからの応答をフロントエンドが待機するよう設定しています。

`.wave()` 関数ではブロックチェーン上の書き込みが発生するので、ガス代がかかります。よって、ユーザーは取引を確認する必要があります。

Metamask を使っていて、取引を承認するために数秒手間取った経験はありませんか？あなたが承認を行っている間、コードは次の処理に進まず、待機しています。

承認が終わったら、`await waveTxn.wait()` が実行され、トランザクションの結果を取得します。コードが冗長に感じるかもしれませんが、大事な処理です。

```javascript
// run.js
waveCount = await waveContract.getTotalWaves();
```

ここで最後に、`waveCount` をもう一度取得して、`+1` されたかどうかを確認します。

🧙‍♀️ テストを実行しよう
---------------------------------------

`scripts` ディレクトリに移動し、下記を実行してみましょう。

```bash
npx hardhat run run.js
```

例）ターミナルの出力結果

```
Here is my first smart contract!
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Contract deployed by: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
We have 0 total waves!
0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 has waved!
We have 1 total waves!
```

あなたのターミナルでも同じような結果が出力されたでしょうか？

この結果は、あなたがこのスマートコントラクトの `owner` であり、同時にあなた自身が自分に「👋（wave）」を送ったことを示しています。

なので、`Contract deployed by` に続くアドレスと、「 `address 0x... has waved!` 」のアドレスは一致しているはずです。

ここまでで実装した内容は、ほとんどのスマートコントラクトの基本になるものです。

1. 関数を読み込む。
2. 関数を書き込む。
3. 状態変数を変更する。

これらは、WavePortal のWEBサイトを構築する上で大切な要素です。

🤝 他のユーザーに👋（wave）を送ってもらう
--------------------

ここでは、他のユーザーがあなたに「👋（wave）」を送った場合のシミューションを行います。

下記を`run.js`  に反映させて、ターミナルにどのような結果がでるかテストしてみましょう。

```javascript
// run.js
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

`run.js` に追加されたコードは以下になります。確認していきましょう。

```javascript
// run.js
waveTxn = await waveContract.connect(randomPerson).wave();
await waveTxn.wait();
waveCount = await waveContract.getTotalWaves();
```

このレッスンの序盤で、`run.js` の中で `randomPerson` のアドレスを取得したのを覚えていますか？

- `randomPerson` には、Hardhat が取得したランダムなアドレスが格納されています。

- `randomPerson` は、このシミューションのために存在していたのです。

```javascript
// run.js
waveTxn = await waveContract.connect(randomPerson).wave();
```

ここでは、`.connect(randomPerson)` を用いて、他のユーザーがあなたに「👋（wave）」を送った状態をシミュレーションしています。

```javascript
// run.js
await waveTxn.wait();
waveCount = await waveContract.getTotalWaves();
```

ここでは、あなたが自分自身に「👋（wave）」を送り、その承認を持ってから、`waveCount` の値を更新したように、`randomPerson` の挙動を確認してから、`waveCount` の更新（ `+1` ）を行っています。

それでは、`run.js` を更新して、`scripts` ディレクトリに移動し、下記を実行してみましょう。

```bash
npx hardhat run run.js
```

下記のような結果がターミナルに出力されれば成功です。

例）ターミナルの出力結果
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

`We have # total waves!` の `#` が更新されていることを確認してください。

一人の目の「👋（wave）」はあなた自身なので `We have 1 total waves!` の前に表示されているアドレスは、`Contract deployed by` に続くアドレスと一致していることを確認してください。

`We have 2 total waves!` に続くアドレスは、Hardhatが取得した `randomPerson` のアドレスです。

下記のように `run.js` に `randomPerson` を追加すると、さらにもう一人追加して、シミュレーションを行うこともできます。

```javascript
// run.js
const [owner, randomPerson1, randomPerson2] = await hre.ethers.getSigners();
```

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
次のレッスンでは、テスト環境にあなたのスマートコントラクトをデプロイします。次に進みましょう🎉

### 🎲 0.0001ETH を送るユーザーをランダムに選ぶ

現在、コントラクトはすべてのユーザーに0.0001ETHを送るように設定されています。

しかし、それでは、コントラクトはすぐに資金を使い果たしてしまうでしょう。

これを防ぐために、これから下記の機能を`WavePortal.sol`に実装していきます。

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    /* 乱数生成のための基盤となるシード（種）を作成 */
    uint256 private seed;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    constructor() payable {
        console.log("We have been constructed!");
        /*
         * 初期シードを設定
         */
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        totalWaves += 1;
        console.log("%s has waved!", msg.sender);

        waves.push(Wave(msg.sender, _message, block.timestamp));

        /*
         * ユーザーのために乱数を生成
         */
        seed = (block.difficulty + block.timestamp + seed) % 100;

        console.log("Random # generated: %d", seed);

        /*
         * ユーザーがETHを獲得する確率を50％に設定
         */
        if (seed <= 50) {
            console.log("%s won!", msg.sender);

            /*
             * ユーザーにETHを送るためのコードは以前と同じ
             */
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        } else {
            console.log("%s did not win.", msg.sender);
		}

        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        return totalWaves;
    }
}
```

コードを見ていきましょう。

```solidity
uint256 private seed;
```

ここでは、乱数を生成するために使用する初期シード（乱数の種）を定義しています。

```solidity
constructor() payable {
	console.log("We have been constructed!");
	/* 初期シードを設定 */
	seed = (block.timestamp + block.difficulty) % 100;
}
```

ここでは、`constructor`の中にユーザーのために生成された乱数を`seed`に格納しています。

`block.difficulty`と`block.timestamp`の2つは、Solidityから与えられた数値です。

- `block.difficulty`は、ブロック承認（＝マイニング）の難易度をマイナーに通知するための値です。ブロック内のトランザクションが多いほど、難易度は高くなります。

- `block.timestamp`は、ブロックが処理されている時のUNIXタイムスタンプです。

そして、`％100`により、数値を0〜100の範囲に設定しています。

次に下記のコードを確認しましょう。

```solidity
function wave(string memory _message) public {
	totalWaves += 1;
	console.log("%s has waved!", msg.sender);

	waves.push(Wave(msg.sender, _message, block.timestamp));

	/* ユーザーのために乱数を生成 */
	seed = (block.difficulty + block.timestamp + seed) % 100;
	:
```

ここで、ユーザーが`wave`を送信するたびに`seed`を更新しています。

これにより、ランダム性の担保を行っています。ランダム性を強化することにより、ハッカーからの攻撃を防げます。

最後に下記のコードを見ていきましょう。

```solidity
if (seed <= 50) {
	console.log("%s won!", msg.sender);
	:
```

ここでは、`seed`の値が、50以下であるかどうかを確認するために、`if`ステートメントを実装しています。

`seed`の値が50以下の場合、ユーザーはETHを獲得できます。

> ✍️: 乱数が「ランダムであること」の重要性
> 「ユーザーに ETH がランダムで配布される」ようなゲーム性のあるサービスにおいて、ハッカーからの攻撃を防ぐことは大変重要です。
>
> ブロックチェーン上にコードは公開されているので、信頼できる乱数生成のアルゴリズムは、手動で作る必要があります。
>
> 乱数の生成は、一見面倒ではありますが、何百万人ものユーザーがアクセスする dApp を構築する場合は、とても重要な作業となります。

### ☕️ 作成した機能の動作確認

下記のように、`run.js`を更新して、ユーザーにランダムにETHを送れるか確認してみましょう。

```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  /*
   * デプロイする際0.1ETHをコントラクトに提供する
   */
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await waveContract.deployed();
  console.log("Contract deployed to: ", waveContract.address);

  /*
   * コントラクトの残高を取得（0.1ETH）であることを確認
   */
  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  /*
   * 2回 waves を送るシミュレーションを行う
   */
  const waveTxn = await waveContract.wave("This is wave #1");
  await waveTxn.wait();

  const waveTxn2 = await waveContract.wave("This is wave #2");
  await waveTxn2.wait();

  /*
   * コントラクトの残高を取得し、Waveを取得した後の結果を出力
   */
  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  /*
   *コントラクトの残高から0.0001ETH引かれていることを確認
   */
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let allWaves = await waveContract.getAllWaves();
  console.log(allWaves);
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

それでは、ターミナル上で下記のコードを実行してみましょう。

```
yarn contract run:script
```

次のような結果が、ターミナルに出力されたでしょうか？

```bash
Compiling 1 file with 0.8.17
Solidity compilation finished successfully
We have been constructed!
Contract deployed to:  0x5FbDB2315678afecb367f032d93F642f64180aa3
Contract balance: 0.1
0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 has waved!
Random # generated: 89
0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 did not win.
Contract balance: 0.1
0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 has waved!
Random # generated: 31
0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 won!
Contract balance: 0.0999
[
  [
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    'This is wave #1',
    BigNumber { value: "1643887441" },
    waver: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    message: 'This is wave #1',
    timestamp: BigNumber { value: "1643887441" }
  ],
  [
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    'This is wave #2',
    BigNumber { value: "1643887442" },
    waver: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    message: 'This is wave #2',
    timestamp: BigNumber { value: "1643887442" }
  ]
]
```

下記を見てみましょう。

一人目のユーザーは、乱数の結果`89`という値を取得したので、ETHを獲得できませんでした。`Contract balance`は0.1ETHのままです。

```bash
0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 has waved!
Random # generated: 89
0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 did not win.
Contract balance: 0.1
```

次に、二人目のユーザーの結果を見てみましょう。

```
0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 has waved!
Random # generated: 31
0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 won!
Contract balance: 0.0999
```

二人目のユーザーは、乱数の結果`31`という値を取得したので、ETHを獲得しました。

`Contract balance`が、0.0999ETHに更新されていることを確認してください。

### 🚔 スパムを防ぐためのクールダウンを実装する

最後に、スパムを防ぐためのクールダウン機能を実装していきます。

ここでいうスパムは、あなたのWebアプリケーションから連続して`wave`を送って、ETHを稼ごうとする動作を意味します。

それでは、下記のように`WavePortal.sol`を更新しましょう。

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    uint256 private seed;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    /*
     * "address => uint mapping"は、アドレスと数値を関連付ける
     */
    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        console.log("We have been constructed!");
        /*
         * 初期シードの設定
         */
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        /*
         * 現在ユーザーがwaveを送信している時刻と、前回waveを送信した時刻が15分以上離れていることを確認。
         */
        require(
            lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
            "Wait 15m"
        );

        /*
         * ユーザーの現在のタイムスタンプを更新する
         */
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        console.log("%s has waved!", msg.sender);

        waves.push(Wave(msg.sender, _message, block.timestamp));

        /*
         *  ユーザーのために乱数を設定
         */
        seed = (block.difficulty + block.timestamp + seed) % 100;

        if (seed <= 50) {
            console.log("%s won!", msg.sender);

            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than they contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        return totalWaves;
    }
}
```

新しく追加したコードを見ていきましょう。

```solidity
mapping(address => uint256) public lastWavedAt;
```

ここでは、`mapping`と呼ばれる特別なデータ構造を使用しています。

Solidityの`mapping`は、ほかの言語におけるハッシュテーブルや辞書のような役割を果たします。

これらは、下記のように`_Key`と`_Value`のペアの形式でデータを格納するために使用されます。

```javascript
mapping（_Key=> _Value）public mappingName
```

今回は、ユーザーのアドレス(= `_Key` = `address`)をそのユーザーが`wave`を送信した時刻(= `_Value` = `uint256`)に関連付けるために`mapping`を使用しました。

理解を深めるために、次のコードを見ていきましょう。

```solidity
function wave(string memory _message) public {
	/* 現在ユーザーがwaveを送信している時刻と、前回waveを送信した時刻が15分以上離れていることを確認。*/
	require(
		lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
		"Wait 15m"
	);
```

ここでは、Webアプリケーション上で現在ユーザーが`wave`を送ろうとしている時刻と、そのユーザーが前回`wave`を送った時刻を比較して、15分以上経過しているか検証しています。

`lastWavedAt[msg.sender]`の初期値は`0`ですので、まだ一度も`wave`を送ったことがないユーザーは、`wave`を送信できます。

15分待たずに`wave`を送ろうとしてくるユーザーには、`"Wait 15min"`というアラートを返します。これにより、スパムを防止しています。

最後に、下記のコードを確認してください。

```solidity
lastWavedAt[msg.sender] = block.timestamp;
```

ここで、ユーザーが`wave`を送った時刻がタイムスタンプとして記録されます。

`mapping(address => uint256) public lastWavedAt`でユーザーのアドレスと`lastWavedAt`を紐づけているので、これで次に同じユーザーが`wave`を送ってきた時に、15分経過しているか検証できます。

### 🧙‍♂️ テストを作成・実行する

ここまでの作業でコントラクトには基本機能として以下の機能が追加されました。

* コントラクトにトークンを提供する機能
* waveを送信する機能
* ランダムにトークンを送金する機能

これらの基本機能をテストスクリプトとして記述していきましょう。

`run.js`ではconsole.logメソッドなどを用いて結果がどのようになるかを具体的な値を
出力することで確認していましたが、`test.js`では期待される値と一致するかを確認します。いわば最終確認のようなものです。

ではpackages/contract/testに`test.js`という名前でファイルを作成して、以下のように記述しましょう。

```
const hre = require('hardhat');
const { expect } = require('chai');

describe('Wave Contract', function () {
  it('test if wave and token are sent', async function () {
    const waveContractFactory = await hre.ethers.getContractFactory(
      'WavePortal',
    );
    /*
     * デプロイする際0.1ETHをコントラクトに提供する
     */
    const waveContract = await waveContractFactory.deploy({
      value: hre.ethers.utils.parseEther('0.1'),
    });
    await waveContract.deployed();
    /*
     * コントラクトの残高を取得（0.1ETH）
     */
    const contractBalanceBefore = hre.ethers.utils.formatEther(
      await hre.ethers.provider.getBalance(waveContract.address),
    );

    /*
     * 2回 waves を送るシミュレーションを行う
     */
    const waveTxn = await waveContract.wave('This is wave #1');
    await waveTxn.wait();

    const waveTxn2 = await waveContract.wave('This is wave #2');
    await waveTxn2.wait();

    /*
     * コントラクトの残高を取得し、Waveを取得した後の結果を出力
     */
    const contractBalanceAfter = hre.ethers.utils.formatEther(
      await hre.ethers.provider.getBalance(waveContract.address),
    );

    /*
     *勝利した回数に応じてコントラクトから出ていくトークンを計算
     */
    const allWaves = await waveContract.getAllWaves();
    let cost = 0;
    for (let i = 0; i < allWaves.length; i++) {
      if (allWaves[i].seed <= 50) {
        cost += 0.0001;
      }
    }

    /*
     *メッセージの送信をテスト
     */
    expect(allWaves[0].message).to.equal('This is wave #1');
    expect(allWaves[1].message).to.equal('This is wave #2');

    /*
     *コントラクトのトークン残高がwave時の勝負による減少に連動しているかテスト
     */
    expect(parseFloat(contractBalanceAfter)).to.equal(
      contractBalanceBefore - cost,
    );
  });
});
```

ターミナル上で下記のコマンドを実行してみましょう。

```
yarn contract test
```

`WavePortal.sol`の39~42行目の`require文`によってエラーが出るでしょう。なぜなら15分の間隔を空けることなくwaveを送ろうとしたからです。

ではこちらをコメントアウトして再度テストコマンドを実行してみてください。

下記のようなメッセージが出力されていればテスト成功です！
```
Compiled 2 Solidity files successfully


  Wave Contract
We have been constructed!
0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 has waved!
0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 has waved!
    ✔ test if wave and token are sent (1446ms)


  1 passing (1s)

✨  Done in 6.09s.
```

### 🧞‍♀️ デプロイする？

`deploy.js`を更新する必要はないので、ここまでのデプロイは任意です。

あなたのWavePortalをどのように構築するかは、あなたの自由です 🌈

ここまでのレッスンを参考にして、下記を自由に設定してみましょう。あなただけのWebアプリケーションを完成させてください。

- `WavePortal.sol`の`uint256 prizeAmount`を更新して、ユーザーに送るETHの金額を再設定する

- `deploy.js`の`hre.ethers.utils.parseEther("0.001")`を更新して、コントラクトに提供する資金を再設定する

- `WavePortal.sol`に記載されている`15 minutes`を調整して、バッファ期間を調整する(※テストに関しては、`30 seconds`を推奨しています)

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

プロジェクトはほぼ完成です。次のレッスンに進みましょう 🎉

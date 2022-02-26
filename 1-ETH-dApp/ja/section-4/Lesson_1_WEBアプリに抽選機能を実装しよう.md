🎲 0.001ETHを送るユーザーをランダムに選ぶ
-----------------------

現在、コントラクトは全てのユーザーに 0.001ETH を送るように設定されています。

しかし、それでは、コントラクトはすぐに資金を使い果たしてしまうでしょう。

これを防ぐために、これから下記の機能を `WavePortal.sol` に実装していきます。

```javascript
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

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

```javascript
// WavePortal.sol
uint256 private seed;
```

ここでは、乱数を生成するために使用する初期シード（乱数の種）を定義しています。

```javascript
// WavePotal.sol
constructor() payable {
	console.log("We have been constructed!");
	/* 初期シードを設定 */
	seed = (block.timestamp + block.difficulty) % 100;
}
```
ここでは、`constructor` の中にユーザーのために生成された乱数を `seed` に格納しています。

`block.difficulty` と `block.timestamp` の2つは、Solidityから与えられた数値です。

- `block.difficulty` は、ブロック承認（＝マイニング）の難易度をマイナーに通知するための値です。ブロック内のトランザクションが多いほど、難易度は高くなります。

- `block.timestamp` は、ブロックが処理されている時のUnixタイムスタンプです。

そして、`％100` により、数値を0〜100の範囲に設定しています。

次に下記のコードを確認しましょう。
```javascript
// WavePotal.sol
function wave(string memory _message) public {
	totalWaves += 1;
	console.log("%s has waved!", msg.sender);

	waves.push(Wave(msg.sender, _message, block.timestamp));

	/* ユーザーのために乱数を生成 */
	seed = (block.difficulty + block.timestamp + seed) % 100;
	:
```

ここで、ユーザーが `wave` を送信するたびに `seed` を更新しています。

これにより、ランダム性の担保を行っています。ランダム性を強化することにより、ハッカーからの攻撃を防げるようになります。

最後に下記のコードを見ていきましょう。
```javascript
// WavePortal.sol
if (seed <= 50) {
	console.log("%s won!", msg.sender);
	:
```

ここでは、`seed` の値が、50以下であるかどうかを確認するために、`if` ステートメントを実装しています。

`seed` の値が 50 以下の場合、ユーザーは ETH を獲得することができます。

✍️: 乱数が「ランダムであること」の重要性

> 「ユーザーに ETH がランダムで配布される」ようなゲーム性のあるサービスにおいて、ハッカーからの攻撃を防ぐことは大変重要です。
>
> ブロックチェーン上にコードは公開されているので、信頼できる乱数生成のアルゴリズムは、手動で作る必要があります。
>
> 乱数の生成は、一見面倒ではありますが、何百万人ものユーザーがアクセスする dApp を構築する場合は、とても重要な作業となります。

☕️ テストを実行する
-------

下記のように、`run.js` を更新して、ユーザーにランダムにETHを送れるかテストしてみましょう。

```javascript
// run.js
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
   * コントラクトのバランスを取得（0.1ETH）であることを確認
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
   * コントラクトのバランスを取得し、Waveを取得した後の結果を出力
   */
  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  /*
   *契約の残高から0.0001ETH引かれていることを確認
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

それでは、ターミナル上で `my-wave-portal` に移動し、下記のコードを実行してみましょう。

```
npx hardhat run scripts/run.js
```

次のような結果が、ターミナルに出力されたでしょうか？

```bash
Compiling 1 file with 0.8.4
Solidity compilation finished successfully
We have been constructed!
Contract deployed to:  0x5FbDB2315678afecb367f032d93F642f64180aa3
Contract balance: 0.1
0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 has waved!
Random # generated: 89
0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 did not win.
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

一人目のユーザーは、乱数の結果 `89` という値を取得したので、ETH を獲得することができませんでした。`Contract balance` は 0.1ETH のままです。

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
二人目のユーザーは、乱数の結果 `31` という値を取得したので、ETHを獲得しました。

`Contract balance` が、0.0999ETH に更新されていることを確認してください。

🚔 スパムを防ぐためのクールダウンを実装する
-----------------------------

最後に、スパムを防ぐためのクールダウン機能を実装していきます。

ここでいうスパムは、あなたのWEBアプリから連続して `wave` を送って、ETH を稼ごうとする動作を意味します。

それでは、下記のように `WavePortal.sol` を更新しましょう。

```javascript
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

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

```javascript
// WavePortal.sol
mapping(address => uint256) public lastWavedAt;
```
ここでは、`mapping` と呼ばれる特別なデータ構造を使用しています。

Solidity の `mapping` は、他の言語におけるハッシュテーブルや辞書のような役割を果たします。

これらは、下記のように `_Key` と `_Value` のペアの形式でデータを格納するために使用されます。

```solidity
mapping（_Key=> _Value）public mappingName
```

今回は、ユーザーのアドレス（= `_Key` = `address` ）をそのユーザーが `wave` を送信した時刻（= `_Value` = `unit256` ）に関連付けるために `mapping` を使用しました。

理解を深めるために、次のコードを見ていきましょう。

```javascript
// WavePortal.sol
function wave(string memory _message) public {
	/* 現在ユーザーがwaveを送信している時刻と、前回waveを送信した時刻が15分以上離れていることを確認。*/
	require(
		lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
		"Wait 15m"
	);
```

ここでは、WEBアプリ上で現在ユーザーが `wave` を送ろうとしている時刻と、そのユーザーが前回 `wave` を送った時刻を比較して、15分以上経過しているか検証しています。

`lastWavedAt[msg.sender]` の初期値は `0` なので、まだ一度も `wave` を送ったことがないユーザーは、`wave` を送信することができます。

15分待たずに `wave` を送ろうとしてくるユーザーには、`"Wait 15min"` というアラートを返します。これにより、スパムを防止しています。

最後に、下記のコードを確認してください。
```javascript
// WavePortal.sol
lastWavedAt[msg.sender] = block.timestamp;
```

ここで、ユーザーが `wave` を送った時刻がタイムスタンプとして記録されます。

`mapping(address => uint256) public lastWavedAt` でユーザーのアドレスと `lastWavedAt` を紐づけているので、これで次に同じユーザーが `wave` を送ってきた時に、15分経過しているか検証することができます。

🧙‍♂️ テストを実行する
------------

ターミナル上で `my-wave-portal` に移動し、下記を続けて**2回**実行してみましょう。

```
npx hardhat run scripts/run.js
```

下記のようなエラーがターミナルに出力されているでしょうか？
```
Error: VM Exception while processing transaction: reverted with reason string 'Wait 15m'
```

`WavePortal.sol` に記載されている `15 minutes` を `0 minutes` に変更し、`npx hardhat run scripts/run.js` をもう一度実行すると、エラーはなくなります😊

🧞‍♀️ デプロイする？
------------

`deploy.js` を更新する必要はないので、ここまでのデプロイは任意です。

あなたの WavePortal をどのように構築するかは、あなたの自由です🌈

ここまでのレッスンを参考にして、下記を自由に設定してみましょう。あなただけのWEBアプリを完成させてください。

- `WavePortl.sol` の `uint256 prizeAmount` を更新して、ユーザーに送る ETH の金額を再設定する

- `deploy.js` の `hre.ethers.utils.parseEther("0.001")` を更新して、コントラクトに提供する資金を再設定する

- `WavePortal.sol` に記載されている `15 minutes` を調整して、バッファ期間を調整する（※テストに関しては、`30 seconds` を推奨しています）

🙋‍♂️ 質問する
-------------------------------------------
ここまでの作業で何かわからないことがある場合は、Discord の `#section-4-help` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください✨
```
1. 何をしようとしていたか
2. エラー文をコピー&ペースト
3. エラー画面のスクリーンショット
```
--------------
プロジェクトはほぼ完成です。次のレッスンに進みましょう🎉

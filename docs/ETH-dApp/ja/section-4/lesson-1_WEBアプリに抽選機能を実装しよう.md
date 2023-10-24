### 🎲 0.0001ETH を送るユーザーをランダムに選ぶ

現在、コントラクトはすべてのユーザーに0.0001ETHを送るように設定されています。

しかし、それでは、コントラクトはすぐに資金を使い果たしてしまうでしょう。

これを防ぐために、これから下記の機能を`WavePortal.sol`に実装していきます。

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "hardhat/console.sol";

contract WavePortal {
    uint256 private _totalWaves;

    /* 乱数生成のための基盤となるシード（種）を作成 */
    uint256 private _seed;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
        uint256 seed;
    }

    Wave[] private _waves;

    constructor() payable {
        console.log("We have been constructed!");
        /*
         * 初期シードを設定
         */
        _seed = (block.timestamp + block.prevrandao) % 100;
    }

    function wave(string memory _message) public {
        _totalWaves += 1;
        console.log("%s has waved!", msg.sender);

        /*
         * ユーザーのために乱数を生成
         */
        _seed = (block.prevrandao + block.timestamp + _seed) % 100;

        _waves.push(Wave(msg.sender, _message, block.timestamp, _seed));

        console.log("Random # generated: %d", _seed);

        /*
         * ユーザーがETHを獲得する確率を50％に設定
         */
        if (_seed <= 50) {
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
        return _waves;
    }

    function getTotalWaves() public view returns (uint256) {
        return _totalWaves;
    }
}
```

コードを見ていきましょう。

```solidity
uint256 private _seed;
```

ここでは、乱数を生成するために使用する初期シード（乱数の種）を定義しています。

```solidity
constructor() payable {
	console.log("We have been constructed!");
	/* 初期シードを設定 */
	_seed = (block.timestamp + block.prevrandao) % 100;
}
```

ここでは、`constructor`の中にユーザーのために生成された乱数を`_seed`に格納しています。

`block.prevrandao`と`block.timestamp`の2つは、Solidityから与えられた数値です。

- `block.prevrandao`は、Beacon Chain（proof-of-stake型ブロックチェーン）が提供する乱数です。

- `block.timestamp`は、ブロックが処理されている時のUNIXタイムスタンプです。

そして、`％100`により、数値を0〜100の範囲に設定しています。

次に下記のコードを確認しましょう。

```solidity
function wave(string memory _message) public {
    _totalWaves += 1;
    console.log("%s has waved!", msg.sender);

    /*
     * ユーザーのために乱数を生成
     */
    _seed = (block.prevrandao + block.timestamp + _seed) % 100

    _waves.push(Wave(msg.sender, _message, block.timestamp, _seed));

    console.log("Random # generated: %d", _seed);
```

ここで、ユーザーが`wave`を送信するたびに`_seed`を更新しています。

これにより、ランダム性の担保を行っています。ランダム性を強化することにより、ハッカーからの攻撃を防げます。

最後に下記のコードを見ていきましょう。

```solidity
if (_seed <= 50) {
	console.log("%s won!", msg.sender);
	:
```

ここでは、`_seed`の値が、50以下であるかどうかを確認するために、`if`ステートメントを実装しています。

`_seed`の値が50以下の場合、ユーザーはETHを獲得できます。

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
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
  /*
   * デプロイする際0.1ETHをコントラクトに提供する
   */
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.1'),
  });
  await waveContract.deployed();
  console.log('Contract deployed to: ', waveContract.address);

  /*
   * コントラクトの残高を取得（0.1ETH）であることを確認
   */
  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    'Contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
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
  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  /*
   *コントラクトの残高から0.0001ETH引かれていることを確認
   */
  console.log(
    'Contract balance:',
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

```
Compiling 1 file with 0.8.19
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
    BigNumber { value: "89" },
    waver: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    message: 'This is wave #1',
    timestamp: BigNumber { value: "1643887441" }
    seed: BigNumber { value: "89" }
  ],
  [
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    'This is wave #2',
    BigNumber { value: "1643887442" },
    BigNumber { value: "31" },
    waver: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    message: 'This is wave #2',
    timestamp: BigNumber { value: "1643887442" }
    seed: BigNumber { value: "31" }
  ]
]
```

下記を見てみましょう。

一人目のユーザーは、乱数の結果`89`という値を取得したので、ETHを獲得できませんでした。`Contract balance`は0.1ETHのままです。

```
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

pragma solidity ^0.8.19;

import "hardhat/console.sol";

contract WavePortal {
    uint256 private _totalWaves;
    uint256 private _seed;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
        uint256 seed;
    }

    Wave[] private _waves;

    /*
     * "address => uint mapping"は、アドレスと数値を関連付ける
     */
    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        console.log("We have been constructed!");
        /*
         * 初期シードの設定
         */
        _seed = (block.timestamp + block.prevrandao) % 100;
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

        _totalWaves += 1;
        console.log("%s has waved!", msg.sender);

        /*
         *  ユーザーのために乱数を設定
         */
        _seed = (block.prevrandao + block.timestamp + _seed) % 100;

        _waves.push(Wave(msg.sender, _message, block.timestamp, _seed));

        if (_seed <= 50) {
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
        return _waves;
    }

    function getTotalWaves() public view returns (uint256) {
        return _totalWaves;
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
mapping（_Key => _Value）public mappingName
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

`run.js`ではconsole.logメソッドなどを用いて、結果がどのようになるかを具体的な値を
出力することで目視確認していました。これは、機能が増えるほど大変な確認作業となってしまいます。

次に記述するテストは、各関数が期待する動作を行うか、コマンドを実行することで自動で確認されるようにします。

ではpackages/contract/testに`test.js`という名前でファイルを作成して、以下のように記述しましょう。

```javascript
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const hre = require('hardhat');
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('WavePortal', function () {
  // すべてのテストで同じセットアップを再利用するためにフィクスチャーを定義します。
  async function deployProjectFixture() {
    const wavePortalFactory = await ethers.getContractFactory('WavePortal');

    // コントラクトは、デフォルトで最初の署名者/アカウント（ここではuser1）を使用してデプロイされます。
    const [user1, user2] = await ethers.getSigners();

    const wavePortal = await wavePortalFactory.deploy({
      value: hre.ethers.utils.parseEther('0.1'),
    });

    await wavePortal.deployed();

    // 現在のコントラクトの残高を取得します。
    const wavePortalBalance = hre.ethers.utils.formatEther(
      await hre.ethers.provider.getBalance(wavePortal.address),
    );

    // waveを2回実行する関数を定義します。
    const sendTwoWaves = async () => {
      // user1, user2がそれぞれwaveを送ります。
      await wavePortal.connect(user1).wave('This is wave #1');
      await wavePortal.connect(user2).wave('This is wave #2');
    };

    return { wavePortal, wavePortalBalance, sendTwoWaves, user1, user2 };
  }

  // テストケース
  describe('getTotalWaves', function () {
    it('should return total waves', async function () {
      /** 準備 */
      const { wavePortal, sendTwoWaves } = await loadFixture(
        deployProjectFixture,
      );
      await sendTwoWaves();

      /** 実行 */
      const totalWaves = await wavePortal.getTotalWaves();

      /** 検証 */
      expect(totalWaves).to.equal(2);
    });
  });

  describe('getAllWaves', function () {
    it('should return all waves', async function () {
      /** 準備 */
      const { wavePortal, sendTwoWaves, user1, user2 } = await loadFixture(
        deployProjectFixture,
      );
      await sendTwoWaves();

      /** 実行 */
      const allWaves = await wavePortal.getAllWaves();

      /** 検証 */
      expect(allWaves[0].waver).to.equal(user1.address);
      expect(allWaves[0].message).to.equal('This is wave #1');
      expect(allWaves[1].waver).to.equal(user2.address);
      expect(allWaves[1].message).to.equal('This is wave #2');
    });
  });

  describe('wave', function () {
    context('when user waved', function () {
      it('should send tokens at random.', async function () {
        /** 準備 */
        const { wavePortal, wavePortalBalance, sendTwoWaves } =
          await loadFixture(deployProjectFixture);

        /** 実行 */
        await sendTwoWaves();

        /** 検証 */
        // wave後のコントラクトの残高を取得します。
        const wavePortalBalanceAfter = hre.ethers.utils.formatEther(
          await hre.ethers.provider.getBalance(wavePortal.address),
        );

        // 勝利した回数に応じてコントラクトから出ていくトークンを計算します。
        const allWaves = await wavePortal.getAllWaves();
        let cost = 0;
        for (let i = 0; i < allWaves.length; i++) {
          if (allWaves[i].seed <= 50) {
            cost += 0.0001;
          }
        }

        // コントラクトのトークン残高がwave時の勝負による減少に連動しているかテストします。
        expect(parseFloat(wavePortalBalanceAfter)).to.equal(
          wavePortalBalance - cost,
        );
      });
    });
    context(
      'when user1 tried to resubmit without waiting 15 mitutes',
      function () {
        it('reverts', async function () {
          /** 準備 */
          const { wavePortal, user1 } = await loadFixture(deployProjectFixture);

          /** 実行 */
          await wavePortal.connect(user1).wave('This is wave #1');

          /** 検証 */
          await expect(
            wavePortal.connect(user1).wave('This is wave #2'),
          ).to.be.revertedWith('Wait 15m');
        });
      },
    );
  });
});
```

簡単にテストの内容を解説します。

ここでは、3つの関数`getTotalWaves`、`getAllWaves`、`wave`をテストしています。

各テストは、3つのステップ「準備」「実行」「検証」で構成されています。

```javascript
  describe('getTotalWaves', function () {
    it('should return total waves', async function () {
      /** 準備 */
      const { wavePortal, sendTwoWaves } = await loadFixture(
        deployProjectFixture,
      );
      await sendTwoWaves();

      /** 実行 */
      const totalWaves = await wavePortal.getTotalWaves();

      /** 検証 */
      expect(totalWaves).to.equal(2);
    });
  });
```

まずは、「準備」のステップです。ここでは、`deployProjectFixture`を実行しています。deployProjectFixture内部ではWavePortalコントラクトのデプロイ、テストで使用したい機能や値を定義しています。

次に、「実行」のステップです。ここでは、実際に`getTotalWaves`関数を呼び出しています。

最後に、「検証」のステップです。ここでは、`getTotalWaves`関数の戻り値が2であることを検証しています。

ここで、`wave`関数のテストを確認してみましょう。2種類のテストが記述されています。これは、wave関数が正常に実行された際の動作と、期待するエラーが発生するかの動作、2種類の動作を確認したいためです。正常時は、生成されたランダム値に応じてトークンが配布されたかどうかを確認します。期待するエラーとは、最後に追加した「スパムを防ぐためのクールダウン機能」に関するエラーです。

```solidity
        require(
            lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
            "Wait 15m"
        );
```

一人のユーザーが立て続けにwave関数を呼び出すことで、上記の`require`文に引っかかることを確認します。

```javascript
    context(
      'when user1 tried to resubmit without waiting 15 mitutes',
      function () {
        it('reverts', async function () {
          /** 準備 */
          const { wavePortal, user1 } = await loadFixture(deployProjectFixture);

          /** 実行 */
          await wavePortal.connect(user1).wave('This is wave #1');

          /** 検証 */
          await expect(
            wavePortal.connect(user1).wave('This is wave #2'),
          ).to.be.revertedWith('Wait 15m');
        });
      },
    );
```

それでは、テストスクリプトを実行してみましょう。テスト結果がわかりやすいように、`WavePortal.sol`内の`console.log`を全てコメントアウトすると良いでしょう。

```
yarn contract test
```

下記のようなメッセージが出力されていればテスト成功です！

```
Compiled 1 Solidity file successfully


  WavePortal
    getTotalWaves
      ✔ should return total waves (1349ms)
    getAllWaves
      ✔ should return all waves
    wave
      when user waved
        ✔ should send tokens at random. (41ms)
      when user1 tried to resubmit without waiting 15 mitutes
        ✔ reverts (50ms)


  4 passing (1s)

```

### 🧞‍♀️ デプロイする？

`deploy.js`を更新する必要はないので、ここまでのデプロイは任意です。

あなたのWavePortalをどのように構築するかは、あなたの自由です 🌈

ここまでのレッスンを参考にして、下記を自由に設定してみましょう。あなただけのWebアプリケーションを完成させてください。

- `WavePortal.sol`の`uint256 prizeAmount`を更新して、ユーザーに送るETHの金額を再設定する

- `deploy.js`の`hre.ethers.utils.parseEther('0.001')`を更新して、コントラクトに提供する資金を再設定する

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

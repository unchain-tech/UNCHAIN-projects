### 🛫 コントラクトに機能を追加しましょう

このセクションではコントラクトに機能を追加し, フロントエンドに反映させます 🎉

以下の機能を追加していきます。

- メッセージを保留できる数に上限値(`numOfPendingLimits`)を設けます。
- `numOfPendingLimits`に達した場合, その受取人にメッセージを送ることができません。
- コントラクトに管理者機能を追加します。
- コントラクトの管理者は`numOfPendingLimits`を変更することができます。

`messenger-contract`ディレクトリへ移動しましょう。

### 📮 メッセージの保留数に上限を設けよう

それでは`contracts`ディレクトリ内の
`Messenger.sol`を下記のように編集してください。

```diff
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Messenger {
+    // ユーザが保留できるメッセージ数の上限を設定します。
+    uint256 public numOfPendingLimits;

    // メッセージ情報を定義します。
    struct Message {
        address payable sender;
        address payable receiver;
        uint256 depositInWei;
        uint256 timestamp;
        string text;
        bool isPending;
    }

    // メッセージの受取人アドレスをkeyにメッセージを保存します。
    mapping(address => Message[]) private messagesAtAddress;
+    // ユーザが保留中のメッセージの数を保存します。
+    mapping(address => uint256) private numOfPendingAtAddress;

    event NewMessage(
        address sender,
        address receiver,
        uint256 depositInWei,
        uint256 timestamp,
        string text,
        bool isPending
    );

    event MessageConfirmed(address receiver, uint256 index);

+    constructor(uint256 _numOfPendingLimits) payable {
+        console.log("Here is my first smart contract!");
+
+        numOfPendingLimits = _numOfPendingLimits;
+    }

    // ユーザからメッセージを受け取り, 状態変数に格納します。
    function post(string memory _text, address payable _receiver)
        public
        payable
    {
+        // メッセージ受取人の保留できるメッセージが上限に達しているかを確認します。
+        require(
+            numOfPendingAtAddress[_receiver] < numOfPendingLimits,
+            "The receiver has reached the number of pending limits"
+        );
+
+        // 保留中のメッセージの数をインクリメントします。
+        numOfPendingAtAddress[_receiver] += 1;

        console.log(
            "%s posts text:[%s] token:[%d]",
            msg.sender,
            _text,
            msg.value
        );

        messagesAtAddress[_receiver].push(
            Message(
                payable(msg.sender),
                _receiver,
                msg.value,
                block.timestamp,
                _text,
                true
            )
        );

        emit NewMessage(
            msg.sender,
            _receiver,
            msg.value,
            block.timestamp,
            _text,
            true
        );
    }

    // ...
}
```

追加内容を見ていきます。

```solidity
    // ユーザが保留できるメッセージ数の上限を設定します。
    uint256 public numOfPendingLimits;
```

```solidity
    // ユーザが保留中のメッセージの数を保存します。
    mapping(address => uint256) private numOfPendingAtAddress;
```

上記の 2 つはメッセージ保留数の上限値と, 各アドレス宛のメッセージがどのくらい保留されているかを保持する状態変数です。

```solidity
    constructor(uint256 _numOfPendingLimits) payable {
        console.log("Here is my first smart contract!");

        numOfPendingLimits = _numOfPendingLimits;
    }
```

コンストラクタは引数により, デプロイ時に上限値を受け取れるようになっています。  
そして状態変数にセットします。

```solidity
    // ユーザからメッセージを受け取り, 状態変数に格納します。
    function post(string memory _text, address payable _receiver)
        public
        payable
    {
        // メッセージ受取人の保留できるメッセージが上限に達しているかを確認します。
        require(
            numOfPendingAtAddress[_receiver] < numOfPendingLimits,
            "The receiver has reached the number of pending limits"
        );

        // 保留中のメッセージの数をインクリメントします。
        numOfPendingAtAddress[_receiver] += 1;

        // ...
    }
```

`post`関数が呼び出された際, 初めにメッセージの受取人のメッセージ保留数が上限に達しているかを確認しています。  
上限に達していた場合, トランザクションをキャンセルします。

また, 処理を続行する場合は保留数をインクリメントします。

### 🧪 テストを追加しましょう

機能を追加したのでテストしていきます。

`test`ディレクトリ内の`Messenger.ts`ファイルを以下のように編集してください。

変更点

- `deployContract`関数を変更
- `Deployment`テストを追加
- `Post`テスト内の最後にテストケースを追加

```ts
import hre, { ethers } from "hardhat";
import { Overrides } from "ethers";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("Messenger", function () {
  async function deployContract() {
    // 初めのアドレスはコントラクトのデプロイに使用されます。
    const [owner, otherAccount] = await ethers.getSigners();

    const numOfPendingLimits = 10;
    const funds = 100;

    const Messenger = await hre.ethers.getContractFactory("Messenger");
    const messenger = await Messenger.deploy(numOfPendingLimits, {
      value: funds,
    } as Overrides);

    return { messenger, numOfPendingLimits, funds, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right number of pending message limits", async function () {
      const { messenger, numOfPendingLimits } = await loadFixture(
        deployContract
      );

      expect(await messenger.numOfPendingLimits()).to.equal(numOfPendingLimits);
    });
  });

  describe("Post", function () {
    // ...

    it("Should revert with the right error if exceed number of pending limits", async function () {
      const { messenger, otherAccount, numOfPendingLimits } = await loadFixture(
        deployContract
      );

      // メッセージ保留数の上限まで otherAccount へメッセージを送信します。
      for (let cnt = 1; cnt <= numOfPendingLimits; cnt++) {
        await messenger.post("dummy", otherAccount.address);
      }
      // 次に送信するメッセージはキャンセルされます。
      await expect(
        messenger.post("exceed", otherAccount.address)
      ).to.be.revertedWith(
        "The receiver has reached the number of pending limits"
      );
    });
  });

  describe("Accept", function () {
    // ...
  });

  describe("Deny", function () {
    // ...
  });
});
```

`deployContract`関数では追加した要素である`numOfPendingLimits`を用意して, デプロイ時に渡しています。

追加した`Deployment`テストでは, デプロイ時に渡した`numOfPendingLimits`が正しくセットされているかを確認しています。

さらに`Post`テスト内で追加したテストケース`it`の中では,  
`for loop`をしようして上限値までメッセージを送り続けることで, `numOfPendingLimits`による制限が働いているかを確認しています。

それではテストを実行しましょう！  
`messenger-contract`ディレクトリ直下で以下のコマンドを実行してください。

```
$ npx hardhat test
```

以下のような表示がされたらテスト成功です！

![](/public/images/AVAX-messenger/section-3/3_1_1.png)

### 💠 コントラクトに管理者機能を設けましょう

コントラクトに管理者を設けて, 管理者のみ `numOfPendingLimits` を変更してコントラクト内のルールを変更できるようにしましょう。

それでは`contracts`ディレクトリ内の
`Messenger.sol`と同じ階層に`Ownable.sol`というファイルを作成しましょう。

```
contracts
├── Messenger.sol
└── Ownable.sol
```

`Ownable.sol`内に以下のコードを記述してください。

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Ownable {
    address public owner;

    function ownable() internal {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You aren't the owner");
        _;
    }
}
```

このファイルは openzeppelin ライブラリの[ownable](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol) というコントラクトを簡単にしたものです。

コンストラクタ内ではコンストラクタを呼び出した(デプロイした)アドレスで状態変数の`owner`を初期化しています。

`modifier`はまだ出てきていない関数修飾子の一つで, その使用方法と共にどんなものなのかこの後理解します。  
ここで見て頂きたいのは, `require`を利用して, 関数を実行する人が`owner`と等しいことを確認していること  
次の行に `_;` を記述しているということです。

`Messenger.sol` に `Ownable`を継承させて, `Ownable`の関数を利用できるようにしましょう。

`Messenger.sol`を以下のように編集してください。

```diff
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "hardhat/console.sol";
+ import "./Ownable.sol";

+ contract Messenger is Ownable {
    // ユーザが保留できるメッセージ数の上限を設定します。
    uint256 public numOfPendingLimits;

    // メッセージ情報を定義します。
    struct Message {
        address payable sender;
        address payable receiver;
        uint256 depositInWei;
        uint256 timestamp;
        string text;
        bool isPending;
    }

    // メッセージの受取人アドレスをkeyにメッセージを保存します。
    mapping(address => Message[]) private messagesAtAddress;
    // ユーザが保留中のメッセージの数を保存します。
    mapping(address => uint256) private numOfPendingAtAddress;

    event NewMessage(
        address sender,
        address receiver,
        uint256 depositInWei,
        uint256 timestamp,
        string text,
        bool isPending
    );

    event MessageConfirmed(address receiver, uint256 index);
+    event NumOfPendingLimitsChanged(uint256 limits);

    constructor(uint256 _numOfPendingLimits) payable {
        console.log("Here is my first smart contract!");

+        ownable();

        numOfPendingLimits = _numOfPendingLimits;
    }

+    // ownerのみこの関数を実行できるように修飾子を利用します。
+    function changeNumOfPendingLimits(uint256 _limits) external onlyOwner {
+        numOfPendingLimits = _limits;
+        emit NumOfPendingLimitsChanged(numOfPendingLimits);
+    }

    // ...
}
```

`contract Messenger is Ownable` のようにコントラクトを宣言することで,  
`Messenger.sol` は `Ownable`を継承するという関係を作れます, すると `Ownable` の関数を `Messenger.sol` も利用できるようになります。

コンストラクタ内で `Ownable` の関数 `ownable` を実行しています。  
`ownable`を実行すると, コンストラクタを呼び出した(=デプロイをした)アカウントのアドレスをコントラクトは管理者として記録します。

新しく追加した `changeNumOfPendingLimits` 関数に注目しましょう。  
関数の実行に修飾子の `onlyOwner` を指定しています。

ここで起こる処理の流れを整理します。

- `changeNumOfPendingLimits` が呼び出されると, 修飾子 `onlyOwner` の内容が実行されます。
- `onlyOwner` の内では, 関数を呼び出したアカウントが管理者であるかを確認しています。
- 確認が取れたら, `_;` の記述された箇所から, 今度は `changeNumOfPendingLimits` の処理が実行されます。
- `numOfPendingLimits` を変更しイベントを emit します。

このように`modifier`を利用した関数修飾子は, 自分でカスタムした処理をある関数の実行前の処理として適用させることができます。  
今回のように管理者権限の必要な関数には `onlyOwner` を修飾子としてつけるだけで決まった処理をしてくれるので便利です。

オーナーに特別な権限を与えることは, オーナーの利益のためにルールを変更できるという面で, 濫用される恐れもあります。

以下, [CryptoZombies](https://cryptozombies.io/jp/lesson/3/chapter/3)からの引用です。

> DApp がイーサリアム上にあるというだけで、全てが分散型になっているというわけではないことを、常に念頭に入れておいてください。  
> 気になる部分については、すべてのソースコードに目を通して、オーナーに特別な力がないことを確認する必要があります。  
> 開発者としてバグを修正するように DApp をコントロールする権限が必要な一方で、オーナーの数を少なくしてユーザーのデータの安全性を確保できるようなプラットフォームを開発をすることも重要であり、両者のバランスに常に気をつける必要があります。

是非 openzeppelin の [ownable](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol) コントラクトを見てみてください!

### 🧪 テストを追加しましょう

機能を追加したのでテストしていきます。

`test`ディレクトリ内の`Messenger.ts`ファイルを以下のように編集してください。

変更点

- `Deployment`テスト内の最後にテストケースを追加
- `ChangeLimits`テストを追加

```ts
// ...

describe("Messenger", function () {
  async function deployContract() {
    // ...
  }

  describe("Deployment", function () {
    it("Should set the right number of pending message limits", async function () {
      // ...
    });

    it("Should set the right owner", async function () {
      const { messenger, owner } = await loadFixture(deployContract);

      expect(await messenger.owner()).to.equal(owner.address);
    });
  });

  describe("Change limits", function () {
    it("Should revert with the right error if called by other account", async function () {
      const { messenger, otherAccount } = await loadFixture(deployContract);

      await expect(
        messenger.connect(otherAccount).changeNumOfPendingLimits(5)
      ).to.be.revertedWith("You aren't the owner");
    });

    it("Should set the right number of pending limits after change", async function () {
      const { messenger, numOfPendingLimits } = await loadFixture(
        deployContract
      );

      const newLimits = numOfPendingLimits + 1;
      await messenger.changeNumOfPendingLimits(newLimits);
      expect(await messenger.numOfPendingLimits()).to.equal(newLimits);
    });

    it("Should emit an event on change limits", async function () {
      const { messenger } = await loadFixture(deployContract);

      await expect(messenger.changeNumOfPendingLimits(10)).to.emit(
        messenger,
        "NumOfPendingLimitsChanged"
      );
    });
  });

  // ...
});
```

`Deployment`テスト内に追加したテストケース `it` 内ではデプロイ後に `owner` が正しくセットされているかを確認しています。

`ChangeLimits`テスト内では,

`owner` 以外が`numOfPendingLimits`を変更しようとした場合にトランザクションがキャンセルされるか

`owner` は`numOfPendingLimits`を正しく変更できているか

`changeNumOfPendingLimits`実行時に正しくイベントを emit できているか

をそれぞれ確認しています。

それではテストを実行しましょう！  
`messenger-contract`ディレクトリ直下で以下のコマンドを実行してください。

```
$ npx hardhat test
```

以下のような表示がされたらテスト成功です！

![](/public/images/AVAX-messenger/section-3/3_1_2.png)

### 🛫 デプロイ スクリプトを変更する

コンストラクタを変更したので, デプロイ時のコードも変更する必要があります。

`scripts/deploy.ts`内を以下のコードに書き換えてください。  
主にデプロイ時の引数を増やした部分が変わっています。

```ts
import { ethers } from "hardhat";
import { Overrides } from "ethers";

async function deploy() {
  // コントラクトをデプロイするアカウントのアドレスを取得します。
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with the account:", deployer.address);

  const numOfPendingLimits = 10;
  const funds = 100;

  // コントラクトのインスタンスを作成します。
  const Messenger = await ethers.getContractFactory("Messenger");

  // The deployed instance of the contract
  const messenger = await Messenger.deploy(numOfPendingLimits, {
    value: funds,
  } as Overrides);

  await messenger.deployed();

  console.log("Contract deployed at:", messenger.address);
  console.log("Contract's owner is:", await messenger.owner());
  console.log(
    "Contract's number of pending message limits is:",
    await messenger.numOfPendingLimits()
  );
  console.log(
    "Contract's fund is:",
    await messenger.provider.getBalance(messenger.address)
  );
}

deploy()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
```

### 🛩 もう一度デプロイする

コントラクトを更新したので,下記を実行する必要があります。

**1 \. 再度コントラクトをデプロイする**

`messenger-contract`ディレクトリ直下で下記のコマンドを実行します。

```
$ npx hardhat run scripts/deploy.ts --network fuji
```

出力結果の例

```
$ npx hardhat run scripts/deploy.ts --network fuji
Deploying contract with the account: 0xdf90d78042C8521073422a7107262D61243a21D0
Contract deployed at: 0xFCb785b459f0c701ca4019B23EFc66B5f481daA9
Contract's owner is: 0xdf90d78042C8521073422a7107262D61243a21D0
Contract's number of pending message limits is: BigNumber { value: "10" }
Contract's fund is: BigNumber { value: "100" }
```

出力結果の`Contract deployed at:`の後に続くアドレスをコピーして  
`messenger-client/hooks/useMessengerContract.ts`の中の`contractAddress`変数定義の部分に貼り付けます。

例:

```ts
const contractAddress = "0xFCb785b459f0c701ca4019B23EFc66B5f481daA9";
```

**2 \. フロントエンドの ABI ファイルを更新する**

`Avalanche-dApp`直下からターミナルでコピーを行う場合, このようなコマンドになります。

```
$ cp messenger-contract/artifacts/contracts/Messenger.sol/Messenger.json messenger-client/utils/
```

**3 \. 型定義ファイルを更新する**

`Avalanche-dApp`直下からターミナルでコピーを行う場合, このようなコマンドになります。

```
$ cp -r messenger-contract/typechain-types messenger-client/
```

**コントラクトを更新するたび,これらの 3 つのステップを実行する必要があります。**

> **✍️: 上記 3 つのステップが必要な理由**
> ずばり,スマートコントラクトは一度デプロイされると**変更することができない**からです。
>
> コントラクトを更新するためには,再びデプロイする必要があります。
>
> 再びデプロイされたコントラクトは,完全に新しいコントラクトとして扱われるため,すべての変数は**リセット**されます。
>
> **つまり,コントラクトを一度更新してしまうと,すべての既存のメッセージデータが失われます。**

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は,Discord の `#avax-messenger` で質問をしてください。

ヘルプをするときのフローが円滑になるので,エラーレポートには下記の 3 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

コントラクトをアップデートしたら, 次のレッスンに進みましょう 🎉

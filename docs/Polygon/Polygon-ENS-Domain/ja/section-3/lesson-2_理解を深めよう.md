### 🦴 すべてのドメインを取得

現在、アプリは確実に形になってきていますね。 コントラクトをさらに改善し、フロントエンド用に最適化するためにできることはまだあります。たとえば、既にミントされたドメインを取得する非常に簡単な方法があります。すべてのドメインを確認できます。

重要なのは、スマートコントラクトからこのデータを簡単に返すことができることです。
ブロックチェーン上の読み取りトランザクションは無料です🤑
よって、ガス代を払うことを心配する必要はありません!

以下のロジックを見て、上記を行う方法を確認してください。

```solidity
// コントラクトの最初に付け加えてください（他のマッピングに続けて）。
mapping(uint => string) public names;

// コントラクトのどこかに付け加えてください。
function getAllNames() public view returns (string[] memory) {
    string[] memory allNames = new string[](_tokenIds.current());
    for (uint i = 0; i < _tokenIds.current(); i++) {
        allNames[i] = names[i];
    }

    return allNames;
}
```

とてもシンプルですね。 皆さん既にSolidityに習熟されているので理解しやすいはずです。

ドメイン名を持つミントIDを格納するためのマッピングと、それらを反復処理してリストに入れて送信するための`pure`関数を追加しました。 ただし、1つだけ欠けています。 マッピングデータを設定する必要があります。

これを`register`関数の最後の`_tokenIds.increment()`の直前に追加します。

```solidity
names[newRecordId] = name;
```

こうしてコントラクトで作成されたすべてのドメインを取得できます🤘

次のSectionでこの関数を実際に使用します。

---

さて、Section-3ではコントラクトを変更しています。

何をしなければならないかおわかりでしょうか。

復習です🔥

Section-2のLesson-2を参照くださいね👋

---
### 💔 コントラクトのドメインの有効性を確認

さて、おそらく「誰かが**長い**ドメインを作成しようとするとどうなりますか？ 👎」と考えられた方もいると思います。

素晴らしい疑問です。現在、フロントエンドはReactアプリでJavaScriptを使用して、ドメインが有効かどうかを確認しています。

ただ、誰かが私たちのコントラクトを直接使用して無効なドメインを作成する可能性があるため、これは最善のアイデアではありません。

下のように加えてみましょう。

```solidity
function valid(string calldata name) public pure returns (bool) {
    return StringUtils.strlen(name) >= 3 && StringUtils.strlen(name) <= 10;
}
```

Reactアプリで行っていたようにコントラクト側でドメイン名が3〜10文字であるかどうかを確認します。

無効な名前の場合は、`false`を返す必要があります。

### 🤬 カスタムエラー

Solidityの最近のバージョンで追加された機能ですがカスタムエラーメッセージを使用できます。 これらは、エラーメッセージ文字列を繰り返す必要がないため、非常に便利です。デプロイ時にガスも節約できます。

この機能を使用するためにコントラクトのどこかに追加してください。

```solidity
error Unauthorized();
error AlreadyRegistered();
error InvalidName(string name);
```

```solidity
function setRecord(string calldata name, string calldata record) public {
    if (msg.sender != domains[name]) revert Unauthorized();
    records[name] = record;
}

function register(string calldata name) public payable {
    if (domains[name] != address(0)) revert AlreadyRegistered();
    if (!valid(name)) revert InvalidName(name);

    // register関数のその他の部分はそのまま残しておきます。
}
```

できました!

試しに長い文字列を登録して、run.jsを実行してみてください!以下のようなエラーが出力されるでしょうか？
（deploy.jsを元にした試行用のファイルを作成して使用した結果です）。

```
ninja name service deployed
Contract deployed to: 0xXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Error: VM Exception while processing transaction: reverted with custom error 'InvalidName("banana_aaaaaaaaaaaaaaaaaaaa")'
```

このように機能を追加してデプロイすると、以前よりも多くのことを行うことができます。


### 🧙‍♂️ テストを作成・実行する

ここまでの作業でコントラクトには基本機能として以下の機能が追加されました。
* ドメインの登録機能
* トークンの総量を確認する機能
* トークンへのアクセスはオーナーのみに制限する機能
* ドメインの長さによってドメインの登録料が変化する機能

これらの基本機能をテストスクリプトとして記述していきましょう。
ではpackages/contract/testに`test.js`という名前でファイルを作成して、以下のように記述しましょう。

```js
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const hre = require('hardhat');
const { expect } = require('chai');

describe('ENS-Domain', () => {
  // デプロイ＋ドメインの登録までを行う関数
  async function deployTextFixture() {
    const [owner, superCoder] = await hre.ethers.getSigners();
    const domainContractFactory = await hre.ethers.getContractFactory(
      'Domains',
    );
    const domainContract = await domainContractFactory.deploy('ninja');
    await domainContract.deployed();

    let txn = await domainContract.register('abc', {
      value: hre.ethers.utils.parseEther('1234'),
    });
    await txn.wait();

    txn = await domainContract.register('defg', {
      value: hre.ethers.utils.parseEther('2000'),
    });

    return {
      owner,
      superCoder,
      domainContract,
    };
  }

  // コントラクトが所有するトークンの総量を確認
  it('Token amount contract has is correct!', async () => {
    const { domainContract } = await loadFixture(deployTextFixture);

    // コントラクトにいくらあるかを確認しています。
    const balance = await hre.ethers.provider.getBalance(
      domainContract.address,
    );
    expect(hre.ethers.utils.formatEther(balance)).to.equal('3234.0');
  });

  // オーナー以外はコントラクトからトークンを引き出せないか確認
  it('someone not owenr cannot withdraw token', async () => {
    const { owner, superCoder, domainContract } = await loadFixture(
      deployTextFixture,
    );

    const ownerBeforeBalance = await hre.ethers.provider.getBalance(
      owner.address,
    );

    await expect(
      domainContract.connect(superCoder).withdraw(),
    ).to.be.revertedWith("You aren't the owner");

    const ownerAfterBalance = await hre.ethers.provider.getBalance(
      owner.address,
    );
    expect(hre.ethers.utils.formatEther(ownerBeforeBalance)).to.equal(
      hre.ethers.utils.formatEther(ownerAfterBalance),
    );
  });

  // コントラクトのオーナーはコントラクトからトークンを引き出せることを確認
  it('contract owner can withdrawl token from conteract!', async () => {
    const { owner, domainContract } = await loadFixture(deployTextFixture);

    const ownerBeforeBalance = await hre.ethers.provider.getBalance(
      owner.address,
    );

    const txn = await domainContract.connect(owner).withdraw();
    await txn.wait();

    const ownerAfterBalance = await hre.ethers.provider.getBalance(
      owner.address,
    );

    expect(hre.ethers.utils.formatEther(ownerAfterBalance)).to.not.equal(
      hre.ethers.utils.formatEther(ownerBeforeBalance),
    );
  });

  // ドメインの長さによって価格が変化することを確認
  it('Domain value is depend on how long it is', async () => {
    const { domainContract } = await loadFixture(deployTextFixture);

    const price1 = await domainContract.price('abc');
    const price2 = await domainContract.price('defg');

    expect(hre.ethers.utils.formatEther(price1)).to.not.equal(
      hre.ethers.utils.formatEther(price2),
    );
  });
});

```

次に、`Domains`コントラクト内で定義していた`console.log`を削除しましょう。

import文を削除します。

```solidity
// === 下記を削除 ===
import "hardhat/console.sol";
```

constructor関数内の`console.log`を削除します。

```solidity
    // === 下記を削除 ===
    console.log('%s name service deployed', _tld);
```

`register`関数内の`console.log`を削除します。

```solidity
    // === 下記を削除 ===
    console.log(
      'Registering %s.%s on the contract with tokenID %d',
      name,
      tld,
      newRecordId
    );
```

```solidity
    // === 下記を削除 ===
    console.log('\n--------------------------------------------------------');
    console.log('Final tokenURI', finalTokenUri);
    console.log('--------------------------------------------------------\n');
```

では下のコマンドを実行することでコントラクトのテストをしていきましょう！

```
yarn test
```

最後に下のような結果がでいれば成功です！

```
Compiled 1 Solidity file successfully


  ENS-Domain
    ✔ Token amount contract has is correct! (1417ms)
    ✔ someone not owenr cannot withdraw token
    ✔ contract owner can withdrawl token from conteract!
    ✔ Domain value is depend on how long it is


  4 passing (1s)

```

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
お疲れ様でした!! ターミナルに出力されたエラー文をDiscordの`polygon-ens-domain`にシェアしてみましょう!

テストは重要な作業なので、コミュニティのメンバーと確認し合いながら作業を進めましょう✨

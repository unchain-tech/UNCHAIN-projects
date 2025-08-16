---
title: コントラクトを作成しよう
---
### 👩‍💻 実装する内容の確認

本プロジェクトで作成するdappの内容を整理します。

銀行の行っている手形取引をスマートコントラクトで管理するアプリを作成します。

手形取引とは以下のようなものです。

![](/images/AVAX-Subnet/section-2/1_2_1.png)

手形の発行者と受取人、仲介人としての銀行がいる状態で以下のような取引が行われます。

1. ある事業者の間で商品の取引が行われます。ここで商品の買い手がその場で代金を用意できない場合に手形が利用されます。商品の買い手を手形発行者、売り手が受取人とします。
2. 発行者はすぐには代金を支払えないために、期限が来たら現金と交換することができる手形を受取人に対して発行します。
3. 受取人は手形を銀行に持っていきます。
4. 銀行は手形を現金と交換し受取人へ渡します。この時、手形の期限に達していない場合は本来の金額から割り引いた金額を受取人に渡すことになります。
5. 銀行は期限に達した手形に対して発行者に請求します。
6. 発行者は手形の金額と手数料を銀行に支払います。
7. 期限までに手形の支払いを行わなかった発行者は不渡りを起こした事業者となり取引ができなくなります。

以上の仕組みをスマートコントラクトに実装します。

発行者と受取人がユーザとして存在し、スマートコントラクトが銀行の役目を果たします。

代金にはネイティブトークンを使用します。

### 🥦 既存金融と Subnet

ブロックチェーンは透明性や改ざん耐性から、銀行などの既存金融にとってメリットのあるデータベースと言えます。

またスマートコントラクトなどによりデータ管理業務を自動化できる点もメリットです。

しかし企業の運営には不正な活動をする事業者を排除する責任や利用者への説明責任などが伴うため、ブロックチェーンを使う場合はある程度のコントロールがネットワークに対してできる状態であることも求められます。

Subnetでは,「許可されたユーザーのみがコントラクトの展開やトランザクションを行うことができる」と要求することができます。
許可リストは管理者によってのみ更新され、許可リスト自体はPreCompileコントラクト内に実装されるため、コンプライアンスに関する事項についてはより透明で監査が可能です。

### 🥮 `Bank`コントラクトを作成する

`section1`のこれから先の作業は、`AVAX-Subnet/packages/contract`ディレクトリをルートディレクトリとして話を進めます。 🙌

`contracts`ディレクトリの下に`Bank.sol`という名前のファイルを作成します。

Hardhatを使用する場合ファイル構造は非常に重要ですので、注意する必要があります。
ファイル構造が下記のようになっていれば大丈夫です 😊

```
contract
└── contracts
    └── Bank.sol
```

次に、コードエディタでプロジェクトのコードを開きます。

`Bank.sol`の中に以下のコードを貼り付けてください。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Bank {
    // 手形の属性です。
    struct Bill {
        uint256 id;
        uint256 amount;
        uint256 timestamp;
        address issuer;
        address recipient;
        BillStatus status;
    }

    // 手形の状態を表します。
    enum BillStatus {
        Issued,    // 発行された
        Paid,      // 支払われた
        Cashed,    // 現金化された
        Completed, // 正常に処理された
        Dishonored // 不渡りとなった
    }

    // 全ての手形を保存します。
    Bill[] public allBills;

    // 不渡りを起こしたアドレスを保存します。
    address[] public dishonoredAddresses;

    // 各アドレスがコントラクトにロックしたトークンの数を保有します。
    mapping(address => uint256) private _balance;

    // 手形の期間を定数で用意します。
    uint256 public constant TERM = 1 days * 60;

    // 割引金利
    uint256 public constant DISCOUNT_RATE = 10;

    // 手形手数料
    uint256 public constant INTEREST_RATE = 10;

    constructor() payable {}
}
```

もし,`hardhat.config.ts`の中に記載されているSolidityのバージョンが`0.8.17`でなかった場合は,`Bank.sol`の中身を`hardhat.config.ts`に記載されているバージョンに変更しましょう。

コントラクト冒頭ではBill（手形）の属性をあらわすstructや状態を表すenumが定義されています。

その下に状態変数を定義しています。

`_balance`: 発行者が手形の金額をスマートコントラクトに支払った際にその金額を記録するためのものです。

`DISCOUNT_RATE`: 期限に達していない手形を受取人が現金化する際に、10％割引で現金化します。

`INTEREST_RATE`: 発行者が手形の支払いをする際は、手形の代金の10％を手数料としてスマートコントラクトに支払う必要があります。

`Bank`のデプロイ時にはある程度のトークンを渡したいため、constructorには`payable`を指定しています。

次に`Bank`の最後の行に以下のコードを貼り付けてください。

```solidity
    function _sendToken(address payable _to, uint256 _amount) private {
        (bool success, ) = (_to).call{value: _amount}("");
        require(success, "Failed to send token");
    }

    function getNumberOfBills() public view returns (uint256) {
        return allBills.length;
    }

    function getNumberOfDishonoredAddresses() public view returns (uint256) {
        return dishonoredAddresses.length;
    }

    function getBalance() public view returns (uint256) {
        return _balance[msg.sender];
    }

    function beforeDueDate(uint256 _id) public view returns (bool) {
        Bill memory bill = allBills[_id];

        if (block.timestamp <= bill.timestamp + TERM) {
            return true;
        } else {
            return false;
        }
    }

    function getAmountToCashBill(uint256 _id) public view returns (uint256) {
        Bill memory bill = allBills[_id];

        if (beforeDueDate(_id)) {
            return (bill.amount * (100 - DISCOUNT_RATE)) / 100;
        }

        return bill.amount;
    }

    function getAmountToPayBill(uint256 _id) public view returns (uint256) {
        Bill memory bill = allBills[_id];
        return (bill.amount * (100 + DISCOUNT_RATE)) / 100;
    }
```

`_sendToken`はネイティブトークンを\_toへ\_amount分送信する関数です。

`beforeDueDate`は現在のタイムスタンプと手形の期限を比較して、期限に達しているかどうかを返却します。

> 📓 `block.timestamp`の使用について
> スマートコントラクトで時間の参照方法はいくつかあります。
> `block.timestamp`はブロックチェーンにブロックが書き込まれる際に、バリデータによって操作ができるという懸念点がありますが、操作のできる範囲は 30 秒ほどです。
> つまり 30 秒の範囲で実際とは差のある時間をコントラクト内のロジックに使用しても良いのなら`block.timestamp`を使用できます。
> 今回は簡易的な実装なのでこちらを使います。
> Ethereum のコントラクトでは、`block.number`を使用した方法([参考](https://zoom-blc.com/solidity-time-logic))などもありますが、Avalanche では定期的にブロックが生成されるという仕組みではないためこちらは使用できなそうです。
> 正確な情報を取得するためにはオラクルを使用する必要があります。

`getAmountToCashBill`は、受取人が手形を現金化する際に実際に現金化される金額を返却するものです。
手形の期限前である場合は割引した金額を返却します。

`getAmountToPayBill`は、発行者が手形の支払いを行う際に実際に払う金額を返却します。
手数料の分割増した金額を返却します。

次に`Bank`の最後の行に以下のコードを貼り付けてください。

```solidity
    function issueBill(uint256 _amount, address _recipient) public {
        Bill memory bill = Bill(
            allBills.length,
            _amount,
            block.timestamp, // block.timestampは正確な値ではありません。
            msg.sender,
            _recipient,
            BillStatus.Issued
        );

        allBills.push(bill);
    }

    function cashBill(uint256 _id) public payable {
        Bill storage bill = allBills[_id];

        require(
            bill.status == BillStatus.Issued || bill.status == BillStatus.Paid,
            "Status is not Isued or Paid"
        );

        require(bill.recipient == msg.sender, "Your are not recipient");

        bill.status = BillStatus.Cashed;

        uint256 amount = getAmountToCashBill(_id);

        _sendToken(payable(msg.sender), amount);
    }

    function lockToken(uint256 _id) public payable {
        Bill storage bill = allBills[_id];
        uint256 amount = getAmountToPayBill(_id);

        require(msg.value == amount, "Amount is not correct");

        bill.status = BillStatus.Paid;

        _balance[msg.sender] += msg.value;
    }

    function completeBill(uint256 _id) public payable {
        Bill storage bill = allBills[_id];

        require(
            bill.status == BillStatus.Issued ||
                bill.status == BillStatus.Cashed ||
                bill.status == BillStatus.Paid,
            "Bill is already completed"
        );

        require(!beforeDueDate(_id), "Before due date");

        uint256 amount = getAmountToPayBill(_id);

        if (amount <= _balance[bill.issuer]) {
            _balance[bill.issuer] -= amount;
            bill.status = BillStatus.Completed;
        } else {
            bill.status = BillStatus.Dishonored;
            dishonoredAddresses.push(bill.issuer);
        }
    }
```

`issueBill`: 発行者が使用します。\_recipient（受取人）に対して\_amount（トークン量）分の手形の発行を行います。

`cashBill`: 受取人が使用します。指定したidのBillを現金化します。

`lockToken`: 発行者が手形の支払いに使用します。送付されたトークン量を`_balance`に記録します。

`completeBill`: 銀行の管理者が利用します。期限に達したBillを処理します。発行者が手形の金額分を納めていない場合は手形の状態を不渡りとし、発行者のアドレスを`dishonoredAddresses`に追加します。

### 🧪 テストを実装する

コントラクトを実装したのでテストを書きます。

テストコードは詳細な説明を挟まないですが、コード自体は量が多いのでこちらに載せずにGit hub上からコピーして頂こうかと思います。

`test`ディレクトリの下に`Bank.ts`を作成し、[こちら](https://github.com/unchain-tech/AVAX-Subnet/blob/main/contract/test/Bank.ts)のファイル内のコードをコピーして貼り付けてください。

また、先に参考文献を紹介しますのでこの先の説明でわからない時は参考にしてください。

💁 hardhatで行うテストの記述方法に関しては[こちら](https://hardhat.org/hardhat-runner/docs/guides/test-contracts)。

💁 ファイル冒頭に`chai`というパッケージから`expect`をimportしています。`expect`の使い方に関しては[こちら](https://hardhat.org/hardhat-chai-matchers/docs/reference)。

💁 ファイル冒頭に`hardhat-network-helpers`というパッケージから`loadFixture`と`time`をimportしています。それぞれ使い方に関しては[こちら](https://hardhat.org/hardhat-network-helpers/docs/reference)。

それではテストコードを見ていきます。

以下のように、各テストで呼び出される`deployContract`とその後に続くテストコードが記述されているかと思います。

```ts
describe("Bank", function () {
  enum BillStatus {}
  // status

  async function getLastBlockTimeStamp() {
    // 最後に記録されたブロックのタイムスタンプを返却
  }

  async function deployContract() {
    // コントラクトのデプロイ
  }

  // テストコード
});
```

`deployContract`内ではコントラクトのデプロイ作業を実装しています。
返り値にデプロイに使用したアカウント、その他に使用できるアカウント、デプロイしたコントラクトのオブジェクトがあります。
この関数は各テストで最初に呼ばれます。

次に以下のような形で`issueBill`に関するテストが記述されています。
コメントを参考にしてください。

```ts
describe("issueBill", function () {
  it("Correct bill issued.", async function () {
    const { bank, userAccounts } = await loadFixture(deployContract);

    const issuer = userAccounts[0];
    const recipient = userAccounts[1];
    const amount = BigNumber.from(100);

    // Billの発行
    await bank.connect(issuer).issueBill(amount, recipient.address);
    const newId = 0;

    // 発行されたBillの取得
    const bill = await bank.allBills(newId);

    // 発行されたBillの内容の確認
    expect(bill.id).to.equal(newId);
    expect(bill.amount).to.equal(amount);
    expect(bill.timestamp).to.equal(await getLastBlockTimeStamp());
    expect(bill.issuer).to.equal(issuer.address);
    expect(bill.recipient).to.equal(recipient.address);
    expect(bill.status).to.equal(BillStatus.Issued);
  });
});
```

次に以下のような形で`cashBill`に関するテストが記述されています。
各コメントを参考にしてください。

```ts
describe("cashBill", function () {
  it("Token is transferred correctly.", async function () {
    const { bank, userAccounts } = await loadFixture(deployContract);

    const issuer = userAccounts[0];
    const recipient = userAccounts[1];
    const amount = BigNumber.from(100);

    // Billの発行
    await bank.connect(issuer).issueBill(amount, recipient.address);
    const newId = 0;

    // ブロックチェーン上の時間を手形の期限分進めます。
    const term = await bank.TERM();
    await time.increase(term);

    // 期限に達した手形を現金化した際にトークンが正しく移動していることを確認
    await expect(
      bank.connect(recipient).cashBill(newId)
    ).to.changeEtherBalances([bank, recipient], [-amount, amount]);
  });

  it("Discounted amount of token is transferred correctly.", async function () {
    const { bank, userAccounts } = await loadFixture(deployContract);

    const issuer = userAccounts[0];
    const recipient = userAccounts[1];
    const amount = BigNumber.from(100);

    const discountRate = await bank.DISCOUNT_RATE();
    const discountedAmount = amount.sub(amount.mul(discountRate).div(100));

    // Billの発行
    await bank.connect(issuer).issueBill(amount, recipient.address);
    const newId = 0;

    // 期限に達していない手形を現金化した際にトークンが正しく移動していることを確認
    await expect(
      bank.connect(recipient).cashBill(newId)
    ).to.changeEtherBalances(
      [bank, recipient],
      [-discountedAmount, discountedAmount]
    );
  });

  it("Revert if call twice.", async function () {
    const { bank, userAccounts } = await loadFixture(deployContract);

    const issuer = userAccounts[0];
    const recipient = userAccounts[1];
    const amount = BigNumber.from(100);

    // Billの発行
    await bank.connect(issuer).issueBill(amount, recipient.address);
    const newId = 0;

    // cashBillを連続で呼び出した時,（コントラクトが再度トークンを送信してしまわずに)2度目のcashBillの呼び出しが失敗することを確認
    await bank.connect(recipient).cashBill(newId);
    await expect(bank.connect(recipient).cashBill(newId)).to.be.reverted;
  });

  it("Revert if different user call.", async function () {
    const { bank, userAccounts } = await loadFixture(deployContract);

    const issuer = userAccounts[0];
    const recipient = userAccounts[1];
    const amount = BigNumber.from(100);

    // Billの発行
    await bank.connect(issuer).issueBill(amount, recipient.address);
    const newId = 0;

    // 受取人でないアカウントによるcashBillの呼び出しが失敗することを確認
    await expect(bank.connect(issuer).cashBill(newId)).to.be.reverted;
  });
});
```

次に以下のような形で`lockToken`に関するテストが記述されています。
コメントを参考にしてください。

```ts
describe("lockToken", function () {
  it("Token is transferred correctly.", async function () {
    const { bank, userAccounts } = await loadFixture(deployContract);

    const issuer = userAccounts[0];
    const recipient = userAccounts[1];
    const amount = BigNumber.from(100);

    await bank.connect(issuer).issueBill(amount, recipient.address);
    const newId = 0;

    const interestRate = await bank.INTEREST_RATE();
    const amountWithFee = amount.add(amount.mul(interestRate).div(100));

    // トークンが正しく移動していることを確認
    await expect(
      bank.connect(issuer).lockToken(newId, {
        value: amountWithFee,
      } as Overrides)
    ).to.changeEtherBalances([issuer, bank], [-amountWithFee, amountWithFee]);

    // statusと、balanceに正しくトークン量が記録されていることを確認
    expect((await bank.allBills(newId)).status).to.equal(BillStatus.Paid);
    expect(await bank.connect(issuer).getBalance()).to.equal(amountWithFee);
  });
});
```

最後に以下のような形で`completeBill`に関するテストが記述されています。
コメントを参考にしてください。

```ts
describe("completeBill", function () {
  it("Revert if call before due date", async function () {
    const { bank, userAccounts } = await loadFixture(deployContract);

    const issuer = userAccounts[0];
    const recipient = userAccounts[1];
    const amount = BigNumber.from(100);

    // Billの発行
    await bank.connect(issuer).issueBill(amount, recipient.address);
    const newId = 0;

    // 期限に達していないBillは処理できません。
    await expect(bank.completeBill(newId)).to.be.reverted;
  });

  it("Bill is properly completed", async function () {
    const { bank, userAccounts } = await loadFixture(deployContract);

    const issuer = userAccounts[0];
    const recipient = userAccounts[1];
    const amount = BigNumber.from(100);

    // Billの発行
    await bank.connect(issuer).issueBill(amount, recipient.address);
    const newId = 0;

    const interestRate = await bank.INTEREST_RATE();
    const amountWithFee = amount.add(amount.mul(interestRate).div(100));

    // 手形の支払い
    await bank.connect(issuer).lockToken(newId, {
      value: amountWithFee,
    } as Overrides);

    // ブロックチェーン上の時間を手形の期限分進めます。
    const term = await bank.TERM();
    await time.increase(term);

    // 手形の処理
    await bank.completeBill(newId);

    // balanceとstatusの確認
    expect(await bank.connect(issuer).getBalance()).to.equal(0);
    expect((await bank.allBills(newId)).status).to.equal(BillStatus.Completed);
  });

  it("Bill is properly dishonored.", async function () {
    const { bank, userAccounts } = await loadFixture(deployContract);

    const issuer = userAccounts[0];
    const recipient = userAccounts[1];
    const amount = BigNumber.from(100);

    // 手形の発行
    await bank.connect(issuer).issueBill(amount, recipient.address);
    const newId = 0;

    // ブロックチェーン上の時間を手形の期限分進めます。
    const term = await bank.TERM();
    await time.increase(term);

    // 手形の処理
    await bank.completeBill(newId);

    // balanceとstatusの確認
    // (ブロックチェーン上の時間は手形の期限分経っているので、statusが不渡りとなっていることを確認)
    expect((await bank.allBills(newId)).status).to.equal(BillStatus.Dishonored);
    expect(await bank.dishonoredAddresses(0)).to.equal(issuer.address);
  });
});
```

### ⭐ テストを実行しましょう

以下のコマンドを実行してください。

```
yarn test
```

以下のような表示がされます。
実行したテスト名とそのテストがパスしたことがわかります。

![](/images/AVAX-Subnet/section-2/1_2_2.png)

### 🌔 参考リンク

> [こちら](https://github.com/unchain-tech/AVAX-Subnet)に本プロジェクトの完成形のレポジトリがあります。
> 期待通り動かない場合は参考にしてみてください。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#avalanche`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

少し長いレッスンでしたがお疲れ様でした！

コントラクトを実装することができました 🔥


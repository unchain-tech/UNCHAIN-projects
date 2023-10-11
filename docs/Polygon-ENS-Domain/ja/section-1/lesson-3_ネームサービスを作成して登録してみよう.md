前回、hardhatを用いて簡単なスマートコントラクトをデプロイすることができました。

ここから、ネームサービスの中身を作成していきましょう。

### 💽ドメインデータをブロックチェーンに保存する

ネームサービスのポイントは、人々がインターネット上のあなた固有の名前に便利にアクセスすることができるということです。

[google.com](http://google.com)と入力してGoogleにアクセスするのと同じように、ユーザーはあなたのドメインネームを頼りにあなたの情報にアクセスすることができます。

したがって、最初に必要なのは、ドメインを登録するための関数と、登録したドメインを格納する場所になります。

`Domains.sol`に向かいます。

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract Domains {
    // "mapping"でstring型の各keyとaddress型の各データを紐付けにして格納します。そのmappingをここでは"domains"として定義しています。
    mapping(string => address) public domains;

    constructor() {
        console.log("THIS IS MY DOMAIN CONTRACT. NICE.");
    }

    // register関数はnameとアドレスを紐付けます。
    function register(string calldata name) public {
        domains[name] = msg.sender;
        console.log("%s has registered a domain!", msg.sender);
    }

    // nameに対応するaddressを返すゲッター関数を定義しておきます。
    function getAddress(string calldata name) public view returns (address) {
        return domains[name];
    }
}
```

上のコードではいくつかの関数を追加し、`domains` [mapping](https://docs.soliditylang.org/en/v0.8.10/types.html#mapping-types)変数も追加しました。

マッピングは、2つの値を「マッピング」する単純なデータ型です。 この例では、文字列（ドメイン名）をウォレットアドレスと紐付けしています。

この変数は「状態変数」と呼ばれるため特別であり、スマートコントラクトのストレージに**永続的に**保存されます。

ここでは`register`関数を実行すると、ドメインに関連するデータが永続的に保存されます。

また、ここでは`msg.sender`を使用しています。

これは、関数を呼び出した人のウォレットアドレスです。

いわゆる認証のようなものです。


スマートコントラクトを呼び出すには、有効なウォレットを使用してトランザクションに署名する必要があるため、**誰が関数を呼び出したかを正確に把握する**必要があります。

**`msg.sender`は今後もよく目にすることになる**でしょう。

今後、特定のウォレットアドレスのみが呼び出せる関数を作成できるようになります。

たとえば、関数を変更して、ドメインを所有するウォレットのみがそれらを更新できるようにすることができます。

`getAddress`関数はまさにそれを行います-**ドメイン所有者のウォレットアドレスを取得**します。


上の関数定義においてポイントがあるので、それらを見てみましょう。

- `calldata`  これは`name`引数が格納されるべき場所を示します。ブロックチェーンでデータを処理するには実際の費用がかかるため、Solidityでは参照データを格納する場所を指定できます。`calldata`は一時的なデータで不変です。ガスの消費量は最も少ないです。(cf. `memory`一時的で可変)

- `public`これはアクセスに関する修飾子です。 他のコントラクトを含め、どこからでもアクセスできます。

- `view`これは、関数がコントラクトのデータのみを表示し、変更しないことを意味します。まさに見る（view）だけです。

- `returns(string)`コントラクトは呼び出されたときに文字列変数を返します。

### ✅ run.jsを更新する

`run.js`でテストを行うため変更を加えましょう。

`domainContractFactory.deploy()`でコントラクトをブロックチェーンにデプロイします。

関数で**public**を指定したため、どこからでも呼び出すことができるようになります。

APIに詳しい方ならパブリックなAPIのエンドポイントのように考えるとわかりやすいでしょう。

では具体的にテストしたいと思います。

```javascript
const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  const domainContract = await domainContractFactory.deploy();
  await domainContract.deployed();
  console.log('Contract deployed to:', domainContract.address);
  console.log('Contract deployed by:', owner.address);

  const txn = await domainContract.register('doom');
  await txn.wait();

  const domainOwner = await domainContract.getAddress('doom');
  console.log('Owner of domain:', domainOwner);
}

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



### 🤔 動作を確認しよう

順番に見ていきましょう。

```javascript
const [owner, randomPerson] = await hre.ethers.getSigners();
```

ブロックチェーンに何かをデプロイするには、ウォレットアドレスが必要です。

ここではコントラクトオーナーのウォレットアドレスを取得し、さらにランダムなウォレットアドレスを取得して`randomPerson`としました。これはあとで解説します。

コントラクトをデプロイした人のアドレスを出力します。

```javascript
console.log('Contract deployed by:', owner.address);
```

最後にこれを追加しています。

```javascript
const txn = await domainContract.register('doom');
await txn.wait();

const domainOwner = await domainContract.getAddress('doom');
console.log('Owner of domain:', domainOwner);
```

まず、`doom`を引数として`register`関数を呼び出します。

さらに同じく`getAddress`関数を呼び出します。

これらを実行してみましょう。

ターミナル上で、下記を実行してみましょう。

```
yarn contract run:script
```

次のような画面になります。

```
Compiled 1 Solidity file successfully
THIS IS MY DOMAIN CONTRACT. NICE.
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Contract deployed by: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 has registered a domain!
Owner of domain: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

### 🎯レコードの保存

これで、スマートコントラクトにドメインを登録できます。

次はそのドメインがデータを指すようにする必要があります。

結局のところ、ドメインは何かを指しています。

たとえば、reddit.comはRedditのサーバーを指していますね。

ENSを使用すると、前に示したように、さまざまなものを保存できます。

アプリの「ネームサービス」の機能として各ドメインに値を追加します。

データベースのように、それぞれのドメインを値に接続するイメージです。

これらの値は、ウォレットアドレス、暗号化されたメッセージ、Spotifyのリンク、サーバーへのIPアドレスなど、何でもかまいません。

今回は文字列（string）で行います。更新されたコントラクトは次のようになります。

`Domains.sol`を変更します。

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract Domains {
    mapping(string => address) public domains;

    // stringとstringを紐付けた新しいmappingです。
    mapping(string => string) public records;

    constructor() {
        console.log("Yo yo, I am a contract and I am smart");
    }

    function register(string calldata name) public {
        // そのドメインがまだ登録されていないか確認します。
        require(domains[name] == address(0));
        domains[name] = msg.sender;
        console.log("%s has registered a domain!", msg.sender);
    }

    function getAddress(string calldata name) public view returns (address) {
        return domains[name];
    }

    function setRecord(string calldata name, string calldata record) public {
        // トランザクションの送信者であることを確認しています。
        require(domains[name] == msg.sender);
        records[name] = record;
    }

    function getRecord(
        string calldata name
    ) public view returns (string memory) {
        return records[name];
    }
}
```

`require`文について説明しておきましょう。

これは、他の人があなたのドメインを取得したり、レコードを変更したりするのを防ぐためのものです。

マクドナルドにハッピーセットを注文し、誰かが注文をエッグマフィンに変更したら困りますね😠

スマートコントラクトで何かを指示した場合、あなた以外の人が勝手に内容を変更しては困ります。

require文の括弧の中の条件が満たされない場合、トランザクションは**元に戻されます**。

これは、ブロックチェーンデータが変更されないことを意味します。

順番に見ていきましょう。

```solidity
require(domains[name] == address(0));
```


ここでは、登録しようとしているドメインのアドレスが現在登録されていない（0）であるということを確認しています。

Solidityではアドレスマッピングが初期化されると、その中のすべてのエントリはゼロアドレスとなります。

したがって、ドメインが登録されていない場合は、ゼロアドレスを指します。


```solidity
require(domains[name] == msg.sender);
```

トランザクションの送信者がドメインを所有するアドレスであることを確認します。

これはしっかり確認しておかないといけませんね。

では`run.js`を以下のように変更してみましょう。


```javascript
const main = async () => {
  // 1つ目のアドレスは呼び出す人、2つ目のアドレスはランダムです。
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  const domainContract = await domainContractFactory.deploy();
  await domainContract.deployed();
  console.log('Contract deployed to:', domainContract.address);
  console.log('Contract deployed by:', owner.address);

  let txn = await domainContract.register('doom');
  await txn.wait();

  const domainAddress = await domainContract.getAddress('doom');
  console.log('Owner of domain doom:', domainAddress);

}

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

スクリプトを実行します。

```
yarn contract run:script
```
次のような画面になります。

```
Compiled 1 Solidity file successfully
Yo yo, I am a contract and I am smart
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Contract deployed by: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 has registered a domain!
Owner of domain doom: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

### 🤝 オーナー以外で確認する

ちょっとしたテストをしましょう。

ドメインオーナー以外のユーザーで記録をしてみます。

`run.js`に数行付け加えました。

```javascript
const main = async () => {
  // 1つ目のアドレスは呼び出す人、2つ目のアドレスはランダムです。
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  const domainContract = await domainContractFactory.deploy();
  await domainContract.deployed();
  console.log('Contract deployed to:', domainContract.address);
  console.log('Contract deployed by:', owner.address);

  let txn = await domainContract.register('doom');
  await txn.wait();

  const domainAddress = await domainContract.getAddress('doom');
  console.log('Owner of domain doom:', domainAddress);

  // 自分以外でデータを記録してみます。
  txn = await domainContract.connect(randomPerson).setRecord('doom', 'Haha my domain now!');
  await txn.wait();
}

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

スクリプトを実行します。

```
yarn contract run:script
```

**次のスクリプトの箇所でエラーが発生します**

```javascript
txn = await domainContract.connect(randomPerson).setRecord('doom', 'Haha my domain now!');
await txn.wait();
```



なぜなら**自分のものではない**ドメインのレコードをセットしようとしているためです。

これで、`require`ステートメントが機能することがわかりました。

エラーをうまく利用して学習できましたね。

エラー前の状態に戻していろいろ自分で文言を変えて試してみると面白いかもしれませんね。

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

お疲れ様でした。今回は長いレッスンでしたのでひと休みして次のレッスンに進んでくださいね 🎉

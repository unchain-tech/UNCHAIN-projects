### 🛠 資金を引き出す機能を実装する

前回まででスマートコントラクトをデプロイし、ユーザーがドメインを作成できるようにするReactベースのWebアプリケーションを作成してきました。

これでかの有名なBored Apeを購入し、ミームを1日中Twitterに投稿することもできます。

しかしまだできないことがあります。

まだ**資金を引き出す**方法を作成できていないからです。

では、人々がドメインに支払ってくれたトークンにどのようにアクセスできるでしょうか？

### 👻 関数修飾子と撤回関数

その機能を追加するためにコントラクト（つまりバックエンド側です）を修正していきましょう。

`Domains.sol`に以下を追加します。

```solidity
modifier onlyOwner() {
    require(isOwner(), "You aren't the owner");
    _;
}

function isOwner() public view returns (bool) {
    return msg.sender == owner;
}

function withdraw() public onlyOwner {
    uint amount = address(this).balance;

    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Failed to withdraw Matic");
}
```

現在、エラーが発生している可能性があります。

でも心配しないでください。予想通りです。

先に進んで、これを少し分解しましょう：

最初に作成するのは関数`modifier`です。 これにより、関数の動作を変更できます。

`require`ステートメントを実装するための便利な手法です。

この修飾子が行うのは、 `isOwner()`関数が`true`を返すことだけです。 `true`でない場合、この修飾子で宣言された関数は実行できません。

初見で不思議に思える部分は最後の`_;`でしょう。modifier修飾子を使用する関数は、requireの**後に**実行する必要があります。`_;`がrequireの前にある場合、withdraw関数が最初に呼び出され、次にrequireが呼び出されることになります。これではrequireが役に立ちません。

`_;`を記載することで、その後の処理を続行するという意味になります。

`withdraw()`関数に関しては、コントラクトの残高を取得し、それをリクエスター（関数を実行するためには所有者である必要があります）に送信することだけです。 これは資金を引き出すのに簡単な手法です。 `msg.sender.call {value：amount}(" ")`は、送金するための書き方です。 構文は少し奇妙ですが`amount`を渡す方法に注目してください。 `require(success`は、トランザクションが成功したことが想定されるところです。 成功しない場合は、トランザクションをエラーとして認識し、`"Failed to withdraw Matic"`と表示します。

### 🤠 コントラクトオーナーの設定

厄介な`owner`エラーを修正するには、コントラクトの先頭にグローバルな`owner`変数を作成し、次のようにコンストラクターに設定するだけです。

```solidity
address payable public owner;

constructor(string memory _tld) ERC721 ("Ninja Name Service", "NNS") payable {
    owner = payable(msg.sender);
    tld = _tld;
    console.log("%s name service deployed", _tld);
}
```

重要な点は、`payable`タイプとして設定したことです。 これは、所有者の`address`が支払いを受け取ることができることを意味し、明示的に宣言する必要があります。 詳細については、[こちら](https://solidity-by-example.org/payable/)をご参照ください。

これでコントラクトにある資金を引き出すことができます。


### 🏦 テストしてみましょう

`run.js`スクリプトを設定します。

```javascript
const main = async () => {
  const [owner, superCoder] = await hre.ethers.getSigners();
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  const domainContract = await domainContractFactory.deploy('ninja');
  await domainContract.deployed();

  console.log('Contract owner:', owner.address);

  // 今回は多額を設定しています。
  let txn = await domainContract.register('a16z',  {value: hre.ethers.utils.parseEther('1234')});
  await txn.wait();

  // コントラクトにいくらあるかを確認しています。
  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log('Contract balance:', hre.ethers.utils.formatEther(balance));

  // スーパーコーダーとしてコントラクトから資金を奪おうとします。
  try {
    txn = await domainContract.connect(superCoder).withdraw();
    await txn.wait();
  } catch(error){
    console.log('Could not rob contract');
  }

  // 引き出し前のウォレットの残高を確認します。あとで比較します。
  let ownerBalance = await hre.ethers.provider.getBalance(owner.address);
  console.log('Balance of owner before withdrawal:', hre.ethers.utils.formatEther(ownerBalance));

  // オーナーなら引き出せるでしょう。
  txn = await domainContract.connect(owner).withdraw();
  await txn.wait();

  // contract と owner の残高を確認します。
  const contractBalance = await hre.ethers.provider.getBalance(domainContract.address);
  ownerBalance = await hre.ethers.provider.getBalance(owner.address);

  console.log('Contract balance after withdrawal:', hre.ethers.utils.formatEther(contractBalance));
  console.log('Balance of owner after withdrawal:', hre.ethers.utils.formatEther(ownerBalance));
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

このスクリプトを`yarn contract run:script`で実行すると、盗み取ろうとしたことがブロックされてcatch errorが作用したことがわかると思います。

```
Compiled 1 Solidity file successfully
ninja name service deployed
Contract owner: 0x---------
Registering a16z.ninja on the contract with tokenID 0

Contract balance: 1234.0
Could not rob contract
Balance of owner before withdrawal: 8765.98283853524900992
Contract balance after withdrawal: 0.0
Balance of owner after withdrawal: 9999.982788363651247088
```

ここで何が起こっているのかというと、 `withdraw()`関数をランダムな人物`superCoder`として呼び出すと、`modifier`は私たちが所有者ではないことを確認し、トランザクションを元に戻します。

しかし、私たちが`owner`として行うと支払いがされます。

このように必要に応じて、try catchを使ってコントラクトの内容を確認できます。

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
お疲れ様でした!! 一休みしてからでも次のレッスンに進みましょう🚀

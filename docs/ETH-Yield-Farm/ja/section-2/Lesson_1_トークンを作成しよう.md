###  🖥 このレッスンの参考動画URL
[Dapp University](https://youtu.be/CgXQC4dbGUE?t=1744)

### 👀 プロジェクトの概要を復習しよう

プロジェクトでは3つのスマートコントラクトを使用します。

`src/contracts`フォルダを参照してください。

1. MockDaiToken.sol
   - 偽のDaiトークンを作成するコントラクト
2. DappToken.sol
   - 投資家が私たちのプロジェクトで獲得できるコミュニティトークンDappを作成するコントラクト
3. TokenFarm.sol
   - 偽のDaiトークンが保管されるデジタルバンク機能を持つスマートコントラクト。
   - TokenFarmコントラクトを呼び出した投資家(ユーザー)が、Daiトークンをステークすることを想定している。
   - 定期的な間隔で、ステーキングを行った投資家はDappトークンを獲得することができる。
   - また、最初のDaiトークンを引き戻すこともできる。

それでは、実装に進みましょう!

### 🆙 コントラクトにトークンをデプロイする

ここからは本格的にコーディングをしていくのでさらに面白くなっていきます!
まずは本プロジェクトで使う仮想的なトークンである`DaiToken`と`DappToken`をコントラクトにデプロイします。そのために`2_deploy_contracts.js`を以下のように更新してください。

```javascript
// 2_deploy_contracts.js
const TokenFarm = artifacts.require(`TokenFarm`)
const DappToken = artifacts.require(`DappToken`)
const DaiToken = artifacts.require(`DaiToken`)

module.exports = async function(deployer, newtwork, accounts) {

    await deployer.deploy(DaiToken)
    const daiToken = await DaiToken.deployed()

    await deployer.deploy(DappToken)
    const dappToken = await DappToken.deployed()

    await deployer.deploy(TokenFarm, dappToken.address, daiToken.address)
    const tokenFarm = await TokenFarm.deployed()

    //100万Dappデプロイする
    await dappToken.transfer(tokenFarm.address, '1000000000000000000000000')

    //100Daiデプロイする
    await daiToken.transfer(accounts[1], '100000000000000000000')
}
```

一行ずつ見ていきましょう。

最初の部分でどのコントラクトとやりとりをするかを宣言します。

```javascript
// 2_deploy_contracts.js
const TokenFarm = artifacts.require(`TokenFarm`)
const DappToken = artifacts.require(`DappToken`)
const DaiToken = artifacts.require(`DaiToken`)
```

ここでは`TokenFarm`, `DappToken`, `MockDaiToken`の3つのコントラクトとやりとりをするよとtruffleに伝えています。

次に、`function()`の引数として、`network`と`accounts`を追加していきましょう。

```javascript
// 2_deploy_contracts.js
module.exports = async function(deployer, newtwork, accounts) {
    :
```

`async`キーワードを追加するのをお忘れなく!

マイグレーションファイル内でアクセス可能な変数として、スマートコントラクトが配置される`network`　と、Ganacheからのアカウントリスト(`accounts`)を追加しました。これは、投資家にDappトークンを提供するために重要な変数となります。

次の部分では、 `deploy()`で実際にコントラクトをデプロイして、`deployed()`でデプロイされた結果を取得しています。

```javascript
// 2_deploy_contracts.js

// 偽の Dai トークンをデプロイする
await deployer.deploy(DaiToken)
const daiToken = await DaiToken.deployed()

// Dapp トークンをデプロイする
await deployer.deploy(DappToken)
const dappToken = await DappToken.deployed()

// dappToken と daiToken のアドレスを引数に、Token Farm をデプロイする
await deployer.deploy(TokenFarm, dappToken.address, daiToken.address)
const tokenFarm = await TokenFarm.deployed()
```

これらのコードが実行されると、3つのスマートコントラクトがブロックチェーン上にデプロイされます!

最後に、今回のアプリケーションでユーザーがステーキングするのに使う偽のDaiトークンと、その見返りとしてコミュニティが渡すDappトークンをコントラクトへそれぞれ100 Dai, 100万Dappずつデプロイします。

一つ一つ見ていきましょう。まず、`dappToken`を`tokenFarm`に預け入れる処理を確認しましょう。

 ```javascript
// 2_deploy_contracts.js

// 100万Dappデプロイする
await dappToken.transfer(tokenFarm.address, '1000000000000000000000000')
```

投資家はDaiトークンをトークンファーム(`tokenFarm.address`)に預け入れ、その見返りとして、Dappトークンを獲得します。このフローを実現するために、ここでは、すべてのDappトークンをトークンファームに割り当てています。

現実の世界のプロジェクトも、上記のようなフローで動いています。

基本的に、プロジェクトオーナーはすべてのオリジナルトークン(e.g., Dapp)を流動性プールに置き、アプリからそれらのトークンを投資家に配布しています。

- すべてのDappトークンをこのトークンファームプロジェクトに配置し、投資家がWebアプリケーションを使うときに、自動的にトークンが分配されるようにします。
- ユーザーは、Dappトークンを購入する代わりに、流動性マイニングやイールドファーミングによってDappトークンを獲得することができます。

ちなみに、Solidityでは`1Wei(10^(-18))`が基本の単位となっているので`1Dai`は`10^18`となります。

次に、投資家(`accounts[1]`)に`daiToken`を付与するコードを確認しましょう。

 ```javascript
// 2_deploy_contracts.js

// 100Daiデプロイする
await daiToken.transfer(accounts[1], '100000000000000000000')
```

投資家には、Daiトークンを`tokenFarm`に預けてもらいたいので、Daiをいくつか持っていてもらう必要があります。

今、DaiTokenをデプロイすると、すべてのトークンはデプロイした人(＝あなた / Ganacheの`accounts[0]`)のものになります。なので、ここでは、Daiの一部を投資家に譲渡しています。

- Daiトークンの`transfer`関数についている`accounts[1]`というのはGanacheのアカウントの上から2番目のアカウントのことを示しています。
- 後から出てくるので頭の片隅に置いておいてください。

### 🪙　TokenFarmコントラクトに Dai と Dapp トークンを導入する

`TokenFarm`コントラクトで`Dai`トークンと`Dapp`トークンが使えるようにするために`TokenFarm.sol`を次のように更新しましょう。

```solidity
// TokenFarm.sol
pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./MockDaiToken.sol";

contract TokenFarm{
    string public name = "Dapp Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;

    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
    }
}
```

まず`DappToken`と`MockDaiToken`をインポートすることで`DappToken`と`DaiToken`を使えるようにします。

```solidity
// TokenFarm.sol
import "./DappToken.sol";
import "./MockDaiToken.sol";
```

次にそれらを`constructor`で呼び出します。
- `constructor`は、スマートコントラクトがネットワークにデプロイされるたびに、一度だけ実行される特別な関数です。
- `constructor`の中にコードを入れることができ、関数が呼び出されるたびに、中のコードが実行されます。

DaiTokenとDappTokenはネットワークにすでにデプロイされていると仮定しているので、あとはTokenFarmのコントラクトが作成されるたびにDaiTokenとDappTokenのコントラクトアドレスを取得し、`constructor`に渡すだけです。

```solidity
// TokenFarm.sol
constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
}
```
`constructor()`の中にある`DappToken`と`DaiToken`は実際のスマートコントラクトである「型」です。

`_dappToken`と`_daiToken`は、それぞれコントラクトのアドレスです。
そして、これらの変数を取り出して、それぞれ状態変数である`dappToken`と`daiToken`に代入しています。

* `_dappToken`と`_daiToken`はローカル変数であり、他の関数からアクセスすることはできません。これらの変数がスマートコントラクトの外部からアクセスできるようにするには、状態変数として保存する必要があります。

### 🛠 スマートコントラクトをデプロイしよう

ではターミナルを開いて`yield-farm-starter-project`にいることを確認してから下記のコードを実行してみてください。

```bash
truffle compile
```

`Compiled successfully`とターミナルに出力されたでしょうか？

無事にコントラクトのコンパイルが済んだら、次に以下のコマンドをターミナルで実行し、ブロックチェーンにコントラクトをデプロイしましょう。

```bash
truffle migrate --reset
```

ターミナルの出力結果が以下のように表示されていればデプロイは成功です!

```bash
> gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00522376 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.03496056 ETH


Summary
=======
> Total deployments:   4
> Final cost:          0.0394653 ETH
```
ここでは、ブロックチェーンのスマートコントラクトを置き換えるために`reset`フラグを使用しました。

ブロックチェーン上のスマートコントラクトは、不変のコードです。つまり、中身を書き換えたい場合は、コードそのものを置き換える必要があります。

### 👀 スマートコントラクトを確認しよう

以下のコマンドを実行して、コントラクトがデプロイされていることを確認しましょう。

```bash
truffle console
```

`truffle(development)`がターミナルに表示されたら、以下のコードを実行してみてください。


```bash
truffle(development)> mDai = await DaiToken.deployed()
```

```bash
truffle(development)> accounts = await web3.eth.getAccounts()
```

どちらを実行しても、ターミナルに`undefined`と出力されるはずですが、ここで初めて`mDai`や`accounts`を定義しているので、問題はありません。

次に、ターミナルで以下のコードを実行していきましょう。

```bash
truffle(development)> accounts[1]
```

ターミナルに出力されるアドレスが、Ganacheに表示されている上から2番目のアカウントのアドレスと一致していることを確認しましょう!このアカウントは仮想の投資家のアドレスとなります。

次に、ターミナルで以下のコードを実行していきましょう。

```bash
truffle(development)> balance = await mDai.balanceOf(accounts[1])
```
```bash
truffle(development)> balance.toString()
```

`100000000000000000000`がターミナルに出力されることを確認してください。

ここで、何を実行したのかを解説します。

まず、`src/contracts/MockDaiToken.sol`を見て、以下のコードを確認しましょう:


```solidity
// MockDaiToken.sol

mapping(address => unit256) public balanceOf
```

`balanceOf`関数は、アドレスから誰がどれだけの偽Daiを所有しているかを確認できる関数です。

`balanceOf`は実際にはマッピングですが、ここでは`public`と定義しているので、誰でもこのマッピングの値を`balanceOf`関数で取得することができます。

マッピングとは他のプログラミング言語における連想配列やハッシュテーブル、key-valueストアのようなもので、Keyを与えるとValueを返してくれるものです。

それでは、`100000000000000000000`という値を人間の読みやすい形に変換するために、以下のコードを`truffle(development)`上で実行しましょう。

```bash
truffle(development)> formattedBalance = web3.utils.fromWei(balance)
```

`100`とターミナルに出力されたでしょうか？

ちょっと前に、Dappのトークンは小数点以下が18桁という話をしたのを覚えていますか？

イーサリアムでは、基本的に小数点以下が18桁あることが分かっているイーサーの最小単位が`Wei`となります。

つまり、この出力結果は、投資家アカウントである`accounts[1]`が100　Daiトークンを持っていることを意味します。

以上で、truffleを用いたコントラクトの検証は終了です!

* truffleコンソールを終了するには、`^C`を2回入力するか、`.exit`を入力してください。

truffleについて更に詳しく知りたい方は、[こちら](https://github.com/trufflesuite/truffle)のGitHubリポジトリをご覧ください。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#eth-yield-farm`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---
これでトークンを送れることが確認できました!次はより実践的なことをテストするということをしていきます。

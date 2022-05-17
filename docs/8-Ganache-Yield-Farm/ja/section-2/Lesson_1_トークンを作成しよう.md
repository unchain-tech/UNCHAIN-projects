###  🖥 このレッスンの参考動画URL
[Dapp University](https://youtu.be/CgXQC4dbGUE?t=1744)

### 👀 プロジェクトの概要を復習しよう

プロジェクトでは3つのスマートコントラクトを使用します。

`src/contracts` フォルダを参照してください。

1. DaiToken.sol
   - 偽のDaiトークンを作成するコントラクト
2. DappToken.sol
   - 投資家が私たちのプロジェクトで獲得できるコミュニティトークン Dapp を作成するコントラクト
3. TokenFarm.sol
   - 偽の Dai トークンが保管されるデジタルバンク機能を持つスマートコントラクト。
   - TokenFarm コントラクトを呼び出した投資家（ユーザー）が、Dai トークンをステークすることを想定している。
   - 定期的な間隔で、ステーキングを行った投資家は Dapp トークンを獲得することができる。
   - また、最初の Dai トークンを引き戻すこともできる。

それでは、実装に進みましょう！

### 🆙 コントラクトにトークンをデプロイする

ここからは本格的にコーディングをしていくのでさらに面白くなっていきます！
まずは本プロジェクトで使う仮想的なトークンである `DaiToken` と `DappToken` をコントラクトにデプロイします。そのために `2_deploy_contracts.js` を以下のように更新してください。

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

ここでは`TokenFarm`, `DappToken`, `DaiToken`の3つのコントラクトとやりとりをするよとtruffleに伝えています。

次に、`function()` の引数として、`network` と `accounts` を追加していきましょう。

```javascript
// 2_deploy_contracts.js
module.exports = async function(deployer, newtwork, accounts) {
    :
```

`async` キーワードを追加するのをお忘れなく！

マイグレーションファイル内でアクセス可能な変数として、スマートコントラクトが配置される `network`　と、Ganacheからのアカウントリスト（`accounts`）を追加しました。これは、投資家に Dapp トークンを提供するために重要な変数となります。

次の部分では、 `deploy()` で実際にコントラクトをデプロイして、`deployed()` でデプロイされた結果を取得しています。

```javascript
// 2_deploy_contracts.js

// 偽の Dai トークンをデプロイする
await deployer.deploy(DaiToken)
const daiToken = await DaiToken.deployed()

// Dapp トークンをデプロイする
await deployer.deploy(DappToken)
const dappToken = await
DappToken.deployed()

// dappToken と daiToken のアドレスを引数に、Token Farm をデプロイする
await deployer.deploy(TokenFarm, dappToken.address, daiToken.address)
const tokenFarm = await
TokenFarm.deployed()
```

これらのコードが実行されると、3つのスマートコントラクトがブロックチェーン上にデプロイされます！

最後に、今回のアプリケーションでユーザーがステーキングするのに使う偽の Dai トークンと、その見返りとしてコミュニティが渡す Dapp トークンをコントラクトへそれぞれ 100 Dai, 100万 Dappずつデプロイします。

一つ一つ見ていきましょう。まず、`dappToken` を `tokenFarm` に預け入れる処理を確認しましょう。

 ```javascript
// 2_deploy_contracts.js

// 100万Dappデプロイする
await dappToken.transfer(tokenFarm.address, '1000000000000000000000000')
```

投資家は　Dai トークンをトークンファーム（`tokenFarm.address`）に預け入れ、その見返りとして、Dapp トークンを獲得します。このフローを実現するために、ここでは、すべての Dapp トークンをトークンファームに割り当てています。

現実の世界のプロジェクトも、上記のようなフローで動いています。

基本的に、プロジェクトオーナーはすべてのオリジナルトークン（e.g., Dapp）を流動性プールに置き、アプリからそれらのトークンを投資家に配布しています。

- すべての Dapp トークンをこのトークンファームプロジェクトに配置し、投資家がWEBアプリケーションを使うときに、自動的にトークンが分配されるようにします。
- ユーザーは、Dapp トークンを購入する代わりに、流動性マイニングやイールドファーミングによって Dapp トークンを獲得することができます。

ちなみに、Solidity では `1Wei(10^(-18))` が基本の単位となっているので `1Dai` は `10^18` となります。

次に、投資家（`accounts[1]`）に `daiToken` を付与するコードを確認しましょう。

 ```javascript
// 2_deploy_contracts.js

// 100Daiデプロイする
await daiToken.transfer(accounts[1], '100000000000000000000')
```

投資家には、Dai トークンを `tokenFarm` に預けてもらいたいので、Dai をいくつか持っていてもらう必要があります。

今、DaiToken をデプロイすると、すべてのトークンはデプロイした人（＝あなた / Ganache の `accounts[0]`）のものになります。なので、ここでは、Dai の一部を投資家に譲渡しています。

- Dai トークンの `transfer` 関数についている `accounts[1]` というのは Ganache のアカウントの上から2番目のアカウントのことを示しています。
- 後から出てくるので頭の片隅に置いておいてください。

### 🪙　TokenFarmコントラクトに Dai と Dapp トークンを導入する

`TokenFarm` コントラクトで `Dai` トークンと `Dapp` トークンが使えるようにするために `TokenFarm.sol` を次のように更新しましょう。

```javascript
// TokenFarm.sol
pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

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

まず `DappToken` と `DaiToken` をインポートすることで `DappToken` と `DaiToken` を使えるようにします。

```javascript
import "./DappToken.sol";
import "./DaiToken.sol";
```

次にそれらを `constructor` で呼び出します。
- `constructor` は、スマートコントラクトがネットワークにデプロイされるたびに、一度だけ実行される特別な関数です。
- `constructor` の中にコードを入れることができ、関数が呼び出されるたびに、中のコードが実行されます。

DaiToken と DappToken はネットワークにすでにデプロイされていると仮定しているので、あとは　TokenFarm　のコントラクトが作成されるたびに DaiToken と DappToken のコントラクトアドレスを取得し、`constructor` に渡すだけです。

```javascript
// TokenFarm.sol
constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
}
```
`constructor()` の 中にある `DappToken` と `DaiToken` は実際のスマートコントラクトである「型」です。

`_dappToken` と `_daiToken` は、それぞれコントラクトのアドレスです。
そして、これらの変数を取り出して、それぞれ状態変数である `dappToken` と `daiToken` に代入しています。

* `_dappToken` と `_daiToken` はローカル変数であり、他の関数からアクセスすることはできません。これらの変数がスマートコントラクトの外部からアクセスできるようにするには、状態変数として保存する必要があります。

### 🛠 スマートコントラクトをデプロイしよう

ではターミナルを開いて `yield-farm-starter-project` にいることを確認してから下記のコードを実行してみてください。

```bash
truffle compile
```

`Compiled successfully` とターミナルに出力されたでしょうか？

無事にコントラクトのコンパイルが済んだら、次に以下のコマンドをターミナルで実行し、ブロックチェーンにコントラクトをデプロイしましょう。

```bash
truffle migrate --reset
```

ターミナルの出力結果が以下のように表示されていればデプロイは成功です！

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
ここでは、ブロックチェーンのスマートコントラクトを置き換えるために `reset` フラグを使用しました。

ブロックチェーン上のスマートコントラクトは、不変のコードです。つまり、中身を書き換えたい場合は、コードそのものを置き換える必要があります。

### 👀 スマートコントラクトを確認しよう

以下のコマンドを実行して、コントラクトがデプロイされていることを確認しましょう。

```bash
truffle console
```

`truffle(development)` がターミナルに表示されたら、以下のコードを実行してみてください。


```bash
truffle(development)> mDai = await DaiToken.deployed()
```

```bash
truffle(development)> accounts = await web3.eth.getAccounts()
```

どちらを実行しても、ターミナルに `undefined` と出力されるはずですが、ここで初めて `mDai` や `accounts` を定義しているので、問題はありません。

次に、ターミナルで以下のコードを実行していきましょう。

```bash
truffle(development)> accounts[1]
```

ターミナルに出力されるアドレスが、Ganacheに表示されている上から2番目のアカウントのアドレスと一致していることを確認しましょう！このアカウントは仮想の投資家のアドレスとなります。

次に、ターミナルで以下のコードを実行していきましょう。

```bash
truffle(development)> balance = await mDai.balanceOf(accounts[1])
```
```bash
truffle(development)> balance.toString()
```

`100000000000000000000` がターミナルに出力されることを確認してください。

ここで、何を実行したのかを解説します。

まず、`src/contracts/DaiToken.sol` を見て、以下のコードを確認しましょう:


```javascript
// DaiToken.sol

mapping(address => unit256) public balanceOf
```

`balanceOf` 関数は、アドレスから誰がどれだけの偽 Dai を所有しているかを確認できる関数です。

`balanceOf` は実際にはマッピングですが、ここでは `public` と定義しているので、誰でもこのマッピングの値を `balanceOf` 関数で取得することができます。

マッピングとは他のプログラミング言語における連想配列やハッシュテーブル、キーバリューストアのようなもので、Key を与えると Value を返してくれるものです。

それでは、`100000000000000000000` という値を人間の読みやすい形に変換するために、以下のコードを `truffle(development)` 上で実行しましょう。

```bash
truffle(development)> formattedBalance = web3.utils.fromWei(balance)
```

`100` とターミナルに出力されたでしょうか？

ちょっと前に、Dappのトークンは小数点以下が18桁という話をしたのを覚えていますか？

イーサリアムでは、基本的に小数点以下が18桁あることが分かっているイーサーの最小単位が `Wei` となります。

つまり、この出力結果は、投資家アカウントである `accounts[1]` が 100　Dai トークンを持っていることを意味します。

以上で、truffle を用いたコントラクトの検証は終了です！

* truffleコンソールを終了するには、`^C` を2回入力するか、`.exit` を入力してください。

truffle について更に詳しく知りたい方は、[こちら](https://github.com/trufflesuite/truffle)の GitHub レポジトリをご覧ください。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#section-2` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 3 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---
これでトークンを送れることが確認できました！次はより実践的なことをテストするということをしていきます。

###  🖥 このレッスンの参考動画URL
[Dapp University](https://youtu.be/CgXQC4dbGUE?t=3794)

### 📝 ステーキングの仕組み実装する

ここからはこの Yield Farming の根幹となるステーキングのシステムを実装していきます。

まず、`TokenFarm.sol` を以下のように更新していきましょう。

```javascript
// TokenFarm.sol
pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm{
    string public name = "Dapp Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;

    // 7. これまでにステーキングを行ったすべてのアドレスを追跡する配列を作成
    address[] public stakers;

    //4.投資家のアドレスと彼らのステーキングしたトークンの量を紐づける mapping を作成
    mapping (address => uint) public stakingBalance;

    // 6. 投資家のアドレスをもとに彼らがステーキングを行ったか否かを紐づける mapping を作成
    mapping (address => bool) public hasStaked;

    // 10. 投資家の最新のステイタスを記録するマッピングを作成
    mapping (address => bool) public isStaking;

    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
    }
    //1.ステーキング機能を作成する
    function stakeTokens(uint _amount) public {
        // 2. ステーキングされるトークンが0以上あることを確認
        require(_amount > 0, "amount can't be 0");
        // 3. 投資家のトークンを TokenFarm.sol に移動させる
        daiToken.transferFrom(msg.sender, address(this), _amount);

        // 5. ステーキングされたトークンの残高を更新する
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // 8. 投資家がまだステークしていない場合のみ、彼らをstakers配列に追加する
        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }
        // 9. ステーキングステータスの更新
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }
}
```

コードの理解を促進するために、1 から 10 までコメントに番号を振りました。一つずつみていきましょう。

まず、新しく追加された　`stakeTokens()` 関数に注目してください。

```javascript
// TokenFarm.sol
//1.ステーキング機能を作成する
function stakeTokens(uint _amount) public {
：
}
```

`stakeTokens` 関数は、ステークするトークンの量（`_amount`）をを引数としています。

- また、この関数は、スマートコントラクトの外部から呼び出せるように `public` 修飾子を持っています。

`stakeTokens` 関数の主な役割は、**投資家のウォレットから `TokenFarm.sol` というスマートコントラクトに Dai トークンを転送すること**です。

更に詳しく見ていきましょう。

```javascript
// TokenFarm.sol
// 1.ステーキング機能を作成する
function stakeTokens(uint _amount) public {
    // 2. ステーキングされるトークンが0以上あることを確認
    require(_amount > 0, "amount can't be 0");
    // 3. 投資家のトークンを TokenFarm.sol に移動させる
    daiToken.transferFrom(msg.sender, address(this), _amount);
:
}
```

ここで最も重要になるのが、`transferFrom()` 関数です。

`daiToken` のもととなるスマートコントラクト `DaiToken.sol` は他のERC-20トークンと同じように `transferFrom()` 関数を保持しています。
- `transferFrom()` 関数の中身が気になる人は、`DaiToken.sol` の中に定義されている `transferFrom()` を見てみてください!

`transferFrom()` を使用すると、投資家に代わってコントラクト自体（`TokenFarm.sol`）が、実際に資金を移動させることができるようになります。
- `msg.sender` は Solidity 内部の特別な変数です。`msg` またはメッセージは Solidity 内のグローバル変数で、関数が呼び出されるたびに送信されるメッセージに対応します。`sender` は関数を呼び出した人を意味します。
- 第二引数 `address(this)` は、アドレス型に変換されたスマートコントラクトそのもの（`TokenFarm.sol`）です。
- 第三引数は、 `msg.sender` が移動させるトークンの量 `amount` を意味します。

### 🎁 ステーキングに関するデータを保存する

`stakeTokens()` 関数を実装するためには、いろいろなことを記録しておく必要があります。
- トークンファームの中にどれだけのトークンがあるのか、ユーザーがどれだけの金額を預けているのか、など。

そのために、まず、投資家のアドレスと彼らのステーキングしたトークンの量を紐づけるマッピングを作成します。

```javascript
// TokenFarm.sol
//4.投資家のアドレスと彼らのステーキングしたトークンの量を紐づける mapping を作成
mapping (address => uint) public stakingBalance;
```

マッピングは Key に対応する Value を返すデータ構造です。
今回定義した `stakingBalance` の場合、Key は `address` （投資のウォレットアドレス）、Value は投資家がステークするトークンの量になります。

次に、`stakeTokens()` の中で、`stakingBalance` マッピングを使用し、ステーキングされたトークンの残高が更新されるようにします。

```javascript
// TokenFarm.sol
// 5. ステーキングされたトークンの残高を更新する
stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;
```

次に、投資家がステーキングを行ったことを記録していきます。そのために、別のマッピングを作成します。

```javascript
// TokenFarm.sol
// 6. 投資家のアドレスをもとに彼らがステーキングを行ったか否かを紐づける mapping を作成
mapping (address => bool) public hasStaked;
```

また、これまでにステークしたことのあるすべてのアドレスを追跡する配列（`stakers`）も作成します。

```javascript
// TokenFarm.sol
// 7. これまでにステーキングを行ったすべてのアドレスを追跡する配列を作成
address[] public stakers;
```

Solidityの配列はリストなので、`stakers` の中身は、以下のような形になります。

```
["0x0...", "0x43...", "0x12..."]
```

`stakers` 配列が必要なのは、後でステーキングをしてくれた投資家たちに報酬を発行する必要があるためです。

それでは、`stakeTokens()` に戻り、投資家を `stakers` 配列に追加する機能をみていきましょう。

```javascript
// TokenFarm.sol
// 8. 投資家がまだステークしていない場合のみ、彼らをstakers配列に追加する
if(!hasStaked[msg.sender]){
    stakers.push(msg.sender);
}
```

ここでポイントとなるのは、`stakers` 配列には、ユニークなアドレスのみ保管しているということです。

よって、上記のコードでは、**ステーキングする行う投資家（ユーザー）が Token Farm のはじめてのお客様であった場合にのみ**、彼らのアドレスを、`stakers` 配列に追加する仕様になっています。


最後に、投資家のステーキングに関する状態を更新するコードを追加します。

```javascript
// TokenFarm.sol
// 9. ステーキングステータスの更新
isStaking[msg.sender] = true;
hasStaked[msg.sender] = true;
```

```javascript
// TokenFarm.sol
// 10. 投資家の最新のステイタスを記録するマッピングを作成
mapping (address => bool) public isStaking;
```

以上で、`TokenFarm.sol` の更新は終了です。次に、テストコードを更新していきます。
### 💪 テストを更新する

`TokenFarm_test.js` を下のように更新してきましょう。

```javascript
// TokenFarm_test.js
const DappToken = artifacts.require(`DappToken`)
const DaiToken = artifacts.require(`DaiToken`)
const TokenFarm = artifacts.require(`TokenFarm`)

require(`chai`).use(require('chai-as-promised')).should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('TokenFarm', ([owner, investor]) => {
    let daiToken, dappToken, tokenFarm

    before(async () =>{
        //コントラクトを読み込む
        daiToken = await DaiToken.new()
        dappToken = await DappToken.new()
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

        //全てのDappトークンをファームに移動する(1 million)
        await dappToken.transfer(tokenFarm.address, tokens('1000000'));

        await daiToken.transfer(investor, tokens('100'), {from: owner})
    })

    describe('Mock DAI deployment', async () => {
        //テスト1
        it('has a name', async () => {
            const name = await daiToken.name()
            assert.equal(name, 'Mock DAI Token')
        })
    })

    describe('Dapp Token deployment', async () => {
        // テスト2
        it('has a name', async () => {
            const name = await dappToken.name()
            assert.equal(name, 'DApp Token')
        })
    })

    describe('Token Farm deployment', async () => {
        // テスト3
        it('has a name', async () => {
            const name = await tokenFarm.name()
            assert.equal(name, "Dapp Token Farm")
        })
        // テスト4
        it('contract has tokens', async () => {
            let balance = await dappToken.balanceOf(tokenFarm.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })
    // ----- 追加するテストコード ------ //
    describe('Farming tokens', async () => {
        it('rewords investors for staking mDai tokens', async () => {
            let result
            // テスト5. ステーキングの前に投資家の残高を確認する
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct before staking')

            // テスト6. 偽のDAIトークンを確認する
            await daiToken.approve(tokenFarm.address, tokens('100'), {from: investor})
            await tokenFarm.stakeTokens(tokens('100'), {from: investor})

            // テスト7. ステーキング後の投資家の残高を確認する
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('0'), 'investor Mock DAI wallet balance correct after staking')

            // テスト8. ステーキング後のTokenFarmの残高を確認する
            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('100'), 'Token Farm Mock DAI balance correct after staking')

            // テスト9. 投資家がTokenFarmにステーキングした残高を確認する
            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(), tokens('100'), 'investor staking balance correct after staking')

            // テスト10. ステーキングを行った投資家の状態を確認する
            result = await tokenFarm.isStaking(investor)
            assert.equal(result.toString(), 'true', 'investor staking status correct after staking')

        })
    })
})
```

`追加するテストコード` の中身をよく見てみてください。

ここでのポイントは、`approve` 関数を呼び出して、`investor` を `TokenFarm` の承認済みユーザとして登録している点です。
- `approve` 関数について復習したい方は、section 1 の lesson 2 を参照してください!

`approve` 関数が実行されることにより、`investor` は自身のトークンを Token Farm にステークできるようになります。
### 🔥 テストを実行する

それでは、テストを実行していきましょう

ターミナルを開いて `yield-farm-starter-project` にいることを確認してから下記のコードを実行してみてください。

```bash
truffle test
```

以下のような結果がターミナルに出力されていれば成功です🎉

```bash
Contract: TokenFarm
    Mock DAI deployment
      ✓ has a name (39ms)
    Dapp Token deployment
      ✓ has a name (43ms)
    Token Farm deployment
      ✓ has a name (40ms)
      ✓ contract has tokens (51ms)
    Farming tokens
      ✓ rewords investors for staking mDai tokens (467ms)


  5 passing (1s)
```

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
ここまででステーキングの実装は完成しましたね！

次のレッスンではステーキングしたトークンに対して報酬としてコミュニティのトークンを提供する機能と、ステーキングしたトークンを自分の手元に戻す機能の実装に入ってバックエンドは完成するので後一踏ん張り頑張っていきましょう！

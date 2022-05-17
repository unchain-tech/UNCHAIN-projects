###  🖥 このレッスンの参考動画URL
[Dapp University](https://youtu.be/CgXQC4dbGUE?t=5089)

### 💪 ステーキングに必要な残りの機能を実装しよう

前回のレッスンでは、`TokenFarm.sol` にステーキング機能を実装しました。
今回は、Yield Farming を完成させるために、残り二つの機能を実装していきます。
1. コミュニティのトークン発行機能
2. ステーキングしたトークンを手元に戻す機能（アンステーキング機能）

それでは早速 `TokenFarm.sol` をしたのように更新していきましょう！

```javascript
// TokenFarm.sol
pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm{
    string public name = "Dapp Token Farm";
    address public owner;
    DappToken public dappToken;
    DaiToken public daiToken;

    address[] public stakers;
    mapping (address => uint) public stakingBalance;
    mapping (address => bool) public hasStaked;
    mapping (address => bool) public isStaking;

    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }


    //1.ステーキング機能
    function stakeTokens(uint _amount) public {
        require(_amount > 0, "amount can't be 0");
        daiToken.transferFrom(msg.sender, address(this), _amount);

        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }

        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // ----- 追加する機能 ------ //
    //2.トークンの発行機能
    function issueTokens() public {
        // Dapp トークンを発行できるのはあなたのみであることを確認する
        require(msg.sender == owner, "caller must be the owner");

        // 投資家が預けた偽Daiトークンの数を確認し、同量のDappトークンを発行する
        for(uint i=0; i<stakers.length; i++){
            // recipient は Dapp トークンを受け取る投資家
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if(balance > 0){
                dappToken.transfer(recipient, balance);
            }
        }
    }

    //　3.アンステーキング機能
    // * 投資家は、預け入れた Dai を引き出すことができる
    function unstakeTokens() public {
        // 投資家がステーキングした金額を取得する
        uint balance = stakingBalance[msg.sender];
        // 投資家がステーキングした金額が0以上であることを確認する
        require(balance > 0, "staking balance cannot be 0");
        // 偽の Dai トークンを投資家に返金する
        daiToken.transfer(msg.sender, balance);
        // 投資家のステーキング残高を0に更新する
        stakingBalance[msg.sender] = 0;
        // 投資家のステーキング状態を更新する
        isStaking[msg.sender] = false;
    }
}
```

以上で、`TokenFarm.sol` に Yield Farming を実装する上で必要な機能が全て備わりました！
### 👀 テストコードを更新する。

それでは、`TokenFarm_test.js` を更新して、テストを行っていきましょう。

- `追加するテストコード` が新しく追加されるテストコードです。

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
        //コントラクトの読み込み
        daiToken = await DaiToken.new()
        dappToken = await DappToken.new()
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

        //全てのDappトークンをファームに移動する(1 million)
        await dappToken.transfer(tokenFarm.address, tokens('1000000'));

        await daiToken.transfer(investor, tokens('100'), {from: owner})
    })
    // テスト1
    describe('Mock DAI deployment', async () => {
        it('has a name', async () => {
            const name = await daiToken.name()
            assert.equal(name, 'Mock DAI Token')
        })
    })
    // テスト2
    describe('Dapp Token deployment', async () => {
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

            // ----- 追加するテストコード ------ //

            // トークンを発行する
            await tokenFarm.issueTokens({from: owner})

            // トークンを発行した後の投資家の Dapp 残高を確認する
            result = await dappToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor DApp Token wallet balance correct after staking')

            // あなた（owner）のみがトークンを発行できることを確認する（もしあなた以外の人がトークンを発行しようとした場合、却下される）
            await tokenFarm.issueTokens({from: investor}).should.be.rejected

            //トークンをアンステーキングする
            await tokenFarm.unstakeTokens({from: investor})

            //テスト11. アンステーキングの結果を確認する
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct after staking')

            //テスト12.投資家がアンステーキングした後の Token Farm 内に存在する偽の Dai 残高を確認する
            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('0'), 'Token Farm Mock DAI balance correct after staking')

            //テスト13. 投資家がアンステーキングした後の投資家の残高を確認する
            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(), tokens('0'), 'investor staking status correct after staking')

            //テスト14. 投資家がアンステーキングした後の投資家の状態を確認する
            result = await tokenFarm.isStaking(investor)
            assert.equal(result.toString(), 'false', 'investor staking status correct after staking')

        })
    })
})
```

ではターミナルを開いて `yield-farm-starter-project` ディレクトリにいることを確認してから下記のコードを実行してみてください。

```bash
truffle test
```

下のような結果がターミナルに出力されていれば、成功です。

```bash
Contract: TokenFarm
    Mock DAI deployment
      ✓ has a name
    Dapp Token deployment
      ✓ has a name
    Token Farm deployment
      ✓ has a name
      ✓ contract has tokens (38ms)
    Farming tokens
      ✓ rewords investors for staking mDai tokens (947ms)


  5 passing (2s)

```

上記のような結果がターミナルに出力されれば、テストは成功です！

### 🪙 Dapp トークンを発行する

さて、`TokenFarm.sol` の中に Yield Farming を行うのに必要な機能はすべて揃いました。しかし、最後にやることが一つあります。

それは、`issue` 関数を呼び出すための `js` ファイルの作成です。

Token Farm のWEBアプリに Dai トークンをステーキングした投資家に Dapp トークンが自動的に発行されるのが理想ですが、今回 Dapp トークンは公開されているものではないため、手動で発行していきます。

ターミナルを開いて、`yield-farm-starter-project` にいることを確認し、以下のコードを実行して、`scripts` ディレクトリに `issue-token.js` を作成しましょう。

```bash
mkdir scripts
```
```bash
touch scripts/issue-token.js
```

では早速以下を、`issue-token.js` に書き込んでいきましょう。

```javascript
// issue-token.js
const TokenFarm = artifacts.require(`TokenFarm`)

module.exports = async function(callback) {
    let tokenFarm = await TokenFarm.deployed()
    await tokenFarm.issueTokens()
    console.log('Tokens issued!')
    callback()
}
```

これで `issueTokens` を手動で呼び出せるようになりました。ではターミナルを開いて `yield-farm-starter-project` にいることを確認してから下記のコードを順番に実行してみましょう。

```bash
truffle migrate --reset
```
```bash
truffle exec scripts/issue-token.js
```

以下のような出力結果がターミナルに反映されていればトークンの発行は成功です。

```bash
issue-token.js
Using network 'development'.

Tokens issued!
```

現在、誰も Token Farm にステーキングを行っていないので、実際にはトークンを発行することはありませんが、本番で失敗しないように実行だけはしておきます。
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
これでバックエンドの作成は完了です！お疲れ様でした🎉
ターミナルの出力結果を `#section-2` にシェアしましょう！
次の　`section-3`　ではフロントエンドの作成に取り掛かっていきます。Token Farm の完成まで後少しです！頑張っていきましょう💪

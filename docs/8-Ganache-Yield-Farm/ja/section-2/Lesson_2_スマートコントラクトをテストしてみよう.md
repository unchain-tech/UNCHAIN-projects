###  🖥 このレッスンの参考動画URL
[Dapp University](https://youtu.be/CgXQC4dbGUE?t=2894)

### ✏️ スマートコントラクトのテストを作成する

まず、ターミナルを開いて、`yield-farm-starter-project` ディレクトリにいることを確認し、以下のコマンドを実行しましょう。

```bash
mkdir test
```
```bash
touch test/TokenFarm_test.js
```

ここでは、`yield-farm-starter-project` ディレクトリの中に `test` フォルダを作成し、その中にテスト用のファイル (`TokenFarm_test.js`) を作成しています。

スマートコントラクトは、一度ブロックチェーン上にデプロイすると変更できないため、コードが問題なく動作することをテストすることが重要です。

では `TokenFarm_test.js` を開いて以下のコードを追加していきましょう。

```javascript
// TokenFarm_test.js

// 使用するスマートコントラクトをインポートする
const DappToken = artifacts.require(`DappToken`)
const DaiToken = artifacts.require(`DaiToken`)
const TokenFarm = artifacts.require(`TokenFarm`)

// chai のテストライブラリ・フレームワークを読み込む
const { assert } = require('chai');
require(`chai`)
    .use(require('chai-as-promised'))
    .should()

// 任意のETHの値をWeiに変換する関数
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

    // DaiToken
    describe('Mock DAI deployment', async () => {
        // テスト1
        it('has a name', async () => {
            const name = await daiToken.name()
            assert.equal(name, 'Mock DAI Token')
        })
    })

    // DappToken
    describe('Dapp Token deployment', async () => {
         // テスト2
        it('has a name', async () => {
            const name = await dappToken.name()
            assert.equal(name, 'DApp Token')
        })
    })

    // TokenFarm
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
})
```

コードを一つ一つみていきます。

最初に、テストしたいスマートコントラクトを呼び出します。

```javascript
// TokenFarm_test.js
// 使用するスマートコントラクトをインポートする
const DappToken = artifacts.require(`DappToken`)
const DaiToken = artifacts.require(`DaiToken`)
const TokenFarm = artifacts.require(`TokenFarm`)
```

次に、テストに使用するライブラリを読み込みます。

```javascript
// TokenFarm_test.js
const { assert } = require('chai');
require(`chai`)
    .use(require('chai-as-promised'))
    .should()
```

今回テストに使用する `chai` は、truffle が提供するテスト用のライブラリです。
- `yield-farm-starter-project/package.json` の中に、使用する `chai` のバージョンが記載されています。
- テストには、`chai` だけでなく、`mocha` とい　truffle に含まれている JavaScript 用のテストフレームワークを使用します。
- `chai` について詳しく知りたい方は、[こちら](https://www.chaijs.com/)の公式ドキュメントをご覧ください🫖
- `mocha` について詳しく知りたい方は、[こちら](https://mochajs.org/)の公式ドキュメントをご覧ください☕️

次に、任意の ETH の値を Wei に変換するヘルパー関数 `token()` を定義します。

```javascript
// TokenFarm_test.js
// 任意のETHの値をWeiに変換する関数
function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}
```

次に、マイグレーションコードを記載します。

```javascript
// TokenFarm_test.js
contract('TokenFarm', ([owner, investor]) => {
    let daiToken, dappToken, tokenFarm

    before(async () =>{
        //コントラクトの読み込み
        daiToken = await DaiToken.new()
        dappToken = await DappToken.new()
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

        //全てのDappトークンをファームに移動する(1 million)
        await dappToken.transfer(tokenFarm.address, tokens('1000000'));

        //100 Dai トークンをファームに移動する
        await daiToken.transfer(investor, tokens('100'), {from: owner})
    })
```

これらのコードは、同時に複数のテストを書くのに便利です。

`contract` の中の引数は、それぞれ以下のような変数が含まれます。
- `owner`: Dapp トークンをブロックチェーンにデプロイした人のアドレス
- `investor`: Token Farm に Dai を預ける人のアドレス

まず、3つのスマートコントラクトに関連付けるローカル変数をそれぞれ作成します。

```javascript
// TokenFarm_test.js
let daiToken, dappToken, tokenFarm
```

次に、`before` フックを作成します。

```javascript
// TokenFarm_test.js
before(async () =>{})
```

`before` フックは、各テストの前に実行される関数です。

`before` フックの内部では、3つのスマートコントラクトを読み込みます。

```javascript
// TokenFarm_test.js
//コントラクトの読み込み
daiToken = await DaiToken.new()
dappToken = await DappToken.new()
tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)
```

そして、すべての Dapp トークンと 100 Dai トークンをそれぞれトークンファームに転送します。

```javascript
// TokenFarm_test.js
//全てのDappトークンをファームに移動する(1 million)
await dappToken.transfer(tokenFarm.address, tokens('1000000'));

//100 Dai トークンをファームに移動する
await daiToken.transfer(investor, tokens('100'), {from: owner})
```

任意の ETH の値を Wei に変換する `token()` 関数がここで使用されていますね😊

最後に、3つのスマートコントラクトが正常にブロックチェーン上にデプロイされているかテストします。

`TokenFarm_test.js` のテスト1-3でやっていることはほぼ同じです。

テスト1を例に、何をやっているのか詳しく見ていきましょう。

```javascript
// TokenFarm_test.js
// DaiToken
describe('Mock DAI deployment', async () => {
    // テスト1
    it('has a name', async () => {
        const name = await daiToken.name()
        assert.equal(name, 'Mock DAI Token')
    })
})
```

テスト1は、DaiToken コントラクトがネットワークに正常にデプロイされたかどうかをテストています。

テスト1が成功した場合、テスト1は デプロイされたコントラクトが "Mock DAI Token" という名前を持っていることを示します。

最後に、TokenFarm に Dapp トークンが転送されていることを確認するためにテスト4を作成します。

```javascript
// TokenFarm_test.js
// テスト4
it('contract has tokens', async () => {
    let balance = await dappToken.balanceOf(tokenFarm.address)
    assert.equal(balance.toString(), tokens('1000000'))
})
```

テスト4が成功すると、Token Farm が 100万 Dapp Token を持っていると表示されるはずです。

> 👀: truffle console と　テストコードの違い
>
>前回のレッスンでは、truffle console を使って、選択したコントラクトがブロックチェーン上で正しく動作しているかを確認しましたが、 `TokenFarm_test.js` の内容を振り返ってみると、やっていることはほとんど同じです。
>
> しかし、`TokenFarm_test.js` のようなテストコードでは、コントラクト内のすべての関数とプロパティを一度にテストすることができます。
>
> テストコードは、1つのファイルで各機能のテストを実行できるため、便利なので、どんどん開発に取り入れていきましょう。

以上でテストの説明は終了です。それでは、テストを実行していきましょう！
### 🧪 テストを実行する

それでは、テスト実行しましょう。

ターミナルを開いて、`yield-farm-starter-project` ディレクトリにいることを確認し、以下のコマンドを実行してください。

```bash
truffle test
```

ターミナルに以下のような結果が返ってきていればテスト成功です！

```bash
Contract: TokenFarm
    Mock DAI deployment
      ✓ has a name (57ms)
    Dapp Token deployment
      ✓ has a name (63ms)
    Token Farm deployment
      ✓ has a name (53ms)
      ✓ contract has tokens (48ms)


  4 passing (866ms)
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
スマートコントラクトのテストは出来ましたか？次からはいよいよステーキングのシステムを作っていきます。

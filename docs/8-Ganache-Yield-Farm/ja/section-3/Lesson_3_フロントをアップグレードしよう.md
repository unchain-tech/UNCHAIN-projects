###  🖥 このレッスンの参考動画URL
[Dapp University](https://youtu.be/CgXQC4dbGUE?t=7594)

### 🔥 バックエンドとフロントエンドの接続部分の残りを完成させる

前のレッスンで作成させたものに加えて仕上げをしてバックエンドとフロントエンドの接続部分を完成させましょう！

`App.js` を以下のように更新してください。

```javascript
// App.js
// フロントエンドを構築する上で必要なファイルやライブラリをインポートする
import React, { Component } from 'react'
import Web3 from 'web3'
import DaiToken from '../abis/DaiToken.json'
import DappToken from '../abis/DappToken.json'
import TokenFarm from '../abis/TokenFarm.json'
import Navbar from './Navbar'
import Main from './Main'
import './App.css'

class App extends Component {
  // componentWillMount(): 主にサーバーへのAPIコールを行うなど、実際のレンダリングが行われる前にサーバーサイドのロジックを実装するために使用。
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }
  // loadBlockchainData(): ブロックチェーン上のデータとやり取りするための関数
  // MetaMask との接続によって得られた情報とコントラクトとの情報を使って描画に使う情報を取得。
  async loadBlockchainData() {
    const web3 = window.web3
    // ユーザーの Metamask の一番最初のアカウント（複数アカウントが存在する場合）取得
    const accounts = await web3.eth.getAccounts()
    // ユーザーの Metamask アカウントを設定
    // この機能により、App.js に記載されている constructor() 内の account（デフォルト: '0x0'）が更新される
    this.setState({ account: accounts[0]})
    // ユーザーが Metamask を介して接続しているネットワークIDを取得
    const networkId = await web3.eth.net.getId()

    // DaiToken のデータを取得
    const daiTokenData = DaiToken.networks[networkId]
    if(daiTokenData){
      // DaiToken の情報を daiToken に格納する
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address)
      // constructor() 内の daiToken の情報を更新する
      this.setState({daiToken})
      // ユーザーの Dai トークンの残高を取得する
      let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call()
      // daiTokenBalance（ユーザーの Dai トークンの残高）をストリング型に変更する
      this.setState({daiTokenBalance: daiTokenBalance.toString()})
      // ユーザーの Dai トークンの残高をフロントエンドの Console に出力する
      console.log(daiTokenBalance.toString())
    }else{
      window.alert('DaiToken contract not deployed to detected network.')
    }
    // ↓ --- 1. 追加するコード ---- ↓
    // DappToken のデータを取得
    const dappTokenData = DappToken.networks[networkId]
    if(dappTokenData){
      // DappToken の情報を dappToken に格納する
      const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address)
      // constructor() 内の dappToken の情報を更新する
      this.setState({dappToken})
      // ユーザーの Dapp トークンの残高を取得する
      let dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call()
      // dappTokenBalance（ユーザーの Dapp トークンの残高）をストリング型に変更する
      this.setState({dappTokenBalance: dappTokenBalance.toString()})
      // ユーザーの Dapp トークンの残高をフロントエンドの Console に出力する
      console.log(dappTokenBalance.toString())
    }else{
      window.alert('DappToken contract not deployed to detected network.')
    }

    // tokenFarmData のデータを取得
    const tokenFarmData = TokenFarm.networks[networkId]
    if(tokenFarmData){
      // TokenFarm の情報を tokenFarm に格納する
      const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)
      // constructor() 内の tokenFarm の情報を更新する
      this.setState({tokenFarm})
      // tokenFarm 内にステーキングされている Dai トークンの残高を取得する
      let tokenFarmBalance = await tokenFarm.methods.stakingBalance(this.state.account).call()
      // stakingBalance をストリング型に変更する
      this.setState({stakingBalance: tokenFarmBalance.toString()})
      // ユーザーの stakingBalance をフロントエンドの Console に出力する
      console.log(stakingBalance.toString())
    }else{
      window.alert('TokenFarm contract not deployed to detected network.')
    }
    // ↑ --- 1. 追加するコード ---- ↑
  }
  // loadWeb3(): ユーザーが Metamask アカウントを持っているか確認する関数
  async loadWeb3() {
    // ユーザーが Metamask のアカウントを持っていた場合は、アドレスを取得
    if (window.etheruem) {
      window.web3 = new Web3(window.etheruem)
      await window.etheruem.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    // ユーザーが Metamask のアカウントを持っていなかった場合は、エラーを返す
    else {
      window.alert('Non etheruem browser detected. You should consider trying to install metamask')
    }

    this.setState({ loading: false})
  }
  // ↓ --- 2. 追加するコード ---- ↓
  // TokenFarm.sol に記載されたステーキング機能を呼び出す
  stakeTokens = (amount) => {
    this.setState({loading: true})
    this.state.daiToken.methods.approve(this.state.tokenFarm._address, amount).send({from: this.state.account}).on('transactionHash', (hash)=> {
      this.state.tokenFarm.methods.stakeTokens(amount).send({from: this.state.account}).on('transactionHash', (hash) => {
        this.setState({loading: false})
      })
    })
  }
  // TokenFarm.sol に記載されたアンステーキング機能を呼び出す
  unstakeTokens = (amount) => {
    this.setState({loading: true})
    this.state.tokenFarm.methods.unstakeTokens().send({from: this.state.account}).on('transactionHash', (hash) => {
      this.setState({loading: false})
    })
  }
  // ↑ --- 2. 追加するコード ---- ↑

  // constructor(): ブロックチェーンから読み込んだデータ + ユーザーの状態を更新する関数
  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      daiToken: {},
      dappToken: {},
      tokenFarm: {},
      daiTokenBalance: '0',
      dappTokenBalance: '0',
      stakingBalance: '0',
      loading: true
    }
  }

  // フロントエンドのレンダリングが以下で実行される
  render() {
    let content
    if(this.state.loading){
      content = <p id='loader' className='text-center'>Loading...</p>
    }else{
      content = <Main
        daiTokenBalance = {this.state.daiTokenBalance}
        dappTokenBalance = {this.state.dappTokenBalance}
        stakingBalance = {this.state.stakingBalance}
        stakeTokens = {this.stakeTokens}
        unstakeTokens={this.unstakeTokens}
      />
    }
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                {content}

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

```

まずは以下のインポート部分を見ていきましょう。

```javascript
// App.js
import React, { Component } from 'react'
import Web3 from 'web3'
import DaiToken from '../abis/DaiToken.json'
import DappToken from '../abis/DappToken.json'
import TokenFarm from '../abis/TokenFarm.json'
import Navbar from './Navbar'
import Main from './Main'
import './App.css'
```

ここで注目していただきたいのは、`DappToken.json`、`TokenFarm.json`、`Main.js` をインポートしている点です。

`Main.js` は、ユーザーの状態に応じてフロントエンドの表示（UI）を変えたいときに、if文が多すぎてコードが読みづらくならないように、コードを分割して保存するために使うファイルです。このレッスンの最後に作成します🔥

つまり、ロード時以外のフロントエンドでレンダリングされるデザインは、`Main.js`にあるのです!

次に、`dappTokenData` と `tokenFarmData` を使用し、スマートコントラクトのデータをWEBアプリに読み込むコードを見ていきましょう。

```javascript
// App.js
// ↓ --- 1. 追加するコード ---- ↓
// DappToken のデータを取得
const dappTokenData = DappToken.networks[networkId]
if(dappTokenData){
  // DappToken の情報を dappToken に格納する
  const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address)
  // constructor() 内の dappToken の情報を更新する
  this.setState({dappToken})
  // ユーザーの Dapp トークンの残高を取得する
  let dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call()
  // dappTokenBalance（ユーザーの Dapp トークンの残高）をストリング型に変更する
  this.setState({dappTokenBalance: dappTokenBalance.toString()})
  // ユーザーの Dapp トークンの残高をフロントエンドの Console に出力する
  console.log(dappTokenBalance.toString())
}else{
  window.alert('DappToken contract not deployed to detected network.')
}

// tokenFarmData のデータを取得
const tokenFarmData = TokenFarm.networks[networkId]
if(tokenFarmData){
  // TokenFarm の情報を tokenFarm に格納する
  const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)
  // constructor() 内の tokenFarm の情報を更新する
  this.setState({tokenFarm})
  // tokenFarm 内にステーキングされている Dai トークンの残高を取得する
  let tokenFarmBalance = await tokenFarm.methods.stakingBalance(this.state.account).call()
  // stakingBalance をストリング型に変更する
  this.setState({stakingBalance: tokenFarmBalance.toString()})
  // ユーザーの stakingBalance をフロントエンドの Console に出力する
  console.log(stakingBalance.toString())
}else{
  window.alert('TokenFarm contract not deployed to detected network.')
}
// ↑ --- 1. 追加するコード ---- ↑
```

実際に、フロントエンドをブラウザで確認する際に、右クリック → `Inspect` → `Console` を選択して、`console.log` で出力される結果を確認してみてください。

次に `stakeTokens`、`unstakeTokens` メソッドについて書かれた部分を見ていきましょう。

```javascript
// App.js
// ↓ --- 2. 追加するコード ---- ↓
// TokenFarm.sol に記載されたステーキング機能を呼び出す
stakeTokens = (amount) => {
  this.setState({loading: true})
  this.state.daiToken.methods.approve(this.state.tokenFarm._address, amount).send({from: this.state.account}).on('transactionHash', (hash)=> {
    this.state.tokenFarm.methods.stakeTokens(amount).send({from: this.state.account}).on('transactionHash', (hash) => {
      this.setState({loading: false})
    })
  })
}
// TokenFarm.sol に記載されたアンステーキング機能を呼び出す
unstakeTokens = (amount) => {
  this.setState({loading: true})
  this.state.tokenFarm.methods.unstakeTokens().send({from: this.state.account}).on('transactionHash', (hash) => {
    this.setState({loading: false})
  })
}
// ↑ --- 2. 追加するコード ---- ↑
```

ここでは `TokenFarm.sol` で作成されたメソッドを呼び出して、フロントエンド上でユーザーがステーキングとアンステーキングを行うための処理が記述されています。

最後に `render` メソッドの中で `return` の前に書かれている処理を見ていきましょう。

```javascript
// App.js
let content
    if(this.state.loading){
      content = <p id='loader' className='text-center'>Loading...</p>
    }else{
      content = <Main
        daiTokenBalance = {this.state.daiTokenBalance}
        dappTokenBalance = {this.state.dappTokenBalance}
        stakingBalance = {this.state.stakingBalance}
        stakeTokens = {this.stakeTokens}
        unstakeTokens={this.unstakeTokens}
      />
    }
```

ここでは、`render` メソッドを使用することで、フロントエンドの状態により、描画するコンポーネントを切り替える処理が記載されています。

`App.js` の中に以下のようなコードが記載されていることにお気づきでしょうか？

```javascript
// App.js
this.setState({loading: true})
```
```javascript
// App.js
this.setState({loading: false})
```

`this.setState()` は、フロントエンドがローディング状態であるか否か設定する関数です。この関数により、フロントエンドに異なるコンポーネントが表示されます。
- `loading` が `true` の場合にはフロントエンド画面に `loading` と表示されます。
- `loading` が `false` の場合は `Main` コンポーネントに変数を受け渡して、`Main` コンポーネントに書かれているデザインがフロントエンドに描画されます。

### 👨‍🎨 `Main.js` を作成する

それでは、仕上げに `Main.js` を `Components` ディレクトリに作成していきます。

ターミナルを開いて `yield-farm-starter-project` にいることを確認したら、下記のコードを実行してください。

```bash
touch src/components/Main.js
```

ファイルが完成したら `Main.js` に以下のコードを記述してください。

```javascript
// Main.js
import React, { Component } from 'react'
import dai from '../dai.png'
class Main extends Component {
  render() {
    return (
      <div id='content' className='mt-3'>
       <table className='table table-borderless text-muted text-center'>
           <thead>
               <tr>
                   <th scope='col'>Staking Balance</th>
                   <th scope='col'>Reward Balance</th>
               </tr>
           </thead>
           <tbody>
               <tr>
                   <td>{window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} mDAI</td>
                   <td>{window.web3.utils.fromWei(this.props.dappTokenBalance, 'Ether')} DAPP</td>
               </tr>
           </tbody>
       </table>
       <div className='card mb-4'>
           <div className='card-body'>
               <form className='mb-3' onSubmit={(event) => {
                   event.preventDefault()
                   let amount
                   amount = this.input.value.toString()
                   amount = window.web3.utils.toWei(amount, 'Ether')
                   this.props.stakeTokens(amount)
               }}>
                   <div>
                       <label className='float-left'><b>Stake Tokens</b></label>
                       <span className='float-right text-muted'>
                       Balance: {window.web3.utils.fromWei(this.props.daiTokenBalance, 'Ether')}
                       </span>
                   </div>
                   <div className='input-group mb-4'>
                       <input
                        type="text"
                        ref = {(input) => {this.input = input}}
                        className="form-control form-control-lg"
                        placeholder='0'
                        required
                       />
                       <div className='input-group-append'>
                           <img src={dai} height='32' alt=""/>
                           &nbsp;&nbsp;&nbsp; mDai
                       </div>
                   </div>
                   <button type='submit' className='btn btn-primary btn-block btn-lg'>STAKE!</button>
               </form>
               <button
                type='submit'
                className='btn btn-link btn-block btn-sm'
                onClick={(event) => {
                    event.preventDefault()
                    this.props.unstakeTokens()
                }}
                >
                    UN-STAKE...
                </button>
           </div>
       </div>
      </div>
    );
  }
}

export default Main;
```

`Main.js` には、Token Farm のアプリの標準のUIが記述されています。

これでフロントエンドとバックエンド、その接続部分は完成になります！

では早速、動かしていきましょう。

ターミナルを開いて `yield-farm-starter-project` にいることを確認してから下記のコードを順番に実行してみましょう。

```bash
npm run start
```

するとしたのような画面が出てくるはずです。
![](/public/images/8-Ganache-Yield-Farm/section-1/12_3_9.png)

ここで入力欄に100以下の数字を打ち込んで `STAKE!` ボタンを押してみてください。

その後下の画像のように MetaMask の画面が2回出てくるのでその二つを承認します。
![](/public/images/8-Ganache-Yield-Farm/section-1/12_3_10.png)
![](/public/images/8-Ganache-Yield-Farm/section-1/12_3_11.png)

最後にページをリロードしたら、下の画像のように Staking Balance が増えて、Balance が減っているはずです。

![](/public/images/8-Ganache-Yield-Farm/section-1/12_3_12.png)

これでステーキングが成功しました🎉

一方でトークンの発行はどうでしょうか？

Reward Balance は変わっていませんね。

それもそのはずです👍 トークンの発行は手動で行うことにしているのであなたが操作する必要があります。

ということで `npm run start` を実行したターミナルとは別のターミナルを開いて、`yield-farm-starter-project` にいることを確認してから下記のコードを実行してみましょう。

```bash
truffle exec scripts/issue-token.js
```

ターミナルに以下のような結果が返ってくれば `issue` メソッドの実行は成功です！

```bash
Using network 'development'.

Tokens issued!
```

では最後に `Dapp Token Farm` の画面に移ってみましょう。
下のように報酬として `Reward Balance` が `Staking Balance` と同じ数になっているはずです。

![](/public/images/8-Ganache-Yield-Farm/section-1/12_3_13.png)

また、`unstake` 機能もステーキング機能同様に `UN-STAKE...` ボタンを押せば実行できるので試してみてください！

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#section-3` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 3 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---
これでフロントエンドが完成しました！あなたのフロントエンドのスクリーンショットを `#section-3` にシェアしてください😊

次のレッスンで作ったWEBアプリケーションをネット上に上げましょう！

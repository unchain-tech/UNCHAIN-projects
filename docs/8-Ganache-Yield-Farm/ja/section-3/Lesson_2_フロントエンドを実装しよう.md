###  🖥 このレッスンの参考動画URL
[Dapp University](https://youtu.be/CgXQC4dbGUE?t=6809)

### 🤙 フロントとバックの接続部分を作成する

UIの作成の前にフロントとバックエンドをつなげる必要があるので、その部分を仕上げていこうと思います。

`App.js` ファイルを以下のように更新してください。

```javascript
// App.js
// フロントエンドを構築する上で必要なファイルやライブラリをインポートする
import React, { Component } from 'react'
import Web3 from 'web3'
import DaiToken from '../abis/DaiToken.json'
import Navbar from './Navbar'
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

                <h1>Hello, World!</h1>

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

フロントエンドのコードの説明は、コメント欄に記載されています。

いくつか重要なコンセプトがあるので、みていきましょう。

まずは、`App.js` の先頭に記載されているインポートの部分に注目してください。

```javascript
// App.js
import React, { Component } from 'react'
import Web3 from 'web3'
import DaiToken from '../abis/DaiToken.json'
import Navbar from './Navbar'
import './App.css'
```

ここでは、フロントエンドを実装するのに必要なファイルをインポートしています。

ポイントとなるのは、Walletとフロントエンドの接続を可能にするための `web3` ライブラリとフロントエンドから `DaiToken` コントラクトとやりとりするための `DaiToken.json` をインポートしている点です。
- `web3` / `web3.js` は、クライアントサイドアプリケーションがブロックチェーンと対話するためのJavaScriptライブラリです。

次は `constructor()` を見ていきます。ここでは、Metamask を介してユーザーがアプリにログインした際に、更新される変数を宣言しています。

```javascript
// App.js
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
```

`account` や `daiTokenBalance` などユーザーの操作によって変化しうるようなものはここで宣言しておきます。


では、フロントエンドを確認してみましょう。ファイルを上書きして保存すると、フロントエンドに反映されます。

実際にはフロントエンドのUIは変更されていないので、右クリックして　`Inspect`　を選択し、ブラウザ側のConsole を確認します。

以下のような画像が出てくれば、フロントエンドの更新は成功です！

![](/public/images/8-Ganache-Yield-Farm/section-1/12_3_8.png)

もしフロントエンドに変更が反映されていなかったら、ページをリフレッシュしてみたり、ターミナルで `^C` を入力してもう一度 `npm run start` を実行してみてください。

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
これでフロントとバックエンドの接続部分の大半が完成しました。次のレッスンでは残りの接続部分とフロントエンドのデザインをコーディングしてToken Farmを完成させましょう！

_当レッスンは、もし各自の学習状況により以前のプロジェクトと重複があるようでしたら割愛ください。_

### 🌅 イーサリアムオブジェクトを使用する

さて、web3アプリ上ではそれぞれの公開鍵が必要です。

なぜでしょう。

あるウェブサイトがブロックチェーンと情報をやりとりしようとすると、適宜必要に応じて私たちのウォレットと接続する必要があります。

一度私たちがウォレットをウェブサイトと接続するとウェブサイトは私たちの代わりにスマートコントラクトとやりとりします。私たちが**許可したこと**を行ってくれます。

`packages/client/src`フォルダの中の`App.js`に向かいましょう。
ここがフロントエンドの基点となります。

メタマスクにログインすると、自動的に`ethereum`というオブジェクトがウィンドウにインジェクトされます。

どのような挙動になるか見ていきましょう。

**注意：メタマスクのチェーン選択で自分の本来の目的のブロックチェーン以外のチェーンを選択している状態でも`ethereum`オブジェクトはインジェクトされます。後でそれも実感できるでしょう。**

```javascript
import React, { useEffect } from 'react';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';

// 定数
const TWITTER_HANDLE = 'UNCHAIN_tech';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // ウォレットの接続を確認します。
  const checkIfWalletIsConnected = () => {
    // window.ethereumの設定。この表記法はJavascriptの「分割代入」を参照。
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have MetaMask!');
      return;
    } else {
      console.log('We have the ethereum object', ethereum);
    }
  };

  // まだウォレットに接続されていない場合のレンダリングです。
  const renderNotConnectedContainer = () => (
    <div className="connect-wallet-container">
      <img
        src="https://media.giphy.com/media/3ohhwytHcusSCXXOUg/giphy.gif"
        alt="Ninja gif"
      />
      <button className="cta-button connect-wallet-button">
        Connect Wallet
      </button>
    </div>
  );

  // ページがリロードされると呼び出されます。
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <header>
            <div className="left">
              <p className="title">🐱‍👤 Ninja Name Service</p>
              <p className="subtitle">Your immortal API on the blockchain!</p>
            </div>
          </header>
        </div>

        {/* render 関数をここに追加します */}
        {renderNotConnectedContainer()}

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >
            {`built with @${TWITTER_HANDLE}`}
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;
```

これでメタマスク拡張機能がインストールされているかのロジックを作成しました。
ページを更新するとブラウザのDevコンソールには`We have the ethereum object`と表示されるでしょう（メタマスクがインストール済みの場合）。

ページを好みに合わせてカスタマイズしてみてください。[GIF の参考サイト](https://giphy.com/)です。

![](/public/images/Polygon-ENS-Domain/section-2/2_2_1.png)

### 🔒 ユーザーのウォレットにアクセス可能か確認する

次に、ユーザーのウォレットに実際にアクセスする権限があるかどうかを確認する必要があります。 これにアクセスできれば、私たちはスマートコントラクトを呼び出すことができます。

MetaMaskは、私たちが許可するウェブサイトにのみ権限を与えます。ログインするのと同じです。 ここで行っているのは、**「ログイン」しているかどうかを確認**することです。

以下のコードを確認してください。`checkIfWalletIsConnected`関数を更新し、`useState`を使用して`currentAccount`という変数を追加し状態管理しています。

変更したものについてコメントを付します。

```javascript
// useStateを追加でインポートしています。
import React, { useEffect, useState } from 'react';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';

const TWITTER_HANDLE = 'UNCHAIN_tech';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  //ユーザーのウォレットアドレスをstate管理しています。冒頭のuseStateのインポートを忘れないでください。
  const [currentAccount, setCurrentAccount] = useState('');

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have metamask!');
      return;
    } else {
      console.log('We have the ethereum object', ethereum);
    }

    // ユーザーのウォレットをリクエストします。
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    // ユーザーが複数のアカウントを持っている場合もあります。ここでは最初のアドレスを使います。
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account:', account);
      setCurrentAccount(account);
    } else {
      console.log('No authorized account found');
    }
  };

  // コネクトしていないときのレンダリング関数です。
  const renderNotConnectedContainer = () => (
    <div className="connect-wallet-container">
      <img
        src="https://media.giphy.com/media/3ohhwytHcusSCXXOUg/giphy.gif"
        alt="Ninja gif"
      />
      <button className="cta-button connect-wallet-button">
        Connect Wallet
      </button>
    </div>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <header>
            <div className="left">
              <p className="title">🐱‍👤 Ninja Name Service</p>
              <p className="subtitle">Your immortal API on the blockchain!</p>
            </div>
          </header>
        </div>

        {renderNotConnectedContainer()}

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
```

`Connect Wallet`ボタンはまだ機能せず、コンソールに`No authorized account found`と表示されます。 これは、MetaMaskに明示的に通知していないためです。_「MetaMask さん、このウェブサイトにウォレットへのアクセスを許可してください」と伝える必要があります。_

では、ユーザーからウォレットにアクセスするための許可を取得する作業をしましょう。

### 🛍 ユーザーウォレットへの接続

web3の世界では、ウォレットの接続はいわばユーザーの「ログイン」ボタンです。MetaMaskにリクエストを送信して、ユーザーのウォレットへの読み取り専用アクセスを許可します。

```javascript
import React, { useEffect, useState } from 'react';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';

// 定数
const TWITTER_HANDLE = 'UNCHAIN_tech';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState('');

  // connectWallet 関数を定義
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask -> https://metamask.io/');
        return;
      }

      // アカウントへのアクセスを要求するメソッドを使用します。
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      // Metamask を一度認証すれば Connected とコンソールに表示されます。
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have metamask!');
      return;
    } else {
      console.log('We have the ethereum object', ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account:', account);
      setCurrentAccount(account);
    } else {
      console.log('No authorized account found');
    }
  };

  // レンダリング関数です。まだ Connect されていない場合。
  const renderNotConnectedContainer = () => (
    <div className="connect-wallet-container">
      <img
        src="https://media.giphy.com/media/3ohhwytHcusSCXXOUg/giphy.gif"
        alt="Ninja donut gif"
      />
      {/* Connect Wallet ボタンが押されたときのみ connectWallet関数 を呼び出します。 */}
      <button
        onClick={connectWallet}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    </div>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <header>
            <div className="left">
              <p className="title">🐱‍👤 Ninja Name Service</p>
              <p className="subtitle">Your immortal API on the blockchain!</p>
            </div>
          </header>
        </div>

        {/* currentAccount が存在しない場合、Connect Wallet ボタンを表示します*/}
        {!currentAccount && renderNotConnectedContainer()}

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
```

`Connect Wallet`ボタンを更新して、先ほど作成した`connectWallet`関数を実際に呼び出すことを忘れないでください。

これまでにアプリで行ったことを要約すると、次のようになります。

1. ユーザーがMetaMask拡張機能をインストールしているかどうかを確認しました
2. `Connect Wallet`接続ボタンがクリックされたときにアカウントアドレスと残高を読み取るためのアクセス許可を要求します。

さあ、ボタンを試してみてください! MetaMaskは "Connect With MetaMask" を求めるプロンプトを表示します。ウォレットを接続すると、接続ボタンが消え、コンソールに`Connected [YOUR_ADDRESS]`が出力されます。

徐々にアプリができてきましたね。

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

おめでとうございます!ウォレットコネクトボタンが完成しました!! 次のレッスンでは、ドメインをMintする機能を実装していきます✨

### 🛍 ウォレットに接続するボタンをレンダリングする

WebアプリケーションからPhantom Walletへの接続を促すために、`connectWallet`ボタンを作成します。

web3の世界では、ウォレット接続ボタンは「ログイン」ボタンの役割を果たします。

`App.js`ファイルを以下のとおり変更しましょう。

```jsx
import React, { useEffect } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// 定数を宣言します。
const TWITTER_HANDLE = 'あなたのTwitterハンドル';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

 /*
  * Phantom Walletが接続されているかどうかを確認するための関数です。
  */
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  /*
   * 「Connect to Wallet」ボタンを押したときに動作する関数です。（移行のSectionで変更するので、現状は内部処理がないまま進みます。）
   */
  const connectWallet = async () => {};

  /*
   * ユーザーがWebアプリケーションをウォレットに接続していないときに表示するUIです。
   */
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  /*
   * 初回のレンダリング時にのみ、Phantom Walletが接続されているかどうか確認します。
   */
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection ✨
          </p>
          {/* ここでウォレットへの接続ボタンをレンダリングします。 */}
          {renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
```

Webアプリケーションに「Connect to Wallet」ボタンが表示されているかどうか、インタフェースを確認してみましょう。

**ユーザーがウォレットを Web アプリケーションに接続していない場合のみ、`Connect to Wallet`ボタンが表示されます。**

![interface](/public/images/Solana-dApp/section-1/1_2_1.jpg)

次に、Reactの`useState`を用いてユーザーのウォレットアドレスの`state`を管理し、`Connect to Wallet`ボタンを表示するかどうかを判断するためのフラグとして利用していきましょう。

まずは、`App.js`の1行目で`useState`をインポートします。

```jsx
import React, { useEffect, useState } from "react";
```

次に、`checkIfWalletIsConnected`関数のすぐ下に`state`の宣言を追加します。

```jsx
const [walletAddress, setWalletAddress] = useState(null);
```

これで、ユーザーのウォレットアドレスの`state`を管理するための準備が整いました。

続いて、`App.js`を以下のとおり修正していきましょう。

```jsx
import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// 定数を宣言します。
const TWITTER_HANDLE = 'あなたのTwitterハンドル';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // ユーザーのウォレットアドレスのstateを管理するためuseStateを使用する。
  const [walletAddress, setWalletAddress] = useState(null);

 /*
  * Phantom Walletが接続されているかどうかを確認するための関数です。
  */
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );

          /*
           * walletAddressにユーザーのウォレットアドレスのstateを更新します。
           */
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {};

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  /*
   * 初回のレンダリング時にのみ、Phantom Walletが接続されているかどうか確認します。
   */
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <div className="App">
			<div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection ✨
          </p>
          {/* ウォレットアドレスを持っていない場合にのみ表示する条件をここに追加します。 */}
          {!walletAddress && renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
```

簡単に修正点を確認しましょう。

```javascript
const checkIfWalletIsConnected = async () => {
  try {
    const { solana } = window;

    if (solana) {
      if (solana.isPhantom) {
        console.log('Phantom wallet found!');
        const response = await solana.connect({ onlyIfTrusted: true });
        console.log(
          'Connected with Public Key:',
          response.publicKey.toString()
        );

        setWalletAddress(response.publicKey.toString());
      }
    } else {
      alert('Solana object not found! Get a Phantom Wallet 👻');
    }
  } catch (error) {
    console.error(error);
  }
};
```

Phantom WalletがWebアプリケーションに接続されていた場合、ユーザーのウォレットアドレスの`state`が更新されます。

更新された`state`は以下で利用します。

```jsx
{!walletAddress && renderNotConnectedContainer()}
```

ここでは`state`に`walletAddress`が設定されていない場合のみ、`renderNotConnectedContainer`関数を呼び出すように記述しています。

したがって、ウォレットアドレスがない（ユーザーがウォレットを接続していない）場合は、ウォレットを接続するためのボタンを表示します（条件付きレンダリングと呼ばれる手法です）。


### 🔥 ウォレット接続する

今のままだと`Connect to Wallet`ボタンをクリックしても何も起こりません。

そのため、これから`Connect to Wallet`ボタンを押下した際に機能する`connectWallet`関数のロジックをコーディングしていきます。

`App.js`の`connectWallet`関数を下記のとおり修正しましょう。

```javascript
const connectWallet = async () => {
  const { solana } = window;

  if (solana) {
    const response = await solana.connect();
    console.log("Connected with Public Key:", response.publicKey.toString());
    setWalletAddress(response.publicKey.toString());
  }
};
```

ユーザーがWebアプリケーションにPhantom Walletを接続したい場合、`solana`オブジェクトの`connect`メソッドを呼び出して、Phantom Wallet側でWebアプリケーションの接続を承認します。

そうすると、Webアプリケーションがユーザーのウォレット情報（ウォレットアドレスなど）にアクセスできるようになります。

ここまでできたらプラウザで動作を確認してみましょう。

まず、Webアプリケーションとウォレットを接続します。

`Connect to Wallet`ボタンを押すとPhantom Walletがポップアップを表示してくれるので、指示に従って接続しましょう。

接続後、`Connect to Wallet`ボタンが表示されていないことを確認します。

`Connect to Wallet`ボタンが表示されていないことを確認できたらWebアプリケーションを更新してみてください。

更新すると`checkIfWalletIsConnected`関数が呼び出されるため、`Connect to Wallet`ボタンがすぐに消えるはずです（コンソールには接続済みのウォレットアドレスも出力されています）。

これで基本的なUIとユーザー認証が実装できました。

> ⚠️ 注意
>
> Fantom Wallet の設定画面（歯車をクリック）に、[信頼済みアプリ]があります。
>
> これを開くと、ウォレットと既に接続されている WEB アプリが一覧で表示され、[取り消し]ボタンを押下することで簡単に連携の解除をすることができます。
>
> ローカルで実行している場合は`localhost：3000`のものが現在作成している Web アプリケーションです。
>
> 連携を解除したうえで Web アプリケーションを更新すると、`Connect to Wallet`ボタンが表示されるのでぜひ一度試してみてください。


### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#solana`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンでは、WebアプリケーションにGIF画像を表示します!
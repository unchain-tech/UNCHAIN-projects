### 🛍 ウォレットに接続するボタンをレンダリングする

WEBアプリから Phantom Wallet にアプリへの接続を促すため、`connectWallet` ボタンを作成する必要があります。

web3 の世界では、ウォレット接続ボタンは「サインアップ/ログイン」ボタンの役割を果たします。

`App.js` ファイルを下記の通り変更してください。


```jsx
import React, { useEffect } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';

// 定数の宣言
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
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
   * コードが壊れないように、下記関数を定義しましょう。
   * 下記はその関数の実装です。
   */
  const connectWallet = async () => {};

  /*
   * ユーザーがまだウォレットをアプリに接続していないときに
   * このUIを表示します。
   */
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

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
          <p className="header">🍭 Candy Drop</p>
          <p className="sub-text">NFT drop machine with fair mint</p>
          {/* Render your connect to wallet button right here */}
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

これで、WEBアプリに「ウォレットに接続」というグラデーションボタンが表示されます。

![無題](/public/images/5-Solana-NFT-drop/section1/1_2_1.png)

**ユーザーがウォレットをWEBアプリに接続していない場合にのみ、`Connect to Wallet` ボタンが表示されます。**

そこで、このウォレットのデータを React の state に格納してみてましょう。そうすればボタンを表示するかどうかを判断するフラグとしても使えます。

`App.js` を修正します。

まずは下記のように `useState` をコンポーネントにインポートする必要があります。

```jsx
import React, { useEffect, useState } from 'react';
```

次に、  `checkIfWalletIsConnected` 関数のすぐ上に進み、下記の `state` の宣言を追加します。

```jsx
// State
const [walletAddress, setWalletAddress] = useState(null);
```

`state` を保持する準備ができたので、ここでいくつかコードを更新しましょう。

`App.js` を下記の通り修正してください。

```jsx
import React, { useEffect, useState } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = 'ta_ka_sea0';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);

  // Actions
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
           * ユーザーの公開鍵を後から使える状態にします。
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
          <p className="header">🍭 Candy Drop</p>
          <p className="sub-text">NFT drop machine with fair mint</p>
          {/* ウォレットアドレスを持っていない場合にのみ表示する条件を追加する */}
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

```jsx
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
         * ユーザーの公開鍵を後から使える状態にします。
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
```

ファントムウォレットを接続するとユーザーのウォレットからデータを受信しました。

これで、後で使用できるように状態に保存してみましょう。

```jsx
{/* ウォレットアドレスを持っていない場合にのみ表示する条件を追加する */}
{!walletAddress && renderNotConnectedContainer()}
```

ここでは` state` に `walletAddress` が設定されていない場合にのみ、この `render` 関数を呼び出すように指示しています。

したがって、ユーザーがウォレットを接続していないことを意味するウォレットアドレスがない場合は、ウォレットを接続するためのボタンを表示します。

### 😅 実際にウォレット接続する

このままだとボタンをクリックしても何も起こりません。

 `connectWallet` 関数のロジックをコーディングします。
`App.js` の `connectWallet` 関数を下記の通り修正しましょう。

```jsx
const connectWallet = async () => {
  const { solana } = window;

  if (solana) {
    const response = await solana.connect();
    console.log('Connected with Public Key:', response.publicKey.toString());
    setWalletAddress(response.publicKey.toString());
  }
};
```

ユーザーがウォレットを接続したい場合、`solana` オブジェクトで `connect` 関数を呼び出して、ユーザーのウォレットでWEBアプリを承認を実施します。

そうすると、ユーザーのウォレット情報(ウォレットアドレスなど)にアクセスできるようになります。

 `walletAddress` 関数を実装できたら、WEBアプリからウォレットを接続し、その後 `Connect to Wallet` ボタンが表示されないか確認します。

ここからはブラウザで動作を確認します。WEBアプリを開き、`Connect to Wallet` ボタンをクリックしましょう。

まずはWEBアプリ上のページを更新し、`Connect to Wallet` ボタンをクリックするとポップアップが表示されるので、指示に従って接続してください。

ボタンが消えることが確認できたら、WEBアプリを更新してみてください。

`checkIfWalletIsConnected` 関数が呼び出され、ボタンがすぐに消えます。コンソールには公開鍵も出力されています。

基本的なUIとユーザー認証が実装できました。

次のセクションでは、Solana プログラムを呼び出すために必要な関数を使用してすべてのセットアップを取得し、データを取得します。このままではWEBアプリが寂しいので機能を実装してみましょう。

⚠️: 注意
> Fantom Wallet の設定画面(歯車をクリック)に、[信頼済みアプリ]があります。これを開くと、ウォレット接続しているWEBアプリが表示されます。
>
> ローカルで実行している場合は、 `localhost：3000` が表示されます。これを取り消すことで簡単に連携解除可能です。
>
> 実際に連携解除しアプリを更新すると、`Connect to Wallet` ボタンが表示されます。


### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#section-1` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください✨
```
1. 何をしようとしていたか
2. エラー文をコピー&ペースト
3. エラー画面のスクリーンショット
```

---
ぜひ、あなたのフロントエンドのスクリーンショットを `#section-1`  に投稿してください😊

あなたの成功をコミュニティで祝いましょう🎉

次のレッスンでは、Solana の開発環境を構築します！

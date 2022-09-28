### 🌅 `window.ethereum` を設定する

Web アプリケーション上で、ユーザーがイーサリアムネットワークと通信するためには、Web アプリケーションはユーザーのウォレット情報を取得する必要があります。

これから、あなたの Web アプリケーションにウォレットを接続したユーザーに、スマートコントラクトを呼び出す権限を付与する機能を実装していきます。

- これは、Web サイトへの認証機能です。

ターミナル上で、`nft-collection-starter-project/src`に移動し、その中にある `App.js` を VS Code で開きましょう。

下記のように、`App.js`の中身を更新します。

- `App.js` はあなたの Web アプリケーションのフロントエンド機能を果たします。

```javascript
// App.js
import React, { useEffect } from "react";
import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
// Constantsを宣言する: constとは値書き換えを禁止した変数を宣言する方法です。
const TWITTER_HANDLE = "あなたのTwitterのハンドルネームを貼り付けてください";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = "";
const TOTAL_MINT_COUNT = 50;
const App = () => {
  const checkIfWalletIsConnected = () => {
    /*
     * ユーザーがMetaMaskを持っているか確認します。
     */
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
  };
  // renderNotConnectedContainer メソッドを定義します。
  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );
  /*
   * ページがロードされたときに useEffect()内の関数が呼び出されます。
   */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">あなただけの特別な NFT を Mint しよう💫</p>
          {/* メソッドを追加します */}
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

新しく追加したコードを見ていきましょう。

```javascript
// App.js
// ユーザーがMetaMaskを持っているか確認します。
const { ethereum } = window;
```

`window.ethereum` は MetaMask が提供する API です。

詳しく知りたい方は [こちら](https://zenn.dev/cauchye/articles/20211020_matsuoka_ethereum-metamask-ethers-angular#metamask%E3%81%B8%E3%81%AE%E6%8E%A5%E7%B6%9A%E3%82%92%E3%83%AA%E3%82%AF%E3%82%A8%E3%82%B9%E3%83%88%E3%81%99%E3%82%8B) を参照してみてください。

公式のドキュメント [こちら](https://docs.metamask.io/guide/getting-started.html#getting-started) です。

### 🦊 ユーザーアカウントにアクセスできるか確認する

`window.ethereum` は、あなたの Web サイトを訪問したユーザーが MetaMask を持っているか確認し、結果を `Console log` に出力します。

ターミナルで `nft-collection-starter-project` に移動し、下記を実行してみましょう。

```bash
npm run start
```

ローカルサーバで Web サイトを立ち上げたら、サイトの上で右クリックを行い、`Inspect`を選択します。

![](/public/images/ETH-NFT-Collection/section-3/3_2_1.png)

次に、`Console`を選択し、出力結果を確認してみましょう。

![](/public/images/ETH-NFT-Collection/section-3/3_2_2.png)

Console に `We have the ethereum object` と表示されているでしょうか？

- これは、`window.ethereum` が、この Web サイトを訪問したユーザー（ここでいうあなた）が MetaMask を持っていることを確認したことを示しています。

次に、Web サイトがユーザーのウォレットにアクセスする権限があるか確認します。

- アクセスできたら、スマートコントラクトを呼び出すことができます。

これから、ユーザー自身が承認した Web サイトにウォレットのアクセス権限を与えるコードを書いていきます。

- これは、ユーザーのログイン機能です。

以下の通り、`App.js` を修正してください。

```javascript
// App.js
// useEffect と useState 関数を React.js からインポートしています。
import React, { useEffect, useState } from "react";
import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
// Constantsを宣言する: constとは値書き換えを禁止した変数を宣言する方法です。
const TWITTER_HANDLE = "あなたのTwitterのハンドルネームを貼り付けてください";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = "";
const TOTAL_MINT_COUNT = 50;
const App = () => {
  /*
   * ユーザーのウォレットアドレスを格納するために使用する状態変数を定義します。
   */
  const [currentAccount, setCurrentAccount] = useState("");
  /*この段階でcurrentAccountの中身は空*/
  console.log("currentAccount: ", currentAccount);
  /*
   * ユーザーが認証可能なウォレットアドレスを持っているか確認します。
   */
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
    /*
		// ユーザーが認証可能なウォレットアドレスを持っている場合は、
    // ユーザーに対してウォレットへのアクセス許可を求める。
    // 許可されれば、ユーザーの最初のウォレットアドレスを
    // accounts に格納する。
    */
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };
  // renderNotConnectedContainer メソッドを定義します。
  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );
  /*
   * ページがロードされたときに useEffect()内の関数が呼び出されます。
   */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">あなただけの特別な NFT を Mint しよう💫</p>
          {/* メソッドを追加します */}
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

新しく追加したコードを見ていきましょう。

```javascript
// App.js
// ユーザーのウォレットアドレスを格納するために使用する状態変数を定義します。
const [currentAccount, setCurrentAccount] = useState("");
/*この段階でcurrentAccountの中身は空*/
console.log("currentAccount: ", currentAccount);
```

アクセス可能なアカウントを検出した後、`currentAccount` にユーザーのウォレットアカウント（`0x...`）の値が入ります。

以下で `currentAccount` を更新しています。

```javascript
// App.js
// accountsにWEBサイトを訪れたユーザーのウォレットアカウントを格納する（複数持っている場合も加味、よって account's' と変数を定義している）
const accounts = await ethereum.request({ method: "eth_accounts" });
// もしアカウントが一つでも存在したら、以下を実行。
if (accounts.length !== 0) {
  // accountという変数にユーザーの1つ目（=Javascriptでいう0番目）のアドレスを格納
  const account = accounts[0];
  console.log("Found an authorized account:", account);
  // currentAccountにユーザーのアカウントアドレスを格納
  setCurrentAccount(account);
} else {
  console.log("No authorized account found");
}
```

この処理のおかげで、ユーザーがウォレットに複数のアカウントを持っている場合でも、プログラムはユーザーの 1 番目のアカウントアドレスを取得できます。

### 👛 ウォレット接続ボタンを作成する

次に、`connectWallet` ボタンを作成していきます。

下記の通り `App.js` を更新していきましょう。

```javascript
// App.js
// useEffect と useState 関数を React.js からインポートしています。
import React, { useEffect, useState } from "react";
import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
// Constantsを宣言する: constとは値書き換えを禁止した変数を宣言する方法です。
const TWITTER_HANDLE = "あなたのTwitterのハンドルネームを貼り付けてください";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = "";
const TOTAL_MINT_COUNT = 50;
const App = () => {
  /*
   * ユーザーのウォレットアドレスを格納するために使用する状態変数を定義します。
   */
  const [currentAccount, setCurrentAccount] = useState("");
  /*この段階でcurrentAccountの中身は空*/
  console.log("currentAccount: ", currentAccount);
  /*
   * ユーザーが認証可能なウォレットアドレスを持っているか確認します。
   */
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
    /* ユーザーが認証可能なウォレットアドレスを持っている場合は、
     * ユーザーに対してウォレットへのアクセス許可を求める。
     * 許可されれば、ユーザーの最初のウォレットアドレスを
     * accounts に格納する。
     */
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  /*
   * connectWallet メソッドを実装します。
   */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      /*
       * ウォレットアドレスに対してアクセスをリクエストしています。
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      /*
       * ウォレットアドレスを currentAccount に紐付けます。
       */
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  // renderNotConnectedContainer メソッドを定義します。
  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Connect to Wallet
    </button>
  );
  /*
   * ページがロードされたときに useEffect()内の関数が呼び出されます。
   */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">あなただけの特別な NFT を Mint しよう💫</p>
          {/*条件付きレンダリングを追加しました
          // すでに接続されている場合は、
          // Connect to Walletを表示しないようにします。*/}
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <button onClick={null} className="cta-button connect-wallet-button">
              Mint NFT
            </button>
          )}
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

ここで実装した機能は以下の 3 つです。

**1 \. `connectWallet` メソッドを実装**

```javascript
// App.js
const connectWallet = async () => {
  try {
    // ユーザーが認証可能なウォレットアドレスを持っているか確認
    const { ethereum } = window;
    if (!ethereum) {
      alert("Get MetaMask!");
      return;
    }
    // 持っている場合は、ユーザーに対してウォレットへのアクセス許可を求める。許可されれば、ユーザーの最初のウォレットアドレスを currentAccount に格納する。
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    console.log("Connected: ", accounts[0]);
    setCurrentAccount(accounts[0]);
  } catch (error) {
    console.log(error);
  }
};
```

`eth_requestAccounts` メソッドを使用することで、MetaMask からユーザーにウォレットへのアクセスを許可するよう呼びかけることができます。

**2 \. `renderNotConnectedContainer` メソッドを実装**

```javascript
// App.js
const renderNotConnectedContainer = () => (
  <button onClick={connectWallet} className="cta-button connect-wallet-button">
    Connect to Wallet
  </button>
);
```

`renderNotConnectedContainer` メソッドによって、ユーザーのウォレットアドレスが、Web アプリケーションと紐づいていない場合は、「`Connect to Wallet`」のボタンがフロントエンドに表示されます。

**3 \. `renderNotConnectedContainer` メソッドを使った条件付きレンダリング**

```javascript
// App.js
{
  /*条件付きレンダリングを追加しました。*/
}
{
  currentAccount === "" ? (
    renderNotConnectedContainer()
  ) : (
    <button onClick={null} className="cta-button connect-wallet-button">
      Mint NFT
    </button>
  );
}
```

ここでは、条件付きレンダリングを実装しています。

`currentAccount === ""` は、`currentAccount` にユーザーのウォレットアドレスが紐づいているかどうか判定しています。

条件付きレンダリングは、下記のように実行されます。

```javascript
{ currentAccount === "" ? ( currentAccount にアドレスが紐づいてなければ、A を実行 ) : ( currentAccount にアドレスが紐づいれば B を実行 )}
```

`App.js` の場合、`A` 並ばは、`renderNotConnectedContainer()` を実行し、`B` ならば、`Mint NFT` ボタンをフロントエンドに反映させています。

条件付きレンダリングについて詳しくは [こちら](https://ja.reactjs.org/docs/conditional-rendering.html) を参照してください。

### 🌐 ウォレットコネクトのテストを実行する

上記のコードをすべて `App.js` に反映させたら、ターミナル上で `nft-collection-starter-project` ディレクトリに移動し、下記を実行しましょう。

```bash
npm run start
```

ローカルサーバで Web サイトを立ち上げたら、MetaMask のプラグインをクリックし、あなたのウォレットアドレスの接続状況を確認しましょう。
もし、下図のように `Connected` と表示されている場合は、`Connected` の文字をクリックします。

![](/public/images/ETH-NFT-Collection/section-3/3_2_3.png)

そこで、Web サイトとあなたのウォレットアドレスの接続を一度解除します。

- `Disconnect this account` を選択してください。

![](/public/images/ETH-NFT-Collection/section-3/3_2_4.png)

次にローカルサーバにホストされているあなたの Web サイトをリフレッシュしてボタンの表示を確認してください。

- ウォレット接続用のボタンが、`Connect Wallet` と表示されていれば成功です。

次に、右クリック → `Inspect` を選択し、Console を立ち上げましょう。下図のように、`No authorized account found` と出力されていれば成功です。

![](/public/images/ETH-NFT-Collection/section-3/3_2_5.png)

では、`Connect Wallet` ボタンを押してみましょう。

下図のように MetaMask からウォレット接続を求められますので、承認してください。

![](/public/images/ETH-NFT-Collection/section-3/3_2_6.png)

MetaMask の承認が終わると、ウォレット接続ボタンの表示が `Mint NFT` に変更されているはずです。

下記のように、Console にも、接続されたウォレットアドレスが、`currentAccount` として出力されていることを確認してください。

```
Connected 0x3a0a49fb3cf930e599f0fa7abe554dc18bd1f135
currentAccount:  0x3a0a49fb3cf930e599f0fa7abe554dc18bd1f135
```

ターミナルを閉じるときは、以下のコマンドが使えます ✍️

- Mac: `ctrl + c`
- Windows: `ctrl + shift + w`

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の`#eth-nft-collection`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 3 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

ウォレット接続機能が完成したら、次のレッスンに進みましょう 🎉

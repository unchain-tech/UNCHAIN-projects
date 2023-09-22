### 🌅 `window.ethereum`を設定する

Webアプリケーション上で、ユーザーがイーサリアムネットワークと通信するためには、Webアプリケーションはユーザーのウォレット情報を取得する必要があります。

これから、あなたのWebアプリケーションにウォレットを接続したユーザーに、スマートコントラクトを呼び出す権限を付与する機能を実装していきます。

- これは、Webサイトへの認証機能です。

それでは、`ETH-NFT-Collection/packages/client`ディレクトリ下のファイルを編集していきましょう。

下記のように、`App.js`の中身を更新します。

- `App.js`はあなたのWebアプリケーションのフロントエンド機能を果たします。

```javascript
// App.js
import React, { useEffect } from "react";
import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
// Constantsを宣言する: constとは値書き換えを禁止した変数を宣言する方法です。
const TWITTER_HANDLE = "あなたのTwitterのハンドルネームを貼り付けてください";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

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

`window.ethereum`はMetaMaskが提供するAPIです。

詳しく知りたい方は [こちら](https://zenn.dev/cauchye/articles/20211020_matsuoka_ethereum-metamask-ethers-angular#metamask%E3%81%B8%E3%81%AE%E6%8E%A5%E7%B6%9A%E3%82%92%E3%83%AA%E3%82%AF%E3%82%A8%E3%82%B9%E3%83%88%E3%81%99%E3%82%8B) を参照してみてください。

公式のドキュメント [こちら](https://docs.metamask.io/guide/getting-started.html#getting-started) です。

### 🦊 ユーザーアカウントにアクセスできるか確認する

`window.ethereum`は、あなたのWebサイトを訪問したユーザーがMetaMaskを持っているか確認し、結果を`Console log`に出力します。

プロジェクトのルートディレクトリ（ETH-NFT-Collection/）にいることを確認し、下記を実行してみましょう。

```
yarn client start
```

ローカルサーバーでWebサイトを立ち上げたら、サイトの上で右クリックを行い、`Inspect`を選択します。

![](/public/images/ETH-NFT-Collection/section-3/3_2_1.png)

次に、`Console`を選択し、出力結果を確認してみましょう。

![](/public/images/ETH-NFT-Collection/section-3/3_2_2.png)

Consoleに`We have the ethereum object`と表示されているでしょうか？

- これは、`window.ethereum`が、このWebサイトを訪問したユーザー（ここでいうあなた）がMetaMaskを持っていることを確認したことを示しています。

次に、Webサイトがユーザーのウォレットにアクセスする権限があるか確認します。

- アクセスできたら、スマートコントラクトを呼び出すことができます。

これから、ユーザー自身が承認したWebサイトにウォレットのアクセス権限を与えるコードを書いていきます。

- これは、ユーザーのログイン機能です。

以下の通り、`App.js`を修正してください。

```javascript
// App.js
// useEffect と useState 関数を React.js からインポートしています。
import React, { useEffect, useState } from "react";
import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
// Constantsを宣言する: constとは値書き換えを禁止した変数を宣言する方法です。
const TWITTER_HANDLE = "あなたのTwitterのハンドルネームを貼り付けてください";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

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

アクセス可能なアカウントを検出した後、`currentAccount`にユーザーのウォレットアカウント(`0x...`)の値が入ります。

以下で`currentAccount`を更新しています。

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

この処理のおかげで、ユーザーがウォレットに複数のアカウントを持っている場合でも、プログラムはユーザーの1番目のアカウントアドレスを取得できます。

### 👛 ウォレット接続ボタンを作成する

次に、`connectWallet`ボタンを作成していきます。

下記の通り`App.js`を更新していきましょう。

```javascript
// App.js
// useEffect と useState 関数を React.js からインポートしています。
import React, { useEffect, useState } from "react";
import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
// Constantsを宣言する: constとは値書き換えを禁止した変数を宣言する方法です。
const TWITTER_HANDLE = "あなたのTwitterのハンドルネームを貼り付けてください";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

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

ここで実装した機能は以下の3つです。

**1 \. `connectWallet`メソッドを実装**

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

`eth_requestAccounts`メソッドを使用することで、MetaMaskからユーザーにウォレットへのアクセスを許可するよう呼びかけることができます。

**2 \. `renderNotConnectedContainer`メソッドを実装**

```javascript
// App.js
const renderNotConnectedContainer = () => (
  <button onClick={connectWallet} className="cta-button connect-wallet-button">
    Connect to Wallet
  </button>
);
```

`renderNotConnectedContainer`メソッドによって、ユーザーのウォレットアドレスが、Webアプリケーションと紐づいていない場合は、「`Connect to Wallet`」のボタンがフロントエンドに表示されます。

**3 \. `renderNotConnectedContainer`メソッドを使った条件付きレンダリング**

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

`currentAccount === ""`は、`currentAccount`にユーザーのウォレットアドレスが紐づいているかどうか判定しています。

条件付きレンダリングは、下記のように実行されます。

```javascript
{ currentAccount === "" ? ( currentAccount にアドレスが紐づいてなければ、A を実行 ) : ( currentAccount にアドレスが紐づいれば B を実行 )}
```

`App.js`の場合、`A`並ばは、`renderNotConnectedContainer()`を実行し、`B`ならば、`Mint NFT`ボタンをフロントエンドに反映させています。

条件付きレンダリングについて詳しくは [こちら](https://ja.reactjs.org/docs/conditional-rendering.html) を参照してください。

### 🌐 ウォレットコネクトのテストを実行する

上記のコードをすべて`App.js`に反映させたら、ターミナル上で下記を実行しましょう。

```
yarn client start
```

ローカルサーバーでWebサイトを立ち上げたら、MetaMaskのプラグインをクリックし、あなたのウォレットアドレスの接続状況を確認しましょう。
もし、下図のように`Connected`と表示されている場合は、`Connected`の文字をクリックします。

![](/public/images/ETH-NFT-Collection/section-3/3_2_3.png)

そこで、Webサイトとあなたのウォレットアドレスの接続を一度解除します。

- `Disconnect this account`を選択してください。

![](/public/images/ETH-NFT-Collection/section-3/3_2_4.png)

次にローカルサーバーにホストされているあなたのWebサイトをリフレッシュしてボタンの表示を確認してください。

- ウォレット接続用のボタンが、`Connect Wallet`と表示されていれば成功です。

次に、右クリック → `Inspect`を選択し、Consoleを立ち上げましょう。下図のように、`No authorized account found`と出力されていれば成功です。

![](/public/images/ETH-NFT-Collection/section-3/3_2_5.png)

では、`Connect Wallet`ボタンを押してみましょう。

下図のようにMetaMaskからウォレット接続を求められますので、承認してください。

![](/public/images/ETH-NFT-Collection/section-3/3_2_6.png)

MetaMaskの承認が終わると、ウォレット接続ボタンの表示が`Mint NFT`に変更されているはずです。

下記のように、Consoleにも、接続されたウォレットアドレスが、`currentAccount`として出力されていることを確認してください。

```
Connected 0x3a0a49fb3cf930e599f0fa7abe554dc18bd1f135
currentAccount:  0x3a0a49fb3cf930e599f0fa7abe554dc18bd1f135
```

ターミナルを閉じるときは、以下のコマンドが使えます ✍️

- Mac: `ctrl + c`
- Windows: `ctrl + shift + w`

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#ethereum`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

ウォレット接続機能が完成したら、次のレッスンに進みましょう 🎉

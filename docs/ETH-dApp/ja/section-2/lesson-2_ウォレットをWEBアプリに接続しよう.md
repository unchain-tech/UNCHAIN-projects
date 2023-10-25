### 🌅 `window.ethereum`を設定する

Webアプリケーション上で、ユーザーがイーサリアムネットワークと通信するためには、Webアプリケーションはユーザーのウォレット情報を取得する必要があります。

これから、あなたのWebアプリケーションにウォレットを接続したユーザーに、スマートコントラクトを呼び出す権限を付与する機能を実装していきます。これは、Webサイトへの認証機能です。

ターミナル上で、`packages/client/src`に移動し、その中にある`App.js`をVS Codeで開きましょう。

下記のように、`App.js`の中身を更新します。

- `App.js`はあなたのWebアプリケーションのフロントエンド機能を果たします。

```javascript
import React, { useEffect } from 'react';

import './App.css';

const App = () => {
  const checkIfWalletIsConnected = () => {
    /*
     * window.ethereumにアクセスできることを確認します。
     */
    const { ethereum } = window;
    if (!ethereum) {
      console.log('Make sure you have MetaMask!');
    } else {
      console.log('We have the ethereum object', ethereum);
    }
  };

  /*
   * WEBページがロードされたときに下記の関数を実行します。
   */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          <span role="img" aria-label="hand-wave">
            👋
          </span>{" "}
          WELCOME!
        </div>
        <div className="bio">
          イーサリアムウォレットを接続して、「
          <span role="img" aria-label="hand-wave">
            👋
          </span>
          (wave)」を送ってください
          <span role="img" aria-label="shine">
            ✨
          </span>
        </div>
        <button className="waveButton" onClick={null}>
          Wave at Me
        </button>
      </div>
    </div>
  );
};

export default App;
```

### 🦊 ユーザーアカウントにアクセスできるか確認する

`window.ethereum`は、あなたのWebサイトを訪問したユーザーがMetaMaskを持っているか確認し、結果を`Console log`に出力します。

ターミナルで下記を実行してみましょう。

```
yarn client start
```

ローカルサーバーでWebサイトを立ち上げたら、サイトの上で右クリックを行い、`Inspect`を選択します。

![](/public/images/ETH-dApp/section-2/2_2_1.png)

次に、Consoleを選択し、出力結果を確認してみましょう。

![](/public/images/ETH-dApp/section-2/2_2_2.png)

Consoleに`We have the ethereum object`と表示されているでしょうか？

- これは、`window.ethereum`が、このWebサイトを訪問したユーザー（ここでいうあなた）がMetaMaskを持っていることを確認したことを示しています。

次に、Webサイトがユーザーのウォレットにアクセスする権限があるか確認します。

- アクセスできたら、スマートコントラクトを呼び出すことができます。

これから、ユーザー自身が承認したWebサイトにウォレットのアクセス権限を与えるコードを書いていきます。これは、ユーザーのログイン機能です。

下記のように、`App.js`の中身を更新します。

```javascript
import React, { useEffect, useState } from 'react';

import './App.css';

const App = () => {
  /* ユーザーのパブリックウォレットを保存するために使用する状態変数を定義します */
  const [currentAccount, setCurrentAccount] = useState('');
  console.log('currentAccount: ', currentAccount);

  /* window.ethereumにアクセスできることを確認します */
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
        return;
      } else {
        console.log('We have the ethereum object', ethereum);
      }
      /* ユーザーのウォレットへのアクセスが許可されているかどうかを確認します */
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log('Found an authorized account:', account);
        setCurrentAccount(account);
      } else {
        console.log('No authorized account found');
      }
    } catch (error) {
      console.log(error);
    }
  };

  /* WEBページがロードされたときに下記の関数を実行します */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          <span role="img" aria-label="hand-wave">
            👋
          </span>{" "}
          WELCOME!
        </div>
        <div className="bio">
          イーサリアムウォレットを接続して、「
          <span role="img" aria-label="hand-wave">
            👋
          </span>
          (wave)」を送ってください
          <span role="img" aria-label="shine">
            ✨
          </span>
        </div>
        <button className="waveButton" onClick={null}>
          Wave at Me
        </button>
      </div>
    </div>
  );
};

export default App;
```

新しく追加したコードを見ていきます。

```javascript
/* ユーザーのウォレットへのアクセスが許可されているかどうかを確認します */
const accounts = await ethereum.request({ method: 'eth_accounts' });
if (accounts.length !== 0) {
  const account = accounts[0];
  console.log('Found an authorized account:', account);
  setCurrentAccount(account);
} else {
  console.log('No authorized account found');
}
```

`eth_accounts`は、空の配列または単一のアカウントアドレスを含む配列を返す特別なメソッドです。

ユーザーのウォレットアカウントへのアクセスが許可されている場合は、 `Found an authorized account`とConsoleに出力されます。

ターミナルで再度下記を実行してみましょう。

```
yarn client start
```

ローカルサーバーでWebサイトを立ち上げたら、サイトの上で右クリックを行い、`Inspect`を選択します。

![](/public/images/ETH-dApp/section-2/2_2_3.png)

次に、Consoleを選択し、出力結果を確認してみましょう。

![](/public/images/ETH-dApp/section-2/2_2_4.png)

> ✍️: Console の結果を見てわかること
> `App.js`に記載されているコードは上から順を追って走っているので、最初に`currentAccount`の状態変数を定義したときには、中身が空であることがわかります。

> ```javascript
> // App.js
> const [currentAccount, setCurrentAccount] = useState('');
> /*この段階でcurrentAccountの中身は空*/
> console.log('currentAccount: ', currentAccount);
> ```
>
> アクセス可能なアカウントを検出した後、`currentAccount`にユーザーのウォレットアカウント（`0x...`）の値が入ります。

以下で`currentAccount`を更新しています。

> ```
> // accountsにWEBサイトを訪れたユーザーのウォレットアカウントを格納する（複数持っている場合も加味、よって account's' と変数を定義している）
> const accounts = await ethereum.request({ method: 'eth_accounts' });
> // もしアカウントが一つでも存在したら、以下を実行。
> if (accounts.length !== 0) {
>   // accountという変数にユーザーの1つ目（=Javascriptでいう0番目）のアドレスを格納
>   const account = accounts[0];
>   console.log('Found an authorized account:', account);
>   // currentAccountにユーザーのアカウントアドレスを格納
>   setCurrentAccount(account);
> } else {
>   // アカウントが存在しない場合は、エラーを出力。
>   console.log('No authorized account found');
> }
> ```
>
> この処理のおかげで、ユーザーがウォレットに複数のアカウントを持っている場合でも、プログラムはユーザーの 1 つ目のアカウントアドレスを取得することができます。
> ウォレット接続ボタンを実装するまで`No authorized account found`のエラーが出力されますが、心配しないでください 😊

ターミナルを閉じるときは、以下のコマンドが使えます ✍。

- Mac: `ctrl + c`
- Windows: `ctrl + shift + w`

### 👛 ウォレット接続ボタンを作成する

`connectWallet`ボタンを作成していきます。

```javascript
import React, { useEffect, useState } from 'react';

import './App.css';

const App = () => {
  // ユーザーのパブリックウォレットを保存するために使用する状態変数を定義します。
  const [currentAccount, setCurrentAccount] = useState('');
  console.log('currentAccount: ', currentAccount);

  // window.ethereumにアクセスできることを確認します。
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
        return;
      } else {
        console.log('We have the ethereum object', ethereum);
      }
      // ユーザーのウォレットへのアクセスが許可されているかどうかを確認します。
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log('Found an authorized account:', account);
        setCurrentAccount(account);
      } else {
        console.log('No authorized account found');
      }
    } catch (error) {
      console.log(error);
    }
  };

  // connectWalletメソッドを実装
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      console.log('Connected: ', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  // WEBページがロードされたときに下記の関数を実行します。
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          <span role="img" aria-label="hand-wave">
            👋
          </span>{" "}
          WELCOME!
        </div>
        <div className="bio">
          イーサリアムウォレットを接続して、「
          <span role="img" aria-label="hand-wave">
            👋
          </span>
          (wave)」を送ってください
          <span role="img" aria-label="shine">
            ✨
          </span>
        </div>
        <button className="waveButton" onClick={null}>
          Wave at Me
        </button>
        {/* ウォレットコネクトのボタンを実装 */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        {currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Wallet Connected
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
```

ここで実装した機能は以下の2つです。

**1 \. `connectWallet`メソッドを実装**

```javascript
const connectWallet = async () => {
  try {
    // ユーザーが認証可能なウォレットアドレスを持っているか確認
    const { ethereum } = window;
    if (!ethereum) {
      alert('Get MetaMask!');
      return;
    }
    // 持っている場合は、ユーザーに対してウォレットへのアクセス許可を求める。許可されれば、ユーザーの最初のウォレットアドレスを currentAccount に格納する。
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    console.log('Connected: ', accounts[0]);
    setCurrentAccount(accounts[0]);
  } catch (error) {
    console.log(error);
  }
};
```

`eth_requestAccounts`関数を使用することで、MetaMaskからユーザーにウォレットへのアクセスを許可するよう呼びかけることができます。

**2 \. ウォレットコネクトのボタンを実装**

```javascript
// currentAccountが存在しない場合は、「Connect Wallet」ボタンを実装
{
  !currentAccount && (
    <button className="waveButton" onClick={connectWallet}>
      Connect Wallet
    </button>
  );
}
/// currentAccountが存在する場合は、「Wallet Connected」ボタンを実装
{
  currentAccount && (
    <button className="waveButton" onClick={connectWallet}>
      Wallet Connected
    </button>
  );
}
```

### 🌐 ウォレットコネクトのテストを実行する

上記のコードをすべて`App.js`に反映させたら、ターミナルで下記を実行しましょう。

```
yarn client start
```

ローカルサーバーでWebサイトを立ち上げたら、MetaMaskのプラグインをクリックし、あなたのウォレットアドレスの接続状況を確認しましょう。

もし、下図のように`connected`となっている場合は、赤枠のアイコンをクリックします。

![](/public/images/ETH-dApp/section-2/2_2_5.png)

そこで、Webサイトとあなたのウォレットアドレスの接続を一度解除します。

- `Disconnect this account`を選択してください。

![](/public/images/ETH-dApp/section-2/2_2_6.png)

次にローカルサーバーにホストされているあなたのWebサイトをリフレッシュしてボタンの表示を確認してください。

- ウォレット接続用のボタンが、`Connect Wallet`と表示されていれば成功です。

![](/public/images/ETH-dApp/section-2/2_2_7.png)

次に、右クリック → `Inspect`を選択し、Consoleを立ち上げましょう。下図のように、`No authorized account found`と出力されていれば成功です。

![](/public/images/ETH-dApp/section-2/2_2_8.png)

では、`Connect Wallet`ボタンを押してみましょう。
下図のようにMetaMaskからウォレット接続を求められますので、承認してください。

![](/public/images/ETH-dApp/section-2/2_2_9.png)

MetaMaskの承認が終わると、ウォレット接続ボタンの表示が`Wallet Connected`に変更されているはずです。Consoleにも、接続されたウォレットアドレスが、`currentAccount`として出力されていることを確認してください。

![](/public/images/ETH-dApp/section-2/2_2_10.png)

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

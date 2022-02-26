🌅 `window.ethereum` を設定する
--------------------------

WEBアプリ上で、ユーザーがイーサリアムネットワークと通信するためには、WEBアプリはユーザーのウォレット情報を取得する必要があります。

これから、あなたのWEBアプリにウォレットを接続したユーザーに、スマートコントラクトを呼び出す権限を付与する機能を実装していきます。これは、WEBサイトへの認証機能です。

ターミナル上で、`dApp-starter-project/src` に移動し、その中にある `App.js` を VS Code で開きましょう。

下記のように、`App.js` の中身を更新します。
- `App.js` はあなたのWEBアプリのフロントエンド機能を果たします。

```javascript
// App.js
import React, { useEffect } from "react";
import "./App.css";
const App = () => {
  const checkIfWalletIsConnected = () => {
    /*
    * window.ethereumにアクセスできることを確認します。
    */
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have metamask!");
    } else {
      console.log("We have the ethereum object", ethereum);
    }
  }
  /*
  * WEBページがロードされたときに下記の関数を実行します。
  */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        <span role="img" aria-label="hand-wave">👋</span> WELCOME!
        </div>
        <div className="bio">
          イーサリアムウォレットを接続して、「<span role="img" aria-label="hand-wave">👋</span>(wave)」を送ってください<span role="img" aria-label="shine">✨</span>
        </div>
        <button className="waveButton" onClick={null}>
          Wave at Me
        </button>
      </div>
    </div>
  );
}
export default App
```
🦊 ユーザーアカウントにアクセスできるか確認する
-----------------------------------------

`window.ethereum` は、あなたのWEBサイトを訪問したユーザーが Metamask を持っているか確認し、結果を `Console log` に出力します。

ターミナルで `dApp-starter-project` に移動し、下記を実行してみましょう。

```bash
npm run start
```

ローカルサーバーでWEBサイトを立ち上げたら、サイトの上で右クリックを行い、`Inspect` を選択します。

![](/public/images/ETH-dApp/section-2/2_3_1.png)

次に、`Console`を選択し、出力結果を確認してみましょう。

![](/public/images/ETH-dApp/section-2/2_3_2.png)

`Console` に `We have the ethereum object` と表示されているでしょうか？

- これは、`window.ethereum` が、このWEBサイトを訪問したユーザー（ここでいうあなた）が Metamask を持っていることを確認したことを示しています。

次に、WEBサイトがユーザーのウォレットにアクセスする権限があるか確認します。

- アクセスできたら、スマートコントラクトを呼び出すことができます。

これから、ユーザー自身が承認したWEBサイトにウォレットのアクセス権限を与えるコードを書いていきます。これは、ユーザーのログイン機能です。

下記のように、`App.js` の中身を更新します。
```javascript
// App.js
import React, { useEffect, useState } from "react";
import "./App.css";
const App = () => {
  /* ユーザーのパブリックウォレットを保存するために使用する状態変数を定義します */
  const [currentAccount, setCurrentAccount] = useState("");
  console.log("currentAccount: ", currentAccount);
  /* window.ethereumにアクセスできることを確認します */
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      /* ユーザーのウォレットへのアクセスが許可されているかどうかを確認します */
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }
  /* WEBページがロードされたときに下記の関数を実行します */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        <span role="img" aria-label="hand-wave">👋</span> WELCOME!
        </div>
        <div className="bio">
          イーサリアムウォレットを接続して、「<span role="img" aria-label="hand-wave">👋</span>(wave)」を送ってください<span role="img" aria-label="shine">✨</span>
        </div>
        <button className="waveButton" onClick={null}>
          Wave at Me
        </button>
      </div>
    </div>
  );
  }
export default App
```

新しく追加したコードを見ていきます。

```javascript
// App.js
/* ユーザーのウォレットへのアクセスが許可されているかどうかを確認します */
const accounts = await ethereum.request({ method: "eth_accounts" });
if (accounts.length !== 0) {
	const account = accounts[0];
	console.log("Found an authorized account:", account);
	setCurrentAccount(account)
} else {
	console.log("No authorized account found")
}
```
`eth_accounts` は、空の配列または単一のアカウントアドレスを含む配列を返す当別なメソッドです。

ユーザーのウォレットアカウントへのアクセスが許可されている場合は、 `Found an authorized account` と `Console` に出力されます。

ターミナルで再度 `dApp-starter-project` に移動し、下記を実行してみましょう。

```bash
npm run start
```

ローカルサーバーでWEBサイトを立ち上げたら、サイトの上で右クリックを行い、`Inspect` を選択します。

![](/public/images/ETH-dApp/section-2/2_3_3.png)

次に、`Console` を選択し、出力結果を確認してみましょう。

![](/public/images/ETH-dApp/section-2/2_3_4.png)

✍️: `Console` の結果を見てわかること
> `App.js` に記載されているコードは上から順を追って走っているので、最初に `currentAccount` の状態変数を定義したときには、中身が空であることがわかります。

> ```javascript
> // App.js
> const [currentAccount, setCurrentAccount] = useState("");
> /*この段階でcurrentAccountの中身は空*/
> console.log("currentAccount: ", currentAccount);
> ```
> アクセス可能なアカウントを検出した後、`currentAccount` にユーザーのウォレットアカウント（`0x...`）の値が入ります。
>

以下で `currentAccount` を更新しています。
> ```javascript
> // App.js
> // accountsにWEBサイトを訪れたユーザーのウォレットアカウントを格納する（複数持っている場合も加味、よって account's' と変数を定義している）
> const accounts = await ethereum.request({ method: "eth_accounts" });
> // もしアカウントが一つでも存在したら、以下を実行。
> if (accounts.length !== 0) {
> 	// accountという変数にユーザーの1つ目（=Javascriptでいう0番目）のアドレスを格納
> 	const account = accounts[0];
>	console.log("Found an authorized account:", account);
> 	// currentAccountにユーザーのアカウントアドレスを格納
>	setCurrentAccount(account)
>} else {
>	console.log("No authorized account found")
>}
> ```
> この処理のおかげで、ユーザーがウォレットに複数のアカウントを持っている場合でも、プログラムはユーザーの1番目のアカウントアドレスを取得することができます。

👛 ウォレット接続ボタンを作成する
--------------------------------

`connectWallet` ボタンを作成していきます。

```javascript
// App.js
import React, { useEffect, useState } from "react";
import "./App.css";
const App = () => {
  // ユーザーのパブリックウォレットを保存するために使用する状態変数を定義します。
  const [currentAccount, setCurrentAccount] = useState("");
  console.log("currentAccount: ", currentAccount);
  // window.ethereumにアクセスできることを確認します。
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      // ユーザーのウォレットへのアクセスが許可されているかどうかを確認します。
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }
  // connectWalletメソッドを実装
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }
  // WEBページがロードされたときに下記の関数を実行します。
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        <span role="img" aria-label="hand-wave">👋</span> WELCOME!
        </div>
        <div className="bio">
          イーサリアムウォレットを接続して、「<span role="img" aria-label="hand-wave">👋</span>(wave)」を送ってください<span role="img" aria-label="shine">✨</span>
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
  }
export default App
```

ここで実装した機能は以下の二つです。

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
		console.log(error)
    }
  }
```
`eth_requestAccounts` 関数を使用することで、Metamask からユーザーにウォレットへのアクセスを許可するよう呼びかけることができます。

**2 \. ウォレットコネクトのボタンを実装**
```javascript
// App.js
// currentAccountが存在しない場合は、「Connect Wallet」ボタンを実装
{!currentAccount && (
<button className="waveButton" onClick={connectWallet}>
	Connect Wallet
</button>
)}
/// currentAccountが存在する場合は、「Wallet Connected」ボタンを実装
{currentAccount && (
<button className="waveButton" onClick={connectWallet}>
	Wallet Connected
</button>
)}
```

🌐 ウォレットコネクトのテストを実行する
--------------------------------

上記のコードを全て `App.js` に反映させたら、ターミナルで `dApp-starter-project` に移動し、下記を実行しましょう。

```bash
npm run start
```

ローカルサーバーでWEBサイトを立ち上げたら、Metamask のプラグインをクリックし、あなたのウォレットアドレスの接続状況を確認しましょう。

もし、下図のように `Connected` と表示されている場合は、`Connected` の文字をクリックします。

![](/public/images/ETH-dApp/section-2/2_3_5.png)

そこで、WEBサイトとあなたのウォレットアドレスの接続を一度解除します。

- `Disconnect this account` を選択してください。

![](/public/images/ETH-dApp/section-2/2_3_6.png)

次にローカルサーバーにホストされているあなたのWEBサイトをリフレッシュしてボタンの表示を確認してください。
- ウォレット接続用のボタンが、`Connect Wallet` と表示されていれば成功です。

![](/public/images/ETH-dApp/section-2/2_3_7.png)

次に、右クリック → `Inspect` を選択し、`Console` を立ち上げましょう。下図のように、`No authorized account found` と出力されていれば成功です。

![](/public/images/ETH-dApp/section-2/2_3_8.png)

では、`Connect Wallet` ボタンを押してみましょう。
下図のように Metamask からウォレット接続を求められますので、承認してください。

![](/public/images/ETH-dApp/section-2/2_3_9.png)

Metamask の承認が終わると、ウォレット接続ボタンの表示が `Wallet Connected` に変更されているはずです。 `Console` にも、接続されたウォレットアドレスが、`currentAccount` として出力されていることを確認してください。

![](/public/images/ETH-dApp/section-2/2_3_10.png)

🙋‍♂️ 質問する
-------------------------------------------
ここまでの作業で何かわからないことがある場合は、Discordの`#section-2-help`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください✨
```
1. 何をしようとしていたか
2. エラー文をコピー&ペースト
3. エラー画面のスクリーンショット
```
-------------------------------------------
ウォレット接続機能が完成したら、次のレッスンに進みましょう🎉

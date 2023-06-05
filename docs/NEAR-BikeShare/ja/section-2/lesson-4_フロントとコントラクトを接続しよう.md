### 🛠️ フロントエンドとコントラクトを接続しよう

前レッスンではバイクを管理するコントラクトを作成しました 🌟
このレッスンではフロントエンドを本プロジェクト用に編集し、コントラクトと接続してみましょう！

`near_bike_share_dapp`の中にある`frontend`ディレクトリの中身を変更します。
`frontend`のフォルダ構成を以下に示します。

```
frontend
├── App.js
├── __mocks__
│   └── fileMock.js
├── assets
│   ├── css
│   │   └── global.css
│   ├── img
│   │   ├── favicon.ico
│   │   ├── logo-black.svg
│   │   └── logo-white.svg
│   └── js
│       └── near
│           ├── config.js
│           └── utils.js
├── index.html
└── index.js
```

注目するのは`App.js`、`global.css`、`config.js`、`utils.js`、ファイルです。
また、`img`ディレクトリには使用する画像を追加します。

初めに以下の画像をダウンロードし,`bike.png`という名前で`frontend/assets/img/`内に保存してください。

![](/public/images/NEAR-BikeShare/section-2/2_4_4.png)

次に`frontend/assets/css/global.css`を以下に示すコードで書き換えてください。
今回のプロジェクトに合わせた`css`を記述しています。

```css
/* global.css */

html {
  --bg: #efefef;
  --fg: #1e1e1e;
  --gray: #555;
  --light-gray: #ccc;
  --shadow: #e6e6e6;
  --success: rgb(90, 206, 132);
  --primary: #ff585d;
  --secondary: #0072ce;

  background-color: var(--bg);
  color: var(--fg);
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial,
    sans-serif;
  font-size: calc(0.9em + 0.5vw);
  line-height: 1.3;
}

body {
  margin: 0;
  padding: 1em;
}

main {
  margin: 0 auto;
  max-width: 30em;
  text-align: justify;
}

h1,
h5 {
  background-image: url(../img/logo-black.svg);
  background-position: center 1em;
  background-repeat: no-repeat;
  background-size: auto 1.5em;
  margin-top: 0;
  padding: 3.5em 0 0.5em;
  text-align: center;
}

.link {
  color: var(--primary);
  text-decoration: none;
}
.link:hover,
.link:focus {
  text-decoration: underline;
}
.link:active {
  color: var(--secondary);
}

button,
input {
  font: inherit;
  outline: none;
}

button {
  background-color: var(--secondary);
  border-radius: 5px;
  border: none;
  color: #efefef;
  cursor: pointer;
  padding: 0.3em 0.75em;
  transition: transform 30ms;
}
button:hover,
button:focus {
  box-shadow: 0 0 10em rgba(255, 255, 255, 0.2) inset;
}
button:active {
  box-shadow: 0 0 10em rgba(0, 0, 0, 0.1) inset;
}
button.link {
  background: none;
  border: none;
  box-shadow: none;
  display: inline;
}
[disabled] button,
button[disabled] {
  box-shadow: none;
  background-color: var(--light-gray);
  color: rgb(82, 81, 81);
  cursor: not-allowed;
  transform: none;
}
[disabled] button {
  text-indent: -900em;
  width: 2em;
  position: relative;
}
[disabled] button:after {
  content: " ";
  display: block;
  width: 0.8em;
  height: 0.8em;
  border-radius: 50%;
  border: 2px solid #fff;
  border-color: var(--fg) transparent var(--fg) transparent;
  animation: loader 1.2s linear infinite;
  position: absolute;
  top: 0.45em;
  right: 0.5em;
}
@keyframes loader {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

fieldset {
  border: none;
  padding: 0;
}

input {
  background-color: var(--shadow);
  border: none;
  border-radius: 5px 0 0 5px;
  caret-color: var(--primary);
  color: inherit;
  padding: 0.25em 1em;
}
input::selection {
  background-color: var(--secondary);
  color: #efefef;
}
input:focus {
  box-shadow: 0 0 10em rgba(0, 0, 0, 0.02) inset;
}

code {
  color: var(--gray);
}

li {
  padding-bottom: 1em;
}

.bike {
  margin: 20 auto;
  padding: 5px;
  border-radius: 30px;
  background-color: gainsboro;
  width: 560px;
}

.bike_img {
  margin-top: 20px;
  margin-left: 10px;
}

.bike_index {
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 30px;
}

.bike button {
  margin: 20px;
  width: 110px;
  height: 50px;
  background-color: steelblue;
  border-radius: 5px;
}

.balance_content {
  margin: 10 auto;
  border-radius: 10px;
  background-color: gainsboro;
  width: 400px;
}

.balance_content button {
  display: block;
  background-color: teal;
}

.balance_content button,
fieldset {
  width: 100%;
}

.balance_content p {
  margin: 0 auto;
  width: 200px;
}
```

続いて`config.js`を覗きましょう！

```js
// config.js

const CONTRACT_NAME = process.env.CONTRACT_NAME || "new-awesome-project";

function getConfig(env) {
  // コントラクトの設定を返却 ...
}
```

このファイルはコントラクトとの接続に必要な設定をオブジェクトとして返却する`getConfig`関数を記述しています。

さらに接続するコントラクト（のデプロイしているアカウント名）の指定を`CONTRACT_NAME`で行っています。
プロセスの環境変数として`CONTRACT_NAME`を設定（後に行います）するか、`new-awesome-project`を適切なアカウント名に変更します。
このファイルは編集せずに先に進みましょう。

次は`utils.js`ファイルを見ていきます。

```js
// utils.js

import { connect, Contract, keyStores, WalletConnection } from "near-api-js";
import getConfig from "./config";

const nearConfig = getConfig(process.env.NODE_ENV || "development");

// コントラクトの初期化とグローバル変数windowのセット
export async function initContract() {
  // ...
}

// コントラクトAPI の実装 ...
```

`near-api-js`というライブラリを`import`してコントラクトとの接続に使用します。
`near-api-js`の使い方に関しては[こちら](https://docs.near.org/develop/integrate/frontend)を参照してください。
また、`config.js`ファイルから`import`した`getConfig`関数を使用して設定を取得しています。
その後に`initContract`関数でコントラクトとの接続を初期化,
さらにその後に`コントラクトAPI`（コントラクトの機能を使用するための関数）の実装が続いています。

`initContract`関数内の以下の部分に注目しましょう。

```js
window.contract = await new Contract(
  window.walletConnection.account(),
  nearConfig.contractName,
  {
    viewMethods: ["get_greeting"],
    changeMethods: ["set_greeting"],
  }
);
```

`window`変数に新しいコントラクト情報を格納しています。
もともとコントラクトとして存在した`greeter`コントラクトの情報が記述されています。
`view メソッド`に`get_greeting`,`change メソッド`に`set_greeting`がある状態です。
これをあなたが作ったメソッド名に変更しましょう！

```js
window.contract = await new Contract(
  window.walletConnection.account(),
  nearConfig.contractName,
  {
    viewMethods: [
      "num_of_bikes",
      "is_available",
      "who_is_using",
      "who_is_inspecting",
    ],
    changeMethods: ["use_bike", "inspect_bike", "return_bike"],
  }
);
```

そして`コントラクトAPI`の以下の部分についても`get_greeting`、`set_greeting`を使用している状態です。

```js
export async function set_greeting(message) {
  const response = await window.contract.set_greeting({
    args: { message: message },
  });
  return response;
}

export async function get_greeting() {
  const greeting = await window.contract.get_greeting();
  return greeting;
}
```

こちらも削除して、あなたが作ったメソッドを使用するように関数を追加・変更しましょう！

```js
export async function num_of_bikes() {
  const n = await window.contract.num_of_bikes();
  return n;
}

export async function is_available(index) {
  const response = await window.contract.is_available({
    index: index,
  });
  return response;
}

export async function who_is_using(index) {
  const response = await window.contract.who_is_using({
    index: index,
  });
  return response;
}

export async function who_is_inspecting(index) {
  const response = await window.contract.who_is_inspecting({
    index: index,
  });
  return response;
}

export async function use_bike(index) {
  const response = await window.contract.use_bike({
    index: index,
  });
  return response;
}

export async function inspect_bike(index) {
  const response = await window.contract.inspect_bike({
    index: index,
  });
  return response;
}

export async function return_bike(index) {
  const response = await window.contract.return_bike({
    index: index,
  });
  return response;
}
```

編集後のファイルはこのようになっております。

```js
// utils.js
import { connect, Contract, keyStores, WalletConnection } from "near-api-js";
import getConfig from "./config";

const nearConfig = getConfig(process.env.NODE_ENV || "development");

// Initialize contract & set global variables
export async function initContract() {
  // Initialize connection to the NEAR testnet
  const near = await connect(
    Object.assign(
      { deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } },
      nearConfig
    )
  );

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new WalletConnection(near);

  // Getting the Account ID. If still unauthorized, it's just empty string
  window.accountId = window.walletConnection.getAccountId();

  // Initializing our contract APIs by contract name and configuration
  window.contract = await new Contract(
    window.walletConnection.account(),
    nearConfig.contractName,
    {
      viewMethods: [
        "num_of_bikes",
        "is_available",
        "who_is_using",
        "who_is_inspecting",
      ],
      changeMethods: ["use_bike", "inspect_bike", "return_bike"],
    }
  );
}

export function logout() {
  window.walletConnection.signOut();
  // reload page
  window.location.replace(window.location.origin + window.location.pathname);
}

export function login() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  window.walletConnection.requestSignIn(nearConfig.contractName);
}

export async function num_of_bikes() {
  const n = await window.contract.num_of_bikes();
  return n;
}

export async function is_available(index) {
  const response = await window.contract.is_available({
    index: index,
  });
  return response;
}

export async function who_is_using(index) {
  const response = await window.contract.who_is_using({
    index: index,
  });
  return response;
}

export async function who_is_inspecting(index) {
  const response = await window.contract.who_is_inspecting({
    index: index,
  });
  return response;
}

export async function use_bike(index) {
  const response = await window.contract.use_bike({
    index: index,
  });
  return response;
}

export async function inspect_bike(index) {
  const response = await window.contract.inspect_bike({
    index: index,
  });
  return response;
}

export async function return_bike(index) {
  const response = await window.contract.return_bike({
    index: index,
  });
  return response;
}
```

続いて`App.js`を以下のコードで書き換えてください。

```js
// App.js

import { useEffect, useState } from "react";

import "./assets/css/global.css";

import {
  inspect_bike,
  is_available,
  login,
  logout,
  num_of_bikes,
  return_bike,
  use_bike,
  who_is_using,
  who_is_inspecting,
} from "./assets/js/near/utils";

export default function App() {
  /** バイクの情報をフロント側で保持するための配列です */
  const [allBikeInfo, setAllBikeInfo] = useState([]);
  /**
   * bikeInfoオブジェクトを定義します.
   * allBikeInfoはbikeInfoオブジェクトの配列となります.
   * 各属性はログインアカウントと連携した情報になります.
   * available:  ログインアカウントはバイクを使用可能か否か
   * in_use:     同じく使用中か否か
   * inspection: 同じく点検中か否か
   */
  const initialBikeInfo = async () => {
    return { available: false, in_use: false, inspection: false };
  };

  /** どの画面を描画するのかの状態を定義しています */
  const RenderingStates = {
    SIGN_IN: "sign_in",
    REGISTRATION: "registration",
    HOME: "home",
    TRANSACTION: "transaction",
  };
  /** useStateを利用して描画する状態を保持します */
  const [renderingState, setRenderingState] = useState(RenderingStates.HOME);

  /** 残高表示する際に利用します */
  const [showBalance, setShowBalance] = useState(false);
  const [balanceInfo, setBalanceInfo] = useState({});
  const initialBalanceInfo = async () => {
    return { account_id: "", balance: 0 };
  };

  /** コントラクト側で定義されている、バイクを使うのに必要なftを保持します */
  const [amountToUseBike, setAmountToUseBike] = useState(0);

  const bikeImg = require("./assets/img/bike.png");

  // 初回レンダリング時の処理.
  // サイン後にもブラウザのページがリロードされるので、この内容が実行されます.
  useEffect(() => {
    /** renderingStateを初期化します */
    const initRenderingState = async () => {
      if (!window.walletConnection.isSignedIn()) {
        setRenderingState(RenderingStates.SIGN_IN);
      }
    };

    /**
     * allBikeInfoを初期化します。
     * バイクの数をコントラクトから取得し,
     * その数だけ loop 処理でバイク情報を作成します。
     */
    const InitAllBikeInfo = async () => {
      const num = await num_of_bikes();
      console.log("Num of bikes:", num);

      const new_bikes = [];
      for (let i = 0; i < num; i++) {
        const bike = await createBikeInfo(i);
        new_bikes.push(bike);
      }

      setAllBikeInfo(new_bikes);
      console.log("Set bikes: ", new_bikes);
    };

    initRenderingState();
    InitAllBikeInfo();
  }, []);

  /** 指定されたindexのバイク情報をフロント用に整形して返却します. */
  const createBikeInfo = async (index) => {
    const bike = await initialBikeInfo();
    await is_available(index).then((is_available) => {
      if (is_available) {
        bike.available = is_available;
        return bike;
      }
    });
    await who_is_using(index).then((user_id) => {
      // サインインしているユーザのアカウントidと同じであればユーザは使用中なので
      // 使用中をtrueに変更します。
      if (window.accountId === user_id) {
        bike.in_use = true;
        return bike;
      }
    });
    await who_is_inspecting(index).then((inspector_id) => {
      // サインインしているユーザのアカウントidと同じであればユーザは点検中なので
      // 点検中をtrueに変更します。
      if (window.accountId === inspector_id) {
        bike.inspection = true;
      }
    });
    return bike;
  };

  /** バイクを使用、バイク情報を更新します。 */
  const useBikeThenUpdateInfo = async (index) => {
    console.log("Use bike");
    // 処理中は画面を切り替えるためにrenderingStatesを変更します。
    setRenderingState(RenderingStates.TRANSACTION);

    try {
      await use_bike(index);
    } catch (e) {
      alert(e);
    }
    await updateBikeInfo(index);

    setRenderingState(RenderingStates.HOME);
  };

  /** バイクを点検、バイク情報を更新します。 */
  const inspectBikeThenUpdateInfo = async (index) => {
    console.log("Inspect bike");
    setRenderingState(RenderingStates.TRANSACTION);

    try {
      await inspect_bike(index);
    } catch (e) {
      alert(e);
    }
    await updateBikeInfo(index);

    setRenderingState(RenderingStates.HOME);
  };

  /** バイクを返却、バイク情報を更新します。 */
  const returnBikeThenUpdateInfo = async (index) => {
    console.log("Return bike");
    setRenderingState(RenderingStates.TRANSACTION);

    try {
      await return_bike(index);
    } catch (e) {
      alert(e);
    }
    await updateBikeInfo(index);

    setRenderingState(RenderingStates.HOME);
  };

  /** 特定のバイク情報を更新してallBikeInfoにセットします。 */
  const updateBikeInfo = async (index) => {
    const new_bike = await createBikeInfo(index);

    allBikeInfo[index] = new_bike;
    setAllBikeInfo(allBikeInfo);
    console.log("Update bikes: ", allBikeInfo);
  };

  // サインインしているアカウント情報のurlをログに表示
  console.log(
    "see:",
    `https://explorer.testnet.near.org/accounts/${window.accountId}`
  );
  // コントラクトのアカウント情報のurlをログに表示
  console.log(
    "see:",
    `https://explorer.testnet.near.org/accounts/${window.contract.contractId}`
  );

  /** サインアウトボタンの表示に使用します。 */
  const signOutButton = () => {
    return (
      <button className="link" style={{ float: "right" }} onClick={logout}>
        Sign out
      </button>
    );
  };

  /** 登録解除ボタンの表示に使用します。 */
  const unregisterButton = () => {
    return (
      <button className="link" style={{ float: "right" }}>
        Unregister
      </button>
    );
  };

  /** サインイン画面を表示します。 */
  const requireSignIn = () => {
    return (
      <div>
        <main>
          <p style={{ textAlign: "center", marginTop: "2.5em" }}>
            <button onClick={login}>Sign in</button>
          </p>
        </main>
      </div>
    );
  };

  /** 登録画面を表示します。 */
  const requireRegistration = () => {
    return (
      <div>
        {signOutButton()}
        <div style={{ textAlign: "center" }}>
          <h5>
            Registration in ft contract is required before using the bike app
          </h5>
        </div>
        <main>
          <p style={{ textAlign: "center", marginTop: "2.5em" }}>
            <button>storage deposit</button>
          </p>
        </main>
      </div>
    );
  };

  /** 画面のヘッダー部分の表示に使用します。 */
  const header = () => {
    return <h1>Hello {window.accountId} !</h1>;
  };

  /** トランザクション中の画面を表示します。 */
  const transaction = () => {
    return (
      <div>
        {header()}
        <main>
          <p> in process... </p>
        </main>
      </div>
    );
  };

  /**
   * バイク情報の表示に使用します。
   * allBikeInfoをリスト表示します。
   */
  const bikeContents = () => {
    return (
      <div>
        {allBikeInfo.map((bike, index) => {
          return (
            <div className="bike" style={{ display: "flex" }} key={index}>
              <div className="bike_img">
                <img src={bikeImg} />
              </div>
              <div className="bike_index">: {index}</div>
              <button
                // ボタンを無効化する条件を定義
                disabled={!bike.available}
                onClick={() => useBikeThenUpdateInfo(index)}
              >
                use
              </button>
              <button
                // ボタンを無効化する条件を定義
                disabled={!bike.available}
                onClick={() => inspectBikeThenUpdateInfo(index)}
              >
                inspect
              </button>
              <button
                // ボタンを無効化する条件を定義。
                // ログインユーザがバイクを使用も点検もしていない場合は使用できないようにしています。
                disabled={!bike.in_use && !bike.inspection}
                onClick={() => returnBikeThenUpdateInfo(index)}
              >
                return
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  /** 残高表示に使用します。 */
  const checkBalance = () => {
    return (
      <div className="balance_content">
        <button>check my balance</button>
        <button style={{ marginTop: "0.1em" }}>check contract&apos;s balance</button>
        <span>or</span>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const { fieldset, account } = event.target.elements;
            const account_to_check = account.value;
            fieldset.disabled = true;
            try {
            } catch (e) {
              alert(e);
            }
            fieldset.disabled = false;
          }}
        >
          <fieldset id="fieldset">
            <div style={{ display: "flex" }}>
              <input autoComplete="off" id="account" placeholder="account id" />
              <button style={{ borderRadius: "0 5px 5px 0" }}>check</button>
            </div>
          </fieldset>
        </form>
        {showBalance && (
          <div>
            <p>{balanceInfo.account_id}&apos;s</p>
            <p>balance: {balanceInfo.balance}</p>
          </div>
        )}
      </div>
    );
  };

  /** ftの送信部分の表示に使用します。 */
  const transferFt = () => {
    return (
      <div>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const { fieldset, account } = event.target.elements;
            const account_to_transfer = account.value;
            fieldset.disabled = true;
            try {
            } catch (e) {
              alert(e);
            }
            fieldset.disabled = false;
          }}
        >
          <fieldset id="fieldset">
            <label
              htmlFor="account"
              style={{
                display: "block",
                color: "var(--gray)",
                marginBottom: "0.5em",
                marginTop: "1em",
              }}
            >
              give someone {amountToUseBike.toString()} ft
            </label>
            <div style={{ display: "flex" }}>
              <input
                autoComplete="off"
                id="account"
                style={{ flex: 1 }}
                placeholder="account id"
              />
              <button style={{ borderRadius: "0 5px 5px 0" }}>transfer</button>
            </div>
          </fieldset>
        </form>
      </div>
    );
  };

  /** ホーム画面を表示します。 */
  const home = () => {
    return (
      <div>
        {signOutButton()}
        {unregisterButton()}
        {header()}
        <main>
          {bikeContents()}
          {checkBalance()}
          {transferFt()}
        </main>
      </div>
    );
  };

  /** renderingStateに適した画面を表示します。 */
  switch (renderingState) {
    case RenderingStates.SIGN_IN:
      return <div>{requireSignIn()}</div>;

    case RenderingStates.REGISTRATION:
      return <div>{requireRegistration()}</div>;

    case RenderingStates.TRANSACTION:
      return <div>{transaction()}</div>;

    case RenderingStates.HOME:
      return <div>{home()}</div>;
  }
}
```

少し長いので読むのが大変かと思いますが,
Webサイトがブラウザ上で起動してからの`App.js`内の処理フローをここで簡単に整理します。

- 起動時、`useEffect`内で定義した`allBikeInfo`と`renderingState`の初期化が実行されます。
- 次にファイル下部にある`switch`文が実行されます。
- `renderingState`が`RenderingStates.SIGN_IN`の場合はサインイン画面を表示します。
- `renderingState`が`RenderingStates.HOME`の場合はホーム画面を表示します。
- ホーム画面の表示(`hoem`関数)では`bikeContents`関数が実行されます。
  `allBikeInfo`と共にユーザが利用できるボタンをリスト表示します。

最後に`package.json`内,`build:contract`スクリプトを以下のように変更します。

```js
// package.json

  "scripts": {
	  // ...
		"build:contract": "cd contract && rustup target add wasm32-unknown-unknown && cargo build --all --target wasm32-unknown-unknown --release && mkdir -p ../out/ && cp ./target/wasm32-unknown-unknown/release/bike_share.wasm ../out/main.wasm",
	  // ...
  }
```

`greeting.wasm`を使用していたところを`bike_share.wasm`を使用するように変更したのみです。

それでは`near_bike_share_dapp`直下で以下のコマンドを実行しましょう！

```
$ yarn dev
```

ブラウザ以下のような画面が表示されれば成功です！

サインインしていない場合

![](/public/images/NEAR-BikeShare/section-2/2_4_5.png)

サインイン後

![](/public/images/NEAR-BikeShare/section-2/2_4_1.png)

`use`、`inspect`、`return`ボタンを押してみて挙動を確かめましょう。

サイトの上で右クリックを行い、`Inspect`を選択 -> `Console`を選択し出力結果を確認してみましょう。

![](/public/images/NEAR-BikeShare/section-2/2_4_2.png)

アプリの挙動を確かめた後`Console`の出力にURLが2つ表示されています。

![](/public/images/NEAR-BikeShare/section-2/2_4_3.png)

それぞれユーザのアカウント情報、コントラクトのアカウント情報を検索することができます。
クリックして参照してみましょう、トランザクションの履歴などが確認できます。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#near`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット

```

---

おめでとうございます！
アプリの基盤を作ることができました！
先ほど確認したURL(`Console`に最後に表示されたコントラクトアカウントIDに関するURL)を`#near`に投稿して、あなたの成功をコミュニティで祝いましょう 🎉
次のレッスンでは`ftコントラクト`を連携していきます！

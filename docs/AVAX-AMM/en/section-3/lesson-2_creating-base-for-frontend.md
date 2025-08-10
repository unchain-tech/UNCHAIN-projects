So now, let’s actually start writing code to create the foundation of the frontend.
From here on, we’ll be working with the files inside the `AVAX-AMM/packages/client` directory. 🙌

In this step, we will delete or edit files that are assumed to exist from the initial setup.
If a file to be deleted does not exist in your folder structure, simply ignore that instruction.
If a file to be edited does not exist in your folder structure, create a new file and copy the given code directly into it.

### 📁 `styles` Directory

The `styles` directory contains CSS code.
There’s `global.css`, which is applied to all pages, and `Home.module.css`, which is for the home page.

In `global.css`, enter the code shown.
※ There may be cases where no edits are needed from the initial setup.

```css
html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu,
    Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
}

@media (prefers-color-scheme: dark) {
  html {
    color-scheme: dark;
  }
  body {
    color: white;
    background: black;
  }
}
```

Update `Home.module.css` with the given code.

```css
.pageBody {
  height: 100vh;
  background: linear-gradient(
    20deg,
    rgb(49, 62, 80) 0%,
    rgb(122, 153, 182) 180%
  );
}

.navBar {
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: white;
  padding: 0px 30px;
}

.rightHeader {
  display: flex;
  padding: 5px 10px 5px 10px;
}

.appName {
  margin: 0 10px;
  font-size: 28px;
  font-weight: 800;
}

.connectBtn {
  position: absolute;
  right: 50px;
  top: 20px;
  background-color: #ff726e;
  color: #0e0e10;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 10px 5px 10px;
  border-radius: 15px;
}

.connectBtn:hover {
  color: white;
  border: 2px solid #c8332e;
}

.connected {
  position: absolute;
  right: 50px;
  top: 20px;
  background-color: #4e4b56;
  color: white;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 10px 5px 10px;
  border-radius: 15px;
}
```

`styles`に関するフォルダ構成はこのようになります。

```
client
└── styles
    ├── Home.module.css
    └── globals.css
```

### 📁 `public` Directory

`Next.js` treats the `public` directory at the root as the location for static assets (images, text files, etc.).
This means that if you specify an image URL like `/image.png` in your source code,
`Next.js` will automatically interpret it as `/project-root/public/image.png`.

Delete all files inside this directory except `favicon.ico`.
Then add a new image.

You can either download the provided image or save any image you like as `bird.png` (or another name) inside the `public` directory.
![](/images/AVAX-AMM/section-3/3_2_2.png)

You can also change the `favicon.ico` to customize your web application’s favicon.

`public`に関するフォルダ構成はこのようになります。

```
client
└── public
    ├── bird.png
    └── favicon.png
```

---

### 📁 `utils` Directory

Inside `client`, create a `utils` directory.
In it, create three files: `ethereum.ts`, `format.ts`, and `validAmount.ts`.

**Folder structure for `utils`:**

```
client
└── utils
    ├── ethereum.ts
    ├── format.ts
    └── validAmount.ts
```

In `ethereum.ts`, we add a helper function to retrieve the `ethereum` object from `window` if MetaMask is installed.
`MetaMaskInpageProvider` is the type definition for the `ethereum` object provided by the `@metamask/providers` package.

In `format.ts`, we provide utility functions to convert share values between “with PRECISION” and “without PRECISION” formats.

In `validAmount.ts`, we define a function to validate the user’s input amount using a regular expression.

### 📁 `hooks` Directory

Inside `client`, create a `hooks` directory.
This will contain custom hooks(独自で作った[フック](https://ja.reactjs.org/docs/hooks-overview.html)) to handle wallet or contract state.

`hooks`ディレクトリ内に`useWallet.ts`というファイルを作成し、以下のコードを記述してください。

```ts
import { useEffect, useState } from "react";

import { getEthereum } from "../utils/ethereum";

type ReturnUseWallet = {
  currentAccount: string | undefined;
  connectWallet: () => void;
};

export const useWallet = (): ReturnUseWallet => {
  const [currentAccount, setCurrentAccount] = useState<string>();
  const ethereum = getEthereum();

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        alert("Get Wallet!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (!Array.isArray(accounts)) return;
      console.log("Connected: ", accounts[0]);
      setCurrentAccount(accounts[0]); // 簡易実装のため、配列の初めのアドレスを使用します。
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = useCallback(async () => {
    try {
      if (!ethereum) {
        console.log("Make sure you have Wallet!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (!Array.isArray(accounts)) return;
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  }, [ethereum]);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [checkIfWalletIsConnected]);

  return {
    currentAccount,
    connectWallet,
  };
};
```

ここでは、ユーザがMetamaskを持っていることの確認とウォレットへの接続機能を実装します。

`connectWallet`はwebアプリがユーザのウォレットにアクセスすることを求める関数で、
この後の実装でUIにユーザのウォレット接続ボタンを用意し、そのボタンとこの関数を連携します。
そのため外部で使用できるように返り値の中に含めています。

`checkIfWalletIsConnected`は既にユーザのウォレットとwebアプリが接続しているかを確認する関数で、

また、それぞれの関数内で使用している`eth_requestAccounts`と`eth_accounts`は、空の配列または単一のアカウントアドレスを含む配列を返す特別なメソッドです。
ユーザーがウォレットに複数のアカウントを持っている場合を考慮して、プログラムはユーザーの1つ目のアカウントアドレスを取得することにしています。

`hooks`に関するフォルダ構成はこのようになります。

```
client
└── hooks
    └── useWallet.ts
```

### 📁 `components`Directory

`client`ディレクトリ直下に`components`という名前のディレクトリを作成してください。
こちらにはコンポーネントを実装したファイルを保存していきます。

> 📓 コンポーネントとは
> UI（ユーザーインターフェイス）を形成する一つの部品のことです。
> コンポーネントはボタンのような小さなものから、ページ全体のような大きなものまであります。
> レゴブロックのようにコンポーネントのブロックで UI を作ることで、機能の追加・削除などの変更を容易にすることができます。

📁 `Container`ディレクトリ

まず`components`ディレクトリ内に`Container`というディレクトリを作成し、
その中に`Container.module.css`と`Container.tsx`という名前のファイルを作成してください。

`Container.module.css`内に以下のコードを記述してください。

```css
.centerContent {
  margin: 0px auto;
}

.selectTab {
  width: 460px;
  height: 80px;
  display: flex;
  justify-content: space-between;
  margin: 0px auto;
  margin-top: 10px;
  background-color: #0e0e10;
  border-radius: 19px 19px 0px 0px;
  padding: 0px 20px 0px 20px;
}

.tabStyle {
  text-align: center;
  width: 80px;
  padding: 5px;
  font: 18px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  margin-top: 15px;
  border-radius: 15px;
  cursor: pointer;
}

.tabStyle:hover {
  background: #204158;
}

.activeTab {
  background: #356c93;
}

@media only screen and (min-width: 1180px) {
  .mainBody {
    display: flex;
  }
}
```

`Container.tsx`で使用するcssになります。

`Container.tsx`内に以下のコードを記述してください。

```tsx
import { useState } from "react";

import styles from "./Container.module.css";

type Props = {
  currentAccount: string | undefined;
};

export default function Container({ currentAccount }: Props) {
  const [activeTab, setActiveTab] = useState("Swap");

  const changeTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.mainBody}>
      <div className={styles.centerContent}>
        <div className={styles.selectTab}>
          <div
            className={
              styles.tabStyle +
              " " +
              (activeTab === "Swap" ? styles.activeTab : "")
            }
            onClick={() => changeTab("Swap")}
          >
            Swap
          </div>
          <div
            className={
              styles.tabStyle +
              " " +
              (activeTab === "Provide" ? styles.activeTab : "")
            }
            onClick={() => changeTab("Provide")}
          >
            Provide
          </div>
          <div
            className={
              styles.tabStyle +
              " " +
              (activeTab === "Withdraw" ? styles.activeTab : "")
            }
            onClick={() => changeTab("Withdraw")}
          >
            Withdraw
          </div>
          <div
            className={
              styles.tabStyle +
              " " +
              (activeTab === "Faucet" ? styles.activeTab : "")
            }
            onClick={() => changeTab("Faucet")}
          >
            Faucet
          </div>
        </div>

        {activeTab === "Swap" && <div>swap</div>}
        {activeTab === "Provide" && <div>provide</div>}
        {activeTab === "Withdraw" && <div>withdraw</div>}
        {activeTab === "Faucet" && <div>faucet</div>}
      </div>
      details
    </div>
  );
}
```

ここでは今回作るUIのベースとなるものが記載されています。
`activeTab`を変更することで表示する内容が変更できるようになっております。

レッスンの最後で確認するUIと照らし合わせると、内容がわかりやすいと思います。

> 📓 `~.module.css`とは
> `module.css`を css ファイルの語尾に付けることで、`CSSモジュール`という`Next.js`の仕組みを利用することができます。
> `CSSモジュール`はファイル内のクラス名を元にユニークなクラス名を生成してくれます。
> 内部で自動的に行ってくれるので私たちがユニークなクラス名を直接使用することがありませんが、
> クラス名の衝突を気にする必要がなくなります。
> 異なるファイルで同じ CSS クラス名を使用することができます。
> 詳しくは[こちら](https://nextjs.org/docs/basic-features/built-in-css-support)をご覧ください。

📁 `InputBox` Directory
Inside `components`, create an `InputBox` directory, and
create file `InputNumberBox.module.css` and `InputNumberBox.tsx`.

`InputNumberBox.module.css`内に以下のコードを記述してください。

```css
.boxTemplate {
  width: 75%;
  height: auto;
  display: flex;
  margin: 50px auto;
  padding: 0px 40px 20px 40px;
  flex-direction: column;
  border-radius: 19px;
  position: relative;
  overflow: hidden;
  border: 2px solid grey;
}

.boxBody {
  display: flex;
  justify-content: space-between;
  color: white;
}

.leftHeader {
  font-size: 14px;
}

.textField {
  width: 70%;
  height: 30px;
  font-size: 22px;
  background-color: #0e0e10;
  color: white;
  border: 0px;
}
.textField:focus-visible {
  outline: none;
}

.rightContent {
  display: flex;
  align-items: center;
  justify-content: center;
  font: 20px;
  font-weight: 700;
}
```

`InputNumberBox.tsx`内に以下のコードを記述してください。

```tsx
import { ChangeEvent } from "react";

import styles from "./InputNumberBox.module.css";

type Props = {
  leftHeader: string;
  right: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function InputNumberBox({
  leftHeader,
  right,
  value,
  onChange,
}: Props) {
  return (
    <div className={styles.boxTemplate}>
      <div className={styles.boxBody}>
        <div>
          <p className={styles.leftHeader}> {leftHeader} </p>
          <input
            className={styles.textField}
            type="number"
            value={value}
            onChange={(e) => onChange(e)}
            placeholder={"Enter amount"}
          />
        </div>
        <div className={styles.rightContent}>{right}</div>
      </div>
    </div>
  );
}
```

ユーザが数値を入力するUIでこのコンポーネントを使用します。

`components`に関するフォルダ構成はこのようになります。

```
client
└── components
    ├── Container
    │   ├── Container.module.css
    │   └── Container.tsx
    └── InputBox
        ├── InputNumberBox.module.css
        └── InputNumberBox.tsx
```

### 📁 `pages` Directory

Finally, we edit the `pages` directory inside `client`.

First, delete the `api` directory since we won’t be using it.

`_app.tsx`内に以下のコードを記述してください。
※初期設定のままなので編集箇所がない場合があります。

```tsx
import type { AppProps } from "next/app";

import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
```

`_app.tsx`ファイルは標準で、全てのページの親コンポーネントとなります。
今回は`globals.css`の利用のみ行いますが、
全てのページで使用したい`context`やレイアウトがある場合に`_app.tsx`ファイル内で使用すると便利です。

`index.tsx`内に以下のコードを記述してください。

```tsx
import type { NextPage } from "next";
import Image from "next/image";

import Container from "../components/Container/Container";
import { useWallet } from "../hooks/useWallet";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const { currentAccount, connectWallet } = useWallet();

  return (
    <div className={styles.pageBody}>
      <div className={styles.navBar}>
        <div className={styles.rightHeader}>
          <Image alt="Picture of icon" src="/bird.png" width={40} height={30} />
          <div className={styles.appName}> Miniswap </div>
        </div>
        {currentAccount === undefined ? (
          <div className={styles.connectBtn} onClick={connectWallet}>
            {" "}
            Connect to wallet{" "}
          </div>
        ) : (
          <div className={styles.connected}>
            {" "}
            {"Connected to " + currentAccount}{" "}
          </div>
        )}
      </div>
      <Container currentAccount={currentAccount} />
    </div>
  );
};

export default Home;
```

ここでは先ほど作成した`useWallet`を使用していて、`currentAccount`の存在有無で
walletへの接続を求めるか、接続している`currentAccount`の値を表示するかを条件分岐しています。

[Image タグ](https://nextjs.org/docs/basic-features/image-optimization) はNext.jsに用意されたタグで画像描画について最適化されます。

先ほど作成した`Container`コンポーネントも使用しています。

`pages`に関するフォルダ構成はこのようになります。

```
client
└── pages
    ├── _app.tsx
    └── index.tsx
```

### 🖥️ Let’s check the screen

Run the following command in your terminal:

```
yarn client dev
```

Then open your browser and go to `http://localhost:3000`.

You should see a screen similar to the example image.
Switching between tabs (`Swap`, `Provide`, etc.) should change the displayed label.

![](/images/AVAX-AMM/section-3/3_2_1.png)

Clicking the `Connect to wallet` button should prompt MetaMask to connect.
⚠️ Make sure your MetaMask network is set to `Fuji` before connecting.

After MetaMask approval, the `Connect to wallet` button will display your connected wallet address.

![](/images/AVAX-AMM/section-3/3_2_3.png)

### 🌔 Reference Link

> You can check the final completed repository for this project [here](https://github.com/unchain-tech/AVAX-AMM).
>
> If something isn’t working as expected, you can refer to it.

### 🙋‍♂️ Asking Questions

If you have any questions about the work so far, ask in the `#avalanche` channel on Discord.

To make support smoother, please include the following in your error report:

```
1. Section number and lesson number your question relates to
2. What you were trying to do
3. Copy & paste of the error message
4. Screenshot of the error screen
```

---

We now have the base code for the frontend!
In the next lesson, we’ll connect the contract and the frontend.

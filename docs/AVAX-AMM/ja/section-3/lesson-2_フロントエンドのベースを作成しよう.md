それでは実際にコードを書いてフロントエンドのベースとなるものを作成していきます。これから先の作業は、`AVAX-AMM/packages/client`ディレクトリ内のファイルを操作していきます。🙌

ここでは初期設定で存在すると想定されるファイルを削除・編集することがあります。
もし削除するファイルがあなたのフォルダ構成の中に無かった場合は、無視してください。
もし編集するファイルがあなたのフォルダ構成の中に無かった場合は、新たにファイルを作成し編集内容のコードをそのままコピーしてください。

### 📁 `styles`ディレクトリ

`styles`ディレクトリにはcssのコードが入っています。
全てのページに適用されるよう用意された`global.css`と、ホームページ用の`Home.module.css`があります。

`global.css`内に以下のコードを記述してください。
※初期設定のままで編集箇所がない場合があります。

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

`Home.module.css`内を以下のコードに変更してください。

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

### 📁 `public`ディレクトリ

`Next.js`はルートディレクトリ直下の`public`ディレクトリを静的なリソース（画像やテキストデータなど）の配置場所と認識します。
そのためソースコード内で画像のURLを`/image.png`と指定した場合、
`Next.js`は自動的に`public`ディレクトリをルートとした`プロジェクトルート/public/image.png`を参照してくれます。

ディレクトリ内の`favicon.ico`以外のファイルを全て削除してください。
そして新たに画像を追加します。

以下の画像をダウンロードするか、あなたのお好きな画像を`bird.png`（または別の名前）という名前で`public`ディレクトリ内に保存してください。
![](/public/images/AVAX-AMM/section-3/3_2_2.png)

また、`favicon.ico`を別の画像にすると、あなたのwebアプリケーションのファビコンが変わるので自由に変更してみてください。

`public`に関するフォルダ構成はこのようになります。

```
client
└── public
    ├── bird.png
    └── favicon.png
```

### 📁 `utils`ディレクトリ

`client`へ移動し`utils`ディレクトリを作成してください。
その中に`ethereum.ts`、`format.ts`、`validAmount.ts`というファイルを作成してください。

```
client
└── utils
    ├── ethereum.ts
    ├── format.ts
    └── validAmount.ts
```

`ethereum.ts`の中に以下のコードを記述してください。

```ts
import { MetaMaskInpageProvider } from '@metamask/providers';

// window に ethereum を追加します。
declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

export const getEthereum = (): MetaMaskInpageProvider | null => {
  if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    const { ethereum } = window;
    return ethereum;
  }
  return null;
};
```

typescriptで`window.ethereum`を使用するためには、`window`に`ethereum`オブジェクトがあるということを明示する必要があります。
`MetaMaskInpageProvider`は環境設定時にインストールした`@metamask/providers`から取得した`ethereum`の型定義です。

> 📓 `window.ethereum`とは
> Web アプリケーション上でユーザーがブロックチェーンネットワークと通信するためには、Web アプリケーションはユーザーのウォレット情報を取得する必要があります。
>
> `window.ethereum`は MetaMask が`window`(JavaScript にデフォルトで存在するグローバル変数)の直下に用意するオブジェクトであり API です。
> この API を使用して、ウェブサイトはユーザーのイーサリアムアカウントを要求し、ユーザーが接続しているブロックチェーンからデータを読み取り、ユーザーがメッセージや取引に署名するよう求めることができます。

また、`getEthereum`関数を呼び出すと`window`から取り出した`ethereum`オブジェクトを取得できるようにしています。

`format.ts`の中に以下のコードを記述してください。

```ts
import { BigNumber } from 'ethers';

// PRECISIONありのshareに変換します。
export const formatWithPrecision = (
  share: string,
  precision: BigNumber
): BigNumber => {
  return BigNumber.from(share).mul(precision);
};

// PRECISIONなしのshareに変換します。
export const formatWithoutPrecision = (
  share: BigNumber,
  precision: BigNumber
): string => {
  return share.div(precision).toString();
};
```

ここではコントラクトとshareの情報をやり取りする際に使用するutil関数を用意しています。

shareについては一度離れていた部分なので、再確認したい方は[section-1/lesson-2](/docs/AVAX-AMM/ja/section-1/lesson-2_Solidity%E3%81%A7%E3%82%B9%E3%83%9E%E3%83%BC%E3%83%88%E3%82%B3%E3%83%B3%E3%83%88%E3%83%A9%E3%82%AF%E3%83%88%E3%82%92%E4%BD%9C%E6%88%90%E3%81%97%E3%82%88%E3%81%86.md)の`シェアについて`の部分を読み返してください。

基本的にフロントエンドでは、shareをPRECISIONなしでstring型で保持します。

フロントエンド -> コントラクトへshareを伝える際は、`formatWithPrecision`を使用し
コントラクト -> フロントエンドへshareが伝えられた際は、`formatWithoutPrecision`を使用して変換を行います。

`validAmount.ts`の中に以下のコードを記述してください。

```ts
const regValidNumber = /^[0-9]+[.]?[0-9]*$/;

export const validAmount = (amount: string): boolean => {
  if (amount === '') {
    return false;
  }
  if (!regValidNumber.test(amount)) {
    return false;
  }
  return true;
};
```

ここではユーザの入力をバリデートする関数を用意しています。

### 📁 `hooks`ディレクトリ

`client`ディレクトリ直下に`hooks`というディレクトリを作成しましょう。
こちらにはウォレットやコントラクトの状態を扱うようなカスタムフック(独自で作った[フック](https://ja.reactjs.org/docs/hooks-overview.html))を実装したファイルを保存します。

`hooks`ディレクトリ内に`useWallet.ts`というファイルを作成し、以下のコードを記述してください。

```ts
import { useEffect, useState } from 'react';

import { getEthereum } from '../utils/ethereum';

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
        alert('Get Wallet!');
        return;
      }
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      if (!Array.isArray(accounts)) return;
      console.log('Connected: ', accounts[0]);
      setCurrentAccount(accounts[0]); // 簡易実装のため、配列の初めのアドレスを使用します。
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = useCallback(async () => {
    try {
      if (!ethereum) {
        console.log('Make sure you have Wallet!');
        return;
      } else {
        console.log('We have the ethereum object', ethereum);
      }
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (!Array.isArray(accounts)) return;
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

### 📁 `components`ディレクトリ

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
import { useState } from 'react';

import styles from './Container.module.css';

type Props = {
  currentAccount: string | undefined;
};

export default function Container({ currentAccount }: Props) {
  const [activeTab, setActiveTab] = useState('Swap');

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
              ' ' +
              (activeTab === 'Swap' ? styles.activeTab : '')
            }
            onClick={() => changeTab('Swap')}
          >
            Swap
          </div>
          <div
            className={
              styles.tabStyle +
              ' ' +
              (activeTab === 'Provide' ? styles.activeTab : '')
            }
            onClick={() => changeTab('Provide')}
          >
            Provide
          </div>
          <div
            className={
              styles.tabStyle +
              ' ' +
              (activeTab === 'Withdraw' ? styles.activeTab : '')
            }
            onClick={() => changeTab('Withdraw')}
          >
            Withdraw
          </div>
          <div
            className={
              styles.tabStyle +
              ' ' +
              (activeTab === 'Faucet' ? styles.activeTab : '')
            }
            onClick={() => changeTab('Faucet')}
          >
            Faucet
          </div>
        </div>

        {activeTab === 'Swap' && <div>swap</div>}
        {activeTab === 'Provide' && <div>provide</div>}
        {activeTab === 'Withdraw' && <div>withdraw</div>}
        {activeTab === 'Faucet' && <div>faucet</div>}
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

📁 `InputBox`ディレクトリ

次に`components`ディレクトリ内に`InputBox`というディレクトリを作成し、
その中に`InputNumberBox.module.css`と`InputNumberBox.tsx`という名前のファイルを作成してください。

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
import { ChangeEvent } from 'react';

import styles from './InputNumberBox.module.css';

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
            placeholder={'Enter amount'}
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
    │   ├── Container.module.cs
    │   └── Container.tsx
    └── InputBox
        ├── InputNumberBox.module.css
        └── InputNumberBox.tsx
```

### 📁 `pages`ディレクトリ

最後に`client`ディレクトリ直下の`pages`ディレクトリを編集していきます。

まず初めに`api`ディレクトリは今回使用しないのでディレクトリごと削除してください。

`_app.tsx`内に以下のコードを記述してください。
※初期設定のままなので編集箇所がない場合があります。

```tsx
import type { AppProps } from 'next/app';

import '../styles/globals.css';

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
import type { NextPage } from 'next';
import Image from 'next/image';

import Container from '../components/Container/Container';
import { useWallet } from '../hooks/useWallet';
import styles from '../styles/Home.module.css';

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
            {' '}
            Connect to wallet{' '}
          </div>
        ) : (
          <div className={styles.connected}>
            {' '}
            {'Connected to ' + currentAccount}{' '}
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

🖥️ 画面で確認しましょう

ターミナル上で以下のコマンドを実行してください。

```
yarn client dev
```

そしてブラウザで`http://localhost:3000 `へアクセスしてください。

以下のような画面が表示されれば成功です！
`swap`などのタブを切り替えると各tabの名前が表示されるはずです。

![](/public/images/AVAX-AMM/section-3/3_2_1.png)

画面右上の`Connect to wallet`ボタンを押下するとウォレットと接続することができます。
⚠️ この先ウォレットを接続する場合は、ネットワークに`Fuji`を選択した状態で行ってください。

MetaMaskの承認が終わると、`Connect to wallet`ボタンの部分があなたの接続しているウォレットのアドレスの表示に変更されます。

![](/public/images/AVAX-AMM/section-3/3_2_3.png)

### 🌔 参考リンク

> [こちら](https://github.com/unchain-tech/AVAX-AMM)に本プロジェクトの完成形のレポジトリがあります。
>
> 期待通り動かない場合は参考にしてみてください。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#avalanche`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

フロントエンドのベースとなるコードが出来ました！
次のレッスンではコントラクトとフロントエンドを連携する作業に入ります！

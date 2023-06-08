### 🚅 フロントエンドのベースを実装しましょう

それでは実際にコードを書いてフロントエンドのベースとなるものを作成していきます。

ここでは初期設定で存在すると想定されるファイルを削除・編集することがあります。
もし削除するファイルがあなたのフォルダ構成の中に無かった場合は、 無視してください。
もし編集するファイルがあなたのフォルダ構成の中に無かった場合は、 新たにファイルを作成し編集内容のコードをそのままコピーしてください。

先に必要なファイルを用意する作業が少し長いですが、 最後にブラウザでUIを確認しますので、 コードが理解しづらかった部分はブラウザで表示した後に再度確認して頂ければと思います。

### 📁 `styles`ディレクトリ

`styles`ディレクトリにはcssのコードが入っています。
全てのページに適用されるよう用意された`global.css`と、 ホームページ用の`Home.module.css`があります。

`Home.module.css`を削除してください。

`global.css`内に以下のコードを記述してください。

```css
html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu,
    Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  background-color: rgb(50, 158, 50);
  color: white;
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
}
```

`styles`に関するフォルダ構成はこのようになります。

```
client
└── styles
    └── globals.css
```

### 📁 `public`ディレクトリ

`Next.js`はルートディレクトリ直下の`public`ディレクトリを静的なリソース（画像やテキストデータなど）の配置場所と認識します。
そのためソースコード内で画像のURLを`/image.png`と指定した場合、
`Next.js`は自動的に`public`ディレクトリをルートとした`プロジェクトルート/public/image.png`を参照してくれます。

ディレクトリ内の`favicon.ico`以外のファイルを全て削除してください。

また、 あなたのアプリのファビコンを変更したい場合はお好きな画像を`favicon.ico`という名前で保存してください。

`public`に関するフォルダ構成はこのようになります。

```
client
└── public
    └── favicon.png
```

### 📁 `utils`ディレクトリ

`client`へ移動し`utils`ディレクトリを作成してください。
その中に`ethereum.ts`、 `formatter.ts`、 `validAmount.ts`というファイルを作成してください。

```
client
└── utils
    ├── ethereum.ts
    ├── formatter.ts
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

型定義に厳格なtypescriptで`window.ethereum`を使用するためには、 `window`に`ethereum`オブジェクトがあるということを明示する必要があります。
`MetaMaskInpageProvider`は環境設定時にインストールした`@metamask/providers`から取得した`ethereum`の型定義です。

> 📓 `window.ethereum`とは
> Web アプリケーション上でユーザーがブロックチェーンネットワークと通信するためには、 Web アプリケーションはユーザーのウォレット情報を取得する必要があります。
>
> `window.ethereum`は MetaMask が`window`(JavaScript にデフォルトで存在するグローバル変数)の直下に用意するオブジェクトであり API です。
> この API を使用して、 ウェブサイトはユーザーのイーサリアムアカウントを要求し、 ユーザーが接続しているブロックチェーンからデータを読み取り、 ユーザーがメッセージや取引に署名するよう求めることができます。

また、 `getEthereum`関数を呼び出すと`window`から取り出した`ethereum`オブジェクトを取得できるようにしています。

`formatter.ts`の中に以下のコードを記述してください。

```ts
import { BigNumber, ethers } from 'ethers';

export const weiToAvax = (wei: BigNumber) => {
  return ethers.utils.formatEther(wei);
};

export const avaxToWei = (avax: string) => {
  return ethers.utils.parseEther(avax);
};

export const blockTimeStampToDate = (timeStamp: BigNumber) => {
  return new Date(timeStamp.toNumber() * 1000); // milliseconds to seconds
};
```

`weiToAvax`(or `avaxToWei`)は`wei`と`AVAX`の単位変換を行なっています。
※ APIでは「1 AVAX = 10^18 wei」で単位変換がされているため、 `formatEther`(or `parseEther`)を使用できます。

また、 `blockTimeStampToDate`はsolidity内の`block.timestamp`から、 フロントエンドで使用する`Date`への変換を行なっています。
`block.timestamp`は単位がミリ秒で、 `Date`は秒単位の時間を元に作成するので`* 1000`を行なっています。

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

`hooks`ディレクトリ内に`useWallet.ts`というファイルを作成し、 以下のコードを記述してください。

```ts
import { useCallback, useEffect, useState } from 'react';

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
      setCurrentAccount(accounts[0]); // 簡易実装のため, 配列の初めのアドレスを使用します。
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

ここでは、 ユーザがMetamaskを持っていることの確認とウォレットへの接続機能を実装します。

`connectWallet`はWebアプリがユーザのウォレットにアクセスすることを求める関数で、
この後の実装でUIにユーザのウォレット接続ボタンを用意し、 そのボタンとこの関数を連携します。
そのため外部で使用できるように返り値の中に含めています。

`checkIfWalletIsConnected`は既にユーザのウォレットとWebアプリが接続しているかを確認する関数で、

また、 それぞれの関数内で使用している`eth_requestAccounts`と`eth_accounts`は、空の配列または単一のアカウントアドレスを含む配列を返す特別なメソッドです。
ユーザーがウォレットに複数のアカウントを持っている場合を考慮して、 プログラムはユーザーの1つ目のアカウントアドレスを取得することにしています。

`hooks`に関するフォルダ構成はこのようになります。

```
client
└── hooks
    └── useWallet.ts
```

### 📁 `context`ディレクトリ

`client`ディレクトリ直下に`context`というディレクトリを作成しましょう。

`context`ディレクトリ内に`CurrentAccountProvider.tsx`というファイルを作成し、 以下のコードを記述してください。

```ts
import { createContext, ReactNode } from 'react';

import { useWallet } from '../hooks/useWallet';

const CurrentAccountContext = createContext<[string | undefined, () => void]>([
  '',
  () => {},
]);

export const CurrentAccountProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { currentAccount, connectWallet } = useWallet();

  return (
    <CurrentAccountContext.Provider value={[currentAccount, connectWallet]}>
      {children}
    </CurrentAccountContext.Provider>
  );
};

export default CurrentAccountContext;
```

ここでは、 コンテキストを用意しています。
コンテキストは複数のコンポーネント間を跨いで値を渡せるもので、 値にはstateも渡せます。

はじめに以下の部分で先ほど作成した`useWallet()`を使用してウォレット接続に関わるオブジェクトを取得しています。

```ts
const { currentAccount, connectWallet } = useWallet();
```

重要なのは以下です。
valueに、 取得したオブジェクトを渡します。

```ts
<CurrentAccountContext.Provider value={[currentAccount, connectWallet]}>
  {children}
</CurrentAccountContext.Provider>
```

するとこのコンポーネントの子となるコンポーネント(`children`)以下ではどのコンポーネントでもコンテキストからvalueを取得することができます。
複数のコンポーネント間でstateを共有できます。

```
client
└── context
    └── CurrentAccountProvider.tsx
```

🚀 `pages`ディレクトリのファイルになってしまいますが、 作成したコンテキストに関わるのでここで`pages/_app.tsx`を編集しましょう。

`_app.tsx`内に以下のコードを記述してください。

```tsx
import type { AppProps } from 'next/app';

import { CurrentAccountProvider } from '../context/CurrentAccountProvider';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CurrentAccountProvider>
      <Component {...pageProps} />
    </CurrentAccountProvider>
  );
}

export default MyApp;
```

`_app.tsx`ファイルは標準で全てのページの親コンポーネントとなります。

ここで`CurrentAccountProvider`を使用し、 全てのコンポーネントが`CurrentAccountProvider`の子コンポーネントとなります。

つまり本プロジェクトで作成する全てのコンポーネントで、 `currentAccount`の参照と`connectWallet`の実行ができます。

### 📁 `components`ディレクトリ

`client`ディレクトリ直下に`components`という名前のディレクトリを作成してください。
こちらにはコンポーネントを実装したファイルを保存していきます。

> 📓 コンポーネントとは
> UI（ユーザーインターフェイス）を形成する一つの部品のことです。
> コンポーネントはボタンのような小さなものから、ページ全体のような大きなものまであります。
> レゴブロックのようにコンポーネントのブロックで UI を作ることで、 機能の追加・削除などの変更を容易にすることができます。

📁 `Button`ディレクトリ

ここでは貼り付けるコード量が多いので、 [本プロジェクトの packages/client/components](https://github.com/unchain-dev/AVAX-Asset-Tokenization/tree/main/packages/client/components)を参照します。

`components`ディレクトリ内から`Button`ディレクトリをそのままコピーして貼り付けてください。
[本レポジトリ](https://github.com/unchain-dev/AVAX-Asset-Tokenization/tree/main)自体をローカルにクローンしてからコピーしたほうがやりやすいかもしれません。

`Button`に関するフォルダ構成はこのようになります。

```
client
└── components
    └── Button
        ├── ActionButton.module.css
        ├── ActionButton.tsx
        ├── LinkToPageButton.module.css
        └── LinkToPageButton.tsx
```

`ActionButton.tsx`、 `LinkToPageButton.tsx`はボタンのコンポーネントになります。

`~.module.css`はそれぞれのcssになります。

> 📓 `~.module.css`とは
> `module.css`を css ファイルの語尾に付けることで、 `CSSモジュール`という`Next.js`の仕組みを利用することができます。
> `CSSモジュール`はファイル内のクラス名を元にユニークなクラス名を生成してくれます。
> 内部で自動的に行ってくれるので私たちがユニークなクラス名を直接使用することがありませんが、
> クラス名の衝突を気にする必要がなくなります。
> 異なるファイルで同じ CSS クラス名を使用することができます。
> 詳しくは[こちら](https://nextjs.org/docs/basic-features/built-in-css-support)をご覧ください。

この後のコンポーネントを使用します。

📁 `Container`ディレクトリ

同じく[本プロジェクトの packages/client/components](https://github.com/unchain-dev/AVAX-Asset-Tokenization/tree/main/packages/client/components)を参照します。

`components`ディレクトリ内から`Container`ディレクトリをそのままコピーして貼り付けてください。

`Container`に関するフォルダ構成はこのようになります。

```
client
└── components
    └── Container
        ├── FarmerContainer.module.css
        ├── FarmerContainer.tsx
        ├── HomeContainer.module.css
        └── HomeContainer.tsx
```

`FarmerContainer.tsx`では農家が触るUIのベースとなるものが記載されています。
`activeTab`を変更することで表示する内容が`Tokenize` or `ViewBuyers`のどちらかに変更できるようになっております。

`HomeContainer.tsx`ではホームページのUIのベースとなるものが記載されています。
先ほど作成した`Button/LinkToPageButton`のボタンにそれぞれのページへのパスを渡しリンクするようにしています。
ページはこの後作成します。

📁 `Layout`ディレクトリ

同じく[本プロジェクトの packages/client/components](https://github.com/unchain-dev/AVAX-Asset-Tokenization/tree/main/packages/client/components)を参照します。

`components`ディレクトリ内から`Layout`ディレクトリをそのままコピーして貼り付けてください。

`Layout`に関するフォルダ構成はこのようになります。

```
client
└── components
    └── Layout
        ├── DefaultLayout.module.css
        └── DefaultLayout.tsx
```

`DefaultLayout.tsx`では全てのページのレイアウトとなるコンポーネントです。

はじめに`CurrentAccountContext`から`currentAccount`と`connectWallet`を取得しています。

`currentAccount`にユーザのアドレスが保存されていればUI画面右上にアドレスを表示し、 未定義なら`connectWallet`を実行するボタンを表示します。

📁 `Form`ディレクトリ

`components`ディレクトリ内に`Form`ディレクトリを作成してください。

`Form`ディレクトリ内の実装は後のセクションで実装するのでここで簡易実装をします。

以下のファイルを作成してください。

- `ListNftForm.tsx`
- `TokenizeForm.tsx`
- `ViewBuyersForm.tsx`

`ListNftForm.tsx`内に以下のコードを貼り付けてください。

```ts
export default function ListNftForm() {
  return <div>ListNftForm</div>;
}
```

`TokenizeForm.tsx`内に以下のコードを貼り付けてください。

```ts
export default function TokenizeForm() {
  return <div>TokenizeForm</div>;
}
```

`ViewBuyersForm.tsx`内に以下のコードを貼り付けてください。

```ts
export default function ViewBuyersForm() {
  return <div>ViewBuyersForm</div>;
}
```

`Form`に関するフォルダ構成はこのようになります。

```
client
└── components
    └── Form
        ├── ListNftForm.tsx
        ├── TokenizeForm.tsx
        └── ViewBuyersForm.tsx
```

### 📁 `pages`ディレクトリ

最後に`client`ディレクトリ直下の`pages`ディレクトリを編集していきます。

まず初めに`api`ディレクトリは今回使用しないのでディレクトリごと削除してください。

※ `_app.tsx`は既にコンテキストのところで編集しています。

`_app.tsx`以外のファイルに関して、 [こちら](https://github.com/unchain-tech/AVAX-Asset-Tokenization/tree/main/packages/client/pages)に以下の3つのファイルがあるのでコピーしてください。

- `BuyerPage.tsx`
- `FarmerPage.tsx`
- `index.tsx`

`pages`に関するフォルダ構成はこのようになります。

```
client
└── pages
    ├── BuyerPage.tsx
    ├── FarmerPage.tsx
    ├── _app.tsx
    └── index.tsx
```

`index.tsx`（ホームページ）・`BuyerPage.tsx`・`FarmerPage.tsx`はそれぞれ1つのページのコンポーネントです。

全てのページで先ほど作成した`DefaultLayout`を使用しているので同じレイアウトになります。

🖥️ 画面で確認しましょう

ターミナル上で以下のコマンドを実行してください！

```
yarn client dev
```

そしてブラウザで`http://localhost:3000 `へアクセスしてください。

以下のような画面が表示されれば成功です！

![](/public/images/AVAX-Asset-Tokenization/section-2/2_2_1.png)

画面右上の`Connect to wallet`ボタンを押下するとウォレットと接続することができます。
⚠️ この先ウォレットを接続する場合は、 ネットワークに`Fuji`を選択した状態で行ってください。

MetaMaskの承認が終わると、 `Connect to wallet`ボタンの部分があなたの接続しているウォレットのアドレスの表示に変更されます。

![](/public/images/AVAX-Asset-Tokenization/section-2/2_2_2.png)

`For Farmer`ボタンを押すとページが切り替わります。

![](/public/images/AVAX-Asset-Tokenization/section-2/2_2_3.png)

`Tokenize`と`ViewBuyers`ボタンを切り替えると表示も切り替わります。

![](/public/images/AVAX-Asset-Tokenization/section-2/2_2_5.png)

右下の`Back to home`を押すとホームページに戻ります。
`For Buyers`ボタンを押すとまたページが切り替わります。

![](/public/images/AVAX-Asset-Tokenization/section-2/2_2_4.png)

### 🌔 参考リンク

> [こちら](https://github.com/unchain-dev/AVAX-Asset-Tokenization)に本プロジェクトの完成形のレポジトリがあります。
> 期待通り動かない場合は参考にしてみてください。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#avalanche`で質問をしてください。

ヘルプをするときのフローが円滑になるので、 エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

フロントエンドのベースとなるコードが出来ました！
次のレッスンではコントラクトとフロントエンドを連携する作業に入ります！

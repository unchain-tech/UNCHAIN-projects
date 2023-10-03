### 🦊 MetaMask をダウンロードする

ウォレットをダウンロードしましょう。

このプロジェクトではMetaMaskを使用します。

- [こちら](https://MetaMask.io/download.html) からブラウザの拡張機能をダウンロードし、MetaMaskウォレットをあなたのブラウザに設定します。

> ✍️: MetaMask が必要な理由
> ユーザーが、スマートコントラクトを呼び出すとき、本人のアドレスと秘密鍵を備えたウォレットが必要となります。
> これは、認証作業のようなものです。

MetaMaskを設定できたら、Avalancheのテストネットワークを追加しましょう。

MetaMaskの上部のネットワークタブを開き、`Add Network`をクリックします。

![](/public/images/AVAX-Messenger/section-2/2_3_2.png)

開いた設定ページ内で以下の情報を入力して保存をクリックしましょう。

```
Network Name: Avalanche FUJI C-Chain
New RPC URL: https://api.avax-test.network/ext/bc/C/rpc
ChainID: 43113
Symbol: AVAX
Explorer: https://testnet.snowtrace.io/
```

![](/public/images/AVAX-Messenger/section-2/2_3_3.png)

登録が成功したらAvalancheのテストネットである`Avalanche Fuji C-Chain`が選択できるはずです。

![](/public/images/AVAX-Messenger/section-2/2_3_4.png)

### 🚰 `Faucet`を利用して`AVAX`をもらう

続いて、[Avalanche Faucet](https://faucet.avax.network/)で`AVAX`を取得します。

テストネットでのみ使用できる偽の`AVAX`です。

上記リンクへ移動して、あなたのウォレットのアドレスを入力してavaxを受け取ってください。
💁 アドレスはMetaMask上部のアカウント名の部分をクリックするとコピーができます。

### 🌅 `window.ethereum`を設定する

Webアプリケーション上で、ユーザーがブロックチェーンネットワークと通信するためには、Webアプリケーションはユーザーのウォレット情報を取得する必要があります。

これから、あなたのWebアプリケーションにウォレットを接続したユーザーに、スマートコントラクトを呼び出す権限を付与する機能を実装していきます。これは、Webサイトへの認証機能です。

`window.ethereum`はMetaMaskが`window`（JavaScriptにデフォルトで存在するグローバル変数）の直下に用意するオブジェクトでありAPIです。
このAPIを使用して、ウェブサイトはユーザーのイーサリアムアカウントを要求し、ユーザーが接続しているブロックチェーンからデータを読み取り、ユーザーがメッセージや取引に署名するよう求めることができます。

まずは`window.ethereum`を使用できるようtypescriptのコードを書きます。

### 📁 `utils`ディレクトリ

`client`へ移動し`utils`ディレクトリを作成してください。
その中に`ethereum.ts`というファイルを作成してください。

```
client
└── utils
    └── ethereum.ts
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
コード内の以下の部分で`window`に`ethereum`を追加しています。
`MetaMaskInpageProvider`は環境設定時にインストールした`@metamask/providers`から取得した`ethereum`の型定義です。

```ts
declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}
```

また、`getEthereum`関数を呼び出すと`window`から取り出した`ethereum`オブジェクトを取得できるようにしています。

### 📁 `hooks`ディレクトリ

つづいてユーザがMetamaskを持っていることの確認とウォレットへの接続機能を実装します。

既に作成している`hooks`ディレクトリ内に`useWallet.ts`というファイルを作成し、以下のコードを記述してください。

```ts
import { useEffect, useState } from 'react';

import { getEthereum } from '../utils/ethereum';

// useWalletの返すオブジェクトの型定義です。
type ReturnUseWallet = {
  currentAccount: string | undefined;
  connectWallet: () => void;
};

export const useWallet = (): ReturnUseWallet => {
  // ユーザアカウントのアドレスを格納するための状態変数を定義します。
  const [currentAccount, setCurrentAccount] = useState<string>();

  const ethereum = getEthereum();

  // ユーザのウォレットをwebアプリと接続します。
  const connectWallet = async () => {
    try {
      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }
      // ユーザーに対してウォレットへのアクセス許可を求めます。
      // eth_requestAccounts 関数を使用することで、MetaMask からユーザーにウォレットへのアクセスを許可するよう呼びかけることができます。
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      if (!Array.isArray(accounts)) return;
      // 許可されれば、ユーザーの最初のウォレットアドレスを currentAccount に格納します。
      console.log('Connected: ', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  // ユーザのウォレットとwebアプリが接続しているかを確認します。
  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
        return;
      } else {
        console.log('We have the ethereum object', ethereum);
      }
      // ユーザーのウォレットへアクセスが許可されているかどうかを確認します。
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
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    currentAccount,
    connectWallet,
  };
};
```

`useWallet`の処理を整理しましょう。

```ts
// ユーザアカウントのアドレスを格納するための状態変数を定義します。
const [currentAccount, setCurrentAccount] = useState<string>();

const ethereum = getEthereum();
```

はじめにユーザのウォレットアドレスを格納するための状態変数と`ethereum`を用意します。

```ts
// ユーザのウォレットをwebアプリと接続します。
const connectWallet = async () => {
  // ...
};

// ユーザのウォレットとwebアプリが接続しているかを確認します。
const checkIfWalletIsConnected = async () => {
  // ...
};

useEffect(() => {
  checkIfWalletIsConnected();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

return {
  currentAccount,
  connectWallet,
};
```

次に2つの関数を作成しました。

`connectWallet`はwebアプリがユーザのウォレットにアクセスすることを求める関数で、
この後の実装でUIにユーザのウォレット接続ボタンを用意し、そのボタンとこの関数を連携します。
そのため外部で使用できるように返り値の中に含めています。

`checkIfWalletIsConnected`は既にユーザのウォレットとwebアプリが接続しているかを確認する関数で、
`useEffect`を使用してwebアプリがユーザのウォレットを使用する際には初回レンダリング時に確認するようにしています。

> `eslint-disable-next-line react-hooks/exhaustive-deps`コメントについて
> `create-next-app`を実行した際に標準で`eslint`という静的解析ツールがインストールされています。
> `eslint-disable-next-line react-hooks/exhaustive-deps`は次の行を解析から外すことを指定するコメントです。
> 今回は useEffect の依存配列に関して、`eslint`のルールにそぐわないためそうしています。

また、それぞれの関数内で使用している`eth_requestAccounts`と`eth_accounts`は、空の配列または単一のアカウントアドレスを含む配列を返す特別なメソッドです。
ユーザーがウォレットに複数のアカウントを持っている場合を考慮して、プログラムはユーザーの1つ目のアカウントアドレスを取得することにしています。

### 📁 `layout`ディレクトリ

ウォレットを使用するページ（今回は全てのページがそうです）のためにレイアウトを用意しましょう！

既に作成した`layout`ディレクトリの中に`RequireWallet.module.css`と`RequireWallet.tsx`を作成してください。

`RequireWallet.module.css`の中に以下のコードを記述してください。

```css
.wallet {
  padding: 0 0 10px 0;
  border-bottom: 2px solid #eaeaea;
}

.wallet p {
  margin: 10px 0;
}

.title {
  font-size: 20px;
}
```

`RequireWallet.tsx`の中に以下のコードを記述してください。

```ts
import styles from './RequireWallet.module.css';

type Props = {
  children: React.ReactNode;
  currentAccount: string | undefined;
  connectWallet: () => void;
};

export default function RequireWallet({
  children,
  currentAccount,
  connectWallet,
}: Props) {
  return (
    <div>
      {currentAccount ? (
        <div>
          <div className={styles.wallet}>
            <p className={styles.title}>wallet: </p>
            <p>{currentAccount}</p>
          </div>
          {children}
        </div>
      ) : (
        <button className="connectWalletButton" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
    </div>
  );
}
```

引数として子コンポーネントと`currentAccount`、`connectWallet`を受け取っています。
`currentAccount`（ユーザのウォレットアドレス）がまだ格納されていない場合は`Connect Wallet`というボタンを表示し、`connectWallet`関数と連携しています。

### 📁 `pages`ディレクトリ

最後に、これまでに作った`useWallet`フックと`RequireWallet`レイアウトを各ページで使用します。

`pages`ディレクトリ内の各ページを以下の実装に変更してください。

`index.tsx`

```ts
import type { NextPage } from 'next';
import Link from 'next/link';

import Layout from '../components/layout/Layout';
import RequireWallet from '../components/layout/RequireWallet';
import { useWallet } from '../hooks/useWallet';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const { currentAccount, connectWallet } = useWallet();

  return (
    <Layout home>
      <RequireWallet
        currentAccount={currentAccount}
        connectWallet={connectWallet}
      >
        <div className={styles.container}>
          <main className={styles.main}>
            <h1 className={styles.title}>Welcome to Messenger 📫</h1>
            <div className={styles.card}>
              <Link href="/message/SendMessagePage">
                <h2>send &rarr;</h2>
              </Link>
              <p>send messages and avax to other accounts</p>
            </div>

            <div className={styles.card}>
              <Link href="/message/ConfirmMessagePage">
                <h2>check &rarr;</h2>
              </Link>
              <p>Check messages from other accounts</p>
            </div>
          </main>
        </div>
      </RequireWallet>
    </Layout>
  );
};

export default Home;
```

`ConfirmMessagePage.tsx`

```ts
import { BigNumber } from 'ethers';

import MessageCard from '../../components/card/MessageCard';
import Layout from '../../components/layout/Layout';
import RequireWallet from '../../components/layout/RequireWallet';
import { Message } from '../../hooks/useMessengerContract';
import { useWallet } from '../../hooks/useWallet';

export default function ConfirmMessagePage() {
  const { currentAccount, connectWallet } = useWallet();

  const message: Message = {
    depositInWei: BigNumber.from('1000000000000000000'),
    timestamp: new Date(1),
    text: 'message',
    isPending: true,
    sender: '0x~',
    receiver: '0x~',
  };
  let ownMessages: Message[] = [message, message];

  return (
    <Layout>
      <RequireWallet
        currentAccount={currentAccount}
        connectWallet={connectWallet}
      >
        {ownMessages.map((message, index) => {
          return (
            <div key={index}>
              <MessageCard
                message={message}
                onClickAccept={() => {}}
                onClickDeny={() => {}}
              />
            </div>
          );
        })}
      </RequireWallet>
    </Layout>
  );
}
```

`SendMessagePage.tsx`

```ts
import SendMessageForm from '../../components/form/SendMessageForm';
import Layout from '../../components/layout/Layout';
import RequireWallet from '../../components/layout/RequireWallet';
import { useWallet } from '../../hooks/useWallet';

export default function SendMessagePage() {
  const { currentAccount, connectWallet } = useWallet();

  return (
    <Layout>
      <RequireWallet
        currentAccount={currentAccount}
        connectWallet={connectWallet}
      >
        <SendMessageForm
          sendMessage={(
            text: string,
            receiver: string,
            tokenInEther: string
          ) => {}}
        />
      </RequireWallet>
    </Layout>
  );
}
```

それぞれのページでは同じ実装を追加しています。
`useWallet`から`currentAccount`、`connectWallet`を取得し、`RequireWallet`レイアウトに渡しています。

### 🌐 ウォレットコネクトのテストを実行する

上記のコードをすべて反映させたら、ターミナル上で下記を実行しましょう。

```
yarn client dev
```

ローカルサーバーでWebサイトを立ち上げたら、MetaMaskのプラグインをクリックし、あなたのウォレットアドレスの接続状況を確認しましょう。

ウォレットを接続していない状態では以下のような画面が表示されるはずです。

![](/public/images/AVAX-Messenger/section-2/2_3_1.png)

`Connect Wallet`ボタンをクリックし、MetaMaskを接続してください。
⚠️ ネットワークに`Fuji`を選択した状態で行ってください。

下図のようにMetaMaskからウォレット接続を求められますので、承認してください。

![](/public/images/AVAX-Messenger/section-2/2_3_5.png)

MetaMaskの承認が終わると、画面が切り替わり、画面上部にあなたの接続しているウォレットのアドレスが表示されます。

![](/public/images/AVAX-Messenger/section-2/2_3_6.png)

### 🌔 参考リンク

> [こちら](https://github.com/unchain-tech/AVAX-Messenger)に本プロジェクトの完成形のレポジトリがあります。
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

ウォレット接続機能が完成したら、次のレッスンに進みましょう 🎉

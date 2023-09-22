### 🤖 ローカル開発環境を設定する

※ GitHubアカウントの初期設定がお済みでない方は、アカウント設定を行ってからお進みください。

まず、 [この GitHub リンク](https://github.com/unchain-tech/Solana-dApp) にアクセスして、ページの右上にある[Fork]ボタンを押してください。

![](/public/images/Solana-dApp/section-1/1_1_4.png)
![](/public/images/Solana-dApp/section-1/1_1_5.png)

このリポジトリをフォークすると、自分のGitHubに同一のリポジトリがコピーされます。

次に、新しくフォークされたリポジトリをローカルに保存します。

`Code`ボタンをクリックして、コピーしたリポジトリのリンクをコピーしてください。

![github code button](/public/images/Solana-dApp/section-1/1_1_6.png)

最後に、ターミナルで`cd`コマンドを実行してプロジェクトが存在するディレクトリまで移動し、次のコマンドを実行します。

※ `YOUR_FORKED_LINK`に先ほどコピーしたリポジトリのリンクを張り付けましょう。

```
git clone YOUR_FORKED_LINK
```

無事に複製されたらローカル開発環境の準備は完了です。


### 🔌 Phantom Wallet をインストールする

このプロジェクトでは、[Phantom Wallet](https://phantom.app/)という、Solana専用のウォレットを使用します。

まずはブラウザに拡張機能をダウンロードしてPhantom Walletをセットアップしてください。

Phantom Walletは **Chrome**、 **Brave**、 **Firefox**、および **Edge** をサポートしています。

Chromeの方は[こちら](https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa)からPhantom Walletをインストールすることがきます。

インストールが完了したら、Phantom WalletのネットワークをDevnetに変更しておきましょう。

※ 今回はDevnetを使用するので、ウォレットもDevnetに変更する必要があります。

- 「設定」→「デベロッパー設定」→「ネットワークの変更」→「Devnet」から変更できます。

![phantom wallet settings](/public/images/Solana-dApp/section-1/1_1_2.png)

※ 本プロジェクトではBraveとChromeでのみ動作が確認できます。


### 👻 Solana オブジェクトを設定する

WebアプリケーションがSolanaブロックチェーンと通信するためには、WebアプリケーションとPhantom Walletを接続する必要があります。

これは、通常のWebサイトへのログインと同じく、Solanaブロックチェーンと通信するために必要な **認証** のようなものです。

それでは、まずは`src/App.js`ファイルを開き、 `App.js`を以下のとおり変更しましょう( `App.js`はアプリケーションのメインエントリポイントとなるファイルです)。

```jsx
// Reactを使用します。
import React, { useEffect } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// 定数を宣言します。
const TWITTER_HANDLE = 'あなたのTwitterハンドル';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

 /*
  * Phantom Walletが接続されているかどうかを確認するための関数です。
  */
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana && solana.isPhantom) {
        console.log('Phantom wallet found!');
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  /*
   * 初回のレンダリング時にのみ、Phantom Walletが接続されているかどうか確認します。
   */
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
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">View your GIF collection ✨</p>
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

`App.js`を分解して説明していきます。

```javascript
const checkIfWalletIsConnected = async () => {
  try {
    const { solana } = window;

    if (solana && solana.isPhantom) {
      console.log("Phantom wallet found!");
    } else {
      alert("Solana object not found! Get a Phantom Wallet 👻");
    }
  } catch (error) {
    console.error(error);
  }
};
```

ブラウザにPhantom Walletがインストールされている場合は、[DOM](https://qiita.com/sasakiki/items/91dcc8b50d7a61ce98bc) の`window`オブジェクトにPhantom Walletの`solana`という名前の特別なオブジェクトが自動的に代入されます。

`checkIfWalletIsConnected`関数では、`window`オブジェクトをチェックして`solana`オブジェクトが存在しているか、また、それがPhantom Walletであるかどうかを確認し、存在しない場合はPhantom Walletをダウンロードするようにアラートを表示します。

```javascript
useEffect(() => {
  const onLoad = async () => {
    await checkIfWalletIsConnected();
  };
  window.addEventListener("load", onLoad);
  return () => window.removeEventListener("load", onLoad);
}, []);
```

Reactでは、2番目のパラメータ`[]`が空の場合、コンポーネントマウント時に`useEffect`のhookが1度だけ呼び出されます。

この機能を実装することで、WebアプリケーションにアクセスしたタイミングでPhantom Walletがインストールされているかどうかの確認ができます。

これは **非常に重要** な機能です。

※ Twitterハンドルを更新するのをお忘れなく!

```jsx
const TWITTER_HANDLE = "あなたのTwitterハンドル";
```


### 🔒 ユーザーのアカウントにアクセスする

一度、ブラウザでインタフェースを確認してみましょう。

1\. ターミナルを開き、`cd`でプロジェクトのルートディレクトリまで移動します。

2\. `yarn install`を実行します。

3\. `yarn client start`を実行します。

これらを実行すると、ローカルサーバーでWebアプリケーションが立ち上がり、ブラウザのコンソール上に`Phantom Wallet found!`が表示されるはずです。

※ コンソールを表示するには、ブラウザ上で`右クリック` -> `検証` -> `コンソール`を開きます。

![browser console](/public/images/Solana-dApp/section-1/1_1_3.png)

次に、WebアプリケーションがユーザーのPhantom Walletにアクセスすることが **許可** されているかどうかを確認します。

Phantom Walletは、すべてのWebアプリケーションにウォレット情報を提供する訳ではなく、ユーザーが許可したWebアプリケーションだけに情報を提供します。

Webアプリケーションでは、ユーザーがWebアプリケーションに対してウォレットを使用する許可を与えているかどうかを一番最初に確認することが必要となります。

これはユーザーがサービスに「ログイン」しているかどうかを確認するようなものです。

それでは、`checkIfWalletIsConnected`関数を以下のように修正してください。

```javascript
const checkIfWalletIsConnected = async () => {
  try {
    const { solana } = window;

    if (solana) {
      if (solana.isPhantom) {
        console.log('Phantom wallet found!');

        /*
         * ユーザーのウォレットに直接接続する機能を提供します。
         */
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
```

`connect`を呼び出すだけで、Webアプリケーションがウォレットへのアクセスを許可されていることをPhantom Walletに通知できます。

`onlyIfTrusted`プロパティは、ユーザーがすでにウォレットをアプリケーションに接続している場合`true`になります。

このように実装することで、一度でもアクセスを許可すれば、再度許可しなくても自動的にWebアプリケーションがSolanaプログラムの関数にアクセスすることができるようになります。

詳細は[fantom の公式ドキュメント](https://docs.phantom.app/integrating/establishing-a-connection#eagerly-connecting)をご覧ください。

ターミナルを閉じるときは、以下のコマンドが使えます ✍️

- Mac: `ctrl + c`
- Windows: `ctrl + shift + w`


### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#solana`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンに進んで、開発を進めましょう 🎉

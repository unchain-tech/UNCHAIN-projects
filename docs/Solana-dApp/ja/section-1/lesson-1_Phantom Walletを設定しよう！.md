### 🍽 Git リポジトリをあなたの GitHub にフォークする

まだGitHubのアカウントをお持ちでない方は、[こちら](https://qiita.com/okumurakengo/items/848f7177765cf25fcde0) の手順に沿ってアカウントを作成してください。

GitHubのアカウントをお持ちの方は、下記の手順に沿ってプロジェクトの基盤となるリポジトリをあなたのGitHubに[フォーク](https://denno-sekai.com/github-fork/)しましょう。

1. [こちら](https://github.com/unchain-tech/Solana-dApp)からunchain-tech/Solana-dAppリポジトリにアクセスをして、ページ右上の`Fork`ボタンをクリックします。

![](/public/images/ETH-NFT-Collection/section-3/3_1_3.png)

2. Create a new forkページが開くので、「Copy the `main` branch only」という項目に**チェックが入っていることを確認します**。

![](/public/images/ETH-NFT-Collection/section-3/3_1_4.png)

設定が完了したら`Create fork`ボタンをクリックします。あなたのGitHubアカウントに`Solana-dApp`リポジトリのフォークが作成されたことを確認してください。

それでは、フォークしたリポジトリをローカル環境にクローンしましょう。

まず、下図のように、`Code`ボタンをクリックして`SSH`を選択し、Gitリンクをコピーしましょう。

![](/public/images/ETH-NFT-Collection/section-3/3_1_1.png)

ターミナル上で作業を行う任意のディレクトリに移動し、先ほどコピーしたリンクを用いて下記を実行してください。

```bash
git clone コピーした_github_リンク
```

ではプロジェクトに必要なパッケージをインストールするために以下のコマンドを実行しましょう。

```bash
yarn install
```

無事に複製されたらローカル開発環境の準備は完了です。

### 🔍 フォルダ構成を確認する

実装に入る前に、フォルダ構成を確認しておきましょう。クローンしたスタータープロジェクトは下記のようになっているはずです。

```bash
Solana-dApp
├── .git/
├── .gitignore
├── LICENSE
├── README.md
├── package.json
├── packages/
│   ├── client/
│   └── contract/
└── yarn.lock
```

スタータープロジェクトは、モノレポ構成となっています。モノレポとは、コントラクトとクライアント（またはその他構成要素）の全コードをまとめて1つのリポジトリで管理する方法です。

packagesディレクトリの中には、`client`と`contract`という2つのディレクトリがあります。

`package.json`ファイルの内容を確認してみましょう。

モノレポを作成するにあたり、パッケージマネージャーの機能である[Workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/)を利用しています。

**workspaces**の定義をしている部分は以下になります。

```json
// package.json
"workspaces": {
  "packages": [
    "packages/*"
  ]
},
```

この機能により、yarn installを一度だけ実行すれば、すべてのパッケージ（今回はコントラクトのパッケージとクライアントのパッケージ）を一度にインストールできるようになります。

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

それでは、まずは`packages/client/src/App.js`ファイルを開き、 `App.js`を以下のとおり変更しましょう( `App.js`はアプリケーションのメインエントリポイントとなるファイルです)。

```jsx
// App.js

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
// App.js

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
// App.js

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

2\. `yarn client start`を実行します。

これらを実行すると、ローカルサーバーでWebアプリケーションが立ち上がり、ブラウザのコンソール上に`Phantom Wallet found!`が表示されるはずです。

※ コンソールを表示するには、ブラウザ上で`右クリック` -> `検証` -> `コンソール`を開きます。

![browser console](/public/images/Solana-dApp/section-1/1_1_3.png)

次に、WebアプリケーションがユーザーのPhantom Walletにアクセスすることが **許可** されているかどうかを確認します。

Phantom Walletは、すべてのWebアプリケーションにウォレット情報を提供する訳ではなく、ユーザーが許可したWebアプリケーションだけに情報を提供します。

Webアプリケーションでは、ユーザーがWebアプリケーションに対してウォレットを使用する許可を与えているかどうかを一番最初に確認することが必要となります。

これはユーザーがサービスに「ログイン」しているかどうかを確認するようなものです。

それでは、`checkIfWalletIsConnected`関数を以下のように修正してください。

```javascript
// App.js

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

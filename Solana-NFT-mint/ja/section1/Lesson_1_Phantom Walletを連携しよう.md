###  🤖ローカル開発環境を設定する
※Githubアカウントの初期設定がお済みでない方は、アカウント設定を行なってから先へお進みください。

まず、 [このGitHubリンク](https://github.com/shiftbase-xyz/nft-drop-starter-project)にアクセスして、ページの右上にある[Fork]ボタンを押してください。

このレポジトリをフォークすると、自分のGithubに同一のレポジトリがコピーされます。

次に新しくフォークされたリポジトリをローカルに保存します。「Code」ボタンをクリックして、そのリンクをコピーしてください。

![](/public/images/Solana-NFT-mint/section1/1_1_1.png)


最後に、ターミナルに移動し、`cd` コマンドでプロジェクトが存在するディレクトリまでいき、次のコマンドを実行します。

```txt
git clone YOUR_FORKED_LINK
```

これでローカル開発環境の準備は完了です。


###  🔌Phantom Walletを使用してウォレット接続ボタンを作成する

このプロジェクトでは、[ Phantom Wallet ](https://phantom.app/)という、SolanaのNFT取扱に優れたウォレットを使用します。

まずは拡張機能をダウンロードしてPhantom Walletをセットアップしてください。Phantom Walletは **Chrome**、  **Brave**、  **Firefox**、および **Edge**をサポートしています。
Chromeの方は[Chrome ウェブストア](https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa)からインストールしてください。
※本プロジェクトではBraveとChromeでのみ動作確認しています。

### **👻Solanaオブジェクトを使用します。**

ユーザーのPhantom Walletを、作成するwebアプリと接続する必要があります。<br>

エディターより、`src/App.js`ファイルを開いてください。これはアプリのメインのエントリーポイントになるファイルです。

 Phantom Wallet拡張機能がインストールされている場合は、`window`オブジェクトに` solana`という名前の特別なオブジェクトが自動的に代入されます。ミントする前に、`solana`が代入されているか確認する必要があります。存在しない場合はダウンロードするようにユーザーに指示しましょう。

`App.js`を下記の通り変更します。
```jsx
import React, { useEffect } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';

// 定数の宣言
const TWITTER_HANDLE = '_ta_ka_sea0';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // Actions

  /*
  * 関数を宣言します
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
   * コンポーネントが最初にマウントされたら、Phantom Walletが
   * 接続されているかどうかを確認しましょう。
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
          <p className="header">🍭 Candy Drop</p>
          <p className="sub-text">NFT drop machine with fair mint</p>
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

`App.js`を分解して説明します。

```jsx
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
```

 関数`checkIfWalletIsConnected`は、DOM の`window`オブジェクトをチェックして 、Phantom Walletが` solana` オブジェクトを挿入したかどうかを確認します。`solana`オブジェクトが存在しているか、またそれがPhantom Walletであるかどうかを確認しています。


```jsx
useEffect(() => {
  const onLoad = async () => {
    await checkIfWalletIsConnected();
  };
  window.addEventListener('load', onLoad);
  return () => window.removeEventListener('load', onLoad);
}, []);
```

最後に、これを呼び出す必要があります。

Reactでは、   2番目のパラメーター(  `[]`)が空の場合、コンポーネントをマウント時に`useEffect`hookが1回呼び出されます。
これで、私たちのwebアプリにアクセスするとすぐに、Phantom Walletがインストールされているかどうかを確認できます。これは  **非常に重要**な機能です。


### **🔒ユーザーのアカウントにアクセスします。**

一度、ブラウザでインターフェースを確認してみましょう。
1. ターミナルを開き、`cd`で`app` フォルダまで移動します。
2. `npm install` を実行します。
3.  `npm run start` を実行します。

これを実行すると、Webアプリのコンソールに*Phantom Wallet found!*という行が表示されるはずです。

![無題](/public/images/Solana-NFT-mint/section1/1_1_2.png)

次に、  ユーザーのウォレットにアクセスすることが**許可**されているか確認する必要があります。アクセスが許可されていると、Solanaプログラムの関数にアクセスできるようになります。

Phantom Walletは、全てのWebアプリにウォレット情報を提供する訳ではなく、許可したウェブアプリだけに許可します。


webアプリで最初に行う必要があるのは、ユーザーがwebアプリでウォレットを使用する許可を与えているか確認することです。これはユーザーが「ログイン」しているかどうかを確認するようなものです。
ここで  `checkIfWalletIsConnected` 関数にもう1行追加するこ必要があります。以下のコードを修正してください。

```jsx
const checkIfWalletIsConnected = async () => {
  try {
    const { solana } = window;

    if (solana && solana.isPhantom) {
        console.log('Phantom wallet found!');

        /*
         * "solana"オブジェクトは、ユーザーのウォレットに直接
         * 接続できる機能を提供しています。
         * 下記からコードを修正してください。
         */
        const response = await solana.connect({ onlyIfTrusted: true });
        console.log(
          'Connected with Public Key:',
          response.publicKey.toString()
        );
    } else {
      alert('Solana object not found! Get a Phantom Wallet 👻');
    }
  } catch (error) {
    console.error(error);
  }
};
```

「connect」を呼び出すだけで、Webアプリがそのウォレットに関する情報へのアクセスを許可されていることをPhantom Walletに通知できます。

`onlyIfTrusted` プロパティは、ユーザーがすでにウォレットをアプリに接続している場合、trueになります。
別の接続ポップアップを表示せずに、すぐにデータをpullします。詳細は[fantomの公式ドキュメント](https://docs.phantom.app/integrating/establishing-a-connection#eagerly-connecting)をご覧ください。

以上です！

 現時点では、コンソールのログに「Phantom Walletが見つかりました!」と表示されるだけです。

もしコンソールに「UserRejectedRequest」エラーが表示されても心配しないでください。現段階のみの問題で、`connect`メソッド内に` onlyIfTrusted：true`パラメータを追加したためです。

`onlyIfTrusted`パラメータが` true`に設定された `connect` メソッドは 、ユーザーがウォレットとWebアプリ間の接続をすでに承認している 場合にのみ実行 されます。次のセクションで修正します。

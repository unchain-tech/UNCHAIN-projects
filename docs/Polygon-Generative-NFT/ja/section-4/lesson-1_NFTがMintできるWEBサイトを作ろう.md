### 🪄 Web サイトを構築する

これから、オリジナルのWebサイトを構築し、ユーザーがWebサイトから直接NFTをMintできる機能を実装していきます。

- ユーザーがMetaMaskウォレットをWebサイトに接続できる

- ユーザーがコントラクト関数を呼び出し、支払いを行い、コレクションからNFTを作成できるようにする

このレッスンを終了すると、Reactで構築されたdAppが完成します。

また、汎用的なdAppのフロントエンドを構築するために必要な基礎知識も習得できます。

では下記に、今回のプロジェクトのために用意したテンプレートを紹介します。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="Collectible NFT on Polygon✨"
      content="Solidity + Alchemy + Polygon + React + Vercel = Generative Art NFT を Mint しよう💫"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>Collectible NFT on Polygon</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

次に、`packages/client/src`フォルダに移動して、`App.test.js` , `logo.svg` , `setupTests.js`ファイルを削除してください。

このレッスンでは、これらのファイルは必要ありません。

次に、`src`フォルダの中にある`App.js`ファイルを開き、内容を、以下の定型文に置き換えます。

```javascript
import './App.css';

function App() {
  return <h1>Hello World</h1>;
}

export default App;
```

`src/App.css`の内容もすべて削除してください。

ただし、このファイル自体は削除しないでください。

後で、このデモプロジェクトに使用する基本的なCSSスタイルを提供します。

`localhost://3000`に戻ると、`Hello World`という画面が表示されるはずです。

これで、Reactプロジェクトのセットアップが完了しました。

### 📂 コントラクトの ABI とアドレスを取得する

フロントエンドがスマートコントラクトに接続し、通信できるようにするためには、コントラクトのABIとアドレスが必要です。

ABI（またはApplication Binary Interface）は、コントラクトのコンパイル時に自動的に生成されるJSONファイルです。

デプロイ先のブロックチェーンは、スマートコントラクトをバイトコードの形で保存しています。

そのうえで関数を呼び出し、正しいパラメータを渡し戻り値を解析するためには、関数とコントラクトに関する詳細（名前、引数、型など）をフロントエンドに指定する必要があります。

これがまさにABIファイルの役割です。

`packages/contract/artifacts/contracts/NFTCollectible.sol/NFTCollectible.json`をVS Codeで開き中身を確認してみましょう。

![](/public/images/Polygon-Generative-NFT/section-4/4_1_2.png)

`NFTCollectible.json`に記載されているすべてのコードが、ABIファイルです。

まず、JSONファイルをReactプロジェクトにコピーする必要があります。

`packages/client/src`フォルダに`contracts`という新しいフォルダを作成し、`NFTCollectible.json`ファイルをコピーして貼り付けましょう。

次に、前回のレッスンでPolygonテストネットにデプロイしたスマートコントラクトのアドレスを取得してください。

前回のレッスンで私が使用したコントラクトのアドレスは`0xF899DeB963208560a7c667FA78376ecaFF684b8E`です。

このレッスンでも、このコントラクトを使用していきます。

それでは、コントラクトABIをインポートして、`App.js`ファイルにコントラクトアドレスを定義していきましょう。

```javascript
import './App.css';
import contract from './contracts/NFTCollectible.json';

const contractAddress =
  'あなたのコントラクトアドレスをこちらに貼り付けてください';
const abi = contract.abi;

function App() {
  return <h1>Hello World</h1>;
}

export default App;
```

### 🛠 HTML、CSS、JS を設定する

今回作成するWebサイトは、シンプルなものになります。

あるのは見出しと`Connect Wallet`ボタンだけです。

ウォレットが接続されると、`Connect Wallet`ボタンが`Mint NFT`ボタンに置き換わります。

個別のコンポーネントファイルを作成する必要はありません。

代わりに、すべてのHTMLとロジックを`App.js`に、すべてのCSSを`App.css`に記述します。

以下の内容を、`App.js`ファイルにコピーしてください。

```javascript
import { useEffect } from 'react';

import './App.css';
import contract from './contracts/NFTCollectible.json';

const contractAddress = 'あなたのコントラクトアドレスを貼り付けましょう';
const abi = contract.abi;

function App() {
  const checkWalletIsConnected = () => {};

  const connectWalletHandler = () => {};

  const mintNftHandler = () => {};

  const connectWalletButton = () => {
    return (
      <button
        onClick={connectWalletHandler}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    );
  };

  const mintNftButton = () => {
    return (
      <button onClick={mintNftHandler} className="cta-button mint-nft-button">
        Mint NFT
      </button>
    );
  };

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  return (
    <div className="main-app">
      <h1>Scrappy Squirrels Tutorial</h1>
      <div>{connectWalletButton()}</div>
    </div>
  );
}

export default App;
```

`App.js`の5行目であなたのコントラクトアドレスを設定してください。

```javascript
const contractAddress = 'あなたのコントラクトアドレスを貼り付けましょう';
```

現時点では、関数をいくつか定義していることに注意してください。後で、その目的を説明し、ロジックを組み込んでいく予定です。

また、Webアプリケーションのために、CSSも用意しました。

以下を`App.css`ファイルにコピーしてください。

```css
.main-app {
    text-align: center;
    margin: 100px;
}

.cta-button {
    padding: 15px;
    border: none;
    border-radius: 12px;
    min-width: 250px;
    color: white;
    font-size: 18px;
    cursor: pointer;
}

.connect-wallet-button {
    background: rgb(32, 129, 226);
}

.mint-nft-button {
    background: orange;
}
```

あなたのWebサイトは、このように表示されるはずです。

![](/public/images/Polygon-Generative-NFT/section-4/4_1_3.png)

CSSスタイルや静的要素（画像、ヘッダ、フッタ、ソーシャルメディアリンクなど）を追加して、Webサイトの外観を自由にカスタマイズしてください。

ここまで、プロジェクトの基礎となるブロックはほぼそろいました。

これで、ユーザーがウォレットをWebサイトに接続する準備が整いました。

### 🦊 MetaMask ウォレットとの接続

ユーザーがントラクトを呼び出すためには、自分のウォレットをWebサイトに接続する必要があります。

ウォレット接続は、ユーザーがNFTをMintし、ガス代と販売価格を支払うことを可能にします。

このレッスンでは、MetaMaskウォレットとMetaMask APIのみを使用します。

まず、ユーザーのブラウザに、MetaMaskウォレットが存在するか確認していきます。

ユーザーはMetaMaskウォレットを持っていなければ、Webサイト上でNFTをMintできません。

MetaMaskウォレットが存在するかどうかを確認するロジックを、`checkWalletIsConnected`関数に入力しましょう。

```javascript
const checkWalletIsConnected = async () => {
  const { ethereum } = window;

  if (!ethereum) {
    console.log('Make sure you have MetaMask installed!');
    return;
  } else {
    console.log("Wallet exists! We're ready to go!");
  }
};
```

なお、`App.js`がロードされる際に、MetaMaskの存在を確認する`useEffect`フックも定義しています。

アプリケーションの`localhost`ページでConsoleを開いてください。

- ステップ: Webページ上で右クリック → `Inspect` → `Console`

MetaMaskがインストールされていれば、`Wallet exists! We’re ready to go!`というメッセージがConsoleに表示されているはずです。

![](/public/images/Polygon-Generative-NFT/section-4/4_1_4.png)

MetaMaskエクステンションをインストールしたからといって、アクセスしたすべてのWebサイトにMetaMaskが自動的に接続されるわけではありません。

MetaMaskがユーザーにウォレットを接続するように促す必要があるのです。

そこで登場するのが`Connect Wallet`機能です。

これはweb3のログインボタンに相当します。

このログインボタンは、ユーザーがフロントエンドを通じてブロックチェーンネットワークに接続し、コントラクトを呼び出すことを可能にします。

MetaMaskは`window.ethereum.request`メソッドでこのプロセスシンプルに実行します。

まず、ユーザーのウォレットアドレスを追跡するために、`App()`で`useState`フックを使って変数を定義しましょう。

まず、Reactから`useState`をインポートするために、`App.js`ファイルの1行目`import from 'react'`の中身を下記のように更新してください。

```javascript
import { useEffect, useState } from 'react';
```

それから、下記を`checkWalletIsConnected`関数の真上に追加してください。

```javascript
const [currentAccount, setCurrentAccount] = useState(null);
```

`currentAccount`には、ユーザーの公開ウォレットアドレスが格納されます。

`setCurrentAccount`は、`currentAccount`の状態を更新する関数です。

`useState(null)`で`currentAccount`と`setCurrentAccount`を初期化しています。

次に、`connectWalletHandler`関数を定義しましょう。

```javascript
const connectWalletHandler = async () => {
  const { ethereum } = window;

  if (!ethereum) {
    alert('Please install MetaMask!');
  }

  try {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    console.log('Found an account! Address: ', accounts[0]);
    setCurrentAccount(accounts[0]);
  } catch (err) {
    console.log(err);
  }
};
```

`connectWalletHandler`関数が何をするのか、簡単に説明しましょう。

まず、MetaMaskがインストールされているかどうかをチェックします。

インストールされていない場合は、MetaMaskのインストールを促すポップアップが表示されます。

```javascript
const { ethereum } = window;

if (!ethereum) {
  alert('Please install MetaMask!');
}
```

MetaMaskにユーザーのウォレット接続を促し、アドレスの取得を試みます。

```javascript
const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
console.log('Found an account! Address: ', accounts[0]);
```

ユーザーがWebサイトとの接続に同意すると、最初に利用可能なウォレットアドレスを取得し、それを`currentAccount`変数の値として設定します。

```javascript
setCurrentAccount(accounts[0]);
```

何か問題が発生した場合（ユーザーが接続を拒否したなど）、処理を中断してコンソールにエラーメッセージが表示されます。

```javascript
} catch (err) {
	console.log(err)
}
```

### 🌐 ウォレット接続のテストを実行する

上記のコードをすべて`App.js`に反映させたら、MetaMaskのプラグインをクリックし、あなたのウォレットアドレスの接続状況を確認しましょう。

もし、下図のように`Connected`と表示されている場合は、`Connected`の文字をクリックします。

![](/public/images/Polygon-Generative-NFT/section-4/4_1_5.png)

そこで、Webサイトとあなたのウォレットアドレスの接続を一度解除します。

- `Disconnect this account`を選択してください。

![](/public/images/Polygon-Generative-NFT/section-4/4_1_6.png)

次にローカルサーバーにホストされているあなたのWebサイトをリフレッシュして、`Connect Wallet`ボタンを押してください。

MetaMaskがWebサイトとの接続を促してきますので、同意しましょう。

下記のように、Consoleにあなたのパブリックウォレットアドレスが出力されていれば、ウォレット接続のテストは成功です。

![](/public/images/Polygon-Generative-NFT/section-4/4_1_7.png)

ウォレットが接続されたら、`Connect Wallet`ボタンを`Mint NFT`ボタンに置き換えていきましょう。

`App.js`の戻り値で、`Connect Wallet`ボタンのレンダリングを条件付きレンダリングに置き換えてみましょう。

`return ()`の中身を下記のように変更してください。

```javascript
return (
  <div className="main-app">
    <h1>Scrappy Squirrels Tutorial</h1>
    <div>{currentAccount ? mintNftButton() : connectWalletButton()}</div>
  </div>
);
```

これで、私たちのWebサイトはこのようになります。

![](/public/images/Polygon-Generative-NFT/section-4/4_1_8.png)

ページを更新して、MetaMaskエクステンションを確認してみましょう。

MetaMaskはまだWebサイトに接続されていることを伝えていますが、WebサイトにはまだConnect Walletボタンが表示されていることがわかります。

![](/public/images/Polygon-Generative-NFT/section-4/4_1_9.png)

Reactに慣れている人なら、なぜこのようなことが起こるのかお分かりでしょう。

結局のところ、`connectWallet`関数の中だけで`setCurrentAccount`を設定しているのです。

実際には、`App.js`がロードされるたびに（つまり更新するたびに）、ユーザーのウォレットがWebサイトに接続されているか確認する必要があります。

そこで、`checkWalletIsConnected`関数を拡張して、Webサイトがロードされると同時にアカウントをチェックし、ウォレットがすでに接続されている場合は`currentAccount`を設定するようにしましょう。

下記のように、`checkWalletIsConnected`関数を更新してください。

```javascript
const checkWalletIsConnected = async () => {
  const { ethereum } = window;

  if (!ethereum) {
    console.log('Make sure you have MetaMask installed!');
    return;
  } else {
    console.log("Wallet exists! We're ready to go!");
  }

  const accounts = await ethereum.request({ method: 'eth_accounts' });

  if (accounts.length !== 0) {
    const account = accounts[0];
    console.log('Found an authorized account: ', account);
    setCurrentAccount(account);
  } else {
    console.log('No authorized account found');
  }
};
```

この`checkWalletIsConnected`関数は、[非同期](https://zenn.dev/tentel/articles/8146043d1101b5ea873d)(`async`)です。

この関数が何をするのか、簡単に触れておきましょう。

- MetaMaskがインストールされているかどうかをチェックし、結果をコンソールに出力します。

  ```javascript

  if (!ethereum) {
    console.log('Make sure you have MetaMask installed!');
    return;
  } else {
    console.log("Wallet exists! We're ready to go!");
  }
  ```

- Webサイトに接続中のアカウントに対してMetaMaskのリクエストを試みます。

```javascript
const accounts = await ethereum.request({ method: 'eth_accounts' });
```

- MetaMaskがすでにWebサイトに接続されている場合は、この関数にアカウントのリストを渡して要求を出します。

```javascript
if (accounts.length !== 0) {
  const account = accounts[0];
  console.log('Found an authorized account: ', account);
```

- リストが空でない場合、`checkWalletIsConnected`関数はMetaMaskから取得した最初のアカウントアドレスを選び、それを`currentAccount`に設定します。

```javascript
setCurrentAccount(account);
```

- リストが空の場合は、空のリストが返され、結果をコンソールに出力します。

```javascript
} else {
  console.log('No authorized account found');
}
```

`checkWalletIsConnected`関数を更新してから、ページをリフレッシュすると、Webサイトには`Mint NFT`ボタンが表示されているはずです。

### 🐻 Web サイトから NFT を Mint する

それでは、Webサイトの中核となる機能を実装していきましょう。

ユーザーが`Mint NFT`ボタンをクリックすると、次のようなことが起こると予想されます。

1\. MetaMaskは、NFTの販売価格とガス代を支払うようユーザーに促します。

2\. ユーザーが同意すると、MetaMaskはあなたのコントラクトから`mintNFT`関数を呼び出します。

3\. 取引が完了すると、取引の結果（成功、もしくは失敗）をユーザーに通知します。

これをフロントエンドで行うには、スマートコントラクトに含まれる`ethers`ライブラリが必要です。

次に、`App.js`で`ethers`ライブラリをインポートしましょう。

`import { useEffect, useState } from 'react';`の上に、下記を追加してください。

```javascript
import { ethers } from 'ethers';
```

最後に、下記のように`mintNftHandler`関数を更新しましょう。

```javascript
const mintNftHandler = async () => {
  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(contractAddress, abi, signer);

      console.log('Initialize payment');
      let nftTxn = await nftContract.mintNFTs(1, {
        value: ethers.utils.parseEther('0.01'),
      });

      console.log('Mining... please wait');
      await nftTxn.wait();

      console.log(`Mined, see transaction: ${nftTxn.hash}`);
    } else {
      console.log('Ethereum object does not exist');
    }
  } catch (err) {
    console.log(err);
  }
};
```

この`mintNftHandler`関数は、[非同期](https://zenn.dev/tentel/articles/8146043d1101b5ea873d)(`async`)です。

いつものように、この関数が何をするのかに触れてみましょう。

1\. MetaMaskから投入された`ethereum`オブジェクトにアクセスしようとします。

```javascript
const { ethereum } = window;
```

2\. `ethereum`が存在する場合、MetaMaskをRPCプロバイダとして設定します。
これは、MetaMaskのウォレットを使ってマイナーにリクエストを発行することを意味します。

```javascript
  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
	:
```

3\. リクエストを発行するためには、ユーザーは自分の秘密鍵を使ってトランザクションに署名する必要があります。このために`signer`にアクセスします。

```javascript
const signer = provider.getSigner();
```

4\. 次に、デプロイされたコントラクトのアドレス、コントラクトABI、および`signer`を使用して、`ethers`のコントラクトインスタンスを開始します。

```javascript
const nftContract = new ethers.Contract(contractAddress, abi, signer);
console.log('Initialize payment');
```

5\. これで、前述のコントラクトオブジェクトを通じてコントラクト上の関数を呼び出すことができます。`mintNFT`関数を呼び出し、MetaMaskに`0.01 ETH`（これはNFTに設定した価格）を送信するよう依頼します。

```javascript
let nftTxn = await nftContract.mintNFTs(1, {
  value: ethers.utils.parseEther('0.01'),
});
console.log('Mining... please wait');
```

6\. トランザクションが処理されるのを待ち、処理が完了したら、トランザクションのハッシュをコンソールに出力します。

```javascript
await nftTxn.wait();
console.log(`Mined, see transaction: ${nftTxn.hash}`);
```

<!-- textlint-disable -->

7\. トランザクションが失敗した場合（間違った関数が呼び出された、間違ったパラメータが渡された、0.01 ETH 以下が送られた、ユーザーが取引を拒否した、など）、エラーがコンソールに出力されます。

<!-- textlint-enable -->

```javascript
  } catch (err) {
    console.log(err);
  }
```

### ✨ `App.js`の完成

ここまでフロントエンドのコア機能の実装が終わりました。

`App.js`の最終盤はこちらです。

```javascript
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

import './App.css';
import contract from './contracts/NFTCollectible.json';

const contractAddress = '0xF899DeB963208560a7c667FA78376ecaFF684b8E';
const abi = contract.abi;

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have MetaMask installed!');
      return;
    } else {
      console.log("Wallet exists! We're ready to go!");
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account: ', account);
      setCurrentAccount(account);
    } else {
      console.log('No authorized account found');
    }
  };

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert('Please install MetaMask!');
    }

    try {
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      console.log('Found an account! Address: ', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const mintNftHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        console.log('Initialize payment');
        let nftTxn = await nftContract.mintNFTs(1, {
          value: ethers.utils.parseEther('0.01'),
        });

        console.log('Mining... please wait');
        await nftTxn.wait();

        console.log(`Mined, see transaction: ${nftTxn.hash}`);
      } else {
        console.log('Ethereum object does not exist');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const connectWalletButton = () => {
    return (
      <button
        onClick={connectWalletHandler}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    );
  };

  const mintNftButton = () => {
    return (
      <button onClick={mintNftHandler} className="cta-button mint-nft-button">
        Mint NFT
      </button>
    );
  };

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  return (
    <div className="main-app">
      <h1>Scrappy Squirrels Tutorial</h1>
      <div>{currentAccount ? mintNftButton() : connectWalletButton()}</div>
    </div>
  );
}

export default App;
```

それでは、Webサイトに向かい、ブラウザのConsoleを開き、Mining状況をリアルタイムで確認できるようにしましょう。

**MetaMask のネットワークを`Polygon Testnet`にして**、`Mint NFT`ボタンをクリックします。

MetaMaskが0.01 ETH + ガス代を支払うよう促すので、同意してください。

トランザクションの処理には約15 ～ 20秒かかります。

処理が完了したら、MetaMaskのポップアップとコンソール出力の両方でトランザクションが確認できます。

![](/public/images/Polygon-Generative-NFT/section-4/4_1_10.png)

> ⚠️: 2022 年 4 月 1 日より、Mint ボタンすると下記のようなエラーが発生しています。
>
> ```
> MetaMask - RPC Error: Internal JSON-RPC error.
> {code: -32603, message: 'Internal JSON-RPC error.', data: {…}}
> code: -32603
> ```
>
> このエラーに関しては、2022 年 4 月 1 日以前には問題なく動いていた同プロジェクトにも発生しているので、対応を模索しています。
> あなたのプロジェクトで、このエラーが発生した場合、引き続き次のステップに進んでください。

Polygonがほかのサイドチェーンと異なる最大の利点は、世界最大のNFTマーケットプレイスであるOpenSeaにサポートされていることです。

[testnets.opensea.io](https://testnets.opensea.io/) にアクセスし、あなたのコントラクトアドレスを検索してください。

MintされたNFTがコレレクションとしてアップロードされているのがわかるでしょう。

![](/public/images/Polygon-Generative-NFT/section-4/4_1_11.png)

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#polygon`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

おめでとうございます!　あなたのNFTコレクションがMintされました!

あなたのOpenSeaのリンクを`#polygon`に投稿してください 😊

あなたの成功をコミュニティで祝いましょう 🎉

次のレッスンでは、VercelでWebサイトをホストします!

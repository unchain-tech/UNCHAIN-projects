### 🪄 Web サイトを構築する

これから、オリジナルの Web サイトを構築し、ユーザーが Web サイトから直接 NFT を Mint できる機能を実装していきます。

- ユーザーが MetaMask ウォレットを Web サイトに接続できる

- ユーザーがコントラクト関数を呼び出し、支払いを行い、コレクションから NFT を作成できるようにする

このレッスンを終了すると、React で構築された dApp が完成します。

また、汎用的な dApp のフロントエンドを構築するために必要な基礎知識も習得できます。

### 🛠 プロジェクトをセットアップする

まず、React のプロジェクトを作成していきます。

ターミナルを開いて、`Polygon-Generative-NFT` ディレクトリに移動し、以下のコマンドを実行してください。

```
npx create-react-app nft-collectible-frontend
```

インストールには 2 ～ 10 分ほどかかります。

> ⚠️: 注意
>
> インストールがうまくいかない場合、お使いの `npm node` のバージョンが古い可能性があります。
> 下記を実行してからもう一度 `create-react-app` コマンドを実行してみてください。
>
> ```
> npm install npm --global # Upgrade npm to the latest version
> ```
>
> インストールが完了したら、ターミナルで以下を実行して、すべてがうまくいっていることを確認してください。

```
cd nft-collectible-frontend
npm start
```

うまくいくと、ブラウザで `localhost://3000` に新しいタブが開き、以下のような画面が表示されるはずです。

これは、標準的な React のテンプレートです。

![](/public/images/201-Polygon-Generative-NFT/section-4/4_1_1.png)

では、フロントエンドを構築するファイルの中身を整理していきましょう。

`nft-collectible-frontend/public/index.html` を開いて、タイトルとメタディスクリプションを変更します。このステップは任意です。

下記に、今回のプロジェクトのために用意したテンプレートを紹介します。

```javascript
// index.html
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

次に、`nft-collectible-frontend/src` フォルダに移動して、`App.test.js` , `logo.svg` , `setupTests.js` ファイルを削除してください。

このレッスンでは、これらのファイルは必要ありません。

次に、`src` フォルダの中にある `App.js` ファイルを開き、内容を、以下の定型文に置き換えます。

```javascript
// App.js
import "./App.css";
function App() {
  return <h1>Hello World</h1>;
}
export default App;
```

`src/App.css` の内容もすべて削除してください。

ただし、このファイル自体は削除しないでください。

後で、このデモプロジェクトに使用する基本的な CSS スタイルを提供します。

`localhost://3000` に戻ると、`Hello World` という画面が表示されるはずです。

これで、React プロジェクトのセットアップが完了しました。

### 📂 コントラクトの ABI とアドレスを取得する

フロントエンドがスマートコントラクトに接続し、通信できるようにするためには、コントラクトの ABI とアドレスが必要です。

ABI（または Application Binary Interface）は、コントラクトのコンパイル時に自動的に生成される JSON ファイルです。

デプロイ先のブロックチェーンは、スマートコントラクトをバイトコードの形で保存しています。

そのうえで関数を呼び出し、正しいパラメータを渡し戻り値を解析するためには、関数とコントラクトに関する詳細（名前、引数、型など）をフロントエンドに指定する必要があります。

これがまさに ABI ファイルの役割です。

`/nft-collectible/artifacts/contracts/NFTCollectible.sol/NFTCollectible.json` を VS Code で開き中身を確認してみましょう。

![](/public/images/201-Polygon-Generative-NFT/section-4/4_1_2.png)

`NFTCollectible.json` に記載されているすべてのコードが、ABI ファイルです。

まず、JSON ファイルを React プロジェクトにコピーする必要があります。

`nft-collectible-frontend/src` フォルダに `contracts` という新しいフォルダを作成し、`NFTCollectible.json` ファイルをコピーして貼り付けましょう。

次に、前回のレッスンで Polygon テストネットにデプロイしたスマートコントラクトのアドレスを取得してください。

前回のレッスンで私が使用したコントラクトのアドレスは `0xF899DeB963208560a7c667FA78376ecaFF684b8E` です。

このレッスンでも、このコントラクトを使用していきます。

それでは、コントラクト ABI をインポートして、`App.js` ファイルにコントラクトアドレスを定義していきましょう。

```javascript
// App.js
import "./App.css";
import contract from "./contracts/NFTCollectible.json";

const contractAddress =
  "あなたのコントラクトアドレスをこちらに貼り付けてください";
const abi = contract.abi;

function App() {
  return <h1>Hello World</h1>;
}
export default App;
```

### 🛠 HTML、CSS、JS を設定する

今回作成する Web サイトは、シンプルなものになります。

あるのは見出しと `Connect Wallet` ボタンだけです。

ウォレットが接続されると、`Connect Wallet` ボタンが `Mint NFT` ボタンに置き換わります。

個別のコンポーネントファイルを作成する必要はありません。

代わりに、すべての HTML とロジックを `App.js` に、すべての CSS を `App.css` に記述します。

以下の内容を、`App.js` ファイルにコピーしてください。

```javascript
// App.js
import { useEffect } from "react";
import "./App.css";
import contract from "./contracts/NFTCollectible.json";

const contractAddress = "あなたのコントラクトアドレスを貼り付けましょう";
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

`App.js` の 5 行目であなたのコントラクトアドレスを設定してください。

```javascript
const contractAddress = "あなたのコントラクトアドレスを貼り付けましょう";
```

現時点では、関数をいくつか定義していることに注意してください。後で、その目的を説明し、ロジックを組み込んでいく予定です。

また、Web アプリケーションのために、CSS も用意しました。

以下を `App.css` ファイルにコピーしてください。

```javascript
// App.css
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

あなたの Web サイトは、このように表示されるはずです。

![](/public/images/201-Polygon-Generative-NFT/section-4/4_1_3.png)

CSS スタイルや静的要素（画像、ヘッダ、フッタ、ソーシャルメディアリンクなど）を追加して、Web サイトの外観を自由にカスタマイズしてください。

ここまで、プロジェクトの基礎となるブロックはほぼそろいました。

これで、ユーザーがウォレットを Web サイトに接続する準備が整いました。

### 🦊 MetaMask ウォレットとの接続

ユーザーがントラクトを呼び出すためには、自分のウォレットを Web サイトに接続する必要があります。

ウォレット接続は、ユーザーが NFT を Mint し、ガス代と販売価格を支払うことを可能にします。

このレッスンでは、MetaMask ウォレットと MetaMask API のみを使用します。

まず、ユーザーのブラウザに、MetaMask ウォレットが存在するか確認していきます。

ユーザーは MetaMask ウォレットを持っていなければ、Web サイト上で NFT を Mint できません。

MetaMask ウォレットが存在するかどうかを確認するロジックを、`checkWalletIsConnected` 関数に入力しましょう。

```javascript
// App.js
const checkWalletIsConnected = async () => {
  const { ethereum } = window;

  if (!ethereum) {
    console.log("Make sure you have MetaMask installed!");
    return;
  } else {
    console.log("Wallet exists! We're ready to go!");
  }
};
```

なお、`App.js` がロードされる際に、MetaMask の存在を確認する `useEffect` フックも定義しています。

アプリケーションの `localhost` ページで Console を開いてください。

- ステップ: Web ページ上で右クリック → `Inspect` → `Console`

MetaMask がインストールされていれば、`Wallet exists! We’re ready to go!` というメッセージが Console に表示されているはずです。

![](/public/images/201-Polygon-Generative-NFT/section-4/4_1_4.png)

MetaMask エクステンションをインストールしたからといって、アクセスしたすべての Web サイトに MetaMask が自動的に接続されるわけではありません。

MetaMask がユーザーにウォレットを接続するように促す必要があるのです。

そこで登場するのが `Connect Wallet` 機能です。

これは Web3 のログインボタンに相当します。

このログインボタンは、ユーザーがフロントエンドを通じてブロックチェーンネットワークに接続し、コントラクトを呼び出すことを可能にします。

MetaMask は `window.ethereum.request` メソッドでこのプロセスシンプルに実行します。

まず、ユーザーのウォレットアドレスを追跡するために、`App()` で `useState` フックを使って変数を定義しましょう。

まず、React から `useState` をインポートするために、`App.js` ファイルの 1 行目 `import from 'react'` の中身を下記のように更新してください。

```javascript
// App.js
import { useEffect, useState } from "react";
```

それから、下記を `checkWalletIsConnected` 関数の真上に追加してください。

```javascript
const [currentAccount, setCurrentAccount] = useState(null);
```

`currentAccount` には、ユーザーの公開ウォレットアドレスが格納されます。

`setCurrentAccount` は、`currentAccount` の状態を更新する関数です。

`useState(null)` で `currentAccount` と `setCurrentAccount` を初期化しています。

次に、`connectWalletHandler` 関数を定義しましょう。

```javascript
// App.js
const connectWalletHandler = async () => {
  const { ethereum } = window;

  if (!ethereum) {
    alert("Please install MetaMask!");
  }

  try {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    console.log("Found an account! Address: ", accounts[0]);
    setCurrentAccount(accounts[0]);
  } catch (err) {
    console.log(err);
  }
};
```

`connectWalletHandler` 関数が何をするのか、簡単に説明しましょう。

まず、MetaMask がインストールされているかどうかをチェックします。

インストールされていない場合は、MetaMask のインストールを促すポップアップが表示されます。

```javascript
// App.js
const { ethereum } = window;

if (!ethereum) {
  alert("Please install MetaMask!");
}
```

MetaMask にユーザーのウォレット接続を促し、アドレスの取得を試みます。

```javascript
// App.js
const accounts = await ethereum.request({ method: "eth_requestAccounts" });
console.log("Found an account! Address: ", accounts[0]);
```

ユーザーが Web サイトとの接続に同意すると、最初に利用可能なウォレットアドレスを取得し、それを`currentAccount` 変数の値として設定します。

```javascript
// App.js
setCurrentAccount(accounts[0]);
```

何か問題が発生した場合（ユーザーが接続を拒否したなど）、処理を中断してコンソールにエラーメッセージが表示されます。

```javascript
// App.js
} catch (err) {
	console.log(err)
}
```

### 🌐 ウォレット接続のテストを実行する

上記のコードをすべて `App.js` に反映させたら、MetaMask のプラグインをクリックし、あなたのウォレットアドレスの接続状況を確認しましょう。

もし、下図のように `Connected` と表示されている場合は、`Connected` の文字をクリックします。

![](/public/images/201-Polygon-Generative-NFT/section-4/4_1_5.png)

そこで、Web サイトとあなたのウォレットアドレスの接続を一度解除します。

- `Disconnect this account` を選択してください。

![](/public/images/201-Polygon-Generative-NFT/section-4/4_1_6.png)

次にローカルサーバにホストされているあなたの Web サイトをリフレッシュして、`Connect Wallet` ボタンを押してください。

MetaMask が Web サイトとの接続を促してきますので、同意しましょう。

下記のように、Console にあなたのパブリックウォレットアドレスが出力されていれば、ウォレット接続のテストは成功です。

![](/public/images/201-Polygon-Generative-NFT/section-4/4_1_7.png)

ウォレットが接続されたら、`Connect Wallet` ボタンを `Mint NFT` ボタンに置き換えていきましょう。

`App.js` の戻り値で、`Connect Wallet` ボタンのレンダリングを条件付きレンダリングに置き換えてみましょう。

`return ()` の中身を下記のように変更してください。

```javascript
return (
  <div className="main-app">
    <h1>Scrappy Squirrels Tutorial</h1>
    <div>{currentAccount ? mintNftButton() : connectWalletButton()}</div>
  </div>
);
```

これで、私たちの Web サイトはこのようになります。

![](/public/images/201-Polygon-Generative-NFT/section-4/4_1_8.png)

ページを更新して、MetaMask エクステンションを確認してみましょう。

MetaMask はまだ Web サイトに接続されていることを伝えていますが、Web サイトにはまだ Connect Wallet ボタンが表示されていることがわかります。

![](/public/images/201-Polygon-Generative-NFT/section-4/4_1_9.png)

React に慣れている人なら、なぜこのようなことが起こるのかお分かりでしょう。

結局のところ、`connectWallet` 関数の中だけで `setCurrentAccount` を設定しているのです。

実際には、`App.js` がロードされるたびに（つまり更新するたびに）、ユーザーのウォレットが Web サイトに接続されているか確認する必要があります。

そこで、`checkWalletIsConnected` 関数を拡張して、Web サイトがロードされると同時にアカウントをチェックし、ウォレットがすでに接続されている場合は `currentAccount` を設定するようにしましょう。

下記のように、`checkWalletIsConnected` 関数を更新してください。

```javascript
// App.js
const checkWalletIsConnected = async () => {
  const { ethereum } = window;

  if (!ethereum) {
    console.log("Make sure you have MetaMask installed!");
    return;
  } else {
    console.log("Wallet exists! We're ready to go!");
  }

  const accounts = await ethereum.request({ method: "eth_accounts" });

  if (accounts.length !== 0) {
    const account = accounts[0];
    console.log("Found an authorized account: ", account);
    setCurrentAccount(account);
  } else {
    console.log("No authorized account found");
  }
};
```

この `checkWalletIsConnected` 関数は、[非同期](https://zenn.dev/tentel/articles/8146043d1101b5ea873d)（`async`）です。

この関数が何をするのか、簡単に触れておきましょう。

- MetaMask がインストールされているかどうかをチェックし、結果をコンソールに出力します。

  ```javascript
  // App.js
  if (!ethereum) {
    console.log("Make sure you have MetaMask installed!");
    return;
  } else {
    console.log("Wallet exists! We're ready to go!");
  }
  ```

- Web サイトに接続中のアカウントに対して MetaMask のリクエストを試みます。

```javascript
// App.js
const accounts = await ethereum.request({ method: "eth_accounts" });
```

- MetaMask がすでに Web サイトに接続されている場合は、この関数にアカウントのリストを渡して要求を出します。

```javascript
// App.js
if (accounts.length !== 0) {
  const account = accounts[0];
  console.log("Found an authorized account: ", account);
```

- リストが空でない場合、`checkWalletIsConnected` 関数は MetaMask から取得した最初のアカウントアドレスを選び、それを `currentAccount` に設定します。

```javascript
// App.js
setCurrentAccount(account);
```

- リストが空の場合は、空のリストが返され、結果をコンソールに出力します。

```javascript
// App.js
} else {
  console.log("No authorized account found");
}
```

`checkWalletIsConnected` 関数を更新してから、ページをリフレッシュすると、Web サイトには `Mint NFT` ボタンが表示されているはずです。

### 🐻 Web サイトから NFT を Mint する

それでは、Web サイトの中核となる機能を実装していきましょう。

ユーザーが `Mint NFT` ボタンをクリックすると、次のようなことが起こると予想されます。

1\. MetaMask は、NFT の販売価格とガス代を支払うようユーザーに促します。

2\. ユーザーが同意すると、MetaMask はあなたのコントラクトから `mintNFT` 関数を呼び出します。

3\. 取引が完了すると、取引の結果（成功、もしくは失敗）をユーザーに通知します。

これをフロントエンドで行うには、スマートコントラクトに含まれる `ethers` ライブラリが必要です。

ターミナルで、`nft-collectible-frontend` に移動し、以下のコマンドを実行してください。

```
npm install ethers
```

次に、`App.js` で `ethers` ライブラリをインポートしましょう。

`import contract from './contracts/NFTCollectible.json';` の直下に、下記を追加してください。

```javascript
// App.js
import { ethers } from "ethers";
```

最後に、下記のように `mintNftHandler` 関数を更新しましょう。

```javascript
// App.js
const mintNftHandler = async () => {
  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(contractAddress, abi, signer);

      console.log("Initialize payment");
      let nftTxn = await nftContract.mintNFTs(1, {
        value: ethers.utils.parseEther("0.01"),
      });

      console.log("Mining... please wait");
      await nftTxn.wait();

      console.log(`Mined, see transaction: ${nftTxn.hash}`);
    } else {
      console.log("Ethereum object does not exist");
    }
  } catch (err) {
    console.log(err);
  }
};
```

この `mintNftHandler` 関数は、[非同期](https://zenn.dev/tentel/articles/8146043d1101b5ea873d)（`async`）です。

いつものように、この関数が何をするのかに触れてみましょう。

1\. MetaMask から投入された `ethereum` オブジェクトにアクセスしようとします。

```javascript
// App.js
const { ethereum } = window;
```

2\. `ethereum` が存在する場合、MetaMask を RPC プロバイダとして設定します。
これは、MetaMask のウォレットを使ってマイナーにリクエストを発行することを意味します。

```javascript
// App.js
  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
	:
```

3\. リクエストを発行するためには、ユーザーは自分の秘密鍵を使ってトランザクションに署名する必要があります。このために `signer` にアクセスします。

```javascript
// App.js
const signer = provider.getSigner();
```

4\. 次に、デプロイされたコントラクトのアドレス、コントラクト ABI、および `signer` を使用して、`ethers` のコントラクトインスタンスを開始します。

```javascript
// App.js
const nftContract = new ethers.Contract(contractAddress, abi, signer);
console.log("Initialize payment");
```

5\. これで、前述のコントラクトオブジェクトを通じてコントラクト上の関数を呼び出すことができます。`mintNFT` 関数を呼び出し、MetaMask に `0.01 ETH`（これは NFT に設定した価格）を送信するよう依頼します。

```javascript
// App.js
let nftTxn = await nftContract.mintNFTs(1, {
  value: ethers.utils.parseEther("0.01"),
});
console.log("Mining... please wait");
```

6\. トランザクションが処理されるのを待ち、処理が完了したら、トランザクションのハッシュをコンソールに出力します。

```javascript
// App.js
await nftTxn.wait();
console.log(`Mined, see transaction: ${nftTxn.hash}`);
```

<!-- textlint-disable -->

7\. トランザクションが失敗した場合（間違った関数が呼び出された、間違ったパラメータが渡された、0.01 ETH 以下が送られた、ユーザーが取引を拒否した、など）、エラーがコンソールに出力されます。

<!-- textlint-enable -->

```javascript
// App.js
  } catch (err) {
    console.log(err);
  }
```

### ✨ `App.js` の完成

ここまでフロントエンドのコア機能の実装が終わりました。

`App.js` の最終盤はこちらです。

```javascript
// App.js

import { useEffect, useState } from "react";
import "./App.css";
import contract from "./contracts/NFTCollectible.json";
import { ethers } from "ethers";

const contractAddress = "0x7aDBc3497BE70a903c5b17BEf184782dD0A7eFAa";
const abi = contract.abi;

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have MetaMask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!");
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install MetaMask!");
    }

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Found an account! Address: ", accounts[0]);
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

        console.log("Initialize payment");
        let nftTxn = await nftContract.mintNFTs(1, {
          value: ethers.utils.parseEther("0.01"),
        });

        console.log("Mining... please wait");
        await nftTxn.wait();

        console.log(`Mined, see transaction: ${nftTxn.hash}`);
      } else {
        console.log("Ethereum object does not exist");
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

それでは、Web サイトに向かい、ブラウザの Console を開き、Mining 状況をリアルタイムで確認できるようにしましょう。

**MetaMask のネットワークを `Polygon Testnet` にして**、`Mint NFT` ボタンをクリックします。

MetaMask が 0.01 ETH + ガス代を支払うよう促すので、同意してください。

トランザクションの処理には約 15 ～ 20 秒かかります。

処理が完了したら、MetaMask のポップアップとコンソール出力の両方でトランザクションが確認できます。

![](/public/images/201-Polygon-Generative-NFT/section-4/4_1_10.png)

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

Polygon がほかのサイドチェーンと異なる最大の利点は、世界最大の NFT マーケットプレイスである OpenSea にサポートされていることです。

[testnets.opensea.io](https://testnets.opensea.io/) にアクセスし、あなたのコントラクトアドレスを検索してください。

Mint された NFT がコレレクションとしてアップロードされているのがわかるでしょう。

![](/public/images/201-Polygon-Generative-NFT/section-4/4_1_11.png)

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#section-4` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 3 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

おめでとうございます!　あなたの NFT コレクションが Mint されました!

あなたの OpenSea のリンクを `#section-4` に投稿してください 😊

あなたの成功をコミュニティで祝いましょう 🎉

次のレッスンでは、Vercel で Web サイトをホストします!

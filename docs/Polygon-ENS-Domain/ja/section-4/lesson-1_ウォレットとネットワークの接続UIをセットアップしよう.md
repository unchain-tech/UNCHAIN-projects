このレッスンでは、いろいろな種類のdappに応用できる方法を説明します。

これらは非常に有用で後から役に立つことでしょう。

さぁ、dappを完成していきましょう。

まず、アプリのユーザーインタフェースを大幅に改善します。 まず、ユーザーにアドレスを表示することから始めましょう。Reactアプリにアクセスし、App.jsの`header-container`の`div`を更新します。

```html
<div className="header-container">
  <header>
    <div className="left">
      <p className="title">🐱‍👤 Ninja Name Service</p>
      <p className="subtitle">Your immortal API on the blockchain!</p>
    </div>
    {/* Display a logo and wallet connection status*/}
    <div className="right">
      <img alt="Network logo" className="logo" src={ network.includes('Polygon') ? polygonLogo : ethLogo} />
      { currentAccount ? <p> Wallet: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)} </p> : <p> Not connected </p> }
    </div>
  </header>
</div>
```

「? :」は三項演算子であり、適切な場面で使用すると非常に有用です。

簡単には
```
( true or false ) ? ( true の場合の処理) : ( false の場合の処理)
```
です。

ここではネットワーク名に'Polygon'という単語が含まれているかどうかを確認しています。

したがって、Polygonメインネットを使用している場合は、ポリゴンのロゴが表示されます。

エラーが出ていますがあせらず、今から修正します。

コンポーネントの先頭に戻り、以下を追加します（全体をコピー/貼り付けしないでください、うまく作動しません）。

```javascript
// これまでのimportのあとに追加してください。
import polygonLogo from './assets/polygonlogo.png';
import ethLogo from './assets/ethlogo.png';
import { networks } from './utils/networks';

const App = () => {
  // network を状態変数として設定します。
  const [network, setNetwork] = useState('');

  // network を扱えるよう checkIfWalletIsConnected 関数をupdateします。
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have metamask!');
      return;
    } else {
      console.log('We have the ethereum object', ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account:', account);
      setCurrentAccount(account);
    } else {
      console.log('No authorized account found');
    }

    // ユーザーのネットワークのチェーンIDをチェックします。
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    setNetwork(networks[chainId]);

    ethereum.on('chainChanged', handleChainChanged);

    // ネットワークが変わったらリロードします。
    function handleChainChanged(_chainId) {
      window.location.reload();
    }
  };

// その他の箇所は変更しないでください。
```

`App.js`の残りの部分はそのままにしておいてください。

ブラウザで確認してみましょう。

Mumbai上にいるときは次のようになります。

![](/public/images/Polygon-ENS-Domain/section-4/4_1_1.png)

ネットワークをチェックしているので`mumbai`のテストネット上にいない場合は、ミントフォームを無効にする必要があります。 これを`renderInputForm`の先頭に追加します。

```javascript
const renderInputForm = () =>{
  // テストネットの Polygon Mumbai 上にいない場合の処理
  if (network !== 'Polygon Mumbai Testnet') {
    return (
      <div className="connect-wallet-container">
        <p>Please connect to the Polygon Mumbai Testnet</p>
      </div>
    );
  }

  // その他の場所はそのままにしておいてください。
  return (
    ...
```

一方、例えばPolygonのメインネットにいるときは次のように表示されます。

入力フォームとミントボタンの代わりにテキストメッセージをレンダリングします。

![](/public/images/Polygon-ENS-Domain/section-4/4_1_2.png)

### 🦊 MetaMaskでネットワークの追加、切り替え

あらゆる種類のユーザーがアプリにアクセスできるようにしたいですね。

web3を使用開始したばかりのユーザーや、経験豊富なユーザーもどちらもです。

現在、私たちが行っているのは、Mumbaiに接続するように指示することだけです。

そのためのボタンを追加すれば、便利になりますね。

MetaMask APIを使用して、実際にネットワークを追加、切り替えできます。

次のようになります。App.jsで`connectWallet`関数の次に配置します。

```javascript
const switchNetwork = async () => {
  if (window.ethereum) {
    try {
      // Mumbai testnet に切り替えます。
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x13881' }], // utilsフォルダ内のnetworks.js を確認しましょう。0xは16進数です。
      });
    } catch (error) {
      // このエラーコードは当該チェーンがメタマスクに追加されていない場合です。
      // その場合、ユーザーに追加するよう促します。
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x13881',
                chainName: 'Polygon Mumbai Testnet',
                rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                nativeCurrency: {
                    name: 'Mumbai Matic',
                    symbol: 'MATIC',
                    decimals: 18
                },
                blockExplorerUrls: ['https://mumbai.polygonscan.com/']
              },
            ],
          });
        } catch (error) {
          console.log(error);
        }
      }
      console.log(error);
    }
  } else {
    // window.ethereum が見つからない場合メタマスクのインストールを促します。
    alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
  }
}
```

見ていきましょう。

この関数はまずチェーンIDを変更しようとします。

```javascript
await window.ethereum.request({
  method: 'wallet_switchEthereumChain',
  params: [{ chainId: '0x13881' }], // utilsフォルダの networks.js を確認ください。
});
```

`chainId`パラメータは、さまざまなネットワークを識別する16進数です。

最も一般的なものは`networks.js`ファイルにあります。 あとで新しいネットワークを追加もできます。

2番目の部分では、ネットワークがない場合は、ユーザーにネットワークを追加するように求めます。

最後に、この関数を呼び出すボタンを`renderInputForm`に追加します。

```javascript
const renderInputForm = () =>{
  // Polygon Mumbai Testnet上にいない場合、switchボタンをレンダリングします。
  if (network !== 'Polygon Mumbai Testnet') {
    return (
      <div className="connect-wallet-container">
        <h2>Please switch to Polygon Mumbai Testnet</h2>
        {/* 今ボタンで switchNetwork 関数を呼び出します。 */}
        <button className='cta-button mint-button' onClick={switchNetwork}>Click here to switch</button>
      </div>
    );
  }

  // 残りの関数はそのままにしておきます。
  return (
```

例えばPolygon（Matic）のメインネットにいる場合、下のような画面になるでしょう。

![](/public/images/Polygon-ENS-Domain/section-4/4_1_3.png)


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
お疲れ様でした! 一休みしてからでも次のレッスンに進みましょう😉

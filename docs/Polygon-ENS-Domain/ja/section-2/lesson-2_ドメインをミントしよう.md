### 💌 ユーザーからデータを取得する

前回まででウェブサイトのフロントエンドを作成しながら、ウォレット接続などの機能を少しずつ実装してきました。 スマートコントラクトをデプロイし、ウォレットを接続しました。 次に、MetaMaskからアクセスできる情報を使用して、ウェブアプリから実際にスマートコントラクトを呼び出す必要があります。

まず、ユーザーのドメイン名と保存するデータを取得する必要があるので、それを実行しましょう。

```javascript
import React, { useEffect, useState } from 'react';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import { ethers } from 'ethers';

const TWITTER_HANDLE = 'UNCHAIN_tech';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
// 登録したいドメインです。好みで変えてみましょう。
const tld = '.ninja';
const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS_HERE';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState('');
  // state管理するプロパティを追加しています。
  const [domain, setDomain] = useState('');
  const [record, setRecord] = useState('');

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask -> https://metamask.io/');
        return;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

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
  };

  // レンダリング関数です。
  const renderNotConnectedContainer = () => (
    <div className="connect-wallet-container">
      <img
        src="https://media.giphy.com/media/3ohhwytHcusSCXXOUg/giphy.gif"
        alt="Ninja donut gif"
      />
      {/* ボタンクリックでconnectWallet関数を呼び出します。 */}
      <button
        onClick={connectWallet}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    </div>
  );

  // ドメインネームとデータの入力フォームです。
  const renderInputForm = () => {
    return (
      <div className="form-container">
        <div className="first-row">
          <input
            type="text"
            value={domain}
            placeholder="domain"
            onChange={(e) => setDomain(e.target.value)}
          />
          <p className="tld"> {tld} </p>
        </div>

        <input
          type="text"
          value={record}
          placeholder="whats ur ninja power"
          onChange={(e) => setRecord(e.target.value)}
        />

        <div className="button-container">
          <button
            className="cta-button mint-button"
            disabled={null}
            onClick={null}
          >
            Mint
          </button>
          <button
            className="cta-button mint-button"
            disabled={null}
            onClick={null}
          >
            Set data
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <header>
            <div className="left">
              <p className="title">🐱‍👤 Ninja Name Service</p>
              <p className="subtitle">Your immortal API on the blockchain!</p>
            </div>
          </header>
        </div>

        {!currentAccount && renderNotConnectedContainer()}
        {/* アカウントが接続されるとインプットフォームをレンダリングします。 */}
        {currentAccount && renderInputForm()}

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
```

以前定義した`currentAccount`変数の下に2つの状態変数を追加し、さらに入力フォームを返す`renderInputForm`関数を追加しました。

これらの新しい追加について、より焦点を絞って見てみましょう。

```javascript
// トップレベルドメイン(tld)を定義します。
const tld = '.ninja';

const App = () => {
// domain と record のstate管理をします。
const [domain, setDomain] = useState('');
const [record, setRecord] = useState('');

return (
	<div className="App">
			...
			{/* ここにヘッダー情報が来ます。 */}

			{/* currentAccount が無ければ Connect Walletボタンを表示しません */}
			{!currentAccount && renderNotConnectedContainer()}

			{/* アカウントが接続されていれば 入力フォーム をレンダリングします。 */}
			{currentAccount && renderInputForm()}

			{/* フッター情報がここに来ます。 */}
			...
	</div>
);
```

`&&`構文は少し違和感を感じるかもしれませんが、`&&`の前の条件が`true`の場合、レンダリング関数を返します。 したがって、 `currentAccount`が空の場合（つまり、trueでない場合）、ウォレットの接続ボタンが表示されます。

`renderInputForm`の内容は、Reactで状態変数に関連付けられた入力フォームを使用する際には標準的な形式です。 それらについての詳細は[ここ](https://reactjs.org/docs/hooks-state.html)で読むことができます。

アプリを見ると、次の入力フォームが表示されます。

![](/public/images/Polygon-ENS-Domain/section-2/2_3_1.png)

**注：** 現在、Mintボタンは何も機能しません。これは予想できますね。

これで、ユーザーの入力した情報を取得して、スマートコントラクトを呼び出すことができます。 次のセクションでは、スマートコントラクトで以前に作成した関数を呼び出します。

### 🧞 スマートコントラクトとのやり取り

入力情報を取得してスマートコントラクトに送信し、実際にドメインを作成する準備が整いました。 やってみましょう 🤘

以前にドメインをNFTとして作成するコントラクトに作成した`register`関数を覚えていますか？ 次はWebアプリからこの関数を呼び出す必要があります。 先に進み、`checkIfWalletIsConnected`関数の下に次の関数を追加します。

```javascript
const mintDomain = async () => {
  // ドメインがnullのときrunしません。
  if (!domain) {
    return;
  }
  // ドメインが3文字に満たない、短すぎる場合にアラートを出します。
  if (domain.length < 3) {
    alert('Domain must be at least 3 characters long');
    return;
  }
  // ドメインの文字数に応じて価格を計算します。
  // 3 chars = 0.05 MATIC, 4 chars = 0.03 MATIC, 5 or more = 0.01 MATIC
  const price =
    domain.length === 3 ? '0.05' : domain.length === 4 ? '0.03' : '0.01';
  console.log('Minting domain', domain, 'with price', price);
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractAbi.abi,
        signer
      );

      console.log('Going to pop wallet now to pay gas...');
      let tx = await contract.register(domain, {
        value: ethers.utils.parseEther(price),
      });
      // ミントされるまでトランザクションを待ちます。
      const receipt = await tx.wait();

      // トランザクションが問題なく実行されたか確認します。
      if (receipt.status === 1) {
        console.log(
          'Domain minted! https://mumbai.polygonscan.com/tx/' + tx.hash
        );

        // domain,recordをセットします。
        tx = await contract.setRecord(domain, record);
        await tx.wait();

        console.log('Record set! https://mumbai.polygonscan.com/tx/' + tx.hash);

        setRecord('');
        setDomain('');
      } else {
        alert('Transaction failed! Please try again');
      }
    }
  } catch (error) {
    console.log(error);
  }
};
```

これにより、いくつかのエラーが出ますが心配しないでください。これから修正します。 コードを少し見てみましょう。

```javascript
const provider = new ethers.providers.Web3Provider(ethereum);
const signer = provider.getSigner();
```

`ethers`は、フロントエンドがコントラクトとやりとりをするときに役立つライブラリです。

必ず`ethers`から`import { ethers }`を使用してコード上部にインポートしてください。

`provider`は、実際にPolygonノードと通信するために使用します。Alchemyを使用してデプロイした方法を覚えていますか？ この場合、MetaMaskがバックグラウンドで提供するノードを使用して、デプロイされたコントラクトからデータを送受信します。

[こちら](https://docs.ethers.io/v5/api/signer/#signers)はif文内の`signer`を説明するリンクです。ご参考ください。

```javascript
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
```

これについては後で説明します。 この行が実際に**コントラクトへの接続をする**ものであることを知っておいてください。 必要なもの：コントラクトのアドレス、`abi`ファイルと呼ばれるもの、および`signer`。 これらは、ブロックチェーン上のコントラクトと通信するために必要な3つの項目です。

ファイルの先頭にある`const CONTRACT_ADDRESS`に注目してください。

**この変数は、デプロイされた最新のコントラクトのアドレスに必ず変更してください**。

忘れたり紛失したりしても心配はいりません。コントラクトを再デプロイして新しいコントラクトアドレスを取得してください。

```javascript
console.log('Going to pop wallet now to pay gas...');
let tx = await contract.register(domain, {
  value: ethers.utils.parseEther(price),
});
// トランザクションを待ちます。
const receipt = await tx.wait();

// トランザクションが完了したか確認します。
if (receipt.status === 1) {
  console.log('Domain minted! https://mumbai.polygonscan.com/tx/' + tx.hash);

  // domain,recordをセットします。
  tx = await contract.setRecord(domain, record);
  await tx.wait();

  console.log('Record set! https://mumbai.polygonscan.com/tx/' + tx.hash);

  setRecord('');
  setDomain('');
} else {
  alert('Transaction failed! Please try again');
}
```

この部分は以前にデプロイしたコードと接続しているように見えますね。

ここでは、実際に2つのコントラクト関数を呼び出します。

最初に`register`関数を使用し、マイニングされるのを待ってから、PolygonscanのURLにリンクします。

2つ目は`setRecord`です。これは、作成するドメインのレコードを設定します。 ドメインは、レコードを設定する前にコントラクトに存在する必要があるため、最初のトランザクションが正常にマイニングされるのを待つ必要があります。 `tx.wait（）`では、確認可能な情報を返してくれます。

最後に、誰かが`Mint NFT`ボタンをクリックしたときに、`mintDomain`関数を呼び出します。 `renderInputForm`関数のミントボタンに`onClick`を追加して、この関数を呼び出します。

なお、`set data`ボタンの部分は今必要ないので削除しておきます。

他は同じままです。

```javascript
const renderInputForm = () => {
  return (
    <div className="form-container">
      <div className="first-row">
        <input
          type="text"
          value={domain}
          placeholder="domain"
          onChange={(e) => setDomain(e.target.value)}
        />
        <p className="tld"> {tld} </p>
      </div>

      <input
        type="text"
        value={record}
        placeholder="whats ur ninja power?"
        onChange={(e) => setRecord(e.target.value)}
      />

      <div className="button-container">
        {/* ボタンクリックで mintDomain関数 を呼び出します。 */}
        <button className="cta-button mint-button" onClick={mintDomain}>
          Mint
        </button>
      </div>
    </div>
  );
};
```

注：引き続きエラーが表示され、`Mint`ボタンは機能しません。

### 📂 ABI ファイル

スマートコントラクトをコンパイルすると、コンパイラーは、コントラクトを操作できるようにするために必要な一連のファイルを吐き出します。 これらのファイルは、Solidityプロジェクトのルートにある`artifacts`フォルダに作成されます。

ABIファイルというものがあり、これはWebアプリがコントラクトと通信する方法を知るために必要なものです。 [こちら](https://docs.soliditylang.org/en/v0.8.11/abi-spec.html)についてお読みください。

ABIファイルの内容は、HardhatプロジェクトのJSONファイルにあります。

前のsectionで作成したバックエンド側`packages/contract`ディレクトリをご覧ください。

`artifacts/contracts/Domains.sol/Domains.json`

`Domains.json`からコンテンツをコピーして、ウェブアプリ（フロントエンド側）に移動します。

（全選択はCtrl+A（Windows）, Command+A（Mac）を使用すると便利です）。

`packages/client/src`の下にある`utils`というフォルダに、`contractABI.json`という名前のファイルを作成します。

（フォルダがない場合は作成してください）。

したがって、フルパスは次のようになります。

`src/utils/contractABI.json`

ABIファイルの内容を新しいファイルに貼り付けます。

すべてのABIコンテンツを含むファイルの準備ができたので、次はそれを`App.js`ファイルにインポートします。

次のようになります。

```javascript
import contractAbi from './utils/contractABI.json';
```

すべて完了しました。

もうエラーはないはずです。

このような画面になるはずです。

![](/public/images/Polygon-ENS-Domain/section-2/2_3_2.png)

ここから行う必要があるのは、ドメイン名とレコードを入力し、`Mint`をクリックして、ガスを支払い（偽のMATICを使用）、トランザクションがマイニングされるのを待つだけです。

ドメインは前のSectionで使用したOpenSeaなどで確認してみてください。

もしすぐに表示されなくても15分以内には表示されるでしょう。

### 🤩 テスト

さぁ、作成したウェブサイトから直接ドメインNFTに行って実際にミントすることができるはずです。

**やってみましょう!**

NFTミンティングサイトが実際にどのように機能するかを確認できます。

下は一例です。`nin-nin.ninja`をミントしました。

![](/public/images/Polygon-ENS-Domain/section-2/2_3_3.png)

(ガスについて詳しく知りたい方は英語になりますが[ここ](https://ethereum.org/en/developers/docs/gas/)を参照してみてください。)

### 👉 コントラクトの再デプロイに関する注意

コントラクトを更新したい場合は、毎回3つのことをする必要があります。

1. 再度デプロイする必要があります。
2. フロントエンドのコントラクトアドレスを更新する必要があります。
3. フロントエンドのabiファイルを更新する必要があります。

   2.と3. がそれぞれどこの箇所かはわかりますね。

**コントラクトを更新するとき、しばしばこれらの 3 つのステップを実行することを忘れますが、毎回必要な手順になりますので忘れないでくださいね。**

なぜこれをすべて行う必要があるのでしょう？ それは、スマートコントラクトが**不変**であるためです。変更することはできません。 永続的なのです。 一度deployしたコントラクトは変更できず、別物として再デプロイする必要があります。 これは、まったく新しいコントラクトとして扱われるため、すべての変数を**リセット**します。 **つまり、コントラクトのコードを更新したい場合、それまでのすべてのドメインデータは引き継がれないので注意してください。**

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

おめでとうございます! Section 2が完了しました! ぜひあなたのが新しくMintしたNFTをDiscordの`polygon-ens-domain`でシェアしてください😊

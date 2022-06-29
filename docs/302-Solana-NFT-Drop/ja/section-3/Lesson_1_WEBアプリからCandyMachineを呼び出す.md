### ☎️ Web アプリケーションから candy machine を呼び出す

ここまでのレッスンで以下 3 つのことを行いました 🎉

1\. Web アプリケーションをセットアップ行う

2\. ウォレットへの接続機能を構築する

3\. Candy Machine をセットアップし、NFT をアップロードして、すべてを Devnet にデプロイする

次は、Web アプリケーションから、ユーザーが実際に Candy Machine と通信できるようにします。

まずは `app/src/CandyMachine/index.js` をご覧ください。これは Metaplex のフロントエンド・ライブラリの一部です。

このファイルについて詳しく説明しませんが、ぜひコードを読んでみてください。

### 🌲 `.env` プロパティを設定する

まずは `.env` プロパティを設定します。

始める前に **ソースコードを GitHub などにコミットする場合は、`.env` ファイルをコミットしないようにしてください**。

これは、Web アプリケーションを作成する際の共通の注意点です。

これらのファイルには通常、機密情報が含まれているため、`.gitignore` に登録するなど対処してください。

Web の `app` フォルダ直下に `.env` ファイルを作成してください。フォルダ階層は次のとおりです。

```
/app/.env
```

`.env` ファイルに公開鍵を保存します。記載内容は下記の通りです。

```txt
REACT_APP_CANDY_MACHINE_ID=
REACT_APP_SOLANA_NETWORK=
REACT_APP_SOLANA_RPC_HOST=
```

1 つずつ見ていきましょう。(ここでは引用符 `""` で囲う必要はありません!　)

※ `.cache/devnet-temp` は、前のステップで `Metaplex` コマンドを実行した後からフォルダのルートにあります。

```
REACT_APP_CANDY_MACHINE_ID=
```

`=` のあとに、Candy Machine の公開鍵を記載してください。なくしてしまった場合は、`.cache/devnet-temp.json` ファイルをご覧ください。

`candyMachine` の `value` の値が公開鍵です。

```
REACT_APP_SOLANA_NETWORK=
```

`=` のあとに、`devnet` と記載してください。

```
REACT_APP_SOLANA_RPC_HOST=
```

`=` のあとに、`https://explorer-api.devnet.solana.com` と記載してください。

Candy Machine には devnet からアクセスしているので、RPC をその devnet のリンクに向ける必要があります。

記載例

```
REACT_APP_CANDY_MACHINE_ID=3EVLt8KbaLGC3AragKvXDNHzWee7y6hkxzgNAuW4E43M
REACT_APP_SOLANA_NETWORK=devnet
REACT_APP_SOLANA_RPC_HOST=https://explorer-api.devnet.solana.com
```

これらの変数は、Web アプリケーションがどの Candy Machine と通信するか、どのネットワークを利用するかなどを指し示すために使用されます。

※ `.env` を変更する際には、ターミナルで React のプロセスを強制終了し、`npm run start` を再度行う必要があります。

最後に、Phantom Wallet のネットワークが Devnet に接続されていることを確認してください。

- 「設定」→「ネットワークの変更」→「Devnet」から変更できます。

![無題](/public/images/302-Solana-NFT-Drop/section3/3_1_1.png)

### 🤬 NFT の変更に関する注意

テストに使用した NFT コレクションを変更したい場合。以前と同じ手順を踏む必要があります。

1\. MetaplexCLI の Candy Machine コマンドによって生成された `.cache` フォルダーを削除する

2\. NFT ファイルを好きなように変更する

3\. CLI から Metaplex の `upload` コマンドを実行して、NFT をアップロードし、新しい Candy Machine を作成する

4\. CLI から Metaplex の `verify` コマンドを実行し、NFT がアップロードされ、Candy Machine が構成されていることを確認する

5\. `.env` ファイルを新しいアドレスで更新する

これらの手順を踏まずに変更してしまうとバグの原因になるので気を付けてください。

### 📞 Candy Machine と接続する

最初に、Candy Machine のメタデータを取得します。

このメタデータは、ドロップ日やミントされたアイテムの数、ミントに使用できるアイテムの数などのいくつかの情報が記載されています。

`app/src/CandyMachine/index.js` を開きます。

まず、`useEffect` をインポートし、これから設定する `getCandyMachineState` という関数を呼び出す `useEffect` を設定します。

1 \. `index.js` の先頭に下記のコードを追加します。

```jsx
// index.js
import React, { useEffect } from "react";
```

2 \. `index.js` の中にある下記のコードブロックを確認してください。

```jsx
// index.js
return (
  <div className="machine-container">
    :
```

上記のコードブロックの直前に、下記のコードを追加します。

```jsx
// index.js
useEffect(() => {
  getCandyMachineState();
}, []);
```

`getCandyMachineState` の関数に入る前に、`getProvider` というもう 1 つの関数を設定する必要があります。

一般的には新しい Provider オブジェクトを作成します。

`provider` は、Web アプリケーションが Solana ブロックチェーンと通信するためのもので、クライアントに Solana への接続とウォレットの認証情報を与え、Solana 上のプログラムと通信が可能になります。

下記の通り `useEffect` 関数の上に `getProvider` を追加します。

```jsx
// index.js
const getProvider = () => {
  const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST;
  // connectionオブジェクトを作成
  const connection = new Connection(rpcHost);

  // 新しくSolanaのprovider オブジェクトを作成する
  const provider = new Provider(
    connection,
    window.solana,
    opts.preflightCommitment
  );

  return provider;
};
```

さて、`getCandyMachineState` に戻ります。

`getProvider` の下のどこかに作成します。外観は次のとおりです。

```jsx
// index.js
// getCandyMachineStateを非同期の関数として宣言する。
const getCandyMachineState = async () => {
  const provider = getProvider();

  //  デプロイされたCandy Machineプログラムのメタデータを取得する
  const idl = await Program.fetchIdl(candyMachineProgram, provider);

  // 呼び出し可能なプログラムを作成する
  const program = new Program(idl, candyMachineProgram, provider);

  // Candy Machineからメタデータを取得する
  const candyMachine = await program.account.candyMachine.fetch(
    process.env.REACT_APP_CANDY_MACHINE_ID
  );

  //メタデータをすべて解析してログアウトする
  const itemsAvailable = candyMachine.data.itemsAvailable.toNumber();
  const itemsRedeemed = candyMachine.itemsRedeemed.toNumber();
  const itemsRemaining = itemsAvailable - itemsRedeemed;
  const goLiveData = candyMachine.data.goLiveDate.toNumber();
  const presale =
    candyMachine.data.whitelistMintSettings &&
    candyMachine.data.whitelistMintSettings.presale &&
    (!candyMachine.data.goLiveDate ||
      candyMachine.data.goLiveDate.toNumber() > new Date().getTime() / 1000);

  // これは後でUIで使用するので、今すぐ生成しましょう
  const goLiveDateTimeString = `${new Date(goLiveData * 1000).toUTCString()}`;

  console.log({
    itemsAvailable,
    itemsRedeemed,
    itemsRemaining,
    goLiveData,
    goLiveDateTimeString,
    presale,
  });
};
```

詳細を確認していきましょう。

```jsx
// index.js
//デプロイされたCandy Machineプログラムに関するメタデータを取得します
const idl = await Program.fetchIdl(candyMachineProgram, provider);
//呼び出すことができるプログラムを作成します
const program = new Program(idl, candyMachineProgram, provider);
```

Candy Machine と通信するためには、**`IDL` と `Program` オブジェクトの 2 つが必要です。**

`IDL` には、Web アプリケーションが Candy Machine と通信するために必要な情報が含まれています。

`Program` は、実際に Candy Machine と直接やりとりするためのオブジェクトです。

私たちが構築した Candy Machine は、Metaplex 上に存在する Solana のプログラムに過ぎません。

Solana 上にあるほかのプログラムと同じように、Candy Machine を操作できます。

Program オブジェクトを作成したら、Candy Machine の ID にもとづいてメタデータを取得します。

この行では、Candy Machine のプログラムの fetch メソッドを呼び出し、`itemsAvailable`, `itemsRedeemed`, `itemsRemaining`, `goLiveDate` を返しています。

```jsx
// index.js
//Candy Machineからメタデータを取得します
const candyMachine = await program.account.candyMachine.fetch(
  process.env.REACT_APP_CANDY_MACHINE_ID
);
//すべてのメタデータを解析してログアウトします
const itemsAvailable = candyMachine.data.itemsAvailable.toNumber();
const itemsRedeemed = candyMachine.itemsRedeemed.toNumber();
const itemsRemaining = itemsAvailable - itemsRedeemed;
const goLiveData = candyMachine.data.goLiveDate.toNumber();
const presale =
  candyMachine.data.whitelistMintSettings &&
  candyMachine.data.whitelistMintSettings.presale &&
  (!candyMachine.data.goLiveDate ||
    candyMachine.data.goLiveDate.toNumber() > new Date().getTime() / 1000);
```

ここで `fetch` を実行すると、 **Solana Devnet** へアクセスしてこのデータを取得します。

### 🧠 CandyMachine コンポーネントをレンダリングする

`CandyMachine` コンポーネントをレンダリングしてみましょう。

`CandyMachine` コンポーネントの一番下までスクロールすると、`return` の下にたくさんのものがレンダリングされていることがわかります。

`app/src/App.js` に移動し、`CandyMachine` をインポートします。

```jsx
// App.js
import React, { useEffect, useState } from "react";
import "./App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import CandyMachine from "./CandyMachine";
```

下記の通り、ユーザーのウォレットアドレスが state にあれば、`CandyMachine` をレンダリングするよう記載してください。

```jsx
// App.js
return (
  <div className="App">
    <div className="container">
      <div className="header-container">
        <p className="header">🍭 Candy Drop</p>
        <p className="sub-text">NFT drop machine with fair mint</p>
        {!walletAddress && renderNotConnectedContainer()}
      </div>
      {/* walletAddressを確認してから、walletAddressを渡します*/}
      {walletAddress && <CandyMachine walletAddress={window.solana} />}
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
```

`window.solana` を `CandyMachine` に渡す方法に注目してください。

### 🍪 取得したデータをレンダリングする

`index.js` で `CandyMachine` を宣言したコードの直下に下記のコードを追加しましょう。

```jsx
// index.js
const CandyMachine = ({ walletAddress }) => {
  // 追加するコード
  const [candyMachine, setCandyMachine] = useState(null);
```

ここでは、`candyMachine` の状態を保持する変数と、状態を更新する関数（`setCandyMachine`）を初期化しています。

ページを更新するとすぐに `CandyMachine` の `useEffect` が起動するはずです。

先に進んでページを更新すると、コンソールに次のようなものが表示されます。

![無題](/public/images/302-Solana-NFT-Drop/section3/3_1_2.png)

Solana の devnet からデータを取得できました。

※` goLiveDateTimeString` は異なって見える場合があります。mint したユーザーのローカルタイムゾーンでデータをレンダリングする場合は、`index.js` ファイルより、`getCandyMachineState` の ` goLiveDateTimeString` を下記のように変更します。

```jsx
// index.js
const goLiveDateTimeString = `${new Date(
  goLiveData * 1000
).toLocaleDateString()} @ ${new Date(goLiveData * 1000).toLocaleTimeString()}`;
```

Web アプリケーションにアクセスすると、すでにレンダリングされているものがいくつか表示されますが、実際のデータはレンダリングされていません。

したがって、データを表示するために、Candy Machine の統計を状態変数に保持しましょう。

先に進み、 `app / src / CandyMachine / index.js` の `CandyMachine` コンポーネントに `useState` をインポートしてから、次のコードを追加します。

```jsx
// index.js
// useStateをインポートする
import React, { useEffect, useState } from 'react';

...

const CandyMachine({walletAddress}) => {
  // コンポーネント内にstateプロパティを追加します。
  const [candyMachine, setCandyMachine] = useState(null);

  ...

  const getCandyMachineState = async () => {
    const provider = getProvider();
    const idl = await Program.fetchIdl(candyMachineProgram, provider);
    const program = new Program(idl, candyMachineProgram, provider);
    const candyMachine = await program.account.candyMachine.fetch(
      process.env.REACT_APP_CANDY_MACHINE_ID
    );

    const itemsAvailable = candyMachine.data.itemsAvailable.toNumber();
    const itemsRedeemed = candyMachine.itemsRedeemed.toNumber();
    const itemsRemaining = itemsAvailable - itemsRedeemed;
    const goLiveData = candyMachine.data.goLiveDate.toNumber();

    const presale =
    candyMachine.data.whitelistMintSettings &&
    candyMachine.data.whitelistMintSettings.presale &&
    (!candyMachine.data.goLiveDate ||
    candyMachine.data.goLiveDate.toNumber() > new Date().getTime() / 1000);

    const goLiveDateTimeString = `${new Date(
      goLiveData * 1000
    ).toUTCString()}`

    // このデータをstateに追加してレンダリングする
    setCandyMachine({
      id: process.env.REACT_APP_CANDY_MACHINE_ID,
      program,
      state: {
        itemsAvailable,
        itemsRedeemed,
        itemsRemaining,
        goLiveData,
        goLiveDateTimeString,
        isSoldOut: itemsRemaining === 0,
        isActive:
          (presale ||
            candyMachine.data.goLiveDate.toNumber() < new Date().getTime() / 1000) &&
          (candyMachine.endSettings
            ? candyMachine.endSettings.endSettingType.date
              ? candyMachine.endSettings.number.toNumber() > new Date().getTime() / 1000
              : itemsRedeemed < candyMachine.endSettings.number.toNumber()
            : true),
        isPresale: presale,
        goLiveDate: candyMachine.data.goLiveDate,
        treasury: candyMachine.wallet,
        tokenMint: candyMachine.tokenMint,
        gatekeeper: candyMachine.data.gatekeeper,
        endSettings: candyMachine.data.endSettings,
        whitelistMintSettings: candyMachine.data.whitelistMintSettings,
        hiddenSettings: candyMachine.data.hiddenSettings,
        price: candyMachine.data.price,
      },
    });

    console.log({
      itemsAvailable,
      itemsRedeemed,
      itemsRemaining,
      goLiveData,
      goLiveDateTimeString,
    });
  };
}
```

状態変数を作成してから、`setCandyMachine` を呼び出してデータを設定しました。

ここでいくつかのデータをレンダリングできます。下記の通り UI コードをレンダリング関数に追加します。( `index.js` ファイルのほぼ最後の return 部分を修正します!　)

```jsx
// index.js
// candyMachineが利用可能な場合のみ表示されます
return candyMachine ? (
  <div className="machine-container">
    <p>{`Drop Date: ${candyMachine.state.goLiveDateTimeString}`}</p>
    <p>{`Items Minted: ${candyMachine.state.itemsRedeemed} / ${candyMachine.state.itemsAvailable}`}</p>
    <button className="cta-button mint-button" onClick={null}>
      Mint NFT
    </button>
  </div>
) : null
```

これで、Web アプリケーションに適切にレンダリングされたすべてのデータが表示されます。

最低限のスタイルを加えた `CandyMachine.css` ファイルを提供しています。色やフォントを変えるだけでもよいので、CSS を触ってみてください。くれぐれもデフォルトのままで終わらないように!

本レッスンは終了です。

現時点では、`MintNFT` ボタンをクリックしても何も起こりません。

次レッスンではこのボタンのロジックを構築し、NFT を作成するように設定します。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#section-3` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 3 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンに進んで、NFT の Mint 機能を実装していきましょう 🎉

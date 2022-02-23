🐰 WEBアプリから NFT キャラクターを Mint する
--------------------------------

前回のレッスンでは、WEBアプリからユーザーのウォレットアドレスにアクセスする機能を実装しました。

これから、WEBアプリから、コントラクトを呼び出し NFT キャラクターを Mint する機能を実装していきます。

下記に、WEBアプリのレンダリングロジックを記します。

**シナリオ1. ユーザーがWEBアプリにログインしていない場合**

	👉 WEBアプリ上に、"Connect Wallet to Get Started" ボタンを表示します。

**シナリオ2. ユーザーはWEBアプリにログインしており、かつ NFT キャラクターを持っていない場合**

	👉 WEBアプリ上に、`SelectCharacter` コンポーネントを表示します。

**シナリオ3. ユーザーはWEBアプリにログインしており、かつ NFT キャラクターを持っている場合**

	👉 WEBアプリ上に、「Arena Component」を表示します。

		- 「Arena Component」は、プレイヤーがボスと戦う場所です。

それでは、上記のシナリオを実装するロジックを構築していきましょう。

🧱 `SelectCharacter` コンポーネントを作る
----

ターミナルに向かい、`nft-game-starter-project/src/Components/SelectCharacter` フォルダに移動してください。

`nft-game-starter-project` ディレクトリ上で下記を実行すると、スムーズに移動できます。

```bash
cd src/Components/SelectCharacter
```

`SelectCharacter` の中に、`SelectCharacter` コンポーネントのロジックと、スタイルを保存していきます。

それでは、`SelectCharacter` フォルダの中に `index.js` というファイルを新しく作成しましょう。

ターミナル上で、`SelectCharacter` フォルダにいる状態で、下記を実行すると、`index.js` が簡単に作成できます。

```bach
touch index.js
```

VS Code で `index.js` を開いて、下記のコードをは貼り付けましょう。

```javascript
// index.js
import React, { useEffect, useState } from 'react';
import './SelectCharacter.css';
// setCharacterNFTについては、あとで詳しく説明します。
const SelectCharacter = ({ setCharacterNFT }) => {
  return (
    <div className="select-character-container">
        <h2>⏬ 一緒に戦う NFT キャラクターを選択 ⏬</h2>
    </div>
  );
};
export default SelectCharacter;
```

`index.js` が更新できたら、`App.js` を編集して、条件つきレンダリングを実装していきます。

👁 レンダリングロジックを構築してシナリオを実装する
----

まず、`nft-game-starter-project/src/App.js` ファイルを VS Code で開き、新しく作成したコンポーネントをインポートしていきましょう。

`import './App.css';` の直下に下記を追加してください。

```javascript
// App.js
// SelectCharacter に入っているファイルをインポートします。
import SelectCharacter from './Components/SelectCharacter';
```
この処理により、`SelectCharacter` に入っているファイル（`index.js` と `SelectCharacter.css` ）を `App.js` から呼び出せるようになります。

次に、下記のコードを ` const [currentAccount, setCurrentAccount] = useState(null)` の直下に追加しましょう。

```javascript
// App.js
// characterNFT と setCharacterNFT を初期化します。
const [characterNFT, setCharacterNFT] = useState(null);
```

ここでは、`characterNFT` と `setCharacterNFT` という状態変数を初期化しています。

これらの変数は、これから実装するシナリオの中で使用します。詳しくは、後で説明します。

次に、下記のシナリオを `App.js` に実装していきます。

**シナリオ1. ユーザーがWEBアプリにログインしていない場合**

	👉 WEBアプリ上に、"Connect Wallet to Get Started" ボタンを表示します。

**シナリオ2. ユーザーはWEBアプリにログインしており、かつ NFT キャラクターを持っていない場合**

	👉 WEBアプリ上に、`SelectCharacter` コンポーネントを表示します。


まず、`renderContent` という名前のレンダリング関数を作成します。

`renderContent` 関数に、すべてのシナリオを実装するロジックを記載していきます。

`checkIfWalletIsConnected` を宣言したコードブロックの直下に下記を追加しましょう。


```javascript
// App.js
// レンダリングメソッド
const renderContent = () => {
  // シナリオ1.
  // ユーザーがWEBアプリにログインしていない場合、WEBアプリ上に、"Connect Wallet to Get Started" ボタンを表示します。
  if (!currentAccount) {
    return (
      <div className="connect-wallet-container">
        <img
            src="https://i.imgur.com/yMocj5x.png"
            alt="Pickachu"
        />
        <button
          className="cta-button connect-wallet-button"
          onClick={connectWalletAction}
        >
          Connect Wallet to Get Started
        </button>
      </div>
    );
  	// シナリオ2.
	// ユーザーはWEBアプリにログインしており、かつ NFT キャラクターを持っていない場合、WEBアプリ上に、を表示します。
  } else if (currentAccount && !characterNFT) {
    return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
  }
};
```
最後に、`renderContent` メソッドを呼び出していきましょう。

`App.js` の中にある HTML の部分（ `return()` で囲まれている部分）を下記のように書き換えてください。

```javascript
// App.js
return (
  <div className="App">
    <div className="container">
      <div className="header-container">
      	<p className="header gradient-text">⚡️ METAVERSE GAME ⚡️</p>
        <p className="sub-text">プレイヤーと協力してボスを倒そう✨</p>
        {/* renderContent メソッドを呼び出します。*/}
        {renderContent()}
      </div>
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
```

🤓 WEBアプリ上でシナリオをテストする。

それでは、シナリオ 1 と 2 がそれぞれ機能しているか、テストしていきましょう。

**シナリオ1. ユーザーがWEBアプリにログインしていない場合**

	👉 WEBアプリ上に、"Connect Wallet to Get Started" ボタンを表示します。


まず、ターミナル上で `nft-game-starter-project` ディレクトリに移動し、下記を実行しましょう。

```bash
npm run start
```

ローカルサーバーでWEBサイトを立ち上げたら、ブラウザの Metamask のプラグインをクリックし、あなたのウォレットアドレスの接続状況を確認しましょう。

もし、下図のように `Connected` と表示されている場合は、`Connected` の文字をクリックします。
![](/public/images/ETH-NFT-game/section-3/3_3_1.png)

そこで、WEBサイトとあなたのウォレットアドレスの接続を一度解除します。

- `Disconnect this account` を選択してください。

![](/public/images/ETH-NFT-game/section-3/3_3_2.png)

ページをリフレッシュして、WEBアプリがどのように表示されるか見てみましょう。

下記のように、`Connect Wallet to Get Started` ボタンが画面の中央に表示されていれば、シナリオ 1 のテストは成功です。
![](/public/images/ETH-NFT-game/section-3/3_3_3.png)


次に、シナリオ 2 をテストしていきます。

**シナリオ2. ユーザーはWEBアプリにログインしており、かつ NFT キャラクターを持っていない場合**

	👉 WEBアプリ上に、`SelectCharacter` コンポーネントを表示します。


WEBアプリ上で、`Connect Wallet to Get Started` ボタンを押すと、下記のように、Metamask のポップアップが表示されます。

![](/public/images/ETH-NFT-game/section-3/3_3_4.png)

`Next` ボタン、`Confirm` ボタンを押して、ログイン作業を行いましょう。

下記のような画面がWEBアプリに表示されていることを確認してください。
![](/public/images/ETH-NFT-game/section-3/3_3_5.png)

さらに、WEBアプリ上で右クリックを行い、`Inspect` をクリックしたら、`Console` に向かいましょう。

![](/public/images/ETH-NFT-game/section-3/3_3_6.png)

`Console` に下記のような結果が表示されていたら、シナリオ 2 のテストは成功です。

```
Connected 0x3a0a49fb3cf930e599f0fa7abe554dc18bd1f135
```

🙋‍♂️ 質問する
-------------------------------------------
ここまでの作業で何かわからないことがある場合は、Discordの`#section-3-help`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください✨
```
1. 何をしようとしていたか
2. エラー文をコピー&ペースト
3. エラー画面のスクリーンショット
```
-------------------------------------------
シナリオ 1 と 2 のテストが完了したら、次のレッスンに進みましょう🎉

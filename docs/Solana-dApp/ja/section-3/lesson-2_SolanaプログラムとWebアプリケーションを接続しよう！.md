### ✅ Devnet でテストを実行する

Anchorの設定がDevnetになっているため、Devnet上で直接テストを実行できます。

実際に、関数がDevnet上で正しく機能していることを確認することもできます。

まずは、以下のコマンドを実行しましょう。

```
anchor test
```

問題なく実行されると、以下のように表示されます。

※ 資金不足のエラーが表示された場合は`solana airdrop 2`コマンドを実行してDevnetのSOLを取得します。

```
Deploy success

🚀 Starting test...
📝 Your transaction signature 5GL5bjhMDbUqmnVeA4pV7CoNfQWKG9FCLcYjeN7wTUu6DHhrERVi1CSMUUu16aGUs8YjCfj1MbP6H9p1EsTvGgRp
👀 GIF Count 0
👀 GIF Count 1
👀 GIF List [
  {
    gifLink: 'insert_a_gif_link_here',
    userAddress: PublicKey {
      _bn: <BN: f7b50263adfa281e3460f455e8c5fa3527b84a3b9d2bcc0fedaf69cc7786cbc>
    }
  }
]
```

[Solana Explorer](https://explorer.solana.com/?cluster=Devnet)にアクセスしてトランザクション履歴を確認してみましょう。

上記で実行したテストのトランザクションが確認できるはずです。

ここで、とても大切なことをお伝えします。

`anchor test`コマンドを実行すると、プログラムが再デプロイされ、スクリプト上の全ての関数が実行されます。

実は、Solanaプログラムは[アップグレード可能](https://docs.solana.com/cli/deploy-a-program#redeploy-a-program)です。

つまり、再デプロイすると、同じプログラムIDを更新して、デプロイしたプログラムの最新版を指すようになるということです。

また、プログラムがやりとりするアカウントは変わらずに残り、プログラムに関連するデータを保持してくれます。

簡単にまとめると、**保存されたデータを分離した状態でプログラムをアップグレード**することができます。

これは、一度デプロイされたスマートコントラクトの変更ができないEthereumとはまったく異なるものです。


### 🤟 IDL ファイルを Web アプリケーションに接続する

SolanaプログラムはDevnetにデプロイされました。

それでは続いて、SolanaプログラムとWebアプリケーションを接続してみましょう。

まず必要なのが、`anchor build`コマンドで生成された`idl`ファイルです。

`target/idl/myepicproject.json`がそのファイルとなっています。

`idl`ファイルは単なるJSONファイルで、関数の名前や受け取るパラメータなど、Solanaプログラムに関する情報を持っています。

このファイルは、デプロイされたプログラムと、Webアプリケーションがやり取りするのに役立ちます。

また、`target/idl/myepicproject.json`を確認すると、一番下にプログラムIDが指定されているのが分かると思います。

これは、Webアプリケーションが接続するプログラムを指定するものです。

`target/idl/myepicproject.json`の中身をすべてコピーし、Webアプリケーションを構築したディレクトリの下にある`src`の直下に`idl.json`ファイルを作成してください( `App.js`と同じディレクトリです)。

そこに`target/idl/myepicproject.json`の中身をすべて張り付けてください。

そして、`App.js`で読み込めるように、以下のとおり`import`文を追加してください。

追加する場所は`import './App.css';`のすぐ下でOKです。

```javascript
import idl from './idl.json';
```


### 👻 Phantom Wallet に資金を供給する

Solanaでは、アカウントのデータ読み込みは無料でできますが、アカウントを作成したりデータを追加したりするにはSOLが必要になります。

そのため、今回作成したWebアプリケーションで使用できるDevnet上のSOLをPhantom Walletに供給する必要があります。

このとき、Phantom Walletのアドレスが必要になるので、以下の画像を参考にウォレットアドレスをコピーしましょう。

![wallet address copy](/public/images/Solana-dApp/section-3/3_2_1.jpg)

次に、ターミナルから以下のコマンドを実行します。

※ `INSERT_YOUR_PHANTOM_PUBLIC_ADDRESS_HERE`に先ほどコピーしたPhantom Walletのアドレスを入れて実行してください。

```
solana airdrop 2 INSERT_YOUR_PHANTOM_PUBLIC_ADDRESS_HERE --url devnet
```

Phantom Walletを確認し、Devnetで2 SOLが入っていることを確認できれば完了です。


### 🍔 Web アプリケーションで Solana プロバイダをセットアップする

Solanaプロバイダーを設定するにあたり、Webアプリケーションに2つのパッケージをインストールする必要があります。

Anchorプロジェクトでもインストールしていますが、同じものをWebアプリケーションにもインストールしましょう。

ルートディレクトリで以下のコマンドを実行します。

```
npm install @project-serum/anchor @solana/web3.js
```

インストールしたパッケージをWebアプリケーションにインポートしましょう。

`App.js`の`import idl from './idl.json';`のすぐ下に以下のコードを追加します。

```javascript
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
```

続いて、`getProvider`関数を作成しましょう。

以下のコードを`onInputChange`関数のすぐ下に追加します。

```javascript
const getProvider = () => {
  const connection = new Connection(network, opts.preflightCommitment);
  const provider = new Provider(
    connection, window.solana, opts.preflightCommitment,
  );
	return provider;
}
```

ここでは、Solanaへの認証された接続である「プロバイダ」を作成しています。

プロバイダの作成にはWebアプリケーションに接続されたウォレットが必要です。

ここまでできたら、`npm run start`コマンドを実行して、ブラウザ上で動作を確認してみてください。

[Connect to Wallet]ボタンをクリックすると、Webアプリケーションに対し、ウォレットへのアクセスを許可することができます。

Phantom WalletはSolana上のプログラムと通信するためのプロバイダを作ることができるのです。

**ウォレットが接続されていないと、Solana と通信することができません。**

さて、それでは、まだ定義されていない変数を作成しましょう。

`App.js`を以下のとおり更新します。

```javascript
import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import { Connection, PublicKey, clusterApiUrl} from '@solana/web3.js';
import {
  Program, Provider, web3
} from '@project-serum/anchor';

import idl from './idl.json';

// SystemProgramはSolanaランタイムへの参照です。
const { SystemProgram, Keypair } = web3;

// GIFデータを保持するアカウントのキーペアを作成します。
let baseAccount = Keypair.generate();

// IDLファイルからプログラムIDを取得します。
const programID = new PublicKey(idl.metadata.address);

// ネットワークをDevnetに設定します。
const network = clusterApiUrl('devnet');

// トランザクションが完了したときに通知方法を制御します。
const opts = {
  preflightCommitment: "processed"
}


// その他の部分は変更しないでください。


```

`SystemProgram`は、Solanaを実行する[コアプログラム](https://docs.solana.com/developing/runtime-facilities/programs#system-program)への参照です。

`Keypair.generate()`は、プログラムのGIFデータを保持する`BaseAccount`アカウントを作成するために必要なパラメータを提供します。

`idl.metadata.address`でプログラムIDを取得し、`clusterApiUrl('Devnet')`を実行してDevnetへの接続を確認しています。

`preflightCommitment: "processed"`では、トランザクションが成功したときの確認を受け取るタイミングを選択しています。

今回は、接続しているノードに寄ってトランザクションが確認されるのを待ちます。

他の方法については[こちら](https://solana-labs.github.io/solana-web3.js/modules.html#Commitment)を参照してみてください。


### 🏈 プログラムのアカウントから GIF データを取得する

すべての準備が整いました。

アカウントを呼び出すためには、APIを呼び出すのと同じように「フェッチ」します。

`App.js`の以下の記述を覚えていますか？

```javascript
useEffect(() => {
  if (walletAddress) {
    console.log('Fetching GIF list...');

    // Solana チェーンからのフェッチ処理をここに記述します。

    // TEST_GIFSをgifListに設定します。
    setGifList(TEST_GIFS);
  }
}, [walletAddress]);
```

この記述を以下のように変更しましょう。

```javascript
const getGifList = async() => {
  try {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);

    console.log("Got the account", account)
    setGifList(account.gifList)

  } catch (error) {
    console.log("Error in getGifList: ", error)
    setGifList(null);
  }
}

useEffect(() => {
  if (walletAddress) {
    console.log('Fetching GIF list...');
    getGifList()
  }
}, [walletAddress]);
```


### 🔥 `startStuffOff`を呼び出してプログラムを初期化する

現段階では、`BaseAccount`が存在しないため、`startStuffOff`を呼び出してアカウントを初期化する必要があります。

以下の関数を`getProvider`関数の下に追加してください。

```javascript
const createGifAccount = async () => {
  try {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    console.log("ping")
    await program.rpc.startStuffOff({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount]
    });
    console.log("Created a new BaseAccount w/ address:", baseAccount.publicKey.toString())
    await getGifList();

  } catch(error) {
    console.log("Error creating BaseAccount account:", error)
  }
}
```

次に、以下の2つのケースを想定して`renderConnectedContainer`関数を変更しましょう。

1\. ウォレットを接続しているが、`BaseAccount`のアカウントが作成されていないため、初期化されたアカウントを作成するためのボタンを表示する。

2\. ウォレットを接続しているが、`BaseAccount`が存在していたので、`gifList`をレンダリングして、ユーザーがGitデータを送信できるようにする。

```jsx
const renderConnectedContainer = () => {
// プログラムアカウントが初期化されているかどうかチェックします。
  if (gifList === null) {
    return (
      <div className="connected-container">
        <button className="cta-button submit-gif-button" onClick={createGifAccount}>
          Do One-Time Initialization For GIF Program Account
        </button>
      </div>
    )
  }
	// アカウントが存在した場合、ユーザーはGIFを投稿することができます。
	else {
    return(
      <div className="connected-container">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            sendGif();
          }}
        >
          <input
            type="text"
            placeholder="Enter gif link!"
            value={inputValue}
            onChange={onInputChange}
          />
          <button type="submit" className="cta-button submit-gif-button">
            Submit
          </button>
        </form>
        <div className="gif-grid">
					{/* indexをキーとして使用し、GIFイメージとしてitem.gifLinkに変更しました。 */}
          {gifList.map((item, index) => (
            <div className="gif-item" key={index}>
              <img src={item.gifLink} />
            </div>
          ))}
        </div>
      </div>
    )
  }
}
```


### 🥳 テストする

さあ、テストしましょう!

ブラウザページを更新してウォレットを接続すると、[Do One-Time Initialization For GIF Program Account]ボタンが表示されます。

これをクリックすると、Phantom Walletがトランザクションの支払いを求めるプロンプトが表示されるので、[承認]ボタンをクリックしてください。

すべてがうまくいった場合は、コンソール上に以下のように表示されます。

![console](/public/images/Solana-dApp/section-3/3_2_2.jpg)

ここで作成したアカウントを取得しました。

ただし、このアカウントにはまだGIFを追加していないため、`gifList`は空です。

現段階では、ページを更新するたびに、もう一度アカウントを作成するように要求されてしまうという問題があります。

これは後で修正します。


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

次のレッスンで、Webアプリケーションを完成させます!

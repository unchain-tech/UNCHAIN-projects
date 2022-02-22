⏳ ドロップタイマーの作成
---

ドロップ開始日までのカウントダウンタイマーを追加してみましょう。

今のところ、日付を過去に設定しているので、「ドロップ」はすでに発生しています。`config.json` ファイルを開き、日付を未来のいつかに変更しましょう。

```
{
	"price": 0.1,
	"number": 3,
	"gatekeeper": null,
	"solTreasuryAccount": "7ZHKrJMoY3C92mZnQur3TEAfdiqPnTyM4suKANsh9uBk",
	"splTokenAccount": null,
	"splToken": null,
	"goLiveDate": "25 Jan 2023 00:00:00 GMT",
	"endSettings": null,
	"whitelistMintSettings": null,
	"hiddenSettings": null,
	"storage": "arweave",
	"ipfsInfuraProjectId": null,
	"ipfsInfuraSecret": null,
	"awsS3Bucket": null,
	"noRetainAuthority": false,
	"noMutable": false
}
```

`config.json` を修正を反映させるため、下記の`update_candy_machine` コマンドを入力してください。

```txt
ts-node ~/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts update_candy_machine -e devnet  -k ~/.config/solana/devnet.json -cp config.json
```

いずれかの時点で次のようなエラーが発生した場合:

```txt
/Users/任意のフォルダ名/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts:53
      return fs.readdirSync(`${val}`).map(file => path.join(val, file));
                      ^
TypeError: Cannot read property 'candyMachineAddress' of undefined
    at /Users/任意のフォルダ名/metaplex/js/packages/cli/src/candy-machine-cli.ts:649:53
    at step (/Users/任意のフォルダ名/metaplex/js/packages/cli/src/candy-machine-cli.ts:53:23)
    at Object.next (/Users/任意のフォルダ名/metaplex/js/packages/cli/src/candy-machine-cli.ts:34:53)
    at fulfilled (/Users/任意のフォルダ名/metaplex/js/packages/cli/src/candy-machine-cli.ts:25:58)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
```

上記はコマンドが Candy Machine と NFT 周辺の重要なデータを含む `.cache` フォルダにアクセスできないことを意味します。

`.cache` フォルダ、`assets` フォルダと同じディレクトリからコマンドを実行していることを確認してください。

カウントダウンタイマーを設定するにあたり、下記を実装します。

1. 現在の日付が、設定したドロップ日より以前の場合にのみ表示される

2. 1秒ごとにカウントダウンする「カウントダウン」スタイルのタイマーを実装

webアプリのコードをクリーンに保つために、タイマーの状態とロジックを処理する別のコンポーネントを作成します。

`src/CountdownTimer` フォルダを既に作成してあります。

( `CountdownTimer` 直下には `CountdownTimer.css` しかないはずです)

そこに `index.js` ファイルを作成し、次のコードを追加します。

```jsx
import React, { useEffect, useState } from 'react';
import './CountdownTimer.css';

const CountdownTimer = ({ dropDate }) => {
  // State
  const [timerString, setTimerString] = useState('');

  return (
    <div className="timer-container">
      <p className="timer-header">Candy Drop Starting In</p>
      {timerString && <p className="timer-value">{`⏰ ${timerString}`}</p>}
    </div>
  );
};

export default CountdownTimer;
```

ここでは、いくつかの状態を保持するシンプルなReactコンポーネントを設定し、`dropDate` を取り込みます。

先に進む前に、`app/src/CandyMachine/index.js` に移動して、このコンポーネントをインポートしましょう。

```jsx
import React, { useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import { MintLayout, TOKEN_PROGRAM_ID, Token } from '@solana/spl-token';
import { sendTransactions } from './connection';
import './CandyMachine.css';
import {
  candyMachineProgram,
  TOKEN_METADATA_PROGRAM_ID,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  getAtaForMint,
  getNetworkExpire,
  getNetworkToken,
  CIVIC
} from './helpers';
// 追加
import CountdownTimer from '../CountdownTimer';
```

カウントダウンタイマーをいつ表示するかを処理するロジックを実装します。

現在の日付がドロップ日の**前**である場合にのみ、このコンポーネントを表示します。ドロップ日時がすぎている場合は、ドロップ開始の日時を表示します。

`app/src/CandyMachine/index.js` の下部にコードを記述しましょう。

```jsx
// レンダリング関数を作成します
const renderDropTimer = () => {
  // JavaScriptのDateオブジェクトで現在の日付とDropDateを取得します
  const currentDate = new Date();
  const dropDate = new Date(candyMachine.state.goLiveData * 1000);

  //もし現在の日時がドロップ日よりも前の場合、カウントダウンコンポーネントをレンダリングします
  if (currentDate < dropDate) {
    console.log('Before drop date!');
    // ドロップ日を返します
    return <CountdownTimer dropDate={dropDate} />;
  }

  // 条件に満たない場合はドロップ日のみを返します
  return <p>{`Drop Date: ${candyMachine.state.goLiveDateTimeString}`}</p>;
};

return (
  candyMachine.state && (
    <div className="machine-container">
      {/* コンポーネントの最初に下記追加します */}
      {renderDropTimer()}
      <p>{`Items Minted: ${candyMachine.state.itemsRedeemed} / ${candyMachine.state.itemsAvailable}`}</p>
      <button
        className="cta-button mint-button"
        onClick={mintToken}
      >
        Mint NFT
      </button>
      {mints.length > 0 && renderMintedItems()}
      {isLoadingMints && <p>LOADING MINTS...</p>}
    </div>
  )
);
```

条件付きレンダリングを使用して、コンポーネントのレンダリング関数を
呼び出しています。

ページを更新して、UI が反映されているか確認しましょう。

`CountdownTimer` コンポーネントに戻って、残りのロジック設定を取得できます。タイマーのカウントダウンをリアルタイムで確認したいと思います。

```jsx
// useEffectはコンポーネントのロード時に実行されます。
useEffect(() => {
  console.log('Setting interval...');

  // setIntervalを使用して、このコードの一部を1秒ごとに実行します。
  const interval = setInterval(() => {
    const currentDate = new Date().getTime();
    const distance = dropDate - currentDate;

    // 時間の計算をするだけで、さまざまなプロパティを得ることができます
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // 得られた出力結果を設定します
    setTimerString(`${days}d ${hours}h ${minutes}m ${seconds}s`);

    // distanceが0になったらドロップタイムが来たことを示します
    if (distance < 0) {
      console.log('Clearing interval...');
      clearInterval(interval);
    }
  }, 1000);

  // コンポーネントが取り外されたときには、intervalを初期化しましょう。
  return () => {
    if (interval) {
      clearInterval(interval);
    }
  };
}, []);
```

以上です。

シンプルなカウントダウンタイマーを実装しました。

![無題](/public/images/Solana-NFT-mint/section4/4_1_1.png)

📭「売り切れ」状態を構築する
---

全ての NFT をミントしきった際、「Sold Out」を表示する機能を実装します。

これは、`candyMachine.state` プロパティの `itemsRedeemed` と `itemsAvailable` の2つのプロパティをチェックすることで実装が可能になります。

加えて、ミントするアイテムがあり、NFT ドロップ日に達した場合にのみ、ミントボタンを表示するようにします。

`CandyMachine` コンポーネントのレンダリング関数を修正しましょう。以下を追加します。

```jsx
return (
  candyMachine && candyMachine.state && (
    <div className="machine-container">
      {renderDropTimer()}
      <p>{`Items Minted: ${candyMachine.state.itemsRedeemed} / ${candyMachine.state.itemsAvailable}`}</p>
        {/* プロパティが等しいかチェックします */}
        {candyMachine.state.itemsRedeemed === candyMachine.state.itemsAvailable ? (
          <p className="sub-text">Sold Out 🙊</p>
        ) : (
          <button
            className="cta-button mint-button"
            onClick={mintToken}
            disabled={isMinting}
          >
            Mint NFT
          </button>
        )}
    </div>
  )
);
```

実装完了です。

![無題](/public/images/Solana-NFT-mint/section4/4_1_2.png)

🙋‍♂️ 質問する
-------------------------------------------
ここまでの作業で何かわからないことがある場合は、Discord の `#section-4-help` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください✨
```
1. 何をしようとしていたか
2. エラー文をコピー&ペースト
3. エラー画面のスクリーンショット
```

------
次のレッスンに進んで、他の機能をWEBアプリを完成させましょう🎉

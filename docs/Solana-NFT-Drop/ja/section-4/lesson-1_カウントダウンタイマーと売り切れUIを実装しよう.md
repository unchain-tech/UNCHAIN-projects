### ⏳ ドロップタイマーの作成

ドロップ開始日までのカウントダウンタイマーを追加してみましょう。

今のところ、日付を過去に設定しているので、「ドロップ」はすでに発生しています。`config.json`ファイルを開き、`startDate`を未来の日付に変更しましょう。

```json
// config.json
  "guards": {
    "default": {
      "solPayment": {
        "value": 0.1,
        "destination": "WALLET_ADDRESS_TO_PAY_TO"
      },
      "startDate": {
        "date": "2024-01-01T00:00:00Z"
      }
    }
  }
```

`config.json`を修正を反映させるため、下記のコマンドを実行しましょう。

```bash
sugar guard update
```

次のようなエラーが発生した場合は以下のように対応してください。

```bash
🛑 Error running command (re-run needed): Cache file 'cache.json' not found. Run `sugar upload` to create it or provide it with the --cache option.
```

上記はコマンドがCandy MachineとNFT周辺の重要なデータを含む`cache.json`ファイルにアクセスできないことを意味します。

Solana-NFT-Dropフォルダのルートに存在する`cache.json`ファイル、`assets`フォルダと同じディレクトリからコマンドを実行していることを確認してください。

設定が反映されていることを`sugar guard show`コマンドで確認しましょう。start dateが更新されていたら再設定は完了です。

カウントダウンタイマーを設定するにあたり、下記を実装します。

- 設定したドロップ日が、現在の日時より先（未来）の場合にのみ表示される

- 1秒ごとにカウントダウンする「カウントダウン」スタイルのタイマーを実装

Webアプリケーションのコードをクリーンに保つため、タイマーの状態とロジックを処理する別のコンポーネントを作成します。

`components/CountdownTimer`フォルダをすでに作成してあります。

そこに`index.tsx`ファイルを作成し、次のコードを追加します。

```jsx
// CountdownTimer/index.tsx
import { useEffect, useState } from 'react';

import CountdownTimerStyles from './CountdownTimer.module.css';

type CountdownTimerProps = {
  dropDate: Date;
};

const CountdownTimer = (props: CountdownTimerProps) => {
  const { dropDate } = props;

  // State
  const [timerString, setTimerString] = useState('');

  return (
    <div className={CountdownTimerStyles.timerContainer}>
      <p className={CountdownTimerStyles.timerHeader}>
        {' '}
        Candy Drop Starting In{' '}
      </p>
      {timerString && (
        <p className={CountdownTimerStyles.timerValue}>
          {' '}
          {`⏰ ${timerString}`}{' '}
        </p>
      )}
    </div>
  );
};

export default CountdownTimer;
```

ここでは、タイマーに表示する日時を保持するステートを持つシンプルなReactコンポーネントを設定し、`dropDate`を取り込みます。

先へ進む前に、`components/CandyMachine/index.tsx`に移動して、このコンポーネントをインポートしましょう。

```jsx
// CandyMachine/index.tsx
// 追加
import CountdownTimer from '@/components/CountdownTimer';
```

カウントダウンタイマーをいつ表示するかを処理するロジックを実装します。

現在の日付がドロップ日の**前**である場合にのみ、CountdownTimerコンポーネントを表示します。ドロップ日時がすぎている場合は、ドロップ開始の日時を表示します。

`mintToken`関数の下に下記の関数を記述しましょう。

```jsx
// CandyMachine/index.tsx
// レンダリング関数を作成します。
const renderDropField = (candyMachine: CandyMachineType, startDate: Option<StartDateType>) => {
  if (startDate.__option === 'None') {
    return;
  }
  // JavaScriptのDateオブジェクトで現在の日付とDropDateを取得します。
  const currentDate = new Date();
  const dropDate = new Date(Number(startDate.value.date) * 1000);

  // 現在の日付がドロップ日よりも前の場合、CountdownTimerコンポーネントをレンダリングします。
  if (currentDate < dropDate) {
    return <CountdownTimer dropDate={dropDate} />;
  }

  // 現在の日付がドロップ日よりも後の場合、ドロップ日をレンダリングします。
  return (
    <>
      <p>{`Drop Date: ${dropDate}`}</p>
      <p>
        {' '}
        {`Items Minted: ${candyMachine.itemsRedeemed} / ${candyMachine.data.itemsAvailable}`}
      </p>
      {
        <button
          className={`${styles.ctaButton} ${styles.mintButton}`}
          onClick={mintToken}
          disabled={isMinting}
        >
          Mint NFT
        </button>
      }
    </>
  );
};
```

[Mint NFT]ボタンのレンダリングを、ドロップ日になったら表示するようにしました。

return文を下記の内容で更新して、`renderDropField`関数を呼び出すようにしましょう。

```jsx
// CandyMachine/index.tsx
return (
  candyMachine && (
    candyGuard && (
      <div className={candyMachineStyles.machineContainer}>
        {renderDropField(candyMachine, candyGuard.guards.startDate)}
      </div>
    )
  )
);
```

条件付きレンダリングを使用して、コンポーネントのレンダリング関数を
呼び出しています。

ページを更新して、UIが反映されているか確認しましょう。

`CountdownTimer`コンポーネントに戻って、残りのロジックを実装します。タイマーのカウントダウンをリアルタイムで確認できるようにしましょう。

下記のコードをuseState定義の下に追加しましょう。

```jsx
// CountdownTimer/index.tsx
const [timerString, setTimerString] = useState('');

// 下記を追加します。
// useEffectはコンポーネントのロード時に実行されます。
useEffect(() => {
  // setIntervalを使用して、このコードの一部を1秒ごとに実行します。
  const intervalId = setInterval(() => {
    const currentDate = new Date().getTime();
    const distance = dropDate.getTime() - currentDate;

    // 時間の計算をするだけで、さまざまなプロパティを得ることができます。
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // 得られた出力結果を設定します。
    setTimerString(`${days}d ${hours}h ${minutes}m ${seconds}s`);

    // distanceが0になったらドロップタイムが来たことを示します。
    if (distance < 0) {
      clearInterval(intervalId);
      setTimerString('');
    }
  }, 1000);

  // コンポーネントが取り外されたときには、intervalを初期化しましょう。
  return () => {
    if (intervalId) {
      clearInterval(intervalId);
      setTimerString('');
    }
  };
}, []);
```

以上です。

シンプルなカウントダウンタイマーを実装しました。

![無題](/public/images/Solana-NFT-Drop/section-4/4_1_1.png)

### 📭「売り切れ」状態を構築する

すべてのNFTをミントしきった際、「Sold Out」を表示する機能を実装します。

これは、`candyMachine`の`itemsRedeemed`と`data.itemsAvailable`の2つのプロパティをチェックすることで実装が可能になります。

`CandyMachine`コンポーネントのレンダリング関数を修正しましょう。renderDropField関数内最後のreturn文を下記のように更新します。

```jsx
// CandyMachine/index.tsx
const renderDropField = (candyMachine: CandyMachineType, startDate: Option<StartDateType>) => {

  ...

  // 現在の日付がドロップ日よりも後の場合、ドロップ日をレンダリングします。
  return (
    <>
      <p>{`Drop Date: ${dropDate}`}</p>
      <p>
        {' '}
        {`Items Minted: ${candyMachine.itemsRedeemed} / ${candyMachine.data.itemsAvailable}`}
      </p>
      {
        {/* プロパティが等しいかチェックします */}
        candyMachine.itemsRedeemed === candyMachine.data.itemsAvailable ? (
          <p className={styles.subText}>Sold Out 🙊</p>
        ) : (
          <button
            className={`${styles.ctaButton} ${styles.mintButton}`}
            onClick={mintToken}
            disabled={isMinting}
          >
            Mint NFT
          </button>
        )
      }
    </>
  );
};
```

`candyMachine.itemsRedeemed === candyMachine.data.itemsAvailable`の条件に一致した場合は"Sold Out 🙊"をレンダリングします。そうでない場合は、[Mint NFT]ボタンをレンダリングするようにコードを更新しました。

実装完了です。

![無題](/public/images/Solana-NFT-Drop/section-4/4_1_2.png)

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#solana`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンに進んで、ほかの機能をWebアプリケーションを完成させましょう 🎉

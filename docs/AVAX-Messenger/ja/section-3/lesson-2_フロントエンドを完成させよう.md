### フロントエンドで管理者画面を設けよう

コントラクトに管理者機能をつけたので、フロントエンドでも利用できるようにしましょう。

追加するコードのロジックは今までと同じです。

それでは`client`に移動してください。

### 📁 `hooks`ディレクトリ

コントラクトに追加した機能を利用できるように、`useMessengerContract.ts`の中身を編集してきましょう。
基本的にコントラクトに追加した`owner`機能や`numOfPendingLimits`、`changeNumOfPendingLimits`を使用できるように変更しています。

`ReturnUseMessengerContract`の返り値の型を変更します。

```ts
// useMessengerContractの返すオブジェクトの型定義です。
type ReturnUseMessengerContract = {
  processing: boolean;
  ownMessages: Message[];
  owner: string | undefined;
  numOfPendingLimits: BigNumber | undefined;
  sendMessage: (props: PropsSendMessage) => void;
  acceptMessage: (index: BigNumber) => void;
  denyMessage: (index: BigNumber) => void;
  changeNumOfPendingLimits: (limits: BigNumber) => void;
};
```

`useMessengerContract`の冒頭に状態変数を追加します。

```ts
export const useMessengerContract = ({
  currentAccount,
}: PropsUseMessengerContract): ReturnUseMessengerContract => {
  const [processing, setProcessing] = useState<boolean>(false);
  const [messengerContract, setMessengerContract] = useState<MessengerType>();
  const [ownMessages, setOwnMessages] = useState<Message[]>([]);

  // 以下の2行を追加
  const [owner, setOwner] = useState<string>();
  const [numOfPendingLimits, setNumOfPendingLimits] = useState<BigNumber>();

  // ...
};
```

`useMessengerContract`内、関数の定義と実行を追加します。

```ts
export const useMessengerContract = ({
  currentAccount,
}: PropsUseMessengerContract): ReturnUseMessengerContract => {
  // ...

  async function denyMessage(index: BigNumber) {
    // ...
  }

  // 以下の関数を追加
  async function getOwner() {
    if (!messengerContract) return;
    try {
      console.log('call getter of owner');
      const owner = await messengerContract.owner();
      setOwner(owner.toLocaleLowerCase());
    } catch (error) {
      console.log(error);
    }
  }

  // 以下の関数を追加
  async function getNumOfPendingLimits() {
    if (!messengerContract) return;
    try {
      console.log('call getter of numOfPendingLimits');
      const limits = await messengerContract.numOfPendingLimits();
      setNumOfPendingLimits(limits);
    } catch (error) {
      console.log(error);
    }
  }

  // 以下の関数を追加
  async function changeNumOfPendingLimits(limits: BigNumber) {
    if (!messengerContract) return;
    try {
      console.log('call changeNumOfPendingLimits with [%d]', limits.toNumber());
      const txn = await messengerContract.changeNumOfPendingLimits(limits, {
        gasLimit: 300000,
      });
      console.log('Processing...', txn.hash);
      setProcessing(true);
      await txn.wait();
      console.log('Done -- ', txn.hash);
      setProcessing(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getMessengerContract();
    getOwnMessages();

    // 以下2行を追加
    getOwner();
    getNumOfPendingLimits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount, ethereum]);

  // ...
};
```

`useMessengerContract`内、イベントリスナの追加します。

```ts
export const useMessengerContract = ({
  currentAccount,
}: PropsUseMessengerContract): ReturnUseMessengerContract => {
  // ...

  useEffect(() => {
    // NewMessageのイベントリスナ
    const onNewMessage = () =>
      // ...
      {
        // ...
      };

    // MessageConfirmedのイベントリスナ
    const onMessageConfirmed = (receiver: string, index: BigNumber) => {
      // ...
    };

    // 以下の関数を追加
    // NumOfPendingLimitsChangedのイベントリスナ
    const onNumOfPendingLimitsChanged = (limitsChanged: BigNumber) => {
      console.log(
        'NumOfPendingLimitsChanged limits:[%d]',
        limitsChanged.toNumber()
      );
      setNumOfPendingLimits(limitsChanged);
    };

    /* イベントリスナーの登録をします */
    if (messengerContract) {
      messengerContract.on('NewMessage', onNewMessage);
      messengerContract.on('MessageConfirmed', onMessageConfirmed);

      // 追加
      messengerContract.on(
        'NumOfPendingLimitsChanged',
        onNumOfPendingLimitsChanged
      );
    }

    /* イベントリスナーの登録を解除します */
    return () => {
      if (messengerContract) {
        messengerContract.off('NewMessage', onNewMessage);
        messengerContract.off('MessageConfirmed', onMessageConfirmed);

        // 追加
        messengerContract.off(
          'NumOfPendingLimitsChanged',
          onNumOfPendingLimitsChanged
        );
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messengerContract]);

  // ...
};
```

`useMessengerContract`内、返り値の変更をします。

```ts
return {
  processing,
  ownMessages,
  owner,
  numOfPendingLimits,
  sendMessage,
  acceptMessage,
  denyMessage,
  changeNumOfPendingLimits,
};
```

### 📁 `components`ディレクトリ

📁 `form`ディレクトリ

`components/form`ディレクトリ内、
その中に`ChangeOwnerValueForm.tsx`という名前のファイルを作成してください。

`ChangeOwnerValueForm.tsx`内に以下のコードを記述してください。

```tsx
import { BigNumber } from 'ethers';
import { useState } from 'react';

import styles from './Form.module.css';

type Props = {
  processing: boolean;
  currentValue: BigNumber | undefined;
  changeValue: (limits: BigNumber) => void;
};

export default function ChangeOwnerValueForm({
  processing,
  currentValue,
  changeValue,
}: Props) {
  const [limits, setLimits] = useState<string>('0');

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.title}>
          Change number of pending messages limits !
        </div>
        {processing ? (
          <p>processing...</p>
        ) : (
          <p>current limits: {currentValue?.toNumber()}</p>
        )}

        <input
          type="number"
          name="limits_number"
          placeholder="limits"
          id="input_limits"
          min={0}
          className={styles.number}
          onChange={(e) => setLimits(e.target.value)}
        />

        <div className={styles.button}>
          <button
            onClick={() => {
              changeValue(BigNumber.from(limits));
            }}
          >
            change{' '}
          </button>
        </div>
      </div>
    </div>
  );
}
```

ここでは同じフォルダ内の`SendMessageForm.tsx`と同じようなフォームコンポーネントを作成しています。
管理者ページで使用されます。

引数で受け取る`currentValue`と`changeValue`は、それぞれ管理者が変更する値の、現在の値と値を変更をする関数です。
今回、管理者が変更する値はメッセージの保留数を指します。

後で実際に表示する画面を見ると、このフォームの構成する部分がわかりやすいと思います。

### 📁 `pages`ディレクトリ

`pages`ディレクトリ内に`OwnerPage.tsx`という名前のファイルを作成し、以下のコードを記述してください。

```tsx
import ChangeOwnerValueForm from '../components/form/ChangeOwnerValueForm';
import Layout from '../components/layout/Layout';
import RequireWallet from '../components/layout/RequireWallet';
import { useMessengerContract } from '../hooks/useMessengerContract';
import { useWallet } from '../hooks/useWallet';

export default function OwnerPage() {
  const { currentAccount, connectWallet } = useWallet();
  const { processing, owner, numOfPendingLimits, changeNumOfPendingLimits } =
    useMessengerContract({
      currentAccount: currentAccount,
    });

  return (
    <Layout>
      <RequireWallet
        currentAccount={currentAccount}
        connectWallet={connectWallet}
      >
        {owner === currentAccount ? (
          <ChangeOwnerValueForm
            processing={processing}
            currentValue={numOfPendingLimits}
            changeValue={changeNumOfPendingLimits}
          />
        ) : (
          <div>Unauthorized</div>
        )}
      </RequireWallet>
    </Layout>
  );
}
```

管理者ページを構成します。

`useMessengerContract`から取得した`numOfPendingLimits`と`changeNumOfPendingLimits`を
先ほど作成した`ChangeOwnerValueForm`に渡しています。

また、`owner`が現在接続しているアカウントと違う場合は`Unauthorized`というメッセージを表示します。

最後に`pages`ディレクトリ内の`index.tsx`を以下のように編集しましょう。

```tsx
import type { NextPage } from 'next';
import Link from 'next/link';

import Layout from '../components/layout/Layout';
import RequireWallet from '../components/layout/RequireWallet';
import { useMessengerContract } from '../hooks/useMessengerContract';
import { useWallet } from '../hooks/useWallet';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const { currentAccount, connectWallet } = useWallet();
  const { owner } = useMessengerContract({
    currentAccount: currentAccount,
  });

  return (
    <Layout home>
      <RequireWallet
        currentAccount={currentAccount}
        connectWallet={connectWallet}
      >
        <div className={styles.container}>
          <main className={styles.main}>
            <h1 className={styles.title}>Welcome to Messenger 📫</h1>
            <div className={styles.card}>
              <Link href="/message/SendMessagePage">
                <h2>send &rarr;</h2>
              </Link>
              <p>send messages and avax to other accounts</p>
            </div>

            <div className={styles.card}>
              <Link href="/message/ConfirmMessagePage">
                <h2>check &rarr;</h2>
              </Link>
              <p>Check messages from other accounts</p>
            </div>

            {owner === currentAccount && (
              <div className={styles.card}>
                <Link href="/OwnerPage">
                  <h2>owner &rarr;</h2>
                </Link>
                <p>Owner page</p>
              </div>
            )}
          </main>
        </div>
      </RequireWallet>
    </Layout>
  );
};

export default Home;
```

`OwnerPage.tsx`と同じように`owner`とユーザアカウントを照合して、
`owner`の場合は管理者画面である`OwnerPage`へリンクを表示します。

### 🖥️ web アプリを立ち上げましょう

それではターミナル上で以下のコマンドを走らせ、webアプリを立ち上げてください。

```
yarn client dev
```

ブラウザで http://localhost:3000 へアクセスします。

管理者のアカウントで接続した場合、以下のように画面が出力されるはずです。
`owner`リンクが増えています。

![](/public/images/AVAX-Messenger/section-3/3_2_1.png)

`owner`リンクをクリックし、管理者ページで値を入力し、メッセージの保留数上限を変更してみましょう。

![](/public/images/AVAX-Messenger/section-3/3_2_2.png)

トランザクションが完了し、`current limits`が変更したら
ブラウザのコンソールから、`Done`ではじまる行の値をコピーして、[AVASCAN testnet](https://testnet.avascan.info/blockchain/c/home)で履歴を確認してみましょう。
💁 コンソールを表示するには、ブラウザ上で`右クリック` -> `検証` -> `コンソール`を開きます。

![](/public/images/AVAX-Messenger/section-3/3_2_3.png)

### 🌔 参考リンク

> [こちら](https://github.com/unchain-tech/AVAX-Messenger)に本プロジェクトの完成形のレポジトリがあります。
>
> 期待通り動かない場合は参考にしてみてください。


### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#avalanche`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

おめでとうございます!
セクション3が終了しました!
`#avalanche`にあなたのAVASCANのリンクを貼り付けて、コミュニティで進捗を祝いましょう 🎉
webアプリが完成したら、次のレッスンに進みましょう 🎉

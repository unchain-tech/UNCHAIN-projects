### 📒 Web アプリケーションからスマートコントラクトを呼び出す

このレッスンでは、MetaMaskの認証機能を使用して、Webアプリケーションから実際にあなたのコントラクトを呼び出す機能を実装します。

`client`ディレクトリへ移動してください。

### 📁 `hooks`ディレクトリ

`hooks`ディレクトリ内の`useMessengerContract.ts`内を以下のコードに変更してください。
💁 現時点ではまだ用意していないファイルからimportしている箇所があるためエラーメッセージが出ても無視して大丈夫です。

```ts
import { BigNumber, ethers } from 'ethers';
import { useEffect, useState } from 'react';

import { Messenger as MessengerType } from '../typechain-types';
import { getEthereum } from '../utils/ethereum';
import abi from '../utils/Messenger.json';

const contractAddress = 'あなたのコントラクトのデプロイ先アドレス';
const contractABI = abi.abi;

export type Message = {
  sender: string;
  receiver: string;
  depositInWei: BigNumber;
  timestamp: Date;
  text: string;
  isPending: boolean;
};

// sendMessageの引数のオブジェクトの型定義です。
type PropsSendMessage = {
  text: string;
  receiver: string;
  tokenInEther: string;
};

// useMessengerContractの返すオブジェクトの型定義です。
type ReturnUseMessengerContract = {
  processing: boolean;
  ownMessages: Message[];
  sendMessage: (props: PropsSendMessage) => void;
};

// useMessengerContractの引数のオブジェクトの型定義です。
type PropsUseMessengerContract = {
  currentAccount: string | undefined;
};

export const useMessengerContract = ({
  currentAccount,
}: PropsUseMessengerContract): ReturnUseMessengerContract => {
  // トランザクションの処理中のフラグを表す状態変数。
  const [processing, setProcessing] = useState<boolean>(false);
  // Messengerコントラクトのオブジェクトを格納する状態変数。
  const [messengerContract, setMessengerContract] = useState<MessengerType>();
  // ユーザ宛のメッセージを配列で保持する状態変数。
  const [ownMessages, setOwnMessages] = useState<Message[]>([]);

  // ethereumオブジェクトを取得します。
  const ethereum = getEthereum();

  function getMessengerContract() {
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(
          ethereum as unknown as ethers.providers.ExternalProvider,
        );
        const signer = provider.getSigner();
        const MessengerContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        ) as MessengerType;
        setMessengerContract(MessengerContract);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getOwnMessages() {
    if (!messengerContract) return;
    try {
      const OwnMessages = await messengerContract.getOwnMessages();
      const messagesCleaned: Message[] = OwnMessages.map((message) => {
        return {
          sender: message.sender,
          receiver: message.receiver,
          depositInWei: message.depositInWei,
          timestamp: new Date(message.timestamp.toNumber() * 1000),
          text: message.text,
          isPending: message.isPending,
        };
      });
      setOwnMessages(messagesCleaned);
    } catch (error) {
      console.log(error);
    }
  }

  async function sendMessage({
    text,
    receiver,
    tokenInEther,
  }: PropsSendMessage) {
    if (!messengerContract) return;
    try {
      const tokenInWei = ethers.utils.parseEther(tokenInEther);
      console.log(
        'call post with receiver:[%s], token:[%s]',
        receiver,
        tokenInWei.toString()
      );
      const txn = await messengerContract.post(text, receiver, {
        gasLimit: 300000,
        value: tokenInWei,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount, ethereum]);

  useEffect(() => {
    // NewMessageのイベントリスナ
    const onNewMessage = (
      sender: string,
      receiver: string,
      depositInWei: BigNumber,
      timestamp: BigNumber,
      text: string,
      isPending: boolean
    ) => {
      console.log('NewMessage from %s to %s', sender, receiver);
      // 自分宛のメッセージの場合ownMessagesを編集します。
      // 各APIの使用によりアドレス英字が大文字小文字の違いが出る場合がありますが、その違いはアドレス値において区別されません。
      if (receiver.toLocaleLowerCase() === currentAccount) {
        setOwnMessages((prevState) => [
          ...prevState,
          {
            sender: sender,
            receiver: receiver,
            depositInWei: depositInWei,
            timestamp: new Date(timestamp.toNumber() * 1000),
            text: text,
            isPending: isPending,
          },
        ]);
      }
    };

    /* イベントリスナの登録をします */
    if (messengerContract) {
      messengerContract.on('NewMessage', onNewMessage);
    }

    /* イベントリスナの登録を解除します */
    return () => {
      if (messengerContract) {
        messengerContract.off('NewMessage', onNewMessage);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messengerContract]);

  return {
    processing,
    ownMessages,
    sendMessage,
  };
};
```

変更内容を見ていきましょう！

ファイル上部は必要な関数などのimportと、型定義をしています。
💁 現時点ではまだ用意していないファイルからimportしている箇所があるためエラーメッセージが出ても無視して大丈夫です。

```ts
export const useMessengerContract = ({
  currentAccount,
}: PropsUseMessengerContract): ReturnUseMessengerContract => {
  // ...

  function getMessengerContract() {
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(
          ethereum as unknown as ethers.providers.ExternalProvider,
        );
        const signer = provider.getSigner();
        const MessengerContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        ) as MessengerType;
        setMessengerContract(MessengerContract);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // ...
};
```

`getMessengerContract`はMessengerコントラクトのオブジェクトを取得する関数です。
内部で使用している関数について触れます。

**I\. `provider`**

> ```ts
> const provider = new ethers.providers.Web3Provider(
>   ethereum as unknown as ethers.providers.ExternalProvider,
> );
> ```
>
> ここでは、`provider` (= MetaMask) を設定しています。
> `provider`を介して、ユーザーはブロックチェーン上に存在するノードに接続することができます。
> MetaMask が提供するノードを使用して、デプロイされたコントラクトからデータを送受信するために上記の実装を行いました。
>
> `ethers`のライブラリにより`provider`のインスタンスを新規作成しています。

**II\. `signer`**

> ```ts
> const signer = provider.getSigner();
> ```
>
> `signer`は、ユーザーのウォレットアドレスを抽象化したものです。
>
> `provider`を作成し、`provider.getSigner()`を呼び出すだけで、ユーザーはウォレットアドレスを使用してトランザクションに署名し、そのデータを`C-Chain`ネットワークに送信することができます。
>
> `provider.getSigner()`は新しい`signer`インスタンスを返すので、それを使って署名付きトランザクションを送信することができます。

**III\. コントラクトインスタンス**

> ```ts
> const MessengerContract = new ethers.Contract(
>   contractAddress,
>   contractABI,
>   signer
> ) as MessengerType;
> ```
>
> ここで、**コントラクトへの接続を行っています。**
>
> コントラクトの新しいインスタンスを作成するには、以下 3 つの変数を`ethers.Contract`関数に渡す必要があります。
>
> 1. コントラクトのデプロイ先のアドレス
> 2. コントラクトの ABI
> 3. `provider`、もしくは`signer`
>
> コントラクトインスタンスでは、コントラクトに格納されているすべての関数を呼び出すことができます。
>
> もしこのコントラクトインスタンスに`provider`を渡すと、そのインスタンスは**読み取り専用の機能しか実行できなくなります**。
>
> 一方、`signer`を渡すと、そのインスタンスは**読み取りと書き込みの両方の機能を実行できるようになります**。
>
> ※ ABI については後ほど触れます。

コントラクトインスタンスを取得できたら状態変数にセットします。
`setMessengerContract(MessengerContract);`

```ts
// ユーザ宛のメッセージを全て取得します。
async function getOwnMessages() {
  if (!messengerContract) return;
  try {
    const OwnMessages = await messengerContract.getOwnMessages();
    const messagesCleaned: Message[] = OwnMessages.map((message) => {
      return {
        sender: message.sender,
        receiver: message.receiver,
        depositInWei: message.depositInWei,
        timestamp: new Date(message.timestamp.toNumber() * 1000),
        text: message.text,
        isPending: message.isPending,
      };
    });
    setOwnMessages(messagesCleaned);
  } catch (error) {
    console.log(error);
  }
}
```

`messengerContract.getOwnMessages();`のようにコントラクトの`getOwnMessages`関数を呼び出しています。

取得したメッセージ情報を`map`メソッドを用いフロントエンドで保持するデータ型に変換し、
`messagesCleaned`に格納します。
`messagesCleaned`を状態変数にセットします。

```ts
// コントラクトへメッセージを投稿します。
async function sendMessage({ text, receiver, tokenInEther }: PropsSendMessage) {
  if (!messengerContract) return;
  try {
    const tokenInWei = ethers.utils.parseEther(tokenInEther);
    console.log(
      'call post with receiver:[%s], token:[%s]',
      receiver,
      tokenInWei.toString()
    );
    const txn = await messengerContract.post(text, receiver, {
      gasLimit: 300000,
      value: tokenInWei,
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
```

`sendMessage`では引数を３つ受け取っていますが、これらはUIからユーザが入力した値が渡されます。

UIではトークンの単位は`ether`ですから、コントラクトに送信する前に`wei`へと変換しています。
該当箇所: `const tokenInWei = ethers.utils.parseEther(tokenInEther);`

テストの方で見覚えがあるかと思いますが、コントラクトの関数呼び出しには追加の引数`Overrides`を渡すことができます。

```ts
const txn = await messengerContract.post(text, receiver, {
  gasLimit: 300000,
  value: tokenInWei,
});
```

`value`は関数呼び出しと共に送信するトークンの量です。

`gasLimit`はトランザクションに使用できるガス代に制限を設けています。
これは、送金先のプログラムの問題などで、ずっと処理が実行され続けて、送金手数料の支払いが無限に発生する（「ガス量」が無限に大きくなる）ことを防ぐためのものです。
最大送金手数料はガス価格 × ガスリミットで計算されます。

最後にイベントリスナの設定について見ていきましょう。

```ts
useEffect(() => {
  // NewMessageのイベントリスナ
  const onNewMessage = (
    sender: string,
    receiver: string,
    depositInWei: BigNumber,
    timestamp: BigNumber,
    text: string,
    isPending: boolean
  ) => {
    console.log('NewMessage from %s to %s', sender, receiver);
    // 自分宛のメッセージの場合ownMessagesを編集します。
    // 各APIの使用によりアドレス英字が大文字小文字の違いが出る場合がありますが、その違いはアドレス値において区別されません。
    if (receiver.toLocaleLowerCase() === currentAccount) {
      setOwnMessages((prevState) => [
        ...prevState,
        {
          sender: sender,
          receiver: receiver,
          depositInWei: depositInWei,
          timestamp: new Date(timestamp.toNumber() * 1000),
          text: text,
          isPending: isPending,
        },
      ]);
    }
  };

  /* イベントリスナの登録をします */
  if (messengerContract) {
    messengerContract.on('NewMessage', onNewMessage);
  }

  /* イベントリスナの登録を解除します */
  return () => {
    if (messengerContract) {
      messengerContract.off('NewMessage', onNewMessage);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [messengerContract]);
```

`onNewMessage`はコントラクトから`NewMessage`が発せられた時に動くイベントリスナです。

引数で渡された各要素を元にフロントエンドで扱うデータ構造を作成し、`ownMessages`に追加しています。

`Contract.on('イベント名', イベントリスナ)`とすることでイベントリスナを登録することができます。
(🔗 参考リンク -> [ethers contract](https://docs.ethers.io/v5/api/contract/contract/#Contract--events))

登録が繰り返されることを防ぐため、クリーンアップ関数として解除を行っています。

### 🌵 スマートコントラクトの情報をフロントエンドに使えるようにしましょう

フロントエンド側をコントラクトを呼び出す準備をしたので、実際に使えるようにスマートコントラクトの情報を渡します。

📽️ コントラクトのアドレスをコピーする

前回のレッスンでコントラクトをデプロイし、このような出力がターミナルに表示されたのを覚えていますか？

```
Deploying contract with the account: 0xdf90d78042C8521073422a7107262D61243a21D0
Contract deployed at: 0xf531A6BCF3cD579f5A367cf45ff996dB1FC3beA1
Contract's fund is: BigNumber { value: "100" }
```

その時、`Contract deployed at:`の後に表示されたアドレスを
`client`ディレクトリ内、`hooks/useMessengerContract.ts`の中の以下の部分に貼り付けてください。

```ts
const contractAddress = 'あなたのコントラクトのデプロイ先アドレス';
```

例:

```ts
const contractAddress = '0xf531A6BCF3cD579f5A367cf45ff996dB1FC3beA1';
```

📽️ ABIファイルを取得する

> 📓 ABI (Application Binary Interface) はコントラクトの取り扱い説明書のようなものです。
> Web アプリケーションがコントラクトと通信するために必要な情報が、ABI ファイルに含まれています。
>
> コントラクト一つ一つにユニークな ABI ファイルが紐づいており、その中には下記の情報が含まれています。
>
> 1. そのコントラクトに使用されている関数の名前
> 2. それぞれの関数にアクセスするため必要なパラメータとその型
> 3. 関数の実行結果に対して返るデータ型の種類

ABIファイルは、コントラクトがコンパイルされた時に生成され、`artifacts`ディレクトリに自動的に格納されます。

`contract`からパスを追っていくと、`contract/artifacts/contracts/Messenger.sol/Messenger.json`というファイルが生成されているはずです。
これを`client`の中の`utils`ディレクトリ内にコピーしてください。
`AVAX-Messenger`直下からターミナルでコピーを行う場合、このようなコマンドになります。

```
$ cp ./packages/contract/artifacts/contracts/Messenger.sol/Messenger.json ./packages/client/utils/
```

📽️ 型定義ファイルを取得する

TypeScriptは静的型付け言語なので、外部から取ってきたオブジェクトの情報として型を知りたい場合があります。
その時に役に立つのが型定義ファイルです。

コントラクトの型定義ファイルは、コントラクトがコンパイルされた時に生成され、`typechain-types`ディレクトリに自動的に格納されます。
これは`npx hardhat init`実行時にtypescriptを選択したため、初期設定が済んでいるためです。

`contract`内の`typechain-types`ディレクトリをそのまま`client`にコピーしてください。
`AVAX-Messenger`直下からターミナルでコピーを行う場合、このようなコマンドになります。

```
$ cp -r ./packages/contract/typechain-types ./packages/client/
```

以上でコントラクトの情報を反映することができました。
`useMessengerContract.ts`内のファイル上部、import文もファイルを用意したのでエラーが消えているはずです。

### 🌞 web アプリを立ち上げて挙動を確認する

ここまでで作成した`useMessengerContract`を使うように2つのページを編集しましょう。
`client`ディレクトリ内を編集します。

📁 `message`ディレクトリ

`ConfirmMessagePage.tsx`内を以下のコードに変更してください。

```tsx
import MessageCard from '../../components/card/MessageCard';
import Layout from '../../components/layout/Layout';
import RequireWallet from '../../components/layout/RequireWallet';
import { useMessengerContract } from '../../hooks/useMessengerContract';
import { useWallet } from '../../hooks/useWallet';

export default function ConfirmMessagePage() {
  const { currentAccount, connectWallet } = useWallet();
  const { ownMessages, processing } = useMessengerContract({
    currentAccount: currentAccount,
  });

  return (
    <Layout>
      <RequireWallet
        currentAccount={currentAccount}
        connectWallet={connectWallet}
      >
        {processing && <div>processing...</div>}
        {ownMessages.map((message, index) => {
          return (
            <div key={index}>
              <MessageCard
                message={message}
                onClickAccept={() => {}}
                onClickDeny={() => {}}
              />
            </div>
          );
        })}
      </RequireWallet>
    </Layout>
  );
}
```

前回まではコード内で擬似的にメッセージ情報を作成していましたが、
`useMessengerContract`から`ownMessages`を取得することでコントラクトから取得したメッセージ情報を使用することができます。

`SendMessagePage.tsx`内を以下のコードに変更してください。

```tsx
import SendMessageForm from '../../components/form/SendMessageForm';
import Layout from '../../components/layout/Layout';
import RequireWallet from '../../components/layout/RequireWallet';
import { useMessengerContract } from '../../hooks/useMessengerContract';
import { useWallet } from '../../hooks/useWallet';

export default function SendMessagePage() {
  const { currentAccount, connectWallet } = useWallet();
  const { processing, sendMessage } = useMessengerContract({
    currentAccount: currentAccount,
  });

  return (
    <Layout>
      <RequireWallet
        currentAccount={currentAccount}
        connectWallet={connectWallet}
      >
        {processing ? (
          <div>processing...</div>
        ) : (
          <SendMessageForm
            sendMessage={(
              text: string,
              receiver: string,
              tokenInEther: string
            ) => {
              sendMessage({ text, receiver, tokenInEther });
            }}
          />
        )}
      </RequireWallet>
    </Layout>
  );
}
```

前回まで`SendMessageForm`に渡していた関数の処理は空でしたが、
`useMessengerContract`から`sendMessage`関数を取得することで、コントラクトの関数(`post`)を呼び出す処理を入れることができました。

それではターミナル上でwebアプリを立ち上げてください。

```
yarn client dev
```

ブラウザで http://localhost:3000 へアクセスすると以下のようにホーム画面が表示されます（ウォレットを接続している場合）

![](/public/images/AVAX-Messenger/section-2/2_5_3.png)

`send ->`リンクをクリックして画面を移動しましょう。
メッセージの宛先アドレスを自分の公開アドレスにして、自分自身にメッセージを送信してみましょう！
`send`ボタンをクリックすると承認画面が開くので承認します。

![](/public/images/AVAX-Messenger/section-2/2_5_1.png)

続いて、ホーム画面へ戻り、`check->`リンクをクリックして、メッセージ確認画面へ移動します。

しばらくするとトランザクションが完了し、送信されたメッセージが表示されます。

![](/public/images/AVAX-Messenger/section-2/2_5_2.png)

### 🌵 `ETH`と`AVAX`

これまでの実装では、Ethereumでの開発と同じ流れで作成したため`ETH`という表記を使用していましたが、C-Chainのネイティブトークンのシンボルは`AVAX`です。

なのでトークンを`1`使用する場合は`1AVAX`を使用することになります。

ソースコード内で`wei`を使用している部分は、`10^18 AVAX`という単位を扱っていると考えることができます。

現実世界の価値が`1 ETH` = `1 AVAX`というわけではありません。

### 🤖 残りのメッセージ確認機能を追加しよう

メッセージの送信機能をフロントエンドへ実装したので、
同じ要領でメッセージの確認機能も追加しましょう。

📁 `hooks`ディレクトリ

`useMessengerContract.ts`にコードを追加していきます。
該当箇所を編集してください。

```ts
// useMessengerContractの返すオブジェクトの型定義です。
type ReturnUseMessengerContract = {
  processing: boolean;
  ownMessages: Message[];
  sendMessage: (props: PropsSendMessage) => void;
  // 以下二つの関数を追加します。
  acceptMessage: (index: BigNumber) => void;
  denyMessage: (index: BigNumber) => void;
};
```

```ts
export const useMessengerContract = ({
  currentAccount,
}: PropsUseMessengerContract): ReturnUseMessengerContract => {
  // ...

  async function sendMessage({
    // ...
  }: PropsSendMessage) {
    // ...
  }

  // accept関数の呼び出しを追加
  async function acceptMessage(index: BigNumber) {
    if (!messengerContract) return;
    try {
      console.log('call accept with index [%d]', index);
      const txn = await messengerContract.accept(index, {
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

  // deny関数の呼び出しを追加
  async function denyMessage(index: BigNumber) {
    if (!messengerContract) return;
    try {
      console.log('call deny with index [%d]', index);
      const txn = await messengerContract.deny(index, {
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

  // ...
```

```ts
useEffect(() => {
  // NewMessageのイベントリスナ
  const onNewMessage = () =>
    // ...
    {
      // ...
    };

  // MessageConfirmedのイベントリスナの追加
  const onMessageConfirmed = (receiver: string, index: BigNumber) => {
    console.log(
      'MessageConfirmed index:[%d] receiver: [%s]',
      index.toNumber(),
      receiver
    );
    // 接続しているユーザ宛のメッセージの場合ownMessagesの該当メッセージを編集します。
    if (receiver.toLocaleLowerCase() === currentAccount) {
      setOwnMessages((prevState) => {
        prevState[index.toNumber()].isPending = false;
        return [...prevState];
      });
    }
  };

  /* イベントリスナーの登録をします */
  if (messengerContract) {
    messengerContract.on('NewMessage', onNewMessage);
    messengerContract.on('MessageConfirmed', onMessageConfirmed); // <- 追加
  }

  /* イベントリスナーの登録を解除します */
  return () => {
    if (messengerContract) {
      messengerContract.off('NewMessage', onNewMessage);
      messengerContract.off('MessageConfirmed', onMessageConfirmed); // <- 追加
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [messengerContract]);
```

```ts
return {
  processing,
  ownMessages,
  sendMessage,
  // 以下二つの関数を追加
  acceptMessage,
  denyMessage,
};
```

`accept`と`deny`を呼び出す機能を追加したので、UIで操作できるようにします。

📁 `pages/message`ディレクトリ

`ConfirmMessagePage.tsx`内を以下のコードに書き換えてください。

```ts
import { BigNumber } from 'ethers';

import MessageCard from '../../components/card/MessageCard';
import Layout from '../../components/layout/Layout';
import RequireWallet from '../../components/layout/RequireWallet';
import { useMessengerContract } from '../../hooks/useMessengerContract';
import { useWallet } from '../../hooks/useWallet';

export default function ConfirmMessagePage() {
  const { currentAccount, connectWallet } = useWallet();
  const { ownMessages, processing, acceptMessage, denyMessage } =
    useMessengerContract({
      currentAccount: currentAccount,
    });

  return (
    <Layout>
      <RequireWallet
        currentAccount={currentAccount}
        connectWallet={connectWallet}
      >
        {processing && <div>processing...</div>}
        {ownMessages.map((message, index) => {
          return (
            <div key={index}>
              <MessageCard
                message={message}
                onClickAccept={() => {
                  acceptMessage(BigNumber.from(index));
                }}
                onClickDeny={() => denyMessage(BigNumber.from(index))}
              />
            </div>
          );
        })}
      </RequireWallet>
    </Layout>
  );
}
```

違いは`useMessengerContract`から`acceptMessage`と`denyMessage`を取得、
`MessageCard`に渡す関数内の処理に利用しています。

🖥️ 画面で確認しましょう

それではターミナル上でwebアプリを立ち上げてください。

```
yarn client dev
```

ブラウザで http://localhost:3000 へアクセスして先ほど送信された自分宛のメッセージを`accept`してみましょう！

![](/public/images/AVAX-Messenger/section-2/2_5_2.png)

`accept`のトランザクションが完了すると確認済みとなり`accept`、`deny`ボタンが消えます。

![](/public/images/AVAX-Messenger/section-2/2_5_6.png)

ブラウザ上で`右クリック` -> `検証` -> `コンソール`を開きます。

`console`タブを開きログを確認し、`Done`ではじまる行の値をコピーします。

```
Done --
`0x..` ← これをコピーします。
```

![](/public/images/AVAX-Messenger/section-2/2_5_7.png)

### 🌱 AVASCAN でトランザクションを確認する

先ほどコピーしたアドレスを [AVASCAN testnet](https://testnet.avascan.info/blockchain/c/home) に貼り付けて、あなたのスマートコントラクトのトランザクション履歴を見てみましょう。

検索結果が表示され、`STATUS: SUCCESS`が表示されればトランザクションの成功を確認できます。

![](/public/images/AVAX-Messenger/section-2/2_5_8.png)

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
セクション2が終了しました!
`#avalanche`にあなたのAVASCANのリンクを貼り付けて、コミュニティで進捗を祝いましょう 🎉
AVASCANでトランザクションの確認をしたら、次のレッスンに進んでください 😊

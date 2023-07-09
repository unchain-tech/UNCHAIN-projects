### ☎️ Web アプリケーションから Candy Machine を呼び出す

ここまでのレッスンで以下3つのことを行いました 🎉

1\. Webアプリケーションのセットアップを行う

2\. ウォレットへの接続機能を構築する

3\. Candy Machineをセットアップし、NFTをアップロードして、すべてをDevnetにデプロイする

次は、Webアプリケーションから、ユーザーが実際にCandy Machineと通信できるようにします。

まずは`components/CandyMachine/index.tsx`をご覧ください。これはMetaplexのフロントエンド・ライブラリの一部です。

このファイルについて詳しく説明しませんが、ぜひコードを読んでみてください。

### 🌲 `.env`プロパティを設定する

まずは`.env`プロパティを設定します。

始める前に **ソースコードを GitHub などにコミットする場合は、`.env.local`ファイルをコミットしないようにしてください**。

これは、Webアプリケーションを作成する際の共通の注意点です。

これらのファイルには通常、機密情報が含まれているため、`.gitignore`に登録するなど対処してください。

`Solana-NFT-Drop`フォルダ直下に`.env.local`ファイルを作成してください。フォルダ階層は次のとおりです。

```diff
 Solana-NFT-Drop
+└── .env.local
```

`.env.local`ファイルに公開鍵を保存します。記載内容は下記の通りです。

```txt
NEXT_PUBLIC_CANDY_MACHINE_ID=
NEXT_PUBLIC_SOLANA_NETWORK=
NEXT_PUBLIC_SOLANA_RPC_HOST=
```

1つずつ見ていきましょう。(ここでは引用符`""`で囲う必要はありません!　)

```
NEXT_PUBLIC_CANDY_MACHINE_ID=
```

`=`のあとに、Candy Machineの公開鍵を記載してください。なくしてしまった場合は、`cache.json`ファイルをご覧ください。

`candyMachine`の`value`の値が公開鍵です。

```
NEXT_PUBLIC_SOLANA_NETWORK=
```

`=`のあとに、`devnet`と記載してください。

```
NEXT_PUBLIC_SOLANA_RPC_HOST=
```

`=`のあとに、`https://explorer-api.devnet.solana.com`と記載してください。

Candy Machineにはdevnetからアクセスしているので、RPCをそのdevnetのリンクに向ける必要があります。

記載例

```
NEXT_PUBLIC_CANDY_MACHINE_ID=3EVLt8KbaLGC3AragKvXDNHzWee7y6hkxzgNAuW4E43M
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_HOST=https://explorer-api.devnet.solana.com
```

これらの変数は、WebアプリケーションがどのCandy Machineと通信するか、どのネットワークを利用するかなどを指し示すために使用されます。

※ `.env.local`を変更する際には、ターミナルで開発サーバーのプロセスを強制終了し、再度`yarn dev`を行う必要があります。

最後に、Phantom WalletのネットワークがSolana Devnetに設定されていることを確認してください。

### 🤬 NFT の変更に関する注意

テストに使用したNFTコレクションを変更したい場合は、以前と同じ手順を踏む必要があります。

1\. MetaplexCLIのSugarコマンドによって生成された`config.json`ファイル、`cache.json`ファイルを削除する

2\. NFTファイルを好きなように変更する

3\. `sugar config create`コマンドを実行して、Candy Machineの設定ファイルを作成する

4\. `sugar upload`コマンドを実行して、NFTをアップロードする

5\. `sugar deploy`コマンドを実行して、新しいCandy Machineを作成してデプロイする (確認は`sugar verify`)

6\. config.jsonファイルにGuardの設定を記述し、`sugar guard add`コマンドを実行して設定を反映させる (確認は`sugar guard show`)

7\. `.env.local`ファイルを新しいCandy Machineのアドレスで更新する

これらの手順を踏まずに変更してしまうとバグの原因になるので気を付けてください。

### 📞 Candy Machine と接続する

最初に、Candy Machineのメタデータを取得します。

このメタデータは、ドロップ日やミントされたアイテムの数、ミントに使用できるアイテムの数などのいくつかの情報が記載されています。

`components/CandyMachine/index.tsx`を開きます。

まず、`useEffect`をインポートし、これから設定する`getCandyMachineState`という関数を呼び出す`useEffect`を設定します。

1 \. `index.tsx`のインポートに`useEffect`を追加します。

```jsx
// CandyMachine/index.tsx
import { useEffect } from 'react';
```

2 \. `index.tsx`の中にある下記のコードブロックを確認してください。

```jsx
// CandyMachine/index.tsx
return (
  <div className={candyMachineStyles.machineContainer}>
```

上記のコードブロックの直前に、下記のコードを追加します。

```jsx
// CandyMachine/index.tsx
useEffect(() => {
  getCandyMachineState();
}, []);
```

3 \. `getCandyMachineState`関数を実装しましょう。

```jsx
// CandyMachine/index.tsx
const getCandyMachineState = async () => {
  try {
    if (
      process.env.NEXT_PUBLIC_SOLANA_RPC_HOST &&
      process.env.NEXT_PUBLIC_CANDY_MACHINE_ID
    ) {
      // Candy Machineと対話するためのUmiインスタンスを作成し、必要なプラグインを追加します。
      const umi = createUmi(process.env.NEXT_PUBLIC_SOLANA_RPC_HOST)
        .use(walletAdapterIdentity(walletAddress))
        .use(nftStorageUploader())
        .use(mplTokenMetadata())
        .use(mplCandyMachine());
      // Candy Machineからメタデータを取得します。
      const candyMachine = await fetchCandyMachine(
        umi,
        publicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE_ID),
      );
      const candyGuard = await safeFetchCandyGuard(
        umi,
        candyMachine.mintAuthority,
      );

      // 取得したデータをコンソールに出力します。
      console.log(`items: ${JSON.stringify(candyMachine.items)}`);
      console.log(`itemsAvailable: ${candyMachine.data.itemsAvailable}`);
      console.log(`itemsRedeemed: ${candyMachine.itemsRedeemed}`);
      if (candyGuard?.guards.startDate.__option !== 'None') {
        console.log(`startDate: ${candyGuard?.guards.startDate.value.date}`);

        const startDateString = new Date(Number(candyGuard?.guards.startDate.value.date) * 1000);
        console.log(`startDateString: ${startDateString}`);
      }
    }
  } catch (error) {
    console.error(error);
  }
};
```

詳細を確認していきましょう。

```jsx
// Candy Machineと対話するためのUmiインスタンスを作成し、必要なプラグインを追加します。
const umi = createUmi(process.env.NEXT_PUBLIC_SOLANA_RPC_HOST)
  .use(walletAdapterIdentity(walletAddress))
  .use(nftStorageUploader())
  .use(mplTokenMetadata())
  .use(mplCandyMachine());
```

Candy Machineと通信するためには、**`Umi`ライブラリが必要です。**

`Umi`ライブラリは、JavaScriptクライアント用のSolanaフレームワークで、Solanaのプログラムと対話するために使用されます。

私たちが構築したCandy Machineは、Metaplex上に存在するSolanaのプログラムに過ぎません。

`Umi`ライブラリと、Metaplexが提供するCandy Machineとの対話を可能にするためのUmi互換ライブラリを使用することで、Solana上にあるほかのプログラムと同じように、Candy Machineを操作できます。

実際には、`createUmi`メソッドでUmiインスタンスを作成し、`use`メソッドでUmiプラグインのインストールを行います。これによりライブラリが提供する様々な関数を使用してCandy Machineとの対話が可能になります。今回インストールしているプラグインはいかになります。

- `walletAdapterIdentity`: ウォレットアダプタを指定します。ユーザーがトランザクションの承認を行う際に使用されます。
- `nftStorageUploader`: ストレージプロバイダにJSONデータをアップロードするために使用されます。
- `mplTokenMetadata`: NFTのメタデータを扱うために使用されます。
- `mplCandyMachine`: Candy Machineと対話するために使用されます。

Umiインスタンスを作成したら、Metaplexが提供するfetchメソッドを呼び出し、**Solana Devnet** へアクセスしてメタデータを取得します。

```jsx
// index.tsx
// Candy Machineからメタデータを取得します。
const candyMachine = await fetchCandyMachine(
  umi,
  publicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE_ID),
);
// Guardの設定を取得します。
const candyGuard = await safeFetchCandyGuard(
  umi,
  candyMachine.mintAuthority,
);
```

### 🧠 CandyMachine コンポーネントをレンダリングする

`CandyMachine`コンポーネントをレンダリングしてみましょう。

`CandyMachine`コンポーネントの一番下までスクロールすると、`return`の下にたくさんのものがレンダリングされていることがわかります。

`pages/index.tsx`に移動し、`CandyMachine`をインポートします。

```jsx
// pages/index.tsx
import CandyMachine from '@/components/CandyMachine';
```

下記の通り、ユーザーのウォレットアドレスがstateにあれば、`CandyMachine`をレンダリングするよう記載してください。

```jsx
// pages/index.tsx
return (
  <>
    <Head>
      <title>Candy Drop</title>
      <meta name="description" content="Generated by create next app" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main className={styles.main}>
      <div className={styles.container}>
        <div>
          <p className={styles.header}>🍭 Candy Drop</p>
          <p className={styles.subText}>NFT drop machine with fair mint</p>
          {!walletAddress && renderNotConnectedContainer()}
        </div>
        {/* ウォレットアドレスがステートに保存されていたら、CandyMachineコンポーネントに渡す */}
        {walletAddress && <CandyMachine walletAddress={window.solana} />}
        <div className={styles.footerContainer}>
          <Image
            alt="Twitter Logo"
            className={styles.twitterLogo}
            src={twitterLogo}
          />
          <a
            className={styles.footerText}
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </main>
  </>
);
```

`window.solana`を`CandyMachine`に渡す方法に注目してください。

### 🍪 取得したデータをレンダリングする

ページを更新するとすぐに`CandyMachine`の`useEffect`が起動するはずです。

先に進んでページを更新すると、コンソールに次のようなものが表示されます。

![無題](/public/images/Solana-NFT-Drop/section-3/3_1_3.png)

Solanaのdevnetからデータを取得できました。

※` startDateString`は異なって見える場合があります。mintしたユーザーのローカルタイムゾーンでデータをレンダリングする場合は、`CandyMachine/index.tsx`ファイルより、`getCandyMachineState`の` startDateString`を下記のように変更します。

```jsx
// CandyMachine/index.tsx
const startLocalDateString = new Date(Number(candyGuard?.guards.startDate.value.date) * 1000).toLocaleDateString();
const startLocalTimeString = new Date(Number(candyGuard?.guards.startDate.value.date) * 1000).toLocaleTimeString();
console.log(`startLocalDateString: ${startLocalDateString} ${startLocalTimeString}`); // startLocalDateString: 1/1/2023 9:00:00 AM
```

Webアプリケーションにアクセスすると、すでにレンダリングされているものがいくつか表示されますが、実際のデータはレンダリングされていません。

したがって、データを表示するために、Candy Machineのメタデータを状態変数に保持しましょう。

先に進み、`components/CandyMachine/index.tsx`の`CandyMachine`コンポーネントを次のように更新します。

```jsx
// CandyMachine/index.tsx
// インポートにuseStateを追加します。
import { useEffect, useState } from 'react';
```

```jsx
// CandyMachine/index.tsx
const CandyMachine = (props: CandyMachineProps) => {
  const { walletAddress } = props;
  // コンポーネント内にstateプロパティを追加します。
  const [umi, setUmi] = useState<UmiType | undefined>(undefined);
  const [candyMachine, setCandyMachine] = useState<
    CandyMachineType | undefined
  >(undefined);
  const [candyGuard, setCandyGuard] = useState<CandyGuardType | null>(null);
  const [startDateString, setStartDateString] = useState<Date | undefined>(undefined);

  const getCandyMachineState = async () => {
    try {
      if (
        process.env.NEXT_PUBLIC_SOLANA_RPC_HOST &&
        process.env.NEXT_PUBLIC_CANDY_MACHINE_ID
      ) {
        // Candy Machineと対話するためのUmiインスタンスを作成し、必要なプラグインを追加します。
        const umi = createUmi(process.env.NEXT_PUBLIC_SOLANA_RPC_HOST)
          .use(walletAdapterIdentity(walletAddress))
          .use(nftStorageUploader())
          .use(mplTokenMetadata())
          .use(mplCandyMachine());
        // Candy Machineからメタデータを取得します。
        const candyMachine = await fetchCandyMachine(
          umi,
          publicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE_ID),
        );
        const candyGuard = await safeFetchCandyGuard(
          umi,
          candyMachine.mintAuthority,
        );

        // 取得したデータをコンソールに出力します。
        console.log(`items: ${JSON.stringify(candyMachine.items)}`);
        console.log(`itemsAvailable: ${candyMachine.data.itemsAvailable}`);
        console.log(`itemsRedeemed: ${candyMachine.itemsRedeemed}`);
        if (candyGuard?.guards.startDate.__option !== 'None') {
          console.log(`startDate: ${candyGuard?.guards.startDate.value.date}`);

          const startDateString = new Date(Number(candyGuard?.guards.startDate.value.date) * 1000);
          console.log(`startDateString: ${startDateString}`);
        }
        if (candyGuard?.guards.startDate.__option !== 'None') {
          console.log(`startDate: ${candyGuard?.guards.startDate.value.date}`);

          const startDateString = new Date(Number(candyGuard?.guards.startDate.value.date) * 1000);
          console.log(`startDateString: ${startDateString}`);
          // 取得したデータをstate変数に保存します。
          setStartDateString(startDateString);
        }

        // 取得したデータをstate変数に保存します。
        setUmi(umi);
        setCandyMachine(candyMachine);
        setCandyGuard(candyGuard);
      }
    } catch (error) {
      console.error(error);
    }
  };

    useEffect(() => {
    getCandyMachineState();
  }, []);

  return (
    <div className={candyMachineStyles.machineContainer}>
      <p>Drop Date:</p>
      <p>Items Minted:</p>
      <button
        className={`${styles.ctaButton} ${styles.mintButton}`}
      >
        Mint NFT
      </button>
    </div>
  );
};
```

3つの状態変数を作成してから、それぞれのセット関数を呼び出してデータを保存しました。

ここでいくつかのデータをレンダリングできます。下記の通りUIコードをレンダリング関数に追加します。(`index.tsx`ファイルのほぼ最後のreturn部分を修正します!)

```jsx
// CandyMachine/index.tsx
// Candy Machine、Candy Guardが有効な場合にのみ表示されます
return candyMachine && candyGuard ? (
  <div className={candyMachineStyles.machineContainer}>
    <p>{`Drop Date: ${startDateString}`}</p>
    <p>
      {`Items Minted: ${candyMachine.itemsRedeemed} / ${candyMachine.data.itemsAvailable}`}
    </p>
    <button className={`${styles.ctaButton} ${styles.mintButton}`}>
      Mint NFT
    </button>
  </div>
) : null;
```

これで、Webアプリケーションに適切にレンダリングされたすべてのデータが表示されます。

最低限のスタイルを加えた`CandyMachine.css`ファイルを提供しています。色やフォントを変えるだけでもよいので、CSSを触ってみてください。

本レッスンは終了です。

現時点では、[Mint NFT]ボタンをクリックしても何も起こりません。

次のレッスンではこのボタンのロジックを構築し、NFTを作成するように設定します。

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

次のレッスンに進んで、NFTのMint機能を実装していきましょう 🎉

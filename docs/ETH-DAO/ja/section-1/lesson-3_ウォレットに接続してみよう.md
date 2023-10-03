### ⛓ チェーンやウォレットの種類を指定する

ウェブサイトがブロックチェーンとやりとりするためには、何らかの方法で私たちのウォレットをブロックチェーンに接続する必要があります。

ウォレットをウェブサイトに接続すると、ウェブサイトは私たちに代わってスマートコントラクトを呼び出す許可を得ることができるようになります。

**これは、ウェブサイトへの認証と同じであることを忘れないでください**。

以前のプロジェクトで「Connect to Wallet」実装を [Ethers.js](https://docs.ethers.io/v5/) で作ったことがある方もいらっしゃるのではないでしょうか。

今回は、めちゃくちゃ簡単に作れるthirdwebのフロントエンドSDKを使って実装していきます。

`src/pages/_app.tsx`に移動して、以下のようにコードを更新しましょう。

```typescript
import { Sepolia } from '@thirdweb-dev/chains';
import {ThirdwebProvider } from '@thirdweb-dev/react';
import type { AppProps } from 'next/app';

import { HeadComponent } from '../components/head';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider activeChain={Sepolia}>
      <HeadComponent/>
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
```

かなりシンプルですよね。

このプロバイダーは、ユーザーの認証済みウォレットデータを保持し、それをAppコンポーネントに渡します。

Next.jsにおいてAppコンポーネント (`_app.tsx`) で全ページ共通の処理を挟むことや、ページ初期化の制御などを行うことができます。

続いて、ヘッダー部分のコードを準備しましょう。

srcディレクトリの中に`components/head.tsx`を作成し、以下のコードを追加します。
```typescript
import * as React from 'react';
import Head from 'next/head';

export const HeadComponent = () => {
  return (
    <Head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="theme-color" content="#000000" />

      <title>Create a DAO tool from scratch</title>
      <meta name="title" content="Create a DAO tool from scratch" />
      <meta name="description" content="TypeScript + React.js + NEXT.js + Thirdweb + Vercel 👉 Ethereum Network 上でオリジナルの DAO を運営しよう🤝" />

      {/* Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.shiftbase.xyz/" />
      <meta property="og:title" content="Create a DAO tool from scratch" />
      <meta property="og:description" content="TypeScript + React.js + NEXT.js + Thirdweb + Vercel 👉 Ethereum Network 上でオリジナルの DAO を運営しよう🤝" />
      <meta property="og:image" content="/banner.png" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://www.shiftbase.xyz/" />
      <meta property="twitter:title" content="Create a DAO tool from scratch" />
      <meta property="twitter:description" content="TypeScript + React.js + NEXT.js + Thirdweb + Vercel 👉 Ethereum Network 上でオリジナルの DAO を運営しよう🤝" />
      <meta property="twitter:image" content="/banner.png" />
    </Head>
  ); 
};
```

続いて、ルートディレクトリ直下にある`public`フォルダの中に以下の画像を`banner.png`という名前で保存します。

![](/public/images/ETH-DAO/section-1/1_3_1.png)

これで、ヘッダーの準備が整いました。

⚠️ 以前にdApps開発取り組んだことがある場合、メタマスクの接続済みサイトから https://localhost:3000 を解除しておきましょう。

![](/public/images/ETH-DAO/section-1/1_3_2.png)


### 🌟 ウォレットに接続してみよう

以下のコマンドを実行するとローカルでフロントエンドが立ち上がるので、初期画面を確認してみましょう。

```
yarn dev
```

※ `localhost:3000`を開くと表示されます。

![](/public/images/ETH-DAO/section-1/1_3_3.png)

では、初期画面を更新していきましょう。

`src/pages/index.tsx`に移動して、コードを以下とおり更新しましょう。

```typescript
import { ConnectWallet } from '@thirdweb-dev/react';
import type { NextPage } from 'next';

import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          {/* 自分の作成する DAO 名に変更してください */}
          Welcome to MyDAO !!
        </h1>
        <p></p>
        <div className={styles.connect}>
          <ConnectWallet />
        </div>
      </main>
    </div>
  );
};

export default Home;
```

とても簡単ですね！

これで、Webアプリで`Connect Wallet`をクリックして`MetaMask`を選択すると、MetaMaskのポップアップ表示されます。

ウォレットを認証が完了すると、このような画面となります。

![](/public/images/ETH-DAO/section-1/1_3_4.png)

ここでページをリロードしても、ウォレット接続が残っているのがわかると思います。

私のコードに`<h1>Welcome to MyDAO !!</h1>`とありますが、ここでのDAOの名前はあなたが作成するDAOの名前にしてください。

私の真似をしないでください！ これはあなたのDAOです！

📝 備考：ユーザーがウォレットを接続していない場合をテストしたい場合は、ご自由にMetaMaskから[ウェブサイトの接続を解除](https://metamask.zendesk.com/hc/en-us/articles/360059535551-Disconnect-wallet-from-Dapp)してください。


### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#ethereum`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンに進んで、ネットワークの警告を出してみましょう 🎉

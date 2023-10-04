### 🚨 ネットワークの警告を出そう

動作を想定しているSepoliaネットワーク意外にMetaMaskが接続されている場合、ユーザーの知る余地がない状態で正常に動作せず困ってしまいます。

他の学習コンテンツと同様に、今回も [thirdweb](https://thirdweb.com/) を用いてネットワークの警告を実装していきましょう。

`src/pages/index.tsx`のコードを以下のとおり更新しましょう。

```typescript
import { Sepolia } from '@thirdweb-dev/chains';
import {
  ConnectWallet,
  useAddress,
  useChain,
  useContract,
} from '@thirdweb-dev/react';
import type { NextPage } from 'next';

import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const address = useAddress();
  const chain = useChain();

  // テストネットが Sepolia ではなかった場合に警告を表示
  if (chain && chain.chainId !== Sepolia.chainId) {
    console.log('wallet address: ', address);
    console.log('chain name: ', chain.name);
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>Sepolia に切り替えてください⚠️</h1>
          <p>この dApp は Sepolia テストネットのみで動作します。</p>
          <p>ウォレットから接続中のネットワークを切り替えてください。</p>
        </main>
      </div>
    );
  } else {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Welcome to Tokyo Sauna Collective !!
          </h1>
          <div className={styles.connect}>
            <ConnectWallet />
          </div>
        </main>
      </div>
    );
  }
};

export default Home;
```

これで、Sepoliaネットワークに接続されていなかった場合に警告表示をすることができました。

つまり、各ページが描画されていれば正常なネットワークであることが保証できていることになります。

試しに、MetaMaskでネットワークを変えて警告のメッセージが表示されているか試してみましょう。

![](/public/images/ETH-DAO/section-1/1_4_1.png)


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

ぜひ、あなたのウォレットに接続が成功した状態でのフロントエンドのスクリーンショットを`#ethereum`に投稿してください 😊

あなたの成功をコミュニティで祝いましょう 🎉

次のレッスンでは、DAO会員証としてのNFTをミントできるようにしていきます！

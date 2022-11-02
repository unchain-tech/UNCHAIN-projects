### 🚨 ネットワークの警告を出そう

動作を想定しているGoerliネットワーク意外にMetaMaskが接続されている場合、ユーザーの知る余地がない状態で正常に動作せず困ってしまいます。

他の学習コンテンツと同様に、今回も [thirdweb](https://thirdweb.com/) を用いてネットワークの警告を実装していきましょう。

`pages/index.tsx`のコードを以下のとおり更新しましょう。

```typescript
import type { NextPage } from "next";
// 接続中のネットワークを取得するため useNetwork を新たにインポートします。
import { ConnectWallet, ChainId, useNetwork, useAddress } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const address = useAddress();
  const [network, switchNetwork] = useNetwork();

  if (address && network && network?.data?.chain?.id !== ChainId.Goerli) {
    console.log("wallet address: ", address);
    console.log("network: ", network?.data?.chain?.id);

    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>Goerli に切り替えてください⚠️</h1>
          <p>この dApp は Goerli テストネットのみで動作します。</p>
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

これで、Goerliネットワークに接続されていなかった場合に警告表示をすることができました。

つまり、各ページが描画されていれば正常なネットワークであることが保証できていることになります。

試しに、MetaMaskでネットワークを変えて警告のメッセージが表示されているか試してみましょう。

![](/public/images/ETH-DAO/section-1/1_4_1.png)


### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#eth-dao`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

ぜひ、あなたのウォレットに接続が成功した状態でのフロントエンドのスクリーンショットを`#eth-dao`に投稿してください 😊

あなたの成功をコミュニティで祝いましょう 🎉

次のレッスンでは、DAO会員証としてのNFTをミントできるようにしていきます！

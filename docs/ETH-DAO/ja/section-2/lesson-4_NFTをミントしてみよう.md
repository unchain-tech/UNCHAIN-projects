このレッスンでは`src/pages/index.tsx`を変更して、以下の実装をしていきます。

1. ユーザーがメンバーシップNFTを持っていない場合は、NFTをミントするボタンを表示します。
2. ユーザーがメンバーシップNFTを持っていることを検知したら、プロポーザルに投票したり、DAO関連の情報を見ることができる「DAOダッシュボード」画面を表示します。

さあ、やってみましょう！
まず、ケース1について説明します。

### 🤔 メンバーシップ NFT を持っているかどうかを確認する

`src/pages/index.tsx`に移動し、コードを以下のとおり変更します。

※ あなたのコントラクトアドレスを設定することを忘れないでください！

```typescript
import { Sepolia } from '@thirdweb-dev/chains';
import {
  ConnectWallet,
  useAddress,
  useChain,
  useContract,
} from '@thirdweb-dev/react';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';

import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const address = useAddress();
  console.log('👋Wallet Address: ', address);

  const chain = useChain();

  // editionDrop コントラクトを初期化
  const editionDrop = useContract(
    'INSERT_EDITION_DROP_ADDRESS',
    'edition-drop',
  ).contract;

  // ユーザーがメンバーシップ NFT を持っているかどうかを知るためのステートを定義
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

  useEffect(() => {
    // もしウォレットに接続されていなかったら処理をしない
    if (!address) {
      return;
    }
    // ユーザーがメンバーシップ NFT を持っているかどうかを確認する関数を定義
    const checkBalance = async () => {
      try {
        const balance = await editionDrop!.balanceOf(address, 0);
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log('🌟 this user has a membership NFT!');
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.");
        }
      } catch (error) {
        setHasClaimedNFT(false);
        console.error('Failed to get balance', error);
      }
    };

    // 関数を実行
    checkBalance();
  }, [address, editionDrop]);

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

まず、`editionDrop`コントラクトを初期化します。

そこから、`editionDrop!.balanceOf(address, "0")`を使って、ユーザーがNFTを持っているかどうかを確認します。

これは、実際にデプロイされたスマートコントラクトにデータを問い合わせることになります。

なぜ`"0"`なのでしょうか？

基本的には、 `"0"`がメンバーシップNFTの`tokenchainId`であることを思い出してください。

つまり、ここではコントラクトに「このユーザーはchainID `"0"`のトークンを所有しているのかどうか」を確認しているのです。

このページを更新すると、このように表示されるはずです。

![](/public/images/ETH-DAO/section-2/2_4_1.png)

今の段階ではメンバーシップNFTを持っていないため、`😭 this user doesn't have a membership NFT.`と表示されます。


### ✨ "Mint NFT" ボタンをつくろう

それでは、`src/pages/index.tsx`へ移動しメンバーシップNFTをミントできるようにしていきましょう。

下記のとおりコードを変更してください。

※ あなたのコントラクトアドレスを設定することを忘れないでください！

```typescript
import { Sepolia } from '@thirdweb-dev/chains';
import {
  ConnectWallet,
  useAddress,
  useChain,
  useContract,
} from '@thirdweb-dev/react';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';

import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const address = useAddress();
  console.log('👋Wallet Address: ', address);

  const chain = useChain();

  // editionDrop コントラクトを初期化
  const editionDrop = useContract(
    'INSERT_EDITION_DROP_ADDRESS',
    'edition-drop',
  ).contract;

  // ユーザーがメンバーシップ NFT を持っているかどうかを知るためのステートを定義
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

  // NFT をミンティングしている間を表すステートを定義
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    // もしウォレットに接続されていなかったら処理をしない
    if (!address) {
      return;
    }
    // ユーザーがメンバーシップ NFT を持っているかどうかを確認する関数を定義
    const checkBalance = async () => {
      try {
        const balance = await editionDrop!.balanceOf(address, 0);
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log('🌟 this user has a membership NFT!');
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.");
        }
      } catch (error) {
        setHasClaimedNFT(false);
        console.error('Failed to get balance', error);
      }
    };
    // 関数を実行
    checkBalance();
  }, [address, editionDrop]);

  const mintNft = async () => {
    try {
      setIsClaiming(true);
      await editionDrop!.claim('0', 1);
      console.log(
        `🌊 Successfully Minted! Check it out on etherscan: https://sepolia.etherscan.io/address/${editionDrop!.getAddress()}`
      );
      setHasClaimedNFT(true);
    } catch (error) {
      setHasClaimedNFT(false);
      console.error('Failed to mint NFT', error);
    } finally {
      setIsClaiming(false);
    }
  };

  // ウォレットと接続していなかったら接続を促す
  if (!address) {
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
  // テストネットが Sepolia ではなかった場合に警告を表示
  else if (chain && chain.chainId !== Sepolia.chainId) {
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
  }
  // ウォレットと接続されていたら Mint ボタンを表示
  else {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>Mint your free 🍪DAO Membership NFT</h1>
          <button disabled={isClaiming} onClick={mintNft}>
            {isClaiming ? 'Minting...' : 'Mint your nft (FREE)'}
          </button>
        </main>
      </div>
    );
  }
};

export default Home;
```

まず最初に行っているのは、実際にトランザクションを送信するために必要となるユーザーの代わりの`signer`の設定です。

詳しくは[こちら](https://docs.ethers.io/v5/api/signer/)をご覧ください。

ここから`editionDrop!.claim('0', 1)`を呼び出し、ユーザーがボタンをクリックした際にNFTをウォレットに実際にミントします。

この場合、メンバーシップNFTのtokenchainIdは`'0'`なので、`'0'`を渡します。

次に、`1`を渡します。これは、ユーザーのウォレットに1つのメンバーシップNFTを作成したいだけだからです。

すべて完了したら、`setIsClaiming(false)`を実行して、ロード状態を停止します。

そして、`setHasClaimedNFT(true)`を実行し、このユーザーがNFTのClaimに成功したことをreactアプリに知らせます。

それでは実際に`Mint your nft (FREE)`ボタンを押下してNFTをミントしてみましょう。

![](/public/images/ETH-DAO/section-2/2_4_2.png)

MetaMaskのポップアップが表示され、ガスを支払うことでNFTがMintされます。

NFTのミントが完了すると、以下のとおりコンソールにEtherscanのリンクが表示されます。

```
🌊 Successfully Minted! Check it out on etherscan: https://sepolia.etherscan.io/address/0xcB5F0888d059eE9957816b40B149c499909891b7
```

リンクにアクセスすると、このように表示されます。

![](/public/images/ETH-DAO/section-2/2_4_3.png)

一番最新のトランザクションにアクセスするとしたのようにERC-1155がclaimできていることがわかります。

![](/public/images/ETH-DAO/section-2/2_4_8.png)

このメンバーシップNFTはERC-1155なので、誰もが同じNFTの持ち主です。

これはかなりクールで、ガス効率も良くなります。

ちなみに、ERC721をミントすると96,073ものgas代がかかりますが、ERC1155の造幣コストは51,935ほどのgas代で済みます。

それは、誰もが同じNFTデータを共有しているからです。

ユーザーごとに新しいデータをコピーする必要がないのです。


### 🛑 メンバーシップ NFT を持っていたらダッシュボードを表示してみよう

このLessonでは、2つのケースを処理する必要がありましたね。

1. ユーザーがメンバーシップNFTを持っていない場合は、NFTをミントするボタンを表示します。
2. ユーザーがメンバーシップNFTを持っていることを検知したら、プロポーザルに投票したり、DAO関連の情報を見ることができる「DAOダッシュボード」画面を表示します。

ここではケース2を実装していきます。

これはかなり簡単です。

NFTのミント画面を描画する前に、以下のコメント`DAO ダッシュボード画面を表示`部分のコードを追加するだけです。

`src/pages/index.tsx`に移動し、コードの一部を以下のとおり変更します。

```typescript
  // ウォレットと接続していなかったら接続を促す
  if (!address) {
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
  // テストネットが Sepolia ではなかった場合に警告を表示
  else if (chain && chain.chainId !== Sepolia.chainId) {
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
  }
  // DAO ダッシュボード画面を表示
  else if (hasClaimedNFT){
    return (
      <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>🍪DAO Member Page</h1>
        <p>Congratulations on being a member</p>
      </main>
    </div>
    );
  }
  // ウォレットと接続されていたら Mint ボタンを表示
  else {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>Mint your free 🍪DAO Membership NFT</h1>
          <button disabled={isClaiming} onClick={mintNft}>
            {isClaiming ? 'Minting...' : 'Mint your nft (FREE)'}
          </button>
        </main>
      </div>
    );
  }
```

これで完了です。

ページを更新すると、DAOメンバーページにいることがわかります。

ウェブアプリからウォレットの接続を解除すると、「Connect Wallet」のページに移動すれば成功です。

最後に、ウォレットを接続してもメンバーシップNFTを持っていない場合、NFTを作成するように促されます。

この場合、テストすることをオススメします。

1. ウェブアプリからウォレットの接続を解除する。
2. 実際に[アカウントを新たに作成する](https://metamask.zendesk.com/hc/en-us/articles/360015289452-How-to-create-an-additional-account-in-your-MetaMask-wallet)
   ※ これにより、新しいパブリックアドレスを取得し、NFTを受信するための新しいアドレスを持つことができます。

MetaMaskはいくつでもアカウントを持つことができます。

3つのケースをすべてテストするようにしてください。

1. ウォレットの接続がされていないとき:
![](/public/images/ETH-DAO/section-2/2_4_5.png)

2. ウォレットは接続されているが、メンバーシップNFTを所有していないとき:
![](/public/images/ETH-DAO/section-2/2_4_6.png)

3. ウォレットが接続されており、メンバーシップNFTを所有しているとき:
![](/public/images/ETH-DAO/section-2/2_4_7.png)


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

ぜひ、メンバーシップNFTのOpensea画面のスクリーンショットを`#ethereum`に投稿してください 😊

あなたの成功をコミュニティで祝いましょう 🎉

次のレッスンでは、ガバナンストークンの発行をしていきます！

### 🥺 Web アプリでトークンホルダーを取得する

私たちのDAOのメンバー全員が、DAOでトークンを保有している人全員と、彼らが保有しているトークンの数を簡単に確認できるようにしたいと思います。

そのためには、実際にクライアントからスマートコントラクトを呼び出して、そのデータを取得する必要があります。

まず、`src/pages/index.tsx`へ移動し、`react`のインポート部分のコードを以下のとおり変更します。

```typescript
import { useEffect, useMemo, useState } from 'react';
```

ここで変更されたことは`useMemo`をインポートしたところだけです。

`useMemo`はコンポーネントの中で値をメモ化してくれる機能です。

続いて、`const editionDrop = useContract('INSERT_EDITION_DROP_ADDRESS', 'edition-drop').contract;`の下にあなたの`token`アドレスを貼り付けてください。

※ あなたのアドレスを設定することを忘れないでください！

```typescript
  // トークンコントラクトの初期化
  const token = useContract(
    'INSERT_TOKEN_ADDRESS',
    'token',
  ).contract;
```

これはERC-1155とERC-20の両方とやり取りするために必要なものです。

ERC-1155から、すべてのメンバーのアドレスを取得します。

ERC-20から、各メンバーが持っているトークンの数を取得します。

次に、`const [isClaiming, setIsClaiming] = useState(false)`の下に、以下のコードを追加します。

```typescript
  // メンバーごとの保有しているトークンの数をステートとして宣言
  const [memberTokenAmounts, setMemberTokenAmounts] = useState<any>([]);
  
  // DAO メンバーのアドレスをステートで宣言
  const [memberAddresses, setMemberAddresses] = useState<string[] | undefined>([]);

  // アドレスの長さを省略してくれる便利な関数
  const shortenAddress = (str: string) => {
    return str.substring(0, 6) + '...' + str.substring(str.length - 4);
  };

  // メンバーシップを保持しているメンバーの全アドレスを取得します
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // 先ほどエアドロップしたユーザーがここで取得できます（発行された tokenID 0 のメンバーシップ NFT）
    const getAllAddresses = async () => {
      try {
        const memberAddresses = await editionDrop?.history.getAllClaimerAddresses(
          0
        );
        setMemberAddresses(memberAddresses);
        console.log('🚀 Members addresses', memberAddresses);
      } catch (error) {
        console.error('failed to get member list', error);
      }
    };
    getAllAddresses();
  }, [hasClaimedNFT, editionDrop?.history]);

  // 各メンバーが保持するトークンの数を取得します
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllBalances = async () => {
      try {
        const amounts = await token?.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts);
        console.log('👜 Amounts', amounts);
      } catch (error) {
        console.error('failed to get member balances', error);
      }
    };
    getAllBalances();
  }, [hasClaimedNFT, token?.history]);

  // memberAddresses と memberTokenAmounts を 1 つの配列に結合します
  const memberList = useMemo(() => {
    return memberAddresses?.map((address) => {
      // memberTokenAmounts 配列でアドレスが見つかっているかどうかを確認します
      // その場合、ユーザーが持っているトークンの量を返します
      // それ以外の場合は 0 を返します
      const member = memberTokenAmounts?.find(
        ({ holder }: {holder: string}) => holder === address,
      );

      return {
        address,
        tokenAmount: member?.balance.displayValue || '0',
      };
    });
  }, [memberAddresses, memberTokenAmounts]);
```

たくさんあるように見えますが、ここで追加されていることはたったの3つだけです。

1. `getAllClaimerAddresses`を呼び出し、ERC-1155コントラクトからNFTを保有するメンバーのアドレスをすべて取得してます。
2. `getAllHolderBalances`を呼び出し、ERC-20コントラクトからトークンを保持している全員のトークン残高を取得しています。
3. データを`memberList`にまとめます。

この配列は、メンバーのアドレスとトークン残高の両方を含む、すばらしい配列です。

`useMemo`が何をするのか、自由に[ここ](https://reactjs.org/docs/hooks-reference.html#usememo)をチェックしてみてください。

これは、Reactで計算された変数を保存するための便利な方法です。

さて、「トークンを持っている人全員を捕まえるために`getAllHolderBalances`を実行することはできないのか」と自問しているかもしれません。

基本的には、トークンを持たなくても（0を保持している）、メンバーシップNFTさえ取得していればDAOに参加することができます。

だから、まだ彼らをリストに表示したいのです。

コンソールでは、このようなものが表示されていると思います。

![](/public/images/ETH-DAO/section-3/3_2_1.png)

コントラクトの両方（ERC-20とERC-1155）からデータを取得することに成功しています。

このあたりをいじって、すべてのデータをチェックするのは自由です。

_⚠️ 注: また、あなたのコンソールで Ethers から`Request-Rate Exceeded`というメッセージが表示される場合があります。これは今のところ大丈夫なので無視しちゃってください_


### 🤯 メンバーのデータを DAO ダッシュボードに表示しよう

stateにデータを保持するところまではできているので、早速描画させてみましょう。

`src/pages/index.tsx`のDAOダッシュボード画面を表示している箇所を以下のとおり置き換えます（161行目のあたりです）。

```typescript
// ユーザーがすでに NFT を要求している場合は、内部 DAO ページを表示します
// これは DAO メンバーだけが見ることができ、すべてのメンバーとすべてのトークン量をレンダリングします
  else if (hasClaimedNFT){
    return (
      <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>🍪DAO Member Page</h1>
        <p>Congratulations on being a member</p>
        <div>
        <div>
          <h2>Member List</h2>
          <table className="card">
            <thead>
              <tr>
                <th>Address</th>
                <th>Token Amount</th>
              </tr>
            </thead>
            <tbody>
              {memberList!.map((member) => {
                return (
                  <tr key={member.address}>
                    <td>{shortenAddress(member.address)}</td>
                    <td>{member.tokenAmount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      </main>
    </div>
    );
  }
```

とても簡単ですね。

このページでは、`memberList`のデータを表示するためのテーブルをレンダリングしています。

ページをチェックすると、以下のスクリーンショットのように表示されることが確認できます。

![](/public/images/ETH-DAO/section-3/3_2_2.png)

トークンを付与されたすべてのメンバーをDAOダッシュボードで確認することができるようになりました。


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

次のレッスンでは、トレジャリー（DAOにおける金庫のようなもの）と投票のためのコントラクトをつくっていきます！

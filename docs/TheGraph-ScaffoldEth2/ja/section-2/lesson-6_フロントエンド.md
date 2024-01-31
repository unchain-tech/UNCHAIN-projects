## フロントエンド

### フロントエンドの更新とデプロイ

スマートコントラクトをテストネットにデプロイし、Subgraph Studioでデータがインデックスされているので、フロントエンドを更新する時が来ました。

#### ✅ ステップ 1：Scaffold-ETH の設定を更新する

以前のステップでデプロイしたテストネットを指すように設定を更新してください。

> scaffold.config.ts は packages/nextjs にあります。

```
  targetNetwork: chains.sepolia,
```

変更すると以下のようになります：

![](/public/images/TheGraph-ScaffoldEth2/section-2/2_6_1.png)

この変更を行ったら、scaffold-ETHに戻り、UIをリロードしてください。バーナーウォレットから切断されるので、Metamaskウォレットを使用してテストネットに接続します。

"CONNECT WALLET"をクリックしてください...

![](/public/images/TheGraph-ScaffoldEth2/section-2/2_6_2.png)

Metamaskを選択してください...

![](/public/images/TheGraph-ScaffoldEth2/section-2/2_6_3.png)

ネットワークを切り替えてください...

![](/public/images/TheGraph-ScaffoldEth2/section-2/2_6_4.png)

![](/public/images/TheGraph-ScaffoldEth2/section-2/2_6_5.png)

完了したら、sepoliaネットワーク上のdappに接続されているはずです。

![](/public/images/TheGraph-ScaffoldEth2/section-2/2_6_6.png)

#### ✅ 知り合いにテストメッセージを送ってみよう！（または Vitalik へ）

デプロイしたスマートコントラクトにイベントを送信したいと思います。フロントエンドが適切に設定されているので、これは比較的簡単に行うことができます。

![](/public/images/TheGraph-ScaffoldEth2/section-2/2_6_7.png)

![](/public/images/TheGraph-ScaffoldEth2/section-2/2_6_8.png)

次に、Studioでメッセージが正常にインデックスされたかどうかを確認します。GraphiQLエクスプローラは、「Playground」ページにあります。

![](/public/images/TheGraph-ScaffoldEth2/section-2/2_6_9.png)

#### ✅ GraphQL URL を開発用エンドポイントに更新する

サブグラフの開発エンドポイントは、Subgraph Studioのdetailsタブで見つけることができます。

> \_app.tsx を編集します。packages/nextjs/pages にあります。

```
  const subgraphUri = "https://api.studio.thegraph.com/query/51078/sendmessage-test/version/latest";
  const apolloClient = new ApolloClient({
    uri: subgraphUri,
    cache: new InMemoryCache(),
  });
```

変更すると以下のようになります：

![](/public/images/TheGraph-ScaffoldEth2/section-2/2_6_10.png)

#### ✅ index.ts ファイルをまっさらな状態から始める

必要なものをindex.tsファイルにインポートしましょう。また、return内の情報を全てクリアすることもできます。

> index.ts は packages/nextjs/pages にあります。

以下のようになるはずです...

```
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client";

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader />
    </>
  );
};

export default Home;
```

変更後、ホームディレクトリは以下のようになります：

![](/public/images/TheGraph-ScaffoldEth2/section-2/2_6_11.png)

#### ✅ テーブル形式でメッセージを表示する

最後に、メッセージを表示するためのテーブルを作ります。

```
        <h1>Messages</h1>
        <table className="min-w-[70%]">
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr key={message.id}>
                <td>{message._from}</td>
                <td>{message._to}</td>
                <td>{message.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
```

main関数の外側に、GraphQLクエリをconstとして定義します。

```
export const GET_MESSAGES = gql`
{
  sendMessages(first: 5) {
    id
    _from
    _to
    message
  }
}
`;
```

そして、次のようにデータをロードします...

```
  const { loading, error, data: messagesData } = useQuery(GET_MESSAGES);

  const messages = messagesData?.sendMessages || [];
```

![](/public/images/TheGraph-ScaffoldEth2/section-2/2_6_13.png)

それを少しリファクタリングして、単なるテキストの代わりに`<Address>`コンポーネントを使いましょう。

Addressコンポーネントをインポートします。

```
import { Address } from "~~/components/scaffold-eth";
```

そして、メッセージを表示するテーブルを以下のように更新します。

```
              <tr key={message.id}>
                <td><Address address={message._from}/></td>
                <td><Address address={message._to}/></td>
                <td>{message.message}</td>
              </tr>
```

これにより、長い文字列よりもはるかに見栄えがよくなります！ :D

![](/public/images/TheGraph-ScaffoldEth2/section-2/2_6_14.png)

> 注：完全なファイルをご覧になりたい場合は、[こちら](https://gist.github.com/kmjones1979/26ef9633b61b17f237e88eb41bb688de)をご覧ください！

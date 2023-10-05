### 👾 NFT のメタデータを設定しよう

ここまでで、ERC-1155コントラクトの作成とメンバーシップNFTのコレクションのメタデータを追加しました。

ですが、まだメンバーシップNFTのセットアップはできていません。

では実際に、メンバーシップNFTに関連するメタデータをデプロイしていきましょう。

`src/scripts/3-config-nft.ts`を作成し、下記コードを追加しましょう。

※ あなたのメンバーシップNFT用の画像を設定することを忘れないでください！

```typescript
import { readFileSync } from 'fs';

import sdk from './1-initialize-sdk';
import { editionDropAddress } from './module';

const editionDrop = sdk.getContract(editionDropAddress, 'edition-drop');

(async () => {
  try {
    await (
      await editionDrop
    ).createBatch([
      {
        name: "Member's symbol",
        description:
          'Japan Crack Organization にアクセスすることができる限定アイテムです',
        image: readFileSync('src/scripts/assets/NFT.png'),
      },
    ]);
    console.log('✅ Successfully created a new NFT in the drop!');
  } catch (error) {
    console.error('failed to create the new NFT', error);
  }
})();
```

単純明快ですね。

まず最初に、`editionDrop`のERC-1155コントラクトにアクセスしています。

※ `✅ Successfully deployed editionDrop contract, address:`の後に出力されていたアドレスです。

忘れてしまった場合は、[thirdweb のダッシュボード](https://thirdweb.com/dashboard)からも参照することができます。

![](/public/images/ETH-DAO/section-2/2_3_1.png)

ここでは、`createBatch`を使ってコントラクトに実際のNFTを作成します。

いくつかのプロパティも合わせて設定する必要があります。

- **name**: NFTの名前
- **description**: NFTの説明
- **image**: NFTの画像

_📝 備考： ERC-1155 の NFT なのでメンバー全員が同じ NFT をミントすることを覚えておいてください_

`image: readFileSync("scripts/assets/NFT.jpg")`は必ず自分の画像に置き換えてください。

※ インターネット上にホスティングしている画像の場合(ex. `https://~`)は動作しないので、ローカルの画像であることを必ず確認してください。

コピー&ペーストをせず、自分なりに工夫して画像を設定してみてください。

準備が整ったらターミナルに移動し、下記コマンドを実行してみましょう。

```
yarn node --loader ts-node/esm src/scripts/3-config-nft.ts
```

以下のような表示がされたら、成功です。

```
SDK initialized by address: 0x8cB688A30D5Fd6f2e5025d8915eD95e770832933
✅ Successfully created a new NFT in the drop!
Done in 30.57s.
```


### 😼 NFT の請求条件を設定する

あとは、実際に「請求条件」を設定する必要があります。

- NFTをミントできる最大数は？
- ユーザーはいつNFTのミントを開始できるのか？

これも通常は、コントラクトに記述する必要のあるカスタムロジックですが、今回もthirdwebが簡単に作ってくれます。

`src/scripts/4-set-claim-condition.ts`を作成し、下記のコードを追加しましょう。

```typescript
import { MaxUint256 } from '@ethersproject/constants';

import sdk from './1-initialize-sdk';
import { editionDropAddress } from './module';

const editionDrop = sdk.getContract(editionDropAddress, 'edition-drop');

(async () => {
  try {
    // オブジェクトの配列を渡すことで、条件を設定できます
    // 必要であれば、複数の条件をそれぞれ異なる時期に設定することもできます
    // FYI: https://docs.thirdweb.com/typescript/sdk.tokendrop.claimconditions#tokendropclaimconditions-property
    const claimConditions = [
      {
        // いつになったらNFTのミントできるようになるか
        startTime: new Date(),
        // 上限となる最大供給量
        maxQuantity: 50_000,
        // NFT の価格
        price: 0,
        // 1 回のトランザクションでミントできる NFT の個数
        quantityLimitPerTransaction: 1,
        // トランザクション間の待ち時間
        // MaxUint256 に設定し、1人1回しか請求できないように設定
        waitInSeconds: MaxUint256,
      },
    ];
    await (await editionDrop).claimConditions.set('0', claimConditions);
    console.log('✅ Successfully set claim condition!');
  } catch (error) {
    console.error('Failed to set claim condition', error);
  }
})();

```

`startTime`は、ユーザーがNFTのミントを開始することができる時間なので、この日付/時間を現在時刻に設定するだけですぐにミントを開始することができます。

`maxQuantity`は、会員制NFTの最大ミント数です。

`quantityLimitPerTransaction`は、1回の取引で請求できるトークンの数を指定します。

ここでは1に設定し、ユーザーが一度に1つのNFTしかミントできないようにします。

`price`はNFTの価格を設定します。

今回は0を設定しているため無料です。

`waitInSeconds`はトランザクション間の時間です。

最後に、`editionDrop.claimConditions.set('0', claimConditions)`を実行すると、オンチェーンに配置されたコントラクトとやりとりして条件を調整することができます。

なぜ0を渡すのでしょうか？

基本的にメンバーシップNFTはERC-1155コントラクトの最初のトークンなので、`tokenId`は`0`です。

ERC-1155では、複数の人が同じNFTをミントすることができることを思い出してください。

この場合、全員がid `0`のNFTをミントしますが、id `1`の別のNFTを持つこともできますし、DAOの優秀なメンバーにそのNFTを与えることもできます。

全ては私たち次第なのです。

それでは続いて、ターミナルに移動し、下記コマンドを実行してみましょう。

```
yarn node --loader ts-node/esm src/scripts/4-set-claim-condition.ts
```

以下のような表示がされたら、成功です。

```
SDK initialized by address: 0x8cB688A30D5Fd6f2e5025d8915eD95e770832933
✅ Successfully set claim condition!
Done in 27.07s.
```

私たちは、デプロイされたスマートコントラクトとうまくやりとりをし、NFTに対してルールを設定することができました。

ターミナルに出力されたアドレスを[Etherscan](https://sepolia.etherscan.io/)で検索すれば、私たちがコントラクトとやり取りしているのが分かるはずです。

![](/public/images/ETH-DAO/section-2/2_3_2.png)


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

次のレッスンでは、いよいよNFTをミントできるようにしていきます！

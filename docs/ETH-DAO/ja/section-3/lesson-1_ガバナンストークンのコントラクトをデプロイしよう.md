### 🧐 ガバナンストークンとは

さて、DAOのメンバーとしてのアイデンティティを確立するために、メンバーシップNFTを持てるようになりました。

ここからは、さらに一歩進めていきます。

実際に「ガバナンストークン」を作り、メンバーにエアドロップしてみましょう。

[ENS DAO ガバナンストークンのエアドロップ](https://decrypt.co/85894/ethereum-name-service-market-cap-hits-1-billion-just-days-after-ens-airdrop)を覚えている方もいらっしゃるかもしれません。

いったいどういうことなのでしょうか？

なぜ今、「ガバナンストークン」が10億円近い時価総額を持つのかでしょうか？

基本的に、ガバナンストークンを使いユーザーがプロポーザルに対して投票することができます。

例えば、「NARUTO DAOが特別会員になったので、指定されたウォレットアドレスに10万ドルHOKAGEを送って欲しい」といった提案が考えられます。

より多くのガバナンストークンを持つユーザーは、より強い力を持ちます。

通常、トークンは最も価値をもたらしたコミュニティのメンバーに贈られます。

例えば、ENSのエアドロップでは、最も多くのトークンを獲得したのはコア開発チームとそのDiscordのアクティブユーザーでした。

しかし、ENSドメイン(例：`farza.eth`)の保有期間に応じて、ENS DAOトークンも受け取ることができたはずです。

ちなみに、ご存じなかったかもしれませんが、ENS NameはNFTです。

つまり、このNFTを長く保持すればするほど、トークンが多くなるわけです。

なぜでしょうか？

ENSチームは、ネットワークの初期サポーターに報酬を与えたいと考えたからです。

これが彼らのやり方でした。

![](/public/images/ETH-DAO/section-3/3_1_1.png)

ここで強調しておきたいのは、これは独自の手法だということです。

あなたのDAOも独自の手法を持つことができます。

あなたのDAOでは、メンバーシップをNFTにした期間に基づいて、より多くの報酬を与えたいと思うかもしれません。

すべてはあなた次第なのです。


### 🥵 トークンをデプロイしよう

トークン用のスマートコントラクトを作成し、デプロイしていきましょう。

`src/scripts/5-deploy-token.ts`を作成し、以下を追加します。

```tsx
import { AddressZero } from '@ethersproject/constants';

import sdk from './1-initialize-sdk';

(async () => {
  try {
    // 標準的なERC-20のコントラクトをデプロイする
    const tokenAddress = await sdk.deployer.deployToken({
      // トークン名 Ex. 'Ethereum'
      name: 'Tokyo Sauna Collective Governance Token',
      // トークンシンボル Ex. 'ETH'
      symbol: 'TSC',
      // これは、トークンを売却する場合の受け取り先の設定
      // 今回は販売しないので、再び AddressZero に設定
      primary_sale_recipient: AddressZero,
    });
    console.log(
      '✅ Successfully deployed token module, address:',
      tokenAddress
    );
  } catch (error) {
    console.error('failed to deploy token module', error);
  }
})();
```

私たちは`sdk.deployer.deployToken`を呼び出し、標準的な [ERC-20](https://docs.openzeppelin.com/contracts/2.x/api/token/erc20) トークンコントラクトをデプロイします。

これは、イーサリアム上のすべての巨大コインが採用する標準的なものです。

必要なのは、あなたのトークンの`name`と`symbol`だけです！

もちろん、私の真似はしないでくださいね。

あなたが何か、**あなた**がクールだと思うものを作ってくれることを願っています。

ここで私は自分のトークンにTSCというシンボルを与えています。

_📝 備考: thirdweb が使っているコントラクトは[こちら](https://github.com/thirdweb-dev/contracts/blob/main/contracts/token/TokenERC20.sol)から見ることができます_

続いて、ターミナルに移動し、下記コマンドを実行してみましょう。

```
yarn node --loader ts-node/esm src/scripts/5-deploy-token.ts
```

以下のような表示がされたら、成功です。

```
SDK initialized by address: 0x8cB688A30D5Fd6f2e5025d8915eD95e770832933
✅ Successfully deployed token module, address: 0x925d850A8A83af24a8F0C6B1E78B20A475a0c71E
Done in 40.70s.
```

新しいトークンコントラクトがデプロイされました。

[Etherscan](https://sepolia.etherscan.io/) にアクセスし、トークンコントラクトのアドレスを検索すると、先ほどデプロイしたばかりのコントラクトを見ることができます。

ここでも、**あなたのウォレット**からデプロイされたことがわかるので、**あなたがそれを所有している**ことがわかります。

![](/public/images/ETH-DAO/section-3/3_1_2.png)

作成したトークンをカスタムトークンとしてMetaMaskに追加することも可能です。

MetaMask"Import Token" をクリックするだけです。

![](/public/images/ETH-DAO/section-3/3_1_3.png)

あなたのERC-20コントラクトのアドレスを貼り付けると、MetaMaskが魔法のように自動的にトークン・シンボルを追加してくれます。

![](/public/images/ETH-DAO/section-3/3_1_4.png)

そして、ウォレットに戻りスクロールすると追加されているのが確認できます。

![](/public/images/ETH-DAO/section-3/3_1_5.png)

さて、これで正式に自分のトークンを持つことができましたね！


### 💸 トークンを供給する

今現在、**人々が claim できるトークンはゼロです。**

そのため、私たちはコントラクトに利用可能なトークン数を別途伝える必要があります！

`src/scripts/6-print-money.ts`を作成し、下記コードを追加しましょう。

```typescript
import sdk from './1-initialize-sdk';
import { ERCTokenAddress } from './module';

// これは、前のステップで取得した私たちの ERC-20 コントラクトのアドレスです。
const token = sdk.getContract(ERCTokenAddress, 'token');

(async () => {
  try {
    // // 設定したい最大供給量を設定
    const amount = 1000000;
    // デプロイされた ERC-20 コントラクトを通して、トークンをミント
    await (await token).mint(amount);
    const totalSupply = await (await token).totalSupply();

    // 今、私たちのトークンがどれだけあるかを表示
    console.log(
      '✅ There now is',
      totalSupply.displayValue,
      '$TSC in circulation',
    );
  } catch (error) {
    console.error('Failed to print money', error);
  }
})();

```

間違ったアドレスを入力すると、`UNPREDICTABLE_GAS_LIMIT`のようなエラーが表示されることがあります。

繰り返しになりますが、このアドレスを紛失した場合は、[thirdweb のダッシュボード](https://thirdweb.com/dashboard) から参照することができます！

これで、トークンコントラクトが出来上がったことが確認できると思います。

![](/public/images/ETH-DAO/section-3/3_1_6.png)

ここでは、実際にトークン供給をミントし、 `amount`を設定し、トークンの最大供給量として設定しています。

それでは、ターミナルに移動し、下記コマンドを実行してみましょう。

```
yarn node --loader ts-node/esm src/scripts/6-print-money.ts
```

以下のような表示がされたら、成功です。

```
SDK initialized by address: 0x8cB688A30D5Fd6f2e5025d8915eD95e770832933
✅ There now is 1000000.0 $TSC in circulation
Done in 32.95s.
```

[Etherscan](https://sepolia.etherscan.io/) でERC-20コントラクトの画面を表示し、`More Info`から`Token Tracker`のリンクを表示させます。

![](/public/images/ETH-DAO/section-3/3_1_7.png)

すると、すべての供給情報とトークン保持者、トークンの移動履歴、移動したトークン量などが表示されます。

また、ここでは「最大総供給量」も表示されます。

![](/public/images/ETH-DAO/section-3/3_1_8.png)

これをすべて、数行のTypeScriptで実現しました。

これはとてもすごいことです。

やろうと思えば、文字通りこの時点で次のミームコインを作ることもできますね（笑）。


### ✈️ エアドロップしよう

では、いよいよエアドロップの時間です。

今、あなたは恐らくこのDAOにおける唯一のメンバーでしょう。

`src/scripts/7-airdrop-token.ts`を作成し、以下のコードを追加してください。

```typescript
import sdk from './1-initialize-sdk';
import { editionDropAddress, ERCTokenAddress } from './module';

// ERC-1155 メンバーシップの NFT コントラクトアドレス
const editionDrop = sdk.getContract(editionDropAddress, 'edition-drop');

// ERC-20 トークンコントラクトのアドレス
const token = sdk.getContract(ERCTokenAddress, 'token');

(async () => {
  try {
    // メンバーシップ NFT を所有している人のアドレスをすべて取得
    // tokenId が 0 メンバーシップ NFT
    const walletAddresses = await (
      await editionDrop
    ).history.getAllClaimerAddresses(0);

    if (walletAddresses.length === 0) {
      console.log(
        'No NFTs have been claimed yet, maybe get some friends to claim your free NFTs!',
      );
    }

    // アドレスの配列をループ
    const airdropTargets = walletAddresses.map((address) => {
      // 1000 から 10000 の間でランダムな数を取得
      const randomAmount = Math.floor(
        Math.random() * (10000 - 1000 + 1) + 1000,
      );
      console.log('✅ Going to airdrop', randomAmount, 'tokens to', address);

      // ターゲットを設定
      const airdropTarget = {
        toAddress: address,
        amount: randomAmount,
      };

      return airdropTarget;
    });

    // 全てのエアドロップ先で transferBatch を呼び出す
    console.log('🌈 Starting airdrop...');
    await (await token).transferBatch(airdropTargets);
    console.log(
      '✅ Successfully airdropped tokens to all the holders of the NFT!',
    );
  } catch (err) {
    console.error('Failed to airdrop tokens', err);
  }
})();
```

少し長いですが、1つずつ丁寧に見ていきましょう。

まず、`editionDrop`と`token`の両方のコントラクトが必要であることがわかります。

`editionDrop`からNFTのホルダーを取得し、`token`の関数を使ってトークンをミントする必要があります。

ここでは`getAllClaimerAddresses`を使用して、tokenId `"0"`のメンバーシップNFTを持っている人のすべての`walletAddresses`を取得します。

そこから、すべての`walletAddresses`をループして、各ユーザーにエアドロップするトークンの`randomAmount`を選び、このデータを`airdropTarget`に格納します。

最後に、すべての`airdropTargets`に対して`transferBatch`を実行します。

`transferBatch`は自動的にすべてのターゲットをループし、トークンを送信します！

それでは、ターミナルに移動し、下記コマンドを実行してみましょう。

```
yarn node --loader ts-node/esm src/scripts/7-airdrop-token.ts
```

以下のような表示がされたら成功です。

```
SDK initialized by address: 0x8cB688A30D5Fd6f2e5025d8915eD95e770832933
✅ Going to airdrop 5205 tokens to 0x0310b7F40EbdB4A8200a6aC581ECA9420d1214e8
✅ Going to airdrop 2602 tokens to 0x8cB688A30D5Fd6f2e5025d8915eD95e770832933
🌈 Starting airdrop...
✅ Successfully airdropped tokens to all the holders of the NFT!
Done in 33.52s.
```

これでエアドロップできました！

私の場合、DAOに2人のユニークなメンバーがいるのですが、その2人全員がエアドロップを受け取っています。

あなたの場合、今はあなただけかもしれませんね。

このスクリプトは、メンバーが増えたら、また自由に実行してください。

**現実世界では**、エアドロップは通常1回しか起こりません。

でも、今はハッキングしているだけだから大丈夫。

それに、この世界には本当のルールはないんです（笑）。

1日4回のエアドロップがやりたければ、やってみればいいんです。

自分なりのエアドロップの方程式を作ってもいいかもしれませんね。

トークンを受け取った人は、「DAOに対してより大きな力を持つことになる」と考えたいところです。

これは良いことなのでしょうか？

最大のトークンホルダーはDAOのために正しいことをしようとしているのでしょうか？

これはトークノミクスという非常に幅広いトピックに関わることで、[ここ](https://www.google.com/search?q=tokenomics)で読むことができます。

気になる方はトークノミクスの世界をぜひ覗いてみてください。

ちなみに、EtherscanのERC-20コントラクトに戻ると、新しいトークンホルダーと、彼らが所有する`$TSC`の量がわかります。

![](/public/images/ETH-DAO/section-3/3_1_9.png)


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

次のレッスンでは、会員限定のダッシュボードを実際につくっていきます！

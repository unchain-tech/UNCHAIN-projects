### 🥳 Initialize SDK

前回のLessonにより、thirdwebのスクリプトを実行する環境構築を行いました。

それでは実際にスクリプトを書き、メンバーシップNFTをコントラクトにデプロイしていきましょう。

`src/scripts/1-initialize-sdk.ts`を作成して、以下を追加します。

```typescript
import nextEnv from '@next/env';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

// 環境変数を env ファイルから読み込む
const { loadEnvConfig } = nextEnv;
const { PRIVATE_KEY, CLIENT_ID, SECRET_KEY } = loadEnvConfig(
  process.cwd(),
).combinedEnv;

// 環境変数が取得できているか確認
if (!PRIVATE_KEY || PRIVATE_KEY === '') {
  console.log('🛑 Private key not found.');
}

if (!CLIENT_ID || CLIENT_ID === '') {
  console.log('🛑 Client ID of API Key not found.');
}

if (!SECRET_KEY || SECRET_KEY === '') {
  console.log('🛑 Secret Key of API Key not found.');
}

const sdk = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY!, 'sepolia', {
  clientId: CLIENT_ID,
  secretKey: SECRET_KEY,
});

// ここでスクリプトを実行
(async () => {
  try {
    if (!sdk || !('getSigner' in sdk)) return;
    const address = await sdk.getSigner()?.getAddress();
    console.log('SDK initialized by address:', address);
  } catch (err) {
    console.error('Failed to get apps from the sdk', err);
    process.exit(1);
  }
})();

// 初期化した sdk を他のスクリプトで再利用できるように export
export default sdk;
```

たくさんあるように見えますが、やっていることは以下の2つだけです。

- thirdwebの初期化
- 初期化したSDKを他のスクリプトで再利用できるようにexport

これは、サーバーからデータベースへの接続を初期化するのと似ています。


### 🍬 SDK の初期化を実行する

次に、以下を参考に`package.json`に`"type": "module",`の記述を追加してESModulesを有効化してts-nodeを使用できるように設定を変更します。

![](/public/images/ETH-DAO/section-2/2_2_1.png)

続いて、`next.config.js`を以下のとおり変更します。

```typescript
/** @type {import('next').NextConfig} */
export const nextConfig = {
  reactStrictMode: true,
};
```

ここまで準備ができたら、ターミナルに移動して以下のコマンドを実行しましょう。

```
yarn node --loader ts-node/esm src/scripts/1-initialize-sdk.ts
```

スクリプトを実行して成功すれば、以下のような結果が出力されます。

```
SDK initialized by address: 0x8cB688A30D5Fd6f2e5025d8915eD95e770832933
Done in 3.62s.
```

ウォレットのアドレスが表示されたら、SDKの初期化が正常に完了したことを意味しています。

_📝 備考: `ExperimentalWarning`のようなランダムな警告が表示されることがありますが、アドレスが表示されていることを確認してください_


### 🧨 ERC-1155 のメンバーシップ NFT コレクションを作ろう

これから行うのは、[ERC-1155](https://ethereum.org/ja/developers/docs/standards/tokens/erc-1155/) コントラクトを作成し、Sepoliaテストネットにデプロイすることです。

現段階ではNFTを作成せず、コレクション自体のメタデータを設定するところまで行います。

ここで言うメタデータとは、コレクションの名前（例： CryptoPunks）や、コレクションに関連する画像（OpenSeaでヘッダーとして表示されます）などとなります。

[ERC-721](https://ethereum.org/ja/developers/docs/standards/tokens/erc-721/) をご存知の方は、同じ画像、名前、プロパティを持つNFTであっても、それぞれユニークです。

一方で、[ERC-1155](https://ethereum.org/ja/developers/docs/standards/tokens/erc-1155/) では、複数の人が同じNFTの所有者になることができます。

今プロジェクトで作る「メンバーシップNFT」は全員が同じもので問題ないので、毎回新しいNFTを作るのではなく、会員全員に同じNFTを割り当てるだけでいいのです。

この方がガス効率も良く、DAOではこの手法が一般的です。

では、`src/scripts/2-deploy-drop.ts`を作成し、次のコードを追加してください。

※ コレクションのアイコンとなる画像はお気に入りの画像に変更しておきましょう。

```typescript
import { AddressZero } from '@ethersproject/constants';
import { readFileSync } from 'fs';

import sdk from './1-initialize-sdk';

(async () => {
  try {
    const editionDropAddress = await sdk.deployer.deployEditionDrop({
      // コレクションの名前（あなたの作成する DAO の名前に入れ替えてください）
      name: 'Tokyo Sauna Collective',
      // コレクションの説明（同じく書き換えてください）
      description: 'A DAO for sauna enthusiasts in Tokyo',
      // コレクションのアイコンとなる画像（ローカルの画像を参照すること）
      image: readFileSync('src/scripts/assets/test.jpg'),
      // NFT の販売による収益を受け取るアドレスを設定
      // ドロップに課金をしたい場合は、ここに自分のウォレットアドレスを設定します
      // 今回は課金設定はないので、0x0 のアドレスで渡す
      primary_sale_recipient: AddressZero,
    });

    // 初期化し、返ってきた editionDrop コントラクトのアドレスから editionDrop を取得
    const editionDrop = sdk.getContract(editionDropAddress, 'edition-drop');

    // メタデータを取得
    const metadata = await (await editionDrop).metadata.get();

    // editionDrop コントラクトのアドレスを出力
    console.log(
      '✅ Successfully deployed editionDrop contract, address:',
      editionDropAddress
    );

    // editionDrop コントラクトのメタデータを出力
    console.log('✅ editionDrop metadata:', metadata);
  } catch (error) {
    // エラーをキャッチしたら出力
    console.log('failed to deploy editionDrop contract', error);
  }
})();
```

とてもシンプルなスクリプトです。

コレクションに`name`、`description`、`image`、`primary_sale_recipient`を指定します。

画像はローカルファイルから読み込むので、`scripts`フォルダ以下に`assets`フォルダを新規作成し、`src/scripts/assets`の中にその画像を必ず入れてください。

※ 画像はPNG、JPG、GIFのいずれかとし、ローカルの画像であることを確認してください。

_⚠️ 注意： インターネットのリンク(ex. https://~)を使用すると動作しません_

では、ターミナルに移動し下記コマンドを実行してみましょう。

```
yarn node --loader ts-node/esm src/scripts/2-deploy-drop.ts
```

成功すると、以下のように得られた結果が出力されます（少し時間がかかります）。

```
SDK initialized by address: 0x8cB688A30D5Fd6f2e5025d8915eD95e770832933
✅ Successfully deployed editionDrop contract, address: 0x445c4D7d80EA463f29Ab0411A33dd760F8181546
✅ editionDrop metadata: {
  name: 'Tokyo Sauna Collective',
  description: 'A DAO for sauna enthusiasts in Tokyo',
  image: 'https://gateway.ipfscdn.io/ipfs/QmSofk2vWgECKmY6ovmGUD2Q89p9xx4qtR3kGeYYzcJmc7/0',
  seller_fee_basis_points: 0,
  fee_recipient: '0x0000000000000000000000000000000000000000',
  merkle: {},
  symbol: ''
}
Done in 40.59s.
```

さて、今起こったことは、とても壮大なことです。

以下の2つのことが起こりました。

**1 つは、ERC-1155 のコントラクトを Sepolia にデプロイしたこと**です。

実際に[こちら](https://sepolia.etherscan.io/)にアクセスし、`editionDrop`コントラクトのアドレス(出力の`✅ Successfully deployed editionDrop contract, address:`以下のアドレス)を貼り付けると、スマートコントラクトがデプロイされたことが分かります。

このコントラクトはあなたが所有し、あなたのウォレットからデプロイされました。

ではここでデプロイされたコントラクトのアドレスを保存するためのファイルを作成します。`src/scripts/`に`module.ts`という名前でファイルを作成して下のような変数を作成しましょう。

```js
export const editionDropAddress = '';
export const ERCTokenAddress = '';
export const governanceAddress = '';
export const ownerWalletAddress = '';

```

そして一番上の変数`editionDropAddress`に先ほど取得したコントラクトのアドレスを,
変数`ownerWalletAddress`には自分のウォレットアドレスを代入しましょう。

最終的には下のようになります。

```js
export const editionDropAddress = '0x051300f66FD67a8B94D3d64B1e5d07f23BC90170';
export const ERCTokenAddress = '0x238B28BaE48dA495125aE2B6623094C5f74CCAD5';
export const governanceAddress = '0x62e06783EA7490367f3413B79331AC328cb6e00D';
export const ownerWalletAddress = '0xa9eD1748Ffcda5442dCaEA242603E7e3FF09dD7F';

```

コントラクトの作成の過程で、ERC-1155トークンとガバナンストークンのコントラクトをデプロイすることになりますが同様にこのファイルにコントラクトアドレスを保存しておきましょう。

_📝 備考： `editionDrop`のアドレスは、後で必要になるので保管しておいてください。もし紛失した場合は、いつでも [thirdweb のダッシュボード](https://thirdweb.com/dashboard)から取得することができます。_

![](/public/images/ETH-DAO/section-2/2_2_2.png)

TypeScriptだけでデプロイされた独自コントラクトですが、thirdwebが内部で実際に使用しているスマートコントラクトのコードは[こちら](https://github.com/thirdweb-dev/contracts/blob/main/contracts/drop/DropERC1155.sol)から確認できます。

もうひとつは、**thirdweb が自動的にコレクションの画像を IPFS にアップロードして URL を挿入してくれたこと**です。

`https://gateway.ipfscdn.io`で始まるリンクが出力されているのがわかると思います。

ブラウザにリンクを貼り付けると、CloudFlare経由でIPFSから取得されたNFTの画像が表示されます。

_📝 備考：`ipfs://` URI を使って IPFS を直接叩くこともできます (注意 - Chrome では IPFS ノードを実行する必要があるので動作しませんが、Brave では動作します)。_

Solidityで独自コントラクトを開発したことがある人なら、ちょっと心惹かれるのではないでしょうか。

すでにSepoliaネットワークにデプロイされた独自コントラクトとIPFSにホストされたデータが保持されています。


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

次のレッスンでは、実際にNFTを作成していきます！

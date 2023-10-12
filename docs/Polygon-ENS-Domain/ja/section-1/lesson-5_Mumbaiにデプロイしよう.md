前回までで私たちはチェーン上でPolygonがどのように機能するかについて学んできました。

**おめでとうございます-これで、Polygon の Testnet にデプロイする準備が整いました。**

実際にやってみましょう!

### 💳 トランザクション

さてはじめに、コントラクトがどのように機能するかを簡単に説明しておきます。

コントラクトのデプロイはトランザクションとしてカウントされます。 また、ブロックチェーン上の他のトランザクションと同様に、ネットワーク全体が新しい変更を認識する必要があります。 これは、チェーンに新しいコントラクトを追加したり、誰かがMATICを送信したりするときと同じです。

コントラクトをデプロイするときは、**すべての**ノードに次のようなことを伝える必要があります。

**「これは新しいスマートコントラクトです。私のスマートコントラクトをブロックチェーンに追加してから、他の人にもそのことを伝えてください」**

**（以下の Alchemy や Mumbai ネットの設定は他の課題で既に学習している場合は適宜ご自身で割愛してください）**

ここで[Alchemy](https://alchemy.com/)を使います。

Alchemyは、世界中のトランザクションを一元化し、マイナーの承認を促進するプラットフォームです。

[こちら](https://www.alchemy.com/) からAlchemyのアカウントを作成してください。

### 💎 Alchemy でネットワークを作成

**_なお Alchemy の Dadhboard がなかなか開けないなどの不調がごくまれに起こる場合があります。その場合は 1 日程度時間を置いてから作業すると回復します。この場合、こちらで何かをすることはできません。ひと休みですね。_**

Alchemyのアカウントを作成したら、Dashboardの`CREATE APP`ボタンを押してください。
![](/public/images/Polygon-ENS-Domain/section-1/1_5_1.png)

次に、下記の項目を埋めていきます。下図を参考にしてください。

![](/public/images/Polygon-ENS-Domain/section-1/1_5_2.png)

- `NAME`: プロジェクトの名前(例: `CoolDomains`)
- `DESCRIPTION`: プロジェクトの概要(例：`ENS on Polygon`)
- `CHAIN`: `Polygon`を選択。
- `NETWORK`: `Polygon Mumbai`を選択。

それから、作成したAppの`VIEW DETAILS`をクリックします。

![](/public/images/Polygon-ENS-Domain/section-1/1_5_3.png)

プロジェクトを開いたら、`VIEW KEY`ボタンをクリックします。

ポップアップが開くので、`HTTP`のリンクをコピーしてください。

これがあなたが本番環境のネットワークに接続する際に使用する`API Key`になります。

- **`API Key`は、今後必要になるので、PC 上のわかりやすいところに保存しておきましょう。**

### 🦊 Metamask

Metamaskが必要ですが、インストールについてはETH-dAPPなど別の基礎的な課題を適宜参照ください。

ここでは割愛します。

### 💜 MetaMask と Hardhat に Polygon Network を追加する

MetaMaskウォレットにMatic MainnetとPolygon Mumbai-Testnetを追加してみましょう。

**1 \. Matic Mainnet を MetaMask に接続する**

Matic MainnetをMetaMaskに追加するには、次の手順に従ってください。

まず、[Polygonscan](https://polygonscan.com/) に向かい、ページの一番下までスクロールして、`Add Polygon Network`ボタンをクリックします。

![](/public/images/Polygon-ENS-Domain/section-1/1_5_4.png)

下記のようなポップアップが立ち上がったら、`Switch Network`をクリックしましょう。

![](/public/images/Polygon-ENS-Domain/section-1/1_5_5.png)

`Matic Mainnet`があなたのMetaMaskにセットアップされました。

![](/public/images/Polygon-ENS-Domain/section-1/1_5_6.png)

**2 \. Polygon Mumbai-Testnet を MetaMask に接続する**

Polygon Mumbai-TestnetをMetaMaskに追加するには、次の手順に従ってください。

まず、[mumbai.polygonscan.com](https://mumbai.polygonscan.com/) に向かい、ページの一番下までスクロールして、`Add Mumbai Network`ボタンをクリックします。

`Matic Mainnet`を設定した時と同じ要領で`Polygon Testnet`をあなたのMetaMaskに設定してください。

### 🚰 偽 MATIC を入手する

MetaMaskとHardhatの両方でPolygonネットワークの設定が完了したら、偽のMATICを取得していきましょう。

[こちら](https://faucet.polygon.technology/) にアクセスして、下記のように偽MATICをリクエストしてください。

![](/public/images/Polygon-ENS-Domain/section-1/1_5_7.png)

1回のリクエストでは少量ですので、数回リクエストして、1 MATIC程度入手しましょう。

間隔を置かずにリクエストするとはじかれることもあるので少し時間を置いてみましょう。

**⚠️: Polygon のメインネットワークにコントラクトをデプロイする際の注意事項**

> Polygon のメインネットワークにコントラクトをデプロイする準備ができたら、本物の MATIC を入手する必要があります。
>
> これには 2 つの方法があります。
>
> 1. イーサリアムのメインネットで MATIC を購入し、Polygon のネットワークにブリッジする。
>
> 2. 仮想通貨の取引所（ WazirX や Coinbase など）で MATIC を購入し、それを直接 MetaMask に転送する。
>
> Polygon のようなサイドチェーンの場合、`2`の方が簡単で安く済みます。

### 🇮🇳 Polygon テストネットにコントラクトをデプロイする

準備完了です!

### 🚀 deploy.js ファイルを設定します

デプロイすれば世界中の人々がアクセス可能になります 🌎

覚えているかと思いますが、以前のレッスンでローカルブロックチェーンにデプロイするため`run.js`ファイルを作成し、そのファイルでいくつかの関数を実行してテストしました。 ムンバイのテストネットにデプロイする場合、テストネットにデプロイ用の別のファイルを作成する必要があります。

`run.js`とは別でファイルを作成します。`scripts`ディレクトリの中にある`deploy.js`を以下のとおり更新します。`console.log`ステートメントが多いことを除けば、`run.js`ファイルと非常によく似ています。

```javascript
const main = async () => {
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  const domainContract = await domainContractFactory.deploy('ninja');
  await domainContract.deployed();

  console.log('Contract deployed to:', domainContract.address);

  // domainをオリジナルにしましょう！
  let txn = await domainContract.register('banana', {
    value: hre.ethers.utils.parseEther('0.1'),
  });
  await txn.wait();
  console.log('Minted domain banana.ninja');

  txn = await domainContract.setRecord('banana', 'Am I a banana or a ninja??');
  await txn.wait();
  console.log('Set record for banana.ninja');

  const address = await domainContract.getAddress('banana');
  console.log('Owner of domain banana:', address);

  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log('Contract balance:', hre.ethers.utils.formatEther(balance));
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
```

### 📈 ムンバイテストネットにデプロイする

いよいよです!

テストネットでスマートコントラクトをデプロイする前に、いくつか変更を加える必要があります。

`hardhat.config.js`ファイルを編集します。 これは、スマートコントラクトプロジェクトのルートディレクトリにあります。 ここでは、使用しているネットワークと秘密鍵を追加します。

```javascript
require('@nomicfoundation/hardhat-toolbox');

module.exports = {
  solidity: '0.8.17',
  networks: {
    mumbai: {
      url: 'YOUR_ALCHEMY_MUMBAI_URL',
      accounts: ['YOUR_TEST_WALLET_PRIVATE_KEY'],
    },
  },
};
```

開発とテストのために、MetaMask（または使用している他のEthereumウォレットアプリ）内に別のウォレットを作成することを**強くお勧めします**。 所要時間は約10秒です。秘密鍵を記載したPublicリポジトリを公開した場合はウォレット内のすべてのTokenが無くなることも覚悟しなければなりません。


数ステップ前に取得したAPIのURLを準備します。`url`のところで使用します。 アプリがPolygonMumbaiテストネット用であることを確認してください。 次に、[メタマスクから取得](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key)できる**秘密鍵**（パブリックアドレスではありません!）が必要になります。`accounts`のところで使用します。

**注：このファイルを GitHub にコミットしないでください。 現在秘密鍵を扱っています。 公開したらハッキングされて資産を奪われます。 この秘密鍵は、メインネットの秘密鍵と同じです。** 後で、`.env`変数で公開しないで取り扱う方法について説明します。

それまでの間、 `.gitignore`ファイルを開き、`hardhat.config.js`の行を追加します。 これは、後で`.env`を設定するときに削除できます。

なぜ秘密鍵を使用する必要があるのでしょうか？

コントラクトのデプロイなどのトランザクションを実行するには、ブロックチェーンに「ログイン」して、コントラクトに署名/デプロイする必要があるためです。 また、ユーザー名はパブリックアドレスであり、パスワードは秘密鍵です。AWSやGCPにログインしてデプロイするようなものです。

configのセットアップが完了すると、前に作成した`deploy.js`スクリプトを使用してデプロイするように設定されます。

このコマンドは、`Polygon-ENS-Domain`のルートディレクトリから実行します。

```
yarn contract deploy
```

通常、デプロイには20〜40秒かかります。 デプロイしているだけではありません。`deploy.js`ではNFTも作成しているので、これにも時間がかかります。 実際には、トランザクションが「マイニング」されてノードによって取得されるのを待つ必要があります。 その1つのコマンドですべてを実行できます。 問題なければ、次のような結果が表示されます。

Mumbaiもストップしていることがまれにありますのでその場合は時間を置いてから実施してください。

こちらの[Mumbai Polygonscan](https://mumbai.polygonscan.com/)から正常に作動しているか確認してみると良いでしょう。

```
Contract deployed to: 0x6C45313E2F7e4Fd85f56E66c559bfFc23E726c1d
Minted domain banana.ninja
Set record for banana.ninja
Owner of domain banana: 0xf280e1A88D8eE02140828C8BD06DE71b3483Fd69
Contract balance: 0.01
```
---

なお、これから先の学習でもトランザクションを起こそうとした場合に

`JSON RPC error`（エラーコード32603）

が発生した場合は、しばらく待ってから進めてください。

（日を変えるぐらい待ってもいいかもしれません）。

コードに起因するエラーではなく、RPCなど外部環境によるものです。

RPCについては検索してみてください。

---



**Polygon にデプロイできました ✨**

先に進む前に、問題ないか確認しましょう。 これは先ほどの[Mumbai Polygonscan](https://mumbai.polygonscan.com/)を使用して行うことができます。

ここで、ターミナルに出力されたコントラクトアドレスを貼り付けて、何が起こっているかを確認できます。

すべてが問題なく機能した場合は、コントラクトに基づいて実行されたいくつかのトランザクションを確認できるはずです。

![](/public/images/Polygon-ENS-Domain/section-1/1_5_8.png)

Polygonscanの使用に慣れると便利です。これは、問題が発生した場合にデプロイを追跡して問題を解決する最も簡単なツールです。Polygonscanに表示されない場合は、まだ処理中であるか、問題が発生したことを意味します。

エラーがなければ、**コントラクトをデプロイできました!**

### 🐝 OpenSea で NFT を確認する

コントラクトアドレス(`Contract deployed to`に続く`0x..`)をターミナルからコピーして、[テストネット用の OpenSea](https://testnets.opensea.io/) に貼り付け、検索してみてください。
**コントラクトアドレスはご自身のターミナルに表示されているものを使用してください。**

![](/public/images/Polygon-ENS-Domain/section-1/1_5_9.png)

独自のドメインコントラクトを作成し、**ドメインを作成できました!**

### 🙀 NFT が 表示されない場合

数分待ってもNFTがOpenSeaに表示されない場合は、[testnets.dev](http://testnets.dev)というサイトにアクセスしてください。 上部のテストネット選択でMatic Mumbaiを選択し、コントラクトアドレスを入力して、トークンIDを0に設定します。 これで実際のブロックチェーンであなたのドメインを見ることができます。

![](/public/images/Polygon-ENS-Domain/section-1/1_5_10.png)

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#polygon`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

お疲れ様でした。ひと休みして次のレッスンに進んでくださいね 🎉

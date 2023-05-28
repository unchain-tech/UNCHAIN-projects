### 💥 コントラクトをSubnetにデプロイしましょう

`contract`ディレクトリ直下に`.env`という名前のファイルを作成し、以下を記入してください。

```
TEST_ACCOUNT_PRIVATE_KEY="YOUR_PRIVATE_KEY"
```

`"YOUR_PRIVATE_KEY"`の部分を管理者アカウントの秘密鍵と入れ替えてください。  
※管理者アカウント: section1-Lesson_3でgenesis fileに記載したアドレスのアカウントです。

> `YOUR_PRIVATE_KEY`の取得
>
> 1.  お使いのブラウザからMetaMaskを開き、管理者アカウントを選択します。
>
> ![](/public/images/AVAX-Subnet/section-2/3_3_1.png)
>
> 2.  それから、`Account details`を選択してください。
>
> ![](/public/images/AVAX-Subnet/section-2/3_3_2.png)
>
> 3.  `Account details`から`Export Private Key`をクリックしてください。
>
> ![](/public/images/AVAX-Subnet/section-2/3_3_3.png)
>
> 4.  MetaMask のパスワードを求められるので、入力したら`Confirm`を押します。  
>     あなたの秘密鍵（＝ `Private Key` ）が表示されるので、クリックしてコピーします。
>
> `.env`内の`YOUR_PRIVATE_KEY`の部分をここで取得した秘密鍵とを入れ替えます。

⚠️gitignoreファイルに`.env`が記述されていることを確認して下さい。  
秘密鍵は外部に漏れないようにGitHubに上げません。

次に`contract`ディレクトリ直下にある`hardhat.config.ts`中身を以下のコードに書き換えてください。  
※ solidityのバージョンの部分(`solidity: "0.8.17",`)は元々記載されているものを使用してください。

```ts
// 環境構築時にこのパッケージはインストールしてあります。
import * as dotenv from 'dotenv';
import '@nomicfoundation/hardhat-toolbox';
import { HardhatUserConfig } from 'hardhat/config';

// .envファイルから環境変数をロードします。
dotenv.config();

if (process.env.TEST_ACCOUNT_PRIVATE_KEY === undefined) {
  console.log('private key is missing');
}

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  networks: {
    local: {
      url: 'RPC URL',
      gasPrice: 225000000000,
      chainId: 321123,
      accounts:
        process.env.TEST_ACCOUNT_PRIVATE_KEY !== undefined
          ? [process.env.TEST_ACCOUNT_PRIVATE_KEY]
          : [],
    },
  },
};

export default config;
```

`'RPC URL'`の部分に、section1のLesson_3で保存したRPC URLを貼り付けます。

> RPCの確認は`avalanche network status`を実行すると`Custom VM information`の欄にrpcの情報が表示されるので、いずれか1つのURLをコピーして使用してください。  
> (※ ネットワークが起動してない場合は`avalanche network start`を実行してください。)

例えば、このように書き換えます。

```
      url: 'http://127.0.0.1:9654/ext/bc/2vVjEw8dH2SVtkuC75CgofJNj5DKqJBfoc1ez3cYnvyu5kywWH/rpc',
```

また、chainIdなども事前に設定したものと同じか確認してください。

続いて、`scripts`ディレクトリ内にある`deploy.ts`を以下のコードに書き換えてください。

```ts
import { Overrides } from 'ethers';
import { ethers } from 'hardhat';

async function deploy() {
  const [deployer] = await ethers.getSigners();

  const fund = ethers.utils.parseEther('200');

  const Bank = await ethers.getContractFactory('Bank');
  const bank = await Bank.deploy({
    value: fund,
  } as Overrides);
  await bank.deployed();

  console.log('bank address:', bank.address);
  console.log('deployer address:', deployer.address);
}

deploy()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
```

このスクリプトを実行する際に先ほど`hardhat.config.ts`で設定したネットワークを指定すると、`ethers.getSigners()`の返す初めのアカウントの値はあなたのアカウントのアドレスになります。

それでは`contract`ディレクトリ直下で下記のコマンドを実行してデプロイします！

```
$ npx hardhat run scripts/deploy.ts --network local
```

このような出力結果が出たら成功です！

```
% npx hardhat run scripts/deploy.ts --network local
bank address: 0x1Ae90672a06fD28311ac3Efce7Cd2660E78fa6f1
deployer address: 0x9726A1976148789be35a4EEb6AEfBBF4927b04AC
```

> このようなエラーが出た場合は、.envファイルが正しい場所に作成されておらず、アカウントが参照できないなどの原因が考えられます。
> ```
> % npx hardhat run scripts/deploy.ts --network local
> private key is missing
> private key is missing
> TypeError: Cannot read properties of null (reading 'sendTransaction')
> ...
> ```

最後に`.gitignore`に`.env`が含まれていることを確認してください!

### 🌔 参考リンク

> [こちら](https://github.com/unchain-dev/AVAX-Subnet)に本プロジェクトの完成形のレポジトリがあります。  
> 期待通り動かない場合は参考にしてみてください。  

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#avalanche`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット

```

---

スマートコントラクトのデプロイができました 🎉

次のsectionではフロントエンドを構築します！

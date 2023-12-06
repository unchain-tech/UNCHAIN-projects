これまでフロントエンドにUIを用意し、 ウォレットとの接続も出来ました！

このレッスンではあなたのスマートコントラクトをデプロイし、 フロントエンドと連携します。

### 🌵 コントラクトとの接続部分を実装しましょう

`client`ディレクトリへ移動してください。

### 📁 `hooks`ディレクトリ

`hooks`ディレクトリ内に`useContract.ts`というファイルを作成し、 以下のコードを記述してください。
💁 現時点ではまだ用意していないファイルからimportしている箇所があるためエラーメッセージが出ても無視して大丈夫です。

```ts
import { ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';

import AssetTokenizationArtifact from '../artifacts/AssetTokenization.json';
import { AssetTokenization as AssetTokenizationType } from '../types';
import { getEthereum } from '../utils/ethereum';

export const AssetTokenizationAddress =
  'コントラクトのデプロイ先アドレス';

type PropsUseContract = {
  currentAccount: string | undefined;
};

type ReturnUseContract = {
  assetTokenization: AssetTokenizationType | undefined;
};

export const useContract = ({
  currentAccount,
}: PropsUseContract): ReturnUseContract => {
  const [assetTokenization, setAssetTokenization] =
    useState<AssetTokenizationType>();
  const ethereum = getEthereum();

  const getContract = useCallback(
    (
      contractAddress: string,
      abi: ethers.ContractInterface,
      storeContract: (_: ethers.Contract) => void,
    ) => {
      if (!ethereum) {
        console.log("Ethereum object doesn't exist!");
        return;
      }
      if (!currentAccount) {
        // ログインしていない状態でコントラクトの関数を呼び出すと失敗するため
        // currentAccountがundefinedの場合はcontractオブジェクトもundefinedにします。
        console.log("currentAccount doesn't exist!");
        return;
      }
      try {
        const provider = new ethers.providers.Web3Provider(
          ethereum as unknown as ethers.providers.ExternalProvider,
        );
        const signer = provider.getSigner(); // 簡易実装のため、引数なし = 初めのアカウント(account#0)を使用する
        const Contract = new ethers.Contract(contractAddress, abi, signer);
        storeContract(Contract);
      } catch (error) {
        console.log(error);
      }
    },
    [ethereum, currentAccount],
  );

  useEffect(() => {
    getContract(
      AssetTokenizationAddress,
      AssetTokenizationArtifact.abi,
      (Contract: ethers.Contract) => {
        setAssetTokenization(Contract as AssetTokenizationType);
      },
    );
  }, [ethereum, currentAccount, getContract]);

  return {
    assetTokenization,
  };
};
```

主な関数は`getContract`で、 接続している`currentAccount`やコントラクトのアドレス・ABIを元にコントラクトに接続し、stateに保存します。

### 💥 コントラクトをテストネットにデプロイしましょう

コントラクトとの接続部分を作成したので、 コントラクトを使用するために、 テストネットへデプロイします。

`contract`ディレクトリへ移動してください。

`.env`という名前のファイルを作成し、 以下を記入してください。

`"YOUR_PRIVATE_KEY"`の部分をあなたのアカウントの秘密鍵と入れ替えてください。

```
TEST_ACCOUNT_PRIVATE_KEY="YOUR_PRIVATE_KEY"
```

> `YOUR_PRIVATE_KEY`の取得
>
> 1.  お使いのブラウザから、MetaMask プラグインをクリックして、ネットワークを`Avalanche FUJI C-Chain`に変更します。
>
> ![](/public/images/AVAX-Asset-Tokenization/section-2/3_3_1.png)
>
> 2.  それから、`Account details`を選択してください。
>
> ![](/public/images/AVAX-Asset-Tokenization/section-2/3_3_2.png)
>
> 3.  `Account details`から`Export Private Key`をクリックしてください。
>
> ![](/public/images/AVAX-Asset-Tokenization/section-2/3_3_3.png)
>
> 4.  MetaMask のパスワードを求められるので、入力したら`Confirm`を押します。
>     あなたの秘密鍵（＝ `Private Key` ）が表示されるので、クリックしてコピーします。
>
> ![](/public/images/AVAX-Asset-Tokenization/section-2/3_3_4.png)

> - `.env`の`YOUR_PRIVATE_KEY`の部分をここで取得した秘密鍵とを入れ替えます。

⚠️gitignoreファイルに`.env`が記述されていることを確認して下さい。
秘密鍵は外部に漏れないようにGitHubに上げません。

> **✍️: スマートコントラクトをデプロイするのに秘密鍵が必要な理由** > **新しくスマートコントラクトをブロックチェーン上にデプロイすること**も、トランザクションの一つです。
>
> トランザクションを行うためには、ブロックチェーンに「ログイン」する必要があります。
>
> 「ログイン」には公開アドレスと秘密鍵の情報が必要となります。

次に`packages/contract`ディレクトリ直下にある`hardhat.config.ts`中身を以下のコードに書き換えてください。
※ solidityのバージョンの部分(`solidity: '0.8.17',`)は元々記載されているものを使用してください。

```ts
import * as dotenv from 'dotenv'; // 環境構築時にこのパッケージはインストールしてあります。
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
    fuji: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      chainId: 43113,
      accounts:
        process.env.TEST_ACCOUNT_PRIVATE_KEY !== undefined
          ? [process.env.TEST_ACCOUNT_PRIVATE_KEY]
          : [],
    },
  },
};

export default config;
```

続いて、 `scripts`ディレクトリ内にある`deploy.ts`を以下のコードに書き換えてください。

```ts
import { ethers } from 'hardhat';

async function deploy() {
  // コントラクトをデプロイするアカウントのアドレスを取得します。
  const [deployer] = await ethers.getSigners();

  // AssetTokenizationコントラクトをデプロイします。
  const AssetTokenization = await ethers.getContractFactory(
    'AssetTokenization'
  );
  const assetTokenization = await AssetTokenization.deploy();
  await assetTokenization.deployed();

  console.log('assetTokenization address:', assetTokenization.address);
  console.log('account address that deploy contract:', deployer.address);
}

deploy()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
```

このスクリプトを実行する際に先ほど`hardhat.config.ts`で設定したネットワークを指定すると、 `ethers.getSigners()`の返す初めのアカウントの値はあなたのアカウントのアドレスになります。

それでは`AVAX-Asset-Tokenization/`直下で下記のコマンドを実行してデプロイします！

```
yarn contract deploy
```

このような出力結果が出たら成功です！

```
yarn run v1.22.19
$ yarn workspace contract deploy
$ npx hardhat run scripts/deploy.ts --network fuji
assetTokenization address: 0x4E2F5941e079EcE9c1927fd7b9fc92fDB58E04cD
account address that deploy contract: 0xf6DA2F11E8f1faC2a13ac847d52FaF5Ce6e39954
```

`assetTokenization address:`に続くコントラクトのアドレスは、 次の項目で必要になるのでどこかに保存しておいてください。

### 🌵 スマートコントラクトの情報をフロントエンドに反映しましょう

コントラクトをデプロイしたので、 実際に使えるようにスマートコントラクトの情報をフロントエンドに渡します。

📽️ コントラクトのアドレスをコピーする

さきほどコントラクトをデプロイした際に表示されたアドレス

```
assetTokenization address: 0x4E2F5941e079EcE9c1927fd7b9fc92fDB58E04cD
```

を`packages/client`ディレクトリ内、 `hooks/useContract.ts`の中の以下の部分に貼り付けてください。

```ts
export const AssetTokenizationAddress =
  'コントラクトのデプロイ先アドレス';
```

例:

```ts
export const AssetTokenizationAddress =
  '0x4E2F5941e079EcE9c1927fd7b9fc92fDB58E04cD';
```

📽️ ABIファイルを取得する

ABIファイルは、コントラクトがコンパイルされた時に生成され、`artifacts`ディレクトリに自動的に格納されます。

`contract`からパスを追っていくと、 `contract/artifacts/contracts/~.sol/~.json`というファイルがそれぞれのコントラクトに対して生成されているはずです。

`client`の中に`artifacts`ディレクトリを作成し、 その中にコピーしてください。

`contract`直下からターミナルでコピーを行う場合、 このようなコマンドになります。

```
cp artifacts/contracts/AssetTokenization.sol/AssetTokenization.json ../client/artifacts/
```

📽️ 型定義ファイルを取得する

TypeScriptは静的型付け言語なので、 外部から取ってきたオブジェクトの情報として型を知りたい場合があります。
その時に役に立つのが型定義ファイルです。

コントラクトの型定義ファイルは、 コントラクトがコンパイルされた時に生成され、 `typechain-types`ディレクトリに自動的に格納されます。
これは`npx hardhat init`実行時にtypescriptを選択したため、 初期設定が済んでいるためです。

`client`の中に`types`ディレクトリを作成し、 その中にコピーしてください。

`contract`直下からターミナルでコピーを行う場合、 このようなコマンドになります。

```
cp -r typechain-types/* ../client/types/
```

以上でコントラクトの情報を反映することができました。

必要なファイルを用意したので、 `client/hooks/useContract.ts`内ファイル上部のimport文で出ていたエラーが消えているはずです。

### 🌔 参考リンク

> [こちら](https://github.com/unchain-dev/AVAX-Asset-Tokenization)に本プロジェクトの完成形のレポジトリがあります。
> 期待通り動かない場合は参考にしてみてください。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#avalanche`で質問をしてください。

ヘルプをするときのフローが円滑になるので、 エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンでフロントエンドを完成させましょう 🎉

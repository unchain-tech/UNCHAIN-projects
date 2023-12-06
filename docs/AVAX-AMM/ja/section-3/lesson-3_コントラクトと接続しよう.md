これまでフロントエンドにUIを用意し、ウォレットとの接続も出来ました！

このレッスンではあなたのスマートコントラクトをデプロイし、フロントエンドと連携します。

### 🌵 コントラクトとの接続部分を実装しましょう

引き続き`packages/client`ディレクトリのファイルを操作していきます。

### 📁 `hooks`ディレクトリ

`hooks`ディレクトリ内に`useContract.ts`というファイルを作成し、以下のコードを記述してください。
💁 現時点ではまだ用意していないファイルからimportしている箇所があるためエラーメッセージが出ても無視して大丈夫です。

```ts
import { BigNumber, ethers } from 'ethers';
import { useEffect, useState } from 'react';

import { USDCToken as UsdcContractType } from '../typechain-types';
import { JOEToken as JoeContractType } from '../typechain-types';
import { AMM as AmmContractType } from '../typechain-types';
import AmmArtifact from '../utils/AMM.json';
import { getEthereum } from '../utils/ethereum';
import UsdcArtifact from '../utils/USDCToken.json';
import JoeArtifact from '../utils/USDCToken.json';

export const UsdcAddress = 'コントラクトのデプロイ先アドレス';
export const JoeAddress = 'コントラクトのデプロイ先アドレス';
export const AmmAddress = 'コントラクトのデプロイ先アドレス';

export type TokenType = {
  symbol: string;
  contract: UsdcContractType | JoeContractType;
};

export type AmmType = {
  sharePrecision: BigNumber;
  contract: AmmContractType;
};

type ReturnUseContract = {
  usdc: TokenType | undefined;
  joe: TokenType | undefined;
  amm: AmmType | undefined;
};

export const useContract = (
  currentAccount: string | undefined
): ReturnUseContract => {
  const [usdc, setUsdc] = useState<TokenType>();
  const [joe, setJoe] = useState<TokenType>();
  const [amm, setAmm] = useState<AmmType>();
  const ethereum = getEthereum();

  const getContract = useCallback(
    (
      contractAddress: string,
      abi: ethers.ContractInterface,
      storeContract: (_: ethers.Contract) => void
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

  const generateUsdc = async (contract: UsdcContractType) => {
    try {
      const symbol = await contract.symbol();
      setUsdc({ symbol: symbol, contract: contract } as TokenType);
    } catch (error) {
      console.log(error);
    }
  };

  const generateJoe = async (contract: UsdcContractType) => {
    try {
      const symbol = await contract.symbol();
      setJoe({ symbol: symbol, contract: contract } as TokenType);
    } catch (error) {
      console.log(error);
    }
  };

  const generateAmm = async (contract: AmmContractType) => {
    try {
      const precision = await contract.PRECISION();
      setAmm({ sharePrecision: precision, contract: contract } as AmmType);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getContract(UsdcAddress, UsdcArtifact.abi, (Contract: ethers.Contract) => {
      generateUsdc(Contract as UsdcContractType);
    });
    getContract(JoeAddress, JoeArtifact.abi, (Contract: ethers.Contract) => {
      generateJoe(Contract as JoeContractType);
    });
    getContract(AmmAddress, AmmArtifact.abi, (Contract: ethers.Contract) => {
      generateAmm(Contract as AmmContractType);
    });
  }, [ethereum, currentAccount, getContract]);

  return {
    usdc,
    joe,
    amm,
  };
};
```

ファイル上部は必要な関数などのimportと、型定義をしています。
💁 現時点ではまだ用意していないファイルからimportしている箇所があるためエラーメッセージが出ても無視して大丈夫です。

```ts
export type TokenType = {
  symbol: string;
  contract: UsdcContractType | JoeContractType;
};
```

フロントエンドで使用するトークンコントラクトのオブジェクトの型になります。

USDCまたはJOEのコントラクトのインスタンスとトークンシンボルをstring型で保持します。

```ts
export type AmmType = {
  sharePrecision: BigNumber;
  contract: AmmContractType;
};
```

フロントエンドで使用するAMMコントラクトのオブジェクトの型になります。

AMMのコントラクトのインスタンスとPRECISIONを保持します。

```ts
const getContract = useCallback(
  (
    contractAddress: string,
    abi: ethers.ContractInterface,
    storeContract: (_: ethers.Contract) => void
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
```

`getContract`は引数で指定されたアドレスとabiのコントラクトのインスタンスを取得する関数です。

インスタンスを取得できたら引数で渡された関数に渡します。
`storeContract(Contract);`

```ts
const generateUsdc = async (contract: UsdcContractType) => {
  try {
    const symbol = await contract.symbol();
    setUsdc({ symbol: symbol, contract: contract } as TokenType);
  } catch (error) {
    console.log(error);
  }
};

const generateJoe = async (contract: UsdcContractType) => {
  try {
    const symbol = await contract.symbol();
    setJoe({ symbol: symbol, contract: contract } as TokenType);
  } catch (error) {
    console.log(error);
  }
};

const generateAmm = async (contract: AmmContractType) => {
  try {
    const precision = await contract.PRECISION();
    setAmm({ sharePrecision: precision, contract: contract } as AmmType);
  } catch (error) {
    console.log(error);
  }
};
```

それぞれ引数で渡されたコントラクトのインスタンスから、フロントエンドで使用するオブジェクトに変換しています。

```ts
useEffect(() => {
  getContract(UsdcAddress, UsdcArtifact.abi, (Contract: ethers.Contract) => {
    generateUsdc(Contract as UsdcContractType);
  });
  getContract(JoeAddress, JoeArtifact.abi, (Contract: ethers.Contract) => {
    generateJoe(Contract as JoeContractType);
  });
  getContract(AmmAddress, AmmArtifact.abi, (Contract: ethers.Contract) => {
    generateAmm(Contract as AmmContractType);
  });
}, [ethereum, currentAccount, getContract]);
```

各コントラクトの取得からオブジェクトの作成までを行っています。

### 💥 コントラクトをテストネットにデプロイしましょう

コントラクトとの接続部分を作成したので、コントラクトを使用するために、テストネットへデプロイします。

`packages/contract`ディレクトリへ移動してください。

`.env`という名前のファイルを作成し、以下を記入してください。

`"YOUR_PRIVATE_KEY"`の部分をあなたのアカウントの秘密鍵と入れ替えてください。

```
TEST_ACCOUNT_PRIVATE_KEY="YOUR_PRIVATE_KEY"
```

> `YOUR_PRIVATE_KEY`の取得
>
> 1.  お使いのブラウザから、MetaMask プラグインをクリックして、ネットワークを`Avalanche FUJI C-Chain`に変更します。
>
> ![](/public/images/AVAX-AMM/section-3/3_3_1.png)
>
> 2.  それから、`Account details`を選択してください。
>
> ![](/public/images/AVAX-AMM/section-3/3_3_2.png)
>
> 3.  `Account details`から`Export Private Key`をクリックしてください。
>
> ![](/public/images/AVAX-AMM/section-3/3_3_3.png)
>
> 4.  MetaMask のパスワードを求められるので、入力したら`Confirm`を押します。
>     あなたの秘密鍵（＝ `Private Key` ）が表示されるので、クリックしてコピーします。
>
> ![](/public/images/AVAX-AMM/section-3/3_3_4.png)

> - `.env`の`YOUR_PRIVATE_KEY`の部分をここで取得した秘密鍵とを入れ替えます。

⚠️gitignoreファイルに.envが記述されていることを確認して下さい。
秘密鍵は外部に漏れないようにGitHub上に上げません。

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

続いて、`scripts`ディレクトリ内にある`deploy.ts`を以下のコードに書き換えてください。

```ts
import { ethers } from 'hardhat';

async function deploy() {
  // コントラクトをデプロイするアカウントのアドレスを取得します。
  const [deployer] = await ethers.getSigners();

  // USDCトークンのコントラクトをデプロイします。
  const USDCToken = await ethers.getContractFactory('USDCToken');
  const usdc = await USDCToken.deploy();
  await usdc.deployed();

  // JOEトークンのコントラクトをデプロイします。
  const JOEToken = await ethers.getContractFactory('JOEToken');
  const joe = await JOEToken.deploy();
  await joe.deployed();

  // AMMコントラクトをデプロイします。
  const AMM = await ethers.getContractFactory('AMM');
  const amm = await AMM.deploy(usdc.address, joe.address);
  await amm.deployed();

  console.log('usdc address:', usdc.address);
  console.log('joe address:', joe.address);
  console.log('amm address:', amm.address);
  console.log('account address that deploy contract:', deployer.address);
}

deploy()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
```

`deploy`関数の中身は`test/AMM.ts`内の`deployContract`関数と同じようなことをしています。

このスクリプトを実行する際に先ほど`hardhat.config.ts`で設定したネットワークを指定すると、`ethers.getSigners()`の返す初めのアカウントの値はあなたのアカウントのアドレスになります。

ターミナル上で`AVAX-AMM/`直下にいることを確認して、下記を実行しましょう。

```
yarn contract deploy
```

このような出力結果が出たら成功です！

```
yarn run v1.22.19
$ yarn workspace contract deploy
$ npx hardhat run scripts/deploy.ts --network fuji

usdc address: 0x5aC2B0744ACD8567c1c33c5c8644C43147645770
joe address: 0x538589242114BCBcD0f12B1990865E57b3344448
amm address: 0x1d09929346a768Ec6919bf89dae36B27D7e39321
account address that deploy contract: 0xdf90d78042C8521073422a7107262D61243a21D0
```

ログに出力された各アドレスはコントラクトがデプロイされた先のアドレスです。

次の項目で必要になるのでどこかに保存しておいてください。

最後に`.gitignore`に`.env`が含まれていることを確認してください!

### 🌵 スマートコントラクトの情報をフロントエンドに使えるようにしましょう

コントラクトをデプロイしたので、実際に使えるようにスマートコントラクトの情報をフロントエンドに渡します。

📽️ コントラクトのアドレスをコピーする

さきほどコントラクトをデプロイした際に表示された上から3つのアドレス

```
usdc address: 0x5aC2B0744ACD8567c1c33c5c8644C43147645770
joe address: 0x538589242114BCBcD0f12B1990865E57b3344448
amm address: 0x1d09929346a768Ec6919bf89dae36B27D7e39321
```

を、
`packages/client`ディレクトリ内、`hooks/useContract.ts`の中の以下の部分にそれぞれ貼り付けてください。

```ts
export const UsdcAddress = 'コントラクトのデプロイ先アドレス';
export const JoeAddress = 'コントラクトのデプロイ先アドレス';
export const AmmAddress = 'コントラクトのデプロイ先アドレス';
```

例:

```ts
export const UsdcAddress = '0x5aC2B0744ACD8567c1c33c5c8644C43147645770';
export const JoeAddress = '0x538589242114BCBcD0f12B1990865E57b3344448';
export const AmmAddress = '0x1d09929346a768Ec6919bf89dae36B27D7e39321';
```

📽️ ABIファイルを取得する

ABIファイルは、コントラクトがコンパイルされた時に生成され、`artifacts`ディレクトリに自動的に格納されます。

`packages/contract`からパスを追っていくと、`packages/contract/artifacts/contracts/~.sol/~.json`というファイルがそれぞれのコントラクトに対して生成されているはずです。

これを`client`の中の`utils`ディレクトリ内にコピーしてください。
`AVAX-AMM`直下からターミナルでコピーを行う場合、このようなコマンドになります。

```
yarn contract cp:artifacts
```

📽️ 型定義ファイルを取得する

TypeScriptは静的型付け言語なので、外部から取ってきたオブジェクトの情報として型を知りたい場合があります。
その時に役に立つのが型定義ファイルです。

コントラクトの型定義ファイルは、コントラクトがコンパイルされた時に生成され、`typechain-types`ディレクトリに自動的に格納されます。
これは`npx hardhat init`実行時にtypescriptを選択したため、初期設定が済んでいるためです。

`contract`内の`typechain-types`ディレクトリをそのまま`client`にコピーしてください。
`AVAX-AMM`直下からターミナルでコピーを行う場合、このようなコマンドになります。

```
yarn contract cp:typechain
```

以上でコントラクトの情報を反映することができました。

必要なファイルを用意したので、`client/hooks/useContract.ts`内ファイル上部のimport文で出ていたエラーが消えているはずです。

### 🌴 コントラクトの関数を呼び出しましょう

フロントエンドでコントラクトを使用する準備が整ったので、実際に関数を呼び出してみます。

`client`ディレクトリへ移動してください。

### 📁 `components`ディレクトリ

📁 `Details`ディレクトリ

`components`ディレクトリ内に`Details`というディレクトリを作成し、
その中に`Details.module.css`と`Details.tsx`という名前のファイルを作成してください。

`Details.module.css`内に以下のコードを記述してください。

```css
.details {
  padding: 15px 10px 15px 0px;
  width: 370px;
  height: fit-content;
  position: absolute;
  right: 0px;
  display: flex;
  justify-content: center;
}

.detailsBody {
  background-color: #0e0e10;
  width: 90%;
  padding: 10px;
  border-radius: 19px;
}

.detailsHeader {
  height: 30px;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  margin-bottom: 15px;
}

.detailsRow {
  padding: 0px 25px;
  height: 35px;
  display: flex;
  justify-content: space-around;
}

.detailsAttribute {
  font: 18px;
  font-weight: 600;
  color: white;
  display: flex;
  justify-content: flex-start;
  width: 50%;
}

.detailsValue {
  font: 18px;
  font-weight: 900;
  color: white;
  display: flex;
  justify-content: center;
  width: 50%;
}
```

`Details.tsx`で使用するcssになります。

`Details.tsx`内に以下のコードを記述してください。

```tsx
import { ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';

import { AmmType, TokenType } from '../../hooks/useContract';
import { formatWithoutPrecision } from '../../utils/format';
import styles from './Details.module.css';

type Props = {
  token0: TokenType | undefined;
  token1: TokenType | undefined;
  amm: AmmType | undefined;
  currentAccount: string | undefined;
  updateDetailsFlag: number;
};

export default function Details({
  token0,
  token1,
  amm,
  currentAccount,
  updateDetailsFlag,
}: Props) {
  const [amountOfUserTokens, setAmountOfUserTokens] = useState<string[]>([]);
  const [amountOfPoolTokens, setAmountOfPoolTokens] = useState<string[]>([]);
  const [tokens, setTokens] = useState<TokenType[]>([]);

  const [userShare, setUserShare] = useState('');
  const [totalShare, setTotalShare] = useState('');

  const DISPLAY_CHAR_LIMIT = 7;

  useEffect(() => {
    if (!token0 || !token1) return;
    setTokens([token0, token1]);
  }, [token0, token1]);

  const getAmountOfUserTokens = useCallback(async () => {
    if (!currentAccount) return;
    try {
      setAmountOfUserTokens([]);
      for (let index = 0; index < tokens.length; index++) {
        const amountInWei = await tokens[index].contract.balanceOf(
          currentAccount
        );
        const amountInEther = ethers.utils.formatEther(amountInWei);
        setAmountOfUserTokens((prevState) => [...prevState, amountInEther]);
      }
    } catch (error) {
      console.log(error);
    }
  }, [currentAccount, tokens]);

  const getAmountOfPoolTokens = useCallback(async () => {
    if (!amm) return;
    try {
      setAmountOfPoolTokens([]);
      for (let index = 0; index < tokens.length; index++) {
        const amountInWei = await amm.contract.totalAmount(
          tokens[index].contract.address
        );
        const amountInEther = ethers.utils.formatEther(amountInWei);
        setAmountOfPoolTokens((prevState) => [...prevState, amountInEther]);
      }
    } catch (error) {
      console.log(error);
    }
  }, [amm, tokens]);

  const getShare = useCallback(async () => {
    if (!amm || !currentAccount) return;
    try {
      let share = await amm.contract.share(currentAccount);
      let shareWithoutPrecision = formatWithoutPrecision(
        share,
        amm.sharePrecision
      );
      setUserShare(shareWithoutPrecision);

      share = await amm.contract.totalShare();
      shareWithoutPrecision = formatWithoutPrecision(share, amm.sharePrecision);
      setTotalShare(shareWithoutPrecision);
    } catch (err) {
      console.log('Couldn't Fetch details', err);
    }
  }, [amm, currentAccount]);

  useEffect(() => {
    getAmountOfUserTokens();
  }, [getAmountOfUserTokens, updateDetailsFlag]);

  useEffect(() => {
    getAmountOfPoolTokens();
  }, [getAmountOfPoolTokens, updateDetailsFlag]);

  useEffect(() => {
    getShare();
  }, [getShare, updateDetailsFlag]);

  return (
    <div className={styles.details}>
      <div className={styles.detailsBody}>
        <div className={styles.detailsHeader}>Your Details</div>
        {amountOfUserTokens.map((amount, index) => {
          return (
            <div key={index} className={styles.detailsRow}>
              <div className={styles.detailsAttribute}>
                {tokens[index] === undefined
                  ? 'loading...'
                  : tokens[index].symbol}
                :
              </div>
              <div className={styles.detailsValue}>
                {amount.substring(0, DISPLAY_CHAR_LIMIT)}
              </div>
            </div>
          );
        })}
        <div className={styles.detailsRow}>
          <div className={styles.detailsAttribute}>Share:</div>
          <div className={styles.detailsValue}>
            {userShare.substring(0, DISPLAY_CHAR_LIMIT)}
          </div>
        </div>
        <div className={styles.detailsHeader}>Pool Details</div>
        {amountOfPoolTokens.map((amount, index) => {
          return (
            <div key={index} className={styles.detailsRow}>
              <div className={styles.detailsAttribute}>
                Total{' '}
                {tokens[index] === undefined
                  ? 'loading...'
                  : tokens[index].symbol}
                :
              </div>
              <div className={styles.detailsValue}>
                {amount.substring(0, DISPLAY_CHAR_LIMIT)}
              </div>
            </div>
          );
        })}
        <div className={styles.detailsRow}>
          <div className={styles.detailsAttribute}>Total Share:</div>
          <div className={styles.detailsValue}>
            {totalShare.substring(0, DISPLAY_CHAR_LIMIT)}
          </div>
        </div>
      </div>
    </div>
  );
}
```

ここではユーザやammのプールの詳細情報を表示するコンポーネントを実装しています。

`Details.tsx`の中身を確認します。

```ts
type Props = {
  token0: TokenType | undefined;
  token1: TokenType | undefined;
  amm: AmmType | undefined;
  currentAccount: string | undefined;
  updateDetailsFlag: number;
};
```

引数の指定です。

token0、token1にはそれぞれUSDC、JOEのいずれかのオブジェクトが渡されます。

updateDetailsFlagはこのコンポーネントで表示する情報を更新するトリガーとなります。
このフラグが変更された時に情報を更新するよう、この後の`useEffect`で依存関係に含めています。

```ts
const [amountOfUserTokens, setAmountOfUserTokens] = useState<string[]>([]);
const [amountOfPoolTokens, setAmountOfPoolTokens] = useState<string[]>([]);
const [tokens, setTokens] = useState<TokenType[]>([]);

const [userShare, setUserShare] = useState('');
const [totalShare, setTotalShare] = useState('');
```

このコンポーネントで扱う情報を格納するための状態変数です。

このコンポーネントでは引数で渡されたtoken0、token1を
扱いやすいように`tokens`の配列に格納します。

他の状態変数でstring型の配列となっているものは　`tokens`と同じ順番で対応しております。

例えば`tokens = [token0, token1]`の順番で格納されている場合、
ユーザの所有するトークンの量を表す`amountOfUserTokens`は以下のように情報を格納します。
`amountOfUserTokens = [ユーザの所有するtoken0のトークンの量, ユーザの所有するtoken1のトークンの量]`

```ts
const getAmountOfUserTokens = useCallback(async () => {
  if (!currentAccount) return;
  try {
    setAmountOfUserTokens([]);
    for (let index = 0; index < tokens.length; index++) {
      const amountInWei = await tokens[index].contract.balanceOf(
        currentAccount
      );
      const amountInEther = ethers.utils.formatEther(amountInWei);
      setAmountOfUserTokens((prevState) => [...prevState, amountInEther]);
    }
  } catch (error) {
    console.log(error);
  }
}, [currentAccount, tokens]);
```

各トークンのコントラクトの`balanceOf`関数を呼び出し、ユーザの所有するトークンの量を状態変数へ格納します。

> 📓 `useCallBack`について
> `useCallBack`は関数をメモ化します。
>
> 通常コンポーネント(ここでいう`Details`)の再描画が行われる場合は内部の関数が再作成されますが、
> メモ化をすると、依存配列(ここでいう`[currentAccount, tokens]`)に変化がない場合は再作成をしません。
>
> 今回はこの後に続く`useEffect`の依存配列に`getAmountOfUserTokens`が含まれていることが原因で`useCallBack`を使用しています。
> `Details`コンポーネントが描画された際に`getAmountOfUserTokens`を実行したいので、関数実行と依存配列に関数を入れていますが、
> コンポーネント再描画のたびに`getAmountOfUserTokens`が再作成されてしまうと再び`useEffect`が動いてしまうのためです。
>
> 参考: https://ja.reactjs.org/docs/hooks-reference.html#usecallback
> 参考: https://stackoverflow.com/questions/57156582/should-i-wrap-all-functions-that-defined-in-component-in-usecallback

その他の関数においても同様にコントラクトから特定の情報を取得し状態変数へ格納しています。

📁 `Container`ディレクトリ

`Container.tsx`内を以下のコードに変更してください。

```tsx
import { useState } from 'react';

import { useContract } from '../../hooks/useContract';
import Details from '../Details/Details';
import styles from './Container.module.css';

type Props = {
  currentAccount: string | undefined;
};

export default function Container({ currentAccount }: Props) {
  const [activeTab, setActiveTab] = useState('Swap');
  const [updateDetailsFlag, setUpdateDetailsFlag] = useState(0);
  const { usdc: token0, joe: token1, amm } = useContract(currentAccount);

  const changeTab = (tab: string) => {
    setActiveTab(tab);
  };

  const updateDetails = () => {
    // フラグを0と1の間で交互に変更します。
    setUpdateDetailsFlag((updateDetailsFlag + 1) % 2);
  };

  return (
    <div className={styles.mainBody}>
      <div className={styles.centerContent}>
        <div className={styles.selectTab}>
          <div
            className={
              styles.tabStyle +
              ' ' +
              (activeTab === 'Swap' ? styles.activeTab : '')
            }
            onClick={() => changeTab('Swap')}
          >
            Swap
          </div>
          <div
            className={
              styles.tabStyle +
              ' ' +
              (activeTab === 'Provide' ? styles.activeTab : '')
            }
            onClick={() => changeTab('Provide')}
          >
            Provide
          </div>
          <div
            className={
              styles.tabStyle +
              ' ' +
              (activeTab === 'Withdraw' ? styles.activeTab : '')
            }
            onClick={() => changeTab('Withdraw')}
          >
            Withdraw
          </div>
          <div
            className={
              styles.tabStyle +
              ' ' +
              (activeTab === 'Faucet' ? styles.activeTab : '')
            }
            onClick={() => changeTab('Faucet')}
          >
            Faucet
          </div>
        </div>

        {activeTab === 'Swap' && <div>swap</div>}
        {activeTab === 'Provide' && <div>provide</div>}
        {activeTab === 'Withdraw' && <div>withdraw</div>}
        {activeTab === 'Faucet' && <div>faucet</div>}
      </div>
      <Details
        token0={token0}
        token1={token1}
        amm={amm}
        currentAccount={currentAccount}
        updateDetailsFlag={updateDetailsFlag}
      />
    </div>
  );
}
```

主な変更点は以下です。

- 状態変数を追加

```ts
const [updateDetailsFlag, setUpdateDetailsFlag] = useState(0); // ユーザやプールの詳細情報を更新するためのフラグ
const { usdc: token0, joe: token1, amm } = useContract(currentAccount); // useContractからコントラクトの取得
```

- フラグを切り替える関数の実装
  この関数を実行する度にフラグが0か1に変化します。

```ts
const updateDetails = () => {
  // フラグを0と1の間で交互に変更します。
  setUpdateDetailsFlag((updateDetailsFlag + 1) % 2);
};
```

- Detailsコンポーネントを使用

```ts
<Details
  token0={token0}
  token1={token1}
  amm={amm}
  currentAccount={currentAccount}
  updateDetailsFlag={updateDetailsFlag}
/>
```

🖥️ 画面で確認しましょう

ターミナル上で以下のコマンドを実行してください。

```
yarn client dev
```

ブラウザで`http://localhost:3000 `へアクセスしてください。

以下のような画面が表示されれば成功です！
画面右側にユーザとプールの詳細情報が表示されました。

![](/public/images/AVAX-AMM/section-3/3_3_5.png)

コントラクトのデプロイに使用したアカウントで接続している場合、所有するトークンの量はそれぞれ`10000`になっているはずです。

### 🌔 参考リンク

> [こちら](https://github.com/unchain-tech/AVAX-AMM)に本プロジェクトの完成形のレポジトリがあります。
>
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

次のレッスンでフロントエンドを完成させましょう 🎉

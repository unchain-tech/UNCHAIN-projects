### コンポーネントを追加しましょう

フロントエンドが完成に近づいてきました！

このレッスンでは残りのコンポーネントを実装してフロントエンドを完成させましょう。

各コンポーネント作成ごとにUIを確認していくので、AVAX-AMMディレクトリ直下にいることを確認しターミナル上で以下のコマンドを実行してください。

```
yarn client dev
```

### 📁 `components`ディレクトリ

📁 `SelectTab`ディレクトリ

`components`ディレクトリ内に`SelectTab`というディレクトリを作成し、
その中に`SelectTab.module.css`という名前のファイルを作成してください。

`SelectTab.module.css`内に以下のコードを記述してください。

```css
.tabBody {
  margin: 0px auto;
  width: 460px;
  padding-top: 5px;
  justify-content: center;
  align-items: center;
  background-color: #0e0e10;
  border-radius: 0px 0px 19px 19px;
  border-top: 0px;
}

.bottomDiv {
  margin: 10px auto;
  width: 30%;
  padding: 5px;
  justify-content: center;
  align-items: center;
  border-radius: 19px;
}

.btn {
  background-color: #356c93;
  margin: 10px 30px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  width: 100px;
  height: 40px;
  border-radius: 9px;
  cursor: pointer;
}

.btn:hover {
  background: #57adea;
}

.swapIcon {
  width: 5%;
  text-align: center;
  display: flex;
  margin: 40px auto;
  color: #ff726e;
}

.estimate {
  height: 30px;
  width: 75%;
  margin: 0px auto;
  margin-top: 10px;
  margin-bottom: 30px;
  color: white;
}

.error {
  color: white;
  display: flex;
  justify-content: flex-start;
  padding: 0px 20px;
}
```

🚰 Faucet

次に`SelectTab`ディレクトリ内に`Faucet.tsx`という名前のファイルを作成し、以下のコードを記述してください。

```ts
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

import { TokenType } from '../../hooks/useContract';
import { validAmount } from '../../utils/validAmount';
import InputNumberBox from '../InputBox/InputNumberBox';
import styles from './SelectTab.module.css';

type Props = {
  token0: TokenType | undefined;
  token1: TokenType | undefined;
  currentAccount: string | undefined;
  updateDetails: () => void;
};

export default function Faucet({
  token0,
  token1,
  currentAccount,
  updateDetails,
}: Props) {
  const [amountOfFunds, setAmountOfFunds] = useState('');
  const [currentTokenIndex, setCurrentTokenIndex] = useState(0);

  const [tokens, setTokens] = useState<TokenType[]>([]);

  useEffect(() => {
    if (!token0 || !token1) return;
    setTokens([token0, token1]);
  }, [token0, token1]);

  // tokensの範囲内で、参照するインデックスを次に移動させます。
  const onChangeToken = () => {
    setCurrentTokenIndex((currentTokenIndex + 1) % tokens.length);
  };

  const onChangeAmountOfFunds = (amount: string) => {
    setAmountOfFunds(amount);
  };

  async function onClickFund() {
    if (!currentAccount) {
      alert('connect wallet');
      return;
    }
    if (tokens.length === 0) return;
    if (!validAmount(amountOfFunds)) {
      alert('Amount should be a valid number');
      return;
    }
    try {
      const contract = tokens[currentTokenIndex].contract;
      const amountInWei = ethers.utils.parseEther(amountOfFunds);

      const txn = await contract.faucet(currentAccount, amountInWei);
      await txn.wait();
      updateDetails(); // ユーザとammの情報を更新
      alert('Success');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles.tabBody}>
      <div className={styles.bottomDiv}>
        <div className={styles.btn} onClick={() => onChangeToken()}>
          Change
        </div>
      </div>
      <InputNumberBox
        leftHeader={
          'Amount of ' +
          (tokens[currentTokenIndex]
            ? tokens[currentTokenIndex].symbol
            : 'some token')
        }
        right={
          tokens[currentTokenIndex] ? tokens[currentTokenIndex].symbol : ''
        }
        value={amountOfFunds}
        onChange={(e) => onChangeAmountOfFunds(e.target.value)}
      />
      <div className={styles.bottomDiv}>
        <div className={styles.btn} onClick={() => onClickFund()}>
          Fund
        </div>
      </div>
    </div>
  );
}
```

ここではあなたがデプロイした、USDCとJOEのfaucetを実装しています。

実装の中身を見る前にブラウザ上でUIを見てみましょう。

`components/Container/Container.tsx`内に以下の内容を追加してください。

```diff
import { useState } from 'react';

import { useContract } from '../../hooks/useContract';
import Details from '../Details/Details';
+ import Faucet from '../SelectTab/Faucet';
import styles from './Container.module.css';

type Props = {
  currentAccount: string | undefined;
};

export default function Container({ currentAccount }: Props) {
  // ...

  return (
    // ...

        {activeTab === 'Swap' && <div>swap</div>}
        {activeTab === 'Provide' && <div>provide</div>}
        {activeTab === 'Withdraw' && <div>withdraw</div>}
+        {activeTab === 'Faucet' && (
+          <Faucet
+            token0={token0}
+            token1={token1}
+            currentAccount={currentAccount}
+            updateDetails={updateDetails}
+          />
+        )}
    // ...
  );
}
```

ブラウザで`http://localhost:3000 `へアクセスします。

`Faucet`タブをクリックすると以下のような表示がされます。

![](/public/images/AVAX-AMM/section-3/3_4_1.png)

入力欄に10と入力し、`Fund`をクリックします。
トランザクションに署名し、しばらく待つと（ポップアップが表示されokを押した後）右側の`Your Details`のUSDCの部分が10増えているはずです。

![](/public/images/AVAX-AMM/section-3/3_4_2.png)

`Change`ボタンをクリックするとUSDC -> JOEへ変更されるため、JOEに関しても同じようにfaucetを利用することができます。

それでは`Faucet.tsx`の中身を見ましょう。

使用する状態変数は以下の通りです。

```ts
const [amountOfFunds, setAmountOfFunds] = useState(''); // ユーザが指定した取得したいトークンの量を保持します。
const [currentTokenIndex, setCurrentTokenIndex] = useState(0); // 現在のtokens(この次にあります)のインデックスを保持します。

const [tokens, setTokens] = useState<TokenType[]>([]); // [token0, token1] のようにトークンオブジェクトが格納されます。
```

以下はユーザの操作によって動く関数の実装です。

```ts
// tokensの範囲内で、参照するインデックスを次に移動させます。
const onChangeToken = () => {
  setCurrentTokenIndex((currentTokenIndex + 1) % tokens.length);
};

const onChangeAmountOfFunds = (amount: string) => {
  setAmountOfFunds(amount);
};

async function onClickFund() {
  if (!currentAccount) {
    alert('connect wallet');
    return;
  }
  if (tokens.length === 0) return;
  if (!validAmount(amountOfFunds)) {
    alert('Amount should be a valid number');
    return;
  }
  try {
    const contract = tokens[currentTokenIndex].contract;
    const amountInWei = ethers.utils.parseEther(amountOfFunds);

    const txn = await contract.faucet(currentAccount, amountInWei);
    await txn.wait();
    updateDetails(); // ユーザとammの情報を更新
    alert('Success');
  } catch (error) {
    console.log(error);
  }
}
```

- `onChangeToken`: `Change`ボタンをクリックされた際に`currentTokenIndex`を変更します。
  これによりUSDCとJOEの切り替えをします。
- `onChangeAmountOfFunds`: ユーザの入力値を`amountOfFunds`にセットします。
- `onClickFund`: `Fund`ボタンをクリックされた際に`currentTokenIndex`のトークンの`faucet`関数を呼び出します。
  このコンポーエントの引数で渡されている`updateDetails()`を実行することでdetailsを更新します。

🦜 Provide

次に`SelectTab`ディレクトリ内に`Provide.tsx`という名前のファイルを作成し、以下のコードを記述してください。

```ts
import { BigNumber, ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { MdAdd } from 'react-icons/md';

import { AmmType, TokenType } from '../../hooks/useContract';
import { validAmount } from '../../utils/validAmount';
import InputNumberBox from '../InputBox/InputNumberBox';
import styles from './SelectTab.module.css';


type Props = {
  token0: TokenType | undefined;
  token1: TokenType | undefined;
  amm: AmmType | undefined;
  currentAccount: string | undefined;
  updateDetails: () => void;
};

export default function Provide({
  token0,
  token1,
  amm,
  currentAccount,
  updateDetails,
}: Props) {
  const [amountOfToken0, setAmountOfToken0] = useState('');
  const [amountOfToken1, setAmountOfToken1] = useState('');
  const [activePool, setActivePool] = useState(true);

  const checkLiquidity = useCallback(async () => {
    if (!amm) return;
    try {
      const totalShare = await amm.contract.totalShare();
      if (totalShare.eq(BigNumber.from(0))) {
        setActivePool(false);
      } else {
        setActivePool(true);
      }
    } catch (error) {
      alert(error);
    }
  }, [amm]);

  useEffect(() => {
    checkLiquidity();
  }, [checkLiquidity]);

  const getProvideEstimate = async (
    token: TokenType,
    amount: string,
    setPairTokenAmount: (amount: string) => void
  ) => {
    if (!amm || !token0 || !token1) return;
    if (!activePool) return;
    if (!validAmount(amount)) return;
    try {
      const amountInWei = ethers.utils.parseEther(amount);
      const pairAmountInWei = await amm.contract.getEquivalentToken(
        token.contract.address,
        amountInWei
      );
      const pairAmountInEther = ethers.utils.formatEther(pairAmountInWei);
      setPairTokenAmount(pairAmountInEther);
    } catch (error) {
      alert(error);
    }
  };

  const onChangeAmount = (
    amount: string,
    token: TokenType | undefined,
    setAmount: (amount: string) => void,
    setPairTokenAmount: (amount: string) => void
  ) => {
    if (!token) return;
    setAmount(amount);
    getProvideEstimate(token, amount, setPairTokenAmount);
  };

  const onClickProvide = async () => {
    if (!currentAccount) {
      alert('connect wallet');
      return;
    }
    if (!amm || !token0 || !token1) return;
    if (!validAmount(amountOfToken0) || !validAmount(amountOfToken1)) {
      alert('Amount should be a valid number');
      return;
    }
    try {
      const amountToken0InWei = ethers.utils.parseEther(amountOfToken0);
      const amountToken1InWei = ethers.utils.parseEther(amountOfToken1);

      const txn0 = await token0.contract.approve(
        amm.contract.address,
        amountToken0InWei
      );
      const txn1 = await token1.contract.approve(
        amm.contract.address,
        amountToken1InWei
      );

      await txn0.wait();
      await txn1.wait();

      const txn = await amm.contract.provide(
        token0.contract.address,
        amountToken0InWei,
        token1.contract.address,
        amountToken1InWei
      );
      await txn.wait();
      setAmountOfToken0('');
      setAmountOfToken1('');
      checkLiquidity(); // プールの状態を確認
      updateDetails(); // ユーザとammの情報を更新
      alert('Success');
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className={styles.tabBody}>
      <InputNumberBox
        leftHeader={'Amount of ' + (token0 ? token0.symbol : 'some token')}
        right={token0 ? token0.symbol : ''}
        value={amountOfToken0}
        onChange={(e) =>
          onChangeAmount(
            e.target.value,
            token0,
            setAmountOfToken0,
            setAmountOfToken1
          )
        }
      />
      <div className={styles.swapIcon}>
        <MdAdd />
      </div>
      <InputNumberBox
        leftHeader={'Amount of ' + (token1 ? token1.symbol : 'some token')}
        right={token1 ? token1.symbol : ''}
        value={amountOfToken1}
        onChange={(e) =>
          onChangeAmount(
            e.target.value,
            token1,
            setAmountOfToken1,
            setAmountOfToken0
          )
        }
      />
      {!activePool && (
        <div className={styles.error}>
          Message: Empty pool. Set the initial conversion rate.
        </div>
      )}
      <div className={styles.bottomDiv}>
        <div className={styles.btn} onClick={() => onClickProvide()}>
          Provide
        </div>
      </div>
    </div>
  );
}
```

ここではProvideタブを実装しています。

実装の中身を見る前にブラウザ上でUIを見てみましょう。

`components/Container/Container.tsx`内に以下の内容を追加してください。

```diff
import { useState } from 'react';

import { useContract } from '../../hooks/useContract';
import Details from '../Details/Details';
import Faucet from '../SelectTab/Faucet';
+ import Provide from '../SelectTab/Provide';
import styles from './Container.module.css';

type Props = {
  currentAccount: string | undefined;
};

export default function Container({ currentAccount }: Props) {
  // ...

  return (
    // ...

        {activeTab === 'Swap' && <div>swap</div>}
+        {activeTab === 'Provide' && (
+          <Provide
+            token0={token0}
+            token1={token1}
+            amm={amm}
+            currentAccount={currentAccount}
+            updateDetails={updateDetails}
+          />
+        )}
        {activeTab === 'Withdraw' && <div>withdraw</div>}
        {activeTab === 'Faucet' && (
          <Faucet
            token0={token0}
            token1={token1}
            currentAccount={currentAccount}
            updateDetails={updateDetails}
          />
        )}
    // ...
  );
}
```

ブラウザで`http://localhost:3000 `へアクセスします。

`Provide`タブをクリックすると以下のような表示がされます。

![](/public/images/AVAX-AMM/section-3/3_4_3.png)

入力欄にそれぞれ100と入力し、`Provide`をクリックします。

provideの実行では以下のトランザクションへの署名が必要です。

- USDCの`approve`
- JOEの`approve`
- AMMの`provide`

まず初めにMetamaskの署名画面が2度続けて表示されます。
それぞれに署名をし、しばらく待つと最後に`provide`の署名について求められるので署名をします。
🙌 こちらのUI改善できる方がいらっしゃればUNCHAINにて共有して頂けると大変助かります！

しばらく待つと（ポップアップが表示されokを押した後）右側の`Your Details`が更新されます！

![](/public/images/AVAX-AMM/section-3/3_4_4.png)

それでは`Provide.tsx`の中身を見ましょう。

使用する状態変数は以下の通りです。

```ts
const [amountOfToken0, setAmountOfToken0] = useState(''); // ユーザが指定したtoken0の預けるトークンの量を保持します。
const [amountOfToken1, setAmountOfToken1] = useState(''); // ユーザが指定したtoken1の預けるトークンの量を保持します。
const [activePool, setActivePool] = useState(true); // プールに流動性があるのかをフラグで保持します。
```

次の2つの関数は、ユーザがどちらか一方（USDC or JOE）の入力欄に数値を入力した際に、もう片方に必要なトークンの量を表示するために必要です。
※ 先ほどの挙動確認では最初の流動性提供であったためこの機能は確認できませんでした。もう1度`Provide`タブにて入力欄に数値を入力すると確認できるはずです！

```ts
const getProvideEstimate = async (
  token: TokenType,
  amount: string,
  setPairTokenAmount: (amount: string) => void
) => {
  if (!amm || !token0 || !token1) return;
  if (!activePool) return;
  if (!validAmount(amount)) return;
  try {
    const amountInWei = ethers.utils.parseEther(amount);
    const pairAmountInWei = await amm.contract.getEquivalentToken(
      token.contract.address,
      amountInWei
    );
    const pairAmountInEther = ethers.utils.formatEther(pairAmountInWei);
    setPairTokenAmount(pairAmountInEther);
  } catch (error) {
    alert(error);
  }
};

const onChangeAmount = (
  amount: string,
  token: TokenType | undefined,
  setAmount: (amount: string) => void,
  setPairTokenAmount: (amount: string) => void
) => {
  if (!token) return;
  setAmount(amount);
  getProvideEstimate(token, amount, setPairTokenAmount);
};
```

`getProvideEstimate`は内部で、ammの`getEquivalentToken`を引数で指定されたトークンとその量を併せて呼び出しています。
その返り値（指定したトークンと同価値のペアのトークンの量）を`setPairTokenAmount`によりセットしています。

`onChangeAmount`はユーザが入力欄に数値を入力した際に動く関数です。
目的は入力されたトークンの量の状態変数の更新と、`getProvideEstimate`を呼び出すことにより同価値のペアのトークンの量の状態変数を更新することです。

続く`onClickProvide`関数はammの　`provide`を呼び出す関数ですが、ポイントは`provide`を実行する前に各トークンの`approve`を呼び出している点です。

🦢 Swap

次に`SelectTab`ディレクトリ内に`Swap.tsx`という名前のファイルを作成し、以下のコードを記述してください。

```ts
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { MdSwapVert } from 'react-icons/md';

import { AmmType, TokenType } from '../../hooks/useContract';
import { validAmount } from '../../utils/validAmount';
import InputNumberBox from '../InputBox/InputNumberBox';
import styles from './SelectTab.module.css';

type Props = {
  token0: TokenType | undefined;
  token1: TokenType | undefined;
  amm: AmmType | undefined;
  currentAccount: string | undefined;
  updateDetails: () => void;
};

export default function Swap({
  token0,
  token1,
  amm,
  currentAccount,
  updateDetails,
}: Props) {
  // スワップ元とスワップ先のトークンを格納します。
  const [tokenIn, setTokenIn] = useState<TokenType>();
  const [tokenOut, setTokenOut] = useState<TokenType>();

  const [amountIn, setAmountIn] = useState('');
  const [amountOut, setAmountOut] = useState('');

  useEffect(() => {
    setTokenIn(token0);
    setTokenOut(token1);
  }, [token0, token1]);

  const rev = () => {
    // スワップ元とスワップ先のトークンを交換します。
    const inCopy = tokenIn;
    setTokenIn(tokenOut);
    setTokenOut(inCopy);

    // 交換後はソーストークンから推定量を再計算します。
    getSwapEstimateOut(amountIn);
  };

  // スワップ元トークンに指定された量から、スワップ先トークンの受け取れる量を取得します。
  const getSwapEstimateOut = async (amount: string) => {
    if (!amm || !tokenIn) return;
    if (!validAmount(amount)) return;
    try {
      const amountInInWei = ethers.utils.parseEther(amount);
      const amountOutInWei = await amm.contract.getSwapEstimateOut(
        tokenIn.contract.address,
        amountInInWei
      );
      const amountOutInEther = ethers.utils.formatEther(amountOutInWei);
      setAmountOut(amountOutInEther);
    } catch (error) {
      alert(error);
    }
  };

  // スワップ先トークンに指定された量から、 スワップ元トークンに必要な量を取得します。
  const getSwapEstimateIn = async (amount: string) => {
    if (!amm || !tokenOut) return;
    if (!validAmount(amount)) return;
    if (amm) {
      try {
        const amountOutInWei = ethers.utils.parseEther(amount);
        const amountInInWei = await amm.contract.getSwapEstimateIn(
          tokenOut.contract.address,
          amountOutInWei
        );
        const amountInInEther = ethers.utils.formatEther(amountInInWei);
        setAmountIn(amountInInEther);
      } catch (error) {
        alert(error);
      }
    }
  };

  const onChangeIn = (amount: string) => {
    setAmountIn(amount);
    getSwapEstimateOut(amount);
  };

  const onChangeOut = (amount: string) => {
    setAmountOut(amount);
    getSwapEstimateIn(amount);
  };

  const onClickSwap = async () => {
    if (!currentAccount) {
      alert('Connect to wallet');
      return;
    }
    if (!amm || !tokenIn || !tokenOut) return;
    if (!validAmount(amountIn)) {
      alert('Amount should be a valid number');
      return;
    }
    try {
      const amountInInWei = ethers.utils.parseEther(amountIn);

      const txnIn = await tokenIn.contract.approve(
        amm.contract.address,
        amountInInWei
      );
      await txnIn.wait();

      const txn = await amm.contract.swap(
        tokenIn.contract.address,
        tokenOut.contract.address,
        amountInInWei
      );
      await txn.wait();
      setAmountIn('');
      setAmountOut('');
      updateDetails(); // ユーザとammの情報を更新
      alert('Success!');
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className={styles.tabBody}>
      <InputNumberBox
        leftHeader={'From'}
        right={tokenIn ? tokenIn.symbol : ''}
        value={amountIn}
        onChange={(e) => onChangeIn(e.target.value)}
      />
      <div className={styles.swapIcon} onClick={() => rev()}>
        <MdSwapVert />
      </div>
      <InputNumberBox
        leftHeader={'To'}
        right={tokenOut ? tokenOut.symbol : ''}
        value={amountOut}
        onChange={(e) => onChangeOut(e.target.value)}
      />
      <div className={styles.bottomDiv}>
        <div className={styles.btn} onClick={() => onClickSwap()}>
          Swap
        </div>
      </div>
    </div>
  );
}
```

ここではSwapタブを実装しています。

`components/Container/Container.tsx`内に以下の内容を追加し、UIを確認します。

```diff
import { useState } from 'react';

import { useContract } from '../../hooks/useContract';
import Details from '../Details/Details';
import Faucet from '../SelectTab/Faucet';
import Provide from '../SelectTab/Provide';
+ import Swap from '../SelectTab/Swap';
import styles from './Container.module.css';

type Props = {
  currentAccount: string | undefined;
};

export default function Container({ currentAccount }: Props) {
  // ...

  return (
    // ...

+        {activeTab === 'Swap' && (
+          <Swap
+            token0={token0}
+            token1={token1}
+            amm={amm}
+            currentAccount={currentAccount}
+            updateDetails={updateDetails}
+          />
+        )}
        {activeTab === 'Provide' && (
          <Provide
            token0={token0}
            token1={token1}
            amm={amm}
            currentAccount={currentAccount}
            updateDetails={updateDetails}
          />
        )}
        {activeTab === 'Withdraw' && <div>withdraw</div>}
        {activeTab === 'Faucet' && (
          <Faucet
            token0={token0}
            token1={token1}
            currentAccount={currentAccount}
            updateDetails={updateDetails}
          />
        )}
    // ...
  );
}
```

ブラウザで`http://localhost:3000 `へアクセスします。

`Swap`タブをクリックすると以下のような表示がされます。

![](/public/images/AVAX-AMM/section-3/3_4_5.png)

USDC入力欄に50と入力すると、swapにより受けることができるJOEの量が表示されます。
`Swap`をクリックします。

swapの実行では以下のトランザクションへの署名が必要です。

- USDCの`approve`
- AMMの`swap`

初めに表示された`approve`のトランザクションに署名し、しばらく待つと`swap`の署名について求められるので署名をします。

ここでは以下の図のようなことを行っています。

![](/public/images/AVAX-AMM/section-3/swap.drawio.svg)

しばらく待つと（ポップアップが表示されokを押した後）右側の`Your Details`が更新されます！

![](/public/images/AVAX-AMM/section-3/3_4_6.png)

それでは`Swap.tsx`の中身を見ましょう。

使用する状態変数は以下の通りです。

```ts
// スワップ元とスワップ先のトークンを格納します。
const [tokenIn, setTokenIn] = useState<TokenType>();
const [tokenOut, setTokenOut] = useState<TokenType>();

// ユーザの入力値を保持します。
const [amountIn, setAmountIn] = useState('');
const [amountOut, setAmountOut] = useState('');
```

`TokenIn`と`TokenOut`はユーザの操作によって中身に入るトークンオブジェクトが変化します。
UIのSwapタブで、真ん中にある上下矢印のアイコンをクリックするとUSDCとJOEが切り替わるのは、この`TokenIn`/`TokenOut`の中身を入れ替えているためです。

以下の`useEffect`で初期値を与え、`rev`関数により中身を入れ替えています。

```ts
useEffect(() => {
  setTokenIn(token0);
  setTokenOut(token1);
}, [token0, token1]);

const rev = () => {
  // スワップ元とスワップ先のトークンを交換します。
  const inCopy = tokenIn;
  setTokenIn(tokenOut);
  setTokenOut(inCopy);

  // 交換後はソーストークンから推定量を再計算します。
  getSwapEstimateOut(amountIn);
};
```

その他の関数はAMMコントラクトの関数を呼び出し、返り値を状態変数へ格納しています。

ポイントは以下です。

- スワップ元のトークン（先ほどの挙動確認でのUSDC）の入力値に変化があった場合は、`onChangeIn`が`getSwapEstimateOut`を実行することでスワップ先のトークン（先ほどの挙動確認でのJOE）の表示内容を更新します。
- スワップ先のトークンの入力値に変化があった場合は、`onChangeOut`が`getSwapEstimateIn`を実行することでスワップ元のトークンの表示内容を更新します。

🐃 Withdraw

最後に`SelectTab`ディレクトリ内に`Withdraw.tsx`という名前のファイルを作成し、以下のコードを記述してください。

```ts
import { BigNumber, ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';

import { AmmType, TokenType } from '../../hooks/useContract';
import {
  formatWithoutPrecision,
  formatWithPrecision,
} from '../../utils/format';
import { validAmount } from '../../utils/validAmount';
import InputNumberBox from '../InputBox/InputNumberBox';
import styles from './SelectTab.module.css';

type Props = {
  token0: TokenType | undefined;
  token1: TokenType | undefined;
  amm: AmmType | undefined;
  currentAccount: string | undefined;
  updateDetails: () => void;
};

export default function Withdraw({
  token0,
  token1,
  amm,
  currentAccount,
  updateDetails,
}: Props) {
  const [amountOfToken0, setAmountOfToken0] = useState('');
  const [amountOfToken1, setAmountOfToken1] = useState('');
  const [amountOfShare, setAmountOfShare] = useState('');
  const [amountOfMaxShare, setAmountOfMaxShare] = useState<string>();

  const getMaxShare = useCallback(async () => {
    if (!amm || !currentAccount) return;
    try {
      const shareWithPrecision = await amm.contract.share(currentAccount);
      const shareWithoutPrecision = formatWithoutPrecision(
        shareWithPrecision,
        amm.sharePrecision
      );
      setAmountOfMaxShare(shareWithoutPrecision);
    } catch (error) {
      alert(error);
    }
  }, [amm, currentAccount]);

  useEffect(() => {
    getMaxShare();
  }, [getMaxShare]);

  const leftLessThanRightAsBigNumber = (
    left: string,
    right: string
  ): boolean => {
    return BigNumber.from(left).lt(BigNumber.from(right));
  };

  const getEstimate = async (
    token: TokenType | undefined,
    amountOfShare: string,
    setAmount: (amount: string) => void
  ) => {
    if (!amm || !token || !amountOfMaxShare) return;
    if (!validAmount(amountOfShare)) return;
    if (leftLessThanRightAsBigNumber(amountOfMaxShare, amountOfShare)) {
      alert('Amount should be less than your max share');
      return;
    }
    try {
      const shareWithPrecision = formatWithPrecision(
        amountOfShare,
        amm.sharePrecision
      );
      const estimateInWei = await amm.contract.getWithdrawEstimate(
        token.contract.address,
        shareWithPrecision
      );
      const estimateInEther = ethers.utils.formatEther(estimateInWei);
      setAmount(estimateInEther);
    } catch (error) {
      alert(error);
    }
  };

  const onClickMax = async () => {
    if (!amountOfMaxShare) return;
    setAmountOfShare(amountOfMaxShare);
    getEstimate(token0, amountOfMaxShare, setAmountOfToken0);
    getEstimate(token1, amountOfMaxShare, setAmountOfToken1);
  };

  const onChangeAmountOfShare = async (amount: string) => {
    setAmountOfShare(amount);
    getEstimate(token0, amount, setAmountOfToken0);
    getEstimate(token1, amount, setAmountOfToken1);
  };

  const onClickWithdraw = async () => {
    if (!currentAccount) {
      alert('connect wallet');
      return;
    }
    if (!amm || !amountOfMaxShare) return;
    if (!validAmount(amountOfShare)) {
      alert('Amount should be a valid number');
      return;
    }
    if (leftLessThanRightAsBigNumber(amountOfMaxShare, amountOfShare)) {
      alert('Amount should be less than your max share');
      return;
    }
    try {
      const txn = await amm.contract.withdraw(
        formatWithPrecision(amountOfShare, amm.sharePrecision)
      );
      await txn.wait();
      setAmountOfToken0('');
      setAmountOfToken1('');
      setAmountOfShare('');
      updateDetails(); // ユーザとammの情報を更新
      alert('Success!');
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className={styles.tabBody}>
      <div className={styles.bottomDiv}>
        <div className={styles.btn} onClick={() => onClickMax()}>
          Max
        </div>
      </div>
      <InputNumberBox
        leftHeader={'Amount of share:'}
        right=""
        value={amountOfShare}
        onChange={(e) => onChangeAmountOfShare(e.target.value)}
      />
      {token0 && token1 && (
        <div className={styles.estimate}>
          <div>
            <p>
              Amount of {token0.symbol}: {amountOfToken0}
            </p>
            <p>
              Amount of {token1.symbol}: {amountOfToken1}
            </p>
          </div>
        </div>
      )}
      <div className={styles.bottomDiv}>
        <div className={styles.btn} onClick={() => onClickWithdraw()}>
          Withdraw
        </div>
      </div>
    </div>
  );
}
```

ここではWithdrawタブを実装しています。

`components/Container/Container.tsx`内に以下の内容を追加し、UIを確認します。

```diff
import { useState } from 'react';

import { useContract } from '../../hooks/useContract';
import Details from '../Details/Details';
import Faucet from '../SelectTab/Faucet';
import Provide from '../SelectTab/Provide';
import Swap from '../SelectTab/Swap';
+ import Withdraw from '../SelectTab/Withdraw';
import styles from './Container.module.css';

type Props = {
  currentAccount: string | undefined;
};

export default function Container({ currentAccount }: Props) {
  // ...

  return (
    // ...

        {activeTab === 'Swap' && (
          <Swap
            token0={token0}
            token1={token1}
            amm={amm}
            currentAccount={currentAccount}
            updateDetails={updateDetails}
          />
        )}
        {activeTab === 'Provide' && (
          <Provide
            token0={token0}
            token1={token1}
            amm={amm}
            currentAccount={currentAccount}
            updateDetails={updateDetails}
          />
        )}
+        {activeTab === 'Withdraw' && (
+          <Withdraw
+            token0={token0}
+            token1={token1}
+            amm={amm}
+            currentAccount={currentAccount}
+            updateDetails={updateDetails}
+          />
+        )}
        {activeTab === 'Faucet' && (
          <Faucet
            token0={token0}
            token1={token1}
            currentAccount={currentAccount}
            updateDetails={updateDetails}
          />
        )}
    // ...
  );
}
```

ブラウザで`http://localhost:3000`へアクセスします。

`Withdraw`タブをクリックすると以下のような表示がされます。

![](/public/images/AVAX-AMM/section-3/3_4_7.png)

`Max`ボタンをクリックするとユーザの保有するシェアが入力値となり、引き出すことのできるトークンの量がそれぞれ下に表示されます。
`Withdraw`をクリックします。

トランザクションに署名し、しばらく待つと（ポップアップが表示されokを押した後）右側の`Your Details`が更新されます！

![](/public/images/AVAX-AMM/section-3/3_4_8.png)

今回は1つのアカウントで挙動を確かめているためMaxのシェアでトークンを引き出すとプールは空になり、ユーザの保有するトークンの量が元々保有していた量に戻ります。

`Withdraw.tsx`の中身はこれまでの実装に比べるとシンプルです。

主な処理は以下の流れで行われます。

1. ユーザが入力欄に数値を入力するor `Max`ボタンをクリックするとそれぞれ　`onChangeAmountOfShare`、`onClickMax`が実行されます。
2. `onChangeAmountOfShare`/`onClickMax`は状態変数を更新後、`getEstimate`関数を実行することでAMMコントラクトの`getWithdrawEstimate`を呼び出します。
3. `getWithdrawEstimate`の返り値を状態変数(`amountOfToken0`/`amountOfToken1`)にセットすることで、UIに表示するユーザが受け取れるトークンの量を更新します。

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

おめでとうございます!
セクション3が終了しました!

次のセクションであなたのwebアプリをデプロイしましょう 🛫

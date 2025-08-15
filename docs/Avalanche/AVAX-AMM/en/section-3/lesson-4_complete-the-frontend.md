### Let’s Add a Component

The frontend is getting close to completion!

In this lesson, we’ll implement the remaining components to finish the frontend.

After creating each component, we’ll check the UI, so make sure you’re in the `AVAX-AMM` directory and run the following command in your terminal:

```
yarn client dev
```

### 📁 `components` Directory

📁 `SelectTab` Directory

Inside the `components` directory, create a new directory called `SelectTab`.
Inside it, create a file named `SelectTab.module.css`.

Write the following code in `SelectTab.module.css`:

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

Next, inside the `SelectTab` directory, create a file named `Faucet.tsx` and write the following code in it.

```ts
import { ethers } from "ethers";
import { useEffect, useState } from "react";

import { TokenType } from "../../hooks/useContract";
import { validAmount } from "../../utils/validAmount";
import InputNumberBox from "../InputBox/InputNumberBox";
import styles from "./SelectTab.module.css";

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
  const [amountOfFunds, setAmountOfFunds] = useState("");
  const [currentTokenIndex, setCurrentTokenIndex] = useState(0);

  const [tokens, setTokens] = useState<TokenType[]>([]);

  useEffect(() => {
    if (!token0 || !token1) return;
    setTokens([token0, token1]);
  }, [token0, token1]);

  // Within the range of `tokens`, move the referenced index to the next position.
  const onChangeToken = () => {
    setCurrentTokenIndex((currentTokenIndex + 1) % tokens.length);
  };

  const onChangeAmountOfFunds = (amount: string) => {
    setAmountOfFunds(amount);
  };

  async function onClickFund() {
    if (!currentAccount) {
      alert("connect wallet");
      return;
    }
    if (tokens.length === 0) return;
    if (!validAmount(amountOfFunds)) {
      alert("Amount should be a valid number");
      return;
    }
    try {
      const contract = tokens[currentTokenIndex].contract;
      const amountInWei = ethers.utils.parseEther(amountOfFunds);

      const txn = await contract.faucet(currentAccount, amountInWei);
      await txn.wait();
      updateDetails(); // Update user and amm information
      alert("Success");
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
          "Amount of " +
          (tokens[currentTokenIndex]
            ? tokens[currentTokenIndex].symbol
            : "some token")
        }
        right={
          tokens[currentTokenIndex] ? tokens[currentTokenIndex].symbol : ""
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

Here, you are implementing the faucets for the USDC and JOE you deployed.

Before looking at the implementation details, let’s view the UI in the browser.

Add the following content inside `components/Container/Container.tsx`.

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

Open your browser and go to `http://localhost:3000`.

Click the `Faucet` tab and you should see a screen like this:

![](/images/AVAX-AMM/section-3/3_4_1.png)

Enter `10` in the input field and click `Fund`.
After signing the transaction and waiting a moment（after the popup appears and you click OK）, the USDC value under `Your Details` on the right should increase by 10.

![](/images/AVAX-AMM/section-3/3_4_2.png)

Clicking the `Change` button switches from USDC -> JOE, allowing you to use the faucet for JOE in the same way.

Now, let’s look at the contents of `Faucet.tsx`.

The state variables used are as follows.

```ts
const [amountOfFunds, setAmountOfFunds] = useState(""); // Stores the amount of tokens the user wants to obtain.
const [currentTokenIndex, setCurrentTokenIndex] = useState(0); //  Stores the current index of tokens (explained next).

const [tokens, setTokens] = useState<TokenType[]>([]); // Holds token objects in the format [token0, token1].
```

Below is the implementation of the functions triggered by user actions.

```ts
// Within the range of `tokens`, move the referenced index to the next position.
const onChangeToken = () => {
  setCurrentTokenIndex((currentTokenIndex + 1) % tokens.length);
};

const onChangeAmountOfFunds = (amount: string) => {
  setAmountOfFunds(amount);
};

async function onClickFund() {
  if (!currentAccount) {
    alert("connect wallet");
    return;
  }
  if (tokens.length === 0) return;
  if (!validAmount(amountOfFunds)) {
    alert("Amount should be a valid number");
    return;
  }
  try {
    const contract = tokens[currentTokenIndex].contract;
    const amountInWei = ethers.utils.parseEther(amountOfFunds);

    const txn = await contract.faucet(currentAccount, amountInWei);
    await txn.wait();
    updateDetails(); // // Update user and amm information
    alert("Success");
  } catch (error) {
    console.log(error);
  }
}
```

- `onChangeToken`: When the `Change` button is clicked, update `currentTokenIndex`.
  This switches between USDC and JOE.
- `onChangeAmountOfFunds`: Set the user’s input value to `amountOfFunds`.
- `onClickFund`: When the `Fund` button is clicked, call the `faucet` function of the token at `currentTokenIndex`.
  Run `updateDetails()`（passed as a prop to this component）to refresh the details.

🦜 Provide

Next, inside the `SelectTab` directory, create a file named `Provide.tsx` and write the following code.

```ts
import { BigNumber, ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";

import { AmmType, TokenType } from "../../hooks/useContract";
import { validAmount } from "../../utils/validAmount";
import InputNumberBox from "../InputBox/InputNumberBox";
import styles from "./SelectTab.module.css";

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
  const [amountOfToken0, setAmountOfToken0] = useState("");
  const [amountOfToken1, setAmountOfToken1] = useState("");
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
      alert("connect wallet");
      return;
    }
    if (!amm || !token0 || !token1) return;
    if (!validAmount(amountOfToken0) || !validAmount(amountOfToken1)) {
      alert("Amount should be a valid number");
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
      setAmountOfToken0("");
      setAmountOfToken1("");
      checkLiquidity(); // Check the pool status
      updateDetails(); // Update user and amm information
      alert("Success");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className={styles.tabBody}>
      <InputNumberBox
        leftHeader={"Amount of " + (token0 ? token0.symbol : "some token")}
        right={token0 ? token0.symbol : ""}
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
        leftHeader={"Amount of " + (token1 ? token1.symbol : "some token")}
        right={token1 ? token1.symbol : ""}
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

Here, we are implementing the Provide tab.

Before looking at the implementation details, let’s check the UI in the browser.

Add the following content inside `components/Container/Container.tsx`.

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

Open your browser and go to `http://localhost:3000`.

Click the `Provide` tab and you should see a screen like this:

![](/images/AVAX-AMM/section-3/3_4_3.png)

Enter `100` in both input fields and click `Provide`.

Executing provide requires signing the following transactions:

- USDC `approve`
- JOE `approve`
- AMM `provide`

First, the MetaMask signing screen will appear twice in succession.
Sign both, wait a moment, and then you’ll be prompted for the final `provide` signature—sign that as well.
🙌 If anyone can help improve this UI flow, please share with UNCHAIN!

After a short wait（once the popup appears and you click OK）, the `Your Details` panel on the right will update!

![](/images/AVAX-AMM/section-3/3_4_4.png)

Now, let’s look at the contents of `Provide.tsx`.

The state variables used are as follows.


```ts
const [amountOfToken0, setAmountOfToken0] = useState(""); // Holds the amount of token0 the user wants to deposit.
const [amountOfToken1, setAmountOfToken1] = useState(""); // Holds the amount of token1 the user wants to deposit.
const [activePool, setActivePool] = useState(true); // Holds a flag indicating whether the pool currently has liquidity.
```

The following two functions are needed to display the required amount of the other token when the user enters a value in one of the input fields（USDC or JOE）.
※ In the earlier behavior check, this couldn’t be confirmed because it was the initial liquidity provision. If you enter a value again in the `Provide` tab, you should be able to verify this feature!

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

`getProvideEstimate` internally calls the AMM’s `getEquivalentToken`, passing the specified token and its amount as arguments.
It then sets the return value（the amount of the paired token that is of equivalent value）via `setPairTokenAmount`.

`onChangeAmount` is triggered when the user enters a number in an input field.
Its purpose is to update the state variable for the entered token amount and, by calling `getProvideEstimate`, update the state variable for the equivalent amount of the paired token.

The subsequent `onClickProvide` function calls the AMM’s `provide`, but the key point is that each token’s `approve` is called before executing `provide`.

🦢 Swap

Next, inside the `SelectTab` directory, create a file named `Swap.tsx` and write the following code.

```ts
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { MdSwapVert } from "react-icons/md";

import { AmmType, TokenType } from "../../hooks/useContract";
import { validAmount } from "../../utils/validAmount";
import InputNumberBox from "../InputBox/InputNumberBox";
import styles from "./SelectTab.module.css";

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
  // Store the source and destination tokens for the swap.
  const [tokenIn, setTokenIn] = useState<TokenType>();
  const [tokenOut, setTokenOut] = useState<TokenType>();

  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState("");

  useEffect(() => {
    setTokenIn(token0);
    setTokenOut(token1);
  }, [token0, token1]);

  const rev = () => {
    // Swap the source and destination tokens.
    const inCopy = tokenIn;
    setTokenIn(tokenOut);
    setTokenOut(inCopy);

    // After swapping, recalculate the estimate based on the source token.
    getSwapEstimateOut(amountIn);
  };

  // From the specified amount of the source token, get the receivable amount of the destination token.
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

  // From the specified amount of the destination token, get the required amount of the source token.
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
      alert("Connect to wallet");
      return;
    }
    if (!amm || !tokenIn || !tokenOut) return;
    if (!validAmount(amountIn)) {
      alert("Amount should be a valid number");
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
      setAmountIn("");
      setAmountOut("");
      updateDetails(); // Update user and AMM information
      alert("Success!");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className={styles.tabBody}>
      <InputNumberBox
        leftHeader={"From"}
        right={tokenIn ? tokenIn.symbol : ""}
        value={amountIn}
        onChange={(e) => onChangeIn(e.target.value)}
      />
      <div className={styles.swapIcon} onClick={() => rev()}>
        <MdSwapVert />
      </div>
      <InputNumberBox
        leftHeader={"To"}
        right={tokenOut ? tokenOut.symbol : ""}
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

Here, we are implementing the Swap tab.

Add the following content inside `components/Container/Container.tsx` and check the UI.

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

Open your browser and go to `http://localhost:3000`.

Click the `Swap` tab and you should see a screen like this:

![](/images/AVAX-AMM/section-3/3_4_5.png)

Enter `50` in the USDC input field, and the amount of JOE you can receive from the swap will be displayed.
Click `Swap`.

Executing the swap requires signing the following transactions:

- USDC `approve`
- AMM `swap`

First, sign the `approve` transaction when prompted. After a short wait, you’ll be asked to sign the `swap`—sign it as well.

Here’s what’s happening, as illustrated below:

![](/images/AVAX-AMM/section-3/swap.drawio.png)

After a short wait（once the popup appears and you click OK）, the `Your Details` panel on the right will update!

![](/images/AVAX-AMM/section-3/3_4_6.png)

Now, let’s look at the contents of `Swap.tsx`.

The state variables used are as follows.

```ts
// Store the source and destination tokens for the swap.
const [tokenIn, setTokenIn] = useState<TokenType>();
const [tokenOut, setTokenOut] = useState<TokenType>();

// Store the user's input value.
const [amountIn, setAmountIn] = useState("");
const [amountOut, setAmountOut] = useState("");
```

`TokenIn` and `TokenOut` are token objects whose contents change depending on the user's actions.
In the Swap tab UI, clicking the up/down arrow icon in the middle swaps USDC and JOE because the `rev` function swaps the contents of `TokenIn` and `TokenOut`.

The `useEffect` hook is used to set their initial values when the component mounts, and the `rev` function updates them when the user wants to reverse the swap direction.

```ts
useEffect(() => {
  setTokenIn(token0);
  setTokenOut(token1);
}, [token0, token1]);

const rev = () => {
  // Swap the source and target tokens.
  const inCopy = tokenIn;
  setTokenIn(tokenOut);
  setTokenOut(inCopy);

  // After swapping, recalculate the estimated amount based on the new source token.
  getSwapEstimateOut(amountIn);
};
```

Other functions call the AMM contract’s functions and store the return values in state variables.

Key points are as follows:

- When the input value of the source token（USDC in the earlier behavior check）changes, `onChangeIn` runs `getSwapEstimateOut` to update the displayed amount of the destination token（JOE in the earlier behavior check）.
- When the input value of the destination token changes, `onChangeOut` runs `getSwapEstimateIn` to update the displayed amount of the source token.

🐃 Withdraw

Finally, inside the `SelectTab` directory, create a file named `Withdraw.tsx` and write the following code.

```ts
import { BigNumber, ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";

import { AmmType, TokenType } from "../../hooks/useContract";
import {
  formatWithoutPrecision,
  formatWithPrecision,
} from "../../utils/format";
import { validAmount } from "../../utils/validAmount";
import InputNumberBox from "../InputBox/InputNumberBox";
import styles from "./SelectTab.module.css";

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
  const [amountOfToken0, setAmountOfToken0] = useState("");
  const [amountOfToken1, setAmountOfToken1] = useState("");
  const [amountOfShare, setAmountOfShare] = useState("");
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
      alert("Amount should be less than your max share");
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
      alert("connect wallet");
      return;
    }
    if (!amm || !amountOfMaxShare) return;
    if (!validAmount(amountOfShare)) {
      alert("Amount should be a valid number");
      return;
    }
    if (leftLessThanRightAsBigNumber(amountOfMaxShare, amountOfShare)) {
      alert("Amount should be less than your max share");
      return;
    }
    try {
      const txn = await amm.contract.withdraw(
        formatWithPrecision(amountOfShare, amm.sharePrecision)
      );
      await txn.wait();
      setAmountOfToken0("");
      setAmountOfToken1("");
      setAmountOfShare("");
      updateDetails(); // Update user and amm information
      alert("Success!");
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
        leftHeader={"Amount of share:"}
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

Here, we are implementing the Withdraw tab.

Add the following content inside `components/Container/Container.tsx` and check the UI.

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

Access `http://localhost:3000` in your browser.

Click the `Withdraw` tab, and you will see a display like this:

![](/images/AVAX-AMM/section-3/3_4_7.png)

When you click the `Max` button, the number of shares you hold will be set as the input value, and the amount of tokens you can withdraw will be displayed below.
Click `Withdraw`.

Sign the transaction, and after waiting a short while（once the popup appears and you press OK）, the `Your Details` section on the right will be updated!

![](/images/AVAX-AMM/section-3/3_4_8.png)

Since we are testing the behavior using a single account, withdrawing the maximum number of shares will empty the pool, and the amount of tokens you hold will return to the amount you originally had.

Compared to previous implementations, the content of `Withdraw.tsx` is relatively simple.

The main process flow is as follows:

1. When the user enters a number into the input field **or** clicks the `Max` button, the `onChangeAmountOfShare` or `onClickMax` function is executed, respectively.
2. After updating the state variables, `onChangeAmountOfShare`/`onClickMax` calls the `getEstimate` function, which in turn calls the AMM contract’s `getWithdrawEstimate`.
3. The return value of `getWithdrawEstimate` is then set to the state variables (`amountOfToken0`/`amountOfToken1`), updating the amount of tokens the user can receive displayed in the UI.

### 🌔 Reference Links

> [Here](https://github.com/unchain-tech/AVAX-AMM) is the completed repository for this project.
> If things are not working as expected, please refer to it.

### 🙋‍♂️ Asking Questions

If you have any questions about the work so far, please ask them in the `#avalanche` channel on Discord.

To make the help process smoother, please include the following in your error report ✨

```
1. The section and lesson number related to your question
2. What you were trying to do
3. Copy & paste the error message
4. A screenshot of the error screen
```

---

🎉 Congratulations!
Section 3 is now complete!

In the next section, let’s deploy your web application 🛫

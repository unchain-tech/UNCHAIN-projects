### 🔥 Let's Implement `swap`

In the previous lesson, we learned how to calculate the amount of tokens to be transferred to the user when performing a token swap.

In this lesson, we will implement the `swap` function in the contract.

At the end of the `AMM.sol` contract, add the following two functions:

```solidity
    // Calculates the amount of output token from the input token amount
    function getSwapEstimateOut(IERC20 inToken, uint256 amountIn)
        public
        view
        activePool
        validToken(inToken)
        returns (uint256)
    {
        IERC20 outToken = _pairToken(inToken);

        uint256 amountInWithFee = amountIn * 997;

        uint256 numerator = amountInWithFee * totalAmount[outToken];
        uint256 denominator = totalAmount[inToken] * 1000 + amountInWithFee;
        uint256 amountOut = numerator / denominator;

        return amountOut;
    }

    // Calculates the amount of input token required from the desired output token amount
    function getSwapEstimateIn(IERC20 outToken, uint256 amountOut)
        public
        view
        activePool
        validToken(outToken)
        returns (uint256)
    {
        require(
            amountOut < totalAmount[outToken],
            "Insufficient pool balance"
        );
        IERC20 inToken = _pairToken(outToken);

        uint256 numerator = 1000 * totalAmount[inToken] * amountOut;
        uint256 denominator = 997 * (totalAmount[outToken] - amountOut);
        uint256 amountIn = numerator / denominator;

        return amountIn;
    }
```

The `getSwapEstimateOut` function implements Scenario 1 from the previous lesson.

It returns the amount of output token to be sent to the user based on the input token (`inToken`) and amount (`amountIn`).

The term `out` refers to tokens going out of the pool, and `in` refers to tokens coming into the pool.

The internal formula used is the one derived in the last lesson.

The `getSwapEstimateIn` function implements Scenario 2 from the previous lesson.

It returns the amount of input tokens required to obtain a desired amount of output tokens.

Below these, add the following function to complete the contract:

```solidity
    function swap(
        IERC20 inToken,
        IERC20 outToken,
        uint256 amountIn
    ) external activePool validTokens(inToken, outToken) returns (uint256) {
        require(amountIn > 0, "Amount cannot be zero!");

        uint256 amountOut = getSwapEstimateOut(inToken, amountIn);

        inToken.transferFrom(msg.sender, address(this), amountIn);
        totalAmount[inToken] += amountIn;
        totalAmount[outToken] -= amountOut;
        outToken.transfer(msg.sender, amountOut);
        return amountOut;
    }
```

The `swap` function is straightforward: it uses `getSwapEstimateOut` to calculate the amount of tokens to send to the user, transfers `inToken` from the user to the contract, and transfers `outToken` from the contract to the user.

### 🧪 Let's Add Tests

Now let's write tests for the added functions.

Add the following to the end of `test/AMM.ts`:

```ts
describe("getSwapEstimateOut", function () {
  it("Should get the right number of token", async function () {
    const { amm, token0, token1 } = await loadFixture(
      deployContractWithLiquidity
    );

    const totalToken0 = await amm.totalAmount(token0.address);
    const totalToken1 = await amm.totalAmount(token1.address);

    const amountInToken0 = ethers.utils.parseEther("10");
    const amountInToken0WithFee = amountInToken0.mul(997);
    const amountReceiveToken1 = amountInToken0WithFee
      .mul(totalToken1)
      .div(totalToken0.mul(1000).add(amountInToken0WithFee));

    expect(await amm.getSwapEstimateOut(token0.address, amountInToken0)).to.eql(
      amountReceiveToken1
    );
  });
});

describe("getSwapEstimateIn", function () {
  it("Should get the right number of token", async function () {
    const { amm, token0, token1 } = await loadFixture(
      deployContractWithLiquidity
    );

    const totalToken0 = await amm.totalAmount(token0.address);
    const totalToken1 = await amm.totalAmount(token1.address);

    const amountOutToken1 = ethers.utils.parseEther("10");
    const amountInToken0 = totalToken0
      .mul(amountOutToken1)
      .mul(1000)
      .div(totalToken1.sub(amountOutToken1).mul(997));

    expect(await amm.getSwapEstimateIn(token1.address, amountOutToken1)).to.eql(
      amountInToken0
    );
  });

  it("Should revert if the amount of out token exceed the total", async function () {
    const { amm, token1, amountOwnerProvided1, amountOtherProvided1 } =
      await loadFixture(deployContractWithLiquidity);

    const amountSendToken1 = amountOwnerProvided1
      .add(amountOtherProvided1)
      .add(1);

    await expect(
      amm.getSwapEstimateIn(token1.address, amountSendToken1)
    ).to.be.revertedWith("Insufficient pool balance");
  });
});
```

The tests ensure that `getSwapEstimateOut` and `getSwapEstimateIn` return correct values by comparing them with manually calculated values.

Also, `getSwapEstimateIn` is tested to revert if the specified token amount exceeds the pool balance.

Now add the following tests:

```ts
describe("swap", function () {
  it("Should set the right number of amm details", async function () {
    const {
      amm,
      token0,
      amountOwnerProvided0,
      amountOtherProvided0,
      token1,
      amountOwnerProvided1,
      amountOtherProvided1,
    } = await loadFixture(deployContractWithLiquidity);

    const amountSendToken0 = ethers.utils.parseEther("10");
    const amountReceiveToken1 = await amm.getSwapEstimateOut(
      token0.address,
      amountSendToken0
    );

    await token0.approve(amm.address, amountSendToken0);
    await amm.swap(token0.address, token1.address, amountSendToken0);

    expect(await amm.totalAmount(token0.address)).to.equal(
      amountOwnerProvided0.add(amountOtherProvided0).add(amountSendToken0)
    );
    expect(await amm.totalAmount(token1.address)).to.equal(
      amountOwnerProvided1.add(amountOtherProvided1).sub(amountReceiveToken1)
    );
  });

  it("Token should be moved", async function () {
    const { amm, token0, token1, owner } = await loadFixture(
      deployContractWithLiquidity
    );

    const ownerBalance0Before = await token0.balanceOf(owner.address);
    const ownerBalance1Before = await token1.balanceOf(owner.address);

    const ammBalance0Before = await token0.balanceOf(amm.address);
    const ammBalance1Before = await token1.balanceOf(amm.address);

    const amountSendToken0 = ethers.utils.parseEther("10");
    const amountReceiveToken1 = await amm.getSwapEstimateOut(
      token0.address,
      amountSendToken0
    );

    await token0.approve(amm.address, amountSendToken0);
    await amm.swap(token0.address, token1.address, amountSendToken0);

    expect(await token0.balanceOf(owner.address)).to.eql(
      ownerBalance0Before.sub(amountSendToken0)
    );
    expect(await token1.balanceOf(owner.address)).to.eql(
      ownerBalance1Before.add(amountReceiveToken1)
    );

    expect(await token0.balanceOf(amm.address)).to.eql(
      ammBalance0Before.add(amountSendToken0)
    );
    expect(await token1.balanceOf(amm.address)).to.eql(
      ammBalance1Before.sub(amountReceiveToken1)
    );
  });
});
```

These `swap` tests check whether the state variables of the AMM are updated correctly and whether tokens are moved as expected.

### ⭐ Run the Tests

Run the following command in your terminal:

```
yarn test
```

If you see output like below, your tests are successful!

![](/images/AVAX-AMM/section-2/2_1_4.png)

### 🌔 Reference

> The completed project repository is available [here](https://github.com/unchain-tech/AVAX-AMM).
>
> If things don’t work as expected, feel free to refer to it.

### 🙋‍♂️ Ask Questions

If you have any questions at this point, please post them in the Discord `#avalanche` channel.

To get help more smoothly, include the following in your error report ✨

```
1. Section and lesson number related to your question
2. What you were trying to do
3. Copy & paste the error message
4. Screenshot of the error screen
```

---

Congratulations!
You’ve completed Section 2. The contract is now complete!

In the next section, we’ll create the frontend 🏌️‍♀️

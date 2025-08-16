---
title: Implementing Token Withdrawal
---
### 🔥 Let's Implement Token Withdrawal Functionality

In the previous lesson, we implemented the token providing functionality.
In this lesson, we will implement the functionality for liquidity providers to withdraw the tokens they deposited.

Users can withdraw tokens from the pool in proportion to the share they own.

Now, please add the following two functions at the end of the `AMM.sol` AMM contract:

```solidity
    // Calculates the amount of tokens that can be withdrawn based on the user's share.
    function getWithdrawEstimate(IERC20 token, uint256 _share)
        public
        view
        activePool
        validToken(token)
        returns (uint256)
    {
        require(_share <= totalShare, "Share should be less than totalShare");
        return (_share * totalAmount[token]) / totalShare;
    }

    function withdraw(uint256 _share)
        external
        activePool
        returns (uint256, uint256)
    {
        require(_share > 0, "share cannot be zero!");
        require(_share <= share[msg.sender], "Insufficient share");

        uint256 amountTokenX = getWithdrawEstimate(_tokenX, _share);
        uint256 amountTokenY = getWithdrawEstimate(_tokenY, _share);

        share[msg.sender] -= _share;
        totalShare -= _share;

        totalAmount[_tokenX] -= amountTokenX;
        totalAmount[_tokenY] -= amountTokenY;

        _tokenX.transfer(msg.sender, amountTokenX);
        _tokenY.transfer(msg.sender, amountTokenY);

        return (amountTokenX, amountTokenY);
    }
```

In the `getWithdrawEstimate` function, we calculate the amount of tokens that correspond to the specified share.

The ratio of the specified share (`share`) to the total share (`totalShare`) can be expressed as:

![](/images/AVAX-AMM/section-1/1_4_2.png)

Based on that, the amount of tokens corresponding to the share can be calculated as:

![](/images/AVAX-AMM/section-1/1_4_3.png)

The `withdraw` function performs the actual withdrawal process.

It first calculates the amount of each token to withdraw from the AMM using `getWithdrawEstimate`.

Then it adjusts the state variables of shares and token amounts by the withdrawn amount, and transfers the tokens to the user who called the function.

Since the AMM contract is transferring tokens to the user, we simply use the `transfer` function here.

### 🧪 Let's Add Tests

Now let's write tests for the newly added functionality.
Please add the following code at the end of the tests in `test/AMM.ts`:

```ts
describe("getWithdrawEstimate", function () {
  it("Should get the right number of estimated amount", async function () {
    const {
      amm,
      token0,
      amountOtherProvided0,
      token1,
      amountOtherProvided1,
      otherAccount,
    } = await loadFixture(deployContractWithLiquidity);

    // Get share of otherAccount
    const share = await amm.share(otherAccount.address);

    expect(await amm.getWithdrawEstimate(token0.address, share)).to.eql(
      amountOtherProvided0
    );
    expect(await amm.getWithdrawEstimate(token1.address, share)).to.eql(
      amountOtherProvided1
    );
  });
});
```

In the `getWithdrawEstimate` test, we test whether the return value of the `getWithdrawEstimate` function is correct
when passing the share of `otherAccount` as an argument.

Since `otherAccount` has deposited `amountOtherProvided0` and `amountOtherProvided1` respectively in the pool,
calculating the amount that can be withdrawn according to the share should return the same amount.

Next, add the following tests below that:

```ts
describe("withdraw", function () {
  it("Token should be moved", async function () {
    const {
      amm,
      token0,
      amountOwnerProvided0,
      token1,
      amountOwnerProvided1,
      owner,
    } = await loadFixture(deployContractWithLiquidity);

    const ownerBalance0Before = await token0.balanceOf(owner.address);
    const ownerBalance1Before = await token1.balanceOf(owner.address);

    const ammBalance0Before = await token0.balanceOf(amm.address);
    const ammBalance1Before = await token1.balanceOf(amm.address);

    const share = await amm.share(owner.address);
    await amm.withdraw(share);

    expect(await token0.balanceOf(owner.address)).to.eql(
      ownerBalance0Before.add(amountOwnerProvided0)
    );
    expect(await token1.balanceOf(owner.address)).to.eql(
      ownerBalance1Before.add(amountOwnerProvided1)
    );

    expect(await token0.balanceOf(amm.address)).to.eql(
      ammBalance0Before.sub(amountOwnerProvided0)
    );
    expect(await token1.balanceOf(amm.address)).to.eql(
      ammBalance1Before.sub(amountOwnerProvided1)
    );
  });

  it("Should set the right number of amm details", async function () {
    const {
      amm,
      token0,
      amountOwnerProvided0,
      token1,
      amountOwnerProvided1,
      owner,
      otherAccount,
    } = await loadFixture(deployContractWithLiquidity);

    // otherAccount withdraws all their shares
    const share = await amm.share(otherAccount.address);
    await amm.connect(otherAccount).withdraw(share);

    const precision = await amm.PRECISION();
    const BN100 = BigNumber.from("100");

    expect(await amm.totalShare()).to.equal(BN100.mul(precision));
    expect(await amm.share(owner.address)).to.equal(BN100.mul(precision));
    expect(await amm.share(otherAccount.address)).to.equal(0);
    expect(await amm.totalAmount(token0.address)).to.equal(
      amountOwnerProvided0
    );
    expect(await amm.totalAmount(token1.address)).to.equal(
      amountOwnerProvided1
    );
  });
});
```

In the `Token should be moved` test, we verify that tokens are correctly moved before and after executing the `withdraw` function.
The logic is the same as the one used in the tests for `provide` to verify token movement.

In the next `Should set the right number of amm details` test,
we check whether the state variables in the AMM contract are updated correctly when `otherAccount` withdraws tokens according to their share.

### ⭐ Let's Run the Tests

In your terminal, execute the following command:

```
yarn test
```

If you see output like the image below, the test has passed successfully!

![](/images/AVAX-AMM/section-1/1_4_1.png)

### 🌔 Reference Link

> [Here](https://github.com/unchain-tech/AVAX-AMM) is the completed version of this project.
>
> If things are not working as expected, feel free to use it as a reference.

### 🤝 Ask Questions

If you have any questions about the work so far, please ask in Discord under the `#avalanche` channel.

To streamline the help process, please include the following three points in your error report ✨

```
1. Section and lesson number the question relates to
2. What you were trying to do
3. Copy & paste the error message
4. Screenshot of the error screen
```

---

Congratulations!
You have completed Section 1!

In the next section, we will implement the swap functionality into the AMM contract 🏄‍♂️

### 🔥 Let’s Implement Liquidity Provision

In this lesson, we’ll implement a function in the contract that is triggered when a token-holding user provides liquidity.

Here’s a summary of the implementation:

* Users can deposit two tokens into the contract.

* A rule is set where users must deposit an equal value of both tokens.
  Example: If the pool has a 1:2 ratio of token X to Y, depositing 10 of token X requires 20 of token Y.

* Within the contract, we store the user’s deposited amount as a numerical “share” representing their portion of the total.

Let’s begin the implementation. First, add the following code below the constructor inside `AMM.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AMM {
    IERC20 private _tokenX; // ERC20-compliant contract
    IERC20 private _tokenY; // ERC20-compliant contract
    uint256 public totalShare; // Total shares
    mapping(address => uint256) public share; // User shares
    mapping(IERC20 => uint256) public totalAmount; // Token amounts locked in pool

    uint256 public constant PRECISION = 1_000_000; // Precision constant for shares (= 6 digits)

    // Specify tokens that can be used in the pool.
    constructor(IERC20 tokenX, IERC20 tokenY) {
        _tokenX = tokenX;
        _tokenY = tokenY;
    }

    // Ensure pool has liquidity and is active.
    modifier activePool() {
        require(totalShare > 0, "Zero Liquidity");
        _;
    }

    // Ensure the token is valid for this contract.
    modifier validToken(IERC20 token) {
        require(
            token == _tokenX || token == _tokenY,
            "Token is not in the pool"
        );
        _;
    }

    // Ensure both tokens are valid for this contract.
    modifier validTokens(IERC20 tokenX, IERC20 tokenY) {
        require(
            tokenX == _tokenX || tokenY == _tokenY,
            "Token is not in the pool"
        );
        require(
            tokenY == _tokenX || tokenY == _tokenY,
            "Token is not in the pool"
        );
        require(tokenX != tokenY, "Tokens should be different!");
        _;
    }

    // Return the pair token of the given token.
    function _pairToken(IERC20 token)
        private
        view
        validToken(token)
        returns (IERC20)
    {
        if (token == tokenX) {
            return tokenY;
        }
        return tokenX;
    }
}
```

The items added here are needed for the functions we’ll implement shortly.

Next, add the following function at the end of the contract:

```solidity
    // Return the equivalent amount of the pair token for a given input token amount.
    function getEquivalentToken(IERC20 inToken, uint256 amountIn)
        public
        view
        activePool
        validToken(inToken)
        returns (uint256)
    {
        IERC20 outToken = _pairToken(inToken);

        return (totalAmount[outToken] * amountIn) / totalAmount[inToken];
    }
```

This function calculates the equivalent value of the other token before providing liquidity.

Let’s say the pool has token amounts x and y, and the user is adding x' and y'. The following ratio must hold:

![](/images/AVAX-AMM/section-1/1_3_2.png)

To solve for y', we rearrange the equation as follows:

![](/images/AVAX-AMM/section-1/1_3_3.png)

This is exactly what the function does—given one token and its amount, it calculates the equivalent value of the paired token.

Now let’s implement the actual liquidity provision function. Add the following to the end of the contract:

```solidity
    // Provide liquidity to the pool.
    function provide(
        IERC20 tokenX,
        uint256 amountX,
        IERC20 tokenY,
        uint256 amountY
    ) external validTokens(tokenX, tokenY) returns (uint256) {
        require(amountX > 0, "Amount cannot be zero!");
        require(amountY > 0, "Amount cannot be zero!");

        uint256 newshare;
        if (totalShare == 0) {
            // Start with 100
            newshare = 100 * PRECISION;
        } else {
            uint256 shareX = (totalShare * amountX) / totalAmount[tokenX];
            uint256 shareY = (totalShare * amountY) / totalAmount[tokenY];
            require(
                shareX == shareY,
                "Equivalent value of tokens not provided..."
            );
            newshare = shareX;
        }

        require(
            newshare > 0,
            "Asset value less than threshold for contribution!"
        );

        tokenX.transferFrom(msg.sender, address(this), amountX);
        tokenY.transferFrom(msg.sender, address(this), amountY);

        totalAmount[tokenX] += amountX;
        totalAmount[tokenY] += amountY;

        totalShare += newshare;
        share[msg.sender] += newshare;

        return newshare;
    }
```

This function receives token contracts and their respective amounts as parameters.
We use modifier and require to ensure validity.

We then calculate and store the user’s new share in `newShare`, with branching based on whether this is the first liquidity.

```solidity
uint256 newshare;
if (totalShare == 0) {
    // Start with 100
    newshare = 100 * PRECISION;
} else {
    uint256 shareX = (totalShare * amountX) / totalAmount[tokenX];
    uint256 shareY = (totalShare * amountY) / totalAmount[tokenY];
    require(
        shareX == shareY,
        "Equivalent value of tokens not provided..."
    );
    newshare = shareX;
}
```

If `totalShare == 0`, meaning the pool is empty, we start with 100 as the base share.

Otherwise, we calculate the share value of each token and check they are equal based on this formula:

![](/images/AVAX-AMM/section-1/1_3_4.png)

After calculating the shares, we proceed with:

```solidity
tokenX.transferFrom(msg.sender, address(this), amountX);
tokenY.transferFrom(msg.sender, address(this), amountY);
```

This transfers tokens from the user to the contract.

The `transferFrom` function of `IERC20` takes:

* arg1: sender’s address (`msg.sender`)
* arg2: recipient address (`address(this)`)
* arg3: amount to transfer

We’ll explain `transferFrom` more later.

```solidity
totalAmount[tokenX] += amountX;
totalAmount[tokenY] += amountY;
```

Update the total pool amounts.

```solidity
totalShare += newshare;
share[msg.sender] += newshare;
```

Update the overall share and the user’s share.

### 🏦 `transferFrom` and `approve`

Earlier we used `transferFrom`. This is typically paired with `approve`.

The `approve` function allows a contract or account to spend your tokens.

Used like this:

```
ERC20TokenContract.approve(address of the account or contract executing the transfer, amount of tokens to be transferred);
```

For example, suppose Account A owns TokenX and wants to allow Account B to transfer 30 of TokenX from A’s balance.
In that case, A would call TokenX’s `approve` function like this:

```
TokenX.approve(address B, 30);
```

Then, B can call TokenX’s `transferFrom` to move 30 of A’s TokenX to themselves:

```
TokenX.transferFrom(address A, address B, 30);
```

Without `approve`, `transferFrom` would allow B to steal from A—so this safeguard is essential.

In our `AMM` contract’s `provide` function, `transferFrom` is used, assuming the user has already called `approve`.
If not, `transferFrom` will fail.

📓 Why use `approve`/`transferFrom`?

The discussion above might make it seem like the same logic could work by sending tokens directly to the `AMM contract` using `transfer`, and then calling `provide`.
But let’s consider why we use `approve`/`transferFrom` instead.

If tokens were sent directly to the `AMM contract` using `transfer`, and then `provide` was called, the flow would look like this:

1. A calls the token contract’s `transfer` function to send tokens to the AMM
2. A then calls the AMM contract’s `provide` function to provide liquidity
   * The AMM checks the pool’s state and calculates shares
   * It updates internal state variables like shares

If steps 1 and 2 are executed independently in order, several issues can arise:

* The pool state might change between steps 1 and 2
* If the transaction in step 2 fails for some reason, a refund for step 1 would be necessary
* From the AMM’s perspective, it cannot know whether step 1 was meant as a liquidity provision by A

In short, steps 1 and 2 must be executed atomically（at the same time）.

That’s where approve and transferFrom come into play.

Let’s outline the actual process:

1. A calls the token contract’s `approve` function to authorize the AMM contract to transfer tokens
2. A then calls the AMM contract’s `provide` function to provide liquidity
   * The AMM checks the pool’s state and calculates shares
   * The AMM transfers tokens from the liquidity provider to itself
   * It updates internal state variables such as shares

We’ll use the same approach later when implementing `swap`,
because we also want to handle both the token transfer and internal processing（like rate calculation）in a single transaction—so we use `approve`/`transferFrom`.

### 🧪 Add Tests

Now let’s test the new functionality.
In `test/AMM.ts`, replace the existing `init` test with this `provide` test:

* Red squiggly lines may appear but will go away after running tests.

```ts
describe("provide", function () {
  it("Token should be moved", async function () {
    const { amm, token0, token1, owner } = await loadFixture(deployContract);

    const ownerBalance0Before = await token0.balanceOf(owner.address);
    const ownerBalance1Before = await token1.balanceOf(owner.address);

    const ammBalance0Before = await token0.balanceOf(amm.address);
    const ammBalance1Before = await token1.balanceOf(amm.address);

    const amountProvide0 = ethers.utils.parseEther("100");
    const amountProvide1 = ethers.utils.parseEther("200");

    await token0.approve(amm.address, amountProvide0);
    await token1.approve(amm.address, amountProvide1);
    await amm.provide(
      token0.address,
      amountProvide0,
      token1.address,
      amountProvide1
    );

    expect(await token0.balanceOf(owner.address)).to.eql(
      ownerBalance0Before.sub(amountProvide0)
    );
    expect(await token1.balanceOf(owner.address)).to.eql(
      ownerBalance1Before.sub(amountProvide1)
    );

    expect(await token0.balanceOf(amm.address)).to.eql(
      ammBalance0Before.add(amountProvide0)
    );
    expect(await token1.balanceOf(amm.address)).to.eql(
      ammBalance1Before.add(amountProvide1)
    );
  });
});
```

This verifies tokens are properly transferred when calling `provide`.

At the beginning of the test, the balances of the owner and the AMM before executing `provide`, as well as the token amounts to be deposited via `provide`, are stored in variables.

Next, in the section below, `approve` is called before executing `provide`.

```ts
await token0.approve(amm.address, amountProvide0);
await token1.approve(amm.address, amountProvide1);
await amm.provide(
  token0.address,
  amountProvide0,
  token1.address,
  amountProvide1
);
```

Finally, the balances after executing `provide` are verified.

For example, the following part checks that the owner's `token0` balance has decreased by the amount of `token0` provided (`amountProvide0`) from the balance before executing `provide` (`ownerBalance0Before`):

```ts
expect(await token0.balanceOf(owner.address)).to.eql(
  ownerBalance0Before.sub(amountProvide0)
);
```

Next, add the following code after the `provide` test.

```ts
async function deployContractWithLiquidity() {
  const { amm, token0, token1, owner, otherAccount } = await loadFixture(
    deployContract
  );

  const amountOwnerProvided0 = ethers.utils.parseEther("100");
  const amountOwnerProvided1 = ethers.utils.parseEther("200");

  await token0.approve(amm.address, amountOwnerProvided0);
  await token1.approve(amm.address, amountOwnerProvided1);
  await amm.provide(
    token0.address,
    amountOwnerProvided0,
    token1.address,
    amountOwnerProvided1
  );

  const amountOtherProvided0 = ethers.utils.parseEther("10");
  const amountOtherProvided1 = ethers.utils.parseEther("20");

  await token0.connect(otherAccount).approve(amm.address, amountOtherProvided0);
  await token1.connect(otherAccount).approve(amm.address, amountOtherProvided1);
  await amm
    .connect(otherAccount)
    .provide(
      token0.address,
      amountOtherProvided0,
      token1.address,
      amountOtherProvided1
    );

  return {
    amm,
    token0,
    amountOwnerProvided0,
    amountOtherProvided0,
    token1,
    amountOwnerProvided1,
    amountOtherProvided1,
    owner,
    otherAccount,
  };
}

// deployContractWithLiquidity Check the initial values afterward.
describe("Deploy with liquidity", function () {
  it("Should set the right number of amm details", async function () {
    const {
      amm,
      token0,
      amountOwnerProvided0,
      amountOtherProvided0,
      token1,
      amountOwnerProvided1,
      amountOtherProvided1,
      owner,
      otherAccount,
    } = await loadFixture(deployContractWithLiquidity);

    const precision = await amm.PRECISION();
    const BN100 = BigNumber.from("100"); // owner's share: since they are the first liquidity provider, it's 100
    const BN10 = BigNumber.from("10"); // otherAccount's share: since they provided one-tenth of the owner's amount, it's 10

    expect(await amm.totalShare()).to.equal(BN100.add(BN10).mul(precision));
    expect(await amm.share(owner.address)).to.equal(BN100.mul(precision));
    expect(await amm.share(otherAccount.address)).to.equal(BN10.mul(precision));
    expect(await amm.totalAmount(token0.address)).to.equal(
      amountOwnerProvided0.add(amountOtherProvided0)
    );
    expect(await amm.totalAmount(token1.address)).to.equal(
      amountOwnerProvided1.add(amountOtherProvided1)
    );
  });
});
```

To reuse an AMM with tokens already in the pool within the test,
we use `deployContractWithLiquidity` as a function that goes from deploying each contract to setting up the AMM pool with tokens.
The mechanism is the same as the `provide` we executed earlier, but in addition to the owner, `otherAccount` also provides liquidity.
The amount of tokens provided by each account is included in the function’s return value.

In the `Deploy with liquidity` test that follows,
we verify the initial values of the state variables inside the AMM contract after running `deployContractWithLiquidity`.

---

📓 About PRECISION

From the previous test:

```ts
expect(await amm.share(owner.address)).to.equal(BN100.mul(precision));
```

The share retrieved from the AMM for the owner is larger by the value of `PRECISION`,
so we compare the value of 100（the owner's share）multiplied by `precision`.

---

Finally, after the `Deploy with liquidity` test, add:

```ts
describe("getEquivalentToken", function () {
  it("Should get the right number of equivalent token", async function () {
    const { amm, token0, token1 } = await loadFixture(
      deployContractWithLiquidity
    );

    const totalToken0 = await amm.totalAmount(token0.address);
    const totalToken1 = await amm.totalAmount(token1.address);
    const amountProvide0 = ethers.utils.parseEther("10");
    // totalToken0 : totalToken1 = amountProvide0 : equivalentToken1
    const equivalentToken1 = amountProvide0.mul(totalToken1).div(totalToken0);

    expect(
      await amm.getEquivalentToken(token0.address, amountProvide0)
    ).to.equal(equivalentToken1);
  });
});
```

Here, we are testing whether the calculation of the `getEquivalentToken` function is correct.

We check if the amount of `token1` equivalent to 10 ether worth of `token0` (`amountProvide0`)—which is `equivalentToken1`—matches the return value of the function.

The formula itself follows the same logic as implemented in the `getEquivalentToken` function of the AMM contract.

### ⭐ Run the Test

Run in the terminal:

```
yarn test
```

If you see the following, the tests passed!

![](/images/AVAX-AMM/section-1/1_3_1.png)

### 🌔 Reference Link

> The completed version of this project is available [here](https://github.com/unchain-dev/avalanche-amm-dapp).
>
> If something doesn't work as expected, use it for reference.

### 🙋‍♂️ Ask Questions

If anything is unclear, ask in the `#avalanche` channel on Discord.

To help others assist you efficiently, include the following ✨

```
1. Section and lesson number your question relates to
2. What you were trying to do
3. Copy & paste the error message
4. A screenshot of the error
```

---

Once your tests pass, move on to the next lesson 🎉

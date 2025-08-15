### 🐣 Understand How Fees Work During Swap

In the previous lesson, we looked at how token amounts in the pool increase and decrease during a swap based on a specific calculation.

In this lesson, we’ll explore how to implement a fee mechanism for users performing swaps.

Key point:

The token amount a user sends to the pool during a swap is slightly discounted internally within the AMM before the swap calculation is performed.

In this example, we apply a 0.3％ fee（i.e., we calculate using 99.7％ of the provided amount）.

Let’s walk through a concrete example.

🦴 Scenario

Suppose the pool contains `10,000` tokens each of Token X and Token Y.

User A wants to perform a swap of `1,000` Token X to Token Y.

Using the formula derived in the previous lesson（Situation 1）:

![](/images/AVAX-AMM/section-2/2_2_1.png)

* y': the amount of Token Y received from the swap
* y: `10,000`
* x': `1,000`
* x: `10,000`

🐟 Without Considering Fees

![](/images/AVAX-AMM/section-2/2_2_2.png)

The pool receives 1,000 Token X.
Token Y decreases by 909.

The new token amounts in the pool become `11,000` for X and `9,091` for Y.

🐿️ With Fee Consideration

The user specifies 1,000 Token X for the swap,
but internally the AMM calculates with 997 after subtracting 0.3％（3 tokens）.

![](/images/AVAX-AMM/section-2/2_2_3.png)

The pool still receives 1,000 Token X.
Token Y decreases by 906.

The new pool balances become `11,000` Token X and `9,094` Token Y.

Compared to the no-fee case:

* The user receives less Token Y
* The pool retains more Token Y

If swapping from Y to X, the reverse occurs.

With repeated swaps and fee deductions:

* The pool accumulates extra tokens in addition to what was provided by liquidity providers
* When a provider later withdraws their share, they receive more tokens than they originally deposited

This is how liquidity providers earn fees via the swap process.

### 🐔 Derive the Formula Considering Swap Fees

Now that we understand the fee mechanism, let’s update the formulas from the previous lesson to include fee calculation.

🦕 Situation 1: Deriving y' from x'

Original formula:

![](/images/AVAX-AMM/section-2/2_2_1.png)

To account for a 0.3％ fee, we use 0.997x' instead of x'.

Since Solidity cannot handle decimals, we scale everything by 1,000（3 digits up）:

![](/images/AVAX-AMM/section-2/2_2_4.png)

Dividing both sides by 1,000 gives us:

![](/images/AVAX-AMM/section-2/2_2_5.png)

🐬 Situation 2: Deriving x' from y'

Original formula:

![](/images/AVAX-AMM/section-2/2_2_6.png)

Again, reduce x' by 0.3％ and scale by 1,000:

![](/images/AVAX-AMM/section-2/2_2_7.png)

Dividing numerator and denominator by 1,000:

![](/images/AVAX-AMM/section-2/2_2_8.png)

Then divide both sides by 997:

![](/images/AVAX-AMM/section-2/2_2_9.png)

Now we have the correct formula to calculate x'.

These fee-aware formulas will now be implemented inside the AMM contract.

### 🙋‍♂️ Ask Questions

If you have any questions about this section, please ask in the `#avalanche` channel on Discord.

To make it easier to get help, include the following in your error report:

```
1. Section and lesson number relevant to the question
2. What you were trying to do
3. The full error message
4. A screenshot of the error
```

Now that we understand swap fees, let’s move on to the next lesson where we implement the swap function in the contract! 🎉

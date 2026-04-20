---
title: Store Data in Your Smart Contract
---
### 📦 Let's Store Data

In this lesson, you'll learn how to store the number of "👋 (waves)" that users have sent you as data.

Blockchain is like a server that can store data on the cloud like AWS.

However, no one owns that data.

Around the world, there are people called "miners" who do the work of storing data on the blockchain. We pay for this work.

That payment is commonly called **gas fees**.

When writing data to the Ethereum blockchain, we pay `$ETH` to "miners" as payment.

Now, let's update `WavePortal.sol` to save "👋 (waves)".

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "hardhat/console.sol";

contract WavePortal {

    uint256 private _totalWaves;

    constructor() {
        console.log("Here is my first smart contract!");
    }

    function wave() public {
        _totalWaves += 1;
        console.log("%s has waved!", msg.sender);
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", _totalWaves);
        return _totalWaves;
    }
}
```

Let's deepen our understanding of the newly added code.

```solidity
uint256 private _totalWaves;
```

A `_totalWaves` variable has been added that is automatically initialized to `0`. This variable is called a "state variable" and is permanently stored in the storage of the `WavePortal` contract.

- [uint256](https://www.iuec.co.jp/blockchain/uint256.html) means "unsigned integer data type" that can handle very large numbers.

### 🎁 About Solidity Access Modifiers

```solidity
function wave() public {
    _totalWaves += 1;
    console.log("%s has waved!", msg.sender);
}
```

Here, a `wave()` function has been added to record the number of "👋 (waves)". First, let's look at `public`.

This is one of Solidity's access modifiers.

In Solidity and various other languages, you need to specify access permissions for each function. Access modifiers do that specification.

Solidity has four access modifiers:

- **`public`**: Functions and variables defined with `public` can be called from the contract where they are defined, from other contracts that inherit that contract, and from outside those contracts - **basically from anywhere**. In Solidity, **functions** without an access modifier are automatically treated as `public`.

- **`private`**: Functions and variables defined with `private` can **only** be called **from the contract where they are defined**.

- **`internal`**: Functions and variables defined with `internal` can be called from **both** **the contract where they are defined** and **other contracts that inherit that contract**. In Solidity, **variables** without an access modifier are automatically treated as `internal`.

- **`external`**: Functions and variables defined with `external` can **only** be called **from outside**.

The following summarizes Solidity's access modifiers and access permissions:

![](/images/ETH-dApp/section-1/1_4_1.png)

Since Solidity access modifiers will appear frequently from now on, it's okay if you can understand them roughly for now.

### 🔍 About `msg.sender`

```solidity
function wave() public {
    _totalWaves += 1;
    console.log("%s has waved!", msg.sender);
}
```

Did you notice that `msg.sender` appears in the `wave()` function?

The value that goes into `msg.sender` is, simply put, **the wallet address of the person who called the function (= the person who sent you a "👋 (wave)")**.

This is like **user authentication**.

- To call a function included in a smart contract, users need to connect a valid wallet.
- `msg.sender` accurately identifies who called the function and performs user authentication.

### 🖋 About Solidity Function Modifiers

Solidity has modifiers (= function modifiers) that are used only for functions.

In Solidity development, if you're not conscious of function modifiers, the cost (= gas fees) of recording data can skyrocket, so you need to be careful.

The key point here is that **you need to pay gas fees to write values to the blockchain, but you don't need to pay gas fees if you're only referencing values from the blockchain.**

Here, I'll introduce two main function modifiers:

- **`view`**: A `view` function is a read-only function that ensures state variables defined in the function are not changed after the function is called.
- **`pure`**: A `pure` function doesn't read or modify state variables defined in the function, but returns values using only parameters passed to the function or local variables that exist in the function.

The following summarizes Solidity's function modifiers `pure` and `view`:

![](/images/ETH-dApp/section-1/1_4_2.png)

What you should understand so far is that using `pure` or `view` functions can **reduce gas fees**.

At the same time, by not writing data to the blockchain, **processing speed also improves**.

Let's look at the following function added to `WavePortal.sol`:

```solidity
function wave() public {
    _totalWaves += 1;
    console.log("%s has waved!", msg.sender);
}
```

Did you notice that the `wave()` function has no function modifier?

- The number of "👋 (waves)" sent by the same user is counted by `_totalWaves += 1` and data is written to the blockchain.
- Also, when this function is called, `console.log("%s has waved!", msg.sender)` displays the address of the user who sent you a "👋 (wave)" in the terminal.

Now, let's also look at the following code:

```solidity
function getTotalWaves() public view returns (uint256) {
    console.log("We have %d total waves!", _totalWaves);
    return _totalWaves;
}
```

On the other hand, the `getTotalWaves()` function with the `view` function modifier only references the total number of "👋 (waves)" users have sent you.

### ✅ Update `run.js` to Call Functions

Next, let's update `run.js` as follows:

```js
const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  const wavePortal = await waveContract.deployed();

  console.log("Contract deployed to:", wavePortal.address);
  console.log("Contract deployed by:", owner.address);

  let waveCount;
  waveCount = await waveContract.getTotalWaves();

  let waveTxn = await waveContract.wave();
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();
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

The `wave()` and `getTotalWaves()` functions specified as `public` in `WavePortal.sol` can now be called on the blockchain.

Let's call those functions from `run.js`.

- As a review, `run.js` is test code for debugging.
- `run.js` is created to test whether the code runs without problems, assuming a situation where users call your smart contract in the production environment.

Functions defined as `public` are like API endpoints.

Let's look at the updated parts line by line.

```js
const [owner, randomPerson] = await hre.ethers.getSigners();
```

When deploying the `WavePortal` contract to the blockchain, we need the wallet address of the side sending "👋 (waves)".

`hre.ethers.getSigners()` is a function provided by Hardhat that returns arbitrary addresses.

- Here, Hardhat generates a wallet address for the contract owner (= you) and a wallet address for a user who will send you a "👋 (wave)", storing them in variables called `owner` and `randomPerson` respectively.

- Think of `randomPerson` as a user who will send "👋 (waves)" in the test environment.

Next, let's look at the following code:

```js
console.log("Contract deployed to:", wavePortal.address);
```

Here, we're outputting the address where your smart contract was deployed (= `wavePortal.address`) to the terminal.

```js
console.log("Contract deployed by:", owner.address);
```

Here, we're outputting the address (= `owner.address`) of the person who deployed the `WavePortal` contract (= you) to the terminal.

Finally, let's look at the following code:

```js
let waveCount;
waveCount = await waveContract.getTotalWaves();

let waveTxn = await waveContract.wave();
await waveTxn.wait();

waveCount = await waveContract.getTotalWaves();
```

Here, we're manually calling functions just like a normal API. Let's look at it line by line.

```js
let waveCount;
waveCount = await waveContract.getTotalWaves();
```

First, we declare a local variable with `let waveCount`.

Next, we call `getTotalWaves()` written in `WavePortal.sol` with `waveContract.getTotalWaves()` to get the existing total number of "👋 (waves)".

```js
let waveTxn = await waveContract.wave();
await waveTxn.wait();
```

With `let waveTxn = await waveContract.wave()`, we're setting the frontend to wait for a response from the contract until the user approves that a new "👋 (wave)" has been sent.

Since the `.wave()` function involves writing to the blockchain, gas fees are incurred. Therefore, users need to confirm the transaction.

Have you ever used MetaMask and spent a few seconds approving a transaction?

While you're approving, the code doesn't proceed to the next process and waits.

After approval is finished, `await waveTxn.wait()` is executed and gets the result of the transaction. The code may feel redundant, but it's an important process.

```js
waveCount = await waveContract.getTotalWaves();
```

Finally here, we get `waveCount` one more time to check if it's been `+1`.

### 🧙‍♀️ Let's Run the Test

Make sure you're in the root directory and run the following in your terminal:

```
yarn contract run:script
```

Example terminal output:

```
Compiled 1 Solidity file successfully
Here is my first smart contract!
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Contract deployed by: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
We have 0 total waves!
0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 has waved!
We have 1 total waves!
```

Did you get similar results in your terminal?

This result shows that you are the `owner` of this smart contract and that you also sent yourself a "👋 (wave)".

Therefore, the address following `Contract deployed by` and the address in "`0x...` has waved!" should match.

The content implemented so far forms the basis of most smart contracts:

1. Read a function.
2. Write a function.
3. Change state variables.

These are important elements for building the WavePortal website.

### 🤝 Have Other Users Send 👋 (waves)

Here, we'll simulate the case where other users send you "👋 (waves)".

Reflect the following in `run.js` and test what results appear in the terminal:

```js
const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  const wavePortal = await waveContract.deployed();

  console.log("Contract deployed to:", wavePortal.address);
  console.log("Contract deployed by:", owner.address);

  let waveCount;
  waveCount = await waveContract.getTotalWaves();

  let waveTxn = await waveContract.wave();
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();

  waveTxn = await waveContract.connect(randomPerson).wave();
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();
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

The code added to `run.js` is as follows. Let's check it:

```js
waveTxn = await waveContract.connect(randomPerson).wave();
await waveTxn.wait();
waveCount = await waveContract.getTotalWaves();
```

Do you remember getting the `randomPerson` address in `run.js` at the beginning of this lesson?

- `randomPerson` stores a random address obtained by Hardhat.
- `randomPerson` existed for this simulation.

```js
waveTxn = await waveContract.connect(randomPerson).wave();
```

Here, we're using `.connect(randomPerson)` to simulate another user sending you a "👋 (wave)".

```js
await waveTxn.wait();
waveCount = await waveContract.getTotalWaves();
```

Here, just like you sent yourself a "👋 (wave)" and updated the value of `waveCount` after getting approval, we're checking `randomPerson`'s behavior before updating `waveCount` (`+1`).

Now, let's update `run.js` and run the following:

```
yarn contract run:script
```

If results like the following are output to the terminal, it's successful.

Example terminal output:

```
Here is my first smart contract!
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Contract deployed by: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
We have 0 total waves!
0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 has waved!
We have 1 total waves!
0x70997970c51812dc3a010c7d01b50e0d17dc79c8 has waved!
We have 2 total waves!
```

Check that `#` in `We have # total waves!` is being updated.

Since the first "👋 (wave)" is from yourself, confirm that the address displayed before `We have 1 total waves!` matches the address following `Contract deployed by`.

The address following `We have 2 total waves!` is the address of `randomPerson` obtained by Hardhat.

You can also add another person and run a simulation by adding `randomPerson` to `run.js` as follows:

```js
const [owner, randomPerson1, randomPerson2] = await hre.ethers.getSigners();
```

### 🙋‍♂️ Asking Questions

If you have any questions about the work so far, please ask in Discord's `#ethereum` channel.

To help the process of providing assistance flow smoothly, please include the following 3 points in your error report ✨

```
1. Section number and lesson number related to the question
2. What you were trying to do
3. Copy & paste the error message
4. Screenshot of the error screen
```

---

In the next lesson, we'll deploy your smart contract to a test environment. Let's move on 🎉

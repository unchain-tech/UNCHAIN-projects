---
title: Compile and Run the Contract in Your Local Environment
---
### 🔥 Run the Smart Contract in Your Local Environment

In the previous lesson, we created a smart contract called `WavePortal.sol`.

In this lesson, we will:

1. Compile `WavePortal.sol`.
2. Deploy `WavePortal.sol` on the blockchain in your local environment.
3. Once the above is complete, verify that the contents of `console.log` are displayed in the terminal.

The ultimate goal of this project is to get your smart contract on the blockchain so that people around the world can access it through your web application.

First, let's do the above work in your local environment.

### 📝 Create a Program to Run the Contract

Navigate to the `scripts` directory and create a file named `run.js`.

**`run.js` is a program for testing smart contracts in your local environment.**

Write the following in `run.js`:

```js
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  const wavePortal = await waveContract.deployed();

  console.log("WavePortal address: ", wavePortal.address);
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

Let's deepen our understanding of the code line by line.

```js
const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
```

This compiles the `WavePortal` contract.

Once the contract is compiled, the files needed to handle the contract are generated directly under the `artifacts` directory.

> ✍️: About `hre.ethers.getContractFactory`
> The `getContractFactory` function links the address of the library that supports deployment with the `WavePortal` contract.
>
> `hre.ethers` is a specification of the Hardhat plugin.

> ✍️: About `const main = async ()` and `await`
> When writing code in Javascript, you may run into problems where code doesn't execute in order from top to bottom. This is called an asynchronous processing problem.
>
> One solution is to use `async` / `await` as we do here.
>
> With this, no other processing in the `main` function will occur until the processing prefixed with `await` is finished.
>
> This means that other processing written in the `main` function will not be executed until `hre.ethers.getContractFactory('WavePortal')` is finished.

Next, let's look at the following process:

```js
const waveContract = await waveContractFactory.deploy();
```

Hardhat creates a local Ethereum network just for the contract.

Then, after the script finishes running, it destroys that local network.

In other words, every time you run the contract, the blockchain becomes new, as if you were refreshing a local server each time.

- Since it's always a zero reset, it makes debugging errors easier.

Next, let's look at the following process:

```js
const wavePortal = await waveContract.deployed();
```

Here, we're processing to wait until the `WavePortal` contract is deployed to the local blockchain.

Hardhat actually creates a "miner" on your machine and builds the blockchain.

The `constructor` is executed for the first time when the contract is deployed.

Finally, let's look at the following process:

```js
console.log("WavePortal address:", wavePortal.address);
```

Finally, once deployed, `wavePortal.address` outputs the address of the deployed contract.

From this address, we can find the contract on the blockchain, but since we're implementing it on a local Ethereum network (= blockchain) this time, not everyone in the world can access it.

On the other hand, if we had deployed to the blockchain on the Ethereum mainnet, anyone in the world could access the contract.

There are already millions of smart contracts deployed on the actual blockchain.

As long as we know the address, we can easily access contracts we're interested in from anywhere in the world.

### 🪄 Let's Run It

Edit the `script` section of `packages/contract/package.json` as follows:

```json
  "scripts": {
    "run:script": "npx hardhat run scripts/run.js",
    "test": "npx hardhat test",
    "deploy": "npx hardhat run scripts/deploy.js --network sepolia"
  },
```

After that, make sure you're in the root directory and run the following in your terminal:

```
yarn contract run:script
```

Verify that the contents of `console.log` and the contract address are displayed in the terminal.

Example output in terminal:

```
Compiled 2 Solidity files successfully
Here is my first smart contract!
WavePortal address:  0x5FbDB2315678afecb367f032d93F642f64180aa3
```

If output like the above is displayed in the terminal, the test is successful.

### 🎩 About Hardhat Runtime Environment

In `run.js`, `hre.ethers` appears.

However, `hre` is not imported anywhere. Why is that?

The answer is that Hardhat is calling the Hardhat Runtime Environment (HRE).

HRE is an object (= bundle of code) that contains all the functionality prepared by Hardhat.

Every time you run a terminal command starting with `hardhat`, you're accessing the HRE, so there's no need to import `hre` into `run.js`.

For more details, see the [Hardhat official documentation](https://hardhat.org/advanced/hardhat-runtime-environment.html).

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

Once you can output the contents of `console.log` and the contract address in the terminal, proceed to the next lesson 🎉


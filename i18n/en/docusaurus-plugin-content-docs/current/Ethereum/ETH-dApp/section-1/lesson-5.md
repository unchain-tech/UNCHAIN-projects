---
title: Deploy the Contract to Your Local Environment
---
### 🐣 Deploy the Smart Contract in Your Local Environment

Actually, every time we ran tests with `run.js`, the following was happening:

1. Create a new Ethereum network in the local environment.

2. Deploy the contract in the local environment.

3. When the program ends, Hardhat automatically deletes that Ethereum network.

In this lesson, you'll learn how to **keep** the Ethereum network alive in your local environment instead of deleting it.

Create a **new** window in your terminal.

Edit the `script` section of `packages/contract/package.json` as follows:

```json
  "scripts": {
    "run:script": "npx hardhat run scripts/run.js",
    "test": "npx hardhat test",
    "deploy": "npx hardhat run scripts/deploy.js --network sepolia",
    "start": "npx hardhat node"
  },
```

Now let's run the command below:

```
yarn contract start
```

This will start up an Ethereum network on your local network.

Look at the output in your terminal and confirm that Hardhat has provided you with 20 accounts (`Account`) and that all of them have been given `10000 ETH`.

We'll deploy the smart contract on this local network.

Update `deploy.js` in the `scripts` directory as follows:

- `deploy.js` will serve to connect your frontend that you'll build in the future with your smart contract (`WavePortal.sol`).

- If `run.js` is a program for testing, `deploy.js` is for production.

```js
const main = async () => {
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  const wavePortal = await waveContract.deployed();

  console.log("Deploying contracts with account: ", deployer.address);
  console.log("Account balance: ", accountBalance.toString());
  console.log("Contract deployed to: ", wavePortal.address);
  console.log("Contract deployed by: ", deployer.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
```

The content of the code is almost the same as `run.js`.

- `Account balance` is a string representing the balance (**wei**) allocated to your account.

### 🎉 Let's Deploy

Edit the `script` section of `packages/contract/package.json` as follows:

```json
  "scripts": {
    "run:script": "npx hardhat run scripts/run.js",
    "test": "npx hardhat test",
    "deploy": "npx hardhat run scripts/deploy.js --network sepolia",
    "deploy:localhost": "npx hardhat run scripts/deploy.js --network localhost",
    "start": "npx hardhat node"
  },
```

**Open a new terminal window** and run the following command. This will deploy your smart contract to the local network:

```
yarn contract deploy:localhost
```

Did you see output like the following in your terminal?

```
Deploying contracts with account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Account balance:  10000000000000000000000
Contract deployed to:  0x5FbDB2315678afecb367f032d93F642f64180aa3
Contract deployed by:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

If results like the above are displayed in your terminal, the deployment is successful 🎉

Let's look at the output results in detail:

```
Deploying contracts with account:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

Here, the address of the person who deployed the smart contract (= you in this case) is displayed.

```
Account balance:  10000000000000000000000
```

The Account balance shows the default value of `10^22 wei` (= `10000 ETH`).

- `Wei` is the smallest denomination of Ethereum.
- `1ETH = 1,000,000,000,000,000,000 wei (10^18)`.

```
Contract deployed to:  0x5FbDB2315678afecb367f032d93F642f64180aa3
```

Here, **the address where your smart contract was deployed** is displayed.

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

Congratulations! You've completed Section 1!
Post the output displayed in your terminal to `#ethereum` and celebrate your success with the community 🎉
Let's move on to the next section!


---
title: Deploy the Contract to the Testnet
---
### 🖥 Building the Production Environment

Let's terminate the local Ethereum network.

- Just close the terminal and you're done.

From now on, we'll build an environment for deploying contracts to an actual blockchain.

### 🦊 Download MetaMask

Next, let's download an Ethereum wallet.

We'll use MetaMask for this project.

- Download the browser extension from [here](https://MetaMask.io/download.html) and set up the MetaMask wallet in your browser.

Even if you already have another wallet, please use MetaMask for this project.

> ✍️: Why MetaMask is necessary
> When users call a smart contract, they need a wallet with their own Ethereum address and private key.
> This is like an authentication process.

### 💳 Transactions

**Writing new information to the blockchain on the Ethereum network** is called a **transaction**.

The **transactions** that have appeared in the lessons so far are:

- Write information to the blockchain that **a new smart contract has been deployed**.
- Write **the number of "👋 (waves)" sent on the website** to the blockchain.

Since transactions require miner approval, we'll introduce Alchemy.

Alchemy is a platform that centralizes transactions from around the world and facilitates miner approval.

Create an Alchemy account from [here](https://www.alchemy.com/).

### 💎 Create a Network on Alchemy

Once you've created your Alchemy account, click the `+ Create new app` button on the Apps page.

![](/images/ETH-dApp/section-2/2_1_1.png)

Next, fill in the following items. Refer to the figure below:

![](/images/ETH-dApp/section-2/2_1_2.png)

- `Chain`: Select `Ethereum`
- `Network`: Select `Ethereum Sepolia`
- `Name`: Project name (e.g., `ETH dApp`)
- `Description`: Project overview (optional)

When you click the `Create app` button, the project will be created. Click `API Key` to get the Key from the displayed popup (what we'll use for this project is what's shown in `HTTPS`).

![](/images/ETH-dApp/section-2/2_1_3.png)

This is the `API Key` you'll use when connecting to the production network.

- **Save the `API Key` somewhere easy to find on your PC, as you'll need it later.**

### 🐣 Starting with the Testnet

For this project, we'll **deploy the contract to the testnet** instead of the Ethereum mainnet, which would incur costs (= real ETH).

The testnet mimics the Ethereum mainnet.

- It's ideal for testing events that occur when you deploy a contract to the Ethereum mainnet.
- Since the testnet uses fake ETH, you can test transactions as much as you want.

This time, we'll be testing the following events:

1. Notify miners around the world of a transaction occurrence
2. A certain miner discovers the transaction
3. That miner approves the transaction
4. That miner notifies other miners that the transaction has been approved and updates copies of the transaction

In this section, we'll deepen our understanding of these events while writing code.

### 🚰 Get Testnet ETH

This time, we'll use a testnet called `Sepolia` operated by the Ethereum Foundation.

Let's get fake ETH to deploy the contract to `Sepolia` and test the code. The infrastructure provided for users to get fake ETH is called a "faucet".

Before using the faucet, set your MetaMask wallet to the `Sepolia Test Network`.

> ✍️: How to set up `Sepolia Test Network` in MetaMask
>
> 1\. Open your MetaMask wallet's network toggle.
>
> ![](/images/ETH-dApp/section-2/2_1_4.png)
>
> 2\. Turn `Show test networks` to `ON` and select the displayed `Sepolia`.
>
> ![](/images/ETH-dApp/section-2/2_1_5.png)
>
> 3\. Confirm that the network has switched to `Sepolia`.
>
> ![](/images/ETH-dApp/section-2/2_1_6.png)

Once the `Sepolia Test Network` is set up in your MetaMask wallet, select one from the links below that meets the conditions and get a small amount of fake ETH:

- [Alchemy](https://sepoliafaucet.com/) - 1 Sepolia ETH (can be obtained once every 24 hours)
  - Enter your wallet address and press the `Send Me ETH` button to receive it immediately.

### 📈 Edit the `hardhat.config.js` File

We need to modify the `hardhat.config.js` file.

This is in the root directory of the smart contract project.

- For this project, `hardhat.config.js` should exist directly under the `packages/contract` directory.

Example: Result of moving to `packages/contract` in terminal and executing `ls`

```
$ ls
README.md         artifacts         cache             contracts         hardhat.config.js package.json      scripts           test
```

Open `hardhat.config.js` in VS Code and edit its contents:

```js
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: "YOUR_ALCHEMY_API_URL",
      accounts: ["YOUR_PRIVATE_SEPOLIA_ACCOUNT_KEY"],
    },
  },
};
```

1\. Getting `YOUR_ALCHEMY_API_URL`

> Replace the `YOUR_ALCHEMY_API_URL` part of `hardhat.config.js` with the Alchemy URL (`HTTP` link) you obtained earlier.

2\. Getting `YOUR_PRIVATE_SEPOLIA_ACCOUNT_KEY`

> We'll obtain it by referring to the [documentation](https://support.metamask.io/hc/en-us/articles/360015289632).
>
> 1. From your browser, click the MetaMask plugin and click the account selection at the top of the screen.
>
> ![](/images/ETH-dApp/section-2/2_1_7.png)
>
> 2. Click the menu next to the account you want to export the private key for and open `Account details`.
>
> ![](/images/ETH-dApp/section-2/2_1_8.png)
>
> 3. Click `Show Private Key`.
>
> ![](/images/ETH-dApp/section-2/2_1_9.png)
>
> 4. You'll be asked for your MetaMask password, so enter it and press `Confirm`.
>
> ![](/images/ETH-dApp/section-2/2_1_10.png)
>
> 5. Press and hold `Hold to reveal Private Key` to display your private key (= `Private Key`), then click to copy it.
>
> ![](/images/ETH-dApp/section-2/2_1_11.png)

> - Replace the `YOUR_PRIVATE_SEPOLIA_ACCOUNT_KEY` part of `hardhat.config.js` with the private key obtained here.

### 🙊 Never Share Your Private Key with Anyone

Once you've updated `hardhat.config.js`, let's pause here.

**🚨: Do not commit the `hardhat.config.js` file to GitHub with your private key information included**.

> This private key is the same as your Ethereum mainnet private key.
>
> If your private key is leaked, anyone can access your wallet, which is very dangerous.
>
> **Never place your private key where anyone other than yourself can see it**.

Run the following to edit the `.gitignore` file in VS Code:

```
code .gitignore
```

Add a line for `hardhat.config.js` to `.gitignore`.

If the contents of `.gitignore` look like the following, there's no problem:

```
node_modules
.env
coverage
coverage.json
typechain
typechain-types

#Hardhat files
cache
artifacts
hardhat.config.js
```

Files and directories listed in `.gitignore` are not pushed to GitHub directories and are only stored in the local environment.

> **✍️: Why a private key is needed to deploy a smart contract**
> **Deploying a new smart contract to the Ethereum network** is also a transaction.
>
> To make a transaction, you need to "log in" to the blockchain.
>
> "Logging in" requires the following information:
>
> - Username: Public address
>   ![](/images/ETH-dApp/section-2/2_1_12.png)
> - Password: Private key
>   ![](/images/ETH-dApp/section-2/2_1_13.png)
>   It's the same as logging into AWS using a username and password to deploy a project.

⚠️: What to do if you've already pushed `hardhat.config.js` to GitHub

If you've already pushed code to GitHub, run the following in your terminal:

```
git rm --cached hardhat.config.js
```

This will delete the file from the remote repository while keeping the `hardhat.config.js` file in the local repository. After doing `git push` again, confirm that `hardhat.config.js` doesn't exist on GitHub.

### 🚀 Deploy the Contract to Sepolia Test Network

Once you've finished updating `hardhat.config.js`, let's try deploying the contract to the Sepolia Test Network.

Make sure you're in the root directory and run the following command in your terminal:

```
yarn contract deploy
```

If results like the following are output, it's successful 🎉

```
Deploying contracts with account:  0x1A7f14FBF50acf10bCC08466743fB90384Cbd720
Account balance:  174646846389073382
Contract deployed to:  0x04da168454AFA19Eb43D6A28b63964D8DCE8351e
Contract deployed by:  0x1A7f14FBF50acf10bCC08466743fB90384Cbd720
```

On your terminal, copy and save the contract address (`0x..`) output after `Contract deployed to`. You'll need it later when building the frontend.

### 👀 Check the Transaction on Etherscan

Paste the address following the copied `Contract deployed to` into [Etherscan](https://sepolia.etherscan.io/) to see the transaction history of your smart contract.

Etherscan is a convenient platform for checking information about transactions on the Ethereum network.

_It may take about 1 minute to display._

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

Once you've deployed your smart contract to the Sepolia Test Network, let's move on to the next lesson 🎉
